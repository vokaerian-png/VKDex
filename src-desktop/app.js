// VKDex desktop frontend — app logic.
//
// Pass 1 of PLAN.md's "Desktop-dedicated front-end for the Windows build":
// the three-pane shell (collapsible icon-rail sidebar + center grid + right
// detail pane), a fully functional Dex screen over all 1025 real entries, a
// functional Pokemon detail pane with the expand-to-document sweep, and a
// one-row Settings screen. Favorites / Bag / Type Chart / Natures are nav rows
// with a "not built yet" placeholder — deliberate, not missing; the scope gate
// in PLAN.md still requires all 7 before this build is shippable.
//
// Pass 3 (0.4.10) added: full Settings parity with the mobile frontend, the
// merged-cell Evolution grid, Mega/Gmax formes as their own detail screen and
// as search-only grid cards, the sprite-enlarge lightbox + shiny sprite, the
// plaque-shaped region chips, and the topbar's regional-dex-number line.
//
// Reads src/data/*.js verbatim (see index.html) and writes nothing back to it.
// No shared UI code with src/ by design — only the data layer is shared.
"use strict";

(function () {
  // src-desktop/data is a junction to src/data (see index.html's comment) —
  // relative to src-desktop/, because Tauri only embeds frontendDist.
  var DATA_BASE = "data/";
  var SPRITE = DATA_BASE + "sprites/pokemon/";
  var ITEM_SPRITE = DATA_BASE + "sprites/items/";
  var MISSING_SPRITE = SPRITE + "0.png";

  // localStorage keys. The five mirrored settings deliberately reuse the
  // mobile frontend's own key names (content parity, item 1) — only the
  // desktop-only sidebar default has a desktop-specific key.
  var SIDEBAR_KEY = "vkdex-desktop-sidebar-collapsed";
  var UNITS_KEY = "vkdex-units";
  var GRID_COLS_KEY = "vkdex-grid-cols";
  var SHINY_KEY = "vkdex-shiny-grids";
  var PIXEL_KEY = "vkdex-pixel-sprites";

  var STAT_KEYS = [
    ["hp", "HP"], ["attack", "Attack"], ["defense", "Defense"],
    ["spAttack", "Sp. Atk"], ["spDefense", "Sp. Def"], ["speed", "Speed"]
  ];
  var TYPE_NAMES = Object.keys(TYPE_CHART);
  var SCREEN_TITLES = {
    dex: "Dex", favorites: "Favorites", bag: "Bag",
    types: "Type Chart", natures: "Natures", map: "Map", settings: "Settings"
  };
  // Screens that exist as nav rows but have no desktop implementation yet.
  var PLACEHOLDERS = {
    favorites: "The favorites list, sharing the Dex grid and this detail pane.",
    bag: "The 146-item bag, with an item list in this pane and item detail beside it.",
    types: "The full 18x18 type matrix plus a per-type matchup breakdown.",
    natures: "All 25 natures with their stat effects and flavor preferences."
  };
  // Mobile's 3/4/5 column choice has no direct desktop equivalent (the grid is
  // auto-fill, not a fixed column count), so the same three buttons drive the
  // card's minimum width instead — same intent, bigger cards on the left.
  var GRID_COL_MIN = { "3": "190px", "4": "158px", "5": "132px" };

  // ------------------------------------------------------------- helpers

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function pad(n) { return String(n).padStart(3, "0"); }
  function typeRef(t) { return "var(--t-" + String(t).toLowerCase() + ")"; }
  function typeVar(t) { return "--t:" + typeRef(t); }
  function primaryType(p) { return (p.types || ["Normal"])[0]; }
  function byId(id) { return MON_BY_ID[id]; }

  // Every sprite falls back to 0.png (the same missing-sprite placeholder
  // src/app.js uses) rather than rendering a broken-image icon.
  function imgTag(src, cls) {
    return '<img class="' + (cls || "sprite") + '" loading="lazy" alt="" src="' + src + '"' +
      ' onerror="this.onerror=null;this.src=\'' + MISSING_SPRITE + '\';">';
  }
  function spriteUrl(id) { return SPRITE + id + ".png"; }
  function shinyUrl(id) { return SPRITE + "shiny/" + id + ".png"; }
  // Alt-forme sprites are named by forme slug rather than dex id and live in
  // their own subtree — note the literal space in "alt formes", matching the
  // folder on disk (ported from src/app.js's altFormSpriteUrl()). The shiny
  // tree mirrors it under shiny/.
  function altFormeUrl(sprite, shiny) { return SPRITE + (shiny ? "shiny/" : "") + "alt formes/" + sprite + ".png"; }
  // Female-specific art, same 103-file female/ subtree mobile reads. There is
  // no male/ counterpart — the default sprite already is the male art.
  function femaleUrl(id, shiny) { return SPRITE + (shiny ? "shiny/" : "") + "female/" + id + ".png"; }
  function itemUrl(slug) { return ITEM_SPRITE + slug + ".png"; }
  function spriteImg(id, cls) { return imgTag(spriteUrl(id), cls); }
  function altFormeImg(sprite, cls) { return imgTag(altFormeUrl(sprite, false), cls); }
  function typePills(types) {
    if (!types || !types.length) return "";
    return '<div class="types">' + types.map(function (t) {
      return '<span class="pill" style="' + typeVar(t) + '">' + esc(t) + "</span>";
    }).join("") + "</div>";
  }
  function onePill(t) { return '<span class="pill" style="' + typeVar(t) + '">' + esc(t) + "</span>"; }
  // Settings' Measurements row drives both (mobile's metersToFeetInches/kgToLbs).
  function meters(v) {
    if (v == null) return "—";
    if (!useImperialUnits) return v.toFixed(1) + " m";
    var totalInches = v * 39.3700787;
    var feet = Math.floor(totalInches / 12);
    var inches = Math.round(totalInches - feet * 12);
    if (inches === 12) { feet += 1; inches = 0; }
    return feet + "'" + (inches < 10 ? "0" : "") + inches + '"';
  }
  function kilos(v) {
    if (v == null) return "—";
    return useImperialUnits
      ? (Math.round(v * 2.20462 * 10) / 10) + " lbs"
      : v.toFixed(1) + " kg";
  }

  // ------------------------------------------------------------ indexes

  var MON_BY_ID = {};
  POKEMON_DATA.forEach(function (p) { MON_BY_ID[p.id] = p; });

  // REGIONS' own order and labels, indexed — the Found In card sorts its
  // region folds into the region bar's canonical order (mobile's REGION_IDS /
  // regionLabel), not LOCATIONS' insertion order.
  var REGION_IDS = REGIONS.map(function (r) { return r.id; });
  var REGION_LABEL = {};
  REGIONS.forEach(function (r) { REGION_LABEL[r.id] = r.label; });
  function regionLabel(id) { return REGION_LABEL[id] || id; }

  // Every per-forme `evolvesTo` override on a species, flattened and tagged
  // with the forme key it came from (ported from src/app.js's formeEvoEdges)
  // — a downstream stage bubble reads `fromFormeKey` to show the ancestor
  // that actually produces that branch rather than its base form.
  function formeEvoEdges(id) {
    var alt = ALT_FORMS[id];
    if (!alt || !alt.formes) return [];
    return alt.formes.reduce(function (acc, f) {
      if (!f.evolvesTo) return acc;
      return acc.concat(f.evolvesTo.map(function (e) {
        return Object.assign({}, e, { fromFormeKey: f.key });
      }));
    }, []);
  }

  // EVOLUTIONS only points forward (evolvesTo), so the reverse edge is built
  // once here — walking up it is how a chain's root is found from any member.
  // Forme edges are indexed too: a regional variant can be the ONLY parent of
  // a species (Galarian Farfetch'd -> Sirfetch'd), and scanning EVOLUTIONS
  // alone leaves those 9 targets rootless. Key order and first-write-wins
  // reproduce src/app.js's evolutionRootId() scan exactly, precomputed rather
  // than re-walked on every render.
  var EVO_PARENT = {};
  Object.keys(EVOLUTIONS).concat(Object.keys(ALT_FORMS)).forEach(function (k) {
    var id = Number(k);
    (((EVOLUTIONS[k] || {}).evolvesTo) || []).concat(formeEvoEdges(id)).forEach(function (e) {
      if (EVO_PARENT[e.id] == null) EVO_PARENT[e.id] = id;
    });
  });

  function evoRoot(id) {
    var seen = {};
    while (EVO_PARENT[id] != null && !seen[id]) { seen[id] = 1; id = EVO_PARENT[id]; }
    return id;
  }

  // The ALT_FORMS forme object for a key, or null (src/app.js's findForme).
  function findForme(id, formeKey) {
    var alt = ALT_FORMS[id];
    if (!formeKey || !alt) return null;
    var formes = alt.formes || [];
    for (var i = 0; i < formes.length; i++) if (formes[i].key === formeKey) return formes[i];
    // `gmaxForme` (Alcremie) is a sibling of `formes`, not a member of it.
    if (alt.gmaxForme && alt.gmaxForme.key === formeKey) return alt.gmaxForme;
    return null;
  }
  function megaGmaxFormes(p) {
    return ((ALT_FORMS[p.id] || {}).formes || []).filter(function (f) { return f.isMega || f.isGmax; });
  }
  // Same short label mobile's altFormeShortLabel() produces: "Mega X" / "Mega Y"
  // from the forme name minus the species, "Gmax" always.
  function formeTag(p, f) {
    return f.isGmax ? "Gmax" : (f.name.replace(p.name, "").replace(/\s+/g, " ").trim() || "Mega");
  }

  // Defending multiplier of `attacker` against this Pokemon's whole type combo.
  function defenseMultiplier(attacker, types) {
    return (types || []).reduce(function (m, d) {
      var row = TYPE_CHART[attacker] || {};
      return m * (row[d] == null ? 1 : row[d]);
    }, 1);
  }

  // ------------------------------------------------------------- state

  var screen = "dex";
  var region = "all";
  var query = "";
  var selectedId = POKEMON_DATA[0].id;
  // Non-null = the detail pane is showing that Mega/Gmax forme of selectedId as
  // its OWN screen (item 7). Deliberately separate from selectedId rather than
  // an id-space hack: the grid, keyboard nav, prev/next and the evolution card
  // all still work off the base species, and every plain [data-id] click path
  // (grid card, evo stage, prev/next, the header's base-form sprite) clears it
  // for free because select() defaults it back to null.
  var formeView = null;
  var expanded = false;
  // Map screen (0.4.19) — its own region selection, deliberately separate from
  // the Dex's `region`: a map is per-region only (no "All" view), and switching
  // maps must not disturb whatever the Dex is filtered to.
  var mapRegion = "kanto";
  var mapZoom = 1;             // 1 = 100%, clamped to MAP_ZOOM_MIN..MAX
  var mapPanX = 0, mapPanY = 0; // px, applied as a translate before the scale
  var mapDrag = null;          // {x, y, panX, panY, id} while a drag is live
  // A pan and a click on a hit-region start identically, so movement past
  // MAP_DRAG_SLOP flips this and the click handler swallows the click that ends
  // the pan. Same shape as mobile's dragScrolled (SCOPE.md §3): reset on every
  // pointerdown, so a stale true can't survive into the next press.
  var mapDragged = false;
  // The Map screen's selected area, by its LOCATIONS[...][region][].area name —
  // what the detail pane renders instead of a species. Mirrors selectedId for
  // the Dex; null = nothing picked yet. Cleared when the map's region changes,
  // since an area name is only meaningful within its own region.
  var selectedArea = null;
  var selectedAreaKind = "";   // "Route" / "Gym city" / ... from the SVG's data-kind
  // Per-render popup registry for the Map screen's area chips (0.4.43). A chip
  // carries `data-pop="<index>"`; the click handler reads the body back out of
  // here rather than smuggling a whole HTML document through a data attribute.
  // Rebuilt from scratch by every areaDetailHtml() call, which is also the only
  // thing that can invalidate an index — the pane is re-rendered wholesale.
  var areaPopups = [];
  var rail = true;             // live sidebar state
  var railDefault = true;      // persisted "collapse by default" setting
  // Mirrored-from-mobile settings state.
  var useImperialUnits = false;
  var useShinyGrids = false;
  var pixelSprites = true;
  var gridCols = "5";

  function readSetting(key, fallback) {
    try {
      var raw = window.localStorage.getItem(key);
      if (raw === "on" || raw === "off") return raw === "on";
    } catch (e) { /* localStorage can be unavailable under file:// */ }
    return fallback;
  }
  function writeSetting(key, on) {
    try { window.localStorage.setItem(key, on ? "on" : "off"); } catch (e) {}
  }
  function readRaw(key, fallback) {
    try {
      var raw = window.localStorage.getItem(key);
      if (raw != null) return raw;
    } catch (e) {}
    return fallback;
  }
  function writeRaw(key, value) {
    try { window.localStorage.setItem(key, value); } catch (e) {}
  }

  // ------------------------------------------------------- dex list model

  // Standalone dexes (Hisui, Orre) are not `p.region` values — they're separate
  // rosters keyed by national id, exactly as src/app.js's renderDexList()
  // branches on them. Hisui additionally sorts by its OWN 001-242 numbering.
  function baseList() {
    if (region === "hisui") {
      return POKEMON_DATA.filter(function (p) { return HISUI_DEX_NUMBERS[p.id] != null; })
        .sort(function (a, b) { return HISUI_DEX_NUMBERS[a.id] - HISUI_DEX_NUMBERS[b.id]; });
    }
    if (region === "orre") {
      return POKEMON_DATA.filter(function (p) { return ORRE_MEMBERS[p.id] != null; });
    }
    if (region === "all") return POKEMON_DATA;
    return POKEMON_DATA.filter(function (p) { return p.region === region; });
  }

  function matchesQuery(p, q) {
    return p.name.toLowerCase().indexOf(q) >= 0 ||
      String(p.id) === q || pad(p.id) === q ||
      (p.types || []).some(function (t) { return t.toLowerCase() === q; });
  }

  // Species only — this is what selection, keyboard nav, prev/next and the
  // toolbar count all read. Mega/Gmax forme cards are a grid-render concern
  // (gridEntries below), never list members.
  function currentList() {
    var list = baseList();
    var q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter(function (p) { return matchesQuery(p, q); });
  }

  // What the grid actually draws: {p} for a species, {p, forme} for one of its
  // Mega/Gmax formes (item 8). A forme card appears ONLY while a search query
  // is active — browsing a region chip is untouched — and matches on either its
  // own name ("mega venusaur") or its base species' ("venusaur"), sorted
  // immediately after the base card.
  function gridEntries() {
    var base = baseList();
    var q = query.trim().toLowerCase();
    if (!q) return base.map(function (p) { return { p: p }; });
    var out = [];
    base.forEach(function (p) {
      var self = matchesQuery(p, q);
      if (self) out.push({ p: p });
      // Name matches only, either the forme's own or its base species' — a
      // type or dex-number search stays a species-only result.
      var byName = p.name.toLowerCase().indexOf(q) >= 0;
      megaGmaxFormes(p).forEach(function (f) {
        if (byName || f.name.toLowerCase().indexOf(q) >= 0) out.push({ p: p, forme: f });
      });
    });
    return out;
  }

  // The purple standalone-dex badge in a card's top-right corner: Hisui shows
  // its own dex number, Orre its C/XD game tag.
  function cardTag(p) {
    if (region === "hisui") return "H" + pad(HISUI_DEX_NUMBERS[p.id]);
    if (region === "orre") return ORRE_MEMBERS[p.id];
    return "";
  }

  function gridSpriteUrl(id) { return useShinyGrids ? shinyUrl(id) : spriteUrl(id); }

  // --------------------------------------------------------- center pane

  // Split out from dexHtml() because a keystroke in the search box re-renders
  // ONLY this — replacing the whole center pane would blow away the input's
  // focus and caret on every character.
  function gridHtml() {
    var entries = gridEntries();
    var cards = entries.length ? entries.map(function (en) {
      var p = en.p, f = en.forme;
      var types = (f && f.types) || p.types;
      var sel = p.id === selectedId && (f ? f.key === formeView : !formeView);
      return '<div class="card' + (sel ? " sel" : "") + (f ? " formecard" : "") +
        '" data-id="' + p.id + '"' + (f ? ' data-forme="' + esc(f.key) + '"' : "") +
        ' style="' + typeVar((types || ["Normal"])[0]) + '">' +
        '<span class="num">#' + pad(p.id) + "</span>" +
        (f ? '<span class="ftag' + (f.isGmax ? " gmax" : "") + '">' + esc(formeTag(p, f)) + "</span>"
           : (cardTag(p) ? '<span class="tag">' + esc(cardTag(p)) + "</span>" : "")) +
        (f ? altFormeImg(f.sprite) : imgTag(gridSpriteUrl(p.id))) +
        '<div class="name">' + esc(f ? f.name : p.name) + "</div>" +
        typePills(types) +
        "</div>";
    }).join("") : '<div class="empty">No Pokémon match this filter.</div>';
    return '<div class="grid" id="grid">' + cards + "</div>";
  }

  function dexHtml() {
    var chips = [{ id: "all", label: "All" }].concat(REGIONS).map(function (r) {
      var cls = (r.id === region ? "on " : "") + (r.standalone ? "standalone" : "");
      return '<button data-region="' + esc(r.id) + '" class="' + cls.trim() + '"><span>' + esc(r.label) + "</span></button>";
    }).join("");

    return '<div class="toolbar"><h1>Dex</h1>' +
      '<label class="search">⌕<input id="searchInput" placeholder="Search name, number or type…" value="' + esc(query) + '"></label>' +
      '<span class="count">' + currentList().length + " of " + POKEMON_DATA.length + "</span></div>" +
      '<div class="regions">' + chips + "</div>" +
      gridHtml();
  }

  function placeholderHtml() {
    return '<div class="toolbar"><h1>' + esc(SCREEN_TITLES[screen]) + "</h1></div>" +
      '<div class="placeholder"><div><h2>Not built yet</h2><p>' + esc(PLACEHOLDERS[screen]) +
      "</p><p style=\"margin-top:8px\">Coming in a later desktop pass — the Dex and its detail pane came first.</p></div></div>";
  }

  // ----------------------------------------------------------------- map
  // First screen of the Map Project (TODO.md #22), desktop-only by design.
  // Kanto's map is a finished standalone SVG in maps/, referenced as an asset
  // (like the sprites) rather than inlined — every other region falls through
  // to a "not mapped yet" note until its own map is drawn.

  var MAP_ZOOM_MIN = 1, MAP_ZOOM_MAX = 3, MAP_ZOOM_STEP = 0.25;
  var MAP_DRAG_SLOP = 5;   // logical px before a press counts as a pan, not a click

  // The map's raw <svg> markup, keyed by region and inlined into the DOM
  // (0.4.31) instead of pointed at with <img src>. That was itself a blur fix
  // attempt — an <img> is rasterised to a bitmap at one resolution and then
  // scaled, and seven rounds of nudging that bitmap cache into re-rasterising
  // sharp (0.4.23-0.4.30) had all failed — and it failed too. Useful failure:
  // an inline <svg> has no bitmap cache at all, so "stale raster" cannot be the
  // mechanism, which is what pointed at the compositor layer instead (0.4.32,
  // see markMapGesture()). Inlining stays regardless: it's the cleaner shape.
  //
  // 0.4.35: the markup arrives as a plain <script src="maps/<region>.js"> in
  // index.html — the same way every data file in this app loads — instead of
  // being fetch()ed at runtime. fetch() of a local file is blocked outright
  // under file:// (every local file is its own opaque origin), so opening
  // src-desktop/index.html straight from disk never got a map at all; a
  // <script> tag has no such restriction and works identically under file://,
  // `tauri dev` and the packaged .exe. maps/<region>.js is generated from
  // maps/<region>.svg by tools/gen_map_js.js (which is also where the 0.4.32
  // <title> strip lives now, done once at generation instead of every load).
  // The whole async surface is gone with the fetch: no in-flight state, no
  // "landed after the user navigated away" race, no loading placeholder.
  //
  // This object IS the region list: a region is mapped iff its key is here, so
  // dropping in a map and its <script> tag is the only bookkeeping. typeof
  // guard because app.js must not hard-depend on any map file being loaded.
  var MAP_SVG_MARKUP = typeof MAP_SVG_SOURCE !== "undefined" ? MAP_SVG_SOURCE : {};

  // region -> { areaName: dataKind } for every hit-region the map actually
  // draws, scraped once out of the markup itself rather than hand-listed —
  // the "Where to find" card needs both halves: whether an area is worth
  // linking to the map at all, and the `data-kind` the area pane's header
  // shows once it lands there. Region-generic by construction: a second map
  // file drops in and indexes itself. An area name repeated in one map
  // (Diglett's Cave has two entrances) keeps the first kind seen.
  var MAP_AREAS = {};
  Object.keys(MAP_SVG_MARKUP).forEach(function (r) {
    var index = MAP_AREAS[r] = {};
    var re = /data-area="([^"]*)"(?:\s+data-kind="([^"]*)")?/g, m;
    while ((m = re.exec(MAP_SVG_MARKUP[r]))) {
      if (!(m[1] in index)) index[m[1]] = m[2] || "";
    }
  });
  function mapHasArea(region, name) {
    return !!(MAP_AREAS[region] && Object.prototype.hasOwnProperty.call(MAP_AREAS[region], name));
  }

  function mapHtml() {
    // Same chip markup as dexHtml()'s region bar (so the existing
    // [data-region="hisui"/"orre"] tints apply for free), minus the "All"
    // entry — a combined map makes no sense.
    var chips = REGIONS.map(function (r) {
      var cls = (r.id === mapRegion ? "on " : "") + (r.standalone ? "standalone" : "");
      return '<button data-region="' + esc(r.id) + '" class="' + cls.trim() + '"><span>' + esc(r.label) + "</span></button>";
    }).join("");

    var label = (REGIONS.filter(function (r) { return r.id === mapRegion; })[0] || {}).label || mapRegion;
    var body = MAP_SVG_MARKUP[mapRegion]
      ? mapViewportHtml()
      : '<div class="placeholder"><div><h2>Not mapped yet</h2><p>' + esc(label) +
        "'s map hasn't been drawn yet.</p></div></div>";

    return '<div class="toolbar"><h1>Map</h1></div>' +
      '<div class="regions">' + chips + "</div>" + body;
  }

  // Panning is pointer-drag only (0.4.20) — .map-viewport is overflow:hidden,
  // so the browser's own scrollbars are out of the picture entirely.
  //
  // #mapSvg is a wrapper <div> holding the inlined <svg> markup, not the map
  // element itself: everything that pans/zooms/nudges looks the element up by
  // that id and writes .style.transform / .style.width on it, so keeping the id
  // on a wrapper leaves all of it working untouched across the 0.4.31 switch
  // from <img> to inline SVG. The <img>'s old draggable="false" is gone with
  // it — that blocked Chromium's native IMAGE drag-and-drop, which inline SVG
  // doesn't have; .map-viewport's user-select:none plus the drag handler's
  // selectstart guard (0.4.34) cover the drag-select gesture regardless.
  function mapViewportHtml() {
    return '<div class="map-viewport" id="mapViewport">' +
      '<div class="map-svg" id="mapSvg" style="transform:' + mapTransform() + '">' +
      MAP_SVG_MARKUP[mapRegion] +   // never empty: mapHtml() only reaches here for a mapped region
      "</div>" +
      '<div class="map-zoom">' +
      '<button type="button" data-mapzoom="in" title="Zoom in">+</button>' +
      '<button type="button" data-mapzoom="out" title="Zoom out">&minus;</button>' +
      "</div></div>";
  }

  function mapTransform() {
    return "translate(" + mapPanX + "px," + mapPanY + "px) scale(" + mapZoom + ")";
  }

  // Deliberately NOT a render() — a full re-render would replace the <img> on
  // every wheel tick and every pointermove.
  function applyMapTransform() {
    var img = document.getElementById("mapSvg");
    if (img) img.style.transform = mapTransform();
  }

  // Zoom anchored on a screen point: whatever bit of the map is under
  // (clientX, clientY) stays under it. transform-origin is 0 0, so the image
  // point under the cursor is just (c - pan) / zoom and the new pan follows.
  // The +/- buttons have no cursor, so they pass the viewport's own centre.
  function zoomMapAt(clientX, clientY, delta) {
    var vp = document.getElementById("mapViewport");
    if (!vp) return;
    var rect = vp.getBoundingClientRect();
    // clientLeft/clientTop are the border widths — the image's untransformed
    // origin is the content-box corner, not the border-box one.
    var cx = clientX - rect.left - vp.clientLeft;
    var cy = clientY - rect.top - vp.clientTop;
    var z = Math.max(MAP_ZOOM_MIN, Math.min(MAP_ZOOM_MAX, mapZoom + delta));
    var imgX = (cx - mapPanX) / mapZoom, imgY = (cy - mapPanY) / mapZoom;
    mapPanX = cx - imgX * z;
    mapPanY = cy - imgY * z;
    mapZoom = z;
    applyMapTransform();
    markMapGesture();   // one call covers both zoom paths (wheel and the +/- buttons)
  }

  // Blur fix, 0.4.32 — the ninth attempt, and the first with a mechanism behind
  // it rather than a nudge. .map-svg used to carry a permanent
  // will-change:transform (0.4.21, to kill the first-drag stutter). That
  // promotes it to its own compositor layer, and a layer is rasterised into a
  // GPU texture sized to the box it had when it was promoted — promoted at cold
  // load, before the pane's layout settles, the compositor spends the rest of
  // the screen's life stretching a texture rasterised at a stale size. That is
  // the same story whether the promoted content is an <img> or an inline <svg>,
  // which is exactly why 0.4.31's structural fix moved nothing, and why a real
  // window resize (which forces a re-raster) is one of the two known manual
  // cures. So: don't be a layer at rest. Promote at gesture start — the box is
  // long since settled by then, so the texture is rasterised at the right
  // size — and demote once the gesture goes idle.
  //
  // The class is added, never removed, for the duration of a gesture: repeated
  // calls (every wheel tick, every pointermove) only reset the idle timer.
  // Toggling per event would reintroduce the exact promote-on-demand stutter
  // 0.4.21 added will-change to fix.
  // ponytail: 200ms idle is a heuristic ceiling, same as 0.4.28's 600ms was —
  // there's no "gesture session over" event. Long enough that a wheel tick or a
  // drag pause doesn't demote mid-interaction, short enough that the element is
  // back to plain painting well before the user could notice a soft frame.
  var mapGpuTimer = null;
  function markMapGesture() {
    var el = document.getElementById("mapSvg");
    if (!el) return;   // unmapped region -> placeholder branch, no map element
    el.classList.add("gpu-layer");
    if (mapGpuTimer) clearTimeout(mapGpuTimer);
    mapGpuTimer = setTimeout(function () {
      mapGpuTimer = null;
      // Re-looked-up, not closed over: a render in the idle window replaces it.
      var later = document.getElementById("mapSvg");
      if (later) later.classList.remove("gpu-layer");
    }, 200);
  }

  // ------------------------------------------------- map area detail pane
  // Clicking a hit-region in maps/<region>.svg (a transparent <path>/<rect>
  // carrying data-area + data-kind, layered over the finished art) selects that
  // area and the detail pane renders it instead of a species.

  // LOCATIONS is keyed species -> region -> areas, i.e. the wrong direction for
  // "what lives here". This is the reverse index, computed on read — locations.js
  // itself gains no field. Region is a real parameter: every region's map needs
  // exactly this lookup, so hardcoding "kanto" would only have to be undone.
  // ponytail: a linear scan of 1025 ids per click, no cache. It runs once per
  // area click on an already-parsed object; index it if that ever measures.
  function areaEncounters(region, areaName) {
    var out = [];
    Object.keys(LOCATIONS).forEach(function (key) {
      var areas = (LOCATIONS[key] || {})[region] || [];
      var enc = [];
      areas.forEach(function (a) {
        // A pre-0.2.7 bare-string entry has no .enc and can't be matched by area.
        if (a && a.area === areaName) enc = enc.concat(a.enc || []);
      });
      if (!enc.length) return;   // no lines to show -> not worth a row
      var id = +key;
      out.push({ id: id, name: (byId(id) || {}).name || "#" + id, enc: enc });
    });
    return out;
  }

  // One encounter line, same convention as mobile's Found In popup
  // (openLocationPopup): "Method · Lv a–b · N%" with the games on their own
  // sub-line. min/max/rate are all optional in the newer data shapes, so each
  // part degrades to nothing rather than rendering "Lv undefined".
  //
  // 0.4.39: one renderer for both callers — the Map screen's area pane and the
  // detail pane's Found In card — so the SV/BDSP/LA extras (encExtrasHtml) and
  // the wrappable game list reach both. `id` is the species the line belongs
  // to, needed only to resolve an `e.forme` key to its real name.
  function encLineHtml(e, id) {
    var lv = e.min === undefined ? "" : " &middot; Lv " + (e.min === e.max ? e.min : e.min + "&ndash;" + e.max);
    var rate = e.rate === undefined ? "" : " &middot; " + (typeof e.rate === "number" ? e.rate + "%" : esc(e.rate));
    return '<div class="enc-line">' + esc(e.method) + lv + rate + encExtrasHtml(e, id) +
      encGamesHtml(e.games) + "</div>";
  }

  // areas.js is region -> area name -> flat rows, so every lookup is the same
  // two hops. An unpopulated region/area just yields [] and keeps its empty state.
  function areaRows(table, region, areaName) {
    return ((table || {})[region] || {})[areaName] || [];
  }

  // AREA_TRAINERS is one row per Pokémon, mirroring how LOCATIONS stores one row
  // per encounter line — a human reads "Bug Catcher Colton's FRLG team" as one
  // unit, so group by who/which-game/which-tier and join the species.
  // ponytail: canonical (FRLG) rows only. Showing the Let's Go variants too would
  // double every list for a first content-parity pass; drop the filter and add a
  // game label to the title if both are ever wanted.
  //
  // 0.4.43: `.rows` keeps every slot's whole row alongside `.species`, in the
  // same slot order — the chip's popup shows level/type/ability/moves per
  // Pokémon, which `.species` (bare names) and `.row` (slot 1 only) can't
  // answer. `.species` itself is untouched: same array, same order.
  function areaTrainerGroups(region, areaName) {
    var byKey = {}, order = [];
    areaRows(AREA_TRAINERS, region, areaName).forEach(function (r) {
      if (r.canonical !== 1) return;
      var key = [r.role, r.trainerClass, r.name, r.game, r.tier].join("|");
      if (!byKey[key]) { byKey[key] = { row: r, species: [], rows: [] }; order.push(key); }
      byKey[key].species.push(r.species);
      byKey[key].rows.push(r);
    });
    return order.map(function (k) { return byKey[k]; })
      // Gym leaders read first; everything else keeps its source order.
      .sort(function (a, b) { return (b.row.role === "leader") - (a.row.role === "leader"); });
  }

  // "after-reaching-fuchsia-city" -> the scrape's own sentence when it has one,
  // else the slug turned back into words rather than dumped raw. Plain text as
  // of 0.4.43 (was a wrapped <span>): both callers now place it themselves.
  function tierText(row) {
    if (row.tier === "base") return "";
    return row.tierNote || row.tier.replace(/-/g, " ").replace(/^./, function (c) { return c.toUpperCase(); });
  }

  // A POI's collapsed one-liner: its first sentence, hard-capped so a long
  // opener still reads as a summary. Split on "." only — "Let's Go, Pikachu!"
  // appears mid-sentence all over the scrape, so "!"/"?" are not terminators
  // here — and skip the abbreviations that actually occur in the data
  // ("Silph Co.", "Mr. Psychic", "Mt. Moon", "S.S. Anne").
  // ponytail: hand-tuned to the 58 real Kanto rows, not a general sentence
  // splitter; extend ABBR if a later region's scrape trips it.
  var POI_ABBR = /(^|[\s(])(Mr|Mrs|Ms|Dr|Prof|Co|Corp|Inc|Mt|St|Jr|Sr|No|vs|[A-Z]\.[A-Z])$/;
  function poiSummary(text) {
    var s = text, re = /\.(?=\s|$)/g, m;
    while ((m = re.exec(text))) {
      if (POI_ABBR.test(text.slice(0, m.index))) continue;
      s = text.slice(0, m.index + 1);
      break;
    }
    if (s.length > 130) s = s.slice(0, 130).replace(/\s+\S*$/, "") + "…";
    return s;
  }

  // POI category icons (0.4.42): 18 approved categories + a pin fallback, all
  // one 24x24 currentColor stroke set so they inherit the summary's colour.
  var POI_ICONS = {
    gym: '<path d="M12 2l7 3v6c0 5-3 8.5-7 11-4-2.5-7-6-7-11V5l7-3z"/><path d="M9 12l2 2 4-4"/>',
    house: '<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M9 20v-6h6v6"/>',
    person: '<circle cx="12" cy="8" r="3.2"/><path d="M5 20c0-4 3-6.5 7-6.5s7 2.5 7 6.5"/>',
    shop: '<path d="M6 8h12l1 12H5L6 8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
    lab: '<path d="M9 2v6L4 20a1.5 1.5 0 0 0 1.4 2h13.2a1.5 1.5 0 0 0 1.4-2L15 8V2"/><path d="M9 2h6"/><path d="M7 15h10"/>',
    cave: '<path d="M3 20l6-12 4 7 3-5 5 10z"/>',
    casino: '<rect x="4" y="4" width="16" height="16" rx="3"/><circle cx="8.5" cy="8.5" r="1.1" fill="currentColor" stroke="none"/><circle cx="15.5" cy="8.5" r="1.1" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.1" fill="currentColor" stroke="none"/><circle cx="8.5" cy="15.5" r="1.1" fill="currentColor" stroke="none"/><circle cx="15.5" cy="15.5" r="1.1" fill="currentColor" stroke="none"/>',
    building: '<rect x="4" y="3" width="16" height="18" rx="1"/><path d="M8 7h2M14 7h2M8 11h2M14 11h2M8 15h2M14 15h2"/>',
    hideout: '<path d="M4 20v-6a8 8 0 0 1 16 0v6"/><path d="M4 20h16"/><rect x="10.5" y="14" width="3" height="6"/><circle cx="7" cy="17" r=".6" fill="currentColor" stroke="none"/><circle cx="17" cy="17" r=".6" fill="currentColor" stroke="none"/>',
    pagoda: '<path d="M12 2l3 3H9l3-3z"/><path d="M5 8h14l-1.5 3h-11L5 8z"/><path d="M4.5 15h15l-2 3h-11l-2-3z"/><path d="M12 5v16M6 21h12"/>',
    hotel: '<path d="M3 16v-3a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v3"/><path d="M3 16h18v3H3z"/><path d="M6 11V8a2 2 0 0 1 2-2h2v5"/>',
    dojo: '<path d="M6 14l-2 3 1.5 2L9 15"/><path d="M18 14l2 3-1.5 2L15 15"/><circle cx="7" cy="11" r="2"/><circle cx="17" cy="11" r="2"/><path d="M9 12l3 2 3-2"/>',
    transit: '<rect x="5" y="4" width="14" height="12" rx="4"/><path d="M5 12h14"/><circle cx="8.5" cy="19" r="1"/><circle cx="15.5" cy="19" r="1"/><path d="M7 16l-1.5 3M17 16l1.5 3"/>',
    club: '<circle cx="9" cy="9" r="3"/><circle cx="16" cy="10" r="2.4"/><path d="M3.5 19c0-3.3 2.5-5.5 5.5-5.5s5.5 2.2 5.5 5.5"/><path d="M14.5 19c0-2.3 1.4-4 3.7-4s3.8 1.7 3.8 4"/>',
    notice: '<path d="M5 21V6l7-3 7 3v15"/><path d="M9 21v-6h6v6"/><circle cx="12" cy="11" r="1" fill="currentColor" stroke="none"/>',
    school: '<path d="M3 6.5C5 5 8 5 12 6.5 16 5 19 5 21 6.5v12C19 17 16 17 12 18.5 8 17 5 17 3 18.5z"/><path d="M12 6.5v12"/>',
    construction: '<path d="M9 19l3-13 3 13z"/><path d="M8 19h8M9.5 14h5M10.3 9.5h3.4"/>',
    safari: '<circle cx="7" cy="7" r="1.6"/><circle cx="12" cy="5.5" r="1.6"/><circle cx="17" cy="7" r="1.6"/><circle cx="9.5" cy="11" r="1.4"/><path d="M6 18c0-3 2.5-5 6-5s6 2 6 5"/>',
    fallback: '<path d="M12 21s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12z"/><circle cx="12" cy="9" r="2.4"/>'
  };
  // Exact names first: all 58 real Kanto POIs are named here, so none of them
  // ever reaches the pattern list or the pin. ("Berries" is a Juggler who trades
  // Berries for shards near Pal Park — a person, not a berry tree.)
  var POI_CATEGORY = {
    "Pewter Museum of Science": "building", "Pewter Gym": "gym", "Bike Shop": "shop",
    "Cerulean Cave": "cave", "Cerulean Gym": "gym", "Berry Powder man": "person",
    "Gym Badge man": "person", "Dontae's house": "house", "Burglarized house": "house",
    "Move Tutor": "person", "Celadon Department Store": "shop", "Celadon Condominiums": "house",
    "Celadon Game Corner": "casino", "Team Rocket Hideout": "hideout", "Celadon Hotel": "hotel",
    "Move Tutors": "person", "Fortune Teller": "person", "Celadon Gym": "gym",
    "Silph Co. Head Office": "building", "Fighting Dojo": "dojo", "Magnet Train station": "transit",
    "Mr. Psychic's House": "house", "Copycat's house": "house", "Pokémon Trainer Fan Club": "club",
    "Saffron Gym": "gym", "Pokémon Tower": "pagoda", "Kanto Radio Station": "building",
    "Lavender Volunteer Pokémon House": "house", "Name Rater": "person", "House of Memories": "house",
    "Silph Scope advertisement": "notice", "Viridian Gym": "gym", "Trainers' School": "school",
    "Trainer House": "house", "Old Man": "person", "TM man/Move Tutor": "person",
    "Port": "transit", "Pokémon Fan Club": "club", "Vermilion Gym": "gym",
    "Construction site": "construction", "In-game trade": "person", "Fishing Brother": "person",
    "Sleeping Pokémon notice": "notice", "Professor Oak's Lab": "lab", "Player's house": "house",
    "Rival's house": "house", "Safari Zone": "safari", "Safari Zone Warden": "person",
    "Move Deleter": "person", "Pokémon Zoo": "safari", "Berries": "person",
    "Fuchsia Gym": "gym", "Volcano": "cave", "Cinnabar Gym": "gym",
    "Pokémon Mansion": "building", "Cinnabar Lab": "lab", "Blue": "person"
  };
  // Only ever reached by a name the table above doesn't have — i.e. a future
  // region's scrape. Best-effort, ordered: transit's "station" is tested before
  // building's generic public-institution rule, so "Magnet Train station"-shaped
  // names don't land on a filing-cabinet icon.
  // ponytail: keyword guesswork, not a taxonomy; extend POI_CATEGORY when a
  // region's real names are known and let this stay the safety net.
  var POI_PATTERNS = [
    { test: /\bgym\b/i, cat: "gym" },
    { test: /\bhouse\b|mansion|condominium/i, cat: "house" },
    { test: /\bshop\b|\bstore\b|\bmart\b/i, cat: "shop" },
    { test: /\blab\b|laboratory/i, cat: "lab" },
    { test: /\bcave\b|volcano|tunnel|\bmt\.?\b/i, cat: "cave" },
    { test: /game corner|casino/i, cat: "casino" },
    { test: /hideout|bunker/i, cat: "hideout" },
    { test: /\btower\b|pagoda|shrine/i, cat: "pagoda" },
    { test: /\bhotel\b|\binn\b/i, cat: "hotel" },
    { test: /\bdojo\b/i, cat: "dojo" },
    { test: /\bstation\b|\bport\b|\bharbou?r\b/i, cat: "transit" },
    { test: /\bclub\b/i, cat: "club" },
    { test: /notice|advertisement|\bsign\b/i, cat: "notice" },
    { test: /\bschool\b|academy/i, cat: "school" },
    { test: /construction/i, cat: "construction" },
    { test: /safari|\bzoo\b/i, cat: "safari" },
    { test: /museum|office|building|centre|center/i, cat: "building" }
  ];
  function poiCategory(name) {
    if (typeof POI_CATEGORY[name] === "string") return POI_CATEGORY[name];
    for (var i = 0; i < POI_PATTERNS.length; i++) {
      if (POI_PATTERNS[i].test.test(name)) return POI_PATTERNS[i].cat;
    }
    return "fallback";
  }
  function iconSvg(cat) {
    return '<span class="poi-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"' +
      ' stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
      POI_ICONS[cat] + "</svg></span>";
  }
  function poiIcon(name) { return iconSvg(poiCategory(name)); }

  // ------------------------------------------------------ area chips (0.4.43)
  // The four categories are cards of chips now, not folds (user-approved
  // mockup). A chip is one bordered rounded box split in two: a tinted top
  // strip carrying the icon + name, and a dim one-line sub under it. The full
  // detail moved out of an inline expand and into the shared popup, so a card
  // stays the same height however encyclopedic its Bulbapedia text is — which
  // is what 0.4.38's per-POI <details> was working around.
  //
  // One builder for all four: the categories differ only in which icon and
  // which sub-line the caller hands over. `pop` is an areaPopups index (null =
  // an unclickable <div> rather than a <button>). nameHtml/subHtml are HTML —
  // every caller escapes its own text, same convention as the rest of the file.
  function chip(icon, nameHtml, subHtml, pop, cls, style) {
    var tag = pop == null ? "div" : "button";
    return "<" + tag + ' class="chip' + (cls ? " " + cls : "") + '"' +
      (style ? ' style="' + style + '"' : "") +
      (pop == null ? "" : ' type="button" data-pop="' + pop + '"') + ">" +
      '<span class="chip-top">' + icon + "<b>" + nameHtml + "</b></span>" +
      (subHtml ? '<span class="chip-sub">' + subHtml + "</span>" : "") +
      "</" + tag + ">";
  }
  function popRef(title, body) {
    areaPopups.push({ title: title, body: body });
    return areaPopups.length - 1;
  }
  // A card is omitted entirely when its category is empty for this area, rather
  // than rendering an empty-state box nobody asked for.
  function areaCard(title, chips) {
    return chips ? '<section class="box"><h3>' + title + '</h3><div class="chips">' + chips + "</div></section>" : "";
  }

  // --------------------------------------------------- trainer popup (0.4.45)
  // The flat roster list is now two views sharing the ONE popup mechanism: an
  // overview (portrait + prize + a chip per team slot) and a per-Pokémon card.
  // Both are ordinary areaPopups entries, so a team chip and the mon card's
  // "Team" button are the same [data-pop] click the area chips already use — no
  // second overlay layer and no navigation state to keep.
  //
  // The overview reserves its own index BEFORE building its chips, because each
  // mon card links back to it; its body is filled into the reserved slot after.
  function trainerTitle(row) {
    return row.trainerClass + (row.name ? " " + row.name : "");
  }
  function trainerPopRef(g) {
    var self = popRef(trainerTitle(g.row), "");
    areaPopups[self].body = trainerOverviewHtml(g, self);
    return self;
  }
  function rowPills(r) {
    return [r.type1, r.type2].filter(Boolean).map(onePill).join("");
  }
  // ₱ is the project's own Poké Dollar glyph (src/app.js's CURRENCY_SHORT).
  // `prize` is on every one of the 1192 rows, so it is never conditional;
  // `prizeNote` (an extra reward, or the condition that earns the money) is on a
  // handful and only renders when there.
  function prizeText(row) {
    return "₱" + row.prize + (row.prizeNote ? " (" + row.prizeNote + ")" : "");
  }
  // ponytail: a generic person icon, not trainer-class artwork — deliberate for
  // this pass (user-confirmed), swap the <span>'s contents when art is sourced.
  function trainerOverviewHtml(g, self) {
    var tier = tierText(g.row);
    var chips = g.rows.map(function (r) {
      return chip(imgTag(spriteUrl(r.ndex), "chip-sprite"), esc(r.species),
        "Lv " + esc(r.level) + " " + rowPills(r),
        popRef(r.species, trainerMonHtml(r, self)), "mon");
    }).join("");
    return '<div class="trainer-head"><span class="trainer-portrait">' + iconSvg("person") + "</span>" +
      '<div class="trainer-meta"><div class="trainer-title-row"><b>' + esc(trainerTitle(g.row)) + "</b>" +
      '<span class="prize">' + esc(prizeText(g.row)) + "</span></div>" +
      (tier ? '<div class="enc-line">' + esc(tier) + "</div>" : "") + "</div></div>" +
      '<div class="chips">' + chips + "</div>";
  }

  // AREA_TRAINERS stores a held item as a display name ("Black Belt"), unlike
  // pokemon.js's heldItems which are already slugs — hence the conversion. An
  // item ITEMS_DATA doesn't know still shows its name, just without the icon, so
  // a future region's unmapped name can't break the card.
  function itemSlug(name) {
    return String(name).normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  }
  // src/app.js's formula, ported (it had no desktop counterpart): 31 IV, 0 EV,
  // neutral nature — the same convention the Base Stats card reads. Real
  // per-trainer IVs exist nowhere in the sourced data, so the card labels these
  // as estimates rather than inventing an IV row.
  function calcStat(base, level, isHp) {
    var core = Math.floor((2 * base + 31) * level / 100);
    return isHp ? core + level + 10 : core + 5;
  }
  function trainerMonHtml(r, backPop) {
    var s = STATS[r.ndex];
    var stats = !s ? "" :
      '<div class="group-label">Stats at Lv ' + esc(r.level) + "</div>" +
      '<div class="facts">' + STAT_KEYS.map(function (k) {
        return '<div class="fact stat" style="--s:var(--s-' + k[0] + ')"><b>' + k[1] + "</b><span>" +
          calcStat(s[k[0]] || 0, r.level, k[0] === "hp") + "</span></div>";
      }).join("") + "</div>" +
      '<div class="enc-line">31 IV / 0 EV / neutral nature &mdash; estimated.</div>';
    var item = "";
    if (r.heldItem) {
      var slug = itemSlug(r.heldItem);
      item = '<div class="enc-line">' + (ITEMS_DATA[slug] ? imgTag(itemUrl(slug), "chip-sprite") : "") +
        "Held item: " + esc(r.heldItem) + "</div>";
    }
    var pills = rowPills(r);
    return '<button type="button" class="arealink backlink" data-pop="' + backPop + '">&larr; Team</button>' +
      '<div class="mon-head"><b>' + esc(r.species) + " &middot; Lv " + esc(r.level) + "</b></div>" +
      (pills ? '<div class="pillrow">' + pills + "</div>" : "") +
      (r.ability ? '<div class="enc-line">Ability: ' + esc(r.ability) + "</div>" : "") +
      item + stats +
      (r.moves ? '<div class="group-label">Moves</div><div class="move-chips">' +
        r.moves.split(";").map(moveChip).join("") + "</div>" : "");
  }
  // A move segment is "Name (Type)" or, in the LGPE-shaped rows, "Name (Type,
  // DamageClass)". The type drives the chip's tint through the same --t custom
  // property onePill() uses, so the move-dex this is groundwork for gets the
  // parse for free. A segment that doesn't match at all still renders its own
  // text, untinted — no move is ever silently dropped.
  var MOVE_RE = /^(.*?)\s*\(([^,)]+)(?:,[^)]*)?\)\s*$/;
  function moveChip(seg) {
    var m = String(seg).trim().match(MOVE_RE);
    return m ? chip("", esc(m[1]), "", null, "move", typeVar(m[2].trim()))
      : chip("", esc(String(seg).trim()), "", null, "move");
  }

  // The chip's one-line encounter summary: the first method (plus a count of
  // the others) and the level range across every line, so "what and roughly
  // when" fits on one line and the popup carries the rest.
  function encSummary(enc) {
    var methods = [], lo = null, hi = null;
    enc.forEach(function (e) {
      if (methods.indexOf(e.method) < 0) methods.push(e.method);
      if (e.min === undefined) return;
      var max = e.max === undefined ? e.min : e.max;
      if (lo === null || e.min < lo) lo = e.min;
      if (hi === null || max > hi) hi = max;
    });
    return esc(methods[0]) + (methods.length > 1 ? " +" + (methods.length - 1) : "") +
      (lo === null ? "" : " &middot; Lv " + (lo === hi ? lo : lo + "&ndash;" + hi));
  }

  function areaDetailHtml() {
    areaPopups = [];
    if (!selectedArea) {
      return '<div class="detail-body"><div class="stub">Click an area on the map to see its details.</div></div>';
    }

    var pois = areaRows(AREA_POI, mapRegion, selectedArea).map(function (p) {
      return chip(poiIcon(p.name), esc(p.name), esc(poiSummary(p.description)),
        popRef(p.name, '<div class="enc-line">' + esc(p.description) + "</div>"));
    }).join("");

    // Not clickable: an AREA_NPCS row is only {name, poiName}, both already on
    // the chip — a popup here would repeat the chip back at the user.
    var npcs = areaRows(AREA_NPCS, mapRegion, selectedArea).map(function (n) {
      return chip(iconSvg("person"), esc(n.name), n.poiName ? "near " + esc(n.poiName) : "", null);
    }).join("");

    var trainers = areaTrainerGroups(mapRegion, selectedArea).map(function (g) {
      var tier = tierText(g.row);
      var shown = g.species.slice(0, 3).join(", ") +
        (g.species.length > 3 ? " +" + (g.species.length - 3) + " more" : "");
      return chip(iconSvg("person"), esc(trainerTitle(g.row)),
        (tier ? "(" + esc(tier) + ") " : "") + esc(shown),
        trainerPopRef(g), g.row.role === "leader" ? "leader" : "");
    }).join("");

    // 0.4.44: a one-off gift (methods "Gift" and "Gift Egg" — the only two in
    // LOCATIONS) is a different thing from a wild encounter, so it sorts to the
    // end under its own label instead of sitting mid-list. Each group keeps its
    // existing relative order; only the partition is new, and the label is
    // omitted entirely when the area has no gifts. A species with BOTH kinds of
    // line (Kanto Magikarp: the Route 4 salesman plus its Good/Old Rod lines)
    // counts as a gift and moves as one whole chip — its popup still lists every
    // line it has, so nothing is split or lost.
    function encChip(m) {
      return chip(imgTag(spriteUrl(m.id), "chip-sprite"), esc(m.name), encSummary(m.enc),
        popRef(m.name, m.enc.map(function (e) { return encLineHtml(e, m.id); }).join("")));
    }
    function isGift(m) {
      return m.enc.some(function (e) { return /^Gift/.test(e.method || ""); });
    }
    var encMons = areaEncounters(mapRegion, selectedArea);
    var encs = encMons.filter(function (m) { return !isGift(m); }).map(encChip).join("");
    var giftChips = encMons.filter(isGift).map(encChip).join("");
    if (giftChips) encs += '<div class="group-label">Gift</div>' + giftChips;

    var body = areaCard("Points of interest", pois) +
      areaCard("Important NPCs", npcs) +
      areaCard("Trainers", trainers) +
      areaCard("Pokémon encounters", encs);

    return '<div class="detail-head"><div class="top"><div>' +
      '<div class="id">' + esc(selectedAreaKind || "Area") + "</div><h2>" + esc(selectedArea) + "</h2>" +
      "</div></div></div>" +
      '<div class="detail-body">' +
      (body || '<div class="stub">Nothing catalogued for this area yet.</div>') +
      "</div>";
  }

  // The selected area's own hit-region, marked on the map (0.4.39). Driven off
  // `selectedArea` alone, so BOTH ways in — a direct click on the map and the
  // Found In card's cross-link — light the same shape, and a region switch
  // (which nulls selectedArea) clears it for free. Not a hover effect: hover
  // highlighting is a separate, still-deferred design item (TODO.md #22).
  // A name drawn twice on one map (Diglett's Cave's two entrances) lights both,
  // which is correct — they are the same place.
  function applyAreaHighlight() {
    var svg = document.getElementById("mapSvg");
    if (!svg) return;
    var hits = svg.querySelectorAll("[data-area]");
    for (var i = 0; i < hits.length; i++) {
      hits[i].classList.toggle("sel-area", hits[i].getAttribute("data-area") === selectedArea);
    }
  }

  // Phase 3's cross-link (TODO.md #22): a species' Found In card -> the Map
  // screen, that area already selected. Deliberately resets pan/zoom to the
  // default full-map view rather than centring on the target — the map is small
  // enough to read whole, and the highlight is what actually locates it.
  function goToMapArea(region, areaName) {
    mapRegion = region;
    mapZoom = 1;
    mapPanX = 0;
    mapPanY = 0;
    selectedArea = areaName;
    selectedAreaKind = (MAP_AREAS[region] || {})[areaName] || "";
    screen = "map";
    if (expanded) setExpanded(false);
    render();   // renderDetail() paints the area pane and the highlight
  }

  // ------------------------------------------------------------ settings
  // Content parity with the mobile Settings window (item 1): Dark Mode,
  // Measurements, Grid Width, Shiny Grids, Pixel Sprites — same five rows, same
  // localStorage keys — plus the desktop-only sidebar default and the About
  // line. Layout is the already-locked docked screen, not a modal.

  function switchRow(id, label, note, on, disabled) {
    return '<div class="frow' + (disabled ? " off" : "") + '"><div>' + esc(label) +
      (note ? "<small>" + esc(note) + "</small>" : "") + "</div>" +
      '<div class="ctl"><input type="checkbox" class="sw" id="' + id + '"' +
      (on ? " checked" : "") + (disabled ? " disabled" : "") + "></div></div>";
  }
  function segRow(setting, label, note, options, value) {
    return '<div class="frow"><div>' + esc(label) +
      (note ? "<small>" + esc(note) + "</small>" : "") + "</div>" +
      '<div class="ctl"><div class="seg">' + options.map(function (o) {
        return '<button type="button" data-setting="' + setting + '" data-value="' + esc(o[0]) + '"' +
          (o[0] === value ? ' class="on"' : "") + ">" + esc(o[1]) + "</button>";
      }).join("") + "</div></div></div>";
  }

  function settingsHtml() {
    return '<div class="toolbar"><h1>Settings</h1></div>' +
      '<div class="form"><h4>Display</h4>' +
      switchRow("darkModeToggle", "Dark Mode",
        "The desktop build is dark-only for now — a light theme is a later pass, matching the mobile frontend's.",
        true, true) +
      segRow("units", "Measurements", "Height and weight throughout the detail pane.",
        [["metric", "Metric"], ["imperial", "Imperial"]], useImperialUnits ? "imperial" : "metric") +
      segRow("cols", "Grid Width", "How wide a Dex card is — 3 gives the largest cards, 5 the most per row.",
        [["3", "3"], ["4", "4"], ["5", "5"]], gridCols) +
      switchRow("shinyGridsToggle", "Shiny Grids",
        "Dex cards show shiny art. The detail pane always shows both.", useShinyGrids) +
      switchRow("pixelSpritesToggle", "Pixel Sprites",
        "Off smooths the upscaled sprites instead of keeping them pixel-perfect.", pixelSprites) +
      '<h4>Layout</h4>' +
      switchRow("railDefaultToggle", "Collapse sidebar by default",
        "The sidebar starts as a 64px icon rail and reopens while hovered. Ctrl+B toggles it for this session without changing this default.",
        railDefault) +
      '<h4>About</h4><div class="frow"><div>VKDex v' + esc(APP_VERSION) +
      "<small>Desktop build — " + POKEMON_DATA.length + " Pokémon, " + REGIONS.length + " dexes.</small></div></div></div>";
  }

  function renderCenter() {
    var el = document.getElementById("center");
    if (screen === "dex") el.innerHTML = dexHtml();
    else if (screen === "settings") el.innerHTML = settingsHtml();
    else if (screen === "map") el.innerHTML = mapHtml();
    else el.innerHTML = placeholderHtml();
  }

  // --------------------------------------------------------- detail pane

  // A Mega/Gmax forme rendered as its own screen is a shallow copy of the base
  // species with the forme's own overrides applied (item 7). Nothing else in
  // the app sees this object — it exists only for the duration of one render.
  // `_forme` marks it; `_stats` carries the forme's own base-stat spread so
  // statsFor()/radarBox()/trainingBox() need no special-casing.
  function formeEntry(p, f) {
    if (!f) return p;
    var out = Object.assign({}, p, {
      name: f.name,
      types: f.types || p.types,
      // A Mega's `ability` is its ONLY ability in canon, so it replaces the
      // base list rather than appending to it (mobile's rule 4 appends because
      // it swaps in place inside the base species' own card).
      abilities: f.ability ? [f.ability] : p.abilities,
      hiddenAbility: f.ability ? null : p.hiddenAbility,
      _forme: f,
      _stats: f.stats ? Object.assign({}, STATS[p.id], f.stats) : STATS[p.id]
    });
    // 0.4.39, for the ordinary alt formes the Alt formes card now makes
    // tappable: a regional variant carries a full `abilities` LIST plus its own
    // `hiddenAbility` (not a Mega's single `ability`), and Pumpkaboo/Gourgeist's
    // four sizes override height/weight while sharing everything else. Each
    // field is independent, and anything the forme doesn't set falls through to
    // the base — which is what makes reverting restore the base exactly.
    if (!f.ability && f.abilities) {
      out.abilities = f.abilities;
      out.hiddenAbility = f.hiddenAbility || null;
    }
    if (f.height !== undefined) out.height = f.height;
    if (f.weight !== undefined) out.weight = f.weight;
    return out;
  }
  function statsFor(p) { return p._stats || STATS[p.id]; }

  function abilityRows(p, withDescription) {
    var names = p.abilities || [];
    if (!names.length) return '<div class="stub">No abilities recorded.</div>';
    return '<div class="abil">' + names.map(function (name) {
      var hidden = name === p.hiddenAbility;
      var desc = (ABILITIES[name] || {}).description;
      return "<div><b>" + esc(name) + "</b>" +
        (hidden ? '<span class="tag">Hidden</span>' : "") +
        (withDescription && desc ? "<small>" + esc(desc) + "</small>" : "") +
        "</div>";
    }).join("") + "</div>";
  }

  function statsHtml(p) {
    var s = statsFor(p);
    if (!s) return '<div class="stub">No base stats recorded.</div>';
    var total = STAT_KEYS.reduce(function (a, k) { return a + (s[k[0]] || 0); }, 0);
    var rows = STAT_KEYS.map(function (k) {
      var v = s[k[0]] || 0;
      return '<span class="k">' + k[1] + '</span><span class="v">' + v + "</span>" +
        '<div class="bar"><i style="--s:var(--s-' + k[0] + ");width:" + Math.min(100, v / 255 * 140) + '%"></i></div>';
    }).join("");
    // The .r span is the codebase's existing right-aligned header-value slot
    // (section h3 .r / .box h3 .r). 0.4.11 gave it the colon and, in the
    // document view, the .box h3 flex rule that actually pushes it to the right
    // edge — without it the two ran together as "Base statsTotal 405". 0.4.12
    // drops both rules' size/weight/colour overrides so it now reads as the same
    // text as its own card's title, per feedback.
    return "<h3>Base stats<span class=\"r\">Total: " + total + '</span></h3><div class="stats">' + rows + "</div>";
  }

  function itemName(slug) {
    return String(slug).replace(/-/g, " ").replace(/\b[a-z]/g, function (c) { return c.toUpperCase(); });
  }

  // ---------------------------------------------------- evolution line
  // Ported from src/app.js's evolution helpers (item 6): the DATA and LABEL
  // logic is mobile's verbatim-in-behaviour, because it already handles every
  // edge case in the real 1025-species set — branch-producing formes, gendered
  // evolutions, move/trade/held/stone/level triggers, sibling branches that
  // converge on one id. Only the final HTML assembly (evoTreeHtml) is new: a
  // top-down vertical tree instead of mobile's duplicate-per-row rows.
  //
  // The one simplification: desktop has no in-place forme swap on the detail
  // screen (a Mega/Gmax forme is its own screen, and that screen has no
  // Evolution card at all), so mobile's activeFormeKey branches collapse to the
  // "no forme active" case throughout.

  // The VIEWED species is strict — base edges only, which is what keeps
  // Sirfetch'd off base Farfetch'd's page. Any OTHER species in the chain also
  // contributes its forme-only routes, or the walk down from the root can't
  // re-enter the forme edge it walked up through.
  // Exception (0.4.18): desktop has no in-place forme swap, so a species whose
  // base form never evolves and whose ONLY route is forme-level (83, 122, 211,
  // 222, 264, 550) would show no Evolution card at all. Fall back to the forme
  // edges when the base has none — general rule, not a per-species case. The
  // 10 species that keep some base edge stay strict, as before.
  function evoEdgesFor(id) {
    var base = ((EVOLUTIONS[id] || {}).evolvesTo) || [];
    if (id === selectedId) return base.length ? base : formeEvoEdges(id);
    var seen = base.map(function (e) { return e.id; });
    var extra = formeEvoEdges(id).filter(function (e) {
      if (seen.indexOf(e.id) !== -1) return false;
      seen.push(e.id);
      return true;
    });
    return extra.length ? base.concat(extra) : base;
  }

  // Every edge in the chain, flattened, as {from, via}. Replaces 0.4.12's
  // evolutionPaths(): the tree recursion below walks the chain itself, so the
  // only remaining need is a flat edge list for the bottom notes. The `seen`
  // guard matters for a chain whose siblings converge on one id (Urshifu's two
  // scrolls both land on 892) — walking it twice would duplicate its notes.
  function evoAllEdges(rootId) {
    var out = [], seen = {};
    (function walk(id) {
      if (seen[id]) return;
      seen[id] = 1;
      evoEdgesFor(id).forEach(function (e) { out.push({ from: id, via: e }); walk(e.id); });
    })(rootId);
    return out;
  }

  // Which forme's art/name a stage bubble should show. `preferEdgeForme` is set
  // only for a leaf reached by 2+ sibling paths (Urshifu's two scrolls both
  // land on 892, told apart only by the edge's own `forme`).
  function evoStageForme(id, nextStep, incomingVia, preferEdgeForme) {
    if (preferEdgeForme) return (incomingVia && incomingVia.forme) ? findForme(id, incomingVia.forme) : null;
    // Source side: the outgoing edge names the forme that produces the branch.
    if (nextStep && nextStep.via && nextStep.via.fromFormeKey) return findForme(id, nextStep.via.fromFormeKey);
    // Target side: the incoming edge names which forme of its target it lands
    // on (East Shellos' arrow lands on an East-colored Gastrodon).
    if (incomingVia && incomingVia.forme) return findForme(id, incomingVia.forme);
    return null;
  }
  function evoStageName(id, forme, preferEdgeForme) {
    if (forme) return forme.name;
    return (preferEdgeForme && ALT_FORMS[id] && ALT_FORMS[id].baseName) || null;
  }
  // Only female art is bundled (the default sprite IS the male/non-dimorphic
  // one), so a "male" edge always falls through to the default.
  function evoGenderSpriteUrl(id, gender) {
    var mon = gender === "female" ? byId(id) : null;
    return mon && mon.hasFemaleSprite ? femaleUrl(id, false) : null;
  }

  var STAT_SHORT = { atk_gt_def: "Atk > Def", atk_lt_def: "Atk < Def", atk_eq_def: "Atk = Def" };

  // The condition chip that rides on a drop line. Ported from the direction-4
  // mockup's cond().mid, which is deliberately longer than 0.4.12's
  // evoArrowLabel: a vertical connector has real horizontal room, so a
  // trade/held/friendship edge can name its item and time of day instead of
  // collapsing to a bare "Trade"/"Held"/"Friendship" (mockup goal 2 — always
  // show HOW a transition happens). Returns "" only for a null edge.
  function evoCondLabel(via) {
    if (!via) return "";
    // Hand-authored per-edge override, for a branch the derived label can't
    // tell apart from its sibling (Urshifu's two scrolls, Galarian Slowpoke)
    // or a mechanism the fields can't express at all (the 11 "other" edges,
    // annotated in data/evolutions.js as of 0.4.13). Wins outright.
    var s = via.note;
    var tod = via.timeOfDay === "day" ? ", day" : via.timeOfDay === "night" ? ", night" : "";
    if (!s) {
      // A "level" edge with no `level` is a happiness/affection evolution.
      if (via.method === "level" && typeof via.level === "number") s = "Lv " + via.level;
      else if (via.method === "level") {
        s = "Friendship" + tod + (via.moveType ? ", " + cap(via.moveType) + " move" : "");
      } else if (via.item === "tm-normal" && via.move) s = "Knows " + via.move;
      else if (via.method === "stone") s = via.item ? itemName(via.item) : "Stone";
      else if (via.method === "trade") s = via.item ? "Trade w/ " + itemName(via.item) : "Trade";
      else if (via.method === "held") s = (via.item ? itemName(via.item) + " held" : "Held") + tod;
      // Nothing derivable and no hand-authored note: render no chip at all
      // rather than a placeholder, exactly as 0.4.12 did. Still true for the 4
      // FORME-level "other" edges in data/altforms.js (Galarian Farfetch'd,
      // Hisuian Qwilfish, White-Striped Basculin, Galarian Yamask) — the same
      // gap the 11 species-level ones had before 0.4.13, not yet researched.
      else return "";
    }
    if (GENDER_GLYPH[via.gender]) s += " " + GENDER_GLYPH[via.gender] + " only";
    if (STAT_SHORT[via.statCompare]) s += ", " + STAT_SHORT[via.statCompare];
    return s;
  }
  function cap(s) { return String(s).charAt(0).toUpperCase() + String(s).slice(1); }

  var GENDER_GLYPH = { male: "♂", female: "♀" };
  var EVO_HEART_SVG = '<svg class="evo-cond-icon" viewBox="0 0 16 14" aria-hidden="true"><path d="M8 13 C3 9 1 6.5 1 4.2 C1 2 2.7 1 4.3 1 C5.7 1 7 1.8 8 3.2 C9 1.8 10.3 1 11.7 1 C13.3 1 15 2 15 4.2 C15 6.5 13 9 8 13 Z" fill="currentColor"/></svg>';
  var EVO_SUN_SVG = '<svg class="evo-cond-icon" viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="3.5" fill="currentColor"/><g stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><line x1="8" y1="0.8" x2="8" y2="2.6"/><line x1="8" y1="13.4" x2="8" y2="15.2"/><line x1="0.8" y1="8" x2="2.6" y2="8"/><line x1="13.4" y1="8" x2="15.2" y2="8"/><line x1="2.9" y1="2.9" x2="4.2" y2="4.2"/><line x1="11.8" y1="11.8" x2="13.1" y2="13.1"/><line x1="2.9" y1="13.1" x2="4.2" y2="11.8"/><line x1="11.8" y1="4.2" x2="13.1" y2="2.9"/></g></svg>';
  var EVO_MOON_SVG = '<svg class="evo-cond-icon" viewBox="0 0 16 16" aria-hidden="true"><path d="M14 9.5 A6.5 6.5 0 1 1 6.5 2 A5.2 5.2 0 0 0 14 9.5 Z" fill="currentColor"/></svg>';

  // Icon row above the arrow: the required item's sprite (stone/trade/held) or
  // a heart (friendship), plus an optional gender glyph, sun/moon, and a type
  // pill for a known-move-type trigger. Items with no bundled art hide their
  // <img> rather than showing a broken icon; unlike mobile these are NOT
  // tappable — the desktop build has no item popup yet.
  function evoArrowIconsHtml(via) {
    if (!via) return "";
    var icons = "";
    if (via.item) {
      icons += '<img class="evo-item" src="' + itemUrl(via.item) + '" alt="' + esc(itemName(via.item)) +
        '" onerror="this.style.display=\'none\';">';
    } else if (via.method === "level" && typeof via.level !== "number") {
      icons += EVO_HEART_SVG;
    }
    if (GENDER_GLYPH[via.gender]) {
      icons += '<span class="evo-gender gender-' + via.gender + '">' + GENDER_GLYPH[via.gender] + "</span>";
    }
    if (via.timeOfDay === "day") icons += EVO_SUN_SVG;
    else if (via.timeOfDay === "night") icons += EVO_MOON_SVG;
    if (via.moveType) icons += onePill(via.moveType.charAt(0).toUpperCase() + via.moveType.slice(1));
    return icons ? '<span class="evo-icons">' + icons + "</span>" : "";
  }

  function evoName(id) { return (byId(id) || {}).name || "#" + id; }

  // Bottom-of-card notes (mockup goal 3: an edge case too awkward to convey on
  // a connector chip gets a concise sentence here instead). 0.4.12's
  // evoDescriptorHtml emitted at most ONE line and stopped at the first source
  // that had something; the direction-4 mockup renders a list, so all four
  // sources now contribute, in this order:
  //   1. the species' own hand-authored top-level `note` (Wurmple's RNG, and
  //      Stantler's, which predates the per-edge noteLong convention);
  //   2. a derived line for a hidden stat comparison (Tyrogue), naming what
  //      each comparison produces rather than 0.4.12's bare "based on stats";
  //   3. a derived line per gendered edge (Kirlia, Combee, Snorunt, Burmy);
  //   4. every edge's own `noteLong` — the full-sentence half of 0.4.13's
  //      two-length note convention (data/evolutions.js's header comment).
  // All four are keyed off the data, never off species ids.
  function evoNotesHtml(root) {
    var notes = [], edges = evoAllEdges(root);
    var top = (EVOLUTIONS[root] || {}).note;
    if (top) notes.push(top);

    var stat = edges.filter(function (x) { return STAT_SHORT[x.via.statCompare]; });
    if (stat.length) {
      notes.push((stat[0].via.level !== undefined ? "At level " + stat[0].via.level + " the" : "The") +
        " result depends on " + evoName(stat[0].from) + "'s stats: " +
        stat.map(function (e) { return STAT_SHORT[e.via.statCompare] + " → " + evoName(e.via.id); }).join(", ") + ".");
    }
    edges.forEach(function (e) {
      if (e.via.gender) {
        notes.push("Only a " + e.via.gender + " " + evoName(e.from) +
          " can evolve into " + evoName(e.via.id) + ".");
      }
    });
    edges.forEach(function (e) { if (e.via.noteLong) notes.push(e.via.noteLong); });

    if (!notes.length) return "";
    return '<div class="evo-notes">' + notes.map(function (t) {
      return '<p class="evo-note">' + esc(t) + "</p>";
    }).join("") + "</div>";
  }

  // One node of the vertical tree. `via` is the edge that reaches it (null at
  // the root), `edges` this node's own outgoing edges — already narrowed to a
  // single branch-key group by evoSubtreeHtml, so any of them names the forme
  // this copy of the node should draw.
  function evoNodeHtml(id, via, edges, curId, prefersEdge) {
    var mon = byId(id);
    if (!mon) return "";
    var next = edges.length ? { via: edges[0] } : null;
    var forme = evoStageForme(id, next, via, prefersEdge);
    var src = forme
      ? altFormeUrl(forme.sprite, false)
      : (evoGenderSpriteUrl(id, next && next.via.gender) || spriteUrl(id));
    var name = evoStageName(id, forme, prefersEdge) || mon.name;

    // Sibling edges landing on the SAME id are told apart only by the edge's
    // own `forme` (Kubfu's two scrolls both reach 892) — 0.4.12's lastIdCounts,
    // now a local sibling count instead of a whole-chain leaf count.
    var counts = {};
    edges.forEach(function (e) { counts[e.id] = (counts[e.id] || 0) + 1; });

    var label = evoCondLabel(via), icons = via ? evoArrowIconsHtml(via) : "";
    return '<div class="evo-node">' +
      (via ? '<div class="evo-drop"><i></i>' +
        (label || icons ? '<span class="evo-lv">' + icons + esc(label) + "</span>" : "") +
        '<i class="arr"></i></div>' : "") +
      '<button type="button" class="evo-slot' + (id === curId ? " cur" : "") +
      '" data-id="' + id + '">' + imgTag(src, "") +
      '<span class="evo-name">' + esc(name) + "</span></button>" +
      (edges.length ? '<div class="evo-stem"></div>' + evoFanHtml(edges, curId, counts) : "") +
      "</div>";
  }

  // 0.4.15 — a fan of 4+ siblings does not fit column 1's card on one row, and
  // 0.4.14's sideways scroll meant only 5 of Eevee's 8 branches were visible
  // without dragging. Wide fans are split into rows of at most EVO_FAN_MAX
  // instead, so every branch is on screen with no input from the user. Eevee's
  // line (8) is the only fan in the whole dex over 3, so this is the one shape
  // it ever produces; a 1-row fan renders byte-identically to 0.4.14.
  //
  // Rows are balanced rather than greedily filled (8 -> 3/3/2, not 3/3/2 by
  // luck and 7 -> 3/3/1), which also guarantees no row is left with a single
  // child — a lone child would hit .evo-kids > .evo-node:only-child::before and
  // lose its bar.
  var EVO_FAN_MAX = 3;
  function evoFanRows(edges) {
    if (edges.length <= EVO_FAN_MAX) return [edges];
    var rows = Math.ceil(edges.length / EVO_FAN_MAX);
    var base = Math.floor(edges.length / rows), extra = edges.length % rows;
    var out = [], at = 0;
    for (var i = 0; i < rows; i++) {
      var n = base + (i < extra ? 1 : 0);
      out.push(edges.slice(at, at + n));
      at += n;
    }
    return out;
  }
  // Each row is its own .evo-kids, so it paints its own fan bar for free: the
  // bar is the children's own ::before segments and :first-child/:last-child
  // now mean "of this row". The rows-to-parent connection is the left rail
  // .evo-fan draws in CSS — see styles.css.
  function evoFanHtml(edges, curId, counts) {
    var rows = evoFanRows(edges).map(function (row) {
      return '<div class="evo-kids">' + row.map(function (e) {
        return evoSubtreeHtml(e.id, e, curId, counts[e.id] > 1);
      }).join("") + "</div>";
    });
    return rows.length > 1 ? '<div class="evo-fan">' + rows.join("") + "</div>" : rows[0];
  }

  // A node can only show ONE sprite. When its outgoing edges imply DIFFERENT
  // sprites of it, the node is drawn once per implied sprite instead — the
  // tree's version of 0.4.10's one-full-row-per-branch fallback, and the same
  // two causes: a different FORME produces each branch (base Meowth -> Persian
  // vs. Galarian Meowth -> Perrserker, plus the Wooper/Sneasel/Yamask
  // equivalents — 8 species-views in the 1025), or a different GENDER does,
  // but only where female art is actually bundled for that ancestor (Snorunt ->
  // Glalie/Froslass still merges: both copies would draw the same sprite).
  function evoSubtreeHtml(id, via, curId, prefersEdge) {
    var groups = [], keys = [];
    evoEdgesFor(id).forEach(function (e) {
      var gendered = e.gender && evoGenderSpriteUrl(id, e.gender);
      var k = (e.fromFormeKey || "") + "|" + (gendered ? e.gender : "");
      var at = keys.indexOf(k);
      if (at < 0) { keys.push(k); groups.push([e]); } else groups[at].push(e);
    });
    if (!groups.length) groups = [[]];
    return groups.map(function (g) {
      return evoNodeHtml(id, via, g, curId, prefersEdge);
    }).join("");
  }

  // The vertical tree (0.4.13, direction-4 mockup — replaces 0.4.10/0.4.11's
  // merged-cell grid outright, user-directed after a 4-mockup review). Stages
  // flow top-to-bottom from the shared ancestor, centred in a full-width card;
  // each child hangs off a drop line carrying its own condition chip, and a
  // branching node fans its children out sideways under a horizontal bar. The
  // shape is symmetric at every chain size, which is what fixes 0.4.12's
  // deferred complaint: a 2-stage chain (Fearow) is now a short centred tree
  // rather than a small grid stranded in leftover column space.
  //
  // Unlike the grid there is no longest-common-prefix step: recursion shares an
  // ancestor by construction, at any depth and any number of branch points, so
  // 0.4.11's "single branch point assumed" ponytail caveat is gone with it.
  function evoTreeHtml(p) {
    var root = evoRoot(p.id);
    // A species with no evolution relationship at all hides the whole card
    // (0.4.10's rule) rather than showing a "does not evolve" note. evoRoot()
    // walks up first, so an empty edge list here really does mean "nothing
    // above it, nothing below it".
    if (!evoEdgesFor(root).length) return "";
    return '<div class="evo-tree">' + evoSubtreeHtml(root, null, p.id, false) + "</div>" +
      evoNotesHtml(root);
  }

  // ------------------------------------------------------- Mega / Gigantamax
  // Clicking a pill opens that forme's own detail screen (item 7) — the same
  // [data-id]+[data-forme] pair the search grid's forme cards use, so one click
  // handler covers both. Species with no Mega/Gmax forme render no card at all.
  // 0.4.41: the card's title names only what this species actually has, so a
  // Gmax-only line (Meowth) no longer advertises a Mega it doesn't get.
  function megaGmaxTitle(base) {
    var formes = megaGmaxFormes(base);
    var mega = formes.some(function (f) { return f.isMega; });
    var gmax = formes.some(function (f) { return f.isGmax; });
    return mega && gmax ? "Mega &amp; Gigantamax" : gmax ? "Gigantamax" : "Mega Evolution";
  }
  function megaGmaxHtml(p, base) {
    var formes = megaGmaxFormes(base);
    if (!formes.length) return "";
    return '<div class="formes">' + formes.map(function (f) {
      return '<button type="button" class="forme' + (f.key === formeView ? " on" : "") +
        '" data-id="' + base.id + '" data-forme="' + esc(f.key) + '">' +
        altFormeImg(f.sprite, "") + esc(f.name) +
        '<span class="ftag' + (f.isGmax ? " gmax" : "") + '">' + esc(formeTag(base, f)) + "</span></button>";
    }).join("") + "</div>";
  }

  // ------------------------------------------------------------- stat radar
  // Ported from src/app.js's radarSvg(): identical math, fixed 0-255 scale,
  // HP/Atk/Def/Spe/SpD/SpA axis order, a per-axis conic-gradient fill clipped
  // to the stat polygon, colored vertex dots, backdrop hexagon + 2 grid rings.
  // Only the token names differ — desktop spells its --s-* vars out in full.
  var RADAR_AXES = [
    { key: "hp", label: "HP" }, { key: "attack", label: "Atk" }, { key: "defense", label: "Def" },
    { key: "speed", label: "Spe" }, { key: "spDefense", label: "SpD" }, { key: "spAttack", label: "SpA" }
  ];
  var RADAR_MAX = 255;

  // SVG presentation attributes and gradient strings can't resolve CSS custom
  // properties, so the literal triple is read off :root at render time.
  function statColor(key) {
    return "rgb(" + getComputedStyle(document.documentElement).getPropertyValue("--s-" + key).trim() + ")";
  }

  function radarSvg(stats) {
    var cx = 140, cy = 135, r = 105;

    function point(i, radius) {
      var angle = -Math.PI / 2 + i * (Math.PI * 2 / 6);
      return [cx + radius * Math.cos(angle), cy + radius * Math.sin(angle)];
    }

    var outerPts = RADAR_AXES.map(function (a, i) { return point(i, r).join(","); }).join(" ");
    var backdrop = '<polygon points="' + outerPts + '" fill="rgba(120,120,130,0.35)" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>';

    var grid = [1 / 3, 2 / 3].map(function (frac) {
      var pts = RADAR_AXES.map(function (a, i) { return point(i, r * frac).join(","); }).join(" ");
      return '<polygon points="' + pts + '" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>';
    }).join("");

    var statXY = RADAR_AXES.map(function (a, i) {
      return point(i, (Math.min(stats[a.key] || 0, RADAR_MAX) / RADAR_MAX) * r);
    });
    var statPts = statXY.map(function (p) { return p.join(","); }).join(" ");

    // The fill is an HTML div inside a <foreignObject>: a CSS conic-gradient
    // (one stop per axis, in RADAR_AXES order) clipped by clip-path to the
    // same polygon as the outline. Not an SVG <linearGradient>/<clipPath>,
    // which would need ids — and ids collide once a page draws two radars.
    var colors = RADAR_AXES.map(function (a) { return statColor(a.key); });
    var stops = colors.map(function (c, i) { return c + " " + (i * 60) + "deg"; }).join(",") + "," + colors[0] + " 360deg";
    var clip = statXY.map(function (p) { return p[0] + "px " + p[1] + "px"; }).join(",");
    var fill = '<foreignObject x="0" y="0" width="280" height="270">' +
      '<div xmlns="http://www.w3.org/1999/xhtml" style="width:280px;height:270px;opacity:.55;clip-path:polygon(' + clip +
      ');background:conic-gradient(from 0deg at ' + cx + 'px ' + cy + 'px,' + stops + ')"></div></foreignObject>';
    // Vertex dots keep each axis's color identity readable where the
    // translucent conic fill desaturates against the dark card.
    var dots = statXY.map(function (p, i) {
      return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="2.5" fill="' + colors[i] + '"/>';
    }).join("");

    var labels = RADAR_AXES.map(function (a, i) {
      var p = point(i, r + 16);
      return '<text x="' + p[0] + '" y="' + p[1] + '" font-size="10" fill="#f4e3b4" text-anchor="middle" dominant-baseline="middle">' + a.label + "</text>";
    }).join("");

    return '<svg class="radar" viewBox="0 0 280 270" aria-hidden="true">' + backdrop + grid + fill +
      '<polygon points="' + statPts + '" fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="1.5"/>' +
      dots + labels + "</svg>";
  }

  // Doc view only for this pass — compactHtml()'s column is too narrow to be
  // worth it without its own design pass.
  function radarBox(p) {
    var s = statsFor(p);
    return s ? '<div class="box"><h3>Base stats · radar</h3>' + radarSvg(s) + "</div>" : "";
  }

  // --------------------------------------------------------- header pieces

  // sh1's external-link glyph — deliberately NOT the diagonal-arrows expand
  // icon the detail pane already uses for its own sweep.
  var ZOOM_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true">' +
    '<path d="M13 4h7v7" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<path d="M20 4l-8.5 8.5" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>' +
    '<path d="M19 14v4.5A2.5 2.5 0 0 1 16.5 21h-11A2.5 2.5 0 0 1 3 18.5v-11A2.5 2.5 0 0 1 5.5 5H10" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  // 0.4.11: the label sits BELOW the sprite as a non-interactive pill, not as
  // text overlaying the art. The enlarge button stays pinned to the image's own
  // bottom-right, so it needs its own positioning context (.spriteimg) now that
  // the cell is taller than the image.
  function spriteCell(src, label) {
    return '<div class="spritecell"><div class="spriteimg">' + imgTag(src) +
      '<button type="button" class="zoombtn" data-zoom="' + src + '" title="Enlarge sprite">' + ZOOM_SVG + "</button></div>" +
      (label ? '<span class="slabel">' + esc(label) + "</span>" : "") +
      "</div>";
  }

  // Normal + shiny side by side, each with its own enlarge button (item 9). On
  // a Mega/Gmax screen a small base-form sprite sits to the left; it carries a
  // plain data-id (no data-forme), so clicking it navigates back to the base
  // species through the same handler every other stage bubble uses.
  function spriteBay(p, base, forme) {
    var normal = forme ? altFormeUrl(forme.sprite, false) : spriteUrl(base.id);
    var shiny = forme ? altFormeUrl(forme.sprite, true) : shinyUrl(base.id);
    return '<div class="spritebay">' +
      // Only a Mega/Gmax screen needs a way back — an ordinary alt forme reverts
      // by tapping the base bubble in its own Alt formes card (rule 9).
      (isFormeScreen(forme) ? '<button type="button" class="baseback" data-id="' + base.id +
        '" title="Back to ' + esc(base.name) + '">' + spriteImg(base.id, "") + "</button>" : "") +
      spriteCell(normal, "") + spriteCell(shiny, "Shiny") + "</div>";
  }

  // Regional dex numbers, relocated out of their own card into the header's
  // bottom-right (item 4). Same p.regionalDexNumbers data, no change to it.
  function dexNumbersHtml(base) {
    var nums = base.regionalDexNumbers || {};
    var keys = Object.keys(nums);
    if (!keys.length) return "";
    return '<div class="dexnums">' + keys.map(function (r) {
      return "<span>" + esc(r) + " <b>#" + pad(nums[r]) + "</b></span>";
    }).join("") + "</div>";
  }

  // ------------------------------------- moves / found in / alt formes
  // 0.4.39: the three cards the detail pane carried a "later pass" stub for.
  // Data shaping is mobile's verbatim in behaviour (movesCardHtml,
  // foundInCardHtml + openLocationPopup's encounter rendering,
  // altFormsCardHtml); the markup is desktop's own .box/.facts/.area-fold
  // idiom, not a copy of mobile's .detail-section HTML.
  //
  // Each function returns a BODY only, "" meaning "no card at all". compactHtml
  // wraps a body in <section><h3>, docHtml in <div class="box"><h3> — one
  // definition, two shells (detailExtras below).

  var MOVE_TABS = [
    { key: "levelUp", label: "Level-Up" },
    { key: "tm", label: "TM" },
    { key: "egg", label: "Egg" },
    { key: "max", label: "Max" },
    { key: "tutor", label: "Tutor" }
  ];
  // Legends: Arceus learnsets are level-up + tutor only — no TMs, no breeding,
  // no Dynamax (mobile's MOVE_TABS_HISUI).
  var MOVE_TABS_HISUI = [
    { key: "levelUp", label: "Level-Up" },
    { key: "tutor", label: "Tutor" }
  ];

  // Level requirement (level-up tab only, fixed-width column), the move's own
  // type pill from MOVES, then the name. PokeAPI encodes "learned on evolution"
  // as level 0 — shown as "Evo", not "Lv 0".
  function moveListHtml(tab, list, active) {
    var rows = list.map(function (m) {
      var isLevelUp = tab.key === "levelUp";
      var name = isLevelUp ? m.move : m;
      var req = isLevelUp ? '<span class="move-req">' + (m.level === 0 ? "Evo" : "Lv " + m.level) + "</span>" : "";
      var data = MOVES[name];
      return '<div class="move-row">' + req + (data ? onePill(data.type) : "") +
        '<span class="move-name">' + esc(name) + "</span></div>";
    }).join("");
    return '<div class="move-list' + (active ? " active" : "") + '" data-list="' + tab.key + '">' + rows + "</div>";
  }

  // An empty list gets no tab at all (`max` is [] for every entry — no Dynamax
  // in Gen 9), and a species with no moveset data gets no card.
  // The Hisui learnset stands in for the mainline one while the Hisui dex is the
  // active filter — desktop's equivalent of mobile's fromHisuiScreen signal,
  // which has no direct counterpart here (there is no separate Hisui screen).
  function movesBody(base) {
    var hisuiSet = region === "hisui" ? MOVESETS_HISUI[base.id] : null;
    var set = hisuiSet || MOVESETS[base.id];
    if (!set) return "";
    var present = (hisuiSet ? MOVE_TABS_HISUI : MOVE_TABS).filter(function (t) {
      return set[t.key] && set[t.key].length;
    });
    if (!present.length) return "";
    var tabs = present.map(function (t, i) {
      return '<button type="button" class="move-tab' + (i === 0 ? " active" : "") +
        '" data-movetab="' + t.key + '">' + t.label + "</button>";
    }).join("");
    var lists = present.map(function (t, i) { return moveListHtml(t, set[t.key], i === 0); }).join("");
    return '<div class="movesbox"><div class="move-tabs">' + tabs + "</div>" + lists + "</div>";
  }

  // A "/"-joined game list is one unbreakable word to the line breaker, so a
  // long one overflows a narrow column; a <wbr> after each "/" gives it
  // somewhere to wrap (mobile's encGamesHtml).
  function encGamesHtml(games) {
    if (!games) return "";
    return '<span class="enc-games">' + esc(games).replace(/\//g, "/<wbr>") + "</span>";
  }

  // Both source vocabularies can name the same place identically (~40 Sinnoh
  // species carry two "Lake Verity" entries), which reads as two
  // indistinguishable rows. Merge on the exact name, keeping the FIRST
  // occurrence's position so the in-game progression order survives.
  function mergeAreasByName(areas) {
    var out = [], byName = {};
    areas.forEach(function (a) {
      var name = typeof a === "string" ? a : a.area;
      var hit = byName[name];
      if (!hit) {
        byName[name] = { area: name, enc: ((typeof a === "string" ? null : a.enc) || []).slice() };
        out.push(byName[name]);
        return;
      }
      if (typeof a !== "string" && a.enc) hit.enc = hit.enc.concat(a.enc);
    });
    return out;
  }

  function encTitleCase(s) {
    return String(s).split("-").map(function (w) { return w.charAt(0).toUpperCase() + w.slice(1); }).join(" ");
  }
  function encSeg(html) { return html ? " &middot; " + html : ""; }
  function encRangeSeg(prefix, min, max) {
    if (min === undefined) return "";
    return encSeg(prefix + (min === max ? min : min + "&ndash;" + max));
  }
  var TIME_RATE_KEYS = ["morning", "day", "evening", "night"];

  // The optional SV/BDSP/LA encounter fields, in a fixed order after the
  // classic method/Lv/rate segments and before the games sub-line. Every one is
  // conditional, so a classic-shape line renders exactly as it did before.
  // `group`/`tradeFor` are raw source species slugs, shown verbatim.
  function encExtrasHtml(e, id) {
    var out = "";
    if (e.forme) {
      var forme = findForme(id, e.forme);
      out += encSeg(esc(forme ? forme.name : encTitleCase(e.forme)));
    }
    if (e.teraStars !== undefined) out += encSeg(e.teraStars + "&#9733; Tera Raid");
    out += encRangeSeg("Alpha Lv ", e.alphaMin, e.alphaMax);
    ["terrain", "weather", "times"].forEach(function (field) {
      if (e[field] && e[field].length) out += encSeg(esc(e[field].map(encTitleCase).join("/")));
    });
    if (e.timeRates) {
      var keys = TIME_RATE_KEYS.filter(function (k) { return e.timeRates[k] !== undefined; });
      // A single key says nothing the plain `rate` segment doesn't already.
      if (keys.length > 1) {
        out += encSeg(esc(keys.map(function (k) {
          return encTitleCase(k) + " " + String(e.timeRates[k]);
        }).join(", ")));
      }
    }
    if (e.hiddenAbility) out += encSeg("HA possible");
    if (e.boulder) out += encSeg("Requires boulder");
    if (e.group) out += encSeg(esc("with " + e.group));
    out += encRangeSeg("Way Home Lv ", e.homeMin, e.homeMax);
    if (e.tradeFor) out += encSeg(esc("Trade for " + e.tradeFor));
    if (e.note) out += encSeg(esc(e.note));
    return out;
  }

  // Broader than pokemon.js's own `region` field (which only says where a
  // species was INTRODUCED): every region key in LOCATIONS[id] with a non-empty
  // area list is somewhere it can actually be caught. Sorted into REGIONS'
  // canonical order; an unknown key sorts last.
  function foundInRegions(id) {
    var loc = LOCATIONS[id] || {};
    return Object.keys(loc).filter(function (r) { return loc[r] && loc[r].length > 0; })
      .sort(function (a, b) {
        var ia = REGION_IDS.indexOf(a), ib = REGION_IDS.indexOf(b);
        if (ia === -1) ia = REGION_IDS.length;
        if (ib === -1) ib = REGION_IDS.length;
        return ia - ib;
      });
  }

  // SV's two paid-DLC version-group names as an enc line's `games` field spells
  // them: bare ("The Teal Mask") or version-exclusive ("Violet: The Indigo
  // Disk"). Anchored both ends so the base-game labels can never match.
  var DLC_GAMES_RE = /(?:^|: )The (?:Teal Mask|Indigo Disk)$/;

  // True when this region's data exists and EVERY line is DLC-only. Kitakami/
  // Blueberry sit under the plain "paldea" key (there are no separate REGIONS
  // entries for them), so without this a DLC-exclusive species reads as
  // base-game catchable in Scarlet/Violet. A mixed species shows a plain fold.
  function isDlcOnlyRegion(id, regionId) {
    var areas = (LOCATIONS[id] || {})[regionId] || [];
    var lines = areas.reduce(function (acc, a) { return acc.concat((a && a.enc) || []); }, []);
    return lines.length > 0 && lines.every(function (e) { return DLC_GAMES_RE.test(e.games || ""); });
  }

  // Mobile opens a modal popup per region chip. The desktop detail pane has no
  // modal of its own and isn't getting one for this: each region is a <details>
  // fold rendered in place, its areas nested folds inside it — the same
  // .area-fold/.poi-fold convention the Map screen's own area pane already uses,
  // so no new visual language is introduced.
  function areaFoldsHtml(id, regionId) {
    var areas = mergeAreasByName((LOCATIONS[id] || {})[regionId] || []);
    if (!areas.length) return '<div class="enc-line">No specific areas recorded.</div>';
    return areas.map(function (a) {
      // Phase 3's cross-link: an area that the region's map actually draws is a
      // button into the Map screen. Everywhere else (an unmapped region, or an
      // area with no hit-region) it stays plain text, exactly as before.
      var name = mapHasArea(regionId, a.area)
        ? '<button type="button" class="arealink" data-mapregion="' + esc(regionId) +
          '" data-maparea="' + esc(a.area) + '" title="Show on the map">' + esc(a.area) + "</button>"
        : esc(a.area);
      var lines = (a.enc || []).map(function (e) { return encLineHtml(e, id); }).join("");
      // A pre-0.2.7 bare-string entry has no lines to fold open.
      if (!lines) return '<div class="area-mon">' + name + "</div>";
      // A lone area opens by default — there is nothing to scan past, so making
      // the only content cost a click would be strictly worse (mobile's rule).
      return '<details class="area-fold poi-fold"' + (areas.length === 1 ? " open" : "") +
        "><summary>" + name + "</summary>" + lines + "</details>";
    }).join("");
  }

  function foundInBody(base) {
    var regions = foundInRegions(base.id);
    if (!regions.length) {
      // "Evolution only" is only a safe claim when something actually evolves
      // into this species; otherwise just say there is no data.
      return '<div class="stub">' + (evoRoot(base.id) !== base.id
        ? "Not found in the wild — evolution only."
        : "No wild encounter data recorded.") + "</div>";
    }
    return regions.map(function (r) {
      return '<details class="area-fold poi-fold"' + (regions.length === 1 ? " open" : "") +
        "><summary>" + esc(regionLabel(r)) +
        (isDlcOnlyRegion(base.id, r) ? '<span class="ftag soft">DLC</span>' : "") +
        "</summary>" + areaFoldsHtml(base.id, r) + "</details>";
    }).join("");
  }

  // One alt-forme bubble, reusing the Mega/Gmax .forme pill (same data-id +
  // data-forme pair, so the existing delegated click handler covers it with no
  // new wiring). key "" is the base bubble: dataset.forme || null resolves it
  // back to no forme, which is how tapping it reverts.
  function formeBubble(id, key, name, src) {
    return '<button type="button" class="forme' + ((key || null) === formeView ? " on" : "") +
      '" data-id="' + id + '" data-forme="' + esc(key) + '">' + imgTag(src, "") + esc(name) + "</button>";
  }

  // Rules 6 and 7 of SCOPE.md §4's Alt Formes spec. Mega/Gmax are deliberately
  // absent: they have their own card and their own detail screen on desktop
  // (megaGmaxHtml, PLAN.md's Pass 3), and rendering them here too would double
  // every bubble.
  function altFormesBody(base) {
    var data = ALT_FORMS[base.id];
    if (!data || !data.formes) return "";
    var formes = data.formes.filter(function (f) { return !f.isMega && !f.isGmax; });
    if (!formes.length) return "";
    // Optional entry-level `note`: one line under the row, for a forme whose
    // trigger the bubbles alone don't convey (Keldeo's Resolute Forme).
    var note = data.note ? '<div class="enc-line">' + esc(data.note) + "</div>" : "";

    // Rule 6 — recolour-only formes (Unown, Vivillon, Alcremie...) change
    // nothing but their art, so there is nothing to swap and nothing to tap.
    // Mobile collapses them to a "+N" bubble opening a popup gallery; the
    // desktop pane has no popup, so the gallery is a fold instead.
    if (data.recolorOnly) {
      return '<details class="area-fold poi-fold"><summary>' + esc(base.name) + " forms" +
        '<span class="ftag soft">' + formes.length + "</span></summary>" +
        '<div class="formes">' + formes.map(function (f) {
          return '<span class="forme">' + altFormeImg(f.sprite, "") + esc(f.name) + "</span>";
        }).join("") + "</div></details>" + note;
    }

    // Rule 7 — every other forme is its own tappable bubble. Optional
    // `baseName` (Sinistea's "Phony") names the base bubble where the species
    // has a name for it; optional `baseIndex` (Pumpkaboo/Gourgeist) says how
    // many forme bubbles render BEFORE it, so a size range reads Small/Average/
    // Large/Super rather than putting the middle size first.
    var bubbles = formes.map(function (f) {
      return formeBubble(base.id, f.key, f.name, altFormeUrl(f.sprite, false));
    });
    bubbles.splice(data.baseIndex || 0, 0,
      formeBubble(base.id, "", data.baseName || base.name, spriteUrl(base.id)));
    return '<div class="formes">' + bubbles.join("") + "</div>" + note;
  }

  // The three cards, in the order the stub they replace named them. `wrap` is
  // the pane's own card shell; a body of "" drops its card entirely.
  function detailExtras(base, wrap) {
    return wrap("Learnable moves", movesBody(base)) +
      wrap("Found in", foundInBody(base)) +
      wrap("Alt formes", altFormesBody(base));
  }
  function sectionWrap(title, body) {
    return body ? "<section><h3>" + title + "</h3>" + body + "</section>" : "";
  }
  function boxWrap(title, body) {
    return body ? '<div class="box"><h3>' + title + "</h3>" + body + "</div>" : "";
  }

  // A Mega/Gmax forme is shown as its OWN detail screen (PLAN.md's Pass 3):
  // a back-to-base sprite in the header. (0.4.41: it also keeps the BASE
  // species' evolution tree — every node routes through the generic [data-id]
  // dispatch with no data-forme, so any of them is a second way back to the
  // base screen.) An ordinary alt forme
  // is not a screen — it swaps this species' own facts in place (rule 9), so
  // the page around it stays exactly as it was.
  function isFormeScreen(f) { return !!f && !!(f.isMega || f.isGmax); }

  // --t is set once on #compact/#doc by renderDetail(), so it cascades to the
  // boxes here as well as to the head — it used to sit inline on the head only.
  function compactHtml(p, base, forme) {
    var formes = megaGmaxHtml(p, base);
    var evo = evoTreeHtml(base);
    return '<div class="detail-head"><div class="top">' + spriteBay(p, base, forme) +
      '<div><div class="id">#' + pad(base.id) + " · " + esc(base.region) + "</div><h2>" + esc(p.name) + "</h2>" +
      typePills(p.types) + "</div>" +
      '<div class="actions"><button class="iconbtn" data-expand title="Expand to document">⤡</button></div>' +
      "</div>" + dexNumbersHtml(base) + "</div>" +
      '<div class="detail-body">' +
      (p.description ? '<p class="desc">' + esc(p.description) + "</p>" : "") +
      '<div class="facts">' +
      '<div class="fact"><b>Category</b><span>' + esc(p.category || "—") + "</span></div>" +
      '<div class="fact"><b>Egg groups</b><span>' + esc((p.eggGroups || []).join(", ") || "—") + "</span></div>" +
      '<div class="fact"><b>Height</b><span>' + meters(p.height) + "</span></div>" +
      '<div class="fact"><b>Weight</b><span>' + kilos(p.weight) + "</span></div>" +
      "</div>" +
      "<section><h3>Abilities</h3>" + abilityRows(p, false) + "</section>" +
      // Item 2's reorder, explicitly approved: Base Stats -> Evolution Line ->
      // Mega/Gmax. Mega/Gmax used to sit above Evolution.
      "<section>" + statsHtml(p) + "</section>" +
      (evo ? '<section class="evosection"><h3>Evolution</h3>' + evo + "</section>" : "") +
      (formes ? "<section><h3>" + megaGmaxTitle(base) + "</h3>" + formes + "</section>" : "") +
      detailExtras(base, sectionWrap) +
      "</div>";
  }

  function defenseBox(p) {
    var rows = TYPE_NAMES.map(function (a) { return [a, defenseMultiplier(a, p.types)]; });
    function group(label, filter, dim) {
      var pills = rows.filter(filter).map(function (r) {
        var m = r[1] === 0.5 ? "½" : r[1] === 0.25 ? "¼" : r[1];
        return '<span class="pill" style="' + typeVar(r[0]) + (dim ? ";opacity:" + dim : "") + '">' +
          esc(r[0]) + " ×" + m + "</span>";
      }).join("");
      return "<h3 style=\"margin-top:8px;font-size:10px\">" + label + '</h3><div class="pillrow">' +
        (pills || '<span class="none">none</span>') + "</div>";
    }
    return '<div class="box"><h3>Type defenses</h3>' +
      group("Weak to", function (r) { return r[1] > 1; }) +
      group("Resists", function (r) { return r[1] > 0 && r[1] < 1; }, ".65") +
      group("Immune", function (r) { return r[1] === 0; }, ".45") +
      "</div>";
  }

  // 0.4.12 (user-requested): "Training & breeding" is now just "Data", laid out
  // in the same two-column .facts/.fact grid the Facts card uses rather than the
  // old single-column .kv list, and rendered under Type defenses in column 2
  // instead of under the radar in column 3 — that frees column 3 for the Moves
  // card once it's wired in.
  function dataBox(p) {
    var s = statsFor(p) || {};
    var ev = s.effort || {};
    var yields = STAT_KEYS.filter(function (k) { return ev[k[0]]; })
      .map(function (k) { return k[1] + " +" + ev[k[0]]; }).join(", ");
    var rows = [
      ["Capture rate", s.captureRate],
      ["Base friendship", s.baseHappiness],
      ["Hatch counter", s.hatchCounter],
      ["Base experience", p.baseExperience],
      ["Growth", (s.expGrowth || {}).curve],
      ["EV yield", yields]
    ];
    return '<div class="box"><h3>Data</h3><div class="facts">' + rows.map(function (r) {
      return '<div class="fact"><b>' + esc(r[0]) + "</b><span>" +
        esc(r[1] == null || r[1] === "" ? "—" : r[1]) + "</span></div>";
    }).join("") + "</div></div>";
  }

  function docHtml(p, base, forme) {
    var formes = megaGmaxHtml(p, base);
    var evo = evoTreeHtml(base);
    var list = currentList();
    var i = list.indexOf(base);
    var prev = (list[i - 1] || base).id, next = (list[i + 1] || base).id;

    return '<div class="dhead">' + spriteBay(p, base, forme) +
      '<div class="dheadmain"><div class="id">#' + pad(base.id) + " · " + esc(base.region) +
      (p.category ? " · " + esc(p.category) : "") + "</div><h2>" + esc(p.name) + "</h2>" +
      typePills(p.types) + (p.description ? '<p class="desc">' + esc(p.description) + "</p>" : "") + "</div>" +
      '<div class="nav2">' +
      '<button class="iconbtn" data-id="' + prev + '" title="Previous (←)">◀</button>' +
      '<button class="iconbtn" data-id="' + next + '" title="Next (→)">▶</button>' +
      '<button class="iconbtn" data-expand title="Back to three-pane (Esc)">⇥ Collapse</button>' +
      "</div>" + dexNumbersHtml(base) + "</div>" +
      // .cols is a flex row of [.colgroup, column 3]; .colgroup wraps the
      // .colpair holding columns 1+2. It existed to host full-width bands under
      // that pair — 0.4.14 moved Evolution out, 0.4.41 moved Mega/Gmax into
      // column 2, so there are no bands left. The wrappers stay (CSS keys the
      // column widths off them); .docband is gone.
      '<div class="cols">' +
      '<div class="colgroup"><div class="colpair">' +
      '<div class="col">' +
      '<div class="box"><h3>Facts</h3><div class="facts">' +
      '<div class="fact"><b>Category</b><span>' + esc(p.category || "—") + "</span></div>" +
      '<div class="fact"><b>Egg groups</b><span>' + esc((p.eggGroups || []).join(", ") || "—") + "</span></div>" +
      '<div class="fact"><b>Height</b><span>' + meters(p.height) + "</span></div>" +
      '<div class="fact"><b>Weight</b><span>' + kilos(p.weight) + "</span></div>" +
      "</div></div>" +
      '<div class="box"><h3>Abilities</h3>' + abilityRows(p, true) + "</div>" +
      // 0.4.14: Evolution is an ordinary column-1 card under Abilities, not the
      // full-width band it was from 0.4.10. The band existed because the old
      // merged-cell grid needed the width; 0.4.13's tree is narrow and centred,
      // so the band just wasted the space either side and pushed everything
      // below it down. A chain wider than the column scrolls sideways inside
      // .evocard .evo-tree (same hidden-scrollbar rule the compact pane uses).
      (evo ? '<div class="box evocard"><h3>Evolution</h3>' + evo + "</div>" : "") +
      "</div>" +
      '<div class="col">' +
      '<div class="box">' + statsHtml(p) + "</div>" +
      defenseBox(p) +
      dataBox(p) +
      // 0.4.41 (user-requested): the Mega/Gmax card sits under Data in column 2
      // instead of the full-width band it was under both columns.
      (formes ? '<div class="box"><h3>' + megaGmaxTitle(base) + "</h3>" + formes + "</div>" : "") +
      "</div>" +
      "</div>" +
      "</div>" +
      '<div class="col">' +
      radarBox(p) +
      detailExtras(base, boxWrap) +
      "</div>" +
      "</div>";
  }

  function renderDetail() {
    var work = document.getElementById("work");
    var compact = document.getElementById("compact");
    var doc = document.getElementById("doc");
    var isDex = screen === "dex";

    work.classList.toggle("no-doc", !isDex);
    if (!isDex) {
      // --t is a species' type key; the last Dex selection's would otherwise
      // stay on the element and tint an area panel at random.
      compact.style.removeProperty("--t");
      // The Map screen renders the selected area here. Nothing else does yet, so
      // every other screen keeps the generic stub. `doc` stays empty either way:
      // expand-to-document is Dex-only.
      compact.innerHTML = screen === "map" ? areaDetailHtml()
        : '<div class="detail-body"><div class="stub">Nothing selected on this screen yet.</div></div>';
      // Every path that changes the selected area ends here, so this is the one
      // place the map's own highlight has to be kept in step (0.4.39).
      if (screen === "map") applyAreaHighlight();
      doc.innerHTML = "";
      document.getElementById("navDetailTile").innerHTML = "";
      document.getElementById("navDetailName").textContent = "—";
      document.getElementById("navDetailKbd").textContent = "";
      document.getElementById("statusSel").textContent = "—";
      document.getElementById("statusCount").textContent = "—";
      return;
    }

    var base = byId(selectedId);
    var forme = formeView ? findForme(base.id, formeView) : null;
    if (formeView && !forme) formeView = null;
    var p = forme ? formeEntry(base, forme) : base;

    // Set the species' type key ONCE on each container: .detail-head/.dhead
    // are siblings of the .box cards, not their ancestors, so an inline --t on
    // the head alone never reached them and every box fell back to flat chrome.
    var tv = typeRef(primaryType(p));
    compact.style.setProperty("--t", tv);
    doc.style.setProperty("--t", tv);

    compact.innerHTML = compactHtml(p, base, forme);
    doc.innerHTML = docHtml(p, base, forme);
    document.getElementById("navDetailTile").innerHTML =
      forme ? altFormeImg(forme.sprite, "") : spriteImg(base.id, "");
    document.getElementById("navDetailName").textContent = p.name;
    document.getElementById("navDetailKbd").textContent = "#" + pad(base.id);
    document.getElementById("statusSel").textContent = p.name;
    document.getElementById("statusCount").textContent = currentList().length + " of " + POKEMON_DATA.length;
  }

  // ---------------------------------------------------------- sprite popup
  // The codebase's first popup of any kind. Deliberately one shared element in
  // index.html rather than a per-sprite overlay: the enlarge buttons only ever
  // hand it a URL.
  //
  // 0.4.43: the same overlay now also hosts a titled HTML card (#lightboxCard)
  // for the Map screen's area chips. One backdrop, one Esc handler, one
  // close-on-outside-click — the two modes just swap which child is visible.

  function openLightbox(src) {
    var box = document.getElementById("lightbox");
    var img = document.getElementById("lightboxImg");
    var card = document.getElementById("lightboxCard");
    if (!box || !img) return;
    img.src = src;
    img.hidden = false;
    if (card) card.hidden = true;
    box.hidden = false;
  }
  function openPopup(title, bodyHtml) {
    var box = document.getElementById("lightbox");
    var img = document.getElementById("lightboxImg");
    var card = document.getElementById("lightboxCard");
    if (!box || !card) return;
    if (img) img.hidden = true;
    card.innerHTML = "<h3>" + esc(title) + "</h3>" + bodyHtml;
    card.hidden = false;
    box.hidden = false;
  }
  function closeLightbox() {
    var box = document.getElementById("lightbox");
    if (box) box.hidden = true;
  }
  function lightboxOpen() {
    var box = document.getElementById("lightbox");
    return !!box && box.hidden === false;
  }

  // -------------------------------------------------------------- render

  function renderNav() {
    var rows = document.querySelectorAll(".nav a[data-screen]");
    for (var i = 0; i < rows.length; i++) {
      rows[i].classList.toggle("active", rows[i].dataset.screen === screen);
    }
    document.getElementById("navDetail").classList.toggle("active", expanded);
  }

  function render() {
    renderNav();
    renderCenter();
    renderDetail();
  }

  function setExpanded(on) {
    if (on && screen !== "dex") return;
    expanded = on;
    document.getElementById("work").classList.toggle("expanded", on);
    renderNav();
  }

  function setRail(on) {
    rail = on;
    document.getElementById("app").classList.toggle("rail", on);
    document.getElementById("railTile").innerHTML = on ? "&#187;" : "&#171;";
    document.getElementById("railToggle").checked = on;
  }

  function setGridCols(cols) {
    gridCols = String(cols);
    document.documentElement.style.setProperty("--card-min", GRID_COL_MIN[gridCols] || GRID_COL_MIN["5"]);
  }
  function setPixelSprites(on) {
    pixelSprites = on;
    document.body.classList.toggle("smooth-sprites", !on);
  }

  function select(id, formeKey) {
    if (!byId(id)) return;
    selectedId = id;
    formeView = formeKey || null;
    var cards = document.querySelectorAll("#center .card");
    for (var i = 0; i < cards.length; i++) {
      var on = +cards[i].dataset.id === id && (cards[i].dataset.forme || null) === formeView;
      cards[i].classList.toggle("sel", on);
      if (on) cards[i].scrollIntoView({ block: "nearest" });
    }
    renderDetail();
  }

  // Keep the selection inside the visible list after a filter/search change.
  function clampSelection() {
    var list = currentList();
    if (!list.length) return;
    if (!list.some(function (p) { return p.id === selectedId; })) { selectedId = list[0].id; formeView = null; }
  }

  // 0.4.12: back out of a live search, landing on exactly the state a fresh
  // "All" chip gives — empty query, region "all", selection clamped back into
  // the visible list. Returns whether anything actually changed, so a caller
  // can skip a pointless full re-render. Does NOT render itself: every caller
  // already has a render of its own to fold this into.
  function clearSearch() {
    if (!query) return false;
    query = "";
    region = "all";
    clampSelection();
    return true;
  }

  function go(next) {
    // Clicking Dex (or Ctrl+1) while a search is running clears it, even when
    // the Dex screen is already the current one — one of the three "back out of
    // search" gestures, alongside Esc and the All chip.
    var changed = screen !== next;
    if (next === "dex" && clearSearch()) changed = true;
    if (!changed) return;
    screen = next;
    if (expanded) setExpanded(false);
    render();
  }

  // -------------------------------------------------------------- events

  document.addEventListener("click", function (e) {
    if (e.target.id === "lightbox") { closeLightbox(); return; }

    var zoom = e.target.closest("[data-zoom]");
    if (zoom) { openLightbox(zoom.dataset.zoom); return; }

    // A Map-screen area chip (0.4.43). The index is only ever valid against the
    // areaPopups the CURRENT pane render filled, which is fine: any re-render
    // replaces both at once.
    var pop = e.target.closest("[data-pop]");
    if (pop) {
      var popData = areaPopups[+pop.dataset.pop];
      if (popData) openPopup(popData.title, popData.body);
      return;
    }

    if (e.target.closest("[data-rail]")) { setRail(!rail); return; }

    var nav = e.target.closest("[data-screen]");
    if (nav) { go(nav.dataset.screen); return; }

    var chip = e.target.closest("[data-region]");
    if (chip) {
      // The Map screen reuses the same chip markup, so it has to claim the
      // click before the Dex's own filter state is touched.
      if (screen === "map") {
        mapRegion = chip.dataset.region;
        mapZoom = 1;
        mapPanX = 0;
        mapPanY = 0;
        selectedArea = null;   // an area name only means anything in its own region
        selectedAreaKind = "";
        render();
        return;
      }
      // The All chip doubles as the search reset (0.4.12); every other chip
      // narrows the region and leaves the query alone, as before.
      if (chip.dataset.region === "all") query = "";
      region = chip.dataset.region;
      clampSelection();
      render();
      return;
    }

    var mz = e.target.closest("[data-mapzoom]");
    if (mz) {
      var mzVp = document.getElementById("mapViewport");
      if (mzVp) {
        var mzR = mzVp.getBoundingClientRect();
        zoomMapAt(mzR.left + mzR.width / 2, mzR.top + mzR.height / 2,
          mz.dataset.mapzoom === "in" ? MAP_ZOOM_STEP : -MAP_ZOOM_STEP);
      }
      return;
    }

    // A map hit-region: one delegated listener over the inlined SVG's
    // transparent overlay (0.4.33). Scoped to the Map screen because
    // [data-area] is the map asset's own attribute and nothing else uses it.
    var hit = screen === "map" && e.target.closest("[data-area]");
    if (hit) {
      // The click that ends a pan lands on whatever is under the cursor; that
      // press was a drag, not a selection.
      if (mapDragged) return;
      selectedArea = hit.dataset.area;
      selectedAreaKind = hit.dataset.kind || "";
      renderDetail();   // the map's own pan/zoom/markup state is untouched
      return;
    }

    // Phase 3's cross-link (0.4.39). The button lives inside a <summary>, whose
    // default click action is toggling its own <details> — preventDefault stops
    // the fold flapping open on the way out to the Map screen.
    var link = e.target.closest("[data-maparea]");
    if (link) {
      e.preventDefault();
      goToMapArea(link.dataset.mapregion, link.dataset.maparea);
      return;
    }

    // Learnable Moves tab bar. Scoped to the .movesbox it was clicked in: the
    // compact pane and the document view both render one, and they keep their
    // own tab independently.
    var tab = e.target.closest("[data-movetab]");
    if (tab) {
      var box = tab.closest(".movesbox");
      if (box) {
        var tabs = box.querySelectorAll(".move-tab");
        for (var t = 0; t < tabs.length; t++) tabs[t].classList.toggle("active", tabs[t] === tab);
        var lists = box.querySelectorAll(".move-list");
        for (var l = 0; l < lists.length; l++) {
          lists[l].classList.toggle("active", lists[l].dataset.list === tab.dataset.movetab);
        }
      }
      return;
    }

    var seg = e.target.closest("[data-setting]");
    if (seg) { applySetting(seg.dataset.setting, seg.dataset.value); return; }

    if (e.target.closest("[data-expand]")) { setExpanded(!expanded); return; }

    // Covers grid cards, search-result forme cards, Mega/Gmax pills, evolution
    // slots, the header's base-form sprite and the doc view's prev/next —
    // data-forme is present only where a forme screen is meant to open.
    var card = e.target.closest("[data-id]");
    if (card) { select(+card.dataset.id, card.dataset.forme || null); }
  });

  function applySetting(setting, value) {
    if (setting === "units") {
      useImperialUnits = value === "imperial";
      writeRaw(UNITS_KEY, value);
    } else if (setting === "cols") {
      setGridCols(value);
      writeRaw(GRID_COLS_KEY, value);
    } else {
      return;
    }
    render();
  }

  document.addEventListener("input", function (e) {
    if (e.target.id === "searchInput") {
      query = e.target.value;
      clampSelection();
      // Only the grid + count are re-rendered, so the input keeps focus/caret.
      var grid = document.getElementById("grid");
      var count = document.querySelector("#center .toolbar .count");
      if (count) count.textContent = currentList().length + " of " + POKEMON_DATA.length;
      if (grid) grid.outerHTML = gridHtml();
      renderDetail();
    }
  });

  document.addEventListener("change", function (e) {
    var id = e.target.id;
    if (id === "railDefaultToggle") {
      railDefault = e.target.checked;
      writeSetting(SIDEBAR_KEY, railDefault);
      setRail(railDefault);
    } else if (id === "shinyGridsToggle") {
      useShinyGrids = e.target.checked;
      writeSetting(SHINY_KEY, useShinyGrids);
    } else if (id === "pixelSpritesToggle") {
      setPixelSprites(e.target.checked);
      writeSetting(PIXEL_KEY, pixelSprites);
    }
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && lightboxOpen()) { closeLightbox(); return; }
    if (e.key === "Escape" && expanded) { setExpanded(false); return; }
    // Esc backs out of a live search (0.4.12). Deliberately ABOVE the
    // input/textarea guard below, so it fires while the search box itself has
    // focus — which is where the user almost always is when they press it.
    if (e.key === "Escape" && clearSearch()) { render(); return; }
    if (e.ctrlKey && (e.key === "b" || e.key === "B")) { e.preventDefault(); setRail(!rail); return; }
    if (e.ctrlKey && e.key === ",") { e.preventDefault(); go("settings"); return; }
    if (e.ctrlKey && "123456".indexOf(e.key) >= 0) {
      e.preventDefault();
      go(["dex", "favorites", "bag", "types", "natures", "map"][+e.key - 1]);
      return;
    }
    if (screen !== "dex") return;
    if (e.target.matches("input,select,textarea")) return;

    var ids = currentList().map(function (p) { return p.id; });
    var i = ids.indexOf(selectedId);
    if (i < 0) return;
    var grid = document.getElementById("grid");
    var first = grid && grid.querySelector(".card");
    var cols = (expanded || !first) ? 1 : Math.max(1, Math.round(grid.clientWidth / (first.offsetWidth + 10)));
    var step = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: cols, ArrowUp: -cols }[e.key];
    if (step == null) return;
    e.preventDefault();
    select(ids[Math.min(ids.length - 1, Math.max(0, i + step))]);
  });

  // Plain wheel over the map viewport zooms at the cursor (0.4.20 — no Ctrl:
  // drag now owns panning, so the wheel is free, matching every other map UI).
  // preventDefault stops the page scrolling/zooming underneath it; passive:false
  // is what makes that preventDefault() actually bind.
  document.addEventListener("wheel", function (e) {
    if (screen !== "map") return;
    if (!e.target.closest("#mapViewport")) return;
    e.preventDefault();
    zoomMapAt(e.clientX, e.clientY, e.deltaY < 0 ? MAP_ZOOM_STEP : -MAP_ZOOM_STEP);
  }, { passive: false });

  // The hover head-start for the map SVG (0.4.22's warm <img> decode, then
  // 0.4.31's early fetch on the sidebar Map row and the region chips) is gone
  // as of 0.4.35: the markup is a <script>-loaded constant that is already in
  // memory before the first paint, so there is nothing left to warm.

  // Click-and-drag panning. Pointer Events, not mouse events — one code path
  // for mouse/touch/pen, same reason mobile's drawer swipe uses them.
  // ponytail: no pan-bounds clamp, add if the map can be dragged fully out of
  // view and that's confirmed to be a problem.
  document.addEventListener("pointerdown", function (e) {
    mapDragged = false;   // before the guards, so no stale true reaches a click
    if (screen !== "map") return;
    var vp = e.target.closest("#mapViewport");
    // Don't start a drag on the zoom cluster — those are buttons.
    if (!vp || e.target.closest("[data-mapzoom]")) return;
    // NOTHING that suppresses the press happens here (0.4.34). Both of the
    // things that used to — preventDefault() and setPointerCapture() — break
    // 0.4.33's area selection, which is wired off `click`:
    //   * preventDefault() on pointerdown suppresses that pointer's whole
    //     compatibility mouse-event stream (Pointer Events spec), so mousedown,
    //     and therefore `click`, never fire. Unconditional here, it meant NO
    //     click anywhere in the viewport, ever — the real 0.4.33 regression.
    //   * pointer capture retargets the click to the capture element, so the
    //     click that did survive would arrive on #mapViewport, where
    //     closest("[data-area]") finds nothing.
    // Both are deferred to the moment pointermove confirms a real pan (same
    // "wait for the gesture to prove itself" shape as 0.4.32's GPU-layer
    // scoping). A press with no movement does neither, so its click reaches the
    // hit region. The drag-select highlight 0.4.21 killed with preventDefault()
    // is covered by .map-viewport's user-select:none plus the selectstart guard
    // below, which is the purpose-built hook for it.
    mapDrag = { x: e.clientX, y: e.clientY, panX: mapPanX, panY: mapPanY, id: e.pointerId, vp: vp };
    vp.classList.add("dragging");
    markMapGesture();     // promote before the first move, not on it (0.4.32)
  });

  // user-select:none only covers the viewport itself; once a pan drags the
  // cursor out over the rest of the chrome, the browser would happily start
  // selecting there. Live only while a map drag is in progress.
  document.addEventListener("selectstart", function (e) { if (mapDrag) e.preventDefault(); });

  document.addEventListener("pointermove", function (e) {
    if (!mapDrag || e.pointerId !== mapDrag.id) return;
    if (!mapDragged &&
        (Math.abs(e.clientX - mapDrag.x) >= MAP_DRAG_SLOP ||
         Math.abs(e.clientY - mapDrag.y) >= MAP_DRAG_SLOP)) {
      mapDragged = true;
      // Confirmed pan: take the capture pointerdown deliberately skipped, so
      // the rest of the drag behaves exactly as it did before 0.4.34.
      mapDrag.vp.setPointerCapture(mapDrag.id);
    }
    mapPanX = mapDrag.panX + (e.clientX - mapDrag.x);
    mapPanY = mapDrag.panY + (e.clientY - mapDrag.y);
    applyMapTransform();  // never render(), same reason as the zoom path
    markMapGesture();     // already promoted; this only pushes the idle timer out
  });

  function endMapDrag(e) {
    if (!mapDrag || e.pointerId !== mapDrag.id) return;
    mapDrag = null;
    markMapGesture();     // starts the idle countdown from the gesture's end

    var vp = document.getElementById("mapViewport");
    if (vp) vp.classList.remove("dragging");
  }
  document.addEventListener("pointerup", endMapDrag);
  document.addEventListener("pointercancel", endMapDrag);

  // ---------------------------------------------------------------- init

  // Read before the first render (SCOPE.md §3's convention): index.html ships
  // with .rail already on, so this only ever has to REMOVE it.
  railDefault = readSetting(SIDEBAR_KEY, true);
  setRail(railDefault);
  useImperialUnits = readRaw(UNITS_KEY, "metric") === "imperial";
  useShinyGrids = readSetting(SHINY_KEY, false);
  setPixelSprites(readSetting(PIXEL_KEY, true));
  setGridCols(readRaw(GRID_COLS_KEY, "5"));

  document.getElementById("sidebarFoot").textContent =
    POKEMON_DATA.length + " Pokémon · " + REGIONS.filter(function (r) { return !r.standalone; }).length + " regions";
  document.getElementById("statusVersion").textContent = "VKDex v" + APP_VERSION + " · desktop";

  render();
})();
