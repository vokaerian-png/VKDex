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

**Current version: 0.3.5.**

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

## 0.2.17 → 0.2.18 — Legends: Arceus learnsets split from mainline movesets (`coder`)

User-directed, from a real screenshot catching Bidoof (#399) missing TM/Egg
tabs entirely. Root cause: `tools/populate_region.js`'s moveset extractor
picked one "best" version group (highest `order`) per species for
level-up/TM/egg/tutor alike; PLA (`legends-arceus`, `order=26`, the highest
in the clone) structurally has zero TM/egg rows, so whenever it won that
species' real TM/egg lists were silently wiped — **55 of 665 populated
species** affected (Bidoof's real mainline data replaced by nothing).

User's call after seeing the scope: don't just re-rank the selector — PLA's
learnset data has genuinely different mechanics from every mainline game
and should never be merged into mainline data again, full stop.

- **`movesets.js`'s version-group selection** now excludes PLA unless a
  species has zero non-PLA moveset rows at all (only the 7 `hisuiOnly`
  species qualify, and their own `movesets.js` entries turned out to
  already be SV/DLC-sourced, not PLA — unaffected). Fixes the 55-species
  wipe as a side effect: all 55 now resolve to BDSP (`order` 25, beats
  every other non-PLA group for these species), zero lost level-up data,
  zero stray `mastery` fields left in mainline data. Bidoof: 30 TM / 7 egg,
  from BDSP.
- **New `src/data/movesets_hisui.js`** (`MOVESETS_HISUI`, 241 entries):
  PLA's own level-up (with `mastery`) + tutor lists, extracted independently
  of the mainline pick, `{levelUp, tutor}` per id with an empty key omitted
  (`SCOPE.md` §2). 17 entries needed a non-default-form fallback (16
  Hisuian regional forms + Giratina-Origin + Basculin-white-striped, whose
  base species row carries no PLA data) — where a species has PLA rows on
  *both* base and Hisuian form (7 cases, e.g. Sneasel), the base currently
  wins; `TODO.md` #13 flags whether the Hisuian form should instead, given
  the Hisui screen already defaults to that forme. Porygon2 (#233) has no
  PLA rows in the source clone at all — 241/242, not a bug.
- **Detail screen**: the Learnable Moves card reads `MOVESETS_HISUI` instead
  of `MOVESETS` only when opened from the Hisui screen (`SCOPE.md` §4) —
  reuses the existing Hisuian-auto-forme nav signal (`autoForme` in
  `openDetail()`), no second context-tracking mechanism. Its own two-tab
  list, `MOVE_TABS_HISUI` (Level-Up/Tutor) — kept separate from mainline's
  `MOVE_TABS` (Level-Up/TM/Egg/Max) since `tutor` data has existed since
  0.2.5 with no UI tab at all, and adding one to the shared list would have
  put a new Tutor tab on 58 mainline Unova screens unrequested (`TODO.md`
  #13's second item — a one-line change if wanted generally).
- `index.html`/`electron-app/copy-app.js` updated for the new data file.
  `tools/verify_region_data.js` extended (one shared move-resolution
  checker reused for both files, per spec) and `--audit` extended with a
  `movesets_hisui` block, verified to actually fire (a deliberate 1-row
  deletion was caught and reported).
- **+17 moves** newly surfaced (`data/moves.js` 651→668): 15 PLA-only, plus
  2 (Parting Shot, Power Shift) surfaced by the mainline fix itself once
  BDSP/PLA entries became writable — all hand-authored, house-style
  original paraphrases.
- Verified: `node --check` on all 8 touched files; `verify_region_data.js`
  PASS (0 failures); `--audit` PASS both before and after (0 discrepancies);
  the regeneration is idempotent (byte-identical on a 4th run);
  `movesets.js` diffed against a pre-edit backup — 610/665 byte-identical,
  the other 55 exactly the predicted PLA set, zero regressions; a
  render-harness against the real `app.js` function bodies (15/15); a
  clone-wide grep confirmed `legends-arceus` is the only version group with
  moveset rows but no TM/egg rows that any populated species actually
  resolves to.

Handoff: `temp/handoff/2026-09-06-023418-pla-moveset-split.md`.

---

## 0.2.16 → 0.2.17 — Release script retargeted for Tauri (Android / Windows / Both) + mobile entry-point split (`overlord`)

`overlord` (fable), user-invoked. Spec'd by architect after two user
answers: scope Android's never-done first-time setup in as *instructions*
(not executed — no SDK anywhere reachable), and debug-signed APKs only.

- **`src-tauri/` mobile entry point** (the `create-tauri-app` shape): new
  `src/lib.rs` holds `mod resize_lock` (still `cfg(windows)`) and the
  `tauri::Builder` block as `pub fn run()` under `#[cfg_attr(mobile,
  tauri::mobile_entry_point)]`, menu-null/resize-lock comments moved with
  it; `src/main.rs` is a shim calling `vkdex_lib::run()`; `Cargo.toml`
  gains `[lib] name = "vkdex_lib"`, `crate-type = ["staticlib", "cdylib",
  "rlib"]`. Windows-only deps block untouched. **Not compiled** (no Rust
  here) — next local `npm run dev`/`build` is the real check that desktop
  still works.
- **`tools/release.js` rewrite** (`CLAUDE.md` §2a for the current
  behavior): version check now `APP_VERSION` vs `tauri.conf.json` *and*
  `Cargo.toml` (Electron comparison gone); after the unchanged git/tag/
  changelog checks, a 3-way target menu (`--target=android|windows|both`
  skips it), a printed summary, and a mandatory `Proceed? [y/N]` on every
  run, dry-run included. Windows = `npm run build` → `src-tauri/target/
  release/vkdex.exe` (matched case-insensitively — Tauri may name it
  `VKDex.exe`) → `releases/windows/VKDex-vX-windows-x64.zip`. Android =
  refuses without `src-tauri/gen/android/app`, else `npm run
  build:android` → recursive search of `gen/android/app/build/outputs/apk/`
  (prefers a `universal` APK, lists the tree if none) → copied to
  `releases/android/VKDex-vX-android-debug.apk`. "Both" builds
  sequentially and publishes both files on one `gh release create`. Prompts
  read readline's async line iterator, not `rl.question()` — the latter
  silently drops a piped second line and exits 0 (found by test). `gh`
  check moved before the build (fail-fast). `--check` now also asserts
  `parseTarget`/`walkFiles`/`pickApk` on a throwaway Gradle-shaped tree.
  Verified: `node --check`, `--check` all green, and a full scratch-repo
  end-to-end (fake exe/APK, local bare origin, stub npm scripts): abort,
  garbage input, bad `--target`, dry-run "both", and the three failure
  branches all behave.
- **Root `package.json`**: `"build:android": "tauri android build
  --debug"`. **`.gitignore`**: `/releases/`. **New
  `src-tauri/ANDROID_SETUP.md`**: Android Studio → SDK/NDK/JDK → env vars →
  `rustup target add` (4 Android targets — a step the spec lacked) → `npx
  tauri android init` → build; debug-keystore note.
- **Flagged, not changed**: `.gitignore`'s uncommitted trailing
  `src-tauri/` line ignores the whole Tauri folder (`git ls-files
  src-tauri` is empty), contradicting `CLAUDE.md` §1 "src-tauri/ is
  tracked" and making the `/src-tauri/target`/`gen` lines dead — not in
  this spec, needs the user's call. `--debug` flag / APK subpath are
  assumptions until the first real Android build.
  Handoff: `temp/handoff/2026-09-05-120133-release-multi-target.md`.

**Real-world confirmation, same day**: user fixed the `.gitignore` issue
above and committed `src-tauri/` for real. First-ever `ANDROID_SETUP.md`
run hit two live gotchas, both folded back into that doc — Gradle 8.14.3
can't run on this machine's JDK 25 installs (Android Studio's bundled JBR
included, not the safe default first assumed; pinned via `gradle.
properties`'s `org.gradle.java.home`), and a harmless Kotlin-daemon
fallback on cross-drive paths (project `E:`, `cargo` registry `C:`). Both
the Android and Windows `--dry-run` builds, then a real `--target=both`
non-dry-run, all succeeded — `v0.2.17` tagged, pushed, and published with
both assets on one GitHub Release. **User decision**: the debug-signed
universal APK (731.9 MB) is too large to keep shipping — 0.2.17 is the
only intentional Android release until that's fixed (`TODO.md` #1,
`PLAN.md`'s Tauri entry).

---

## 0.2.15 → 0.2.16 — Resize lock: stateless corner rule (`overlord`)

**Local test round 1 of the native lock (0.2.15, user):** "Dragging from
the side of the window, or the bottom of the window resulted in
continuous, smooth resizing. Dragging from corner resulted in extreme
jittering. No errors logged." So the subclass compiles, installs, and
Windows honors the rewritten rect — only the corner branch was wrong.

**Diagnosis:** `fit_rect` picked the corner's driving axis by comparing the
proposed size against the live client size (`GetClientRect`) — the
"larger per-step delta" rule inherited from `lockAspect`, valid only if
Windows re-based each `WM_SIZING` proposal on the rect we returned last
time (the module's ReactOS-derived assumption). Windows instead proposes
each step from the cursor's absolute position while the live window
carries our on-ratio rect, so the off-axis difference is huge every step
and the axis flip-flopped (400x889 → 365x812 → ... on a bottom-right
drag). Under the re-basing model an axis flip can only change growth
*speed*, never direction — the extreme jitter alone rules that model out.
The stash-the-last-returned-size fix pre-flagged in 0.2.14's handoff would
not have helped: with DragFullWindows on, `GetClientRect` *already* equals
the last returned rect, so a stash holds the same value and jitters the
same way.

**Fix (`src-tauri/src/resize_lock.rs`):** the corner rule is now a pure
function of the proposal — `prop_h * ASPECT > prop_w` → height drives,
else width — i.e. the smallest 360:800 client rect containing the
proposal, which keeps the cursor on one of the two moving edges and is
continuous in the cursor position. `fit_rect` loses its `cur_client`
parameter (chrome measurement still uses `GetClientRect`); no static
state, nothing to reset at drag boundaries, no `WM_ENTERSIZEMOVE`
handling. Module doc rewritten to state the real Windows behavior. Tests:
3 updated to the new signature, corner test gains a taller-than-ratio
case, plus a new `corner_axis_is_stable_across_cursor_steps` regression
test (two successive cursor positions; the old rule yields 365x812 on the
second, the new one 402x893). Verified: arithmetic hand-checked and
replicated in Node; brace balance; `windows` 0.61 type shapes unchanged
from 0.2.14's cross-check. **Not compiled** (no Rust toolchain in-sandbox,
`CLAUDE.md` §4) — the user's next `npm run dev` is local test round 2.
Untouched: `src/app.js` `lockAspect`, `tauri.conf.json`, `main.rs`.

**Local test round 2 (user, same day):** "Fix worked, problem solved."
Native resize lock is confirmed on real hardware — the Tauri migration's
last open item. `electron-app/` is no longer the fallback for this
specifically (`CLAUDE.md` §2b/§2); next session retargets `tools/
release.js` for Tauri, then cleans up Electron (`PLAN.md`).
Handoff: `temp/handoff/2026-09-05-113806-corner-jitter-fix.md`.

---

## 0.2.14 → 0.2.15 — aria-hidden focus-retention fix (`coder`)

Fixed 4 real Chromium console warnings ("Blocked aria-hidden on an element
because its descendant retained focus"), unrelated to the Tauri migration:
`closeMenu`/`closeDetailPopup`/`closeDetail`/`closeSettings` in `src/app.js`
each set `aria-hidden="true"` on a container while a focusable child inside
it (the button that triggered the close) still held focus. Fix: a 1-line
guard before each `setAttribute` — `if (CONTAINER.contains(document.
activeElement)) document.activeElement.blur();` — inline at all 4 sites, no
shared helper (they share no common close path). Verified: `node --check`
clean, plus a re-runnable structural check confirming all 4 sites are
guarded (`temp/handoff/2026-09-05-112620-aria-hidden-fix.md`). **Needs
local retest** — no browser in-sandbox to confirm the warnings are actually
gone. Flagged, not acted on: `src-tauri/Cargo.lock` still reads `vkdex
0.2.13` (stale since before this pass; `cargo` rewrites it on next build).

---

## 0.2.13 → 0.2.14 — Native Tauri resize lock (WM_SIZING), unconfirmed

User chose a true live aspect lock over keeping 0.2.13's settle-then-snap
JS fallback, knowing it needs native code that can't be compiled in the
Cowork sandbox (no Rust toolchain, `CLAUDE.md` §4) and will take at least
one local compile-fix round. `overlord` (fable) built it:

- **New `src-tauri/src/resize_lock.rs`** (Windows-only, `#[cfg(target_os =
  "windows")]` on the `mod` and the setup call): gets the main window's
  HWND via `raw_window_handle::HasWindowHandle` on
  `app.get_webview_window("main")`, then `SetWindowSubclass`es it. The
  subclass proc handles `WM_SIZING` — the message Windows sends with the
  *proposed* outer rect on every mouse step of a border drag — and rewrites
  that rect before Windows applies it, so the window is on-ratio *during*
  the drag, the way Electron's `setAspectRatio` felt. Everything else goes
  to `DefSubclassProc`. Chrome size (`GetWindowRect` minus
  `GetClientRect`) is re-measured per message, so DPI/monitor changes need
  nothing special. Edge drags: the dragged axis drives, the other is
  derived; corners: whichever axis this mouse step moved more (width on a
  tie — same rule as `app.js`'s `lockAspect`; Windows re-bases each step
  on the rect handed back last time, so per-step comparison is correct).
  Only the dragged edge(s) move; client size floored at 360x800. The pure
  `fit_rect` logic has three `#[cfg(test)]` cases (`cargo test` in
  `src-tauri/`, Windows).
- **`src-tauri/Cargo.toml`**: Windows-only deps `raw-window-handle = "0.6"`
  and `windows = "0.61"` (features `Win32_Foundation`, `Win32_UI_Shell`,
  `Win32_UI_WindowsAndMessaging`) — both versions already in `Cargo.lock`
  via tauri, so no new crate sources.
- **`src-tauri/src/main.rs`**: `.setup()` calling `resize_lock::install`.
- **Untouched, deliberately**: `src/app.js`'s `lockAspect` stays as a
  defense-in-depth no-op (window already on-ratio when its `resize` fires,
  so the epsilon check passes); `tauri.conf.json`, capabilities, icons.
- **Unverified** — no `cargo` here. Expected first-compile-error causes and
  the local test procedure: `temp/handoff/2026-09-05-111229-native-resize-lock.md`.

---

