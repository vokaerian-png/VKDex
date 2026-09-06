# VKDex — TODO

Ideas that have been proposed or discussed but **not committed to**. Related
ideas are grouped under one entry rather than listed separately. Once something
here becomes a definitive commitment, move it to `PLAN.md`. Resolved entries
keep their number (they're cross-referenced from `CLAUDE.md`/`PLAN.md`/
`HISTORY.md`) but shrink to the facts a future pass still needs.

---

## 1. Revisit Tauri instead of Electron — RESOLVED (0.2.16 migration; 0.2.20-0.2.22 Android release chain)

Re-evaluated and user-approved 2026-09-05; the evaluation, alternatives
checked, and the divergent-desktop-UI mechanism live in `PLAN.md`'s Tauri
migration entry. Shell swap + native Windows resize lock **user-confirmed
working** on real hardware; Electron cleanup shipped 2026-09-06. macOS/
Linux/iOS aren't being pursued (user decision 2026-09-06, `PLAN.md`).

Android release chain, all in `CLAUDE.md` §2a: real RSA-2048 release
keystore + release buildType (0.2.20); APK size fixed via Cargo's release
profile + `--split-per-abi`, 68-74 MB per ABI, user-verified (0.2.21/
0.2.22); **arm64-v8a is the only APK published** (user decision, 0.2.22 —
covers virtually every real device since 2018).

---

## 2. Region data population — RESOLVED for ids 1-1025 (Alola/Galar/Paldea landed 2026-09-06)

`POKEMON_DATA` is **1025/1025 — the full National Dex** (Kanto→Sinnoh
0.1.15-0.1.22, Unova 0.2.7, Kalos 0.2.22, Alola/Galar/Paldea 0.3.0;
`--audit` and `verify_region_data.js` both PASS). The last pass ran as a
3-way parallel `coder` dispatch — its result and the corrected safety
premise are `CLAUDE.md` §5b, not repeated here. Facts that pass left:

- **13 evolution edges** from earlier-populated species into a sibling
  region's then-unpopulated range were restored afterwards with a
  `--ids ... --refresh --tables evolutions` follow-up; two of them needed
  evolution items never in any manifest (`syrupy-apple`, `metal-alloy` —
  new to the CSVs' evolution rows, not any held-items list), added by hand
  (`ITEMS_DATA` 142→144). Expect the same shape whenever a pass lands
  before its neighbor's.
- **All Paldea `locations` entries are empty** (120 species) — confirmed
  upstream: the CSV clone's `encounters.csv` has zero rows for scarlet/
  violet or their DLC. **Labeled, not hidden (0.3.3)**: "Found In" shows a
  distinct "needs source" note via `NEEDS_SOURCE_REGIONS` in `app.js`
  (`SCOPE.md` §4). **Broader "needs source" sweep intentionally deferred**
  (user scoping call, 2026-09-06): the label covers only this one verified
  gap, not a heuristic over every blank field (a genuinely absent second
  type/hidden ability/held item is correctly empty). Add further confirmed
  upstream gaps to that list by hand, one at a time.
- **3 item sprites missing** (on top of pre-existing gaps):
  `auspicious-armor`, `malicious-armor`, `unremarkable-teacup` — the
  `onerror` fallback covers it (`SCOPE.md` §2), no functional break.
- Z-A/Mega Dimension Megas surfaced by the pass: folded into #5.
  `hasFemaleSprite` for 876/916: set, that sub-item is closed.

Handoffs: `temp/handoff/2026-09-06-093000-shared-tables-prepass.md`,
`-101230-alola-region-pass.md`, `-081320-galar-region-pass.md`,
`-081609-paldea-region-pass.md`, `-102332-evolution-edges-fix.md`,
`-082535-missing-evolution-items-fix.md`.

**Running a pass** (`tools/populate_region.js`, unified 2026-09-05 —
`SCOPE.md` §2 for the full mode list): target is a region name or `--ids
668,678` for individual species. `--dry-run` → `--generate` (CSV extract
+ a descriptions-needed manifest, `temp/<region|species>_needs_
descriptions.json`, with an `items` list) → hand-author `descriptions.json`
(`pokemon`/`moves`/`abilities`/`items` keys) → `--assemble
[descriptions.json]` (upserts every table in id order, auto-runs
`verify_region_data.js`). For ids already in `pokemon.js`, `--refresh
[--tables movesets,...]` does generate+assemble in one step, keeping
hand-authored descriptions. Needs the PokeAPI clone at
`temp/PokeAPI-master`. `--generate` output goes to `temp/` root (pre-dates
the `temp/<task-slug>/` rule) — `mv` it into the task folder afterwards.
A pass also emits Mega formes for any species not yet in `ALT_FORMS`
(`--tables altforms`). **After every `--tables evolutions` write, re-check
the hand-authored `note`/`statCompare` fields** on 211/234/236/265/550/704
— the upsert drops them (Basculin's dropped 0.2.7, Goomy's 0.2.22, both
restored by hand). `hasFemaleSprite` isn't CSV-sourced (`SCOPE.md` §2) —
a pass adding a newly-sprited species must set it by hand the first time.

---

## 3. Sprite bundle — RESOLVED (local files 0.1.20; `alt formes/` sorted 0.1.23/0.1.24)

Sprites load from `src/data/sprites/` (`SCOPE.md` §2). Kept here: the
`alt formes/` sort method `SCOPE.md` §2 points at, and one open idea.

**Sort method** (script-driven off the PokeAPI CSVs; a hand-sorted first
attempt was audited, found misspelled and shiny/normal-mismatched, and
reverted — don't sort by eye):

- For each raw PokeAPI id > 1025, take `pokemon.csv`'s `identifier` slug
  and strip the species' own slug from `pokemon_species.csv` (not
  `pokemon.csv`'s default-form slug — Deoxys's default row is
  `deoxys-normal`, which would leave the species name duplicated). What's
  left is the form's token list.
- **Folder** = first of `gmax`/`mega`/`totem`/`alola`/`galar`/`hisui`/
  `paldea` found in the tokens, in that priority (`totem-alola` →
  `totem/`); a `cap` token suppresses the regional match so Pikachu's
  promo-cap costumes stay at root. Everything else stays at root.
- **Filename** = the species' English display name
  (`pokemon_species_names.csv`) lowercased, periods stripped, whitespace/
  hyphens → underscores, curly apostrophe → straight (`galar/mr_mime.png`,
  `galar/farfetch'd.png`), plus any leftover form tokens. Normal and shiny
  go through the same id→path map so the two trees mirror wherever an id
  exists in both (a few have art in only one — not a bug).
- **Counts** (0.1.23): 310 normal / 303 shiny — `mega/` 97, `gmax/` 34,
  `galar/` 20, `alola/` 18, `hisui/` 16, `totem/` 12, `paldea/` 4, root
  one-offs 109/102 (the gap is Pikachu's 7 cap costumes, no official
  shiny). `mega/` includes the Legends: Z-A / Mega Dimension Megas —
  official, not fan-made (corrected 0.1.34; the CSV's scope is current
  through Z-A).

**Open idea**: gender-difference sprites (`temp/home/female/` and
`temp/home/shiny/female/`, 103 each) are still sitting in `temp/`, out of
scope — available if gender differences ever become a feature.

---

## 4. Wiring alternate forms into the detail screen — mechanism shipped

**Promoted to `PLAN.md` 2026-09-04; shipped 0.1.21 (mechanism + Deoxys/
Castform), 0.1.25 (rule 6 + Unown/Burmy/Cherrim/Arceus), 0.1.30/31
(16 Hisuian regional forms), 0.1.34 (Mega Evolutions + segmented-control
module), 2026-09-06 (36 Alolan/Galarian/Paldean regional-form species),
0.3.2 (Paldea own-forme species), 0.3.4/0.3.5 (forme-aware Evolution
Line).** The 9 rules below stay as the spec of record; `PLAN.md` records
the locked decisions, `SCOPE.md` §4 the current behavior. **Still open**:
rule 5 (no real species needs it yet), the moves-card half of rule 9
(same), Shellos/Gastrodon, and the Kalos/Unova candidates below.

**Alola/Galar/Paldea regional forms — judgment calls made during the
build, user manually confirmed the functionality 2026-09-06** (a direct
check that it works, not a per-call screenshot walkthrough); revisit any
on request:

- **Grid order under a chip is still national-id order**, so variants
  (ids 19-618) sort *ahead of* the region's own natives (Alola:
  Rattata…Marowak before Rowlet). `regionalDexNumbers` (0.2.5, data-only)
  could sort them into their real regional-dex slot if that reads wrong.
- **Galarian Darmanitan's Zen Mode** (`darmanitan-galar-zen`,
  `is_battle_only`, Ice/Fire, own stats) is **not modeled** — mirroring
  base Darmanitan's still-undecided Zen Mode in the Unova list below. The
  `galar/darmanitan_zen.png` art is bundled, unreferenced. Decide both
  together.
- **Paldean Tauros's 3 breeds** ship as 3 formes on one species
  (`paldea-combat`/`-blaze`/`-aqua`, Combat first = the Paldea chip's
  auto-forme); a search for "tauros" shows 4 rows.
- Raichu/Slowbro (Mega + regional): the regional forme is bubble 1, ahead
  of the Mega(s) — an insertion, not a reorder of existing bubbles.
- Combined stats-card label reads "Base Stats — A / B / C" (long, wraps) —
  sized blind, first screenshot should confirm.
- **Future, not committed — separate scoping conversation**: the
  **unfiltered National Dex** should also make both a species' base and
  regional-variant forme independently viewable (today the variant only
  surfaces under its own region chip or via search). Mechanism (two grid
  cells? a per-cell toggle?) explicitly undecided — user flagged it as a
  later discussion.

**11 Paldea species with their own new alt formes — RESOLVED 0.3.2**,
scoped species-by-species with the user (`HISTORY.md` 0.3.2 for detail):
shipped Maushold, Dudunsparce, base Tatsugiri (Curly/Droopy/Stretchy —
separate from its deduped Mega, #5), Squawkabilly (4 plumages, ability-
only), Gimmighoul (Chest/Roaming, rule 7 — real stat/ability differences),
Ogerpon (3 masks, rule 7). Oinkologne needs no entry (covered by
`hasFemaleSprite`; its `genderRate: 0` + `hasFemaleSprite: true` is a
PokeAPI source quirk, not a gap). **Excluded, same category as Galarian
Darmanitan Zen Mode** (battle-only automatic transformations): Palafin
Hero, Koraidon's 4 builds, Miraidon's 4 modes. **Terapagos is the one
exception** — both Terastal (a real permanent post-story change) and
Stellar (battle-only) modeled, user's explicit call for this species, not
a precedent.

**Gendered alt-forme art**: `src/data/sprites/pokemon/female/10235.png`
(+shiny) is bundled but unwired — Hisuian Sneasel's alt-forme id, not a
species id, so it doesn't fit `hasFemaleSprite` (`SCOPE.md` §2/§4). Would
need `ALT_FORMS` entries to carry their own gender-sprite concept — its
own scoping pass, not started.

**Vivillon/Alcremie confirmed still-missing, 2026-09-06** — surfaced by a
real screenshot during the visual-overhaul session (both species render
with no alt-forme/recolor selector at all). **User-decided: defer, not a
priority right now** — no change made. Vivillon was already tracked below;
**Alcremie (#869, Galar) is a newly-noted candidate**, not previously
listed anywhere: 63 flavor/topping combinations (a rule-6 recolorOnly
candidate like Vivillon, likely with a "+62" badge), no `ALT_FORMS` entry.

**Kalos alt-forme candidates (0.2.22)** — populated species, no
`ALT_FORMS` entry yet beyond the Megas; needs a user call per species:
Vivillon's 20 cosmetic patterns (rule 6 — the v7 mockup below, just needs
the data); Floette's 5 recolors + Eternal Flower (rule 6-ish, event-only);
Pumpkaboo/Gourgeist's 4 sizes (distinct base stats, same typing — likely
rule 7; Average is the populated default); Furfrou's 9 trims (rule 6);
Zygarde 10%/50%/Complete (distinct stats, same typing — rule 7, plus a
Power Construct auto-transform with no precedent in the app); Hoopa
Confined/Unbound (Psychic/Ghost vs Psychic/Dark — rule 7, like Castform/
Rotom). Xerneas Active/Neutral is battle-state cosmetic, likely not worth
tracking.

**Unova alt-forme candidates (0.2.7)** — same status: Deerling/Sawsbuck
seasons and Genesect drives (rule 6, recolor sprites bundled
`585-spring.png`…/`649-burn.png`…); Darmanitan Zen Mode, Meloetta
Pirouette, Kyurem Black/White, Tornadus/Thundurus/Landorus Therian, Keldeo
Resolute (rule 7 — distinct stats/typing, sprites under `alt formes/`
root); Basculin blue-/white-striped (`alt formes/basculin_blue_striped.png`
/`basculin_white_striped.png` — a rule-6-ish sibling of the Shellos case,
since only the white-striped form evolves into Basculegion).

**Shellos/Gastrodon (#422/#423) explicitly deferred, 2026-09-04:** rule 6
candidates on the surface (2 recolor forms each, West/East, no stat/type/
ability difference) but the color is evolution-locked *across* the species
boundary — West Shellos only evolves into West Gastrodon — and no rule
covers a cross-species Evolution Line interaction. Don't populate
`recolorOnly` data for them without resolving that first.

**Evolution Line forme-blindness — RESOLVED 0.3.4/0.3.5** (user
screenshot of Alolan Ninetales, 2026-09-06): a per-forme `evolvesTo`
override on `ALT_FORMS[id].formes[key]`, sourced from
`pokemon_evolution.csv`'s `base_form_id`/`evolved_form_id` columns
(previously read only to break row-selection ties). 14 species got a real
override (Alolan Vulpix → Ice Stone; the Galarian Farfetch'd/Yamask/
Meowth/Corsola/Linoone/Mr. Mime edges moved off their base species);
backward direction fixed 0.3.5. Mechanism: `SCOPE.md` §4; detail:
`HISTORY.md` 0.3.4/0.3.5. **Flag for `SCOPE.md` if it recurs**: Galarian
Slowpoke's two branches got a per-*edge* `note` (both would otherwise
read "Stone") — a new shape, distinct from the entry-level `note` on
211/234/265/550/704.

**Second forme-blindness bug — RESOLVED 0.3.9** (another user screenshot,
same Alolan Ninetales case, 2026-09-06 later same day): 0.3.4/0.3.5 only
fixed the VIEWED species' own outgoing edges; ancestor/prior-stage bubbles
in the Evolution Line still showed base sprites and the base edge even
when the viewed species had a forme active (Ninetales's card kept showing
base Vulpix/"Stone" with Alolan Ninetales selected). Fixed via
`fromFormeKey`-tagged edges + a new `evoStageForme()` resolver — full
detail `HISTORY.md` 0.3.9. **This also closed the Sirfetch'd half of the
limitation below** as a side effect (no Sirfetch'd-specific code needed).
**Still an open, deliberate limitation**: no target-forme auto-navigation
— tapping the Alolan Vulpix bubble (or Galarian Farfetch'd's) still opens
the *base* species' page, not its forme. Explicit architect scope decision
(would need cross-species forme state through `openDetail`/
`detailHistory`); low-priority polish, revisit on request.

**Governing rules**, confirmed 2026-09-04:

1. An "Alt Formes" module, styled like the existing Evolution Line module,
   sits between the Picture card and Evolution Line.
2. Each alt forme shows its sprite with its name underneath, same pattern
   as Evolution Line's stage bubbles.
3. Mega/Gmax formes get their own Base Stats card, sorted beneath the main
   form's.
4. A Mega/Gmax forme's own ability (if it has one) is appended to the
   information card's Abilities list, sorted last, tagged "Mega"/"Gmax".
   (Generalized on promotion: a non-Mega/Gmax forme tags with its own
   short name instead.)
5. A single non-Mega/Gmax forme with a different type combination taps
   through to a new dedicated detail screen for that forme — or links to
   its own National Dex entry, if it has one.
6. Recolor-only formes (no stat/type/ability change) collapse to one
   sprite in the module; tapping it opens a popup listing all of them.
7. Multiple non-Mega/Gmax formes that differ in stats and/or typing, none
   of them its own species, render fully inline (module, stats, abilities)
   — no navigation, following the same stat/ability logic as rules 3/4.
   If every such forme shares an identical stat line, show one combined
   stat card instead of one per forme.
8. A Pokémon with neither a prior nor a further evolution gets the whole
   Evolution Line module hidden (not a "Does not evolve" note). One with a
   prior evolution but no further one still shows the module, just with no
   forward arrow.
9. For rule 7's case, tapping a differently-typed alt forme swaps the
   **information card** (the grey Type/Abilities/Category/Weakness/etc
   card — user's name for it; CSS class stays `.detail-facts`) to that
   forme's own data. If the forme also has its own learnset addition, the
   Learnable Moves card's Level-Up list swaps too (TM/Egg/Max don't, unless
   a forme turns out to need it). Tapping the main-form sprite in the
   Picture card reverts both. Same-typed rule-7 formes don't get
   swap-on-tap — their data just sits inline as separate cards per rule
   7/3. (Extended 0.1.31: the swap covers Abilities too.)

**Worked mockups** (Cowork artifact, one per shape):

- **Rotom** (#479, v4/v5): rule 7, differently-typed — 5 appliance formes
  sharing one stat card, each with its own type, information-card swap,
  and a Level-Up addition (Overheat/Hydro Pump/Blizzard/Air Slash/Leaf
  Storm gained on forme change). The only worked case of rule 9's moves
  half; Rotom is populated but has no `ALT_FORMS` entry yet.
- **Deoxys** (#386, v6): rule 7, same-typed, 3 distinct stat cards —
  shipped 0.1.21 as mocked.
- **Vivillon** (#666, v7): rule 6, 20 patterns, one sprite + "+19" badge,
  popup grid; also rule 8's "prior evolution, no further one" half. Ready
  for its `ALT_FORMS` entry whenever the Kalos pass above is scoped.
- **Rule 5 was never mocked** — every worked case had multiple formes and
  landed in rule 7. Needs a species with exactly one non-Mega/Gmax,
  differently-typed, sibling-less forme.

---

## 5. Mega Evolution data — RESOLVED 0.1.34 (Megas); Gigantamax open

Every Mega in `POKEMON_DATA` is populated in `data/altforms.js` from the
PokeAPI CSVs (the join lives in `tools/populate_region.js`'s `altforms`
table; `temp/design-overhaul-2026-09-05/DESIGN.md` records the original
decisions). `PLAN.md`'s Alt Formes entry for what shipped. Facts a future
pass still needs:

- **Legends: Z-A / Mega Dimension Megas — RESOLVED, user-confirmed
  2026-09-06: keep.** The set is now **48 formes across 44 species**, by
  pass — **original 17 formes/16 species** (0.1.34): Clefable, Victreebel,
  Starmie, Dragonite, Meganium, Feraligatr, Skarmory, Chimecho, Staraptor,
  Froslass, Raichu (X and Y — the one species with 2 Z-A formes), Absol,
  Garchomp, Lucario, Heatran, Darkrai; **Unova +7** (0.2.7): Emboar,
  Excadrill, Scolipede, Scrafty, Eelektross, Chandelure, Golurk; **Kalos
  +11** (0.2.22): Chesnaught, Delphox, Greninja, Pyroar, Floette, Meowstic,
  Malamar, Barbaracle, Dragalge, Hawlucha, Zygarde; **Alola +6 formes/5
  species**: Crabominable, Golisopod (type change to Bug/Steel), Drampa,
  Magearna ×2, Zeraora; **Galar +1**: Falinks; **Paldea +6 formes/4
  species**: Scovillain, Glimmora, Tatsugiri ×3, Baxcalibur. (Mega Audino/
  Diancie, same passes, are Gen 6 official, not part of this set.)
  **Standing rule for future passes**: any new Z-A/Mega Dimension Mega a
  `--tables altforms` run surfaces is kept by the same default, no fresh
  call needed — query only if a genuinely uncertain case comes up (e.g.
  something that doesn't cleanly read as official Z-A data).
- **Stat-identical Mega sets dedupe to one** — Tatsugiri's 3 → 1
  (0.3.1, `key: "mega"`, kept the "curly" sprite); Meowstic's male/female
  → the default male forme (user-confirmed 2026-09-06). The bundled female
  Mega Meowstic art stays unreferenced by design (#4's gendered-alt-forme
  gap). Base Tatsugiri's own triplet is a separate question, shipped 0.3.2.
- **11 Megas have no `ability`** (CSV carries stats/types but no ability
  row): Heatran, Darkrai, Zygarde, Golisopod, both Magearna formes,
  Zeraora, all 3 Tatsugiri formes, Baxcalibur. (Falinks has a real one,
  Defiant.) Add by hand once known.
- **Gigantamax**: 12 Kanto species have Gmax art in `alt formes/gmax/`
  (Venusaur, Charizard, Blastoise, Butterfree, Pikachu, Meowth, Machamp,
  Gengar, Kingler, Lapras, Eevee, Snorlax). Gmax changes no stats/types/
  abilities, so an entry would be a sprite-only inert bubble with
  `isGmax: true` — cheap, but not decided.

---

## 6. Hisui + Orre — RESOLVED (0.1.26 mechanism + Orre; 0.1.28 Hisui 242/242)

See `PLAN.md`'s standalone-dexes entry and `HISTORY.md` 0.1.26/0.1.28.
Facts a future pass may need:

- **Orre has no PokeAPI dex data** (no `pokedexes.csv` row for region 11 —
  Colosseum/XD are spinoffs); `data/orre.js` was sourced from the
  user-supplied `temp/Orre_Region_Pokedex.txt`. Its table has 138 rows but
  its footer claims "131 unique"; 2 rows (dex 016/017, labeled Hoothoot/
  Noctowl though those numbers are Pidgey/Pidgeotto) were dropped rather
  than guessed, leaving 136. **Open**: whether Pidgey/Pidgeotto belong in
  Orre at all — needs real game data, not guessable from that file.
- **Hisui**: PokeAPI `pokedex_id` 30 (region 9), 242 species, extracted to
  `temp/hisui_dex_numbers.csv`. Legends: Arceus is `version_group_id` 24 /
  version id 39 — needed for any future moveset regeneration.
- `tools/populate_hisui_species.js` is the id-list-keyed fork of
  `populate_region.js` for scattered ids across uncommitted generations.

---

## 7. Follow-ups from the Hisui-29 pass (0.1.28) and later reviewer passes

All closed — `HISTORY.md`/`HISTORY_ARCHIVE.md` for each: 87/92 empty
movesets backfilled (0.1.29); "Lv undefined" arrows (0.1.29/0.1.30);
`hisuiOnly` search reachability, resolved by design reversal (0.1.30);
the last 5 empty movesets, with 5 user-supplied move descriptions
(0.1.38); the trigger classification for level-up edges with no level/
friendship condition → `"other"` (2026-09-05; precise labels for those
mechanisms — 6 label strings, `HISTORY_ARCHIVE.md` 0.1.30 — still
optional); the 5 missing evolution edges, via the new "knows a specific
move" shape (0.1.39, `SCOPE.md` §4, plus Bonsly/Mime Jr. user-confirmed);
Enamorus's false "Not found in the wild" note (0.1.34 — real encounter
data for those cases is still missing).

**Minor, low priority** (reviewer notes from 0.1.29-0.1.31, not actioned):

- `moveListHtml()` renders `level: 0` (PokeAPI's "learned on evolution")
  as "Lv 0" — 130+ entries. Candidate fix: render as "Evo".
- `abilities.js` is ordered by pass/append, not alphabetically — a
  pre-existing convention, not a defect; don't expect grep-by-eye to find
  a name near its alphabetical neighbors.

---

## 8. Items — RESOLVED 0.2.7/0.2.8 (`ITEMS_DATA` + Held Items row + tappable arrow icons); Bag screen not scoped

`data/items.js` (`ITEMS_DATA`, slug-keyed, hand-authored descriptions)
covers exactly what the app references: wild held items (`pokemon.js`
`heldItems` — the Facts card's "Held Items" chips, per-game rate breakdown
since 0.2.8, row after Capture Rate by user direction) and evolution items
(the Evolution Line's tappable arrow icons → item popup). `SCOPE.md`
§2/§4. The pipeline appends new items per pass via the manifest's `items`
list. **Still not scoped**: a Bag-style catalogue screen (898 sprites
bundled, only the referenced ones described), item category/price/Fling
data (`SCHEMA_GAPS` row), TM/berry-specific data.

---

## 9. Design overhaul — RESOLVED 0.1.34 (all 25 findings shipped)

`overlord`'s 2026-09-05 review (navigation/readability/usability/settings/
detail screen) was implemented in full the same day as 0.1.34. `HISTORY_
ARCHIVE.md` 0.1.34 summarizes; `temp/design-overhaul-2026-09-05/DESIGN.md`
is the per-change record with backups and revert instructions. Left
deliberately unchanged, per user: light mode on the detail screen; not
built, per user: name-language display, favorites export. Follow-ups:

- **Prev/next is keyboard-only** (ArrowLeft/ArrowRight); on-screen arrows
  or swipe were not asked for.
- Visual sizes chosen blind (no screenshots possible): the Settings window
  (6 rows since 0.1.35), the 280×270 radar, the move-row columns. A
  screenshot pass should confirm them.
- **Reverted by user after use (0.1.35)**: the card reorder, the
  Lv.50/Lv.100 Stat Level setting (also a real bug — its buttons reused
  `.grid-width-btn` and fed the grid-column handler), Hide Neutral, and
  the on/off Imperial Units switch (now a Metric/Imperial box selector).
  Don't re-propose these.

---

## 10. CSV audit baseline (2026-09-05) — data drift found, and schema gaps

`node tools/populate_region.js --audit` (`SCOPE.md` §2) found **123
discrepancies** the day it landed; all resolved by 0.1.39 (Sinnoh's
missing `hiddenAbility` flags, 4 Kanto location lists, an orphan
`abilities.js` key, 6 `moves.js` pp/power mismatches, the last 5 empty
movesets, the 5 missing evolution edges — `HISTORY_ARCHIVE.md`
0.1.36-0.1.39). One user call: Farfetch'd keeps the CSV's curly apostrophe
(`Farfetch’d`, 0.1.37). **`--audit` now reports 0 discrepancies.** Full
original-baseline output: `temp/csv-audit-pipeline-2026-09-05/
audit_real_run.txt`.

**Schema gaps** (`--gaps`, static `SCHEMA_GAPS` list — **14 groups** as of
0.2.7, was 28; `HISTORY.md`/`HISTORY_ARCHIVE.md` 0.2.1/0.2.5/0.2.7). Most
Pokédex-core candidates landed as pure data (`SCOPE.md` §2 for the field
list): legendary/mythical/baby flags, gender rate, base happiness (0.2.1);
gender differences, hatch counter, forms-switchable, base experience, EV
yield, habitat, tutor moves + `mastery`, move mechanics, other-language
names, natures, the per-level exp curve (0.2.5). Egg groups, encounter
detail and held items landed **with** UI (0.2.7/0.2.8). Prune a
`SCHEMA_GAPS` row when its field lands.

**Still genuinely open:**

- **`color_id`/`shape_id`** — user-decided 2026-09-05: **out of scope for
  the project**, not "later." Don't re-propose unless a future task makes
  them newly relevant.
- **Kalos regional dex numbers** — `regionalDexNumbers` landed 0.2.5 for
  every other mainline region (pokedex-variant tie-break: exact region-name
  identifier, else `original-`); Kalos has only 3 parallel sub-dexes with
  no unambiguous single pokedex under that rule, and the user chose to
  **leave it excluded** rather than force a merge-rule call — not a gap
  needing further work.
- **Per-game learnset history** (`pokemon_moves.csv` `version_group_id`) —
  the tool collapses every species to one "best" version group; storing
  full per-game history is a real data-shape decision (one list vs. one
  list per game) that hasn't been made.
- **Encounter condition values** (time of day, season, swarm) aren't
  stored or shown — the remaining half of the `SCHEMA_GAPS` `version_id`
  row. Gift/static/NPC-trade rows kept on purpose. **Checked 2026-09-06**:
  veekun/pokedex (`temp/veekun-pokedex-master`, PokeAPI's ancestor) has no
  richer condition data — same schema, byte-identical condition
  definitions, strictly older (caps at Gen 8) and a subset in every other
  respect. The gap is this pipeline not consuming a field the PokeAPI
  clone already has — don't re-check veekun for this or anything else.
- **Egg cycles / hatch steps** — `stats.js` `hatchCounter` (0.2.5) is still
  unwired; a natural companion to the Egg Groups row if wanted.
- Resolved-with-UI, for the record: 4 evolution edges with no obvious
  arrow label got user-approved hand-authored `note`s (0.2.6 — Sliggoo/
  Stantler/Qwilfish/Basculin, refresh-fragile like Wurmple's); Found In
  popup reworked to a collapsible accordion in real in-game order, "Walk"
  renamed "Grass" (0.2.10). `SCOPE.md` §4.

---

## 11. Detail-screen back navigation: single vs. double press — RESOLVED 0.2.1

A second press within **400ms** of the first jumps past the rest of
`detailHistory` straight to closing the detail screen; a press ≥400ms
later is a fresh single pop. Scoped to the detail-history stack only —
`backOut()`'s outer layers (settings/drawer/popup) stay one press per
layer. All 4 triggers (back arrow, Escape, Backspace, mouse button 3)
funnel through the single `backDetail()` guard. `SCOPE.md` §4.

---

## 12. Evolution-line card: text descriptor for non-obvious criteria — RESOLVED 0.2.1/0.2.2

Exactly 3 chains had sibling branches rendering an identical label:
**Tyrogue** (Attack-vs-Defense → structured `statCompare` field), **Burmy**
(gender → structured `gender` field), **Wurmple** (a hidden personality
value with **no CSV column at all** → hand-authored top-level `note`).
`evoDescriptorHtml()` renders one line at the bottom of the card, keyed off
whichever field is present — generic, not species-ID-based. **Extended
0.2.2** (user-confirmed): Combee→Vespiquen, Kirlia→Gallade, Snorunt→
Froslass also carry `gender`, so an otherwise-invisible gender requirement
surfaces even where branches aren't label-ambiguous; `populate_region.js`
extracts/audits `gender`. **Still hand-authored, dropped by a `--refresh
--tables evolutions`**: `statCompare` and `note` — no CSV column backs
either. `SCOPE.md` §4.

---

## 13. PLA/Hisui learnset split — both follow-ups RESOLVED 0.2.19

Shipped: `PLAN.md`'s PLA/Hisui learnset entry, `SCOPE.md` §2/§4. Two
decisions the user answered 2026-09-06:

- **Hisuian-form vs. base-form PLA data, when a species has both** — the
  Hisuian form wins. Only **one** species was actually affected (Sneasel,
  #215 — every other `-hisui` form's base has zero PLA rows, so the
  fallback already picked the Hisuian form); Giratina-Origin/Basculin-
  white-striped unaffected (no `ALT_FORMS` entry, nothing auto-activates).
- **Tutor tab on mainline screens** — yes: `{ key: "tutor", label:
  "Tutor" }` appended to `MOVE_TABS`, no render change needed; 58 mainline
  Unova species show it. **User's caveat, for future reference**: mainline
  games also have a "Move Tutor" NPC mechanic (specific tutors teaching
  specific moves, gated by NPC/location/version) — this tab renders the
  flat `tutor: string[]` field only. A future feature tracking *which*
  tutor teaches a move where would be additive to this shape, not blocked
  by it.

Handoff: `temp/handoff/2026-09-06-031550-tutor-tab-hisuian-priority.md`.

---

## 16. Reference-screen tap-throughs + drawer follow-ups (0.3.11-0.3.12)

The Type Chart and Natures screens (`SCOPE.md` §4) are deliberately
standalone — explicitly out of scope for the pass that built them.
Natural next connections, none committed:
- Tap a Type pill on a detail screen (Facts row or a move row) → open the
  Type Chart with that type's row/column highlighted. Needs a highlight
  mechanism the grid doesn't have yet (one class per row/col, trivial).
- Natures ↔ stats: `calcStat()` still assumes a neutral nature
  (`data/natures.js`'s header) — a nature picker on the Stats card would
  make the Natures screen more than a lookup. Bigger scope; nothing
  designed.
- Type Chart legibility: shipped fit-to-width with 9px cell glyphs
  (`HISTORY.md` 0.3.11's tradeoff). If a real screenshot says it's too
  small, switch to a horizontally-scrolling grid with ~22px cells — CSS
  only. Blind choice, not screenshot-confirmed.
- The walkthrough has no replay entry point (clear `vkdex-drawer-tour-seen`
  by hand). A "Show menu tour" row in Settings would be a few lines if
  wanted.
- **Drawer-handle hit box (0.3.12)**: widened to 28×160px to fix an
  unreliable tap target, but that band now overlaps the dex grid's
  leftmost ~28px — a grab right at the screen edge drags the drawer
  instead of scrolling. Narrowing to 24px is a one-value CSS change if a
  real screenshot says it's intrusive. `HANDLE_TAP_SLOP` (6px) and
  `DRAG_SCROLL_SLOP` (5px, the new grab-to-scroll gesture) are both chosen
  constants, not measured on a device.

---

## 15. Galar cross-region encounters (Max Raid Den/Dynamax Adventure) — deferred by user choice, 2026-09-06

`HISTORY.md` 0.3.10 shipped cross-region Found In data for 7 mainline
regions (kanto/johto/hoenn/sinnoh/unova/kalos/alola) — a species can now
show Found In chips for regions beyond its own native one. **Galar was
explicitly excluded**: its foreign-species encounter rows in
`csv/encounters.csv` are ~90% `max-raid`/`dynamax-adventure` (20,038 +
478 of ~27,000 foreign rows) — a rotating catch-pool mechanic (Sword/
Shield's Max Raid Dens, Crown Tundra's Dynamax Adventures can spawn nearly
any species depending on rotation), structurally different from "walk
around this route and find it." User chose to skip it for now rather than
decide whether/how to handle that volume and mechanic distinctly. Revisit
as its own scoping conversation whenever wanted — options not yet
discussed: include as-is (matches the source's own treatment, would flood
hundreds of species with a Galar chip for a rotating pool), filter to only
Galar's ~7,800 ordinary-method foreign rows (overworld/wanderer/walk),
or a distinct visual treatment (e.g. a "Raid Den" badge, mirroring the DLC
badge precedent) instead of a plain region chip.

---

## 14. Wire `src/data/*.js` to the new `csv/` merge — core wiring RESOLVED 2026-09-06 (0.3.6-0.3.8); all 3 Phase 4 follow-ups RESOLVED 0.3.9

`PLAN.md`'s CSV-merge entry has the full shipped-state record. `tools/
populate_from_csv.js` reads `csv/` and is the live pipeline; real SV/BDSP/
LA wild-encounter data is live in `locations.js`; `NEEDS_SOURCE_REGIONS` is
empty. Two real `merge.js` bugs found and fixed along the way (an id-space
bug threatening the per-forme evolution mechanism; a lost egg-group slot
order). An independent audit confirmed the shipped data trustworthy.

**Phase 4 follow-ups — all shipped 0.3.9** (`HISTORY.md` 0.3.9 for detail):

- **Rich rendering of `NEW_ENC_SHAPE`** — `openLocationPopup()` now renders
  forme/teraStars/alpha/terrain/weather/times/timeRates/hiddenAbility/
  boulder/group/homeMin-Max/tradeFor/note as conditional segments. `group`/
  `tradeFor` render the raw PokeDB slug verbatim (no species-name lookup —
  hyphenated slugs don't reliably match `pokemon.js` identifiers, flagged
  as a possible future polish item, not fixed). `weight` (raw SV spawn
  weight) deliberately not rendered.
- **DLC-only Found In chips badged** — user chose the lazy option (badge
  the existing "Paldea" chip via a render-time check on the per-line
  `games` field, no new `REGIONS` entries/pipeline changes) over splitting
  Kitakami/Blueberry Academy into their own region keys. `isDlcOnlyRegion()`
  matches a regex covering both bare ("The Teal Mask") and version-
  exclusive ("Violet: The Indigo Disk") DLC labels — the first pass's
  exact-match rule missed the 4 compound labels (19 species), caught and
  fixed same-day. 206 species now badge; mixed base+DLC species correctly
  don't.
- **Duplicate Sinnoh area names merged** — `mergeAreasByName()` collapses
  same-named rows (PokeAPI + PokeDB data for the same area, e.g. "Lake
  Verity") before rendering, concatenating their `enc` lines. All 59
  duplicates across 40 species confirmed collapsed, 0 lines lost.

**Bonus, not originally scoped**: fixing the Evolution Line's forme-
blindness (user screenshot, Alolan Ninetales) also closed the separately-
documented Sirfetch'd-shows-base-Farfetch'd-as-prior-stage limitation
(`TODO.md` #4/`SCOPE.md` §4) as a side effect of the same `fromFormeKey`
fix — see `HISTORY.md` 0.3.9. **Still not built** (unchanged): tapping a
forme-tagged ancestor bubble opens the base species' page, not its forme —
target-forme auto-navigation stays explicitly out of scope.

**User-confirmed on real hardware (2026-09-06)**: screenshots of Alolan
Ninetales and Galarian Farfetch'd's own page both show the forme-aware
Evolution Line rendering correctly — "alt forme evolutions now show
properly." DLC chip badge and rich encounter rendering (items 3/4) not
yet screenshot-confirmed.

**Judgment calls `overlord` flagged at merge time, still not re-confirmed**
(detail: `csv/MANIFEST.md`'s "Known gaps", the merge-build handoff — none
of these blocked the wiring above, since the pipeline just reads whatever
`csv/` currently says):
  whether per-species stat/type/ability *history* should really be 9
  per-generation snapshot files instead of the shipped current+delta
  shape; Max Moves/Tera Blast/Shell Side Arm `damage_class` kept as
  PokeAPI's physical/special rather than PokeDB's arguably-more-accurate
  `vary`; `items.introduced_generation`'s 17 hand-fixed veekun quirks
  (more may exist, unaudited); `base_experience_gen7plus`'s Zamazenta/
  Crowned Sword swap between the two sources, unverified either way;
  ORAS's 1,393 PokeDB-only encounter rows, not merged (PokeAPI "has" that
  version already, so the conflict rule left them out — worth a second
  look since PokeAPI's ORAS coverage is only 302 rows).
- **Scope exclusions taken by default, not explicitly confirmed**:
  PokeDB's 60 Mystery Dungeon abilities, `item_spin_off_datas`, `games`/
  platform catalogue, form-grain dex numbers (`lumiose_mega`). Low
  priority — revisit only if one turns out to matter.
- Legends: Z-A has no learnsets/encounters in either source yet
  (undatamined/too new) — nothing to wire until a source has the data.
