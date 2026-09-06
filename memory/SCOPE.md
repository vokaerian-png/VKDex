# VKDex — Scope & Design

Scope and design decisions for the app itself: what it is, its UI/UX
conventions, navigation and screen behavior, and the data model. **Read
alongside `CLAUDE.md`** (primary truth, read first — file layout,
versioning, workflow, sandbox limits, and session process live there; its
intro points here).

Sections run sequentially §1-§8; a sub-clause takes its main section's
number plus a letter, a/b/c in order of appearance (`CLAUDE.md` §6 has the
full convention).

**Standing cap: ≤1050 lines** (raised from 1000, 2026-09-06, for the header
faceplate + dex-grid de-tint §7b addition — a compress pass first cut the
new section by ~10 lines, still ~27 over; earlier raises: 950→1000 for
0.3.12's drawer/grid fixes, 900→950 for 0.3.11's drawer redesign, and
several more before that as real load-bearing content landed, each a
50-line step), same rule as `CLAUDE.md` (`CLAUDE.md` §7) — tracked
independently of that file's own cap.

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
native packaging shell for a portable Windows `.exe` — **Tauri** (`CLAUDE.md`
§2/§2b; replaced Electron, retired 2026-09-06) since Tauri can also target
mobile from the same project. Windows + Android are the only build targets
being pursued — macOS/Linux/iOS aren't considered at this time (user
decision 2026-09-06, `PLAN.md`'s Tauri migration entry).

UI is a **phone mockup** — a 360x800 "phone frame" (Galaxy S20 CSS viewport)
centered on the page, with a swipe-out left drawer, National Dex home
screen (with an in-place quick-search), Pokémon detail view, Favorites,
two static reference screens (Type Chart, Natures — 0.3.11), and a
Settings popup (§3). **Current version: 0.3.15** (`CLAUDE.md` §3 for the
bump policy, `HISTORY.md` for the changelog).

---

## 2. Data model

Per-Pokémon data lives in `src/data/` as plain JS, not JSON — `file://`
can't `fetch()`/`import` local files, so everything loads via `<script>`
tags (`index.html` loads every `data/` file between `data.js` and `app.js`;
order among them doesn't matter). Split by concern so a diff only touches
the file that changed; shared data (abilities, moves) is normalized and
referenced by name, not duplicated per-Pokémon.

**`POKEMON_DATA`** (`data/pokemon.js`): **1025 entries — every mainline
region, Kanto through Paldea, fully populated** (ids 1-1025, completed
2026-09-06 with the Alola/Galar/Paldea pass; Unova landed 0.2.7, Kalos
0.2.22). The Hisui-roster species (0.1.28, for the standalone Hisui dex,
§4 — not a regional pass) mostly carry a real mainline `region` now that
their native regions are populated; 7 (dex 899-905, Legends: Arceus
originals) still carry `hisuiOnly: true` and no `region` key, since they
have no mainline region of their own.
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

**Population status: fully populated, ids 1-1025** (`abilities.js` 303,
`moves.js` 783, `items.js` 144, all Gen-9-era values with original
paraphrase descriptions; every per-Pokémon file — `movesets`/`evolutions`/
`locations`/`names`/`stats` — populated for the whole National Dex).
Farfetch'd spelled with the CSV's curly apostrophe (`Farfetch’d`, 0.1.37 —
user decision). **All Paldea `locations` entries are empty** (2026-09-06 —
upstream gap, the CSV clone's `encounters.csv` has zero rows for
scarlet/violet or their DLC version groups, not a pipeline bug). Further
region work now means regional-forme candidates for new-region-native
species (`TODO.md` #4), not base population — `TODO.md` #2.

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

**Data pipeline, since 0.3.6: `tools/populate_from_csv.js`** reads the
merged `csv/` source (`csv/MANIFEST.md`, PokeAPI+PokeDB, built 2026-09-06)
and is now the live path from data source → `src/data/*.js`.
`tools/populate_region.js` (below) still reads the old single-source
`temp/PokeAPI-master/` clone and is kept as an independent cross-check, not
retired. `populate_from_csv.js` reuses `populate_region.js`'s `assemble()`/
`upsertEntries()` writers unchanged for 7 of 8 per-id tables; only
`locations.js`'s writer gained real new logic (below). `--ids`/`--all`/
`--assemble`/`--tables`/`--dry-run`/`--self-test` mirror the old tool's
verbs; no `--generate`/`--refresh`/`--gaps` equivalent yet (every species
already has a hand-authored description, so nothing to manifest).

- **New capability: real Scarlet/Violet, Brilliant Diamond/Shining Pearl,
  and Legends: Arceus wild encounters** (zero PokeAPI-derived rows existed
  for any of the three). Areas use PokeDB's own vocabulary verbatim,
  deliberately **not** joined to the existing PokeAPI-derived area names
  (user decision); sorted alphabetically (no real in-game-progression data
  exists for these areas yet — known-approximate, revisit if ever sourced).
  Filed under the species' own existing region key (SV→`paldea`,
  BDSP→`sinnoh`, LA→`hisui`) as a block appended *after* that region's
  classic areas, which stay unchanged — avoids a confusing second Sinnoh
  chip. **Duplicate-name rows merged (0.3.9)**: where a PokeAPI- and a
  PokeDB-derived area share an identical display name (40 Sinnoh species,
  59 names — e.g. "Lake Verity" for both DPPt/Platinum and BDSP),
  `mergeAreasByName()` collapses them into one popup row (concatenated
  `enc` lines, first-occurrence position kept) before `openLocationPopup()`
  renders — was two identically-labelled rows, fixed without rejoining the
  two area vocabularies.
- **New per-line shape** for these three games' `enc` entries — real
  per-game rarity models, not squeezed into the classic
  `{method, games, min, max, rate}` shape (user decision): adds (all
  optional) `forme`, a **string** `rate` (`"varies"`/`"30%"`, not a
  number), `weight` (raw SV spawn weight), `group`, `timeRates`, `times`,
  `weather`, `terrain`, `alphaMin`/`alphaMax`, `boulder`, `hiddenAbility`,
  `teraStars`, `homeMin`/`homeMax`, `tradeFor`, `note`. Full spec:
  `NEW_ENC_SHAPE` atop `tools/populate_from_csv.js`. **Rendered richly since
  0.3.9**: `openLocationPopup()` appends each present field (forme resolved
  via `ALT_FORMS` or title-cased fallback; tera stars as "N★ Tera Raid";
  alpha/Way-Home levels as a level-range segment like the classic `Lv`
  one; terrain/weather/times title-cased and joined; a `timeRates`
  breakdown only when 2+ keys are present; hidden-ability/boulder as fixed
  labels; `group`/`tradeFor` as the raw PokeDB slug verbatim, no species-
  name lookup) as its own ` &middot; ` segment before the games sub-line.
  `weight` (raw SV spawn weight, meaningless outside its own area) is
  deliberately skipped. A classic-shape line still renders byte-identical.
- **Cross-region wild encounters (0.3.10)**: `LOCATIONS[id]` can now carry
  a region key that ISN'T that species' own native region — a species'
  appearances in *other* regions' games (e.g. Kanto-native Pidgey's real
  encounter rows in X/Y's Kalos routes). `tools/populate_from_csv.js`'s
  `buildClassicAreas()` runs once for the species' own region (unchanged
  output) and once more per approved foreign region, feeding results into
  the same `extra`-merge mechanism `assemble()` already used for SV/BDSP/
  LA (any region key, any species — no `assemble()` changes needed).
  Approved regions: kanto/johto/hoenn/sinnoh/unova/kalos/alola. **Galar
  excluded** (its foreign rows are ~90% Max Raid Den/Dynamax Adventure, a
  rotating pool, not a fixed location — `TODO.md` #15); Paldea/Hisui
  excluded by definition (no PokeAPI `encounters.csv` rows for either).
  `foundInRegions()` sorts the returned chip list into `REGIONS`' own
  canonical order rather than data-insertion order, since a species can
  now carry 3-5 Found In chips instead of the usual 1-2.
- **SV's Kitakami (The Teal Mask)/Blueberry Academy (The Indigo Disk) DLC
  areas are correctly labelled** (0.3.8) — each line's `games` names the
  real DLC instead of a blanket "Scarlet/Violet", via a real join
  (`encounters_scarlet_violet.location_area` →
  `location_areas_pokedb.location` → `locations_pokedb.region_area` →
  `region_areas_pokedb.identifier`), not a name heuristic. **The Paldea
  chip badges "DLC" for DLC-only species since 0.3.9** — `isDlcOnlyRegion()`
  checks, at render time, whether every `enc` line for that region matches
  a DLC label (bare `"The Teal Mask"`/`"The Indigo Disk"` or a version-
  exclusive compound like `"Violet: The Indigo Disk"`, regex-matched
  against a census of every real label in `locations.js`) — no new
  `REGIONS` entries or pipeline changes, user's chosen (lighter) option
  over splitting Kitakami/Blueberry Academy into their own chips. A mixed
  base+DLC species (e.g. Pikachu) correctly stays unbadged.
- `NEEDS_SOURCE_REGIONS` (0.3.3) **no longer includes `"paldea"`** (0.3.7) —
  104/120 native-Paldea species now have real SV data; the other 16 (9
  evolution-only, 7 static/event-only) correctly fall through to the
  existing "evolution only"/"no wild encounter data" messages, both now
  accurate rather than a source gap.
- **`baseExperience` reads the Gen 7+/current era** (0.3.6, was Gen 5-6);
  **`moves.js` entries gained `jaRomaji`** (0.3.6, all 783) — both
  data-only/unwired. Hand-authored evolution `note`/`statCompare`
  (211/234/236/265/550/704) are now **carried over automatically** by
  `assemble()` every run (0.3.6), closing the fragility hit in 0.2.7/0.2.22.

**`tools/populate_region.js`** (unified 2026-09-05; full scope in its
header comment; superseded as the live pipeline by the above, 0.3.6, but
still the cross-check) reads the `PokeAPI/pokeapi` clone at
`temp/PokeAPI-master/data/v2/csv/`.

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

**`movesets_hisui.js` (0.2.18, `MOVESETS_HISUI`, 241 entries):** Legends:
Arceus (PLA) has genuinely different move-learning mechanics — its CSV rows
are level-up (with a `mastery` rank) and tutor only, never TM/egg — so PLA
data is never merged into `movesets.js`'s mainline pick; it's extracted
separately here, `{levelUp, tutor}` per id (either key omitted if empty),
rendered only when the detail screen is opened from the Hisui screen (§4).
`movesets.js`'s own version-group selection excludes PLA from "best" unless
a species has no non-PLA moveset data at all (the 7 `hisuiOnly` species —
unaffected either way, since their `movesets.js` entries were never
PLA-sourced). 17 of the 241 entries fall back to a non-default form's PLA
rows (the 16 Hisuian regional forms, Giratina-Origin, Basculin-white-striped)
since their base species has none. **A `-hisui`-suffixed form's own PLA
rows now win outright whenever it has any (0.2.19)** — checked directly
off the CSVs, this only ever mattered for **one** species, not the 7
originally assumed: Sneasel (#215) is the sole case where both base and its
Hisuian form carry PLA rows (every other `-hisui` form's base has zero PLA
rows, so the pre-existing fallback already picked the Hisuian form for
those). Giratina-Origin/Basculin-white-striped are unaffected by this
change — neither has an `ALT_FORMS` entry, so nothing auto-activates for
them on the Hisui screen, and the user's reasoning for the flip (matching
what the Hisui screen already shows by default) doesn't apply. Porygon2
(#233) has no PLA rows in the source clone at all — 241/242 Hisui-roster
species, not a bug.

`data/types.js`: `TYPE_CHART`, the full Gen 9 type-effectiveness chart
(static, sparse — only non-1× pairs), keyed attacker→defender→multiplier.
Powers the detail screen's live Weakness/Resist/Neutral computation (§4).

**Sprites** (bundled locally since 0.1.20; folder split 0.1.32):
`src/data/sprites/` = `pokemon/` + `items/`. Tauri's `frontendDist` embeds
`src/` directly at build time (`CLAUDE.md` §2b) — no copy step at all, so a
new sprite subfolder needs no build-config change (Electron's
`copy-app.js` needed one; moot since its retirement, `CLAUDE.md` §2).

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
  calibrated at that base and scales up **as a unit** in the packaged Tauri
  app (`CLAUDE.md` §2/§2b, §8 below).
- **Drawer menu** (left slide-out, Pointer Events so touch + mouse share one
  code path): a 12px edge-zone strip (the screens' left gutter; 24px
  swallowed Back-button/Kanto taps) starts the open-swipe, drag live-
  follows the pointer, snaps open/closed at a half-width threshold. Width
  = `--menu-width` (180px since 0.3.11), **floored** at the "VKDex"
  header's rendered width (`measureHeaderWidth()`, ~83px — the cap it was
  for the old icon-only strip, flipped once labels arrived). **Rows
  (0.3.11)**: `.menu-btn` = 36px `.icon-cube` (dark grey `#35383d`, blue
  `#4da3ff` hand-coded stroke SVG) + always-visible `.menu-label` text, in
  two captioned groups (`.menu-group-label`): *Browse* — Pokédex/
  Favorites; *Reference* — Type Chart/Natures; then Settings pinned
  to the bottom (`.menu-item-bottom`, `margin-top:auto` + divider). The
  original four's relative order is unchanged; the grouping/pinning was
  overlord's call under a user deferral, reversible in HTML alone.
  **Search row removed (0.3.12)** — redundant with the dex screen's own
  `#dexSearchToggle` quick-search and the `/` shortcut (both unaffected,
  §4/below); Browse is now just Pokédex/Favorites, 5 rows total.
  `.menu-btn.active` (accent-gradient cube, white stroke) marks the
  current screen. **First-launch walkthrough**: 600ms after init, unless
  `vkdex-drawer-tour-seen` is `"yes"`, the drawer opens pointer-inert
  (`.side-menu.tour-active`), each row dims except the `.tour-target`, and
  `#drawerTour` (a `.window` card beside the drawer, title from the row's
  label, text from its `data-tour` attribute, "N / 5" — computed from the
  live row count, not hard-coded, so it tracked the Search-row removal
  with no JS change) steps through with Next/Done/Skip; `backOut()` ends
  it first, overlay click is guarded; the flag is written on any exit.
  Delete the key to replay.
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
  `--accent-purple`/`--accent-purple-grad`) — see §4. **Every mainline
  region is fully populated as of 2026-09-06** (`.region-chip.empty`'s
  zero-entry dimming is dead code with today's data — kept, since it's
  general-purpose, not a special case to remove).
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
  **Grab-to-scroll (0.3.12)**: `.dex-list` (both grids) supports
  press-and-drag scrolling for mouse/pen only — touch is excluded on
  purpose, since native touch scrolling already works (`.phone`'s
  `touch-action: pan-y`) and a manual scroll would fight the browser's own
  momentum scroll. 5px slop before a drag "counts," gating the existing
  delegated cell-click handler (`dragScrolled`) so a real drag doesn't also
  open the cell underneath; `-webkit-user-drag: none` on cell sprites stops
  a mouse-press starting a native image-drag mid-gesture.
- **Outlines**: `.dex-cell` gets `var(--cell-border)` (`1px solid #000`);
  `.dex-panel`/`.dex-header` get `var(--panel-border)` (`2px solid #000`).
- **Scrollbar styling** (`.dex-list`, `.detail-body`): thin/rounded/semi-
  transparent via `scrollbar-width`/`scrollbar-color` + `::-webkit-
  scrollbar*` (WebView2's Chromium engine otherwise renders a plain
  default on Windows — `CLAUDE.md` §2b/PLAN.md's Tauri entry). Not scoped
  to `.is-tauri` — right in a plain browser too.
- **Other `:root` tokens**: `--menu-width`, `--anim-speed` (0.25s),
  `--window-radius` (18px), `--accent` (`#4da3ff`), `--grid-cols` (5).

---

## 4. Navigation & screens

- **Screen router**: `showView(name)` in app.js. Four swappable `.screen`
  elements (`data-view`) live side by side in `.phone`: `#dexScreen`,
  `#favoritesScreen`, `#typeChartScreen`, `#naturesScreen` (the last two
  0.3.11). Exactly one visible; the others carry `hidden` (needs explicit
  `.screen[hidden]{display:none}` — see §6).
- **Drawer rows** (`#dexIcon`/`#favoritesIcon`/`#typeChartIcon`/
  `#naturesIcon`/`#settingsIcon` — ids sit on the `.menu-btn` row, §3;
  `#searchIcon` removed 0.3.12) wired by `wireNavIcon(el, view, then)`:
  close drawer, close any open detail, switch view. `.menu-btn.active`
  marks the current screen; Settings never takes that state.
- **Reference screens (0.3.11)** — static data, rendered once at init,
  no per-Pokémon linkage (tap-through from a Type pill or nature is
  `TODO.md` #16). Both: `.dex-header` + `.dex-title-static`, then a
  `.ref-body` scroll container (same thin-scrollbar rules as
  `.detail-body`).
  - **Type Chart** (`renderTypeChart()`): a 19×19 CSS grid in a
    `.detail-section` card — attackers down, defenders across, in
    `TYPE_CHART`'s own key order, unlisted pairs defaulted to 1×.
    **Fit-to-width, no horizontal scroll** (a deliberate legibility
    tradeoff, unconfirmed on a real screen): ~14.5px cells with 9px glyphs
    (`2`/`½`/`0`, blank for 1×) on green/red/near-black/faint-grey
    (`.tc-2`/`.tc-half`/`.tc-0`/`.tc-1`); 3-letter labels (unique across
    all 18 types, `slice(0,3)`) as shrunk `.type-pill`s so the one set of
    `.type-TYPE` rules supplies bg + text color, column ones written
    vertically (`writing-mode: vertical-rl`). Explicit `grid-template-rows`
    (§6's `aspect-ratio` pitfall). Each cell carries a `title` tooltip;
    a 4-item legend sits under the grid. Fallback if 9px proves too
    small: horizontally-scrolling 22px cells.
  - **Natures** (`renderNatures()`): a `.detail-facts` card of 25
    `.detail-row`s in `NATURES`' order, key capitalized; value = green
    `+ Stat` / red `− Stat` tags (`.nature-up`/`.nature-down`, labels from
    `STAT_ROWS` so "Sp. Atk" matches the stats card) or a grey
    `.nature-neutral` "Neutral" for the 5 empty entries; a one-line
    `.ref-note` footnote.
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
  - **Tap-to-enlarge, 0.3.3**: `#pictureMainSprite`/`#pictureShinySprite`
    are clickable — opens `#detailPopup` (the same modal `openItemPopup`
    already uses) showing just the one sprite tapped, at `.sprite-zoom-img`
    size (220×220), sourced from the clicked `<img>`'s own live `.src`/
    `.alt` so it automatically reflects whatever forme/gender is active.
    Scoped to these two sprites only — not alt-forme bubbles, item
    sprites, or evo-stage/dex-grid sprites.
  - **Alt Formes**: from `data/altforms.js`'s `ALT_FORMS[id]` — 151
    species / 224 formes: Deoxys, Castform, 6 `recolorOnly` species
    (Unown/Burmy/Cherrim/Arceus — Arceus by explicit user override —
    plus Maushold/Dudunsparce, 0.3.2), 16
    Hisuian regional-form species, **36 Alolan/Galarian/Paldean
    regional-form species** (2026-09-06 — 18 Alola/19 Galar/2 Paldea, one
    species — Meowth — with both an Alolan and a Galarian forme), and 39
    Mega species (48 `isMega` formes, incl. the Legends: Z-A ones,
    user-confirmed kept — `TODO.md` #5). The 9-rule spec is `TODO.md` #4;
    decisions locked on promotion are in `PLAN.md`'s Alt Formes entry.
    - Each forme is a sprite bubble reusing `.evo-stage`/`.evo-sprite-wrap`/
      `.evo-name`; an absent field means "same as base". A forme with
      `stats` gets its own "Base Stats — <forme>" card beneath the main one
      (`statsTableAndRadarHtml()`, shared).
    - **Tappable** = `altFormeTappable()`: every non-`recolorOnly` forme,
      unconditionally (0.3.3 — previously gated on `isMega`/`isGmax`/
      `types`/`abilities` via `altFormeSwaps()`, which left a sprite-only-
      difference forme, e.g. Deoxys's stats-only Formes, Squawkabilly's
      Blue Plumage, Tatsugiri's Droopy/Stretchy, wrongly inert:
      unclickable, couldn't even swap the shown sprite. `setActiveForme`/
      `statsCardHtml` were already correct for that case, so the fix was
      just removing the gate). `altFormeSwaps()` still gates whether the
      Facts card's types/abilities actually swap on tap — that part is
      unchanged. The base renders as bubble 0 (`data-forme-key=""`,
      `.altform-active` by default) whenever the species has any
      non-`recolorOnly` forme at all, so the row reads as a segmented
      control; tapping it reverts. (`.altform-inert` CSS/class still exist
      but are now dead — never applied — left in place, zero runtime cost.)
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
    - **Rule 7's combined stat card, built 2026-09-06**: non-Mega/Gmax
      formes sharing a byte-identical stat line render one "Base Stats —
      A / B / C" card instead of one per forme (first real case: Paldean
      Tauros's 3 breeds). Megas/Gmax otherwise keep one card each even when
      identical — Tatsugiri's 3 stat-identical Megas were the one exception,
      user-deduped to a single "Mega Tatsugiri" entry (0.3.1, `TODO.md` #5),
      a separate question from this rule.
    - **Not built**: rule 5 (lone differently-typed forme → own detail
      screen) and rule 9's moves-card half (a forme's own Level-Up
      additions, Rotom-style) — no populated species needs them.
  - **Evolution line**: `evolutionRootId()` walks `EVOLUTIONS` back to the
    chain's root, `evolutionPaths()` walks forward (DFS) to every leaf.
    Tapping an `.evo-stage` bubble navigates to that Pokémon (pushing
    `detailHistory`, so Back returns). `evoArrowLabel()` labels from
    `method`/`level`/`item`/`move`; `method: "other"` renders a blank
    arrow (an edge's own `note`, 0.3.5, overrides the label entirely —
    see below). **A Pokémon with no evolution relationship at all**
    (Deoxys, Snorlax, Mewtwo, ...) **hides this whole card**; one with
    only a prior evolution still renders, with no forward arrow.
    - **Per-forme evolution override, 0.3.4/0.3.5** (`TODO.md` #4): a
      regional-variant forme can carry its own `evolvesTo` on
      `ALT_FORMS[id].formes[key]` (same edge-array shape as
      `EVOLUTIONS[id]`), read by `evoEdgesFor(id)` instead of
      `EVOLUTIONS[id]` while that forme is active on the *viewed* species
      — falling back to `EVOLUTIONS` otherwise, same override-with-
      fallback shape `types`/`abilities` already use. Every other species
      in the same chain (not the one being viewed) contributes its base
      edges **plus** any forme-only routes, deduped against what the base
      already reaches — this is what makes the backward direction work
      (an evolved species like Sirfetch'd showing its real prior stage)
      without a viewed regional variant's override leaking sideways into a
      sibling's branch. `setActiveForme` rebuilds/removes/inserts the
      `.evolution-card` on forme tap, mirroring the Facts card's swap.
      **A form-restricted evolution row with no matching `ALT_FORMS`
      forme is never invented** — left on the base entry instead (one
      real case: 550 Basculin/Basculegion). **Ancestor/self bubbles are
      forme-aware (0.3.9)**: `formeEvoEdges()` tags every edge with the
      forme key it came from (`fromFormeKey`); `evoEdgesFor()`'s ancestor
      branch lets a forme sharing the *viewed* species' active forme key
      replace the base edge to the same target (e.g. Alolan Vulpix's Ice
      Stone route replaces base Vulpix's Fire Stone route when Alolan
      Ninetales is active) instead of being deduped away; `evoStageForme()`
      resolves which forme (if any) a given stage bubble should render as
      (active forme on the viewed species, or the `fromFormeKey` of the
      edge leading into the next step), consumed by `evoStageHtml()`'s
      `nameOverride` param at all 3 render sites (straight chain, fan-out
      root, fan-out leaves). Base view (no forme active) is unchanged. This
      closed the Sirfetch'd case too, with no species-specific code:
      Galarian Farfetch'd is Sirfetch'd's *only* route (base Farfetch'd has
      no `evolvesTo` at all), so its `fromFormeKey`-tagged edge always wins,
      and Sirfetch'd's page now shows the Galarian sprite/name as its prior
      stage. **Not built**: target-forme auto-navigation in either
      direction — tapping a forme-tagged ancestor bubble still opens the
      *base* species' page (`data-id` stays the base id on purpose) —
      explicit scope decision, `TODO.md` #4.
    - **Edge-level `note`, 0.3.5**: distinct from the pre-existing
      entry-level `EVOLUTIONS[id].note` (211/234/265/550/704 —
      chain-wide, rendered by `evoDescriptorHtml` as one line under the
      whole card). An edge's own `note` (currently only Galarian
      Slowpoke's two Galarica Cuff/Wreath branches) overrides just that
      arrow's label, for when two branches of the same forme-override
      would otherwise render an identical generic label (both "Stone").
      Same field name, different owner/render-site — watch for collision
      if this spreads further.
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
    else "No wild encounter data recorded." — **unless** the species'
    region is in `NEEDS_SOURCE_REGIONS` (0.3.3; **empty since 0.3.7** — its
    one entry, `"paldea"`, was cleared once real SV encounter data landed;
    see above), in which case a distinct `.needs-source`-styled note
    renders instead. Hand-extend the list for a future confirmed
    whole-region gap; not a general blank-field heuristic (`TODO.md` #2).
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
  - **Moves**: up to five tabs (Level-Up/TM/Egg/Max/**Tutor**, the last
    added 0.2.19 — `MOVE_TABS`, appended after Max, existing four order
    unchanged) over `data/movesets.js` — an empty list gets no tab (Max
    always; no tabs → no card). Rows: level (level-up only) | type pill
    from `MOVES` | name. One delegated click listener on `#detailBody`.
    Tutor is a flat move-name list like TM/Egg (which NPC/location teaches
    it isn't tracked — a possible future feature, not this one). **Hisui
    override (0.2.18)**: opened from the Hisui screen specifically (the
    same `fromHisuiScreen` signal the auto-forme default already computes,
    `autoForme` in `openDetail()`) — if `data/movesets_hisui.js`'s
    `MOVESETS_HISUI` has an entry for that id, the card renders from it
    instead, over its own two-tab list (`MOVE_TABS_HISUI`: Level-Up/Tutor
    only — PLA has no TM/Egg/Max mechanic at all, so this list stays
    shorter than mainline's regardless). Falls back to `movesets.js` if the
    id has no Hisui entry.
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
  active chip. National + a query lifts the `hisuiOnly` exclusion (all
  1025 findable; user rule 2026-09-04). Enter opens a sole result.
  Switching region filter while open closes it; the chip persists as
  `vkdex-region`. Icon swap (magnifying glass↔"×") is pure CSS
  (`.dex-search-toggle.active`).
  - **Regional-variant search dual-display (2026-09-06)**: if a query
    matches a species with any regional-variant alt forme — Hisuian, or
    the new Alolan/Galarian/Paldean ones below — **both** the base and
    the variant render as separate result rows (searching "sneasel" or
    "raichu" surfaces 2 rows; "meowth" — the one species with both an
    Alolan and a Galarian forme — surfaces 3; "tauros" (3 Paldean breeds)
    surfaces 4). Mega/Gmax formes are excluded, never get their own row.
    A variant's own name is itself searchable ("galarian" alone surfaces
    all 19 Galarian-form rows). `renderDexList()` pushes a synthetic
    `{id, name, forme}` row per matching non-active-chip variant (via
    `regionalFormes()`, below); `cellHtml()` renders it with the forme's
    own sprite and a `data-forme` attribute; tapping it opens straight to
    that forme (`setActiveForme()`). This is retroactive — applies to the
    16 already-shipped Hisuian forms too, not just the 3 new regions.
- **Standalone dexes**: the Hisui/Orre chips (`REGIONS`' `standalone:
  true`) get their own `dexSetFor()` branch ahead of the usual `p.region
  === filter` one. Hisui filters/sorts/labels by `data/hisui.js`'s
  `HISUI_DEX_NUMBERS[id]` (PLA's own 001-242 track, complete 242/242);
  Orre filters by `data/orre.js`'s `ORRE_MEMBERS[id]`, sorts by national
  id, and appends the C/XD/C-XD tag (`"#016 · XD"`). Both use
  `renderGrid()`'s `numberFn` override rather than new markup; neither is
  ever written into `pokemon.js`'s `region`.
- **Regional-variant chip visibility + auto-default (2026-09-06,
  generalizes what was "Hisui-specific" below)**: `regionalFormes(id,
  region?)` (`app.js`, after `renderRegionBar()`) returns an id's
  non-Mega/Gmax/recolorOnly formes keyed to a `REGIONS` id (`key` equals
  or starts with a region id, e.g. Tauros's 3 Paldean breeds); `[0]` is
  the one a chip shows/auto-activates. **Any mainline region chip**
  (Alola/Galar/Paldea, same mechanism Hisui always had) now also matches
  a species that isn't natively from there but has a variant there
  (`dexSetFor()`'s ordinary `p.region === filter` branch: `match` also
  admits `regionalFormes(p.id, filter).length > 0`), shown with that
  region's sprite (`regionalCellSprite(region)`, replaces the old
  Hisui-only `hisuiCellSprite()`) instead of the base art — "displayed
  instead of the original forme." Opening one **from that chip**
  auto-activates the regional forme (`openDetail(id, fromRegion,
  formeKey)` — `fromRegion` is the active chip when tapped from `#dexList`,
  null from Favorites/arrows/evolution taps/Back; `fromHisuiScreen =
  fromRegion === "hisui"` still gates the PLA moves card, unchanged).
  Opened from anywhere else (native region, Favorites, a base-name search
  hit), it opens on base as always. Cell name stays the base species name;
  grid sort stays dex-number order (a variant sorts next to its base, not
  separately — `TODO.md` #4 flags this as a blind visual choice, not
  confirmed on a screenshot yet).
- **`backOut()` backs out innermost-first**: settings → drawer → detail's
  popup → detail (one history step) → dex quick-search. Triggered by
  Escape, Backspace outside a text field, and mouse button 3. `/` (outside
  a text field) opens the dex quick-search from anywhere.
- **Drawer handle**: `#drawerHandle`, thin vertical grey pill on the
  phone's left edge (`z-index:6`, between edge-zone and drawer). **Hit box
  widened 0.3.12** — the tiny 5.4×140.4px visible pill (now drawn via
  `::before`, pixel-identical to before) sat inside a real 5.4px-wide
  `<button>`, an unreliable touch target; the interactive box is now
  28×160px at the phone's left edge, the visible pill unchanged. Also
  0.3.12: the handle supports press-and-drag-to-open through the same
  `startDrag`/`endDrag` machinery `#edgeZone` uses (tagged `dragSource:
  "handle"` so a tap-length press still force-opens — `#edgeZone` stays
  drag-only, unchanged), replacing the old plain `click` listener; a
  `keydown` handler keeps Enter/Space working now pointer events drive it.
  **Unconfirmed tradeoff** (`TODO.md` #16): the wider band overlaps the
  grid's leftmost ~28px, so a grab right at the edge drags the drawer
  instead of scrolling — narrowing to 24px is a one-value fix if needed.

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
  selected Grid Width box; superseded on the recolor "+N" badge by
  `--accent-warm-grad` since 0.3.13, below).
- **Sprite markup**: grid-cell/detail sprites wrapped in
  `.dex-sprite-wrap`/`.detail-sprite-wrap` (radial-gradient circular
  backdrop); the wrap carries sizing, the `<img>` is `width:100%;
  height:100%`.
- **Poké Ball watermark**: `.dex-panel::before`/`.detail-body::before`
  draw a 5%-opacity silhouette as two `background-image` layers on **one**
  pseudo-element (`::after` paints after real children, so a second
  pseudo-element drew over live content). Both parents need
  `position:relative`. **`.dex-panel`'s own watermark moved off-center,
  0.3.13** (below) — `.detail-body`'s stays centered, unchanged.
- **Scroll edge fades**: static `mask-image` on `.dex-list`/`.detail-body`
  (not scroll-position-driven) — correct as long as content padding
  exceeds the 14px fade height (both are 14px top since 0.1.34).

---

## 7a. Visual overhaul (0.3.13) — palette, type-tinted cards, drawer LEDs, background glow

User-directed liveliness pass, mockup-reviewed per §5c before shipping
(`HISTORY.md` 0.3.13 for full mechanism/verification; design reasoning in
`temp/design-visual-overhaul-2026-09-06/DESIGN_PROPOSAL.md`).

- **Two-accent palette**: `--accent` (blue) stays for chrome; new
  `--accent-warm`/`--accent-warm-fg`/`--accent-warm-grad` (`#ffcb05`-based)
  covers in-card selection that clashed with the red card —
  `.move-tab.active`, `.altforms-recolor-badge`. **Exception**:
  `.evo-stage.altform-active`'s ring stays blue (user call — yellow was
  near-invisible against sprite art). Light mode overrides `--accent`
  **and** `--accent-rgb` to a deeper `#2f8ae6`/`47 138 230` via
  `.phone:not(.theme-dark)` (2.6:1 → below-minimum contrast on white,
  fixed; dark mode unaffected).
- **Type-tinted dex cards — superseded 0.3.15, see §7b.** Shipped here as
  18 `--t-*` rgb-triple tokens driving a 60%-alpha per-cell type tint via
  `app.js`'s `effectiveTypes()`/`typeTintStyle()`; a real-screenshot review
  found it too visually noisy across the dense grid and it was replaced
  entirely by a depth-only "molded key" treatment with no type colour —
  both helpers were deleted as dead code. The `--t-*` tokens themselves
  survive (still used by the detail-screen type glow below). `.dex-panel`
  gained a diagonal-grain + bevel texture; its watermark moved to a
  clipped top-right corner (`overflow: hidden` added to actually clip it)
  — unaffected by the 0.3.15 reversal.
- **Drawer LEDs**: 5 new `--row-accent` id rules on the drawer rows
  (`#dexIcon` red / `#favoritesIcon` yellow / `#typeChartIcon` blue /
  `#naturesIcon` green / `#settingsIcon` slate — user confirmed red for
  Pokédex over keeping it blue). `.icon`'s stroke is
  `var(--row-accent, var(--accent))` so the detail topbar's back/star
  icons (same class, no row context) fall through unchanged.
  `.menu-btn.active`/`.tour-target` use a dark glyph on the lit tile
  (white fails contrast on the yellow/green rows).
- **Background glow**: `.screen`'s near-invisible black-alpha vignette
  (literally invisible in dark mode) replaced with a mid-grey dot-grille +
  vignette visible in both themes. `.detail-screen` layers a per-viewed-
  Pokémon-type glow on top (same `--t-*` tokens), driven by
  `applyDetailTypeGlow()` from both `renderDetail()` (every navigation
  path) and `setActiveForme()` (forme swaps). `background-color`/
  `background-image` stay split (§7's rule, unbroken).
- **`.screen`/`.detail-screen` backgrounds are split** into
  `background-color` (themed) and `background-image` (fixed vignette) —
  don't collapse into one `background:` shorthand or the vignette breaks
  across theme swaps.

---

## 7b. Header faceplate + dex-grid de-tint (0.3.15)

Follow-up after real-device screenshots of 0.3.13: the header had missed
the overhaul (still flat), and the grid's type tint (§7a) read as too
noisy. `overlord` produced 3 options each
(`temp/design-visual-overhaul-2026-09-06/DESIGN_PROPOSAL_ROUND2.md`);
architect built 6 mockups; user picked one per aspect
(`HISTORY.md` 0.3.15 for full detail).

- **Header faceplate**: `.dex-header` (dex/Favorites/Type Chart/Natures)
  gained `.dex-panel`'s hatch texture plus a CSS hardware ornament — blue
  lens (`::before`, left), red/yellow/green LED strip (`::after`, right).
  Lens dims via `.dex-header:has(.dex-title:not(.active))::before` (reuses
  the header's existing National-Dex-filter active state, §3 — the three
  static-title screens always show it lit). Padding widened to `44px`
  sides so the wordmark clears the hardware at 360px.
- **Dex-grid de-tint (reverses §7a)**: `.dex-sprite-wrap` drops all type
  colour for a depth-only "molded key" socket, `rgba(0,0,0,0.12)` (user's
  chosen depth vs. `.09`/`.16`) plus a soft highlight; `.dex-cell` gained a
  matching raised-gradient base. `effectiveTypes()`/`typeTintStyle()`
  (0.3.13) deleted as dead code — `applyDetailTypeGlow()` (§7a) resolves
  its own types independently, unaffected. Type is no longer signaled at
  the grid-cell level; the detail-screen glow and Facts pills remain the
  in-app source of truth.

Handoff: `temp/handoff/2026-09-06-191512-header-faceplate-grid-detint.md`.

---

## 8. Window resize / scaling behavior (`CLAUDE.md` §2/§2b)

Resizable, locked to a 360:800 aspect ratio, `minWidth`/`minHeight` exactly
360/800. Growing past that scales the **entire phone frame as a unit** (not
padding around a fixed frame):

- `styles.css`: `.is-tauri .phone { transform: scale(var(--phone-scale, 1));
  transform-origin: center center; }` (renamed from `.is-electron` in
  0.2.11, back when Electron was still the packaged shell — same rule).
- `app.js` computes `phoneScale = Math.min(innerWidth/360,
  innerHeight/800)`, sets `--phone-scale` on load and on resize
  (rAF-throttled). Scale is exactly 1 at minimum and grows evenly — never
  letterboxed, as long as the OS window itself stays on-ratio (below).
- **Coordinate-space fix**: drag math is in the phone's logical pixels but
  `e.clientX` is post-scale screen pixels — `logicalX(clientX) { return
  clientX / phoneScale; }` at every `e.clientX` read in the drag handlers.
  No-op in a plain browser tab or under a shell that isn't detected
  (`phoneScale` stays 1).

**Locking the OS window to the ratio** (`src-tauri/`, **confirmed** —
`CLAUDE.md` §2b): `is-tauri` via the `window.isTauri` global. A live lock
via `src-tauri/src/resize_lock.rs`, Windows-only — subclasses the native
window proc and rewrites the proposed rect on every `WM_SIZING` step,
keeping the window on-ratio *during* the drag; the corner rule is a pure
function of the proposal (0.2.16, fixed a flip-flop bug). `app.js`'s
`lockAspect` (settle-after-drag via `window.__TAURI__`'s `set_size`/
`LogicalSize`) stays as a no-op safety net for platforms without the
native lock (macOS/Linux — JS fallback only, not currently pursued, §1).
Full detail: `HISTORY.md` 0.2.11-0.2.16. Electron locked this the same way
via `main.js`'s `win.setAspectRatio()`, retired along with the rest of that
shell (`CLAUDE.md` §2).

---

**Siblings:** `CLAUDE.md` = primary truth (file layout, versioning,
workflow, process) · `PLAN.md` = committed roadmap · `TODO.md` = ideas
under consideration · `HISTORY.md` = version changelog.
