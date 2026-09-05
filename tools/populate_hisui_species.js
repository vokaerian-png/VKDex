// Population pipeline for Hisui's 29 net-new species (TODO.md #6 / PLAN.md
// "Standalone dexes"). Same CSV-join techniques as tools/populate_region.js,
// but keyed off an explicit, non-contiguous id list spanning 3 generations
// instead of one generation's contiguous id range — populate_region.js
// resolves MIN_ID/MAX_ID from `generation_id`, which can't express "these 29
// ids and nothing else from Gen 5/6/7".
//
// Usage:
//   node tools/populate_hisui_species.js --generate
//     -> temp/hisui_species_results.json + temp/hisui_species_needs_descriptions.json
//   node tools/populate_hisui_species.js --assemble [descriptionsPath]
//     -> appends to src/data/{pokemon,stats,evolutions,movesets,names,locations}.js
//        + moves.js/abilities.js additions + hisui.js's remaining 29 numbers.
//
// Descriptions are hand-authored (copyright), same as every prior pass.
"use strict";
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const CSV_DIR = path.join(ROOT, "temp", "PokeAPI-master", "data", "v2", "csv");
const DATA_DIR = path.join(ROOT, "src", "data");
const TEMP_DIR = path.join(ROOT, "temp");

// id -> region tag, or null for the 7 Legends: Arceus originals (dex 899-905)
// which have no mainline region at all and instead get `hisuiOnly: true`
// (National Dex + Search exclusion flag, see app.js).
const TARGETS = {
  501: "unova", 502: "unova", 503: "unova",
  548: "unova", 549: "unova", 550: "unova",
  570: "unova", 571: "unova",
  627: "unova", 628: "unova",
  641: "unova", 642: "unova", 645: "unova",
  700: "kalos", 704: "kalos", 705: "kalos", 706: "kalos", 712: "kalos", 713: "kalos",
  722: "alola", 723: "alola", 724: "alola",
  899: null, 900: null, 901: null, 902: null, 903: null, 904: null, 905: null,
};
const IDS = Object.keys(TARGETS).map(Number).sort((a, b) => a - b);
// Every id that may legally appear as an evolution target: the already
// populated national range plus this batch.
const EXISTING_MAX = 493;

// ---- CSV parsing (identical semantics to populate_region.js) ----
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
  const rows = parseCSV(fs.readFileSync(path.join(CSV_DIR, name), "utf8"));
  const header = rows[0];
  return rows.slice(1).filter(r => r.length === header.length && r.some(x => x !== "")).map(r => {
    const o = {};
    header.forEach((h, i) => (o[h] = r[i]));
    return o;
  });
}
const byId = (rows, key) => new Map(rows.map(r => [r[key], r]));
const groupBy = (rows, key) => {
  const m = new Map();
  for (const r of rows) { if (!m.has(r[key])) m.set(r[key], []); m.get(r[key]).push(r); }
  return m;
};
const titleCase = s => s.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

const GROWTH = {
  "1": { curve: "Slow", points: 1250000 },
  "2": { curve: "Medium Fast", points: 1000000 },
  "3": { curve: "Fast", points: 800000 },
  "4": { curve: "Medium Slow", points: 1059860 },
  "5": { curve: "Erratic", points: 600000 },
  "6": { curve: "Fluctuating", points: 1640000 },
};
// evolution_triggers.csv id -> the project's 4-value method vocabulary.
const TRIGGER_METHOD = { "1": "level", "2": "trade", "3": "stone", "4": "level" };

// =========================================================================
function generate() {
  const csvs = {
    pokemon: loadCSV("pokemon.csv"), species: loadCSV("pokemon_species.csv"),
    speciesNames: loadCSV("pokemon_species_names.csv"), flavorText: loadCSV("pokemon_species_flavor_text.csv"),
    pTypes: loadCSV("pokemon_types.csv"), pAbilities: loadCSV("pokemon_abilities.csv"),
    abilities: loadCSV("abilities.csv"), abilityNames: loadCSV("ability_names.csv"),
    pStats: loadCSV("pokemon_stats.csv"), pEvolution: loadCSV("pokemon_evolution.csv"),
    pMoves: loadCSV("pokemon_moves.csv"), moves: loadCSV("moves.csv"), moveNames: loadCSV("move_names.csv"),
    versionGroups: loadCSV("version_groups.csv"), types: loadCSV("types.csv"),
    encounters: loadCSV("encounters.csv"), locationAreas: loadCSV("location_areas.csv"),
    locations: loadCSV("locations.csv"), locationNames: loadCSV("location_names.csv"),
    regions: loadCSV("regions.csv"), pokedexes: loadCSV("pokedexes.csv"),
    pokedexVersionGroups: loadCSV("pokedex_version_groups.csv"), versions: loadCSV("versions.csv"),
  };

  const typeById = byId(csvs.types, "id");
  const vgById = byId(csvs.versionGroups, "id");
  const locAreaById = byId(csvs.locationAreas, "id");
  const locById = byId(csvs.locations, "id");
  const typeName = id => titleCase(typeById.get(id).identifier);

  const abilityNameById = new Map();
  for (const r of csvs.abilityNames) if (r.local_language_id === "9") abilityNameById.set(r.ability_id, r.name);
  const moveNameById = new Map();
  for (const r of csvs.moveNames) if (r.local_language_id === "9") moveNameById.set(r.move_id, r.name);
  const locNameById = new Map();
  for (const r of csvs.locationNames) if (r.local_language_id === "9" && !locNameById.has(r.location_id)) locNameById.set(r.location_id, r.name);

  // region identifier -> set of version ids (same pokedex->vg->version join
  // populate_region.js uses), for locations.js encounter filtering.
  const versionIdsByRegion = {};
  for (const region of ["unova", "kalos", "alola"]) {
    const regionRow = csvs.regions.find(r => r.identifier === region);
    const pokedexIds = new Set(csvs.pokedexes.filter(p => p.region_id === regionRow.id && p.is_main_series === "1").map(p => p.id));
    const vgIds = new Set(csvs.pokedexVersionGroups.filter(r => pokedexIds.has(r.pokedex_id)).map(r => r.version_group_id));
    versionIdsByRegion[region] = new Set(csvs.versions.filter(v => vgIds.has(v.version_group_id)).map(v => v.id));
  }

  const pokemonById = byId(csvs.pokemon, "id");
  const speciesById = byId(csvs.species, "id");
  const namesBySpecies = groupBy(csvs.speciesNames, "pokemon_species_id");
  const flavorBySpecies = groupBy(csvs.flavorText, "species_id");
  const typesByPokemon = groupBy(csvs.pTypes, "pokemon_id");
  const abilitiesByPokemon = groupBy(csvs.pAbilities, "pokemon_id");
  const statsByPokemon = groupBy(csvs.pStats, "pokemon_id");
  const evoByTarget = groupBy(csvs.pEvolution, "evolved_species_id");
  const movesByPokemon = groupBy(csvs.pMoves, "pokemon_id");
  const encByPokemon = groupBy(csvs.encounters, "pokemon_id");

  const inScope = id => id <= EXISTING_MAX || TARGETS[id] !== undefined;

  const results = { pokemon: {}, stats: {}, evolutions: {}, movesets: {}, names: {}, locations: {}, flagged: [], newParentLinks: {} };

  for (const id of IDS) {
    const sid = String(id);
    const pk = pokemonById.get(sid), sp = speciesById.get(sid);
    if (!pk || !sp) { results.flagged.push(`id ${id}: missing pokemon/species row`); continue; }

    const typeRows = (typesByPokemon.get(sid) || []).sort((a, b) => a.slot - b.slot);
    const abilityRows = (abilitiesByPokemon.get(sid) || [])
      .sort((a, b) => (a.is_hidden === b.is_hidden ? a.slot - b.slot : (a.is_hidden === "1" ? 1 : -1)));
    const namesRows = namesBySpecies.get(sid) || [];
    const enName = namesRows.find(r => r.local_language_id === "9");
    const hiddenRow = abilityRows.find(r => r.is_hidden === "1");
    const flavRows = (flavorBySpecies.get(sid) || []).filter(r => r.language_id === "9");

    results.pokemon[id] = {
      name: enName ? enName.name : null,
      region: TARGETS[id],
      types: typeRows.map(r => typeName(r.type_id)),
      category: enName ? enName.genus : null,
      height: Number(pk.height) / 10,
      weight: Number(pk.weight) / 10,
      abilities: abilityRows.map(r => abilityNameById.get(r.ability_id)),
      hiddenAbility: hiddenRow ? abilityNameById.get(hiddenRow.ability_id) : null,
      _flavorHint: flavRows.length ? flavRows[flavRows.length - 1].flavor_text.replace(/\s+/g, " ").trim() : null,
    };

    const statRows = statsByPokemon.get(sid) || [];
    const statVal = statId => { const r = statRows.find(x => x.stat_id === statId); return r ? Number(r.base_stat) : null; };
    const growth = GROWTH[sp.growth_rate_id] || { curve: "?", points: null };
    results.stats[id] = {
      hp: statVal("1"), attack: statVal("2"), defense: statVal("3"),
      spAttack: statVal("4"), spDefense: statVal("5"), speed: statVal("6"),
      captureRate: Number(sp.capture_rate), expGrowth: { points: growth.points, curve: growth.curve },
    };

    // evolutions.js — forward edges out of this species
    const evolvesTo = [];
    for (const [targetId, rows] of evoByTarget) {
      const targetSpecies = speciesById.get(targetId);
      if (!targetSpecies || targetSpecies.evolves_from_species_id !== sid) continue;
      const targetNum = Number(targetId);
      if (!inScope(targetNum)) { results.flagged.push(`evolution ${id}->${targetId}: target outside populated scope, omitted`); continue; }
      const row = rows[0];
      const method = TRIGGER_METHOD[row.evolution_trigger_id] || "other";
      const level = method === "level" && row.minimum_level ? Number(row.minimum_level) : undefined;
      evolvesTo.push(level !== undefined ? { id: targetNum, method, level } : { id: targetNum, method });
    }
    evolvesTo.sort((a, b) => a.id - b.id);
    results.evolutions[id] = evolvesTo;

    // movesets.js — most recent version group that actually has data the app
    // can show. Only level-up (1) / egg (2) / machine (4) rows count: the
    // newest version groups in the CSV (champions, legends-za, mega-dimension)
    // carry ONLY method 12 ("train") rows, so picking purely by version-group
    // order silently yields an entirely empty moveset (see handoff report —
    // this is what left 92 of the shipped 1-493 entries with empty movesets).
    const USABLE_METHODS = new Set(["1", "2", "4"]);
    const mvRows = movesByPokemon.get(sid) || [];
    let bestVg = null, bestOrder = -1;
    for (const r of mvRows) {
      if (!USABLE_METHODS.has(r.pokemon_move_method_id)) continue;
      const vg = vgById.get(r.version_group_id);
      if (!vg) continue;
      const order = Number(vg.order);
      if (order > bestOrder) { bestOrder = order; bestVg = r.version_group_id; }
    }
    const chosen = bestVg ? mvRows.filter(r => r.version_group_id === bestVg) : [];
    const levelUp = [], tm = [], egg = [];
    const mvName = mid => moveNameById.get(mid) || `#${mid}`;
    for (const r of chosen) {
      if (r.pokemon_move_method_id === "1") levelUp.push({ level: Number(r.level), move: mvName(r.move_id) });
      else if (r.pokemon_move_method_id === "4") tm.push(mvName(r.move_id));
      else if (r.pokemon_move_method_id === "2") egg.push(mvName(r.move_id));
    }
    levelUp.sort((a, b) => a.level - b.level);
    const dedupe = arr => [...new Set(arr)];
    results.movesets[id] = { levelUp, tm: dedupe(tm), egg: dedupe(egg), max: [], _sourceGeneration: bestVg ? vgById.get(bestVg).identifier : null };
    if (bestVg && vgById.get(bestVg).generation_id !== "9") {
      results.flagged.push(`id ${id} (${pk.identifier}): no Gen 9 moveset data, used "${vgById.get(bestVg).identifier}" instead`);
    }

    const nameOf = langId => { const r = namesRows.find(x => x.local_language_id === langId); return r ? r.name : null; };
    results.names[id] = { ja: nameOf("1"), jaRomaji: nameOf("2"), fr: nameOf("5"), de: nameOf("6"), ko: nameOf("3") };

    // locations.js — this species' own mainline region's games. Legends:
    // Arceus (version 39) has zero rows in encounters.csv, so the 7
    // hisuiOnly species get an empty "hisui" area list (same empty-list
    // shape prior regions already produce for unencounterable species).
    const region = TARGETS[id];
    const versionIds = region ? versionIdsByRegion[region] : new Set();
    const encRows = (encByPokemon.get(sid) || []).filter(r => versionIds.has(r.version_id));
    const areaNames = new Set();
    for (const r of encRows) {
      const area = locAreaById.get(r.location_area_id);
      if (!area) continue;
      const loc = locById.get(area.location_id);
      if (!loc) continue;
      areaNames.add(locNameById.get(loc.id) || titleCase(loc.identifier));
    }
    results.locations[id] = { key: region || "hisui", areas: [...areaNames].sort() };
  }

  // Backward links: already-populated species (id <= 493) that evolve INTO
  // one of this batch — those edges live in the PARENT's evolutions.js entry,
  // which this pass has to patch in place (same retroactive-restore pattern
  // as 0.1.22's Togetic->Togekiss).
  for (const id of IDS) {
    const parent = speciesById.get(String(id)).evolves_from_species_id;
    if (!parent || Number(parent) > EXISTING_MAX) continue;
    const row = (evoByTarget.get(String(id)) || [])[0];
    if (!row) { results.flagged.push(`no pokemon_evolution row for ${id} (parent ${parent})`); continue; }
    const method = TRIGGER_METHOD[row.evolution_trigger_id] || "other";
    const level = method === "level" && row.minimum_level ? Number(row.minimum_level) : undefined;
    if (!results.newParentLinks[parent]) results.newParentLinks[parent] = [];
    results.newParentLinks[parent].push(level !== undefined ? { id, method, level } : { id, method });
  }

  // new moves/abilities not yet in the project's shared tables
  const projAbilities = fs.readFileSync(path.join(DATA_DIR, "abilities.js"), "utf8");
  const projMoves = fs.readFileSync(path.join(DATA_DIR, "moves.js"), "utf8");
  const hasKey = (src, key) => new RegExp(`"${key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}":\\s*\\{`).test(src);

  const neededAbilities = new Set(), neededMoves = new Set();
  for (const id in results.pokemon) for (const a of results.pokemon[id].abilities) neededAbilities.add(a);
  for (const id in results.movesets) {
    const ms = results.movesets[id];
    for (const x of ms.levelUp) neededMoves.add(x.move);
    for (const x of ms.tm) neededMoves.add(x);
    for (const x of ms.egg) neededMoves.add(x);
  }
  const identifierToAbilityRow = new Map(csvs.abilities.map(a => [abilityNameById.get(a.id), a]));
  const identifierToMoveRow = new Map();
  for (const m of csvs.moves) { const nm = moveNameById.get(m.id); if (nm) identifierToMoveRow.set(nm, m); }
  const DAMAGE_CLASS = { "1": "Status", "2": "Physical", "3": "Special" };

  results.missingAbilities = [...neededAbilities].filter(a => !hasKey(projAbilities, a))
    .map(a => ({ name: a, csvId: identifierToAbilityRow.get(a) ? identifierToAbilityRow.get(a).id : null }));
  results.missingMoves = [...neededMoves].filter(m => !hasKey(projMoves, m)).map(name => {
    const row = identifierToMoveRow.get(name);
    if (!row) return { name, found: false };
    return {
      name, found: true, type: typeName(row.type_id),
      category: DAMAGE_CLASS[row.damage_class_id] || "Status",
      power: row.power ? Number(row.power) : null,
      accuracy: row.accuracy ? Number(row.accuracy) : null,
      pp: Number(row.pp),
    };
  });

  fs.mkdirSync(TEMP_DIR, { recursive: true });
  fs.writeFileSync(path.join(TEMP_DIR, "hisui_species_results.json"), JSON.stringify(results, null, 1));
  const manifest = {
    pokemon: IDS.map(id => ({ id, name: results.pokemon[id].name, flavorHint: results.pokemon[id]._flavorHint })),
    moves: results.missingMoves.map(m => m.name),
    abilities: results.missingAbilities.map(a => a.name),
  };
  fs.writeFileSync(path.join(TEMP_DIR, "hisui_species_needs_descriptions.json"), JSON.stringify(manifest, null, 1));

  console.log(`species: ${IDS.length}, new moves: ${results.missingMoves.length}, new abilities: ${results.missingAbilities.length}`);
  console.log("moveset sources:", IDS.map(id => `${id}:${results.movesets[id]._sourceGeneration}`).join(" "));
  console.log("new parent links:", JSON.stringify(results.newParentLinks));
  console.log("flagged:\n  " + results.flagged.join("\n  "));
}

// =========================================================================
function assemble(descriptionsPath) {
  const r = JSON.parse(fs.readFileSync(path.join(TEMP_DIR, "hisui_species_results.json"), "utf8"));
  const d = JSON.parse(fs.readFileSync(descriptionsPath, "utf8"));
  const esc = s => String(s).replace(/\\/g, "\\\\").replace(/'/g, "\\'");
  const escD = s => String(s).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  const read = f => fs.readFileSync(path.join(DATA_DIR, f), "utf8");
  const write = (f, s) => fs.writeFileSync(path.join(DATA_DIR, f), s);

  // ---- pokemon.js: pure append (every new id > 493, so ascending order holds)
  const pokemonLines = IDS.map(id => {
    const pk = r.pokemon[id];
    const desc = d.pokemon[id];
    if (!desc) throw new Error("no description for id " + id);
    const types = pk.types.map(t => `'${esc(t)}'`).join(", ");
    const abilities = pk.abilities.map(a => `'${esc(a)}'`).join(", ");
    const regionField = pk.region ? `region: '${pk.region}', ` : "hisuiOnly: true, ";
    const hidden = pk.hiddenAbility ? `, hiddenAbility: '${esc(pk.hiddenAbility)}'` : "";
    return `  { id: ${id}, name: '${esc(pk.name)}', ${regionField}types: [${types}], category: '${esc(pk.category)}', height: ${pk.height}, weight: ${pk.weight}, abilities: [${abilities}]${hidden}, description: '${esc(desc)}' },`;
  });
  const pSrc = read("pokemon.js");
  const closeIdx = pSrc.lastIndexOf("];");
  write("pokemon.js", pSrc.slice(0, closeIdx) + pokemonLines.join("\n") + "\n" + pSrc.slice(closeIdx));

  // ---- stats.js
  const statsLines = IDS.map(id => {
    const s = r.stats[id];
    return `  ${id}: { hp: ${s.hp}, attack: ${s.attack}, defense: ${s.defense}, spAttack: ${s.spAttack}, spDefense: ${s.spDefense}, speed: ${s.speed}, captureRate: ${s.captureRate}, expGrowth: { points: ${s.expGrowth.points}, curve: "${s.expGrowth.curve}" } }`;
  });
  write("stats.js", read("stats.js").replace(/\n\};\s*$/, ",\n" + statsLines.join(",\n") + "\n};\n"));

  // ---- evolutions.js: new entries appended, plus in-place patches to the
  // already-populated parents that evolve into this batch.
  const edgeStr = s => s.level !== undefined
    ? `{ id: ${s.id}, method: "${s.method}", level: ${s.level} }`
    : `{ id: ${s.id}, method: "${s.method}" }`;
  const evoLines = IDS.map(id => `  ${id}: { evolvesTo: [${r.evolutions[id].map(edgeStr).join(", ")}] }`);
  let evoSrc = read("evolutions.js");
  for (const parent of Object.keys(r.newParentLinks).sort((a, b) => a - b)) {
    const re = new RegExp(`^(  ${parent}: \\{ evolvesTo: \\[)([\\s\\S]*?)(\\] \\},?)$`, "m");
    const m = evoSrc.match(re);
    if (!m) throw new Error("no evolutions.js line for parent " + parent);
    const added = r.newParentLinks[parent].map(edgeStr).join(", ");
    evoSrc = evoSrc.replace(re, m[1] + (m[2].trim() ? m[2] + ", " : "") + added + m[3]);
  }
  write("evolutions.js", evoSrc.replace(/\n\};\s*$/, ",\n" + evoLines.join(",\n") + "\n};\n"));

  // ---- movesets.js
  const msLines = IDS.map(id => {
    const ms = r.movesets[id];
    const lu = ms.levelUp.map(x => `{level:${x.level},move:"${escD(x.move)}"}`).join(",");
    return `  ${id}: {\n    levelUp: [${lu}],\n    tm: [${ms.tm.map(x => `"${escD(x)}"`).join(",")}],\n    egg: [${ms.egg.map(x => `"${escD(x)}"`).join(",")}],\n    max: []\n  }`;
  });
  write("movesets.js", read("movesets.js").replace(/\n\};\s*$/, ",\n" + msLines.join(",\n") + "\n};\n"));

  // ---- names.js
  const namesLines = IDS.map(id => {
    const n = r.names[id];
    return `  ${id}: { ja: "${escD(n.ja)}", jaRomaji: "${escD(n.jaRomaji)}", fr: "${escD(n.fr)}", de: "${escD(n.de)}", ko: "${escD(n.ko)}" }`;
  });
  write("names.js", read("names.js").replace(/\n\};\s*$/, ",\n" + namesLines.join(",\n") + "\n};\n"));

  // ---- locations.js
  const locLines = IDS.map(id => {
    const l = r.locations[id];
    return `  ${id}: { ${l.key}: [${l.areas.map(a => `"${escD(a)}"`).join(", ")}] }`;
  });
  write("locations.js", read("locations.js").replace(/\n\};\s*$/, ",\n" + locLines.join(",\n") + "\n};\n"));

  // ---- moves.js / abilities.js additions
  if (r.missingMoves.length) {
    const lines = r.missingMoves.map(mv => `  "${escD(mv.name)}": { type: "${escD(mv.type)}", category: "${escD(mv.category)}", power: ${mv.power === null ? "null" : mv.power}, accuracy: ${mv.accuracy === null ? "null" : mv.accuracy}, pp: ${mv.pp}, description: "${escD(d.moves[mv.name])}" },`);
    write("moves.js", read("moves.js").replace(/\n\};\s*$/, `\n  // Moves added during the Hisui net-new-species pass (TODO.md #6).\n${lines.join("\n")}\n};\n`));
  }
  if (r.missingAbilities.length) {
    const lines = r.missingAbilities.map(ab => `  "${escD(ab.name)}": { description: "${escD(d.abilities[ab.name])}" },`);
    write("abilities.js", read("abilities.js").replace(/\n\};\s*$/, `\n  // Abilities added during the Hisui net-new-species pass (TODO.md #6).\n${lines.join("\n")}\n};\n`));
  }

  // ---- hisui.js: the remaining 29 local dex numbers, from the full
  // 242-row temp/hisui_dex_numbers.csv (hisuiNumber,nationalId).
  const dexRows = fs.readFileSync(path.join(TEMP_DIR, "hisui_dex_numbers.csv"), "utf8")
    .split(/\r?\n/).filter(Boolean).map(l => l.split(",").map(Number));
  const hisuiLines = IDS.map(id => {
    const row = dexRows.find(([, nat]) => nat === id);
    if (!row) throw new Error("no hisui dex number for id " + id);
    return `  ${id}: ${row[0]},`;
  });
  // (unlike the other tables, hisui.js's last entry carries no trailing comma)
  write("hisui.js", read("hisui.js").replace(/\n\};\s*$/, ",\n" + hisuiLines.join("\n").replace(/,$/, "") + "\n};\n"));

  console.log("Assembly complete:", IDS.length, "species,", r.missingMoves.length, "new moves,", r.missingAbilities.length, "new abilities.");
}

const [, , flag, extra] = process.argv;
if (flag === "--generate") generate();
else if (flag === "--assemble") assemble(extra || path.join(TEMP_DIR, "hisui_species_descriptions.json"));
else { console.error("Usage: node tools/populate_hisui_species.js --generate|--assemble [descriptionsPath]"); process.exit(1); }
