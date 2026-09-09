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
  // Region ids with a maps/<id>.svg on disk. One entry for now; adding a map
  // means adding the file and its id here.
  var MAPPED_REGIONS = { kanto: 1 };

  function mapHtml() {
    // Same chip markup as dexHtml()'s region bar (so the existing
    // [data-region="hisui"/"orre"] tints apply for free), minus the "All"
    // entry — a combined map makes no sense.
    var chips = REGIONS.map(function (r) {
      var cls = (r.id === mapRegion ? "on " : "") + (r.standalone ? "standalone" : "");
      return '<button data-region="' + esc(r.id) + '" class="' + cls.trim() + '"><span>' + esc(r.label) + "</span></button>";
    }).join("");

    var label = (REGIONS.filter(function (r) { return r.id === mapRegion; })[0] || {}).label || mapRegion;
    var body = MAPPED_REGIONS[mapRegion]
      ? mapViewportHtml()
      : '<div class="placeholder"><div><h2>Not mapped yet</h2><p>' + esc(label) +
        "'s map hasn't been drawn yet.</p></div></div>";

    return '<div class="toolbar"><h1>Map</h1></div>' +
      '<div class="regions">' + chips + "</div>" + body;
  }

  // Panning is pointer-drag only (0.4.20) — .map-viewport is overflow:hidden,
  // so the browser's own scrollbars are out of the picture entirely.
  // draggable="false" stops Chromium's native image drag-and-drop from
  // hijacking the pointer gesture the moment the cursor moves.
  function mapViewportHtml() {
    return '<div class="map-viewport" id="mapViewport">' +
      '<img class="map-svg" id="mapSvg" draggable="false" src="maps/' + esc(mapRegion) + '.svg" alt="' + esc(mapRegion) +
      ' region map" style="transform:' + mapTransform() + '">' +
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
  }

  // Warm-decode one region's SVG so the first zoom/drag isn't competing with
  // the browser still rasterising an 80KB filter-heavy image (0.4.21's
  // will-change fixed layer promotion, not decode cost). Hover-triggered only —
  // never at boot, never for a region the user hasn't aimed at.
  function warmMapImage(region) {
    if (!MAPPED_REGIONS[region]) return;   // no SVG on disk -> don't 404
    var im = new Image();
    im.src = "maps/" + region + ".svg";
    if (im.decode) im.decode().catch(function () {});   // best-effort
  }

  // Blur fix, 0.4.25 -> widened 0.4.27 -> re-timed 0.4.28. The Map screen
  // renders soft on first open until you navigate away and back. That manual
  // workaround works because a screen switch re-runs renderCenter()'s
  // `el.innerHTML = mapHtml()` for the WHOLE #center pane — toolbar title,
  // region chips and viewport alike — so do exactly that ourselves, once.
  //
  // The rebuild itself is confirmed necessary but was never sufficient: 0.4.25
  // and 0.4.27 both scheduled it on a double rAF (~1 frame, ~16-33ms after the
  // first paint) and both failed on real hardware, while the identical rebuild
  // done by hand seconds later always fixes it. Passive waiting with no rebuild
  // at all never self-heals either (user-confirmed, 5-10s idle). So the missing
  // ingredient is elapsed time, not "the DOM has settled": something async in
  // the compositor (plausibly the layer for will-change:transform'd .map-svg)
  // isn't ready at the 30ms mark, and a rebuild that early just re-rasterises
  // a second blurry frame. 600ms reproduces the real human reaction time of the
  // one workaround known to work.
  // ponytail: 600ms is a guessed ceiling — there is no "GPU resource ready"
  // event to hook, so it's a heuristic. Raise it if it still blurs; replace it
  // with a real signal if one ever exists.
  // mapHtml() reads only mapRegion/pan/zoom, so re-running it is safe at any
  // time and covers the unmapped-region placeholder branch for free.
  function resettleMapImage() {
    setTimeout(function () {
      // screen may have changed within the delay window.
      var el = document.getElementById("center");
      if (el && screen === "map") el.innerHTML = mapHtml();
    }, 600);
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
    else if (screen === "map") { el.innerHTML = mapHtml(); resettleMapImage(); }
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
    return Object.assign({}, p, {
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
      (forme ? '<button type="button" class="baseback" data-id="' + base.id +
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

  // --t is set once on #compact/#doc by renderDetail(), so it cascades to the
  // boxes here as well as to the head — it used to sit inline on the head only.
  function compactHtml(p, base, forme) {
    var formes = megaGmaxHtml(p, base);
    var evo = forme ? "" : evoTreeHtml(base);
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
      (formes ? "<section><h3>Mega &amp; Gigantamax</h3>" + formes + "</section>" : "") +
      '<section><h3>Moves &middot; Locations &middot; Alt formes</h3><div class="stub">Not wired into the desktop pane yet — a later pass.</div></section>' +
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
    var evo = forme ? "" : evoTreeHtml(base);
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
      // 0.4.11: the bands used to be later ROWS of one shared 3-track grid, so
      // they waited on the tallest of the three columns — usually column 3 —
      // leaving a dead gap under the other two. Now .cols is a flex row of
      // [.colgroup, column 3]: the Mega/Gmax band lives inside .colgroup, under
      // the .colpair holding columns 1+2, so its top depends on max(col1, col2)
      // only. Column 3 is an independent strip that runs alongside it.
      // (0.4.14: Evolution left the band set and is a plain column-1 card now,
      // so the band mechanism has exactly one user left.)
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
      "</div>" +
      "</div>" +
      (formes ? '<div class="box docband"><h3>Mega &amp; Gigantamax</h3>' + formes + "</div>" : "") +
      "</div>" +
      '<div class="col">' +
      radarBox(p) +
      '<div class="box"><h3>Moves &middot; Locations &middot; Alt formes</h3>' +
      '<div class="stub">These three still live only in the mobile frontend. The document view has the width for them — they are a later desktop pass, not a dropped feature.</div></div>' +
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
      compact.innerHTML = '<div class="detail-body"><div class="stub">Nothing selected on this screen yet.</div></div>';
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

  function openLightbox(src) {
    var box = document.getElementById("lightbox");
    var img = document.getElementById("lightboxImg");
    if (!box || !img) return;
    img.src = src;
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

  // Hover head-start for the map image (0.4.22). mouseenter doesn't bubble, so
  // this is the standard mouseover + relatedTarget trick: relatedTarget is the
  // node the cursor came FROM, so "it isn't inside this element" == a genuine
  // enter, not a move between the row's own child spans. contains(null) is
  // false, so entering from outside the window still counts.
  document.addEventListener("mouseover", function (e) {
    // The sidebar's Map row: fires well before the click, and mapRegion is
    // whatever the Map screen will show when it opens (Kanto by default).
    var mapRow = e.target.closest('[data-screen="map"]');
    if (mapRow && !mapRow.contains(e.relatedTarget)) warmMapImage(mapRegion);

    // The Map screen's own region chips. Scoped to screen === "map" because the
    // Dex's region filter chips reuse [data-region] for something unrelated.
    var mapChip = screen === "map" && e.target.closest("[data-region]");
    if (mapChip && !mapChip.contains(e.relatedTarget)) warmMapImage(mapChip.dataset.region);
  });

  // Click-and-drag panning. Pointer Events, not mouse events — one code path
  // for mouse/touch/pen, same reason mobile's drawer swipe uses them.
  // ponytail: no pan-bounds clamp, add if the map can be dragged fully out of
  // view and that's confirmed to be a problem.
  document.addEventListener("pointerdown", function (e) {
    if (screen !== "map") return;
    var vp = e.target.closest("#mapViewport");
    // Don't start a drag on the zoom cluster — those are buttons.
    if (!vp || e.target.closest("[data-mapzoom]")) return;
    // Suppresses the native drag-select gesture (the blue highlight that showed
    // up mid-pan and ate subsequent input); pairs with .map-viewport's
    // user-select:none. Buttons are already excluded by the guard above.
    e.preventDefault();
    mapDrag = { x: e.clientX, y: e.clientY, panX: mapPanX, panY: mapPanY, id: e.pointerId };
    vp.setPointerCapture(e.pointerId);
    vp.classList.add("dragging");
  });

  document.addEventListener("pointermove", function (e) {
    if (!mapDrag || e.pointerId !== mapDrag.id) return;
    mapPanX = mapDrag.panX + (e.clientX - mapDrag.x);
    mapPanY = mapDrag.panY + (e.clientY - mapDrag.y);
    applyMapTransform();  // never render(), same reason as the zoom path
  });

  function endMapDrag(e) {
    if (!mapDrag || e.pointerId !== mapDrag.id) return;
    mapDrag = null;
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
