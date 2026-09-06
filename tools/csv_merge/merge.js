// tools/csv_merge/merge.js — merge the PokeAPI clone + PokeDB CSVs into VKDex/csv/,
// one CSV per table, identifiers (not numeric ids) as foreign keys.
//
//   node tools/csv_merge/merge.js            build csv/ then verify it
//   node tools/csv_merge/merge.js --verify   verify an existing csv/ only
//
// Rules (spec 2026-09-06, see csv/MANIFEST.md + the handoff for the long form):
//   * PokeAPI is the base for every table it has; PokeDB fills gaps (blank cell,
//     missing row, missing table) and every remaining disagreement is logged to
//     reports/merge/conflicts_<table>.csv with the value that was chosen.
//   * ~90 species-level cells are hand-adjudicated in SPECIES_OVERRIDES below
//     (written out as species_field_overrides.csv). An unlisted species
//     conflict is a hard error, so the list can never silently go stale.
//   * PokeAPI's pokemon/form identifier vocabulary is canon; PokeDB forms are
//     mapped through FORM_HAND + suffix folding (written out as form_aliases.csv).
//   * Generation-variant mechanics get their own files (type charts x3,
//     damage-class-by-type, friendship x2, base experience x2); per-Pokemon /
//     per-move history keeps the current+history shape.
//   * Non-mainline games (Colosseum/XD = "orre", Legends: Arceus, Legends: Z-A
//     incl. Mega Dimension, Champions) are split out of every version-keyed
//     table into <table>_<game>.csv. Japanese Red/Green/Blue are dropped.
"use strict";
const fs = require("fs"), path = require("path");
const { parseFile, stringify } = require("./csv_util");
const { REPORTS } = require("./inventory");
const { A, B, L, idMap, bool, machineKey, EGG, GROWTH, names: aNames, formKeys: _unused } = require("./compare");

const ROOT = path.resolve(__dirname, "..", "..");
const OUT = path.join(ROOT, "csv");
const MREP = path.join(REPORTS, "merge");
const VERIFY_ONLY = process.argv.includes("--verify");

// ---------------------------------------------------------------- utilities
const conflicts = {};            // table -> rows [key, column, pokeapi, pokedb, chosen]
const dropped = {};              // "table:reason" -> count
const written = [];              // {file, rows, columns, fks}
const FK = {};                   // file -> {col: "target.col" | "target.col;"} (";" = multi-valued)
let fffd = 0;

function logC(table, key, col, a, b, chosen) { (conflicts[table] ||= []).push([key, col, a, b, chosen]); }
function drop(table, why, n = 1) { dropped[`${table}:${why}`] = (dropped[`${table}:${why}`] || 0) + n; }
const num = s => /^-?\d+(\.\d+)?$/.test(s) ? Number(s) : null;
const same = (x, y) => { x = (x ?? "").trim(); y = (y ?? "").trim(); if (x === y) return true; const nx = num(x), ny = num(y); return nx !== null && ny !== null && nx === ny; };
function clean(v) {
  if (v == null) return "";
  let s = String(v);
  if (s.includes("�")) { fffd++; s = s.replace(/Pok�mon/g, "Pokémon"); }
  return s.replace(/\r\n?/g, "\n").replace(/[‎‏]/g, "").trim();
}
// PokeAPI wins; PokeDB fills a blank; disagreement logged
function pick(table, key, col, a, b, chosen) {
  a = clean(a); b = clean(b);
  if (chosen !== undefined) return chosen;
  if (a === "") return b;
  if (b !== "" && !same(a, b)) logC(table, key, col, a, b, a);
  return a;
}
// prose: line breaks / soft hyphens / spacing differ between the sources' dumps, text doesn't
const flat = s => clean(s).replace(/[­​]\n?/g, "").replace(/\f/g, " ").replace(/[’‘]/g, "'").replace(/[“”]/g, '"').replace(/-\n/g, "-").replace(/\s+/g, " ").trim().toLowerCase();
function pickText(table, key, col, a, b) {
  a = clean(a); b = clean(b);
  if (a === "") return b;
  if (b !== "" && flat(a) !== flat(b)) logC(table, key, col, a, b, a);
  return a;
}
const LANG_ORDER = ["en", "ja", "ja-hrkt", "ja-roma", "fr", "de", "es", "es-es", "es-419", "it", "ko", "ko-latn", "zh-hant", "zh-hans", "zh-cmn", "zh-yue", "zh-latn", "cs", "pt-br", "pt-pt"];
const langRank = c => { const i = LANG_ORDER.indexOf(c); return i < 0 ? 100 : i; };
const col = (base, lang) => base + "_" + lang.replace(/-/g, "_");

// rows: objects. fixed: leading columns in this order; every other key seen is appended,
// language-suffixed columns sorted by LANG_ORDER within their base name.
function out(file, rows, fixed, fks = {}) {
  const seen = new Map();
  for (const r of rows) for (const k of Object.keys(r)) if (!fixed.includes(k) && !seen.has(k)) seen.set(k, seen.size);
  const dyn = [...seen.keys()].sort((x, y) => {
    const bx = x.replace(/_[a-z0-9]+(_[a-z0-9]+)*$/, ""), by = y.replace(/_[a-z0-9]+(_[a-z0-9]+)*$/, "");
    const lx = langOf(x), ly = langOf(y);
    if (lx && ly && bx === by) return langRank(lx) - langRank(ly) || lx.localeCompare(ly);
    return seen.get(x) - seen.get(y);
  });
  const header = [...fixed, ...dyn];
  // drop columns with no data anywhere (blank-tolerant language union)
  const keep = header.filter(h => fixed.includes(h) || rows.some(r => clean(r[h]) !== ""));
  const outRows = rows.map(r => { const o = {}; for (const h of keep) o[h] = clean(r[h]); return o; });
  fs.writeFileSync(path.join(OUT, file), stringify(outRows, keep));
  written.push({ file, rows: outRows.length, columns: keep.length });
  FK[file] = fks;
}
const LANGCODES = new Set();
function langOf(column) { for (const c of LANGCODES) if (column.endsWith("_" + c.replace(/-/g, "_"))) return c; return null; }
// split rows by non-mainline game: base.csv for mainline, base_<game>.csv per game
const GAME = { colosseum: "orre", xd: "orre", "legends-arceus": "legends_arceus", "legends-za": "legends_za", "mega-dimension": "legends_za", champions: "champions" };
function splitOut(base, rows, vgCol, fixed, fks) {
  const by = { "": [] };
  for (const r of rows) { const g = GAME[r[vgCol]] || ""; (by[g] ||= []).push(r); }
  for (const [g, rs] of Object.entries(by)) if (rs.length || g === "") out(g ? `${base}_${g}.csv` : `${base}.csv`, rs, fixed, fks);
}

// ---------------------------------------------------------------- vocabularies
const LANGID = idMap(A("languages.csv"));                 // PokeAPI local_language_id -> code
const LANGDB = { english: "en", japanese: "ja", "japanese-romanized": "ja-roma", korean: "ko", "korean-romanized": "ko-latn", "chinese-traditional": "zh-hant", "chinese-simplified": "zh-hans", "chinese-romanized": "zh-latn", "chinese-mandarin": "zh-cmn", "chinese-mandarin-romanized": "zh-cmn-latn", "chinese-cantonese": "zh-yue", "chinese-cantonese-romanized": "zh-yue-latn", french: "fr", "french-france": "fr-fr", "french-canadian": "fr-ca", german: "de", spanish: "es", "spanish-spain": "es-es", "spanish-latin-america": "es-419", italian: "it", "portuguese-brazilian": "pt-br", "portuguese-portugal": "pt-pt", czech: "cs" };
for (const r of B("languages.csv")) if (!LANGDB[r.identifier]) LANGDB[r.identifier] = r.language_code.toLowerCase();
for (const c of Object.values(LANGDB)) LANGCODES.add(c);
for (const c of LANGID.values()) LANGCODES.add(c);

const VG = A("version_groups.csv"), VER = A("versions.csv");
const EXCL_VG = new Set(["red-green-japan", "blue-japan"]);          // Japanese-exclusive Gen 1 — out of scope
const vgId = new Map(VG.map(r => [r.id, r.identifier]));
const verId = new Map(VER.map(r => [r.id, r.identifier]));
const verVg = new Map(VER.map(r => [r.identifier, vgId.get(r.version_group_id)]));
const vgSet = new Set(VG.map(r => r.identifier));
const exclVer = new Set(VER.filter(r => EXCL_VG.has(vgId.get(r.version_group_id))).map(r => r.identifier));
const vgOk = vg => vg && !EXCL_VG.has(vg);
// PokeDB version identifier -> {version, version_group}; null = out of scope (spin-off / JP / Stadium)
function dbVer(v) {
  if (verVg.has(v)) return exclVer.has(v) ? null : { version: v, version_group: verVg.get(v) };
  if (vgSet.has(v)) return EXCL_VG.has(v) ? null : { version: "", version_group: v };
  return null;
}

const TYPE = L.aTypes, BTYPE = L.bTypes, ABIL = L.aAbil, BABIL = L.bAbil, MOVE = L.aMoves, BMOVE = L.bMoves, ITEM = L.aItems;
const GEN = idMap(A("generations.csv")), REGION = idMap(A("regions.csv")), POKEDEX = idMap(A("pokedexes.csv"));
const EGGG = idMap(A("egg_groups.csv")), GROWTHR = idMap(A("growth_rates.csv")), COLOR = idMap(A("pokemon_colors.csv")), SHAPE = idMap(A("pokemon_shapes.csv")), HABITAT = idMap(A("pokemon_habitats.csv"));
const STAT = idMap(A("stats.csv")), NATURE = idMap(A("natures.csv")), EMETH = idMap(A("encounter_methods.csv")), LOC = idMap(A("locations.csv"));
const ETRIG = idMap(A("evolution_triggers.csv")), CTYPE = idMap(A("contest_types.csv")), DMG = idMap(A("move_damage_classes.csv")), TARGET = idMap(A("move_targets.csv")), MMETH = idMap(A("pokemon_move_methods.csv"));
const ICAT = idMap(A("item_categories.csv")), IPOCKET = idMap(A("item_pockets.csv")), IFLING = idMap(A("item_fling_effects.csv")), IFLAG = idMap(A("item_flags.csv")), CURR = idMap(A("currencies.csv"));
const BFIRM = idMap(A("berry_firmness.csv")), PPAREA = idMap(A("pal_park_areas.csv")), PATH = idMap(A("pokeathlon_stats.csv")), MFLAG = idMap(A("move_flags.csv")), AILMENT = idMap(A("move_meta_ailments.csv")), MCAT = idMap(A("move_meta_categories.csv")), BSTYLE = idMap(A("move_battle_styles.csv")), GENDER = idMap(A("genders.csv"));
const ECOND = idMap(A("encounter_conditions.csv")), ECVAL = idMap(A("encounter_condition_values.csv")), FTRIG = idMap(A("pokemon_form_triggers.csv"));
const CURRENCY_DB = { pokedollars: "poke-dollar", coins: "coin", "battle-points": "battle-point", "league-points": "league-point", watts: "watt", "pokeathlon-points": "athlete-point" };
const dbCurrency = s => s ? CURRENCY_DB[s] || s : "";
// PokeAPI's item_game_indices file Gen 3 berries / Silk Scarf under Gen 2 and TM51-55 under Gen 1 (veekun index quirks); PokeDB's explicit column is right for exactly these
const ITEM_GEN_FIX = new Set(["cheri-berry", "chesto-berry", "pecha-berry", "rawst-berry", "aspear-berry", "leppa-berry", "oran-berry", "persim-berry", "lum-berry", "sitrus-berry", "silk-scarf", "tm51", "tm52", "tm53", "tm54", "tm55", "hm08"]);
const GROWTH_DB = Object.fromEntries(Object.entries(GROWTH).map(([a, b]) => [b, a]));   // "Erratic" -> slow-then-very-fast
const EGG_DB = Object.fromEntries(Object.entries(EGG).map(([a, b]) => [b, a]));          // "field" -> ground
const dbEgg = s => EGG_DB[s] || s;

// PokeAPI *_names / *_prose -> Map<id, {lang: {col: v}}>
function langMap(file, idCol, cols) {
  const m = new Map();
  for (const r of A(file)) { const l = LANGID.get(r.local_language_id ?? r.language_id); if (!m.has(r[idCol])) m.set(r[idCol], {}); m.get(r[idCol])[l] = Object.fromEntries(cols.map(c => [c, r[c]])); }
  return m;
}
function wide(m, id, cols, into = {}) { for (const [l, v] of Object.entries(m.get(id) || {})) for (const c of cols) into[col(c, l)] = v[c]; return into; }
const bName = (row, map, into) => { for (const [k, code] of Object.entries(map)) if (row[k] !== undefined) into[col("name", code)] = row[k]; return into; };
// PokeDB "拍擊 / 拍击" -> {zh-hant, zh-hans}
function splitZh(s, into) { if (!s) return into; const p = s.split(" / "); into[col("name", "zh-hant")] ??= p[0]; into[col("name", "zh-hans")] ??= p[p.length - 1]; return into; }

// ---------------------------------------------------------------- forms: PokeDB -> PokeAPI vocabulary
const SPECIES = A("pokemon_species.csv"), SP = new Map(SPECIES.map(r => [r.id, r]));
const PK = A("pokemon.csv"), PKID = new Map(PK.map(r => [r.id, r]));
const pkIdent = new Set(PK.map(r => r.identifier));
const defaultPk = new Map(PK.filter(r => r.is_default === "1").map(r => [r.species_id, r.identifier]));
const FORMS = A("pokemon_forms.csv");
const formPk = new Map(FORMS.map(r => [r.identifier, PKID.get(r.pokemon_id).identifier]));
const defaultForm = new Map(FORMS.filter(r => r.is_default === "1").map(r => [PKID.get(r.pokemon_id).identifier, r.identifier]));
const bSpecies = new Map(B("ndex_names.csv").map(r => [r.ndex_id, r.identifier]));
const SUFFIX = [[/-mega-evolution(-[xyz])?$/, "-mega$1"], [/-gigantamax$/, "-gmax"], [/-alolan$/, "-alola"], [/-galarian$/, "-galar"], [/-hisuian$/, "-hisui"], [/-paldean$/, "-paldea"]];
const fold = s => SUFFIX.reduce((x, [re, to]) => x.replace(re, to), s);
// PokeDB identifier -> "pokemon" | "pokemon/form" | "+" (PokeDB-only form, add as a new row)
const FORM_HAND = {
  "lycanroc-midnight": "lycanroc-midday", "lycanroc-midday": "lycanroc-midnight",   // PokeDB's two rows are swapped (names+stats prove it)
  "goodra-default": "goodra",
  "tauros-paldean-combat-breed": "tauros-paldea-combat-breed", "tauros-paldean-blaze-breed": "tauros-paldea-blaze-breed", "tauros-paldean-aqua-breed": "tauros-paldea-aqua-breed",
  "burmy-sandy-cloak": "burmy/burmy-sandy", "burmy-trash-cloak": "burmy/burmy-trash", "wormadam-sandy-cloak": "wormadam-sandy", "wormadam-trash-cloak": "wormadam-trash",
  "cherrim-sunshine": "cherrim/cherrim-sunshine", "shellos-east-sea": "shellos/shellos-east", "gastrodon-east-sea": "gastrodon/gastrodon-east",
  "basculin-blue-stripe": "basculin-blue-striped", "basculin-white-stripe": "basculin-white-striped",
  "darmanitan-galarian": "darmanitan-galar-standard", "darmanitan-galarian-zen": "darmanitan-galar-zen",
  "deerling-summer": "deerling/deerling-summer", "deerling-autumn": "deerling/deerling-autumn", "deerling-winter": "deerling/deerling-winter",
  "sawsbuck-summer": "sawsbuck/sawsbuck-summer", "sawsbuck-autumn": "sawsbuck/sawsbuck-autumn", "sawsbuck-winter": "sawsbuck/sawsbuck-winter",
  "genesect-douse": "genesect/genesect-douse", "genesect-shock": "genesect/genesect-shock", "genesect-burn": "genesect/genesect-burn", "genesect-chill": "genesect/genesect-chill",
  "greninja-battlebond": "greninja-battle-bond", "furfrou-lareine": "furfrou/furfrou-la-reine",
  "zygarde-50p": "zygarde-50", "zygarde-10p": "zygarde-10", "oricorio-pompom": "oricorio-pom-pom", "rockruff-owntempo": "rockruff-own-tempo",
  "minior-red-core": "minior-red", "minior-orange-core": "minior-orange", "minior-yellow-core": "minior-yellow", "minior-green-core": "minior-green", "minior-blue-core": "minior-blue", "minior-indigo-core": "minior-indigo", "minior-violet-core": "minior-violet",
  "necrozma-dusk-mane": "necrozma-dusk", "necrozma-dawn-wings": "necrozma-dawn", "eiscue-noice-face": "eiscue-noice",
  "zacian-sword": "zacian-crowned", "zamazenta-shield": "zamazenta-crowned", "calyrex-ice-rider": "calyrex-ice", "calyrex-shadow-rider": "calyrex-shadow",
  "squawkabilly-blue": "squawkabilly-blue-plumage", "squawkabilly-yellow": "squawkabilly-yellow-plumage", "squawkabilly-white": "squawkabilly-white-plumage",
  "dudunsparce-three": "dudunsparce-three-segment", "magearna-origin-color": "magearna-original", "unfezant-female": "unfezant",
  "reshiram-activated": "+", "zekrom-activated": "+", "kyurem-white-activated": "+", "kyurem-black-activated": "+",
  "toxtricity-gigantamax": "toxtricity-amped-gmax", "urshifu-gigantamax-single-strike": "urshifu-single-strike-gmax", "urshifu-gigantamax-rapid-strike": "urshifu-rapid-strike-gmax",
  "unown-exclamation-mark": "unown/unown-exclamation", "unown-question-mark": "unown/unown-question",
  "koraidon-limited": "koraidon/koraidon-limited-build", "koraidon-sprinting": "koraidon/koraidon-sprinting-build", "koraidon-swimming": "koraidon/koraidon-swimming-build", "koraidon-gliding": "koraidon/koraidon-gliding-build",
  "miraidon-low-power": "miraidon/miraidon-low-power-mode", "miraidon-drive": "miraidon/miraidon-drive-mode", "miraidon-aquatic": "miraidon/miraidon-aquatic-mode", "miraidon-glide": "miraidon/miraidon-glide-mode",
  "pikachu-partner": "pikachu-starter", "eevee-partner": "eevee-starter", "pichu-spiky-ears": "pichu/pichu-spiky-eared",
  "raticate-totem": "raticate", "raticate-alolan-totem": "raticate-totem-alola", "marowak-alolan-totem": "marowak-totem", "mimikyu-totem": "mimikyu-totem-disguised",
  "meowstic-mega-evolution": "meowstic-male-mega", "magearna-mega-evolution-origin-color": "magearna-original-mega",
  "tatsugiri-mega-evolution-curly": "tatsugiri-curly-mega", "tatsugiri-mega-evolution-droopy": "tatsugiri-droopy-mega", "tatsugiri-mega-evolution-stretchy": "tatsugiri-stretchy-mega",
};
const BFORMS = B("pokemon_forms.csv");
const formAlias = new Map();     // PokeDB identifier -> {pokemon, form, how}
const newForms = [];
for (const f of BFORMS) {
  const sp = bSpecies.get(f.ndex_id), isDef = f.is_default_form === "true";
  let r = null, how = "";
  const finish = (pk, form) => ({ pokemon: pk, form: form || defaultForm.get(pk) || "" });
  if (FORM_HAND[f.identifier]) { how = "hand"; const h = FORM_HAND[f.identifier]; r = h === "+" ? null : finish(...h.split("/")); if (h === "+") newForms.push(f); }
  else if (f.identifier === sp + "-default") { how = "default"; r = finish(defaultPk.get(f.ndex_id)); }
  else {
    const k = fold(f.identifier);
    if (pkIdent.has(k)) { how = "suffix"; r = finish(k); }
    else if (formPk.has(k)) { how = "cosmetic"; r = finish(formPk.get(k), k); }
    else if (isDef) { how = "named-default"; r = finish(defaultPk.get(f.ndex_id)); }
  }
  if (!r && !newForms.includes(f)) throw new Error(`unmapped PokeDB form: ${f.identifier}`);
  if (r) formAlias.set(f.identifier, { ...r, how });
}
for (const f of newForms) formAlias.set(f.identifier, { pokemon: f.identifier, form: f.identifier, how: "pokedb-only" });
const bFormById = new Map(BFORMS.map(r => [r.id, r.identifier]));
const aliasPk = ident => (formAlias.get(ident) || {}).pokemon;

// ---------------------------------------------------------------- items: PokeDB -> PokeAPI identifiers
const ITEMS = A("items.csv"), itemSet = new Set(ITEMS.map(r => r.identifier));
const itemNames = langMap("item_names.csv", "item_id", ["name"]);
const itemByEn = new Map(); for (const r of ITEMS) { const n = (itemNames.get(r.id) || {}).en; if (n && !itemByEn.has(norm(n.name))) itemByEn.set(norm(n.name), r.identifier); }
function norm(s) { return s.replace(/[’‘]/g, "'").toLowerCase(); }
const ITEM_HAND = { "up-grade": "up-grade", upgrade: "up-grade", leek: "stick", "health-feather": "health-wing", "muscle-feather": "muscle-wing", "resist-feather": "resist-wing", "genius-feather": "genius-wing", "clever-feather": "clever-wing", "swift-feather": "swift-wing", "pretty-feather": "pretty-wing",
  "card-key-kanto": "card-key", "secret-key-kanto": "secret-key", "storage-key-hoenn": "storage-key", "storage-key-sinnoh": "storage-key--galactic-warehouse" };   // same-named regional key items: match by generation
const itemAlias = new Map(); // PokeDB identifier -> {item, how}
const BITEMS = B("items.csv");
const enCount = {}; for (const r of BITEMS) enCount[norm(r.name)] = (enCount[norm(r.name)] || 0) + 1;
for (const r of BITEMS) {
  const k = machineKey(r.identifier), tm = /^(tm|hm|tr)\d+$/.test(k) ? k.replace(/^(tm|hm|tr)(\d)$/, "$10$2") : null;
  if (itemSet.has(r.identifier)) itemAlias.set(r.identifier, { item: r.identifier, how: "identical" });
  else if (tm && itemSet.has(tm)) itemAlias.set(r.identifier, { item: tm, how: "tm-number" });
  else if (ITEM_HAND[r.identifier] && itemSet.has(ITEM_HAND[r.identifier])) itemAlias.set(r.identifier, { item: ITEM_HAND[r.identifier], how: "hand" });
  else if (itemByEn.has(norm(r.name)) && enCount[norm(r.name)] === 1) itemAlias.set(r.identifier, { item: itemByEn.get(norm(r.name)), how: "english-name" });
  else itemAlias.set(r.identifier, { item: r.identifier, how: "pokedb-only" });
}
const aliasItem = s => (itemAlias.get(s) || { item: s }).item;

// ---------------------------------------------------------------- species-level hand adjudication
// chosen: "pokeapi" | "pokedb" | a literal value. Fields are the compare.js species-pairing columns.
const O = (dex, field, chosen, reason) => ({ dex, field, chosen, reason });
const SPECIES_OVERRIDES = [
  O(14, "ability_hidden", "pokeapi", "Kakuna has no hidden ability (Shed Skin only); Sniper is Beedrill's — PokeDB shifted the slot up one species"),
  O(14, "ev_atk", "pokeapi", "Kakuna yields 2 Def, not 2 Atk (PokeDB swapped Atk/Def)"),
  O(14, "ev_def", "pokeapi", "Kakuna yields 2 Def"),
  O(15, "ability_hidden", "pokeapi", "Beedrill's hidden ability is Sniper (PokeDB blank)"),
  O(28, "stat_def", "pokeapi", "Kanto Sandslash 75/100/110/45/55/65 — PokeDB's default row carries Alolan Def/SpA/SpD (120/25/65)"),
  O(28, "stat_spa", "pokeapi", "Kanto Sandslash Sp.Atk 45 (Alolan leak in PokeDB)"),
  O(28, "stat_spd", "pokeapi", "Kanto Sandslash Sp.Def 55 (Alolan leak in PokeDB)"),
  O(77, "ev_spd", "pokeapi", "Ponyta yields 1 Speed, not Sp.Def (PokeDB column shift)"),
  O(77, "ev_spe", "pokeapi", "Ponyta yields 1 Speed"),
  O(78, "ev_spd", "pokeapi", "Rapidash yields 2 Speed (PokeDB column shift)"),
  O(78, "ev_spe", "pokeapi", "Rapidash yields 2 Speed"),
  O(83, "name_en", "pokeapi", "Farfetch’d with the curly apostrophe — app convention (HISTORY 0.1.37), same glyph as the official spelling"),
  O(83, "name_es", "pokeapi", "curly apostrophe, as name_en"), O(83, "name_it", "pokeapi", "curly apostrophe, as name_en"),
  O(95, "ev_atk", "pokeapi", "Onix yields 1 Def (PokeDB swapped Atk/Def)"), O(95, "ev_def", "pokeapi", "Onix yields 1 Def"),
  O(147, "hatch_cycles", "pokeapi", "Dratini egg cycles 40 (Bulbapedia); 45 is wrong"),
  O(185, "name_zh-hans", "pokeapi", "identical text once PokeDB's trailing U+200E is stripped"),
  O(215, "color", "pokeapi", "Sneasel Pokédex colour Black (Bulbapedia infobox, verified 2026-09-06)"),
  O(273, "ev_atk", "pokeapi", "Seedot yields 1 Def (PokeDB swapped)"), O(273, "ev_def", "pokeapi", "Seedot yields 1 Def"),
  O(312, "name_zh-hans", "pokedb", "负电拍拍 is the all-simplified form; PokeAPI's 負电拍拍 mixes a traditional 負"),
  O(355, "ability_2", "pokeapi", "Duskull: Levitate only, hidden Frisk — PokeDB put Frisk in slot 2 and left hidden blank"),
  O(355, "ability_hidden", "pokeapi", "Duskull hidden ability Frisk"),
  O(356, "ability_2", "pokeapi", "Dusclops: Pressure only, hidden Frisk"), O(356, "ability_hidden", "pokeapi", "Dusclops hidden ability Frisk"),
  O(380, "is_legendary", "pokeapi", "Latias is a Legendary Pokémon (Eon Duo); PokeDB false negative"),
  O(393, "ability_hidden", "pokeapi", "Piplup line hidden ability is Competitive since Gen 8 (was Defiant Gen 5-7 — kept in pokemon_abilities_history)"),
  O(394, "ability_hidden", "pokeapi", "Prinplup: Competitive since Gen 8"), O(395, "ability_hidden", "pokeapi", "Empoleon: Competitive since Gen 8"),
  O(420, "pct_male", "pokeapi", "Cherubi is 50% male (Bulbapedia); PokeDB 20% is wrong"),
  O(424, "hatch_cycles", "pokeapi", "Ambipom egg cycles 20, same as Aipom"),
  O(440, "pct_male", "pokeapi", "Happiny is 100% female (0% male), not genderless"),
  O(442, "growth_rate", "pokeapi", "Spiritomb levelling rate Medium Fast (Bulbapedia)"),
  O(466, "hatch_cycles", "pokeapi", "Electivire egg cycles 25, same as Electabuzz"),
  O(469, "name_fr", "pokedb", "French name is Yanméga (accented) — PokeAPI dropped the accent"),
  O(488, "pct_male", "pokeapi", "Cresselia is 100% female, not genderless"),
  O(499, "weight_kg", "pokeapi", "Pignite 55.5 kg (Bulbapedia)"),
  O(499, "name_ko", "pokeapi", "Korean name 차오꿀 (official); PokeDB 챠오꿀 is a transliteration variant"),
  O(504, "growth_rate", "pokeapi", "Patrat levelling rate Medium Fast"),
  O(530, "height_m", "pokeapi", "Excadrill 0.7 m"),
  O(531, "pct_male", "pokeapi", "Audino 50% male"),
  O(539, "ability_1", "pokeapi", "Sawk: Sturdy / Inner Focus / hidden Mold Breaker — Guts is Throh's (PokeDB shifted one row)"),
  O(550, "catch_rate", "pokedb", "Basculin catch rate raised 25→190 in SV v2.0.1 (Bulbapedia 'List of Pokémon by catch rate'); PokeAPI is stale"),
  O(565, "weight_kg", "pokeapi", "Carracosta 81.0 kg"),
  O(622, "ev_hp", "pokeapi", "Golett yields 1 Atk (PokeDB swapped HP/Atk)"), O(622, "ev_atk", "pokeapi", "Golett yields 1 Atk"),
  O(636, "ability_2", "pokeapi", "Larvesta: Flame Body only, hidden Swarm (PokeDB put Swarm in slot 2)"), O(636, "ability_hidden", "pokeapi", "Larvesta hidden Swarm"),
  O(637, "ability_2", "pokeapi", "Volcarona: Flame Body only, hidden Swarm"), O(637, "ability_hidden", "pokeapi", "Volcarona hidden Swarm"),
  O(666, "pct_male", "pokeapi", "Vivillon 50% male (Bulbapedia, verified)"),
  O(666, "color", "pokedb", "Vivillon Pokédex colour Pink (Bulbapedia infobox, verified 2026-09-06); PokeAPI White is wrong"),
  O(666, "ev_spa", "pokeapi", "Vivillon yields 1 HP / 1 Sp.Atk / 1 Speed (Bulbapedia)"),
  O(678, "color", "pokeapi", "Meowstic Pokédex colour Blue (Bulbapedia, verified)"),
  O(688, "ability_1", "pokeapi", "Binacle slot order Tough Claws (1) / Sniper (2) as in the games' data; PokeDB reversed"),
  O(688, "ability_2", "pokeapi", "see ability_1"), O(689, "ability_1", "pokeapi", "Barbaracle: Tough Claws (1) / Sniper (2)"), O(689, "ability_2", "pokeapi", "see ability_1"),
  O(706, "genus", "pokeapi", "PokeDB flagged Hisuian Goodra as the species default; every #706 cell here is the Hisuian form's (form_aliases maps that row to goodra-hisui)"),
  O(706, "type_1", "pokeapi", "Kalos Goodra is pure Dragon"), O(706, "type_2", "pokeapi", "Kalos Goodra has no second type"),
  O(706, "ability_2", "pokeapi", "Kalos Goodra: Sap Sipper / Hydration / hidden Gooey"),
  O(706, "height_m", "pokeapi", "Kalos Goodra 2.0 m"), O(706, "weight_kg", "pokeapi", "Kalos Goodra 150.5 kg"),
  O(706, "stat_hp", "pokeapi", "Kalos Goodra 90 HP"), O(706, "stat_def", "pokeapi", "Kalos Goodra 70 Def"), O(706, "stat_spe", "pokeapi", "Kalos Goodra 80 Spe"),
  O(718, "ability_2", "pokeapi", "Zygarde 50% default form has Aura Break only; Power Construct belongs to the separate zygarde-50-power-construct row"),
  O(734, "ability_1", "pokeapi", "Yungoos slot order Stakeout (1) / Strong Jaw (2); PokeDB reversed"), O(734, "ability_2", "pokeapi", "see ability_1"),
  O(734, "egg_groups", "pokeapi", "Yungoos egg group Field; PokeDB Flying is wrong"),
  O(735, "ability_1", "pokeapi", "Gumshoos slot order Stakeout (1) / Strong Jaw (2)"), O(735, "ability_2", "pokeapi", "see ability_1"),
  O(774, "color", "pokeapi", "Minior (Meteor Form) Pokédex colour Brown (Bulbapedia, verified)"),
  O(865, "name_en", "pokeapi", "Sirfetch’d, curly apostrophe as #83"), O(865, "name_es", "pokeapi", "curly apostrophe"), O(865, "name_it", "pokeapi", "curly apostrophe"),
  O(899, "catch_rate", "pokedb", "Wyrdeer catch rate 45 (Bulbapedia infobox, verified 2026-09-06); PokeAPI 135 has no source"),
  O(899, "color", "pokedb", "Wyrdeer Pokédex colour White (Bulbapedia, verified)"),
  O(900, "catch_rate", "pokedb", "Kleavor catch rate 15 in LA/SV (Bulbapedia; raised to 20 only in Legends: Z-A); PokeAPI 115 has no source"),
  O(900, "stat_atk", "pokeapi", "Kleavor base Attack 135 (Bulbapedia)"), O(900, "stat_spd", "pokeapi", "Kleavor base Sp.Def 70 (Bulbapedia)"),
  O(900, "ev_atk", "pokeapi", "Kleavor yields 3 Atk in SV (Bulbapedia, marked as changed since LA — LA has no EV system)"),
  O(901, "catch_rate", "pokedb", "Ursaluna catch rate 20 (Bulbapedia, verified)"),
  O(902, "catch_rate", "pokedb", "Basculegion catch rate 45 (Bulbapedia, verified)"),
  O(902, "ev_hp", "pokeapi", "Basculegion yields 3 HP in SV (Bulbapedia)"),
  O(903, "catch_rate", "pokedb", "Sneasler catch rate 20 (Bulbapedia, verified)"),
  O(903, "color", "blue", "Sneasler Pokédex colour Blue per Bulbapedia (verified) — neither source has it (PokeAPI gray, PokeDB purple)"),
  O(903, "ev_atk", "pokeapi", "Sneasler yields 2 Atk / 0 Spe in SV (Bulbapedia)"), O(903, "ev_spe", "pokeapi", "see ev_atk"),
  O(904, "catch_rate", "pokedb", "Overqwil catch rate 45 (Bulbapedia, verified)"),
  O(904, "color", "pokeapi", "Overqwil Pokédex colour Black (Bulbapedia, verified)"),
  O(905, "pct_male", "pokeapi", "Enamorus is 100% female, not genderless"),
  O(912, "color", "pokedb", "Quaxly Pokédex colour Blue (Bulbapedia, verified)"),
  O(916, "pct_male", "pokedb", "Oinkologne is 50% male (Bulbapedia, verified); PokeAPI's gender_rate 0 describes only its male form"),
  O(919, "hatch_cycles", "pokeapi", "Nymble egg cycles 20 (Bulbapedia, verified)"),
  O(925, "weight_kg", "pokeapi", "Maushold default form is Family of Four, 2.8 kg (user decision; Family of Three is 2.3 kg)"),
  O(935, "hatch_cycles", "pokeapi", "Charcadet egg cycles 35 (Bulbapedia, verified)"),
  O(937, "color", "pokedb", "Ceruledge Pokédex colour Purple (Bulbapedia, verified)"),
  O(956, "name_zh-hant", "pokedb", "超能豔鴕 is the official Traditional Chinese name (tw.portal-pokemon.com/play/pokedex/0956)"),
  O(962, "egg_groups", "pokeapi", "Bombirdier egg group Flying (Bulbapedia, verified); PokeDB Water 3 is wrong"),
  O(973, "name_zh-hans", "pokedb", "缠红鹤 is all-simplified; PokeAPI 纏红鹤 mixes a traditional 纏"),
  O(978, "color", "pokedb", "Tatsugiri Pokédex colour Red (Bulbapedia, verified)"),
  O(983, "name_zh-hant", "pokedb", "仆斬將軍 is the official Traditional Chinese name (tw.portal-pokemon.com/play/pokedex/0983)"),
  O(988, "color", "pokedb", "Slither Wing Pokédex colour White (Bulbapedia, verified)"),
  O(990, "name_zh-hans", "pokedb", "铁辙迹 is all-simplified; PokeAPI 铁轍迹 mixes a traditional 轍"),
  O(994, "color", "pokedb", "Iron Moth Pokédex colour White (Bulbapedia, verified)"),
  O(997, "color", "pokedb", "Arctibax Pokédex colour Blue (Bulbapedia, verified)"),
  O(998, "color", "pokedb", "Baxcalibur Pokédex colour Blue (Bulbapedia, verified)"),
  O(999, "color", "pokedb", "Gimmighoul Pokédex colour Red (Bulbapedia, verified)"),
  O(1005, "color", "pokedb", "Roaring Moon Pokédex colour Blue (Bulbapedia, verified)"),
  O(1007, "height_m", "pokeapi", "Koraidon (Apex Build) 2.5 m (Bulbapedia, verified); 3.5 m is Limited Build"),
  O(1008, "color", "pokedb", "Miraidon Pokédex colour Purple (Bulbapedia, verified)"),
  O(1011, "growth_rate", "pokedb", "Dipplin levelling rate Erratic, like the whole Applin line (Bulbapedia, verified)"),
  O(1011, "weight_kg", "pokedb", "Dipplin 4.4 kg (Bulbapedia, verified); PokeAPI 9.7 is its weight in pounds"),
  O(1012, "hatch_cycles", "pokedb", "Poltchageist egg cycles 20 (Bulbapedia, verified)"),
  O(1012, "growth_rate", "pokedb", "Poltchageist levelling rate Medium Fast (Bulbapedia, verified)"),
  O(1013, "hatch_cycles", "pokedb", "Sinistcha egg cycles 20 (same line as Poltchageist)"),
  O(1013, "growth_rate", "pokedb", "Sinistcha levelling rate Medium Fast (same line as Poltchageist)"),
  O(1013, "name_zh-hant", "pokeapi", "PokeDB swapped Sinistcha's Traditional/Simplified cells (來 is traditional)"),
  O(1013, "name_zh-hans", "pokeapi", "see name_zh-hant"),
  O(1014, "hatch_cycles", "pokedb", "Okidogi egg cycles 120 (Bulbapedia, verified)"),
  O(1015, "hatch_cycles", "pokedb", "Munkidori egg cycles 120 (Loyal Three, as Okidogi)"),
  O(1016, "hatch_cycles", "pokedb", "Fezandipiti egg cycles 120 (Loyal Three, as Okidogi)"),
  O(1017, "catch_rate", "pokeapi", "Ogerpon catch rate 5 (Bulbapedia, verified)"),
  O(1017, "hatch_cycles", "pokedb", "Ogerpon egg cycles 10 (Bulbapedia, verified)"),
  O(1018, "hatch_cycles", "pokeapi", "Archaludon egg cycles 30 (Bulbapedia, verified)"),
  O(1018, "weight_kg", "pokeapi", "Archaludon 60.0 kg (Bulbapedia, verified)"),
  O(1019, "hatch_cycles", "pokeapi", "Hydrapple egg cycles 20 (Bulbapedia, verified)"),
  O(1022, "growth_rate", "pokeapi", "Iron Boulder levelling rate Slow (Bulbapedia, verified)"),
  O(1024, "genus", "pokeapi", "Terapagos is the Tera Pokémon (Bulbapedia, verified); PokeDB copied Paradox"),
  // structural fix, not a compared cell: Meltan -> Melmetal share one evolution chain (PokeDB tree 420; PokeAPI has 2 chains but evolves_from=808)
  O(809, "evolution_chain_id", "pokedb", "Melmetal evolves from Meltan (PokeAPI's own evolves_from_species_id=808) — merged into Meltan's chain 428 as PokeDB's single tree says"),
];
// form-level EV yields where PokeAPI copied the base form's line (Bulbapedia infobox, verified 2026-09-06):
// Hisuian Samurott 3 Atk, Hisuian Lilligant 1 Atk / 1 Spe, Bloodmoon Ursaluna 3 Sp.Atk
const EV_FROM_POKEDB = new Set(["samurott-hisui", "lilligant-hisui", "ursaluna-bloodmoon"]);
const OVR = new Map(SPECIES_OVERRIDES.map(o => [o.dex + "|" + o.field, o]));
const ovr = (dex, field) => OVR.get(String(dex) + "|" + field);

// ---------------------------------------------------------------- build
function build() {
  // no rmSync: the Cowork mount refuses deletes (CLAUDE.md §4); files are overwritten in place and
  // anything left over from an earlier run is listed at the end for manual deletion.
  fs.mkdirSync(OUT, { recursive: true }); fs.mkdirSync(MREP, { recursive: true });
  const preexisting = new Set(fs.readdirSync(OUT).filter(f => f.endsWith(".csv")));

  // ---- reference tables
  const dbLang = new Map(B("languages.csv").map(r => [LANGDB[r.identifier], r]));
  const langRows = A("languages.csv").map(r => ({ identifier: r.identifier, id: r.id, iso639: r.iso639, iso3166: r.iso3166, official: r.official, order: r.order, name_en: (dbLang.get(r.identifier) || {}).display_name || "", source: dbLang.has(r.identifier) ? "both" : "pokeapi" }));
  const lnames = langMap("language_names.csv", "language_id", ["name"]);
  for (const r of langRows) wide(lnames, r.id, ["name"], r);
  for (const [code, r] of dbLang) if (!langRows.some(x => x.identifier === code)) langRows.push({ identifier: code, id: "", iso639: r.language_code.split("-")[0], iso3166: "", official: "", order: "", name_en: r.display_name, source: "pokedb" });
  out("languages.csv", langRows, ["identifier", "id", "iso639", "iso3166", "official", "order", "source"]);

  const gn = langMap("generation_names.csv", "generation_id", ["name"]);
  out("generations.csv", A("generations.csv").map(r => wide(gn, r.id, ["name"], { identifier: r.identifier, id: r.id, main_region: REGION.get(r.main_region_id) })), ["identifier", "id", "main_region"], { main_region: "regions.identifier" });
  const rn = langMap("region_names.csv", "region_id", ["name"]);
  const regionRows = A("regions.csv").map(r => wide(rn, r.id, ["name"], { identifier: r.identifier, id: r.id, source: "pokeapi" }));
  for (const r of B("regions.csv")) { const e = regionRows.find(x => x.identifier === r.identifier); if (e) e.source = "both"; else regionRows.push({ identifier: r.identifier, id: "", source: "pokedb", name_en: r.name }); }
  out("regions.csv", regionRows, ["identifier", "id", "source"]);
  out("region_areas_pokedb.csv", B("region_areas.csv").map(r => ({ identifier: r.identifier, region: r.region_identifier, name: r.name, generation: r.generation_id })), ["identifier", "region", "name", "generation"], { region: "regions.identifier", generation: "generations.id" });

  const vgRegions = {}; for (const r of A("version_group_regions.csv")) (vgRegions[r.version_group_id] ||= []).push(REGION.get(r.region_id));
  const vgMethods = {}; for (const r of A("version_group_pokemon_move_methods.csv")) (vgMethods[r.version_group_id] ||= []).push(MMETH.get(r.pokemon_move_method_id));
  out("version_groups.csv", VG.filter(r => !EXCL_VG.has(r.identifier)).map(r => ({ identifier: r.identifier, id: r.id, generation: r.generation_id, order: r.order, game: GAME[r.identifier] || "", regions: (vgRegions[r.id] || []).join(";"), move_methods: (vgMethods[r.id] || []).join(";") })), ["identifier", "id", "generation", "order", "game", "regions", "move_methods"], { generation: "generations.id", regions: "regions.identifier;", move_methods: "pokemon_move_methods.identifier;" });
  const vn = langMap("version_names.csv", "version_id", ["name"]);
  out("versions.csv", VER.filter(r => !exclVer.has(r.identifier)).map(r => wide(vn, r.id, ["name"], { identifier: r.identifier, id: r.id, version_group: vgId.get(r.version_group_id) })), ["identifier", "id", "version_group"], { version_group: "version_groups.identifier" });
  const pdVg = {}; for (const r of A("pokedex_version_groups.csv")) (pdVg[r.pokedex_id] ||= []).push(vgId.get(r.version_group_id));
  const pdp = langMap("pokedex_prose.csv", "pokedex_id", ["name", "description"]);
  out("pokedexes.csv", A("pokedexes.csv").map(r => wide(pdp, r.id, ["name", "description"], { identifier: r.identifier, id: r.id, region: REGION.get(r.region_id) || "", is_main_series: r.is_main_series, version_groups: (pdVg[r.id] || []).filter(vgOk).join(";") })), ["identifier", "id", "region", "is_main_series", "version_groups"], { region: "regions.identifier", version_groups: "version_groups.identifier;" });

  // ---- types
  const bTypes = new Map(B("types.csv").map(r => [r.name.toLowerCase(), r]));
  const tn = langMap("type_names.csv", "type_id", ["name"]);
  const TYPE_DB_LANG = { name: "en", name_jp: "ja", name_jp_romanized: "ja-roma", name_cn_traditional: "zh-hant", name_cn_simplified: "zh-hans", name_mandarin_romanized: "zh-cmn-latn", name_cantonese_romanized: "zh-yue-latn", name_danish: "da", name_czech: "cs", name_dutch: "nl", name_finnish: "fi", name_fr_fr: "fr", name_fr_ca: "fr-ca", name_ger: "de", name_greek: "el", name_greek_romanized: "el-latn", name_hebrew: "he", name_hebrew_romanized: "he-latn", name_hindi: "hi", name_hungarian: "hu", name_indonesian: "id", name_italian: "it", name_korean: "ko", name_korean_romanized: "ko-latn", name_malay: "ms", name_norwegian: "no", name_polish: "pl", name_portuguese_br: "pt-br", name_portuguese_pt: "pt-pt", name_romanian: "ro", name_russian: "ru", name_russian_romanized: "ru-latn", name_spanish_sp: "es", name_spanish_latam: "es-419", name_swedish: "sv", name_thai: "th", name_thai_romanized: "th-latn", name_turkish: "tr", name_vietnamese: "vi", name_bulgarian: "bg", name_bulgarian_romanized: "bg-latn", name_icelandic: "is", name_slovak: "sk" };
  for (const c of Object.values(TYPE_DB_LANG)) LANGCODES.add(c);
  const typeRows = [], typeNameRows = [];
  for (const r of A("types.csv")) {
    const b = bTypes.get(r.identifier) || {};
    const dc = DMG.get(r.damage_class_id) || "";
    const bdc = { 1: "physical", 2: "special" }[b.damage_category_id] || "";
    typeRows.push({ identifier: r.identifier, id: r.id, generation: r.generation_id, damage_class_gen1_3: +r.generation_id <= 3 ? pick("types", r.identifier, "damage_class_gen1_3", dc, bdc) : "", hex_color: b.hex_color || "" });
    const nr = wide(tn, r.id, ["name"], { type: r.identifier }), bn = bName(b, TYPE_DB_LANG, {});
    for (const [k, v] of Object.entries(bn)) nr[k] = pick("type_names", r.identifier, k, nr[k], v);
    typeNameRows.push(nr);
  }
  out("types.csv", typeRows, ["identifier", "id", "generation", "damage_class_gen1_3", "hex_color"], { generation: "generations.id", damage_class_gen1_3: "move_damage_classes.identifier" });
  out("type_names.csv", typeNameRows, ["type"], { type: "types.identifier" });
  // type charts: current (Gen 6+) + type_efficacy_past ("generation_id" = last generation the old value applied)
  const cur = new Map(A("type_efficacy.csv").map(r => [r.damage_type_id + ">" + r.target_type_id, +r.damage_factor / 100]));
  const past = A("type_efficacy_past.csv");
  const typeGen = new Map(A("types.csv").map(r => [r.id, +r.generation_id]));
  const chart = (maxGen, file) => {
    const rows = [];
    for (const [k, v] of cur) {
      const [d, t] = k.split(">"); if (+d > 18 || +t > 18 || typeGen.get(d) > maxGen || typeGen.get(t) > maxGen) continue;
      const p = past.filter(r => r.damage_type_id === d && r.target_type_id === t && +r.generation_id >= maxGen).sort((x, y) => +x.generation_id - +y.generation_id)[0];
      rows.push({ attack: TYPE.get(d), defense: TYPE.get(t), multiplier: String(p ? +p.damage_factor / 100 : v) });
    }
    out(file, rows, ["attack", "defense", "multiplier"], { attack: "types.identifier", defense: "types.identifier" });
  };
  chart(1, "type_chart_gen1.csv"); chart(5, "type_chart_gen2-5.csv"); chart(9, "type_chart_gen6plus.csv");
  out("damage_class_by_type_gen1-3.csv", typeRows.filter(r => +r.generation <= 3 && +r.id <= 18).map(r => ({ type: r.identifier, damage_class: r.damage_class_gen1_3 })), ["type", "damage_class"], { type: "types.identifier", damage_class: "move_damage_classes.identifier" });

  // ---- small lookups with names
  const simpleNamed = (file, src, idCol, nameFile, cols, fixed = {}, fks = {}) => out(file, A(src).map(r => wide(langMap(nameFile, idCol, cols), r.id, cols, { identifier: r.identifier, id: r.id, ...Object.fromEntries(Object.entries(fixed).map(([k, f]) => [k, f(r)])) })), ["identifier", "id", ...Object.keys(fixed)], fks);
  const dcRows = A("move_damage_classes.csv").map(r => wide(langMap("move_damage_class_prose.csv", "move_damage_class_id", ["name", "description"]), r.id, ["name", "description"], { identifier: r.identifier, id: r.id }));
  dcRows.push({ identifier: "vary", id: "", name_en: "Varies", description_en: "Physical or special depending on the user's higher attacking stat (Z-Moves, Max Moves, G-Max Moves, Shell Side Arm, Tera Blast, Tera Starstorm) — PokeDB damage category 4." });
  out("move_damage_classes.csv", dcRows, ["identifier", "id"]);
  simpleNamed("move_targets.csv", "move_targets.csv", "move_target_id", "move_target_prose.csv", ["name", "description"]);
  simpleNamed("egg_groups.csv", "egg_groups.csv", "egg_group_id", "egg_group_prose.csv", ["name"]);
  const xp100 = new Map(B("leveling_rates.csv").map(r => [GROWTH_DB[r.description], r.xp_to_100.replace(/,/g, "")]));
  const bNat = new Map(B("natures.csv").map(r => [r.identifier, r]));
  const exp = A("experience.csv");
  simpleNamed("growth_rates.csv", "growth_rates.csv", "growth_rate_id", "growth_rate_prose.csv", ["name"], { formula: r => r.formula, exp_to_level_100: r => pick("growth_rates", r.identifier, "exp_to_level_100", (exp.find(e => e.growth_rate_id === r.id && e.level === "100") || {}).experience, xp100.get(r.identifier)) });
  out("experience.csv", exp.map(r => ({ growth_rate: GROWTHR.get(r.growth_rate_id), level: r.level, experience: r.experience })), ["growth_rate", "level", "experience"], { growth_rate: "growth_rates.identifier" });
  simpleNamed("natures.csv", "natures.csv", "nature_id", "nature_names.csv", ["name"], { increased_stat: r => STAT.get(r.increased_stat_id) || "", decreased_stat: r => STAT.get(r.decreased_stat_id) || "", likes_flavor: r => CTYPE.get(r.likes_flavor_id) || "", hates_flavor: r => CTYPE.get(r.hates_flavor_id) || "", game_index: r => r.game_index }, { increased_stat: "stats.identifier", decreased_stat: "stats.identifier", likes_flavor: "contest_types.identifier", hates_flavor: "contest_types.identifier" });
  out("nature_battle_style_preferences.csv", A("nature_battle_style_preferences.csv").map(r => ({ nature: NATURE.get(r.nature_id), battle_style: BSTYLE.get(r.move_battle_style_id), low_hp_preference: r.low_hp_preference, high_hp_preference: r.high_hp_preference })), ["nature", "battle_style", "low_hp_preference", "high_hp_preference"], { nature: "natures.identifier", battle_style: "move_battle_styles.identifier" });
  out("nature_pokeathlon_stats.csv", A("nature_pokeathlon_stats.csv").map(r => ({ nature: NATURE.get(r.nature_id), pokeathlon_stat: PATH.get(r.pokeathlon_stat_id), max_change: r.max_change })), ["nature", "pokeathlon_stat", "max_change"], { nature: "natures.identifier", pokeathlon_stat: "pokeathlon_stats.identifier" });
  simpleNamed("move_battle_styles.csv", "move_battle_styles.csv", "move_battle_style_id", "move_battle_style_prose.csv", ["name"]);
  simpleNamed("pokeathlon_stats.csv", "pokeathlon_stats.csv", "pokeathlon_stat_id", "pokeathlon_stat_names.csv", ["name"]);
  simpleNamed("stats.csv", "stats.csv", "stat_id", "stat_names.csv", ["name"], { damage_class: r => DMG.get(r.damage_class_id) || "", is_battle_only: r => r.is_battle_only, game_index: r => r.game_index }, { damage_class: "move_damage_classes.identifier" });
  out("characteristics.csv", A("characteristics.csv").map(r => wide(langMap("characteristic_text.csv", "characteristic_id", ["message"]), r.id, ["message"], { id: r.id, stat: STAT.get(r.stat_id), gene_mod_5: r.gene_mod_5 })), ["id", "stat", "gene_mod_5"], { stat: "stats.identifier" });
  const bColor = new Map(B("pokedex_colors.csv").map(r => [r.identifier.toLowerCase(), r.hex_code]));
  simpleNamed("colors.csv", "pokemon_colors.csv", "pokemon_color_id", "pokemon_color_names.csv", ["name"], { hex_color: r => bColor.get(r.identifier) || "" });
  simpleNamed("shapes.csv", "pokemon_shapes.csv", "pokemon_shape_id", "pokemon_shape_prose.csv", ["name", "awesome_name", "description"]);
  simpleNamed("habitats.csv", "pokemon_habitats.csv", "pokemon_habitat_id", "pokemon_habitat_names.csv", ["name"]);
  const bCT = new Map(B("contest_types.csv").map(r => [r.identifier, r]));
  simpleNamed("contest_types.csv", "contest_types.csv", "contest_type_id", "contest_type_names.csv", ["name", "flavor", "color"], { hex_color: r => (bCT.get(r.identifier) || {}).color_hex_code || "" });
  out("contest_effects.csv", A("contest_effects.csv").map(r => wide(langMap("contest_effect_prose.csv", "contest_effect_id", ["flavor_text", "effect"]), r.id, ["flavor_text", "effect"], { id: r.id, appeal: r.appeal, jam: r.jam })), ["id", "appeal", "jam"]);
  out("super_contest_effects.csv", A("super_contest_effects.csv").map(r => wide(langMap("super_contest_effect_prose.csv", "super_contest_effect_id", ["flavor_text"]), r.id, ["flavor_text"], { id: r.id, appeal: r.appeal })), ["id", "appeal"]);
  out("contest_combos.csv", A("contest_combos.csv").map(r => ({ first_move: MOVE.get(r.first_move_id), second_move: MOVE.get(r.second_move_id) })), ["first_move", "second_move"], { first_move: "moves.identifier", second_move: "moves.identifier" });
  out("super_contest_combos.csv", A("super_contest_combos.csv").map(r => ({ first_move: MOVE.get(r.first_move_id), second_move: MOVE.get(r.second_move_id) })), ["first_move", "second_move"], { first_move: "moves.identifier", second_move: "moves.identifier" });
  simpleNamed("encounter_methods.csv", "encounter_methods.csv", "encounter_method_id", "encounter_method_prose.csv", ["name"], { order: r => r.order });
  simpleNamed("encounter_conditions.csv", "encounter_conditions.csv", "encounter_condition_id", "encounter_condition_prose.csv", ["name"]);
  simpleNamed("encounter_condition_values.csv", "encounter_condition_values.csv", "encounter_condition_value_id", "encounter_condition_value_prose.csv", ["name"], { condition: r => ECOND.get(r.encounter_condition_id), is_default: r => r.is_default }, { condition: "encounter_conditions.identifier" });
  out("encounter_methods_pokedb.csv", B("encounter_methods.csv").map(r => ({ identifier: r.identifier, name: r.name, description: r.description_markup })), ["identifier", "name", "description"]);
  simpleNamed("pokemon_move_methods.csv", "pokemon_move_methods.csv", "pokemon_move_method_id", "pokemon_move_method_prose.csv", ["name", "description"]);
  simpleNamed("evolution_triggers.csv", "evolution_triggers.csv", "evolution_trigger_id", "evolution_trigger_prose.csv", ["name"]);
  simpleNamed("item_pockets.csv", "item_pockets.csv", "item_pocket_id", "item_pocket_names.csv", ["name"]);
  simpleNamed("item_categories.csv", "item_categories.csv", "item_category_id", "item_category_prose.csv", ["name"], { pocket: r => IPOCKET.get(r.pocket_id) }, { pocket: "item_pockets.identifier" });
  simpleNamed("item_fling_effects.csv", "item_fling_effects.csv", "item_fling_effect_id", "item_fling_effect_prose.csv", ["effect"]);
  simpleNamed("item_flags.csv", "item_flags.csv", "item_flag_id", "item_flag_prose.csv", ["name", "description"]);
  simpleNamed("berry_firmness.csv", "berry_firmness.csv", "berry_firmness_id", "berry_firmness_names.csv", ["name"]);
  simpleNamed("pal_park_areas.csv", "pal_park_areas.csv", "pal_park_area_id", "pal_park_area_names.csv", ["name"]);
  simpleNamed("move_flags.csv", "move_flags.csv", "move_flag_id", "move_flag_prose.csv", ["name", "description"]);
  simpleNamed("move_meta_ailments.csv", "move_meta_ailments.csv", "move_meta_ailment_id", "move_meta_ailment_names.csv", ["name"]);
  simpleNamed("move_meta_categories.csv", "move_meta_categories.csv", "move_meta_category_id", "move_meta_category_prose.csv", ["description"]);
  simpleNamed("pokemon_form_triggers.csv", "pokemon_form_triggers.csv", "pokemon_form_trigger_id", "pokemon_form_trigger_prose.csv", ["name"]);
  const curRows = A("currencies.csv").map(r => wide(langMap("currency_names.csv", "id", ["name"]), r.id, ["name"], { identifier: r.identifier, id: r.id, source: "pokeapi" }));
  for (const r of B("pokemon_currencies.csv")) { const id = CURRENCY_DB[r.identifier] || r.identifier; const e = curRows.find(x => x.identifier === id); if (e) { e.source = "both"; e.shorthand = r.shorthand; } else curRows.push({ identifier: id, id: "", name_en: r.name, shorthand: r.shorthand, source: "pokedb" }); }
  out("currencies.csv", curRows, ["identifier", "id", "source"]);
  const SC_LANG = { name: "en", name_jp: "ja", name_jp_romanized: "ja-roma", name_cn_trad: "zh-hant", name_cn_simp: "zh-hans", name_cn_canto: "zh-yue", name_cn_mandarin: "zh-cmn", name_finnish: "fi", name_french: "fr", name_german: "de", name_italian: "it", name_korean: "ko", name_korean_romanized: "ko-latn", name_polish: "pl", name_portuguese: "pt", name_russian: "ru", name_russian_romanized: "ru-latn", name_spanish: "es", name_thai: "th", name_vietnamese: "vi", name_swedish: "sv", name_danish: "da", name_norwegian: "no", name_dutch: "nl" };
  LANGCODES.add("pt");
  out("status_conditions.csv", B("status_conditions.csv").map(r => bName(r, SC_LANG, { identifier: r.identifier, id: r.id, type: r.type, generation: r.generation_id, own_entry: r.own_entry })), ["identifier", "id", "type", "generation", "own_entry"], { generation: "generations.id" });
  const scId = new Map(B("status_conditions.csv").map(r => [r.id, r.identifier]));
  out("status_condition_effects.csv", B("status_condition_effects.csv").map(r => ({ status_condition: scId.get(r.status_condition_id), short_effect: r.short_effect_markup, long_effect: r.long_effect_markup })), ["status_condition", "short_effect", "long_effect"], { status_condition: "status_conditions.identifier" });

  // ---- species
  const spNames = langMap("pokemon_species_names.csv", "pokemon_species_id", ["name", "genus"]);
  const np = new Map(B("national_pokedexes.csv").map(r => [r.id, r]));
  const bn = new Map(B("ndex_names.csv").map(r => [r.ndex_id, r]));
  const beg = new Map(B("ndex_egg_groups.csv").map(r => [r.ndex_id, r]));
  const bDefForm = new Map();   // dex -> PokeDB form row that maps to PokeAPI's default pokemon
  for (const f of BFORMS) { const a = formAlias.get(f.identifier); if (a && a.pokemon === defaultPk.get(f.ndex_id) && a.how !== "cosmetic" && !bDefForm.has(f.ndex_id)) bDefForm.set(f.ndex_id, f); }
  const bDefFlag = new Map(BFORMS.filter(r => r.is_default_form === "true").map(r => [r.ndex_id, r]));
  const NDEX_LANG = { name_english: "en", name_german: "de", name_french: "fr", name_spanish: "es", name_italian: "it", name_japanese: "ja", name_japanese_romanized: "ja-roma", name_korean: "ko", name_korean_romanized: "ko-latn", name_chinese_traditional: "zh-hant", name_chinese_simplified: "zh-hans", name_chinese_romanized: "zh-latn" };
  const aEggs = {}; for (const r of A("pokemon_egg_groups.csv")) (aEggs[r.species_id] ||= []).push(EGGG.get(r.egg_group_id));
  const aStats = {}; for (const r of A("pokemon_stats.csv")) (aStats[r.pokemon_id] ||= {})[r.stat_id] = r;
  const aTypes = {}; for (const r of A("pokemon_types.csv")) (aTypes[r.pokemon_id] ||= {})[r.slot] = TYPE.get(r.type_id);
  const aAbil = {}; for (const r of A("pokemon_abilities.csv")) (aAbil[r.pokemon_id] ||= {})[r.is_hidden === "1" ? "h" : r.slot] = ABIL.get(r.ability_id);
  const pkByIdent = new Map(PK.map(r => [r.identifier, r]));
  const formById = new Map(FORMS.map(r => [r.id, r.identifier]));
  const formIdent = id => formById.get(id) || "";
  const pctMale = g => g === "-1" ? "???" : String((8 - +g) / 8 * 100);
  const genderRate = pct => pct === "???" ? "-1" : String(Math.round(8 - +pct * 8 / 100));
  // species-level compare view (PokeDB is_default_form row, exactly as compare.js's pairing) -> every conflict must be adjudicated
  const overrideRows = [];
  const usedOvr = new Set();
  const MEANINGFUL_BLANK = new Set(["ability_2", "ability_hidden", "type_2"]);   // PokeAPI blank = "none", not a gap
  function adjudicate(dex, field, a, b) {
    a = clean(a); b = clean(b);
    if (same(a, b) || b === "" ) return a;                       // blank PokeDB = nothing to adjudicate
    if (a === "" && !MEANINGFUL_BLANK.has(field)) return b;      // gap fill
    const o = ovr(dex, field);
    if (!o) throw new Error(`unadjudicated species conflict: #${dex} ${field}: pokeapi=${JSON.stringify(a)} pokedb=${JSON.stringify(b)}`);
    usedOvr.add(o); return o.chosen === "pokeapi" ? a : o.chosen === "pokedb" ? b : o.chosen;
  }
  const speciesRows = [], speciesNameRows = [], genusRows = [], eggRows = [], friend37 = [], friend8 = [];
  const chosenStats = new Map();   // dex -> {field: value} for pokemon-level tables (default form)
  const chainOf = new Map(SPECIES.map(s => [s.id, s.evolution_chain_id]));
  for (const s of SPECIES) {
    const dex = s.id, n = spNames.get(dex) || {}, np1 = np.get(dex) || {}, bnm = bn.get(dex) || {}, bd = bDefFlag.get(dex) || {}, bd2 = bDefForm.get(dex) || bd, e = beg.get(dex) || {};
    const key = +dex;
    const ch = {};   // chosen species-pairing values
    ch.catch_rate = adjudicate(key, "catch_rate", s.capture_rate, np1.catch_rate);
    ch.hatch_cycles = adjudicate(key, "hatch_cycles", s.hatch_counter, np1.hatch_time_cycles);
    ch.growth_rate = adjudicate(key, "growth_rate", GROWTH[GROWTHR.get(s.growth_rate_id)], L.bGrowth.get(np1.leveling_rate_id));
    ch.pct_male = adjudicate(key, "pct_male", pctMale(s.gender_rate), np1.percentage_male);
    ch.is_legendary = adjudicate(key, "is_legendary", bool(s.is_legendary), bool(bd.is_legendary));
    ch.is_mythical = adjudicate(key, "is_mythical", bool(s.is_mythical), bool(bd.is_mythical));
    ch.is_baby = adjudicate(key, "is_baby", bool(s.is_baby), bool(bd.is_baby));
    ch.color = adjudicate(key, "color", COLOR.get(s.color_id), (L.bColor.get(bd.pokedex_color_id) || "").toLowerCase());
    ch.genus = adjudicate(key, "genus", (n.en || {}).genus, bd.pokemon_category);
    ch.egg_groups = adjudicate(key, "egg_groups", (aEggs[dex] || []).map(x => EGG[x] || x).sort().join("/"), [L.bEgg.get(e.egg_group_1_id), L.bEgg.get(e.egg_group_2_id)].filter(Boolean).sort().join("/"));
    const p = pkByIdent.get(defaultPk.get(dex));
    ch.height_m = adjudicate(key, "height_m", String(+p.height / 10), (bd.height_m || "").replace(/m$/, ""));
    ch.weight_kg = adjudicate(key, "weight_kg", String(+p.weight / 10), (bd.weight_kg || "").replace(/kg$/, ""));
    const aSt = aStats[p.id] || {};
    const SN = { 1: "hp", 2: "atk", 3: "def", 4: "spa", 5: "spd", 6: "spe" }, BS = { hp: "stat_hp", atk: "stat_attack", def: "stat_defense", spa: "stat_spatk", spd: "stat_spdef", spe: "stat_speed" }, BE = { hp: "ev_yield_hp", atk: "ev_yield_atk", def: "ev_yield_def", spa: "ev_yield_spatk", spd: "ev_yield_spdef", spe: "ev_yield_speed" };
    for (const [id, k] of Object.entries(SN)) { ch["stat_" + k] = adjudicate(key, "stat_" + k, (aSt[id] || {}).base_stat, bd[BS[k]]); ch["ev_" + k] = adjudicate(key, "ev_" + k, (aSt[id] || {}).effort, bd[BE[k]]); }
    const aT = aTypes[p.id] || {}; ch.type_1 = adjudicate(key, "type_1", aT[1] || "", BTYPE.get(bd.type_1_id) || ""); ch.type_2 = adjudicate(key, "type_2", aT[2] || "", BTYPE.get(bd.type_2_id) || "");
    const aA = aAbil[p.id] || {};
    ch.ability_1 = adjudicate(key, "ability_1", aA[1] || "", BABIL.get(bd.ability_primary_id) || ""); ch.ability_2 = adjudicate(key, "ability_2", aA[2] || "", BABIL.get(bd.ability_secondary_id) || ""); ch.ability_hidden = adjudicate(key, "ability_hidden", aA.h || "", BABIL.get(bd.ability_hidden_id) || "");
    const nm = {}; for (const [l, v] of Object.entries(n)) nm[l] = v.name;
    for (const [k, code] of Object.entries(NDEX_LANG)) { if (code === "ja-roma" && nm[code]) continue; /* trademark romaji wins outright */ nm[code] = adjudicate(key, "name_" + code, nm[code], bnm[k]); }
    ch.names = nm;
    // conflict-view rows for the overrides file come from the same adjudicate() calls (usedOvr)
    chosenStats.set(dex, ch);
    speciesRows.push({ species: dex, identifier: s.identifier, generation: s.generation_id, evolves_from_species: s.evolves_from_species_id, evolution_chain_id: ovr(key, "evolution_chain_id") ? chainOf.get(s.evolves_from_species_id) : s.evolution_chain_id, color: ch.color, shape: SHAPE.get(s.shape_id) || "", habitat: HABITAT.get(s.habitat_id) || "", gender_rate: genderRate(ch.pct_male), percent_male: ch.pct_male === "???" ? "" : ch.pct_male, capture_rate: ch.catch_rate, hatch_counter: ch.hatch_cycles, has_gender_differences: s.has_gender_differences, growth_rate: GROWTH_DB[ch.growth_rate], forms_switchable: s.forms_switchable, is_legendary: ch.is_legendary, is_mythical: ch.is_mythical, is_baby: ch.is_baby, is_ultra_beast: bool(bd2.is_ultrabeast), is_paradox: bool(bd2.is_paradox), is_fossil: bool(bd2.is_fossil), is_first_partner: bool(bd2.is_first_partner), origin_region: bd2.origin_region_identifier || "", order: s.order, conquest_order: s.conquest_order });
    if (ovr(key, "evolution_chain_id")) usedOvr.add(ovr(key, "evolution_chain_id"));
    const nrow = { species: dex }; for (const [l, v] of Object.entries(nm)) if (v) nrow[col("name", l)] = v; speciesNameRows.push(nrow);
    const grow = { species: dex }; for (const [l, v] of Object.entries(n)) if (v.genus) grow[col("genus", l)] = l === "en" ? ch.genus : v.genus; genusRows.push(grow);
    // BUGFIX 2026-09-06 (Phase 1 csv/ rewire): ch.egg_groups is alphabetized
    // by display name so the two sources can be compared, but that string
    // was then stored verbatim — losing PokeAPI's row order, which IS the
    // real slot order (Bulbasaur is Monster/Grass, not Grass/Monster;
    // Bulbapedia agrees). 12 species came out reversed. Re-order the
    // adjudicated set back into A's row order, appending anything only
    // PokeDB had.
    const egSet = new Set(ch.egg_groups.split("/").filter(Boolean).map(dbEgg));
    const egInA = (aEggs[dex] || []).filter(x => egSet.has(x));
    const eg = egInA.concat([...egSet].filter(x => egInA.indexOf(x) === -1));
    eggRows.push({ species: dex, egg_group_1: eg[0] || "", egg_group_2: eg[1] || "" });
    // base friendship: PokeDB owns both era columns; PokeAPI's era-mixed base_happiness cross-checked against the era its species belongs to
    const f37 = clean(np1.base_friendship_gen3_7), f8 = clean(np1.base_friendship_gen8);
    const era = +s.generation_id <= 7 ? ["base_friendship_gen3-7", f37] : ["base_friendship_gen8plus", f8];
    if (era[1] !== "" && s.base_happiness !== "" && !same(era[1], s.base_happiness)) logC(era[0], dex, "base_friendship", s.base_happiness, era[1], era[1]);
    const v37 = +s.generation_id <= 7 ? (f37 || s.base_happiness) : ""; if (v37 !== "") friend37.push({ species: dex, base_friendship: v37 });
    const v8 = f8 || (+s.generation_id >= 8 ? s.base_happiness : ""); if (v8 !== "") friend8.push({ species: dex, base_friendship: v8 });
  }
  // overrides file: every entry, with both sources' actual values
  {
    const { a, b } = require("./compare").pairings.species();
    for (const o of SPECIES_OVERRIDES) {
      const ra = a.get(String(o.dex)) || {}, rb = b.get(String(o.dex)) || {};
      let av = ra[o.field], bv = rb[o.field];
      if (o.field === "evolution_chain_id") { av = "429 (own chain)"; bv = "tree 420 shared with #808"; }
      const chosen = o.chosen === "pokeapi" ? av : o.chosen === "pokedb" ? bv : o.chosen;
      overrideRows.push({ dex_id: o.dex, pokemon_name: (ra.name_en || ""), field: o.field, pokeapi_value: clean(av), pokedb_value: clean(bv), chosen_value: clean(chosen), chosen_source: o.chosen === "pokeapi" || o.chosen === "pokedb" ? o.chosen : "bulbapedia", reason: o.reason, applied: usedOvr.has(o) ? "1" : "0" });
      if (!usedOvr.has(o)) console.log(`override on record only (no live conflict after normalization / PokeDB blank): #${o.dex} ${o.field}`);
    }
    fs.writeFileSync(path.join(__dirname, "species_field_overrides.csv"), stringify(overrideRows, ["dex_id", "pokemon_name", "field", "pokeapi_value", "pokedb_value", "chosen_value", "chosen_source", "reason", "applied"]));
  }
  const SPFK = { species: "species.species" };
  out("species.csv", speciesRows, ["species", "identifier", "generation", "evolves_from_species", "evolution_chain_id", "color", "shape", "habitat", "gender_rate", "percent_male", "capture_rate", "hatch_counter", "has_gender_differences", "growth_rate", "forms_switchable", "is_legendary", "is_mythical", "is_baby", "is_ultra_beast", "is_paradox", "is_fossil", "is_first_partner", "origin_region", "order", "conquest_order"], { generation: "generations.id", evolves_from_species: "species.species", evolution_chain_id: "evolution_chains.id", color: "colors.identifier", shape: "shapes.identifier", habitat: "habitats.identifier", growth_rate: "growth_rates.identifier", origin_region: "regions.identifier" });
  out("species_names.csv", speciesNameRows, ["species"], SPFK);
  out("species_genera.csv", genusRows, ["species"], SPFK);
  out("pokemon_egg_groups.csv", eggRows, ["species", "egg_group_1", "egg_group_2"], { ...SPFK, egg_group_1: "egg_groups.identifier", egg_group_2: "egg_groups.identifier" });
  out("base_friendship_gen3-7.csv", friend37, ["species", "base_friendship"], SPFK);
  out("base_friendship_gen8plus.csv", friend8, ["species", "base_friendship"], SPFK);
  const usedChains = new Set(speciesRows.map(r => r.evolution_chain_id));
  out("evolution_chains.csv", A("evolution_chains.csv").filter(r => usedChains.has(r.id)).map(r => ({ id: r.id, baby_trigger_item: ITEM.get(r.baby_trigger_item_id) || "" })), ["id", "baby_trigger_item"], { baby_trigger_item: "items.identifier" });
  out("species_prose.csv", A("pokemon_species_prose.csv").map(r => ({ species: r.pokemon_species_id, language: LANGID.get(r.local_language_id), form_description: r.form_description })), ["species", "language", "form_description"], { ...SPFK, language: "languages.identifier" });
  out("pokemon_dex_numbers.csv", A("pokemon_dex_numbers.csv").map(r => ({ species: r.species_id, pokedex: POKEDEX.get(r.pokedex_id), number: r.pokedex_number })), ["species", "pokedex", "number"], { ...SPFK, pokedex: "pokedexes.identifier" });
  out("pal_park.csv", A("pal_park.csv").map(r => ({ species: r.species_id, area: PPAREA.get(r.area_id), base_score: r.base_score, rate: r.rate })), ["species", "area", "base_score", "rate"], { ...SPFK, area: "pal_park_areas.identifier" });
  // evolution: ids -> identifiers
  out("pokemon_evolution.csv", A("pokemon_evolution.csv").map(r => ({ id: r.id, evolved_species: r.evolved_species_id, trigger: ETRIG.get(r.evolution_trigger_id), version_group: vgId.get(r.version_group_id) || "", is_default: r.is_default, trigger_item: ITEM.get(r.trigger_item_id) || "", minimum_level: r.minimum_level, gender: GENDER.get(r.gender_id) || "", location: LOC.get(r.location_id) || "", held_item: ITEM.get(r.held_item_id) || "", time_of_day: r.time_of_day, known_move: MOVE.get(r.known_move_id) || "", known_move_type: TYPE.get(r.known_move_type_id) || "", minimum_happiness: r.minimum_happiness, minimum_beauty: r.minimum_beauty, minimum_affection: r.minimum_affection, relative_physical_stats: r.relative_physical_stats, party_species: r.party_species_id, party_type: TYPE.get(r.party_type_id) || "", trade_species: r.trade_species_id, needs_overworld_rain: r.needs_overworld_rain, turn_upside_down: r.turn_upside_down, needs_multiplayer: r.needs_multiplayer, near_special_rock: r.near_special_rock, region: REGION.get(r.region_id) || "", // BUGFIX 2026-09-06 (Phase 1 csv/ rewire): pokemon_evolution's
    // base_form_id/evolved_form_id reference **pokemon.id**, not
    // pokemon_forms.id — the two id spaces only coincide below 10000, so
    // every alt-form reference (Meowth-Galar 10161, Slowpoke-Galar 10164,
    // Farfetch'd-Galar 10166, Qwilfish-Hisui 10234, Sneasel-Hisui 10235...)
    // resolved to an unrelated form (vivillon-fancy, latias-mega,
    // swampert-mega, silvally-*). 34 of 58 base_form cells were wrong.
    // The FK check passed because the wrong values are still valid
    // pokemon_forms identifiers. pokemon_form_changes.csv (below) keeps
    // formIdent — ITS base_form_id really is a pokemon_forms.id.
    base_form: r.base_form_id ? (PKID.get(r.base_form_id) || {}).identifier || "" : "", evolved_form: r.evolved_form_id ? (PKID.get(r.evolved_form_id) || {}).identifier || "" : "", used_move: MOVE.get(r.used_move_id) || "", minimum_move_count: r.minimum_move_count, minimum_steps: r.minimum_steps, minimum_damage_taken: r.minimum_damage_taken })),
    ["id", "evolved_species", "trigger", "version_group", "is_default", "trigger_item", "minimum_level", "gender", "location", "held_item", "time_of_day", "known_move", "known_move_type", "minimum_happiness", "minimum_beauty", "minimum_affection", "relative_physical_stats", "party_species", "party_type", "trade_species", "needs_overworld_rain", "turn_upside_down", "needs_multiplayer", "near_special_rock", "region", "base_form", "evolved_form", "used_move", "minimum_move_count", "minimum_steps", "minimum_damage_taken"],
    { evolved_species: "species.species", trigger: "evolution_triggers.identifier", version_group: "version_groups.identifier", trigger_item: "items.identifier", location: "locations.identifier", held_item: "items.identifier", known_move: "moves.identifier", known_move_type: "types.identifier", party_species: "species.species", party_type: "types.identifier", trade_species: "species.species", region: "regions.identifier", base_form: "pokemon.identifier", evolved_form: "pokemon.identifier", used_move: "moves.identifier" });
  // ---- pokemon (forms) + per-form tables
  const bFormByPk = new Map();   // PokeAPI pokemon identifier -> PokeDB form row (first non-cosmetic alias)
  for (const f of BFORMS) { const a = formAlias.get(f.identifier); if (a && a.how !== "cosmetic" && !bFormByPk.has(a.pokemon)) bFormByPk.set(a.pokemon, f); }
  const pkRows = [], statRows = [], typeRowsP = [], abilRows = [], bexp56 = [], bexp7 = [];
  const formNamesEn = new Map(); for (const r of A("pokemon_form_names.csv")) if (r.local_language_id === "9") formNamesEn.set(r.pokemon_form_id, r);
  const SNAME = { 1: ["hp", "stat_hp", "ev_yield_hp"], 2: ["attack", "stat_attack", "ev_yield_atk"], 3: ["defense", "stat_defense", "ev_yield_def"], 4: ["special_attack", "stat_spatk", "ev_yield_spatk"], 5: ["special_defense", "stat_spdef", "ev_yield_spdef"], 6: ["speed", "stat_speed", "ev_yield_speed"] };
  const SHORT = { hp: "hp", attack: "atk", defense: "def", special_attack: "spa", special_defense: "spd", speed: "spe" };
  for (const p of PK) {
    const s = SP.get(p.species_id), b = bFormByPk.get(p.identifier) || {}, ch = p.is_default === "1" ? chosenStats.get(p.species_id) : null, k = p.identifier;
    const df = FORMS.find(f => f.pokemon_id === p.id && f.is_default === "1");
    const h = ch ? ch.height_m : pick("pokemon", k, "height_m", String(+p.height / 10), (b.height_m || "").replace(/m$/, ""));
    const w = ch ? ch.weight_kg : pick("pokemon", k, "weight_kg", String(+p.weight / 10), (b.weight_kg || "").replace(/kg$/, ""));
    pkRows.push({ identifier: k, id: p.id, species: p.species_id, is_default: p.is_default, height_m: h, weight_kg: w, order: p.order, is_mega: df ? df.is_mega : "", is_gmax: /-gmax$/.test(k) ? "1" : "0", form_name: p.is_default === "1" ? (formNamesEn.get((df || {}).id) || {}).form_name || "" : b.form_name || (formNamesEn.get((df || {}).id) || {}).form_name || "", source: b.id ? "both" : "pokeapi" });
    // EV yields: PokeAPI's 49 Legends: Z-A Mega rows are all-zero placeholders, and three regional forms carry their base
    // form's yield (Bulbapedia-verified 2026-09-06) -> PokeDB's line is taken for those, logged with chosen=pokedb
    const evTotal = Object.keys(SNAME).reduce((n, id) => n + (+(((aStats[p.id] || {})[id] || {}).effort) || 0), 0);
    const evFromDb = !ch && b.id && (evTotal === 0 || EV_FROM_POKEDB.has(k));
    const st = { pokemon: k }; for (const [id, [nm, bs, be]] of Object.entries(SNAME)) { const sh = SHORT[nm]; st[nm] = ch ? ch["stat_" + sh] : pick("pokemon_stats", k, nm, ((aStats[p.id] || {})[id] || {}).base_stat, b[bs]); const ae = ((aStats[p.id] || {})[id] || {}).effort; st["ev_" + nm] = ch ? ch["ev_" + sh] : evFromDb ? (same(ae, b[be]) ? ae : (logC("pokemon_stats", k, "ev_" + nm, ae, b[be], b[be]), b[be])) : pick("pokemon_stats", k, "ev_" + nm, ae, b[be]); }
    statRows.push(st);
    const t = aTypes[p.id] || {}; typeRowsP.push({ pokemon: k, type_1: ch ? ch.type_1 : pick("pokemon_types", k, "type_1", t[1], BTYPE.get(b.type_1_id) || ""), type_2: ch ? ch.type_2 : pick("pokemon_types", k, "type_2", t[2] || "", BTYPE.get(b.type_2_id) || "") });
    const ab = aAbil[p.id] || {}; abilRows.push({ pokemon: k, ability_1: ch ? ch.ability_1 : pick("pokemon_abilities", k, "ability_1", ab[1] || "", BABIL.get(b.ability_primary_id) || ""), ability_2: ch ? ch.ability_2 : pick("pokemon_abilities", k, "ability_2", ab[2] || "", BABIL.get(b.ability_secondary_id) || ""), ability_hidden: ch ? ch.ability_hidden : pick("pokemon_abilities", k, "ability_hidden", ab.h || "", BABIL.get(b.ability_hidden_id) || "") });
    // base experience: PokeAPI = Gen 5-6 era values (species of gen <= 6 only), PokeDB = Gen 7+ era
    if (+s.generation_id <= 6 && p.base_experience !== "") bexp56.push({ pokemon: k, base_experience: p.base_experience });
    const b7 = clean(b.base_experience) || (+s.generation_id >= 7 ? p.base_experience : "");
    if (b7 !== "") { if (b.base_experience && p.base_experience && !same(b.base_experience, p.base_experience) && +s.generation_id >= 7) logC("base_experience_gen7plus", k, "base_experience", p.base_experience, b.base_experience, b.base_experience); bexp7.push({ pokemon: k, base_experience: b7, source: clean(b.base_experience) ? "pokedb" : "pokeapi" }); }
  }
  for (const f of newForms) {  // PokeDB-only forms
    const k = f.identifier; pkRows.push({ identifier: k, id: "", species: f.ndex_id, is_default: "0", height_m: (f.height_m || "").replace(/m$/, ""), weight_kg: (f.weight_kg || "").replace(/kg$/, ""), order: "", is_mega: "0", is_gmax: "0", form_name: f.form_name, source: "pokedb" });
    const st = { pokemon: k }; for (const [, [nm, bs, be]] of Object.entries(SNAME)) { st[nm] = f[bs]; st["ev_" + nm] = f[be]; } statRows.push(st);
    typeRowsP.push({ pokemon: k, type_1: BTYPE.get(f.type_1_id) || "", type_2: BTYPE.get(f.type_2_id) || "" });
    abilRows.push({ pokemon: k, ability_1: BABIL.get(f.ability_primary_id) || "", ability_2: BABIL.get(f.ability_secondary_id) || "", ability_hidden: BABIL.get(f.ability_hidden_id) || "" });
    if (f.base_experience) bexp7.push({ pokemon: k, base_experience: f.base_experience, source: "pokedb" });
  }
  const PKFK = { pokemon: "pokemon.identifier" };
  out("pokemon.csv", pkRows, ["identifier", "id", "species", "is_default", "height_m", "weight_kg", "order", "is_mega", "is_gmax", "form_name", "source"], { species: "species.species" });
  out("pokemon_stats.csv", statRows, ["pokemon", "hp", "attack", "defense", "special_attack", "special_defense", "speed", "ev_hp", "ev_attack", "ev_defense", "ev_special_attack", "ev_special_defense", "ev_speed"], PKFK);
  out("pokemon_types.csv", typeRowsP, ["pokemon", "type_1", "type_2"], { ...PKFK, type_1: "types.identifier", type_2: "types.identifier" });
  out("pokemon_abilities.csv", abilRows, ["pokemon", "ability_1", "ability_2", "ability_hidden"], { ...PKFK, ability_1: "abilities.identifier", ability_2: "abilities.identifier", ability_hidden: "abilities.identifier" });
  out("base_experience_gen5-6.csv", bexp56, ["pokemon", "base_experience"], PKFK);
  out("base_experience_gen7plus.csv", bexp7, ["pokemon", "base_experience", "source"], PKFK);
  const pkIdent2 = id => (PKID.get(id) || {}).identifier;
  out("pokemon_stats_history.csv", A("pokemon_stats_past.csv").map(r => ({ pokemon: pkIdent2(r.pokemon_id), last_generation: r.generation_id, stat: STAT.get(r.stat_id), base_stat: r.base_stat, effort: r.effort })), ["pokemon", "last_generation", "stat", "base_stat", "effort"], { ...PKFK, last_generation: "generations.id", stat: "stats.identifier" });
  const tp = {}; for (const r of A("pokemon_types_past.csv")) ((tp[r.pokemon_id + "|" + r.generation_id] ||= { pokemon: pkIdent2(r.pokemon_id), last_generation: r.generation_id })["type_" + r.slot] = TYPE.get(r.type_id));
  out("pokemon_types_history.csv", Object.values(tp).map(r => ({ type_2: "", ...r })), ["pokemon", "last_generation", "type_1", "type_2"], { ...PKFK, last_generation: "generations.id", type_1: "types.identifier", type_2: "types.identifier" });
  out("pokemon_abilities_history.csv", A("pokemon_abilities_past.csv").map(r => ({ pokemon: pkIdent2(r.pokemon_id), last_generation: r.generation_id, slot: r.slot, is_hidden: r.is_hidden, ability: ABIL.get(r.ability_id) || "" })), ["pokemon", "last_generation", "slot", "is_hidden", "ability"], { ...PKFK, last_generation: "generations.id", ability: "abilities.identifier" });
  // forms (incl. cosmetic) + names
  const fn = langMap("pokemon_form_names.csv", "pokemon_form_id", ["form_name", "pokemon_name"]);
  out("pokemon_forms.csv", FORMS.map(r => wide(fn, r.id, ["form_name", "pokemon_name"], { identifier: r.identifier, id: r.id, pokemon: pkIdent2(r.pokemon_id), form_identifier: r.form_identifier, introduced_in_version_group: EXCL_VG.has(vgId.get(r.introduced_in_version_group_id)) ? "red-blue" : vgId.get(r.introduced_in_version_group_id) || "", is_default: r.is_default, is_battle_only: r.is_battle_only, is_mega: r.is_mega, form_order: r.form_order, order: r.order })).concat(newForms.map(f => ({ identifier: f.identifier, id: "", pokemon: f.identifier, form_identifier: f.identifier.replace(/^[^-]+-/, ""), introduced_in_version_group: "", is_default: "0", is_battle_only: "", is_mega: "0", form_order: "", order: "", form_name_en: f.form_name }))), ["identifier", "id", "pokemon", "form_identifier", "introduced_in_version_group", "is_default", "is_battle_only", "is_mega", "form_order", "order"], { ...PKFK, introduced_in_version_group: "version_groups.identifier" });
  const FFK = { form: "pokemon_forms.identifier" };
  out("pokemon_form_types.csv", A("pokemon_form_types.csv").map(r => ({ form: formIdent(r.pokemon_form_id), slot: r.slot, type: TYPE.get(r.type_id) })), ["form", "slot", "type"], { ...FFK, type: "types.identifier" });
  out("pokemon_form_generations.csv", A("pokemon_form_generations.csv").map(r => ({ form: formIdent(r.pokemon_form_id), generation: r.generation_id, game_index: r.game_index })), ["form", "generation", "game_index"], { ...FFK, generation: "generations.id" });
  out("pokemon_form_changes.csv", A("pokemon_form_conditions.csv").map(r => ({ form: formIdent(r.pokemon_form_id), trigger: FTRIG.get(r.form_trigger_id), trigger_item: ITEM.get(r.trigger_item_id) || "", trigger_ability: ABIL.get(r.trigger_ability_id) || "", trigger_move: MOVE.get(r.trigger_move_id) || "", base_form: formIdent(r.base_form_id) })), ["form", "trigger", "trigger_item", "trigger_ability", "trigger_move", "base_form"], { ...FFK, trigger: "pokemon_form_triggers.identifier", trigger_item: "items.identifier", trigger_ability: "abilities.identifier", trigger_move: "moves.identifier", base_form: "pokemon_forms.identifier" });
  out("pokemon_form_flavor_text.csv", A("pokemon_form_flavor_text.csv").filter(r => !exclVer.has(verId.get(r.version_id))).map(r => ({ form: formIdent(r.pokemon_form_id), version: verId.get(r.version_id), language: LANGID.get(r.language_id), flavor_text: r.flavor_text })), ["form", "version", "language", "flavor_text"], { ...FFK, version: "versions.identifier", language: "languages.identifier" });
  out("pokemon_form_pokeathlon_stats.csv", A("pokemon_form_pokeathlon_stats.csv").map(r => ({ form: formIdent(r.pokemon_form_id), pokeathlon_stat: PATH.get(r.pokeathlon_stat_id), minimum_stat: r.minimum_stat, base_stat: r.base_stat, maximum_stat: r.maximum_stat })), ["form", "pokeathlon_stat", "minimum_stat", "base_stat", "maximum_stat"], { ...FFK, pokeathlon_stat: "pokeathlon_stats.identifier" });
  const heldRows = A("pokemon_items.csv").filter(r => !exclVer.has(verId.get(r.version_id))).map(r => ({ pokemon: pkIdent2(r.pokemon_id), version_group: verVg.get(verId.get(r.version_id)), version: verId.get(r.version_id), item: ITEM.get(r.item_id), rarity: r.rarity }));
  splitOut("pokemon_held_items", heldRows, "version_group", ["pokemon", "version_group", "version", "item", "rarity"], { ...PKFK, version_group: "version_groups.identifier", version: "versions.identifier", item: "items.identifier" });
  // form aliases (for review)
  fs.writeFileSync(path.join(__dirname, "form_aliases.csv"), stringify([...formAlias.entries()].map(([k, v]) => ({ pokedb_form: k, pokemon: v.pokemon, form: v.form, how: v.how })), ["pokedb_form", "pokemon", "form", "how"]));
  fs.writeFileSync(path.join(__dirname, "item_aliases.csv"), stringify([...itemAlias.entries()].filter(([k, v]) => v.how !== "identical").map(([k, v]) => ({ pokedb_item: k, item: v.item, how: v.how })), ["pokedb_item", "item", "how"]));

  // ---- species flavor text: PokeAPI (species x version x language) + PokeDB English gap-fill (form x version)
  const flav = new Map(); const fkey = (sp, form, ver, lang) => `${sp}|${form}|${ver}|${lang}`;
  const flavRows = [];
  for (const r of A("pokemon_species_flavor_text.csv")) { const v = verId.get(r.version_id); if (exclVer.has(v)) continue; const row = { species: r.species_id, form: "", version_group: verVg.get(v), version: v, language: LANGID.get(r.language_id), flavor_text: r.flavor_text }; flav.set(fkey(r.species_id, "", v, row.language), row); flavRows.push(row); }
  const ndexByForm = new Map(BFORMS.map(r => [r.identifier, r.ndex_id]));
  for (const r of B("flavor_texts.csv")) {
    const vv = dbVer(r.version_identifier); if (!vv) { drop("species_flavor_text", r.version_identifier); continue; }
    const a = formAlias.get(r.pokemon_form_identifier), sp = ndexByForm.get(r.pokemon_form_identifier);
    const isDef = a.pokemon === defaultPk.get(sp), form = isDef ? "" : a.pokemon;
    const k = fkey(sp, form, vv.version, "en");
    if (flav.has(k)) { pickText("species_flavor_text", `${sp}/${form || "default"}/${vv.version}`, "flavor_text", flav.get(k).flavor_text, r.flavor_text); continue; }
    if (form && flav.has(fkey(sp, "", vv.version, "en")) && same(flav.get(fkey(sp, "", vv.version, "en")).flavor_text, r.flavor_text)) continue;   // same text as the species entry
    const row = { species: sp, form, version_group: vv.version_group, version: vv.version, language: "en", flavor_text: r.flavor_text }; flav.set(k, row); flavRows.push(row);
  }
  splitOut("species_flavor_text", flavRows, "version_group", ["species", "form", "version_group", "version", "language", "flavor_text"], { species: "species.species", form: "pokemon.identifier", version_group: "version_groups.identifier", version: "versions.identifier", language: "languages.identifier" });

  // ---- abilities
  const abilRowsT = [], abilNameRows = [];
  const an = langMap("ability_names.csv", "ability_id", ["name"]);
  const bAb = new Map(B("abilities.csv").map(r => [r.identifier, r]));
  for (const r of A("abilities.csv")) {
    if (r.is_main_series !== "1") { drop("abilities", "not-main-series"); continue; }
    const b = bAb.get(r.identifier) || {};
    abilRowsT.push({ identifier: r.identifier, id: r.id, generation: pick("abilities", r.identifier, "generation", r.generation_id, b.generation_id), source: b.id ? "both" : "pokeapi" });
    const nr = wide(an, r.id, ["name"], { ability: r.identifier }); nr.name_en = pick("ability_names", r.identifier, "name_en", nr.name_en, b.name); abilNameRows.push(nr);
  }
  drop("abilities", "pokedb-not-main-series", B("abilities.csv").filter(r => r.is_main_series !== "true").length);
  out("abilities.csv", abilRowsT, ["identifier", "id", "generation", "source"], { generation: "generations.id" });
  out("ability_names.csv", abilNameRows, ["ability"], { ability: "abilities.identifier" });
  const abilSet = new Set(abilRowsT.map(r => r.identifier));
  out("ability_effects.csv", A("ability_prose.csv").filter(r => abilSet.has(ABIL.get(r.ability_id))).map(r => ({ ability: ABIL.get(r.ability_id), language: LANGID.get(r.local_language_id), short_effect: r.short_effect, effect: r.effect })), ["ability", "language", "short_effect", "effect"], { ability: "abilities.identifier", language: "languages.identifier" });
  const aft = new Map(), aftRows = [];
  for (const r of A("ability_flavor_text.csv")) { const vg = vgId.get(r.version_group_id); if (!vgOk(vg) || !abilSet.has(ABIL.get(r.ability_id))) continue; const row = { ability: ABIL.get(r.ability_id), version_group: vg, language: LANGID.get(r.language_id), flavor_text: r.flavor_text }; aft.set(`${row.ability}|${vg}|${row.language}`, row); aftRows.push(row); }
  const bAbById = new Map(B("abilities.csv").map(r => [r.id, r.identifier]));
  for (const r of B("ability_flavor_texts.csv")) { const vv = dbVer(r.version_identifier), ab = bAbById.get(r.ability_id); if (!vv) { drop("ability_flavor_text", r.version_identifier); continue; } if (!abilSet.has(ab)) continue; const k = `${ab}|${vv.version_group}|en`; if (aft.has(k)) pickText("ability_flavor_text", `${ab}/${vv.version_group}`, "flavor_text", aft.get(k).flavor_text, r.flavor_text); else { const row = { ability: ab, version_group: vv.version_group, language: "en", flavor_text: r.flavor_text }; aft.set(k, row); aftRows.push(row); } }
  splitOut("ability_flavor_text", aftRows, "version_group", ["ability", "version_group", "language", "flavor_text"], { ability: "abilities.identifier", version_group: "version_groups.identifier", language: "languages.identifier" });
  const acp = langMap("ability_changelog_prose.csv", "ability_changelog_id", ["effect"]);
  out("abilities_history.csv", A("ability_changelog.csv").map(r => wide(acp, r.id, ["effect"], { ability: ABIL.get(r.ability_id), changed_in_version_group: vgId.get(r.changed_in_version_group_id) })), ["ability", "changed_in_version_group"], { ability: "abilities.identifier", changed_in_version_group: "version_groups.identifier" });

  // ---- moves (PokeDB single-row Z-moves + G-Max moves adopted; PokeAPI --physical/--special rows dropped)
  const mn = langMap("move_names.csv", "move_id", ["name"]);
  const bMv = new Map(B("moves.csv").map(r => [r.identifier === "twinkle-tackle--physical" ? "twinkle-tackle" : r.identifier, r]));
  const MOVE_DB_LANG = { name: "en", name_jp: "ja", name_jp_romanized: "ja-roma", name_fr: "fr", name_ger: "de", name_it: "it", name_es: "es", name_kr: "ko", name_kr_romanized: "ko-latn", name_cn_romanized: "zh-latn" };
  const SHADOW_DE = new Set(); // PokeDB's German names for the 18 Shadow moves are rotated by one row: never take them
  for (const r of A("moves.csv")) if (TYPE.get(r.type_id) === "shadow") SHADOW_DE.add(r.identifier);
  const bDmg = L.bDmg, bTargetRaw = new Map(B("move_targets.csv").map(r => [r.id, r.identifier]));
  // PokeDB target vocabulary -> PokeAPI's, by majority vote over the 902 shared moves (PokeDB "normal" = PokeAPI "selected-pokemon", etc.)
  const tv = {}; for (const b of B("moves.csv")) { const a = A("moves.csv").find(x => x.identifier === b.identifier); if (a) { const k = bTargetRaw.get(b.move_target_id); ((tv[k] ||= {})[TARGET.get(a.target_id)] = ((tv[k] || {})[TARGET.get(a.target_id)] || 0) + 1); } }
  const TARGET_DB = Object.fromEntries(Object.entries(tv).map(([k, v]) => [k, Object.entries(v).sort((x, y) => y[1] - x[1])[0][0]]));
  const bTarget = new Map([...bTargetRaw].map(([id, ident]) => [id, TARGET_DB[ident] || ident]));
  const moveRows = [], moveNameRows = [], moveIdent = new Map();   // merged identifier -> id
  const zBase = s => s.replace(/--(physical|special)$/, "");
  for (const r of A("moves.csv")) {
    if (/--(physical|special)$/.test(r.identifier)) { drop("moves", "z-move-split-row"); continue; }
    const b = bMv.get(r.identifier) || {};
    const dc = DMG.get(r.damage_class_id), bdc = bDmg.get(b.damage_category_id) || "";
    const row = { identifier: r.identifier, id: r.id, generation: r.generation_id, type: TYPE.get(r.type_id), power: pick("moves", r.identifier, "power", r.power, b.power), pp: pick("moves", r.identifier, "pp", r.pp, b.pp), accuracy: pick("moves", r.identifier, "accuracy", r.accuracy, b.accuracy), priority: pick("moves", r.identifier, "priority", r.priority, b.priority), target: TARGET.get(r.target_id), damage_class: pick("moves", r.identifier, "damage_class", dc, bdc), effect_id: r.effect_id, effect_chance: r.effect_chance, contest_type: CTYPE.get(r.contest_type_id) || "", contest_effect_id: r.contest_effect_id, super_contest_effect_id: r.super_contest_effect_id, source: b.id ? "both" : "pokeapi" };
    moveRows.push(row); moveIdent.set(r.identifier, r.id);
    const nr = wide(mn, r.id, ["name"], { move: r.identifier }); const bnr = splitZh(b.name_cn, bName(b, MOVE_DB_LANG, {}));
    for (const [k, v] of Object.entries(bnr)) { if (k === "name_de" && SHADOW_DE.has(r.identifier)) continue; nr[k] = pick("move_names", r.identifier, k, nr[k], v); }
    moveNameRows.push(nr);
  }
  // Z-moves: one row each, PokeDB shape; id = PokeAPI's --physical id (the lower one)
  const zIds = new Map(); for (const r of A("moves.csv")) if (/--physical$/.test(r.identifier)) zIds.set(zBase(r.identifier), r);
  for (const [ident, b] of bMv) if (!moveIdent.has(ident)) {
    const z = zIds.get(ident), zn = z ? mn.get(z.id) : null;
    const row = { identifier: ident, id: z ? z.id : b.id, generation: b.generation_id, type: BTYPE.get(b.type_id), power: b.power, pp: b.pp, accuracy: b.accuracy, priority: b.priority, target: z ? TARGET.get(z.target_id) : bTarget.get(b.move_target_id) || "", damage_class: bDmg.get(b.damage_category_id), effect_id: z ? z.effect_id : "", effect_chance: z ? z.effect_chance : "", contest_type: "", contest_effect_id: "", super_contest_effect_id: "", source: z ? "both" : "pokedb" };
    if (!z && moveRows.some(m => m.id === row.id)) row.id = "";
    moveRows.push(row); moveIdent.set(ident, row.id);
    const nr = { move: ident }; if (zn) for (const [l, v] of Object.entries(zn)) nr[col("name", l)] = v.name;
    for (const [k, v] of Object.entries(splitZh(b.name_cn, bName(b, MOVE_DB_LANG, {})))) nr[k] ||= v;
    moveNameRows.push(nr);
  }
  // PokeDB target vocabulary differs; keep PokeAPI's. move id -> merged identifier for PokeDB-keyed tables:
  const bMoveIdent = new Map(B("moves.csv").map(r => [r.id, r.identifier === "twinkle-tackle--physical" ? "twinkle-tackle" : r.identifier]));
  out("moves.csv", moveRows, ["identifier", "id", "generation", "type", "power", "pp", "accuracy", "priority", "target", "damage_class", "effect_id", "effect_chance", "contest_type", "contest_effect_id", "super_contest_effect_id", "source"], { generation: "generations.id", type: "types.identifier", target: "move_targets.identifier", damage_class: "move_damage_classes.identifier", effect_id: "move_effects.effect_id", contest_type: "contest_types.identifier", contest_effect_id: "contest_effects.id", super_contest_effect_id: "super_contest_effects.id" });
  out("move_names.csv", moveNameRows, ["move"], { move: "moves.identifier" });
  const mIdent = id => { const s = MOVE.get(id); return moveIdent.has(s) ? s : zBase(s); };
  out("move_effects.csv", A("move_effect_prose.csv").map(r => ({ effect_id: r.move_effect_id, language: LANGID.get(r.local_language_id), short_effect: r.short_effect, effect: r.effect })), ["effect_id", "language", "short_effect", "effect"], { language: "languages.identifier" });
  const bShort = new Map(B("move_short_effects.csv").map(r => [r.move_id, r.move_short_effect_markup])), bLong = new Map(B("move_long_effects.csv").map(r => [r.move_id, r.move_long_effect_markup]));
  out("move_effects_pokedb.csv", B("moves.csv").map(r => ({ move: bMoveIdent.get(r.id), short_effect: bShort.get(r.id) || "", long_effect: bLong.get(r.id) || "" })).filter(r => r.short_effect || r.long_effect), ["move", "short_effect", "long_effect"], { move: "moves.identifier" });
  const mft = new Map(), mftRows = [];
  for (const r of A("move_flavor_text.csv")) { const vg = vgId.get(r.version_group_id); if (!vgOk(vg)) continue; const row = { move: mIdent(r.move_id), version_group: vg, language: LANGID.get(r.language_id), flavor_text: r.flavor_text }; const k = `${row.move}|${vg}|${row.language}`; if (mft.has(k)) { if (!same(mft.get(k).flavor_text, row.flavor_text)) logC("move_flavor_text", `${row.move}/${vg}/${row.language}`, "flavor_text(z-split)", mft.get(k).flavor_text, row.flavor_text, mft.get(k).flavor_text); continue; } mft.set(k, row); mftRows.push(row); }
  for (const r of B("move_flavor_texts.csv")) { const vv = dbVer(r.version_identifier), mv = bMoveIdent.get(r.move_id); if (!vv) { drop("move_flavor_text", r.version_identifier); continue; } const k = `${mv}|${vv.version_group}|en`; if (mft.has(k)) pickText("move_flavor_text", `${mv}/${vv.version_group}`, "flavor_text", mft.get(k).flavor_text, r.flavor_text); else { const row = { move: mv, version_group: vv.version_group, language: "en", flavor_text: r.flavor_text }; mft.set(k, row); mftRows.push(row); } }
  splitOut("move_flavor_text", mftRows, "version_group", ["move", "version_group", "language", "flavor_text"], { move: "moves.identifier", version_group: "version_groups.identifier", language: "languages.identifier" });
  out("move_meta.csv", A("move_meta.csv").filter(r => !/--(physical|special)$/.test(MOVE.get(r.move_id)) || /--physical$/.test(MOVE.get(r.move_id))).map(r => ({ move: mIdent(r.move_id), category: MCAT.get(r.meta_category_id), ailment: AILMENT.get(r.meta_ailment_id), min_hits: r.min_hits, max_hits: r.max_hits, min_turns: r.min_turns, max_turns: r.max_turns, drain: r.drain, healing: r.healing, crit_rate: r.crit_rate, ailment_chance: r.ailment_chance, flinch_chance: r.flinch_chance, stat_chance: r.stat_chance })), ["move", "category", "ailment", "min_hits", "max_hits", "min_turns", "max_turns", "drain", "healing", "crit_rate", "ailment_chance", "flinch_chance", "stat_chance"], { move: "moves.identifier", category: "move_meta_categories.identifier", ailment: "move_meta_ailments.identifier" });
  out("move_meta_stat_changes.csv", A("move_meta_stat_changes.csv").map(r => ({ move: mIdent(r.move_id), stat: STAT.get(r.stat_id), change: r.change })), ["move", "stat", "change"], { move: "moves.identifier", stat: "stats.identifier" });
  const fm = new Set(); const fmRows = [];
  for (const r of A("move_flag_map.csv")) { const k = mIdent(r.move_id) + "|" + MFLAG.get(r.move_flag_id); if (!fm.has(k)) { fm.add(k); fmRows.push({ move: mIdent(r.move_id), flag: MFLAG.get(r.move_flag_id) }); } }
  const bFlag = idMap(B("move_flags.csv"));
  for (const r of B("move_flag_maps.csv")) { const k = bMoveIdent.get(r.move_id) + "|" + bFlag.get(r.move_flag_id); if (!fm.has(k)) { fm.add(k); fmRows.push({ move: bMoveIdent.get(r.move_id), flag: bFlag.get(r.move_flag_id) }); } }
  out("move_flag_map.csv", fmRows, ["move", "flag"], { move: "moves.identifier", flag: "move_flags.identifier" });
  const slug = s => s.toLowerCase().replace(/%/g, "pct").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const bMetaCat = new Map(B("move_meta_categories.csv").map(r => [r.id, r]));
  out("move_tag_categories.csv", B("move_meta_categories.csv").map(r => ({ identifier: slug(r.identifier), name: r.identifier, description: r.description })), ["identifier", "name", "description"]);
  out("move_tags.csv", B("move_metas.csv").map(r => ({ move: bMoveIdent.get(r.move_id), tag: slug(bMetaCat.get(r.move_meta_category_id).identifier) })), ["move", "tag"], { move: "moves.identifier", tag: "move_tag_categories.identifier" });
  out("moves_history.csv", A("move_changelog.csv").map(r => ({ move: mIdent(r.move_id), changed_in_version_group: vgId.get(r.changed_in_version_group_id), type: TYPE.get(r.type_id) || "", power: r.power, pp: r.pp, accuracy: r.accuracy, priority: r.priority, target: TARGET.get(r.target_id) || "", effect_id: r.effect_id, effect_chance: r.effect_chance })), ["move", "changed_in_version_group", "type", "power", "pp", "accuracy", "priority", "target", "effect_id", "effect_chance"], { move: "moves.identifier", changed_in_version_group: "version_groups.identifier", type: "types.identifier", target: "move_targets.identifier", effect_id: "move_effects.effect_id" });
  out("move_effects_history.csv", A("move_effect_changelog.csv").map(r => wide(langMap("move_effect_changelog_prose.csv", "move_effect_changelog_id", ["effect"]), r.id, ["effect"], { effect_id: r.effect_id, changed_in_version_group: vgId.get(r.changed_in_version_group_id) })), ["effect_id", "changed_in_version_group"], { effect_id: "move_effects.effect_id", changed_in_version_group: "version_groups.identifier" });

  // ---- learnsets: PokeAPI base; PokeDB rows only for (pokemon, version_group) pairs PokeAPI has nothing for
  const ls = new Map(), lsRows = [], lsPairs = new Set();
  for (const r of A("pokemon_moves.csv")) {
    const vg = vgId.get(r.version_group_id); if (!vgOk(vg)) { drop("learnsets", "jp-rgb"); continue; }
    const row = { pokemon: pkIdent2(r.pokemon_id), version_group: vg, method: MMETH.get(r.pokemon_move_method_id), move: mIdent(r.move_id), level: r.level, order: r.order, mastery: r.mastery };
    const k = `${row.pokemon}|${vg}|${row.method}|${row.move}|${row.level}`;   // a move can be learned at two levels (Ivysaur Leech Seed 1 + 7)
    if (ls.has(k)) continue;   // PokeAPI's own Z-move --physical/--special duplicates collapse
    ls.set(k, row); lsRows.push(row); lsPairs.add(`${row.pokemon}|${vg}`);
  }
  const BMETH = { 1: "level-up", 2: "egg", 3: "tutor", 4: "machine", 5: "stadium-surfing-pikachu", 6: "light-ball-egg", 7: "colosseum-purification", 8: "xd-shadow", 9: "xd-purification", 10: "form-change", 11: "zygarde-cube" };
  let dbFill = 0, dbSame = 0;
  for (const r of B("pokemon_moves.csv")) {
    const vv = dbVer(r.version_identifier); if (!vv) { drop("learnsets", r.version_identifier); continue; }
    const a = formAlias.get(bFormById.get(r.pokemon_form_id)), mv = bMoveIdent.get(r.move_id), m = BMETH[r.pokemon_move_method_id];
    const k = `${a.pokemon}|${vv.version_group}|${m}|${mv}|${r.level}`;
    if (ls.has(k)) { dbSame++; continue; }
    // a learnset is one value per (pokemon, version group): PokeDB only fills it when PokeAPI has none of it
    if (lsPairs.has(`${a.pokemon}|${vv.version_group}`)) { logC("learnsets", `${a.pokemon}|${vv.version_group}|${m}|${mv}`, "_row_", "missing", `level ${r.level}`, "missing"); continue; }
    const row = { pokemon: a.pokemon, version_group: vv.version_group, method: m, move: mv, level: r.level, order: "", mastery: "" }; ls.set(k, row); lsRows.push(row); dbFill++;
  }
  console.log(`learnsets: PokeDB matched ${dbSame}, gap-filled ${dbFill}`);
  splitOut("learnsets", lsRows, "version_group", ["pokemon", "version_group", "method", "move", "level", "order", "mastery"], { pokemon: "pokemon.identifier", version_group: "version_groups.identifier", method: "pokemon_move_methods.identifier", move: "moves.identifier" });
  // machines
  const mach = new Map(), machRows = [];
  for (const r of A("machines.csv")) { const vg = vgId.get(r.version_group_id); if (!vgOk(vg)) { drop("machines", "jp-rgb"); continue; } const row = { version_group: vg, machine: ITEM.get(r.item_id), machine_number: r.machine_number, move: mIdent(r.move_id) }; mach.set(`${vg}|${row.machine}`, row); machRows.push(row); }
  // a machine is one value per (version group, TM number): a PokeDB-only pair is a cell PokeAPI has no value for -> filled, logged
  for (const r of B("machines.csv")) { const vv = dbVer(r.version_identifier); if (!vv) { drop("machines", r.version_identifier); continue; } const it = aliasItem(r.item_identifier), k = `${vv.version_group}|${it}`; if (mach.has(k)) pick("machines", k, "move", mach.get(k).move, r.move_identifier); else { const row = { version_group: vv.version_group, machine: it, machine_number: String(+machineKey(it).replace(/\D/g, "")), move: r.move_identifier }; mach.set(k, row); machRows.push(row); logC("machines", k, "_row_", "missing", r.move_identifier, "filled from pokedb"); } }
  splitOut("machines", machRows, "version_group", ["version_group", "machine", "machine_number", "move"], { version_group: "version_groups.identifier", machine: "items.identifier", move: "moves.identifier" });

  // ---- items
  const bItem = new Map(BITEMS.map(r => [aliasItem(r.identifier), r])), bItemsUsed = new Set();
  const flagsOf = {}; for (const r of A("item_flag_map.csv")) (flagsOf[r.item_id] ||= []).push(IFLAG.get(r.item_flag_id));
  const gameGen = {}; for (const r of A("item_game_indices.csv")) gameGen[r.item_id] = Math.min(+r.generation_id, gameGen[r.item_id] || 99);
  const bFling = new Map(B("item_fling_effects.csv").map(r => [aliasItem(r.item_identifier), r]));
  const bIN = {}; for (const r of B("item_names.csv")) (bIN[aliasItem(r.item_identifier)] ||= {})[LANGDB[r.language_identifier]] = r.localized_name;
  const itemRows = [], itemNameRows = [];
  // introduced generation: PokeAPI = min generation in item_game_indices (wins), PokeDB's explicit column fills gaps + ITEM_GEN_FIX
  const introGen = (ident, a, b) => {
    const av = a && gameGen[a.id] ? String(gameGen[a.id]) : "", bv = b ? clean(b.introduced_in_generation_id) : "";
    if (av && bv && !same(av, bv)) { const fix = ITEM_GEN_FIX.has(ident); logC("items", ident, "introduced_generation", av, bv, fix ? bv : av); return fix ? bv : av; }
    return av || bv;
  };
  const itemRow = (ident, a, b) => ({ identifier: ident, id: a ? a.id : "", category: a ? ICAT.get(a.category_id) : "", category_pokedb: b ? b.item_category_identifier : "", cost: a ? a.cost : "", fling_power: pick("items", ident, "fling_power", a ? a.fling_power : "", (bFling.get(ident) || {}).fling_power), fling_effect: a ? IFLING.get(a.fling_effect_id) || "" : (bFling.get(ident) || {}).fling_effect || "", introduced_generation: introGen(ident, a, b), flags: a ? (flagsOf[a.id] || []).join(";") : "", is_consumable: b ? bool(b.is_consumable) : "", is_holdable: b ? bool(b.is_holdable) : "", is_field_usable: b ? bool(b.is_field_usable) : "", is_battle_usable: b ? bool(b.is_battle_usable) : "", description: b ? b.description : "", source: a && b ? "both" : a ? "pokeapi" : "pokedb" });
  const seenItem = new Set();
  for (const a of ITEMS) {
    if (seenItem.has(a.identifier)) { drop("items", "pokeapi-duplicate-identifier:" + a.identifier); continue; }   // PokeAPI lists roseli-berry twice (ids 723 + 2279)
    seenItem.add(a.identifier);
    const b = bItem.get(a.identifier); if (b) bItemsUsed.add(a.identifier);
    itemRows.push(itemRow(a.identifier, a, b));
    const nr = wide(itemNames, a.id, ["name"], { item: a.identifier });
    for (const [l, v] of Object.entries(bIN[a.identifier] || {})) nr[col("name", l)] = pick("item_names", a.identifier, col("name", l), nr[col("name", l)], v);
    itemNameRows.push(nr);
  }
  for (const [ident, b] of bItem) if (!bItemsUsed.has(ident)) {
    itemRows.push(itemRow(ident, null, b));
    const nr = { item: ident, name_en: b.name }; for (const [l, v] of Object.entries(bIN[ident] || {})) nr[col("name", l)] = v; itemNameRows.push(nr);
  }
  const itemFK = { item: "items.identifier" };
  out("items.csv", itemRows, ["identifier", "id", "category", "category_pokedb", "cost", "fling_power", "fling_effect", "introduced_generation", "flags", "is_consumable", "is_holdable", "is_field_usable", "is_battle_usable", "description", "source"], { category: "item_categories.identifier", introduced_generation: "generations.id", flags: "item_flags.identifier;" });
  out("item_names.csv", itemNameRows, ["item"], itemFK);
  out("item_effects.csv", A("item_prose.csv").map(r => ({ item: ITEM.get(r.item_id), language: LANGID.get(r.local_language_id), short_effect: r.short_effect, effect: r.effect })), ["item", "language", "short_effect", "effect"], { ...itemFK, language: "languages.identifier" });
  const ift = new Map(), iftRows = [];
  for (const r of A("item_flavor_text.csv")) { const vg = vgId.get(r.version_group_id); if (!vgOk(vg)) continue; const row = { item: ITEM.get(r.item_id), version_group: vg, language: LANGID.get(r.language_id), flavor_text: r.flavor_text }; ift.set(`${row.item}|${vg}|${row.language}`, row); iftRows.push(row); }
  for (const r of B("item_flavor_texts.csv")) { const vv = dbVer(r.version_identifier); if (!vv) { drop("item_flavor_text", r.version_identifier); continue; } const it = aliasItem(r.item_identifier), k = `${it}|${vv.version_group}|en`; if (ift.has(k)) pickText("item_flavor_text", `${it}/${vv.version_group}`, "flavor_text", ift.get(k).flavor_text, r.localized_name); else { const row = { item: it, version_group: vv.version_group, language: "en", flavor_text: r.localized_name }; ift.set(k, row); iftRows.push(row); } }
  splitOut("item_flavor_text", iftRows, "version_group", ["item", "version_group", "language", "flavor_text"], { ...itemFK, version_group: "version_groups.identifier", language: "languages.identifier" });
  out("item_game_indices.csv", A("item_game_indices.csv").map(r => ({ item: ITEM.get(r.item_id), generation: r.generation_id, game_index: r.game_index })), ["item", "generation", "game_index"], { ...itemFK, generation: "generations.id" });
  // prices: PokeDB shape (item, version_group, version, price_type, amount, currency); PokeAPI rows first, PokeDB fills
  const pr = new Map(), prRows = [];
  const prKey = r => `${r.item}|${r.version_group}|${r.version}|${r.price_type}|${r.currency}|${r.note || ""}`;
  for (const r of A("item_prices.csv")) { const vg = vgId.get(r.version_group_id); if (!vgOk(vg)) continue; for (const [t, v] of [["buy", r.purchase_price], ["sell", r.sell_price]]) { const row = { item: ITEM.get(r.item_id), version_group: vg, version: "", price_type: t, amount: v, currency: CURR.get(r.currency_id), note: "", source: "pokeapi" }; pr.set(prKey(row), row); prRows.push(row); } }
  for (const r of B("item_prices.csv")) { const vv = dbVer(r.version_identifier); if (!vv) { drop("item_prices", r.version_identifier); continue; } const row = { item: aliasItem(r.item_identifier), version_group: vv.version_group, version: vv.version, price_type: r.price_type, amount: r.amount, currency: dbCurrency(r.pokemon_currency_identifier), note: r.notes, source: "pokedb" }; const k = prKey(row); if (pr.has(k)) pick("item_prices", k, "amount", pr.get(k).amount, row.amount); else { pr.set(k, row); prRows.push(row); } }
  splitOut("item_prices", prRows, "version_group", ["item", "version_group", "version", "price_type", "amount", "currency", "note", "source"], { ...itemFK, version_group: "version_groups.identifier", version: "versions.identifier", currency: "currencies.identifier" });
  const acq = []; for (const r of B("item_acquisitions.csv")) { const vv = dbVer(r.version_identifier); if (!vv) { drop("item_acquisitions", r.version_identifier); continue; } acq.push({ item: aliasItem(r.item_identifier), version_group: vv.version_group, version: vv.version, type: r.item_acquisition_type_identifier, subtype: r.item_acquisition_subtype_identifier, location_area_pokedb: r.location_area_identifier, location_detail: r.location_detail, is_repeatable: bool(r.is_repeatable), is_hidden: bool(r.is_hidden), is_guaranteed: bool(r.is_guaranteed), quantity: r.quantity, probability: r.probability, cost_amount: r.cost_amount, currency: dbCurrency(r.pokemon_currency_identifier), required_badge: r.required_badge, unlock_condition: r.unlock_condition, notes: r.notes }); }
  splitOut("item_acquisitions", acq, "version_group", ["item", "version_group", "version", "type", "subtype", "location_area_pokedb", "location_detail", "is_repeatable", "is_hidden", "is_guaranteed", "quantity", "probability", "cost_amount", "currency", "required_badge", "unlock_condition", "notes"], { ...itemFK, version_group: "version_groups.identifier", version: "versions.identifier", type: "item_acquisition_types.identifier", subtype: "item_acquisition_subtypes.identifier", location_area_pokedb: "location_areas_pokedb.identifier", currency: "currencies.identifier" });
  out("item_acquisition_types.csv", B("item_acquisition_types.csv").map(r => ({ identifier: r.identifier, name: r.name, description: r.description })), ["identifier", "name", "description"]);
  out("item_acquisition_subtypes.csv", B("item_acquisition_subtypes.csv").map(r => ({ identifier: r.identifier, name: r.name, description: r.description })), ["identifier", "name", "description"]);
  out("item_effects_by_generation.csv", B("item_effects.csv").map(r => ({ item: aliasItem(r.item_identifier), context: r.item_effect_context_identifier, effect_type: r.item_effect_type_identifier, effect: r.effect_description, generation_start: r.generation_id_start, generation_end: r.generation_id_end, notes: r.notes })), ["item", "context", "effect_type", "effect", "generation_start", "generation_end", "notes"], { ...itemFK, context: "item_effect_contexts.identifier", effect_type: "item_effect_types.identifier", generation_start: "generations.id", generation_end: "generations.id" });
  out("item_effect_contexts.csv", B("item_effect_contexts.csv").map(r => ({ identifier: r.identifier, name: r.name, description: r.description })), ["identifier", "name", "description"]);
  out("item_effect_types.csv", B("item_effect_types.csv").map(r => ({ identifier: r.identifier, name: r.name, description: r.description })), ["identifier", "name", "description"]);
  out("item_stat_modifiers.csv", B("item_stat_modifiers.csv").map(r => ({ item: aliasItem(r.item_identifier), stat: r.stat, amount: r.amount, generation_start: r.generation_id_start, generation_end: r.generation_id_end })), ["item", "stat", "amount", "generation_start", "generation_end"], { ...itemFK, generation_start: "generations.id", generation_end: "generations.id" });
  const pm = []; for (const r of B("item_pocket_maps.csv")) { const vv = r.applies_to_version_identifier ? dbVer(r.applies_to_version_identifier) : { version: "", version_group: "" }; if (!vv) { drop("item_pockets_by_generation", r.applies_to_version_identifier); continue; } pm.push({ item: aliasItem(r.item_identifier), generation: r.generation_id, pocket: r.item_pocket_identifier, version_group: vv.version_group, version: vv.version }); }
  splitOut("item_pockets_by_generation", pm, "version_group", ["item", "generation", "pocket", "version_group", "version"], { ...itemFK, generation: "generations.id", pocket: "item_pockets_pokedb.identifier", version_group: "version_groups.identifier", version: "versions.identifier" });
  out("item_pockets_pokedb.csv", B("item_pockets.csv").map(r => ({ identifier: r.identifier, name: r.name })), ["identifier", "name"]);
  out("item_distributions.csv", B("item_distributions.csv").map(r => ({ item: aliasItem(r.item_identifier), event_name: r.event_name, distribution_method: r.distribution_method, start_date: r.start_date, end_date: r.end_date, region: r.region, notes: r.notes })), ["item", "event_name", "distribution_method", "start_date", "end_date", "region", "notes"], itemFK);
  out("berries.csv", A("berries.csv").map(r => ({ item: ITEM.get(r.item_id), berry_id: r.id, firmness: BFIRM.get(r.firmness_id), natural_gift_power: r.natural_gift_power, natural_gift_type: TYPE.get(r.natural_gift_type_id), size: r.size, max_harvest: r.max_harvest, growth_time: r.growth_time, soil_dryness: r.soil_dryness, smoothness: r.smoothness })), ["item", "berry_id", "firmness", "natural_gift_power", "natural_gift_type", "size", "max_harvest", "growth_time", "soil_dryness", "smoothness"], { ...itemFK, firmness: "berry_firmness.identifier", natural_gift_type: "types.identifier" });
  const berryItem = new Map(A("berries.csv").map(r => [r.id, ITEM.get(r.item_id)]));
  out("berry_flavors.csv", A("berry_flavors.csv").map(r => ({ item: berryItem.get(r.berry_id), contest_type: CTYPE.get(r.contest_type_id), flavor: r.flavor })), ["item", "contest_type", "flavor"], { ...itemFK, contest_type: "contest_types.identifier" });

  // ---- locations / encounters (PokeAPI vocabulary)
  const ln = langMap("location_names.csv", "location_id", ["name", "subtitle"]);
  out("locations.csv", A("locations.csv").map(r => wide(ln, r.id, ["name", "subtitle"], { identifier: r.identifier, id: r.id, region: REGION.get(r.region_id) || "" })), ["identifier", "id", "region"], { region: "regions.identifier" });
  const lap = langMap("location_area_prose.csv", "location_area_id", ["name"]);
  out("location_areas.csv", A("location_areas.csv").map(r => wide(lap, r.id, ["name"], { id: r.id, location: LOC.get(r.location_id), area: r.identifier, game_index: r.game_index })), ["id", "location", "area", "game_index"], { location: "locations.identifier" });
  out("location_game_indices.csv", A("location_game_indices.csv").map(r => ({ location: LOC.get(r.location_id), generation: r.generation_id, game_index: r.game_index })), ["location", "generation", "game_index"], { location: "locations.identifier", generation: "generations.id" });
  const slots = new Map(A("encounter_slots.csv").map(r => [r.id, r]));
  const conds = {}; for (const r of A("encounter_condition_value_map.csv")) (conds[r.encounter_id] ||= []).push(ECVAL.get(r.encounter_condition_value_id));
  const det = new Map(A("encounter_pokemon_details.csv").map(r => [r.encounter_id, r]));
  const encRows = [];
  for (const r of A("encounters.csv")) { const v = verId.get(r.version_id); if (exclVer.has(v)) { drop("encounters", "jp-rgb"); continue; } const s = slots.get(r.encounter_slot_id), d = det.get(r.id) || {}; encRows.push({ id: r.id, version_group: verVg.get(v), version: v, location_area: r.location_area_id, pokemon: pkIdent2(r.pokemon_id), method: EMETH.get(s.encounter_method_id), slot: s.slot, rarity: s.rarity, min_level: r.min_level, max_level: r.max_level, conditions: (conds[r.id] || []).sort().join(";"), min_perfect_ivs: d.min_perfect_ivs || "", always_shiny: d.always_shiny || "", never_shiny: d.never_shiny || "", is_alpha: d.is_alpha || "" }); }
  splitOut("encounters", encRows, "version_group", ["id", "version_group", "version", "location_area", "pokemon", "method", "slot", "rarity", "min_level", "max_level", "conditions", "min_perfect_ivs", "always_shiny", "never_shiny", "is_alpha"], { version_group: "version_groups.identifier", version: "versions.identifier", location_area: "location_areas.id", pokemon: "pokemon.identifier", method: "encounter_methods.identifier", conditions: "encounter_condition_values.identifier;" });
  out("encounter_rates.csv", A("location_area_encounter_rates.csv").filter(r => !exclVer.has(verId.get(r.version_id))).map(r => ({ location_area: r.location_area_id, method: EMETH.get(r.encounter_method_id), version: verId.get(r.version_id), rate: r.rate })), ["location_area", "method", "version", "rate"], { location_area: "location_areas.id", method: "encounter_methods.identifier", version: "versions.identifier" });
  // PokeDB vocabulary: locations/areas + encounters for the versions PokeAPI has no encounter rows for
  out("locations_pokedb.csv", B("locations.csv").map(r => ({ identifier: r.identifier, name: r.name, type: r.type, region_area: r.region_area_identifier })), ["identifier", "name", "type", "region_area"], { region_area: "region_areas_pokedb.identifier" });
  out("location_areas_pokedb.csv", B("location_areas.csv").map(r => ({ identifier: r.identifier, location: r.location_identifier, name: r.name })), ["identifier", "location", "name"], { location: "locations_pokedb.identifier" });
  const aEncVersions = new Set(encRows.map(r => r.version));
  const POKEDB_ENC_FILES = { "legends-arceus": "encounters_legends_arceus.csv", "scarlet-violet": "encounters_scarlet_violet.csv", "brilliant-diamond-shining-pearl": "encounters_brilliant_diamond_shining_pearl.csv" };
  const dbEnc = {}; const ENC_DROP_COLS = new Set(["note_html", "pokemon_form_identifier", "version_identifiers", "location_area_identifier", "encounter_method_identifier"]);
  for (const r of B("encounters.csv")) {
    const vers = r.version_identifiers.split(",").map(s => s.trim()), vv = vers.map(dbVer);
    if (vv.some(x => !x)) { drop("encounters_pokedb", r.version_identifiers); continue; }
    const vg = vv[0].version_group, file = POKEDB_ENC_FILES[vg];
    if (!file) { if (vers.every(v => aEncVersions.has(v))) drop("encounters_pokedb", "covered-by-pokeapi:" + vg); else drop("encounters_pokedb", "partial-pokeapi-coverage:" + vg); continue; }
    const a = formAlias.get(r.pokemon_form_identifier);
    const row = { pokemon: a.pokemon, form: a.form, version_group: vg, versions: vers.join(";"), location_area: r.location_area_identifier, method: r.encounter_method_identifier };
    for (const [k, v] of Object.entries(r)) if (!ENC_DROP_COLS.has(k) && v !== "") row[k === "note_markup" ? "note" : k] = v;
    for (const k of ["group_pokemon", "trade_for"]) if (row[k]) row[k] = row[k].split(",").map(s => (formAlias.get(s.trim()) || { pokemon: s.trim() }).pokemon).join(";");   // PokeDB form ids -> pokemon identifiers
    (dbEnc[file] ||= []).push(row);
  }
  for (const [file, rows] of Object.entries(dbEnc)) out(file, rows, ["pokemon", "form", "version_group", "versions", "location_area", "method"], { pokemon: "pokemon.identifier", form: "pokemon_forms.identifier", version_group: "version_groups.identifier", versions: "versions.identifier;", location_area: "location_areas_pokedb.identifier", method: "encounter_methods_pokedb.identifier" });

  // ---- reports
  for (const f of fs.readdirSync(MREP)) if (/^conflicts_.*\.csv$/.test(f) && !conflicts[f.slice(10, -4)]) fs.writeFileSync(path.join(MREP, f), "key,column,pokeapi,pokedb,chosen\n");   // stale from an earlier run (mount refuses deletes)
  for (const [t, rows] of Object.entries(conflicts)) fs.writeFileSync(path.join(MREP, `conflicts_${t}.csv`), stringify([["key", "column", "pokeapi", "pokedb", "chosen"], ...rows]));
  fs.writeFileSync(path.join(MREP, "dropped_rows.csv"), stringify([["table:reason", "rows"], ...Object.entries(dropped).sort()]));
  fs.writeFileSync(path.join(MREP, "output_files.csv"), stringify(written.map(w => ({ file: w.file, rows: w.rows, columns: w.columns })), ["file", "rows", "columns"]));
  console.log(`wrote ${written.length} files, ${written.reduce((n, w) => n + w.rows, 0)} rows; conflicts: ${Object.entries(conflicts).map(([t, r]) => `${t}=${r.length}`).join(" ")}; U+FFFD repaired: ${fffd}`);
  const stale = [...preexisting].filter(f => !written.some(w => w.file === f));
  if (stale.length) console.warn(`STALE files in csv/ not produced by this run (delete by hand): ${stale.join(" ")}`);
}

// ---------------------------------------------------------------- verify
function verify() {
  const fkSpec = fs.existsSync(path.join(MREP, "fk_spec.json")) ? JSON.parse(fs.readFileSync(path.join(MREP, "fk_spec.json"), "utf8")) : FK;
  const files = fs.readdirSync(OUT).filter(f => f.endsWith(".csv")).sort();
  const tables = {}; let bad = 0;
  for (const f of files) {
    const t = parseFile(path.join(OUT, f));
    if (t.bad.length) { console.error(`ROUND-TRIP FAIL ${f}: ${t.bad.length} rows with wrong field count`); bad++; }
    const raw = fs.readFileSync(path.join(OUT, f), "utf8");
    if (raw.includes("\r")) { console.error(`CR found in ${f}`); bad++; }
    if (raw.includes("�") || /[‎‏]/.test(raw)) { console.error(`bad char in ${f}`); bad++; }
    if (t.rows.length === 0) { console.error(`EMPTY ${f}`); bad++; }
    tables[f] = t;
  }
  const keyIndex = {};
  const keysOf = (file, colName) => keyIndex[file + "." + colName] ||= new Set((tables[file] || { rows: [] }).rows.map(r => r[colName]).filter(v => v !== ""));
  let fkChecks = 0, fkBad = 0;
  for (const [file, fks] of Object.entries(fkSpec)) {
    if (!tables[file]) continue;
    for (const [colName, target] of Object.entries(fks)) {
      const multi = target.endsWith(";"); const [tf, tc] = target.replace(/;$/, "").split(".");
      const keys = keysOf(tf + ".csv", tc); const missing = new Map();
      for (const r of tables[file].rows) { const v = r[colName]; if (v === "" || v == null) continue; for (const x of multi ? v.split(";") : [v]) if (!keys.has(x)) missing.set(x, (missing.get(x) || 0) + 1); }
      fkChecks++;
      if (missing.size) { fkBad++; bad++; console.error(`FK FAIL ${file}.${colName} -> ${target}: ${missing.size} distinct unresolved, e.g. ${[...missing.entries()].slice(0, 5).map(([k, n]) => `${k}(${n})`).join(", ")}`); }
    }
  }
  const total = files.reduce((n, f) => n + tables[f].rows.length, 0);
  console.log(`verify: ${files.length} files, ${total} rows, ${fkChecks} FK checks (${fkBad} failed), ${bad} problems`);
  const must = { "species.csv": 1025, "species_names.csv": 1025, "pokemon_egg_groups.csv": 1025, "base_friendship_gen8plus.csv": 1025, "type_chart_gen6plus.csv": 324, "type_chart_gen2-5.csv": 289, "type_chart_gen1.csv": 225, "damage_class_by_type_gen1-3.csv": 17 };
  for (const [f, n] of Object.entries(must)) if (!tables[f] || tables[f].rows.length !== n) { console.error(`COUNT FAIL ${f}: ${tables[f] ? tables[f].rows.length : "missing"} != ${n}`); bad++; }
  return bad === 0;
}

if (require.main === module) {
  if (!VERIFY_ONLY) { build(); fs.writeFileSync(path.join(MREP, "fk_spec.json"), JSON.stringify(FK, null, 1)); }
  process.exit(verify() ? 0 : 1);
}
module.exports = { build, verify, SPECIES_OVERRIDES, FORM_HAND };
