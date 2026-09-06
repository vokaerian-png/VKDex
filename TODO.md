# VKDex — TODO

Ideas that have been proposed or discussed but **not committed to**. Related
ideas are grouped under one entry rather than listed separately. Once something
here becomes a definitive commitment, move it to `PLAN.md`. Resolved entries
keep their number (they're cross-referenced from `CLAUDE.md`/`PLAN.md`/
`HISTORY.md`) but shrink to the facts a future pass still needs.

---

## 1. Revisit Tauri instead of Electron — RESOLVED, migration confirmed working (0.2.16)

Re-evaluated and user-approved 2026-09-05 (Tauri 2.x now covers desktop +
mobile from one project, which Electron can't do at all — the evaluation
itself, alternatives checked, and the divergent-desktop-UI mechanism are
recorded in `PLAN.md`'s Tauri migration entry, not duplicated here). Shell
swap (0.2.11) + native Windows live resize lock (0.2.14, corner-jitter fix
0.2.16) both **user-confirmed working** on real hardware. macOS/Linux have
no live lock yet, JS fallback only. Remaining work (first local Android
round, Electron cleanup) tracked as a commitment in `PLAN.md`, not here.

**Android release keystore + APK size** (0.2.17 debug build: 731.9 MB,
**now the release blocker** — `PLAN.md`'s Tauri entry paused Android
releases over it, 2026-09-05). APKs are debug-signed for now (Gradle's auto
`debug.keystore`, sideload-only) via an unoptimized debug build; a real fix
likely needs both: a permanent release key (generate once, back up forever
— an update signed with a different key won't install over the old one;
Play Store needs it too) wired into `gen/android/`'s Gradle signing config
(Tauri's docs cover the Gradle side), **and** switching the build itself
from `--debug` to a release/optimized profile (stripped, likely far
smaller on its own) — per-ABI split APKs instead of one universal build is
worth checking too if size is still an issue after that. `--debug` in
`package.json`'s `build:android` and the `-android-debug.apk` name in
`release.js` are the places that change once this is decided.

---

## 2. Region data population — RESOLVED for ids 1-649 (Unova 0.2.7); Kalos onward uncommitted

Everything the detail-screen redesign needed (schema, sourcing order, the
Kanto→Sinnoh population, the redesign itself) shipped 0.1.10-0.1.22; Unova
landed 0.2.7 via `overlord` (`HISTORY.md`). Still useful here:

- **Running a pass** (`tools/populate_region.js`, unified 2026-09-05 —
  `SCOPE.md` §2 for the full mode list): target is a region
  (`kalos|alola|galar|paldea`) or `--ids 668,678` for individual species.
  `--dry-run` → `--generate` (CSV extract + a descriptions-needed manifest,
  `temp/<region|species>_needs_descriptions.json`, now with an `items`
  list too) → hand-author `descriptions.json` (`pokemon`/`moves`/
  `abilities`/`items` keys) → `--assemble [descriptions.json]` (upserts
  every table in id order, auto-runs `verify_region_data.js`). For ids
  already in `pokemon.js`, `--refresh [--tables movesets,...]` does
  generate+assemble in one step, keeping hand-authored descriptions. Needs
  the PokeAPI clone at `temp/PokeAPI-master`. `--generate` output goes to
  `temp/` root (pre-dates the `temp/<task-slug>/` rule) — `mv` it into the
  task folder afterwards, as the Unova pass did.
- Kalos/Alola already hold 6/3 entries from the Hisui-29 pass (0.1.28); a
  region pass upserts by id, so those refresh in place rather than
  duplicate. A pass also emits Mega formes for any species not yet in
  `ALT_FORMS` (`--tables altforms`).
- **After every `--tables evolutions` write, re-check the hand-authored
  `note`/`statCompare` fields** on 211/234/236/265/550/704 — the upsert
  drops them (Unova's did drop Basculin's; restored by hand, 0.2.7).
- **4 ids still have bundled female-sprite art waiting** (0.2.3): 668, 678,
  876, 916 — `hasFemaleSprite` isn't CSV-sourced (`SCOPE.md` §2), so the
  region pass adding these must set the flag by hand (521/592/593 were
  done in 0.2.7).

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
- **Current counts** (0.1.23): 310 normal / 303 shiny — `mega/` 97, `gmax/`
  34, `galar/` 20, `alola/` 18, `hisui/` 16, `totem/` 12, `paldea/` 4, root
  one-offs 109/102 (the gap is Pikachu's 7 cap costumes, no official
  shiny). `mega/` includes the Legends: Z-A / Mega Dimension Megas
  (Scovillain, Glimmora, Dragonite, ...) — official, not fan-made as first
  assumed (corrected 0.1.34; the CSV's scope is current through Z-A).

**Open idea**: gender-difference sprites (`temp/home/female/` and
`temp/home/shiny/female/`, 103 each) are still sitting in `temp/`, out of
scope — available if gender differences ever become a feature.

---

## 4. Wiring alternate forms into the detail screen — mechanism shipped

**Promoted to `PLAN.md` 2026-09-04; shipped 0.1.21 (mechanism + Deoxys/
Castform), 0.1.25 (rule 6 + Unown/Burmy/Cherrim/Arceus), 0.1.30/31
(16 Hisuian regional forms), 0.1.34 (63 Mega Evolutions + the module
re-cut as a segmented control).** The 9 rules below stay as the spec of
record; `PLAN.md` records the confirmations, `SCOPE.md` §4 the current
behavior. **Still open**: rule 5 (no real species needs it yet), the
moves-card half of rule 9 (same), and Shellos/Gastrodon below.

**Gendered alt-forme art, new 2026-09-05:** `src/data/sprites/pokemon/
female/10235.png` (+ its shiny counterpart) is bundled but unwired —
Hisuian Sneasel's own alt-forme id, not a species id, so it doesn't fit
`pokemon.js`'s `hasFemaleSprite` mechanism (`SCOPE.md` §2/§4, shipped 0.2.3
for base-species gender only). Would need `ALT_FORMS` entries to carry
their own gender-sprite concept — its own scoping pass, not started.

**Unova alt-forme candidates, new 0.2.7** (species populated, no
`ALT_FORMS` entry yet — needs a user call per species, same as the Kanto-
Sinnoh ones got): Deerling/Sawsbuck seasons and Genesect drives (rule 6,
recolor sprites bundled `585-spring.png`…/`649-burn.png`…); Darmanitan Zen
Mode, Meloetta Pirouette, Kyurem Black/White, Tornadus/Thundurus/Landorus
Therian, Keldeo Resolute (rule 7 — distinct stats/typing, sprites under
`alt formes/` root); Basculin blue-/white-striped (`alt formes/
basculin_blue_striped.png`/`basculin_white_striped.png` — a rule-6-ish
sibling of the Shellos case below, since only the white-striped form
evolves into Basculegion).

**Shellos/Gastrodon (#422/#423) explicitly deferred, 2026-09-04:** rule 6
candidates on the surface (2 recolor forms each, West/East, no stat/type/
ability difference) but the color is evolution-locked *across* the species
boundary — West Shellos only evolves into West Gastrodon — and no rule
covers a cross-species Evolution Line interaction (the two modules have
never needed to talk). Don't populate `recolorOnly` data for them without
resolving that first.

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

**Worked mockups** (Cowork artifact, one per shape — kept for the two
species not yet in `POKEMON_DATA`):

- **Rotom** (#479, v4/v5): rule 7, differently-typed — 5 appliance formes
  sharing one stat card, each with its own type, information-card swap,
  and a Level-Up addition (Overheat/Hydro Pump/Blizzard/Air Slash/Leaf
  Storm gained on forme change). The only worked case of rule 9's moves
  half; Rotom is in `POKEMON_DATA` since 0.1.22 but has no `ALT_FORMS`
  entry yet.
- **Deoxys** (#386, v6): rule 7, same-typed, 3 distinct stat cards —
  shipped 0.1.21 as mocked.
- **Vivillon** (#666, v7): rule 6, 20 patterns, one sprite + "+19" badge,
  popup grid; also rule 8's "prior evolution, no further one" half. Not in
  `POKEMON_DATA` (Kalos uncommitted).
- **Rule 5 was never mocked** — every worked case had multiple formes and
  landed in rule 7. Needs a species with exactly one non-Mega/Gmax,
  differently-typed, sibling-less forme.

---

## 5. Mega Evolution data — RESOLVED 0.1.34 (Megas); Gigantamax open

All 63 Megas across 57 `POKEMON_DATA` species populated in
`data/altforms.js` from the PokeAPI CSVs (the join now lives in
`tools/populate_region.js`'s `altforms` table — `temp/design-overhaul-
2026-09-05/extract_megas.js` was its one-off ancestor; `DESIGN.md` there
records the decisions). `HISTORY.md` 0.1.34 / `PLAN.md`'s Alt Formes entry
for what shipped; 0.1.35 made every Mega bubble tappable (sprite/name
swap) regardless of a type/ability delta. Still needing a user call:

- **Keep the Legends: Z-A / Mega Dimension Megas?** Included (official,
  in the CSV, "newest available data"); `DESIGN.md` lists the original 17
  and the revert is deleting those forme entries. **Unova (0.2.7) added 7
  more** the same way — Emboar/Excadrill/Scolipede/Scrafty/Eelektross/
  Chandelure/Golurk (Mega Audino, also added, is Gen 6 official) — so the
  set awaiting the call is now 24.
- **Mega Heatran / Mega Darkrai have no `ability`** — the CSV carries
  stats/types but no ability rows for them. Add by hand once known.
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

Closed: 87/92 empty movesets backfilled (0.1.29); "Lv undefined" arrows
(0.1.29/0.1.30); `hisuiOnly` search reachability, resolved by design
reversal rather than as originally scoped (0.1.30) — `HISTORY.md` for each.
**Still open:**

- ~~`tools/populate_region.js` trigger classification~~ — fixed 2026-09-05:
  a level-up trigger with neither a level nor a friendship condition
  (shed/beauty/special-location/party-species/knows-a-move) now classifies
  as `method: "other"` (blank arrow), matching the 8 edges 0.1.30
  hand-flipped; held-item+time is `"held"` since 0.1.33. Precise labels
  for those mechanisms (6 new label strings; listed in `HISTORY.md`
  0.1.30) are still optional.
- ~~5 evolution edges still missing~~ — **fixed 0.1.39**: a "knows a
  specific move" trigger now exists (`item: "tm-normal"` + `move` field on
  the stone-edge shape, `SCOPE.md` §4) — Aipom/Lickitung/Tangela/Yanma/
  Piloswine populated, plus 2 more found the same way (Bonsly/Mime Jr.,
  user-confirmed). `tools/populate_region.js` classifies `known_move_id`
  into this shape too, so a future `--refresh` won't revert it.
- ~~5 empty movesets~~ — **fixed 0.1.38**: Pinsir/Tauros/Slowking/
  Sceptile/Rhyperior populated with 5 user-supplied move descriptions
  (Storm Throw/Raging Bull/Chilly Reception/Shed Tail/Rock Wrecker).
  `MOVES` now 622 entries.
- ~~Enamorus false "Not found in the wild" note~~ — resolved 0.1.34: the
  "evolution only" suffix now requires a prior evolution to exist; a
  non-evolving species with no data reads "No wild encounter data
  recorded." (Real encounter data for those cases is still missing.)

**Minor, low priority** (reviewer notes from 0.1.29-0.1.31, not actioned):

- `moveListHtml()` renders `level: 0` (PokeAPI's "learned on evolution")
  as "Lv 0" — 130 entries, 45 newly visible after the backfill. Candidate
  fix: render as "Evo".
- ~~`renderDexList()` Hisui quick-search duplication~~ — gone in 0.1.34
  (`dexSetFor()` is the single source for every chip's filter/sort).
- `abilities.js` is ordered by pass/append, not alphabetically — a
  pre-existing convention, not a defect; don't expect grep-by-eye to find
  a name near its alphabetical neighbors.

---

## 8. Items — RESOLVED 0.2.7 (`ITEMS_DATA` + Held Items row + tappable arrow icons); Bag screen not scoped

`data/items.js` (`ITEMS_DATA`, 130 entries, slug-keyed, hand-authored
descriptions) covers exactly what the app references: wild held items
(`pokemon.js` `heldItems`, 340 species — the Facts card's "Held Items"
chips) and evolution items (the Evolution Line's arrow icons, now tappable
→ item popup). `SCOPE.md` §2/§4, `HISTORY.md` 0.2.7. The pipeline appends
new items per pass via the manifest's `items` list. **Still not scoped**:
a Bag-style catalogue screen (898 sprites bundled, only 130 described),
item category/price/Fling data (`SCHEMA_GAPS` row), TM/berry-specific
data. ~~Decisions taken blind~~ — **resolved 0.2.8**: held-item rate
reworked to a per-game breakdown (`heldItems[].rates`, one group per
distinct rarity, `SCOPE.md` §2); row moved to sit after Capture Rate
(user-directed, not Egg-Groups-adjacent as first shipped).

---

## 9. Design overhaul — RESOLVED 0.1.34 (all 25 findings shipped)

`overlord`'s 2026-09-05 review (navigation/readability/usability/settings/
detail screen) was implemented in full by `overlord` the same day as
0.1.34, together with #5's Mega data. `HISTORY.md` 0.1.34 summarizes;
`temp/design-overhaul-2026-09-05/DESIGN.md` is the per-change record with
backups and revert instructions. Left deliberately unchanged, per user:
light mode on the detail screen; not built, per user: name-language
display, favorites export. Follow-ups that fell out of the pass:

- **Partial-region chips** (Kalos/Alola, 6/3 entries) are not
  visually distinguished from full ones — the shipped `.region-chip.empty`
  dims only zero-entry regions. Signalling "partial" needs an expected
  count per region (e.g. from `pokemon_species.csv` generation totals).
- **Prev/next is keyboard-only** (ArrowLeft/ArrowRight); on-screen
  arrows or swipe were not asked for.
- **Empty move tabs are skipped for every tab**, not just Max — the 5
  still-empty movesets (#7) therefore show no Learnable Moves card at all
  until backfilled.
- Visual sizes chosen blind (no screenshots possible): the Settings
  window (6 rows since 0.1.35, one of them the stacked Measurements row),
  the 280×270 radar, the move-row columns. First screenshot pass should
  confirm them.
- **Reverted by user after use (0.1.35)**: the card reorder, the
  Lv.50/Lv.100 Stat Level setting (also a real bug — its buttons reused
  `.grid-width-btn` and fed the grid-column handler), Hide Neutral, and
  the on/off Imperial Units switch (now a Metric/Imperial box selector).
  Don't re-propose these.

---

## 10. CSV audit baseline (2026-09-05) — data drift found, and schema gaps

`node tools/populate_region.js --audit` (`SCOPE.md` §2) ran against all
522 ids the day it landed: **123 discrepancies**. `coder` (reviewed by
`reviewer`) resolved everything fixable in 0.1.36; the Farfetch'd call
came back in 0.1.37; the 5 empty movesets were fixed in 0.1.38; the last 5
(`TODO.md` #7's missing evolution edges) closed in 0.1.39 — **`--audit`
now reports 0 discrepancies.** Full original-baseline output:
`temp/csv-audit-pipeline-2026-09-05/audit_real_run.txt`.

- ~~Sinnoh had no `hiddenAbility` flags — 101 of 107 species~~ — **fixed
  0.1.36**: `sinnoh --refresh --tables pokemon` added 91 flags (ids
  387-487; the other 16 genuinely have none).
- ~~Celadon City missing from 4 Kanto location lists~~ (Pikachu, Clefable,
  Horsea, Dragonair) — **fixed 0.1.36** via `kanto --refresh --tables
  locations`; confirmed no other Kanto list changed.
- ~~`abilities.js "Cacophony"` orphan key~~ — **deleted 0.1.36**, zero
  references confirmed in `src/`/`tools/`. Now 179 entries.
- ~~`moves.js` pp/power convention mismatch~~ (6 moves) — **fixed 0.1.36**
  by hand.
- ~~Farfetch'd apostrophe~~ — **resolved 0.1.37**: user chose the CSV's
  curly apostrophe (`Farfetch’d`) over the straight one.

**Schema gaps** (`--gaps`, static `SCHEMA_GAPS` list — **14 groups** as of
0.2.7, was 28; full history in `HISTORY.md` 0.2.1/0.2.5/0.2.7). Most of the
Pokédex-core candidates landed 0.2.5 as pure data (`SCOPE.md` §2 for the
full field list): `is_legendary`/`is_mythical`/`is_baby`/`gender_rate`/
`base_happiness` (0.2.1), then 0.2.5's batch — `has_gender_differences`,
`hatch_counter`, `forms_switchable`, `base_experience`, `effort` (EV
yield), `habitat_id` (as `habitat`, a resolved name), tutor moves +
`mastery`, move mechanics (`moves.csv` priority/target/effect chance,
`move_meta`, `move_flags`), other-language ability/move/type names,
natures (new `data/natures.js`), and the per-level exp curve (new
`data/experience.js`). 0.2.7 landed egg groups, encounter detail and held
items **with** UI (below).

**Still genuinely open:**

- **`color_id`/`shape_id`** — user-decided 2026-09-05: **out of scope for
  the project**, not "later." Don't re-propose unless a future task makes
  them newly relevant.
- ~~Regional dex numbers beyond Kalos~~ — **resolved 2026-09-05**: landed
  0.2.5 for every other mainline region via a pokedex-variant tie-break in
  `populate_region.js` (exact region-name identifier, else `original-`);
  Kalos has only 3 parallel sub-dexes with no unambiguous single regional
  pokedex under that rule, and the user chose to **leave it excluded**
  rather than force a merge-rule call — not a gap needing further work.
- **Per-game learnset history** (`pokemon_moves.csv` `version_group_id`) —
  the tool still collapses every species to one "best" version group;
  storing full per-game history is a real data-shape decision (one list vs.
  one list per game) that hasn't been made, deliberately not guessed at
  during 0.2.5.
- ~~4 evolution edges with no obvious arrow label~~ — **resolved 0.2.6**:
  Sliggoo→Goodra/Stantler→Wyrdeer/Qwilfish→Overqwil/Basculin→Basculegion
  all got user-approved hand-authored `note`s via the existing
  `evoDescriptorHtml()` mechanism (`SCOPE.md` §4, `HISTORY.md` 0.2.6) —
  same hand-authored, refresh-fragile shape as Wurmple's.
- ~~Egg groups~~ — **shipped 0.2.7**: `pokemon.js` `eggGroups` + a Facts-
  card "Egg Groups" row (`SCOPE.md` §4). Placement resolved 0.2.8
  (user-directed): sits beside Category, not at the end of the plain-fact
  run as first shipped.
- ~~Encounter detail~~ — **shipped 0.2.7, reworked to per-game 0.2.8,
  Found In popup reworked to a collapsible accordion in real in-game order
  0.2.10**: `locations.js` areas carry per-(method, game-group)
  level range + "up to N%" rate (`SCOPE.md` §2/§4); the Found In popup now
  renders each area as a native `<details>`/`<summary>` (collapsed by
  default, single-area regions pre-open) sorted by `location_game_indices
  .csv` order instead of alphabetically; the "Walk" method label was
  renamed "Grass" (0.2.10) as players don't recognize the former term.
  **Still open**: condition values
  (time of day, season, swarm) aren't stored or shown — the remaining half
  of the `SCHEMA_GAPS` `version_id` row. Gift/static/NPC-trade rows kept
  on purpose.
- ~~Items~~ — **shipped 0.2.7**, see #8.
- **Egg cycles / hatch steps** — `stats.js` `hatchCounter` (0.2.5) is still
  unwired; a natural companion to the new Egg Groups row if wanted.

Prune a `SCHEMA_GAPS` row when its field lands.

---

## 11. Detail-screen back navigation: single vs. double press — RESOLVED 0.2.1

Shipped as spec'd: a second press within **400ms** of the first jumps past
the rest of `detailHistory` straight to closing the detail screen; a press
≥400ms later is a fresh single pop. Scoped to the detail-history stack
only — `backOut()`'s outer layers (settings/drawer/popup) stay one press
per layer, unaccelerated, confirmed by a harness pressing that whole stack
with zero delay. All 4 existing triggers (on-screen back arrow, Escape,
Backspace, mouse button 3) count, since all 4 already funnel through the
single `backDetail()` guard — no per-trigger duplication. `HISTORY.md`
0.2.1 for the diff.

---

## 12. Evolution-line card: text descriptor for non-obvious criteria — RESOLVED 0.2.1/0.2.2

CSV sweep found exactly 3 chains in the 522-id+Hisui-29 dataset with
sibling branches rendering an identical label: **Tyrogue** (all three
"Lv 20" — real trigger is Attack-vs-Defense via `relative_physical_stats`),
**Burmy** (both "Lv 20" — real trigger is gender via `gender_id`), and
**Wurmple** (both "Lv 7" — a hidden personality value with **no CSV column
at all**). Shipped 0.2.1: Tyrogue's 3 edges get a structured `statCompare`
field, Burmy's 2 get a structured `gender` field, Wurmple's entry gets a
hand-authored top-level `note` (nothing to derive it from). A new
`evoDescriptorHtml()` renders one line at the bottom of the card, keyed off
whichever field is present — generic, not species-ID-based.

**Extended 0.2.2** (user-confirmed, since 3 more species turned up with
`gender_id` set but weren't ambiguous — their sibling branches already
differ by method/item, so they were left out of the original fix): Combee
→Vespiquen (its only edge, gender-gated — males never evolve), Kirlia
→Gallade, Snorunt→Froslass all got the `gender` field too, so the
descriptor now also surfaces an otherwise-invisible gender requirement on
species that aren't label-ambiguous. `populate_region.js` now extracts/
audits `gender` for all 5 in-range rows (758 Salazzle is out of range).
**Still hand-authored, still dropped by a `--refresh --tables evolutions`**:
Tyrogue's `statCompare` and Wurmple's `note` — no CSV column backs either,
so teaching the tool isn't possible the way `gender` was. `HISTORY.md`
0.2.1/0.2.2 for the diffs.
