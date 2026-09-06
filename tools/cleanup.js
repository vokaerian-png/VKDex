// Deletes every path listed in temp/SCRAP.md, then prunes this run's entries
// out of SCRAP.md itself. Replaces the old temp/clean_temp.sh (retired
// 2026-09-06) — same parsing, same protected list, same flags, plus the
// self-pruning that used to be architect's manual chore.
// Run from anywhere: `node tools/cleanup.js [--dry-run] [--yes|-y] [--check]`.
//
//   --dry-run   print the plan, delete nothing, don't rewrite SCRAP.md.
//   --yes / -y  skip the y/N prompt (non-interactive use).
//   --check     run the block-parser self-test and exit. Touches nothing.
//
// A SCRAP.md "entry" is a whole block: the `- `name`` bullet line plus every
// following line until the next bullet / heading / `---` rule. Entries wrap
// into multi-line explanation prose, so a removal takes the whole block —
// otherwise SCRAP.md accumulates orphaned prose forever.
// `tools/` is bump-exempt per CLAUDE.md §3 — this script never touches src/.
"use strict";

const fs = require("fs");
const path = require("path");

const TEMP_DIR = path.join(__dirname, "..", "temp");
const SCRAP_MD = path.join(TEMP_DIR, "SCRAP.md");
const PROTECTED = ["SCRAP.md", "HANDOFF.md", "handoff", "PokeAPI-master", "PokeDB-CSV"];

const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");
const ASSUME_YES = args.includes("--yes") || args.includes("-y");
const CHECK_ONLY = args.includes("--check");
const unknown = args.filter(a => !["--dry-run", "--yes", "-y", "--check"].includes(a));

function fail(msg) {
  console.error("\nERROR: " + msg);
  process.exit(1);
}

// ------------------------------------------------------- parsing

// Splits SCRAP.md into entry blocks. Each block = the bullet line + its
// wrapped prose, up to the next bullet / `#` heading / `---` rule / EOF.
// Trailing blank lines stay outside the block so removing it doesn't eat the
// spacing before whatever follows.
// Targets are the backticked names BEFORE the block's first em dash — every
// entry is shaped ``- `a`, `b` — explanation...``, and a target list can wrap
// onto the next line (the alola/galar/paldea entry does). Everything after the
// em dash is prose, which cites plenty of backticked names that must never be
// deleted (`check.js`, `HISTORY.md`, `src/data/altforms.js`, ...).
// A bare later name inherits the first name's folder (`write.js` / `two.json`).
// ponytail: em-dash cut + folder inheritance are naive heuristics matching
// SCRAP.md's actual, consistent convention — if the format ever grows other
// shapes, one plain target per bullet is the fix, not more parsing.
function parseBlocks(text) {
  const lines = text.split("\n");
  const blocks = [];
  for (let i = 0; i < lines.length; i++) {
    if (!/^- `/.test(lines[i])) continue;
    let end = i + 1;
    while (end < lines.length && !/^(- |#|---)/.test(lines[end])) end++;
    while (end > i + 1 && lines[end - 1].trim() === "") end--;
    blocks.push({ start: i, end, names: namesFrom(lines.slice(i, end).join("\n"), lines[i]) });
    i = end - 1;
  }
  return { lines, blocks };
}

function namesFrom(block, bulletLine) {
  const head = block.includes("—") ? block.slice(0, block.indexOf("—")) : bulletLine;
  const raw = (head.match(/`[^`]+`/g) || []).map(s => s.slice(1, -1).trim());
  const parent = path.posix.dirname((raw.find(n => n.includes("/")) || "").replace(/\/+$/, ""));
  return raw.map(n => (n.includes("/") || parent === "." ? n : parent + "/" + n));
}

// ------------------------------------------------------- sizes

function sizeOf(p) {
  const st = fs.statSync(p);
  if (!st.isDirectory()) return st.size;
  return fs.readdirSync(p).reduce((sum, e) => sum + sizeOf(path.join(p, e)), 0);
}

function human(bytes) {
  if (bytes >= 1048576) return (bytes / 1048576).toFixed(1) + "M";
  if (bytes >= 1024) return (bytes / 1024).toFixed(0) + "K";
  return bytes + "B";
}

// ------------------------------------------------------- self-test

function selfCheck() {
  const assert = require("assert");
  const fixture = [
    "# Heading",
    "",
    "- `alpha/`, `beta/`,",
    "  `delta/` — target list wrapped onto line two;",
    "  prose mentioning `not-a-target.js`.",
    "",
    "- `gamma/one.js` / `two.json` — bare second name",
    "  inherits gamma/.",
    "- `plain.txt`",
    "",
    "## Next section",
    "prose"
  ].join("\n");
  const { blocks } = parseBlocks(fixture);
  assert.strictEqual(blocks.length, 3, "three bullets -> three blocks");
  assert.deepStrictEqual(blocks[0], { start: 2, end: 5, names: ["alpha/", "beta/", "delta/"] });
  assert.deepStrictEqual(blocks[1].names, ["gamma/one.js", "gamma/two.json"]);
  assert.deepStrictEqual(blocks[2], { start: 8, end: 9, names: ["plain.txt"] });
  console.log("Self-test OK — block boundaries, wrapped target lists, prose exclusion, folder inheritance.");
}

// ------------------------------------------------------- main

async function main() {
  if (unknown.length) fail("unknown option: " + unknown.join(" ") + " — use --dry-run, --yes/-y or --check.");
  if (CHECK_ONLY) return selfCheck();
  if (!fs.existsSync(SCRAP_MD)) fail("SCRAP.md not found at " + SCRAP_MD + " — nothing to do.");

  const text = fs.readFileSync(SCRAP_MD, "utf8");
  const { lines, blocks } = parseBlocks(text);
  if (!blocks.length) {
    console.log("No targets listed in SCRAP.md — nothing to do.");
    return;
  }

  // Classify every name. status: present | gone | protected | unsafe.
  const present = [], gone = [], skipped = [];
  for (const b of blocks) {
    b.entries = b.names.map(name => {
      const bare = name.replace(/\/+$/, "");
      const e = { name, block: b };
      if (path.posix.isAbsolute(bare) || /^[A-Za-z]:/.test(bare) || bare.split("/").includes("..")) {
        e.status = "unsafe"; skipped.push(e);
      } else if (PROTECTED.includes(bare)) {
        e.status = "protected"; skipped.push(e);
      } else if (!fs.existsSync(path.join(TEMP_DIR, bare))) {
        e.status = "gone"; gone.push(e);
      } else {
        e.status = "present"; e.size = sizeOf(path.join(TEMP_DIR, bare)); present.push(e);
      }
      return e;
    });
  }

  console.log("Targets found in SCRAP.md (relative to temp/):");
  for (const e of present) console.log("  " + e.name + " (" + human(e.size) + ")");
  for (const e of gone) console.log("  ALREADY GONE (entry will be pruned): " + e.name);
  for (const e of skipped) console.log("  SKIP (" + e.status + ", ignored): " + e.name);

  let deleted = 0, failed = 0;
  if (!present.length) {
    console.log("\nNothing eligible to delete.");
  } else if (DRY_RUN) {
    console.log("\nDry run — nothing deleted, SCRAP.md untouched.");
  } else {
    let ok = ASSUME_YES;
    if (!ok) {
      const rl = require("readline").createInterface({ input: process.stdin, output: process.stdout });
      const it = rl[Symbol.asyncIterator]();
      process.stdout.write("\nDelete all " + present.length + " item(s) above? [y/N] ");
      const { value, done } = await it.next();
      rl.close();
      ok = !done && /^y(es)?$/i.test(String(value).trim());
    }
    if (!ok) {
      console.log("Aborted, nothing deleted.");
    } else {
      for (const e of present) {
        try {
          fs.rmSync(path.join(TEMP_DIR, e.name.replace(/\/+$/, "")), { recursive: true, force: true });
          e.status = "deleted"; deleted++;
          console.log("DELETED: " + e.name);
        } catch (err) {
          failed++;
          console.log("FAILED (still in use? re-run to retry): " + e.name + " — " + err.message);
        }
      }
    }
  }

  // Prune only blocks whose every name is settled: deleted this run, or
  // already gone. A block with a protected/unsafe name, a failed delete, or a
  // declined delete stays put so the next run still sees it.
  const doomed = blocks.filter(b => b.entries.every(e => e.status === "deleted" || e.status === "gone"));
  if (!doomed.length) {
    console.log("\nSCRAP.md: no entries to prune.");
  } else if (DRY_RUN) {
    console.log("\nWould prune " + doomed.length + " entr(ies) from SCRAP.md:");
    for (const b of doomed) console.log("  " + lines[b.start]);
  } else {
    const drop = new Set();
    for (const b of doomed) for (let i = b.start; i < b.end; i++) drop.add(i);
    fs.writeFileSync(SCRAP_MD, lines.filter((_, i) => !drop.has(i)).join("\n"), "utf8");
    console.log("\nSCRAP.md: pruned " + doomed.length + " entr(ies).");
  }

  const prunedGone = doomed.reduce((n, b) => n + b.entries.filter(e => e.status === "gone").length, 0);
  console.log("\nDone. " + deleted + " deleted, " + failed + " failed, " +
    prunedGone + " already-gone entr(ies) pruned, " + skipped.length + " protected/unsafe skipped.");
}

main().catch(err => fail(err && err.stack ? err.stack : String(err)));
