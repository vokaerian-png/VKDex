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
Entries prior to 0.3.0 live there now (0.1.0 through 0.2.22, plus 0.2.22→
0.3.0 itself as of this bump — 0.2.5-0.2.9 were already folded under one
0.2.4→0.2.10 heading before archival and stayed folded as one compacted
entry there).

**Current version: 0.3.15.**

---

## 0.3.14 → 0.3.15 — Header faceplate + dex-grid de-tint (`overlord` reasoning + `coder`)

Follow-up round after 6 real-device screenshots of 0.3.13: the National Dex
header had been missed by that overhaul (still flat), and the dex-grid
type tint read as too noisy in practice. Followed `CLAUDE.md` §5c again:
`overlord` (fable, high effort) produced 3 concrete options per aspect
(`temp/design-visual-overhaul-2026-09-06/DESIGN_PROPOSAL_ROUND2.md`);
architect built 6 interactive mockups (3 header, 3 grid-tint); user picked
Header Option A "Faceplate" and Grid-tint Option C "depth only" at the
`.12` socket-alpha tuning (compared against `.09`/`.16` in the mockup);
`coder` implemented exactly those two picks in one dispatch.

- **Header faceplate**: `.dex-header` (shared by dex/Favorites/Type
  Chart/Natures) gained `.dex-panel`'s hatch texture plus a CSS-drawn
  hardware ornament — a blue lens (`::before`, left) and a red/yellow/green
  3-LED strip (`::after`, right). Lens dims via
  `.dex-header:has(.dex-title:not(.active))::before`, reusing the header's
  existing National-Dex-filter-button active state — verified the three
  static-title screens (Favorites/Type Chart/Natures) hardcode `active` so
  their lens always stays lit. Padding widened `14px 16px` → `14px 44px`
  so the hardware never collides with the centered wordmark; hand-traced
  at the 360px base width (336px header, 244px content box after border/
  padding) in both Luckiest Guy (~235px) and its Arial Black fallback
  (~200px) — 4.5px/22px slack either side, no overlap in either font.
- **Dex-grid de-tint (reverses 0.3.13's type-tinted cards)**:
  `.dex-sprite-wrap`'s type-tint background replaced entirely by a
  depth-only "molded key" socket, `rgba(0,0,0,0.12)` (the user's chosen
  value) plus a soft radial highlight; `.dex-cell` gained a matching
  raised-gradient base (alphas `.14`/`.06`) merged into its existing
  `--raised-shadow-sm`. `cellHtml()`'s inline `--t1`/`--t2` style attribute
  removed. **Dead-code check**: `effectiveTypes()`/`typeTintStyle()`
  (added 0.3.13) had `cellHtml` as their only caller — both deleted;
  `applyDetailTypeGlow()` (the separate detail-screen type glow, also
  0.3.13) builds its own `--t-*` values independently and was confirmed
  untouched. The `--t-*` tokens themselves survive (still feed that glow).
- Verified: `node --check` on `app.js`; CSS braces 319/319 → 322/322 (+3
  rules, expected for the header's 2 pseudo-elements + 1 `:has()` rule);
  grep-confirmed zero remaining references to `effectiveTypes`/
  `typeTintStyle`/any `style=` on `.dex-sprite-wrap`. **No visual
  verification possible** (`CLAUDE.md` §4) — worth a real screenshot: the
  header hardware against the actual "Luckiest Guy" render, the lens dim
  state on a region-filtered dex, and the de-tinted grid in both themes.

Handoff: `temp/handoff/2026-09-06-191512-header-faceplate-grid-detint.md`.
Design proposal (round 2):
`temp/design-visual-overhaul-2026-09-06/DESIGN_PROPOSAL_ROUND2.md`.

---

## 0.3.13 → 0.3.14 — Fixed ×4 weakness pill's square-corner outline bug (`coder`)

User-reported from a real screenshot of 0.3.13: the "extremely effective"
×4 weakness pill's rainbow-gradient outline (`.type-pill.mult-4`) rendered
as a square box sitting on top of the rounded pill, instead of following
its curve. Root cause: CSS's `border-image` property **ignores
`border-radius` entirely** by spec — `.type-pill` is `border-radius:999px`
(a true pill), but `border-image` always paints square corners regardless.
This predates the 0.3.13 visual overhaul (the rule is untouched by that
work) — a pre-existing bug the overhaul's screenshot round happened to
surface.

- Replaced the `border: 1.5px solid` + `border-image` combo with the
  standard rounded-gradient-border technique: an absolutely-positioned
  `::before` ring using `border-radius: inherit` (picks up the pill's
  `999px` automatically) + `mask-composite: exclude` to punch out the
  center, leaving a true curved ring. Well-supported on both of this
  project's actual targets (Tauri's WebView2, Android WebView — both
  Chromium; no Safari/WebKit concern since macOS/iOS aren't pursued,
  `PLAN.md`'s Tauri migration entry).
- **Sizing note**: the old real 1.5px border was making the ×4 pill 3px
  wider/taller than a plain ×2 pill (`.type-pill` has no `box-sizing`
  override). Removing it and drawing the ring via `inset:-1.5px` on the
  pseudo-element instead makes the ×4 and ×2 pills the same size, ringed
  vs. not — a size fix bundled with the shape fix, not a separate change.
  A comment was left on the rule explaining why it's a pseudo-element, so
  it doesn't get "simplified" back to `border-image` later.
- Verified: CSS brace balance unchanged (319/319); `border-image` now has
  zero occurrences repo-wide (it was the only instance — no sibling bug
  elsewhere); traced by hand that the pill's own per-type `background`
  (from its `.type-TYPE` class) is untouched, since the ring is a separate
  absolutely-positioned layer. No browser in this sandbox (`CLAUDE.md`
  §4) — not yet screenshot-confirmed.

Handoff: `temp/handoff/2026-09-06-143000-mult4-pill-ring.md`.

---

## 0.3.12 → 0.3.13 — Visual overhaul: color palette, type-tinted dex cards, drawer LED icons, per-type detail background glow (`overlord` reasoning + `coder` ×2)

User-directed: make the app feel less flat/simplistic across 4 aspects
(colors, dex-screen cards, sidebar icons, background imagery). Followed
`CLAUDE.md` §5c's mockup-first workflow in full: `overlord` (fable, high
effort) read the real `src/styles.css`/`index.html` and produced a grounded
proposal with 2-3 concrete options per aspect
(`temp/design-visual-overhaul-2026-09-06/DESIGN_PROPOSAL.md`); architect
built 4 interactive Cowork artifact mockups (one per aspect, each toggling
between options live in a phone-frame preview) for user review; the user
picked options across two rounds, then `coder` implemented exactly the
confirmed picks in one dispatch, plus a same-chain one-line follow-up fix.

- **Palette**: two-accent system. `--accent` (blue) stays for chrome
  (drawer, search, region chips); new `--accent-warm`/`--accent-warm-fg`/
  `--accent-warm-grad` (`#ffcb05`-based, the existing logo/star yellow)
  takes over two in-card selection states that clashed with the dark-red
  card background at only 2.1:1 contrast: `.move-tab.active` and
  `.altforms-recolor-badge` (both now 9.2:1). **User-confirmed exception**:
  `.evo-stage.altform-active` (the Evolution Line's active-forme ring) was
  deliberately left blue — yellow read as almost invisible against the
  sprite's own bright colors on the mockup. Also fixed light mode's
  `--accent`/`--accent-rgb` (2.6:1 on white, below the 3:1 UI-contrast
  minimum) to a deeper `#2f8ae6` via a new `.phone:not(.theme-dark)` rule —
  dark mode unaffected. 7 previously-hardcoded `#4da3ff` sites tokenized in
  the process (2 of them, both `#1d3a57`, fully replaced by the drawer
  change below rather than just tokenized).
- **Dex screen**: 18 new `--t-*` rgb-triple tokens (additive — the existing
  `.type-TYPE` pill hex rules are untouched, not refactored to consume
  them). `.dex-sprite-wrap` renders a 60%-alpha type-tinted disc per cell
  (diagonal split for dual types) via a new `effectiveTypes()`/
  `typeTintStyle()` pair in `app.js` feeding an inline `style` on each
  cell's sprite wrap — user asked for this softened from the mockup's
  full-saturation version. `.dex-panel` gained a diagonal-grain + bevel
  "molded tray" texture; its Poké Ball watermark moved from centered to a
  clipped top-right corner emboss (`overflow:hidden` added to `.dex-panel`
  to actually clip it — a `coder`-flagged deviation, architect-confirmed as
  correct given "clipped corner" was the explicit intent). `.detail-body`'s
  own separate watermark is untouched.
- **Drawer**: 5 new per-row `--row-accent` id rules
  (`#dexIcon`/`#favoritesIcon`/`#typeChartIcon`/`#naturesIcon`/
  `#settingsIcon` → red/yellow/blue/green/slate — all hues already used
  elsewhere in the app). `.icon`'s stroke now reads
  `var(--row-accent, var(--accent))` so the detail topbar's back/star
  buttons (which share the `.icon` class but have no row context) fall
  through to the normal accent unchanged. `.menu-btn.active`/`.tour-target`
  rebuilt around the row's own color with a dark glyph on the lit tile
  (light text fails contrast on the yellow/green rows). **User-confirmed**:
  red for the Pokédex row (matching the device's own red chassis) over
  keeping it blue.
- **Backgrounds**: `.screen`'s near-invisible black-alpha vignette (was
  literally invisible in dark mode, black-on-`#121212`) replaced with a
  mid-grey dot-grille + vignette visible in both themes.
  `.detail-screen` additionally layers a per-Pokémon-type glow on top
  (`--t1`/`--t2`-driven, same tokens as the dex cards) via a new
  `applyDetailTypeGlow()` called from both `renderDetail()` (covers every
  navigation path: initial open, Prev/Next, evolution-stage taps, Back)
  and `setActiveForme()` (forme swaps, using the same type resolution the
  Facts card's pill swap uses, so they can't disagree). `background-color`/
  `background-image` remain two separate declarations throughout — the
  theme-swap-safety split (`SCOPE.md` §7) is intact.
- **Deviation resolved same-chain**: the first `coder` dispatch left
  `--accent-rgb` un-overridden in light mode (spec'd literally), meaning
  translucent halos (title glow, search-toggle fill, search-focus ring)
  would've stayed on the old blue's rgb triple while the solid accent moved
  — architect confirmed this needed fixing, `coder` added
  `--accent-rgb: 47 138 230;` to the same light-mode rule in a one-line
  follow-up. No second version bump (same 0.3.13 change, not a new one).
- Verified: `node --check` on `app.js`/`data.js`; CSS braces 318/318,
  parens 461/461; a `vm`-loaded harness confirmed all 18 real type strings
  across `pokemon.js`/`altforms.js` map to a defined `--t-*` token (0
  missing/unused — the tint's one real failure mode); grep-confirmed no
  `#1d3a57` or raw `rgba(77,163,255,…)` survives; `.icon` fallback traced
  by hand (only the 2 detail-topbar icons fall outside a `--row-accent`
  scope, confirmed unaffected in color). `index.html` untouched.
- **No visual verification possible** (`CLAUDE.md` §4, as with every prior
  design change) — this is code-level-verified only. Worth a real
  screenshot: the 60% tint against dark-mode cells, the clipped corner
  watermark, the 5 drawer LED hues on an active row, and the detail-screen
  type glow.

Handoff: `temp/handoff/2026-09-06-183543-visual-overhaul.md` (includes the
same-chain follow-up). Design proposal:
`temp/design-visual-overhaul-2026-09-06/DESIGN_PROPOSAL.md`.

---

## 0.3.11 → 0.3.12 — Drawer Search row removed, dex-grid grab-to-scroll, drawer-handle hit box + drag-to-open (`coder`)

User feedback on 0.3.11's drawer, seen on a real screenshot. Direct
implementation, no mockup pass (`CLAUDE.md` §5c's new mockup-vs-direct
rule — user confirmed direct was fine for these three functional fixes).

- **Search row removed** — redundant with `#dexSearchToggle`/the `/`
  shortcut, both untouched. `wireNavIcon`'s dead `then` parameter (Search
  was its only caller) removed too. The tour step counter was never
  hard-coded to 6 — it reads `tourSteps.length` live, so it now shows
  "N / 5" with no JS change.
- **Grab-to-scroll on `.dex-list`** (dex + Favorites) — traced first:
  native touch scrolling was already working (`.phone`'s `touch-action:
  pan-y`, zero touch listeners anywhere in `app.js`), so this shipped as a
  mouse/pen-only manual `scrollTop` drag layered on top; touch is
  untouched to avoid fighting the browser's own momentum scroll. 5px slop
  before a drag "counts"; the existing delegated cell-click handler gained
  one gating line (`dragScrolled`) instead of being duplicated, so a real
  drag no longer also opens the cell underneath. `-webkit-user-drag: none`
  on grid sprites — without it a mouse-press on an `<img>` started a
  native image-drag and killed the gesture mid-stream.
- **Drawer handle** — real hit box widened 5.4×140.4px → 28×160px (the
  `<button>` is now the box; the visible pill moved to `::before`, pixel-
  identical to before) — the old target was reportedly inconsistent to
  tap. The handle now also supports press-and-drag-to-open via the same
  `startDrag`/`endDrag` machinery `#edgeZone` uses, tagged with a new
  `dragSource: "handle"` so a tap-length press still force-opens —
  `#edgeZone`'s own "zero-delta drag stays closed" behavior (fixed
  0.1.34) is untouched, proved by a 22-delta×2-mode regression sweep, not
  just inspection. The old standalone `click` listener is gone; a small
  `keydown` handler was added to keep Enter/Space working on the now
  pointer-driven button (accessibility preservation, the one addition
  beyond the literal spec).
- **Flagged, not resolved** (`TODO.md` #16): the widened 28px handle band
  overlaps the dex grid's leftmost ~28px (cells start around x=2) — a
  grab right at the screen's left edge now drags the drawer instead of
  scrolling the grid. Needs a real screenshot; narrowing to 24px is a
  one-value CSS change if it reads intrusive.
- Verified: `node --check`; HTML tag balance + CSS brace balance; a
  runnable harness (`temp/0312-fixes/drag_logic_check.js`) extracting the
  real `endDrag`/gating expressions out of `app.js` by source match (not a
  retyped copy) — 13 named cases, the 22×2 edge-zone-parity sweep, and
  gating assertions for the grab-to-scroll gating. All pass.

Handoff: `temp/handoff/2026-09-06-173754-drawer-search-row-grid-drag-handle-hitbox.md`.

---

## 0.3.10 → 0.3.11 — Drawer redesign (labelled rows, grouped, first-launch walkthrough) + Type Chart and Natures reference screens (`overlord`)

User-directed, dispatched by name: the icon-only drawer didn't communicate
what its buttons did. Every row now shows icon + always-visible text
label; two new reference screens hang off two new rows.

- **Drawer** (`index.html`/`styles.css`/`app.js`): `--menu-width` 180px
  (was an unreachable 230px token, the real width being capped at the
  "VKDex" header's measured ~83px). `measureHeaderWidth()` kept, but
  flipped from cap to **floor** — `MENU_WIDTH = max(css token, header
  width)`, so the header can never overflow the drawer; a wider drawer is
  the unavoidable consequence of labels. Rows are `.menu-btn` (the ids
  `#dexIcon`/`#favoritesIcon`/`#searchIcon`/`#settingsIcon` moved onto the
  row; the inner `.icon-cube` is a 36px decoration now, 22px `.icon`),
  `.menu-btn.active` replaces `.icon-cube.active` (accent-gradient cube +
  white stroke while active). **Grouping decision (overlord's call, user
  deferred)**: two captioned groups — *Browse* (Pokédex/Favorites/Search)
  and *Reference* (Type Chart/Natures) — with **Settings pinned to the
  bottom** (`.menu-item-bottom`, `margin-top:auto` + divider). The
  original four keep their relative order; the new pair is inserted
  between Search and Settings. Reasoning: 6 rows of three different kinds
  (navigation / static reference / a modal) read better with 10px captions
  than as one flat list, and bottom-pinned Settings is the convention
  every phone drawer users already know. Reversible in HTML alone if the
  user prefers a flat list.
- **First-launch walkthrough** (`#drawerTour`, `.drawer-tour window`):
  600ms after init, if `vkdex-drawer-tour-seen` isn't `"yes"`, the drawer
  slides open, goes pointer-inert (`.side-menu.tour-active`), every row
  dims to 0.3 except the `.tour-target`, and a 160px caption card (title
  from the row's `.menu-label`, text from its `data-tour` attribute, "N /
  6" step counter) sits beside it, vertically tracked via `offsetTop`
  (drawer-relative, no scale math). Next/Done/Skip; Escape/Backspace/
  mouse-back end it via a new first check in `backOut()`; the overlay
  click is guarded. Flag written on any exit, so Skip doesn't nag. Clear
  the key to replay it.
- **Type Chart screen** (`#typeChartScreen`, view `typechart`):
  `renderTypeChart()` builds a 19×19 CSS grid once at init from
  `TYPE_CHART` in its own key order (the games' canonical chart order),
  defaulting unlisted pairs to 1×. **Layout tradeoff**: fit-to-width with
  no horizontal scroll — ~14.5px cells, 9px glyphs (`2`/`½`/`0`, blank for
  1×), 3-letter row labels (36px) and vertically-written column labels
  (`writing-mode: vertical-rl`), every label a shrunk `.type-pill` so the
  existing `.type-TYPE` rules supply both bg and text color. Green/red/
  near-black/faint-grey cells + a 4-item legend; each cell carries a
  `title` ("Fire → Grass: ×2"). Explicit `grid-template-rows` (no
  `aspect-ratio`, `SCOPE.md` §6). If a real-device screenshot says 9px is
  too small, the fallback is a horizontally-scrolling grid with 22px
  cells — one CSS change.
- **Natures screen** (`#naturesScreen`, view `natures`): `renderNatures()`
  fills a `.detail-facts` card with 25 `.detail-row`s in `NATURES`' own
  order, key capitalized; value is a green `+ Stat` / red `− Stat` tag pair
  (labels from `STAT_ROWS`, so "Sp. Atk" matches the stats card) or a grey
  "Neutral" tag for the 5 empty entries; one-line footnote.
- Both screens: `screens`/`navIcons` entries + `wireNavIcon()`, nothing
  else — the router already generalized. Shared `.ref-body` scroll
  container (same thin-scrollbar rules as `.detail-body`). No per-Pokémon
  linkage (`TODO.md` #16 for the tap-through idea).
- Verified: `node --check` on `app.js`/`data.js`; tag/brace balance and
  duplicate-id scan on `index.html`/`styles.css`; a harness
  (`temp/sidebar-redesign/check.js`) evaluating the real `renderTypeChart`/
  `renderNatures` sources against the real data — 324 cells, split
  51 super-effective / 61 not-very / 8 immune / 204 neutral (the canonical
  Gen 6+ counts), 18 unique abbreviations, 25 nature rows / 5 neutral,
  spot-checked cells and Adamant's row. Also fixed `HISTORY.md`'s 0.3.10
  entry having been appended at the bottom instead of the top.
  **No visual verification possible** (`CLAUDE.md` §4) — drawer
  proportions, the tour card's placement, and above all the type grid's
  legibility at 9px are hand-traced only and need a real screenshot.
  `Cargo.lock`'s own `vkdex` version line bumped alongside the 4 mirrors.

Handoff: `temp/handoff/2026-09-06-171320-sidebar-redesign-type-chart-natures.md`.

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
