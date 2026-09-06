// tools/csv_merge/inventory.js — inventory every CSV in both sources.
// Writes tools/csv_merge/reports/inventory.json and prints a summary.
//   node tools/csv_merge/inventory.js
"use strict";
const fs = require("fs");
const path = require("path");
const { parseFile } = require("./csv_util");

const ROOT = path.resolve(__dirname, "..", "..");
const SOURCES = {
  pokeapi: path.join(ROOT, "temp", "PokeAPI-master", "data", "v2", "csv"),
  pokedb: path.join(ROOT, "temp", "PokeDB-CSV"),
};
const REPORTS = path.join(__dirname, "reports");

function inventory(dir) {
  const out = {};
  for (const f of fs.readdirSync(dir).filter(f => f.endsWith(".csv")).sort()) {
    const file = path.join(dir, f);
    const { header, rows, bad } = parseFile(file);
    out[f] = { bytes: fs.statSync(file).size, rows: rows.length, columns: header, badRows: bad.length };
  }
  return out;
}

if (require.main === module) {
  fs.mkdirSync(REPORTS, { recursive: true });
  const result = {};
  for (const [name, dir] of Object.entries(SOURCES)) {
    if (!fs.existsSync(dir)) throw new Error(`missing source: ${dir}`);
    result[name] = inventory(dir);
    const files = Object.entries(result[name]);
    const rows = files.reduce((n, [, v]) => n + v.rows, 0);
    const bytes = files.reduce((n, [, v]) => n + v.bytes, 0);
    const bad = files.filter(([, v]) => v.badRows).map(([f, v]) => `${f}:${v.badRows}`);
    console.log(`${name}: ${files.length} files, ${rows} rows, ${(bytes / 1e6).toFixed(1)} MB` +
      (bad.length ? `, malformed rows in ${bad.join(" ")}` : ""));
    for (const [f, v] of files) console.log(`  ${f.padEnd(44)} ${String(v.rows).padStart(7)} rows  ${v.columns.length} cols`);
  }
  fs.writeFileSync(path.join(REPORTS, "inventory.json"), JSON.stringify(result, null, 1));
  console.log(`wrote ${path.join(REPORTS, "inventory.json")}`);
}

module.exports = { SOURCES, REPORTS, inventory };
