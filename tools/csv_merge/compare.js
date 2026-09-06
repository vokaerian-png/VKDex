// tools/csv_merge/compare.js — join a PokeAPI table with its PokeDB counterpart
// and log EVERY divergence to reports/conflicts_<table>.csv
// (key, column, pokeapi, pokedb). Missing rows are logged too (column "_row_").
//
//   node tools/csv_merge/compare.js            -> all pairings
//   node tools/csv_merge/compare.js species moves
//
// Each pairing is a loader returning { a: Map<key, cols>, b: Map<key, cols> }
// with column names already normalized to one vocabulary; the engine only diffs.
"use strict";
const fs = require("fs");
const path = require("path");
const { parseFile, stringify } = require("./csv_util");
const { SOURCES, REPORTS } = require("./inventory");

const cache = {};
const load = (src, f) => cache[src + f] || (cache[src + f] = parseFile(path.join(SOURCES[src], f)).rows);
const A = f => load("pokeapi", f), B = f => load("pokedb", f);
const idMap = (rows, k = "id", v = "identifier") => new Map(rows.map(r => [r[k], r[v]]));
const bool = v => v === "1" || v === "true" ? "1" : v === "0" || v === "false" ? "0" : v;
const machineKey = s => { const m = /^(tm|hm|tr)0*(\d+)$/.exec(s); return m ? m[1] + m[2] : s; };

// ---------- lookups ----------
const L = {
  get aTypes() { return idMap(A("types.csv")); },
  get bTypes() { return new Map(B("types.csv").map(r => [r.id, r.name.toLowerCase()])); },
  get aAbil() { return idMap(A("abilities.csv")); },
  get bAbil() { return idMap(B("abilities.csv")); },
  get aMoves() { return idMap(A("moves.csv")); },
  get bMoves() { return idMap(B("moves.csv")); },
  get aItems() { return idMap(A("items.csv")); },
  get aVG() { return idMap(A("version_groups.csv")); },
  get aMethods() { return idMap(A("pokemon_move_methods.csv")); },
  get aDmg() { return idMap(A("move_damage_classes.csv")); },
  get bDmg() { return idMap(B("damage_categories.csv")); },
  get aContest() { return idMap(A("contest_types.csv")); },
  get bContest() { return idMap(B("contest_types.csv")); },
  get aGrowth() { return idMap(A("growth_rates.csv")); },
  get bGrowth() { return idMap(B("leveling_rates.csv"), "id", "description"); },
  get aEgg() { return idMap(A("egg_groups.csv")); },
  get bEgg() { return idMap(B("egg_groups.csv")); },
  get aColor() { return idMap(A("pokemon_colors.csv")); },
  get bColor() { return idMap(B("pokedex_colors.csv")); },
  get bForms() { return idMap(B("pokemon_forms.csv")); },
};
// vocabulary maps, PokeAPI -> PokeDB
const EGG = { water1: "water-1", water2: "water-2", water3: "water-3", ground: "field", plant: "grass", humanshape: "human-like", indeterminate: "amorphous", "no-eggs": "undiscovered" };
const GROWTH = { slow: "Slow", medium: "Medium Fast", fast: "Fast", "medium-slow": "Medium Slow", "slow-then-very-fast": "Erratic", "fast-then-very-slow": "Fluctuating" };
const LANG = { en: "9", ja: "11", "ja-roma": "2", fr: "5", de: "6", es: "7", it: "8", ko: "3", "zh-hant": "4", "zh-hans": "12" };
const names = (file, idCol) => { // PokeAPI *_names.csv -> Map<id, {lang: name}>
  const m = new Map();
  for (const r of A(file)) { if (!m.has(r[idCol])) m.set(r[idCol], {}); m.get(r[idCol])[r.local_language_id] = r.name; }
  return m;
};
const genderPct = g => g === "-1" ? "???" : String((8 - +g) / 8 * 100);

// ---------- pairings ----------
const pairings = {
  // one row per National Dex number; species + default form + stats + names
  species() {
    const a = new Map(), b = new Map();
    const sn = names("pokemon_species_names.csv", "pokemon_species_id");
    const genus = new Map(A("pokemon_species_names.csv").filter(r => r.local_language_id === "9").map(r => [r.pokemon_species_id, r.genus]));
    const defPk = new Map(A("pokemon.csv").filter(r => r.is_default === "1").map(r => [r.species_id, r]));
    const stats = new Map(); for (const r of A("pokemon_stats.csv")) { if (!stats.has(r.pokemon_id)) stats.set(r.pokemon_id, {}); stats.get(r.pokemon_id)[r.stat_id] = r; }
    const types = new Map(); for (const r of A("pokemon_types.csv")) { if (!types.has(r.pokemon_id)) types.set(r.pokemon_id, {}); types.get(r.pokemon_id)[r.slot] = L.aTypes.get(r.type_id); }
    const abil = new Map(); for (const r of A("pokemon_abilities.csv")) { if (!abil.has(r.pokemon_id)) abil.set(r.pokemon_id, {}); abil.get(r.pokemon_id)[r.is_hidden === "1" ? "h" : r.slot] = L.aAbil.get(r.ability_id); }
    const eggs = new Map(); for (const r of A("pokemon_egg_groups.csv")) { if (!eggs.has(r.species_id)) eggs.set(r.species_id, []); eggs.get(r.species_id).push(EGG[L.aEgg.get(r.egg_group_id)] || L.aEgg.get(r.egg_group_id)); }
    const STAT = { 1: "hp", 2: "atk", 3: "def", 4: "spa", 5: "spd", 6: "spe" };
    for (const s of A("pokemon_species.csv")) {
      const p = defPk.get(s.id), n = sn.get(s.id) || {}, st = stats.get(p.id) || {}, t = types.get(p.id) || {}, ab = abil.get(p.id) || {};
      const row = {
        identifier: s.identifier, generation: s.generation_id, catch_rate: s.capture_rate,
        base_friendship_gen3_7: s.base_happiness, base_friendship_gen8: s.base_happiness,
        hatch_cycles: s.hatch_counter, growth_rate: GROWTH[L.aGrowth.get(s.growth_rate_id)], pct_male: genderPct(s.gender_rate),
        is_legendary: bool(s.is_legendary), is_mythical: bool(s.is_mythical), is_baby: bool(s.is_baby), color: L.aColor.get(s.color_id),
        genus: genus.get(s.id), type_1: t[1] || "", type_2: t[2] || "", ability_1: ab[1] || "", ability_2: ab[2] || "", ability_hidden: ab.h || "",
        height_m: String(+p.height / 10), weight_kg: String(+p.weight / 10), base_experience: p.base_experience,
        egg_groups: (eggs.get(s.id) || []).sort().join("/"),
      };
      for (const [id, k] of Object.entries(STAT)) { row["stat_" + k] = (st[id] || {}).base_stat || ""; row["ev_" + k] = (st[id] || {}).effort || ""; }
      for (const [k, id] of Object.entries(LANG)) row["name_" + k] = n[id] || (k === "ja" ? n["1"] : "") || "";
      a.set(s.id, row);
    }
    const np = new Map(B("national_pokedexes.csv").map(r => [r.id, r]));
    const bn = new Map(B("ndex_names.csv").map(r => [r.ndex_id, r]));
    const beg = new Map(B("ndex_egg_groups.csv").map(r => [r.ndex_id, r]));
    for (const f of B("pokemon_forms.csv").filter(r => r.is_default_form === "true")) {
      const s = np.get(f.ndex_id) || {}, n = bn.get(f.ndex_id) || {}, e = beg.get(f.ndex_id) || {};
      const row = {
        identifier: n.identifier, generation: s.generation_id, catch_rate: s.catch_rate,
        base_friendship_gen3_7: s.base_friendship_gen3_7, base_friendship_gen8: s.base_friendship_gen8,
        hatch_cycles: s.hatch_time_cycles, growth_rate: L.bGrowth.get(s.leveling_rate_id), pct_male: s.percentage_male,
        is_legendary: bool(f.is_legendary), is_mythical: bool(f.is_mythical), is_baby: bool(f.is_baby), color: (L.bColor.get(f.pokedex_color_id) || "").toLowerCase(),
        genus: f.pokemon_category, type_1: L.bTypes.get(f.type_1_id) || "", type_2: L.bTypes.get(f.type_2_id) || "",
        ability_1: L.bAbil.get(f.ability_primary_id) || "", ability_2: L.bAbil.get(f.ability_secondary_id) || "", ability_hidden: L.bAbil.get(f.ability_hidden_id) || "",
        height_m: f.height_m.replace(/m$/, ""), weight_kg: f.weight_kg.replace(/kg$/, ""), base_experience: f.base_experience, // PokeDB stores "0.7m"/"6.9kg"
        egg_groups: [L.bEgg.get(e.egg_group_1_id), L.bEgg.get(e.egg_group_2_id)].filter(Boolean).sort().join("/"),
        stat_hp: f.stat_hp, stat_atk: f.stat_attack, stat_def: f.stat_defense, stat_spa: f.stat_spatk, stat_spd: f.stat_spdef, stat_spe: f.stat_speed,
        ev_hp: f.ev_yield_hp, ev_atk: f.ev_yield_atk, ev_def: f.ev_yield_def, ev_spa: f.ev_yield_spatk, ev_spd: f.ev_yield_spdef, ev_spe: f.ev_yield_speed,
        name_en: n.name_english, name_ja: n.name_japanese, "name_ja-roma": n.name_japanese_romanized, name_fr: n.name_french, name_de: n.name_german,
        name_es: n.name_spanish, name_it: n.name_italian, name_ko: n.name_korean, "name_zh-hant": n.name_chinese_traditional, "name_zh-hans": n.name_chinese_simplified,
      };
      b.set(f.ndex_id, row);
    }
    return { a, b, keyLabel: "dex_number" };
  },

  abilities() {
    const an = names("ability_names.csv", "ability_id");
    const a = new Map(A("abilities.csv").filter(r => r.is_main_series === "1").map(r => [r.identifier, { id: r.id, generation: r.generation_id, name_en: (an.get(r.id) || {})[9] || "" }]));
    const b = new Map(B("abilities.csv").filter(r => r.is_main_series === "true").map(r => [r.identifier, { id: r.id, generation: r.generation_id, name_en: r.name }]));
    return { a, b, keyLabel: "identifier" };
  },

  moves() {
    const mn = names("move_names.csv", "move_id");
    const a = new Map(A("moves.csv").map(r => { const n = mn.get(r.id) || {}; return [r.identifier, {
      id: r.id, generation: r.generation_id, type: L.aTypes.get(r.type_id), power: r.power, pp: r.pp, accuracy: r.accuracy, priority: r.priority,
      damage_class: L.aDmg.get(r.damage_class_id), contest_type: L.aContest.get(r.contest_type_id) || "",
      name_en: n[9] || "", name_ja: n[11] || n[1] || "", name_fr: n[5] || "", name_de: n[6] || "", name_es: n[7] || "", name_it: n[8] || "", name_ko: n[3] || "", "name_zh-hant": n[4] || "",
    }]; }));
    const b = new Map(B("moves.csv").map(r => [r.identifier, {
      id: r.id, generation: r.generation_id, type: L.bTypes.get(r.type_id), power: r.power, pp: r.pp, accuracy: r.accuracy, priority: r.priority,
      damage_class: L.bDmg.get(r.damage_category_id), contest_type: L.bContest.get(r.contest_type_id) || "",
      name_en: r.name, name_ja: r.name_jp, name_fr: r.name_fr, name_de: r.name_ger, name_es: r.name_es, name_it: r.name_it, name_ko: r.name_kr, "name_zh-hant": r.name_cn,
    }]));
    return { a, b, keyLabel: "identifier" };
  },

  items() {
    const inm = names("item_names.csv", "item_id");
    const fling = new Map(B("item_fling_effects.csv").map(r => [r.item_identifier, r.fling_power]));
    const gen = new Map(); for (const r of A("item_game_indices.csv")) gen.set(r.item_id, Math.min(+r.generation_id, gen.get(r.item_id) || 99));
    const a = new Map(A("items.csv").map(r => { const n = inm.get(r.id) || {}; return [r.identifier, {
      name_en: n[9] || "", name_ja: n[11] || n[1] || "", name_fr: n[5] || "", name_de: n[6] || "", name_es: n[7] || "", name_it: n[8] || "", name_ko: n[3] || "",
      fling_power: r.fling_power, introduced_generation: gen.has(r.id) ? String(gen.get(r.id)) : "",
    }]; }));
    const bnames = new Map(); for (const r of B("item_names.csv")) { if (!bnames.has(r.item_identifier)) bnames.set(r.item_identifier, {}); bnames.get(r.item_identifier)[r.language_identifier] = r.localized_name; }
    const b = new Map(B("items.csv").map(r => { const n = bnames.get(r.identifier) || {}; return [r.identifier, {
      name_en: r.name, name_ja: n.japanese || "", name_fr: n.french || "", name_de: n.german || "", name_es: n.spanish || n["spanish-spain"] || "", name_it: n.italian || "", name_ko: n.korean || "",
      fling_power: fling.get(r.identifier) || "", introduced_generation: r.introduced_in_generation_id,
    }]; }));
    return { a, b, keyLabel: "identifier" };
  },

  // chain membership: for each species, the sorted set of species sharing its chain/tree
  evolutions() {
    const a = new Map(), b = new Map();
    const chains = new Map(); for (const s of A("pokemon_species.csv")) { if (!chains.has(s.evolution_chain_id)) chains.set(s.evolution_chain_id, []); chains.get(s.evolution_chain_id).push(s.id); }
    for (const s of A("pokemon_species.csv")) { const c = chains.get(s.evolution_chain_id); a.set(s.id, { chain_members: c.map(Number).sort((x, y) => x - y).join("/"), chain_size: String(c.length), evolves_from: s.evolves_from_species_id }); }
    const trees = new Map(); for (const r of B("ndex_evolution_trees.csv")) { if (!trees.has(r.evolution_tree_id)) trees.set(r.evolution_tree_id, []); trees.get(r.evolution_tree_id).push(r.ndex_id); }
    for (const r of B("ndex_evolution_trees.csv")) { const c = trees.get(r.evolution_tree_id); b.set(r.ndex_id, { chain_members: c.map(Number).sort((x, y) => x - y).join("/"), chain_size: String(c.length), evolves_from: "" }); }
    // PokeDB has no structured evolves_from; drop that column from the diff rather than log 1025 fake conflicts
    for (const v of a.values()) delete v.evolves_from; for (const v of b.values()) delete v.evolves_from;
    return { a, b, keyLabel: "dex_number" };
  },

  // current-gen chart: key attack>defense (mono types), value multiplier
  type_chart() {
    const a = new Map(A("type_efficacy.csv").map(r => [L.aTypes.get(r.damage_type_id) + ">" + L.aTypes.get(r.target_type_id), { multiplier: String(+r.damage_factor / 100) }]));
    const b = new Map();
    for (const r of B("type_weakness_charts.csv").filter(r => r.defense_type_2_id === "")) {
      const def = L.bTypes.get(r.defense_type_1_id);
      for (const atk of Object.keys(r).filter(k => !/^(id|defense_type_)/.test(k))) b.set(atk + ">" + def, { multiplier: String(+r[atk]) });
    }
    return { a, b, keyLabel: "attack>defense" };
  },

  // key version_group/machine -> move
  machines() {
    const a = new Map(A("machines.csv").map(r => [L.aVG.get(r.version_group_id) + "/" + machineKey(L.aItems.get(r.item_id)), { move: L.aMoves.get(r.move_id) }]));
    const b = new Map(B("machines.csv").map(r => [r.version_identifier + "/" + machineKey(r.item_identifier), { move: r.move_identifier }]));
    return { a, b, keyLabel: "version_group/machine" };
  },

  // learnsets: key form/version_group/method/move -> level. PokeDB form ids -> identifiers minus "-default";
  // PokeAPI pokemon.identifier is the bare species name for default forms. Methods 1-4 share ids on both sides.
  learnsets() {
    const METHOD = { 1: "level-up", 2: "egg", 3: "tutor", 4: "machine" };
    const { aForm, bForm } = formKeys();
    const a = new Map(), b = new Map();
    for (const r of A("pokemon_moves.csv")) { const m = METHOD[r.pokemon_move_method_id]; if (!m) continue; a.set(`${aForm.get(r.pokemon_id)}/${L.aVG.get(r.version_group_id)}/${m}/${L.aMoves.get(r.move_id)}`, { level: r.level }); }
    for (const r of B("pokemon_moves.csv")) { const m = METHOD[r.pokemon_move_method_id]; if (!m) continue; b.set(`${bForm.get(r.pokemon_form_id)}/${r.version_identifier}/${m}/${L.bMoves.get(r.move_id)}`, { level: r.level }); }
    return { a, b, keyLabel: "form/version_group/method/move" };
  },
};

// Form keys comparable across sources: default form -> bare species identifier
// on both sides; other forms -> PokeDB's suffix vocabulary folded onto PokeAPI's.
function formKeys() {
  const species = idMap(A("pokemon_species.csv"));
  const aForm = new Map(A("pokemon.csv").map(r => [r.id, r.is_default === "1" ? species.get(r.species_id) : r.identifier]));
  const bSpecies = idMap(B("ndex_names.csv"), "ndex_id");
  const SUFFIX = [[/-mega-evolution(-[xy])?$/, "-mega$1"], [/-gigantamax$/, "-gmax"], [/-alolan$/, "-alola"], [/-galarian$/, "-galar"], [/-hisuian$/, "-hisui"], [/-paldean$/, "-paldea"]];
  const bForm = new Map(B("pokemon_forms.csv").map(r => [r.id, r.is_default_form === "true" ? bSpecies.get(r.ndex_id) : SUFFIX.reduce((s, [re, to]) => s.replace(re, to), r.identifier)]));
  return { aForm, bForm };
}

// ---------- engine ----------
const num = s => /^-?\d+(\.\d+)?$/.test(s) ? Number(s) : null;
const same = (x, y) => { x = (x ?? "").trim(); y = (y ?? "").trim(); if (x === y) return true; const nx = num(x), ny = num(y); return nx !== null && ny !== null && nx === ny; };

function compare(name) {
  const { a, b, keyLabel } = pairings[name]();
  const conflicts = [], byCol = {}, keysWithConflict = new Set();
  let matched = 0;
  for (const [k, ra] of a) {
    const rb = b.get(k);
    if (!rb) { conflicts.push([k, "_row_", "present", "missing"]); continue; }
    matched++;
    for (const col of Object.keys(ra)) if (col in rb && !same(ra[col], rb[col])) {
      conflicts.push([k, col, ra[col], rb[col]]); byCol[col] = (byCol[col] || 0) + 1; keysWithConflict.add(k);
    }
  }
  for (const k of b.keys()) if (!a.has(k)) conflicts.push([k, "_row_", "missing", "present"]);
  fs.mkdirSync(REPORTS, { recursive: true });
  fs.writeFileSync(path.join(REPORTS, `conflicts_${name}.csv`), stringify([[keyLabel, "column", "pokeapi", "pokedb"], ...conflicts]));
  const summary = { table: name, pokeapi_rows: a.size, pokedb_rows: b.size, matched, only_pokeapi: a.size - matched, only_pokedb: b.size - matched,
    matched_clean: matched - keysWithConflict.size, matched_with_conflict: keysWithConflict.size, conflict_cells: conflicts.length - (a.size - matched) - (b.size - matched),
    conflicts_by_column: Object.fromEntries(Object.entries(byCol).sort((x, y) => y[1] - x[1])) };
  console.log(JSON.stringify(summary));
  return summary;
}

if (require.main === module) {
  const want = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(pairings);
  const all = want.map(compare);
  fs.writeFileSync(path.join(REPORTS, "compare_summary.json"), JSON.stringify(all, null, 1));
}
module.exports = { pairings, compare, A, B, L, idMap, bool, machineKey, EGG, GROWTH, LANG, names, genderPct, formKeys, same };
