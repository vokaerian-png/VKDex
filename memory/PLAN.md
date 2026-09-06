# VKDex — Plan

## Active temp/ scratch — still relevant

Maintained by the `temp/` relevance-audit routine (`CLAUDE.md` §6e), refreshed
each time it runs rather than appended to. One line per item — full context
lives at the cited reference, not here.

- `csv-audit-pipeline-2026-09-05/audit_real_run.txt` — `TODO.md` #10, "Full
  original-baseline output."
- `design-overhaul-2026-09-05/DESIGN.md`, `backup/`, `diffs/` — `TODO.md` #9,
  the 0.1.34 design overhaul's full revert toolkit (backups + per-file diffs).
- `evo-item-friendship-icons/verified-data.md`, `check.js` —
  `HISTORY_ARCHIVE.md` 0.1.32/0.1.33, marked "kept for reference."
- `regional-forms-2026-09-06/check.js` — `TODO.md` #4's still-open alt-forme
  candidates (Kalos/Unova species not yet scoped); the 33-check chip-
  visibility/auto-default/search-dual-display regression harness for that
  same mechanism.

---

Committed future work. Only definitive statements about planned functionality
belong here; ideas still under consideration live in `TODO.md`.

Most entries below have shipped and stay because they record standing
design decisions that still govern their feature — the per-version detail
lives in `HISTORY.md`, the current-state description in `CLAUDE.md`/
`SCOPE.md`. **One open commitment below** (CSV merge → `src/` pipeline
wiring, not started); everything else has shipped.

---

## PokeAPI + PokeDB CSV merge — analysis + merge tool shipped 2026-09-06; pipeline wiring to `src/` NOT started

User-directed, definitive replacement data source for the app going
forward. `temp/PokeDB-CSV/` (pokedb.org export, acquired 2026-09-06) has
real Scarlet/Violet, Legends: Arceus, and BDSP wild-encounter data the
`temp/PokeAPI-master/` clone completely lacks, plus richer translations,
friendship/base-experience era splits, and more — verified before any work
started (`SCOPE.md` §2's `NEEDS_SOURCE_REGIONS` Paldea gap, `TODO.md` #2/#10).

Two dispatches (`overlord`, fable, user pre-authorized by name given the
scale): analysis first (schema inventory + table pairing + gen-specific/
non-mainline-specific candidate detection + a real per-entity conflict scan,
`tools/csv_merge/{inventory,compare}.js`), then — after the user confirmed
the schema-shaping judgment calls below — the merge itself
(`tools/csv_merge/merge.js`). Both handoffs:
`temp/handoff/2026-09-06-122226-csv-source-analysis.md`,
`-132850-csv-merge-build.md`. Architect independently re-verified a sample
of headline claims against the raw source CSVs before relaying either
report (fresh `merge.js --verify` re-run, Lycanroc swap, Basculin catch
rate, Champions row count) — all held up.

**Output**: `csv/` (repo root, new top-level folder) — 149 CSVs, 1,053,720
rows, schema documented in `csv/MANIFEST.md`. Not gitignored — this is
meant to be tracked, unlike `releases/`.

**User-confirmed decisions** (the rest defaulted to `overlord`'s
recommendations, detailed in `csv/MANIFEST.md`):
- Per-cell species conflicts (~130, both sources have real errors): hand-
  adjudicated against Bulbapedia/official sources, not a blind "PokeAPI
  wins" rule — `tools/csv_merge/species_field_overrides.csv` is the full,
  reviewable list. Blind PokeAPI-wins stays the rule for every other table.
- Form identifiers: PokeAPI's vocabulary is canon (matches `altforms.js`);
  Maushold's default is Family of Four. `tools/csv_merge/form_aliases.csv`
  maps PokeDB's ~1,476 forms onto it.
- Japanese names: PokeAPI's trademark romaji kept (matches `names.js`),
  not PokeDB's Hepburn.
- Pokémon Champions (a real separate spinoff, confirmed via PokeAPI's own
  `pokedexes`/`version_groups` rows, 19,810 rows/319 Pokémon) included as
  its own split file, `learnsets_champions.csv`. Japanese-exclusive Gen 1
  Red/Green excluded everywhere.
- Generation-specific data split into its own tables (type chart ×3 eras,
  Gen 1-3 physical/special-by-type, friendship ×2 eras, base experience ×2
  eras) rather than folded into conditional columns; per-species stat/type/
  ability/move *history* kept as current+delta tables (PokeAPI's own
  convention) rather than exploded into 9 near-duplicate per-generation
  snapshots — flagged by `overlord` as a literal-reading judgment call,
  not re-confirmed by the user; revisit if the delta shape turns out wrong
  for whatever reads `csv/` next.
- Non-mainline games (Legends: Arceus, Legends: Z-A, Colosseum, XD,
  Champions) split into their own `_<game>.csv` files throughout (learnsets,
  encounters, item economy) rather than folded into mainline tables.

**Real corrections this surfaced** (both sources had errors; full list in
the handoff/`species_field_overrides.csv`): the 6 Hisui-species catch rates
are PokeDB's real Bulbapedia-sourced values, not PokeAPI's (which have no
source); PokeDB's `lycanroc-midday`/`-midnight` rows are internally swapped;
PokeAPI has ~90 other now-corrected species cells (Latias legendary flag,
Sandslash/Goodra default-form stat leaks, several ability-slot off-by-ones).

**Known gaps, not blocking**: Legends: Z-A has no learnsets/encounters in
either source (game too new/undatamined); ORAS's PokeDB encounters weren't
merged (PokeAPI already "has" that version, per the conflict rule); SV DLC
areas aren't split from base Scarlet/Violet (no area→DLC map exists yet).
Full list: `csv/MANIFEST.md`'s "Known gaps" section.

**Not started — the actual open commitment**: no `src/data/*.js` file
reads from `csv/` yet; the app's pipeline still runs on
`temp/PokeAPI-master/` via `populate_region.js`. Wiring a
`populate_region.js` successor to read `csv/` instead — and deciding how
the newly-available SV/BDSP/LA encounter data reaches `locations.js`
(`NEEDS_SOURCE_REGIONS`) — is separate, unscoped future work (`TODO.md`).

---

## Electron → Tauri migration — committed 2026-09-05; fully shipped, Electron cleanup done 2026-09-06

Promoted from `TODO.md` #1. User-approved switch away from Electron:
Tauri 2.x builds desktop **and** mobile from one project — something
Electron can't do at all — which the planned mobile version + separate
pc/mac version needs.

**Why Tauri over the alternatives checked**: Capacitor's desktop story is
thin (usually just pairs with Electron anyway); React Native means
rewriting the UI off plain HTML/CSS/JS entirely. Tauri is the only one
that keeps VKDex's zero-build-step frontend (`frontendDist` points straight
at a source folder, no bundler) and covers both targets from one project.
Numbers favor it hard for a mobile install: ~3-10MB installer vs Electron's
~120-200MB, ~380ms cold start vs ~1.4s, ~42MB idle RAM vs ~168MB.

**Accepted costs — dormant analysis, kept for whenever macOS/Linux/iOS are
revisited** (**not being pursued at this time**, user decision 2026-09-06;
Windows + Android are the only active targets):
- Tauri renders through the OS's own webview, not a bundled Chromium —
  WebView2 (Windows, Chromium-based, low risk) vs WKWebView (macOS, Safari
  engine) vs WebKitGTK (Linux). `SCOPE.md` §6-8's hand-tuned CSS
  (`scrollbar-width`/`-color`, `mask-image` scroll fades) is the actual
  exposure — a macOS build needs its own visual QA pass, not just "it
  compiled." macOS/Linux also have no live resize lock (JS fallback only,
  `SCOPE.md` §8).
- **iOS packaging needs a Mac + full Xcode no matter which framework** — an
  Apple platform rule, not a Tauri gap; the dev machine is Windows. Android
  has no such restriction.
- Tauri's own docs call mobile "functional, less mature than desktop" —
  fine for a data-browser app with no exotic native-API needs.

**Divergent desktop UI** (user intends a genuinely different window/UI for
pc/mac, not the phone frame scaled up): Tauri's per-platform config files
(`tauri.windows.conf.json`/`.macos.`/`.linux.` vs `.android.`/`.ios.`) can
each point `frontendDist` at a **different** frontend folder — desktop
targets load one UI tree, mobile another, same Rust core (gotcha: a
platform file *replaces* each field it touches rather than merging, so it
must repeat every setting it wants kept). Implied structure when that
work starts: `src/data/*.js` (already presentation-agnostic) stays the one
shared source; today's `src/` phone mockup stays the mobile frontend; a
new `src-desktop/` becomes the desktop one. **Not started** — every pass so
far was shell-only.

**Shipped and confirmed** (full current state: `CLAUDE.md` §2/§2a/§2b;
per-version detail `HISTORY.md`/`HISTORY_ARCHIVE.md` 0.2.11-0.2.22):
- Shell swap + `is-tauri` detection (0.2.11); native Win32 live resize/
  aspect lock (0.2.14, corner-jitter fix 0.2.16) — **user-tested on real
  hardware, "problem solved."**
- `tools/release.js` multi-target (Windows/Android/both, confirmation
  gate, one GitHub Release) + the `lib.rs`/`main.rs` mobile entry-point
  split (0.2.17) — a real `--target=both` publish confirmed 2026-09-05.
- Android release signing (RSA-2048 keystore, 0.2.20), APK size fix
  (Cargo release profile + `--split-per-abi`, 0.2.21), arm64-only publish
  policy (0.2.22) — `TODO.md` #1 closed.
- Electron cleanup (memory-bank/agent-def-only, no version bump): dead
  references retired from `CLAUDE.md` §2, `SCOPE.md`, `.claude/agents/*`.
  **The `electron-app/` folder itself (~1.6GB, always gitignored) still
  needs manual deletion by the user** (`CLAUDE.md` §4).

**Still placeholder**: the app icon (0.2.12 — a Poké Ball motif in VKDex's
colors, generated because `icons/icon.ico` is mandatory for a Windows
build) — swap for real branding whenever it exists. The `tauri.conf.json`
`identifier` `com.vokaerian.vkdex` was originally a placeholder too, but
`tauri android init` has since baked it into `gen/android/` and the release
key signs under it (`CLAUDE.md` §2a) — changing it now would mean a new
app listing, so treat it as settled unless the user says otherwise.

---

## Add the remaining regions' Pokémon to `POKEMON_DATA` — DONE (2026-09-06): 1025/1025, full National Dex

Extend `src/data/pokemon.js` region by region, each entry tagged with its
own `region` value (matching `REGIONS`' ids). **Kanto through Paldea are
all complete — every mainline region, ids 1-1025.** Alola/Galar/Paldea
landed 2026-09-06 via a 3-way parallel `coder` dispatch (`CLAUDE.md` §5b
for what that trial taught) once their regional-forme design blocker was
resolved the same day: 36 species / 41 Alolan/Galarian/Paldean formes in
`ALT_FORMS`, Hisui's chip-visibility/auto-default-forme pattern
generalized to every mainline chip, and a global-search rule showing base
and regional variant as separate results (`SCOPE.md` §4, `TODO.md` #4).

A region pass is purely data work — `tools/populate_region.js` (usage in
`TODO.md` #2, modes in `SCOPE.md` §2) writes all the per-Pokémon files, and
no `app.js` change has ever been needed for a new region (region bar,
`renderGrid()`, filtering, search, favorites and the detail screen all key
off `REGIONS`/the data). `id` = national dex number, never a
region-internal display order. Remaining alt-forme work for new-region-
native species (Tatsugiri's own formes, Paldean event Pokémon, Kalos/Unova
candidates) is separate, still-undecided work — `TODO.md` #4.

---

## Detail screen redesign — shipped 0.1.18 (+ Units toggle 0.1.19)

Settled 2026-09-03 via the interactive `vkdex-detail-mockup` Cowork
artifact (four review rounds); current behavior in `SCOPE.md` §4. Standing
decisions that still govern the screen:

- **Layout, top to bottom**: Picture card (normal + shiny sprites, dex
  number top-right, flavour text merged in as a bottom flap sharing the
  card's border; the name moves up into the topbar) → Alt Formes →
  Evolution Line → Found In → Facts list (0.2.7 appended Egg Groups and
  Held Items rows — additions, not a reorder) → Learnable Moves (Level-Up/
  TM/Egg/Max/Tutor tabs, an empty tab isn't rendered; each row carries its
  type pill) → Base Stats (Base / Lv.1 / Lv.100 table plus hexagonal
  radar). 0.1.34 briefly moved Facts/Stats up and cut the table to one
  settings-chosen level column; **both reverted 0.1.35 by user direction**
  — this original order and the three-column table stand. Old plain
  "Region" fact row dropped — Found In covers it.
- **Type renders as colored per-type pills**, never joined text — applies
  to every future rendering of this field, not just this screen.
- **Abilities**: name + full description; a hidden ability sorts last with
  a small "Hidden" badge.
- **Height/Weight**: one merged row. Metric⇄imperial toggle lives in the
  Settings popup, app-wide, default metric — not per-Pokémon.
- **Matchups**: closes out the Facts list, after Exp Growth — the original
  0.1.18 position. (0.1.34 moved it under Type without the user asking;
  reverted 0.1.38 — the precedent behind `CLAUDE.md`'s no-unauthorized-
  reorder rule.) Always three rows — Weakness (×2/×4 only), Resists
  (×0.25-×0.5), Neutral (×1) — plus Immune (×0) as a distinct conditional
  row, never folded into Neutral; Neutral is not user-hideable (0.1.34's
  "Hide Neutral" setting removed 0.1.35, no use case). All computed live
  from `TYPE_CHART` against the entry's `types`; nothing stored per-entry.
  A ×4 pill gets a thin gradient outline (`.mult-4`).
- **Capture Rate**: raw value + real regular-Poké-Ball catch odds. **Exp
  Growth**: total points to Lv.100 + curve name. **Name** taps through to
  ja (+romaji)/fr/de/ko. **Found In** chips tap through to that region's
  areas/routes.
- No external assets or libraries — the radar chart is hand-drawn SVG, on
  a **fixed 0–255 scale** so shapes compare across species (0.1.34,
  user-confirmed; per-species max before), drawn at 280×270 so a low-BST
  polygon stays legible.

---

## Alt Formes wiring for the detail screen — shipped 0.1.21 / 0.1.25 / 0.1.30-31 / 0.1.34 (Megas) / 2026-09-06 (regional forms)

Promoted from `TODO.md` #4 on 2026-09-04; that entry's 9 rules remain the
spec of record, `SCOPE.md` §4 the current behavior. Decisions locked in
on promotion and since:

- **Ability-tag wording**: any non-Mega/Gmax forme tags an appended
  ability with its own short name ("Speed", "Sunny", "Heat"); a Mega/Gmax
  tags with its forme name minus the species name — "Mega", "Mega X",
  "Mega Y", "Mega Z" (0.1.34, so X/Y pairs aren't ambiguous). The
  singular `ability` field is an ability *name* resolved in `ABILITIES`,
  same as every other ability reference (normalized, never inline).
- **Module UI (0.1.34, tap rule fixed 0.1.35, widened 0.3.3)**: when any
  forme is tappable the base renders as bubble 0 and the row reads as a
  segmented control. Every non-`recolorOnly` forme is tappable — a tap
  always swaps both Picture sprites and the topbar name; the information
  card swaps only if the forme carries its own `types`/`abilities` (a
  stat-only Mega shows its art over the base's facts). Forme stat cards
  are labelled "Base Stats — <forme>".
- **Rule 5** (a lone differently-typed forme → its own detail screen) stays
  deferred until a real species needs it — never block on it.
- **First pass (0.1.21)**: full mechanism plus Deoxys (#386, same-typed,
  distinct stats) and Castform (#351, differently-typed, shared stats).
- **Mega Evolutions (0.1.34)**: every Mega in `POKEMON_DATA`,
  CSV-authoritative (`pokemon_forms.csv` `is_mega`), each with own stats,
  `types` where changed, `isMega`, and its one ability appended per rule
  4. Includes the Legends: Z-A / Mega Dimension Megas — **user-confirmed
  keep, 2026-09-06**, standing default for future passes too (per-species
  list and the query-only-if-uncertain rule: `TODO.md` #5). Gigantamax
  still unpopulated (Gmax changes no data, so they'd be inert sprite-only
  bubbles — not decided, `TODO.md` #5).
- **Rule 6 (0.1.25)**: Unown/Burmy/Cherrim/Arceus as `recolorOnly` —
  Arceus by explicit user direction despite its Plates changing type
  in-game. Shellos/Gastrodon deferred (`TODO.md` #4).
- **Hisuian regional forms (0.1.30/31)**, user-requested mid-session: the
  16 species with a Hisuian form are ordinary rule-7 differently-typed
  formes. Two additions beyond the 9 rules, both user-confirmed 2026-09-04:
  a **navigation-context-dependent default forme** (opened from the Hisui
  screen, the Hisuian forme is active; from anywhere else, base) and a
  **plural ability swap** (a forme's `abilities`/`hiddenAbility` *replace*
  the shown list while active — rule 9 extended to Abilities; rule 4's
  singular `ability` tag-append stays reserved for Mega/Gmax).
- **Alolan/Galarian/Paldean regional forms (2026-09-06, `overlord`)**,
  user-confirmed design the same day (`TODO.md` #4): 36 more species / 41
  formes, CSV-derived (battle-only forms excluded, Megas/Gmax/cap/totem
  skipped), same rule-7 shape and plural ability swap as the Hisuian ones.
  Two mechanism decisions locked: the **navigation-context default forme
  and grid sprite override are generic** — any forme keyed by (or
  prefixed with) a `REGIONS` id counts as that region's variant, and every
  mainline chip surfaces species with such a forme alongside its natives
  (Hisui's single-region implementation was replaced, not duplicated);
  and **dex quick-search lists regional variants as their own result
  rows** (base first, then each variant, each opening its own forme;
  Mega/Gmax never do; retroactive to the Hisuian 16). Rule 7's "one
  combined stat card for formes sharing a stat line" clause is built
  (Paldean Tauros); Megas keep one card each (rule 3).
- **Per-forme evolution override (0.3.4/0.3.5)**: a regional-variant forme
  can carry its own `evolvesTo`, read instead of `EVOLUTIONS[id]` while
  active — `SCOPE.md` §4 for the mechanism, `TODO.md` #4 for the accepted
  no-target-forme-auto-navigation limitation.

---

## Standalone dexes: Hisui + Orre — shipped 0.1.26 / 0.1.28

Promoted from `TODO.md` #6 on 2026-09-04. Two purple-tinted region-bar
chips (`REGIONS`' `standalone: true`) for dexes that aren't mainline
regions: **Hisui** (Legends: Arceus, its own 001-242 numbering track) and
**Orre** (Colosseum + XD: Gale of Darkness roster, real national numbers +
a C/XD/C-XD game tag). Neither is ever written into `pokemon.js`'s `region`.

Phased by user direction on cost: mechanism + Orre in full (136 members)
+ Hisui's 213 already-populated species in 0.1.26; Hisui's 29 net-new
species in 0.1.28, which also settled how those attach to the National Dex
(real `region` for the 22 with a mainline region, `hisuiOnly: true` for
the 7 Legends: Arceus originals — `SCOPE.md` §2). Open data question on 2
dropped Orre rows: `TODO.md` #6.

---

## PLA (Legends: Arceus) learnsets split from mainline — shipped 0.2.18, follow-ups 0.2.19

Legends: Arceus's move-learning mechanics are structurally different from
every mainline game (level-up with a `mastery` rank, tutor "Move Shop"
moves — never TMs or egg moves), so its data was silently winning the
pipeline's "highest-order version group" pick and wiping TM/egg for 55
species. The user's call: **PLA data is never merged into mainline
movesets again, full stop** — captured into its own file
(`src/data/movesets_hisui.js`, `{levelUp, tutor}` only) and shown only
when the detail screen is opened from the Hisui screen, over its own
two-tab list; mainline screens render identically to before. The
pipeline's mainline version-group selection excludes PLA unless a species
has no non-PLA rows at all. Follow-ups (Hisuian-form rows win over base
when both exist; Tutor as a real mainline tab): `TODO.md` #13. Current
behavior: `SCOPE.md` §2/§4; detail: `HISTORY.md` 0.2.18/0.2.19.

---

## Data storage architecture — shipped 0.1.10

Decided 2026-09-03; still the governing shape (`CLAUDE.md` §1, `SCOPE.md` §2).

- **Plain JavaScript, not JSON/CSV/Excel.** The app runs over `file://`
  (a browser tab or the packaged Tauri app) with no server and no build
  step; `fetch()` and ES-module `import` of local files are blocked there,
  a plain `<script>` tag isn't.
- **Split by concern into `src/data/`**, one file per kind of data, one
  `<script>` tag each — no bundler, no `type="module"`. A diff only touches
  the file for the kind of data that changed.
- **Normalize shared data**: `abilities.js`/`moves.js`/`items.js` hold each
  entry exactly once, keyed by name/slug; per-Pokémon files reference
  names and the detail screen looks them up at render time. A correction
  is a one-line fix, not a find-and-replace.
- **Spreadsheets are not a storage format** (no spreadsheet reader belongs
  in a zero-dependency app; nested shapes don't fit flat rows). At most a
  future authoring aid regenerated into `data/*.js` — only worth it if
  hand-editing JS becomes real friction. It hasn't.

---

## Data sourcing & population order — shipped 0.1.12 → 0.1.22

Committed 2026-09-03. Still the rule for any future data pass:

- **Normalized tables (`abilities.js`, `moves.js`, `items.js`)** got one
  initial global sweep (0.1.12, everything through Gen 3); each pass since
  appends only what its species newly reference, never a speculative full-
  national list. Duplicate keys are an integrity-check failure.
- **Per-Pokémon files** (`pokemon.js` enrichment, `evolutions`, `names`,
  `stats`, `locations`, `movesets`) are populated **region-by-region**,
  each pass self-contained. `movesets.js` entries can't be written until
  their moves exist in `MOVES`.
- **Integrity check after every pass**: `tools/verify_region_data.js` —
  every id present in every table, every move/ability/item name resolves,
  every `evolvesTo.id` exists, no duplicate keys.
- **Source of record: the local PokeAPI CSV clone** (`temp/PokeAPI-master/
  data/v2/csv/`), read straight off disk. Page-by-page wiki research agents
  were tried first (0.1.13/14) at 100K-400K tokens per 9-24 Pokémon and
  abandoned. All descriptions (species, moves, abilities, items) are hand-
  authored original paraphrases, never copied flavor text.
- **Expected fallback, not a bug**: a species absent from Gen 9 takes the
  most recent version group with real moveset data (usually BDSP; PLA is
  excluded — the learnset-split entry above). `max` stays `[]` — Dynamax
  doesn't exist in Gen 9.

**Tool of record: `tools/populate_region.js`** — one pipeline for whole
regions *and* individual species, adding or editing, every write ending in
`verify_region_data.js` (`SCOPE.md` §2 for the modes; `TODO.md` #2 for the
step-by-step). Consolidated 2026-09-04/05 from several one-off scripts.
Design points that hold: repo-relative paths; a region's id range from
`pokemon_species.csv`'s `generation_id` (mainline region = generation, 1:1
with `REGIONS`' order); moveset/encounter version groups via
`pokedexes.csv` → `pokedex_version_groups.csv` → `versions.csv` (per
species' own region in `--ids` mode); every table written by one
id-ordered upsert; a flat "descriptions needed" manifest after
`--generate`; `verify_region_data.js`'s `MAX_ID` auto-derived. Evolution
triggers with no level/friendship condition classify as `"other"` (blank
arrow), **except a `known_move_id` trigger** (0.1.39), which classifies
into the app's "knows a specific move" shape (`SCOPE.md` §4). **Excluded
by design**: Hisui/Orre — `populate_hisui_species.js` stays separate.

Progress: Kanto 0.1.15, Johto 0.1.16, Hoenn 0.1.17, Sinnoh 0.1.22, Unova
0.2.7, Kalos 0.2.22, Alola/Galar/Paldea 0.3.0.

---

## Release pipeline — shipped 2026-09-05 (tools/-only, no version bump)

User asked for a way to compile and publish builds to the GitHub repo on
command. Two options were weighed: a local script using the `gh` CLI, vs.
a GitHub Actions workflow triggered by a tag push. **Chose the local
script** — this project already builds/tests locally by design (no shell
binary in any sandbox, `CLAUDE.md` §4), so it matches the existing shape
instead of standing up a parallel CI system for a one-developer project.
Shipped as `tools/release.js` — full behavior in `CLAUDE.md` §2a
(retargeted 0.2.17 for Tauri's Windows/Android/both; release notes now
read verbatim from `HISTORY_PUSH.md`, `CLAUDE.md` §6d). Must be run on the
user's own machine — the sandbox can't reach GitHub and has no `gh` CLI.

**Setup the user owns**: install the GitHub CLI and run `gh auth login`
once — the script checks for this and refuses to publish without it, but
never handles the token itself.

---

## temp/ cleanup script — shipped 2026-09-06 (tools/-only, no version bump)

User wanted `temp/clean_temp.sh` (read `SCRAP.md`, deleted whatever it
listed) launchable via double-click and self-maintaining — it never edited
`SCRAP.md` back, so pruning stale entries was a manual architect chore.
Ported to `tools/cleanup.js` (Node, stdlib only) + a `cleanup.bat`
launcher, matching `release.js`/`release.bat`'s pattern rather than
depending on bash on PATH. `clean_temp.sh` retired (stubbed, not deleted —
mount `EPERM`; now listed in `SCRAP.md` for the user to remove). Behavior
and parsing rule: `CLAUDE.md` §1, `SCRAP.md`'s own header.

**Design correction found during the build**: a `SCRAP.md` entry's target
list can wrap onto a continuation line, so a naive one-line-per-bullet
read would silently drop targets while still deleting the entry recording
them. A target is now every backticked name **before the entry's first em
dash** — everything after is prose that cites other backticked names which
must never be read as targets. Marked `ponytail:` in the source with the
fallback if `SCRAP.md`'s format ever outgrows this shape. Verification
(self-test, dry-run, scratch delete+prune pass):
`temp/handoff/2026-09-06-131500-cleanup-script-scrap-pruning.md`. Not
testable in-sandbox: a real interactive `y` keypress, double-clicking the
`.bat`.
