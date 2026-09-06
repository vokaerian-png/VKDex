// App version, major.minor.regular (e.g. 0.1.0). Bump the last number by
// one for every change going forward, up to 999. Shown in Settings.
var APP_VERSION = "0.2.20";

// REGIONS lists every mainline region so the region bar always shows a
// button for each one, even before that region's Pokémon have been added
// (regions with no matching entries in POKEMON_DATA show a "coming soon"
// message in the list instead of an empty screen).
//
// POKEMON_DATA itself, plus the richer per-Pokémon data (abilities, moves,
// movesets, evolutions, locations, translated names, stats), lives in the
// data/ folder next to this file — see data/pokemon.js and its siblings.
//
// Hisui and Orre (`standalone: true`) are not mainline regions — they're
// separate, non-national-dex screens (Legends: Arceus's own dex; the
// combined Pokémon Colosseum/XD roster). app.js's renderDexList() branches
// on their id to filter/sort by data/hisui.js's HISUI_DEX_NUMBERS or
// data/orre.js's ORRE_MEMBERS instead of the usual `p.region === filter`
// check every mainline chip uses. Tinted purple (styles.css
// `.region-chip.standalone`) to visually set them apart in the region bar.

var REGIONS = [
  { id: "kanto", label: "Kanto" },
  { id: "johto", label: "Johto" },
  { id: "hoenn", label: "Hoenn" },
  { id: "sinnoh", label: "Sinnoh" },
  { id: "unova", label: "Unova" },
  { id: "kalos", label: "Kalos" },
  { id: "alola", label: "Alola" },
  { id: "galar", label: "Galar" },
  { id: "paldea", label: "Paldea" },
  { id: "hisui", label: "Hisui", standalone: true },
  { id: "orre", label: "Orre", standalone: true }
];
