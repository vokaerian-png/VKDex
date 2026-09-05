# VKDex — Project Memory Bank

**Read this file first, at the start of every session.** Primary truth for
this project. Companion files: `PLAN.md` (committed roadmap), `TODO.md`
(ideas under consideration), `HISTORY.md` (version changelog).

**Reflect changes back into the memory bank as part of the same task** —
code changes here (+`HISTORY.md` for a version bump), new ideas into
`TODO.md`, new commitments into `PLAN.md`. See §11. A change isn't done
until the memory bank says it happened.

**When something is genuinely uncertain, stop and ask — don't decide it
yourself.** A design choice this file doesn't settle, a scope question, an
instruction that could reasonably go two ways: surface it to the user and
wait. Holds for every session and every kind of work, code or otherwise.

**Cards and their internal data blocks don't get reordered, restructured,
or reshuffled unless the user explicitly asks for that specific change**
(user-specified 2026-09-05, standing rule). A general review mandate
("find issues," "audit for problems," "clean this up") is not itself
permission to move something — a finding that recommends a reorder needs
a real go-ahead for that specific move before it ships, not just a
narrative sign-off in a handoff. If a reorder happens anyway and gets
caught later (a verification pass, a reviewer, or the user noticing),
**stop and ask whether it was correct** rather than assuming either way —
don't silently keep it and don't silently revert it. Precedent: 0.1.34's
`overlord` design-overhaul review moved the Facts card's Weakness/matchups
block from the end of the card to directly under Type as one of its
findings; this was never actually instructed by the user, got written up
as settled, and had to be reverted (0.1.38) once the user caught it on a
real screenshot.

---

## 1. What VKDex is

A Pokédex app: plain HTML/CSS/JS (no framework, runs in any browser) plus a
thin Electron wrapper packaging it as a portable Windows `.exe`.

UI is a **phone mockup** — a 360x800 "phone frame" (Galaxy S20 CSS viewport)
centered on the page, with a swipe-out left drawer, National Dex home
screen (with an in-place quick-search), Pokémon detail view, Favorites,
and a Settings popup (§4).

**Current version: 0.2.0** (§8 for the bump policy, `HISTORY.md` for the
changelog).

---

## 2. File layout

Project root: `E:\Claude\Projects\VKDex` (mounted under `mnt/VKDex/` in the
Cowork shell — the exact `/sessions/<name>/` prefix varies per session).

```
VKDex/
  CLAUDE.md  PLAN.md  TODO.md  HISTORY.md   <- memory bank
  src/                                       <- THE APP. All app edits go here.
    index.html
    styles.css
    app.js
    data.js                                   <- APP_VERSION, REGIONS only
    data/                                      <- per-Pokemon data, split by concern
      types.js         (TYPE_CHART: Gen 9 type-effectiveness chart, static)
      pokemon.js       (POKEMON_DATA: id, name, region, +types/category/height/
                         weight/abilities/hiddenAbility/description)
      abilities.js     (ABILITIES, keyed by name — 179 entries)
      moves.js         (MOVES, keyed by name — 622 entries)
      movesets.js      (MOVESETS, keyed by id: levelUp/tm/egg/max)
      evolutions.js    (EVOLUTIONS, keyed by id: evolvesTo chain)
      locations.js     (LOCATIONS, keyed by id -> region -> areas)
      names.js         (NAMES, keyed by id: ja/jaRomaji/fr/de/ko)
      stats.js         (STATS, keyed by id: base stats, capture rate, exp growth)
      altforms.js      (ALT_FORMS, keyed by base id — §5's Alt Formes module)
      hisui.js         (HISUI_DEX_NUMBERS: id -> Hisui's own 001-242 number)
      orre.js          (ORRE_MEMBERS: id -> C/XD/C-XD game tag)
      sprites/         (local sprite files — §3)
        pokemon/       (per-Pokemon sprites: normal/shiny/alt formes)
        items/         (item sprites)
  electron-app/                              <- portable Windows build wrapper
    main.js  copy-app.js  package.json  README.md
    app/         (generated copy of ../src, refreshed by copy-app.js)
    dist/        (electron-packager output)
  tools/                                     <- Node data-pipeline scripts (§3)
  temp/                                      <- HANDOFF.md, handoff/, PokeAPI clone, <task-slug>/ scratch
```

**Any edit to the app goes to `src/`, never the project root** (the app
files lived at root before the move into `src/`).

**Task-scoped scratch goes in its own `temp/<task-slug>/` subfolder, never
loose at `temp/` root** (user-specified 2026-09-05, after ~72MB of
undocumented one-off files had piled up there). Pipeline intermediates,
throwaway check scripts, pre-edit backups — all under a folder named for
the task, so a later cleanup can judge a whole folder at a glance.
`HANDOFF.md`, `handoff/`, and `PokeAPI-master/` stay at `temp/` root —
fixed infrastructure (§11b, the CSV pipeline), not task scratch.

**Git**: a real repo, `origin` → `github.com/vokaerian-png/VKDex`.
`.gitignore` excludes `electron-app/` and `temp/` wholesale — the Electron
wrapper and its build output have never been version-controlled; only
`src/`, `tools/`, `.claude/`, and the memory bank are tracked. Releases
(§7a) publish built `.exe`s as GitHub Release assets, not commits.

---

## 3. Data model

Per-Pokémon data lives in `src/data/` as plain JS, not JSON — `file://`
can't `fetch()`/`import` local files, so everything loads via `<script>`
tags (`index.html` loads every `data/` file between `data.js` and `app.js`;
order among them doesn't matter). Split by concern so a diff only touches
the file that changed; shared data (abilities, moves) is normalized and
referenced by name, not duplicated per-Pokémon.

**`POKEMON_DATA`** (`data/pokemon.js`): 522 entries — Kanto/Johto/Hoenn/
Sinnoh in full (ids 1-493) plus 29 Hisui-roster species (0.1.28, for the
standalone Hisui dex, §5 — not a regional pass): 22 carry a real mainline
`region` (`unova`/`kalos`/`alola` — 13/6/3, so those chips show a small
partial grid; expected) and 7 (dex 899-905, Legends: Arceus originals)
carry `hisuiOnly: true` and no `region` key. **`hisuiOnly` excludes an
entry from the unfiltered National Dex browse grid** (`renderDexList()`'s
national branch); it stays reachable via the Hisui screen (keyed by
`data/hisui.js`, not `region`), quick-search (§5), and Favorites. `id` =
national dex number; **don't assume `id` ordering is region-internal
order** beyond Kanto. `REGIONS` (`data.js`) lists all 9 mainline regions
plus the 2 standalone dexes; a region with zero entries renders "coming
soon".

Detail-screen fields in `pokemon.js`: `types`, `category`, `height`,
`weight`, `abilities` (names resolved in `data/abilities.js`, hidden
ability sorted last), `hiddenAbility` (name or absent), `description`.

**Population status:** `abilities.js` (179) and `moves.js` (622) hold
Gen-9-era values with original paraphrase descriptions. The per-Pokémon
files (`movesets`/`evolutions`/`locations`/`names`/`stats`) are **fully
populated for ids 1-493 and the 29 Hisui additions**, including every
Sinnoh `hiddenAbility` flag (backfilled 0.1.36) and all 5 previously-empty
movesets — Pinsir/Tauros/Slowking/Sceptile/Rhyperior (0.1.38). Farfetch'd
spelled with the CSV's curly apostrophe (`Farfetch’d`, 0.1.37 — user
decision). Known gap: `TODO.md` #7's remaining 5 evolution-edge items.
Next region (Unova onward) is not a `PLAN.md` commitment — `TODO.md` #2.

**Data pipeline: `tools/populate_region.js`** (unified 2026-09-05; full
scope in its header comment) is the one tool for CSV → `src/data/*.js`,
reading the `PokeAPI/pokeapi` clone at `temp/PokeAPI-master/data/v2/csv/`.

- **Target** = a region name (whole generation) or `--ids 1,2,3`.
  **Action** = `--dry-run` / `--generate` (results + descriptions-needed
  manifest) / `--assemble [descriptions.json]` (strict: every new species/
  move/ability needs a description) / `--refresh` (generate+assemble for
  ids already in `pokemon.js`; hand-authored descriptions kept; an entry
  needing a missing description is skipped and reported). `--tables a,b,c`
  scopes which of `pokemon stats evolutions movesets names locations
  altforms` get written (moves/abilities additions always).
- Every write is an **in-place, id-ordered upsert** — the same command
  adds or edits. `pokemon.js` lines carry `hiddenAbility`; `evolutions.js`
  edges carry `item`/`timeOfDay`/`moveType`; `altforms` writes Mega formes
  only, and only for a species with no `ALT_FORMS` entry yet (an existing
  hand-curated one is printed for hand-merging, never touched).
- Every write path ends in **`tools/verify_region_data.js`** (all 8 data
  files: ids present in every table, move/ability names resolve,
  `hiddenAbility` listed, `ALT_FORMS` species/abilities/sprites on disk) —
  run it after any hand edit too.
- **`--audit [--verbose]`** (read-only) diffs the 6 per-id tables, Mega
  formes, and `moves.js`/`abilities.js` against the CSVs ("would
  `--refresh` change anything?") — ~3s, one line per mismatch, exit 1 on
  any. **`--gaps`** lists CSV columns the schema lacks. First-run
  findings: `TODO.md` #10.
- `tools/populate_hisui_species.js` is the separate id-list fork for the
  Hisui/Orre standalone dexes.

`data/types.js`: `TYPE_CHART`, the full Gen 9 type-effectiveness chart
(static, sparse — only non-1× pairs), keyed attacker→defender→multiplier.
Powers the detail screen's live Weakness/Resist/Neutral computation (§5).

**Sprites** (bundled locally since 0.1.20; folder split 0.1.32):
`src/data/sprites/` = `pokemon/` + `items/`. `electron-app/copy-app.js`
copies the whole `sprites/` tree via one recursive `fs.cpSync` — a new
sprite subfolder never needs a `copy-app.js` change.

- **`pokemon/`** (and its `shiny/`): 1025 normal + 1025 shiny national-dex
  `{id}.png`, loaded via relative-path `<img src>`
  (`data/sprites/pokemon/{id}.png`, `.../pokemon/shiny/{id}.png`) — works
  over `file://` unlike `fetch()`. Also **195 cosmetic-form recolor
  sprites** (+195 shiny) under PokeAPI's raw `{species_id}-{form}.png`
  names (`493-electric.png`, `201-a.png`) because they share their base
  species' `pokemon.csv` row — the rule-6 galleries read them (§5). And
  **`0.png`**, PokeAPI's placeholder, a live fallback: every sprite `<img>`
  template carries the shared `SPRITE_ONERROR_ATTR` `onerror` (`app.js`)
  that swaps to `pokemon/0.png` on a failed load.
- **`pokemon/alt formes/`** (mirrored under `pokemon/shiny/alt formes/`,
  310/303 files): forms with their own distinct PokeAPI id — Mega/Gmax/
  regional/Totem/one-offs — as named files in `alola/` `galar/` `gmax/`
  `hisui/` `mega/` `paldea/` `totem/` subfolders (one-offs at root),
  script-sorted off the CSVs so names are CSV-authoritative (`TODO.md` #3
  for the method and per-folder counts). Used: Deoxys's 3 + Castform's 3
  (root), the 16 `hisui/` forms, 63 of `mega/`'s 97; `gmax/` unused
  (`TODO.md` #5). **The two `ALT_FORMS` sprite builders diverge**:
  `recolorOnly` entries render flat via `spriteUrl()` (`pokemon/{name}.png`,
  not under `alt formes/`); every other entry via
  `altFormSpriteUrl(sprite, shiny)`'s subfolder tree (shiny mirrors it).
- **`items/`**: 898 flat item sprites (`{item-slug}.png`) plus 7 subfolders
  of historical/version-specific art (`berries/` `dream-world/` `gen3/`
  `gen5/` `gen8/` `gen9/` `underground/`). Only consumer: the Evolution
  Line's arrow condition icons (§5) via `itemSpriteUrl()`
  (`data/sprites/items/{item}.png`, flat root only). No `ITEMS_DATA`
  table (names/descriptions, Bag-style screen) exists yet — not scoped
  (`TODO.md` #8).

---

## 4. UI / design conventions

- **Phone frame**: `.phone`, 360x800 (`--phone-width`/`--phone-height`),
  centered. Every layout number (menu width, grid columns, paddings) is
  calibrated at that base and scales up **as a unit** in Electron (§7).
- **Drawer menu** (left slide-out, Pointer Events so touch + mouse share one
  code path): a 12px edge-zone strip (the screens' left gutter; 24px
  swallowed Back-button/Kanto taps) starts the open-swipe, drag live-
  follows the pointer, snaps open/closed at a half-width threshold. Width
  capped to the "VKDex" header's rendered width (`measureHeaderWidth()`,
  ~83px). Menu items are icon-only 48px "cubes" (dark grey `#35383d`, blue
  `#4da3ff` stroke SVG, hand-coded): Pokédex/Favorites/Search/Settings.
- **Design system rule**: every popup/modal gets rounded corners via shared
  `.window` class (`border-radius: var(--window-radius)`, 18px).
- **Settings window** (`#settingsIcon` → `#settingsWindow`): 210px wide,
  `height:auto; max-height:90%`, centered, fade+scale transition, dark
  chrome (`#24262b`) regardless of theme, flex column (`.app-version` takes
  `margin-top:auto`). Closes via "×" or tapping `#settingsBackdrop`. Every
  setting persists and is read before the first render; on/off rows share
  `wireToggleSetting()`. Rows, top to bottom:
  - **Dark Mode**: CSS custom properties. `.phone.theme-dark` overrides
    `--screen-bg`/`--screen-fg`/`--chip-bg`/`--chip-fg`/`--divider` — only
    main content + chips are themed; nav/settings chrome stay dark always.
    Custom checkbox-switch, defaults on; class ships in HTML to avoid a
    load flash; persisted as `vkdex-theme`.
  - **Measurements** (`#unitsControl`): 2-box Metric/Imperial segmented
    control, `.units-btn` — its **own** class, never `.grid-width-btn`,
    because `app.js` selects `.grid-width-btn` wholesale for the column
    handler (sharing it was 0.1.34's Stat Level bug). Stacked row
    (`.settings-row.stacked`: label above, boxes below, each `flex:1`) —
    two text boxes don't fit beside a 14px label in the 178px body.
    Default metric. `setUnits()` sets `useImperialUnits`, persists as
    `vkdex-units`, re-renders an open detail screen immediately. Read by
    the Height/Weight fact row (§5) via `metersToFeetInches()`/`kgToLbs()`.
  - **Grid Width** (`#gridWidthControl`): 3-box segmented control (3/4/5
    columns, `.grid-width-btn`). Writes `--grid-cols` on `<html>` (the var
    `.dex-cell`'s width calc reads), persists as `vkdex-grid-cols`
    (default 5), read synchronously before first render. Favorites
    inherits it via shared `renderGrid()`.
  - **Shiny Grids** (`vkdex-shiny-grids`): grid cells only, via
    `gridSpriteUrl()`.
  - **Pixel Sprites** (`vkdex-pixel-sprites`, default on): off adds
    `.phone.smooth-sprites`, flipping `--sprite-rendering` for the
    upscaled detail/evolution sprites.
- **Home screen = National Dex** (`#dexScreen`). "National Dex" header
  (`#dexTitle`) uses Google Font "Luckiest Guy," yellow fill `#ffcb05`,
  blue 1.4px stroke `#2a75bb`. **The header itself IS the National Dex
  filter button** (no separate chip) — dims to `opacity:0.5` when a
  regional filter is active. `.dex-header` is its own card (dark-red bg,
  `var(--panel-border)`, rounded). Favorites reuses it with a
  `.dex-title-static` variant.
- **Region bar**: one chip per region from `REGIONS`, 4/row
  (`--region-cols`) — 11 regions → rows of 4/4/3. The last two (Hisui,
  Orre) are standalone dexes, tinted purple (`.region-chip.standalone`,
  `--accent-purple`/`--accent-purple-grad`) — see §5. A mainline region
  with zero `POKEMON_DATA` entries (Galar/Paldea) is dimmed
  (`.region-chip.empty`); partials (Unova/Kalos/Alola) are not.
- **Grid layout is flexbox, not CSS grid** (`.region-bar`, `.dex-list`):
  item width via `calc((100% - (N-1)*gap) / N)` from `--region-cols`/
  `--grid-cols`, so a short last row **centers itself** instead of
  hugging the left edge like `grid-template-columns` would. `.dex-empty`
  uses `width:100%` to still span a full row.
- **Dex panel & cells**: grid sits in `.dex-panel`, dark-red card
  (`--dex-panel-bg: #4a1f20`, fixed, not theme-dependent — nod to the
  classic Pokédex device), 8px padding. `.dex-cell` is a flex column:
  sprite → name → dex number, **intrinsic height, never forced
  `aspect-ratio`** (see pitfalls, bottom of file). Cells carry `data-id`,
  `role="button"`, `tabindex="0"`. Favorites reuses the same
  `.dex-panel > .dex-list` markup and `renderGrid()`.
- **Outlines**: `.dex-cell` gets `var(--cell-border)` (`1px solid #000`);
  `.dex-panel`/`.dex-header` get `var(--panel-border)` (`2px solid #000`).
- **Scrollbar styling** (`.dex-list`, `.detail-body`): explicitly thin/
  rounded/semi-transparent via `scrollbar-width`/`scrollbar-color` +
  `::-webkit-scrollbar*` (Electron's Chromium otherwise renders a plain
  default). Not scoped to `.is-electron` — right in a plain browser too.
- **Other `:root` tokens**: `--menu-width`, `--anim-speed` (0.25s),
  `--window-radius` (18px), `--accent` (`#4da3ff`), `--grid-cols` (5).

---

## 5. Navigation & screens

- **Screen router**: `showView(name)` in app.js. Two swappable `.screen`
  elements (`data-view`) live side by side in `.phone`: `#dexScreen`,
  `#favoritesScreen`. Exactly one visible; the other carries `hidden`
  (needs explicit `.screen[hidden]{display:none}` — see pitfalls).
- **Drawer icons** (`#dexIcon`/`#favoritesIcon`/`#searchIcon`/
  `#settingsIcon`) wired by `wireNavIcon(el, view, then)`: close drawer,
  close any open detail, switch view. `#searchIcon` targets the dex view
  with `then = openDexQuickSearch`. `.icon-cube.active` marks the current
  screen; Settings/Search never take that state.
- **Detail screen** (`#detailScreen`): slides in from the right, not
  display-toggled (`transform: translateX(100%); visibility: hidden` +
  `.active`). **`z-index:4` is deliberate** — above list screens (1),
  below edge-zone (5)/overlay (8)/drawer (10), so swipe-out still works
  with a detail view open. Opens on click/Enter/Space on any `.dex-cell`
  (delegated listeners, `data-id`). Back arrow/Escape/Backspace/mouse-back
  run `backDetail()`: pop `detailHistory` (pushed by evolution-stage taps)
  or close. ArrowLeft/ArrowRight (`stepDetail()`) step through national id
  order, clamped, clearing that history. `rerenderDetail()` rebuilds the
  body for a settings change while keeping `activeFormeKey` and scroll.
- **Detail screen body**: `renderDetail()` rebuilds `#detailBody` on every
  `openDetail()` as a stack of `.detail-section` cards, in this order:
  `pictureCardHtml()`, `altFormsCardHtml()`, `evolutionCardHtml()`,
  `foundInCardHtml()`, `factsListHtml()`, `movesCardHtml()`,
  `statsCardHtml()`. Name lives in the topbar (`#detailName`, a button;
  shows the active forme's name) — tapping opens `#detailPopup` with
  ja(+romaji)/fr/de/ko names from `data/names.js`.
  - **Alt Formes**: from `data/altforms.js`'s `ALT_FORMS[id]` — 79
    entries: Deoxys, Castform, 4 `recolorOnly` species (Unown/Burmy/
    Cherrim/Arceus — Arceus by explicit user override), 16 Hisuian-
    regional-form species, and 57 Mega species (63 `isMega` formes, incl.
    17 Legends: Z-A ones pending user confirmation — `TODO.md` #5). The
    9-rule spec is `TODO.md` #4; decisions locked on promotion are in
    `PLAN.md`'s Alt Formes entry.
    - Each forme is a sprite bubble reusing `.evo-stage`/`.evo-sprite-wrap`/
      `.evo-name`; an absent field means "same as base". A forme with
      `stats` gets its own "Base Stats — <forme>" card beneath the main one
      (`statsTableAndRadarHtml()`, shared).
    - **Tappable** = `altFormeTappable()`: every `isMega`/`isGmax` forme,
      plus any forme with `types` and/or `abilities` (`altFormeSwaps()`);
      anything else (Deoxys's stats-only formes) is inert
      (`.altform-inert`, no pointer). When any forme is tappable the base
      renders as bubble 0 (`data-forme-key=""`, `.altform-active` by
      default) so the row reads as a segmented control; tapping it reverts.
    - **Swap-on-tap, two decoupled effects**: `setActiveForme(key)` swaps
      both Picture card sprites (`#pictureMainSprite`/`#pictureShinySprite`)
      and `#detailName` for any tappable forme, and re-renders
      `.detail-facts` (`factsRowsHtml()` against a synthetic `{...entry,
      types, abilities, hiddenAbility}`) only when `altFormeSwaps()` — a
      stat-only Mega shows its own art over the base's unchanged facts.
      Records `activeFormeKey` so `rerenderDetail()` can restore it.
    - **Two ability mechanisms**: plural `abilities`/`hiddenAbility` on a
      forme *replace* the shown list while it's active (10 of the 16
      Hisuian formes); the singular `ability` (an ability *name*, resolved
      in `ABILITIES`) *appends* one tagged extra ability regardless of tap
      state — tag from `altFormeShortLabel()`: the forme's `key`, or for
      `isMega`/`isGmax` the forme name minus the species name ("Mega",
      "Mega X"). Every Mega uses it (Heatran/Darkrai excepted — no CSV
      ability row). **Mega/Gmax tags render distinctly** (0.1.37):
      `.mega-tag` (red bg, white text, black-bordered pill) vs. the
      tan/gold `.hidden-tag` every other tag (including the plain
      "Hidden" ability badge) uses.
    - **`recolorOnly: true`** collapses the module to one bubble + "+N"
      badge (`.altforms-recolor-bubble`, checked before the `.evo-stage`
      handler); tap opens `#detailPopup` with a non-interactive sprite grid.
    - **Not built**: rule 5 (lone differently-typed forme → own detail
      screen) and rule 9's moves-card half (a forme's own Level-Up
      additions, Rotom-style) — no populated species needs them.
  - **Evolution line**: `evolutionRootId()` walks `EVOLUTIONS` back to the
    chain's root, `evolutionPaths()` walks forward (DFS) to every leaf.
    Tapping an `.evo-stage` bubble navigates to that Pokémon (pushing
    `detailHistory`, so Back returns). `evoArrowLabel()` labels from
    `method`/`level`/`item`/`move`; `method: "other"` renders a blank
    arrow. **A Pokémon with no evolution relationship at all** (Deoxys,
    Snorlax, Mewtwo, ...) **hides this whole card**; one with only a
    prior evolution still renders, with no forward arrow.
    - **Layout**: a root with **3+ branches, all single-step** (`paths`
      all length 2 — Eevee's 8, Tyrogue's 3) renders as a **fan-out**
      (0.1.39, refined 0.1.40): one root `.evo-stage` in its own row, then
      **one shared `.evo-fan-arrow`** chevron (not per-branch — every
      branch evolves from the same root), then explicit `.evo-fan-row`
      groups of `FAN_ROW_SIZE` (3) branches each, `border-top: var(--divider)`
      between rows (same convention as the Facts card's `.detail-row`).
      Each `.evo-fan-branch` shows only its own condition icons + label
      above its leaf bubble — no arrow of its own. `.evo-fan-branch
      .evo-arrow-icons`/`.evo-arrow` carry fixed `min-height`s so sprites
      line up within a row regardless of icon count (item sprite vs.
      heart vs. pill vs. none); `.evo-arrow`'s `flex: 1 0 auto` (0.2.0)
      additionally absorbs a row's per-branch height difference (`.evo-
      fan-row`'s default `align-items: stretch` sizes every branch to the
      row's tallest — e.g. Sylveon's icons wrap to 2 lines, Espeon/
      Umbreon's don't) so `.evo-stage` still starts at the same y in every
      branch. Everything else (a straight chain, or any branch with
      further depth, e.g. Wurmple) keeps the original one-`.evo-row`-per-path
      layout — no shared-tree case beyond the fan exists.
    - **Methods**: `"level"`/`"stone"`/`"trade"`/`"held"`/`"other"`.
      `"held"` = an item required but held (not traded) while leveling
      up, usually with a `timeOfDay` condition (Sneasel→Sneasler,
      Happiny→Chansey, Sneasel→Weavile, Gligar→Gliscor); labels "Held".
      A **"knows a specific move" trigger** (0.1.39) reuses the `"stone"`
      shape with a shared `item: "tm-normal"` icon and a `move` field
      (the move's display name) that `evoArrowLabel()` shows instead of
      "Stone" — 7 edges: Lickitung/Tangela/Aipom/Yanma/Piloswine (`TODO.md`
      #7, closed) plus Bonsly/Mime Jr. (pre-existing blank-arrow edges,
      converted alongside). `tools/populate_region.js` classifies
      `known_move_id` into this shape too, so a `--refresh` won't revert it.
    - **Arrow condition icons** (`evoArrowIconsHtml()`, a small row above
      the arrow SVG and its text label): an `item` field (stone/trade/
      `held`) shows that item's sprite via `itemSpriteUrl()` (`black-
      augurite`/`peat-block` have no bundled art — their `<img>` hides
      itself on load failure; there is no item equivalent of `0.png`). A
      bare-friendship edge (`method: "level"`, no `level`) shows a
      hand-drawn heart SVG. Either can be followed by a hand-drawn sun/moon
      SVG when `timeOfDay` is `"day"`/`"night"`, and a `moveType` field
      (friendship only, e.g. Sylveon's `"fairy"`) reuses `pillHtml()` for
      a small type-pill tag, sized down via a `.evo-arrow-icons .type-pill`
      parent selector.
  - **Found In**: pill-chip row of every region key in `data/locations.js`
    with a non-empty area list (broader than `pokemon.js`'s single
    `region`, which only means "introduced in"). Tap opens `#detailPopup`
    with that region's areas. Zero regions → "Not found in the wild —
    evolution only." when a prior evolution exists (`evolutionRootId()`),
    else "No wild encounter data recorded."
  - **Facts list**: Type (colored `.type-TYPE` pills), then Abilities
    (name + description, hidden ability tagged), Category, merged Height/
    Weight, Capture Rate (raw + odds), Exp Growth, then — closing out the
    card — Weakness/Resists/(Immune)/Neutral pill rows computed live by
    `computeMatchups()` from `TYPE_CHART` against the entry's `types` —
    nothing per-Pokémon stored; a ×4 pill gets `.mult-4`'s gradient
    outline. **This is the original 0.1.18 order**; 0.1.34's design-
    overhaul pass moved the matchups block up to directly under Type
    without real user sign-off, and it was reverted back to here in 0.1.38
    once the user caught it (see the intro's no-unauthorized-reorder
    rule). **Capture odds use the real Gen 3+ formula** (full HP, no
    status, regular Poké Ball):
    `captureOddsPercent()` reduces to `catchRate/3` then the standard
    4-shake-check probability (catch rate 45→5.9%, 255→33.3%; 255 is *not*
    a guaranteed catch).
  - **Moves**: up to four tabs (Level-Up/TM/Egg/Max) over
    `data/movesets.js` — an empty list gets no tab (Max always; no tabs →
    no card). Rows: level (level-up only) | type pill from `MOVES` | name.
    One delegated click listener on `#detailBody`.
  - **Stats**: Base / Lv.1 / Lv.100 columns (`calcStat()`: 31 IV, 0 EV,
    neutral nature, HP formula differs from the other five) plus a BST
    "Total:" row (`.stat-total-row`, 13px vs. the table's 11.5px base —
    0.1.37, deliberately larger to stand out) and a hand-drawn hexagonal
    SVG radar (`radarSvg()`, no chart library) on a **fixed 0–255 scale**
    (`RADAR_MAX`, 280×270, r=105 — comparable across species), on a grey
    hexagon backdrop for contrast against the dark-red card.
  - `#detailPopup`/`#detailPopupBackdrop` (names, locations, recolor
    galleries) is innermost in the Escape chain, ahead of the detail
    screen itself.
- **Favorites**: toggled from `#detailFav` (`aria-pressed` drives yellow
  fill). Stored as an array of dex numbers in localStorage
  (`vkdex-favorites`) **and** mirrored into IndexedDB (`vkdex-cache` DB,
  `meta` store, key `favorites`) as a fallback if localStorage is cleared/
  unavailable. `.dex-cell-fav` corner star; `updateFavoriteBadges(id)`
  patches in place rather than re-rendering.
- **Search** = the dex quick-search only (the standalone Search screen was
  deleted 0.1.34). `queryMatcher()` matches a name substring **or an exact
  dex number**, with/without leading "#" and leading zeros — exact, not
  prefix (prefix would bury "4" under 40-49, 400-499...). Input needs
  `user-select:text` explicitly since `.phone` sets `user-select:none` for
  swipe gestures.
- **Dex quick-search**: `#dexSearchToggle` expands `#dexQuickSearch`,
  filtering `#dexList` **in place**. `renderDexList()` is one
  `POKEMON_DATA.filter()` over `dexSetFor(filter, hasQuery)`'s `match`
  (the active chip's membership, with that chip's sort/`numberFn`/
  `spriteFn`) AND `queryMatcher(query)` — search always respects the
  active chip. National + a query lifts the `hisuiOnly` exclusion (all 522
  findable; user rule 2026-09-04). Enter opens a sole result. Switching
  region filter while open closes it; the chip persists as `vkdex-region`.
  Icon swap (magnifying glass↔"×") is pure CSS (`.dex-search-toggle.active`).
- **Standalone dexes**: the Hisui/Orre chips (`REGIONS`' `standalone:
  true`) get their own `dexSetFor()` branch ahead of the usual `p.region
  === filter` one. Hisui filters/sorts/labels by `data/hisui.js`'s
  `HISUI_DEX_NUMBERS[id]` (PLA's own 001-242 track, complete 242/242);
  Orre filters by `data/orre.js`'s `ORRE_MEMBERS[id]`, sorts by national
  id, and appends the C/XD/C-XD tag (`"#016 · XD"`). Both use
  `renderGrid()`'s `numberFn` override (a `.dex-number` text override)
  rather than new markup; neither is ever written into `pokemon.js`'s
  `region`. **Hisui-specific:** the 16 Hisuian-form species show that
  sprite in the Hisui grid (browse and Hisui-context quick-search) via the
  parallel `spriteFn` override (`hisuiCellSprite()`); opening one *from
  the Hisui screen* (`currentRegionFilter === "hisui"` on a `#dexList`
  click — not Search/Favorites) auto-activates its Hisuian forme
  (`openDetail(id, autoForme)` → `setActiveForme("hisui")`) — the app's
  only navigation-context-dependent default (user-confirmed 2026-09-04).
- **`backOut()` backs out innermost-first**: settings → drawer → detail's
  popup → detail (one history step) → dex quick-search. Triggered by
  Escape, Backspace outside a text field, and mouse button 3. `/` (outside
  a text field) opens the dex quick-search from anywhere.
- **Drawer handle**: `#drawerHandle`, thin vertical grey pill on the
  phone's left edge (`z-index:6`, between edge-zone and drawer) for a
  direct-tap open alongside the edge-zone drag. 5.4px wide, 140.4px tall.

---

## 6. Offline sprite cache — removed in 0.1.20

Bundled local sprites (§3) made the old IndexedDB blob cache redundant
(`HISTORY.md` 0.1.20). The `vkdex-cache` IndexedDB database **still exists
and still matters** as the Favorites fallback (§5). Section number kept to
avoid churning cross-references.

---

## 7. The portable Electron build

`electron-app/` (sibling to `src/`) packages the app into a no-install
portable `.exe` via `electron-packager`: `npm run package:win` →
`dist/VKDex-win32-x64/VKDex.exe`.

`main.js` loads `../src/index.html` live in dev (`npm start`), or a
self-contained `./app/` copy once packaged; it sets no application menu
(`Menu.setApplicationMenu(null)`) so no default accelerators (Ctrl+R etc.)
are live. `copy-app.js` refreshes that copy from `../src` right before
packaging (its explicit `dataFiles` list for `data/*.js` — **extend it for
every new data file** — plus `data/sprites/` recursively), so dev needs no
copy step. Electron's postinstall needed npm's allowScripts approval,
recorded in `package.json`'s `allowScripts` field.

Chosen over **Tauri** (needs a Rust toolchain — revisit once more
finalized, `TODO.md` #1) and a bare browser-launcher script (not a real
app). Window resize/scaling: bottom of file, "Window resize / scaling
behavior."

---

## 7a. Release pipeline

`tools/release.js` (`node tools/release.js [--dry-run|--check]`; no new
dependencies, plain script per the `tools/` convention; shipped 2026-09-05)
builds and publishes a GitHub Release for the current version. Checks
`src/data.js`'s `APP_VERSION` against `electron-app/package.json`'s
`"version"` (hard error on mismatch), requires a clean tracked working tree
and an unused `vX.Y.Z` tag (checked local + remote), extracts that
version's `HISTORY.md` entry with its leading attribution paragraph
stripped (whatever text follows the heading before the first real `- `/
`**` content line), runs `npm run package:win`, zips the output via
Windows' built-in `tar.exe` (no npm zip dependency), then tags, pushes, and
runs `gh release create` with the zip and changelog as release notes.
`--dry-run` builds/zips but stops before tagging/pushing/publishing;
`--check` runs only the changelog-parser self-test (no git, no build, no
network). Requires the GitHub CLI (`gh`) installed and authenticated via
`gh auth login` — the script never handles a token directly. Never commits
on the user's behalf, never force-overwrites an existing tag.

---

## 8. Versioning policy

Format **major.minor.regular** (e.g. `0.1.0`). Bump the last number by 1
per change, max 999 (rollover behavior TBD). User-specified 2026-09-02.
**0.1.40 → 0.2.0 was a user-directed exception** — a deliberate minor-
version jump, not a +1 continuation; not a new standing pattern.

**Current version: 0.2.0.** Mirror on every bump, both together:
`src/data.js`'s `APP_VERSION` (feeds the "VKDex v<version>" line in
Settings, `#appVersion`) and `electron-app/package.json`'s `"version"` (so
the packaged `.exe`'s Windows file properties match).

**Exempt:** memory-bank-only edits (`CLAUDE.md`/`PLAN.md`/`TODO.md`/
`HISTORY.md`) and `tools/`-only changes don't trigger a bump — only `src/`/
`electron-app/` changes do. User-confirmed 2026-09-02. The changelog lives
in `HISTORY.md`, not here.

---

## 9. Sandbox / testing limitations

- No Playwright, no Electron binary, no network egress beyond a small
  allowlist — confirmed repeatedly, treat as permanent, not worth
  re-testing. Verification here is code-level only: `node --check`, brace/
  tag balance, id cross-references, integrity scripts, Node harnesses
  `vm`-loading the real `data/*.js`. No automated or visual verification
  is possible from Cowork; see §9a for real screenshots.
- Google Fonts is blocked, so "Luckiest Guy" won't render in sandbox
  screenshots — a sandbox artifact, not a bug.
- **The mount refuses deletes** (`rm`/`rmdir`/`unlink` → `EPERM`, even on a
  fresh test file) — a bridge-level restriction. Only a file created this
  session can be overwritten/`mv`'d; leftover scratch needs manual
  deletion by the user. **Exception: the Dropbox MCP connector's `delete`**
  (§11a) goes through the real Dropbox API, not this mount — confirmed
  working 2026-09-05.

---

## 9a. Getting real screenshots from a Cowork session

Tested and confirmed working 2026-09-03.

1. **Manual screenshot from the user (preferred)** — no setup, always
   works; ask for this first.
2. **Computer Use, scoped to `VKDex.exe`**, only if requested. Target the
   packaged build, never `npm start`: `request_access` needs the literal
   filename **`VKDex.exe`** (`["VKDex"]`/`["Electron"]` don't resolve) —
   one call enables Computer Use, a second with the filename grants
   `tier: "full"`. Window may be on a non-primary monitor
   (`screenshot`/`switch_display`); `computer_batch` with `screenshot`
   (+`zoom`) is enough to look.

---

## 10. Workflow

**User-specified 2026-09-04, absolute — a hard boundary, not a style
preference.**

- **architect** (the orchestrating session, Cowork or Claude Code CLI)
  plans, scopes, asks the user clarifying questions, and folds subagent
  output into the memory bank. **Does not write to `src/`** — no
  `index.html`/`styles.css`/`app.js`/`data.js`/`data/*.js`, direct or via
  Bash. **Exception: `src/data/sprites/`** (asset curation, not code).
  `electron-app/`/`tools/` aren't covered, though routing real code
  changes there through `coder` too is good practice.
- **`coder`** (`.claude/agents/coder.md`, Opus,
  Read/Write/Edit/Bash/Grep/Glob) does **all code-related tasks** —
  everything architect is restricted from, full stop. Implements exactly
  what architect specs, verifies its own work (`node --check` at minimum),
  writes a handoff report to `VKDex/temp/handoff/`
  (`YYYY-MM-DD-HHmmSS-short-slug.md`) per task — architect reads that
  rather than re-deriving what happened. Never touches the four memory-bank
  files; that stays architect's job.
- **`reviewer`** (`.claude/agents/reviewer.md`, Opus, read-only:
  Read/Grep/Glob/Bash) reviews `coder`'s output for errors and real
  optimizations only; findings go back to `coder` to apply. **Suspended
  2026-09-04, until further notice** (user direction — token cost):
  architect folds `coder`'s handoff straight into the memory bank. Re-
  enable on user request; the role is otherwise unchanged.
- **`explorer`** (`.claude/agents/explorer.md`, Haiku, read-only:
  WebSearch/WebFetch/Read/Grep/Glob): online research (wikis, docs, public
  repos). Reports findings back rather than saving them.
- **`overlord`** (`.claude/agents/overlord.md`, Fable, effort fixed at
  `high`, Read/Write/Edit/Bash/Grep/Glob): a combined code writer/editor/
  reviewer, **invoked only when the user calls for it by name** — not part
  of architect's normal delegation. The sole exception to "architect edits
  the memory bank, coder doesn't": on request it may review and condense
  the four memory-bank files, and it folds a shipped code change's own
  memory-bank update in directly rather than reporting back.

**Effort setting, user-specified 2026-09-04** (each agent's `.md`
frontmatter is the source of truth): `coder`/`reviewer` default to
**medium**, dropped to **low** for a small mechanical change, raised above
medium only when architect judges a task genuinely warrants it. `explorer`
defaults to medium, raised only when necessary — no low tier. **None of
the three ever exceeds `high`.** The Cowork workaround below has no native
effort parameter, so architect states the intended level in the prompt.

**Cowork note, confirmed 2026-09-04**: Cowork's Agent tool only recognizes
built-in types (`claude`, `claude-code-guide`, `Explore`, `general-purpose`,
`Plan`, `statusline-setup`) and rejects `coder`/`reviewer`/`explorer`.
**Workaround**: architect invokes `general-purpose` with a `model: "opus"`
override (`"fable"` for `overlord`), pasting the target agent's `.md`
content in as the prompt. A full Claude Code CLI session resolves
`subagent_type: "coder"` etc. directly.

---

## 11a. Session-start memory-bank backup

At the start of every session: zip the four memory-bank files and write the
archive directly (file tools — the Dropbox MCP connector can only make
plain-text files) to the user's **local Dropbox folder**,
`C:\Users\dandr\Dropbox\Apps\VKDex\backup_memory\`. Filename
`<UTC timestamp>_<app version>.zip`, e.g. `2026-09-02_22-43-50UTC_0.1.4.zip`.

**Cap: 10 archives max, enforced via the Dropbox MCP connector**
(`mcp__...__list_folder`/`delete`, folder `/Apps/VKDex/backup_memory`;
user-specified 2026-09-05). Its `delete` calls the real Dropbox API, so it
isn't subject to the mount's `EPERM` (§9) — it moves a file to Dropbox's
own "Deleted files," recoverable. After writing a new archive,
`list_folder` and `delete` the oldest until back at 10.

**Fallback**: Google Drive (`/VKDex/backup_memory/`) still works if Dropbox
is ever unavailable (switched to local Dropbox 2026-09-03, user-specified).

---

## 11b. End-of-session handoff

At the end of every session: rewrite `VKDex/temp/HANDOFF.md` from scratch —
**overwritten, not appended** — covering every piece of work done or
attempted that session, finished or not. Bar: next session's reader
(having read the four core files) should resume unfinished work **without
re-deriving it** — no re-reading data files to rediscover a gap already
found, no re-deriving a decision already made. Include: exact unfinished
prompts (quoted), open questions with their answers/tradeoffs, a concrete
"resume with this" pointer.

`HANDOFF.md` is a session-scoped supplement, not a fifth memory-bank file
— §11's rule (reflect real changes into the four files, same task) still
happens first; a finished item already folded there gets a one-line
pointer, not a re-summary. **Keep it concise** — "in detail" means no
*missing* detail, not long sentences: terse fragments, one line per fact,
no scene-setting, no narration, no restating what the other files say.

User-specified 2026-09-03; conciseness addendum 2026-09-04.

---

## 11. How this memory bank is maintained

These four files at the project root **are** the durable memory bank (the
older `stack.md`/`version.md`/`workflow.md`/`navigation.md`/`MEMORY.md`
store is superseded as of 2026-09-02, kept only as a possibly-stale record).

- **`CLAUDE.md`**: primary truth, read first every session, updated
  whenever something here becomes true or stops being true.
- **`TODO.md`**: ideas as proposed/considered. **Combine similar ideas
  into one entry with sub-points**, don't list duplicates. Candidates, not
  commitments.
- **`PLAN.md`**: definitive statements about planned/future functionality.
  Only actual commitments; unpromoted ideas stay in `TODO.md`.
- **`HISTORY.md`**: every version-history entry, newest first, one heading
  per bump.

---

## 12. Documentation conventions for this file

1. **Concise, but human-readable.** Sections should read easily and let a
   human reader derive intent at a glance — not compressed to one-line
   summaries. Same bar as §11b's, less aggressive: this file is read first
   every session, so it can afford prose that's actually load-bearing.
2. **Unnumbered (`###`) subsections live at the bottom of the file**,
   sorted after §11/§12 rather than nested under their parent section,
   which links down to them.
3. **Target: ≤850 lines total, standing cap (raised from 800, 2026-09-05,
   for the release-pipeline addition — §7a).** Every future addition gets
   an evaluate-and-compress pass in the same edit — look for restated
   context, superseded detail, or process narration to cut before the
   addition pushes the file over budget, per rule 4 below. **Only if the
   cap genuinely can't be held without cutting load-bearing information**,
   raise it by **50 lines at a time** (not 100) and note the raise here —
   this no longer needs to be asked first, just done and flagged to the
   user in the same response. Cap history: 500→800 in steps (2026-09-04/05,
   briefly pulled to ~600 by a condensing pass, reaffirmed 800 same day),
   →850 (2026-09-05, this addition).
4. **Applies to every memory-bank edit** (`PLAN.md`/`TODO.md`/`HISTORY.md`
   too, and architect's routine §11 updates, not just `overlord`'s
   condensing passes — user-specified 2026-09-05): cut restated context,
   superseded detail, and process narration; keep every fact/decision/
   cross-reference a future reader needs.

User-specified 2026-09-04, extended 2026-09-05.

---

## 13. Token-usage halt threshold

**User-specified 2026-09-04, standing rule, absolute — no exceptions for
"just one more step."** If continuing work would push **session** token
usage to or past **95%**, or **weekly** usage to or past **99%**, halt
immediately, mid-task if needed. Before stopping, write what was done and
what's left to `VKDex/temp/` — into `HANDOFF.md`'s §11b rewrite if the
session is ending anyway, otherwise a dated note — so the next session
resumes without re-deriving state.

---

**Siblings:** `PLAN.md` = committed roadmap · `TODO.md` = ideas under
consideration · `HISTORY.md` = version changelog.

---

### CSS pitfalls learned

- **`aspect-ratio` on a CSS Grid item** (implicit `grid-auto-rows`) sized
  the row track far too short while the item still rendered full height —
  overlap into the next row, content clipped by `overflow:hidden`. Fix:
  no `aspect-ratio` on a grid item, keep height intrinsic. Grids have
  since moved to flexbox entirely, but cells stay intrinsically sized for
  the same reason.
- **The `hidden` ATTRIBUTE does nothing against CSS `display:flex`** — the
  class rule wins. Anything toggled via `el.hidden` needs an explicit
  `.thing[hidden]{display:none}` rule (bit `.screen[hidden]` and
  `.search-clear[hidden]` in 0.1.4).

### Visual polish pass (0.1.5) — tokens & structural changes

- **Tokens**: `--raised-shadow`/`--raised-shadow-sm` (raised-surface
  shadows), `--accent-grad` (gradient `--accent` — active region chip,
  selected Grid Width box, recolor "+N" badge; deliberately *not*
  `.icon-cube.active`, which stays flat).
- **Sprite markup**: grid-cell/detail sprites wrapped in
  `.dex-sprite-wrap`/`.detail-sprite-wrap` (radial-gradient circular
  backdrop); the wrap carries sizing, the `<img>` is `width:100%;
  height:100%`.
- **Poké Ball watermark**: `.dex-panel::before`/`.detail-body::before`
  draw a 5%-opacity silhouette as two `background-image` layers on **one**
  pseudo-element (`::after` paints after real children, so a second
  pseudo-element drew over live content). Both parents need
  `position:relative`.
- **Scroll edge fades**: static `mask-image` on `.dex-list`/`.detail-body`
  (not scroll-position-driven) — correct as long as content padding
  exceeds the 14px fade height (both are 14px top since 0.1.34).
- **`.screen`/`.detail-screen` backgrounds are split** into
  `background-color` (themed) and `background-image` (fixed vignette) —
  don't collapse into one `background:` shorthand or the vignette breaks
  across theme swaps.

### Window resize / scaling behavior (§7)

Resizable with a locked aspect ratio (`win.setAspectRatio`) matching the
phone frame's 360:800; `minWidth`/`minHeight` locked to exactly 360/800.
Growing past that scales the **entire phone frame as a unit** (not padding
around a fixed frame):

- `index.html` adds an `is-electron` class to `<html>` before first paint
  if `navigator.userAgent` contains "Electron" — scopes everything below
  to the packaged app; plain-browser use is untouched.
- `styles.css`: `.is-electron .phone { transform:
  scale(var(--phone-scale, 1)); transform-origin: center center; }`.
- `app.js` computes `phoneScale = Math.min(innerWidth/360,
  innerHeight/800)`, sets `--phone-scale` on load and on resize
  (rAF-throttled). `useContentSize:true` + locked aspect ratio means inner
  dimensions always grow 360:800, so scale is exactly 1 at minimum and
  grows evenly — never letterboxed.
- **Coordinate-space fix**: drawer drag math is calibrated in the phone's
  unscaled/logical pixels, but `e.clientX` from Pointer Events is real
  (post-scale) screen pixels — `logicalX(clientX) { return clientX /
  phoneScale; }` at every `e.clientX` read in the drag handlers. No-op
  outside Electron (`phoneScale` stays 1).
