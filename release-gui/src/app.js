"use strict";
// Frontend for the release GUI. Assembles release.js's own flags, streams its
// output, and answers its one prompt. No release logic lives here.
//
// Uses the __TAURI__ globals (withGlobalTauri in tauri.conf.json) rather than
// npm imports, same as the main VKDex app — keeps this a plain <script> page
// with no bundler.
const { invoke } = window.__TAURI__.core;
const { listen } = window.__TAURI__.event;

// The 5 choices release.js's interactive menu offers, each already resolved to
// the (target, frontend) pair parseMenuChoice() maps it to — so the GUI passes
// --target=/--frontend= explicitly and that menu never prompts. Android ignores
// --frontend entirely (it always ships src/), so choice 1 sends none, which
// also avoids release.js's "--frontend= is Windows-only" NOTE.
const TARGETS = [
  { label: "Mobile (Android)", target: "android", frontend: "" },
  { label: "Windows - Mobile", target: "windows", frontend: "mobile" },
  { label: "Windows - Desktop", target: "windows", frontend: "desktop" },
  { label: "Windows - Both", target: "windows", frontend: "both" },
  { label: "Everything", target: "both", frontend: "both" }
];

// release.js writes this immediately before it blocks on stdin, and nowhere
// else — see its ask("\nProceed with build...") call. It has no trailing
// newline, which is why the Rust side streams raw chunks rather than lines.
const PROMPT = "Proceed with build";

const $ = id => document.getElementById(id);
const targetEl = $("target"), extraEl = $("extra"), dryEl = $("dry");
const runEl = $("run"), cmdEl = $("cmd"), logEl = $("log");
const confirmEl = $("confirm"), statusEl = $("status");

let running = false;
let prompted = false;

TARGETS.forEach((t, i) => targetEl.add(new Option(t.label, String(i))));

function buildArgs() {
  const t = TARGETS[Number(targetEl.value)];
  const extra = extraEl.value.trim();
  const args = ["--target=" + t.target];
  if (t.frontend) args.push("--frontend=" + t.frontend);
  if (dryEl.checked) args.push("--dry-run");
  if (extra) args.push("--extra-args=" + extra);
  return args;
}

function refreshCmd() {
  cmdEl.textContent = "node tools/release.js " + buildArgs().join(" ");
}
[targetEl, extraEl, dryEl].forEach(el => el.addEventListener("input", refreshCmd));
refreshCmd();

function append(text, cls) {
  const node = document.createElement("span");
  if (cls) node.className = cls;
  node.textContent = text;
  logEl.appendChild(node);
  logEl.scrollTop = logEl.scrollHeight;
}

function setStatus(text, cls) {
  statusEl.textContent = text;
  statusEl.className = "bar " + (cls || "");
  statusEl.hidden = false;
}

function setRunning(on) {
  running = on;
  runEl.disabled = on;
  [targetEl, extraEl, dryEl].forEach(el => { el.disabled = on; });
}

runEl.addEventListener("click", async () => {
  if (running) return;
  const args = buildArgs();
  logEl.textContent = "";
  confirmEl.hidden = true;
  statusEl.hidden = true;
  prompted = false;
  setRunning(true);
  append("$ node tools/release.js " + args.join(" ") + "\n\n");
  try {
    await invoke("start", { args });
  } catch (e) {
    append("\n" + e + "\n", "err");
    setStatus(String(e), "bad");
    setRunning(false);
  }
});

async function reply(text) {
  confirmEl.hidden = true;
  append(text === "y\n" ? "y\n" : "n\n");
  try {
    await invoke("answer", { text });
  } catch (e) {
    append("\n" + e + "\n", "err");
  }
}
$("yes").addEventListener("click", () => reply("y\n"));
$("no").addEventListener("click", () => reply("n\n"));

listen("release-log", e => {
  append(e.payload);
  // The prompt is asked exactly once per run (release.js asks it on every run,
  // dry-run included), so one flag is enough — no need to re-scan.
  if (!prompted && logEl.textContent.includes(PROMPT)) {
    prompted = true;
    confirmEl.hidden = false;
  }
});

listen("release-err", e => append(e.payload, "err"));

listen("release-done", e => {
  confirmEl.hidden = true;
  setRunning(false);
  const code = e.payload;
  setStatus(code === 0 ? "Finished — exit code 0." : "Failed — exit code " + code + ".", code === 0 ? "ok" : "bad");
  append("\n[exit " + code + "]\n");
});
