# Generation-specific split candidates

Rule under test (user, 2026-09-06): data whose *values or applicability*
genuinely differ by generation gets its own per-generation CSV(s), not a
generation-conditional column. Confidence scale:

- **A — confirmed real divergence**: the source data itself holds different
  values per generation (sampled and shown).
- **B — real mechanic, single-value data**: the game mechanic is
  generation-variant, but neither source stores the history (one current
  value only). Splitting would need an outside source or a formula.
- **C — schema-only**: a `generation_id` column exists but it is a plain
  "introduced in" attribute, not a per-generation value. **Not** a split.

## A — confirmed real divergence in the data

### A1. Base friendship (PokeDB `national_pokedexes.base_friendship_gen3_7` / `base_friendship_gen8`)
Gen 8 (SwSh) lowered the default base friendship from 70 to 50 for most
species; Gen 1-2 used a different (0-255 "happiness" without a species
table) that neither source models.
- Sampled all 1025: **881 differ, 144 identical**. Value pairs: `70→50` ×665,
  `(blank)→50` ×172 (species introduced Gen 8+, no Gen 3-7 value — correct),
  `35→35` ×69, `0→0` ×44, `(blank)→0` ×35, `100→100` ×14, `140→140` ×10,
  `90→90` ×5, `70→70` ×2 (#532 Timburr, #618 Stunfisk — PokeDB says these
  two kept 70; every other 70 dropped to 50, so possibly PokeDB gaps),
  `(blank)→35/20/140/100` ×9. No species has two *different non-blank*
  values other than the 70→50 wave. Examples: #1 `70/50`, #25 `70/50`,
  #150 `0/0`, #1025 `(blank)/0`.
- **PokeAPI's single `base_happiness` is era-mixed**: by species generation
  → Gen 1-7 species: 70 ×667 (Gen 3-7 scale); Gen 8-9 species: 50 ×172 (Gen 8
  scale). It stores "value when introduced", so the app currently reads two
  different scales through one field. `compare.js` logs 665 conflicts on
  `base_friendship_gen8` (PokeAPI 70 vs PokeDB 50) and 0 non-blank conflicts
  on `base_friendship_gen3_7`.
- **Verdict: A, real.** Split: `species_friendship_gen3-7.csv` /
  `species_friendship_gen8+.csv` (or one two-column table — see SUMMARY
  judgment #3 on how literal "per-generation file" should be).

### A2. Type effectiveness (PokeAPI `type_efficacy` + `type_efficacy_past`; PokeDB `type_weakness_charts`)
- Current chart: 324/324 cells identical between sources (`compare.js`
  `type_chart`, 0 conflicts) — the Gen 6+ chart.
- PokeAPI `type_efficacy_past` (6 rows, decoded): Gen ≤1 `poison>bug 2×`,
  `bug>poison 2×`, `ghost>psychic 0×`, `ice>fire 1×`; Gen ≤5 `ghost>steel
  0.5×`, `dark>steel 0.5×`. Plus implicit absences: Steel/Dark rows don't
  apply before Gen 2, Fairy rows before Gen 6 (types.csv `generation_id` 2/2/6).
- PokeDB has no history — current chart only.
- **Verdict: A.** Three real charts: Gen 1 (15 types), Gen 2-5 (17), Gen 6+
  (18). Only PokeAPI can produce them; `type_chart_gen1.csv`,
  `type_chart_gen2-5.csv`, `type_chart_gen6+.csv` (each self-contained, no
  diff-against-current needed for the app).

### A3. Physical/Special split (PokeDB `types.damage_category_id`; PokeAPI `moves.damage_class_id`)
- PokeDB `types.damage_category_id` is exactly the Gen 1-3 type-based rule:
  Normal/Fighting/Flying/Poison/Ground/Rock/Bug/Ghost/Steel = physical,
  Fire/Water/Grass/Electric/Psychic/Ice/Dragon/Dark = special (Fairy/Unknown/
  Shadow/Stellar = special, meaningless pre-Gen 4). PokeAPI has no such
  column.
- Both sources' per-move class is the Gen 4+ value. Check: of the 470 Gen 1-3
  damaging moves, **59 have a current class that contradicts their type's
  Gen 1-3 class** (e.g. Bite Dark/physical, Hidden Power, Sludge Bomb
  Poison/special) — so applying today's per-move class to a Gen 1-3 context
  is wrong for 59 moves.
- **Verdict: A** (mechanic real, data present on the PokeDB side as the
  type table). Split: `move_damage_class_gen1-3.csv` (by type; 18 rows) vs
  per-move class in `moves.csv` for Gen 4+. Cheap.

### A4. Base stats (PokeAPI `pokemon_stats_past`, 235 rows)
- Gen 1: 151 rows = the single `special` stat (Bulbasaur 65, Ivysaur 80,
  Venusaur 100) which split into Sp.Atk/Sp.Def in Gen 2.
- Gen ≤5 (30 rows), ≤6 (35), ≤7 (5), ≤8 (8): stat buffs in later gens —
  Arbok Atk 85→95, Dugtrio Atk 80→100, Farfetch'd Atk 65→90, Electrode Spe
  140→150, Noctowl SpA 76→86 (all "≤6", i.e. changed in Gen 7).
- PokeDB: current only; plus errors where a regional form's stats leaked
  into the default row (Sandslash 110/45/55 → PokeDB 120/25/65 = Alolan;
  Goodra = Hisuian).
- **Verdict: A** (PokeAPI-only data). Split: `stats_gen1.csv` (with
  `special`), and a `stats_changes.csv` (species, generation-through, stat,
  value) or full per-gen snapshot files — SUMMARY judgment #3.

### A5. Types per Pokémon (PokeAPI `pokemon_types_past`, 36 rows)
- Gen ≤1: Magnemite/Magneton pure Electric (Steel added Gen 2). Gen ≤4:
  Rotom appliance forms Electric/Ghost (became Electric/Fire etc. in Gen 5).
  Gen ≤5: Clefairy/Clefable/Jigglypuff/Wigglytuff/Cleffa/Igglybuff/Togepi
  line etc. Normal → Fairy (Gen 6), 24 rows.
- **Verdict: A**, PokeAPI-only.

### A6. Abilities per Pokémon (PokeAPI `pokemon_abilities_past`, 569 rows)
- Gen ≤3: 89 rows, all `ability_id` blank = "second ability slot didn't
  exist yet" markers. Gen ≤4: 420 rows, all blank on slot 3 = "hidden
  abilities didn't exist before Gen 5" markers. Gen ≤5/6/7/8: real changes
  (Gen ≤8: Shiftry slot 2 Early Bird → now Wind Rider; Piplup line hidden
  Defiant → Competitive).
- Also: abilities themselves start Gen 3 (`abilities.generation_id`), and
  `ability_changelog` (52 rows: Stench/Sturdy changed in BW, Static in
  Emerald…) records effect changes per version group.
- **Verdict: A**, PokeAPI-only. Note the "not applicable" cases (no abilities
  Gen 1-2, no hidden Gen 1-4) are *applicability* differences — whether
  those deserve files or just a rule in the app is SUMMARY judgment #4.

### A7. Move stats (PokeAPI `move_changelog`, 198 rows; `move_effect_changelog` 28)
- Per version group "value before": Karate Chop/Gust were Normal-type
  before Gold-Silver; Wing Attack power 35 before GS; Fly 70 before DP;
  Vine Whip 35 before XY; Swords Dance 30 PP before XY; Razor Wind acc 75
  before RS. Columns populated: power 115, accuracy 47, pp 43, effect_chance
  11, effect 9, type 8, target 7, priority 5. Biggest waves: x-y 83,
  black-white 40, gold-silver 20, diamond-pearl 19, sword-shield 16.
- **Verdict: A**, PokeAPI-only.

### A8. Base experience yield (`pokemon.base_experience` vs `pokemon_forms.base_experience`)
- 140 conflicts, all in the same direction and ratio (~+11%): Charizard
  240→267, Blastoise 239→265, Butterfree 178→198, Raichu 218→243, Clefable
  217→242. Real history: yields were revised in Gen 5 and again in Gen 7
  for fully-evolved species. PokeAPI holds the Gen 5-6 values, PokeDB the
  Gen 7+ values; neither has both.
- **Verdict: A** (divergence proven, but each source holds one era — the
  merged table can hold *two* eras, Gen 5-6 from PokeAPI and Gen 7+ from
  PokeDB, and no Gen 1-4 values). Judgment: SUMMARY #5.

### A9. Catch rates for Hisui-native species (`capture_rate` vs `catch_rate`)
- 8 conflicts: #899 Wyrdeer 135/45, #900 Kleavor 115/15, #901 Ursaluna 75/20,
  #902 Basculegion 135/45, #903 Sneasler 135/20, #904 Overqwil 135/45 —
  PokeDB carries the Legends: Arceus in-game rates, PokeAPI the later
  SV/HOME rates. (#550 Basculin 25 vs 190 and #1017 Ogerpon 5 vs 3 are
  plain PokeDB errors, Bulbapedia agrees with PokeAPI.)
- **Verdict: A for the six Hisui species**, but it's really a *non-mainline*
  split (LA-specific values) — cross-listed in nonmainline_split_candidates.
  The Gen 1 vs Gen 3+ *formula* difference is app logic, not data (B).

### A10. Item behaviour per generation (PokeDB `item_effects` gen ranges, `item_stat_modifiers`, `item_pocket_maps`)
- `item_effects`: 1822 rows with `generation_id_start/end`; 260+ closed
  ranges. Bright Powder `2-2` "~8%" vs `3-` "10%"; Up-Grade `2-8` "evolves
  Porygon when traded" vs `8-` "use on Porygon"; Super Potion "50-100 HP
  depending on generation" (free text hides a real per-gen value).
- `item_stat_modifiers`: Calcium/Carbos/HP Up/Iron `+10 EVs` for `3-7` (Gen 8
  removed the cap); Berserk Gene `2-2`.
- `item_pocket_maps`: 358 items sit in different bag pockets across
  generations (Ability Capsule medicine 6-7 → items 8-9; Abomasite items
  6-7 → mega-stones 9).
- **Verdict: A**, PokeDB-only. These already *are* per-generation rows —
  they can be split by generation trivially, or kept ranged.

### A11. Learnsets / TMs / encounters / flavor text / prices
Per-version-group by construction on both sides (`pokemon_moves`,
`machines`, `encounters`, `*_flavor_text`, `item_prices`). Not a "split
candidate" — they are already keyed by version, and the app already reads
them that way. Listed only so nobody re-litigates them.

## B — real mechanic, no per-generation data in either source

| Mechanic | What differs | Data available |
|---|---|---|
| Catch-rate formula | Gen 1 (R/B/Y) formula vs Gen 2 vs Gen 3-4 vs Gen 5+ (incl. critical capture), plus per-ball modifiers | Only species `capture_rate` (one value). Formula = app code; would need a hand-written `catch_formula_gen*.csv` only if the app wants to show it. |
| Critical hits | Gen 1 speed-based; Gen 2-5 stage table 1/16→; Gen 6 1/16→1/8→1/2→1; Gen 6+ 1.5× (was 2×) | PokeAPI `move_meta.crit_rate` is a per-move +stage flag; no gen table anywhere. |
| Breeding / eggs | Introduced Gen 2; egg groups fixed since (Nidoran♀ etc.); egg moves per version group (already split via learnsets) | Egg groups = one current value both sides. Applicability rule only. |
| Hidden abilities | Introduced Gen 5 | PokeAPI `pokemon_abilities_past` (A6) covers the "before" state. |
| EV/IV systems | Gen 1-2 "stat experience"/DVs vs Gen 3+ EVs/IVs | EV yields are Gen 3+ values only (both sides). Applicability rule. |
| Natures | Gen 3+ | `natures.csv` static; applicability rule. |
| Held items | Gen 2+ | applicability. |
| Base friendship Gen 1-2 | Gen 2 "happiness" existed but with no per-species table in either source | none. |
| Stat formulas / special split | Gen 1 Special (A4 has data), Gen 3 nature multipliers | formula. |

## C — schema-only `generation_id` columns (NOT split candidates)

`abilities.generation_id`, `moves.generation_id`, `items.introduced_in_generation_id`,
`pokemon_species.generation_id`/`national_pokedexes.generation_id`,
`types.generation_id`, `version_groups.generation_id`/`versions.generation_id`,
`status_conditions.generation_id`, `region_areas.generation_id`,
`games.generation_id`, `location_game_indices`/`item_game_indices`/
`pokemon_form_generations` — all "introduced in / belongs to". Keep as a
column. (`status_condition_animations.generation_id` is a per-gen *image
URL* — presentation, ignore.)

## Ranked list for the merge design

1. A1 friendship — trivial, PokeDB has both columns already.
2. A2 type chart — trivial, PokeAPI past table + type intro gens.
3. A3 physical/special — trivial, PokeDB `types.damage_category_id`.
4. A4/A5/A6/A7 `*_past`/changelog — PokeAPI-only; the app's data model has
   no consumer yet (SCOPE.md doesn't show past stats/types). Carry them
   into `csv/` as-is (they're already per-generation deltas) — whether to
   expand to full per-gen snapshots is judgment #3.
5. A8 base experience — two eras, no Gen 1-4 values: judgment #5.
6. A9 Hisui catch rates — belongs with the LA split.
7. A10 item effects — PokeDB rows already ranged; keep the range columns
   or explode; judgment #3.
8. B-class — nothing to split; document as app rules.
