# VKDex — Version History

Versioning format is **major.minor.regular** (e.g. `0.1.0`): the last
("regular") number is bumped by 1 for every `src/`/`electron-app/`/
`src-tauri/` change, up to a max of 999, mirrored across `src/data.js`
(`APP_VERSION`), root `package.json`, `src-tauri/tauri.conf.json` and
`src-tauri/Cargo.toml` (`electron-app/package.json` no longer mirrored as
of 0.2.11 — `CLAUDE.md` §3). Memory-bank-only and `tools/`-only edits are
exempt. The authoritative policy is `CLAUDE.md` §3 — this file is just the
log, newest entry first. Current-state descriptions live in `CLAUDE.md`;
entries here record what changed and why.

**Rolling window, 15 entries** (started 2026-09-06, `CLAUDE.md` §6c): this
file holds only the 15 most recent version entries, written in full as
they ship, same as always. Once a 16th accumulates, the oldest is
compacted (a few lines: what shipped, key numbers/decisions, not the full
verification/mechanism detail) and moved into `HISTORY_ARCHIVE.md` — every
version's entry still exists somewhere, just not at full length forever.
Entries prior to 0.2.10 live there now (0.1.0 through 0.2.9, 43 headings —
0.2.5-0.2.9 were already folded under one 0.2.4→0.2.10 heading before
archival and stayed folded as one compacted entry there).

**Current version: 0.3.10.**

---

## 0.3.8 → 0.3.9 — Phase 4 follow-ups: forme-aware Evolution Line, duplicate-area merge, DLC chip badge, rich encounter rendering (`coder` ×2)

Closes all three `TODO.md` #14 Phase-4 follow-ups plus a user-reported
Evolution Line bug (screenshot: Alolan Ninetales selected, card still
showed base Vulpix/"Stone"/base Ninetales). One dispatch shipped all four;
a same-day follow-up widened item 3's match rule after its own report
flagged the gap.

- **Evolution Line forme-blindness fixed** — `formeEvoEdges()` now tags
  each edge with the forme key it came from (`fromFormeKey`); `evoEdgesFor()`
  lets an ancestor's forme-specific edge (e.g. Alolan Vulpix's Ice Stone
  route) *replace* the base edge to the same target instead of being
  deduped away, keyed off the viewed species' active forme; a new
  `evoStageForme()` resolves which forme (if any) a stage bubble should
  render as, wired into `evoStageHtml()` (gained a `nameOverride` param)
  at all 3 render sites (straight chain, fan-out root, fan-out leaves).
  Base-view behavior unchanged (regression sweep: 0 differences across
  every chain with no forme active). **Also closes the documented
  Sirfetch'd limitation** (`TODO.md` #4/`SCOPE.md` §4) as a side effect —
  its page now shows Galarian Farfetch'd, not base Farfetch'd, as its prior
  stage — with no Sirfetch'd-specific code, purely from the same
  `fromFormeKey` tag. **Still not built** (unchanged, deliberate): tapping
  a forme-tagged ancestor bubble still opens the *base* species' page, not
  its forme — target-forme auto-navigation remains explicitly out of scope.
- **Duplicate Sinnoh area names merged** — `mergeAreasByName()` collapses
  same-named area entries (PokeAPI-derived + PokeDB-derived, e.g. "Lake
  Verity") into one, concatenating their `enc` arrays at the first
  occurrence's position. Confirmed: exactly the documented 59 duplicate
  rows across 40 species collapse, 0 enc lines lost.
- **DLC-only Found In chips badged** — `isDlcOnlyRegion()` flags a region
  chip "DLC" when every encounter line for it is DLC-gated, derived from
  the existing per-line `games` field (no data/pipeline changes). First
  pass used exact-match against 2 labels and missed 19 species using the
  4 version-exclusive compound labels ("Violet: The Indigo Disk", etc.) —
  same-day follow-up widened the check to a regex
  (`/(?:^|: )The (?:Teal Mask|Indigo Disk)$/`), confirmed against a full
  census of every `games` label in `locations.js` (9 real labels, all
  correctly classified). 206 species now badge; mixed base+DLC species
  (e.g. Pikachu) correctly stay unbadged.
- **`NEW_ENC_SHAPE` fields now rendered** in the Found In popup instead of
  degrading gracefully: forme (resolved via `ALT_FORMS` or title-cased
  fallback), tera raid star level, LA alpha level range, terrain, weather,
  time-of-day gate, per-time-of-day rate breakdown (2+ keys only), hidden-
  ability flag, boulder-required flag, spawn group (raw slug, no lookup),
  Way Home level range, trade-for target, and free-text note — each an
  optional ` &middot; ` segment before the existing games sub-line. A
  classic-shape line still renders byte-identical to before. Swept all
  14,268 shipped `enc` lines with no throws/unescaped markup; 5 real
  combinations hand-traced against actual data.
- Verified (both dispatches): `node --check` clean throughout; a
  brace-matched harness (`temp/phase4-followups/check.js`, evals the real
  function sources out of `app.js` against shipped data, not a
  re-implementation) — every check above is that harness's own output, not
  a re-derivation. No `src/data/*.js` file touched, so
  `verify_region_data.js --audit` wasn't re-run (nothing it checks could
  have changed).
- **Flagged, not fixed**: `group`/`tradeFor` render the raw PokeDB slug
  verbatim (e.g. "with bulbasaur", lowercase beside title-cased neighbors)
  — a real species-name lookup was deliberately skipped (hyphenated slugs
  don't reliably match `pokemon.js` identifiers); `weight` (raw SV spawn
  weight) deliberately not rendered, not independently meaningful outside
  its own area. **No visual verification possible** (`CLAUDE.md` §4) —
  Ninetales's Alolan bubble, Sirfetch'd's card, and a DLC chip on Ursaluna
  would all benefit from a real screenshot confirming the traced/hand-
  verified output actually renders as expected.

**User-confirmed on real hardware, same day**: screenshots of Alolan
Ninetales (Alolan Vulpix → Stone → Alolan Ninetales, all three forme-aware)
and Galarian Farfetch'd's own page (its Evolution Line correctly shows the
Galarian sprite feeding Sirfetch'd) — "alt forme evolutions now show
properly." Items 3/4 (DLC badge, rich encounter rendering) not yet
screenshot-confirmed but use the same verification standard.

Handoffs: `temp/handoff/2026-09-06-160603-phase4-followups.md`,
`-171240-dlc-badge-regex-fix.md`.

---

## 0.3.7 → 0.3.8 — Independent audit + SV DLC-area mislabeling fixed (`coder` + independent audit dispatch)

Closes out the CSV-rewire arc (0.3.6/0.3.7 below) with the user-requested
secondary error-checking pass. A fresh, context-free dispatch independently
re-verified the whole rewire from raw `csv/` files (not by re-running the
implementers' own tooling) — see `PLAN.md`'s CSV-merge entry for the full
verdict. Result: **data trustworthy, 0 extraction errors found**, but 2 real
presentation bugs surfaced.

- **SV DLC areas were being labelled as base-game Paldea** — Kitakami (The
  Teal Mask) and Blueberry Academy (The Indigo Disk) areas landed in
  `LOCATIONS[id].paldea` tagged `games: "Scarlet/Violet"`, indistinguishable
  from real base-game content. 116 species' entire Paldea entry was
  DLC-only; 201 more mixed DLC and base-game areas undivided. Fixed via a
  real join (not a name heuristic): `encounters_scarlet_violet.location_area`
  → `location_areas_pokedb.location` → `locations_pokedb.region_area` →
  `region_areas_pokedb.identifier` (2,763 paldea / 826 blueberry-academy /
  707 kitakami rows, 0 unresolved). Each affected line's `games` now reads
  "The Teal Mask"/"The Indigo Disk" (or e.g. "Violet: The Teal Mask" for 95
  version-exclusive rows, `versions.csv`'s own English names). 1,533 lines
  relabelled across 336 species (audit's own eyeballed estimate of 116/201
  undercounted — the join also catches areas with no self-identifying name,
  e.g. Timeless Woods, Crystal Pool). Pure `games`-field edit: 0 structural
  diffs, areas/order/counts unchanged.
- **Known, deferred**: the Found In chip itself still reads "Paldea" even
  for a DLC-only species (e.g. 901 Ursaluna) — splitting Kitakami/Blueberry
  into their own region keys is unstarted (`TODO.md` #14). Also unfixed:
  40 Sinnoh species show a duplicate area-name row (once for PokeAPI's
  DPPt/Platinum data, once for PokeDB's BDSP data, e.g. "Lake Verity" ×2)
  since the two area vocabularies were deliberately kept unjoined —
  cosmetic, deferred to the same future pass.
- Verified: `node --check`; `verify_region_data.js` PASS (1025/783/305/146/
  151/224/241, unchanged); `--self-test` OK; every audit-flagged species
  (Bulbasaur, Charmander, Clefairy, Poliwag, 4 `hisuiOnly` DLC-only cases)
  re-checked showing correct labels; `sinnoh`/`hisui` data confirmed
  byte-identical (untouched by this change).

Handoffs: `temp/handoff/2026-09-06-150254-csv-rewire-phase3-independent-audit.md`,
`-151207-csv-rewire-phase3b-dlc-label-fix.md`.

---

## 0.3.6 → 0.3.7 — Real Scarlet/Violet, BDSP and Legends: Arceus wild encounters go live (`coder`)

Follow-up to 0.3.6's rewire: lands the new encounter data 0.3.6 extracted
but held back. `src/app.js`'s `openLocationPopup()` assumed every encounter
line had a numeric `min`/`max`/`rate`; the new per-game shape often lacks
`min`/`max` and can carry a string `rate` (`"varies"`, `"10%"`) — rendering
as-is produced `undefined%`/`Lv undefined`/`varies%` garbage. Fixed with a
minimal conditional (omit "Lv …" when `min` is absent; print a string
`rate` verbatim, a numeric one as "N%" as before) — the fuller rich render
(terrain, group rates, tera stars, LA alpha/time/weather) stays deferred,
`TODO.md` #14. `verify_region_data.js`'s enc-line check widened to accept
the new shape (string `rate`, absent `min`/`max`) without loosening the
classic numeric-shape validation.

- **768 of 1025 species gain wild-encounter data the app never had**:
  `paldea` 625 species/3,900 areas/4,234 lines (Scarlet/Violet), `sinnoh`
  317/1,887/2,138 (Brilliant Diamond/Shining Pearl), `hisui` 235/1,381/1,725
  (Legends: Arceus). `NEEDS_SOURCE_REGIONS` emptied of `"paldea"` — the
  other 16 native-Paldea species (9 evolution-only, 7 static/event-only)
  correctly fall through to the existing accurate messages.
- Two more bugs found and fixed along the way: a `populate_region.js`
  locations-writer idempotency bug (a re-run duplicated a species' own new
  areas rather than replacing them) and one inverted LA level range
  upstream (Prinplup/Spring Path `32 - 25`, fixed by sorting rather than
  relaxing the verifier).
- Verified: `node --check`; `verify_region_data.js` PASS; whole-corpus
  render check — 14,268 enc lines, 0 contain `undefined`/`NaN`/`%%`; 6,171
  classic lines confirmed byte-identical to the pre-change template; 7
  real lines hand-traced to their rendered HTML in the handoff.

Handoff: `temp/handoff/2026-09-06-145141-csv-rewire-phase2b-minimal-encounter-fix.md`.

---

## 0.3.5 → 0.3.6 — Data pipeline rewired onto merged `csv/` source (`coder` ×2) — `TODO.md` #14's core wiring shipped

Replaces the app's single-source PokeAPI pipeline with one reading last
session's merged `csv/` source (`PLAN.md`'s CSV-merge entry). Two
dispatches: build+validate (dry-run only), then the full write.

- **New `tools/populate_from_csv.js`** validated on a 30-id sample and the
  full 1025-id set before any write — **0 unexplained differences** either
  time. `tools/populate_region.js` (the old pipeline) is kept as a
  permanent independent cross-check, not retired.
- **Two real bugs found in `tools/csv_merge/merge.js` itself**, both fixed
  and `csv/` regenerated: (1) `pokemon_evolution.csv`'s `base_form`/
  `evolved_form` were resolved through the wrong id space (`pokemon_forms.id`
  instead of `pokemon.id`), silently pointing 34 of 58 form-restricted
  evolution rows at unrelated species/formes — left unfixed, this would
  have broken the 0.3.4/0.3.5 per-forme `evolvesTo` mechanism outright
  (Perrserker would've hung off base Meowth). (2) `pokemon_egg_groups.csv`
  lost PokeAPI's real slot order for 161 species (alphabetised instead of
  preserved) — e.g. Bulbasaur read Grass/Monster instead of Monster/Grass.
- **Full 1025-id write** (both bugs fixed, 3 user-confirmed decisions
  applied): `moves.js` +`jaRomaji` on all 783 entries; `pokemon.js`
  `baseExperience` switched to the current Gen 7+ era value (139 species,
  e.g. Charizard 240→267 — still data-only/unwired); `stats.js`/`names.js`/
  `evolutions.js` picked up a handful of `species_field_overrides.csv`
  corrections. **0 object-literal field-order changes anywhere** across
  5,900+ entries (checked programmatically). One flagged, approved reorder:
  133 Eevee's evolution branches now sort in the pipeline's canonical
  ascending-id order (Sylveon 6th→8th in the fan-out) — confirmed
  pre-existing legacy drift, not a rewire regression (both source CSVs
  agree on the corrected order), user confirmed keeping it.
- **`assemble()` now auto-carries hand-authored evolution `note`/
  `statCompare` fields** (211/234/236/265/550/704) on every run instead of
  silently dropping them — closes a fragility that had already bitten
  twice (0.2.7, 0.2.22), user-approved as permanent pipeline behavior.
- Verified: `node --check`; `verify_region_data.js` PASS; a second dry run
  against the freshly-written data is a fixed point (only the pre-existing
  978 Tatsugiri `altforms` drift, already known); named regression cases
  (215 Sneasel, 399 Bidoof, 37 Vulpix's per-forme override, 128 Tauros,
  899-905 `hisuiOnly`) all confirmed intact; `populate_region.js --audit`
  cross-check against the old source reports exactly the documented
  discrepancies, no surprises.

Handoffs: `temp/handoff/2026-09-06-161600-csv-rewire-phase1.md`,
`-144022-csv-rewire-phase2.md`.

---

## 0.3.4 → 0.3.5 — Evolution backward direction made forme-aware + Galarian Slowpoke branch labels (`coder`)

Follow-up to 0.3.4 (below), same session. 0.3.4's forward-direction fix
correctly stripped false/misattributed evolutions off 9 base species, but
that left the 9 EVOLVED species with **no Evolution Line card at all** on
their own page (their only parent edge now lived exclusively on the
pre-evolution's forme override, invisible to the backward root-walk) — a
real regression flagged in 0.3.4's own handoff, fixed here.

- **New `formeEvoEdges(id)`** (`src/app.js`) flattens every `evolvesTo`
  across `ALT_FORMS[id].formes`. `evolutionRootId`'s backward parent-scan
  now walks `EVOLUTIONS[k].evolvesTo.concat(formeEvoEdges(k))` over the
  union of both tables' keys, so a species whose only parent edge sits on a
  forme is still reachable as part of a chain.
- **`evoEdgesFor` made asymmetric** (the actual fix): the *viewed* species
  stays strict — active forme's override if it has one, else base only
  (unchanged, this is what keeps Sirfetch'd off base Farfetch'd's page).
  Every *other* species in the same chain now contributes base edges
  **plus** its forme-only routes, deduped against targets the base already
  reaches (load-bearing — without the dedupe, Ninetales/Slowbro grew
  phantom duplicate branches from the Alolan/Galarian overrides).
- **Result**: 862 Obstagoon, 863 Perrserker, 864 Cursola, 865 Sirfetch'd,
  866 Mr. Rime, 867 Runerigus, 903 Sneasler, 904 Overqwil, 980 Clodsire all
  render a real chain again. A full 1025-id old-vs-new sweep found exactly
  15 changed chains (the 9 plus 6 relatives — 53/195/263/439/461/563 —
  regaining a sibling branch), and all 6 are byte-identical to their
  **pre-0.3.4** rendering, confirming nothing new broke.
- **Incidental improvement**: the Found In card's empty fallback for those
  9 now correctly reads "Not found in the wild — evolution only." instead
  of "No wild encounter data recorded." (it keys off `evolutionRootId`).
- **Galarian Slowpoke's two branches** (→ Slowbro-Galar via Galarica Cuff,
  → Slowking-Galar via Galarica Wreath) both rendered as generic unlabeled
  "Stone" arrows — indistinguishable. Fixed with a `note` field added **on
  the edge object** (not the entry-level `note` the 211/234/265/550/704
  precedent uses — that shape can't scope to one branch of a forme-only
  override) plus one line in `evoArrowLabel` (`if (via.note) return
  via.note;`). Arrows now read "Galarica Cuff" / "Galarica Wreath".
- **Known limitation, accepted**: still no target-forme auto-navigation
  (tapping evolve from Alolan Vulpix opens base Ninetales, not the Alolan
  forme) — explicit architect scope decision from 0.3.4, its mirror now
  also exists backward (Sirfetch'd's page shows Farfetch'd's base
  sprite/name as the prior stage, not the Galarian one). Not fixed;
  `TODO.md` carries it as an open, low-priority polish item.
- Verified: `node --check`; `verify_region_data.js` PASS (1025 entries, 146
  items, 151/224 alt-forme species/formes); `populate_region.js --audit`
  over 30 affected+relative ids PASS; the chain-harness from 0.3.4 extended
  26→45 cases, all pass; full 1025-id sweep (above). DOM half hand-traced
  only (no browser in sandbox, `CLAUDE.md` §4) — the 9 fixed species have
  no `ALT_FORMS` entry of their own, so they render once through
  `renderDetail` and never touch `setActiveForme`'s swap path at all.
  Handoff: `temp/handoff/2026-09-06-102833-evolution-backward-fix-slowpoke-notes.md`.

---

## 0.3.3 → 0.3.4 — Evolution line is forme-aware: per-forme `evolvesTo` override (`coder`) — `TODO.md` #4's evolution-line gap resolved

Root-fixes the reported bug: `EVOLUTIONS` held exactly one entry per base
species, so a regional variant's page always showed its *base* species'
evolution edge — Alolan Vulpix showed Kanto's Fire Stone requirement
instead of its own Ice Stone, and Galarian-only evolutions (Farfetch'd →
Sirfetch'd, Yamask → Runerigus) were wrongly attributed to base species
that never evolve that way in the real games. Traced to real upstream data:
`pokemon_evolution.csv` already carries `base_form_id`/`evolved_form_id`
columns encoding exactly this per-forme restriction; `populate_region.js`
read them only to break ties between rows for one base-species entry, never
to capture the form-restricted row at all.

**Mechanism** (general, not a hand-patch): `ALT_FORMS[id].formes[key]` can
now carry its own `evolvesTo` array, read instead of `EVOLUTIONS[id]` while
that forme is active, falling back otherwise — the same override-with-
fallback shape `types`/`abilities` already use.

- **`tools/populate_region.js`**: extraction refactored into 4 helpers
  (`buildEvoEdge`, `pickEvoRow`, `isPlainEvoRow`, `evoRowFormeKey`).
  `isPlainEvoRow` excludes Eevee-style rows where `base_form_id` just
  redundantly equals the species' own default id (not a real restriction).
  A target whose *only* rows are form-restricted is now excluded from the
  base species' `evolvesTo` entirely (previously fell back to it); the
  form-restricted row is captured as an override on the matching
  `ALT_FORMS` forme instead — but only when it would render *differently*
  from the base edge (10 variants differing only in the target's own forme,
  e.g. Alolan Rattata→Alolan Raticate, are identical Lv-20 arrows either
  way and were deliberately not given a redundant override).
  **One flagged deviation**: 550 Basculin→Basculegion (White-Striped has no
  `ALT_FORMS[550]` entry) kept its edge on the base rather than deleting
  Basculegion from the UI with nowhere to display it — general rule (fires
  whenever a form-restricted target has no matching forme anywhere), not a
  hardcoded exception.
- **9 base `EVOLUTIONS` entries corrected**: 83 Farfetch'd → `[]`, 562
  Yamask → Cofagrigus only (false Runerigus branch removed), plus
  52/122/194/211/215/222/264 similarly trimmed of a misattributed edge.
  211 Qwilfish's hand-authored `note` was dropped by the refresh (as
  `SCOPE.md` warns this upsert can do) and restored by hand.
- **15 `evolvesTo` overrides added across 14 species'** `ALT_FORMS` formes
  (27/37/52×2/79/83/100/122/194/211/215/222/264/554/562) — e.g. 37 alola →
  Ice Stone (base: Fire Stone), 79 galar → two branches via Galarica
  Cuff/Wreath (base: Lv 37 / trade King's Rock).
- **`src/data/items.js`**: `galarica-cuff`/`galarica-wreath` added (0.2.9
  description convention) — referenced by the new overrides, had no entry
  at all; neither has a bundled sprite (icon hides on load failure, same as
  existing sprite-gap convention).
- **`verify_region_data.js`** extended to validate `evolvesTo` targets/item
  refs on every `ALT_FORMS` forme, not just `EVOLUTIONS`.
- **`src/app.js` rendering**: new `findForme()` (extracted from
  `setActiveForme`), new `evoEdgesFor(id)` (the viewed species' active-forme-
  or-base edge resolver, read by `evolutionPaths`). `setActiveForme` now
  also rebuilds/removes/inserts the `.evolution-card` on forme tap, same
  swap-on-tap pattern the Facts card already used for types/abilities.
- **Explicit scope boundaries** (architect decision, not oversights): no
  target-forme auto-navigation (evolve arrow still opens the target's base
  page); backward direction was initially left non-forme-aware (fixed next
  version, 0.3.5 above, same session).
- Verified: `node --check` on all 7 touched files; `verify_region_data.js`
  PASS; `populate_region.js --audit` over all 27 affected ids PASS (a
  future `--refresh` won't revert this); a 26-case chain harness (extended
  to 45 in 0.3.5) replicating the real render logic, all pass. DOM half
  hand-traced only (`CLAUDE.md` §4). Handoff:
  `temp/handoff/2026-09-06-102045-evolution-forme-override.md`.

---

## 0.3.2 → 0.3.3 — Alt-forme bubbles no longer wrongly inert, tap-to-enlarge main sprites, Paldea "needs source" label (`coder`)

Three independent small fixes, one dispatch.

- **Alt-forme tappable fix**: `altFormeTappable()` gated tappability on
  `isMega`/`isGmax`/`types`/`abilities` — a forme differing from base in
  *only its sprite* (no data delta at all) rendered `.altform-inert`: no
  pointer, unclickable, couldn't even swap the displayed sprite. Root cause
  confirmed via a real audit script (`vm`-loading `data/altforms.js`) that
  found exactly 6 affected bubbles across 3 species, no others: Deoxys's
  Attack/Defense/Speed Formes (386, stats-only), Squawkabilly's Blue
  Plumage (931), Tatsugiri's Droopy/Stretchy Forms (978). Fixed by making
  `altFormeTappable` return `true` unconditionally — `setActiveForme` and
  `statsCardHtml` were already correct for a sprite-only forme, so nothing
  else needed changing. Deoxys is the one species where *every* forme was
  previously inert, so it newly gains the base/revert bubble too (correct).
  `.altform-inert` CSS left in place (dead but harmless — the class is
  never applied to a per-forme bubble anymore, but a follow-up ~15-line
  cleanup is available if wanted).
- **Tap-to-enlarge main sprites**: the Picture card's two sprites
  (`#pictureMainSprite`/`#pictureShinySprite`) are now clickable — opens
  the existing `#detailPopup` (same infra `openItemPopup` already uses)
  showing an enlarged version of just the one sprite tapped, sourced from
  its own live `.src`/`.alt` (so it automatically reflects whatever
  forme/gender is currently active). Scoped to these two sprites only — alt-
  forme bubbles, item sprites, evo-stage/dex-grid sprites untouched. New
  `.sprite-zoom-img` (220×220, reuses `--sprite-rendering`).
- **Paldea "needs source" label**: all 120 native-Paldea species have zero
  `LOCATIONS` data (confirmed: the CSV clone has zero encounter rows for
  the whole region — the only region at 0, vs. e.g. Galar 81/89). Previously
  read as "No wild encounter data recorded." — indistinguishable from a
  species that genuinely has none by game design. New `NEEDS_SOURCE_REGIONS
  = ["paldea"]` gates a distinct message ("...needs source...") in
  `foundInCardHtml`, styled `.needs-source` (`#ffcb05`, in-palette). Scoped
  to this one confirmed gap, not a general blank-field heuristic — every
  other region's existing message is unchanged. 7 Hisui-exclusive
  evolutions (899-905) have a blank `region` field and also 0 locations;
  they keep today's accurate messages, noted but not touched.
- Verified: `node --check`; two audit scripts (6-bubble flip confirmed;
  Paldea 0/120 confirmed uniquely empty). DOM/visual halves hand-traced
  only (`CLAUDE.md` §4). Handoff:
  `temp/handoff/2026-09-06-100112-altform-tappable-spritezoom-needssource.md`.

---
## 0.3.1 → 0.3.2 — 6 of the 11 Paldea own-forme species wired, base Tatsugiri's triplet added (`coder`)

Part of `TODO.md` #4's 11-species Paldea alt-forme scoping, user-decided
per species. `ALT_FORMS`: 145 species/209 formes → **151/224** (+6/+15).
Sourced from the local PokeAPI CSV clone (`pokemon_forms.csv`/
`pokemon_form_types.csv`/`pokemon_abilities.csv`/`pokemon_stats.csv`),
same join pattern as `populate_region.js`'s existing `altforms` extraction
— not hand-authored from memory. `abilities.js` +2 (`Tera Shell`,
`Teraform Zero`), 303 → 305.

**4 places the CSV corrected the architect-drafted spec** (real game data
wins over the initial guess, per this project's standing rule):
- **Gimmighoul (999) isn't recolor-only** — Roaming Form has its own stats
  (45/30/25/75/45/80 vs Chest's 45/30/70/75/70/10) and ability (Run Away
  vs Rattled). Shipped as rule 7 (swap-on-tap + own stat card), not the
  rule-6 popup originally specced.
- **Squawkabilly (931)'s real split is Green/Blue → hidden Guts, Yellow/
  White → hidden Sheer Force** (not Intimidate/Hustle as first guessed;
  those are regular abilities shared by all 4 plumages). Uses the existing
  Hisuian-style plural `abilities`/`hiddenAbility`-replaces-while-active
  mechanism — no new code needed. Since the base species' own hidden
  ability is already Guts, **Blue Plumage now differs from base in
  sprite only** (inert bubble, consistent with the existing convention for
  a forme with no type/ability delta, e.g. Deoxys's stats-only formes) —
  visually a little uneven next to 2 tappable + 1 inert, not fixed, just
  the correct data.
- **Ogerpon (1017)'s 4 masks change ability too**, not just secondary
  type (Defiant/Water Absorb/Mold Breaker/Sturdy for Teal/Wellspring/
  Hearthflame/Cornerstone) — stats stay identical across all 4. Shipped
  with both `types` and `abilities` fields.
- **recolorOnly sprite paths**: the Gen 9 recolor formes (Maushold/
  Dudunsparce/Tatsugiri's base triplet) have their own PokeAPI form ids,
  so their art lives under `alt formes/`, not the flat `pokemon/` folder
  `spriteUrl()` normally resolves rule-6 sprites from. Fixed by spelling
  the subfolder into the `sprite` field itself (e.g. `"alt formes/
  maushold_family_of_three"`) — zero `app.js` change, since that field
  already means "wherever this string points."

**Shipped, by species**: Maushold (925, Family of Three/Four — both listed,
matching the Burmy/Cherrim/Arceus recolorOnly precedent of listing the
default too, not just non-default); Dudunsparce (982, Two-/Three-Segment,
same); base Tatsugiri (978, Curly/Droopy/Stretchy, added alongside the
already-deduped Mega); Squawkabilly (931, 4 plumages, ability-swap
mechanism above); Gimmighoul (999, Chest/Roaming, rule 7); Ogerpon (1017,
3 non-base masks, rule 7, types+abilities).

**Explicitly excluded, same category as the pre-existing Galarian
Darmanitan Zen Mode precedent** (battle-only automatic transformations,
not player-selectable): Palafin (964) Hero Form, Koraidon (1007)'s 4
builds, Miraidon (1008)'s 4 modes. **Terapagos (1024)'s Terastal + Stellar
Forms are the one exception** — modeled despite Stellar being battle-only,
user's explicit call for this species. **Oinkologne (916) needs no
`ALT_FORMS` entry at all** — already covered by the standard
`hasFemaleSprite` gender-toggle mechanism; its `genderRate: 0` +
`hasFemaleSprite: true` combination is a PokeAPI data-source quirk, not a
functional gap.

Verified: `node --check`; `tools/verify_region_data.js --audit` PASS (4
pre-existing discrepancies re-flagged, all from the 0.3.1 Tatsugiri Mega
dedupe the audit re-derives every run — confirmed against git history, not
newly introduced); all 16 referenced sprite paths confirmed on disk
(normal + shiny where applicable); every ability name resolves in
`ABILITIES`.

---

## 0.3.0 → 0.3.1 — Tatsugiri's 3 Megas deduped to 1 (`coder`)

User decision: Tatsugiri's 3 stat-identical Megas (Curly/Droopy/Stretchy,
`TODO.md` #5) collapsed to 1 entry, same pattern as the earlier Meowstic
dedupe. `ALT_FORMS[978]` now a single forme: `key: "mega"`, `name: "Mega
Tatsugiri"`, `sprite: "mega/tatsugiri_curly"` (kept as the default variant,
matching Meowstic keeping "male"), stats unchanged (68/65/90/135/125/92).
Droopy/Stretchy sprites left bundled, unreferenced — same shape as
Meowstic's unreferenced female Mega art. Base Tatsugiri's own curly/
droopy/stretchy forme triplet (separate from this Mega question) is still
unmodeled — part of the 11-species Paldea alt-forme scoping, `TODO.md` #4.

Verified: `node --check` + `JSON.parse` on all touched files;
`vm`-loaded real data confirms `ALT_FORMS[978].formes.length === 1`;
`tools/verify_region_data.js` PASS, forme total 211 → 209 (expected −2);
repo-wide grep for the removed keys/name outside `temp/` — no stragglers.

---

## 0.2.22 → 0.3.0 — Full National Dex (1025/1025) + regional-form Alt Formes + Android single-APK policy

**Deliberate version jump, not a +1 continuation** (user-directed, like the
earlier 0.1.40→0.2.0 precedent) — one consolidated release bundling this
entire session's work rather than several small bumps. Six dispatches
(`coder` ×5, `overlord` ×1) plus architect's own memory-bank/tooling edits.

**Android: single-APK release policy.** User confirmed the `--split-per-abi`
Android build (4 real per-architecture APKs, 68-74 MB each, published as
0.2.22) works as intended — but future releases publish **arm64-v8a only**,
alongside Windows: it alone covers virtually every real device from 2018
onward (Google Play's 64-bit mandate since 2019; armeabi-v7a/x86/x86_64 are
legacy/emulator-only at this point). `tools/release.js`'s `pickApks()` now
filters for `arm64` instead of "not universal" — Gradle still builds all 4
flavors, only the arm64 one gets copied/published. `node tools/release.js
--check` updated and passing (1 apk picked, not 4). `CLAUDE.md` §2a.

**Region population: Alola/Galar/Paldea landed — `POKEMON_DATA` 731 →
1025, every mainline region now complete.** A real trial of `CLAUDE.md`
§5b's parallel-dispatch policy, in 4 phases:
1. **Sequential shared-table pre-pass**: a small `--tables none` extension
   to `populate_region.js` (writes only `moves.js`/`abilities.js`/
   `items.js`, skips every per-id table) landed the full cross-region union
   of new content (94 moves, 90 abilities, 10 items — with confirmed real
   name overlap across all three regions, e.g. "Fluffy"/"Stakeout" needed
   by all three) before any parallel writes started. Also fixed a real
   idempotency bug in `assemble()` found along the way (missing-entry check
   was blind to a sibling pass's just-landed additions, causing duplicate
   keys on first attempt — now checks live current data instead of the
   stale `--generate`-time snapshot).
2. **3-way parallel `coder` dispatch** (Alola ids 722-809/85 new, Galar
   810-905/89 new, Paldea 906-1025/120 new) — all hand-authored original
   descriptions, no copied flavor text. **Real finding, corrects `CLAUDE.md`
   §5b's premise**: disjoint id ranges did NOT make the batch file-disjoint
   — `populate_region.js --assemble` does whole-file read-modify-write on
   all 8 per-id tables regardless of which ids it touches, so all three
   dispatches wrote the same physical files concurrently. Nothing was
   corrupted, but all three independently flagged the risk, and the clean
   result came from real-world write timing serializing by luck, not from
   the partitioning being safe by design. §5b corrected accordingly — don't
   re-attempt true parallel writes to these files on id-range disjointness
   alone.
3. **Follow-up fixes**: 13 evolution edges restored (`--refresh --tables
   evolutions` on the 13 affected source ids) after a real cross-region
   dependency surfaced — Applin (Galar) → Dipplin (Paldea) and Duraludon
   (Galar) → Archaludon (Paldea) reference targets that didn't exist yet
   when Galar's own pass ran; 6 more pre-existing edges into Galar
   (Meowth/Farfetch'd/Mr. Mime/Corsola/Linoone/Yamask → their Galarian-form
   evolutions) also resolved as a side effect. Two evolution items
   (`syrupy-apple`, `metal-alloy`) never in any manifest — added by hand,
   `ITEMS_DATA` 142 → 144.
4. **Benchmark result**: ~641,500 total subagent tokens across the 6
   region-population dispatches; ~39.8 min wall-clock (pre-pass sequential
   ~13.4 min → parallel phase ~19.3 min, the slowest of 3, not their sum →
   follow-ups sequential ~7.1 min) versus an estimated ~72.1 min fully
   sequential — a real ~45% wall-clock reduction at unchanged token cost.
5. **Other data outcomes**: both of `TODO.md` #2's long-waiting
   `hasFemaleSprite` ids finally set (876 Indeedee, 916 Oinkologne); all 120
   Paldea `locations` entries are empty (confirmed upstream gap — the CSV
   clone's `encounters.csv` has zero scarlet/violet rows, not a pipeline
   bug); `TODO.md` #5's Z-A/Mega Dimension set grew from 35 to 48 formes/44
   species (Alola +6/5, Galar +1/1, Paldea +6/4); 11 Megas now lack a CSV
   ability row (was 3).

**Regional-form `ALT_FORMS` wiring — new mechanism, `overlord`.** Two
user-confirmed design decisions built in one dispatch:
- **36 species / 41 formes added** — Alolan (18), Galarian (19, Meowth has
  both an Alolan and a Galarian forme), Paldean (2 species, 4 formes:
  Wooper + Tauros's 3 breeds) regional variants of pre-existing species,
  CSV-derived via the same join method the sprite-folder sort already used
  (`TODO.md` #3). Ordinary rule-7 differently-typed formes, same shape as
  the 16 Hisuian ones (0.1.30/31) — 24 have their own stats, 38 a plural
  ability swap. `ALT_FORMS` 109 → 145 species, 170 → 211 formes;
  `ABILITIES` 294 → 303. Rule 7's "combined stat card for identical-stat
  formes" clause built for real for the first time (Tauros's 3 breeds).
  Explicitly left out: `darmanitan-galar-zen` (battle-only, paired with
  base Darmanitan's own undecided Zen Mode), the 11 Paldea species with
  their own new-species alt-formes (a different, still-undecided category,
  `TODO.md` #4), Megas/Gmax, Shellos/Gastrodon.
- **Region-chip visibility + auto-default, generalized from Hisui.**
  Selecting the Alola/Galar/Paldea chip now also shows a species with a
  variant there (not just species natively introduced there), with that
  region's sprite; opening it from that chip auto-activates the regional
  forme (`openDetail(id, fromRegion, formeKey)`, was `(id, autoForme)`).
  Opened from anywhere else, still opens on base.
- **New: global search shows both forms for regional variants.** A query
  matching a species with any regional-variant alt forme (Hisuian or the
  new Alolan/Galarian/Paldean ones) now returns both the base and the
  variant as separate rows; tapping either opens straight to that forme.
  Mega/Gmax formes are excluded — never get their own row. Retroactive to
  the 16 already-shipped Hisuian forms.
- Verified: `node --check` clean; `verify_region_data.js` PASS (145
  species/211 formes/303 abilities); `--audit` PASS; a 33-check harness
  covering chip visibility, auto-default, native-region fallback, search
  dual-display (including the no-duplicate-in-active-chip and
  Mega-excluded cases).

**Memory bank**: `CLAUDE.md`/`SCOPE.md` both raised their standing line
caps by 50 (650/750) for this real, load-bearing content — `CLAUDE.md` §7.
`TODO.md` #2/#4/#5, `PLAN.md`'s region-population and Alt Formes entries,
`SCOPE.md` §2/§4 all updated to current state.

Handoffs: `temp/handoff/2026-09-06-093000-shared-tables-prepass.md`,
`-101230-alola-region-pass.md`, `-081320-galar-region-pass.md`,
`-081609-paldea-region-pass.md`, `-102332-evolution-edges-fix.md`,
`-082535-missing-evolution-items-fix.md`,
`-084148-regional-form-alt-formes.md`, `-version-bump-0.3.0.md`.

---

## 0.2.21 → 0.2.22 — Kalos region pass: 66 species, 12 Megas, Mega-forme tool bug fixed (`coder`)

User-directed: finish the Kalos dex (Alola/Galar/Paldea deliberately
deferred — they need Hisuian-style regional-forme wiring first, not
started). Standard `tools/populate_region.js` pipeline, ids 650-721 (72
species; 700/704/705/706/712/713 already existed from the Hisui-29 pass
and were upserted in place, not duplicated).

- **66 new species**, every per-Pokémon table (`pokemon`/`stats`/
  `evolutions`/`movesets`/`names`/`locations`/`altforms`); +21 `MOVES`,
  +14 `ABILITIES`, +2 `ITEMS_DATA` (`sachet`, `whipped-dream`), all hand-
  authored original paraphrases from the local PokeAPI CSV clone. `POKEMON_
  DATA` 665 → 731.
- **12 new Kalos Megas** surfaced via `--tables altforms`, not just
  Diancie: Chesnaught/Delphox/Greninja/Pyroar/Floette/Meowstic/Malamar/
  Barbaracle/Dragalge/Hawlucha/Zygarde/Diancie. Only Diancie's is a
  mainline Gen 6 Mega; the other 11 are Legends: Z-A/Mega Dimension —
  `TODO.md` #5's awaiting-a-keep/drop-call set grows 24 → 35. Mega Diancie:
  no typing change (stays Rock/Fairy), stats 50/100/150/100/150/50 →
  50/160/110/160/110/110 (BST unchanged), ability Magic Bounce tagged
  "Mega" per rule 4. Mega Barbaracle changes typing, Rock/Water →
  Rock/Fighting. Mega Zygarde has no ability in the CSVs — same gap as
  Heatran/Darkrai (`TODO.md` #5), now a 3-item list.
- **Meowstic's two Megas (male/female) are identical** in name/types/
  stats/ability, differ only in sprite — shipping both would double the
  Alt Formes bubble, the stats card, and the rule-4 ability row. `coder`
  deduped in the extractor (first/default forme wins, male kept) rather
  than hand-editing the data, so `--audit` stays at its documented 0-
  discrepancy baseline instead of carrying 3 permanent false positives.
  The bundled female Mega Meowstic art is now unreferenced — same shape as
  `TODO.md` #4's already-deferred gendered-alt-forme gap. Reversible in
  ~2 lines; **not yet confirmed with the user** — flagged, not decided.
- **Tool fix**: the Mega sprite/key extractor assumed a `<species>-mega
  [-suffix]` identifier shape (`.replace(/^[^-]+-mega/, "")`), which broke
  on `meowstic-male-mega`/`meowstic-female-mega` (nothing stripped →
  garbage path) and would have broken hyphenated species slugs (`ho-oh`,
  `porygon-z`) too. Replaced with a token-wise strip. Fixed 6 forms clone-
  wide (Meowstic ×2, Magearna, Tatsugiri ×3) — un-breaks the future Alola
  and Paldea passes, not just this one.
- **Two documented region-pass gotchas, both handled**: 704 Goomy's
  `note` was dropped by the evolutions upsert as expected, restored byte-
  identical by hand. `hasFemaleSprite: true` set by hand on 668 (Pyroar)
  and 678 (Meowstic) — 2 of `TODO.md` #2's 4 waiting ids now closed;
  876/916 remain for Alola/Galar.
- Verified: `node --check` on all 13 touched files; `verify_region_data.js`
  PASS (auto-run + re-run after hand fixes); full `--audit` over all 731
  ids, 0 discrepancies; a purpose-written out-of-range diff confirmed
  nothing outside 650-721 changed and no existing `MOVES`/`ABILITIES`/
  `ITEMS_DATA` key was edited (covers the 211/234/236/265/550 hand-
  authored-field sanity check). No `app.js`/`index.html`/`styles.css`
  change needed or made; nothing reordered.
- **Git commit blocked this session**: `git add -A` staged cleanly, but
  `git commit` hung/left a stale `.git/index.lock` — the sandbox's
  documented mount-EPERM failure mode (`CLAUDE.md` §4), not a data
  problem. All Kalos data is on disk and verified; **the commit itself
  still needs to happen** (delete the lock, then commit+push) on a
  session/machine that can reach it.

Handoff: `temp/handoff/2026-09-06-064647-kalos-region-pass.md`.

---

## 0.2.20 → 0.2.21 — Cargo release profile for Android APK size (`coder`)

User-directed follow-up: 0.2.20's real signed/minified/ProGuard'd Android
build came out at 732 MB — essentially unchanged from the old 731.9 MB
*debug* build. Root cause: `src-tauri/Cargo.toml` had no `[profile.release]`
table at all, so every release build (all 4 ABIs bundled into the universal
APK) shipped unstripped Rust debug symbols and no LTO — ProGuard/minify
only ever touched the Kotlin/Java side.

- **`src-tauri/Cargo.toml`**: added `[profile.release]` — `strip = true`,
  `lto = true`, `codegen-units = 1`, `opt-level = "z"` — between `[package]`
  and `[lib]`. Nothing else in the file touched; nothing under
  `src-tauri/gen/` touched (per-ABI split APKs stay a separate, still-
  unrequested lever, `TODO.md` #1).
- **Tradeoff, not a defect**: `codegen-units = 1` + fat LTO will make
  desktop `tauri build` noticeably slower too, not just Android — the
  standard cost of this profile shape.
- Verified: `node --check` on `src/data.js`; `package.json`/
  `tauri.conf.json` re-parsed as JSON (both `0.2.21`); all four version
  mirrors confirmed; `Cargo.toml` structure checked by script (table
  count/order, bracket balance, no duplicate headers) — no TOML parser
  available in-sandbox to do better, and no Rust/Android toolchain to
  actually compile it (`CLAUDE.md` §4, permanent). **Unverified by build**:
  the real size impact is unmeasured until the next `--target=android`
  release run on the user's own machine.

Handoff: `temp/handoff/2026-09-06-045953-cargo-release-profile.md`.

---

## 0.2.19 → 0.2.20 — Android release signing key + release build profile (architect + `coder`) — `TODO.md` #1's signing half resolved

User-directed: move forward on the Android release blocker flagged since
0.2.17 (debug-signed 731.9 MB universal APK, sideload-only).

- **Generated a real RSA-2048 release keystore** (alias `vkdex`, 10000-day
  validity, valid to 2054) via `keytool`, at the user's direction stored
  outside the repo in a private Dropbox-synced location (durable,
  off-machine backup by construction; a `.properties` copy of the password
  sits alongside it there for recovery independent of chat scrollback).
  Exact path deliberately not recorded in the memory bank (2026-09-06,
  user direction) — the user knows where it is.
- **`src-tauri/gen/android/app/build.gradle.kts`**: added a `signingConfigs
  { create("release") {...} }` block reading `gen/android/keystore.
  properties` (gitignored, already excluded before this change — the
  Tauri scaffold anticipated this convention), wired to the existing
  `release` buildType via `signingConfig = signingConfigs.getByName
  ("release")`. That buildType already had `isMinifyEnabled = true` +
  ProGuard configured from `tauri android init` — only the missing signing
  config was blocking a real release build from producing an installable
  APK. `gen/android/.gitignore` also got a belt-and-suspenders `*.keystore`/
  `*.jks` line.
- **`package.json`**: `build:android` dropped `--debug` → `tauri android
  build --apk` (release profile, `--apk` to get an installable APK instead
  of the AAB Gradle also produces by default — matches the project's
  GitHub-Releases sideload distribution, not a Play Store submission).
- **`tools/release.js`**: output artifact renamed `VKDex-vX.Y.Z-android.apk`
  (dropped the `-debug` suffix) in both the copy step and the pre-build
  summary line. `pickApk`'s universal-preferred search logic needed no
  change — already generic over the Gradle output tree.
- **Deliberately not done this pass**: per-ABI split APKs (`TODO.md` #1) —
  the release buildType's minify+ProGuard alone hasn't been measured on
  real hardware yet; splitting is the next lever only if size is still an
  issue after that.
- Version bump (`src/data.js` APP_VERSION) done by `coder` per `CLAUDE.md`
  §5 — the one file architect is hard-blocked from editing directly;
  everything else in this entry was architect's own edit (`src-tauri`/
  `tools`/`package.json` aren't hard-restricted, just "good practice" to
  route through `coder`).
- Verified: `node --check` on `tools/release.js` and `src/data.js`;
  `node tools/release.js --check` all-pass; `package.json`/`tauri.conf.json`
  JSON-valid; a `keytool -list -v` self-check against the generated
  keystore confirmed alias/fingerprint/validity; manual brace-balance read
  of the edited `build.gradle.kts` (no Gradle/Android SDK in this sandbox
  to actually run a build — `CLAUDE.md` §4, first real build is on the
  user's machine).

---

## 0.2.18 → 0.2.19 — Hisuian-form PLA priority + mainline Tutor tab (`coder`) — `TODO.md` #13 resolved

User answered both follow-ups flagged by 0.2.18's PLA/Hisui learnset split.

- **`tools/populate_region.js`**: a `-hisui`-suffixed alt form's own PLA
  rows now win outright whenever it has any, even when the base species
  also has PLA rows (previously base always won unless it had zero PLA
  rows). Regenerated `src/data/movesets_hisui.js` and diffed against the
  pre-change file: **only Sneasel (#215) changed** — checking off the CSVs
  found the "7 species" assumed in 0.2.18 was actually 1; every other
  `-hisui` form's base species has zero PLA rows, so the pre-existing
  fallback already resolved those correctly. Sneasel's entry now reflects
  Hisuian Sneasel's own learnset (Rock Smash/Close Combat/Drain Punch/Bulk
  Up in, base's Ice Shard/Blizzard/Ice Beam out). Giratina-Origin (#487)
  and Basculin-white-striped (#550) untouched by design — neither has an
  `ALT_FORMS` entry, so nothing auto-activates for them on the Hisui
  screen, and the user's stated reasoning (matching the Hisui screen's
  default) doesn't extend to them.
- **`src/app.js`**: `{ key: "tutor", label: "Tutor" }` appended to
  `MOVE_TABS` (existing Level-Up/TM/Egg/Max order unchanged) — the
  render path (`movesCardHtml`/`moveListHtml`) was already generic enough
  that this needed no other code change. 58 mainline Unova species with
  non-empty `movesets.js` `tutor` data now show the tab. `tutor` stays a
  flat `string[]` (which moves are tutor-learnable, mirroring `tm`/`egg`)
  — doesn't track which in-game NPC/location teaches them; user flagged a
  future feature might want that, confirmed no shape/naming collision.
- `SCOPE.md` §2/§4 corrected (the "7 cases" claim, `MOVE_TABS_HISUI`'s
  stale "kept separate so this doesn't put a new Tutor tab on mainline"
  reasoning).
- Verified: `node --check` on all 4 touched files; `verify_region_data.js`
  `--audit` PASS (0 discrepancies, 665 ids/668 moves/190 abilities/130
  items match the CSVs); `movesets_hisui.js` diff confirmed 4 changed
  lines total, all inside the `215:` block, still 241 entries; a render
  harness (`temp/tutor-tab-hisuian-priority/render_check.js`, adapted from
  0.2.18's) against real `app.js` function bodies, 18/18 PASS.

Handoff: `temp/handoff/2026-09-06-031550-tutor-tab-hisuian-priority.md`.

---

## 0.3.9 → 0.3.10 — Cross-region wild encounters: 7 mainline regions gain foreign-species Found In data (`coder` ×2)

User noticed the Found In module only ever showed a species in its own
native region and asked to scope out whether other regions' encounter data
existed. Architect audit of `csv/encounters.csv` (joined against
`pokemon.csv`/`species.csv`'s `origin_region`) confirmed: every mainline
region's classic pipeline only ever extracted a species' *own*-region
appearances, even though the source table is full of species reappearing
in *other* regions' games (e.g. Pidgey — Kanto-native — has real encounter
rows in X/Y's Kalos routes). Quantified per region (foreign species /
foreign rows found): kanto 41/673, johto 231/17,453, hoenn 135/2,409,
sinnoh 242/10,165, unova 219/3,971, kalos 314/2,548, alola 360/3,338.
**Galar excluded by user decision** — its foreign rows are ~90% Max Raid
Den/Dynamax Adventure (a rotating catch pool, not a fixed location),
scoped as a separate future decision. Paldea/Hisui excluded by definition
(zero PokeAPI `encounters.csv` rows exist for either).

- **`tools/populate_from_csv.js`** extended: the existing native-region
  byArea/method/games extraction (unchanged for the native case) was
  lifted into a reusable `buildClassicAreas(ident, region)`, then called
  once more per species for each of the 7 approved foreign regions
  (`FOREIGN_REGIONS` constant) that isn't that species' own region,
  prepending results into `extra[foreignRegion]` — reusing the exact
  `extra`-merge mechanism `assemble()` already had for SV/BDSP/LA data (no
  changes to `assemble()` itself; it already handled "any region key on
  any species").
- **Real numbers from the actual run**: alola 347 species/+1,188 enc
  lines, kalos 313/+704, sinnoh 242/+1,455, johto 231/+2,447, unova
  219/+896, hoenn 135/+480, kanto 41/+83. Total enc lines 14,268 → 21,521
  across 564 changed ids. Six of seven region counts matched the pre-audit
  estimate exactly; alola's estimate counted non-default forms the real
  (default-form-only) extraction can't reach.
- **Found In chips sorted into canonical region order** (`foundInRegions()`)
  — a species can now carry 3-5 chips (was usually 1-2), so insertion
  order (native region first, then whatever order extraction happened to
  add foreign ones) stopped reading sensibly; sorted by `REGIONS`' own
  array index instead, matching the region bar's left-to-right order.
  478 of 707 multi-region species' chip order changed as a result.
- Verified: native-case regression checked **byte-identical across all
  1025 ids** (not a sample) via a harness re-running `extractFromCsv()`
  before/after; every pre-existing area survives verbatim as the tail of
  its region's array (new data strictly prepended, 0 keys lost/shrank);
  Galar/Paldea/Hisui confirmed untouched (0 new keys); `verify_region_data.js`
  PASS. Chip-sort verified across all 1025 species (region indices
  monotonic, same key set/length before and after).
- **Known, accepted, pre-existing (not new to this pass)**: a species'
  foreign-region areas use that region's own PokeAPI-derived vocabulary
  verbatim, so e.g. a Bulbasaur `johto` entry can legitimately read
  "Pallet Town" (HGSS's Kanto post-game, filed under the `johto` version
  groups) — the same convention the native pipeline has always used, just
  newly visible at this scale. Sinnoh's duplicate-area-name count (item 2,
  0.3.9's `mergeAreasByName()`) rose from 59/40 species to 229/119 —
  already handled at render, not a new bug, just more collisions to merge.

Handoff: `temp/handoff/2026-09-06-023418-pla-moveset-split.md`.

---

---

