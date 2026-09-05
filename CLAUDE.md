# VKDex — Project Memory Bank

**Read this file first, at the start of every session — then `SCOPE.md`
right after.** Primary truth for this project's file layout, versioning,
workflow, and session process. Companion files: `SCOPE.md` (what the app
is, its UI/design conventions, navigation, and data model), `PLAN.md`
(committed roadmap), `TODO.md` (ideas under consideration), `HISTORY.md`
(version changelog).

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
  CLAUDE.md  SCOPE.md  PLAN.md  TODO.md  HISTORY.md   <- memory bank
  src/                                       <- THE APP. All app edits go here.
    index.html
    styles.css
    app.js
    data.js                                   <- APP_VERSION, REGIONS only
    data/                                      <- per-Pokemon data, split by concern
      types.js         (TYPE_CHART: Gen 9 type-effectiveness chart, static)
      pokemon.js       (POKEMON_DATA: id, name, region, +types/category/height/
                         weight/abilities/hiddenAbility/description)
      abilities.js     (ABILITIES, keyed by name — 179 entries)
      moves.js         (MOVES, keyed by name — 622 entries)
      movesets.js      (MOVESETS, keyed by id: levelUp/tm/egg/max)
      evolutions.js    (EVOLUTIONS, keyed by id: evolvesTo chain)
      locations.js     (LOCATIONS, keyed by id -> region -> areas)
      names.js         (NAMES, keyed by id: ja/jaRomaji/fr/de/ko)
      stats.js         (STATS, keyed by id: base stats, capture rate, exp growth)
      altforms.js      (ALT_FORMS, keyed by base id — SCOPE.md §4's Alt Formes module)
      hisui.js         (HISUI_DEX_NUMBERS: id -> Hisui's own 001-242 number)
      orre.js          (ORRE_MEMBERS: id -> C/XD/C-XD game tag)
      sprites/         (local sprite files — SCOPE.md §2)
        pokemon/       (per-Pokemon sprites: normal/shiny/alt formes)
        items/         (item sprites)
  electron-app/                              <- portable Windows build wrapper
    main.js  copy-app.js  package.json  README.md
    app/         (generated copy of ../src, refreshed by copy-app.js)
    dist/        (electron-packager output)
  tools/                                     <- Node data-pipeline scripts (SCOPE.md §2)
  temp/                                      <- HANDOFF.md, handoff/, PokeAPI clone, <task-slug>/ scratch
```

**Any edit to the app goes to `src/`, never the project root** (the app
files lived at root before the move into `src/`).

**Task-scoped scratch goes in its own `temp/<task-slug>/` subfolder, never
loose at `temp/` root** (user-specified 2026-09-05, after ~72MB of
undocumented one-off files had piled up there). Pipeline intermediates,
throwaway check scripts, pre-edit backups — all under a folder named for
the task, so a later cleanup can judge a whole folder at a glance.
`HANDOFF.md`, `handoff/`, and `PokeAPI-master/` stay at `temp/` root —
fixed infrastructure (§6b, the CSV pipeline), not task scratch.

**Git**: a real repo, `origin` → `github.com/vokaerian-png/VKDex`.
`.gitignore` excludes `electron-app/` and `temp/` wholesale — the Electron
wrapper and its build output have never been version-controlled; only
`src/`, `tools/`, `.claude/`, and the memory bank are tracked. Releases
(§2a) publish built `.exe`s as GitHub Release assets, not commits.

---

## 2. The portable Electron build

`electron-app/` (sibling to `src/`) packages the app into a no-install
portable `.exe` via `electron-packager`: `npm run package:win` →
`dist/VKDex-win32-x64/VKDex.exe`.

`main.js` loads `../src/index.html` live in dev (`npm start`), or a
self-contained `./app/` copy once packaged; it sets no application menu
(`Menu.setApplicationMenu(null)`) so no default accelerators (Ctrl+R etc.)
are live. `copy-app.js` refreshes that copy from `../src` right before
packaging (its explicit `dataFiles` list for `data/*.js` — **extend it for
every new data file** — plus `data/sprites/` recursively), so dev needs no
copy step. Electron's postinstall needed npm's allowScripts approval,
recorded in `package.json`'s `allowScripts` field.

Chosen over **Tauri** (needs a Rust toolchain — revisit once more
finalized, `TODO.md` #1) and a bare browser-launcher script (not a real
app). Window resize/scaling: `SCOPE.md` §8, "Window resize / scaling
behavior."

---

## 2a. Release pipeline

`tools/release.js` (`node tools/release.js [--dry-run|--check]`; no new
dependencies, plain script per the `tools/` convention; shipped 2026-09-05)
builds and publishes a GitHub Release for the current version. Checks
`src/data.js`'s `APP_VERSION` against `electron-app/package.json`'s
`"version"` (hard error on mismatch), requires a clean tracked working tree
and an unused `vX.Y.Z` tag (checked local + remote), extracts that
version's `HISTORY.md` entry with its leading attribution paragraph
stripped (whatever text follows the heading before the first real `- `/
`**` content line), runs `npm run package:win`, zips the output via
Windows' built-in `tar.exe` (no npm zip dependency), then tags, pushes, and
runs `gh release create` with the zip and changelog as release notes.
`--dry-run` builds/zips but stops before tagging/pushing/publishing;
`--check` runs only the changelog-parser self-test (no git, no build, no
network). Requires the GitHub CLI (`gh`) installed and authenticated via
`gh auth login` — the script never handles a token directly. Never commits
on the user's behalf, never force-overwrites an existing tag.

**`release.bat`** (repo root, double-click launcher): `cd`s to the repo
root regardless of launch context, runs `node tools\release.js` with any
passed flags, then `pause`s so the window stays open to read the output.

---

## 3. Versioning policy

Format **major.minor.regular** (e.g. `0.1.0`). Bump the last number by 1
per change, max 999 (rollover behavior TBD). User-specified 2026-09-02.
**0.1.40 → 0.2.0 was a user-directed exception** — a deliberate minor-
version jump, not a +1 continuation; not a new standing pattern.

**Current version: 0.2.4.** Mirror on every bump, both together:
`src/data.js`'s `APP_VERSION` (feeds the "VKDex v<version>" line in
Settings, `#appVersion`) and `electron-app/package.json`'s `"version"` (so
the packaged `.exe`'s Windows file properties match).

**Exempt:** memory-bank-only edits (`CLAUDE.md`/`SCOPE.md`/`PLAN.md`/
`TODO.md`/`HISTORY.md`) and `tools/`-only changes don't trigger a bump —
only `src/`/`electron-app/` changes do. User-confirmed 2026-09-02. The
changelog lives in `HISTORY.md`, not here.

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
  `electron-app/`/`tools/` aren't covered, though routing real code
  changes there through `coder` too is good practice.
- **`coder`** (`.claude/agents/coder.md`, Opus,
  Read/Write/Edit/Bash/Grep/Glob) does **all code-related tasks** —
  everything architect is restricted from, full stop. Implements exactly
  what architect specs, verifies its own work (`node --check` at minimum),
  writes a handoff report to `VKDex/temp/handoff/`
  (`YYYY-MM-DD-HHmmSS-short-slug.md`) per task — architect reads that
  rather than re-deriving what happened. Never touches the five memory-bank
  files; that stays architect's job.
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
  the five memory-bank files, and it folds a shipped code change's own
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

## 6. How this memory bank is maintained

These five files at the project root **are** the durable memory bank (the
older `stack.md`/`version.md`/`workflow.md`/`navigation.md`/`MEMORY.md`
store is superseded as of 2026-09-02, kept only as a possibly-stale record).

- **`CLAUDE.md`**: primary truth, read first every session, updated
  whenever something here becomes true or stops being true.
- **`SCOPE.md`**: app scope and design — what VKDex is, UI/UX conventions,
  navigation and screen behavior, the data model. Split out of `CLAUDE.md`
  2026-09-05 so app-facing decisions don't compete with process/workflow
  for space here. Read right after this file.
- **`TODO.md`**: ideas as proposed/considered. **Combine similar ideas
  into one entry with sub-points**, don't list duplicates. Candidates, not
  commitments.
- **`PLAN.md`**: definitive statements about planned/future functionality.
  Only actual commitments; unpromoted ideas stay in `TODO.md`.
- **`HISTORY.md`**: every version-history entry, newest first, one heading
  per bump.

Section numbering across `CLAUDE.md`/`SCOPE.md` was reset 2026-09-05 to run
sequentially (1, 2, 3, ...) with no gaps; a sub-clause of a main section
(e.g. this section's own §6a/§6b) takes that section's number plus a
letter, ordered a/b/c by where it appears. Every cross-reference in every
memory-bank file was updated in the same pass.

---

## 6a. Session-start memory-bank backup

At the start of every session: zip the five memory-bank files and write the
archive directly (file tools — the Dropbox MCP connector can only make
plain-text files) to the user's **local Dropbox folder**,
`C:\Users\dandr\Dropbox\Apps\VKDex\backup_memory\`. Filename
`<UTC timestamp>_<app version>.zip`, e.g. `2026-09-02_22-43-50UTC_0.1.4.zip`.

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
3. **Target: ≤400 lines total, standing cap** (reset 2026-09-05 from 850,
   after the `SCOPE.md` split dropped this file's real content — the old
   500→800→850 cap history is no longer load-bearing detail). `SCOPE.md`
   carries its own independent standing cap of **≤600 lines**. Both raise
   **50 lines at a time** if genuinely needed, noted here (this file) or
   in `SCOPE.md`'s own intro (that file) when it happens — flagged to the
   user in the same response, no longer needs asking first. Every future
   addition gets an evaluate-and-compress pass in the same edit — look for
   restated context, superseded detail, or process narration to cut before
   the addition pushes either file over budget, per rule 4 below.
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
`HISTORY.md` = version changelog.
