// Local build-and-publish script: version-check -> clean-tree check -> tag check
// -> changelog extraction -> electron-packager build -> zip -> git tag/push ->
// GitHub release. Run from anywhere: `node tools/release.js [--dry-run|--check]`.
//
//   --dry-run  everything except the git tag/push and `gh release create` steps
//              (still builds and zips locally, still prints the changelog).
//   --check    run the changelog-parser self-check against known past HISTORY.md
//              entries and exit. Touches no git, no network, no build.
//
// Meant to be run on the user's own Windows machine: needs node, git, npm,
// Windows' built-in tar.exe (zip via `-a`), and the GitHub CLI (`gh`) signed in.
// `tools/` is bump-exempt per CLAUDE.md §8 — this script never edits versions,
// it only reads them and refuses to proceed if the two sources disagree.
"use strict";

const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawnSync } = require("child_process");

const ROOT = path.join(__dirname, "..");
const DATA_JS = path.join(ROOT, "src", "data.js");
const ELECTRON_PKG = path.join(ROOT, "electron-app", "package.json");
const HISTORY_MD = path.join(ROOT, "HISTORY.md");
const DIST_DIR = path.join(ROOT, "electron-app", "dist");
const BUILD_FOLDER = "VKDex-win32-x64";

const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");
const CHECK_ONLY = args.includes("--check");

function fail(msg, extra) {
  console.error("\nERROR: " + msg);
  if (extra) console.error(String(extra).trim());
  process.exit(1);
}

function step(msg) {
  console.log("\n== " + msg);
}

// Captured run. Returns { code, stdout, stderr }; code is null if the binary
// wasn't found at all (ENOENT) — callers report that distinctly.
function run(cmd, cmdArgs, opts) {
  const r = spawnSync(cmd, cmdArgs, Object.assign({ encoding: "utf8" }, opts || {}));
  if (r.error && r.error.code === "ENOENT") return { code: null, stdout: "", stderr: cmd + " not found on PATH" };
  if (r.error) return { code: r.status === null ? 1 : r.status, stdout: r.stdout || "", stderr: String(r.error) };
  return { code: r.status, stdout: r.stdout || "", stderr: r.stderr || "" };
}

function mustRun(cmd, cmdArgs, what, opts) {
  const r = run(cmd, cmdArgs, opts);
  if (r.code !== 0) fail(what + " failed (" + cmd + " " + cmdArgs.join(" ") + ")", (r.stdout + "\n" + r.stderr));
  return r;
}

// Live-output run (build): stdio inherited so the user sees real progress.
function runLive(cmd, cmdArgs, opts) {
  const r = spawnSync(cmd, cmdArgs, Object.assign({ stdio: "inherit", shell: process.platform === "win32" }, opts || {}));
  if (r.error && r.error.code === "ENOENT") return null;
  return r.status;
}

// ---------------------------------------------------------------- changelog

// Pull one version's entry out of HISTORY.md. Headings are
// `## <old> → <new> — <title>`; the entry runs to the next `## ` or `---`.
// The first block after the heading is the attribution/process paragraph
// (`coder` only, ... / `overlord` pass, ...) and is dropped — unless it starts
// with `- ` or `**`, which means the entry has no attribution and that block is
// real changelog content.
function extractChangelog(md, version) {
  const v = version.replace(/\./g, "\\.");
  const heading = new RegExp("^## [^\\n]*\u2192\\s*" + v + "\\s*\u2014[^\\n]*$", "m");
  const m = heading.exec(md);
  if (!m) return null;

  const after = md.slice(m.index + m[0].length);
  const end = /^(## |---\s*$)/m.exec(after);
  let body = end ? after.slice(0, end.index) : after;

  const lines = body.replace(/\r\n/g, "\n").split("\n");
  let i = 0;
  while (i < lines.length && lines[i].trim() === "") i++;
  const first = lines[i] || "";
  if (!/^(- |\*\*)/.test(first)) {
    while (i < lines.length && lines[i].trim() !== "") i++;
  }
  return lines.slice(i).join("\n").trim();
}

function selfCheck() {
  const md = fs.readFileSync(HISTORY_MD, "utf8");
  const cases = [
    { version: "0.1.40", expect: "One shared arrow, not one per branch" },
    { version: "0.1.39", expect: "New evolution trigger" },
    { version: "0.1.38", expect: "Facts-card order reverted" }
  ];
  let failed = 0;
  for (const c of cases) {
    const out = extractChangelog(md, c.version);
    const problems = [];
    if (out === null) {
      problems.push("no entry found");
    } else {
      if (/user-spec'd/.test(out)) problems.push("attribution paragraph not stripped (contains \"user-spec'd\")");
      if (/^`[a-z]+`/.test(out)) problems.push("output starts with a backtick agent name: " + out.split("\n")[0]);
      if (!out.includes(c.expect)) problems.push("missing expected content: " + JSON.stringify(c.expect));
      if (!out.startsWith("- ") && !out.startsWith("**")) problems.push("output does not start with changelog content: " + out.split("\n")[0]);
    }
    if (problems.length) {
      failed++;
      console.log("FAIL  " + c.version + " — " + problems.join("; "));
    } else {
      console.log("PASS  " + c.version + " — " + out.split("\n")[0].slice(0, 70));
    }
  }
  console.log("\n" + (cases.length - failed) + "/" + cases.length + " passed");
  process.exit(failed ? 1 : 0);
}

if (CHECK_ONLY) selfCheck();

// ------------------------------------------------------------------ version

step("Version");
const dataSrc = fs.readFileSync(DATA_JS, "utf8");
const vm = /APP_VERSION\s*=\s*["']([^"']+)["']/.exec(dataSrc);
if (!vm) fail("could not find APP_VERSION in " + DATA_JS);
const VERSION = vm[1];

const pkgSrc = fs.readFileSync(ELECTRON_PKG, "utf8");
const pm = /"version"\s*:\s*"([^"]+)"/.exec(pkgSrc);
if (!pm) fail("could not find \"version\" in " + ELECTRON_PKG);

if (pm[1] !== VERSION) {
  fail(
    "version mismatch — src/data.js APP_VERSION = " + VERSION +
    ", electron-app/package.json version = " + pm[1] +
    "\nCLAUDE.md §8 requires these to match. Fix them by hand, then re-run."
  );
}
const TAG = "v" + VERSION;
console.log("APP_VERSION = " + VERSION + " (matches electron-app/package.json); tag will be " + TAG);

// --------------------------------------------------------------- git checks

step("Working tree");
const status = mustRun("git", ["status", "--porcelain"], "git status", { cwd: ROOT });
const dirty = status.stdout.split("\n").filter(l => l.trim() !== "");
const tracked = dirty.filter(l => !l.startsWith("??"));
const untracked = dirty.filter(l => l.startsWith("??"));
if (tracked.length) {
  fail(
    "working tree has uncommitted changes to tracked files:\n" + tracked.join("\n") +
    "\nCommit or stash them yourself first — this script does not commit on your behalf."
  );
}
if (untracked.length) {
  console.log("WARNING: untracked files present (not blocking, not released):");
  untracked.forEach(l => console.log("  " + l));
} else {
  console.log("clean");
}

const branch = mustRun("git", ["rev-parse", "--abbrev-ref", "HEAD"], "git rev-parse", { cwd: ROOT }).stdout.trim();
console.log("branch: " + branch);

step("Tag availability (" + TAG + ")");
const localTag = mustRun("git", ["tag", "-l", TAG], "git tag -l", { cwd: ROOT });
if (localTag.stdout.trim() !== "") {
  fail("tag " + TAG + " already exists locally. Bump the version or delete the tag yourself — this script never force-overwrites.");
}
const remoteTag = run("git", ["ls-remote", "--tags", "origin", TAG], { cwd: ROOT });
if (remoteTag.code !== 0) {
  fail("could not reach origin to check for an existing " + TAG + " tag", remoteTag.stdout + "\n" + remoteTag.stderr);
}
if (remoteTag.stdout.trim() !== "") {
  fail("tag " + TAG + " already exists on origin:\n" + remoteTag.stdout.trim());
}
console.log("free locally and on origin");

// --------------------------------------------------------------- changelog

step("Changelog (HISTORY.md, " + VERSION + ")");
const changelog = extractChangelog(fs.readFileSync(HISTORY_MD, "utf8"), VERSION);
if (changelog === null) {
  fail("no HISTORY.md entry for version " + VERSION + " — expected a heading like \"## <old> \u2192 " + VERSION + " \u2014 <title>\". Write the entry first.");
}
if (changelog === "") {
  fail("HISTORY.md entry for " + VERSION + " is empty after stripping its attribution paragraph.");
}
console.log("-".repeat(60));
console.log(changelog);
console.log("-".repeat(60));

// ------------------------------------------------------------------- build

step("Build (npm run package:win)");
const buildCode = runLive("npm", ["run", "package:win"], { cwd: path.join(ROOT, "electron-app") });
if (buildCode === null) fail("npm not found on PATH — install Node.js/npm and re-run.");
if (buildCode !== 0) fail("`npm run package:win` exited with code " + buildCode + " — build output is above.");

const buildDir = path.join(DIST_DIR, BUILD_FOLDER);
if (!fs.existsSync(buildDir)) fail("build reported success but " + buildDir + " does not exist.");

step("Zip");
const zipName = "VKDex-" + TAG + "-win32-x64.zip";
const zipPath = path.join(DIST_DIR, zipName);
const tarRes = run("tar", ["-a", "-cf", zipPath, "-C", DIST_DIR, BUILD_FOLDER]);
if (tarRes.code === null) fail("tar not found on PATH — Windows 10 1803+/11 ships tar.exe; add it to PATH or zip " + buildDir + " by hand.");
if (tarRes.code !== 0) fail("tar failed while creating " + zipPath, tarRes.stdout + "\n" + tarRes.stderr);
if (!fs.existsSync(zipPath)) fail("tar reported success but " + zipPath + " does not exist.");
console.log(zipPath + " (" + (fs.statSync(zipPath).size / 1048576).toFixed(1) + " MB)");

// ----------------------------------------------------------------- publish

if (DRY_RUN) {
  step("Dry run — stopping before publish");
  console.log("Would have run:");
  console.log("  git tag -a " + TAG + " -m \"" + TAG + "\"");
  console.log("  git push origin " + branch);
  console.log("  git push origin " + TAG);
  console.log("  gh release create " + TAG + " " + zipPath + " --title \"" + TAG + "\" --notes-file <changelog>");
  console.log("\nBuilt and zipped: " + zipPath);
  process.exit(0);
}

step("gh CLI");
const ghVersion = run("gh", ["--version"]);
if (ghVersion.code !== 0) {
  fail("GitHub CLI (`gh`) is not available — install it from https://cli.github.com/ and run `gh auth login`, then re-run.", ghVersion.stderr);
}
const ghAuth = run("gh", ["auth", "status"]);
if (ghAuth.code !== 0) {
  fail("`gh auth status` failed — run `gh auth login`, then re-run.", ghAuth.stdout + "\n" + ghAuth.stderr);
}
console.log(ghVersion.stdout.trim().split("\n")[0] + " — authenticated");

step("Tag and push");
mustRun("git", ["tag", "-a", TAG, "-m", TAG], "git tag", { cwd: ROOT });
mustRun("git", ["push", "origin", branch], "git push origin " + branch, { cwd: ROOT });
mustRun("git", ["push", "origin", TAG], "git push origin " + TAG, { cwd: ROOT });
console.log("pushed " + branch + " and " + TAG);

step("GitHub release");
const notesPath = path.join(os.tmpdir(), "vkdex-release-" + VERSION + "-" + process.pid + ".md");
fs.writeFileSync(notesPath, changelog + "\n", "utf8");
let release;
try {
  release = run("gh", ["release", "create", TAG, zipPath, "--title", TAG, "--notes-file", notesPath], { cwd: ROOT });
} finally {
  try { fs.unlinkSync(notesPath); } catch (e) { /* leftover temp notes file is harmless */ }
}
if (release.code === null) fail("gh disappeared from PATH between the auth check and the release call.");
if (release.code !== 0) fail("`gh release create` failed — the tag is already pushed, so re-running after fixing this will not need a re-tag.", release.stdout + "\n" + release.stderr);
console.log(release.stdout.trim() || "(gh printed no URL)");
console.log("\nDone — " + TAG + " released with " + zipName + ".");
