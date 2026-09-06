// tools/populate_from_csv.js — the csv/ successor to populate_region.js.
//
// Reads the MERGED data source at csv/ (PokeAPI clone + PokeDB, built
// 2026-09-06 — schema doc: csv/MANIFEST.md) instead of the PokeAPI-only
// clone at temp/PokeAPI-master/data/v2/csv/, and produces the exact same
// `results` object populate_region.js's extract() does, so the existing
// assemble()/upsertEntries() writers stay reusable.
//
// PHASE 1 (2026-09-06): extraction + a readable diff report. PHASE 2 (same
// day): the writer, reusing populate_region.js's assemble()/upsertEntries().
//
//   node tools/populate_from_csv.js --ids 1,6,25 --dry-run [--out <dir>]
//   node tools/populate_from_csv.js --sample --dry-run       (the 30-id
//                                                             validation set)
//   node tools/populate_from_csv.js --all --assemble [--tables a,b]
//                                            [--new-encounters]
//   node tools/populate_from_csv.js --self-test
//
// `--all` is ids 1..1025 (the full National Dex, which is what POKEMON_DATA
// holds). `--assemble` writes src/data/*.js and then runs
// verify_region_data.js, exactly like populate_region.js --assemble does.
//
// `--new-encounters` is a GATE, default OFF. The SV/BDSP/LA encounter data
// (NEW_ENC_SHAPE below) is extracted on every run, but only written into
// locations.js when this flag is passed, because app.js's Found In popup
// cannot render it yet: openLocationPopup() formats every enc line as
// `method · Lv <min>–<max> · <rate>%`, which for a new-shape line prints
// "Lv undefined" (min/max absent on 173 of 8097 lines) and either
// "undefined%" (no `rate`, 4942 lines) or "10%%" (`rate` is a verbatim
// string like "10%"/"varies"). Flip this on in the same change that
// teaches openLocationPopup the new shape (Phase 4).
//
// What's the same as populate_region.js: every field of every one of the 8
// per-id tables (pokemon/stats/evolutions/movesets/movesets_hisui/names/
// locations/altforms) plus the shared moves/abilities/items builders. The
// merged source is identifier-keyed and wide-named, so the plumbing differs
// everywhere; the OUTPUT contract does not.
//
// What's new: Scarlet/Violet, Brilliant Diamond/Shining Pearl and Legends:
// Arceus wild encounters, which PokeAPI has zero rows for. See NEW_ENC_SHAPE
// below for the per-entry shape and the four locked user decisions.
"use strict";
const fs = require("fs");
const path = require("path");
const { parseFile } = require("./csv_merge/csv_util.js");
const PR = require("./populate_region.js"); // currentData, GROWTH, escD

const ROOT = path.join(__dirname, "..");
const CSV_DIR = path.join(ROOT, "csv");
const MERGE_DIR = path.join(__dirname, "csv_merge");
const SPRITE_DIR = path.join(ROOT, "src", "data", "sprites", "pokemon");
const DEFAULT_OUT = path.join(ROOT, "temp", "csv-rewire-2026-09-06");

const REGION_GEN = { kanto: 1, johto: 2, hoenn: 3, sinnoh: 4, unova: 5, kalos: 6, alola: 7, galar: 8, paldea: 9 };
const GEN_REGION = Object.fromEntries(Object.entries(REGION_GEN).map(([r, g]) => [String(g), r]));
// Same two-tier area ordering rule as populate_region.js (SCOPE.md §2).
const REGION_ORDER_GEN = { kanto: "3", johto: "4", hoenn: ["3", "6"], sinnoh: "4", unova: "5", kalos: "6", alola: "7", galar: "8", paldea: "9" };
const TIER_STEP = 1e6;
const titleCase = s => String(s).split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
const DAMAGE_CLASS = { physical: "Physical", special: "Special", status: "Status" };
const EVO_TRIGGER = { "level-up": "level", trade: "trade", "use-item": "stone", shed: "level" };
// csv/*_names.csv are WIDE (one row per entity, name_<lang> columns —
// MANIFEST "Names are wide"). These 5 columns are the ones names.js and the
// moves/abilities `names` sub-objects have always carried. `ja` maps to
// name_ja_hrkt, not name_ja: PokeAPI's language 1 is ja-Hrkt (kana), which
// is what the current data holds — name_ja is language 11 (kanji).
const WIDE_LANGS = [["ja", "name_ja_hrkt"], ["jaRomaji", "name_ja_roma"], ["fr", "name_fr"], ["de", "name_de"], ["ko", "name_ko"]];
function wideNames(row) {
  const out = {};
  if (!row) return out;
  for (const [key, col] of WIDE_LANGS) if (row[col]) out[key] = row[col];
  return out;
}

// =========================================================================
// NEW_ENC_SHAPE — SV / BDSP / LA wild encounters (locations.js)
// =========================================================================
// PokeDB's rows for these three games do NOT fit locations.js's classic
// `{ method, games, min, max, rate }` line: SV spawns are weighted (a raw
// `probability_overall`, not a percentage) and often group-led; LA has
// alpha levels, time-of-day and weather gates and a boulder flag; BDSP's
// rate is a free-text string ("20%", "one", "varies"). Per user decision
// (2026-09-06) these are NOT forced into the old shape. The outer
// `{ area, enc: [...] }` container is unchanged so the Found In accordion
// still works; each `enc` entry is:
//
//   method   string  PokeDB's own display name ("Symbol Encounter",
//                    "Walking (Tall Grass)", "Tera Raid Battle")
//   games    string  "/"-joined English version names, release order —
//                    same convention as the classic shape. Exception: an SV
//                    row in a DLC map area reads "The Teal Mask" /
//                    "The Indigo Disk" instead (SV_DLC_LABEL below), since
//                    those spawns need the paid DLC, not plain SV.
//   min,max  number  parsed from `levels` ("40 - 41" / "40"); both omitted
//                    when the source level is blank
//   forme    string  altforms.js-style key ("alola", "paldea-combat") when
//                    the row is a non-default form of the species; absent
//                    for the default form
//   rate     string  VERBATIM source rate text — BDSP/LA `rate_overall`
//                    ("20%", "one", "varies"), SV `group_rate` ("30%").
//                    A string, not a number: these are not comparable to
//                    the classic shape's 0-100 percentage.
//   weight   number  SV `probability_overall` — a raw spawn weight, NOT a
//                    percentage. Only meaningful against the other spawns
//                    of the same area.
//   group    string  SV `group_pokemon` — the species this one spawns
//                    alongside; `rate` is then its share of that group.
//   timeRates object SV `probability_*` / BDSP `rate_*` by time of day:
//                    { morning, day, evening, night }, keys omitted when
//                    blank. Values keep their source type (SV number,
//                    BDSP string).
//   times    array   LA time-of-day gate, e.g. ["night"]. Omitted when the
//                    row is `during_any_time`.
//   weather  array   LA weather gate, e.g. ["blizzard"]. Omitted when the
//                    row is `while_weather_overall`.
//   terrain  array   SV terrain flags: land/water-surface/underwater/
//                    overland/sky. Omitted when none is set.
//   alphaMin,alphaMax number  LA `alpha_levels`.
//   boulder  true    LA `boulder_required`.
//   hiddenAbility true  SV `hidden_ability_possible`.
//   teraStars number  SV `tera_raid_star_level`.
//   homeMin,homeMax number  SV `lvl_after_way_home` (the "Way Home" level
//                    a Tera raid catch arrives at).
//   tradeFor string  the species offered in exchange (NPC trade rows).
//   note     string  free text, PokeDB `{Label;TYPE;slug}` markup reduced
//                    to Label and <br/> to a space.
//
// Absent = not applicable, the same convention the rest of the schema uses.
//
// Locked user decisions, do not re-litigate:
//  1. Area names are PokeDB's own (`location_areas_pokedb.name`, already
//     display-formatted: "Route 201 (Sinnoh)"), used verbatim. NOT joined
//     onto VKDex's existing PokeAPI-derived area vocabulary.
//  2. Area order is ALPHABETICAL. No in-game progression index exists for
//     these areas (location_game_indices.csv is PokeAPI-only and covers
//     none of them), so this is a known-approximate ordering — revisit if
//     real progression data is ever sourced.
//  3. The richer shape above, rather than forcing (min,max,rate).
//  4. Rendering it is Phase 4, explicitly out of scope here.
const SV_TERRAIN = [["on_terrain_land", "land"], ["on_terrain_watersurface", "water-surface"], ["on_terrain_underwater", "underwater"], ["on_terrain_overland", "overland"], ["on_terrain_sky", "sky"]];
const LA_TIMES = [["during_morning", "morning"], ["during_day", "day"], ["during_evening", "evening"], ["during_night", "night"]];
const LA_WEATHER = [["while_blizzard", "blizzard"], ["while_clear", "clear"], ["while_harsh_sunlight", "harsh-sunlight"], ["while_cloudy", "cloudy"]];
// Which csv/ encounter file feeds which locations.js region key. SV covers
// Kitakami/Blueberry too — region_areas_pokedb.csv puts all three under
// region `paldea`, so everything it holds lands under that key; SV_DLC_LABEL
// below is what keeps the two DLC map areas distinguishable once there.
const NEW_ENC_FILES = [
  { file: "encounters_scarlet_violet.csv", region: "paldea", kind: "sv" },
  { file: "encounters_brilliant_diamond_shining_pearl.csv", region: "sinnoh", kind: "bdsp" },
  { file: "encounters_legends_arceus.csv", region: "hisui", kind: "la" },
];
// SV's two paid DLC map areas, by region_areas_pokedb.identifier. The
// encounter rows themselves are tagged plain `scarlet;violet` (MANIFEST's
// "no area->DLC map" gap), but the area->location->region_area vocabulary
// chain does carry the split, so a row's `games` can name the DLC it needs
// instead of implying the base game owns it. Names are versions.csv's own
// (`the-teal-mask` / `the-indigo-disk` version groups).
const SV_DLC_LABEL = { kitakami: "The Teal Mask", "blueberry-academy": "The Indigo Disk" };
const isTrue = v => v === "true" || v === "1";
// Blank/absent/non-numeric -> null (PokeDB puts free text like "one" in
// some otherwise-numeric columns; NaN must never reach the output).
const num = v => {
  if (v === "" || v === undefined || v === null) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};
// "40 - 41" -> [40,41]; "40" -> [40,40]; "" -> null
function levelRange(s) {
  if (!s) return null;
  const m = String(s).match(/(\d+)\s*-\s*(\d+)/);
  // Sorted, because PokeDB has at least one reversed range upstream
  // (394 Prinplup / Spring Path / Legends: Arceus reads "32 - 25"). An
  // inverted min/max would render as "Lv 32-25" and trips
  // verify_region_data.js's max >= min check.
  if (m) return [Number(m[1]), Number(m[2])].sort((a, b) => a - b);
  const one = String(s).match(/(\d+)/);
  return one ? [Number(one[1]), Number(one[1])] : null;
}
// PokeDB inline markup: {Old Amber;ITEM;old-amber} -> "Old Amber".
const plainText = s => String(s || "").replace(/\{([^;{}]*);[^{}]*\}/g, "$1").replace(/<br\s*\/?>/gi, " ").replace(/\s+/g, " ").trim();

// =========================================================================
// Loading csv/
// =========================================================================
function load(name) {
  const p = path.join(CSV_DIR, name);
  if (!fs.existsSync(p)) throw new Error(`csv/${name} not found — is csv/ present at the repo root?`);
  const { rows, bad } = parseFile(p);
  if (bad.length) throw new Error(`csv/${name}: ${bad.length} malformed row(s) (first at line ${bad[0].line})`);
  return rows;
}
function loadCsvs() {
  const files = [
    "species", "species_names", "species_genera", "pokemon", "pokemon_types", "pokemon_abilities",
    "pokemon_stats", "pokemon_egg_groups", "egg_groups", "base_friendship_gen3-7", "base_friendship_gen8plus",
    "base_experience_gen5-6", "base_experience_gen7plus", "growth_rates", "habitats", "pokemon_dex_numbers",
    "pokedexes", "regions", "pokemon_evolution", "pokemon_forms", "pokemon_held_items", "pokemon_held_items_orre", "learnsets",
    "learnsets_legends_arceus", "version_groups", "versions", "moves", "move_names", "move_meta",
    "move_flag_map", "abilities", "ability_names", "items", "item_names", "types", "locations",
    "location_areas", "location_game_indices", "encounters", "encounter_methods", "location_areas_pokedb",
    "encounter_methods_pokedb", "locations_pokedb", "region_areas_pokedb",
  ];
  const out = {};
  for (const f of files) out[f.replace(/[^a-z0-9]/gi, "_")] = load(f + ".csv");
  for (const spec of NEW_ENC_FILES) out[spec.kind] = load(spec.file);
  return out;
}

// =========================================================================
// EXTRACT — csv/ -> the same `results` object populate_region.js produces
// =========================================================================
// One deliberate shape extension: results.locations[id] gains `extra`,
// { <region>: [ new-shape area ] }, for the SV/BDSP/LA data. `region`/
// `areas` (the classic PokeAPI-derived list) are untouched, so the existing
// assemble() still consumes them; Phase 2 appends `extra` after them.
function extractFromCsv(ids, csvs, current) {
  const by = (rows, key) => new Map(rows.map(r => [r[key], r]));
  const group = (rows, key) => {
    const m = new Map();
    for (const r of rows) { if (!m.has(r[key])) m.set(r[key], []); m.get(r[key]).push(r); }
    return m;
  };

  const speciesBy = by(csvs.species, "species");
  const speciesNames = by(csvs.species_names, "species");
  const generaBy = by(csvs.species_genera, "species");
  const eggBy = by(csvs.pokemon_egg_groups, "species");
  const eggName = new Map(csvs.egg_groups.map(r => [r.identifier, r.name_en]));
  const friend37 = new Map(csvs["base_friendship_gen3_7"].map(r => [r.species, Number(r.base_friendship)]));
  const friend8 = new Map(csvs.base_friendship_gen8plus.map(r => [r.species, Number(r.base_friendship)]));
  const exp56 = new Map(csvs["base_experience_gen5_6"].map(r => [r.pokemon, Number(r.base_experience)]));
  const exp7 = new Map(csvs.base_experience_gen7plus.map(r => [r.pokemon, Number(r.base_experience)]));
  const growthById = by(csvs.growth_rates, "identifier");
  const habitatSet = new Set(csvs.habitats.map(r => r.identifier));
  const pokemonBy = by(csvs.pokemon, "identifier");
  const pokemonBySpecies = group(csvs.pokemon, "species");
  const typesBy = by(csvs.pokemon_types, "pokemon");
  const abilitiesBy = by(csvs.pokemon_abilities, "pokemon");
  const statsBy = by(csvs.pokemon_stats, "pokemon");
  // csv/ splits the non-mainline games into their own files (MANIFEST's
  // convention), so Colosseum/XD wild held items live in
  // pokemon_held_items_orre.csv. pokemon.js's `heldItems` has always
  // included them (Qwilfish's "Colosseum · 100%" group), so both files feed
  // this table — the split is a file-layout change, not a scope change.
  const heldBy = group(csvs.pokemon_held_items.concat(csvs.pokemon_held_items_orre), "pokemon");
  const dexNumsBy = group(csvs.pokemon_dex_numbers, "species");
  const evoByTarget = group(csvs.pokemon_evolution, "evolved_species");
  const moveName = new Map(csvs.move_names.map(r => [r.move, r.name_en]));
  const mvName = m => moveName.get(m) || m;
  const vgBy = by(csvs.version_groups, "identifier");
  const versionBy = by(csvs.versions, "identifier");
  const vName = ident => (versionBy.get(ident) || {}).name_en || ident;
  const vOrder = ident => Number((versionBy.get(ident) || {}).id || 0);

  // Default (species-grain) pokemon row — the one every per-id table keys
  // off, exactly like the old pipeline's `pokemon.id === species id`.
  const defaultOf = sid => (pokemonBySpecies.get(sid) || []).find(p => p.is_default === "1");

  // --- regional dex numbers: one pokedex per mainline region, same
  // tie-break rule as populate_region.js's regionalPokedexes() (exact
  // region-name identifier, else "original-"; Kalos deliberately absent).
  const pokedexForRegion = new Map();
  for (const region of Object.keys(REGION_GEN)) {
    const rows = csvs.pokedexes.filter(p => p.region === region);
    const pick = rows.find(p => p.identifier === region) || rows.find(p => p.identifier === "original-" + region);
    if (pick) pokedexForRegion.set(pick.identifier, region);
  }

  // --- version sets per region: main-series pokedexes of that region ->
  // their version_groups (a ";"-list column in the merged schema) ->
  // versions. Japan-only Gen 1 releases are already excluded from csv/.
  const versionsForRegion = new Map();
  const regionVersions = region => {
    if (versionsForRegion.has(region)) return versionsForRegion.get(region);
    const vgs = new Set();
    for (const p of csvs.pokedexes) {
      if (p.region !== region || p.is_main_series !== "1") continue;
      for (const g of (p.version_groups || "").split(";").filter(Boolean)) vgs.add(g);
    }
    const set = new Set(csvs.versions.filter(v => vgs.has(v.version_group)).map(v => v.identifier));
    versionsForRegion.set(region, set);
    return set;
  };

  // --- classic (PokeAPI-derived) locations plumbing
  const locBy = by(csvs.locations, "identifier");
  const locAreaById = by(csvs.location_areas, "id");
  const encMethodBy = by(csvs.encounter_methods, "identifier");
  const encByPokemon = group(csvs.encounters, "pokemon");
  const locIndex = new Map();
  for (const r of csvs.location_game_indices) {
    if (!locIndex.has(r.location)) locIndex.set(r.location, new Map());
    const m = locIndex.get(r.location);
    const i = Number(r.game_index);
    if (!m.has(r.generation) || i < m.get(r.generation)) m.set(r.generation, i);
  }
  const locOrder = (region, loc) => {
    const gens = [].concat(REGION_ORDER_GEN[region] || []);
    const m = locIndex.get(loc);
    if (!m) return null;
    for (let t = 0; t < gens.length; t++) if (m.has(gens[t])) return t * TIER_STEP + m.get(gens[t]);
    return null;
  };
  const METHOD_LABEL = { walk: "Grass", "npc-trade": "NPC Trade", sos: "SOS Call", "sos-from-bubbling-spot": "SOS Call (bubbling spot)" };
  const methodLabel = ident => METHOD_LABEL[ident] || titleCase(ident);

  // --- new-source (PokeDB) locations plumbing
  const pdbArea = by(csvs.location_areas_pokedb, "identifier");
  const pdbMethod = new Map(csvs.encounter_methods_pokedb.map(r => [r.identifier, r.name]));
  // area -> location -> region_area, for SV_DLC_LABEL. Undefined anywhere in
  // the chain leaves the row's plain version-derived `games` untouched.
  const pdbLocRegionArea = new Map(csvs.locations_pokedb.map(r => [r.identifier, r.region_area]));
  const svDlcLabel = areaRow => SV_DLC_LABEL[pdbLocRegionArea.get(areaRow && areaRow.location)];
  const svUnresolvedAreas = new Set();
  const newEncBySpecies = new Map(); // sid -> region -> area name -> enc[]
  for (const spec of NEW_ENC_FILES) {
    for (const row of csvs[spec.kind]) {
      const pk = pokemonBy.get(row.pokemon);
      if (!pk) continue;
      const sid = pk.species;
      if (!newEncBySpecies.has(sid)) newEncBySpecies.set(sid, new Map());
      const byRegion = newEncBySpecies.get(sid);
      if (!byRegion.has(spec.region)) byRegion.set(spec.region, new Map());
      const areaRow = pdbArea.get(row.location_area);
      const areaName = (areaRow && areaRow.name) || titleCase(row.location_area);
      const byArea = byRegion.get(spec.region);
      if (!byArea.has(areaName)) byArea.set(areaName, []);
      const altKeys = (((current.tables.altforms || {})[Number(sid)] || {}).formes || []).map(f => f.key);
      const entry = newEncEntry(row, spec.kind, pk, speciesBy.get(sid), pdbMethod, vName, vOrder, altKeys);
      if (spec.kind === "sv") {
        const dlc = svDlcLabel(areaRow);
        // 95 of 1533 DLC rows are version-exclusive. Overwriting `games`
        // outright would drop that, so keep the version as a prefix —
        // which is versions.csv's own name for the DLC pseudo-version
        // ("Violet: The Teal Mask"). "/" is the join separator set by
        // newEncEntry a few lines up, so its presence == both versions.
        if (dlc) entry.games = entry.games.includes("/") ? dlc : `${entry.games}: ${dlc}`;
        else if (!pdbLocRegionArea.get(areaRow && areaRow.location)) svUnresolvedAreas.add(row.location_area);
      }
      byArea.get(areaName).push(entry);
    }
  }
  // Trust-boundary guard: an SV area that can't be placed in a sub-region
  // silently keeps "Scarlet/Violet" and would re-introduce the DLC
  // mislabelling. Currently 0; say so loudly if the vocabulary ever drifts.
  if (svUnresolvedAreas.size) console.warn(`WARNING: ${svUnresolvedAreas.size} SV area(s) not resolvable to a region_area, base-game label assumed: ${[...svUnresolvedAreas].slice(0, 10).join(", ")}`);

  // --- Mega formes
  const megaBySpecies = new Map();
  for (const f of csvs.pokemon_forms) {
    if (f.is_mega !== "1") continue;
    const pk = pokemonBy.get(f.pokemon);
    if (!pk) continue;
    if (!megaBySpecies.has(pk.species)) megaBySpecies.set(pk.species, []);
    megaBySpecies.get(pk.species).push({ form: f, pk });
  }

  // --- learnsets
  const learnBy = group(csvs.learnsets, "pokemon");
  const laLearnBy = group(csvs.learnsets_legends_arceus, "pokemon");

  const STAT_COLS = [["hp", "hp"], ["attack", "attack"], ["defense", "defense"], ["spAttack", "special_attack"], ["spDefense", "special_defense"], ["speed", "speed"]];
  const statsOf = ident => {
    const r = statsBy.get(ident) || {};
    const out = {};
    for (const [k, col] of STAT_COLS) out[k] = Number(r[col]);
    return out;
  };
  const effortOf = ident => {
    const r = statsBy.get(ident) || {};
    const out = {};
    for (const [k, col] of STAT_COLS) out[k] = Number(r["ev_" + col] || 0);
    return out;
  };
  const abilityListOf = ident => {
    const r = abilitiesBy.get(ident) || {};
    return [r.ability_1, r.ability_2, r.ability_hidden].filter(Boolean).map(titleCase);
  };
  const typeListOf = ident => {
    const r = typesBy.get(ident) || {};
    return [r.type_1, r.type_2].filter(Boolean).map(titleCase);
  };

  const allowedTargets = new Set([...current.pokemonById.keys(), ...ids]);
  const results = {
    slug: "csv", ids,
    pokemon: {}, stats: {}, evolutions: {}, movesets: {}, movesetsHisui: {}, names: {}, locations: {}, altforms: {},
    formeEvolutions: {}, flagged: [],
  };

  // ---- evolution helpers (mirroring populate_region.js exactly) ----
  const isPlainEvoRow = row => {
    if (!row.base_form) return true;
    const pk = pokemonBy.get(row.base_form);
    return !pk || pk.is_default === "1";
  };
  const evoRowFormeKey = (row, sp) => {
    const pk = pokemonBy.get(row.base_form);
    if (!pk) return null;
    const spTok = sp.identifier.split("-");
    let tokens = pk.identifier.split("-");
    if (spTok.every((tok, i) => tokens[i] === tok)) tokens = tokens.slice(spTok.length);
    return tokens.join("-") || null;
  };
  const pickEvoRow = rows => rows.find(r => r.trigger_item) || rows.find(r => r.held_item) || rows[0];
  // csv/ integrity guard. A form-restricted row's `base_form` must be a
  // pokemon row of the species the evolution starts from. Anything else
  // means the column was resolved through the wrong id space — the exact
  // bug merge.js carried until 2026-09-06 (base_form_id/evolved_form_id
  // reference pokemon.id, not pokemon_forms.id; the spaces only coincide
  // below 10000, so every alt-form reference pointed at an unrelated form).
  // Emitting such a row would hang a regional variant's evolution off the
  // base species, so drop it and say so loudly instead.
  const evoRowValid = (row, sid) => {
    if (!row.base_form) return true;
    const pk = pokemonBy.get(row.base_form);
    return !!pk && pk.species === sid;
  };
  const buildEvoEdge = (row, targetNum) => {
    const trigger = row.trigger;
    const method0 = EVO_TRIGGER[trigger] || "other";
    let level;
    if (trigger === "level-up") level = row.minimum_level ? Number(row.minimum_level) : undefined;
    const edge = { id: targetNum, method: method0 };
    if (level !== undefined) edge.level = level;
    if (row.trigger_item) { edge.method = "stone"; edge.item = row.trigger_item; }
    else if (row.held_item && trigger === "trade") edge.item = row.held_item;
    else if (row.held_item && trigger === "level-up") {
      edge.method = "held";
      delete edge.level;
      edge.item = row.held_item;
    }
    const friendship = edge.method === "level" && (row.minimum_happiness || row.minimum_affection);
    if (row.time_of_day && (edge.method === "held" || friendship)) edge.timeOfDay = row.time_of_day;
    if (friendship && row.known_move_type) edge.moveType = row.known_move_type;
    if (row.gender === "female" || row.gender === "male") edge.gender = row.gender;
    if (edge.method === "level" && edge.level === undefined && !friendship && row.known_move) {
      edge.method = "stone";
      edge.item = "tm-normal";
      edge.move = moveName.get(row.known_move);
    }
    if (edge.method === "level" && edge.level === undefined && !friendship) edge.method = "other";
    return edge;
  };

  for (const id of ids) {
    const sid = String(id);
    const sp = speciesBy.get(sid);
    const pk = defaultOf(sid);
    if (!sp || !pk) { results.flagged.push(`id ${id}: missing species/pokemon row in csv/`); continue; }
    const existing = current.pokemonById.get(id);
    const region = existing ? (existing.hisuiOnly ? null : existing.region) : (GEN_REGION[sp.generation] || null);
    const ident = pk.identifier;
    const abilities = abilityListOf(ident);
    const hiddenRaw = (abilitiesBy.get(ident) || {}).ability_hidden;

    // ---- pokemon.js ----
    results.pokemon[id] = {
      name: (speciesNames.get(sid) || {}).name_en || null,
      region,
      types: typeListOf(ident),
      category: (generaBy.get(sid) || {}).genus_en || null,
      height: Number(pk.height_m),
      weight: Number(pk.weight_kg),
      abilities,
      hiddenAbility: hiddenRaw ? titleCase(hiddenRaw) : null,
      isLegendary: sp.is_legendary === "1",
      isMythical: sp.is_mythical === "1",
      isBaby: sp.is_baby === "1",
      genderRate: Number(sp.gender_rate),
      hasGenderDifferences: sp.has_gender_differences === "1",
      habitat: sp.habitat && habitatSet.has(sp.habitat) ? titleCase(sp.habitat) : null,
      formsSwitchable: sp.forms_switchable === "1",
      // MANIFEST "Pokémon": base experience is era-split. Gen 7+ is the
      // current value (PokeDB's, with A filling); Gen 5-6 is the older
      // table. PokeAPI's single `pokemon.base_experience` column — what the
      // old pipeline read — is its Gen 7+ value, so gen7plus is the match,
      // and the 38 documented USUM revisions are real corrections.
      baseExperience: exp7.has(ident) ? exp7.get(ident) : (exp56.has(ident) ? exp56.get(ident) : null),
      regionalDexNumbers: (() => {
        const found = {};
        for (const r of dexNumsBy.get(sid) || []) {
          const rg = pokedexForRegion.get(r.pokedex);
          if (rg) found[rg] = Number(r.number);
        }
        const out = {};
        for (const rg of Object.keys(REGION_GEN)) if (found[rg] !== undefined) out[rg] = found[rg];
        return out;
      })(),
      eggGroups: (() => {
        const r = eggBy.get(sid) || {};
        return [r.egg_group_1, r.egg_group_2].filter(Boolean).map(g => eggName.get(g)).filter(Boolean);
      })(),
      heldItems: (() => {
        const byItem = new Map();
        for (const r of heldBy.get(ident) || []) {
          if (!r.item || !r.version) continue;
          if (!byItem.has(r.item)) byItem.set(r.item, new Map());
          byItem.get(r.item).set(r.version, { rate: Number(r.rarity) });
        }
        return [...byItem].map(([item, byVer]) => ({ item, rates: groupByVersion(byVer, v => String(v.rate), vName, vOrder) }))
          .sort((a, b) => Math.max(...b.rates.map(x => x.rate)) - Math.max(...a.rates.map(x => x.rate)) || (a.item < b.item ? -1 : 1));
      })(),
    };

    // ---- stats.js ----
    const growth = growthById.get(sp.growth_rate);
    const curve = growth ? PR.GROWTH[growth.id] : null;
    // Base friendship is era-split in csv/ (species.csv has no
    // base_happiness at all). MANIFEST: PokeAPI's single column agreed with
    // the era its species was introduced in, 0 conflicts — so picking by
    // the species' own generation reproduces it exactly.
    const gen = Number(sp.generation);
    const happiness = gen >= 8
      ? (friend8.has(sid) ? friend8.get(sid) : friend37.get(sid))
      : (friend37.has(sid) ? friend37.get(sid) : friend8.get(sid));
    if (happiness === undefined) results.flagged.push(`id ${id}: no base friendship row in either era file`);
    results.stats[id] = Object.assign(statsOf(ident), {
      captureRate: Number(sp.capture_rate),
      baseHappiness: happiness === undefined ? null : happiness,
      expGrowth: { points: curve ? curve.points : (growth ? Number(growth.exp_to_level_100) : null), curve: curve ? curve.curve : "?" },
      hatchCounter: Number(sp.hatch_counter),
      effort: effortOf(ident),
    });

    // ---- evolutions.js (+ per-forme overrides) ----
    const evolvesTo = [];
    const formeEvos = {};
    const formeKeys = new Set((((current.tables.altforms || {})[id] || {}).formes || []).map(f => f.key));
    for (const [targetId, allRows] of evoByTarget) {
      if (!allRows.length) continue;
      const targetSpecies = speciesBy.get(targetId);
      if (!targetSpecies || targetSpecies.evolves_from_species !== sid) continue;
      const targetNum = Number(targetId);
      if (!allowedTargets.has(targetNum)) { results.flagged.push(`evolution ${id}->${targetId}: target not in POKEMON_DATA or this batch, omitted`); continue; }
      const rows = allRows.filter(r => {
        if (evoRowValid(r, sid)) return true;
        results.flagged.push(`CSV INTEGRITY: evolution ${id}->${targetId}: base_form "${r.base_form}" is not a form of species ${id} — csv/pokemon_evolution.csv's base_form/evolved_form were resolved through pokemon_forms.id instead of pokemon.id. merge.js is fixed; re-run \`node tools/csv_merge/merge.js\` to regenerate csv/. Row dropped.`);
        return false;
      });
      if (!rows.length) continue;
      const plain = rows.filter(isPlainEvoRow);
      const basePlain = plain.length ? buildEvoEdge(pickEvoRow(plain), targetNum) : null;
      const byForme = new Map();
      for (const r of rows) {
        if (isPlainEvoRow(r)) continue;
        const key = evoRowFormeKey(r, sp);
        if (!key) continue;
        if (!byForme.has(key)) byForme.set(key, []);
        byForme.get(key).push(r);
      }
      let captured = false;
      for (const [key, fRows] of byForme) {
        if (!formeKeys.has(key)) { results.flagged.push(`evolution ${id}->${targetId}: form-restricted row for "${key}" has no altforms.js forme — override skipped`); continue; }
        captured = true;
        const edge = buildEvoEdge(pickEvoRow(fRows), targetNum);
        if (basePlain && JSON.stringify(basePlain) === JSON.stringify(edge)) continue;
        (formeEvos[key] || (formeEvos[key] = [])).push(edge);
      }
      if (!plain.length && !captured) results.flagged.push(`evolution ${id}->${targetId}: only form-restricted rows exist and no altforms.js forme carries them — left on the base entry`);
      const cands = plain.length ? plain : (captured ? [] : rows);
      if (cands.length) evolvesTo.push(basePlain || buildEvoEdge(pickEvoRow(cands), targetNum));
    }
    evolvesTo.sort((a, b) => a.id - b.id);
    results.evolutions[id] = evolvesTo;
    for (const key in formeEvos) formeEvos[key].sort((a, b) => a.id - b.id);
    if (Object.keys(formeEvos).length) results.formeEvolutions[id] = formeEvos;

    // ---- movesets.js ----
    // csv/ splits the non-mainline games into their own files, so
    // learnsets.csv holds no Legends: Arceus / Champions / Z-A rows at all —
    // the old tool's explicit PLA exclusion is structural here. The FALLBACK
    // still matters: the 7 hisuiOnly species have no mainline rows of any
    // kind, and PLA was their only source (0.2.18).
    const USABLE = new Set(["level-up", "egg", "machine"]);
    const mainRows = learnBy.get(ident) || [];
    const laOwnRows = laLearnBy.get(ident) || [];
    let bestVg = null, bestOrder = -1;
    for (const r of mainRows) {
      if (!USABLE.has(r.method)) continue;
      const g = vgBy.get(r.version_group);
      if (!g) continue;
      if (Number(g.order) > bestOrder) { bestOrder = Number(g.order); bestVg = r.version_group; }
    }
    let setRows = mainRows, usedLa = false;
    if (!bestVg && laOwnRows.length) { bestVg = "legends-arceus"; setRows = laOwnRows; usedLa = true; }
    const mainSet = bestVg ? buildSet(setRows, bestVg, mvName) : { levelUp: [], tm: [], egg: [], tutor: [] };
    results.movesets[id] = Object.assign(mainSet, { max: [], _sourceGeneration: bestVg });
    if (bestVg && !usedLa && vgBy.get(bestVg) && vgBy.get(bestVg).generation !== "9") {
      results.flagged.push(`id ${id} (${ident}): no Gen 9 moveset data, used "${bestVg}" instead`);
    }

    // ---- movesets_hisui.js ----
    // Same precedence as 0.2.18/0.2.19: a "-hisui" form's own PLA rows win
    // outright; else the default form's; else the lowest-id alt form that
    // has any.
    const altPla = (pokemonBySpecies.get(sid) || [])
      .filter(f => f.identifier !== ident && (laLearnBy.get(f.identifier) || []).length)
      .sort((a, b) => Number(a.id || 1e9) - Number(b.id || 1e9));
    const hisuiForm = altPla.find(f => /-hisui$/.test(f.identifier));
    let plaRows = laOwnRows;
    if (hisuiForm) plaRows = laLearnBy.get(hisuiForm.identifier);
    else if (!plaRows.length && altPla.length) {
      plaRows = laLearnBy.get(altPla[0].identifier);
      if (altPla.length > 1) results.flagged.push(`id ${id} (${ident}): ${altPla.length} PLA forms (${altPla.map(f => f.identifier).join(", ")}), used "${altPla[0].identifier}" for movesets_hisui`);
    }
    const plaSet = buildSet(plaRows, "legends-arceus", mvName);
    if (plaSet.levelUp.length || plaSet.tutor.length) results.movesetsHisui[id] = { levelUp: plaSet.levelUp, tutor: plaSet.tutor };

    // ---- names.js ----
    const nrow = speciesNames.get(sid) || {};
    results.names[id] = {
      ja: nrow.name_ja_hrkt || nrow.name_ja || null,
      jaRomaji: nrow.name_ja_roma || null,
      fr: nrow.name_fr || null,
      de: nrow.name_de || null,
      ko: nrow.name_ko || null,
    };

    // ---- locations.js (classic PokeAPI-derived areas) ----
    const versionIds = region ? regionVersions(region) : new Set();
    const encRows = (encByPokemon.get(ident) || []).filter(r => versionIds.has(r.version));
    const byArea = new Map();
    const areaOrder = new Map();
    for (const r of encRows) {
      const area = locAreaById.get(r.location_area);
      if (!area) continue;
      const loc = locBy.get(area.location);
      if (!loc) continue;
      const name = loc.name_en || titleCase(loc.identifier);
      if (!byArea.has(name)) byArea.set(name, new Map());
      const ord = locOrder(region, loc.identifier);
      if (ord !== null && (!areaOrder.has(name) || ord < areaOrder.get(name))) areaOrder.set(name, ord);
      const method = encMethodBy.get(r.method);
      if (!method) continue;
      const methods = byArea.get(name);
      if (!methods.has(r.method)) methods.set(r.method, { order: Number(method.order), method: methodLabel(r.method), byVer: new Map() });
      const m = methods.get(r.method);
      if (!m.byVer.has(r.version)) m.byVer.set(r.version, { min: Infinity, max: 0, buckets: new Map() });
      const v = m.byVer.get(r.version);
      v.min = Math.min(v.min, Number(r.min_level)); v.max = Math.max(v.max, Number(r.max_level));
      const bucket = r.location_area + "|" + (r.conditions || "").split(";").filter(Boolean).sort().join("+");
      v.buckets.set(bucket, (v.buckets.get(bucket) || 0) + Number(r.rarity));
    }
    const areas = [...byArea.keys()].sort((a, b) => {
      const oa = areaOrder.has(a) ? areaOrder.get(a) : null;
      const ob = areaOrder.has(b) ? areaOrder.get(b) : null;
      if (oa !== ob) return oa === null ? 1 : ob === null ? -1 : oa - ob;
      return a < b ? -1 : a > b ? 1 : 0;
    }).map(name => ({
      area: name,
      enc: [].concat(...[...byArea.get(name).values()].sort((a, b) => a.order - b.order).map(m => {
        for (const v of m.byVer.values()) v.rate = Math.min(100, Math.max(...v.buckets.values()));
        return groupByVersion(m.byVer, v => v.min + "," + v.max + "," + v.rate, vName, vOrder)
          .map(g => ({ method: m.method, games: g.games, min: g.min, max: g.max, rate: g.rate }));
      })),
    }));

    // ---- locations.js (new SV/BDSP/LA areas, NEW_ENC_SHAPE) ----
    const extra = {};
    const newByRegion = newEncBySpecies.get(sid);
    if (newByRegion) {
      for (const [rg, byAreaNew] of newByRegion) {
        extra[rg] = [...byAreaNew.keys()].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0)) // locked: alphabetical
          .map(name => ({ area: name, enc: dedupeEnc(byAreaNew.get(name)) }));
      }
    }
    results.locations[id] = { region, areas, extra };

    // ---- altforms.js (Mega formes only) ----
    const megas = megaBySpecies.get(sid) || [];
    if (megas.length) {
      const baseName = results.pokemon[id].name;
      const baseTypes = results.pokemon[id].types.join("/");
      results.altforms[id] = megas.map(({ form, pk: mpk }) => {
        const spTok = sp.identifier.split("-");
        let tokens = mpk.identifier.split("-");
        if (spTok.every((t, i) => tokens[i] === t)) tokens = tokens.slice(spTok.length);
        tokens = tokens.filter(t => t && t !== "mega");
        const sprite = "mega/" + baseName.toLowerCase().replace(/\./g, "").replace(/[\s-]+/g, "_").replace(/’/g, "'") + (tokens.length ? "_" + tokens.join("_") : "");
        const types = typeListOf(mpk.identifier);
        const abils = abilityListOf(mpk.identifier);
        return {
          key: "mega" + (tokens.length ? "-" + tokens.join("-") : ""),
          name: form.pokemon_name_en || "Mega " + baseName,
          sprite, isMega: true,
          types: types.join("/") !== baseTypes ? types : null,
          stats: statsOf(mpk.identifier),
          ability: abils[0] || null,
        };
      });
      const seen = new Set();
      results.altforms[id] = results.altforms[id].filter(f => {
        const sig = JSON.stringify([f.name, f.types, f.stats, f.ability]);
        if (seen.has(sig)) return false;
        seen.add(sig);
        return true;
      });
      for (const f of results.altforms[id]) {
        if (results.altforms[id].length === 1) f.key = "mega";
        for (const kind of ["", "shiny/"]) {
          if (!fs.existsSync(path.join(SPRITE_DIR, kind + "alt formes", f.sprite + ".png"))) results.flagged.push(`id ${id} Mega: no ${kind || "normal "}sprite at alt formes/${f.sprite}.png`);
        }
      }
    }
  }

  // ---- referenced-but-missing moves / abilities / items ----
  const neededAbilities = new Set(), neededMoves = new Set(), neededItems = new Set();
  for (const id in results.pokemon) for (const a of results.pokemon[id].abilities) neededAbilities.add(a);
  for (const id in results.altforms) for (const f of results.altforms[id]) if (f.ability) neededAbilities.add(f.ability);
  for (const id in results.movesets) {
    const ms = results.movesets[id];
    for (const x of ms.levelUp) neededMoves.add(x.move);
    for (const x of [...ms.tm, ...ms.egg, ...ms.tutor]) neededMoves.add(x);
  }
  for (const id in results.movesetsHisui) {
    const ms = results.movesetsHisui[id];
    for (const x of ms.levelUp) neededMoves.add(x.move);
    for (const x of ms.tutor) neededMoves.add(x);
  }
  for (const id in results.pokemon) for (const h of results.pokemon[id].heldItems) neededItems.add(h.item);
  for (const id in results.evolutions) for (const e of results.evolutions[id]) if (e.item && e.item !== "tm-normal") neededItems.add(e.item);

  const moveData = moveDataCsv(csvs);
  const abilityData = abilityDataCsv(csvs);
  const itemData = itemDataCsv(csvs);
  const abilityRowByName = new Map(csvs.abilities.map(a => [titleCase(a.identifier), a]));
  const moveRowByName = new Map();
  for (const m of csvs.moves) { const nm = moveName.get(m.identifier); if (nm) moveRowByName.set(nm, m); }
  results.missingAbilities = [...neededAbilities].filter(a => !current.abilities[a]).map(a => {
    const row = abilityRowByName.get(a);
    return Object.assign({ name: a, csvId: row ? row.id : null }, row ? abilityData(row, a) : { names: {} });
  });
  results.missingMoves = [...neededMoves].filter(m => !current.moves[m]).map(name => {
    const row = moveRowByName.get(name);
    return row ? Object.assign({ found: true }, moveData(row, name)) : { name, found: false };
  });
  results.missingItems = [...neededItems].filter(s => !current.items[s]).sort().map(itemData);
  results._builders = { moveData, abilityData, itemData, moveRowByName, abilityRowByName };
  return results;
}

// Collapse a version-keyed map into [{ games, ...value }], one group per
// distinct value signature, games "/"-joined in release order. Same
// contract as populate_region.js's groupByVersion.
function groupByVersion(byVer, sigOf, vName, vOrder) {
  const sigs = new Map();
  for (const v of [...byVer.keys()].sort((a, b) => vOrder(a) - vOrder(b))) {
    const val = byVer.get(v);
    const key = sigOf(val);
    if (!sigs.has(key)) sigs.set(key, { val, games: [] });
    sigs.get(key).games.push(vName(v));
  }
  return [...sigs.values()].map(g => Object.assign({ games: g.games.join("/") }, g.val));
}

// One learnset-file row set -> the four categories, scoped to one version
// group. Identical output contract to populate_region.js's buildSet.
// `nm` resolves a csv/ move identifier to the English display name
// movesets.js and moves.js are both keyed by.
function buildSet(rows, vg, nm) {
  const name = nm || (x => x);
  const levelUp = [], tm = [], egg = [], tutor = [];
  for (const r of rows || []) {
    if (r.version_group !== vg) continue;
    if (r.method === "level-up") {
      const e = { level: Number(r.level), move: name(r.move) };
      if (r.mastery !== "" && r.mastery !== undefined) e.mastery = Number(r.mastery);
      levelUp.push(e);
    } else if (r.method === "machine") tm.push(name(r.move));
    else if (r.method === "egg") egg.push(name(r.move));
    else if (r.method === "tutor") tutor.push(name(r.move));
  }
  levelUp.sort((a, b) => a.level - b.level);
  const dedupe = a => [...new Set(a)];
  return { levelUp, tm: dedupe(tm), egg: dedupe(egg), tutor: dedupe(tutor) };
}

// One PokeDB encounter row -> one NEW_ENC_SHAPE entry (see the header).
function newEncEntry(row, kind, pk, sp, methodName, vName, vOrder, altKeys) {
  const e = { method: methodName.get(row.method) || titleCase(row.method) };
  const versions = (row.versions || "").split(";").filter(Boolean).sort((a, b) => vOrder(a) - vOrder(b));
  e.games = versions.map(vName).join("/");
  const lv = levelRange(row.levels);
  if (lv) { e.min = lv[0]; e.max = lv[1]; }
  // Non-default form -> the matching altforms.js key. PokeAPI's identifier
  // carries a token altforms.js drops for one species (Paldean Tauros:
  // `tauros-paldea-combat-breed` vs. key `paldea-combat`), so prefer the
  // longest existing altforms key the leftover tokens start with, and fall
  // back to the raw tokens when the species has no ALT_FORMS entry.
  if (pk.is_default !== "1") {
    const spTok = sp.identifier.split("-");
    let tokens = pk.identifier.split("-");
    if (spTok.every((t, i) => tokens[i] === t)) tokens = tokens.slice(spTok.length);
    const raw = tokens.join("-");
    if (raw) {
      const hit = (altKeys || []).filter(k => raw === k || raw.startsWith(k + "-")).sort((a, b) => b.length - a.length)[0];
      e.forme = hit || raw;
    }
  }
  if (kind === "sv") {
    if (row.group_rate) e.rate = row.group_rate;
    if (row.group_pokemon) e.group = row.group_pokemon;
    // `probability_overall` is a raw weight on ordinary spawns but free
    // text on gift/trade rows ("one", "choose one") — those belong in the
    // verbatim `rate` string, not in a numeric field.
    if (row.probability_overall !== "") {
      const w = Number(row.probability_overall);
      if (Number.isFinite(w)) e.weight = w;
      else if (!e.rate) e.rate = row.probability_overall;
    }
    const terrain = SV_TERRAIN.filter(([col]) => isTrue(row[col])).map(([, n]) => n);
    if (terrain.length) e.terrain = terrain;
    if (isTrue(row.hidden_ability_possible)) e.hiddenAbility = true;
    if (num(row.tera_raid_star_level) !== null) e.teraStars = num(row.tera_raid_star_level);
    const home = levelRange(row.lvl_after_way_home);
    if (home) { e.homeMin = home[0]; e.homeMax = home[1]; }
    const tr = {};
    for (const t of ["morning", "day", "evening", "night"]) if (num(row["probability_" + t]) !== null) tr[t] = num(row["probability_" + t]);
    if (Object.keys(tr).length) e.timeRates = tr;
  } else if (kind === "bdsp") {
    if (row.rate_overall) e.rate = row.rate_overall;
    const tr = {};
    for (const t of ["morning", "day", "night"]) if (row["rate_" + t]) tr[t] = row["rate_" + t];
    if (Object.keys(tr).length) e.timeRates = tr;
  } else if (kind === "la") {
    if (row.rate_overall) e.rate = row.rate_overall;
    const alpha = levelRange(row.alpha_levels);
    if (alpha) { e.alphaMin = alpha[0]; e.alphaMax = alpha[1]; }
    if (!isTrue(row.during_any_time)) {
      const times = LA_TIMES.filter(([col]) => isTrue(row[col])).map(([, n]) => n);
      if (times.length) e.times = times;
    }
    if (!isTrue(row.while_weather_overall)) {
      const w = LA_WEATHER.filter(([col]) => isTrue(row[col])).map(([, n]) => n);
      if (w.length) e.weather = w;
    }
    if (isTrue(row.boulder_required)) e.boulder = true;
  }
  if (row.trade_for) e.tradeFor = row.trade_for;
  if (row.note) e.note = plainText(row.note);
  return e;
}
// Cosmetic forms (Alcremie's 63, Vivillon's patterns) share one pokemon row
// and produce byte-identical entries — collapse them.
function dedupeEnc(list) {
  const seen = new Set();
  return list.filter(e => {
    const k = JSON.stringify(e);
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  }).sort((a, b) => (a.method < b.method ? -1 : a.method > b.method ? 1 : 0));
}

// =========================================================================
// Shared-table builders (moves.js / abilities.js / items.js)
// =========================================================================
function moveDataCsv(csvs) {
  const metaBy = new Map(csvs.move_meta.map(r => [r.move, r]));
  const namesBy = new Map(csvs.move_names.map(r => [r.move, r]));
  const flagsBy = new Map();
  for (const r of csvs.move_flag_map) { if (!flagsBy.has(r.move)) flagsBy.set(r.move, []); flagsBy.get(r.move).push(r.flag); }
  return function moveData(row, name) {
    const meta = metaBy.get(row.identifier);
    let metaOut = null;
    if (meta) {
      metaOut = {};
      if (meta.category) metaOut.category = meta.category;
      if (meta.ailment && meta.ailment !== "none" && meta.ailment !== "unknown") metaOut.ailment = meta.ailment;
      const opt = { minHits: meta.min_hits, maxHits: meta.max_hits, minTurns: meta.min_turns, maxTurns: meta.max_turns, drain: meta.drain, healing: meta.healing, critRate: meta.crit_rate, ailmentChance: meta.ailment_chance, flinchChance: meta.flinch_chance, statChance: meta.stat_chance };
      for (const k of Object.keys(opt)) { const v = num(opt[k]); if (v !== null && v !== 0) metaOut[k] = v; }
    }
    return {
      name,
      type: titleCase(row.type),
      category: DAMAGE_CLASS[row.damage_class] || "Status",
      power: Number(row.power) || null,
      accuracy: Number(row.accuracy) || null,
      pp: Number(row.pp),
      priority: Number(row.priority),
      target: row.target || null,
      effectChance: num(row.effect_chance),
      flags: flagsBy.get(row.identifier) || [],
      meta: metaOut,
      names: wideNames(namesBy.get(row.identifier)),
    };
  };
}
function abilityDataCsv(csvs) {
  const namesBy = new Map(csvs.ability_names.map(r => [r.ability, r]));
  return (row, name) => ({ name, names: wideNames(namesBy.get(row.identifier)) });
}
function itemDataCsv(csvs) {
  const rowBySlug = new Map(csvs.items.map(i => [i.identifier, i]));
  const enName = new Map(csvs.item_names.map(r => [r.item, r.name_en]));
  return slug => {
    const row = rowBySlug.get(slug);
    return { slug, name: row ? (enName.get(slug) || titleCase(slug)) : titleCase(slug), found: !!row };
  };
}

// =========================================================================
// Reason index — every citable "this value legitimately changed" source
// =========================================================================
// Two kinds:
//  * SYSTEMATIC — a schema-level fact from csv/MANIFEST.md that explains a
//    whole field changing across many ids.
//  * Per-entity evidence from tools/csv_merge/species_field_overrides.csv
//    and reports/merge/conflicts_*.csv. Those files record (old PokeAPI
//    value, chosen merged value) pairs, so the strongest possible match is
//    by VALUE: if src/data holds the PokeAPI value and the new extraction
//    produces the chosen value, that row IS the reason, no name-guessing.
const SYSTEMATIC = [
  [/^pokemon\.baseExperience$/, "MANIFEST 'Pokémon': base experience is era-split. The PokeAPI clone's `pokemon.base_experience` column — what the old pipeline read — is the **Gen 5-6** value (Charizard 240); `base_experience_gen7plus.csv` is the current Gen 7+ one (Charizard 267). 121 of 902 species differ between the two eras, plus the 38 Gen-7 species where B's Ultra Sun/Ultra Moon revision beat A's original Sun/Moon figure. OPEN QUESTION for architect: current-era (gen7plus, chosen here) or reproduce-the-old (gen5-6)."],
  [/^stats\.baseHappiness$/, "MANIFEST 'Species' — species.csv has no base_happiness; the era split (base_friendship_gen3-7 / _gen8plus) is picked by the species' introduction generation, which MANIFEST says reproduces A's era-mixed column with 0 conflicts."],
  [/^altforms\[/, "PRE-EXISTING drift, not a rewire regression: altforms.js is hand-curated and neither pipeline ever edits an existing entry. Verified with `node tools/populate_region.js --ids <id> --audit` against the OLD source — it reports the identical difference. Across all 1025 ids the only occurrence is 978 Tatsugiri (its 3 stat-identical Megas were user-deduped to one 'Mega Tatsugiri' in 0.3.1, TODO.md #5). If a NEW id ever appears here, re-run that audit before trusting this line."],
  [/^pokemon\.eggGroups$/, "STALE csv/ — merge.js alphabetized the two egg groups by display name for its conflict comparison and then stored that order, losing PokeAPI's row order (the real slot order: Bulbasaur is Monster/Grass, per Bulbapedia). 12 species come out reversed. **merge.js is fixed** (2026-09-06); re-run `node tools/csv_merge/merge.js` to regenerate csv/ and this difference disappears."],
];
// Column names in species_field_overrides.csv / conflicts_*.csv that don't
// contain the field path they explain. Only needed for the name-match
// fallback — the value-pair match doesn't use them.
const COLUMN_ALIAS = { pct_male: "genderrate", growth_rate: "expgrowth", hatch_cycles: "hatchcounter", catch_rate: "capturerate", genus: "category" };
// `moves.js`/`abilities.js` `names`: the merged *_names.csv are wide and
// carry a name_ja_roma column PokeAPI's long move_names.csv has no rows for,
// so every move gains a `jaRomaji` key. That specific delta is citable; any
// OTHER name change is not, so this checks the shape rather than pattern-
// matching the field name.
const ROMAJI_ONLY = "MANIFEST 'Names are wide' — merged move_names.csv has a name_ja_roma column PokeAPI's move_names.csv has no rows for, so the move gains a jaRomaji key and nothing else. OPEN QUESTION for architect: emit or suppress (one line, WIDE_LANGS).";
function romajiOnlyDelta(exp, act) {
  if (!exp || !act || exp.jaRomaji === undefined || act.jaRomaji !== undefined) return false;
  const stripped = Object.assign({}, exp);
  delete stripped.jaRomaji;
  return JSON.stringify(stripped) === JSON.stringify(act);
}
function loadReasonIndex() {
  const idx = new Map(); // key -> [{ src, column, pokeapi, chosen, reason }]
  const add = (key, rec) => { if (!idx.has(key)) idx.set(key, []); idx.get(key).push(rec); };
  const ov = path.join(MERGE_DIR, "species_field_overrides.csv");
  if (fs.existsSync(ov)) {
    for (const r of parseFile(ov).rows) {
      add(r.dex_id, { src: "species_field_overrides.csv", column: r.field, pokeapi: r.pokeapi_value, chosen: r.chosen_value, reason: `${r.field}: ${r.reason} (chosen from ${r.chosen_source})` });
    }
  }
  const dir = path.join(MERGE_DIR, "reports", "merge");
  if (fs.existsSync(dir)) {
    for (const f of fs.readdirSync(dir).filter(x => /^conflicts_.*\.csv$/.test(x))) {
      for (const r of parseFile(path.join(dir, f)).rows) {
        if (r.chosen === r.pokeapi) continue; // PokeAPI won — nothing changed
        add(r.key, { src: "reports/merge/" + f, column: r.column, pokeapi: r.pokeapi, chosen: r.chosen, reason: `${f} — ${r.column}: PokeAPI ${JSON.stringify(r.pokeapi)} -> merged ${JSON.stringify(r.chosen)}` });
      }
    }
  }
  return idx;
}
// Returns a citation string, or null when nothing explains the change.
function citeFor(idx, keys, field, oldVal, newVal) {
  for (const [re, why] of SYSTEMATIC) if (re.test(field)) return why;
  const o = oldVal === undefined || oldVal === null ? "" : String(oldVal);
  const nv = newVal === undefined || newVal === null ? "" : String(newVal);
  const loose = field.toLowerCase().replace(/[^a-z]/g, "");
  let nameHit = null;
  for (const key of keys) {
    for (const rec of idx.get(String(key)) || []) {
      // Strongest evidence: the recorded (PokeAPI -> chosen) pair IS this diff.
      // Skipped when both sides are empty (a list-valued field), where the
      // pair would match every record vacuously.
      if ((o || nv) && String(rec.pokeapi) === o && String(rec.chosen) === nv) return `${rec.src}: ${rec.reason}`;
      // Weaker: the record is about a column whose name matches this field.
      const col = COLUMN_ALIAS[rec.column] || rec.column.toLowerCase().replace(/^(ev|stat|name)_/, "").replace(/[^a-z]/g, "");
      if (col && loose.indexOf(col) !== -1 && !nameHit) nameHit = `${rec.src} (name match, value not exact): ${rec.reason}`;
    }
  }
  return nameHit;
}

// =========================================================================
// DIFF REPORT
// =========================================================================
const J = v => (v === undefined ? "(absent)" : JSON.stringify(v));
function diffFields(id, r, current, csvs) {
  // Mirrors populate_region.js's audit() field-for-field, so "unchanged"
  // here means exactly what "AUDIT PASS" means there.
  const out = [];
  const push = (field, exp, act) => { out.push({ field, exp, act, same: JSON.stringify(exp) === JSON.stringify(act) }); };
  const p = current.pokemonById.get(id) || {}, ep = r.pokemon[id];
  if (!ep) return [{ field: "pokemon", exp: "(no csv row)", act: "(entry exists)", same: false }];
  push("pokemon.name", ep.name, p.name);
  for (const k of ["types", "category", "height", "weight", "abilities"]) push("pokemon." + k, ep[k], p[k]);
  push("pokemon.hiddenAbility", ep.hiddenAbility || undefined, p.hiddenAbility);
  for (const k of ["isLegendary", "isMythical", "isBaby", "hasGenderDifferences", "formsSwitchable"]) push("pokemon." + k, ep[k] || undefined, p[k]);
  push("pokemon.genderRate", ep.genderRate, p.genderRate);
  push("pokemon.habitat", ep.habitat || undefined, p.habitat);
  push("pokemon.baseExperience", ep.baseExperience === null ? undefined : ep.baseExperience, p.baseExperience);
  push("pokemon.regionalDexNumbers", Object.keys(ep.regionalDexNumbers).length ? ep.regionalDexNumbers : undefined, p.regionalDexNumbers);
  push("pokemon.eggGroups", ep.eggGroups.length ? ep.eggGroups : undefined, p.eggGroups);
  push("pokemon.heldItems", ep.heldItems.length ? ep.heldItems : undefined, p.heldItems);

  const s = current.tables.stats[id] || {}, es = r.stats[id];
  for (const k of ["hp", "attack", "defense", "spAttack", "spDefense", "speed", "captureRate", "baseHappiness", "hatchCounter"]) push("stats." + k, es[k], s[k]);
  push("stats.expGrowth", es.expGrowth, s.expGrowth);
  push("stats.effort", es.effort, s.effort);

  const nm = current.tables.names[id] || {}, en = r.names[id];
  for (const k of ["ja", "jaRomaji", "fr", "de", "ko"]) push("names." + k, en[k], nm[k]);

  const ev = (current.tables.evolutions[id] || {}).evolvesTo || [];
  for (const ee of r.evolutions[id]) {
    const ae = ev.find(x => x.id === ee.id);
    if (!ae) { push(`evolutions[->${ee.id}]`, ee, undefined); continue; }
    for (const k of ["method", "level", "item", "timeOfDay", "moveType", "move", "gender"]) push(`evolutions[->${ee.id}].${k}`, ee[k], ae[k]);
  }
  for (const ae of ev) if (!r.evolutions[id].some(x => x.id === ae.id)) push(`evolutions[->${ae.id}]`, undefined, ae);

  const ms = current.tables.movesets[id] || {}, ems = r.movesets[id];
  const lv = x => `${x.level}:${x.move}`;
  pushList(out, "movesets.levelUp", ems.levelUp.map(lv), (ms.levelUp || []).map(lv));
  for (const k of ["tm", "egg", "tutor"]) pushList(out, "movesets." + k, ems[k], ms[k] || []);

  const hs = current.tables.movesets_hisui[id], ehs = r.movesetsHisui[id];
  if (!ehs && hs) push("movesets_hisui", undefined, "(entry)");
  else if (ehs && !hs) push("movesets_hisui", "(entry)", undefined);
  else if (ehs) {
    const lvh = x => `${x.level}:${x.move}${x.mastery === undefined ? "" : ":m" + x.mastery}`;
    pushList(out, "movesets_hisui.levelUp", ehs.levelUp.map(lvh), (hs.levelUp || []).map(lvh));
    pushList(out, "movesets_hisui.tutor", ehs.tutor, hs.tutor || []);
  }

  const region = r.locations[id].region;
  if (region) pushList(out, `locations.${region}`, r.locations[id].areas.map(a => JSON.stringify(a)), ((current.tables.locations[id] || {})[region] || []).map(a => JSON.stringify(a)));

  const megas = ((current.tables.altforms[id] || {}).formes || []).filter(f => f.isMega);
  for (const ef of r.altforms[id] || []) {
    const af = megas.find(f => f.key === ef.key);
    if (!af) { push(`altforms[${ef.key}]`, ef.name, undefined); continue; }
    for (const k of ["name", "sprite", "stats"]) push(`altforms[${ef.key}].${k}`, ef[k], af[k]);
    push(`altforms[${ef.key}].types`, ef.types || undefined, af.types);
    push(`altforms[${ef.key}].ability`, ef.ability || undefined, af.ability);
  }
  for (const af of megas) if (!(r.altforms[id] || []).some(f => f.key === af.key)) push(`altforms[${af.key}]`, undefined, af.name);
  return out;
}
function pushList(out, field, exp, act) {
  const e = new Set(exp), a = new Set(act);
  const missing = exp.filter(x => !a.has(x)), extra = act.filter(x => !e.has(x));
  const ordered = JSON.stringify(exp) === JSON.stringify(act);
  out.push({
    field, same: ordered, isList: true,
    exp: ordered ? `${exp.length} entries` : `${exp.length} entries; ${missing.length} not in current`,
    act: ordered ? `${act.length} entries` : `${act.length} entries; ${extra.length} not in new`,
    detail: ordered ? null : { missing, extra, orderOnly: !missing.length && !extra.length },
  });
}

function report(ids, r, current, csvs, outDir) {
  const idx = loadReasonIndex();
  const speciesBy = new Map(csvs.species.map(x => [x.species, x]));
  const pokemonBySpecies = new Map();
  for (const x of csvs.pokemon) if (x.is_default === "1") pokemonBySpecies.set(x.species, x.identifier);
  let A = 0, B = 0, C = 0;
  const cList = [];
  const lines = [];
  lines.push("# Phase 1 dry run — `csv/` extraction vs. current `src/data/*.js`", "");
  lines.push(`Generated ${new Date().toISOString()} by \`node tools/populate_from_csv.js --sample --dry-run\`.`, "");
  lines.push("Categories, per the Phase 1 brief: **(a)** unchanged · **(b)** changed with a citable reason (`csv/MANIFEST.md`, `tools/csv_merge/species_field_overrides.csv`, `tools/csv_merge/reports/merge/conflicts_*.csv`) · **(c)** changed with NO clear reason — these are extraction bugs until proven otherwise.", "");
  const body = [];
  for (const id of ids) {
    const name = (current.pokemonById.get(id) || {}).name || `#${id}`;
    const sp = speciesBy.get(String(id));
    const keys = [String(id), sp ? sp.identifier : "", pokemonBySpecies.get(String(id)) || ""];
    const diffs = diffFields(id, r, current, csvs);
    const changed = diffs.filter(d => !d.same);
    A += diffs.length - changed.length;
    body.push(`### ${id} ${name}`, "");
    if (!changed.length) { body.push(`_${diffs.length} fields checked, all unchanged (a)._`, ""); }
    else {
      body.push(`${diffs.length} fields checked, ${diffs.length - changed.length} unchanged (a), ${changed.length} changed.`, "");
      body.push("| field | current `src/data` | new from `csv/` | verdict | reason |", "|---|---|---|---|---|");
      for (const d of changed) {
        // An order-only list difference is citable for the flat move lists
        // (source row order, cosmetic) but NOT for locations, where the
        // stored order IS the in-game progression order the app renders.
        const orderOnly = d.isList && d.detail && d.detail.orderOnly && !/^locations\./.test(d.field);
        // An evolution edge the csv/ integrity guard had to drop is
        // explained by that flag, not by an extraction bug.
        const evoTarget = (d.field.match(/^evolutions\[->(\d+)\]/) || [])[1];
        const dropped = evoTarget && r.flagged.some(f => f.startsWith(`CSV INTEGRITY: evolution ${id}->${evoTarget}:`));
        const reason = citeFor(idx, keys, d.field, d.isList ? null : d.act, d.isList ? null : d.exp)
          || (dropped ? "STALE csv/ — the only pokemon_evolution.csv row(s) for this edge carry a corrupt `base_form` (see the CSV INTEGRITY flags), so the guard dropped them. merge.js is fixed; regenerating csv/ restores this edge." : null)
          || (orderOnly ? "Order-only difference: same members, different sequence (csv/ row order differs from the PokeAPI clone's)." : null);
        const cat = reason ? "b" : "c";
        if (cat === "b") B++; else { C++; cList.push(`${id} ${name} — \`${d.field}\`: ${trunc(J(d.act))} -> ${trunc(J(d.exp))}`); }
        let cur = d.isList ? d.act : trunc(J(d.act));
        let neu = d.isList ? d.exp : trunc(J(d.exp));
        if (d.isList && d.detail && !d.detail.orderOnly) {
          if (d.detail.missing.length) neu += `<br>new-only: ${trunc(d.detail.missing.join(", "), 300)}`;
          if (d.detail.extra.length) cur += `<br>current-only: ${trunc(d.detail.extra.join(", "), 300)}`;
        }
        body.push(`| \`${d.field}\` | ${md(cur)} | ${md(neu)} | **${cat}** | ${reason ? md(trunc(reason, 400)) : "**NO REASON FOUND**"} |`);
      }
      body.push("");
    }
    // New SV/BDSP/LA data for this id
    const extra = r.locations[id].extra || {};
    const rgs = Object.keys(extra);
    if (rgs.length) {
      body.push(`**New SV/BDSP/LA encounters** (NEW_ENC_SHAPE, additive — nothing existing changed):`, "");
      for (const rg of rgs) {
        const areas = extra[rg];
        const encN = areas.reduce((n, a) => n + a.enc.length, 0);
        body.push(`- \`${rg}\`: ${areas.length} area(s), ${encN} enc line(s). First: \`${JSON.stringify(areas[0]).slice(0, 400)}\``);
      }
      body.push("");
    }
  }

  // Shared tables
  const shared = sharedDiff(r, current, csvs, idx);
  A += shared.a; B += shared.b; C += shared.c;
  cList.push(...shared.cList);

  lines.push("## csv/ source bugs found this phase — **`csv/` must be regenerated before Phase 2**", "");
  lines.push("Both are in `tools/csv_merge/merge.js`, both are now **fixed there**, and neither takes effect until `node tools/csv_merge/merge.js` is re-run (~35s, the documented path in `csv/MANIFEST.md`). Every difference below tagged `STALE csv/` disappears after that.", "");
  lines.push("1. **`pokemon_evolution.csv`'s `base_form`/`evolved_form`** were resolved through `pokemon_forms.id` instead of `pokemon.id`. The two id spaces only coincide below 10000, so every alt-form reference pointed at an unrelated form (Meowth-Galar 10161 -> `vivillon-fancy`, Slowpoke-Galar 10164 -> `latias-mega`, Farfetch'd-Galar 10166 -> `swampert-mega`, Qwilfish-Hisui 10234 -> `silvally-poison`, Sneasel-Hisui 10235 -> `silvally-ground`). **34 of 58 `base_form` cells wrong**; the merge's FK check passed because the wrong values are still valid `pokemon_forms` identifiers. This directly breaks the 0.3.4/0.3.5 per-forme `evolvesTo` mechanism. Verified: with the fixed mapping, 0 of 58 `base_form` and 0 of 40 `evolved_form` cells point at the wrong species.", "");
  lines.push("2. **`pokemon_egg_groups.csv`'s column order** was the alphabetized-by-display-name string merge.js built for its conflict comparison, which loses PokeAPI's row order — the real slot order (Bulbasaur is Monster/Grass, per Bulbapedia). 161 species come out in a different order than `pokemon.js` holds today.", "");
  lines.push("`pokemon_form_changes.csv` keeps `formIdent` on purpose — **its** `base_form_id` really is a `pokemon_forms.id` (checked: form 746 wishiwashi-solo -> base 10229 wishiwashi-school).", "");
  lines.push("## Summary", "");
  lines.push(`| category | count |`, `|---|---|`);
  lines.push(`| (a) unchanged | ${A} |`, `| (b) changed, cited | ${B} |`, `| **(c) changed, NO reason** | **${C}** |`, "");
  lines.push(`Sample: ${ids.length} species — ${ids.join(", ")}.`, "");
  if (cList.length) {
    lines.push("### (c) — every unexplained difference", "");
    for (const c of cList) lines.push("- " + c);
    lines.push("");
  } else lines.push("_No unexplained differences._", "");
  if (r.flagged.length) {
    lines.push("### Extractor flags (same `flagged` channel populate_region.js uses)", "");
    for (const f of r.flagged) lines.push("- " + f);
    lines.push("");
  }
  lines.push("## New SV/BDSP/LA encounter data (NEW_ENC_SHAPE) — totals over this run", "", ...newEncSummary(ids, r, current), "");
  lines.push("## Shared tables — `moves.js` / `abilities.js` / `items.js`", "", ...shared.lines, "");
  lines.push("## Per-species detail", "", ...body);

  fs.mkdirSync(outDir, { recursive: true });
  const file = path.join(outDir, "diff-report.md");
  fs.writeFileSync(file, lines.join("\n"));
  fs.writeFileSync(path.join(outDir, "results.json"), JSON.stringify(stripBuilders(r), null, 1));
  console.log(`(a) unchanged: ${A}\n(b) changed, cited: ${B}\n(c) changed, NO REASON: ${C}`);
  console.log("Report: " + file);
  return { A, B, C };
}
function stripBuilders(r) { const c = Object.assign({}, r); delete c._builders; return c; }
// Purely additive data — nothing existing changes shape — so it gets one
// aggregate section rather than a per-field diff.
function newEncSummary(ids, r, current) {
  const per = {}, fields = {};
  let withNew = 0, paldeaNative = 0, paldeaCovered = 0;
  for (const id of ids) {
    const extra = (r.locations[id] || {}).extra || {};
    const keys = Object.keys(extra);
    if (keys.length) withNew++;
    if ((r.pokemon[id] || {}).region === "paldea") { paldeaNative++; if (extra.paldea) paldeaCovered++; }
    for (const k of keys) {
      per[k] = per[k] || { species: 0, areas: 0, enc: 0 };
      per[k].species++;
      per[k].areas += extra[k].length;
      for (const a of extra[k]) for (const e of a.enc) { per[k].enc++; for (const f in e) fields[f] = (fields[f] || 0) + 1; }
    }
  }
  const out = [`${withNew} of ${ids.length} sampled species gain wild-encounter data that has no PokeAPI rows at all.`, ""];
  out.push("| region key | source file | species | areas | enc lines |", "|---|---|---|---|---|");
  for (const spec of NEW_ENC_FILES) {
    const p = per[spec.region] || { species: 0, areas: 0, enc: 0 };
    out.push(`| \`${spec.region}\` | \`csv/${spec.file}\` | ${p.species} | ${p.areas} | ${p.enc} |`);
  }
  out.push("");
  if (paldeaNative) out.push(`**Paldea gap** (\`NEEDS_SOURCE_REGIONS\`, SCOPE.md §4): ${paldeaCovered} of ${paldeaNative} native-Paldea species in this run now have real Scarlet/Violet encounters. The remainder are genuinely wild-uncatchable (starters/legendaries/evolution-only), so the list can't simply be emptied — Phase 4 decision.`, "");
  out.push("Field usage across every new enc line (absent = not applicable):", "");
  out.push("| field | lines |", "|---|---|");
  for (const [f, n] of Object.entries(fields).sort((a, b) => b[1] - a[1])) out.push(`| \`${f}\` | ${n} |`);
  return out;
}
const trunc = (s, n) => (s === null || s === undefined ? "" : String(s).length > (n || 160) ? String(s).slice(0, n || 160) + "…" : String(s));
const md = s => String(s).replace(/\|/g, "\\|").replace(/\n/g, " ");

// moves.js / abilities.js / items.js, every key (not just the sample's).
function sharedDiff(r, current, csvs, idx) {
  const lines = [];
  let a = 0, b = 0, c = 0;
  const cList = [];
  const { moveData, abilityData, moveRowByName, abilityRowByName, itemData } = r._builders;
  const tally = new Map(); // "field|category" -> count, plus examples
  const note = (field, cat, ex) => {
    const k = field + "|" + cat;
    if (!tally.has(k)) tally.set(k, { field, cat, n: 0, ex: [] });
    const t = tally.get(k);
    t.n++;
    if (t.ex.length < 3) t.ex.push(ex);
  };
  for (const [k, m] of Object.entries(current.moves)) {
    const row = moveRowByName.get(k);
    if (!row) { c++; cList.push(`moves.js "${k}" — no move row in csv/`); continue; }
    const exp = moveData(row, k);
    for (const f of ["type", "category", "power", "accuracy", "pp", "priority", "target", "names", "effectChance", "flags", "meta"]) {
      let e = exp[f], act = m[f];
      if (f === "effectChance") e = e === null ? undefined : e;
      if (f === "flags") e = e.length ? e : undefined;
      if (f === "meta") e = e || undefined;
      if (JSON.stringify(e) === JSON.stringify(act)) { a++; continue; }
      const reason = (f === "names" && romajiOnlyDelta(e, act) ? ROMAJI_ONLY : null)
        || citeFor(idx, [row.identifier], `moves.js "${k}".${f}`, act, e);
      if (reason) { b++; note("moves." + f, "b", `${k}: ${trunc(J(act), 60)} -> ${trunc(J(e), 60)}`); }
      else { c++; note("moves." + f, "c", `${k}: ${trunc(J(act), 60)} -> ${trunc(J(e), 60)}`); cList.push(`moves.js "${k}".${f}: ${trunc(J(act), 80)} -> ${trunc(J(e), 80)}`); }
    }
  }
  for (const [k, ab] of Object.entries(current.abilities)) {
    const row = abilityRowByName.get(k);
    if (!row) { c++; cList.push(`abilities.js "${k}" — no ability row in csv/`); continue; }
    const e = abilityData(row, k).names;
    if (JSON.stringify(e) === JSON.stringify(ab.names)) { a++; continue; }
    const reason = (romajiOnlyDelta(e, ab.names) ? ROMAJI_ONLY : null)
      || citeFor(idx, [row.identifier], `abilities.js "${k}".names`, ab.names, e);
    if (reason) { b++; note("abilities.names", "b", `${k}`); }
    else { c++; note("abilities.names", "c", `${k}: ${trunc(J(ab.names), 80)} -> ${trunc(J(e), 80)}`); cList.push(`abilities.js "${k}".names: ${trunc(J(ab.names), 80)} -> ${trunc(J(e), 80)}`); }
  }
  for (const [slug, it] of Object.entries(current.items)) {
    const exp = itemData(slug);
    if (!exp.found) { c++; cList.push(`items.js "${slug}" — no item row in csv/`); continue; }
    if (exp.name === it.name) { a++; continue; }
    const reason = citeFor(idx, [slug], `items.js "${slug}".name`, it.name, exp.name);
    if (reason) { b++; note("items.name", "b", slug); }
    else { c++; note("items.name", "c", `${slug}: ${J(it.name)} -> ${J(exp.name)}`); cList.push(`items.js "${slug}".name: ${J(it.name)} -> ${J(exp.name)}`); }
  }
  lines.push(`Checked every key: ${Object.keys(current.moves).length} moves, ${Object.keys(current.abilities).length} abilities, ${Object.keys(current.items).length} items.`, "");
  if (!tally.size) lines.push("_All shared-table fields unchanged._");
  else {
    lines.push("| field | verdict | count | examples |", "|---|---|---|---|");
    for (const t of [...tally.values()].sort((x, y) => y.n - x.n)) {
      lines.push(`| \`${t.field}\` | **${t.cat}** | ${t.n} | ${md(trunc(t.ex.join(" · "), 260))} |`);
    }
  }
  return { lines, a, b, c, cList };
}

// =========================================================================
// CLI
// =========================================================================
// The Phase 1 validation sample: 30 species chosen to hit every distinct
// code path in extract() rather than a token subset. Rationale per id is in
// the handoff report.
const SAMPLE = [1, 6, 25, 26, 37, 52, 79, 80, 83, 128, 132, 133, 151, 211, 215, 233, 265, 399, 442, 446, 479, 483, 487, 550, 704, 800, 865, 899, 900, 906];

function selfTest() {
  const assert = require("assert");
  assert.deepStrictEqual(levelRange("40 - 41"), [40, 41]);
  assert.deepStrictEqual(levelRange("40"), [40, 40]);
  assert.strictEqual(levelRange(""), null);
  assert.strictEqual(plainText("{Old Amber;ITEM;old-amber} found<br/>here"), "Old Amber found here");
  assert.strictEqual(titleCase("water-surface"), "Water Surface");
  assert.deepStrictEqual(wideNames({ name_ja_hrkt: "はたく", name_fr: "X", name_ja_roma: "" }), { ja: "はたく", fr: "X" });
  // buildSet scopes to one version group and dedupes the flat lists
  const set = buildSet([
    { version_group: "a", method: "level-up", move: "tackle", level: "5", mastery: "" },
    { version_group: "a", method: "level-up", move: "growl", level: "1", mastery: "3" },
    { version_group: "b", method: "level-up", move: "nope", level: "1", mastery: "" },
    { version_group: "a", method: "machine", move: "cut" },
    { version_group: "a", method: "machine", move: "cut" },
  ], "a", m => m.toUpperCase());
  assert.deepStrictEqual(set.levelUp.map(x => x.level), [1, 5]);
  assert.strictEqual(set.levelUp[0].mastery, 3);
  assert.strictEqual(set.levelUp[0].move, "GROWL");
  assert.deepStrictEqual(set.tm, ["CUT"]);
  assert.ok(romajiOnlyDelta({ ja: "x", jaRomaji: "y", fr: "z" }, { ja: "x", fr: "z" }));
  assert.ok(!romajiOnlyDelta({ ja: "q", jaRomaji: "y", fr: "z" }, { ja: "x", fr: "z" }));
  // citeFor's value-pair match beats a name match
  const idx = new Map([["6", [{ src: "s", column: "catch_rate", pokeapi: "45", chosen: "60", reason: "r" }]]]);
  assert.ok(/s: r/.test(citeFor(idx, ["6"], "stats.captureRate", 45, 60)));
  assert.strictEqual(citeFor(idx, ["6"], "stats.hatchCounter", 1, 2), null);
  // Phase 2 writer: a classic 0.2.8 enc line must serialise byte-identically
  // to what areaText has always written, and the NEW_ENC_SHAPE fields must
  // come out in the documented order with source-faithful types.
  assert.strictEqual(PR.areaText({ area: "Route 1", enc: [{ method: "Grass", games: "Red/Blue", min: 2, max: 4, rate: 45 }] }),
    '{ area: "Route 1", enc: [{ method: "Grass", games: "Red/Blue", min: 2, max: 4, rate: 45 }] }');
  assert.strictEqual(PR.encText({ terrain: ["land"], group: "bulbasaur", weight: 100, rate: "10%", games: "Scarlet/Violet", method: "Symbol Encounter", min: 58, max: 68 }),
    '{ method: "Symbol Encounter", games: "Scarlet/Violet", min: 58, max: 68, rate: "10%", weight: 100, group: "bulbasaur", terrain: ["land"] }');
  assert.strictEqual(PR.encText({ method: "M", games: "G", timeRates: { morning: 1, day: "20%" }, times: ["night"], boulder: true }),
    '{ method: "M", games: "G", timeRates: { morning: 1, day: "20%" }, times: ["night"], boulder: true }');
  assert.throws(() => PR.encText({ method: "M", games: "G", bogus: 1 }), /unknown field/);
  console.log("self-test OK");
}

// moves.js's `names` is the one shared-table field the merged source changes
// (every move gains `jaRomaji` from move_names.name_ja_roma, which PokeAPI's
// long move_names.csv has no rows for — architect decision 2026-09-06:
// emit it). assemble() only ever APPENDS to moves.js and upsertEntries() is
// numeric-id-keyed, so neither can touch an existing name-keyed entry —
// hence this targeted rewrite of just the `names: { ... }` sub-object, one
// entry line at a time. Everything else on the line is left byte-for-byte
// alone. Returns the number of entries changed.
function updateMoveNames(csvs, current) {
  const moveData = moveDataCsv(csvs);
  const rowByName = new Map();
  const enName = new Map(csvs.move_names.map(r => [r.move, r.name_en]));
  for (const row of csvs.moves) rowByName.set(enName.get(row.identifier) || titleCase(row.identifier), row);
  const p = path.join(ROOT, "src", "data", "moves.js");
  let changed = 0, unresolved = [];
  const out = fs.readFileSync(p, "utf8").split("\n").map(line => {
    const m = line.match(/^  "((?:[^"\\]|\\.)*)": \{/);
    if (!m) return line;
    const name = m[1].replace(/\\(.)/g, "$1");
    if (!current.moves[name]) return line;
    const row = rowByName.get(name);
    if (!row) { unresolved.push(name); return line; }
    const want = `, names: ${PR.namesText(moveData(row, name).names)}`;
    const next = line.replace(/, names: \{[^{}]*\}/, want);
    if (next === line) { unresolved.push(name + " (no names: block on its line)"); return line; }
    if (next !== line) changed++;
    return next;
  }).join("\n");
  if (unresolved.length) throw new Error(`moves.js names: ${unresolved.length} entry(ies) not resolvable in csv/ — ${unresolved.slice(0, 5).join(", ")}`);
  fs.writeFileSync(p, out);
  return changed;
}

function main(argv) {
  const args = { ids: null, dryRun: false, assemble: false, newEnc: false, tables: null, out: DEFAULT_OUT, selfTest: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--dry-run") args.dryRun = true;
    else if (a === "--assemble") args.assemble = true;
    else if (a === "--new-encounters") args.newEnc = true;
    else if (a === "--self-test") args.selfTest = true;
    else if (a === "--sample") args.ids = SAMPLE.slice();
    else if (a === "--all") args.ids = Array.from({ length: 1025 }, (_, i2) => i2 + 1);
    else if (a === "--ids") args.ids = (argv[++i] || "").split(",").map(s => Number(s.trim())).filter(n => Number.isInteger(n) && n > 0);
    else if (a === "--tables") args.tables = (argv[++i] || "").split(",").map(s => s.trim()).filter(Boolean);
    else if (a === "--out") args.out = path.resolve(argv[++i] || DEFAULT_OUT);
    else { console.error("unrecognized argument: " + a); process.exit(1); }
  }
  if (args.selfTest) return selfTest();
  if (args.dryRun === args.assemble) {
    console.error("give exactly one of --dry-run / --assemble.");
    console.error("  node tools/populate_from_csv.js --sample --dry-run");
    console.error("  node tools/populate_from_csv.js --all --assemble [--tables a,b] [--new-encounters]");
    process.exit(1);
  }
  if (!args.ids || !args.ids.length) { console.error("give --ids a,b,c, --sample or --all"); process.exit(1); }
  const t0 = Date.now();
  const csvs = loadCsvs();
  const current = PR.currentData();
  console.log(`Loaded csv/ (${((Date.now() - t0) / 1000).toFixed(1)}s) and src/data/*.js.`);
  const r = extractFromCsv(args.ids, csvs, current);
  if (args.dryRun) return report(args.ids, r, current, csvs, args.out);

  // Gate (see the header): the new encounter shape is extracted always,
  // written only on request.
  if (!args.newEnc) {
    const n = Object.values(r.locations).filter(l => Object.keys(l.extra || {}).length).length;
    for (const id in r.locations) r.locations[id].extra = {};
    console.log(`--new-encounters NOT set: SV/BDSP/LA data for ${n} species extracted but NOT written (app.js's Found In popup can't render the new shape yet — Phase 4).`);
  }
  // "moves" isn't one of assemble()'s per-id tables — it selects the shared
  // moves.js names rewrite below, so it's filtered back out before the call.
  const tables = (args.tables || ["moves", "pokemon", "stats", "evolutions", "movesets", "movesets_hisui", "names", "locations", "altforms"]);
  if (tables.indexOf("moves") !== -1) console.log(`moves.js names: ${updateMoveNames(csvs, current)} entry(ies) updated (jaRomaji).`);
  // strict=false: a missing description reports instead of throwing. Every
  // one of the 1025 already has hand-authored descriptions, so the skip list
  // is expected to be empty — it is printed by assemble() if it isn't.
  PR.assemble(r, null, tables.filter(t => t !== "moves"), false, current);
}

if (require.main === module) {
  try { main(process.argv.slice(2)); }
  catch (e) { console.error("ERROR:", e.message); process.exit(1); }
}
module.exports = { extractFromCsv, loadCsvs, moveDataCsv, abilityDataCsv, itemDataCsv, buildSet, levelRange, plainText, wideNames, citeFor, SAMPLE, NEW_ENC_FILES };
