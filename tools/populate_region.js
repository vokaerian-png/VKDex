// Pokémon data-population pipeline — the one tool for getting per-Pokémon
// data from the local PokeAPI CSV clone (temp/PokeAPI-master/data/v2/csv/)
// into src/data/*.js, whether that's a whole region, a handful of
// individual species, or a refresh of one table for entries that already
// exist. Consolidated 2026-09-04 from gen_region_data.js +
// assemble_region_data.js; extended 2026-09-05 (species mode, table
// scoping, in-place upsert, altforms) to absorb backfill_empty_movesets.js,
// add_hidden_abilities.js and the design-overhaul extract_megas.js.
//
// Hisui/Orre standalone-dex work is NOT here — tools/populate_hisui_species.js
// stays its own thing (TODO.md #6).
//
// Target selection (pick one):
//   <region>            every species of that generation (kanto..paldea)
//   --ids 479,480,...   explicit national ids, any generation; each id's
//                       `region` derives from pokemon_species.csv unless
//                       pokemon.js already has the entry (then its
//                       region/hisuiOnly are preserved)
//
// Actions:
//   --dry-run           resolve + print everything derived (ids, versions,
//                       which tables already hold each id). No writes.
//   --generate          extract CSV data -> temp/<slug>_results.json plus a
//                       flat temp/<slug>_needs_descriptions.json manifest
//                       (species/moves/abilities that need a hand-authored
//                       description — write descriptions.json from THIS).
//   --assemble [descriptions.json]
//                       consume the results + descriptions (default
//                       temp/descriptions.json), upsert every selected table
//                       in id order, then run verify_region_data.js.
//                       Strict: a new species/move/ability without a
//                       description is an error.
//   --refresh [descriptions.json]
//                       generate + assemble in one step, in memory, for ids
//                       already in pokemon.js. Lenient: hand-authored
//                       descriptions are preserved; a moveset/pokemon entry
//                       that would need a move/ability with no description
//                       is skipped and reported instead of failing.
//   --audit [--verbose] read-only: diff every populated id (or the target's
//                       ids) in src/data/*.js against what the CSVs say —
//                       pokemon/stats/evolutions/movesets/names/locations
//                       tables, Mega formes in altforms, and moves.js/
//                       abilities.js keys + move stats. One line per
//                       mismatch, summary count, exit 1 on any. hisui.js/
//                       orre.js and hand-authored descriptions are not
//                       covered. No target = all of POKEMON_DATA.
//   --gaps              read-only: print the Pokédex-relevant CSV columns
//                       the src/data schema has no representation for
//                       (a static, hand-curated list, validated against
//                       the clone's headers so it can't rot silently).
//
// Options:
//   --tables a,b,c      which files to write (default: all). Any of
//                       pokemon stats evolutions movesets names locations
//                       altforms (plus moves/abilities additions, always).
//                       altforms writes only Mega formes and only for a
//                       species with no ALT_FORMS entry yet — an existing
//                       hand-curated entry is never touched; the extracted
//                       block is printed for hand-merging instead.
//
// Examples:
//   node tools/populate_region.js unova --dry-run
//   node tools/populate_region.js --ids 479 --generate            (new species)
//   node tools/populate_region.js --ids 479 --assemble temp/descriptions.json
//   node tools/populate_region.js --ids 127,128 --refresh --tables movesets
//   node tools/populate_region.js kanto --refresh --tables stats,evolutions
//   node tools/populate_region.js --audit                (everything populated)
//   node tools/populate_region.js --ids 127,128 --audit --verbose
//   node tools/populate_region.js --gaps
//
// Descriptions are never auto-generated (copyright) — one original sentence
// per Pokémon/move/ability, hand-authored (HISTORY.md 0.1.15).
"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const { spawnSync } = require("child_process");

const ROOT = path.join(__dirname, "..");
const CSV_DIR = path.join(ROOT, "temp", "PokeAPI-master", "data", "v2", "csv");
const DATA_DIR = path.join(ROOT, "src", "data");
const SPRITE_DIR = path.join(DATA_DIR, "sprites", "pokemon");
const TEMP_DIR = path.join(ROOT, "temp");

// region -> generation_id, in src/data.js's own REGIONS order. Hisui/Orre
// are non-mainline standalone dexes, out of scope (see TODO.md #6).
const REGION_GEN = {
  kanto: 1, johto: 2, hoenn: 3, sinnoh: 4,
  unova: 5, kalos: 6, alola: 7, galar: 8, paldea: 9,
};
const GEN_REGION = Object.fromEntries(Object.entries(REGION_GEN).map(([r, g]) => [String(g), r]));
// locations.js area ordering (0.2.10). location_game_indices.csv holds each
// location's internal map index per generation — the closest thing the CSVs
// have to "the order a player walks the region". It is NOT literal
// progression order in most generations: the index is grouped by kind (all
// towns/cities, then routes in numeric order, then dungeons/side areas), so
// what it really buys is (a) Route 2 before Route 11 instead of the string
// sort's "Route 1, Route 11, Route 12, ... Route 2", and (b) related areas
// kept together. Gen 2 is the one exception whose index really is walk order.
// Per region: the generation whose index covers the most locations the app
// actually references, ties to the more recent (the user's "most recent,
// complete data wins" rule). Measured 2026-09-05 over all 665 species —
// kanto gen3 81/84, johto gen4 93/99, hoenn gen6 83/98 (gen3 82, so gen6 wins
// on both counts), sinnoh gen4 73/76, unova gen5 75/76, kalos gen6 42/44,
// alola gen7 67/68. Galar/Paldea are unpopulated guesses (own generation).
// A location with no index in its region's generation keeps the old
// alphabetical order, in a block after every ordered area.
// A value may be a LIST of generations, tried in order (0.2.11, hoenn only,
// user-directed): gen 3 (RSE) and gen 6 (ORAS) covered 82 and 83 of Hoenn's
// 98 locations but dropped *different* content, so RSE orders the region and
// the ORAS-only spots (Mirage Forest/Cave/Island/Mountain, Sea Mauville,
// Battle Resort, Soaring in the sky) are appended after it, ordered among
// themselves by their gen 6 index.
const REGION_ORDER_GEN = {
  kanto: "3", johto: "4", hoenn: ["3", "6"], sinnoh: "4",
  unova: "5", kalos: "6", alola: "7", galar: "8", paldea: "9",
};
// Rank = tier * TIER_STEP + game_index, so one plain numeric compare handles
// both tiers. game_index tops out in the hundreds; the step just has to be
// bigger than any of them.
const TIER_STEP = 1e6;
const ALL_TABLES = ["pokemon", "stats", "evolutions", "movesets", "names", "locations", "altforms"];
// genders.csv, static: 3 = genderless, deliberately absent (see the
// evolution extractor) so it never writes a meaningless `gender` field.
const GENDER = { 1: "female", 2: "male" };
const titleCase = s => s.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
// growth_rates.csv id -> the curve name stats.js stores, plus the Lv.100
// total. Module-scope (not inside extract) so tools/one-offs that need the
// same id->name mapping — data/experience.js's curve keys — reuse it.
const GROWTH = {
  "1": { curve: "Slow", points: 1250000 },
  "2": { curve: "Medium Fast", points: 1000000 },
  "3": { curve: "Fast", points: 800000 },
  "4": { curve: "Medium Slow", points: 1059860 },
  "5": { curve: "Erratic", points: 600000 },
  "6": { curve: "Fluctuating", points: 1640000 },
};
// The 5 other-language name columns names.js has always used, in its own key
// order. Reused for abilities.js / moves.js / types.js `names` sub-objects.
const NAME_LANGS = [["ja", "1"], ["jaRomaji", "2"], ["fr", "5"], ["de", "6"], ["ko", "3"]];
// rows = *_names.csv rows for one entity, already filtered to that entity.
// A language with no row is OMITTED, not written as null — same
// "absence means none" convention the rest of the schema uses. Matters:
// move_names.csv/ability_names.csv carry no roomaji (language 2) rows at
// all, so every one of those 800-odd entries would otherwise carry a
// meaningless `jaRomaji: null`.
function names5(rows) {
  const out = {};
  for (const [key, langId] of NAME_LANGS) {
    const r = rows.find(x => x.local_language_id === langId);
    if (r) out[key] = r.name;
  }
  return out;
}
// One pokedex per mainline region for pokemon_dex_numbers.csv. Several
// regions have more than one (kanto + letsgo-kanto, original- vs
// updated-johto/sinnoh/unova/alola, Galar/Paldea DLC dexes): prefer the
// pokedex whose identifier is exactly the region name, else the "original-"
// one — the same "prefer the base/earliest option" rule the evolution
// row-selection uses. KALOS IS DELIBERATELY ABSENT: it has only the three
// kalos-central/coastal/mountain sub-dexes (plus lumiose-city/hyperspace)
// and no national-style parent, so merging them would be a guessed rule
// (TODO.md #10). Add it here if a rule is ever agreed.
function regionalPokedexes(csvs) {
  const regionName = new Map(csvs.regions.map(r => [r.id, r.identifier]));
  const byRegion = new Map();
  for (const region of Object.keys(REGION_GEN)) {
    const rows = csvs.pokedexes.filter(p => regionName.get(p.region_id) === region);
    const pick = rows.find(p => p.identifier === region) || rows.find(p => p.identifier === "original-" + region);
    if (pick) byRegion.set(region, pick.id);
  }
  return byRegion;
}

// ---- minimal CSV parser (handles quoted fields incl. embedded commas/newlines) ----
function parseCSV(text) {
  const rows = [];
  let row = [], field = "", inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else inQuotes = false;
      } else field += c;
    } else {
      if (c === '"') inQuotes = true;
      else if (c === ",") { row.push(field); field = ""; }
      else if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; }
      else if (c === "\r") { /* skip */ }
      else field += c;
    }
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  return rows;
}
function loadCSV(name) {
  const text = fs.readFileSync(path.join(CSV_DIR, name), "utf8");
  const rows = parseCSV(text);
  const header = rows[0];
  return rows.slice(1).filter(r => r.length === header.length && r.some(x => x !== "")).map(r => {
    const o = {};
    header.forEach((h, i) => (o[h] = r[i]));
    return o;
  });
}
function loadAllCSVs() {
  if (!fs.existsSync(CSV_DIR)) {
    throw new Error(`CSV clone not found at ${CSV_DIR} — re-supply temp/PokeAPI-master this session (see CLAUDE.md §9).`);
  }
  return {
    pokemon: loadCSV("pokemon.csv"),
    species: loadCSV("pokemon_species.csv"),
    habitats: loadCSV("pokemon_habitats.csv"),
    dexNumbers: loadCSV("pokemon_dex_numbers.csv"),
    eggGroups: loadCSV("pokemon_egg_groups.csv"),
    eggGroupProse: loadCSV("egg_group_prose.csv"),
    speciesNames: loadCSV("pokemon_species_names.csv"),
    flavorText: loadCSV("pokemon_species_flavor_text.csv"),
    forms: loadCSV("pokemon_forms.csv"),
    formNames: loadCSV("pokemon_form_names.csv"),
    pTypes: loadCSV("pokemon_types.csv"),
    pAbilities: loadCSV("pokemon_abilities.csv"),
    abilities: loadCSV("abilities.csv"),
    pStats: loadCSV("pokemon_stats.csv"),
    pEvolution: loadCSV("pokemon_evolution.csv"),
    pMoves: loadCSV("pokemon_moves.csv"),
    moves: loadCSV("moves.csv"),
    moveNames: loadCSV("move_names.csv"),
    moveTargets: loadCSV("move_targets.csv"),
    moveMeta: loadCSV("move_meta.csv"),
    moveMetaCategories: loadCSV("move_meta_categories.csv"),
    moveMetaAilments: loadCSV("move_meta_ailments.csv"),
    moveFlags: loadCSV("move_flags.csv"),
    moveFlagMap: loadCSV("move_flag_map.csv"),
    abilityNames: loadCSV("ability_names.csv"),
    versionGroups: loadCSV("version_groups.csv"),
    types: loadCSV("types.csv"),
    items: loadCSV("items.csv"),
    itemNames: loadCSV("item_names.csv"),
    pItems: loadCSV("pokemon_items.csv"),
    encounters: loadCSV("encounters.csv"),
    encounterSlots: loadCSV("encounter_slots.csv"),
    encounterMethods: loadCSV("encounter_methods.csv"),
    encounterConditionValueMap: loadCSV("encounter_condition_value_map.csv"),
    locationAreas: loadCSV("location_areas.csv"),
    locations: loadCSV("locations.csv"),
    locationNames: loadCSV("location_names.csv"),
    locationGameIndices: loadCSV("location_game_indices.csv"),
    regions: loadCSV("regions.csv"),
    pokedexes: loadCSV("pokedexes.csv"),
    pokedexVersionGroups: loadCSV("pokedex_version_groups.csv"),
    versions: loadCSV("versions.csv"),
    versionNames: loadCSV("version_names.csv"),
  };
}
// The small subset --dry-run / target resolution needs.
function loadParamCSVs() {
  return { species: loadCSV("pokemon_species.csv"), regions: loadCSV("regions.csv"), pokedexes: loadCSV("pokedexes.csv"), pokedexVersionGroups: loadCSV("pokedex_version_groups.csv"), versions: loadCSV("versions.csv") };
}

// Everything moves.js stores for one move, straight off the CSVs (0.2.5
// added priority/target/effectChance/flags/meta/names to the original
// type/category/power/accuracy/pp). One builder so the pipeline's "new
// move" writer, --audit and any backfill can never drift apart.
function moveDataBuilder(csvs) {
  const typeById = new Map(csvs.types.map(x => [x.id, x]));
  const targetById = new Map(csvs.moveTargets.map(x => [x.id, x]));
  const metaByMove = new Map(csvs.moveMeta.map(x => [x.move_id, x]));
  const metaCatById = new Map(csvs.moveMetaCategories.map(x => [x.id, x]));
  const ailmentById = new Map(csvs.moveMetaAilments.map(x => [x.id, x]));
  const flagById = new Map(csvs.moveFlags.map(x => [x.id, x]));
  const flagsByMove = new Map();
  for (const r of csvs.moveFlagMap) { if (!flagsByMove.has(r.move_id)) flagsByMove.set(r.move_id, []); flagsByMove.get(r.move_id).push(r.move_flag_id); }
  const namesByMove = new Map();
  for (const r of csvs.moveNames) { if (!namesByMove.has(r.move_id)) namesByMove.set(r.move_id, []); namesByMove.get(r.move_id).push(r); }
  const DAMAGE_CLASS = { "1": "Status", "2": "Physical", "3": "Special" };
  const num = v => (v === "" || v === undefined ? null : Number(v));
  return function moveData(row, name) {
    const meta = metaByMove.get(row.id);
    let metaOut = null;
    if (meta) {
      metaOut = {};
      const cat = metaCatById.get(meta.meta_category_id);
      if (cat) metaOut.category = cat.identifier;
      // ailment 0 = "none" and -1 = "unknown" both mean "inflicts nothing".
      const ail = ailmentById.get(meta.meta_ailment_id);
      if (ail && meta.meta_ailment_id !== "0" && meta.meta_ailment_id !== "-1") metaOut.ailment = ail.identifier;
      // The numeric columns are omitted at their own no-op value: blank, or
      // 0 = "not multi-hit / no drain / no healing / normal crit rate /
      // never happens". A non-zero negative drain (recoil) is kept.
      const opt = { minHits: meta.min_hits, maxHits: meta.max_hits, minTurns: meta.min_turns, maxTurns: meta.max_turns, drain: meta.drain, healing: meta.healing, critRate: meta.crit_rate, ailmentChance: meta.ailment_chance, flinchChance: meta.flinch_chance, statChance: meta.stat_chance };
      for (const k of Object.keys(opt)) { const v = num(opt[k]); if (v !== null && v !== 0) metaOut[k] = v; }
    }
    return {
      name,
      type: titleCase(typeById.get(row.type_id).identifier),
      category: DAMAGE_CLASS[row.damage_class_id] || "Status",
      power: Number(row.power) || null, // CSV writes 0 (not blank) for some newer status moves
      accuracy: Number(row.accuracy) || null,
      pp: Number(row.pp),
      priority: Number(row.priority),
      // Raw move_targets.csv identifier ("user", "selected-pokemon"), same
      // hyphenated-slug convention evolutions.js uses for item/type names.
      target: (targetById.get(row.target_id) || {}).identifier || null,
      effectChance: num(row.effect_chance),
      flags: (flagsByMove.get(row.id) || []).map(fid => (flagById.get(fid) || {}).identifier).filter(Boolean),
      meta: metaOut,
      names: names5(namesByMove.get(row.id) || []),
    };
  };
}
// abilities.js's per-entry CSV data — just the 5-language names so far
// (the description stays hand-authored).
function abilityDataBuilder(csvs) {
  const namesByAbility = new Map();
  for (const r of csvs.abilityNames) { if (!namesByAbility.has(r.ability_id)) namesByAbility.set(r.ability_id, []); namesByAbility.get(r.ability_id).push(r); }
  return (row, name) => ({ name, names: names5(namesByAbility.get(row.id) || []) });
}

// =========================================================================
// Reading the current src/data/*.js state
// =========================================================================
function loadGlobal(file, varName) {
  const sandbox = {};
  vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync(path.join(DATA_DIR, file), "utf8"), sandbox, { filename: file });
  return sandbox[varName];
}
function currentData() {
  const pokemon = loadGlobal("pokemon.js", "POKEMON_DATA");
  return {
    pokemonById: new Map(pokemon.map(p => [p.id, p])),
    tables: {
      stats: loadGlobal("stats.js", "STATS"),
      evolutions: loadGlobal("evolutions.js", "EVOLUTIONS"),
      movesets: loadGlobal("movesets.js", "MOVESETS"),
      names: loadGlobal("names.js", "NAMES"),
      locations: loadGlobal("locations.js", "LOCATIONS"),
      altforms: loadGlobal("altforms.js", "ALT_FORMS"),
    },
    moves: loadGlobal("moves.js", "MOVES"),
    abilities: loadGlobal("abilities.js", "ABILITIES"),
    items: loadGlobal("items.js", "ITEMS_DATA"),
  };
}

// =========================================================================
// Target resolution: which ids, and which game versions per id
// =========================================================================
// region_id -> main-series pokedex ids -> version_group ids -> version ids
function regionVersions(region, csvs) {
  const regionRow = csvs.regions.find(r => r.identifier === region);
  if (!regionRow) throw new Error(`no regions.csv row with identifier "${region}"`);
  const pokedexIds = new Set(csvs.pokedexes.filter(p => p.region_id === regionRow.id && p.is_main_series === "1").map(p => p.id));
  const versionGroupIds = new Set(csvs.pokedexVersionGroups.filter(r => pokedexIds.has(r.pokedex_id)).map(r => r.version_group_id));
  // The Japan-only Gen 1 releases (red-japan/green-japan/blue-japan) are
  // dropped: their English display names collide with the international
  // Red/Blue, so a per-game encounter line (0.2.8) would read
  // "Red/Blue/.../Red/Green". Their encounter tables duplicate Gen 1's.
  const versionRows = csvs.versions.filter(v => versionGroupIds.has(v.version_group_id) && !v.identifier.endsWith("-japan"));
  return { regionId: regionRow.id, pokedexIds, versionGroupIds, versionIds: new Set(versionRows.map(v => v.id)), versionsById: new Map(versionRows.map(v => [v.id, v.identifier])) };
}

// Returns { slug, ids, regionOf(id), versionsOf(id), regionMode, region }.
function resolveTargets(target, csvs, current) {
  const speciesById = new Map(csvs.species.map(s => [s.id, s]));
  const versionsCache = new Map();
  const versionsFor = region => {
    if (!versionsCache.has(region)) versionsCache.set(region, regionVersions(region, csvs));
    return versionsCache.get(region);
  };
  // An existing pokemon.js entry keeps its region (or hisuiOnly, which has
  // no region at all); a new id takes its generation's mainline region.
  const regionOf = id => {
    const existing = current.pokemonById.get(id);
    if (existing) return existing.hisuiOnly ? null : existing.region;
    const sp = speciesById.get(String(id));
    if (!sp) throw new Error(`id ${id}: no pokemon_species.csv row`);
    return GEN_REGION[sp.generation_id] || null;
  };
  // Locations come from the species' own region's games; a hisuiOnly
  // species has none here (its Hisui data is populate_hisui_species.js's).
  const versionsOf = id => {
    const region = regionOf(id);
    return region ? versionsFor(region).versionIds : new Set();
  };

  if (target.region) {
    const genId = String(REGION_GEN[target.region]);
    const ids = csvs.species.filter(sp => sp.generation_id === genId).map(sp => Number(sp.id)).sort((a, b) => a - b);
    if (!ids.length) throw new Error(`no pokemon_species.csv rows with generation_id ${genId} (region "${target.region}")`);
    return { slug: target.region, ids, regionOf: () => target.region, versionsOf: () => versionsFor(target.region).versionIds, regionMode: true, region: target.region, versions: versionsFor(target.region) };
  }
  const ids = [...new Set(target.ids)].sort((a, b) => a - b);
  ids.forEach(id => { if (!speciesById.has(String(id))) throw new Error(`id ${id}: no pokemon_species.csv row`); });
  return { slug: "species", ids, regionOf, versionsOf, regionMode: false };
}

function printTargets(t, current) {
  const fmtSet = s => [...s].sort((a, b) => Number(a) - Number(b)).join(", ");
  if (t.regionMode) {
    const v = t.versions;
    console.log(`Region: ${t.region} (generation_id ${REGION_GEN[t.region]})`);
    console.log(`Dex id range: ${t.ids[0]}-${t.ids[t.ids.length - 1]} (${t.ids.length} entries)`);
    console.log(`regions.csv row id: ${v.regionId}`);
    console.log(`Main-series pokedex ids: ${fmtSet(v.pokedexIds)}`);
    console.log(`Version groups: ${fmtSet(v.versionGroupIds)}`);
    console.log(`Versions: ${[...v.versionIds].sort((a, b) => Number(a) - Number(b)).map(id => `${id}:${v.versionsById.get(id)}`).join(", ")}`);
  } else {
    console.log(`Species: ${t.ids.length} id(s)`);
  }
  const existing = t.ids.filter(id => current.pokemonById.has(id));
  console.log(`Already in pokemon.js: ${existing.length} of ${t.ids.length}` + (existing.length && existing.length < 12 ? ` (${existing.join(", ")})` : ""));
  if (!t.regionMode) {
    for (const id of t.ids) {
      const p = current.pokemonById.get(id);
      const have = ALL_TABLES.filter(tb => tb === "pokemon" ? !!p : !!current.tables[tb][id]);
      const missing = ALL_TABLES.filter(tb => have.indexOf(tb) === -1 && tb !== "altforms");
      console.log(`  ${id}: ${p ? p.name : "(new)"} region=${t.regionOf(id) || (p && p.hisuiOnly ? "hisuiOnly" : "?")} tables present: ${have.join(",") || "none"}${missing.length ? ` — missing: ${missing.join(",")}` : ""}`);
    }
  }
}

// =========================================================================
// EXTRACT: CSV -> plain results object for a set of ids
// =========================================================================
function extract(t, csvs, current) {
  const byId = (rows, key) => new Map(rows.map(r => [r[key], r]));
  const groupBy = (rows, key) => {
    const m = new Map();
    for (const r of rows) { if (!m.has(r[key])) m.set(r[key], []); m.get(r[key]).push(r); }
    return m;
  };

  const typeById = byId(csvs.types, "id");
  const abilityById = byId(csvs.abilities, "id");
  const vgById = byId(csvs.versionGroups, "id");
  const locAreaById = byId(csvs.locationAreas, "id");
  const locById = byId(csvs.locations, "id");
  const itemById = byId(csvs.items, "id");
  const typeName = id => titleCase(typeById.get(id).identifier);
  // evolutions.js stores item slugs (sprite filenames) and lowercase type
  // names, both raw CSV identifiers — no titleCase here.
  const itemSlug = id => (itemById.get(id) || {}).identifier || null;
  const typeSlug = id => (typeById.get(id) || {}).identifier || null;
  const abilityName = id => titleCase(abilityById.get(id).identifier);

  const moveNameById = new Map();
  for (const r of csvs.moveNames) if (r.local_language_id === "9") moveNameById.set(r.move_id, r.name);

  const habitatById = byId(csvs.habitats, "id");
  // Regional dex numbers: pokedex_id -> the REGIONS key it belongs to.
  const regionByPokedexId = new Map([...regionalPokedexes(csvs)].map(([r, pid]) => [pid, r]));
  const dexNumsBySpecies = groupBy(csvs.dexNumbers, "species_id");
  // Egg groups (0.2.7): English display names from egg_group_prose.csv
  // ("Water 1", "Human-Like", "Undiscovered"), in pokemon_egg_groups.csv
  // row order (= egg_group id order).
  const eggGroupName = new Map(csvs.eggGroupProse.filter(r => r.local_language_id === "9").map(r => [r.egg_group_id, r.name]));
  const eggGroupsBySpecies = groupBy(csvs.eggGroups, "species_id");
  // Wild held items (0.2.7; per-game since 0.2.8): every game's
  // pokemon_items.csv rows for the species' default pokemon row, kept as one
  // group per distinct rarity with the games sharing it.
  const heldItemsByPokemon = groupBy(csvs.pItems, "pokemon_id");
  // Version display names ("Black 2", "Let's Go, Pikachu!") for the per-game
  // groups in heldItems / locations. Version id order == release order.
  const versionName = new Map(csvs.versionNames.filter(r => r.local_language_id === "9").map(r => [r.version_id, r.name]));
  const vName = id => versionName.get(id) || id;
  // Collapse a version-keyed map into [{ games, ...value }], one group per
  // distinct value signature, games "/"-joined in version order and groups
  // ordered by their first version. Used by heldItems and locations alike.
  const groupByVersion = (byVer, sigOf) => {
    const sigs = new Map();
    for (const vid of [...byVer.keys()].sort((a, b) => Number(a) - Number(b))) {
      const val = byVer.get(vid);
      const key = sigOf(val);
      if (!sigs.has(key)) sigs.set(key, { val, games: [] });
      sigs.get(key).games.push(vName(vid));
    }
    return [...sigs.values()].map(g => Object.assign({ games: g.games.join("/") }, g.val));
  };

  const locNameById = new Map();
  for (const r of csvs.locationNames) if (r.local_language_id === "9" && !locNameById.has(r.location_id)) locNameById.set(r.location_id, r.name);
  // location_id -> generation_id -> game_index, for the area sort above.
  // A location can carry SEVERAL rows for one generation, one per version
  // group: Gen 5 lists every Unova location twice, once in Black/White's map
  // order (1-75) and again in Black 2/White 2's (76-153). The LOWEST index
  // wins, which keeps one game's numbering intact end to end instead of
  // interleaving two ("Route 3, Route 18, Dreamyard, Route 7"); anything the
  // earlier game didn't have (Aspertia City, Routes 19-23) still sorts after
  // it, on the later game's own numbering.
  const locIndexById = new Map();
  for (const r of csvs.locationGameIndices) {
    if (!locIndexById.has(r.location_id)) locIndexById.set(r.location_id, new Map());
    const m = locIndexById.get(r.location_id);
    const i = Number(r.game_index);
    if (!m.has(r.generation_id) || i < m.get(r.generation_id)) m.set(r.generation_id, i);
  }
  const locOrder = (region, locId) => {
    const gens = [].concat(REGION_ORDER_GEN[region] || []);
    const m = locIndexById.get(locId);
    if (!m) return null;
    for (let t = 0; t < gens.length; t++) if (m.has(gens[t])) return t * TIER_STEP + m.get(gens[t]);
    return null;
  };

  const pokemonById = byId(csvs.pokemon, "id"); // pokemon.id === species id for default forms
  const speciesById = byId(csvs.species, "id");
  const namesBySpecies = groupBy(csvs.speciesNames, "pokemon_species_id");
  const flavorBySpecies = groupBy(csvs.flavorText, "species_id");
  const typesByPokemon = groupBy(csvs.pTypes, "pokemon_id");
  const abilitiesByPokemon = groupBy(csvs.pAbilities, "pokemon_id");
  const statsByPokemon = groupBy(csvs.pStats, "pokemon_id");
  const evoByTarget = groupBy(csvs.pEvolution, "evolved_species_id");
  const movesByPokemon = groupBy(csvs.pMoves, "pokemon_id");
  const encByPokemon = groupBy(csvs.encounters, "pokemon_id");
  // Encounter detail (0.2.7): slot -> method + rarity; condition values
  // (time of day, season, swarm, ...) key separate rate buckets so a Gen 2
  // morning/day/night triple isn't summed into one 150% figure.
  const encSlotById = byId(csvs.encounterSlots, "id");
  const encMethodById = byId(csvs.encounterMethods, "id");
  const condByEncounter = groupBy(csvs.encounterConditionValueMap, "encounter_id");
  // `walk` is the CSV's name for the standard random encounter (tall grass,
  // caves, ...); players call it "Grass", so that's what the popup shows
  // (0.2.10, user-directed). Only this one identifier is renamed — the real
  // overworld methods (`overworld`, `overworld-flying`) keep their own labels.
  const METHOD_LABEL = { walk: "Grass", "npc-trade": "NPC Trade", sos: "SOS Call", "sos-from-bubbling-spot": "SOS Call (bubbling spot)" };
  const methodLabel = m => METHOD_LABEL[m.identifier] || titleCase(m.identifier);
  const formNameByForm = new Map(csvs.formNames.filter(r => r.local_language_id === "9").map(r => [r.pokemon_form_id, r]));
  const megaFormsBySpecies = new Map();
  for (const f of csvs.forms.filter(f => f.is_mega === "1")) {
    const pk = pokemonById.get(f.pokemon_id);
    if (!pk) continue;
    if (!megaFormsBySpecies.has(pk.species_id)) megaFormsBySpecies.set(pk.species_id, []);
    megaFormsBySpecies.get(pk.species_id).push({ form: f, pk });
  }

  // Every id that may legally appear as an evolution target: everything
  // already in pokemon.js plus this batch. (A region pass used to allow
  // 1..MAX_ID; same rule, expressed against what actually exists.)
  const allowedTargets = new Set([...current.pokemonById.keys(), ...t.ids]);

  const results = {
    slug: t.slug, ids: t.ids,
    pokemon: {}, stats: {}, evolutions: {}, movesets: {}, names: {}, locations: {}, altforms: {},
    flagged: [],
  };
  const statKeys = { "1": "hp", "2": "attack", "3": "defense", "4": "spAttack", "5": "spDefense", "6": "speed" };
  const statsOf = pokemonId => {
    const out = {};
    for (const r of statsByPokemon.get(pokemonId) || []) out[statKeys[r.stat_id]] = Number(r.base_stat);
    return out;
  };
  // EV yield, same six keys and same order as the base-stat object. Always
  // fully populated (0 is real data here, not absence), so a missing row
  // still reads as 0 rather than undefined.
  const effortOf = pokemonId => {
    const out = { hp: 0, attack: 0, defense: 0, spAttack: 0, spDefense: 0, speed: 0 };
    for (const r of statsByPokemon.get(pokemonId) || []) if (statKeys[r.stat_id]) out[statKeys[r.stat_id]] = Number(r.effort);
    return out;
  };

  for (const id of t.ids) {
    const sid = String(id);
    const pk = pokemonById.get(sid);
    const sp = speciesById.get(sid);
    if (!pk || !sp) { results.flagged.push(`id ${id}: missing pokemon/species row`); continue; }
    const region = t.regionOf(id);

    const typeRows = (typesByPokemon.get(sid) || []).sort((a, b) => a.slot - b.slot);
    const abilityRows = (abilitiesByPokemon.get(sid) || []).sort((a, b) => (a.is_hidden === b.is_hidden ? a.slot - b.slot : (a.is_hidden === "1" ? 1 : -1)));
    const hiddenRow = abilityRows.find(r => r.is_hidden === "1");
    const namesRows = namesBySpecies.get(sid) || [];
    const enName = namesRows.find(r => r.local_language_id === "9");
    results.pokemon[id] = {
      name: enName ? enName.name : null,
      region,
      types: typeRows.map(r => typeName(r.type_id)),
      category: enName ? enName.genus : null,
      height: Number(pk.height) / 10,
      weight: Number(pk.weight) / 10,
      abilities: abilityRows.map(r => abilityName(r.ability_id)),
      hiddenAbility: hiddenRow ? abilityName(hiddenRow.ability_id) : null,
      // Species flags/ratio from pokemon_species.csv (0.2.1, TODO.md #10).
      // Booleans are written only when true; genderRate is -1 (genderless)
      // or 0-8 eighths-female, so it's always written.
      isLegendary: sp.is_legendary === "1",
      isMythical: sp.is_mythical === "1",
      isBaby: sp.is_baby === "1",
      genderRate: Number(sp.gender_rate),
      // Second species/pokemon-row batch (0.2.5, TODO.md #10). Booleans are
      // written only when true; `habitat` is the resolved display name (many
      // species have no habitat_id at all — Gen 4+ dropped the field);
      // baseExperience comes off this species' default pokemon.csv row.
      hasGenderDifferences: sp.has_gender_differences === "1",
      habitat: habitatById.get(sp.habitat_id) ? titleCase(habitatById.get(sp.habitat_id).identifier) : null,
      formsSwitchable: sp.forms_switchable === "1",
      baseExperience: pk.base_experience ? Number(pk.base_experience) : null,
      regionalDexNumbers: (() => {
        const found = {};
        for (const r of dexNumsBySpecies.get(sid) || []) {
          const rg = regionByPokedexId.get(r.pokedex_id);
          if (rg) found[rg] = Number(r.pokedex_number);
        }
        // REGIONS order, not pokemon_dex_numbers.csv row order.
        const out = {};
        for (const rg of Object.keys(REGION_GEN)) if (found[rg] !== undefined) out[rg] = found[rg];
        return out;
      })(),
      eggGroups: (eggGroupsBySpecies.get(sid) || []).map(r => eggGroupName.get(r.egg_group_id)).filter(Boolean),
      // Per-game since 0.2.8 (user call, overriding 0.2.7's single max-rarity
      // number): one `rates` group per distinct rarity, listing the games that
      // share it. Items still sort by their highest rate, then slug.
      heldItems: (() => {
        const byItem = new Map();
        for (const r of heldItemsByPokemon.get(sid) || []) {
          const slug = itemSlug(r.item_id);
          if (!slug) continue;
          if (!byItem.has(slug)) byItem.set(slug, new Map());
          byItem.get(slug).set(r.version_id, { rate: Number(r.rarity) });
        }
        return [...byItem].map(([item, byVer]) => ({ item, rates: groupByVersion(byVer, v => String(v.rate)) }))
          .sort((a, b) => Math.max(...b.rates.map(x => x.rate)) - Math.max(...a.rates.map(x => x.rate)) || (a.item < b.item ? -1 : 1));
      })(),
    };

    // raw flavor text (latest version) kept only as an authoring aid, NOT written verbatim
    const flavRows = (flavorBySpecies.get(sid) || []).filter(r => r.language_id === "9");
    results.pokemon[id]._flavorHint = flavRows.length ? flavRows[flavRows.length - 1].flavor_text.replace(/\s+/g, " ").trim() : null;

    const st = statsOf(sid);
    const growth = GROWTH[sp.growth_rate_id] || { curve: "?", points: null };
    results.stats[id] = Object.assign(st, { captureRate: Number(sp.capture_rate), baseHappiness: Number(sp.base_happiness), expGrowth: { points: growth.points, curve: growth.curve }, hatchCounter: Number(sp.hatch_counter), effort: effortOf(sid) });

    // evolutions.js: species that evolve FROM this one
    const evolvesTo = [];
    for (const [targetId, rows] of evoByTarget) {
      if (!rows.length) continue;
      const targetSpecies = speciesById.get(targetId);
      if (!targetSpecies || targetSpecies.evolves_from_species_id !== sid) continue;
      const targetNum = Number(targetId);
      if (!allowedTargets.has(targetNum)) { results.flagged.push(`evolution ${id}->${targetId}: target not in POKEMON_DATA or this batch, omitted`); continue; }
      // Row selection: a set `base_form_id` marks a regional-variant-only
      // path to the same target (Alolan Vulpix's Ice Stone route to
      // Ninetales) — prefer a plain row, but keep a form-restricted one if
      // it's all there is (this is what keeps Sneasler reachable). Among
      // what's left, the row carrying an item wins, so a species with both
      // a legacy and a modern method (Feebas->Milotic, Nosepass->Probopass)
      // shows the modern item one.
      const plain = rows.filter(r => !r.base_form_id);
      const cands = plain.length ? plain : rows;
      const row = cands.find(r => r.trigger_item_id) || cands.find(r => r.held_item_id) || cands[0];
      const trigger = row.evolution_trigger_id;
      let method = "other", level;
      if (trigger === "1") { method = "level"; level = row.minimum_level ? Number(row.minimum_level) : undefined; }
      else if (trigger === "2") method = "trade";
      else if (trigger === "3") method = "stone";
      else if (trigger === "4") method = "level"; // shed (Nincada)
      const edge = { id: targetNum, method };
      if (level !== undefined) edge.level = level;
      // Item/condition fields, mirroring evolutions.js's optional keys.
      if (row.trigger_item_id) { edge.method = "stone"; edge.item = itemSlug(row.trigger_item_id); }
      else if (row.held_item_id && trigger === "2") edge.item = itemSlug(row.held_item_id);
      else if (row.held_item_id && trigger === "1") {
        // Held while leveling up, no trade — its own method, since "Lv N" /
        // "Friendship" would both be wrong labels.
        edge.method = "held";
        delete edge.level;
        edge.item = itemSlug(row.held_item_id);
      }
      // Friendship = happiness OR affection (Sylveon's selected row is the
      // Gen 6 affection one; both mean the same "Friendship" label here).
      const friendship = edge.method === "level" && (row.minimum_happiness || row.minimum_affection);
      if (row.time_of_day && (edge.method === "held" || friendship)) edge.timeOfDay = row.time_of_day;
      if (friendship && row.known_move_type_id) edge.moveType = typeSlug(row.known_move_type_id);
      // gender_id restricts which sex evolves (genders.csv 1/2/3) — a branch
      // descriptor, see the src/data/evolutions.js header. Genderless (3)
      // never appears on a real row; skip it rather than write a no-op field.
      if (GENDER[row.gender_id]) edge.gender = GENDER[row.gender_id];
      // "Knows a specific move" (Aipom, Yanma, Lickitung, ...) does have a
      // representation as of 0.1.39: the stone shape with the shared
      // tm-normal icon and the move name as the arrow label (see the
      // src/data/evolutions.js header). Must precede the "other" fallback.
      if (edge.method === "level" && edge.level === undefined && !friendship && row.known_move_id) {
        edge.method = "stone";
        edge.item = "tm-normal";
        edge.move = moveNameById.get(row.known_move_id);
      }
      // A level-up trigger with neither a level nor a friendship condition
      // is something the app has no label for (shed, known move, special
      // location, party species, beauty, ...) — "other" renders a blank
      // arrow instead of a wrong "Lv" one (TODO.md #7; matches the 8 edges
      // 0.1.30 hand-flipped).
      if (edge.method === "level" && edge.level === undefined && !friendship) edge.method = "other";
      evolvesTo.push(edge);
    }
    evolvesTo.sort((a, b) => a.id - b.id);
    results.evolutions[id] = evolvesTo;

    // movesets.js: pick the highest-`order` version_group that has data for
    // this species. Only level-up (1) / egg (2) / machine (4) rows count —
    // the newest version groups in the CSV (champions, legends-za,
    // mega-dimension) carry ONLY method 12 ("train") rows, and picking purely
    // by version-group order lands on those and yields an entirely empty
    // moveset (what left 92 of the shipped 1-493 entries empty, 0.1.28).
    const USABLE_METHODS = new Set(["1", "2", "4"]);
    const mvRows = (movesByPokemon.get(sid) || []).filter(r => USABLE_METHODS.has(r.pokemon_move_method_id));
    let bestVg = null, bestOrder = -1;
    for (const r of mvRows) {
      const vg = vgById.get(r.version_group_id);
      if (!vg) continue;
      const order = Number(vg.order);
      if (order > bestOrder) { bestOrder = order; bestVg = r.version_group_id; }
    }
    const chosen = bestVg ? mvRows.filter(r => r.version_group_id === bestVg) : [];
    const levelUp = [], tm = [], egg = [];
    const mvName = mid => moveNameById.get(mid) || `#${mid}`;
    for (const r of chosen) {
      if (r.pokemon_move_method_id === "1") {
        const e = { level: Number(r.level), move: mvName(r.move_id) };
        // Legends: Arceus move-mastery level (0.2.5). Only ever set on
        // level-up rows, and only in PLA-era version groups — absent
        // everywhere else, which is expected, not a gap.
        if (r.mastery !== "" && r.mastery !== undefined) e.mastery = Number(r.mastery);
        levelUp.push(e);
      } else if (r.pokemon_move_method_id === "4") tm.push(mvName(r.move_id));
      else if (r.pokemon_move_method_id === "2") egg.push(mvName(r.move_id));
    }
    levelUp.sort((a, b) => a.level - b.level);
    // Tutor moves (method 3), from the SAME version group already chosen
    // above — deliberately not part of the selection set, so adding them
    // can't shift which game's levelUp/tm/egg lists get stored.
    const tutor = bestVg ? (movesByPokemon.get(sid) || []).filter(r => r.version_group_id === bestVg && r.pokemon_move_method_id === "3").map(r => mvName(r.move_id)) : [];
    const dedupe = arr => [...new Set(arr)];
    results.movesets[id] = {
      levelUp, tm: dedupe(tm), egg: dedupe(egg), tutor: dedupe(tutor), max: [],
      _sourceGeneration: bestVg ? vgById.get(bestVg).identifier : null,
    };
    if (bestVg && vgById.get(bestVg).generation_id !== "9") {
      results.flagged.push(`id ${id} (${pk.identifier}): no Gen 9 moveset data, used "${vgById.get(bestVg).identifier}" instead`);
    }

    // names.js
    const nameOf = langId => { const r = namesRows.find(x => x.local_language_id === langId); return r ? r.name : null; };
    results.names[id] = { ja: nameOf("1"), jaRomaji: nameOf("2"), fr: nameOf("5"), de: nameOf("6"), ko: nameOf("3") };

    // locations.js (this species' own region's games only)
    const versionIds = t.versionsOf(id);
    const encRows = (encByPokemon.get(sid) || []).filter(r => versionIds.has(r.version_id));
    // Per area (location name) -> per method -> per GAME (0.2.8, user call
    // overriding 0.2.7's collapse): that game's own level range, and its rate
    // = the highest single (sub-area, condition set) slot-rarity sum, capped
    // at 100 — sub-areas/conditions are still never summed together. Games
    // whose (min, max, rate) are identical share one line via `games`.
    const byArea = new Map();
    const areaOrder = new Map();
    for (const r of encRows) {
      const area = locAreaById.get(r.location_area_id);
      if (!area) continue;
      const loc = locById.get(area.location_id);
      if (!loc) continue;
      const name = locNameById.get(loc.id) || titleCase(loc.identifier);
      if (!byArea.has(name)) byArea.set(name, new Map());
      // Sort key, not stored: this location's map index in the region's
      // chosen generation (null = no index, sorts into the alphabetical
      // tail). Keyed off loc.id, never the display name — "Victory Road"
      // and "Safari Zone" exist in several regions at once.
      const ord = locOrder(region, loc.id);
      if (ord !== null && (!areaOrder.has(name) || ord < areaOrder.get(name))) areaOrder.set(name, ord);
      const slot = encSlotById.get(r.encounter_slot_id);
      const method = slot && encMethodById.get(slot.encounter_method_id);
      if (!method) continue;
      const methods = byArea.get(name);
      if (!methods.has(method.id)) methods.set(method.id, { order: Number(method.order), method: methodLabel(method), byVer: new Map() });
      const m = methods.get(method.id);
      if (!m.byVer.has(r.version_id)) m.byVer.set(r.version_id, { min: Infinity, max: 0, buckets: new Map() });
      const v = m.byVer.get(r.version_id);
      v.min = Math.min(v.min, Number(r.min_level)); v.max = Math.max(v.max, Number(r.max_level));
      const bucket = r.location_area_id + "|" + (condByEncounter.get(r.id) || []).map(c => c.encounter_condition_value_id).sort().join("+");
      v.buckets.set(bucket, (v.buckets.get(bucket) || 0) + Number(slot.rarity));
    }
    results.locations[id] = {
      region,
      // In-game progression order (0.2.10, REGION_ORDER_GEN above) with the
      // old plain-string sort as the tie-break and as the tail for anything
      // the CSVs can't place.
      areas: [...byArea.keys()].sort((a, b) => {
        const oa = areaOrder.has(a) ? areaOrder.get(a) : null;
        const ob = areaOrder.has(b) ? areaOrder.get(b) : null;
        if (oa !== ob) return oa === null ? 1 : ob === null ? -1 : oa - ob;
        return a < b ? -1 : a > b ? 1 : 0;
      }).map(name => ({
        area: name,
        enc: [].concat(...[...byArea.get(name).values()].sort((a, b) => a.order - b.order).map(m => {
          for (const v of m.byVer.values()) v.rate = Math.min(100, Math.max(...v.buckets.values()));
          return groupByVersion(m.byVer, v => v.min + "," + v.max + "," + v.rate)
            .map(g => ({ method: m.method, games: g.games, min: g.min, max: g.max, rate: g.rate }));
        })),
      })),
    };

    // altforms.js: Mega formes only (pokemon_forms.csv is_mega), the shape
    // 0.1.34's extract_megas.js produced. Sprite name per TODO.md #3's rule:
    // species display name lowercased, then leftover form tokens after
    // "mega" ("charizard_x"). Types written only when they differ from base.
    const megas = megaFormsBySpecies.get(sid) || [];
    if (megas.length) {
      const baseName = results.pokemon[id].name;
      const baseTypes = results.pokemon[id].types.join("/");
      results.altforms[id] = megas.map(({ form, pk: mpk }) => {
        const fn = formNameByForm.get(form.id);
        const tokens = mpk.identifier.replace(/^[^-]+-mega/, "").split("-").filter(Boolean);
        const sprite = "mega/" + baseName.toLowerCase().replace(/\./g, "").replace(/[\s-]+/g, "_").replace(/’/g, "'") + (tokens.length ? "_" + tokens.join("_") : "");
        const types = (typesByPokemon.get(mpk.id) || []).sort((a, b) => a.slot - b.slot).map(r => typeName(r.type_id));
        const abilities = (abilitiesByPokemon.get(mpk.id) || []).map(r => abilityName(r.ability_id));
        for (const kind of ["", "shiny/"]) {
          if (!fs.existsSync(path.join(SPRITE_DIR, kind + "alt formes", sprite + ".png"))) results.flagged.push(`id ${id} Mega: no ${kind || "normal "}sprite at alt formes/${sprite}.png`);
        }
        return {
          key: "mega" + (tokens.length ? "-" + tokens.join("-") : ""),
          name: fn && fn.pokemon_name ? fn.pokemon_name : "Mega " + baseName,
          sprite, isMega: true,
          types: types.join("/") !== baseTypes ? types : null,
          stats: statsOf(mpk.id),
          ability: abilities[0] || null,
        };
      });
    }
  }

  // ---- moves/abilities referenced but not yet in the project's tables ----
  const neededAbilities = new Set();
  const neededMoves = new Set();
  for (const id in results.pokemon) for (const a of results.pokemon[id].abilities) neededAbilities.add(a);
  for (const id in results.altforms) for (const f of results.altforms[id]) if (f.ability) neededAbilities.add(f.ability);
  for (const id in results.movesets) {
    const ms = results.movesets[id];
    for (const x of ms.levelUp) neededMoves.add(x.move);
    for (const x of ms.tm) neededMoves.add(x);
    for (const x of ms.egg) neededMoves.add(x);
    for (const x of ms.tutor) neededMoves.add(x);
  }
  const missingAbilities = [...neededAbilities].filter(a => !current.abilities[a]);
  const missingMoves = [...neededMoves].filter(m => !current.moves[m]);

  const identifierToAbilityRow = new Map(csvs.abilities.map(a => [titleCase(a.identifier), a]));
  const identifierToMoveRow = new Map();
  for (const m of csvs.moves) { const nm = moveNameById.get(m.id); if (nm) identifierToMoveRow.set(nm, m); }
  const moveData = moveDataBuilder(csvs);
  const abilityData = abilityDataBuilder(csvs);
  results.missingAbilities = missingAbilities.map(a => {
    const row = identifierToAbilityRow.get(a);
    return Object.assign({ name: a, csvId: row ? row.id : null }, row ? abilityData(row, a) : { names: names5([]) });
  });
  results.missingMoves = missingMoves.map(name => {
    const row = identifierToMoveRow.get(name);
    if (!row) return { name, found: false };
    return Object.assign({ found: true }, moveData(row, name));
  });
  // Items referenced by this batch (held items + evolution items) that
  // data/items.js doesn't have yet. tm-normal is an app-internal icon for
  // "knows a move" edges, not an items.csv row — never listed.
  const neededItems = new Set();
  for (const id in results.pokemon) for (const h of results.pokemon[id].heldItems) neededItems.add(h.item);
  for (const id in results.evolutions) for (const e of results.evolutions[id]) if (e.item && e.item !== "tm-normal") neededItems.add(e.item);
  const itemData = itemDataBuilder(csvs);
  results.missingItems = [...neededItems].filter(s => !current.items[s]).sort().map(itemData);
  return results;
}
// items.js's per-entry CSV data: the English display name (the description
// stays hand-authored, like moves/abilities).
function itemDataBuilder(csvs) {
  const rowBySlug = new Map(csvs.items.map(i => [i.identifier, i]));
  const enName = new Map(csvs.itemNames.filter(r => r.local_language_id === "9").map(r => [r.item_id, r.name]));
  return slug => { const row = rowBySlug.get(slug); return { slug, name: row ? enName.get(row.id) || titleCase(slug) : titleCase(slug), found: !!row }; };
}
function itemEntryText(it, description) {
  return `  "${escD(it.slug)}": { name: "${escD(it.name)}", description: "${escD(description)}" }`;
}

function writeGenerateFiles(results, current) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
  const resultsFile = path.join(TEMP_DIR, `${results.slug}_results.json`);
  fs.writeFileSync(resultsFile, JSON.stringify(results, null, 1));

  // small flat manifest: just what needs a hand-authored description
  // (a species already in pokemon.js keeps its description — not listed)
  const manifest = {
    slug: results.slug,
    pokemon: results.ids.filter(id => results.pokemon[id] && !current.pokemonById.has(id)).map(id => ({ id, name: results.pokemon[id].name, flavorHint: results.pokemon[id]._flavorHint })),
    moves: results.missingMoves.map(m => m.name),
    abilities: results.missingAbilities.map(a => a.name),
    items: results.missingItems.map(i => i.slug),
  };
  const manifestFile = path.join(TEMP_DIR, `${results.slug}_needs_descriptions.json`);
  fs.writeFileSync(manifestFile, JSON.stringify(manifest, null, 1));

  console.log(`\nWrote ${resultsFile}`);
  console.log(`Wrote ${manifestFile} (${manifest.pokemon.length} pokemon, ${manifest.moves.length} moves, ${manifest.abilities.length} abilities, ${manifest.items.length} items need descriptions)`);
  console.log("Flagged:", results.flagged.length, "| Missing abilities:", results.missingAbilities.length, "| Missing moves:", results.missingMoves.length);
  for (const f of results.flagged) console.log("  " + f);
}

// =========================================================================
// UPSERT: replace-or-insert entries in a src/data/*.js table, in id order
// =========================================================================
// Every per-id table is `var X = {` … `};` with each entry starting at
// column 2 as `  <id>: `; pokemon.js is `var POKEMON_DATA = [` … `];` with
// `  { id: <id>, `. Entries are chunked at those key lines (inner lines are
// indented deeper, so a multi-line movesets/altforms block stays one chunk;
// a comment line between entries rides along with the entry before it).
// `entries` = [{ id, text }] with text carrying NO trailing comma; an
// existing id is replaced in place, a new one is inserted before the first
// larger id (or appended if the file isn't id-sorted, like altforms.js).
function upsertEntries(file, entries) {
  if (!entries.length) return;
  const p = path.join(DATA_DIR, file);
  const src = fs.readFileSync(p, "utf8");
  const isArray = file === "pokemon.js";
  const openM = src.match(isArray ? /^var \w+ = \[\n/m : /^var \w+ = \{\n/m);
  const close = src.lastIndexOf(isArray ? "\n];" : "\n};");
  if (!openM || close === -1) throw new Error(`${file}: can't find the table's open/close`);
  const openEnd = openM.index + openM[0].length;
  let head = src.slice(0, openEnd);
  const tail = src.slice(close + 1);
  const keyRe = isArray ? /^  \{ id: (\d+),/ : /^  (\d+): /;
  const chunks = [];
  let cur = null;
  for (const line of src.slice(openEnd, close).split("\n")) {
    const m = line.match(keyRe);
    if (m) { cur = { id: Number(m[1]), lines: [line] }; chunks.push(cur); }
    else if (cur) cur.lines.push(line);
    else head += line + "\n"; // leading comment/blank lines before the first entry
  }
  // Each chunk = code (its own comma stripped, a same-line trailing comment
  // kept) + trailer (blank/comment lines after it, which ride along).
  const isTrailer = l => /^\s*(\/\/.*)?$/.test(l);
  const lastHadComma = chunks.length > 0 && /,([ \t]*\/\/[^\n]*)?$/.test(chunks[chunks.length - 1].lines.filter(l => !isTrailer(l)).join("\n"));
  const parsed = chunks.map(c => {
    let n = c.lines.length;
    while (n > 0 && isTrailer(c.lines[n - 1])) n--;
    return { id: c.id, code: c.lines.slice(0, n).join("\n").replace(/,([ \t]*\/\/[^\n]*)?$/, "$1"), trailer: c.lines.slice(n) };
  });
  const ids = parsed.map(c => c.id);
  const sorted = ids.every((id, i) => i === 0 || id > ids[i - 1]);
  for (const e of entries.slice().sort((a, b) => a.id - b.id)) {
    const at = parsed.findIndex(c => c.id === e.id);
    if (at !== -1) { parsed[at].code = e.text; continue; }
    const before = sorted ? parsed.findIndex(c => c.id > e.id) : -1;
    const fresh = { id: e.id, code: e.text, trailer: [] };
    if (before === -1) parsed.push(fresh); else parsed.splice(before, 0, fresh);
  }
  const body = parsed.map((c, i) => {
    const code = i < parsed.length - 1 || lastHadComma ? c.code.replace(/([ \t]*\/\/[^\n]*)?$/, ",$1") : c.code;
    return code + c.trailer.map(l => "\n" + l).join("");
  }).join("\n");
  fs.writeFileSync(p, head + body + "\n" + tail);
}

// =========================================================================
// ASSEMBLE: results (+ descriptions) -> src/data/*.js
// =========================================================================
function esc(s) { return String(s).replace(/\\/g, "\\\\").replace(/'/g, "\\'"); }
function escD(s) { return String(s).replace(/\\/g, "\\\\").replace(/"/g, '\\"'); }
function statsText(s) {
  return `{ hp: ${s.hp}, attack: ${s.attack}, defense: ${s.defense}, spAttack: ${s.spAttack}, spDefense: ${s.spDefense}, speed: ${s.speed}`;
}
function namesText(n) {
  return `{ ${NAME_LANGS.filter(([k]) => n[k] !== null && n[k] !== undefined).map(([k]) => `${k}: "${escD(n[k])}"`).join(", ")} }`;
}
// One moves.js / abilities.js entry line, WITHOUT the trailing comma (the
// callers add it). Shared by the pipeline's new-entry writers and the 0.2.5
// backfill so every entry in those two tables has an identical field order.
function moveEntryText(mv, description) {
  const parts = [
    `type: "${escD(mv.type)}"`, `category: "${escD(mv.category)}"`,
    `power: ${mv.power === null ? "null" : mv.power}`, `accuracy: ${mv.accuracy === null ? "null" : mv.accuracy}`,
    `pp: ${mv.pp}`, `description: "${escD(description)}"`,
    `priority: ${mv.priority}`, `target: "${escD(mv.target)}"`,
  ];
  if (mv.effectChance !== null && mv.effectChance !== undefined) parts.push(`effectChance: ${mv.effectChance}`);
  if (mv.flags && mv.flags.length) parts.push(`flags: [${mv.flags.map(f => `"${f}"`).join(", ")}]`);
  if (mv.meta) parts.push(`meta: { ${Object.keys(mv.meta).map(k => `${k}: ${typeof mv.meta[k] === "string" ? `"${escD(mv.meta[k])}"` : mv.meta[k]}`).join(", ")} }`);
  parts.push(`names: ${namesText(mv.names)}`);
  return `  "${escD(mv.name)}": { ${parts.join(", ")} }`;
}
function abilityEntryText(ab, description) {
  return `  "${escD(ab.name)}": { description: "${escD(description)}", names: ${namesText(ab.names)} }`;
}
function evoStepText(s) {
  const parts = [`id: ${s.id}`, `method: "${s.method}"`];
  if (s.level !== undefined) parts.push(`level: ${s.level}`);
  if (s.item) parts.push(`item: "${s.item}"`);
  if (s.timeOfDay) parts.push(`timeOfDay: "${s.timeOfDay}"`);
  if (s.moveType) parts.push(`moveType: "${s.moveType}"`);
  if (s.move) parts.push(`move: "${escD(s.move)}"`);
  if (s.gender) parts.push(`gender: "${s.gender}"`);
  return `{ ${parts.join(", ")} }`;
}
// One locations.js area entry (0.2.8 shape: one enc line per method per
// game-group). A bare string is a pre-0.2.7 area (populate_hisui_species.js
// still writes those) — passed through.
function areaText(a) {
  if (typeof a === "string") return `"${escD(a)}"`;
  return `{ area: "${escD(a.area)}", enc: [${a.enc.map(e => `{ method: "${escD(e.method)}", games: "${escD(e.games)}", min: ${e.min}, max: ${e.max}, rate: ${e.rate} }`).join(", ")}] }`;
}
function altFormsText(id, baseName, formes) {
  const lines = [`  ${id}: { // ${baseName} — Mega Evolution${formes.length > 1 ? "s (X/Y)" : ""}`, "    formes: ["];
  formes.forEach((f, i) => {
    let l = `      { key: "${f.key}", name: "${escD(f.name)}", sprite: "${f.sprite}", isMega: true,\n`;
    if (f.types) l += `        types: [${f.types.map(t => `"${t}"`).join(", ")}],\n`;
    l += `        stats: ${statsText(f.stats)} }` + (f.ability ? `,\n        ability: "${escD(f.ability)}" }` : " }") + (i < formes.length - 1 ? "," : "");
    lines.push(l);
  });
  lines.push("    ]", "  }");
  return lines.join("\n");
}

// strict: every new species/move/ability must have a description (region /
// --assemble). lenient (--refresh): skip + report instead.
function assemble(results, descriptions, tables, strict, current) {
  const d = descriptions || { pokemon: {}, moves: {}, abilities: {}, items: {} };
  d.pokemon = d.pokemon || {}; d.moves = d.moves || {}; d.abilities = d.abilities || {}; d.items = d.items || {};
  const skipped = [];
  const skip = msg => { if (strict) throw new Error(msg); skipped.push(msg); };
  const want = tb => tables.indexOf(tb) !== -1;

  // ---- moves.js / abilities.js additions (only those with a description) ----
  const addableMoves = results.missingMoves.filter(m => d.moves[m.name]);
  const addableAbilities = results.missingAbilities.filter(a => d.abilities[a.name]);
  const unresolvedMoves = new Set(results.missingMoves.filter(m => !d.moves[m.name]).map(m => m.name));
  const unresolvedAbilities = new Set(results.missingAbilities.filter(a => !d.abilities[a.name]).map(a => a.name));
  const passLabel = results.slug[0].toUpperCase() + results.slug.slice(1);
  if (addableMoves.length) {
    const lines = addableMoves.map(mv => moveEntryText(mv, d.moves[mv.name]) + ",");
    const block = `\n  // Moves added during the ${passLabel} CSV-pipeline pass.\n${lines.join("\n")}\n};`;
    fs.writeFileSync(path.join(DATA_DIR, "moves.js"), fs.readFileSync(path.join(DATA_DIR, "moves.js"), "utf8").replace(/\n\};\s*$/, block + "\n"));
  }
  if (addableAbilities.length) {
    const lines = addableAbilities.map(ab => abilityEntryText(ab, d.abilities[ab.name]) + ",");
    const block = `\n  // Abilities added during the ${passLabel} CSV-pipeline pass.\n${lines.join("\n")}\n};`;
    fs.writeFileSync(path.join(DATA_DIR, "abilities.js"), fs.readFileSync(path.join(DATA_DIR, "abilities.js"), "utf8").replace(/\n\};\s*$/, block + "\n"));
  }
  // ---- items.js additions (0.2.7) — same rule as moves/abilities: a
  // referenced item with no description is an error in strict mode; in
  // lenient mode the pokemon entry that needs it is skipped below.
  const missingItems = results.missingItems || [];
  const addableItems = missingItems.filter(i => d.items[i.slug]);
  const unresolvedItems = new Set(missingItems.filter(i => !d.items[i.slug]).map(i => i.slug));
  if (addableItems.length) {
    const lines = addableItems.map(it => itemEntryText(it, d.items[it.slug]) + ",");
    const block = `\n  // Items added during the ${passLabel} CSV-pipeline pass.\n${lines.join("\n")}\n};`;
    fs.writeFileSync(path.join(DATA_DIR, "items.js"), fs.readFileSync(path.join(DATA_DIR, "items.js"), "utf8").replace(/\n\};\s*$/, block + "\n"));
  }

  const ids = results.ids.filter(id => results.pokemon[id]);

  // ---- pokemon.js ----
  if (want("pokemon")) {
    const entries = [];
    for (const id of ids) {
      const pk = results.pokemon[id];
      const existing = current.pokemonById.get(id);
      const name = (existing && existing.name) || pk.name;
      const desc = d.pokemon[id] || (existing && existing.description);
      if (!name) throw new Error("no name (existing or CSV-sourced) for id " + id);
      if (!desc) { skip(`pokemon ${id}: no description`); continue; }
      const badAbility = pk.abilities.find(a => unresolvedAbilities.has(a));
      if (badAbility) { skip(`pokemon ${id}: ability "${badAbility}" has no description yet`); continue; }
      const badItem = (pk.heldItems || []).find(h => unresolvedItems.has(h.item));
      if (badItem) { skip(`pokemon ${id}: item "${badItem.item}" has no description yet`); continue; }
      if (!existing && !pk.region) throw new Error(`id ${id}: no mainline region (a Legends: Arceus original? use populate_hisui_species.js)`);
      const where = existing && existing.hisuiOnly ? "hisuiOnly: true" : `region: '${pk.region}'`;
      const hidden = pk.hiddenAbility ? `, hiddenAbility: '${esc(pk.hiddenAbility)}'` : "";
      const flags = (pk.isLegendary ? ", isLegendary: true" : "") + (pk.isMythical ? ", isMythical: true" : "") + (pk.isBaby ? ", isBaby: true" : "");
      // hasFemaleSprite is hand-derived from the bundled sprite folder, not
      // CSV-sourced (SCOPE.md §2) — carried over from the existing entry so
      // a --refresh --tables pokemon can't silently drop it.
      const femaleSprite = existing && existing.hasFemaleSprite ? ", hasFemaleSprite: true" : "";
      const rdnKeys = Object.keys(pk.regionalDexNumbers || {});
      const extra = (pk.hasGenderDifferences ? ", hasGenderDifferences: true" : "")
        + (pk.habitat ? `, habitat: '${esc(pk.habitat)}'` : "")
        + (pk.formsSwitchable ? ", formsSwitchable: true" : "")
        + (pk.baseExperience !== null && pk.baseExperience !== undefined ? `, baseExperience: ${pk.baseExperience}` : "")
        + (rdnKeys.length ? `, regionalDexNumbers: { ${rdnKeys.map(r => `${r}: ${pk.regionalDexNumbers[r]}`).join(", ")} }` : "")
        + (pk.eggGroups.length ? `, eggGroups: [${pk.eggGroups.map(g => `'${esc(g)}'`).join(", ")}]` : "")
        + ((pk.heldItems || []).length ? `, heldItems: [${pk.heldItems.map(h => `{ item: '${esc(h.item)}', rates: [${h.rates.map(g => `{ games: '${esc(g.games)}', rate: ${g.rate} }`).join(", ")}] }`).join(", ")}]` : "");
      entries.push({ id, text: `  { id: ${id}, name: '${esc(name)}', ${where}, types: [${pk.types.map(t => `'${esc(t)}'`).join(", ")}], category: '${esc(pk.category)}', height: ${pk.height}, weight: ${pk.weight}${flags}, genderRate: ${pk.genderRate}${femaleSprite}, abilities: [${pk.abilities.map(a => `'${esc(a)}'`).join(", ")}]${hidden}, description: '${esc(desc)}'${extra} }` });
    }
    upsertEntries("pokemon.js", entries);
  }

  // ---- stats.js ----
  if (want("stats")) upsertEntries("stats.js", ids.map(id => {
    const s = results.stats[id];
    const e = s.effort;
    return { id, text: `  ${id}: ${statsText(s)}, captureRate: ${s.captureRate}, baseHappiness: ${s.baseHappiness}, expGrowth: { points: ${s.expGrowth.points}, curve: "${s.expGrowth.curve}" }, hatchCounter: ${s.hatchCounter}, effort: { hp: ${e.hp}, attack: ${e.attack}, defense: ${e.defense}, spAttack: ${e.spAttack}, spDefense: ${e.spDefense}, speed: ${e.speed} } }` };
  }));

  // ---- evolutions.js ----
  if (want("evolutions")) upsertEntries("evolutions.js", ids.map(id => ({ id, text: `  ${id}: { evolvesTo: [${results.evolutions[id].map(evoStepText).join(", ")}] }` })));

  // ---- movesets.js ----
  if (want("movesets")) {
    const entries = [];
    for (const id of ids) {
      const ms = results.movesets[id];
      const bad = [...ms.levelUp.map(x => x.move), ...ms.tm, ...ms.egg, ...ms.tutor].find(m => unresolvedMoves.has(m));
      if (bad) { skip(`movesets ${id}: move "${bad}" has no description yet`); continue; }
      const lu = ms.levelUp.map(x => `{level:${x.level},move:"${escD(x.move)}"${x.mastery !== undefined ? `,mastery:${x.mastery}` : ""}}`).join(",");
      const tm = ms.tm.map(x => `"${escD(x)}"`).join(",");
      const egg = ms.egg.map(x => `"${escD(x)}"`).join(",");
      const tutor = ms.tutor.map(x => `"${escD(x)}"`).join(",");
      entries.push({ id, text: `  ${id}: {\n    levelUp: [${lu}],\n    tm: [${tm}],\n    egg: [${egg}],\n    tutor: [${tutor}],\n    max: []\n  }` });
    }
    upsertEntries("movesets.js", entries);
  }

  // ---- names.js ----
  if (want("names")) upsertEntries("names.js", ids.map(id => {
    const n = results.names[id];
    return { id, text: `  ${id}: { ja: "${escD(n.ja)}", jaRomaji: "${escD(n.jaRomaji)}", fr: "${escD(n.fr)}", de: "${escD(n.de)}", ko: "${escD(n.ko)}" }` };
  }));

  // ---- locations.js: merge this region's key into whatever other regions
  // the entry already lists (LOCATIONS[id] -> region -> areas) ----
  if (want("locations")) {
    const entries = [];
    for (const id of ids) {
      const { region, areas } = results.locations[id];
      const merged = Object.assign({}, current.tables.locations[id] || {});
      if (region && (areas.length || merged[region] === undefined)) merged[region] = areas;
      if (!Object.keys(merged).length) merged[region || "hisui"] = [];
      const body = Object.keys(merged).map(r => `${r}: [${merged[r].map(areaText).join(", ")}]`).join(", ");
      entries.push({ id, text: `  ${id}: { ${body} }` });
    }
    upsertEntries("locations.js", entries);
  }

  // ---- altforms.js: Megas, new entries only ----
  if (want("altforms")) {
    const entries = [];
    for (const id of ids) {
      const formes = results.altforms[id];
      if (!formes) continue;
      const withAbility = formes.map(f => Object.assign({}, f, { ability: f.ability && unresolvedAbilities.has(f.ability) ? null : f.ability }));
      formes.forEach(f => { if (f.ability && unresolvedAbilities.has(f.ability)) skip(`altforms ${id}/${f.key}: ability "${f.ability}" has no description yet — written without it`); });
      const text = altFormsText(id, results.pokemon[id].name, withAbility);
      if (current.tables.altforms[id]) {
        console.log(`altforms.js already has an entry for ${id} (${results.pokemon[id].name}) — not touched. Extracted Mega block for hand-merging:\n${text}`);
        continue;
      }
      entries.push({ id, text });
    }
    upsertEntries("altforms.js", entries);
  }

  console.log(`Assembly complete: ${ids.length} id(s), tables ${tables.join(",")}.`);
  console.log("Non-Gen9 moveset fallbacks:", results.flagged.filter(f => f.includes("no Gen 9")).length, "of", ids.length);
  console.log("New moves added:", addableMoves.length, "New abilities added:", addableAbilities.length);
  if (skipped.length) { console.log(`Skipped ${skipped.length} entry(ies):`); skipped.forEach(s => console.log("  " + s)); }

  console.log("\nRunning verify_region_data.js...");
  const verify = spawnSync(process.execPath, [path.join(__dirname, "verify_region_data.js")], { stdio: "inherit" });
  if (verify.status !== 0) {
    console.error(`\nverify_region_data.js FAILED (exit ${verify.status}) — review src/data/*.js before committing.`);
    process.exit(1);
  }
}

// =========================================================================
// AUDIT: diff src/data/*.js against what extract() derives from the CSVs
// =========================================================================
// Read-only. extract() is the single source of "what the CSVs say", so the
// audit is exactly "would --refresh change anything?" plus the checks
// --refresh can't express (region vs generation, moves.js/abilities.js
// keys, Mega formes inside an existing ALT_FORMS entry). Returns the
// discrepancy count. Known drift (TODO.md #7's 5 empty movesets / 5 missing
// evolution edges) is reported like anything else — this surfaces drift, it
// doesn't excuse it.
function audit(ids, csvs, current, verbose) {
  const t = resolveTargets({ ids }, csvs, current);
  const r = extract(t, csvs, current);
  const speciesById = new Map(csvs.species.map(s => [s.id, s]));
  const fmt = v => v === undefined ? "(absent)" : JSON.stringify(v);
  let n = 0;
  const tag = id => `${id} ${(current.pokemonById.get(id) || {}).name || ""}`.trim();
  const report = (label, field, exp, act) => { n++; console.log(`${label} ${field}: expected ${fmt(exp)} | actual ${fmt(act)}`); };
  const check = (label, field, exp, act) => { if (JSON.stringify(exp) !== JSON.stringify(act)) report(label, field, exp, act); };
  // order-insensitive list diff, summarized unless --verbose
  const checkList = (label, field, exp, act) => {
    const e = new Set(exp), a = new Set(act);
    const missing = exp.filter(x => !a.has(x)), extra = act.filter(x => !e.has(x));
    if (!missing.length && !extra.length) return;
    n++;
    console.log(`${label} ${field}: ${missing.length} missing, ${extra.length} extra (of ${exp.length} expected)` + (verbose ? `\n    missing: ${missing.join(", ") || "-"}\n    extra: ${extra.join(", ") || "-"}` : ""));
  };
  const EVO_KEYS = ["method", "level", "item", "timeOfDay", "moveType", "move", "gender"];
  const STAT_KEYS = ["hp", "attack", "defense", "spAttack", "spDefense", "speed", "captureRate", "baseHappiness", "hatchCounter"];

  for (const id of ids) {
    const L = tag(id), p = current.pokemonById.get(id), ep = r.pokemon[id];
    if (!ep) { report(L, "csv", "pokemon/species row", "(none)"); continue; }
    check(L, "pokemon.name", ep.name, p.name);
    if (!p.hisuiOnly) check(L, "pokemon.region", GEN_REGION[speciesById.get(String(id)).generation_id], p.region);
    for (const k of ["types", "category", "height", "weight", "abilities"]) check(L, "pokemon." + k, ep[k], p[k]);
    check(L, "pokemon.hiddenAbility", ep.hiddenAbility || undefined, p.hiddenAbility);
    // Written only when true, so a false expectation must read as absent.
    for (const k of ["isLegendary", "isMythical", "isBaby", "hasGenderDifferences", "formsSwitchable"]) check(L, "pokemon." + k, ep[k] || undefined, p[k]);
    check(L, "pokemon.genderRate", ep.genderRate, p.genderRate);
    check(L, "pokemon.habitat", ep.habitat || undefined, p.habitat);
    check(L, "pokemon.baseExperience", ep.baseExperience === null ? undefined : ep.baseExperience, p.baseExperience);
    check(L, "pokemon.regionalDexNumbers", Object.keys(ep.regionalDexNumbers).length ? ep.regionalDexNumbers : undefined, p.regionalDexNumbers);
    check(L, "pokemon.eggGroups", ep.eggGroups.length ? ep.eggGroups : undefined, p.eggGroups);
    check(L, "pokemon.heldItems", ep.heldItems.length ? ep.heldItems : undefined, p.heldItems);

    const s = current.tables.stats[id], es = r.stats[id];
    if (!s) report(L, "stats", "entry", undefined);
    else {
      for (const k of STAT_KEYS) check(L, "stats." + k, es[k], s[k]);
      check(L, "stats.expGrowth", es.expGrowth, s.expGrowth);
      check(L, "stats.effort", es.effort, s.effort);
    }

    const nm = current.tables.names[id], en = r.names[id];
    if (!nm) report(L, "names", "entry", undefined);
    else for (const k of ["ja", "jaRomaji", "fr", "de", "ko"]) check(L, "names." + k, en[k], nm[k]);

    const ev = (current.tables.evolutions[id] || {}).evolvesTo || [];
    for (const ee of r.evolutions[id]) {
      const ae = ev.find(x => x.id === ee.id);
      if (!ae) { report(L, `evolutions[->${ee.id}]`, ee, undefined); continue; }
      for (const k of EVO_KEYS) check(L, `evolutions[->${ee.id}].${k}`, ee[k], ae[k]);
    }
    for (const ae of ev) if (!r.evolutions[id].some(x => x.id === ae.id)) report(L, `evolutions[->${ae.id}]`, undefined, ae);

    const ms = current.tables.movesets[id], ems = r.movesets[id];
    if (!ms) report(L, "movesets", "entry", undefined);
    else {
      const lv = x => `${x.level}:${x.move}`;
      checkList(L, "movesets.levelUp", ems.levelUp.map(lv), (ms.levelUp || []).map(lv));
      checkList(L, "movesets.tm", ems.tm, ms.tm || []);
      checkList(L, "movesets.egg", ems.egg, ms.egg || []);
      checkList(L, "movesets.tutor", ems.tutor, ms.tutor || []);
      if ((ms.max || []).length) report(L, "movesets.max", [], ms.max);
    }

    const region = t.regionOf(id);
    if (region) checkList(L, `locations.${region}`, r.locations[id].areas.map(a => JSON.stringify(a)), ((current.tables.locations[id] || {})[region] || []).map(a => JSON.stringify(a)));

    // Megas: the only ALT_FORMS shape extract() produces. Non-Mega formes
    // (Deoxys/Castform/Hisuian/recolorOnly) are hand-curated, untouched.
    const megas = ((current.tables.altforms[id] || {}).formes || []).filter(f => f.isMega);
    for (const ef of r.altforms[id] || []) {
      const af = megas.find(f => f.key === ef.key);
      if (!af) { report(L, `altforms[${ef.key}]`, ef.name, undefined); continue; }
      check(L, `altforms[${ef.key}].name`, ef.name, af.name);
      check(L, `altforms[${ef.key}].sprite`, ef.sprite, af.sprite);
      check(L, `altforms[${ef.key}].types`, ef.types || undefined, af.types);
      check(L, `altforms[${ef.key}].stats`, ef.stats, af.stats);
      check(L, `altforms[${ef.key}].ability`, ef.ability || undefined, af.ability);
    }
    for (const af of megas) if (!(r.altforms[id] || []).some(f => f.key === af.key)) report(L, `altforms[${af.key}]`, undefined, af.name);
  }
  for (const f of r.flagged) {
    if (/sprite/.test(f)) report("-", "altforms sprite", "file on disk", f);
    else if (verbose) console.log("  note: " + f);
  }

  // moves.js / abilities.js: every key is a real PokeAPI name; move stats match
  const abilityRowByName = new Map(csvs.abilities.map(a => [titleCase(a.identifier), a]));
  const abilityData = abilityDataBuilder(csvs);
  for (const [k, a] of Object.entries(current.abilities)) {
    const row = abilityRowByName.get(k);
    if (!row) { report("-", `abilities.js "${k}"`, "a PokeAPI ability name", "unknown"); continue; }
    check(`- abilities.js "${k}"`, "names", abilityData(row, k).names, a.names);
  }
  const moveById = new Map(csvs.moves.map(m => [m.id, m]));
  const moveRowByName = new Map();
  for (const x of csvs.moveNames) if (x.local_language_id === "9" && moveById.has(x.move_id)) moveRowByName.set(x.name, moveById.get(x.move_id));
  const moveData = moveDataBuilder(csvs);
  for (const [k, m] of Object.entries(current.moves)) {
    const row = moveRowByName.get(k);
    if (!row) { report("-", `moves.js "${k}"`, "a PokeAPI move name", "unknown"); continue; }
    const exp = moveData(row, k);
    for (const f of ["type", "category", "power", "accuracy", "pp", "priority", "target", "names"]) check(`- moves.js "${k}"`, f, exp[f], m[f]);
    // Optional keys: absent in the file when the CSV has nothing to say.
    check(`- moves.js "${k}"`, "effectChance", exp.effectChance === null ? undefined : exp.effectChance, m.effectChance);
    check(`- moves.js "${k}"`, "flags", exp.flags.length ? exp.flags : undefined, m.flags);
    check(`- moves.js "${k}"`, "meta", exp.meta || undefined, m.meta);
  }

  // items.js: every key is a real items.csv slug with the CSV's English name.
  const itemData = itemDataBuilder(csvs);
  for (const [slug, it] of Object.entries(current.items)) {
    const exp = itemData(slug);
    if (!exp.found) { report("-", `items.js "${slug}"`, "a PokeAPI item slug", "unknown"); continue; }
    check(`- items.js "${slug}"`, "name", exp.name, it.name);
  }

  console.log(n === 0 ? `AUDIT PASS: ${ids.length} id(s), ${Object.keys(current.moves).length} moves, ${Object.keys(current.abilities).length} abilities, ${Object.keys(current.items).length} items match the CSVs.` : `AUDIT: ${n} discrepancy(ies) across ${ids.length} id(s).`);
  return n;
}

// =========================================================================
// GAPS: Pokédex-relevant CSV columns with no src/data representation
// =========================================================================
// Static, hand-curated 2026-09-05 (contest/pal-park/conquest/berry tables
// deliberately out of scope — not listed). Each entry's table+column is
// checked against the clone's real header so a stale row fails loudly.
// Prune a row here when its field lands in the schema.
const SCHEMA_GAPS = [
  // Pruned as they landed: is_legendary/is_mythical/is_baby, gender_rate,
  // base_happiness (0.2.1); has_gender_differences, habitat_id,
  // forms_switchable, base_experience, effort, hatch_counter, mastery,
  // move_meta.*, move_flags, ability_names, move_names, type_names,
  // natures, experience (0.2.5); egg groups, encounter slot/method/level
  // detail, items (0.2.7).
  ["pokemon_species.csv", "color_id,shape_id", "Pokédex color / body shape (lookup names in pokemon_colors / pokemon_shapes + their *_names). Deliberately out of scope — user decision 2026-09-05, not a \"later\"; habitat_id from the same row landed 0.2.5"],
  ["pokemon_species.csv", "order", "official ordering that places formes/regional variants next to their species (differs from national id)"],
  ["pokemon_items.csv", "version_id", "per-game held-item rarity landed 0.2.8 (heldItems[].rates: one { games, rate } group per distinct rarity); still collapsed: games sharing a rarity are joined into one string rather than kept as version ids"],
  ["pokemon_dex_numbers.csv", "pokedex_id,pokedex_number", "KALOS ONLY as of 0.2.5: pokemon.js's regionalDexNumbers covers the 8 regions with an unambiguous base pokedex, but Kalos has just the 3 kalos-central/coastal/mountain sub-dexes and no national-style parent, so it is skipped rather than merged by a guessed rule (see regionalPokedexes())"],
  ["pokemon_moves.csv", "pokemon_move_method_id", "methods 1/2/3/4 (level-up/egg/tutor/machine) are stored as of 0.2.5; the rest (form-change, stadium/XD specials, PLA \"train\", ...) are still dropped"],
  ["pokemon_moves.csv", "version_group_id", "only the newest usable version group is stored — no per-game learnset history (deliberately deferred 2026-09-05: one list vs. a list keyed by game is an unsettled data-shape decision)"],
  ["pokemon_evolution.csv", "location_id,minimum_beauty,party_species_id,party_type_id,trade_species_id,needs_overworld_rain,turn_upside_down,minimum_move_count,minimum_steps,minimum_damage_taken", "evolution conditions the schema collapses to method \"other\" (TODO.md #7; known_move_id is represented as of 0.1.39, gender_id as of 0.2.2, relative_physical_stats hand-authored). Only 4 in-range edges actually set any of these — Sliggoo->Goodra (rain), Stantler->Wyrdeer and Qwilfish->Overqwil (use a move N times), Basculin->Basculegion (recoil damage) — all left unlabelled pending a user call on wording"],
  ["pokemon_evolution.csv", "version_group_id,is_default", "per-version alternative evolution methods (one row is picked)"],
  ["evolution_chains.csv", "baby_trigger_item_id", "incense needed to breed the baby stage"],
  ["encounters.csv", "version_id", "per-game encounter tables landed 0.2.8 (locations.js enc lines carry `games`, one line per method per game-group); still not stored: condition values (time of day, season, swarm) — they only separate the rate buckets within a game"],
  ["pokemon_forms.csv", "is_battle_only,introduced_in_version_group_id", "battle-only formes and forme debut game — only Mega/Hisuian/recolor formes are represented at all (TODO.md #4)"],
  ["moves.csv", "effect_id,generation_id", "the move's effect-text id (move_effect_prose.csv) and debut generation; priority/target_id/effect_chance landed 0.2.5"],
  ["abilities.csv", "generation_id", "ability debut generation"],
  ["items.csv", "category_id,cost,fling_power", "data/items.js (0.2.7) holds only name + hand-authored description for items the app references (held/evolution items) — no category, price or Fling data, and no full-catalogue Bag screen (TODO.md #8)"],
];
function gaps() {
  let bad = 0;
  for (const [file, cols, note] of SCHEMA_GAPS) {
    const p = path.join(CSV_DIR, file);
    const header = fs.existsSync(p) ? fs.readFileSync(p, "utf8").split("\n")[0].trim().split(",") : null;
    const missing = header ? cols.split(",").filter(c => header.indexOf(c) === -1) : cols.split(",");
    if (missing.length) bad++;
    console.log(`${file}  ${cols}${missing.length ? `  [STALE: ${header ? "no column " + missing.join(",") : "file missing"}]` : ""}\n    ${note}`);
  }
  console.log(`${SCHEMA_GAPS.length} gap group(s)${bad ? `, ${bad} stale row(s) — fix SCHEMA_GAPS` : ""}.`);
  return bad;
}

// =========================================================================
// CLI
// =========================================================================
function usageAndExit(msg) {
  if (msg) console.error("ERROR: " + msg + "\n");
  console.error([
    "Usage: node tools/populate_region.js (<region> | --ids 1,2,3) --dry-run|--generate|--assemble [descriptions.json]|--refresh [descriptions.json] [--tables a,b,c]",
    "       node tools/populate_region.js [<region> | --ids 1,2,3] --audit [--verbose]",
    "       node tools/populate_region.js --gaps",
    `Regions: ${Object.keys(REGION_GEN).join(", ")}`,
    `Tables:  ${ALL_TABLES.join(", ")} (default all; moves/abilities additions always)`,
    "  --dry-run   resolve + print all auto-derived params, no writes",
    "  --generate  extract CSV data -> temp/<slug>_results.json + temp/<slug>_needs_descriptions.json",
    "  --assemble  consume temp/<slug>_results.json + descriptions.json -> upsert src/data/*.js, then verify (strict)",
    "  --refresh   generate + assemble in one step for ids already in pokemon.js; existing descriptions kept (lenient)",
    "  --audit     read-only diff of src/data/*.js vs the CSVs (all populated ids by default); exit 1 on any mismatch",
    "  --gaps      read-only list of Pokédex-relevant CSV columns the schema doesn't represent",
  ].join("\n"));
  process.exit(1);
}

function parseArgs(argv) {
  const out = { target: {}, action: null, descriptions: null, tables: ALL_TABLES.slice(), verbose: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--verbose") out.verbose = true;
    else if (a === "--audit" || a === "--gaps") out.action = a;
    else if (a in REGION_GEN) out.target = { region: a };
    else if (a === "--ids") { const v = argv[++i] || ""; out.target = { ids: v.split(",").map(s => Number(s.trim())).filter(n => Number.isInteger(n) && n > 0) }; if (!out.target.ids.length) usageAndExit("--ids needs a comma-separated id list"); }
    else if (a === "--tables") { out.tables = (argv[++i] || "").split(",").map(s => s.trim()).filter(Boolean); const bad = out.tables.filter(t => ALL_TABLES.indexOf(t) === -1); if (bad.length || !out.tables.length) usageAndExit("unknown table(s): " + bad.join(", ")); }
    else if (["--dry-run", "--generate", "--assemble", "--refresh"].indexOf(a) !== -1) { out.action = a; if ((a === "--assemble" || a === "--refresh") && argv[i + 1] && !argv[i + 1].startsWith("--")) out.descriptions = argv[++i]; }
    else usageAndExit("unrecognized argument: " + a);
  }
  if (!out.action) usageAndExit("give an action");
  if (!out.target.region && !out.target.ids && out.action !== "--audit" && out.action !== "--gaps") usageAndExit("give a region or --ids");
  return out;
}

if (require.main === module) {
  const args = parseArgs(process.argv.slice(2));
  try {
    if (args.action === "--gaps") process.exit(gaps() ? 1 : 0);
    const current = currentData();
    if (args.action === "--audit") {
      // scope: everything in pokemon.js, or the target's ids that are in it
      let ids = [...current.pokemonById.keys()];
      if (args.target.ids) ids = ids.filter(id => args.target.ids.indexOf(id) !== -1);
      else if (args.target.region) ids = ids.filter(id => current.pokemonById.get(id).region === args.target.region);
      if (!ids.length) throw new Error("no populated ids match the target");
      process.exit(audit(ids.sort((a, b) => a - b), loadAllCSVs(), current, args.verbose) ? 1 : 0);
    } else if (args.action === "--dry-run") {
      printTargets(resolveTargets(args.target, loadParamCSVs(), current), current);
    } else if (args.action === "--generate") {
      const csvs = loadAllCSVs();
      const t = resolveTargets(args.target, csvs, current);
      printTargets(t, current);
      writeGenerateFiles(extract(t, csvs, current), current);
    } else if (args.action === "--assemble") {
      const slug = args.target.region || "species";
      const resultsFile = path.join(TEMP_DIR, `${slug}_results.json`);
      if (!fs.existsSync(resultsFile)) throw new Error(`${resultsFile} not found — run --generate first`);
      const descPath = args.descriptions || path.join(TEMP_DIR, "descriptions.json");
      if (!fs.existsSync(descPath)) throw new Error(`${descPath} not found`);
      const results = JSON.parse(fs.readFileSync(resultsFile, "utf8"));
      if (!results.ids || !results.altforms) throw new Error(`${resultsFile} predates the 2026-09-05 pipeline — re-run --generate`);
      if (args.target.ids) results.ids = results.ids.filter(id => args.target.ids.indexOf(id) !== -1);
      assemble(results, JSON.parse(fs.readFileSync(descPath, "utf8")), args.tables, true, current);
    } else if (args.action === "--refresh") {
      const csvs = loadAllCSVs();
      const t = resolveTargets(args.target, csvs, current);
      const missing = t.ids.filter(id => !current.pokemonById.has(id));
      if (missing.length) throw new Error(`--refresh is for ids already in pokemon.js; new here: ${missing.slice(0, 10).join(", ")}${missing.length > 10 ? ", ..." : ""} — use --generate/--assemble`);
      const descriptions = args.descriptions ? JSON.parse(fs.readFileSync(args.descriptions, "utf8")) : null;
      const results = extract(t, csvs, current);
      for (const f of results.flagged) console.log("  " + f);
      assemble(results, descriptions, args.tables, false, current);
    }
  } catch (e) {
    console.error("ERROR:", e.message);
    process.exit(1);
  }
}

module.exports = { parseCSV, loadCSV, loadAllCSVs, currentData, resolveTargets, extract, upsertEntries, assemble, audit, gaps, GROWTH, NAME_LANGS, names5, regionalPokedexes, moveDataBuilder, abilityDataBuilder, moveEntryText, abilityEntryText, namesText, escD };
