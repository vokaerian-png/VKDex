// Local build-and-publish script: version-check -> clean-tree check -> tag check
// -> changelog extraction -> pick target(s) -> confirm -> Tauri build(s) ->
// git tag/push -> one GitHub release carrying every built artifact.
// Run from anywhere: `node tools/release.js [--target=android|windows|both] [--dry-run|--check]`.
//
//   --target=X  skip the interactive target menu (android | windows | both).
//   --dry-run   everything except the git tag/push and `gh release create` steps
//               (still builds locally, still prints the changelog). The
//               "Proceed?" confirmation is asked on every run, dry-run included.
//   --check     run the self-checks (changelog parser against known HISTORY.md
//               entries, target parsing, APK search) and exit. No git, no
//               network, no build.
//
// Meant to be run on the user's own Windows machine: needs node, git, npm,
// Windows' built-in tar.exe (zip via `-a`), the Tauri CLI (root package.json
// devDependency), and the GitHub CLI (`gh`) signed in. Android additionally
// needs the one-time setup in src-tauri/ANDROID_SETUP.md.
// `tools/` is bump-exempt per CLAUDE.md §3 — this script never edits versions,
// it only reads them and refuses to proceed if the mirrors disagree.
"use strict";

const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawnSync } = require("child_process");

const ROOT = path.join(__dirname, "..");
const DATA_JS = path.join(ROOT, "src", "data.js");
const TAURI_CONF = path.join(ROOT, "src-tauri", "tauri.conf.json");
const CARGO_TOML = path.join(ROOT, "src-tauri", "Cargo.toml");
const HISTORY_MD = path.join(ROOT, "HISTORY.md");
const RELEASES_DIR = path.join(ROOT, "releases");
const WIN_RELEASE_DIR = path.join(ROOT, "src-tauri", "target", "release");
const ANDROID_APP_DIR = path.join(ROOT, "src-tauri", "gen", "android", "app");
const ANDROID_APK_OUT = path.join(ANDROID_APP_DIR, "build", "outputs", "apk");

const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");
const CHECK_ONLY = args.includes("--check");
const TARGET_ARG = (args.find(a => a.startsWith("--target=")) || "").slice("--target=".length);

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

// ------------------------------------------------------------ pure helpers

// Menu number or name -> canonical target, null if unrecognized.
function parseTarget(s) {
  const t = String(s || "").trim().toLowerCase();
  return { "1": "android", "2": "windows", "3": "both", android: "android", windows: "windows", both: "both" }[t] || null;
}

// Every file under dir, recursively; [] if dir doesn't exist.
function walkFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) out.push(...walkFiles(p)); else out.push(p);
  }
  return out;
}

// Gradle may emit one universal APK and/or one per ABI; take universal when
// it's there, else whatever came first. null if no .apk at all.
function pickApk(files) {
  const apks = files.filter(f => f.toLowerCase().endsWith(".apk"));
  return apks.find(f => /universal/i.test(f)) || apks[0] || null;
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
  let failed = 0;
  const report = (ok, label, detail) => {
    if (!ok) failed++;
    console.log((ok ? "PASS  " : "FAIL  ") + label + (detail ? " — " + detail : ""));
  };

  // 1. changelog parser against known past entries
  const md = fs.readFileSync(HISTORY_MD, "utf8");
  const cases = [
    { version: "0.1.40", expect: "One shared arrow, not one per branch" },
    { version: "0.1.39", expect: "New evolution trigger" },
    { version: "0.1.38", expect: "Facts-card order reverted" }
  ];
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
    report(!problems.length, "changelog " + c.version, problems.length ? problems.join("; ") : out.split("\n")[0].slice(0, 70));
  }

  // 2. target parsing
  const targets = [["1", "android"], ["2", "windows"], ["3", "both"], [" Android ", "android"], ["WINDOWS", "windows"],
    ["both", "both"], ["ios", null], ["", null], ["4", null], [undefined, null]];
  for (const [input, want] of targets) {
    const got = parseTarget(input);
    report(got === want, "parseTarget(" + JSON.stringify(input) + ")", got === want ? String(got) : "got " + got + ", want " + want);
  }

  // 3. APK search over a throwaway tree shaped like Gradle's output
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "vkdex-release-check-"));
  try {
    fs.mkdirSync(path.join(tmp, "arm64-v8a", "debug"), { recursive: true });
    fs.mkdirSync(path.join(tmp, "universal", "debug"), { recursive: true });
    fs.writeFileSync(path.join(tmp, "arm64-v8a", "debug", "app-arm64-v8a-debug.apk"), "");
    fs.writeFileSync(path.join(tmp, "arm64-v8a", "debug", "output-metadata.json"), "{}");
    fs.writeFileSync(path.join(tmp, "universal", "debug", "app-universal-debug.apk"), "");
    const files = walkFiles(tmp);
    report(files.length === 3, "walkFiles finds 3 files", "got " + files.length);
    const picked = pickApk(files);
    report(!!picked && picked.endsWith("app-universal-debug.apk"), "pickApk prefers universal", String(picked));
    report(pickApk(files.filter(f => !/universal/.test(f))).endsWith("app-arm64-v8a-debug.apk"), "pickApk falls back to first .apk");
    report(pickApk(["x/output-metadata.json"]) === null, "pickApk null without .apk");
    report(walkFiles(path.join(tmp, "nope")).length === 0, "walkFiles [] on missing dir");
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }

  console.log("\n" + (failed ? failed + " check(s) failed" : "all checks passed"));
  process.exit(failed ? 1 : 0);
}

if (CHECK_ONLY) selfCheck();

// ------------------------------------------------------------------ version

step("Version");
const dataSrc = fs.readFileSync(DATA_JS, "utf8");
const vm = /APP_VERSION\s*=\s*["']([^"']+)["']/.exec(dataSrc);
if (!vm) fail("could not find APP_VERSION in " + DATA_JS);
const VERSION = vm[1];

const mirrors = [
  { file: TAURI_CONF, label: "src-tauri/tauri.conf.json", re: /"version"\s*:\s*"([^"]+)"/ },
  { file: CARGO_TOML, label: "src-tauri/Cargo.toml", re: /^version\s*=\s*"([^"]+)"/m }
];
for (const m of mirrors) {
  const hit = m.re.exec(fs.readFileSync(m.file, "utf8"));
  if (!hit) fail("could not find a version field in " + m.label);
  if (hit[1] !== VERSION) {
    fail(
      "version mismatch — src/data.js APP_VERSION = " + VERSION + ", " + m.label + " = " + hit[1] +
      "\nCLAUDE.md §3 requires these to match. Fix them by hand, then re-run."
    );
  }
}
const TAG = "v" + VERSION;
console.log("APP_VERSION = " + VERSION + " (tauri.conf.json and Cargo.toml agree); tag will be " + TAG);

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

// ------------------------------------------------------------------ builds

function buildWindows() {
  step("Build: Windows (npm run build)");
  const code = runLive("npm", ["run", "build"], { cwd: ROOT });
  if (code === null) fail("npm not found on PATH — install Node.js/npm and re-run.");
  if (code !== 0) fail("`npm run build` exited with code " + code + " — build output is above.");

  // Tauri names the binary after the Cargo package (vkdex.exe) or productName
  // (VKDex.exe) depending on CLI version; NTFS is case-insensitive, so match
  // by name and keep the real casing for the zip entry.
  const exeName = fs.existsSync(WIN_RELEASE_DIR) && fs.readdirSync(WIN_RELEASE_DIR).find(n => n.toLowerCase() === "vkdex.exe");
  if (!exeName) {
    const exes = fs.existsSync(WIN_RELEASE_DIR) ? fs.readdirSync(WIN_RELEASE_DIR).filter(n => n.endsWith(".exe")) : [];
    fail("build reported success but no vkdex.exe in " + WIN_RELEASE_DIR + (exes.length ? "\n.exe files there: " + exes.join(", ") : "\n(no .exe files there at all)"));
  }

  step("Zip");
  const outDir = path.join(RELEASES_DIR, "windows");
  fs.mkdirSync(outDir, { recursive: true });
  const zipPath = path.join(outDir, "VKDex-" + TAG + "-windows-x64.zip");
  const tarRes = run("tar", ["-a", "-cf", zipPath, "-C", WIN_RELEASE_DIR, exeName]);
  if (tarRes.code === null) fail("tar not found on PATH — Windows 10 1803+/11 ships tar.exe; add it to PATH or zip " + path.join(WIN_RELEASE_DIR, exeName) + " by hand.");
  if (tarRes.code !== 0) fail("tar failed while creating " + zipPath, tarRes.stdout + "\n" + tarRes.stderr);
  if (!fs.existsSync(zipPath)) fail("tar reported success but " + zipPath + " does not exist.");
  console.log(zipPath + " (" + (fs.statSync(zipPath).size / 1048576).toFixed(1) + " MB)");
  return zipPath;
}

function buildAndroid() {
  step("Build: Android (npm run build:android)");
  if (!fs.existsSync(ANDROID_APP_DIR)) {
    fail(
      ANDROID_APP_DIR + " does not exist — Android has never been initialized on this machine." +
      "\nFollow src-tauri/ANDROID_SETUP.md once (SDK/NDK/JDK, env vars, then `npx tauri android init`), then re-run."
    );
  }
  const code = runLive("npm", ["run", "build:android"], { cwd: ROOT });
  if (code === null) fail("npm not found on PATH — install Node.js/npm and re-run.");
  if (code !== 0) fail("`npm run build:android` exited with code " + code + " — build output is above.");

  const files = walkFiles(ANDROID_APK_OUT);
  const apk = pickApk(files);
  if (!apk) {
    fail(
      "build reported success but no .apk was found under " + ANDROID_APK_OUT +
      (files.length ? "\nfound instead:\n  " + files.join("\n  ") : "\n(directory missing or empty)") +
      "\nIf Gradle put the APK somewhere else, note the real path so the script can be pointed at it."
    );
  }

  const outDir = path.join(RELEASES_DIR, "android");
  fs.mkdirSync(outDir, { recursive: true });
  const dest = path.join(outDir, "VKDex-" + TAG + "-android-debug.apk");
  fs.copyFileSync(apk, dest); // copy, not move — Gradle's own output stays put
  console.log(apk + "\n  -> " + dest + " (" + (fs.statSync(dest).size / 1048576).toFixed(1) + " MB)");
  return dest;
}

// ------------------------------------------------------- target + confirm

async function main() {
  // Prompts read from readline's async line iterator rather than rl.question():
  // question() drops any line that arrives before it's registered (piped
  // "3\ny\n" comes in one chunk, the "y" is lost and the script exits silently),
  // the iterator buffers early lines and reports EOF as done.
  const rl = require("readline").createInterface({ input: process.stdin, output: process.stdout });
  const lines = rl[Symbol.asyncIterator]();
  async function ask(q) {
    process.stdout.write(q);
    const { value, done } = await lines.next();
    if (done) fail("stdin closed before the prompt was answered — run interactively (the confirmation is always asked).");
    return value;
  }

  step("Target");
  let target = null;
  if (TARGET_ARG) {
    target = parseTarget(TARGET_ARG);
    if (!target) fail("unrecognized --target=" + TARGET_ARG + " — use android, windows or both.");
    console.log("--target=" + target);
  } else {
    for (let tries = 0; !target && tries < 3; tries++) {
      const a = await ask("Build target:\n  1. Mobile (Android)\n  2. Desktop (Windows)\n  3. Both\n> ");
      target = parseTarget(a);
      if (!target) console.log("Enter 1, 2 or 3 (or android / windows / both).");
    }
    if (!target) fail("no valid target chosen.");
  }
  const wantWindows = target !== "android";
  const wantAndroid = target !== "windows";

  step("Summary");
  console.log("Version:  " + VERSION + "  (tag " + TAG + ", branch " + branch + ")");
  console.log("Targets:  " + (wantWindows ? "Windows -> releases/windows/VKDex-" + TAG + "-windows-x64.zip\n          " : "") +
                             (wantAndroid ? "Android -> releases/android/VKDex-" + TAG + "-android-debug.apk (debug-signed)" : ""));
  console.log("Publish:  " + (DRY_RUN ? "NO (--dry-run: build only, no tag/push/release)" : "git tag + push + one GitHub release with the artifact(s) above"));
  console.log("Notes:    the changelog block printed above");
  const yes = await ask("\nProceed with build" + (DRY_RUN ? "" : " and release") + "? [y/N] ");
  rl.close();
  if (!/^y(es)?$/i.test(yes.trim())) {
    console.log("Aborted — nothing built, no git state touched.");
    process.exit(0);
  }

  // Fail fast on gh before spending minutes in a build that couldn't publish.
  if (!DRY_RUN) {
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
  }

  const artifacts = [];
  if (wantWindows) artifacts.push(buildWindows());
  if (wantAndroid) artifacts.push(buildAndroid());

  // ----------------------------------------------------------------- publish

  if (DRY_RUN) {
    step("Dry run — stopping before publish");
    console.log("Would have run:");
    console.log("  git tag -a " + TAG + " -m \"" + TAG + "\"");
    console.log("  git push origin " + branch);
    console.log("  git push origin " + TAG);
    console.log("  gh release create " + TAG + " " + artifacts.join(" ") + " --title \"" + TAG + "\" --notes-file <changelog>");
    console.log("\nBuilt:\n  " + artifacts.join("\n  "));
    process.exit(0);
  }

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
    release = run("gh", ["release", "create", TAG, ...artifacts, "--title", TAG, "--notes-file", notesPath], { cwd: ROOT });
  } finally {
    try { fs.unlinkSync(notesPath); } catch (e) { /* leftover temp notes file is harmless */ }
  }
  if (release.code === null) fail("gh disappeared from PATH between the auth check and the release call.");
  if (release.code !== 0) fail("`gh release create` failed — the tag is already pushed, so re-running after fixing this will not need a re-tag.", release.stdout + "\n" + release.stderr);
  console.log(release.stdout.trim() || "(gh printed no URL)");
  console.log("\nDone — " + TAG + " released with " + artifacts.map(a => path.basename(a)).join(" + ") + ".");
}

main().catch(e => fail("unexpected error", e && e.stack || e));
