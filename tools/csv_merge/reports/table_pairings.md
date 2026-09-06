# Table pairings — PokeAPI (185 CSVs) vs PokeDB (88 CSVs)

Generated 2026-09-06 from `inventory.json`. Row counts are parsed data rows
(header excluded). "Join" = the key the merge tool should use; every join
below was checked against the real data (`compare.js` where a pairing is
run, `temp/csv-source-analysis/explore*.js` otherwise).

## 0. Identifier conventions — verified, not assumed

| Concept | PokeAPI | PokeDB | Verbatim match? |
|---|---|---|---|
| Species | `pokemon_species.id` + `identifier` | `national_pokedexes.id` / `ndex_names.ndex_id` + `ndex_names.identifier` | **1025/1025 ids match AND 1025/1025 identifiers identical** (`farfetchd`, `nidoran-f`, `mr-mime`, `flabebe`, `tapu-koko` all verbatim). The curly-apostrophe issue (HISTORY 0.1.37) lives only in *display names*: PokeAPI `Farfetch’d` vs PokeDB `Farfetch'd` (2 species, 2 moves, ~10 items). |
| Forms | `pokemon.identifier` — bare species name for the default form (`pikachu`), suffixed otherwise (`pikachu-gmax`, `charizard-mega-x`, `raichu-alola`) | `pokemon_forms.identifier` — always suffixed, default = `<species>-default` (`pikachu-default`), others use long vocabulary (`pikachu-gigantamax`, `charizard-mega-evolution-x`, `raichu-alolan`) | Raw: 120/1351. After stripping `-default` + folding suffixes (`-mega-evolution`→`-mega`, `-gigantamax`→`-gmax`, `-alolan`→`-alola`, `-galarian`→`-galar`, `-hisuian`→`-hisui`, `-paldean`→`-paldea`): 1084/1351 matched. Residual ~260 are named-default forms (`deoxys-normal` vs `deoxys-default`, `burmy` vs `burmy-plant-cloak`, `wormadam-sandy` vs `wormadam-sandy-cloak`, `silvally` vs `silvally-normal`, `necrozma-dusk` vs `necrozma-dusk-mane`) — needs a hand-built alias table (~60 species; see SUMMARY judgment calls). |
| Abilities | `abilities.identifier` | `abilities.identifier` | 307/307 main-series verbatim. PokeAPI has 7 extra Gen 9 (`piercing-drill`, `dragonize`, `mega-sol`, `spicy-spray`, `eelevate`, `fire-mane`, `aura-guard` — Legends: Z-A abilities, absent from PokeDB). PokeDB has 60 `is_main_series=false` (Mystery Dungeon). Numeric `id` also agrees for all 307 (compare.js logged 0 id conflicts). |
| Moves | `moves.identifier` | `moves.identifier` | 902 verbatim. PokeAPI-only 35 = its `--physical`/`--special` split of the 18 Z-moves (PokeDB has one row per Z-move; note PokeDB kept `twinkle-tackle--physical` as its sole Z-move using PokeAPI's naming — a PokeDB inconsistency). PokeDB-only 50 = 17 unified Z-moves + 33 `g-max-*` moves (PokeAPI clone has no G-Max moves at all). `id` agrees for all 902 matches. |
| Items | `items.identifier` | `items.identifier` | 1668/2222. PokeAPI-only 554: 99 `tm01..`/`hm..`/`tr..` (PokeDB uses `tm001` zero-padded 3 digits for TMs, `hm01` for HMs — normalize on `(tm|hm|tr)0*N`), ~130 PokeAPI `--held`/`--bag`/`--red`/`--2` internal-duplicate variants (one PokeDB row each), and *pre-rename* identifiers where PokeDB uses the current name (`up-grade`→`upgrade`, `stick`→`leek`, `health-wing`→`health-feather`, `key-to-room-1`→`key-to-room-1-hoenn`). 128 of the 554 recover by English-name join. PokeDB-only 510: LA/Z-A/SV items (`grit-dust`, `hyper-*-berry`, `*-treat`, `*-plush`), Gen 2 berries (`berry-gen2`, `gold-berry`), event/key items. |
| Types | `types.identifier` (lowercase) | `types.name` (Capitalized, no identifier column) | 21/21 after lowercasing. Same 18 + `unknown`/`shadow`/`stellar`. PokeDB ids 1-18 = PokeAPI ids 1-18 in the same order; PokeDB `10001/10002/10003` = PokeAPI `10001/10002/10003`. |
| Egg groups | `egg_groups.identifier` (veekun internal names) | `egg_groups.identifier` (official names) | 7/15 verbatim; needs the static map `water1→water-1, water2→water-2, water3→water-3, ground→field, plant→grass, humanshape→human-like, indeterminate→amorphous, no-eggs→undiscovered`. |
| Growth rates | `growth_rates.identifier` (`slow-then-very-fast`) | `leveling_rates.description` (`Erratic`) | 0 verbatim; static 6-entry map. |
| Natures | `identifier` | `identifier` | 25/25 verbatim. |
| Move flags | `identifier` | `identifier` | 21/21 verbatim. |
| Move targets | `move_targets.identifier` (`selected-pokemon`) | `move_targets.identifier` (`normal`, `adjacent-enemy`) | 0/16 — different vocabularies, needs a hand map. |
| Damage class | `move_damage_classes` 1=status 2=physical 3=special | `damage_categories` 1=physical 2=special 3=status 4=vary | join by identifier, **not id** (ids are permuted). |
| Versions | `versions.identifier` (53) + `version_groups.identifier` (32) — two tables | `versions.csv` (82) — **one table mixing versions, version-groups and spinoffs** (`red`, `blue`, `red-blue`, `stadium`, `go`, `home`, `sleep`, `masters-ex`…). Its `badge_info` column is `[object Object]` in all 82 rows (dead). | 40 shared identifiers. PokeDB also has no DLC pseudo-versions (`the-isle-of-armor-sword` etc. — PokeAPI's `encounters` keys DLC areas on those); PokeDB folds DLC into `sword`/`shield`/`scarlet`/`violet`. PokeDB `pokemon_moves` uses group-style ids (`sword-shield`), `encounters` uses single-version ids (`sword`), `machines` mixes both in one file. |
| Locations | `locations.identifier` (`sinnoh-route-201`) | `locations.identifier` (`route-201-sinnoh`) | 588/1104 verbatim; routes follow opposite word order (region-prefix vs region-suffix). PokeDB `locations.type` is free text and mixes taxonomy (`Routes`, `Landmarks`) with region sub-areas (`Cobalt Coastlands`, `South Province`). |
| Location areas | `location_areas.identifier` is a *sub-slug* relative to its location (`1f`, `b1f`, `area-1`, blank for 1133/1539) | `location_areas.identifier` is a full slug (`alola-route-01-hauoli-outskirts`) | 15/406 — join must be built as PokeAPI `location.identifier + "-" + area.identifier` and then still hand-mapped. Practically: keep both, don't join. |
| Encounter methods | 66 (`walk`, `old-rod`, `surf`…) | 73 (`symbol-encounter`, `fishing-old-rod`, `tera-raid-battle`, `mass-outbreak`…) | 5/66 — different vocabularies (PokeDB's is the Gen 8/9 overworld model). |
| Languages | 14 (`en`, `ja`, `ja-hrkt`, `ja-roma`, `fr`, `de`, `es`, `it`, `ko`, `zh-hant`, `zh-hans`, `cs`, `pt-br`, `es-419`) | 54 identifiers (`english`, `japanese`, `japanese-romanized`, `chinese-cantonese`, `hindi`, `thai`…) | static map for the 12 that overlap. |

## 1. PokeAPI table → PokeDB counterpart

Legend: **=** same concept / same grain; **~** same concept, different grain
or shape (see note); **–** no PokeDB counterpart. Rows = PokeAPI / PokeDB.

### Species / Pokémon
| PokeAPI | rows | PokeDB | rows | Join / note |
|---|---|---|---|---|
| `pokemon_species` | 1025 | **=** `national_pokedexes` + `ndex_names` (+ flags on `pokemon_forms` default row) | 1025 | dex number. PokeDB splits species-level data across 3-4 files; `is_legendary/is_mythical/is_baby`, `color`, `shape`, `genus` live on the *form* row in PokeDB, on species in PokeAPI. |
| `pokemon_species_names` | 12300 (12 langs × 1025) | **=** `ndex_names` (wide: 12 name columns) | 1025 | dex number + language map. PokeDB genus (`pokemon_category`) is English-only, on `pokemon_forms`. |
| `pokemon` | 1351 | **~** `pokemon_forms` | 1476 | form identifier after normalization (§0). PokeDB has one wide row per form incl. stats/types/abilities/EVs/sprites; PokeAPI spreads over 6 tables. PokeDB `include=false` (146 rows) marks cosmetic forms (Vivillon patterns, Flabébé colours). |
| `pokemon_forms` | 1579 | **~** `pokemon_forms` | 1476 | same. PokeAPI has separate rows for purely-cosmetic forms of one `pokemon` (Arceus types, Unown letters). |
| `pokemon_stats` | 8106 (6 × 1351) | **=** `pokemon_forms.stat_*` + `ev_yield_*` | 1476 | form. Both carry EV yields. |
| `pokemon_types` | 2116 | **=** `pokemon_forms.type_1_id/type_2_id` | | form; type id→name. |
| `pokemon_abilities` | 2941 | **=** `pokemon_forms.ability_primary/secondary/hidden_id` | | form. |
| `pokemon_egg_groups` | 1304 | **=** `ndex_egg_groups` | 1025 | dex number; egg-group map. |
| `pokemon_dex_numbers` | 7987 | **=** `pokemon_forms_pokedex` | 7900 | (form, pokedex). Pokédex identifiers differ (`original-alola` vs `alola_sm_complete`) — 35 vs 34 dexes, hand map. |
| `pokemon_species_flavor_text` | 68220 (multi-lang) | **~** `flavor_texts` | 18593 (English only) | (form, version). PokeDB keys by *form* and has LA (265) + Z-A (554) + Stadium entries; PokeAPI keys by species, 9 languages, LA 241, SV only 120. |
| `pokemon_form_names` / `pokemon_form_flavor_text` | 4593 / 249 | **~** `pokemon_forms.form_name` (English only) | | form. |
| `pokemon_form_generations` | 4986 | – (PokeDB: `pokemon_forms_pokedex`/`versions` imply it) | | |
| `pokemon_game_indices` | 25392 | – | | internal per-version indices; PokeDB has none. |
| `pokemon_items` (wild held items) | 5448 | – | | **No PokeDB equivalent** (item_acquisitions is about *finding* items, not wild held). |
| `pokemon_habitats` / `_names` | 9 / 36 | – | | FRLG habitats; not in PokeDB. |
| `pokemon_colors` / `_names` | 10 / 110 | **=** `pokedex_colors` | 10 | identifier, lowercase. |
| `pokemon_shapes` / `_prose` | 14 / 28 | **=** `shapes` | 14 | id (same 1-14 order; PokeDB has only English `description`). |
| `pokemon_form_types` / `_conditions` / `_triggers` / `_trigger_prose` | 35 / 234 / 6 / 6 | **~** `form_changes` + `ndex_form_trees` | 442 / 1025 | PokeDB form-change data is HTML/markup grid text (`{Venusaurite;ITEM;venusaurite}`), not structured. |
| `pokemon_form_pokeathlon_stats` | 2770 | – | | HGSS Pokéathlon; PokeDB none. |
| `pokemon_stats_past` / `pokemon_types_past` / `pokemon_abilities_past` | 235 / 36 / 569 | – | | **Generation-history tables, PokeAPI only** (see gen_split_candidates). |
| `pokemon_evolution` (31 structured columns) | 553 | **~** `evolutions` (+ `ndex_evolution_trees`, `evolution_types`, `pokemon_form_evolution_types`, `item_evolutions`) | 1117 | PokeDB stores evolution *conditions as display markup* (`{Lv. 16;ITEM;rare-candy}`, `{Lv. Up;ITEM;rare-candy} with high friendship<br/>at night`) plus a grid position — parseable only heuristically. Chain membership (which species share a tree) is comparable: 1023/1025 agree. |
| `evolution_chains` | 541 | **=** `ndex_evolution_trees` (distinct `evolution_tree_id`) | 1025 rows | dex number; membership. |
| `evolution_triggers` / `_prose` | 16 / 36 | **~** `evolution_types` | 10 | different taxonomy (PokeDB's mixes trigger *and* position-in-chain: `first_evolution`, `branches`). |
| `pokemon_moves` | 638321 | **=** `pokemon_moves` | 603935 | (form, version-group, method, move). Methods 1-4 share ids. PokeAPI carries `order` + `mastery` (LA) and methods 5-12 incl. `xd-purification` (332), `train` (Champions, 19810); PokeDB has `stab_bonus` and methods 5-11 (`colosseum-purification`/`xd-shadow`/`xd-purification` defined but **0 rows use them**). |
| `pokemon_move_methods` / `_prose` | 12 / 38 | **=** `pokemon_move_methods` | 11 | id (1-4 aligned; 5+ differ). |
| `pokemon_species_prose` / `_flavor_summaries` | 68 / 0 | – | | |
| `experience` (600: 6 curves × 100 levels) | 600 | **~** `leveling_rates.xp_to_100` | 6 | PokeDB has only the Lv.100 total — **full curves are PokeAPI-only** (app's `experience.js` source). |
| `growth_rates` / `_prose` | 6 / 18 | **=** `leveling_rates` | 6 | static map. |
| `genders` | 3 | – | | PokeDB uses `percentage_male` with `???` for genderless. |
| `characteristics` / `_text` | 30 / 330 | – | | |
| `pal_park*` | 493 / 5 / 20 | – | | Gen 4 Pal Park. |

### Abilities
| `abilities` | 374 | **=** `abilities` | 367 | identifier. |
| `ability_names` | 3499 | **~** `abilities.name` (English only) | | PokeDB has no ability translations. |
| `ability_prose` (short+long effect, 2 langs) | 810 | **=** `ability_short_effects` + `ability_long_effects` (markup + HTML) | 367 / 307 | ability id (ids agree). |
| `ability_flavor_text` | 16450 (multi-lang) | **~** `ability_flavor_texts` | 2536 (English) | (ability, version-group). |
| `ability_changelog` / `_prose` | 52 / 156 | – | | **generation history, PokeAPI only**. |

### Moves
| `moves` | 937 | **=** `moves` | 952 | identifier. PokeDB row also carries 10 name columns; PokeAPI has `effect_id`/`effect_chance` which PokeDB lacks. |
| `move_names` | 10235 | **=** `moves.name_*` | | PokeDB `name_cn` cells hold `"拍擊 / 拍击"` (trad + simp in one cell, 625 moves). |
| `move_effect_prose` / `move_effects` | 872 / 474 | **~** `move_short_effects` + `move_long_effects` | 952 / 952 | PokeAPI effects are shared templates keyed by `effect_id` (`$effect_chance` placeholders); PokeDB is per-move rendered text (markup + HTML). |
| `move_flavor_text` | 50360 | **~** `move_flavor_texts` | 8264 (English) | (move, version-group). |
| `move_meta` (13 cols: ailment, crit rate, drain, healing, flinch, stat chance…) | 827 | **~** `move_metas` + `move_meta_categories` | 1499 / 34 | PokeDB is a many-to-many tag list (34 categories), PokeAPI is numeric per-move columns. Not the same grain. |
| `move_meta_stat_changes` / `_ailments` / `_ailment_names` | 245 / 23 / 82 | – (partially covered by PokeDB tags) | | |
| `move_flags` / `move_flag_map` / `move_flag_prose` | 21 / 1969 / 62 | **=** `move_flags` / `move_flag_maps` / `move_flag_effects` | 21 / 1969 / 21 | identifier; **1969 = 1969 rows** (PokeDB copied PokeAPI's flag map verbatim). |
| `move_targets` / `_prose` | 16 / 44 | **~** `move_targets` | 16 | hand map. |
| `move_damage_classes` / `_prose` | 3 / 24 | **=** `damage_categories` | 4 | identifier. |
| `move_changelog` / `move_effect_changelog(_prose)` | 198 / 28 / 56 | – | | **generation history, PokeAPI only**. |
| `move_battle_styles` / `_prose` | 3 / 6 | – | | |
| `machines` | 2372 | **=** `machines` | 1821 | (version-group, TM number) → move. 1556 matched, 0 move conflicts. PokeAPI-only 816 = DLC groups (`the-indigo-disk` 133, `the-teal-mask` 35), `legends-za`/`mega-dimension` (160), `colosseum`/`xd` (116), JP RGB (110), plus per-version rows PokeDB tagged differently. |
| `contest_*`, `super_contest_*` | | **=** `contest_types`, `contest_effects`, `super_contest_effects` | 5 / 33 / 22 | id. |

### Items
| `items` | 2223 | **=** `items` | 2178 | identifier (§0). PokeDB row has category, `introduced_in_generation_id`, consumable/holdable/field/battle flags, description; PokeAPI has `cost`, `fling_power`, `fling_effect_id`. |
| `item_names` | 23091 | **=** `item_names` | 17543 | (item, language). PokeDB coverage sparse outside ja/de/fr/it/ko/zh (es 1041, many blanks). |
| `item_prose` / `item_flavor_text` | 1910 / 57507 | **~** `items.description` + `item_effects` (1822, with **generation ranges**) / `item_flavor_texts` (7188, English) | | |
| `item_categories` / `_prose` | 54 / 108 | **~** `item_categories` | 30 | different taxonomy. |
| `item_pockets` / `_names` | 8 / 48 | **~** `item_pockets` + `item_pocket_maps` (per generation) | 22 / 5333 | PokeDB pockets are per-generation; PokeAPI pocket is a single category attribute. |
| `item_fling_effects` / `_prose` | 7 / 14 | **=** `item_fling_effects` | 652 | PokeDB is per-item (power + effect text); PokeAPI per-item via `items.fling_power` + effect id. 143 fling-power conflicts, all "PokeAPI blank vs PokeDB 0". |
| `item_prices` | 291 | **=** `item_prices` | 5871 | (item, version). **PokeDB far richer** (per version, buy/sell, currency, incl. LA 226 / Z-A 116). |
| `item_game_indices` | 7296 | **~** `items.introduced_in_generation_id` | | derived min-generation; 67 conflicts (Gen 3 berries listed as Gen 2 by PokeAPI's indices). |
| `item_flags` / `_map` / `_prose` | 8 / 615 / 16 | **~** `items.is_consumable/is_holdable/is_field_usable/is_battle_usable` | | |
| `berries`, `berry_firmness(_names)`, `berry_flavors` | 68 / 5 / 35 / 320 | – | | Berry growth/flavour data is **PokeAPI only**. |
| – | | `item_acquisitions` (+ `_types`, `_subtypes`) | 6061 | **PokeDB only**: where each item is found per version (incl. SV 1430, LA 386, Z-A 192). |
| – | | `item_distributions` | 706 | PokeDB only: event distributions. `version_identifiers` column is `[object Object]` in 295/706 rows — unusable. |
| – | | `item_evolutions` | 250 | PokeDB only: item → (from form, to form). Derivable from PokeAPI `pokemon_evolution.trigger_item_id`. |
| – | | `item_stat_modifiers` (gen ranges) | 157 | PokeDB only. |
| – | | `item_spin_off_datas` | 433 | PokeDB only; free-text `spin_off_game`. |
| – | | `item_sprites` | 3037 | PokeDB only; CDN URLs. |
| `currencies` / `_names` | 19 / 19 | **~** `pokemon_currencies` | 8 | |

### Encounters / locations
| `encounters` (+ `encounter_slots`, `encounter_condition_*`, `location_area_encounter_rates`) | 117127 (+3809, +112031, +3913) | **~** `encounters` | 37724 (60 wide columns) | Not joinable row-for-row: PokeAPI = slot/rate/condition normalized model; PokeDB = one wide denormalized row per (form, version list, area, method) with game-specific columns (Gen 8 weather rates + raid stars; Gen 9 terrain/probability/tera-raid; LA alpha levels/time-of-day). **Coverage is complementary**: PokeAPI has Gen 1-8 incl. DLC pseudo-versions, Colosseum (83) and XD (104), **zero LA/SV**; PokeDB has LA (1756) and SV (Scarlet 4101 / Violet 4135, 371 distinct areas incl. Kitakami/Blueberry), **zero Colosseum/XD**, and Gen 1-8 in coarser form. |
| `encounter_methods` / `_prose` | 66 / 149 | **~** `encounter_methods` | 73 | hand map (5 verbatim). |
| `locations` / `location_names` / `location_game_indices` | 1104 / 5252 / 1417 | **~** `locations` (English only) | 839 | identifier with route re-ordering. |
| `location_areas` / `_prose` | 1539 / 3210 | **~** `location_areas` | 2672 | see §0 — effectively unjoinable. |
| `regions` / `region_names` | 11 / 81 | **=** `regions` + `region_areas` | 11 / 13 | identifier (PokeDB splits Paldea into paldea/kitakami/blueberry-academy sub-areas and adds sevii-islands). |
| – | | `location_leaflet_coordinates` / `region_artworks` | 749 / 67 | PokeDB only: map polygons + CDN artwork (website presentation). |
| `version_group_regions` | 30 | **=** `version_regions` | 69 | |

### Types / misc
| `types` / `type_names` | 21 / 230 | **=** `types` (49 cols: 40+ language names, colours, icon URLs, **`damage_category_id`**) | 21 | lowercase name. |
| `type_efficacy` | 324 | **=** `type_weakness_charts` (18 mono rows) | 324 (18 mono + 306 dual) | attack→defense. **324/324 identical**. PokeDB precomputes dual-type defensive charts too. |
| `type_efficacy_past` | 6 | – | | **generation history, PokeAPI only**. |
| `type_game_indices` | 159 | – | | |
| – | | `type_images` | 517 | PokeDB only, per-version icon URLs. |
| `natures` / `_names` / `nature_*` | 25 / 275 / 75 / 50 | **=** `natures` (incl. flavours, icon) | 25 | identifier. |
| `stats` / `stat_names` | 9 / 80 | – (implicit columns) | | |
| `generations` / `_names` | 9 / 90 | **=** `generations` | 9 | id. |
| `versions` / `version_names` / `version_groups` / `pokedex_version_groups` / `version_group_pokemon_move_methods` | 53 / 504 / 32 / 45 / 99 | **~** `versions` (+ `games`, `game_platforms`, `game_ratings`, `platforms`, `ratings`, `pokedex_group_versions`) | 82 / 193 / 230 / 628 / 24 / 20 / 27 | §0. PokeDB `games` (193, incl. 128 spin-offs, developer/publisher/box art) is a website catalogue with no PokeAPI equivalent. |
| `pokedexes` / `pokedex_prose` | 35 / 161 | **~** `pokedexes` + `pokedex_groups` + `pokedex_to_pokedex_group` | 34 / 23 / 35 | hand map. |
| `languages` / `language_names` | 14 / 123 | **~** `languages` | 54 | static map. |
| `egg_groups` / `egg_group_prose` | 15 / 150 | **=** `egg_groups` | 15 | static map. |
| `conquest_*` (31 tables) | 48400 max | – | | Pokémon Conquest — PokeAPI only, out of app scope. |
| `pokeathlon_stats` / `_names` | 5 / 35 | – | | |
| – | | `status_conditions` / `_effects` / `_images` / `_animations` | 51 / 51 / 62 / 49 | PokeDB only: status-condition encyclopedia (with `generation_id` introduced + per-gen animation images). |
| – | | `pokemon_cries` | 2052 | PokeDB only, CDN audio URLs per version. |
| – | | `pokemon_sprites` | 93 | PokeDB only (sparse; CDN). |

## 2. Counts

- PokeAPI: 185 tables. Paired (= or ~): **~95**. Unpaired: **~90**, of which 31 `conquest_*`, 3 empty `*_flavor_summaries`, 5 `pal_park`/`pokeathlon`, 4 `berry*`, 9 `*_past`/`*changelog` history tables, the rest `*_game_indices`, `*_prose` for concepts PokeDB doesn't model, `pokemon_items`, `characteristics`, `experience`.
- PokeDB: 88 tables. Paired: **~60**. Unpaired (PokeDB-only): **~28** — `item_acquisitions(+2)`, `item_distributions`, `item_evolutions`, `item_stat_modifiers`, `item_spin_off_datas`, `item_sprites`, `item_effects` (gen-ranged), `status_condition*` (4), `pokemon_cries`, `pokemon_sprites`, `type_images`, `type_weakness_charts` dual rows, `location_leaflet_coordinates`, `region_artworks`, `games`/`game_platforms`/`game_ratings`/`platforms`/`ratings`, `pokedex_groups`(+2), `ndex_form_trees`/`form_changes`, `pokemon_form_evolution_types`.

## 3. Data-quality artifacts found while pairing (both sides)

- PokeDB `versions.badge_info` (82/82), `region_areas.geojson` (13/13), `item_distributions.version_identifiers` (295/706): literal `[object Object]` — JS export bug, columns are dead.
- PokeDB `evolution_types.csv` row `has_evolutions`: one invalid UTF-8 byte (`Pok�mon`). Only mojibake in either source.
- PokeDB `ndex_names.name_chinese_simplified` for #185 Sudowoodo has a trailing U+200E (LRM) — invisible junk.
- PokeDB `moves.name_cn` combines trad/simp with " / " in one cell (625 rows) and `name_ger` has typos (`Sprießomben`, `Präisionsschuss`) and the 18 Shadow-move German names rotated by one row.
- PokeDB `pokemon_forms.is_default_form` wrong for at least Goodra (Hisuian flagged default: stats/type/genus/weight all Hisuian), Sandslash (default row carries Alolan Def/SpA/SpD 120/25/65), Lycanroc (Midnight), Maushold (Family of Three — genuinely ambiguous, see SUMMARY).
- PokeDB duplicates a named default alongside `-default` for some species (Arceus: `arceus-default` + `arceus-normal`, both with 1039-row learnsets).
- PokeAPI `pokemon_species.base_happiness` mixes eras (see gen_split_candidates §1).
- PokeAPI `item_game_indices` places Gen 3 berries in Gen 2 (67 `introduced_generation` conflicts).
- CRLF line endings inside quoted cells in 5 PokeDB files + PokeAPI `pokemon_abilities.csv`; parser handles it, but a merged output should normalize to LF.
