# CSV source analysis — PokeAPI clone vs PokeDB — SUMMARY

2026-09-06. Analysis only; nothing written to `VKDex/csv/`. Tooling in
`tools/csv_merge/` (`csv_util.js`, `inventory.js`, `compare.js`); detail
reports alongside this file: `table_pairings.md`, `gen_split_candidates.md`,
`nonmainline_split_candidates.md`, `conflicts_<table>.csv` ×8,
`inventory.json`, `compare_summary.json`.

## 1. Inventory

| | PokeAPI (`temp/PokeAPI-master/data/v2/csv`) | PokeDB (`temp/PokeDB-CSV`) |
|---|---|---|
| Files | 185 | **88** (not 84) |
| Data rows | 1,283,565 | 760,118 |
| Bytes | 41.6 MB | 44.2 MB |
| Largest | `pokemon_moves` 638,321 rows | `pokemon_moves` 603,935 rows (19.7 MB); `encounters` 37,724 rows × 60 cols |
| Malformed rows | 0 | 0 |
| Encoding | clean UTF-8, LF (1 file CRLF-in-cell) | clean UTF-8 except 1 invalid byte (`evolution_types.csv`), 5 files CRLF-in-cell, 3 columns dead (`[object Object]`) |

Row counts reconcile with `wc -l` on all 273 files (the 18 files where they
differ are prose/flavor files with quoted embedded newlines — counted and
matched). Parser round-trip self-test passes on quoted commas, quoted
newlines, CRLF, doubled quotes.

## 2. Pairing

- **PokeAPI 185 → ~95 paired, ~90 unpaired** (31 `conquest_*`, 9
  `*_past`/`*changelog`, `berries*`, `pal_park*`, `pokeathlon*`,
  `pokemon_items`, `experience`, `*_game_indices`, empty `*_flavor_summaries`,
  assorted `*_prose`).
- **PokeDB 88 → ~60 paired, ~28 PokeDB-only** (`item_acquisitions`,
  `item_effects` w/ generation ranges, `item_prices` ×20 richer,
  `item_evolutions`, `item_stat_modifiers`, `status_condition*`,
  `type_weakness_charts` dual-type rows, `games`/platform catalogue,
  `pokemon_cries`, sprite/artwork/leaflet presentation tables).
- **Join keys, verified**: species = dex number (1025/1025, identifiers
  identical too); abilities/moves/natures/move_flags = `identifier`
  verbatim (307/307, 902/937, 25/25, 21/21); items = `identifier` 1668/2222
  (+128 via English name; TM numbering `tm01` vs `tm001`); types =
  lowercased name; egg groups / growth rates / damage class / move targets /
  languages / pokédexes / encounter methods = static hand maps (PokeAPI
  uses veekun-internal names, PokeDB official ones); forms = strip
  `-default` + fold 6 suffixes → 1084/1351, residual ~60 species need an
  alias table; locations 588/1104 (route slugs reversed: `sinnoh-route-201`
  vs `route-201-sinnoh`); **location areas and encounters are not
  row-joinable** (different area slug systems and models).

## 3. Generation-split candidates (detail: `gen_split_candidates.md`)

| # | Candidate | Confidence | Evidence (sampled) | Data lives in |
|---|---|---|---|---|
| A1 | Base friendship Gen 3-7 vs Gen 8+ | **A confirmed** | 881/1025 differ (`70→50` ×665). PokeAPI's single column is era-mixed: Gen 1-7 species=70, Gen 8-9 species=50 | PokeDB (both columns) |
| A2 | Type chart Gen 1 / 2-5 / 6+ | **A confirmed** | current chart identical 324/324; PokeAPI `type_efficacy_past` 6 rows (Gen 1 poison↔bug 2×, ghost>psychic 0, ice>fire 1×; Gen ≤5 ghost/dark>steel ½) + Steel/Dark (Gen 2), Fairy (Gen 6) absent earlier | PokeAPI |
| A3 | Physical/Special by type (Gen 1-3) | **A confirmed** | PokeDB `types.damage_category_id` = the Gen 1-3 rule exactly; 59 Gen 1-3 moves have a Gen 4+ class contradicting it | PokeDB |
| A4 | Base stats: Gen 1 `special`; buffs in Gen 6/7/8 | **A confirmed** | `pokemon_stats_past` 235 rows (Arbok Atk 85→95, Farfetch'd 65→90…) | PokeAPI |
| A5 | Types per Pokémon (Fairy retcon, Magnemite, Rotom) | **A confirmed** | `pokemon_types_past` 36 rows | PokeAPI |
| A6 | Abilities per Pokémon (+ no slot 2 before Gen 4, no hidden before Gen 5; ability effect changes) | **A confirmed** | `pokemon_abilities_past` 569 rows, `ability_changelog` 52 | PokeAPI |
| A7 | Move power/acc/PP/type/effect per version group | **A confirmed** | `move_changelog` 198 rows (Karate Chop Normal before GS, Fly 70 before DP…) | PokeAPI |
| A8 | Base experience yield eras | **A confirmed, incomplete** | 140 conflicts, PokeAPI = Gen 5-6 values, PokeDB = Gen 7+ (Charizard 240 vs 267); nobody has Gen 1-4 | both, one era each |
| A9 | Catch rates (six Hisui species, LA vs later) | **A confirmed** | #899-904: PokeDB 45/15/20/45/20/45 (LA) vs PokeAPI 135/115/75/135/135/135 | both, one era each |
| A10 | Item effects / stat modifiers / bag pockets per generation | **A confirmed** | PokeDB gen ranges (Bright Powder 2-2 vs 3-; vitamins +10 EV 3-7; 358 items change pocket) | PokeDB |
| B | Catch formula, crit mechanics, breeding, EV/IV, natures, held items | **B — mechanic real, no data** | neither source stores per-gen data; app rules or hand-written tables | — |
| C | `generation_id` on abilities/moves/items/species/types/versions… | **C — not a split** | plain "introduced in" attributes | — |

## 4. Non-mainline split candidates (detail: `nonmainline_split_candidates.md`)

| Game | Learnsets | Encounters | Other real data | Verdict |
|---|---|---|---|---|
| Legends: Arceus | PokeAPI 2,230 rows w/ `mastery` (PokeDB **0**) | PokeDB 1,756 rows, 272 forms, LA-only columns (PokeAPI **0**) | PokeDB items: acquisitions 386, prices 226, pockets 109, flavor 588; both: species flavor ~250; PokeDB LA catch rates ×6 | **Split** (learnsets already are in the app) |
| Legends: Z-A | **0 on both sides** | **0 on both sides** | TMs (PokeAPI 107 + 53 Mega Dimension; PokeDB 142), PokeDB species flavor 554, items 192/116/166/246, 7 PokeAPI-only abilities | Split what exists (TMs/items); flavor stays versioned |
| Colosseum / XD | PokeAPI 12,976 / 15,694 incl. 332 XD purification; PokeDB copies minus purification | PokeAPI 83 / 104 (Shadow snag lists); PokeDB **0** | negligible items | **Split** (one Orre file or two) |
| Pokémon Champions | PokeAPI 19,810 `train` rows, 319 Pokémon (PokeDB: no version) | 0 | `champions` Pokédex 208 | **decide** (judgment #7) |

## 5. Conflict rates (`compare.js`, every divergence logged)

| Table | Matched | Clean | With ≥1 conflict | Top conflicting columns | Reading |
|---|---|---|---|---|---|
| species (dex#) | 1025/1025 | 14 | 1011 | `name_ja-roma` 706 (PokeAPI trademark romaji `Lizardo` vs PokeDB Hepburn `Rizādo` — convention, not error); `base_friendship_gen8` 665 (A1); `base_experience` 140 (A8); then real disagreements: hatch_cycles 13, abilities 24, catch_rate 8, pct_male 7, growth_rate 6, EVs 17, stats 8, egg 2, genus 2, is_legendary 1, type 2 | Excluding romaji/friendship/base-exp: **~90 cells across ~60 species**, and **they go both ways** — PokeDB wrong on Sandslash stats (Alolan leaked), Goodra (Hisuian default), Latias not legendary, Kakuna/Sawk/Duskull ability slots off by one, Happiny/Cresselia genderless, Dratini hatch 45; PokeAPI wrong on Dipplin (Erratic) and Poltchageist (Medium Fast) growth, Gen 3 berries listed as Gen 2 |
| abilities | 307/307 | 305 | 2 | `name_en` (As One (Glastrier/Spectrier)) | clean; ids agree |
| moves | 902/937 | 228 | 674 | `name_zh-hant` 625 (PokeDB packs trad+simp in one cell); fr/ko/it/es/ja/de name variants 200 (apostrophe style, PokeDB typos, 18 Shadow moves' German names rotated); `accuracy` 25 + `damage_class` 22 = Max/Z moves (PokeDB `vary`) | **0 conflicts on power/pp/priority/type/generation/id** — mechanical data identical |
| items | 1668/2222 | 671 | 997 | translated names 3,984 (mostly PokeDB blanks or es-ES/es-419 variants); `fling_power` 143 (blank vs 0); `name_en` 69 (apostrophes, `X Sp. Atk` vs `X Sp. Atk.`); `introduced_generation` 67 | no substantive item-data conflicts; the unmatched 554/510 are the real work (renames, TM numbering, PokeAPI duplicate variants, PokeDB LA/Z-A items) |
| evolutions (chain membership) | 1025/1025 | 1023 | 2 | #808/#809 Meltan→Melmetal: PokeAPI two 1-member chains, PokeDB one tree | PokeDB right here. Evolution *conditions* not comparable (PokeDB = display markup) |
| type_chart | 324/324 | 324 | 0 | — | identical |
| machines | 1556 | 1556 | 0 | — | 0 move conflicts; 816 PokeAPI-only (DLC groups, Z-A, Orre, JP RGB) / 263 PokeDB-only (per-single-version tagging) |
| learnsets | 586,685 | 582,879 | 3,806 | `level` 3,806 — 3,511 are PokeDB `1` where PokeAPI has a pre-evolution level (Ivysaur Leech Seed 7 vs 1); rest real (Drowzee Headbutt 32 vs 15, Smeargle Sketch 91 vs 51) | 99.4% identical; 21,727 PokeAPI-only (JP RGB 8,052, LA 2,230, form-alias residue, DLC) / 7,638 PokeDB-only (form-alias residue, Arceus duplicate) |

## 6. Judgment calls needing a human decision before the merge tool is built

1. **Source of truth per field.** Neither source is uniformly right (§5).
   Proposed default: PokeAPI wins on species/stats/types/abilities/egg/
   gender/hatch/catch (fewer, more explicable errors; ROM-derived), PokeDB
   wins on friendship (both columns), base experience (Gen 7+ era), item
   introduction generation, LA/SV/Z-A anything, translated names where
   PokeAPI has none. Everything else logged, not auto-resolved. **Confirm
   the default direction, and whether the ~90 species-cell conflicts get
   hand-adjudicated (they're small enough) or rule-resolved.**
2. **Form identifier canon.** PokeAPI's short vocabulary (`charizard-mega-x`,
   `raichu-alola`, bare name = default) is what the app already uses
   (`altforms.js`). PokeDB adds ~60 *named* defaults (`deoxys-default` vs
   PokeAPI `deoxys-normal`; `burmy-plant-cloak`), 3 wrong default flags
   (Goodra→Hisuian, Lycanroc→Midnight, Sandslash stats), duplicate rows
   (`arceus-default` + `arceus-normal`), and one genuinely ambiguous default
   (Maushold: Family of Four per PokeAPI, Family of Three per PokeDB).
   **Confirm: PokeAPI vocabulary as canon + a hand alias table; Maushold?**
3. **How literal is "one CSV per generation"?** Three shapes are on the
   table: (a) full snapshot per gen (`stats_gen1.csv` … `stats_gen9.csv`, 9×
   redundant), (b) current + delta tables as PokeAPI ships them
   (`stats_past.csv` with `generation_id` = last gen the old value applied),
   (c) range columns as PokeDB ships item effects (`gen_start/gen_end`).
   The user's rule reads as (a) for genuinely different *tables* (type
   chart ×3, damage-class-by-type for Gen 1-3, friendship ×2) — those are
   small and clean. For per-species stat/type/ability history (a) would be
   9 near-identical 1000-row files. **Confirm (a) for the small mechanic
   tables and (b) for per-species history — or (a) everywhere.**
4. **Applicability-only differences** (no abilities Gen 1-2, no hidden
   abilities Gen 1-4, no breeding/EVs/natures Gen 1(-2)): file-level split
   (empty-by-construction) or a documented app rule? Recommend app rule;
   nothing to store.
5. **Base experience**: keep two era columns (`base_exp_gen5_6` from
   PokeAPI, `base_exp_gen7+` from PokeDB) and leave Gen 1-4 absent, or
   pick one? The app currently shows PokeAPI's (Gen 5-6) numbers.
6. **Non-mainline item data** (LA/Z-A acquisitions, prices, pockets): one
   file per game (`items_legends_arceus.csv` …) or keep the `version`
   column and split only the learnset/encounter tables as the app does now?
7. **Pokémon Champions** (PokeAPI-only, 19,810 rows) and PokeAPI's
   Japanese Red/Green/Blue version groups (8,052 duplicate learnset rows,
   882+882+6 encounters): include as a split, or drop as out of scope?
   Also PokeDB's 60 Mystery Dungeon abilities and `item_spin_off_datas`.
8. **DLC tagging**: PokeAPI pseudo-versions (`the-isle-of-armor-sword`,
   `the-teal-mask`) vs PokeDB folding DLC into `sword`/`scarlet` (591 and
   455 rows). The merged `versions.csv` needs one convention; PokeDB's is
   the only source for SV/Kitakami/Blueberry encounters, so its rows can't
   be re-tagged without an area→DLC map.
9. **Locations / areas / encounter methods**: two unjoinable vocabularies.
   Realistic options: keep PokeAPI's tables for Gen 1-8 + Orre and add
   PokeDB's for LA + SV as separate location/area/method tables (the app's
   `locations.js` already treats LA/SV as `NEEDS_SOURCE_REGIONS`), or hand-
   map ~1,500 areas. **Recommend the former; confirm.**
10. **Version table shape**: PokeAPI `versions` + `version_groups` (the app's
    pipeline assumes this) vs PokeDB's single flat table that also lists
    spinoff apps (`go`, `home`, `sleep`, `masters-ex`). Recommend PokeAPI
    shape, with PokeDB-only identifiers added only if some kept row
    references them.
11. **Z-moves**: PokeAPI splits each into `--physical`/`--special` rows;
    PokeDB has one row with class `vary` (and also G-Max moves, 33, which
    PokeAPI lacks). Recommend PokeDB's single-row shape + adopt its 33 G-Max
    rows; confirm.
12. **Romaji convention** (706 species differ): trademark romanizations
    (PokeAPI, what `names.js`/the app shows today) vs Hepburn (PokeDB).
    Keep one, or carry both columns.
13. **PokeDB presentation columns** — CDN image/audio URLs (`https://cdn.
    pokedb.org/...`), `*_html` twins of every `*_markup` column, leaflet
    polygons, box art, game ratings: strip from the merged set (recommend)
    or keep. Same for PokeDB's `{Lv. 16;ITEM;rare-candy}` markup: only
    useful if a parser is written; PokeAPI's structured `pokemon_evolution`
    covers Hisui/regional evolutions already (`minimum_move_count`,
    `region_id` columns).
14. **Languages**: PokeAPI 12 for species names; PokeDB up to 40 for types
    and sparse extras for items. Union (blank-tolerant) or PokeAPI's 12?
15. **Repairs to bake into the merge tool**: drop the 3 `[object Object]`
    columns, fix the one invalid byte, strip the U+200E in #185's zh-hans
    name, split PokeDB's `"拍擊 / 拍击"` cells, fix the rotated German Shadow
    move names (or just prefer PokeAPI's `move_names`), normalize CRLF.

## 7. Recommended next step

Confirm §6 items 1-3, 8-10 (they shape the schema); the rest can default
to the recommendation. Then a `merge.js` in `tools/csv_merge/` reusing
`csv_util.js` + `compare.js`'s loaders/alias maps writes `VKDex/csv/`,
with the conflict CSVs regenerated as the audit trail.
