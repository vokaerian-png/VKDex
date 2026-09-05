# VKDex — Scope & Design

Scope and design decisions for the app itself: what it is, its UI/UX
conventions, navigation and screen behavior, and the data model. **Read
alongside `CLAUDE.md`** (primary truth, read first — file layout,
versioning, workflow, sandbox limits, and session process live there; its
intro points here).

Sections run sequentially §1-§8; a sub-clause takes its main section's
number plus a letter, a/b/c in order of appearance (`CLAUDE.md` §6 has the
full convention).

**Standing cap: ≤650 lines** (raised from 600, 2026-09-05, 0.2.8's
per-game encounter/item shapes pushed past it), same 50-line
raise-at-a-time rule as `CLAUDE.md` (full shared rule: `CLAUDE.md` §7) —
tracked independently of that file's own ≤400-line cap.

**Cards and their internal data blocks don't get reordered, restructured,
or reshuffled unless the user explicitly asks for that specific change**
(standing rule). A general review mandate ("find issues," "audit for
problems," "clean this up") is not itself permission to move something —
a finding that recommends a reorder needs a real go-ahead for that
specific move before it ships, not just a narrative sign-off in a
handoff. If a reorder happens anyway and gets caught later, **stop and
ask whether it was correct** rather than assuming either way — don't
silently keep it and don't silently revert it. Precedent: `HISTORY.md`
0.1.38 (an unauthorized reorder shipped, reverted once the user caught it
on a real screenshot).

---

## 1. What VKDex is

A Pokédex app: plain HTML/CSS/JS (no framework, runs in any browser) plus a
native packaging shell for a portable Windows `.exe` — Electron today,
**being replaced by Tauri** (unverified pending the user's own machine,
`CLAUDE.md` §2b) since Tauri can also target mobile from the same project.

UI is a **phone mockup** — a 360x800 "phone frame" (Galaxy S20 CSS viewport)
centered on the page, with a swipe-out left drawer, National Dex home
screen (with an in-place quick-search), Pokémon detail view, Favorites,
and a Settings popup (§3). **Current version: 0.2.11** (`CLAUDE.md` §3 for
the bump policy, `HISTORY.md` for the changelog).

---

## 2. Data model

Per-Pokémon data lives in `src/data/` as plain JS, not JSON — `file://`
can't `fetch()`/`import` local files, so everything loads via `<script>`
tags (`index.html` loads every `data/` file between `data.js` and `app.js`;
order among them doesn't matter). Split by concern so a diff only touches
the file that changed; shared data (abilities, moves) is normalized and
referenced by name, not duplicated per-Pokémon.

**`POKEMON_DATA`** (`data/pokemon.js`): 665 entries — Kanto/Johto/Hoenn/
Sinnoh/Unova in full (ids 1-649; Unova landed 0.2.7) plus the rest of the
29 Hisui-roster species (0.1.28, for the standalone Hisui dex, §4 — not a
regional pass): 9 carry a real mainline `region` (`kalos`/`alola` — 6/3, so
those chips show a small partial grid; expected) and 7 (dex 899-905,
Legends: Arceus originals) carry `hisuiOnly: true` and no `region` key.
**`hisuiOnly` excludes an entry from the unfiltered National Dex browse
grid** (`renderDexList()`'s national branch); it stays reachable via the
Hisui screen (keyed by `data/hisui.js`, not `region`), quick-search (§4),
and Favorites. `id` = national dex number; **don't assume `id` ordering is
region-internal order** beyond Kanto. `REGIONS` (`data.js`) lists all 9
mainline regions plus the 2 standalone dexes; a region with zero entries
renders "coming soon".

Detail-screen fields in `pokemon.js`: `types`, `category`, `height`,
`weight`, `abilities` (names resolved in `data/abilities.js`, hidden
ability sorted last), `hiddenAbility` (name or absent), `description`.
**Data-only, not yet UI-wired** (0.2.1): `isLegendary`/`isMythical`/
`isBaby` (booleans, emitted only when true — absence means false) and
`genderRate` (-1 = genderless, else 0-8 eighths-female), every entry,
sourced from `pokemon_species.csv`. `stats.js` gained the same-pass
`baseHappiness` alongside `captureRate`/`expGrowth`. No detail-screen fact
row renders any of these yet — future work, `TODO.md` #10.
**`hasFemaleSprite: true`** (0.2.3, UI-wired — §4's gender toggle) on 98
entries, hand-derived from the sprite folder below, **not** CSV-sourced —
**no longer refresh-fragile** (fixed 0.2.5, the `pokemon.js` writer now
carries it over on any `--refresh`). A future region pass populating one of
the 4 already-sprited-but-unpopulated ids (668/678/876/916 — `TODO.md` #2)
must still set it by hand the first time (done for 521/592/593 in 0.2.7).
0.2.5's CSV-sourced `hasGenderDifferences` matches this 98-id set exactly
(a cross-check, not a substitute — a future region's dimorphic ids may have
no bundled art). **`evolutions.js`'s `statCompare`/`note` are the only
fields left that a `--refresh` would silently drop** (Basculin's `note`
did get dropped by 0.2.7's Unova upsert and was restored by hand — expect
the same on any future `--tables evolutions` write over 211/234/236/265/
550/704).
**0.2.7/0.2.8, UI-wired** (`TODO.md` #8/#10 closed): `eggGroups` (1-2
English names, all 665 — Facts row beside Category) and `heldItems`
(`[{ item: slug, rates: [{ games, rate }] }]`, one group per distinct
rarity across games, 340 species — Facts row after Capture Rate, §4), both
pipeline-written and audited.

**0.2.5 schema-gap batch** (data only, unwired; `TODO.md` #10):
`pokemon.js` +`habitat`/`formsSwitchable`/`baseExperience`/
`regionalDexNumbers` (per mainline region, Kalos/Hisui excluded);
`stats.js` +`hatchCounter`/`effort` (EV yield); `movesets.js` +`tutor` and
per-row `mastery` (Legends: Arceus only); `moves.js` +`priority`/`target`/
`effectChance`/`flags`/nested `meta`; `abilities.js`/`moves.js`/`types.js`'s
`TYPE_NAMES` +a 5-language `names` sub-object. Pure lookups `data/natures.js`
(`NATURES`, 25) and `data/experience.js` (`EXPERIENCE_CURVES`, 6×101).
`SCHEMA_GAPS` now 14 (`--gaps`); what's still open is `TODO.md` #10.

**Population status:** `abilities.js` (190), `moves.js` (651) and
`items.js` (130, 0.2.7 — only items the app references, keyed by PokeAPI
slug = sprite filename) hold Gen-9-era values with original paraphrase
descriptions. The per-Pokémon files (`movesets`/`evolutions`/`locations`/
`names`/`stats`) are **fully populated for ids 1-649 and the 29 Hisui
additions**. Farfetch'd spelled with the CSV's curly apostrophe
(`Farfetch’d`, 0.1.37 — user decision). Next region (Kalos onward) is not
a `PLAN.md` commitment — `TODO.md` #2.

**`locations.js` shape (0.2.8, per-game):** `LOCATIONS[id][region]` is a
list of `{ area, enc: [{ method, games, min, max, rate }] }` — one `enc`
line per (method, game-group). `games` = "/"-joined English version names
in release order; `min`/`max`/`rate` are that game's own figures (a
single (sub-area, condition-set) slot-rarity sum, capped 100 — sub-areas/
conditions are never summed, and since 0.2.8 neither are games, so it
reads "up to N%" per game). Games sharing identical `(min,max,rate)`
collapse to one line. Japan-only Gen 1 releases are excluded from
extraction (English-name collision with international Red/Blue/Green).
Gift/static/trade rows are kept on purpose. The 7 `hisuiOnly` entries hold
`hisui: []`; a bare-string area (`populate_hisui_species.js`'s pre-0.2.7
shape) still renders, upgraded by any `--refresh --tables locations`.
**Area order (0.2.10)**: real in-game progression, not
alphabetical — `location_game_indices.csv` joined on location id, one
generation per region by coverage (kanto 3, johto 4, sinnoh 4, unova 5,
kalos/alola 6/7; **Hoenn is two-tier**, Gen 3 primary + Gen-6-only areas
appended as a trailing block, user-directed after a flagged coverage
coin-flip). An area neither chosen generation's index covers keeps its
prior alphabetical position rather than a guessed slot (~20 areas
project-wide). `tools/populate_region.js`'s `REGION_ORDER_GEN` holds
either a single generation string or (Hoenn only) a list.

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
  altforms` get written (moves/abilities/items additions always —
  `descriptions.json` carries `pokemon`/`moves`/`abilities`/`items` keys,
  0.2.7).
- Every write is an **in-place, id-ordered upsert** — the same command
  adds or edits. `pokemon.js` lines carry `hiddenAbility`; `evolutions.js`
  edges carry `item`/`timeOfDay`/`moveType`; `altforms` writes Mega formes
  only, and only for a species with no `ALT_FORMS` entry yet (an existing
  hand-curated one is printed for hand-merging, never touched).
- Every write path ends in **`tools/verify_region_data.js`** (all 9 data
  files: ids present in every table, move/ability/item names resolve,
  `hiddenAbility` listed, `ALT_FORMS` species/abilities/sprites on disk,
  `ITEMS_DATA` entries with no bundled art noted) — run it after any hand
  edit too.
- **`--audit [--verbose]`** (read-only) diffs the 6 per-id tables, Mega
  formes, and `moves.js`/`abilities.js`/`items.js` against the CSVs
  ("would `--refresh` change anything?") — ~3s, one line per mismatch,
  exit 1 on any. **`--gaps`** lists CSV columns the schema lacks (`TODO.md`
  #10). `tools/populate_hisui_species.js` is the separate, already-run
  id-list fork for the Hisui/Orre standalone dexes.

`data/types.js`: `TYPE_CHART`, the full Gen 9 type-effectiveness chart
(static, sparse — only non-1× pairs), keyed attacker→defender→multiplier.
Powers the detail screen's live Weakness/Resist/Neutral computation (§4).

**Sprites** (bundled locally since 0.1.20; folder split 0.1.32):
`src/data/sprites/` = `pokemon/` + `items/`. `electron-app/copy-app.js`
copies the whole `sprites/` tree via one recursive `fs.cpSync` — a new
sprite subfolder never needs a `copy-app.js` change.

- **`pokemon/female/`** (and `pokemon/shiny/female/`, 0.2.3): 103 files
  each, id-named same as the root — bundled art for species with a visible
  gender difference. 98 map to real `POKEMON_DATA` entries (`hasFemaleSprite`
  above); 5 don't (4 unpopulated species, plus `10235.png` — Hisuian
  Sneasel's alt-forme id, not a species id, deliberately unwired — a
  gendered-alt-forme extension would need `altforms.js`'s own scoping pass).
  No `male/` folder exists anywhere upstream — the root sprite already *is*
  the male/non-dimorphic art, so there's nothing to bundle for it.
- **`pokemon/`** (and its `shiny/`): 1025 normal + 1025 shiny national-dex
  `{id}.png`, loaded via relative-path `<img src>`
  (`data/sprites/pokemon/{id}.png`, `.../pokemon/shiny/{id}.png`) — works
  over `file://` unlike `fetch()`. Also **195 cosmetic-form recolor
  sprites** (+195 shiny) under PokeAPI's raw `{species_id}-{form}.png`
  names (`493-electric.png`, `201-a.png`) because they share their base
  species' `pokemon.csv` row — the rule-6 galleries read them (§4). And
  **`0.png`**, PokeAPI's placeholder, a live fallback: every sprite `<img>`
  template carries the shared `SPRITE_ONERROR_ATTR` `onerror` (`app.js`)
  that swaps to `pokemon/0.png` on a failed load.
- **`pokemon/alt formes/`** (mirrored under `pokemon/shiny/alt formes/`,
  310/303 files): forms with their own distinct PokeAPI id — Mega/Gmax/
  regional/Totem/one-offs — as named files in `alola/` `galar/` `gmax/`
  `hisui/` `mega/` `paldea/` `totem/` subfolders (one-offs at root),
  script-sorted off the CSVs so names are CSV-authoritative (`TODO.md` #3
  for the method and per-folder counts). Used: Deoxys's 3 + Castform's 3
  (root), the 16 `hisui/` forms, 71 of `mega/`'s 97; `gmax/` unused
  (`TODO.md` #5). **The two `ALT_FORMS` sprite builders diverge**:
  `recolorOnly` entries render flat via `spriteUrl()` (`pokemon/{name}.png`,
  not under `alt formes/`); every other entry via
  `altFormSpriteUrl(sprite, shiny)`'s subfolder tree (shiny mirrors it).
- **`items/`**: 898 flat item sprites (`{item-slug}.png`) plus 7 subfolders
  of historical/version-specific art (`berries/` `dream-world/` `gen3/`
  `gen5/` `gen8/` `gen9/` `underground/`). Consumers, all via
  `itemSpriteUrl()` (`data/sprites/items/{item}.png`, flat root only): the
  Evolution Line's arrow condition icons, the Facts card's Held Items chips
  and the item popup (§4). `data/items.js`'s `ITEMS_DATA` (0.2.7) names and
  describes the 130 items those reference — not a catalogue, no Bag screen
  (`TODO.md` #8). **Description convention (0.2.9)**: no redundant
  category prefix — the popup title already names the item, so a
  description doesn't restate "Held item;"/"Berry;" (86 entries stripped
  of exactly that); a genuinely descriptive lead-in like Honey's "Sweet
  honey; ..." is fine and was kept.

---

## 3. UI / design conventions

- **Phone frame**: `.phone`, 360x800 (`--phone-width`/`--phone-height`),
  centered. Every layout number (menu width, grid columns, paddings) is
  calibrated at that base and scales up **as a unit** in Electron
  (`CLAUDE.md` §2).
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
    control, `.units-btn` — its **own** class, never `.grid-width-btn`
    (`app.js` selects that wholesale for the column handler; sharing it was
    0.1.34's Stat Level bug). Stacked row (`.settings-row.stacked`: label
    above, boxes below) — two boxes don't fit beside the label in the 178px
    body. Default metric. `setUnits()` sets `useImperialUnits`, persists as
    `vkdex-units`, re-renders an open detail screen immediately. Read by
    the Height/Weight fact row (§4) via `metersToFeetInches()`/`kgToLbs()`.
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
  `--accent-purple`/`--accent-purple-grad`) — see §4. A mainline region
  with zero `POKEMON_DATA` entries (Galar/Paldea) is dimmed
  (`.region-chip.empty`); partials (Kalos/Alola) are not.
- **Grid layout is flexbox, not CSS grid** (`.region-bar`, `.dex-list`):
  item width via `calc((100% - (N-1)*gap) / N)` from `--region-cols`/
  `--grid-cols`, so a short last row **centers itself** instead of
  hugging the left edge like `grid-template-columns` would. `.dex-empty`
  uses `width:100%` to still span a full row.
- **Dex panel & cells**: grid sits in `.dex-panel`, dark-red card
  (`--dex-panel-bg: #4a1f20`, fixed, not theme-dependent — nod to the
  classic Pokédex device), 8px padding. `.dex-cell` is a flex column:
  sprite → name → dex number, **intrinsic height, never forced
  `aspect-ratio`** (see §6); carries `data-id`, `role="button"`,
  `tabindex="0"`. Favorites reuses the same markup and `renderGrid()`.
- **Outlines**: `.dex-cell` gets `var(--cell-border)` (`1px solid #000`);
  `.dex-panel`/`.dex-header` get `var(--panel-border)` (`2px solid #000`).
- **Scrollbar styling** (`.dex-list`, `.detail-body`): thin/rounded/semi-
  transparent via `scrollbar-width`/`scrollbar-color` + `::-webkit-
  scrollbar*` (Electron's Chromium otherwise renders a plain default). Not
  scoped to `.is-electron` — right in a plain browser too.
- **Other `:root` tokens**: `--menu-width`, `--anim-speed` (0.25s),
  `--window-radius` (18px), `--accent` (`#4da3ff`), `--grid-cols` (5).

---

## 4. Navigation & screens

- **Screen router**: `showView(name)` in app.js. Two swappable `.screen`
  elements (`data-view`) live side by side in `.phone`: `#dexScreen`,
  `#favoritesScreen`. Exactly one visible; the other carries `hidden`
  (needs explicit `.screen[hidden]{display:none}` — see §6).
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
  or close — **a second press within 400ms of the first** (0.2.1) skips the
  rest of the stack and closes directly; one guard in `backDetail()` covers
  all 4 triggers. Doesn't touch `backOut()`'s outer layers (settings/
  drawer/popup stay one press per layer). ArrowLeft/ArrowRight
  (`stepDetail()`) step through national id order, clamped, clearing that
  history. `rerenderDetail()` rebuilds the body for a settings change
  while keeping `activeFormeKey` and scroll.
- **Detail screen body**: `renderDetail()` rebuilds `#detailBody` on every
  `openDetail()` as a stack of `.detail-section` cards, in this order:
  `pictureCardHtml()`, `altFormsCardHtml()`, `evolutionCardHtml()`,
  `foundInCardHtml()`, `factsListHtml()`, `movesCardHtml()`,
  `statsCardHtml()`. Name lives in the topbar (`#detailName`, a button;
  shows the active forme's name) — tapping opens `#detailPopup` with
  ja(+romaji)/fr/de/ko names from `data/names.js`.
  - **Picture card, male/female toggle** (0.2.3/0.2.4): for a
    `hasFemaleSprite` species only, two small absolutely-positioned
    `.gender-btn` circles (♂ blue/`--accent`, ♀ pink/`--accent-pink`) sit in
    the card's top-right, below `.detail-number`. `activeGender`
    (`"male"`/`"female"`, default male) resets on every `openDetail()` but
    survives a `rerenderDetail()`, same persistence pattern as
    `activeFormeKey`. `pictureSpriteUrl(entry, forme, shiny)` is the one
    resolver both `pictureCardHtml()` and `setActiveForme()` build sprite
    `src`s through, so forme and gender choices can't disagree — **an
    active non-base forme's sprite always wins** (no gendered alt-forme art
    exists), and the gender buttons are `disabled`/dim (`opacity:0.35`)
    while that's the case, re-enabling the instant base is reselected; the
    picked button's filled state stays visible underneath.
  - **Alt Formes**: from `data/altforms.js`'s `ALT_FORMS[id]` — 87
    entries: Deoxys, Castform, 4 `recolorOnly` species (Unown/Burmy/
    Cherrim/Arceus — Arceus by explicit user override), 16 Hisuian-
    regional-form species, and 65 Mega species (71 `isMega` formes, incl.
    24 Legends: Z-A ones pending user confirmation — `TODO.md` #5). The
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
      above its leaf bubble — no arrow of its own. Fixed `min-height`s on
      `.evo-fan-branch .evo-arrow-icons`/`.evo-arrow` plus `.evo-arrow`'s
      `flex: 1 0 auto` (0.2.0) keep every branch's `.evo-stage` at the same
      y within a row whatever its icon count/wrapping (Sylveon's icons wrap
      to 2 lines, Espeon's don't). Everything else (a straight chain, or any
      branch with further depth, e.g. Wurmple) keeps the original one-
      `.evo-row`-per-path layout — no shared-tree case beyond the fan exists.
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
      itself on load failure; there is no item equivalent of `0.png`).
      **Tappable since 0.2.7** (`data-item` + `role="button"`/`tabindex`,
      Enter/Space wired by hand since it's an `<img>`) → `openItemPopup()`;
      the `tm-normal` "knows a move" icon is not an item and stays inert. A
      bare-friendship edge (`method: "level"`, no `level`) shows a
      hand-drawn heart SVG. Either can be followed by a hand-drawn sun/moon
      SVG when `timeOfDay` is `"day"`/`"night"`, and a `moveType` field
      (friendship only, e.g. Sylveon's `"fairy"`) reuses `pillHtml()` for
      a small type-pill tag, sized down via a `.evo-arrow-icons .type-pill`
      parent selector. A `gender` field (0.2.3) appends a ♂/♀ glyph last in
      the row, alongside whatever icon the edge already has — Combee→
      Vespiquen (no item, no heart) shows only the glyph.
    - **Descriptor line** (`evoDescriptorHtml()`, 0.2.1/0.2.2): a plain-text
      line at the bottom of the card, inside `.detail-section` via the
      existing `.detail-section-note` class, for chains where sibling
      branches would otherwise render an identical, ambiguous label. Keyed
      off data present on any edge in the chain (not species id) — a
      `statCompare` edge field ("Evolves based on Attack vs. Defense at
      level N."), a `gender` edge field ("Evolves based on gender."), or a
      hand-authored top-level `note` on the `EVOLUTIONS` entry, checked in
      that order. Renders on the whole chain (a card shows its root's full
      tree), so e.g. Ralts/Kirlia/Gardevoir/Gallade all show one line.
      Ships on: Tyrogue (`statCompare`), Burmy + Combee/Kirlia/Snorunt
      (`gender` — the last 3 weren't label-ambiguous, added 0.2.2 purely to
      surface the requirement), and hand-authored `note`s on Wurmple (265)
      plus 0.2.6's Qwilfish (211)/Stantler (234)/Basculin (550)/Goomy
      (704 — `note` reads only off the chain root, so Sliggoo→Goodra's
      sits on Goomy). `statCompare`/`note` are hand-authored, dropped by a
      `--refresh --tables evolutions`; `gender` is tool-extracted/audited,
      so it survives one.
    - **Gendered parent sprite** (0.2.3): a row's parent-stage bubble
      (`evoStageHtml`) shows that edge's required gender's bundled sprite
      instead of the default one, if the species has one (`hasFemaleSprite`,
      §2) — today only Combee has bundled female art, so its row is the
      only one that visibly changes (Burmy/Kirlia/Snorunt stay default).
      Not wired for the fan-out layout (one shared root bubble by
      construction — no shipped fan chain is gendered).
  - **Found In**: pill-chip row of every region key in `data/locations.js`
    with a non-empty area list (broader than `pokemon.js`'s single
    `region`, which only means "introduced in"). Tap opens `#detailPopup`
    with **one popup scoped to that region's areas only** — each area is
    a native `<details>`/`<summary>` (0.2.10, no custom JS; never set
    `display` on the summary — it kills Chromium's default disclosure
    triangle), collapsed by default except a single-area region, which
    renders pre-`open`. Areas sort in real in-game progression order
    (§2), not alphabetically. Expanding an area (`.popup-row.column`)
    carries one `.enc-line` per (method, game-group): "Grass · Lv 2–5 · 50%"
    with a
    dimmer `.enc-games` sub-line naming the games underneath (§2's
    `locations.js` shape; "up to N%", never summed across games). The game
    list renders via shared `encGamesHtml()` (0.2.9), which inserts a
    `<wbr>` after every "/" so a long `/`-joined list wraps instead of
    forcing horizontal scroll (the item popup's held-in-the-wild block
    uses the same helper). Zero regions → "Not found in the wild —
    evolution only." when a prior evolution exists (`evolutionRootId()`),
    else "No wild encounter data recorded."
  - **Facts list**: Type (colored `.type-TYPE` pills), Abilities (name +
    description, hidden ability tagged), Category, **Egg Groups** (0.2.7,
    "Monster / Grass" text — sits here since 0.2.8, user-directed move),
    merged Height/Weight, Capture Rate (raw + odds), **Held Items** (0.2.7,
    `.item-chip` buttons: sprite + name + a rate summary, a single value or
    a `50–100%` span when games disagree — sits here since 0.2.8,
    user-directed move; tap → `openItemPopup()`, which since 0.2.8 also
    lists a per-game "Held in the wild" breakdown; row absent for a species
    with none), Exp Growth, then — closing out the card — Weakness/
    Resists/(Immune)/Neutral pill rows computed live by `computeMatchups()`
    from
    `TYPE_CHART` against the entry's `types` — nothing per-Pokémon stored;
    a ×4 pill gets `.mult-4`'s gradient outline. **The matchups-last order
    is the original 0.1.18 one** — 0.1.34 moved it under Type without
    sign-off, reverted 0.1.38 (the intro's rule). **Capture odds use the
    real Gen 3+ formula** (full HP, no status, regular Poké Ball):
    `captureOddsPercent()` reduces to `catchRate/3` then the standard
    4-shake-check probability (45→5.9%, 255→33.3% — not a guaranteed catch).
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
    galleries, items) is innermost in the Escape chain, ahead of the detail
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
  active chip. National + a query lifts the `hisuiOnly` exclusion (all 665
  findable; user rule 2026-09-04). Enter opens a sole result. Switching
  region filter while open closes it; the chip persists as `vkdex-region`.
  Icon swap (magnifying glass↔"×") is pure CSS (`.dex-search-toggle.active`).
- **Standalone dexes**: the Hisui/Orre chips (`REGIONS`' `standalone:
  true`) get their own `dexSetFor()` branch ahead of the usual `p.region
  === filter` one. Hisui filters/sorts/labels by `data/hisui.js`'s
  `HISUI_DEX_NUMBERS[id]` (PLA's own 001-242 track, complete 242/242);
  Orre filters by `data/orre.js`'s `ORRE_MEMBERS[id]`, sorts by national
  id, and appends the C/XD/C-XD tag (`"#016 · XD"`). Both use
  `renderGrid()`'s `numberFn` override rather than new markup; neither is
  ever written into `pokemon.js`'s `region`. **Hisui-specific:** the 16
  Hisuian-form species show that sprite in the Hisui grid via the parallel
  `spriteFn` override (`hisuiCellSprite()`); opening one *from the Hisui
  screen* (`currentRegionFilter === "hisui"` on a `#dexList` click — not
  Search/Favorites) auto-activates its Hisuian forme (`openDetail(id,
  autoForme)` → `setActiveForme("hisui")`) — the app's only navigation-
  context-dependent default (user-confirmed 2026-09-04).
- **`backOut()` backs out innermost-first**: settings → drawer → detail's
  popup → detail (one history step) → dex quick-search. Triggered by
  Escape, Backspace outside a text field, and mouse button 3. `/` (outside
  a text field) opens the dex quick-search from anywhere.
- **Drawer handle**: `#drawerHandle`, thin vertical grey pill on the
  phone's left edge (`z-index:6`, between edge-zone and drawer) for a
  direct-tap open alongside the edge-zone drag. 5.4px wide, 140.4px tall.

---

## 5. Offline sprite cache — removed in 0.1.20

Bundled local sprites (§2) made the IndexedDB blob cache redundant; the
`vkdex-cache` database **still exists** as the Favorites fallback (§4).

---

## 6. CSS pitfalls learned

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

---

## 7. Visual polish pass (0.1.5) — tokens & structural changes

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

---

## 8. Window resize / scaling behavior (`CLAUDE.md` §2/§2b)

Resizable, locked to a 360:800 aspect ratio, `minWidth`/`minHeight` exactly
360/800. Growing past that scales the **entire phone frame as a unit** (not
padding around a fixed frame) — this half is shell-agnostic and unchanged:

- `styles.css`: `.is-tauri .phone { transform: scale(var(--phone-scale, 1));
  transform-origin: center center; }` (renamed from `.is-electron` in
  0.2.11 — same rule).
- `app.js` computes `phoneScale = Math.min(innerWidth/360,
  innerHeight/800)`, sets `--phone-scale` on load and on resize
  (rAF-throttled). Scale is exactly 1 at minimum and grows evenly — never
  letterboxed, as long as the OS window itself stays on-ratio (below).
- **Coordinate-space fix**: drag math is in the phone's logical pixels but
  `e.clientX` is post-scale screen pixels — `logicalX(clientX) { return
  clientX / phoneScale; }` at every `e.clientX` read in the drag handlers.
  No-op in a plain browser tab or under a shell that isn't detected
  (`phoneScale` stays 1).

**Locking the OS window to the ratio is shell-specific — Electron and Tauri
diverge here:**

- **Electron** (`electron-app/`, still the only confirmed-working build):
  `is-electron` via a `navigator.userAgent` sniff; the window locked
  natively via `main.js`'s `win.setAspectRatio()`.
- **Tauri** (`src-tauri/`, **confirmed** — `CLAUDE.md` §2b): `is-tauri` via
  the `window.isTauri` global. A live lock via `src-tauri/src/
  resize_lock.rs`, Windows-only — subclasses the native window proc and
  rewrites the proposed rect on every `WM_SIZING` step, keeping the window
  on-ratio *during* the drag; the corner rule is a pure function of the
  proposal (0.2.16, fixed a flip-flop bug). `app.js`'s `lockAspect`
  (settle-after-drag via `window.__TAURI__`'s `set_size`/`LogicalSize`)
  stays as a no-op safety net for platforms without the native lock. Full
  detail: `HISTORY.md` 0.2.11-0.2.16.
- **Known Electron regression, transitional**: `window.isTauri` is never
  true under Electron, so a *new* Electron rebuild no longer scales the
  inner content to fill (the window itself still resizes on-ratio).
  Already-built exes unaffected; accepted until Electron's retired.

---

**Siblings:** `CLAUDE.md` = primary truth (file layout, versioning,
workflow, process) · `PLAN.md` = committed roadmap · `TODO.md` = ideas
under consideration · `HISTORY.md` = version changelog.
