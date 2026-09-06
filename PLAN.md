# VKDex — Plan

Committed future work. Only definitive statements about planned functionality
belong here; ideas still under consideration live in `TODO.md`.

Most entries below have shipped and stay because they record standing
design decisions that still govern their feature — the per-version detail
lives in `HISTORY.md`, the current-state description in `CLAUDE.md`. **One
open commitment right now: the Tauri migration, below** — shell swap,
native resize lock, and the multi-target release pipeline (Windows +
Android) are all shipped and user-confirmed on real hardware, including a
real published v0.2.17 release. Remaining: Android releases are paused
pending a size fix (below), then Electron cleanup.

---

## Electron → Tauri migration — committed 2026-09-05; shell + resize lock confirmed working (0.2.16)

Promoted from `TODO.md` #1. User-approved switch away from Electron:
Tauri 2.x builds desktop **and** mobile from one project — something
Electron can't do at all — which the planned mobile version + separate
pc/mac version needs, including the mobile codebase's own ability to
compile to desktop (Electron's current trick).

**Why Tauri over the alternatives checked**: Capacitor's desktop story is
thin (usually just pairs with Electron anyway, doesn't collapse to one
pipeline); React Native means rewriting the UI off plain HTML/CSS/JS
entirely, the biggest rewrite of any option. Tauri is the only one that
keeps VKDex's current zero-build-step frontend (`frontendDist` points
straight at a source folder, no bundler) and covers both targets from one
project. Numbers favor it hard for a mobile install specifically: ~3-10MB
installer vs Electron's ~120-200MB, ~380ms cold start vs ~1.4s, ~42MB idle
RAM vs ~168MB.

**Real, accepted costs**:
- Tauri renders through the OS's own webview, not a bundled Chromium —
  WebView2 (Windows, Chromium-based, low risk here) vs WKWebView (macOS,
  Safari engine) vs WebKitGTK (Linux). `SCOPE.md` §6-8's hand-tuned CSS
  (`scrollbar-width`/`-color`, `mask-image` scroll fades) is the actual
  exposure — a macOS build will need its own visual QA pass, not just "it
  compiled."
- **iOS packaging needs a Mac + full Xcode no matter which framework** — an
  Apple platform rule, not a Tauri gap; the dev machine is Windows, so this
  is an unavoidable capability gap either way. Android has no such
  restriction.
- Tauri's own docs call mobile "functional, less mature than desktop" —
  fine for a data-browser app with no exotic native-API needs, but the
  newer half of the framework.

**Divergent desktop UI (user intends a genuinely different window/UI for
pc/mac, not just the phone frame scaled up)**: not a Tauri problem — it's a
content-agnostic shell like Electron, no opinion on what HTML it loads.
Tauri has a purpose-built mechanism for exactly this: per-platform config
files (`tauri.macos.conf.json`/`.windows.`/`.linux.` vs `.android.`/
`.ios.`) can each point `frontendDist` at a **different** frontend folder —
desktop targets load one UI tree, mobile targets load another, same Rust
core/project (gotcha: a platform file *replaces* each field it touches
rather than merging, so it must repeat every setting it wants kept).
Implied structure for when that work starts: keep `src/data/*.js` (already
presentation-agnostic, normalized) as the one shared source; today's `src/`
phone-mockup stays the mobile frontend; a new `src-desktop/` becomes the
desktop one. Electron has no equivalent since it never had a mobile target
to diverge from — a genuine structural point in Tauri's favor, not just
parity. **Not started** — this pass was shell-swap only.

**Shipped and confirmed**: `src-tauri/` project + root `package.json`,
`is-electron`→`is-tauri` detection swap (0.2.11, `coder`); a native
Win32-subclass live resize/aspect-ratio lock (0.2.14, `overlord` — Tauri
has no equivalent of Electron's `setAspectRatio`), corner-jitter fix
(0.2.16, `overlord`) — **user-tested on real hardware, both rounds clean
after the fix, "problem solved."** Full detail: `HISTORY.md` 0.2.11-0.2.16,
`CLAUDE.md` §2b. `electron-app/` has a known transitional regression (the
phone-frame scale-as-a-unit behavior breaks under a *new* Electron rebuild,
since `window.isTauri` never fires there — `CLAUDE.md` §2), accepted since
Electron's being retired.

**Release tooling + Android first pass — shipped and confirmed 0.2.17**
(`overlord` built it; `ANDROID_SETUP.md`'s first-ever run, the crate split,
and a real `--target=both` build + publish all confirmed 2026-09-05 on real
hardware): `tools/release.js` builds Windows (`tauri build`), Android
(`tauri android build --debug`) or both, with a mandatory confirmation
gate, and publishes every artifact on one GitHub Release (`CLAUDE.md` §2a).
The `lib.rs`/`main.rs` mobile-entry-point split (`CLAUDE.md` §2b) compiles
clean for both targets. Two real Android setup gotchas surfaced and are now
documented in `ANDROID_SETUP.md`: Gradle 8.14.3 can't run on this machine's
JDK 25 installs (including Android Studio's own bundled JBR — pin
`gradle.properties`'s `org.gradle.java.home` at a real JDK 17-21 instead),
and a harmless Kotlin-daemon fallback on cross-drive paths.

**Android releases paused after 0.2.17** (user decision, 2026-09-05): the
debug-signed universal APK is 731.9 MB — too large to keep shipping.
`TODO.md` #1 tracks the fix (a real release signing key plus a smaller
build shape — release/optimized profile and/or per-ABI split APKs instead
of universal). Don't use `--target=android`/`both` for a real release until
that lands; Windows releases are unaffected. **Next commitment: Electron
cleanup** — `electron-app/` and its dead references across the memory
bank. macOS/Linux still have no live resize lock (JS fallback only) — not
blocking, `TODO.md` #1. iOS stays out of scope (Mac + Xcode).

**Not yet decided**: the `identifier` in `tauri.conf.json`
(`com.vokaerian.vkdex`) is a placeholder — becomes the permanent OS-level
app identity and the Android application id `tauri android init` bakes
into `gen/android/`, worth settling **before** that init runs. **The app
icon is also a placeholder** (0.2.12 — architect generated a Poké Ball
motif in VKDex's colors after a real build blocked on `icons/icon.ico`
being mandatory, `HISTORY.md` 0.2.12) — swap for real branding whenever it
exists. (Android release signing is covered above, `TODO.md` #1.)

---

## Add the remaining regions' Pokémon to `POKEMON_DATA`

Extend `src/data/pokemon.js` region by region, each entry tagged with its
own `region` value (matching `REGIONS`' ids). Status (0.2.7): Kanto/Johto/
Hoenn/Sinnoh/Unova complete (ids 1-649); Kalos/Alola hold only the 9
Hisui-roster natives added in 0.1.28; Galar/Paldea empty ("coming soon").

A region pass is purely data work — `tools/populate_region.js` (usage in
`TODO.md` #2, current-state description in `SCOPE.md` §2) writes all the
per-Pokémon files, and no `app.js` change has ever been needed for a new
region (region bar, `renderGrid()`, filtering, search, favorites and the
detail screen all key off `REGIONS`/the data).
`id` = national dex number, never a region-internal display order.

**Kalos onward is not yet committed** — `TODO.md` #2. A pass now also
needs hand-authored `items` descriptions (0.2.7, `descriptions.json`).

---

## Detail screen redesign — shipped 0.1.18 (+ Units toggle 0.1.19)

Settled 2026-09-03 via the interactive `vkdex-detail-mockup` Cowork
artifact (four review rounds); built in `app.js` in 0.1.18 (`HISTORY.md`),
current behavior in `SCOPE.md` §4. Standing decisions that still govern
the screen:

- **Layout, top to bottom**: Picture card (normal + shiny sprites, dex
  number top-right, flavour text merged in as a bottom flap sharing the
  card's border; the name moves up into the topbar) → Alt Formes →
  Evolution Line → Found In → Facts list (0.2.7 appended Egg Groups and
  Held Items rows after Exp Growth, ahead of the matchups — additions,
  not a reorder) → Learnable Moves (Level-Up/TM/Egg/Max tabs, an empty
  tab isn't rendered; each row carries its type pill) → Base Stats (Base /
  Lv.1 / Lv.100 table plus hexagonal radar).
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
spec of record, `SCOPE.md` §4 the current behavior. Decisions locked in
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
true` for the 7 — `SCOPE.md` §2). Open data question on 2 dropped Orre
rows: `TODO.md` #6.

---

## Data storage architecture — shipped 0.1.10

Decided 2026-09-03; still the governing shape (`CLAUDE.md` §1, `SCOPE.md` §2).

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
`verify_region_data.js` (`SCOPE.md` §2 for the modes; `TODO.md` #2 for
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
app's "knows a specific move" shape instead (`SCOPE.md` §4) — `TODO.md`
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
already builds/tests Electron locally by design (`CLAUDE.md` §4, no
Electron in any sandbox), so it matches the existing shape instead of
standing up a parallel CI system for a one-developer project.

Shipped as `tools/release.js` — full behavior in `CLAUDE.md` §2a
(**rewritten 0.2.17** for Tauri's Windows/Android/both targets with a
confirmation gate; the Tauri entry above tracks what's still unverified).
Must be run on the user's own machine: this session's sandbox can't reach GitHub
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
