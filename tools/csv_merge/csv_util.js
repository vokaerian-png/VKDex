// tools/csv_merge/csv_util.js — minimal RFC 4180 CSV parse/stringify, no deps.
// Handles quoted fields with embedded commas, newlines (\n and \r\n), and
// doubled double-quotes. Same algorithm as populate_region.js's inline
// parseCSV, lifted out so the merge tooling can share it.
//
//   node tools/csv_merge/csv_util.js   -> runs the self-test
"use strict";
const fs = require("fs");

// text -> array of arrays (raw rows, header included). A trailing newline
// does not produce an empty final row.
function parse(text) {
  const rows = [];
  let row = [], field = "", inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else inQuotes = false;
      } else field += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ",") { row.push(field); field = ""; }
    else if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; }
    else if (c === "\r") { /* CRLF: swallow, \n ends the row */ }
    else field += c;
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  return rows;
}

// path -> { header: string[], rows: object[] } keyed by header. Rows whose
// field count doesn't match the header are reported in `bad`, not dropped
// silently. A UTF-8 BOM on the header is stripped.
function parseFile(file) {
  const raw = parse(fs.readFileSync(file, "utf8").replace(/^﻿/, ""));
  const header = raw[0] || [];
  const rows = [], bad = [];
  for (let i = 1; i < raw.length; i++) {
    const r = raw[i];
    if (r.length !== header.length) { bad.push({ line: i + 1, fields: r.length }); continue; }
    const o = {};
    for (let j = 0; j < header.length; j++) o[header[j]] = r[j];
    rows.push(o);
  }
  return { header, rows, bad };
}

function quote(v) {
  const s = v == null ? "" : String(v);
  return /[",\r\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
}

// rows: array of arrays, or array of objects + explicit header.
function stringify(rows, header) {
  const out = [];
  if (header) {
    out.push(header.map(quote).join(","));
    for (const r of rows) out.push(header.map(h => quote(r[h])).join(","));
  } else {
    for (const r of rows) out.push(r.map(quote).join(","));
  }
  return out.join("\n") + "\n";
}

function selfTest() {
  const assert = require("assert");
  const tricky = [
    ["id", "name", "note"],
    ["1", "farfetchd", "a,b"],
    ["2", 'say "hi"', "line1\nline2"],
    ["3", "", "trailing"],
    ["4", "scarlet,violet", 'both "quoted", with\r\ncrlf'],
  ];
  const text = stringify(tricky);
  const back = parse(text);
  assert.deepStrictEqual(back, tricky, "round-trip failed");
  // CRLF row terminators + trailing newline + empty-quoted field
  assert.deepStrictEqual(parse('a,b\r\n"",2\r\n'), [["a", "b"], ["", "2"]]);
  // header-keyed objects
  assert.deepStrictEqual(
    stringify([{ a: "x", b: "1,2" }], ["a", "b"]), 'a,b\nx,"1,2"\n');
  console.log("csv_util self-test OK");
}

module.exports = { parse, parseFile, stringify, quote };
if (require.main === module) selfTest();
