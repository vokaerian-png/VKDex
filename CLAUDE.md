# VKDex — Project Memory Bank

**Read this file first, at the start of every session — then
`memory/SCOPE.md` right after.** Primary truth for this project's file
layout, versioning, workflow, and session process. This file alone stays at
the project root (Cowork auto-loads project instructions from a root
`CLAUDE.md`); its six companions live in `memory/` (§1): `SCOPE.md` (app
scope/design), `PLAN.md` (committed roadmap), `TODO.md` (ideas under
consideration), `HISTORY.md` (version changelog), `HISTORY_ARCHIVE.md`
(`HISTORY.md`'s compacted overflow, §6c), `HISTORY_PUSH.md` (current-
version release notes for the git pipeline, §6d).

**Reflect changes back into the memory bank as part of the same task** —
code changes here (+`HISTORY.md` for a version bump), design/scope
decisions into `SCOPE.md`, new ideas into `TODO.md`, new commitments into
`PLAN.md`. See §6. A change isn't done until the memory bank says it
happened.

**When something is genuinely uncertain, stop and ask — don't decide it
yourself.** A design choice this file doesn't settle, a scope question, an
instruction that could reasonably go two ways: surface it to the user and
wait. Holds for every session and every kind of work, code or otherwise.

**Standing design rule, see `SCOPE.md`'s intro**: cards and their internal
data blocks don't get reordered/restructured without an explicit user
go-ahead for that specific move — a caught unauthorized reorder gets
confirmed with the user, not silently kept or silently re-fixed.

---

## 1. File layout

Project root: `E:\Claude\Projects\VKDex` (mounted under `mnt/VKDex/` in the
Cowork shell — the exact `/sessions/<name>/` prefix varies per session).

```
VKDex/
  CLAUDE.md                                  <- memory bank; stays at root (Cowork auto-load)
  memory/                                     <- rest of the memory bank (moved here 2026-09-06)
    SCOPE.md  PLAN.md  TODO.md  HISTORY.md
    HISTORY_ARCHIVE.md                        <- HISTORY.md's compacted overflow (§6c)
    HISTORY_PUSH.md                            <- current-version release notes (§6d)
  package.json                                <- Tauri CLI/API devDeps, dev/build scripts
  src/                                       <- THE APP. All app edits go here.
    index.html
    styles.css
    app.js
    data.js                                   <- APP_VERSION, REGIONS only
    data/                                      <- per-Pokemon data, split by concern
      types.js         (TYPE_CHART: Gen 9 type-effectiveness chart, static)
      pokemon.js       (POKEMON_DATA: id, name, region, +types/category/height/
                         weight/abilities/hiddenAbility/description/eggGroups/
                         heldItems — 731 entries, ids 1-721 + Hisui-29)
      abilities.js     (ABILITIES, keyed by name — 204 entries)
      moves.js         (MOVES, keyed by name — 689 entries)
      items.js         (ITEMS_DATA, keyed by slug — 132 referenced items, 0.2.22)
      movesets.js      (MOVESETS, keyed by id: levelUp/tm/egg/tutor/max)
      movesets_hisui.js (MOVESETS_HISUI, keyed by id: Legends: Arceus-only
                          learnsets split out of movesets.js, 0.2.18 —
                          levelUp w/ mastery + tutor, 241 entries)
      evolutions.js    (EVOLUTIONS, keyed by id: evolvesTo chain)
      locations.js     (LOCATIONS, keyed by id -> region -> areas w/ encounter
                         method/level/rate lines — SCOPE.md §2)
      names.js         (NAMES, keyed by id: ja/jaRomaji/fr/de/ko)
      stats.js         (STATS, keyed by id: base stats, capture rate, exp growth)
      altforms.js      (ALT_FORMS, keyed by base id — SCOPE.md §4's Alt Formes module)
      hisui.js         (HISUI_DEX_NUMBERS: id -> Hisui's own 001-242 number)
      orre.js          (ORRE_MEMBERS: id -> C/XD/C-XD game tag)
      natures.js       (NATURES, 25 entries keyed by identifier — 0.2.5, data only)
      experience.js    (EXPERIENCE_CURVES, 6 curves x 101 by level — 0.2.5, data only)
      sprites/         (local sprite files — SCOPE.md §2)
        pokemon/       (per-Pokemon sprites: normal/shiny/alt formes)
        items/         (item sprites)
  src-tauri/                                 <- Tauri build shell (§2b) — the only packaging shell now (§2)
    Cargo.toml  build.rs  tauri.conf.json  capabilities/default.json  icons/  ANDROID_SETUP.md
    src/lib.rs  src/main.rs  src/resize_lock.rs  <- lib.rs: the app (shared desktop/mobile entry); main.rs: desktop shim; resize_lock.rs: native WM_SIZING lock (Windows)
  releases/                                  <- tools/release.js output (windows/, android/), gitignored (§2a)
  tools/                                     <- Node data-pipeline scripts (SCOPE.md §2) + release.js (§2a)
  temp/                                      <- HANDOFF.md, handoff/, PokeAPI clone, SCRAP.md, clean_temp.sh, <task-slug>/ scratch
```

**Any edit to the app goes to `src/`, never the project root** (the app
files lived at root before the move into `src/`).

**`memory/`** (moved out of root 2026-09-06 to declutter file navigation;
`CLAUDE.md` stays put — see intro) — every cross-reference elsewhere
(`.claude/agents/*.md`, `tools/release.js`'s memory-bank file paths,
§6/§6a/§6c/§6d below) was updated in the same pass.

**Task-scoped scratch goes in its own `temp/<task-slug>/` subfolder, never
loose at `temp/` root** (user-specified 2026-09-05, after ~72MB of
undocumented one-off files had piled up there). Pipeline intermediates,
throwaway check scripts, pre-edit backups — all under a folder named for
the task, so a later cleanup can judge a whole folder at a glance.
`HANDOFF.md`, `handoff/`, and `PokeAPI-master/` stay at `temp/` root —
fixed infrastructure (§6b, the CSV pipeline), not task scratch.

**`SCRAP.md`/`clean_temp.sh`** (`temp/` root, fixed infrastructure; shipped
2026-09-05): a user-run cleanup script deleting whatever `SCRAP.md` lists.
**Whenever a task finishes with a `temp/` file or folder it generated or
used** (task-slug scratch folder, hand-supplied CSV/txt), architect checks
it's safe to delete — no live citation to a path inside it in `HISTORY.md`/
`TODO.md`/`PLAN.md`, not cited as "kept for reference" — and appends it with
a one-line reason. Architect never runs the script or deletes files (§4
`EPERM`); the user does, at their discretion. **Every time `SCRAP.md` is
opened**, also drop entries that no longer exist on disk.

**Git**: a real repo, `origin` → `github.com/vokaerian-png/VKDex`.
`.gitignore` excludes `temp/`, `/releases/`, `/node_modules`,
`/src-tauri/target` and `/src-tauri/gen` (build output, regenerable); its
now-inert `electron-app/` line is harmless to leave (§2).
**`src-tauri/` source is tracked** — Tauri is the long-term mobile+desktop
build system, not a wrapper afterthought like Electron. (A stray trailing
`src-tauri/` line in `.gitignore` briefly ignored the whole folder
mid-0.2.17 — user fixed it and committed; `git ls-files src-tauri` now
returns real source files.) Releases (§2a) publish built artifacts as
GitHub Release assets, not commits.

---

## 2. Native packaging — Electron retired, Tauri (§2b) is the sole shell

VKDex packaged as a portable Windows `.exe` via Electron
(`electron-packager`) from 0.1.0 through the Tauri migration; **fully
retired 2026-09-06** once Tauri's shell swap + resize lock + release
pipeline were all confirmed working on real hardware (0.2.16/0.2.17,
`PLAN.md`'s Tauri migration entry). `electron-app/` (the wrapper, its
`node_modules/`, and old local `dist/` zips — ~1.6GB, always gitignored/
untracked) needs manual deletion by the user; the sandbox mount can't
delete a folder this old (§4's `EPERM`). Nothing is lost by removing it —
old local build zips are superseded by GitHub Releases (§2a), and the
shell-detection hook (`is-electron`) was already fully replaced by
`is-tauri` in 0.2.11, confirmed no remnants left in `src/`. Full build
mechanics are historical now — `HISTORY.md` 0.1.x-0.2.10 and the cleanup
entry itself for what changed.

---

## 2a. Release pipeline — multi-target (0.2.17)

`tools/release.js` (`node tools/release.js [--target=android|windows|both]
[--dry-run|--check]`; plain script, stdlib only) builds and publishes one
GitHub Release for the current version. Order: `APP_VERSION` must equal
`src-tauri/tauri.conf.json`'s and `Cargo.toml`'s versions (hard error
naming the mismatch); clean tracked working tree; unused `vX.Y.Z` tag
(local + remote); `memory/HISTORY_PUSH.md`'s content, read verbatim as the
release notes (§6d — fails loudly if it doesn't mention "→ `APP_VERSION`",
catching a stale leftover entry from the previous bump); then a target
menu (1 Android / 2 Windows / 3 Both — `--target=` skips it), a printed
summary, and a **mandatory `Proceed? [y/N]` on every run, dry-run
included** — anything but y/yes aborts with nothing built or touched.
`--dry-run` only skips the final tag/push/publish. Non-dry runs check `gh`
is installed and authenticated (`gh auth login`; the script never handles
a token) before building.

**Windows**: `npm run build` (`tauri build`, release profile) →
`src-tauri/target/release/vkdex.exe` (case-insensitive match; Tauri may
name it `VKDex.exe`) → zipped via Windows' `tar.exe -a` to
`releases/windows/VKDex-vX.Y.Z-windows-x64.zip`. **Android**: refuses
(pointing at `src-tauri/ANDROID_SETUP.md`) unless `src-tauri/gen/android/
app` exists, else `npm run build:android` (`tauri android build --apk
--split-per-abi`, release-profile, real signing key — see below) → one
`.apk` per architecture under `gen/android/app/build/outputs/apk/`
(universal excluded; lists the tree if none found) → each copied to
`releases/android/VKDex-vX.Y.Z-android-<abi>.apk` (arm64/arm/x86/x86_64).
**Both** builds
sequentially; every artifact goes on one `gh release create` with the
changelog as notes. Never commits, never force-overwrites a tag. `--check`
runs the self-tests only (changelog parser, target parsing, APK search).
**Both targets confirmed end-to-end 2026-09-05** (real hardware): a
`--target=both` run built Windows (`tauri build` release profile, clean
post-crate-split compile) and Android, then a real non-dry-run publish
tagged `v0.2.17` and released both assets together. Android needed two live
fixes beyond `ANDROID_SETUP.md`'s original spec, both documented there —
`gradle.properties`'s `org.gradle.java.home` pinned to a JDK Gradle 8.14.3
can actually run (Android Studio's bundled JBR was Java 25, not the safe
default first assumed) — and a harmless Kotlin-daemon fallback on
cross-drive paths (project `E:`, `cargo` registry `C:`).

**Android releases resumed 0.2.20** (`TODO.md` #1 closed): `npm run
build:android` dropped `--debug` (now `tauri android build --apk`), so
Gradle's already-configured `release` buildType (`isMinifyEnabled` +
ProGuard) actually runs and produces an installable, real-key-signed APK
instead of the unoptimized debug build.

**APK size, resolved 0.2.21 (2026-09-06)**: a stale/cached build first
masked Cargo's new `[profile.release]` table (strip/lto/`codegen-units=1`/
`opt-level="z"`, `src-tauri/Cargo.toml`) — a genuine clean rebuild
(`cargo clean` + deleting `gen/android/app/build/`) confirmed it strips all
4 `.so`s, cutting the (universal) APK 732 MB → 289 MB. The remainder traced
to `frontendDist` (sprites included, ~70 MB) being compiled directly into
*each* architecture's binary, so a universal APK paid for that 4x over.
Fix: `build:android` now passes `--split-per-abi` — Tauri's own generated
`gen/android/app/build.gradle.kts`/`RustPlugin.kt` already define per-arch
product flavors (arm64/arm/x86/x86_64), no Gradle edits needed —
`release.js`'s `pickApks`/`buildAndroid` collect and publish all 4 release
APKs instead of one universal. Expected ~70-80 MB per architecture; not yet
measured on hardware.

**Release keystore, generated 2026-09-06**: RSA 2048, alias `vkdex`, valid
to 2054 — lives entirely outside the repo, in a private Dropbox-synced
location (off-machine backup by construction; a `.properties` copy of the
password sits alongside it there — exact path deliberately not recorded in
this file, see note below). `src-tauri/gen/android/keystore.properties`
(gitignored, plus a belt-and-suspenders `*.keystore`/`*.jks` `.gitignore`
line) is the local pointer Gradle reads — regenerated by hand from the
Dropbox backup after a fresh `tauri android init` wipes the folder. **This
key must sign every future update** — losing it means the app can never be
updated again under `com.vokaerian.vkdex`, only republished as a new
listing. **The real storage path is intentionally kept out of the memory
bank** (2026-09-06, user direction) — this is a checked-into-git file, and
a signing key's location is exactly the kind of detail that shouldn't be
in a repo, private or not. The user knows where it is.

**`release.bat`** (repo root, double-click launcher): `cd`s to the repo
root, runs `node tools\release.js` with any passed flags, then `pause`s.

---

## 2b. Tauri scaffold — 0.2.11-0.2.17: desktop + Android both confirmed

Replacing Electron (`TODO.md` #1 — Tauri 2.x builds desktop **and** mobile
from one project); like-for-like shell swap only, no new desktop UI yet.

`src-tauri/` + a new root `package.json` (`@tauri-apps/cli`+`api`, `npm run
dev`/`build`). `frontendDist: "../src"` — Tauri embeds `src/` directly at
build time, no `copy-app.js`-equivalent copy step. Shell-detection:
`window.isTauri` global, not a `userAgent` sniff; hook renamed
`is-electron` → `is-tauri`. Detail: `HISTORY.md` 0.2.11-0.2.14,
`temp/handoff/2026-09-05-101708-tauri-scaffold.md`.

**Build history** (`HISTORY.md` 0.2.12-0.2.16): `icons/icon.ico` is
mandatory for `tauri-build`'s Windows step; `npm run dev` ran from 0.2.13.
The JS settle-after-drag `lockAspect` (upstream Tauri #7303) was replaced
by a true live lock, `src-tauri/src/resize_lock.rs` (Windows-only,
subclasses the window proc on every `WM_SIZING` step; corner rule
stateless since 0.2.16 — full diagnosis in `HISTORY.md`). **User-confirmed
on real hardware (0.2.16): "Fix worked, problem solved."** `lockAspect`
stays as a no-op safety net. **0.2.17 split the crate for mobile**:
`src/lib.rs` = the app (`pub fn run()` under `#[cfg_attr(mobile, tauri::
mobile_entry_point)]`, owns `mod resize_lock`), `src/main.rs` = desktop
shim, `Cargo.toml` `[lib] vkdex_lib` staticlib/cdylib/rlib — confirmed
compiling clean for both desktop (`tauri build`) and Android (§2a),
2026-09-05, real hardware. Electron cleanup shipped 2026-09-06 (§2).

---

## 3. Versioning policy

Format **major.minor.regular** (e.g. `0.1.0`). Bump the last number by 1
per change, max 999 (rollover behavior TBD). User-specified 2026-09-02.
**0.1.40 → 0.2.0 was a user-directed exception** — a deliberate minor-
version jump, not a +1 continuation; not a new standing pattern.

**Current version: 0.2.22.** Mirror on every bump, across all of:
`src/data.js`'s `APP_VERSION` (feeds the "VKDex v<version>" line in
Settings, `#appVersion`), root `package.json`, `src-tauri/tauri.conf.json`,
and `src-tauri/Cargo.toml`. (`electron-app/package.json` was the same kind
of mirror target through 0.2.10, moot now that Electron's retired — §2.)

**Exempt:** memory-bank-only edits (`CLAUDE.md`/`SCOPE.md`/`PLAN.md`/
`TODO.md`/`HISTORY.md`) and `tools/`-only changes don't trigger a bump —
only `src/` changes do. User-confirmed 2026-09-02. The changelog lives in
`HISTORY.md`, not here.

---

## 4. Sandbox / testing limitations

- No Playwright, no Electron binary, no network egress beyond a small
  allowlist — confirmed repeatedly, treat as permanent, not worth
  re-testing. Verification here is code-level only: `node --check`, brace/
  tag balance, id cross-references, integrity scripts, Node harnesses
  `vm`-loading the real `data/*.js`. No automated or visual verification
  is possible from Cowork; see §4a for real screenshots.
- Google Fonts is blocked, so "Luckiest Guy" won't render in sandbox
  screenshots — a sandbox artifact, not a bug.
- **The mount refuses deletes** (`rm`/`rmdir`/`unlink` → `EPERM`, even on a
  fresh test file) — a bridge-level restriction. Only a file created this
  session can be overwritten/`mv`'d; leftover scratch needs manual
  deletion by the user. **Exception: the Dropbox MCP connector's `delete`**
  (§6a) goes through the real Dropbox API, not this mount — confirmed
  working 2026-09-05.
- **Root cause of recurring `.git/index.lock` (found 2026-09-06)**: `git
  status`/`git diff` opportunistically write-lock and refresh the index,
  then unlink their own lock when done — that unlink hits the same `EPERM`
  above, so **any plain `git status`/`git diff` run through this sandbox's
  Bash tool leaves a fresh stale lock behind**, confirmed reproducing live.
  Not a problem on the user's end. Fix: prefix `GIT_OPTIONAL_LOCKS=0` on
  any read-only git invocation from this sandbox (`git status`/`diff`/etc.)
  to skip the index refresh entirely — use it going forward instead of
  plain `git status`/`git diff` here. A lock already left behind needs the
  user to delete it directly (same manual step as other mount EPERM cases).

---

## 4a. Getting real screenshots from a Cowork session

Tested and confirmed working 2026-09-03.

1. **Manual screenshot from the user (preferred)** — no setup, always
   works; ask for this first.
2. **Computer Use, scoped to `VKDex.exe`**, only if requested. Target the
   packaged build, never `npm start`: `request_access` needs the literal
   filename **`VKDex.exe`** (`["VKDex"]`/`["Electron"]` don't resolve) —
   one call enables Computer Use, a second with the filename grants
   `tier: "full"`. Window may be on a non-primary monitor
   (`screenshot`/`switch_display`); `computer_batch` with `screenshot`
   (+`zoom`) is enough to look.

---

## 5. Workflow

**User-specified 2026-09-04, absolute — a hard boundary, not a style
preference.**

- **architect** (the orchestrating session, Cowork or Claude Code CLI)
  plans, scopes, asks the user clarifying questions, and folds subagent
  output into the memory bank. **Does not write to `src/`** — no
  `index.html`/`styles.css`/`app.js`/`data.js`/`data/*.js`, direct or via
  Bash. **Exception: `src/data/sprites/`** (asset curation, not code).
  `src-tauri/`/`tools/` aren't covered, though routing real code changes
  there through `coder` too is good practice.
- **`coder`** (`.claude/agents/coder.md`, Opus,
  Read/Write/Edit/Bash/Grep/Glob) does **all code-related tasks** —
  everything architect is restricted from, full stop. Implements exactly
  what architect specs, verifies its own work (`node --check` at minimum),
  writes a handoff report to `VKDex/temp/handoff/`
  (`YYYY-MM-DD-HHmmSS-short-slug.md`) per task — architect reads that
  rather than re-deriving what happened. Never touches the six memory-bank
  files (`CLAUDE.md` at root, the rest in `memory/`); that stays
  architect's job.
- **`reviewer`** (`.claude/agents/reviewer.md`, Opus, read-only:
  Read/Grep/Glob/Bash) reviews `coder`'s output for errors and real
  optimizations only; findings go back to `coder` to apply. **Suspended
  2026-09-04, until further notice** (user direction — token cost):
  architect folds `coder`'s handoff straight into the memory bank. Re-
  enable on user request; the role is otherwise unchanged.
- **`explorer`** (`.claude/agents/explorer.md`, Haiku, read-only:
  WebSearch/WebFetch/Read/Grep/Glob): online research (wikis, docs, public
  repos). Reports findings back rather than saving them.
- **`overlord`** (`.claude/agents/overlord.md`, Fable, effort fixed at
  `high`, Read/Write/Edit/Bash/Grep/Glob): a combined code writer/editor/
  reviewer, **invoked only when the user calls for it by name** — not part
  of architect's normal delegation. The sole exception to "architect edits
  the memory bank, coder doesn't": on request it may review and condense
  the six memory-bank files, and it folds a shipped code change's own
  memory-bank update in directly rather than reporting back.

**Effort setting, user-specified 2026-09-04** (each agent's `.md`
frontmatter is the source of truth): `coder`/`reviewer` default to
**medium**, dropped to **low** for a small mechanical change, raised above
medium only when architect judges a task genuinely warrants it. `explorer`
defaults to medium, raised only when necessary — no low tier. **None of
the three ever exceeds `high`.** The Cowork workaround below has no native
effort parameter, so architect states the intended level in the prompt.

**Cowork note, confirmed 2026-09-04**: Cowork's Agent tool only recognizes
built-in types (`claude`, `claude-code-guide`, `Explore`, `general-purpose`,
`Plan`, `statusline-setup`) and rejects `coder`/`reviewer`/`explorer`.
**Workaround**: architect invokes `general-purpose` with a `model: "opus"`
override (`"fable"` for `overlord`), pasting the target agent's `.md`
content in as the prompt. A full Claude Code CLI session resolves
`subagent_type: "coder"` etc. directly.

---

## 5a. Subagent task-list granularity

When folding a subagent's (`coder`/`overlord`/etc.) finished report into
the Cowork task list, break it into one `TaskCreate`/`TaskUpdate` per
named sub-step the report itself identifies, not one lump task for the
whole dispatch. Subagents run isolated with no live access to the task
list — they return a single final report — so this granularity happens
when architect reads that report back, not during the dispatch itself.
User-specified 2026-09-05; a general practice, not specific to this
project.

**Clear the list between batches of work**: once every task on the list is
completed and a new, unrelated batch of work is starting, delete the
completed tasks rather than letting them accumulate — a long scroll of old
completed items makes the list harder to read for no benefit. Not needed
mid-batch, only at that boundary.

---

## 5b. Parallel subagent dispatch — policy, untested (2026-09-06)

Discussed after the 0.2.18 fix (one coherent change across a shared
extractor/shared move table/shared render path — not a candidate for
splitting). Default stays **one sequential `coder` per task**; parallel
dispatch is the exception, for a batch of genuinely disjoint-file work
(e.g. a future region pass split `pokemon`/`stats` vs. `evolutions`/
`movesets` vs. `locations`) or independent read-only research fan-out.

- **Partition by disjoint files, decided up front** — one file, one
  writer, per parallel round. The normalized/shared files
  (`abilities.js`/`moves.js`/`items.js`) are the real hazard: at most one
  agent gets write access to any one of them per round; if two
  workstreams both need one shared file, that step runs first and
  sequentially, not in parallel.
- **`reviewer` does not become a merge gate.** Its value is being an
  independent, read-only checker (`CLAUDE.md` §5); giving it write access
  to reconcile two agents' output would erase that and reverse its
  cost-suspension by the back door. A real reconciliation is a normal
  sequential `coder` dispatch reading both handoffs, if one's ever needed.
- **`verify_region_data.js`/`--audit` stays the one post-hoc gate**
  regardless of how many agents touched the result, run once over the
  combined final state before anything is folded into the memory bank.
- **Untested — the next genuinely suitable large job is the first real
  trial.** Architect asks the user before initializing a parallel batch
  (not a silent default yet); that first run is a deliberate benchmark —
  track and report total token usage and wall-clock time spent, for
  comparison against what an equivalent sequential dispatch would have
  cost. Fold the result back into this section once it's run.

---

## 6. How this memory bank is maintained

These seven files **are** the durable memory bank (the older `stack.md`/
`version.md`/`workflow.md`/`navigation.md`/`MEMORY.md` store is superseded
as of 2026-09-02, kept only as a possibly-stale record). `CLAUDE.md` stays
at the project root; the other six live in `memory/` (moved 2026-09-06,
§1) — a plain filename below (`SCOPE.md`, etc.) means `memory/SCOPE.md`
unless stated otherwise.

- **`CLAUDE.md`** (project root): primary truth, read first every session,
  updated whenever something here becomes true or stops being true.
- **`SCOPE.md`**: app scope and design — what VKDex is, UI/UX conventions,
  navigation and screen behavior, the data model. Split out of `CLAUDE.md`
  2026-09-05 so app-facing decisions don't compete with process/workflow
  for space here. Read right after this file.
- **`TODO.md`**: ideas as proposed/considered. **Combine similar ideas
  into one entry with sub-points**, don't list duplicates. Candidates, not
  commitments.
- **`PLAN.md`**: definitive statements about planned/future functionality.
  Only actual commitments; unpromoted ideas stay in `TODO.md`.
- **`HISTORY.md`**: the 15 most recent version-history entries, newest
  first, one heading per bump (§6c).
- **`HISTORY_ARCHIVE.md`**: `HISTORY.md`'s compacted overflow (§6c).
- **`HISTORY_PUSH.md`**: the current version's release notes for
  `tools/release.js` (§6d).

Section numbering across `CLAUDE.md`/`SCOPE.md` was reset 2026-09-05 to run
sequentially (1, 2, 3, ...) with no gaps; a sub-clause of a main section
(e.g. this section's own §6a/§6b) takes that section's number plus a
letter, ordered a/b/c by where it appears. Every cross-reference in every
memory-bank file was updated in the same pass.

---

## 6a. Session-start memory-bank backup

At the start of every session: zip all six memory-bank files — `CLAUDE.md`
from the project root plus the five in `memory/` (§1) — and write the
archive directly (file tools — the Dropbox MCP connector can only make
plain-text files) to the user's **local Dropbox folder**,
`%USERPROFILE%\Dropbox\Apps\VKDex\backup_memory\` (Cowork sessions get the
real resolved path from the connected-folder list each session; a
Windows/CLI session resolves `%USERPROFILE%` itself — no machine-specific
username needs to live in this repo). Filename `<UTC timestamp>_<app
version>.zip`, e.g. `2026-09-02_22-43-50UTC_0.1.4.zip`.

**Cap: 10 archives max, enforced via the Dropbox MCP connector**
(`mcp__...__list_folder`/`delete`, folder `/Apps/VKDex/backup_memory`;
user-specified 2026-09-05). Its `delete` calls the real Dropbox API, so it
isn't subject to the mount's `EPERM` (§4) — it moves a file to Dropbox's
own "Deleted files," recoverable. After writing a new archive,
`list_folder` and `delete` the oldest until back at 10.

**Fallback**: Google Drive (`/VKDex/backup_memory/`) still works if Dropbox
is ever unavailable (switched to local Dropbox 2026-09-03, user-specified).

---

## 6b. End-of-session handoff

At the end of every session: rewrite `VKDex/temp/HANDOFF.md` from scratch —
**overwritten, not appended** — covering every piece of work done or
attempted that session, finished or not. Bar: next session's reader
(having read the five core files) should resume unfinished work **without
re-deriving it** — no re-reading data files to rediscover a gap already
found, no re-deriving a decision already made. Include: exact unfinished
prompts (quoted), open questions with their answers/tradeoffs, a concrete
"resume with this" pointer.

`HANDOFF.md` is a session-scoped supplement, not a sixth memory-bank file
— §6's rule (reflect real changes into the five files, same task) still
happens first; a finished item already folded there gets a one-line
pointer, not a re-summary. **Keep it concise** — "in detail" means no
*missing* detail, not long sentences: terse fragments, one line per fact,
no scene-setting, no narration, no restating what the other files say.

User-specified 2026-09-03; conciseness addendum 2026-09-04.

**Proactively recommend a handoff before the session ends naturally**, once
session token/context usage climbs high (roughly 70-80%+) — well before
§8's hard 95% halt — rather than waiting for the user to ask or for a
forced stop. A suggestion, not forced; the user can decline and keep
working. User-specified 2026-09-06.

---

## 6c. HISTORY.md rolling window + HISTORY_ARCHIVE.md

Added 2026-09-06 (user-directed — `HISTORY.md`'s unbounded growth was
flagged as a token/speed concern). `HISTORY.md` keeps only its **15** most
recent version entries; new entries are still written there in full, same
as always. Once a 16th accumulates, architect compacts the oldest entry —
a few lines: what shipped, key numbers, any decision a later session might
need to cite, not the full mechanism/verification detail — and moves it
into sibling `HISTORY_ARCHIVE.md`. Compact entries are written for
density, not readability, since user-readability matters less there than
in `HISTORY.md` proper; `PLAN.md`/`TODO.md`/`SCOPE.md` already carry the
durable "what was decided and why" for anything that still matters, so the
archive is a forensic record, not load-bearing documentation.
`HISTORY_ARCHIVE.md` carries no line cap of its own — an ever-growing log,
not something read every session the way `HISTORY.md`/`SCOPE.md` are.
First pass (2026-09-06) archived all 41 pre-0.2.0 entries (0.1.0-0.1.40),
cutting `HISTORY.md` 1758 → 777 lines.

---

## 6d. HISTORY_PUSH.md — release-notes staging file

Added 2026-09-06. Holds exactly one entry — the current/latest version's
changelog, written at the same compact density as `HISTORY_ARCHIVE.md`
(not `HISTORY.md`'s full mechanism/verification detail), since its literal
content is what `tools/release.js` writes as the GitHub Release notes body
(§2a) — no more extracting/stripping an entry out of `HISTORY.md`.
**Overwritten, not appended**, same convention as `HANDOFF.md` (§6b):
whoever bumps the version rewrites this file's single entry for that
version, as part of the same task that updates `HISTORY.md`/
`HISTORY_ARCHIVE.md`. An HTML comment at the top explains the file to a
human editor without leaking into the rendered release notes (GitHub
strips markdown comments). `release.js`'s real changelog step and its
`--check` self-test both fail loudly if the file doesn't mention "→
`<current APP_VERSION>`" — catching a stale leftover entry from the
previous bump before it ships as this release's notes.

---

## 7. Documentation conventions for this file

1. **Concise, but human-readable.** Sections should read easily and let a
   human reader derive intent at a glance — not compressed to one-line
   summaries. Same bar as §6b's, less aggressive: this file is read first
   every session, so it can afford prose that's actually load-bearing.
2. **Unnumbered (`###`) subsections, if any, live at the bottom of the
   file**, sorted after every numbered section rather than nested under
   their parent section, which links down to them. Reconsider on
   creation whether the content is actually load-bearing enough to number
   instead — see the equivalent call made for `SCOPE.md`'s CSS-pitfalls/
   visual-polish/window-resize sections (2026-09-05, promoted from
   unnumbered to §6-§8 there).
3. **Target: ≤600 lines total, standing cap** (raised from 550, 2026-09-06,
   the memory/ folder restructure — flagged here per the raise rule below;
   previously raised from 500 same day for the Android release-signing
   keystore documentation, and from 450, 2026-09-05, the real multi-target
   release confirmation + Android-pause decision).
   `SCOPE.md` carries its own independent standing cap of **≤700 lines**
   (raised twice now, both same-day, see that file's own intro for the
   second raise). Both raise **50 lines at a time** if genuinely
   needed, noted here (this file) or in `SCOPE.md`'s own intro (that file)
   when it happens — flagged to the user in the same response, no longer
   needs asking first. Every future addition gets an evaluate-and-compress
   pass in the same edit — look for restated context, superseded detail, or
   process narration to cut before the addition pushes either file over
   budget, per rule 4 below.
4. **Applies to every memory-bank edit** (`SCOPE.md`/`PLAN.md`/`TODO.md`/
   `HISTORY.md` too, and architect's routine §6 updates, not just
   `overlord`'s condensing passes — user-specified 2026-09-05): cut
   restated context, superseded detail, and process narration; keep every
   fact/decision/cross-reference a future reader needs.

User-specified 2026-09-04, extended 2026-09-05.

---

## 8. Token-usage halt threshold

**User-specified 2026-09-04, standing rule, absolute — no exceptions for
"just one more step."** If continuing work would push **session** token
usage to or past **95%**, or **weekly** usage to or past **99%**, halt
immediately, mid-task if needed. Before stopping, write what was done and
what's left to `VKDex/temp/` — into `HANDOFF.md`'s §6b rewrite if the
session is ending anyway, otherwise a dated note — so the next session
resumes without re-deriving state.

---

**Siblings:** `SCOPE.md` = app scope & design (UI, navigation, data model)
· `PLAN.md` = committed roadmap · `TODO.md` = ideas under consideration ·
`HISTORY.md` = version changelog (15-entry rolling window, §6c) ·
`HISTORY_ARCHIVE.md` = `HISTORY.md`'s compacted overflow ·
`HISTORY_PUSH.md` = current-version release notes for the git pipeline
(§6d).
