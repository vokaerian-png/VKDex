# VKDex — Plan

Committed future work. Only definitive statements about planned functionality
belong here; ideas still under consideration live in `TODO.md`.

**As of 0.1.35 every entry below has shipped.** Each stays because it
records standing design decisions that still govern its feature — the
per-version detail lives in `HISTORY.md`, the current-state description in
`CLAUDE.md`. There is no open commitment right now; the next candidate
(Unova onward) is still a `TODO.md` item.

---

## Add the remaining regions' Pokémon to `POKEMON_DATA`

Extend `src/data/pokemon.js` region by region, each entry tagged with its
own `region` value (matching `REGIONS`' ids). Status (0.1.31): Kanto/Johto/
Hoenn/Sinnoh complete (ids 1-493); Unova/Kalos/Alola hold only the 22
Hisui-roster natives added in 0.1.28; Galar/Paldea empty ("coming soon").

A region pass is purely data work — `tools/populate_region.js` (usage in
`TODO.md` #2, current-state description in `CLAUDE.md` §3) writes all the
per-Pokémon files, and no `app.js` change has ever been needed for a new
region (region bar, `renderGrid()`, filtering, search, favorites and the
detail screen all key off `REGIONS`/the data).
`id` = national dex number, never a region-internal display order.

**Unova onward is not yet committed** — `TODO.md` #2.

---

## Detail screen redesign — shipped 0.1.18 (+ Units toggle 0.1.19)

Settled 2026-09-03 via the interactive `vkdex-detail-mockup` Cowork
artifact (four review rounds); built in `app.js` in 0.1.18 (`HISTORY.md`),
current behavior in `CLAUDE.md` §5. Standing decisions that still govern
the screen:

- **Layout, top to bottom**: Picture card (normal + shiny sprites, dex
  number top-right, flavour text merged in as a bottom flap sharing the
  card's border; the name moves up into the topbar) → Alt Formes →
  Evolution Line → Found In → Facts list → Learnable Moves (Level-Up/TM/
  Egg/Max tabs, an empty tab isn't rendered; each row carries its type
  pill) → Base Stats (Base / Lv.1 / Lv.100 table plus hexagonal radar).
  0.1.34 briefly moved Facts/Stats up and cut the table to one
  settings-chosen level column; **both reverted 0.1.35 by user direction**
  — this original order and the three-column table stand. Old plain
  "Region" fact row dropped — Found In covers it.
- **Type renders as colored per-type pills**, never joined text — applies
  to every future rendering of this field, not just this screen.
- **Abilities**: name + full description; a hidden ability sorts last with
  a small "Hidden" badge.
- **Height/Weight**: one merged row. Metric⇄imperial toggle lives in the
  Settings popup, app-wide, default metric — not per-Pokémon.
- **Matchups**: closes out the Facts list, after Exp Growth — the
  original 0.1.18 position. 0.1.34 moved this block up to directly under
  Type as one of `overlord`'s design-overhaul findings, but that specific
  move was never actually requested by the user; it shipped anyway and
  got written up as settled, then had to be reverted once the user caught
  it on a real screenshot (0.1.38 — see `CLAUDE.md`'s no-unauthorized-
  reorder rule). Always three rows — Weakness (×2/×4 only), Resists
  (×0.25-×0.5), Neutral (×1) — plus Immune (×0) as a distinct conditional
  row, never folded into Neutral. (0.1.34's "Hide Neutral" setting was
  removed in 0.1.35 — no use case; Neutral is not user-hideable.) All
  computed live from `data/types.js`'s `TYPE_CHART` against the entry's
  `types`; nothing stored per-entry. A ×4 pill gets a thin gradient
  outline (`.mult-4`) over its type color.
- **Capture Rate**: raw value + real regular-Poké-Ball catch odds. **Exp
  Growth**: total points to Lv.100 + curve name. **Name** taps through to
  ja (+romaji)/fr/de/ko. **Found In** chips tap through to that region's
  areas/routes.
- No external assets or libraries — the radar chart is hand-drawn SVG, on
  a **fixed 0–255 scale** so shapes compare across species (0.1.34,
  user-confirmed; per-species max before), drawn at 280×270 so a low-BST
  polygon stays legible.

---

## Alt Formes wiring for the detail screen — shipped 0.1.21 / 0.1.25 / 0.1.30-31 / 0.1.34 (Megas)

Promoted from `TODO.md` #4 on 2026-09-04; that entry's 9 rules remain the
spec of record, `CLAUDE.md` §5 the current behavior. Decisions locked in
on promotion and since:

- **Ability-tag wording**: any non-Mega/Gmax forme tags an appended
  ability with its own short name ("Speed", "Sunny", "Heat"); a Mega/Gmax
  tags with its forme name minus the species name — "Mega", "Mega X",
  "Mega Y", "Mega Z" (0.1.34, so X/Y pairs aren't ambiguous). The
  singular `ability` field is an ability *name* resolved in `ABILITIES`,
  same as every other ability reference (normalized, never inline).
- **Module UI (0.1.34, tap rule fixed 0.1.35)**: when any forme is
  tappable the base renders as bubble 0 and the row reads as a segmented
  control. **Every Mega/Gmax forme is tappable** — a tap always swaps both
  Picture sprites and the topbar name; the information card swaps only if
  the forme carries its own `types`/`abilities` (a stat-only Mega shows its
  art over the base's facts). Non-Mega stats-only formes (Deoxys) stay
  inert by rule 9. Forme stat cards are labelled "Base Stats — <forme>".
- **Rule 5** (a lone differently-typed forme → its own detail screen) stays
  deferred until a real species needs it — never block on it.
- **First pass (0.1.21)**: full mechanism plus Deoxys (#386, same-typed,
  distinct stats) and Castform (#351, differently-typed, shared stats).
- **Mega Evolutions (0.1.34)**: all 63 Megas across 57 species in
  `POKEMON_DATA`, CSV-authoritative (`pokemon_forms.csv` `is_mega`), each
  with own stats, `types` where changed (13), `isMega`, and its one
  ability appended per rule 4. Includes Legends: Z-A / Mega Dimension
  Megas (17) — user to confirm keeping them (`DESIGN.md`). Gigantamax
  still unpopulated (12 Kanto Gmax sprites exist; Gmax changes no data, so
  they'd be inert sprite-only bubbles — not decided).
- **Rule 6 (0.1.25)**: Unown/Burmy/Cherrim/Arceus as `recolorOnly` —
  Arceus by explicit user direction despite its Plates changing type
  in-game. Shellos/Gastrodon deferred (`TODO.md` #4).
- **Hisuian regional forms (0.1.30/31)**, user-requested mid-session: the
  16 species with a Hisuian form are ordinary rule-7 differently-typed
  formes (12 with distinct stats, 10 with an ability delta). Two additions
  beyond the 9 rules, both user-confirmed 2026-09-04:
  - a **navigation-context-dependent default forme** — opened from the
    Hisui screen, the Hisuian forme is active; from anywhere else, base.
    The first Alt Formes behavior keyed to where you navigated from.
  - a **plural ability swap** — a forme's `abilities`/`hiddenAbility`
    *replace* the shown list while active (rule 9 extended to Abilities);
    rule 4's singular `ability` tag-append stays reserved for Mega/Gmax.
  The Hisui grid showing those 16 species' Hisuian sprite is a display-
  only extension of the standalone-dex mechanism (`spriteFn`), not a rule.

---

## Standalone dexes: Hisui + Orre — shipped 0.1.26 / 0.1.28

Promoted from `TODO.md` #6 on 2026-09-04. Two purple-tinted region-bar
chips (`REGIONS`' `standalone: true`) for dexes that aren't mainline
regions: **Hisui** (Legends: Arceus, its own 001-242 numbering track) and
**Orre** (Colosseum + XD: Gale of Darkness roster, real national numbers +
a C/XD/C-XD game tag). Neither is ever written into `pokemon.js`'s `region`.

Phased by user direction on cost: mechanism + Orre in full (136 members)
+ Hisui's 213 already-populated species in 0.1.26; Hisui's 29 net-new
species (22 Unova/Kalos/Alola natives + 7 Legends: Arceus originals) as
their own region-pass-sized follow-up in 0.1.28, which also settled how
those attach to the National Dex (real `region` for the 22, `hisuiOnly:
true` for the 7 — `CLAUDE.md` §3). Open data question on 2 dropped Orre
rows: `TODO.md` #6.

---

## Data storage architecture — shipped 0.1.10

Decided 2026-09-03; still the governing shape (`CLAUDE.md` §2/§3).

- **Plain JavaScript, not JSON/CSV/Excel.** The app runs over `file://`
  (a browser tab or the packaged Electron app) with no server and no build
  step; `fetch()` and ES-module `import` of local files are blocked there,
  a plain `<script>` tag isn't.
- **Split by concern into `src/data/`**, one file per kind of data, one
  `<script>` tag each — no bundler, no `type="module"`. A diff only touches
  the file for the kind of data that changed.
- **Normalize shared data**: `abilities.js`/`moves.js` hold each entry
  exactly once, keyed by name; per-Pokémon files reference names and the
  detail screen looks them up at render time. A correction is a one-line
  fix, not a find-and-replace.
- **Spreadsheets are not a storage format** (no spreadsheet reader belongs
  in a zero-dependency app; nested shapes don't fit flat rows). At most a
  future authoring aid regenerated into `data/*.js` — that adds a sync step
  and drift risk, only worth it if hand-editing JS becomes real friction.
  It hasn't.

---

## Data sourcing & population order — shipped 0.1.12 → 0.1.22

Committed 2026-09-03. Still the rule for any future region pass:

- **Normalized tables (`abilities.js`, `moves.js`)** got one initial global
  sweep (0.1.12, everything through Gen 3) so the shared tables existed
  first; each region pass since appends only what its species newly
  reference, never a speculative full-national list. Duplicate keys are an
  integrity-check failure.
- **Per-Pokémon files** (`pokemon.js` enrichment, `evolutions`, `names`,
  `stats`, `locations`, `movesets`) are populated **region-by-region**,
  each pass self-contained (a region goes from "coming soon" to fully
  populated without waiting on the national dex; `locations.js` is
  inherently regional data anyway). `movesets.js` entries can't be written
  until their moves exist in `MOVES`.
- **Integrity check after every pass**: `tools/verify_region_data.js` —
  every id present in every table, every move/ability name resolves, every
  `evolvesTo.id` exists, no duplicate keys.
- **Source of record: the local PokeAPI CSV clone** (`temp/PokeAPI-master/
  data/v2/csv/`), read straight off disk. Page-by-page wiki research agents
  were tried first (0.1.13/14) at 100K-400K tokens per 9-24 Pokémon and
  abandoned. All descriptions (species, moves, abilities) are hand-authored
  original paraphrases, never copied flavor text.
- **Expected fallback, not a bug**: a species absent from Gen 9 takes the
  most recent version group with real moveset data (usually BDSP or
  Legends: Arceus). `max` stays `[]` — Dynamax doesn't exist in Gen 9.

**Tool of record: `tools/populate_region.js`** — one pipeline for whole
regions *and* individual species, adding or editing, every write ending in
`verify_region_data.js` (`CLAUDE.md` §3 for the modes; `TODO.md` #2 for
the step-by-step). Consolidated 2026-09-04 from `gen_region_data.js` +
`assemble_region_data.js`; unified 2026-09-05 (no version bump — `tools/`
is exempt) to absorb the id-list, table-scoped and in-place cases that had
spawned `backfill_empty_movesets.js`, `add_hidden_abilities.js` and the
ad-hoc Mega extractor. Design points that hold: repo-relative paths; a
region's id range from `pokemon_species.csv`'s `generation_id` (mainline
region = generation, 1:1 with `REGIONS`' order); moveset/encounter version
groups via `pokedexes.csv` → `pokedex_version_groups.csv` → `versions.csv`
(per species' own region in `--ids` mode); every table written by one
id-ordered upsert (replaced the three hand-detected `pokemon.js` splice
cases); a flat "descriptions needed" manifest after `--generate`;
`verify_region_data.js`'s `MAX_ID` auto-derived. Verified 2026-09-05 by
refreshing all four shipped regions' `stats`/`names`/`evolutions` on a
scratch copy: byte-identical apart from id-sorted edge order and the
`TODO.md` #7 edges. Evolution triggers with no level/friendship condition
now classify as `"other"` (blank arrow) rather than a wrong `"level"`,
**except a `known_move_id` trigger** (0.1.39), which classifies into the
app's "knows a specific move" shape instead (`CLAUDE.md` §5) — `TODO.md`
#7's edges are why this exception exists. **Excluded by design**: Hisui/
Orre — `populate_hisui_species.js` stays separate.

Progress: Kanto 0.1.15, Johto 0.1.16, Hoenn 0.1.17, Sinnoh 0.1.22 (the
last also restored 6 evolution links earlier passes had omitted as
out-of-range).

---

## Release pipeline — shipped 2026-09-05 (tools/-only, no version bump)

User asked for a way to compile and publish builds to the GitHub repo
(`origin` → `github.com/vokaerian-png/VKDex`) on command, with a changelog
pulled from `HISTORY.md` minus its process-attribution lines. Two options
were weighed: a local script using the `gh` CLI, vs. a GitHub Actions
workflow triggered by a tag push. Chose the local script — this project
already builds/tests Electron locally by design (`CLAUDE.md` §9, no
Electron in any sandbox), so it matches the existing shape instead of
standing up a parallel CI system for a one-developer project.

Shipped as `tools/release.js` — full behavior in `CLAUDE.md` §7a. Must be
run on the user's own machine: this session's sandbox can't reach GitHub
at all (proxy hard-blocks github.com) and has no `gh` CLI or Electron
binary, confirmed by direct test before building. One deviation from the
original spec, coder-flagged and accepted: the changelog-parser's
attribution-paragraph strip also treats a leading `**` line as real content
(not just `- `), because one older `HISTORY.md` entry (0.1.29→0.1.30) opens
with bold text instead of a bullet and has no attribution paragraph to
strip — verified against all 41 entries, no real attribution paragraph
starts with `**`.

**Setup the user still owns**: install the GitHub CLI and run
`gh auth login` once — the script checks for this and refuses to publish
without it, but never handles the token itself.
