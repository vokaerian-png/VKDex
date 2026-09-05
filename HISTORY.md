# VKDex — Version History

Versioning format is **major.minor.regular** (e.g. `0.1.0`): the last
("regular") number is bumped by 1 for every `src/`/`electron-app/` change,
up to a max of 999, mirrored in `src/data.js` (`APP_VERSION`) and
`electron-app/package.json` (`"version"`). Memory-bank-only and `tools/`-
only edits are exempt. The authoritative policy is `CLAUDE.md` §3 — this
file is just the log, newest entry first. Current-state descriptions live
in `CLAUDE.md`; entries here record what changed and why.

**Current version: 0.2.6.**

---

## 0.2.5 → 0.2.6 — Descriptor lines for 4 evolution edges found in 0.2.5's CSV scan

`coder` only, low effort, small mechanical follow-up. User approved exact
wording for the 4 unlabeled-condition edges 0.2.5 flagged; shipped via the
**existing** `note` mechanism (`SCOPE.md` §4's descriptor line), no new
field or rendering path: Qwilfish→Overqwil (`note` on 211), Stantler→
Wyrdeer (234), Basculin→Basculegion (550), and Sliggoo→Goodra — but that
last `note` had to go on **Goomy (704)**, not Sliggoo, since
`evoDescriptorHtml()` only reads `note` off the chain **root**; renders
chain-wide same as every other case. Pre-flight confirmed none of the 4
chains already had a `note`/`statCompare`/`gender` conflict.

- Verified: `node --check`; `verify_region_data.js` PASS; a harness
  `vm`-loading the real data and replicating `evolutionRootId()` confirmed
  all 4 resolve to a root carrying the exact approved string; diff is 4
  lines in `evolutions.js` + the version bump.

## 0.2.4 → 0.2.5 — TODO #10 schema-gap batch: 9 data additions, 2 new files, no UI

`coder` only (Cowork `general-purpose`+opus, high effort — the largest
single data dispatch to date). User went through `TODO.md` #10's 17
remaining schema gaps one at a time (architect asked individually);
everything marked "ship" landed here as pure data, no UI wiring.

- **`pokemon.js`** (+5 fields): `hasGenderDifferences` (95 ids — byte-
  identical to `hasFemaleSprite`'s set, a cross-check not a substitute),
  `habitat` (name, 386), `formsSwitchable` (59), `baseExperience` (522),
  `regionalDexNumbers` (503 — one key per mainline region resolved via a
  new pokedex-variant tie-break in `populate_region.js`, so a future region
  pass gets this free; Kalos excluded — no unambiguous single regional
  pokedex exists among its 3 sub-dexes; Hisui excluded, `hisui.js` already
  owns that numbering).
- **`stats.js`**: `hatchCounter` and a full `effort` (EV yield, 6 keys,
  always written including all-zero) on all 522.
- **`movesets.js`**: `tutor` array (only Wormadam non-empty) and a per-
  level-up-row `mastery` value — not the no-op expected, 384 rows across 54
  Legends: Arceus-era species. `app.js`'s 4-tab Moves card ignores the new
  key, as intended.
- **Evolution conditions cross-checked, nothing added**: scanned all 11
  unused `pokemon_evolution.csv` columns against every in-range edge. 5 hit
  — Eevee→Sylveon was already correctly classified; the other 4 (Sliggoo→
  Goodra, Stantler→Wyrdeer, Qwilfish→Overqwil, Basculin→Basculegion) have
  no short arrow label that wouldn't need invented wording, so `coder`
  flagged rather than guessed (same precedent as 0.1.29's "labels judged
  out of scope"). Left as `"other"` for now — `TODO.md` #10 has the 3
  concrete options if this gets revisited.
- **`moves.js`** (+6 fields, all 622): `priority`, `target`, `effectChance`,
  `flags`, a nested `meta` (hit/turn counts, drain, crit rate, ailment —
  nested to avoid colliding with the existing top-level `category`).
- **Other-language names**: `abilities.js` (179)/`moves.js` (622) gain a
  `names` sub-object; new `types.js` export `TYPE_NAMES` (18). Same 5
  languages as `data/names.js` (ja/jaRomaji/fr/de/ko); a language with no
  CSV row is omitted rather than written `null` (move/ability names have
  zero romaji rows — would've been 801 meaningless nulls). Not wired to any
  popup yet.
- **2 new files**: `data/natures.js` (`NATURES`, 25 — neutral natures get
  an empty object, not both keys pointing at the same stat, to avoid a
  naive `×1.1`/`×0.9` consumer landing on 0.99) and `data/experience.js`
  (`EXPERIENCE_CURVES`, 6 curves × 101 entries, indexed by level with index
  0 an unused placeholder). Both wired into `index.html`/`copy-app.js`.
- **Pipeline bug caught and fixed**: a `--refresh --tables pokemon` would
  have silently dropped `hasFemaleSprite` from all 95 entries — the writer
  now carries it over. `evolutions.js`'s `statCompare`/`note` are the only
  fields left that a refresh would drop.
- `SCHEMA_GAPS`: 28 → 15 groups.
- Verified: `node --check` on all 14 touched/new files; `verify_region_
  data.js` PASS; `--audit` PASS (0 discrepancies) — extended to cover every
  new field, not just pre-existing ones; a byte-diff harness confirmed
  every pre-existing key on every entry in all 6 rewritten files is
  unchanged; hand spot-checks against the raw CSVs for dex numbers,
  natures, move flags/meta/target, priority, and both new tables' values;
  a smoke test of the new-species code path (id 494, not written) to
  exercise the one path the 522-id refresh doesn't.
- **Explicitly deferred, not touched**: `color_id`/`shape_id` (user:
  genuinely out of scope for the project, not "later"), egg groups,
  encounter detail (`encounters.csv`), and `TODO.md` #8's item data — all
  parked for a future `overlord` pass.

## 0.2.3 → 0.2.4 — Gender toggle disabled while an alt forme is active

`coder` only, small user-confirmed follow-up to 0.2.3 the same session: on
the 16 species with both `hasFemaleSprite` and an `ALT_FORMS` entry,
tapping the male/female toggle while a non-base forme was active changed
nothing visible (no gendered alt-forme art exists) — confusing, not
broken. The two `.gender-btn`s now get the native `disabled` attribute
(blocks click/keyboard/tab-order, not just a CSS dim) whenever
`setActiveForme()`'s forme isn't base, restored the moment base is
reselected; `.gender-btn-active`'s filled state stays visible underneath
so the remembered choice doesn't appear to reset. One `querySelectorAll`
loop in `setActiveForme()`, naturally a no-op for species with no
`ALT_FORMS` entry or no female sprite.

- Verified: `node --check`; a 16-assertion harness (real `setActiveForme`
  source, stub DOM) — all 16 overlap species looped (not just one),
  Combee (female art, no alt formes) never dims, Charizard (alt formes, no
  female art) unaffected, 0 buttons unchanged for every other species;
  0.2.3's own 44-assertion harness re-run clean; `verify_region_data.js`/
  `--audit` both PASS (expected no-ops, confirmed not assumed); `styles.css`
  balanced.

## 0.2.2 → 0.2.3 — Gender symbols on evolution arrows; male/female sprite toggle; 95 species get bundled female art

`coder` only, user-specified feature (screenshots of a mocked-up Snorunt
evolution card and a Combee detail screen with hand-drawn button
placement). Architect moved the sprite assets into place directly first
(the `src/data/sprites/` asset-curation carve-out, `CLAUDE.md` §5) —
`temp/home/female/`+`shiny/female/` (103 files each) copied to
`src/data/sprites/pokemon/female/`+`shiny/female/`, mirroring the existing
normal/shiny layout.

- **Gender glyph on evolution arrows**: any `gender`-field edge (5 shipped
  — Wormadam/Mothim/Vespiquen/Gallade/Froslass) now shows a small ♂/♀
  glyph (Unicode, not new SVG art — blue `--accent`/new `--accent-pink`) in
  `evoArrowIconsHtml()`'s icon row, **alongside** any existing item/heart
  icon rather than replacing it. Combee→Vespiquen (previously icon-less)
  now shows just the glyph.
- **Gendered parent sprite in the Evolution Line row**: a row's parent
  bubble shows that edge's required gender's bundled art instead of the
  default sprite, when the parent has one. Of the 4 gendered-edge parents
  (Burmy/Kirlia/Snorunt/Combee), only **Combee** actually has bundled
  female art — the only currently-visible case; the fan-out layout (one
  shared root bubble) isn't wired for this, no shipped fan chain is
  affected.
- **95 `POKEMON_DATA` entries gain `hasFemaleSprite: true`** — cross-
  referenced from the moved sprite files (103 total; 7 are real species not
  yet populated, `TODO.md` #2; 1, `10235`, is Hisuian Sneasel's alt-forme
  id, not a species id, deliberately left unwired, `TODO.md` #4). Hand-
  derived, not CSV-sourced — won't survive a `--refresh --tables pokemon`.
- **Male/female toggle on the Picture card**: two absolutely-positioned
  `.gender-btn` circles, rendered only for a `hasFemaleSprite` species.
  New `pictureSpriteUrl(entry, forme, shiny)` is the single resolver both
  `pictureCardHtml()` and `setActiveForme()` now build sprite `src`s
  through, so an active alt forme and the gender choice can't disagree —
  forme wins the sprite (no gendered Mega/Gmax/regional art exists),
  gender persists in state and re-applies on revert to base (dimmed while
  a forme is active, fixed next in 0.2.4 above). `activeGender` resets on
  `openDetail()`, survives `rerenderDetail()` — same pattern as
  `activeFormeKey`.
- Verified: `node --check`; a 44-assertion harness (real shipped source,
  `vm`-run against real data) covering the 95-id set, both sprite files
  per id, all 5 gendered edges' glyph+existing-icon, Combee's swapped
  parent sprite vs. Burmy/Kirlia/Snorunt's unswapped ones, button
  presence/absence, default-male state, and the forme/gender interaction;
  `verify_region_data.js`/`--audit` PASS (expected no-ops); `styles.css`
  balanced; UTF-8 byte-level check on both glyphs.

## 0.2.1 → 0.2.2 — Evolution `gender` descriptor extended to 3 more species

`coder` only, user-confirmed follow-up to 0.2.1 the same session: Combee→
Vespiquen (its only edge — males never evolve), Kirlia→Gallade, and
Snorunt→Froslass all get a `gender` field (female/male/female) alongside
Burmy's. These 3 weren't in 0.2.1 because their sibling branches already
show different labels (level vs. item) — not ambiguous the way Tyrogue/
Burmy/Wurmple were — but the gender requirement itself was invisible, and
the user chose to surface it anyway.

- **Real bug caught in verification**: `evoDescriptorHtml(root)` only read
  the chain root's own edges. Burmy/Combee/Snorunt/Tyrogue are all roots,
  so 0.2.1 worked by accident; **Kirlia isn't a root** (Ralts is), so
  Kirlia→Gallade's `gender` would never have rendered. Fixed by collecting
  every edge across the full `evolutionPaths(root)` walk instead of just
  the root's. Consequence, not a bug: the card is chain-wide, so Ralts/
  Kirlia/Gardevoir/Gallade all show one "Evolves based on gender." line —
  same as Wormadam/Mothim already did.
- `tools/populate_region.js`: hardcoded `GENDER` map (`genders.csv` is 3
  static rows), evolution extractor now writes `gender` from `gender_id`,
  `EVO_KEYS` gains `"gender"` for `--audit`, `--gaps` drops `gender_id`.
  A future `--refresh --tables evolutions` now round-trips all 5 gendered
  edges instead of reverting them.
- **Still hand-authored, still refresh-fragile**: Tyrogue's `statCompare`
  and Wurmple's `note` — no CSV column backs either.
- Verified: `node --check` all 4 touched files; a harness running the
  *real* `app.js` walkers (not stubs, to actually catch the Kirlia bug) —
  descriptor on exactly 21 ids / 6 chains, 501 others clean, one note per
  card; `--audit` proven to catch the field (flipped Combee's gender,
  confirmed the audit line, reverted); `verify_region_data.js` PASS;
  round-trip check confirms `--refresh` reproduces all 5 edges byte-exact.

## 0.2.0 → 0.2.1 — Double-press back nav; evolution branch descriptors; 5 species-flag fields

`coder` only, three user-confirmed features shipped as one bump.

- **Double-press-to-skip back navigation** (`TODO.md` #11): a second press
  within 400ms of the first jumps past the rest of `detailHistory` straight
  to closing the detail screen, instead of popping one entry; a press
  ≥400ms later is a fresh single pop. One guard in `backDetail()` — the
  single point all 4 triggers (on-screen arrow, Escape, Backspace, mouse
  button 3) already funnel through, so no per-trigger duplication.
  `backOut()`'s outer layers (settings/drawer/popup) are untouched, still
  one press per layer even at zero delay — verified explicitly.
- **Evolution-line descriptor** (`TODO.md` #12): a CSV sweep (cross-checked
  against the real shipped `evolutions.js`) found exactly 3 chains with
  sibling branches rendering an identical, ambiguous label — Tyrogue (all
  "Lv 20", real trigger is Attack-vs-Defense), Burmy (both "Lv 20", real
  trigger is gender), Wurmple (both "Lv 7", a hidden personality value with
  **no CSV column at all**). Tyrogue's 3 edges get a new structured
  `statCompare` field, Burmy's 2 get a new structured `gender` field,
  Wurmple's entry gets a hand-authored top-level `note` — new
  `evoDescriptorHtml()` renders one line at the bottom of
  `evolutionCardHtml()`'s card, keyed off whichever field is present (not
  species id), reusing the existing `.detail-section-note` class. Renders
  on all 12 ids across the 3 chains (a card shows its whole chain from the
  root) — 510 other species unaffected.
- **5 new `pokemon.js`/`stats.js` fields, all 522 ids** (`TODO.md` #10
  slice): `isLegendary`/`isMythical`/`isBaby`/`genderRate` (`pokemon.js`,
  booleans emitted only when true) and `baseHappiness` (`stats.js`), sourced
  from `pokemon_species.csv` via `populate_region.js --ids <522> --refresh
  --tables pokemon,stats`. Pure data — no detail-screen UI wiring this
  pass. `--audit` extended to cover all 5 (still 0 discrepancies).
  `SCHEMA_GAPS` pruned 29 → 28.
- Verified: `node --check` on every touched file; a byte-diff of
  `pokemon.js`/`stats.js` against pre-edit backups confirmed **no**
  pre-existing field or key order changed on any of the 522 entries; an
  independent hand-parse of `pokemon_species.csv` cross-checked all 5 new
  fields on all 522 ids; `verify_region_data.js` PASS; `--audit` PASS (0);
  4 harnesses (one per checked behavior) all green.
- **Flagged, not shipped this pass**: whether Combee/Kirlia/Snorunt should
  also get a `gender` descriptor (their branches already differ by label,
  so they weren't ambiguous) — resolved yes, shipped next as 0.2.2 (above).

## 0.1.40 → 0.2.0 — Friendship-row sprite alignment fixed; user-directed minor bump

`coder` only, user-spec'd from a real screenshot of 0.1.40's Eevee card.
**Version jump is deliberate and user-directed** — not the usual "+1 to the
last number"; 0.1.40's regular-number sequence isn't continued.

- **Root cause**: row 2 (Espeon/Umbreon/Sylveon) misaligned because
  Sylveon's icons (heart + "Fairy" type-pill) wrap to 2 lines inside
  `.evo-arrow-icons`'s 46px `max-width` (heart 13px + gap 2px + pill
  ~40.5px width > 46px), while Espeon/Umbreon's heart+sun/moon icons fit
  one line — so Sylveon's real content (~44.9px) exceeded the 0.1.40
  `min-height`s (32px), while Espeon/Umbreon's shorter content sat higher.
- **Fix**: one CSS declaration, `.evo-fan-branch .evo-arrow { flex: 1 0 auto; }`.
  `.evo-fan-row`'s default `align-items: stretch` already sizes every
  branch in a row to that row's tallest; `flex:1` lets `.evo-arrow` (not
  `.evo-stage`, which doesn't grow) absorb the leftover height, and the
  pre-existing `justify-content: flex-end` bottom-anchors each branch's
  icons/label at the same y, lining up the sprites below. Per-row, not a
  global worst-case constant — rows with no wrap (Tyrogue, Eevee's stone
  rows) gain no dead space, unlike the min-height-bump alternative
  considered and rejected.
- Verified: `node --check`; `styles.css` balanced (238/238); the 0.1.39
  render harness re-run, 26/26 unchanged (markup untouched — CSS-only fix).
- **Confirmed via user screenshot 2026-09-05**: row 2 (Espeon/Umbreon/
  Sylveon) now aligns correctly; Tyrogue's single-row fan renders
  correctly; rows 1/3 read pixel-identical to 0.1.40 — the stretch
  mechanism's assumption held.

---

## 0.1.39 → 0.1.40 — Evolution fan-out: row dividers, sprite alignment, one shared arrow

`coder` only, user-spec'd from a real screenshot of 0.1.39's Eevee card.

- **One shared arrow, not one per branch**: every branch in the fan-out
  layout evolves from the same root, so the per-branch down-chevron read as
  redundant. Removed from every `.evo-fan-branch`; one `.evo-fan-arrow`
  chevron now sits once between the root bubble and the branches. Each
  branch keeps only its own condition icons + label.
- **Explicit row groups with dividers**: branches now chunk into
  `.evo-fan-row` divs of `FAN_ROW_SIZE = 3` (matches what actually renders;
  a flex-wrap line break can't carry a CSS border, so explicit rows were
  needed either way). `.evo-fan-row + .evo-fan-row` gets a `var(--divider)`
  top border, same convention as the Facts card's `.detail-row`. Eevee
  reads 3/3/2, Tyrogue one row of 3.
- **Sprite alignment fix**: `.evo-fan-branch .evo-arrow-icons` gets
  `min-height: 18px` (the tallest icon case, an item sprite) and
  `.evo-fan-branch .evo-arrow` gets `min-height: 32px` — the second matters
  because `evoArrowIconsHtml()` emits no wrapper at all when a branch has
  no icons (Tyrogue's plain `Lv 20` branches), so without it a future
  mixed icons/no-icons row would misalign again.
- Verified: `node --check` on `src/app.js`; `styles.css` balanced
  (238/238); `verify_region_data.js` PASS; `--audit` PASS; the 0.1.39
  render harness (`temp/move-evo-fanout-0.1.39/check_evo_html.js`) extended
  in place, 26/26 assertions pass (root-once, exactly one shared arrow,
  row sizes [3,3,2]/[3], all move-trigger labels, non-fan species
  untouched).
- **Confirmed via user screenshot 2026-09-05**: shared arrow centering,
  divider spacing, and "Friendship" wrapping all read correctly. Row 2
  sprite alignment (Espeon/Umbreon vs. Sylveon) was still off — diagnosed
  and fixed in 0.2.0.

---

## 0.1.38 → 0.1.39 — "Knows a move" evolution trigger + evolution-line fan-out layout

`coder` only (via the Cowork `general-purpose`+opus workaround), user-spec'd.

- **New evolution trigger**: reuses the `"stone"` edge shape with a shared
  `item: "tm-normal"` icon plus a `move` field (the required move's display
  name), which `evoArrowLabel()` (`src/app.js`) now shows instead of "Stone".
  Closes `TODO.md` #7's 5 missing edges (Lickitung→Lickilicky/Rollout,
  Tangela→Tangrowth/Ancient Power, Aipom→Ambipom/Double Hit, Yanma→Yanmega/
  Ancient Power, Piloswine→Mamoswine/Ancient Power) and, user-confirmed,
  converts 2 pre-existing blank-arrow edges to the same mechanism (Bonsly→
  Sudowoodo and Mime Jr.→Mr. Mime, both "Mimic"). `tools/populate_region.js`
  (bump-exempt) updated alongside so `known_move_id` classifies into this
  shape instead of a blank `"other"` — otherwise a future `--refresh` would
  have silently reverted all 7 edges. `--audit` 5 → 0, closing `TODO.md`
  #10's last remainder.
- **Evolution-line fan-out layout**: a root with 3+ single-step branches
  (`evolutionPaths()` all length 2) renders as one root bubble plus a
  wrapping row of arrow+leaf pairs below it (arrow rotated 90°), instead of
  the old one-`.evo-row`-per-branch stack. User-confirmed to apply
  generally, not just to Eevee — Tyrogue (3 branches) also fans. Every
  other shape (straight chains, any branch with further depth) keeps the
  original per-path-row rendering, untouched. New CSS: `.evo-fan-branches`/
  `.evo-fan-branch`; `.evo-level` gained wrapping (`max-width`, dropped
  `nowrap`) since "Ancient Power" is wider than any prior one-word label.
- Verified: `node --check` on every touched `.js`; `styles.css` brace-
  balanced (235/235); `verify_region_data.js` PASS; `--audit` PASS (0); a
  scratch render harness (`temp/move-evo-fanout-0.1.39/check_evo_html.js`,
  19/19 assertions) confirmed Eevee/Tyrogue fan correctly with no repeated
  root bubble, and every other species' evolution card is unchanged.
- This entry's specific layout (4+4 wrap, per-branch rotated arrow) was
  superseded by 0.1.40 before ever being screenshotted — see that entry
  and 0.2.0 for the confirmed, current version. "Ancient Power"'s wrap
  fix itself (unrelated to the fan layout) hasn't shown up in a
  move-trigger screenshot yet.

---

## 0.1.37 → 0.1.38 — Reverted an unauthorized Facts-card reorder; 5 movesets fixed

`coder` only, no reviewer pass requested. The user reviewed a real
screenshot and caught that the detail screen's Facts card had Abilities
and Weakness in the wrong relative order — traced to 0.1.34's `overlord`
design-overhaul pass, which moved the Weakness/Resists/Immune/Neutral
matchups block from the end of the card up to directly under Type and
documented it as a settled finding, without ever actually getting real
user sign-off for that specific move.

- **Facts-card order reverted**: `factsRowsHtml()` (`src/app.js`) is back
  to the original 0.1.18 order — Type → Abilities → Category → Height/
  Weight → Capture Rate → Exp Growth → Weakness → Resists → Immune →
  Neutral. Confirmed against `temp/design-overhaul-2026-09-05/backup/
  src/app.js` (the real pre-0.1.34 shipped code) as the source of truth.
  Pure block-order change — no block's internal rendering touched.
- **New standing rule** (`CLAUDE.md` intro): cards and their internal data
  blocks never get reordered without an explicit user go-ahead for that
  specific move; a caught unauthorized reorder gets confirmed with the
  user, not silently kept or silently re-fixed. Added to `coder.md`/
  `overlord.md` too.
- **5 empty movesets fixed** (`TODO.md` #7): Pinsir/Tauros/Slowking/
  Sceptile/Rhyperior populated via `--refresh --tables movesets` with 5
  user-supplied, house-style-paraphrased move descriptions (Storm Throw,
  Raging Bull, Chilly Reception, Shed Tail, Rock Wrecker). `MOVES` 617 →
  622; CSV-extracted stats matched the source material exactly on all 5.
- Verified: `node --check` on `app.js`/`data.js`; `verify_region_data.js`
  PASS; `--audit` 20 → 5, all pre-known `TODO.md` #7 evolution edges.

## 0.1.36 → 0.1.37 — Farfetch'd apostrophe decided; Mega tag color; larger BST row

Three small user-directed fixes, `coder` only (no reviewer pass requested).

- **Farfetch'd**: `pokemon.js`'s stored name now uses the CSV's curly
  apostrophe (`Farfetch’d`, was a straight one) — user decided in favor of
  matching the CSV, resolving the last open item from `TODO.md` #10.
  `--audit` no longer flags it (123 → 21 → **20** discrepancies since the
  0.1.36 pass).
- **Mega/Gmax ability tag styled distinctly**: `altFormAbilityItemsHtml()`
  now adds a `mega-tag` class alongside `hidden-tag` when
  `forme.isMega`/`isGmax`; new `.ability-name .mega-tag` CSS — red
  background (`#c0392b`), white text, 1px black border — so it reads apart
  from the tan/gold `.hidden-tag` every other tag (including the plain
  "Hidden" ability badge) still uses. Chose a bordered pill over a
  text-stroke effect — at 9.5px/800-weight uppercase a stroke muddies the
  glyphs (the National Dex header's stroke works because it's ~26px type).
- **Stats table's Total/BST row enlarged**: new `.stat-total-row` class on
  that `<tr>`, 13px vs. the table's 11.5px base, to visually separate the
  BST total from the individual stat rows.
- Verified: `node --check` on `app.js`/`pokemon.js`/`data.js`; `styles.css`
  brace-balance check; `--audit` confirms Farfetch'd gone, the remaining 20
  lines are the pre-known `TODO.md` #7 set (5 empty movesets × 3 tables +
  5 missing evolution edges).

## 0.1.35 → 0.1.36 — CSV-audit tooling fixes (`coder`, reviewed by `reviewer`)

Worked through the 3 tooling-test findings the `--audit` pipeline surfaced
in 0.1.35 (`TODO.md` #10). Audit count 123 → 21 remaining (all pre-known:
`TODO.md` #7's 5 empty movesets + 5 missing evolution edges, plus the
Farfetch'd apostrophe below). `reviewer` independently re-verified every
change (re-ran `node --check`, `verify_region_data.js`, a full `--audit`,
and cross-checked all 91 hiddenAbility values against the PokeAPI CSVs
directly, bypassing the tool) — clean pass, no errors, no optimizations
flagged.

- **Sinnoh `hiddenAbility` backfill**: `pokemon.js` ids 387-487 gained 91
  `hiddenAbility` flags via `sinnoh --refresh --tables pokemon` — the
  ability name was already present in each species' `abilities` list, just
  unflagged, so the detail screen's "Hidden" badge never showed for Gen 4.
  Diff confirmed field-only (no other change to any of the 522 entries).
- **Celadon City** added to 4 Kanto species' `locations.js` lists (Pikachu/
  Clefable/Horsea/Dragonair — Game Corner prizes) via `kanto --refresh
  --tables locations`; confirmed the only 4 Kanto location discrepancies
  before applying.
- **`abilities.js`**: orphaned `"Cacophony"` entry deleted (verified zero
  references anywhere in `src/`/`tools/`) — now 179 entries.
- **`moves.js`**: 6-entry hygiene fix — `Struggle`'s `pp` `null`→`1`; `Hard
  Press`/`Snowscape`/`Tidy Up`/`Lunar Blessing`/`Take Heart`'s `power`
  `0`→`null` to match the file's null-for-no-value convention. `power`/`pp`
  have zero readers in `app.js`, so this is pure data hygiene.
- **Left open, needs a user call**: Farfetch'd's stored name uses a
  straight apostrophe vs. the CSV's curly one — still surfaces as 1
  `--audit` line until decided.
- Verified: `node --check` on all 5 touched files (both by `coder` and
  independently by `reviewer`); `verify_region_data.js` PASS; final
  `--audit` = 21, all pre-known.

## 0.1.34 → 0.1.35 — Post-overhaul fixes (user feedback on 0.1.34) + unified data pipeline

`overlord` pass, one bump for the five `src/` items; the pipeline work is
`tools/`-only (exempt). Backups of every touched file under
`temp/post-overhaul-fixes-2026-09-05/backup/`; `check.js` there is the vm
harness (forked from the overhaul's) covering all five app items.

- **Stat Level setting removed** — it was a real bug, not just unwanted:
  its two buttons carried `.grid-width-btn` for styling, and `app.js`
  selects `.grid-width-btn` wholesale for the Grid Width handler, so a
  50/100 tap ran `setGridCols(NaN)` and wrote `--grid-cols: NaN` (the
  "strange dex grid behavior"). Row, `vkdex-stat-level`, `setStatLevel()`
  and `.stat-level-btn` all gone; the stats table is back to **Base /
  Lv.1 / Lv.100** with the BST row spanning four columns. The 0.1.34
  radar changes (fixed 0–255 scale, 280×270) stay.
- **Measurements box-selector** replaces the "Imperial Units" switch:
  `#unitsControl` with Metric/Imperial `.units-btn` boxes (its own class,
  deliberately not `.grid-width-btn`), stacked under a "Measurements"
  label (`.settings-row.stacked`) since two text boxes don't fit beside a
  label in the 178px body. State/persistence/conversion unchanged, default
  metric.
- **Hide Neutral removed** — Neutral always renders again (`PLAN.md`'s
  matchup decision reverted to always-three-rows).
- **Card order reverted** to Picture → Alt Formes → Evolution → Found In →
  Facts → Moves → Stats. Only the stacking order; every 0.1.34 in-card
  change (matchups under Type, Stats content) is kept.
- **Mega/Gmax formes always tappable**: `altFormeTappable()` (any
  `isMega`/`isGmax`, or `altFormeSwaps()`) now drives the inert class,
  bubble 0's presence and the sprite/name swap in `setActiveForme()`;
  the facts-card swap stays gated on `altFormeSwaps()`. 50 of 63 Mega
  bubbles were inert before (only the 13 type-changers worked — Mega
  Charizard X was the reference). Deoxys/Castform/Hisuian behavior
  untouched; harness confirms 0 inert Megas, base bubble on all 57 Mega
  species, Deoxys still 3 inert / no base bubble.
- **`tools/populate_region.js` unified** (no bump): `--ids` species mode,
  `--refresh`, `--tables`, id-ordered in-place upsert for every table,
  `hiddenAbility` + `item`/`timeOfDay`/`moveType` written (the 0.1.33
  extractor captured them but the writer dropped them), Mega `altforms`
  extraction folded in, trigger classification fixed (`TODO.md` #7), and
  `verify_region_data.js` extended to `ALT_FORMS` + `hiddenAbility`.
  `backfill_empty_movesets.js`/`add_hidden_abilities.js` reduced to
  superseded stubs (manual deletion needed — the mount can't). Verified on
  a scratch copy: 4-region refresh byte-identical except id-sorted edge
  order; new-species add (Victini/Audino/Chespin) lands in id order with
  Mega Audino extracted; verify PASS throughout.
- Verified: `node --check` on all touched `.js`; `verify_region_data.js`
  PASS (522/617/180, 79 ALT_FORMS species / 137 formes); `check.js` all
  green. No visual check possible.

## 0.1.33 → 0.1.34 — Design overhaul (TODO #9, all 25 findings) + Mega Evolution data (TODO #5)

`overlord`'s first implementation pass (Fable, high effort), user-directed
as one coordinated bump. The rollback-capable per-change record — what
each change is, which finding it answers, files, backup path, how to
verify a revert — is `temp/design-overhaul-2026-09-05/DESIGN.md`, with
verbatim pre-change copies of every touched file under `backup/`, unified
diffs under `diffs/`, and `check.js` (a vm harness driving the real
`app.js` through ~40 assertions). Summary only here.

- **Navigation**: edge-zone 24 → 12px (no longer eats Back-button/Kanto
  taps); evolution-stage taps keep a back-history (`detailHistory`,
  `backDetail()`); ArrowLeft/ArrowRight step to the neighbouring national
  id; quick-search now scopes to whatever chip is active via one
  `dexSetFor()` + `queryMatcher()` filter (National + query lifts the
  `hisuiOnly` exclusion so all 522 stay findable); **the standalone Search
  screen is deleted** — the drawer icon opens the dex with quick-search
  focused; Galar/Paldea chips dimmed (`.region-chip.empty`); Escape/
  Backspace/mouse-back all run one `backOut()` chain; `main.js`
  `Menu.setApplicationMenu(null)` kills Ctrl+R & co.
- **Readability**: list/body padding ≥ the 14px mask fade; `.dex-number`/
  `.detail-key` opacity .65 → .8; move rows are left-aligned columns
  (level | type pill | name); arrow-pill 8 → 9.5px, `.evo-level` 9 → 10px.
- **Usability**: Dark Mode (`vkdex-theme`) and region chip (`vkdex-region`)
  persisted; `/` focuses quick-search, Enter opens a sole result;
  `rerenderDetail()` keeps the active forme across settings re-renders.
- **Settings** (window now `height:auto`): Shiny Grids, Stat Level 50/100
  (replaces the Lv.1 column), Hide Neutral, Pixel Sprites
  (`--sprite-rendering`) — keys `vkdex-shiny-grids`/`-stat-level`/
  `-hide-neutral`/`-pixel-sprites`.
- **Detail screen**: cards reordered Picture → Facts → Stats → Evolution
  → Alt Formes → Found In → Moves; matchup rows sit right under Type; Alt
  Formes renders the base as bubble 0 (segmented control; inert formes get
  `.altform-inert`; the hidden main-sprite revert is gone); a forme swap
  now also updates the shiny sprite and `#detailName`, and forme stat cards
  read "Base Stats — <forme>"; empty move tabs (always Max) aren't
  rendered; each move row shows its type pill; radar on a fixed 0–255
  scale at 1.75× radius (280×270); Found In says "No wild encounter data
  recorded." for a non-evolving species with no data (Enamorus fix).
- **Mega Evolutions** (`altforms.js` +63 formes / 57 species, all with
  normal+shiny art; `abilities.js` +12): CSV-authoritative via
  `temp/design-overhaul-2026-09-05/extract_megas.js`. Includes the 17
  Legends: Z-A / Mega Dimension Megas the CSV carries (official, not
  fan-made as `TODO.md` #3 had assumed) — flagged for user confirmation in
  `DESIGN.md`; Mega Heatran/Darkrai ship without an `ability` (no CSV
  row). Two mechanism tweaks: the singular `ability` field is now a name
  resolved in `ABILITIES` (normalized, not inline), and Mega/Gmax tags
  read the forme name minus the species ("Mega X"/"Mega Y").
- Verified: `node --check` on all 5 touched `.js`; `verify_region_data.js`
  PASS (180 abilities); `check.js` all green. No visual check possible.

## 0.1.32 → 0.1.33 — Evolution arrow condition icons (item sprites, friendship heart, day/night, move-type); 11 of TODO #7's missing edges resolved

Evolution Line arrows now show a small icon above the text label: the
required item's sprite for stone/trade/held evolutions (using 0.1.32's new
`items/` sprites — first real code consumer), a heart for friendship
evolutions, plus a sun/moon icon when a time-of-day condition applies and a
small type-pill tag when a specific move type is required (Sylveon).
Architect did the CSV verification directly (cross-checking every affected
row in `pokemon_evolution.csv`, including which of two valid methods to
show where a species has more than one) before handing coder a fully
pre-verified spec — `temp/evo-item-friendship-icons/verified-data.md`, kept
for reference.

- `src/data/evolutions.js`: new optional fields — `item` (slug, sprite at
  `data/sprites/items/{item}.png`), `timeOfDay` (`"day"`/`"night"`),
  `moveType` (lowercase type name) — and a new `method: "held"` (item
  required, held not traded, while leveling up). 52 edges now carry an
  `item`. Two `"other"` edges reclassified now that the data supports it:
  Nosepass→Probopass (`stone`, Thunder Stone) and Feebas→Milotic (`trade`,
  Prism Scale) — both have an older non-item method too (special location;
  Beauty condition) but the newer item method was chosen per user
  direction ("newest available data"). Two more `"other"` edges became
  `"held"`: Sneasel→Sneasler (Razor Claw, day), Happiny→Chansey (Oval
  Stone, day).
- **11 new evolution edges added** — real evolutions that were missing
  from the data entirely (verified against `pokemon_species.csv`'s
  `evolves_from_species_id`), resolving 11 of `TODO.md` #7's 16 missing
  edges (5 remain — all need a "knows a specific move" trigger with no
  label/icon yet): Misdreavus→Mismagius, Murkrow→Honchkrow, Magneton→
  Magnezone, Eevee→Leafeon, Eevee→Glaceon (all `stone`); Rhydon→Rhyperior,
  Electabuzz→Electivire, Magmar→Magmortar, Porygon2→Porygon-Z (all
  `trade`+item); Sneasel→Weavile, Gligar→Gliscor (both new `held`).
- `src/app.js`: `itemSpriteUrl()`; `evoArrowLabel()` gained a `"held"` →
  "Held" case; three hand-drawn inline SVGs (heart/sun/moon, no external
  asset, same philosophy as the existing arrow SVG); `evoArrowIconsHtml()`
  builds the icon row, reusing `pillHtml()` for the move-type tag rather
  than new markup. **Bug fix along the way**: `evolutionPaths()`'s walk
  only forwarded `{method, level}` into `via`, which would have silently
  dropped every new field — now passes the whole edge object through.
- `src/styles.css`: `.evo-arrow-icons` (wrapping row, capped width),
  `.evo-arrow-item` (18px), `.evo-arrow svg.evo-cond-icon` (13px, scoped
  past the blanket 20x14 arrow-SVG rule), a `:first-child` selector
  tinting the heart pink while a following sun/moon stays gold, and a
  parent-selector size-down for the reused `.type-pill`.
- `tools/populate_region.js`: evolution-extraction logic now captures
  `item`/`timeOfDay`/`moveType` and the row-selection rule (prefer blank
  `base_form_id`, then `trigger_item_id`, then `held_item_id`, then file
  order) for future region passes — not run to regenerate `evolutions.js`
  this pass; the hand-applied edits above are the shipped data.
- Verified: `node --check` on all touched `.js` files;
  `verify_region_data.js` unchanged pass (522/617/168, 0 out-of-range); a
  kept check script (`temp/evo-item-friendship-icons/check.js`) confirming
  all 52 `item` sprites exist on disk (except `black-augurite`/
  `peat-block`, which have no bundled art and degrade to no icon rather
  than a broken image — no generic item placeholder exists the way
  `pokemon/0.png` covers Pokémon), that the evolution-chain walk still
  terminates correctly for Eevee (now 8 leaves) and Sneasel (now 2), and
  that the updated tool logic reproduces 10 of the verified rows against
  the real CSVs.
- **Deferred**: item icons are decorative (`alt=""`, not tappable) — no
  `ITEMS_DATA` table exists to name them from; a tooltip/tap-to-name popup
  would need one, out of scope here.

## 0.1.31 → 0.1.32 — Sprite folder split into `pokemon/`/`items/`; code repointed

User manually reorganized `src/data/sprites/`: all existing Pokémon sprites
(normal/shiny/alt formes, same internal layout) moved into a new `pokemon/`
subfolder, and a new `items/` subfolder was added (898 flat item sprites +
7 subfolders of PokeAPI historical/version-specific art — berries/dream-
world/gen3/gen5/gen8/gen9/underground). `items/` isn't wired into any code
yet (no `ITEMS_DATA`, future work).

- `src/app.js`: 4 sprite-URL builders repointed at the new paths —
  `spriteUrl`, `spriteShinyUrl`, `altFormSpriteUrl`, and
  `SPRITE_ONERROR_ATTR`'s `0.png` fallback. These are the only 4 places a
  sprite URL is built.
- `src/data/altforms.js`: header comment's path references updated to
  match (no data change).
- `electron-app/copy-app.js`: **no change needed** — its sprite copy is one
  untargeted recursive `fs.cpSync` on the whole `data/sprites/` dir, so
  `pokemon/`/`items/` are picked up automatically. Confirmed by re-reading
  the file.
- Verified: `node --check` on both touched `.js` files; a harness
  `vm`-loading the real `altforms.js` confirmed all 74 `sprite` fields
  across the 22 `ALT_FORMS` entries resolve on disk (correcting for the
  `recolorOnly` vs. non-`recolorOnly` builder split — recolor entries
  render flat via `spriteUrl()`, not under `alt formes/`); 1025/1025
  normal + 1025/1025 shiny confirmed present at the new `pokemon/` paths;
  full-tree grep confirmed zero stale `data/sprites/` references remain.
- Coder flagged one build-size note (not actioned): the untargeted
  recursive copy means `items/`'s ~898 files now ship in every packaged
  build even though nothing uses them yet — acceptable, revisit only if
  build size becomes a real concern.

## 0.1.30 → 0.1.31 — Forme ability swap-on-tap; 1 new ability

10 of the 16 Hisuian formes have a real ability-set delta that the
singular `ALT_FORMS` `ability` field (rule 4's one tagged extra, reserved
for Mega/Gmax) can't represent. Added a separate plural mechanism rather
than stretching the singular one.

- `src/data/altforms.js`: new optional forme fields `abilities` (names, as
  in `pokemon.js`) and `hiddenAbility`, which *replace* the shown Abilities
  list while their forme is active — rule 9 extended from Type/Weakness to
  Abilities. Populated on Growlithe, Arcanine, Typhlosion, Samurott,
  Lilligant, Braviary, Sliggoo, Goodra, Avalugg, Decidueye; the other 6
  (Voltorb, Electrode, Qwilfish, Sneasel, Zorua, Zoroark) have no delta.
  Coder's own CSV re-check corrected two of architect's draft rows
  (Lilligant: Hustle is slot 2, hidden stays Leaf Guard; Avalugg: hidden
  is Sturdy, not none).
- `src/app.js`: `setActiveForme()`'s gate widened from `forme.types` to
  `forme.types || forme.abilities` so an abilities-only forme would still
  swap and highlight; `swapEntry` carries `abilities`/`hiddenAbility` from
  the active forme, base values on revert. The singular-`ability` append
  path (`altFormAbilityItemsHtml()`) is untouched and can't double up —
  no forme sets both.
- `src/data/abilities.js`: +Strong Jaw (→168). 6 other candidates already
  existed from earlier passes with slightly different phrasing, left
  as-is. Not alphabetical — append-order per pass, a pre-existing
  convention.
- Verified: `node --check`; a kept harness (`temp/verify_forme_abilities.js`)
  running the real swap logic against real data for all 22 entries (default/
  active/revert for the 10, inertness of the 6, Deoxys/Castform/recolor
  species unaffected, singular-append path regression-checked);
  `verify_region_data.js` passes (522 entries, 617 moves, 168 abilities).
- Reviewer step suspended from this pass on (user direction, token cost —
  `CLAUDE.md` §5).

## 0.1.29 → 0.1.30 — Evolution-arrow mislabel correction; 16 Hisuian regional-form alt-formes; `hisuiOnly` search reversal

**Fix A** — 8 of 0.1.29's 23 "Friendship" edges weren't friendship
evolutions: `tools/populate_region.js` had collapsed distinct triggers
(shed, beauty, special location, party species, held-item+time, knows-a-
move) into `method: "level"`. `src/data/evolutions.js`: those 8 flipped to
`method: "other"` (blank arrow — `evoArrowLabel()` already renders `""`
for an unrecognized method): Nincada→Shedinja, Feebas→Milotic, Nosepass→
Probopass, Mantyke→Mantine, Sneasel→Sneasler, Happiny→Chansey, Bonsly→
Sudowoodo, Mime Jr.→Mr. Mime. Precise labels (6 new strings) judged out of
scope. The other 15 are genuinely happiness-based. The script's own
classification is unfixed — `TODO.md` #7.

**Fix B** — user-requested mid-session: 16 species already in
`POKEMON_DATA` have a Hisuian regional form with sprites bundled since
0.1.20 (`alt formes/hisui/`) but no `ALT_FORMS` entry: Growlithe, Arcanine,
Voltorb, Electrode, Typhlosion, Qwilfish, Sneasel, Zorua, Zoroark, Braviary,
Sliggoo, Goodra, Avalugg, Decidueye, Samurott, Lilligant.

- `src/data/altforms.js`: 16 new entries (6 → 22 keys), CSV-sourced. All
  16 differently-typed (Hisuian Qwilfish is Dark/Poison — a from-memory
  draft had it unchanged); 12 also carry distinct stats. Ability deltas
  deferred to 0.1.31.
- `src/app.js`: `cellHtml()`/`renderGrid()` gained a `spriteFn`/`spriteSrc`
  override (mirroring `numberFn`) so the Hisui grid — the browse list and
  the Hisui-context quick-search branch of `renderDexList()`, a deliberate
  scope addition — shows the Hisuian sprite for these 16 via
  `hisuiCellSprite(p)`; the other 226 fall back to normal.
  `openDetail(id, autoForme)` gained a second param: a `#dexList` click
  while `currentRegionFilter === "hisui"` calls `setActiveForme("hisui")`
  after render (user-confirmed — the first navigation-context-dependent
  default forme; base everywhere else). `setActiveForme` already no-ops
  for members without a `"hisui"` key.
- Verified: `node --check`; harnesses confirming all 16 entries' typing/
  stats and 32/32 sprite files, grid override count 16 / fallback 226,
  every `renderGrid`/`openDetail` call site grepped; `verify_region_data.js`
  passes.

**Search reversal** (user-revised 2026-09-04, resolving `TODO.md` #7's
"Group B unreachable via Hisui quick-search" the opposite way): the
`hisuiOnly` gate added to `searchEntries()` in 0.1.28 was removed — those 7
species are now findable from the Search screen and dex quick-search
everywhere. The one scoping is that quick-search used while the Hisui chip
is active restricts to the 242-member roster instead of searching
nationally. The unfiltered National Dex browse-grid exclusion is unchanged.

## 0.1.28 → 0.1.29 — Backfilled 87 of 92 empty `MOVESETS` entries

Retroactive fix for the version-group bug found in 0.1.28 (newest PokeAPI
version groups carry only method-12 "train" rows, which the pipeline never
emits, so picking by `order` alone yielded an empty moveset) — 92 of the
shipped 1-493 entries.

- New reusable `tools/backfill_empty_movesets.js` (`--dry-run`): scans
  `movesets.js` for empty entries live, regenerates each with the corrected
  selection (only method 1/2/4 rows count) from the CSV clone, patches in
  place — every other entry byte-identical.
- 87 regenerated (16 fell back to BDSP/PLA, the usual pattern). 5 skipped,
  each blocked by one move missing from `MOVES` (needs a hand-authored
  description first, same paraphrase convention as every other move):
  Pinsir (Storm Throw), Tauros (Raging Bull), Slowking (Chilly Reception),
  Sceptile (Shed Tail), Rhyperior (Rock Wrecker). Re-running the script
  picks them up once those exist.
- Verified: `node --check`; `verify_region_data.js`; reviewer confirmed
  exactly 87 patched / 5 empty / zero changes outside the 92, and `levelUp`
  sorted, `tm`/`egg` deduped, `max: []` across all 522 entries.

---

## 0.1.27 → 0.1.28 — Hisui's 29 net-new species: full population + `hisuiOnly` mechanism

Ships the deferred half of `TODO.md` #6 — 22 Unova/Kalos/Alola natives +
7 Legends: Arceus originals (dex 899-905). **Hisui 242/242.** Second
coder/reviewer pipeline run.

- **Attachment decision** (user's pick of two options): the 22 get their
  real mainline `region` (`unova`/`kalos`/`alola` — 13/6/3, partially
  populating those chips); the 7 get `hisuiOnly: true` and no `region`.
  `app.js` gated two sites on `hisuiOnly`: `renderDexList()`'s national
  branch and `searchEntries()` (the latter reversed in 0.1.30). National
  count 515 = 522−7.
- Population via new `tools/populate_hisui_species.js` (id-list-keyed fork
  of `populate_region.js`, which only resolves contiguous generation
  ranges). `moves.js` 605→617, `abilities.js` 162→167. Descriptions
  hand-authored for the **base** species — the CSVs' newest flavor text
  describes the Hisuian forms.
- **Pipeline bug found, fixed going forward only**: moveset generation
  picked the highest-`order` version group with *any* rows, including
  train-only groups (`champions`, `legends-za`, `mega-dimension`) → empty
  movesets. 92 shipped 1-493 entries affected (none of the 29 — the fix
  landed before they ran). Backfilled in 0.1.29.
- 6 `evolutions.js` parents patched (same precedent as 0.1.22): Scyther→
  Kleavor, Eevee→Sylveon, Qwilfish→Overqwil, Sneasel→Sneasler, Ursaring→
  Ursaluna, Stantler→Wyrdeer. Side effect: a `hisuiOnly` species is
  reachable from a nationally-visible parent's Evolution Line (unavoidable
  for Basculegion regardless).
- Reviewer findings deferred to `TODO.md` #7: "Lv undefined" arrows (21
  pre-existing + Eevee→Sylveon, Sneasel→Sneasler), 16 still-missing
  evolution edges, Enamorus's false "not found in the wild" note, Group B
  unreachable via Hisui quick-search.
- Verified: `node --check`; `verify_region_data.js`; all 29 ids in all 6
  tables; `HISUI_DEX_NUMBERS` diffed 1:1 against the source CSV; reviewer
  spot-checked all 29 species' data and 12 new moves against real game
  values.
- Session halted here under the token-budget rule (`CLAUDE.md` §8).

## 0.1.26 → 0.1.27 — BST (base stat total) row on the Base Stats card

First trial of the coder/reviewer pipeline (`CLAUDE.md` §5), run as
`general-purpose`+`model:"opus"` in Cowork — passed, no process changes.

- `src/app.js`: `statsTableAndRadarHtml()` (shared with per-forme cards, so
  Deoxys's formes got it free) appends a "Total:" row after Speed, summed
  by reducing over `STAT_ROWS` so it can't drift from the displayed values.
  Lv.1/Lv.100 columns empty for that row (BST is base-only). No new CSS.
- Data check, not a change: `temp/check_bst.js` (left in place — `rm`
  blocked) cross-checked all 493 `stats.js` entries' six stats
  individually against `pokemon_stats.csv` — 493/493 match. Reviewer
  confirmed the check fires on a mutated copy.
- Reviewer caught `SCOPE.md` §2 still describing 386 entries — fixed
  (memory-bank-only, no extra bump).
- Verified: `node --check`; `JSON.parse` on `package.json`; all `STATS`
  and Deoxys forme entries carry all six keys.

## 0.1.25 → 0.1.26 — Standalone-dex mechanism; Orre (full) + Hisui numbering (213/242)

Ships `TODO.md` #6's mechanism plus Orre in full and Hisui's numbering for
its 213 already-populated species; the 29 net-new species deferred to
0.1.28 (user direction).

- `data.js`: `REGIONS` gains `hisui`/`orre` with `standalone: true`,
  appended after the 9 mainline regions. Never written to `pokemon.js`'s
  `region`.
- New `src/data/hisui.js` (`HISUI_DEX_NUMBERS`, 213 of 242, from
  `temp/hisui_dex_numbers.csv`) and `src/data/orre.js` (`ORRE_MEMBERS`,
  136 members, `"C"`/`"XD"`/`"C/XD"`, from `temp/Orre_Region_Pokedex.txt`).
  **Orre data-quality finding**: the source lists 138 rows but claims "131
  unique"; a name-vs-number check against `pokemon_species_names.csv`
  found exactly 2 bad rows (016/017 labeled Hoothoot/Noctowl, really
  Pidgey/Pidgeotto) — dropped, not guessed (`TODO.md` #6). All 136 ids
  ≤376, so no new population was needed.
- `app.js`: `renderStandaloneDexList(filter)`, called first from
  `renderDexList()` — Hisui filters+sorts by `HISUI_DEX_NUMBERS`, Orre
  filters by `ORRE_MEMBERS` and sorts by national id (deliberate,
  confirmed). `cellHtml()`/`renderGrid()` gained an optional `numberText`/
  `numberFn` override (undefined for every pre-existing caller): Hisui's
  own number, Orre's `"#016 · XD"`. `renderRegionBar()` adds `standalone`
  to the two chips.
- `styles.css`: `--accent-purple`/`--accent-purple-grad` tokens,
  `.region-chip.standalone(.active)`.
- `index.html`: two script tags; `#dexSearchToggle` comment updated 9→11
  regions (CSS math unaffected). `copy-app.js` `dataFiles` += both files.
- Verified: `node --check`; harness — 213 unique Hisui keys spanning 4-242
  (1-3 are the deferred Rowlet line), 136 unique Orre keys (89 XD / 41
  C-XD / 6 C), all present in `POKEMON_DATA`.

## 0.1.24 → 0.1.25 — Alt Formes rule 6 (recolor-only "+N" popup): Unown, Burmy, Cherrim, Arceus

- `src/data/altforms.js`: new species-level `recolorOnly: true` flag. Four
  entries from `pokemon_forms.csv`/`pokemon_form_names.csv`, sprites
  checked on disk: Unown (#201, 28 — A-Z, !, ?), Burmy (#412, 3 cloaks),
  Cherrim (#421, 2), Arceus (#493, 19 by `form_order`; its default reuses
  plain `493.png`, the others have hyphenated root files). Arceus's Plates
  really change type (rule 7 on paper) but the user directed rule 6: no
  `types`, no swap, plain gallery. Confirmed via `pokemon_form_types.csv`/
  `pokemon_abilities.csv` that none of the four has a real per-form delta.
- `src/app.js`: `altFormsCardHtml()` branches on `recolorOnly` —
  `altFormsRecolorBubbleHtml()` (one bubble, badge = `formes.length - 1`)
  and `altFormsRecolorPopupHtml()` via the existing `openDetailPopup()`. A
  distinct `.altforms-recolor-bubble` class is checked before the
  `.evo-stage` handler so the two click paths stay explicitly separate.
  `setActiveForme`/`statsCardHtml`/`altFormAbilityItemsHtml` unchanged —
  all already no-op on formes without `types`/`stats`/`ability`.
- `src/styles.css`: `.altforms-recolor-badge` (corner, `--accent-grad`),
  `.altforms-popup-grid`/`.altforms-popup-item` (flexbox, 4 per row).
- Deferred: Shellos/Gastrodon (#422/#423) — color-locked across the
  evolution boundary, no rule covers it (`TODO.md` #4).
- `CLAUDE.md`: §4 trimmed to durable facts; new intro rule "stop and ask
  when genuinely uncertain."

## 0.1.23 → 0.1.24 — Cosmetic-form sprites restored; `0.png` wired as a missing-sprite fallback

Corrects 0.1.23's exclusion of the 195 hyphenated cosmetic-form files
(Arceus types, Unown letters, Burmy/Cherrim/Genesect/Deerling/Sawsbuck/
Vivillon/Flabébé/Furfrou/Meloetta/Silvally/Alcremie recolors — no distinct
PokeAPI id): they belong in the bundle as groundwork for forme features,
at the sprite root rather than in `alt formes/`.

- Copied 195 + 195 shiny from `temp/home/` to `src/data/sprites/` and
  `sprites/shiny/` root under their raw filenames. Root now 1221 normal
  (1025 + 195 + `0.png`), 1220 shiny. `female/` (103 + 103) stays in
  `temp/home/` (`TODO.md` #3).
- `0.png` copied to the root and wired as `SPRITE_ONERROR_ATTR` (`app.js`,
  next to `spriteUrl`/`spriteShinyUrl`/`altFormSpriteUrl`): an `onerror`
  that swaps to `0.png` and clears itself so it can't loop. Spliced into
  all 5 inline sprite `<img>` templates (grid cell, detail normal + shiny,
  Alt Formes, Evolution Line) — there's no shared img-builder function.

## 0.1.22 → 0.1.23 — Sprite bundle re-sorted after a raw-dump replacement

`src/data/sprites/` had been replaced with PokeAPI's raw, unsorted
`other/home` dump (`src/data/sprites/pokemon/`). Re-sorted back into the
app's layout (`{id}.png`, `shiny/{id}.png`, `alt formes/` subfolders) with
a throwaway Node script reimplementing `TODO.md` #3's documented algorithm
(the original script had been deleted after use). One spec correction: the
CSV's Farfetch'd uses a curly apostrophe, normalized to straight `'`.

- Counts: 1025 + 1025 exact; `alt formes/` 310 normal / 303 shiny (vs the
  earlier 314/302 — source-clone drift, verified deliberate). Folder
  breakdown in `TODO.md` #3.
- Excluded from the dump: the 195 hyphenated cosmetic forms (restored in
  0.1.24), `0.png` (wired in 0.1.24), both `female/` folders.
- The raw dump couldn't be deleted — the file bridge returns `EPERM` on any
  delete, even a fresh test file. 597 out-of-scope files remain under
  `src/data/sprites/pokemon/` pending manual deletion.

## 0.1.21 → 0.1.22 — Sinnoh (dex 387-493) fully populated via the same CSV pipeline

All 107 Sinnoh entries in all 6 files; national dex 1-493 complete.
Pipeline params: ids 387-493; version groups D/P (8), Platinum (9), BDSP
(23); hand-authored `descriptions.json` (107 Pokémon + 16 moves + 10
abilities).

- Pipeline gap fixed: `pokemon.js` had no placeholder block for 387-493
  (the original region-tagging pass never covered Sinnoh), so
  `gen_region_data.js` now captures each species' English name and
  `assemble_region_data.js` falls back to it; the splice logic gained a
  third case (pure append before the closing `];`).
- `MOVES` 589→605, `ABILITIES` 152→162. 20/107 fell back to PLA movesets.
- 6 evolution links restored that Johto/Hoenn passes omitted as out-of-
  range: Togetic→Togekiss, Kirlia→Gallade, Nosepass→Probopass, Roselia→
  Roserade, Dusclops→Dusknoir, Snorunt→Froslass. Nothing new omitted.
- Verified: `verify_region_data.js` (full 1-493), `node --check`,
  spot-checks of starter levels and legendary stats. Sprites already
  bundled, no `copy-app.js` change.

---

## 0.1.20 → 0.1.21 — Alt Formes module on the detail screen (TODO #4 → PLAN.md)

Full mechanism + data for Deoxys (#386) and Castform (#351).

- New `src/data/altforms.js` (`ALT_FORMS`, keyed by base id; `<script>`
  tag after `stats.js`; `copy-app.js` `dataFiles` updated). Each forme:
  `key`/`name`/`sprite` plus optional `types`, `stats`, `ability`,
  `isMega`/`isGmax` — absence means "same as base," so rendering branches
  on presence with no per-species special-casing. Deoxys: 3 same-typed
  formes with distinct 600-BST stat lines. Castform: 3 differently-typed
  formes (Fire/Water/Ice) sharing the base stats.
- `app.js`: `altFormsCardHtml()`/`altFormStageHtml()` (rules 1/2, reusing
  `.evo-stage` classes); `statsCardHtml()` split into a shared
  `statsTableAndRadarHtml(label, stats)` so a forme with `stats` gets its
  own card (rule 3 — rule 7's shared-card clause falls out of the data
  model for free); `abilityListHtml()` appends a forme's `ability` tagged
  by `altFormeShortLabel()` (rule 4, generalized: forme `key` unless
  `isMega`/`isGmax`) — a real code path, unexercised.
- **Swap-on-tap (rule 9)**: `setActiveForme(key)`, from a forme bubble or
  the Picture card's `#pictureMainSprite`/`.sprite-slot-main` (revert);
  swaps the sprite and re-renders `.detail-facts` via the new
  `factsRowsHtml()` (split from `factsListHtml()`) against `{...entry,
  types}` — only if the forme has `types`, so Deoxys is a no-op by
  construction. The moves-card half of rule 9 has no code (no species
  needs it).
- **Rule 8**: `evolutionCardHtml()`'s `singleStage` branch now returns `""`
  instead of a "Does not evolve" note — affects every relation-less
  species (Snorlax, Mewtwo, ...); real chains unaffected.
- Deferred: rules 5 and 6; Mega/Gmax data (`TODO.md` #5).

## 0.1.19 → 0.1.20 — Sprites switched from hotlinked URLs to local files (TODO #3)

`spriteUrl()`/`spriteShinyUrl()` now point at `data/sprites/{id}.png` /
`data/sprites/shiny/{id}.png` (relative paths, same pattern as the
`data/*.js` script tags) instead of `raw.githubusercontent.com`; `<img
src>` loads local files over `file://`, unlike `fetch()`.

- **Offline Cache feature removed** as dead weight: the Settings button +
  status line, the Yes/No popup (markup, CSS, z-index layer), and
  `runOfflineCache`/`loadOfflineCacheIntoMemory`/`updateCacheInfo`/
  `formatBytes`/`formatCacheDate`/`idbGetAll`/`runWithConcurrency`, the
  `spriteObjectUrls` indirection, and its Escape-chain entry. **Kept**: the
  `vkdex-cache` IndexedDB DB with `openOfflineDb()`/`idbGet()`/`idbSet()`
  and the `meta` store — the Favorites fallback. The `sprites` store is no
  longer created; existing users' empty store is left alone.
  `.app-version` took over `margin-top: auto` so the version footer stays
  at the bottom of the Settings window.
- `copy-app.js` recursively copies `src/data/sprites/` via `fs.cpSync`
  (whole tree, `alt formes/` included — filtering would be more code than
  the ~7MB saves).
- Verified: `node --check`; `verify_region_data.js`; files present for a
  spread of ids; `fs.cpSync` dry-run to a scratch dir came through intact.

---

## 0.1.18 → 0.1.19 — Screenshot-feedback polish pass + Units setting

From the first real screenshots of 0.1.18:

- `.drawer-handle` height 93.6px → 140.4px (width stays 5.4px).
- `radarSvg()` draws a filled `rgba(120,120,130,0.35)` hexagon backdrop at
  the outer radius behind the gridlines/polygon; the old outer gridline
  ring dropped (the backdrop's stroke replaces it).
- **Units setting** (`PLAN.md`'s deferred commitment): "Imperial Units"
  toggle in Settings (`#unitsToggle`, `.switch` markup), off by default,
  persisted as `vkdex-units` (synchronous read on load, like Grid Width).
  `metersToFeetInches()`/`kgToLbs()` convert on render; toggling re-renders
  an open detail screen. Checked: Mewtwo → 6'07" / 269 lbs, Bulbasaur →
  2'04" / 15.2 lbs.

---

## 0.1.17 → 0.1.18 — Detail screen redesign implemented (PLAN.md, all 6 sections)

The `app.js` logic for the redesign, against the complete 386-entry data
set. (The `index.html`/`styles.css` half had been built in an unlogged
part of the prior session.) `renderDetail()` rebuilds six cards per
`openDetail()`:

- **Picture** — normal + shiny sprites, dex number, flavour-text flap; name
  moved to the topbar `#detailName` button, which opens the names popup
  (`NAMES[id]`).
- **Evolution Line** — walks `EVOLUTIONS` back to the root, DFS forward to
  each leaf, one root-to-leaf row per branch (sufficient for Eevee's 5-way
  split). Arrow labels from `method`/`level` (`level`/`stone`/`trade` were
  the only methods in the data). Single-stage → "Does not evolve" note
  (changed in 0.1.21).
- **Found In** — chips for every region with non-empty `LOCATIONS[id]`
  areas; tap → popup. Zero regions → "Not found in the wild — evolution
  only".
- **Facts** — Type pills (`.type-TYPE`, 18 types), Abilities (name +
  description, hidden last + tagged), Category, merged Height/Weight,
  Capture Rate, Exp Growth, then Weakness/Resists/Neutral (+ Immune when
  non-empty) from `TYPE_CHART`; ×4 pills get `.mult-4`.
- **Moves** — four tabs over `MOVESETS[id]`, one delegated listener.
- **Stats** — Lv.1/Lv.100 table (31 IV / 0 EV / neutral; HP formula
  differs, `.stats-note`) + hand-drawn SVG radar scaled to `max(200, top
  stat)`.

**Capture odds**: the real Gen 3+ formula — at full HP, no status, Poké
Ball, the modified rate is `catchRate / 3`, then `b = 1048560 /
sqrt(sqrt(16711680 / a))`, `p = (b/65536)^4`. Rate 45 → 5.9%, 255 → 33.3%
(not a guaranteed catch).

Bug fixed pre-ship: `tools/add_hidden_abilities.js` (already run once,
unlogged) had a broken idempotency regex (capture window ended at
`abilities: [...]`, never saw an existing `hiddenAbility:`) and duplicated
the key on all 355 entries when re-run; data deduped, regex fixed.

Verified: `node --check`; a `vm`-loaded harness exercising every pure
function against real data (Bulbasaur/Gengar matchups, Eevee's 5 in-range
branches, Ditto/Charmander chains, full 1-386 smoke test, zero failures).
Scoped out: Units toggle (→0.1.19), local sprites (→0.1.20).

---

## 0.1.16 → 0.1.17 — Hoenn (dex 252-386) fully populated via the same CSV pipeline

135/135 in all 6 files; Kanto+Johto+Hoenn = 386/386. Pipeline params: ids
252-386; encounter version ids 7/8/9/25/26 (R/S/E/OR/AS, looked up from
`versions.csv`); hand-authored `descriptions.json` (135 + 18 moves + 10
abilities). Session mount paths in both scripts had to be re-pointed.

- New splice case: Hoenn was the last populated region, so with no next-id
  block `assemble_region_data.js` now cuts at the array's closing `];` and
  strips the trailing comma.
- `ABILITIES` 142→152, `MOVES` 571→589. 42/135 fell back to BDSP/PLA
  movesets.
- 6 evolution targets omitted as out-of-range: Kirlia→Gallade, Nosepass→
  Probopass, Roselia→Roserade, Dusclops→Dusknoir, Snorunt→Froslass (all
  restored in 0.1.22) and Linoone→Obstagoon (862, still out of range).
- New reusable `tools/verify_region_data.js`, checking the whole populated
  range in one run. All checks pass; starter levels and Blaziken/Deoxys
  stats spot-checked.

---

## 0.1.15 → 0.1.16 — Johto (dex 152-251) fully populated via the same CSV pipeline

100/100 in all 6 files. The Kanto scratch scripts were promoted to
region-parameterized `tools/gen_region_data.js` + `assemble_region_data.js`:
ids 152-251; encounter version ids 4/5/6/15/16 (G/S/C/HG/SS); hand-authored
`descriptions.json` (100 + 17 moves + 10 abilities). The per-Pokémon files
now **merge** new ids into existing content instead of overwriting
(`locations.js` merges by region key). The `pokemon.js` name regex was
hardened for escaped apostrophes (`/((?:[^'\\]|\\.)*)'/`) after 0.1.15's
Farfetch'd bug.

- `ABILITIES` 132→142, `MOVES` 554→571 (Gen 4+ additions first referenced
  by Johto kits). 17/100 fell back to BDSP/PLA movesets.
- Togetic→Togekiss (468) omitted as out-of-range (restored 0.1.22).
- Verified: `node --check`, integrity script, special-name spot-check
  (Ho-Oh, Slowking, ...).
- Token note: blended Kanto cost was ~397K tokens/Pokémon including the
  abandoned wiki-agent approach; the CSV pipeline is far cheaper.

---

## 0.1.14 → 0.1.15 — Kanto (dex 1-151) fully populated via a local CSV pipeline

All 151 Kanto entries in all 6 files. **New sourcing method**: the user
cloned `PokeAPI/pokeapi` to `VKDex/temp/PokeAPI-master`; a one-off Node
script (`gen_kanto.js`) joins its `data/v2/csv/` tables off disk — no web
fetching, far cheaper than 0.1.13/14's per-Pokémon research agents.
Descriptions authored separately as original one-sentence paraphrases.

- **Moveset fallback rule**: each species takes the learnset of the most
  recent version group with real data for it; 44/151 Kanto species have no
  Gen 9 data and fell back (mostly BDSP). Pre-authorized as an accepted
  edge case. `max` stays `[]` (no Dynamax in Gen 9).
- `locations.js` from real encounter data across R/B/Y/FR/LG/Let's Go,
  replacing the hand-written starter notes ("Pallet Town" for the starters
  — PokeAPI records the hand-off as a location).
- `names.js` uses PokeAPI's `ja-roma` column for romaji.
- `MOVES` +140, `ABILITIES` +54 (mostly Gen 4/5 hidden abilities).
- Bug caught by the integrity check: the name regex corrupted `Farfetch'd`
  to `Farfetch\` — fixed before shipping.
- Verified: `node --check` on all 9 `data/*.js`; completeness + integrity
  script (every id in all 5 per-Pokémon files, no duplicate keys, every
  reference resolves).

## 0.1.13 → 0.1.14 — Caterpie (dex 10), sourced via a new CSV-pipeline test

Proof-of-concept for cheaper sourcing after 0.1.13's wiki-page batches cost
100K-400K tokens per 9-24 Pokémon: PokeAPI's CSVs (`data/v2/csv/`) loaded
in the browser pane and filtered client-side with `javascript_tool`, so
only matching rows (70 of `pokemon_moves.csv`'s 638K lines) entered
context. All values matched known game data. `locations.js` skipped
(encounter CSVs untested yet).

- `mcp__workspace__web_fetch` can't fetch arbitrary constructed URLs; the
  browser pane has no such restriction.
- Caterpie has no Gen 9 moveset in PokeAPI — fell back to Sword/Shield.
  First sighting of the recurring fallback case.
- `MOVES` +2 (Bug Bite, Electroweb).

## 0.1.12 → 0.1.13 — First richer-data batch: Kanto starter trio (dex 1-9)

First per-Pokémon population, sourced from pokemondb.net (dex + Gen 9
learnset pages) and Bulbapedia (language names), per user direction that
all data reflect **current Gen 9 mechanics**, not frozen Gen-1 numbers.
Ids 1-9 in `pokemon.js` (types/category/height/weight/abilities/
description), `stats.js`, `evolutions.js`, `movesets.js` (`max: []` per
user direction — Dynamax was removed in Gen 9), `locations.js`, `names.js`.

- `MOVES` +58 (Gen 4+ moves in those learnsets, appended after the Gen 1-3
  block, not re-alphabetized), `ABILITIES` +1 (Solar Power).
- Verified: `node --check`; no duplicate keys; every reference resolves.

## 0.1.11 → 0.1.12 — Sourced `abilities.js` and `moves.js` (normalized tables, Gen 1-3)

One global sweep of the two shared tables (`PLAN.md` step 1):

- `abilities.js`: 77 — every ability through Gen 3 (Bulbapedia's Gen III
  category, count matches). Original 1-sentence paraphrases of Gen 9-era
  mechanics. Includes Cacophony (real in Gen 3's data, never assigned —
  described as unused).
- `moves.js`: 354 — every move through Gen 3 (165/86/103 per gen), from
  pokemondb.net's per-generation lists. Current stats, not frozen Gen 3
  values (Charm/Moonlight/Sweet Kiss are Fairy since Gen 6). `type` values
  verified 18/18 against `TYPE_CHART`; `power`/`accuracy` `null` where the
  source says so, not guessed.
- Verified: `node --check`; counts and type/category validity via script.

## 0.1.10 → 0.1.11 — Gen 9 type chart (`data/types.js`)

`TYPE_CHART`, attacker → defender → multiplier, sparse (120 non-1× pairs
across 18 types) — static game data so weaknesses can be computed at render
time rather than stored per entry. Script tag placed first among the
`data/` files; `copy-app.js`'s `dataFiles` updated.

## 0.1.9 → 0.1.10 — Data storage architecture: per-Pokémon data split into `src/data/`

Pure structural refactor, no data or `app.js`/`styles.css` changes
(globals are read at call time). `POKEMON_DATA` moved from `src/data.js`
to `src/data/pokemon.js`; `data.js` keeps only `APP_VERSION`/`REGIONS`. 7
empty containers created (`abilities`/`moves`/`movesets`/`evolutions`/
`locations`/`names`/`stats`), each `var X = {};` with a header comment
documenting its shape. `index.html` loads all 8 via `<script>` tags between
`data.js` and `app.js`; `copy-app.js` copies `src/data/` into the packaged
`app/data/`.

## 0.1.8 → 0.1.9 — Johto and Hoenn dex data

`POKEMON_DATA` extended with Johto (152-251) and Hoenn (252-386) as
`{id, name, region}` entries. Pure data — no region name is hardcoded in
`app.js`. Verified ids 1-386 contiguous, counts 151/100/135.

## 0.1.7 → 0.1.8 — Grid width setting

Settings gets a "Grid Width" row: a 3-box segmented control (3/4/5
columns, `.grid-width-btn`, joined via shared borders, outer corners
rounded) below Dark Mode. Writes `--grid-cols` on `<html>` — the var
`.dex-cell` already read, so Favorites/Search pick it up for free.
Selected box uses `--accent-grad`. Persisted as `vkdex-grid-cols` (default
5), read synchronously on load so the grid never flashes.

## 0.1.6 → 0.1.7 — Drawer handle / quick-search sizing tweaks

From a screenshot of 0.1.6: `.drawer-handle` width 6px → 5.4px, height
72px → 93.6px; `.dex-search-toggle` `bottom` 8px → 5px so it centers
between the last chip row and `.dex-panel` (derived from the stylesheet's
own row/gap/padding values — see the rule's comment for the arithmetic).

## 0.1.5 → 0.1.6 — Dex quick-search + visible drawer handle

- **Dex quick-search** — a round translucent toggle (`#dexSearchToggle`)
  at the bottom-right of the region bar expands `#dexQuickSearch` (a
  `max-height` transition reusing `.search-bar` styling) between the
  region bar and the grid. Filters `#dexList` **in place**, national-wide,
  ignoring the active region filter; switching region closes it (browsing
  and text search are separate modes). Icon swaps to "×" via CSS
  (`.dex-search-toggle.active`). Added to the Escape chain after the
  detail screen.
- **Drawer handle** — `#drawerHandle`, a thin grey pill `<button>` on the
  phone's left edge (`z-index:6`, above the edge-zone at 5, below the
  drawer at 10) so a tap opens the menu without the drag gesture; the
  edge-zone swipe still works.

## 0.1.4 → 0.1.5 — Visual polish pass (UI depth & interaction states)

Ships `PLAN.md`'s "Visual polish pass" — all CSS/markup, no dependencies:

- **Raised surfaces** — gradient + shadow on `.dex-panel`, `.dex-header`,
  `.dex-cell`, `.region-chip`, `.detail-card`, `.detail-facts`,
  `.detail-back`/`.detail-fav`.
- **Sprite backdrops** — `cellHtml()`/`renderDetail()` wrap the sprite
  `<img>` in `.dex-sprite-wrap`/`.detail-sprite-wrap` (radial-gradient
  circle); the wrap is the sized flex item now.
- **Tactile states** — hover/press feedback on cells, chips, icon-cubes,
  Settings buttons, detail back/favorite. The National Dex header gets an
  accent-blue glow when active plus a press-scale.
- **Scroll edge fades** — static `mask-image` on `.dex-list`/`.detail-body`.
- **Background depth** — radial vignette on `html, body` and on `.screen`/
  `.detail-screen` (both, confirmed).
- **`--accent-grad`** on the selected/active controls, explicitly not
  `.icon-cube.active`.
- **Empty states** — Favorites' "nothing here yet" state (star + heading +
  subtext, special-cased in `renderFavorites()`); a pure-CSS Poké Ball
  watermark behind sparse grid/detail content (`.dex-panel::before`/
  `.detail-body::before`, one pseudo-element — see `CLAUDE.md`'s pitfalls);
  "size the detail card to content" satisfied by that watermark filling the
  blank space rather than a layout restructure (flagged in case a literal
  restructure is wanted later).
- **Small touches** — magnifying-glass icon inside the search input
  (`.search-icon`), drop-shadow on the corner favorite star.

Ambiguous scope items were confirmed with the user before implementation.

## 0.1.3 → 0.1.4 — Drawer navigation, detail screen, favorites & search

The three placeholder drawer icons were wired up: a screen router
(`showView(name)`, `wireNavIcon()`, `.icon-cube.active`); a Pokémon detail
screen (tap/Enter/Space on any cell, slides in from the right, back arrow
or Escape closes; fact rows data-driven from `DETAIL_FIELDS`); persisted
Favorites (localStorage `vkdex-favorites`, mirrored into IndexedDB `meta`/
`favorites`); and a Search screen (name substring or exact dex number,
tolerant of "#" and leading zeros). Full behavior: `SCOPE.md` §4.

## 0.1.2 → 0.1.3 — Explicit scrollbar styling

Thin, rounded, semi-transparent dex-list scrollbar instead of the default
— the packaged Electron app's Chromium was rendering a plain white
rectangular one, unlike a regular browser tab.

## 0.1.1 → 0.1.2 — Window minimum size locked, phone frame scales up

Electron window minimum locked to **360x800**; the whole phone frame scales
**up** as the window grows (CSS transform driven by `app.js`) instead of
adding padding around a fixed-size frame.

## 0.1.0 → 0.1.1 — Resizable Electron window with locked aspect ratio

Window made resizable with a locked **360:800** aspect ratio
(`electron-app/main.js`). No `src/` changes.
