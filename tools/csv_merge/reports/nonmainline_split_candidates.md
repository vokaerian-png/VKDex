# Non-mainline split candidates — Legends: Arceus, Legends: Z-A, Colosseum, XD (+ Pokémon Champions)

Rule under test: data specific to a non-mainline game goes in its own
CSV(s), on the model of `src/data/movesets_hisui.js` (LA learnsets split
out because the *mechanics* differ — mastery levels, no TM/egg moves).
Every count below is real rows tagged to that game's identifier, verified
by loading the file (`explore1.js`/`explore2.js` + this report's spot
checks), not schema possibility.

Version identifiers: PokeAPI `version_groups` has `colosseum` (12), `xd`
(13), `legends-arceus` (24), `legends-za` (30), `mega-dimension` (31, Z-A
DLC), `champions` (32); `versions` has one version each. PokeDB
`versions.csv` has `colosseum` (178), `xd` (187), `legends-arceus` (229),
`legends-za` (239) — **no `mega-dimension`, no `champions`**.

## Row counts per game per table

| Table (concept) | Colosseum | XD | Legends: Arceus | Legends: Z-A | Champions |
|---|---|---|---|---|---|
| Learnsets — PokeAPI `pokemon_moves` | 12,976 (machine 9005, level-up 3971) | 15,694 (machine 9005, level-up 3971, tutor 2386, **xd-purification 332**) | **2,230** (level-up 1901 w/ `mastery` on 1882, tutor 329), 247 Pokémon | **0** | **19,810** (`train` method, 319 Pokémon, level 0) |
| Learnsets — PokeDB `pokemon_moves` | 12,977 (machine 9006, level-up 3971) | 15,362 (machine 9005, level-up 3971, tutor 2386; **no shadow/purification rows** although methods 7-9 are defined) | **0** | **0** | 0 (no version) |
| Encounters — PokeAPI `encounters` | 83 (55 Pokémon; areas outskirt-stand, phenac-city, snagem-hideout, shadow-pokemon-lab, pyrite-*, realgam-tower, agate-village, the-under, mt-battle — i.e. Shadow Pokémon snag list) | 104 (100 Pokémon; pokemon-hq-lab, gateon-port, cipher-lab, pokespot, onbs, cipher-key-lair, citadark-isle) | **0** | 0 | 0 |
| Encounters — PokeDB `encounters` | **0** | **0** | **1,756** (272 forms, 88 areas; methods symbol-encounter 740, space-time-distortion 373, swarm 224, shaking-trees 128, flying 122, ore-deposits 105…; LA-only columns `alpha_levels` 1678, `during_*` time-of-day, `boulder_required` 408) | **0** | 0 |
| Machines (TM list) — PokeAPI | 58 | 58 | 0 | 107 (+53 `mega-dimension`) | 0 |
| Machines — PokeDB | 0 | 0 | 0 | 142 (`tm001`…, all `reusable`) | 0 |
| Species flavor text — PokeAPI (9 langs elsewhere) | 0 | 0 | 241 species, **English only** (SV likewise: 120/version, English only) | 0 | 0 |
| Species flavor text — PokeDB `flavor_texts` (en) | 0 | 0 | 265 forms | **554 rows / 551 forms** | 0 |
| Item flavor text — PokeAPI | 0 | 0 | 6 | 0 | 0 |
| Item flavor text — PokeDB | 11 | 11 | 588 | 246 | 0 |
| Item prices — PokeDB `item_prices` | 2 | 2 | 226 | 116 | 0 |
| Item acquisitions — PokeDB | 0 | 0 | 386 (`request`, `npc-gift`, `trainer-reward`… with free-text `location_detail`) | 192 (`shop` Stone Emporium, `story` "Main Mission 09"…) | 0 |
| Item pockets — PokeDB `item_pocket_maps` | 0 | 0 | 109 | 166 | 0 |
| Item sprites — PokeDB | 0 | 0 | 119 | 0 | 0 |
| Wild held items — PokeAPI `pokemon_items` | 14 | 21 | 0 | 0 | 0 |
| Pokédex numbers | PokeAPI `hisui` dex 242 (id 30); PokeDB `hisui` 242 | | | PokeAPI `lumiose-city` 239 / `hyperspace` 166; PokeDB `lumiose` 239 / `lumiose_mega` 96 / `hyperspace` 166 | PokeAPI `champions` dex 208 |
| Species/forms | PokeDB `pokemon_forms.origin_region_identifier = hisui` 26 forms; 16 `-hisuian` identifiers | | | | |
| Abilities | | | | PokeAPI-only 7 Gen 9 abilities (`piercing-drill`… — Z-A/Mega Dimension); PokeDB lacks them | |
| Items | | | PokeDB LA-only items: `grit-dust/gravel/pebble/rock`, `*-apricorn`, `*-tumblestone`, `crafting-kit`, `poke-ball-hisuian`, `great-ball-hisuian`… | PokeDB Z-A items (`absolite-z`, `hyper-*-berry`, `*-plush`…) | |
| Catch rates | | | PokeDB `national_pokedexes.catch_rate` for #899-904 = LA in-game values (45/15/20/45/20/45) vs PokeAPI's later SV values (135/115/75/135/135/135) — see gen_split A9 | | |
| Status images / region artwork — PokeDB | | | 6 / 2 (presentation) | | |
| Cries — PokeDB | 0 | 2 (#438 Bonsly, #446 Munchlax — XD debut) | 0 | 0 | 0 |
| Sprites — PokeDB | 1 | 0 | 0 | 0 | 0 |

Colosseum/XD learnsets are the same data on both sides (PokeDB XD ⊇
Colosseum: 12,976 of 12,977 Colosseum tuples reappear in XD; the
`learnsets` compare shows only 48-58 rows differing per game) — PokeDB
evidently derived them from PokeAPI. PokeAPI is the only side with the
XD purification learnset (332 rows, e.g. Butterfree: psychic,
morning-sun, sleep-powder, aerial-ace) and the two games' encounter/snag
lists.

## Per-game verdict

### Legends: Arceus — split, strongly (existing precedent)
- **Learnsets**: PokeAPI only. Structurally different (mastery level per
  move, no egg/machine). Already split in the app (`movesets_hisui.js`).
  → `learnsets_legends_arceus.csv` (pokemon, move, level, mastery, method).
- **Encounters**: PokeDB only. Column set is LA-specific (alpha levels,
  time-of-day booleans, weather booleans, boulder/space-time distortion
  methods). Folding 60 wide columns into a mainline encounter table would
  leave most cells blank for every other game.
  → `encounters_legends_arceus.csv` with only the ~20 columns LA uses.
- **Items**: PokeDB acquisitions (386), prices (226), pockets (109), flavor
  (588) — LA has its own item economy (crafting, satchel). → per-game item
  files or a `game` column: SUMMARY judgment #6.
- **Flavor text**: both sides (241/265) — keyed by version already; keep in
  the versioned flavor table (not a split; it's the normal per-version
  pattern).
- **Catch rates**: six species differ LA vs later — needs a home;
  `species_legends_arceus.csv` (id, catch_rate) or a `catch_rate_la` column.
  Judgment #6.

### Legends: Z-A — split, but there is little to split yet
- **No learnsets on either side** (PokeAPI vg 30 has 0 `pokemon_moves`
  rows; PokeDB has no rows either). **No encounters on either side.**
- What exists: TM list (PokeAPI 107 + 53 Mega Dimension; PokeDB 142),
  flavor text (PokeDB 554 — the richest Z-A table; PokeAPI 0), items
  (PokeDB acquisitions 192, prices 116, pockets 166, flavor 246), Lumiose/
  Hyperspace dex numbers (both sides), 7 new abilities (PokeAPI only).
- Note `mega-dimension` (Z-A DLC) exists only as a PokeAPI version group
  (53 TMs); PokeDB has no identifier for it, so its rows can't be tagged
  from the PokeDB side.
- → `machines_legends_za.csv`, and Z-A rows in the item tables; flavor
  stays in the versioned flavor table. Judgment #6 applies.

### Colosseum / XD — split learnsets + encounters; item data is negligible
- Learnsets: 12,976 / 15,694 rows, PokeAPI-side complete (incl. 332
  purification moves), PokeDB-side a copy minus purification. Mechanically
  different (Shadow moves, purification unlocks, no egg moves, no wild
  Pokémon breeding) → `learnsets_colosseum.csv`, `learnsets_xd.csv` (or one
  `learnsets_orre.csv` with a `game` column — the app already treats them
  as one `orre.js` region with a C/XD/C-XD tag).
- Encounters: PokeAPI 83 + 104 rows = the Shadow Pokémon snag lists by
  location (not wild encounters). → `encounters_orre.csv`.
- Items: PokeDB 2 prices + 11 flavor each; PokeAPI 14/21 held items. Too
  small to matter; keep in the versioned tables.
- 18 Shadow moves (`shadow-rush`… `shadow-sky`) exist in both `moves`
  tables as ordinary Gen 3 moves with type `shadow` (PokeDB German names
  rotated — see table_pairings §3).

### Pokémon Champions — PokeAPI only, decide scope
- 19,810 `train`-method rows for 319 Pokémon (no levels), a `champions`
  Pokédex (208 entries), version group `champions`. Not in the user's
  named list; it is a non-mainline battle game. Either split
  (`learnsets_champions.csv`) or drop — SUMMARY judgment #7.

## Mainline DLC — NOT a split, but a tagging difference to resolve
PokeAPI keys DLC content on pseudo-versions (`the-isle-of-armor-sword`
7150 encounters, `the-crown-tundra-sword` 5618, `the-teal-mask`/
`the-indigo-disk` machines 35/133); PokeDB folds it into the base game
(Isle of Armor/Crown Tundra areas under `sword`: 591 rows; Kitakami/
Blueberry areas under `scarlet`: 455 rows). The merged version table must
pick one convention — SUMMARY judgment #8.
