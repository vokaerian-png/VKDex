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
// resolve, and its sprite art exists on disk (normal + shiny); every
// movesets_hisui.js key is a real species with no duplicate ids, carrying only
// the levelUp/tutor categories PLA has and never an empty one.
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
const MOVESETS_HISUI = loadGlobal("movesets_hisui.js", "MOVESETS_HISUI");
const NAMES = loadGlobal("names.js", "NAMES");
const LOCATIONS = loadGlobal("locations.js", "LOCATIONS");
const MOVES = loadGlobal("moves.js", "MOVES");
const ABILITIES = loadGlobal("abilities.js", "ABILITIES");
const ALT_FORMS = loadGlobal("altforms.js", "ALT_FORMS");
const ITEMS_DATA = loadGlobal("items.js", "ITEMS_DATA");
const SPRITE_DIR = path.join(DATA_DIR, "sprites", "pokemon");
const ITEM_SPRITE_DIR = path.join(DATA_DIR, "sprites", "items");

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

// ---- items (0.2.7): every heldItems / evolution `item` slug resolves in
// ITEMS_DATA (tm-normal is an app-internal icon, exempt); an ITEMS_DATA
// entry with no bundled sprite is noted, not failed — the app hides the
// <img> and black-augurite/peat-block are known to have no art ----
const itemRefs = new Set();
for (const p of POKEMON_DATA) for (const h of p.heldItems || []) itemRefs.add(h.item);
// ---- per-game shapes (0.2.8): heldItems[].rates and locations enc lines
// each carry a `games` string + a sane rate. Catches a hand edit that drops
// back to the 0.2.7 single-`rate` shape, which the UI would render blank ----
for (const p of POKEMON_DATA) for (const h of p.heldItems || []) {
  if (!Array.isArray(h.rates) || !h.rates.length) fail(`pokemon.js id ${p.id}: heldItems "${h.item}" has no rates[] (pre-0.2.8 shape?)`);
  else for (const g of h.rates) if (!g.games || !(g.rate > 0 && g.rate <= 100)) fail(`pokemon.js id ${p.id}: heldItems "${h.item}" bad rate group ${JSON.stringify(g)}`);
}
for (const id of IDS) for (const region of Object.keys(LOCATIONS[id] || {})) {
  for (const a of LOCATIONS[id][region] || []) {
    if (typeof a === "string") continue; // pre-0.2.7 bare-string area, tolerated
    for (const e of a.enc || []) {
      if (!e.games) fail(`locations.js id ${id}/${region}/"${a.area}": enc line has no games (pre-0.2.8 shape?)`);
      if (!(e.rate > 0 && e.rate <= 100) || !(e.min >= 1) || !(e.max >= e.min)) fail(`locations.js id ${id}/${region}/"${a.area}": bad enc line ${JSON.stringify(e)}`);
    }
  }
}
for (const id of IDS) for (const step of (EVOLUTIONS[id] || {}).evolvesTo || []) if (step.item && step.item !== "tm-normal") itemRefs.add(step.item);
for (const slug of itemRefs) if (!ITEMS_DATA[slug]) fail(`items.js: referenced item "${slug}" has no ITEMS_DATA entry`);
const noItemArt = Object.keys(ITEMS_DATA).filter(slug => !fs.existsSync(path.join(ITEM_SPRITE_DIR, slug + ".png")));
if (noItemArt.length) console.log(`NOTE: ${noItemArt.length} ITEMS_DATA entries have no sprite under data/sprites/items/: ${noItemArt.join(", ")}`);

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
// movesets.js has all five categories; movesets_hisui.js (0.2.18) only ever
// has levelUp/tutor, and only for the Hisui-roster ids with real PLA data —
// same move-resolution rule, driven off whichever keys are actually present.
function checkMoveset(file, id, ms) {
  for (const key of Object.keys(ms)) {
    for (const x of ms[key] || []) {
      const name = key === "levelUp" ? x.move : x;
      if (!MOVES[name]) fail(`${file} id ${id}: unknown move "${name}" (${key})`);
    }
  }
}
for (const id of IDS) if (MOVESETS[id]) checkMoveset("movesets.js", id, MOVESETS[id]);
findDuplicateKeys("movesets_hisui.js", /^\s{2}(\d+):\s*\{/gm);
for (const key of Object.keys(MOVESETS_HISUI)) {
  const id = Number(key);
  if (!pokemonById.has(id)) fail(`movesets_hisui.js: key ${key} has no POKEMON_DATA entry`);
  const ms = MOVESETS_HISUI[key];
  const badKey = Object.keys(ms).find(k => k !== "levelUp" && k !== "tutor");
  if (badKey) fail(`movesets_hisui.js id ${id}: unexpected category "${badKey}" (PLA has level-up and tutor only)`);
  if (!Object.keys(ms).length) fail(`movesets_hisui.js id ${id}: empty entry`);
  for (const k of Object.keys(ms)) if (!(ms[k] || []).length) fail(`movesets_hisui.js id ${id}: empty "${k}" — omit the key instead`);
  checkMoveset("movesets_hisui.js", id, ms);
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

console.log(`Checked ids ${MIN_ID}-${MAX_ID}: ${POKEMON_DATA.length} POKEMON_DATA entries, ${Object.keys(MOVES).length} MOVES, ${Object.keys(ABILITIES).length} ABILITIES, ${Object.keys(ITEMS_DATA).length} ITEMS_DATA, ${Object.keys(ALT_FORMS).length} ALT_FORMS species / ${altFormeCount} formes, ${Object.keys(MOVESETS_HISUI).length} MOVESETS_HISUI entries.`);
console.log(`Evolution targets outside range (unexpected if >0): ${outOfRangeNoted}`);
console.log(failures === 0 ? "PASS: no integrity failures." : `FAIL: ${failures} integrity failure(s) found.`);
process.exit(failures === 0 ? 0 : 1);
