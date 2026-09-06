# VKDex — Version History Archive

Compacted entries for versions that have aged out of `HISTORY.md`'s
15-entry rolling window (`CLAUDE.md` §6c). Each entry here is a few lines —
what shipped, key numbers, and any decision a later session might need to
cite — not the full mechanism/verification detail the original `HISTORY.md`
entry had. If a citation elsewhere (`PLAN.md`/`TODO.md`/`SCOPE.md`) needs
more than what's here, those files already carry the durable "what was
decided and why" for anything that still matters; this file is a forensic
record, not load-bearing documentation. Newest first, same as `HISTORY.md`.

User-readability is secondary here — write for density, not prose.

## 0.2.22 → 0.3.0 — Full National Dex (1025/1025) + regional-form Alt Formes + Android single-APK policy

Deliberate version jump (like 0.1.40→0.2.0). Alola/Galar/Paldea landed via
a 3-way parallel `coder` dispatch (`CLAUDE.md` §5b's real trial — disjoint
id ranges did NOT make the batch file-disjoint, `populate_region.js
--assemble` whole-file read-modify-writes all 8 per-id tables regardless;
worked out on write-timing luck, not design — don't repeat on id-range
disjointness alone). `POKEMON_DATA` 731 → 1025. Sequential shared-table
pre-pass first (94 moves/90 abilities/10 items, cross-region overlap
confirmed); 13 evolution edges fixed post-parallel (cross-region deps:
Applin→Dipplin, Duraludon→Archaludon). ~641,500 total subagent tokens,
~39.8 min wall-clock vs. ~72.1 min estimated sequential (~45% reduction,
token cost unchanged). `overlord` wired 36 species/41 Alolan/Galarian/
Paldean regional formes into `ALT_FORMS` (109→145 species, 170→211
formes; `ABILITIES` 294→303) — same rule-7 shape as the existing Hisuian
formes, region-chip visibility/auto-default generalized, global search
shows base+variant as separate rows. Android: arm64-v8a-only publish
policy locked in (`pickApks()` filters `arm64`, `TODO.md` #1 closed).
`CLAUDE.md`/`SCOPE.md` caps raised to 650/750 for this content.
Handoffs: `temp/handoff/2026-09-06-093000-shared-tables-prepass.md`,
`-101230-alola-region-pass.md`, `-081320-galar-region-pass.md`,
`-081609-paldea-region-pass.md`, `-102332-evolution-edges-fix.md`,
`-082535-missing-evolution-items-fix.md`,
`-084148-regional-form-alt-formes.md`, `-version-bump-0.3.0.md`.

---

## 0.2.21 → 0.2.22 — Kalos region pass: 66 species, 12 Megas, Mega-forme tool bug fixed

Standard `populate_region.js` pipeline, ids 650-721 (66 new). +21 MOVES,
+14 ABILITIES, +2 ITEMS_DATA. 12 new Kalos Megas (only Diancie mainline,
11 Legends: Z-A). Meowstic's male/female Megas deduped to 1 (identical
stats/ability, sprite-only difference). Tool fix: Mega sprite-key extractor
now token-wise strips `-mega[-suffix]` instead of a fragile regex (was
broken by `meowstic-male-mega`, would've broken hyphenated species slugs
too). `POKEMON_DATA` 665 → 731. `--audit` 0 discrepancies. Git commit was
blocked this session by a stale `.git/index.lock` (sandbox EPERM, `CLAUDE.md`
§4) — resolved in a later session. Handoff:
`temp/handoff/2026-09-06-064647-kalos-region-pass.md`.

---

## 0.2.20 → 0.2.21 — Cargo release profile for Android APK size

0.2.20's signed/ProGuard'd build was still 732 MB (no real change from the
731.9 MB debug build) — `Cargo.toml` had no `[profile.release]` at all, so
Rust debug symbols/no-LTO shipped regardless of ProGuard. Added
`strip/lto/codegen-units=1/opt-level="z"`. Real size impact unmeasured
in-sandbox (no Android toolchain); per-ABI split deferred to 0.2.21/0.2.22.
Handoff: `temp/handoff/2026-09-06-045953-cargo-release-profile.md`.

---

## 0.2.19 → 0.2.20 — Android release signing key + release build profile

Real RSA-2048 release keystore (alias `vkdex`, valid to 2054), stored
outside the repo in a private Dropbox location (path deliberately not
recorded, `CLAUDE.md` §2a). `build.gradle.kts` `signingConfigs` wired to
the existing `release` buildType (minify+ProGuard already present from
`tauri android init`); `build:android` dropped `--debug`; `release.js`
output renamed `VKDex-vX.Y.Z-android.apk`. Per-ABI split deferred
(`TODO.md` #1, done 0.2.21/0.2.22). Verified: `node --check`, `release.js
--check`, `keytool -list -v` self-check; no real Gradle build possible
in-sandbox.

---

## 0.2.18 → 0.2.19 — Hisuian-form PLA priority + mainline Tutor tab

`TODO.md` #13's two follow-ups. `populate_region.js`: a `-hisui` alt
form's own PLA rows now win outright over the base species' — checked off
the CSVs, only Sneasel (#215) actually changes (the "7 species" assumed in
0.2.18 was 1; Giratina-Origin/Basculin-white-striped untouched by design,
no `ALT_FORMS` entry). `app.js`: `{ key: "tutor", label: "Tutor" }`
appended to `MOVE_TABS` (58 Unova species show it; flat move list, no
NPC/location tracking). `--audit` PASS, render harness 18/18.

---

## 0.2.17 → 0.2.18 — Legends: Arceus learnsets split from mainline movesets

User-directed (screenshot: Bidoof missing TM/Egg tabs). Root cause: the
moveset extractor picked one "best" version group per species by highest
`order`, and PLA (`order=26`, highest) has zero TM/egg rows — silently
wiped 55/665 species' real mainline lists. Fix: exclude PLA from mainline
selection unless a species has zero non-PLA rows (only 7 `hisuiOnly`
qualify). New `src/data/movesets_hisui.js` (241 entries, `{levelUp,
tutor}` with `mastery`) holds PLA's own learnset, shown only from the
Hisui screen via its own 2-tab list. +17 moves surfaced. Verified
idempotent, 610/665 `movesets.js` entries byte-identical, the other 55
exactly the predicted PLA set.

---

## 0.2.16 → 0.2.17 — Release script retargeted for Tauri (Android/Windows/Both) + mobile entry-point split

`overlord`. `src-tauri/` split for mobile (`lib.rs` = shared app/
`tauri::mobile_entry_point`, `main.rs` = desktop shim, `Cargo.toml` gained
`vkdex_lib`); `tools/release.js` rewritten for a 3-way target menu +
mandatory `Proceed? [y/N]` gate. Same-day real-world confirmation: user
fixed a `.gitignore` line hiding `src-tauri/` from git, hit two Android
build gotchas (JDK 25→8.14.3 pin, harmless cross-drive Kotlin-daemon
fallback), then a real `--target=both` non-dry-run succeeded — `v0.2.17`
tagged/pushed/published. Debug-signed universal APK was 731.9 MB — too
large to ship again until fixed (closed 0.2.20-0.2.22's signing/size/
arm64-only chain, `TODO.md` #1).

## 0.2.15 → 0.2.16 — Resize lock: stateless corner rule

`overlord`. Round-1 local test found corner-drag jitter; root cause was a
re-basing assumption invalid under Windows' real `WM_SIZING` behavior (each
step proposes from cursor position, not the last returned rect). Fix: the
corner rule became a pure function of the proposal (`prop_h*ASPECT > prop_w`
→ height drives). Round-2 local test: "Fix worked, problem solved" — native
resize lock confirmed on real hardware, closing the Tauri migration's last
open item.

## 0.2.14 → 0.2.15 — aria-hidden focus-retention fix

`coder`. Fixed 4 Chromium "Blocked aria-hidden" console warnings: blur any
focused element before setting `aria-hidden` on its container, at all 4
close handlers (`closeMenu`/`closeDetailPopup`/`closeDetail`/
`closeSettings`). Unverified live at ship time (no browser in-sandbox).

## 0.2.13 → 0.2.14 — Native Tauri resize lock (WM_SIZING), unconfirmed

`overlord`. Replaced the settle-then-snap JS fallback with a true live
aspect lock: `src-tauri/src/resize_lock.rs` subclasses the window proc,
rewriting the proposed rect on every `WM_SIZING` step (Windows-only).
Unverified at ship time (no Rust toolchain in-sandbox); the corner-jitter
bug found and fixed next version (0.2.16 above).

---

## 0.2.12 → 0.2.13 — Resize-lock hardened against jitter

`coder`. First real user `npm run dev` test: app ran correctly but window
resize was erratic — traced to likely upstream Tauri bug (#7303, `setSize()`
no-op during native drag modal loop). Hardened `lockAspect`: 150ms→400ms
debounce, re-entrancy guard (600ms cooldown + retry), `setSize` failures now
`console.warn` instead of silent. Verified via harness only (fake clock +
mocked `setSize`); real Windows drag behavior needed user re-test.

## 0.2.11 → 0.2.12 — `icons/icon.ico` mandatory for Tauri Windows build

Architect (placeholder asset, not logic). First `cargo build` failure:
`tauri-build`'s Windows resource-compile step needs `icons/icon.ico` on disk
unconditionally, regardless of `bundle.icon`/`bundle.active` — corrects
0.2.11's research that icons were fully optional. Generated a 5-file
placeholder icon set (Poké Ball style, VKDex palette) via sandbox
PIL/ImageMagick; `tauri.conf.json` lists all four. Still placeholder art,
swap out when real branding exists (`PLAN.md`).

## 0.2.10 → 0.2.11 — Tauri scaffold added alongside Electron

`coder`, user-directed Electron→Tauri switch (`TODO.md` #1, one project for
desktop+mobile). Like-for-like shell swap only: new `src-tauri/` project
(`Cargo.toml`/`build.rs`/`main.rs`/`tauri.conf.json`, `frontendDist: "../src"`,
no copy step needed unlike Electron), `window.isTauri` detection
(`is-electron`→`is-tauri` renamed throughout), new JS-side resize-lock
(`lockAspect`, since Tauri has no `setAspectRatio()` equivalent — corrects
toward the more-dragged axis, debounced ~150ms, later hardened in 0.2.13).
Unverified beyond sandbox-reachable checks — no Rust toolchain in-sandbox;
first real test needed the user's machine (Rust+MSVC Build Tools).

---

## 0.2.4 → 0.2.10 — Found In popup rework (folds 0.2.4-0.2.9)

`coder`. Collapsible `<details>` areas (real in-game order via
`location_game_indices.csv`, not alphabetical; Hoenn Gen-3-primary +
Gen-6-appended two-tier); "Walk" method relabeled "Grass" at the source
(`METHOD_LABEL`). Folded-in prior versions: **0.2.5** schema-gap batch
(+5 `pokemon.js` fields, natures/experience-curve data files,
`SCHEMA_GAPS` 28→15); **0.2.6** 4 evolution `note` descriptors; **0.2.7**
Unova populated (522→665 species, `overlord`), egg groups, per-region
encounter detail, `items.js`/`ITEMS_DATA` (130 entries) + Held Items row;
**0.2.8** encounter/item rarity reworked collapsed→per-game; **0.2.9** item
popup description-prefix + horizontal-scroll fixes. User-confirmed via
real screenshots (Pidgey Kanto, Wurmple Hoenn) — accordion, Grass relabel,
Hoenn two-tier order all render correctly. `--audit`/`verify_region_data.js`
PASS throughout; 8,456-assertion harness.

---

## 0.2.3 → 0.2.4 — Gender toggle disabled while an alt forme is active

`coder`. On the 16 species with both `hasFemaleSprite` and an `ALT_FORMS`
entry, the male/female toggle now gets native `disabled` while a non-base
forme is active (no gendered alt-forme art exists) — restores on base
reselect, filled state stays visible underneath. One `querySelectorAll`
loop in `setActiveForme()`. Verified: 16-assertion harness + 0.2.3's own
44-assertion harness re-run, `--audit` PASS.

---

## 0.2.2 → 0.2.3 — Gender symbols on evolution arrows; male/female sprite toggle; 95 species get bundled female art

`coder`. Gender glyph (♂/♀) added to `evoArrowIconsHtml()` for 5 gendered-
edge species (Wormadam/Mothim/Vespiquen/Gallade/Froslass); gendered parent
sprite in Evolution Line row (Combee only has bundled art). 95
`POKEMON_DATA` entries gained `hasFemaleSprite: true` (hand-derived from
moved sprite files, not CSV-sourced — won't survive `--refresh --tables
pokemon`). New male/female `.gender-btn` toggle on Picture card;
`pictureSpriteUrl()` is the single sprite resolver forme+gender both build
through. Verified: 44-assertion harness, `--audit` PASS.

---

## 0.2.1 → 0.2.2
Evolution `gender` descriptor extended to Combee/Kirlia/Snorunt chains.
Real bug caught: `evoDescriptorHtml` only walked the chain root's own
edges, so non-root Kirlia would never have shown it — fixed to collect
across the full `evolutionPaths` walk (chain-wide, not per-edge).
`populate_region.js` evolution extractor now writes `gender` from CSV
`gender_id`; Tyrogue's `statCompare`/Wurmple's `note` stay hand-authored,
no CSV column backs either.

## 0.2.0 → 0.2.1
Double-press-to-skip back navigation (400ms window, one guard in
`backDetail()`). Evolution-line ambiguous-label descriptors for 3 chains
(Tyrogue `statCompare`, Burmy `gender`, Wurmple hand-authored `note`) via
new `evoDescriptorHtml()`. 5 new species-flag fields across all 522 ids
(`isLegendary`/`isMythical`/`isBaby`/`genderRate`/`baseHappiness`).

## 0.1.40 → 0.2.0
Friendship-row sprite alignment fix (`.evo-arrow{flex:1 0 auto}`). Deliberate
user-directed minor-version jump (0.1.40→0.2.0), not a +1 continuation.

## 0.1.39 → 0.1.40
Evolution fan-out revised: one shared arrow (not per-branch), explicit
`.evo-fan-row` groups of 3 with dividers, sprite min-heights. Superseded by
0.2.0's alignment fix before ever being screenshotted.

## 0.1.38 → 0.1.39
New "knows a move" evolution trigger (`item:"tm-normal"` + `move` field);
closed `TODO.md` #7's last 5 missing evolution edges + reclassified 2
existing ones. Evolution-line fan-out layout introduced for 3+-branch roots
(Eevee/Tyrogue).

## 0.1.37 → 0.1.38
Reverted 0.1.34's unauthorized Facts-card reorder (Abilities/Weakness order
restored to 0.1.18 original) — source of the standing "no card reorder
without explicit go-ahead" rule (`CLAUDE.md`/`SCOPE.md` intro). 5 empty
movesets fixed (Pinsir/Tauros/Slowking/Sceptile/Rhyperior); `MOVES` 617→622.

## 0.1.36 → 0.1.37
Farfetch'd curly-apostrophe spelling decided (matches CSV). Mega/Gmax
ability tag got its own red-bordered style, distinct from the tan "Hidden"
tag. BST row font enlarged.

## 0.1.35 → 0.1.36
CSV-audit tooling fixes: Sinnoh `hiddenAbility` backfill (91 flags, ids
387-487), Celadon City added to 4 Kanto location lists, orphaned
"Cacophony" ability deleted, 6 `moves.js` pp/power hygiene fixes.
`--audit` 123→21 remaining (all pre-known).

## 0.1.34 → 0.1.35
Post-overhaul fixes from real user feedback on 0.1.34: removed the buggy
Stat Level setting (real bug — `NaN` grid-column write), replaced the
Imperial-units switch with a Metric/Imperial box selector, removed Hide
Neutral, reverted card order, made every Mega/Gmax bubble tappable
regardless of type/ability delta. `populate_region.js` unified into one
tool (`--ids`/`--refresh`/`--tables`, tools-only, no bump).

## 0.1.33 → 0.1.34
Design overhaul, all 25 `overlord` findings (nav/readability/usability/
settings/detail-screen) — full record: `temp/design-overhaul-2026-09-05/
DESIGN.md`. Several detail-screen changes here (card order, matchups
position) were later reverted (0.1.35/0.1.38) after user review — don't
re-propose. Mega Evolution data shipped: 63 formes/57 species (incl. 17
Legends Z-A/Mega Dimension Megas, kept — official per CSV), Mega Heatran/
Darkrai ship with no `ability` (no CSV row).

## 0.1.32 → 0.1.33
Evolution arrow condition icons (item sprite / friendship heart / day-night
/ move-type pill); new `held` evolution method. 11 of `TODO.md` #7's 16
missing evolution edges added (5 remained, closed 0.1.39).

## 0.1.31 → 0.1.32
Sprite folder split into `pokemon/`/`items/` subfolders (user reorg, 898
item sprites added, unwired). 4 sprite-URL builders repointed; no other
code change needed.

## 0.1.30 → 0.1.31
Forme ability swap-on-tap (rule 9 extended to Abilities) for 10 of 16
Hisuian formes with a real ability delta. +1 ability (Strong Jaw, →168).
`reviewer` role suspended from this pass on (token cost, user direction).

## 0.1.29 → 0.1.30
Fixed 8 mislabeled "Friendship" evolution edges (real triggers were shed/
beauty/location/party-species/held-item+time/knows-move) → blank arrow.
Added 16 Hisuian regional-form `ALT_FORMS` entries (12 with distinct stats).
Reversed the `hisuiOnly` search exclusion — those 7 species findable
everywhere except Hisui-scoped quick-search.

## 0.1.28 → 0.1.29
Backfilled 87 of 92 empty `MOVESETS` entries (root cause: newest PokeAPI
version groups can carry only train-only rows, yielding an empty pick). 5
left blocked on missing move descriptions, closed 0.1.38.

## 0.1.27 → 0.1.28
Hisui's 29 net-new species fully populated (22 real-region natives +
7 `hisuiOnly` originals) — Hisui roster complete at 242/242. New
`populate_hisui_species.js` (id-list-keyed fork). 6 `evolutions.js` parents
patched for reachability.

## 0.1.26 → 0.1.27
BST (base stat total) row added to the Base Stats card. First trial of the
coder/reviewer pipeline — passed clean, no process changes.

## 0.1.25 → 0.1.26
Standalone-dex mechanism shipped (purple region-bar chips, non-mainline).
Orre fully populated (136 members; 2 bad source rows dropped, `TODO.md` #6).
Hisui numbering landed for the 213 already-populated species (29 net-new
deferred to 0.1.28).

## 0.1.24 → 0.1.25
Alt Formes rule 6 (recolor-only, collapses to one sprite + "+N" popup)
shipped: Unown (28 formes), Burmy (3), Cherrim (2), Arceus (19 — user
directed no type-swap/no rule 7 despite Plates' real typing).

## 0.1.23 → 0.1.24
Restored 195 hyphenated cosmetic-form sprites (Arceus/Unown/etc.) excluded
by 0.1.23's re-sort. `0.png` wired as a missing-sprite `onerror` fallback
across all 5 sprite `<img>` sites.

## 0.1.22 → 0.1.23
Sprite bundle re-sorted by script after a raw unsorted PokeAPI dump had
replaced it. Counts: 1025/1025 base, alt-formes 310 normal/303 shiny.

## 0.1.21 → 0.1.22
Sinnoh (dex 387-493) fully populated — national dex 1-493 complete. 6
evolution links restored that earlier region passes had dropped as
out-of-range.

## 0.1.20 → 0.1.21
Alt Formes module shipped: mechanism + Deoxys (3 same-typed formes, distinct
stats) + Castform (3 differently-typed, shared stats). The 9 governing
rules this established are recorded in full in `PLAN.md`/`TODO.md` #4, not
here.

## 0.1.19 → 0.1.20
Sprites switched from hotlinked `raw.githubusercontent.com` URLs to local
bundled files (`file://` compatibility). Offline Cache feature (IndexedDB
sprite caching, Settings toggle) removed as dead weight now that sprites
are local.

## 0.1.18 → 0.1.19
Screenshot-feedback polish pass (drawer-handle sizing, radar-chart backdrop
hexagon). Units setting added (Metric/Imperial toggle, Settings).

## 0.1.17 → 0.1.18
Detail screen redesign shipped in full — the six-card layout (Picture/
Evolution Line/Found In/Facts/Moves/Stats) `PLAN.md`'s "Detail screen
redesign" entry still describes as current. Real Gen 3+ catch-rate formula
implemented (Poké Ball, full HP, no status).

## 0.1.16 → 0.1.17
Hoenn (dex 252-386) fully populated — Kanto+Johto+Hoenn = 386/386 complete.
New reusable `verify_region_data.js` integrity checker (still in use).

## 0.1.15 → 0.1.16
Johto (dex 152-251) fully populated. Per-Pokémon data files switched from
overwrite to merge-by-id, the convention every later region pass used.

## 0.1.14 → 0.1.15
Kanto (dex 1-151) fully populated via a new local CSV pipeline (cloned
PokeAPI's `data/v2/csv/` tables, read off disk) — replaced the prior
wiki-research-agent sourcing method (~397K tokens/Pokémon) with something
far cheaper. This CSV pipeline is still the project's sourcing method.

## 0.1.13 → 0.1.14
Caterpie (dex 10) — proof-of-concept for CSV-pipeline sourcing via
browser-pane client-side CSV filtering, ahead of the full local-clone
pipeline landing next version.

## 0.1.12 → 0.1.13
First richer-data batch: Kanto starter trio (dex 1-9), sourced from
pokemondb.net/Bulbapedia. Established the "current Gen 9 mechanics, not
frozen legacy values" sourcing rule still in effect.

## 0.1.11 → 0.1.12
`abilities.js` (77) and `moves.js` (354) sourced for Gen 1-3 — first
normalized shared-table sweep, the pattern every later region pass follows
(shared tables first, per-species data references them).

## 0.1.10 → 0.1.11
Gen 9 type chart added (`data/types.js`, `TYPE_CHART`) — static data,
weaknesses computed at render time rather than stored per species.

## 0.1.9 → 0.1.10
Data storage architecture: per-Pokémon data split out of `data.js` into
`src/data/*.js`, one file per kind of data. Pure structural refactor, no
data changed. Still the governing file layout (`CLAUDE.md` §1).

## 0.1.8 → 0.1.9
Johto and Hoenn added to `POKEMON_DATA` as bare `{id, name, region}`
placeholder entries, ahead of full population.

## 0.1.7 → 0.1.8
Grid Width setting added (3/4/5-column segmented control, Settings).

## 0.1.6 → 0.1.7
Drawer-handle / quick-search sizing tweaks from screenshot feedback.

## 0.1.5 → 0.1.6
Dex quick-search (filters the grid in place, national-wide) and a visible
drawer-handle tab both shipped.

## 0.1.4 → 0.1.5
Visual polish pass: raised-surface gradients/shadows, sprite backdrops,
hover/press tactile states, scroll-edge mask fades, empty-state treatments
(Favorites, Poké Ball watermark).

## 0.1.3 → 0.1.4
Drawer navigation, detail screen, Favorites, and Search all wired up for
the first time (screen router + the three placeholder drawer icons).

## 0.1.2 → 0.1.3
Explicit scrollbar styling — Electron's Chromium default rendered a plain
white rectangular scrollbar.

## 0.1.1 → 0.1.2
Electron window minimum size locked to 360×800; phone frame scales up with
window growth instead of padding around a fixed frame.

## 0.1.0 → 0.1.1
Resizable Electron window with a locked 360:800 aspect ratio. First logged
entry.
