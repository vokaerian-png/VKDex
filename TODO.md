# VKDex — TODO

Ideas that have been proposed or discussed but **not committed to**. Related
ideas are grouped under one entry rather than listed separately. Once something
here becomes a definitive commitment, move it to `PLAN.md`. Resolved entries
keep their number (they're cross-referenced from `CLAUDE.md`/`PLAN.md`/
`HISTORY.md`) but shrink to the facts a future pass still needs.

---

## 1. Revisit Tauri instead of Electron, later

Electron was picked because it works **right now**, with no Rust toolchain.
Tauri produces a smaller, leaner build — worth reconsidering **once the app
itself is more finalized**. Not a commitment.

---

## 2. Region data population — RESOLVED for ids 1-493; next region uncommitted

Everything the detail-screen redesign needed (schema, sourcing order, the
Kanto→Sinnoh population, the redesign itself) shipped 0.1.10-0.1.22 — see
`PLAN.md`'s storage/sourcing entries and `HISTORY.md`. Still useful here:

- **Next expansion (Unova onward) is a `PLAN.md` candidate, not open
  work.** The tooling being ready doesn't by itself commit to doing it.
- **Running a pass** (`tools/populate_region.js`, unified 2026-09-05 —
  `SCOPE.md` §2 for the full mode list): target is a region
  (`unova|kalos|alola|galar|paldea`) or `--ids 494,531` for individual
  species. `--dry-run` to sanity-check the resolved ids/versions and which
  tables already hold each id → `--generate` to extract CSV data plus a
  descriptions-needed manifest (`temp/<region|species>_needs_descriptions
  .json`) → hand-author `descriptions.json` from that manifest →
  `--assemble [descriptions.json]` (upserts every table in id order,
  auto-runs `verify_region_data.js`). For ids already in `pokemon.js`,
  `--refresh [--tables movesets,...]` does generate+assemble in one step,
  keeping hand-authored descriptions. Needs the PokeAPI clone at
  `temp/PokeAPI-master`. Its `--generate` output goes to `temp/` root
  (pre-dates the `temp/<task-slug>/` rule; move it if that bothers).
- Unova/Kalos/Alola already hold 13/6/3 entries from the Hisui-29 pass
  (0.1.28); a region pass upserts by id, so those entries are refreshed in
  place rather than duplicated. A refresh also emits Mega formes for any
  species not yet in `ALT_FORMS` (`--tables altforms`).

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

- **Keep the 17 Legends: Z-A / Mega Dimension Megas?** Included (official,
  in the CSV, "newest available data"); `DESIGN.md` lists them and the
  revert is deleting those forme entries.
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

## 8. Item sprites bundled (0.1.32); first consumer 0.1.33; still no `ITEMS_DATA`

`src/data/sprites/items/` holds 898 flat item sprites plus 7 subfolders of
PokeAPI historical/version-specific art (berries/dream-world/gen3/gen5/
gen8/gen9/underground) — `SCOPE.md` §2. First code use landed 0.1.33 (the
Evolution Line's arrow condition icons, `HISTORY.md`), but those are
decorative (`alt=""`, not tappable) since there's still no `ITEMS_DATA`
table to name items from. A future item feature (held items, TM/berry
data, a Bag screen, tap-to-name on the evolution-arrow icons, etc.) would
need: a data table (name → description/effect/sprite path), and wiring
into whatever screen shows it — the detail screen's existing per-Pokémon
fields don't have an obvious item slot yet, so scope that first. Not
committed.

---

## 9. Design overhaul — RESOLVED 0.1.34 (all 25 findings shipped)

`overlord`'s 2026-09-05 review (navigation/readability/usability/settings/
detail screen) was implemented in full by `overlord` the same day as
0.1.34, together with #5's Mega data. `HISTORY.md` 0.1.34 summarizes;
`temp/design-overhaul-2026-09-05/DESIGN.md` is the per-change record with
backups and revert instructions. Left deliberately unchanged, per user:
light mode on the detail screen; not built, per user: name-language
display, favorites export. Follow-ups that fell out of the pass:

- **Partial-region chips** (Unova/Kalos/Alola, 13/6/3 entries) are not
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

**Schema gaps** (`--gaps`, static `SCHEMA_GAPS` list, 29 groups; full
text in `temp/csv-audit-pipeline-2026-09-05/gaps_real_run.txt`). Candidates,
not commitments — the clearly Pokédex-core ones:

- `pokemon_species.csv`: `is_legendary`/`is_mythical`/`is_baby`,
  `gender_rate` + `has_gender_differences` (the female sprite art in
  `temp/home/female/` would pair with this, #3), `base_happiness`,
  `hatch_counter`, `color_id`/`shape_id`/`habitat_id`, `forms_switchable`.
- **Egg groups** (`pokemon_egg_groups.csv`) — nothing in the schema covers
  breeding at all.
- `pokemon.csv` `base_experience`; `pokemon_stats.csv` `effort` (EV yield).
- `pokemon_items.csv` wild held items; `pokemon_dex_numbers.csv` every
  regional dex number (only Hisui's is stored).
- `pokemon_moves.csv`: tutor moves (method 3) and per-game learnset
  history are dropped; PLA `mastery` levels.
- `pokemon_evolution.csv`: the 13 condition columns that collapse to
  `"other"` (#7), per-version alternative methods, `evolution_chains.csv`
  `baby_trigger_item_id` (incense).
- `encounters.csv`: method/rate/level range (only area names kept).
- Move mechanics (`moves.csv` priority/target/effect chance, `move_meta`,
  `move_flags`), ability/move/type names in other languages, natures,
  `experience.csv` per-level exp table, and items (#8).

Prune a `SCHEMA_GAPS` row when its field lands.

---

## 11. Detail-screen back navigation: single vs. double press

User-noted 2026-09-05, from real-device chain-browsing (Eevee's
evolutions): `backDetail()` pops one `detailHistory` entry per press, so
returning to the National Dex after browsing several evolution/alt-forme
stages deep needs one back-press per stage — tedious for a long chain.

**Idea**: keep a single press/Escape/Backspace/mouse-back stepping back
one stage at a time (current behavior), but a second rapid press (double-
click/double-tap, within some timing threshold) jumps straight past the
rest of `detailHistory` and closes the detail screen to the National Dex
in one go. Needs a double-press timing mechanism layered onto the
existing `backOut()`/`backDetail()` handlers, applied consistently across
every trigger (Escape, Backspace, mouse button 3, the on-screen back
arrow). Not committed — needs a design pass (exact timing threshold,
whether it should apply to the drawer/settings/popup layers too or only
the detail-history stack) before promotion to `PLAN.md`.

---

## 12. Evolution-line card: text descriptor for non-obvious criteria

User-noted 2026-09-05, from a real screenshot of Tyrogue's fan-out: all 3
branches show `Lv 20`, but the real determinant is a stat comparison at
that level (Attack > Defense → Hitmonlee, Attack < Defense → Hitmonchan,
Attack = Defense → Hitmontop) — the current schema (`method`/`level`/
`item`/`moveType`) has no field for this, so the card doesn't convey it.
Likely the same gap as `TODO.md` #10's `pokemon_evolution.csv` "13
condition columns that collapse to `other`" (`relative_physical_stats` is
almost certainly the exact column here).

**Idea**: a plain-text descriptor line at the bottom of the Evolution Line
card, below every sprite/row, for whichever lines need this kind of
clarification beyond what an icon+label pair can convey. Needs: a new
data field (e.g. a `note` string per `EVOLUTIONS` entry or per-edge) and a
small render addition in `evolutionCardHtml()`. Scope which other species
need it before committing — Tyrogue confirmed; candidates worth checking
against the CSV: Toxel (nature-based split), Silcoon/Cascoon-style
personality-value splits if any exist in the current 522-id range. Not
committed — `PLAN.md` promotion needs that scope pass first.
