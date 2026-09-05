// Referential-integrity check for src/data/*.js, covering the whole populated
// range (MAX_ID auto-derived from POKEMON_DATA, so this never needs manual
// editing after a region lands). Re-run after any data change —
// populate_region.js runs it automatically after every write.
// Checks: every id present in all 6 per-Pokémon tables; no duplicate MOVES/
// ABILITIES keys; every move/ability name referenced by a Pokémon resolves to
// a real MOVES/ABILITIES entry; hiddenAbility is one of the listed abilities;
// every evolvesTo[].id either resolves to a real POKEMON_DATA entry within
// range, or is legitimately outside it (Gen 4+ evolution target — allowed,
// just noted); every ALT_FORMS entry keys a real species, its ability names
// resolve, and its sprite art exists on disk (normal + shiny).
"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const DATA_DIR = path.join(__dirname, "..", "src", "data");
const MIN_ID = 1;

function loadGlobal(file, varName) {
  const src = fs.readFileSync(path.join(DATA_DIR, file), "utf8");
  const sandbox = {};
  vm.createContext(sandbox);
  vm.runInContext(src, sandbox);
  return sandbox[varName];
}

const POKEMON_DATA = loadGlobal("pokemon.js", "POKEMON_DATA");
const MAX_ID = Math.max(...POKEMON_DATA.map(p => p.id));
const STATS = loadGlobal("stats.js", "STATS");
const EVOLUTIONS = loadGlobal("evolutions.js", "EVOLUTIONS");
const MOVESETS = loadGlobal("movesets.js", "MOVESETS");
const NAMES = loadGlobal("names.js", "NAMES");
const LOCATIONS = loadGlobal("locations.js", "LOCATIONS");
const MOVES = loadGlobal("moves.js", "MOVES");
const ABILITIES = loadGlobal("abilities.js", "ABILITIES");
const ALT_FORMS = loadGlobal("altforms.js", "ALT_FORMS");
const SPRITE_DIR = path.join(DATA_DIR, "sprites", "pokemon");

let failures = 0;
const fail = msg => { failures++; console.log("FAIL:", msg); };

// ---- duplicate-key check (source-text based, since JS objects can't hold dupes at runtime) ----
function findDuplicateKeys(file, re) {
  const src = fs.readFileSync(path.join(DATA_DIR, file), "utf8");
  const seen = new Map();
  let m;
  while ((m = re.exec(src))) {
    const key = m[1];
    seen.set(key, (seen.get(key) || 0) + 1);
  }
  for (const [key, count] of seen) if (count > 1) fail(`${file}: duplicate key "${key}" (${count}x)`);
}
findDuplicateKeys("moves.js", /^\s*"((?:[^"\\]|\\.)*)":\s*\{/gm);
findDuplicateKeys("abilities.js", /^\s*"((?:[^"\\]|\\.)*)":\s*\{/gm);

// ---- every id present in all 6 per-Pokémon tables ----
// Driven by POKEMON_DATA's actual ids, not a contiguous MIN_ID..MAX_ID walk:
// since 0.1.28 the roster is deliberately non-contiguous (Hisui's 29 net-new
// species sit at 501-905 with everything else in between unpopulated).
const pokemonById = new Map(POKEMON_DATA.map(p => [p.id, p]));
const IDS = POKEMON_DATA.map(p => p.id).sort((a, b) => a - b);
const gaps = IDS.filter((id, i) => i > 0 && id !== IDS[i - 1] + 1).length;
if (gaps) console.log(`NOTE: POKEMON_DATA ids are non-contiguous (${gaps} gap(s)) — expected since 0.1.28.`);
for (const id of IDS) {
  if (!STATS[id]) fail(`stats.js: missing id ${id}`);
  if (!EVOLUTIONS[id]) fail(`evolutions.js: missing id ${id}`);
  if (!MOVESETS[id]) fail(`movesets.js: missing id ${id}`);
  if (!NAMES[id]) fail(`names.js: missing id ${id}`);
  if (!LOCATIONS[id]) fail(`locations.js: missing id ${id}`);
}

// ---- every move/ability name referenced resolves to a real table entry ----
for (const p of POKEMON_DATA) {
  for (const a of p.abilities || []) if (!ABILITIES[a]) fail(`pokemon.js id ${p.id}: unknown ability "${a}"`);
  if (p.hiddenAbility && (p.abilities || []).indexOf(p.hiddenAbility) === -1) fail(`pokemon.js id ${p.id}: hiddenAbility "${p.hiddenAbility}" not in abilities`);
}

// ---- ALT_FORMS: species exists, abilities resolve, sprites on disk ----
let altFormeCount = 0;
for (const key of Object.keys(ALT_FORMS)) {
  const id = Number(key), data = ALT_FORMS[key];
  if (!pokemonById.has(id)) fail(`altforms.js: key ${key} has no POKEMON_DATA entry`);
  const keys = new Set();
  for (const f of data.formes || []) {
    altFormeCount++;
    if (keys.has(f.key)) fail(`altforms.js id ${id}: duplicate forme key "${f.key}"`); keys.add(f.key);
    if (f.ability && !ABILITIES[f.ability]) fail(`altforms.js id ${id}/${f.key}: unknown ability "${f.ability}"`);
    for (const a of f.abilities || []) if (!ABILITIES[a]) fail(`altforms.js id ${id}/${f.key}: unknown ability "${a}"`);
    if (f.ability && f.abilities) fail(`altforms.js id ${id}/${f.key}: sets both ability and abilities`);
    const rels = data.recolorOnly ? [`${f.sprite}.png`] : [`alt formes/${f.sprite}.png`, `shiny/alt formes/${f.sprite}.png`];
    for (const rel of rels) if (!fs.existsSync(path.join(SPRITE_DIR, rel))) fail(`altforms.js id ${id}/${f.key}: sprite missing ${rel}`);
  }
}
for (const id of IDS) {
  const ms = MOVESETS[id];
  if (!ms) continue;
  for (const x of ms.levelUp || []) if (!MOVES[x.move]) fail(`movesets.js id ${id}: unknown move "${x.move}" (levelUp)`);
  for (const x of ms.tm || []) if (!MOVES[x]) fail(`movesets.js id ${id}: unknown move "${x}" (tm)`);
  for (const x of ms.egg || []) if (!MOVES[x]) fail(`movesets.js id ${id}: unknown move "${x}" (egg)`);
  for (const x of ms.tutor || []) if (!MOVES[x]) fail(`movesets.js id ${id}: unknown move "${x}" (tutor)`);
  for (const x of ms.max || []) if (!MOVES[x]) fail(`movesets.js id ${id}: unknown move "${x}" (max)`);
}

// ---- every evolvesTo[].id resolves to a real POKEMON_DATA entry, or is
// legitimately outside 1-386 (Gen 4+ target, expected to be omitted-in-full
// per the omission rule; here we just note it since evolutions.js only ever
// stores targets that passed the in-range check at generation time) ----
let outOfRangeNoted = 0;
for (const id of IDS) {
  const evo = EVOLUTIONS[id];
  if (!evo) continue;
  for (const step of evo.evolvesTo || []) {
    if (!pokemonById.has(step.id)) {
      if (step.id < 1 || step.id > 1025) fail(`evolutions.js id ${id}: evolvesTo target ${step.id} looks invalid`);
      else outOfRangeNoted++; // shouldn't normally happen post-omission, but not fatal
    }
  }
}

console.log(`Checked ids ${MIN_ID}-${MAX_ID}: ${POKEMON_DATA.length} POKEMON_DATA entries, ${Object.keys(MOVES).length} MOVES, ${Object.keys(ABILITIES).length} ABILITIES, ${Object.keys(ALT_FORMS).length} ALT_FORMS species / ${altFormeCount} formes.`);
console.log(`Evolution targets outside range (unexpected if >0): ${outOfRangeNoted}`);
console.log(failures === 0 ? "PASS: no integrity failures." : `FAIL: ${failures} integrity failure(s) found.`);
process.exit(failures === 0 ? 0 : 1);
