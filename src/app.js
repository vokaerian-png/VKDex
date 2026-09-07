(function () {
  "use strict";

  var phone = document.getElementById("phone");
  var menu = document.getElementById("sideMenu");
  var overlay = document.getElementById("overlay");
  var edgeZone = document.getElementById("edgeZone");
  var menuHeader = document.querySelector(".menu-header");

  // --- Tauri window scaling ---
  // In the packaged app (see index.html's early "is-tauri" check), the
  // window's minimum size is locked to the phone frame's native 360x800
  // and can only grow from there (src-tauri/tauri.conf.json). --phone-scale
  // (read by styles.css's `.is-tauri .phone { transform: scale(...) }`) is
  // what actually grows the frame to match: 1 at the 360x800 minimum,
  // growing as the window does. Plain-browser usage never sets "is-tauri",
  // so phoneScale stays 1 and none of this changes anything there.
  var PHONE_BASE_WIDTH = 360;
  var PHONE_BASE_HEIGHT = 800;
  var phoneScale = 1;

  if (document.documentElement.classList.contains("is-tauri")) {
    var scaleRafId = null;
    var applyPhoneScale = function () {
      scaleRafId = null;
      phoneScale = Math.min(window.innerWidth / PHONE_BASE_WIDTH, window.innerHeight / PHONE_BASE_HEIGHT);
      document.documentElement.style.setProperty("--phone-scale", phoneScale);
    };
    applyPhoneScale();
    window.addEventListener("resize", function () {
      if (scaleRafId !== null) return;
      scaleRafId = requestAnimationFrame(applyPhoneScale);
    });

    // --- 360:800 aspect-ratio lock ---
    // Electron gave this for free (win.setAspectRatio, electron-app/main.js);
    // Tauri has no equivalent window option, so hold the ratio by hand.
    // Once a resize has settled, derive the dimension the user dragged LESS
    // from the one they dragged more (so pulling a bottom edge grows the
    // window instead of snapping straight back) and correct via Tauri's
    // window API. Only fires when actually off-ratio, and the size it sets
    // is on-ratio by construction, so the resize event that follows falls
    // through the epsilon check instead of looping.
    // Needs `core:window:allow-set-size` (src-tauri/capabilities/default.json)
    // and the withGlobalTauri config flag that exposes window.__TAURI__.
    // ponytail: post-drag correction, not a live per-frame lock — a live one
    // would need the dragged edge, which Tauri doesn't report.
    var tauriApi = window.__TAURI__;
    var tauriWindow = tauriApi && tauriApi.window;
    // LogicalSize lives in the dpi module in Tauri 2; window re-exports it.
    var LogicalSize = tauriWindow && ((tauriApi.dpi && tauriApi.dpi.LogicalSize) || tauriWindow.LogicalSize);

    if (tauriWindow && LogicalSize) {
      var ASPECT = PHONE_BASE_WIDTH / PHONE_BASE_HEIGHT;
      var ASPECT_EPSILON = 2; // px of drift tolerated before correcting
      // 400ms, not 150: a border drag on Windows runs a modal OS resize loop,
      // and setSize() called inside it can silently no-op (tauri-apps/tauri
      // #7303). A real drag rarely pauses this long without ending, so the
      // longer quiet period keeps most corrections outside that loop.
      var SETTLE_MS = 400;
      var COOLDOWN_MS = 600; // no second correction until this one has landed
      var lastW = window.innerWidth;
      var lastH = window.innerHeight;
      var ratioTimer = null;
      var correcting = false;

      var lockAspect = function () {
        if (correcting) return; // its own resize events are still arriving
        var w = window.innerWidth;
        var h = window.innerHeight;
        var byHeight = Math.abs(h - lastH) > Math.abs(w - lastW);
        var targetW = byHeight ? Math.round(h * ASPECT) : w;
        var targetH = byHeight ? h : Math.round(w / ASPECT);
        lastW = targetW;
        lastH = targetH;
        if (Math.abs(targetW - w) <= ASPECT_EPSILON && Math.abs(targetH - h) <= ASPECT_EPSILON) return;
        // ponytail: plain cooldown, not a settle-detector — it doubles as the
        // unstick fallback if the expected follow-up resize never arrives.
        correcting = true;
        setTimeout(function () {
          correcting = false;
          clearTimeout(ratioTimer);
          ratioTimer = setTimeout(lockAspect, SETTLE_MS); // retry anything skipped
        }, COOLDOWN_MS);
        var warn = function (err) {
          console.warn("VKDex aspect-lock: setSize failed", err);
        };
        try {
          var done = tauriWindow.getCurrentWindow().setSize(new LogicalSize(targetW, targetH));
          if (done && done.catch) done.catch(warn);
        } catch (err) {
          warn(err);
        }
      };

      window.addEventListener("resize", function () {
        clearTimeout(ratioTimer);
        ratioTimer = setTimeout(lockAspect, SETTLE_MS);
      });
    }
  }

  // The "VKDex" header must never overflow the drawer. Measure the header's
  // own natural width (padding + text, independent of the menu's width) and
  // use it as a floor under styles.css's --menu-width (0.3.11: the drawer
  // grew past the header once every row gained a text label, so the
  // header's width is a minimum now, not the cap it was for the icon-only
  // strip).
  function measureHeaderWidth() {
    var clone = menuHeader.cloneNode(true);
    clone.style.position = "absolute";
    clone.style.visibility = "hidden";
    clone.style.left = "-9999px";
    clone.style.width = "auto";
    clone.style.display = "inline-block";
    document.body.appendChild(clone);
    var width = Math.ceil(clone.getBoundingClientRect().width);
    document.body.removeChild(clone);
    return width;
  }

  var MENU_WIDTH = Math.max(
    parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--menu-width")) || 0,
    measureHeaderWidth()
  );
  document.documentElement.style.setProperty("--menu-width", MENU_WIDTH + "px");

  var OPEN_THRESHOLD = MENU_WIDTH / 2;

  var isOpen = false;
  var dragging = false;
  var dragMode = null; // "open" | "close"
  var dragSource = null; // "handle" when the drag started on #drawerHandle
  var startX = 0;
  var activePointerId = null;
  // Movement under this (logical px) counts as a tap, not a drag. Only the
  // drawer handle uses it — see endDrag.
  var HANDLE_TAP_SLOP = 6;

  function setDragging(on) {
    menu.classList.toggle("dragging", on);
    overlay.classList.toggle("dragging", on);
  }

  function applyDragPosition(offsetPx) {
    var clamped = Math.max(-MENU_WIDTH, Math.min(0, offsetPx));
    menu.style.transform = "translateX(" + clamped + "px)";
    var progress = (clamped + MENU_WIDTH) / MENU_WIDTH; // 0 (closed) -> 1 (open)
    overlay.style.opacity = String(progress * 0.4);
    if (progress > 0 && !overlay.classList.contains("active")) {
      overlay.classList.add("active");
    }
  }

  function clearInlineStyles() {
    menu.style.transform = "";
    overlay.style.opacity = "";
  }

  function openMenu() {
    isOpen = true;
    clearInlineStyles();
    menu.classList.add("open");
    overlay.classList.add("active");
    menu.setAttribute("aria-hidden", "false");
  }

  function closeMenu() {
    isOpen = false;
    clearInlineStyles();
    menu.classList.remove("open");
    overlay.classList.remove("active");
    // Chromium refuses aria-hidden="true" on a container whose descendant
    // still holds focus ("Blocked aria-hidden on an element because its
    // descendant retained focus") — the drawer icon that triggered the close
    // is inside `menu`, so drop focus first. Same guard at the other three
    // aria-hidden close sites (closeDetailPopup/closeDetail/closeSettings).
    if (menu.contains(document.activeElement)) document.activeElement.blur();
    menu.setAttribute("aria-hidden", "true");
  }

  function startDrag(pointerId, clientX, mode, source) {
    dragging = true;
    dragMode = mode;
    dragSource = source || null;
    startX = clientX;
    activePointerId = pointerId;
    setDragging(true);
  }

  function endDrag(clientX) {
    if (!dragging) return;
    var delta = clientX - startX;
    var finalOffset = dragMode === "open" ? (-MENU_WIDTH + Math.max(0, delta)) : Math.min(0, delta);
    // A press-and-release on the drawer handle that barely moved is a tap:
    // open regardless of the threshold math, which would otherwise read a
    // zero-delta open-drag as "didn't get far enough" and close instead.
    // Scoped to the handle on purpose — .edge-zone stays drag-only, which is
    // what 0.1.34's 24px -> 12px narrowing was for (it must not swallow taps
    // meant for the Back button / region chips behind it).
    var handleTap = dragSource === "handle" && Math.abs(delta) < HANDLE_TAP_SLOP;

    dragging = false;
    dragMode = null;
    dragSource = null;
    activePointerId = null;
    setDragging(false);

    if (handleTap || finalOffset > -OPEN_THRESHOLD) {
      openMenu();
    } else {
      closeMenu();
    }
  }

  // Pointer coordinates are real screen pixels, but the drag math below
  // (and MENU_WIDTH) works in the phone frame's own unscaled pixels — so
  // when phoneScale isn't 1 (see Tauri window scaling above), divide
  // every clientX by it first to keep the drag tracking 1:1 with the
  // cursor regardless of how large the window has been scaled up.
  function logicalX(clientX) {
    return clientX / phoneScale;
  }

  // --- Open gesture: press near the left edge, drag right ---
  edgeZone.addEventListener("pointerdown", function (e) {
    if (isOpen) return;
    startDrag(e.pointerId, logicalX(e.clientX), "open");
    applyDragPosition(-MENU_WIDTH);
  });

  // --- Close gesture: press on the open menu, drag left ---
  menu.addEventListener("pointerdown", function (e) {
    if (!isOpen) return;
    startDrag(e.pointerId, logicalX(e.clientX), "close");
    applyDragPosition(0);
  });

  document.addEventListener("pointermove", function (e) {
    if (!dragging || e.pointerId !== activePointerId) return;
    var delta = logicalX(e.clientX) - startX;
    var offset = dragMode === "open" ? (-MENU_WIDTH + delta) : delta;
    applyDragPosition(offset);
  });

  document.addEventListener("pointerup", function (e) {
    if (!dragging || e.pointerId !== activePointerId) return;
    endDrag(logicalX(e.clientX));
  });

  document.addEventListener("pointercancel", function (e) {
    if (!dragging || e.pointerId !== activePointerId) return;
    // Snap back to whatever state we were already in
    dragging = false;
    dragMode = null;
    dragSource = null;
    activePointerId = null;
    setDragging(false);
    clearInlineStyles();
    if (isOpen) { openMenu(); } else { closeMenu(); }
  });

  // --- Tap anywhere outside the menu closes it ---
  overlay.addEventListener("click", function () {
    if (isOpen && !isTourActive()) closeMenu();
  });

  // --- Visible drawer handle: same open-drag as the edge zone, plus tap ---
  // 0.3.12: the handle used to have only a `click` listener, so pressing and
  // dragging from it did nothing. It now feeds the shared drag (the document
  // pointermove/pointerup listeners above finish it generically), and
  // endDrag's handle-tap slop covers the plain-tap case that `click` used to
  // handle — one mechanism, not two racing ones. Keyboard activation still
  // needs its own path, since no pointer events fire for Enter/Space.
  var drawerHandle = document.getElementById("drawerHandle");
  drawerHandle.addEventListener("pointerdown", function (e) {
    if (isOpen) return;
    startDrag(e.pointerId, logicalX(e.clientX), "open", "handle");
    applyDragPosition(-MENU_WIDTH);
  });
  drawerHandle.addEventListener("keydown", function (e) {
    if (e.key !== "Enter" && e.key !== " ") return;
    e.preventDefault();
    if (!isOpen) openMenu();
  });

  // --- Small shared helpers -------------------------------------------

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function byDexNumber(a, b) {
    return a.id - b.id;
  }

  function findPokemon(id) {
    for (var i = 0; i < POKEMON_DATA.length; i++) {
      if (POKEMON_DATA[i].id === id) return POKEMON_DATA[i];
    }
    return null;
  }

  function regionLabel(regionId) {
    for (var i = 0; i < REGIONS.length; i++) {
      if (REGIONS[i].id === regionId) return REGIONS[i].label;
    }
    return String(regionId);
  }

  // Local files under src/data/sprites/ (bundled with the app — Tauri
  // embeds all of ../src via frontendDist, no copy step), relative to
  // index.html the same way the data/*.js <script> tags already are — no
  // network dependency, so no offline cache is needed for sprites anymore
  // (see the removed "Offline cache" section, 0.1.20).
  function spriteUrl(id) {
    return "data/sprites/pokemon/" + id + ".png";
  }

  function formatDexNumber(id) {
    var s = String(id);
    while (s.length < 3) s = "0" + s;
    return "#" + s;
  }

  // --- Favorites -------------------------------------------------------
  // Stored as a plain list of national dex numbers. localStorage is the
  // primary store (synchronous, so the first render already knows what's
  // starred); the same list is mirrored into IndexedDB as a fallback,
  // because localStorage can be unavailable in some file:// contexts while
  // IndexedDB still works there (see openOfflineDb() further down — that
  // store used to also hold cached sprite blobs, until 0.1.20 made that
  // redundant; it's Favorites-only now).

  var FAVORITES_KEY = "vkdex-favorites";
  var favorites = {}; // id -> true

  function favoriteIds() {
    return Object.keys(favorites).map(Number).sort(function (a, b) { return a - b; });
  }

  function adoptFavoriteList(list) {
    if (Object.prototype.toString.call(list) !== "[object Array]") return false;
    var changed = false;
    list.forEach(function (raw) {
      var id = Number(raw);
      if (id && !favorites[id]) { favorites[id] = true; changed = true; }
    });
    return changed;
  }

  function loadFavoritesFromLocalStorage() {
    try {
      var raw = window.localStorage.getItem(FAVORITES_KEY);
      if (!raw) return;
      adoptFavoriteList(JSON.parse(raw));
    } catch (e) { /* unavailable or malformed — IndexedDB fallback covers it */ }
  }

  // Merges anything the IndexedDB mirror holds that memory doesn't (the
  // case where localStorage was cleared or is unavailable). Resolves to
  // true when it actually added something, so the caller can re-render.
  function loadFavoritesFromDb() {
    return openOfflineDb().then(function (db) {
      return idbGet(db, "meta", "favorites");
    }).then(function (stored) {
      return adoptFavoriteList(stored);
    }).catch(function () { return false; });
  }

  function saveFavorites() {
    var ids = favoriteIds();
    try {
      window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(ids));
    } catch (e) { /* fall through to the IndexedDB mirror below */ }
    openOfflineDb().then(function (db) {
      return idbSet(db, "meta", "favorites", ids);
    }).catch(function () { /* best effort */ });
  }

  function isFavorite(id) {
    return favorites[id] === true;
  }

  function toggleFavorite(id) {
    if (favorites[id]) { delete favorites[id]; } else { favorites[id] = true; }
    saveFavorites();
  }

  // --- Grid rendering (shared by the dex, favorites and search screens) --

  var STAR_BADGE = '<svg class="dex-cell-fav" viewBox="0 0 24 24" aria-hidden="true">' +
    '<path d="M12 3.4l2.47 5.28 5.78.63-4.32 4.02 1.18 5.77L12 16.9l-5.11 2.2 1.18-5.77-4.32-4.02 5.78-.63L12 3.4z"/></svg>';

  // numberText: optional override for the corner dex-number text — used by
  // the Hisui/Orre standalone screens (renderDexList) to show that dex's
  // own numbering/tag instead of the plain national dex number every other
  // screen displays. Undefined for every other caller (favorites,
  // national/regional dex), so formatDexNumber(p.id) is the default.
  // spriteSrc: optional override for the cell's sprite — used by the region
  // chips (Hisui/Alola/Galar/Paldea) to show a species' regional variant
  // instead of its base sprite. Undefined everywhere else, so
  // gridSpriteUrl(p.id) (base form, shiny if the Settings toggle says so)
  // is the default.
  function gridSpriteUrl(id) {
    return useShinyGrids ? spriteShinyUrl(id) : spriteUrl(id);
  }

  // p.forme: a quick-search variant row (renderDexList) — that forme's own
  // sprite, and data-forme so openDetailFromCell pre-activates it.
  function cellHtml(p, numberText, spriteSrc) {
    if (p.forme) spriteSrc = altFormSpriteUrl(p.forme.sprite, useShinyGrids);
    return '<div class="dex-cell" role="button" tabindex="0" data-id="' + p.id + '"' + (p.forme ? ' data-forme="' + escapeHtml(p.forme.key) + '"' : "") + '>' +
      (isFavorite(p.id) ? STAR_BADGE : "") +
      '<span class="dex-sprite-wrap"><img class="dex-sprite" src="' + (spriteSrc || gridSpriteUrl(p.id)) + '" alt="' + escapeHtml(p.name) + '" loading="lazy"' + SPRITE_ONERROR_ATTR + '></span>' +
      '<span class="dex-name">' + escapeHtml(p.name) + "</span>" +
      '<span class="dex-number">' + (numberText || formatDexNumber(p.id)) + "</span>" +
      "</div>";
  }

  function renderGrid(container, entries, emptyMessage, numberFn, spriteFn) {
    if (entries.length === 0) {
      container.innerHTML = '<div class="dex-empty">' + escapeHtml(emptyMessage) + "</div>";
      return;
    }
    container.innerHTML = entries.map(function (p) {
      return cellHtml(p, numberFn ? numberFn(p) : null, spriteFn ? spriteFn(p) : null);
    }).join("");
  }

  // Adds/removes the corner star on every rendered cell for this Pokemon,
  // in place — cheaper than re-rendering a whole grid on each toggle.
  function updateFavoriteBadges(id) {
    var cells = document.querySelectorAll('.dex-cell[data-id="' + id + '"]');
    for (var i = 0; i < cells.length; i++) {
      var badge = cells[i].querySelector(".dex-cell-fav");
      if (isFavorite(id) && !badge) {
        cells[i].insertAdjacentHTML("afterbegin", STAR_BADGE);
      } else if (!isFavorite(id) && badge) {
        badge.parentNode.removeChild(badge);
      }
    }
  }

  // --- Screen router ---------------------------------------------------
  // Two swappable list screens (only one visible at a time) plus the
  // detail screen, which slides in over whichever one is showing. The
  // standalone Search screen was deleted in 0.1.34; the drawer's Search row
  // (a shortcut into the same quick-search) followed in 0.3.12 as redundant
  // — #dexSearchToggle and the "/" shortcut both already open it.

  var screens = {
    dex: document.getElementById("dexScreen"),
    favorites: document.getElementById("favoritesScreen"),
    typechart: document.getElementById("typeChartScreen"),
    natures: document.getElementById("naturesScreen")
  };

  var navIcons = {
    dex: document.getElementById("dexIcon"),
    favorites: document.getElementById("favoritesIcon"),
    typechart: document.getElementById("typeChartIcon"),
    natures: document.getElementById("naturesIcon")
  };

  var currentView = "dex";

  function showView(name) {
    if (!screens[name]) return;
    currentView = name;
    Object.keys(screens).forEach(function (key) {
      screens[key].hidden = key !== name;
    });
    Object.keys(navIcons).forEach(function (key) {
      navIcons[key].classList.toggle("active", key === name);
    });
    if (name === "favorites") renderFavorites();
  }

  // Each drawer icon: close the drawer, drop any open detail view, switch.
  // (The optional `then` follow-up existed only for the Search row's
  // quick-search open, removed in 0.3.12 — no caller needs it now.)
  function wireNavIcon(el, view) {
    function go() {
      closeMenu();
      closeDetail();
      showView(view);
    }
    el.addEventListener("click", go);
    el.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); }
    });
  }

  wireNavIcon(navIcons.dex, "dex");
  wireNavIcon(navIcons.favorites, "favorites");
  wireNavIcon(navIcons.typechart, "typechart");
  wireNavIcon(navIcons.natures, "natures");

  // --- Reference screens: Type Chart + Natures (0.3.11) ----------------
  // Pure static-data presentation, rendered once at startup. Neither links
  // to a Pokemon (a Type pill / nature tap-through is a possible follow-up).

  // 18x18 grid, attackers down / defenders across, in TYPE_CHART's own key
  // order (the games' canonical chart order). TYPE_CHART is sparse — any
  // pair it doesn't list is 1x. 3-letter abbreviations happen to be unique
  // across all 18 types, so no lookup table.
  function renderTypeChart() {
    var types = Object.keys(TYPE_CHART);
    function abbr(t) { return t.slice(0, 3).toUpperCase(); }
    var html = "<span></span>" + types.map(function (t) {
      return '<span class="type-pill tc-label tc-col type-' + t.toLowerCase() + '">' + abbr(t) + "</span>";
    }).join("");
    types.forEach(function (atk) {
      html += '<span class="type-pill tc-label type-' + atk.toLowerCase() + '">' + abbr(atk) + "</span>";
      types.forEach(function (def) {
        var m = TYPE_CHART[atk][def];
        if (m === undefined) m = 1;
        var cls = m === 0 ? "tc-0" : m === 2 ? "tc-2" : m === 0.5 ? "tc-half" : "tc-1";
        var glyph = m === 0.5 ? "&frac12;" : m === 1 ? "" : String(m);
        html += '<span class="tc-cell ' + cls + '" title="' + atk + " → " + def + ": ×" + m + '">' + glyph + "</span>";
      });
    });
    document.getElementById("typeGrid").innerHTML = html;
  }

  // One .detail-row per nature, in NATURES' own order. Stat labels come from
  // STAT_ROWS (the stats card's own naming) so "Sp. Atk" reads the same here.
  function renderNatures() {
    function statLabel(key) {
      for (var i = 0; i < STAT_ROWS.length; i++) {
        if (STAT_ROWS[i].key === key) return STAT_ROWS[i].label;
      }
      return key;
    }
    document.getElementById("naturesList").innerHTML = Object.keys(NATURES).map(function (key) {
      var n = NATURES[key];
      var name = key.charAt(0).toUpperCase() + key.slice(1);
      var val = n.increasedStat
        ? '<span class="nature-up">+ ' + escapeHtml(statLabel(n.increasedStat)) + '</span>' +
          '<span class="nature-down">− ' + escapeHtml(statLabel(n.decreasedStat)) + "</span>"
        : '<span class="nature-neutral">Neutral</span>';
      return '<div class="detail-row"><span class="detail-key">' + escapeHtml(name) +
        '</span><span class="detail-val">' + val + "</span></div>";
    }).join("");
  }

  // --- Pokedex (home) screen ------------------------------------------

  var regionBar = document.getElementById("regionBar");
  var dexList = document.getElementById("dexList");
  var dexTitle = document.getElementById("dexTitle");
  var currentRegionFilter = "national";

  // Quick-search: a collapsible bar between the region bar and the dex
  // grid (see index.html) that filters the same #dexList grid in place —
  // no separate results list. The app's only search since 0.1.34.
  var dexSearchToggle = document.getElementById("dexSearchToggle");
  var dexQuickSearch = document.getElementById("dexQuickSearch");
  var dexQuickSearchInput = document.getElementById("dexQuickSearchInput");
  var dexQuickSearchClear = document.getElementById("dexQuickSearchClear");

  // A mainline chip with no POKEMON_DATA entry at all (Galar/Paldea today)
  // is dimmed via .region-chip.empty so "coming soon" is visible before the
  // tap. Partially-populated regions (Unova/Kalos/Alola's Hisui-roster
  // natives) count as populated here; the standalone dexes always are.
  function regionHasEntries(region) {
    if (region.standalone) return true;
    return POKEMON_DATA.some(function (p) { return p.region === region.id; });
  }

  function renderRegionBar() {
    var html = "";
    REGIONS.forEach(function (region) {
      var cls = region.standalone ? "region-chip standalone" : "region-chip";
      if (!regionHasEntries(region)) cls += " empty";
      html += '<button class="' + cls + '" data-region="' + region.id + '">' + escapeHtml(region.label) + "</button>";
    });
    regionBar.innerHTML = html;
  }

  // Hisui and Orre are standalone dexes (REGIONS' standalone:true — not a
  // p.region value), each with their own membership + numbering rule
  // rather than the plain "p.region === filter" every mainline chip uses.
  // Hisui: PLA's own 001-242 track (data/hisui.js), sorted/labeled by that
  // number instead of national dex id. Orre: real national dex numbers,
  // just a membership list (data/orre.js) with a per-entry C/XD/C-XD tag
  // appended, per TODO.md #6's confirmed numbering rules for each.
  // Regional-variant formes (Hisuian/Alolan/Galarian/Paldean, 2026-09-06 —
  // generalized from the Hisui-only version): an ALT_FORMS forme whose key
  // is a REGIONS id, or starts with one ("paldea-combat"), is that region's
  // variant of the species. Megas/Gmax never count, nor do recolorOnly
  // galleries. Returns every such forme, or only `region`'s when given —
  // [0] is the one a region chip shows/auto-activates (Tauros's 3 Paldean
  // breeds: Combat, the first).
  var REGION_IDS = REGIONS.map(function (r) { return r.id; });

  function regionalFormes(id, region) {
    var data = ALT_FORMS[id];
    if (!data || data.recolorOnly || !data.formes) return [];
    return data.formes.filter(function (f) {
      if (f.isMega || f.isGmax) return false;
      var r = f.key.split("-")[0];
      return REGION_IDS.indexOf(r) !== -1 && (!region || r === region);
    });
  }

  // Sprite override for a region chip: a species with that region's variant
  // shows the variant's sprite in the grid instead of its base one. Null
  // for every other cell — renderGrid falls back to the base sprite.
  function regionalCellSprite(region) {
    return function (p) {
      var f = regionalFormes(p.id, region)[0];
      return f ? altFormSpriteUrl(f.sprite, useShinyGrids) : null;
    };
  }

  // The active chip's membership rule, sort order, number label and sprite
  // override, in one place — the quick-search query is then applied on top
  // of whichever set is active, so search always respects the current chip
  // (0.1.34; before, only Hisui scoped it). `match` is one predicate so the
  // grid is a single filter() over POKEMON_DATA.
  //
  // National: `hisuiOnly` entries (the 7 Legends: Arceus originals, dex
  // 899-905) have no mainline region and are skipped from the unfiltered
  // browse grid — but a typed query lifts that exclusion, since quick-search
  // is now the only search and those 7 must stay findable by name/number
  // (user-confirmed 2026-09-04).
  function dexSetFor(filter, hasQuery) {
    if (filter === "hisui") {
      return {
        match: function (p) { return HISUI_DEX_NUMBERS[p.id] != null; },
        sort: function (a, b) { return HISUI_DEX_NUMBERS[a.id] - HISUI_DEX_NUMBERS[b.id]; },
        label: "Hisui",
        numberFn: function (p) { return formatDexNumber(HISUI_DEX_NUMBERS[p.id]); },
        spriteFn: regionalCellSprite("hisui")
      };
    }
    if (filter === "orre") {
      return {
        match: function (p) { return ORRE_MEMBERS[p.id] != null; },
        sort: byDexNumber,
        label: "Orre",
        numberFn: function (p) { return formatDexNumber(p.id) + " · " + ORRE_MEMBERS[p.id]; }
      };
    }
    if (filter === "national") {
      return {
        match: function (p) { return hasQuery || !p.hisuiOnly; },
        sort: byDexNumber,
        label: hasQuery ? "" : "This"
      };
    }
    // Mainline chip: species introduced there, plus any species with that
    // region's variant forme (Alolan Raichu under Alola, ...) shown with the
    // variant's sprite — same display-only extension the Hisui chip has.
    return {
      match: function (p) { return p.region === filter || regionalFormes(p.id, filter).length > 0; },
      sort: byDexNumber,
      label: regionLabel(filter),
      spriteFn: regionalCellSprite(filter)
    };
  }

  // A query surfaces each regional-variant forme as its own extra row right
  // after its base (2026-09-06, user rule): "sneasel" lists Sneasel and
  // Hisuian Sneasel, "raichu" Raichu and Alolan Raichu — a variant row is a
  // synthetic { id, name, forme } entry cellHtml() renders with the forme's
  // sprite/name and a data-forme attribute so the tap opens that forme.
  // The active chip's own variant is skipped (the base cell already shows
  // and opens it); Mega/Gmax never get a row (regionalFormes excludes them).
  function renderDexList(filter) {
    var query = dexQuickSearchInput.value.trim();
    var set = dexSetFor(filter, !!query);
    var matchQuery = queryMatcher(query);
    var entries = [];
    POKEMON_DATA.forEach(function (p) {
      if (!set.match(p)) return;
      var baseHit = !matchQuery || matchQuery(p);
      if (baseHit) entries.push(p);
      if (!matchQuery) return;
      var chipForme = regionalFormes(p.id, filter)[0];
      regionalFormes(p.id).forEach(function (f) {
        if (f !== chipForme && (baseHit || matchQuery({ id: p.id, name: f.name }))) entries.push({ id: p.id, name: f.name, forme: f });
      });
    });
    entries.sort(set.sort);
    var empty = query
      ? "No " + (set.label ? set.label + " " : "") + "Pokémon match “" + query + "”."
      : set.label + " Pokédex coming soon.";
    renderGrid(dexList, entries, empty, set.numberFn, set.spriteFn);
  }

  function isDexQuickSearchOpen() {
    return dexQuickSearch.classList.contains("open");
  }

  function openDexQuickSearch() {
    dexQuickSearch.classList.add("open");
    dexSearchToggle.classList.add("active");
    dexSearchToggle.setAttribute("aria-expanded", "true");
    dexQuickSearchInput.focus();
  }

  function closeDexQuickSearch() {
    dexQuickSearch.classList.remove("open");
    dexSearchToggle.classList.remove("active");
    dexSearchToggle.setAttribute("aria-expanded", "false");
    dexQuickSearchInput.value = "";
    dexQuickSearchClear.hidden = true;
    renderDexList(currentRegionFilter);
  }

  dexSearchToggle.addEventListener("click", function () {
    if (isDexQuickSearchOpen()) { closeDexQuickSearch(); } else { openDexQuickSearch(); }
  });

  dexQuickSearchInput.addEventListener("input", function () {
    dexQuickSearchClear.hidden = dexQuickSearchInput.value.length === 0;
    renderDexList(currentRegionFilter);
  });

  dexQuickSearchClear.addEventListener("click", function () {
    dexQuickSearchInput.value = "";
    dexQuickSearchClear.hidden = true;
    renderDexList(currentRegionFilter);
    dexQuickSearchInput.focus();
  });

  // Enter opens the result when the query has narrowed the grid to exactly
  // one cell (0.1.34) — reads the rendered grid rather than re-running the
  // search, so it agrees with whatever chip scoping applied.
  dexQuickSearchInput.addEventListener("keydown", function (e) {
    if (e.key !== "Enter") return;
    var cells = dexList.querySelectorAll(".dex-cell");
    if (cells.length === 1) openDetailFromCell(cells[0], dexList);
  });

  // Keeps the "National Dex" header and the region chips in sync: exactly
  // one of them is ever shown as active. Switching region also exits quick
  // search, since browsing-by-region and text search are separate modes.
  // Persisted (vkdex-region, 0.1.34) so the app reopens on the last chip.
  var REGION_KEY = "vkdex-region";

  function setRegionFilter(filter) {
    currentRegionFilter = filter;
    try { window.localStorage.setItem(REGION_KEY, filter); } catch (e) {}
    dexTitle.classList.toggle("active", filter === "national");
    var chips = regionBar.querySelectorAll(".region-chip");
    for (var i = 0; i < chips.length; i++) {
      chips[i].classList.toggle("active", chips[i].getAttribute("data-region") === filter);
    }
    if (isDexQuickSearchOpen()) {
      closeDexQuickSearch();
    } else {
      renderDexList(filter);
    }
  }

  // The header doubles as the "National Dex" button
  dexTitle.addEventListener("click", function () {
    setRegionFilter("national");
  });
  dexTitle.addEventListener("keydown", function (e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setRegionFilter("national");
    }
  });

  regionBar.addEventListener("click", function (e) {
    var btn = e.target.closest ? e.target.closest(".region-chip") : null;
    if (!btn) return;
    setRegionFilter(btn.getAttribute("data-region"));
  });

  // --- Favorites screen ------------------------------------------------

  var favoritesList = document.getElementById("favoritesList");

  function favoriteEntries() {
    return POKEMON_DATA.filter(function (p) {
      return isFavorite(p.id);
    }).slice().sort(byDexNumber);
  }

  function renderFavorites() {
    var entries = favoriteEntries();
    if (entries.length === 0) {
      favoritesList.innerHTML = '<div class="dex-empty dex-empty-favorites">' +
        '<svg class="dex-empty-icon" viewBox="0 0 24 24" aria-hidden="true">' +
        '<path d="M12 3.4l2.47 5.28 5.78.63-4.32 4.02 1.18 5.77L12 16.9l-5.11 2.2 1.18-5.77-4.32-4.02 5.78-.63L12 3.4z"/></svg>' +
        '<div class="dex-empty-text">No favorites yet</div>' +
        '<div class="dex-empty-subtext">Open a Pokémon and tap the star to add it here.</div>' +
        "</div>";
      return;
    }
    renderGrid(favoritesList, entries, "");
  }

  // --- Search matcher (used by the dex quick-search) ---------------------
  // Matches on name substring, or on an exact dex number written with or
  // without a leading "#" and leading zeros — "4", "04", "#004" and "#4"
  // all find Charmander. Deliberately exact rather than prefix-matched:
  // prefix matching turns "4" into 4, 40-49, 400-499... which buries the
  // entry the user actually typed. Returns null for an empty query so the
  // caller can skip filtering; chip scoping happens in renderDexList().
  function queryMatcher(rawQuery) {
    var q = rawQuery.trim().toLowerCase();
    if (!q) return null;

    var digits = q.replace(/^#/, "");
    var numeric = /^\d+$/.test(digits) ? parseInt(digits, 10) : null;

    return function (p) {
      return p.name.toLowerCase().indexOf(q) !== -1 || (numeric !== null && p.id === numeric);
    };
  }

  // --- Pokemon detail screen (0.1.18 redesign, PLAN.md "Detail screen
  // redesign") -----------------------------------------------------------
  // The body is a stack of section cards built fresh on every openDetail():
  // picture (sprite pair + flavour flap) -> facts list (type/matchups/
  // abilities etc) -> base stats -> evolution line -> alt formes -> found-in
  // -> learnable moves (order revised 0.1.34: the facts a lookup needs first
  // now sit right under the picture).

  var detailScreen = document.getElementById("detailScreen");
  var detailBody = document.getElementById("detailBody");
  var detailBack = document.getElementById("detailBack");
  var detailFav = document.getElementById("detailFav");
  var detailName = document.getElementById("detailName");
  var detailPopupBackdrop = document.getElementById("detailPopupBackdrop");
  var detailPopup = document.getElementById("detailPopup");
  var detailPopupTitle = document.getElementById("detailPopupTitle");
  var detailPopupBody = document.getElementById("detailPopupBody");
  var detailPopupClose = document.getElementById("detailPopupClose");
  var detailEntryId = null;
  // Back-history for in-detail navigation (evolution-stage taps): ids to
  // return to, innermost last. Empty means Back closes the screen.
  var detailHistory = [];
  // One-step back-history for the shared detail popup (0.3.18): {title, html}
  // of the popup a dismiss should return to, or null to dismiss outright.
  // Set per openDetailPopup() call — see that function.
  var popupBackTo = null;
  // The alt forme currently swapped in (its `key`), or null for base — kept
  // so a settings-driven re-render can restore it (0.1.34).
  var activeFormeKey = null;
  // Which gender's art the Picture card is showing (0.2.3) — "male" is the
  // default sprite every other screen uses, so a fresh openDetail() renders
  // exactly as it always did. Only meaningful for a `hasFemaleSprite`
  // species; every other entry renders no toggle at all.
  var activeGender = "male";
  // Whether this detail screen was opened from the Hisui screen (0.2.18) —
  // the same nav-origin signal openDetail()'s `fromRegion` carries, held on
  // so the Learnable Moves card can read data/movesets_hisui.js instead of
  // data/movesets.js. Reset on every openDetail(), like activeFormeKey.
  var fromHisuiScreen = false;
  // Settings-driven display state (all persisted, see the Settings section):
  var useImperialUnits = false; // metric is the default
  var useShinyGrids = false;    // grid cells show shiny sprites

  function spriteShinyUrl(id) {
    return "data/sprites/pokemon/shiny/" + id + ".png";
  }

  function displayShinySpriteUrl(id) {
    return spriteShinyUrl(id);
  }

  // Alt formes (data/altforms.js's ALT_FORMS) live in their own sprite
  // folder, named by forme slug rather than dex id — note the literal space
  // in "alt formes", matching the folder name on disk. The shiny tree
  // mirrors it under shiny/.
  function altFormSpriteUrl(sprite, shiny) {
    return "data/sprites/pokemon/" + (shiny ? "shiny/" : "") + "alt formes/" + sprite + ".png";
  }

  // Female-specific art (0.2.3): 103 bundled files mirroring the default
  // pokemon/ tree under a female/ subfolder (and shiny/female/ for shiny),
  // same {id}.png naming. There is deliberately no male/ counterpart —
  // PokeAPI ships none, because the default sprite already IS the male /
  // non-dimorphic appearance. So "male" just means the normal sprite path.
  function femaleSpriteUrl(id, shiny) {
    return "data/sprites/pokemon/" + (shiny ? "shiny/" : "") + "female/" + id + ".png";
  }

  // Plain Unicode rather than more hand-drawn SVG (cf. EVO_HEART_SVG and
  // friends): ♂/♀ are universally read, so there's nothing to draw.
  var GENDER_GLYPH = { male: "♂", female: "♀" };

  // Evolution-item sprites (data/sprites/items/), named by item slug.
  function itemSpriteUrl(item) {
    return "data/sprites/items/" + item + ".png";
  }

  // Fallback for any sprite <img> that fails to load (missing file, bad
  // data) — swaps to the bundled "0.png" placeholder once, then clears its
  // own handler so a missing placeholder can't loop.
  var SPRITE_ONERROR_ATTR = ' onerror="this.onerror=null;this.src=\'data/sprites/pokemon/0.png\';"';

  // --- Type pills + weakness/resist/neutral computation ---
  // TYPE_CHART (data/types.js) is keyed attacker -> defender -> multiplier;
  // a Pokemon's own matchup against every attacking type is the product of
  // that lookup across each of its own (defending) types.
  function computeMatchups(types) {
    var weak = [], resist = [], neutral = [], immune = [];
    Object.keys(TYPE_CHART).forEach(function (atk) {
      var mult = 1;
      types.forEach(function (def) {
        var row = TYPE_CHART[atk];
        var m = row && row[def] !== undefined ? row[def] : 1;
        mult *= m;
      });
      if (mult === 0) immune.push({ type: atk, mult: mult });
      else if (mult > 1) weak.push({ type: atk, mult: mult });
      else if (mult < 1) resist.push({ type: atk, mult: mult });
      else neutral.push({ type: atk, mult: mult });
    });
    weak.sort(function (a, b) { return b.mult - a.mult; });
    resist.sort(function (a, b) { return a.mult - b.mult; });
    return { weak: weak, resist: resist, neutral: neutral, immune: immune };
  }

  function formatMult(m) {
    if (m === 0.25) return "×¼";
    if (m === 0.5) return "×½";
    return "×" + m;
  }

  function pillHtml(type, multLabel) {
    var cls = "type-pill type-" + type.toLowerCase();
    if (multLabel === "×4") cls += " mult-4";
    var label = multLabel ? type + " " + multLabel : type;
    return '<span class="' + cls + '">' + escapeHtml(label) + "</span>";
  }

  function pillRowHtml(label, items, containerClass) {
    if (!items.length) return "";
    var pills = items.map(function (it) {
      return pillHtml(it.type, it.mult !== undefined ? formatMult(it.mult) : null);
    }).join("");
    return '<div class="detail-row column"><span class="detail-key">' + escapeHtml(label) +
      '</span><div class="' + containerClass + '">' + pills + "</div></div>";
  }

  function rowHtml(label, value) {
    return '<div class="detail-row"><span class="detail-key">' + escapeHtml(label) +
      '</span><span class="detail-val">' + escapeHtml(String(value)) + "</span></div>";
  }

  // --- Picture card ---
  // The card's two sprites are driven by two independent bits of state: the
  // active alt forme and the gender toggle. A forme wins outright — no
  // gendered alt-forme art is bundled (the one file that exists, 10235.png
  // for Hisuian Sneasel, isn't wired to anything) — and the gender choice
  // re-applies as soon as the base forme is selected again.
  function pictureSpriteUrl(entry, forme, shiny) {
    if (forme) return altFormSpriteUrl(forme.sprite, shiny);
    if (activeGender === "female" && entry.hasFemaleSprite) return femaleSpriteUrl(entry.id, shiny);
    return shiny ? displayShinySpriteUrl(entry.id) : displaySpriteUrl(entry.id);
  }

  function genderBtnHtml(gender) {
    var on = gender === activeGender;
    return '<button class="gender-btn gender-' + gender + (on ? " gender-btn-active" : "") +
      '" type="button" data-gender="' + gender + '" aria-pressed="' + on +
      '" aria-label="Show ' + gender + ' sprite">' + GENDER_GLYPH[gender] + "</button>";
  }

  function pictureCardHtml(entry) {
    var html = '<div class="detail-section picture-card">' +
      '<div class="detail-number">' + formatDexNumber(entry.id) + "</div>" +
      '<div class="sprite-pair">' +
      '<div class="sprite-slot"><span class="detail-sprite-wrap"><img class="detail-sprite" id="pictureMainSprite" src="' +
      pictureSpriteUrl(entry, null, false) + '" alt="' + escapeHtml(entry.name) + '"' + SPRITE_ONERROR_ATTR + '></span><span class="sprite-slot-label">Normal</span></div>' +
      '<div class="sprite-slot"><span class="detail-sprite-wrap"><img class="detail-sprite" id="pictureShinySprite" src="' +
      pictureSpriteUrl(entry, null, true) + '" alt="' + escapeHtml(entry.name) + ' (shiny)"' + SPRITE_ONERROR_ATTR + '></span><span class="sprite-slot-label">Shiny</span></div>' +
      "</div>";
    // Only a species with bundled female art gets the toggle at all —
    // hasFemaleSprite IS the "has a female counterpart" test, so no separate
    // genderRate check is needed. Absolutely positioned (below .detail-number),
    // so this sits after .sprite-pair in the DOM without moving anything.
    if (entry.hasFemaleSprite) {
      html += '<div class="picture-gender-toggle">' + genderBtnHtml("male") + genderBtnHtml("female") + "</div>";
    }
    if (entry.description) {
      html += '<div class="detail-description-flap">' + escapeHtml(entry.description) + "</div>";
    }
    html += "</div>";
    return html;
  }

  // --- Alt Formes module (PLAN.md "Alt Formes wiring for the detail
  // screen", full rule set in TODO.md #4) ---
  // Sits between the Picture and Evolution Line cards. Each forme is a
  // sprite bubble (same shape as an evolution stage bubble, .evo-stage
  // reused directly rather than duplicated). Two independent tap effects
  // (decoupled 0.1.35): every forme swaps the Picture card sprites and
  // topbar name (0.3.3 — see altFormeTappable); one that also overrides
  // `types` and/or `abilities` additionally swaps the information card
  // (rule 9). When at least one forme is
  // tappable, the base forme renders as bubble 0 (data-forme-key="") so
  // the module reads as a segmented control and tapping it reverts
  // (0.1.34; replaced the hidden tap-the-main-sprite revert).
  //
  // Non-Mega/Gmax formes tag their ability (rule 4, generalized) with their
  // own short label rather than literally "Mega"/"Gmax" — derived from the
  // forme's `key` since every entry keys formes with a short, display-ready
  // word ("attack", "sunny", ...). Mega/Gmax formes tag with their name
  // minus the species name, so Charizard's two read "Mega X"/"Mega Y".
  function altFormeShortLabel(forme, entry) {
    if (forme.isMega || forme.isGmax) return forme.name.replace(entry.name, "").replace(/\s+/g, " ").trim() || (forme.isMega ? "Mega" : "Gmax");
    return forme.key.charAt(0).toUpperCase() + forme.key.slice(1);
  }

  function altFormeSwaps(forme) {
    return !!(forme.types || forme.abilities);
  }

  // Every forme is tappable (0.3.3): a forme that overrides nothing but its
  // sprite (Squawkabilly's plumages, Tatsugiri's forms, Deoxys's stats-only
  // formes) still has its own art, so tapping it must at least swap the
  // Picture card. Kept as a named predicate — setActiveForme/altFormeSwaps
  // still distinguish "swaps art" from "swaps facts".
  function altFormeTappable(forme) {
    return true;
  }

  function altFormStageHtml(key, name, src, cls) {
    return '<button class="evo-stage' + cls + '" type="button" data-forme-key="' + escapeHtml(key) + '">' +
      '<span class="evo-sprite-wrap"><img class="evo-sprite" src="' + src + '" alt="' + escapeHtml(name) + '"' + SPRITE_ONERROR_ATTR + '></span>' +
      '<span class="evo-name">' + escapeHtml(name) + "</span></button>";
  }

  // Rule 6 (recolor-only formes, e.g. Unown/Burmy/Cherrim/Arceus): instead
  // of one bubble per forme, the module shows a single representative
  // sprite (data.formes[0] — any of them works, they're all part of the
  // same species) with a "+N" badge, N = every other forme. Tapping it
  // opens a popup gallery instead of swapping anything (these formes never
  // set types/stats/ability, so there's nothing to swap) — a distinct class
  // (.altforms-recolor-bubble) keeps its click handling separate from
  // .evo-stage's setActiveForme path even though it reuses that markup.
  function altFormsRecolorBubbleHtml(entry, data) {
    var forme = data.formes[0];
    var badgeCount = data.formes.length - 1;
    return '<button class="evo-stage altforms-recolor-bubble" type="button">' +
      '<span class="evo-sprite-wrap"><img class="evo-sprite" src="' + spriteUrl(forme.sprite) + '" alt="' + escapeHtml(forme.name) + '"' + SPRITE_ONERROR_ATTR + '>' +
      (badgeCount > 0 ? '<span class="altforms-recolor-badge">+' + badgeCount + '</span>' : "") +
      '</span><span class="evo-name">' + escapeHtml(entry.name) + "</span></button>";
  }

  function altFormsRecolorPopupHtml(data) {
    return '<div class="altforms-popup-grid">' + data.formes.map(function (f) {
      return '<div class="altforms-popup-item">' +
        '<span class="evo-sprite-wrap"><img class="evo-sprite" src="' + spriteUrl(f.sprite) + '" alt="' + escapeHtml(f.name) + '"' + SPRITE_ONERROR_ATTR + '></span>' +
        '<span class="evo-name">' + escapeHtml(f.name) + "</span></div>";
    }).join("") + "</div>";
  }

  function altFormsCardHtml(entry) {
    var data = ALT_FORMS[entry.id];
    if (!data || !data.formes || !data.formes.length) return "";
    var body;
    if (data.recolorOnly) {
      body = altFormsRecolorBubbleHtml(entry, data);
    } else {
      var anyTappable = data.formes.some(altFormeTappable);
      // Optional per-species `baseName` (0.3.20): the base bubble's own forme
      // name where the species has one (Sinistea's "Phony", Sinistcha's
      // "Unremarkable"), so the row reads Phony/Antique rather than repeating
      // the species name. Unset everywhere else → base bubble stays entry.name.
      body = anyTappable ? altFormStageHtml("", data.baseName || entry.name, displaySpriteUrl(entry.id), " altform-active") : "";
      body += data.formes.map(function (forme) {
        return altFormStageHtml(forme.key, forme.name, altFormSpriteUrl(forme.sprite), altFormeTappable(forme) ? "" : " altform-inert");
      }).join("");
    }
    return '<div class="detail-section altforms-card"><p class="detail-section-label">Alt Formes</p>' +
      '<div class="evo-row altforms-row">' + body + "</div></div>";
  }

  // Tapping an alt-forme bubble (or the base bubble 0, to revert) swaps
  // both Picture card sprites and the topbar name for any tappable forme,
  // and the information card's type-driven rows + ability list only for
  // one that overrides `types`/`abilities` (rule 9) — a stat-only Mega
  // shows its own art over the base's unchanged facts. An unresolved/
  // inert key resolves to base.
  // The ALT_FORMS forme object for a key, or null. Shared by setActiveForme
  // and the evolution card's per-forme override lookup (evoEdgesFor).
  function findForme(id, formeKey) {
    var altData = ALT_FORMS[id];
    if (!formeKey || !altData || !altData.formes) return null;
    for (var i = 0; i < altData.formes.length; i++) {
      if (altData.formes[i].key === formeKey) return altData.formes[i];
    }
    return null;
  }

  function setActiveForme(formeKey) {
    if (detailEntryId === null) return;
    var entry = findPokemon(detailEntryId);
    if (!entry) return;
    var forme = findForme(entry.id, formeKey);
    var tappable = !!(forme && altFormeTappable(forme));
    var swaps = tappable && altFormeSwaps(forme);
    activeFormeKey = tappable ? formeKey : null;

    var mainImg = document.getElementById("pictureMainSprite");
    if (mainImg) mainImg.src = pictureSpriteUrl(entry, tappable ? forme : null, false);
    var shinyImg = document.getElementById("pictureShinySprite");
    if (shinyImg) shinyImg.src = pictureSpriteUrl(entry, tappable ? forme : null, true);
    detailName.textContent = tappable ? forme.name : entry.name;
    // Same resolution the Facts card's swapEntry uses below: a forme's own
    // types only count while it actually swaps them.
    applyDetailTypeGlow((swaps && forme.types) || entry.types);

    var factsEl = detailBody.querySelector(".detail-facts");
    if (factsEl) {
      // Each override is independent, and anything the forme doesn't set
      // falls through to the base entry's own value — which is what makes
      // reverting (formeKey null / unresolved) restore the base exactly.
      var swapEntry = entry;
      if (swaps) {
        swapEntry = Object.assign({}, entry, forme.types ? { types: forme.types } : null);
        if (forme.abilities) {
          swapEntry.abilities = forme.abilities;
          swapEntry.hiddenAbility = forme.hiddenAbility;
        }
      }
      factsEl.innerHTML = factsRowsHtml(swapEntry);
    }

    // Evolution Line: the active forme can override this species' own
    // outgoing edges (evoEdgesFor), so the card is rebuilt wholesale rather
    // than patched — it may also appear or disappear entirely (base
    // Farfetch'd doesn't evolve at all; Galarian Farfetch'd becomes
    // Sirfetch'd). Runs after activeFormeKey is set, which is what
    // evolutionCardHtml reads through.
    var evoEl = detailBody.querySelector(".evolution-card");
    var evoHtml = evolutionCardHtml(entry);
    if (evoEl) {
      if (evoHtml) evoEl.outerHTML = evoHtml;
      else evoEl.parentNode.removeChild(evoEl);
    } else if (evoHtml) {
      // Card order is fixed in renderDetail: Alt Formes, then Evolution
      // Line. Reaching here means this species has an ALT_FORMS entry, so
      // the Alt Formes card is always present to hang the new card off.
      var altCard = detailBody.querySelector(".altforms-card");
      if (altCard) altCard.insertAdjacentHTML("afterend", evoHtml);
    }

    // Bubble 0 (data-forme-key="") is the base and lights up on revert.
    var stages = detailBody.querySelectorAll(".altforms-card .evo-stage");
    for (var j = 0; j < stages.length; j++) {
      stages[j].classList.toggle("altform-active", stages[j].getAttribute("data-forme-key") === (tappable ? formeKey : ""));
    }

    // No gendered alt-forme art is bundled, so while a non-base forme is
    // active the toggle has nothing to switch (0.2.4). Native `disabled`
    // blocks both the click and keyboard activation on its own; CSS only
    // dims it. Reverting to base clears it. A species with no ALT_FORMS
    // never reaches here with tappable true, so its buttons stay live.
    var genderBtns = detailBody.querySelectorAll(".gender-btn");
    for (var k = 0; k < genderBtns.length; k++) genderBtns[k].disabled = tappable;
  }

  // Picture card gender toggle. Re-runs setActiveForme with the key that's
  // already active rather than re-assigning the two <img> srcs here: that
  // function is the single place both bits of state resolve into a sprite,
  // and re-applying the current forme is a no-op for everything else.
  function setActiveGender(gender) {
    activeGender = gender === "female" ? "female" : "male";
    var btns = detailBody.querySelectorAll(".gender-btn");
    for (var i = 0; i < btns.length; i++) {
      var on = btns[i].getAttribute("data-gender") === activeGender;
      btns[i].classList.toggle("gender-btn-active", on);
      btns[i].setAttribute("aria-pressed", on ? "true" : "false");
    }
    setActiveForme(activeFormeKey);
  }

  // --- Evolution line card ---
  // EVOLUTIONS only stores forward edges (evolvesTo), so the full chain for
  // a given id is found by walking backward to the root first, then
  // depth-first forward to every leaf. Branches (Oddish, Wurmple, ...) just
  // render as one full root-to-leaf row per branch rather than a shared
  // tree layout — simplest thing that reads correctly for every case. The
  // one exception is evolutionCardHtml's fan-out (3+ one-step branches).
  // Every per-forme `evolvesTo` override on a species, flattened. Each edge
  // is tagged with the forme key it came from (`fromFormeKey`) so a stage
  // bubble downstream can show that forme's own sprite/name — the ancestor
  // that actually produces the branch, not its base form (evoStageForme).
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

  // The backward walk has to see forme overrides too: a regional variant can
  // be the ONLY parent of a species (Galarian Farfetch'd -> Sirfetch'd), and
  // scanning EVOLUTIONS alone left those 9 targets rootless, so their own
  // page showed no card at all (0.3.5). ALT_FORMS keys are scanned as well
  // as EVOLUTIONS' so a forme edge on a species with no EVOLUTIONS entry
  // still resolves; duplicate keys are harmless, first match wins.
  function evolutionRootId(id) {
    var current = id, guard = 0;
    while (guard++ < 10) {
      var parent = null;
      var keys = Object.keys(EVOLUTIONS).concat(Object.keys(ALT_FORMS));
      for (var k = 0; k < keys.length; k++) {
        var node = EVOLUTIONS[keys[k]];
        var edges = (node ? node.evolvesTo : []).concat(formeEvoEdges(Number(keys[k])));
        for (var i = 0; i < edges.length; i++) {
          if (edges[i].id === current) { parent = Number(keys[k]); break; }
        }
        if (parent !== null) break;
      }
      if (parent === null) break;
      current = parent;
    }
    return current;
  }

  // Evolution edges to draw for `id` in the chain currently on screen.
  //
  // The VIEWED species is strict: its active forme overrides its own outgoing
  // edges (Alolan Vulpix needs an Ice Stone, not the base's Fire Stone) and
  // base view shows base edges only — that's what keeps Sirfetch'd off base
  // Farfetch'd's page.
  //
  // Any OTHER species in the chain resolves in two steps (0.3.9):
  //  1. If it has a forme under the SAME key as the viewed species' active
  //     one, that forme's edges REPLACE the base edges to the same target —
  //     an Alolan Ninetales page walks up through Alolan Vulpix's Ice Stone,
  //     not base Vulpix's Fire Stone. (Before 0.3.9 the forme edge was just
  //     deduped away on target id, so the card always drew the base route.)
  //  2. Any remaining forme-only route to a target the base can't reach at
  //     all is still appended (0.3.5) — the walk down from the root has to
  //     be able to re-enter the forme edge it walked up through, or
  //     Sirfetch'd's own page finds Farfetch'd as its root and then no way
  //     back. Deduping on target id keeps a same-target forme route from
  //     adding a second, duplicate branch.
  function evoEdgesFor(id) {
    var node = EVOLUTIONS[id];
    var base = node ? node.evolvesTo : [];
    if (id === detailEntryId) {
      var forme = findForme(id, activeFormeKey);
      return forme && forme.evolvesTo ? forme.evolvesTo : base;
    }
    var sharedForme = activeFormeKey ? findForme(id, activeFormeKey) : null;
    var sharedEdges = sharedForme && sharedForme.evolvesTo ? sharedForme.evolvesTo.map(function (e) {
      return Object.assign({}, e, { fromFormeKey: activeFormeKey });
    }) : [];
    var sharedIds = sharedEdges.map(function (e) { return e.id; });
    var merged = sharedEdges.concat(base.filter(function (b) { return sharedIds.indexOf(b.id) === -1; }));
    var seen = merged.map(function (e) { return e.id; });
    var extra = formeEvoEdges(id).filter(function (e) {
      if (seen.indexOf(e.id) !== -1) return false;
      seen.push(e.id);
      return true;
    });
    return extra.length ? merged.concat(extra) : merged;
  }

  // A stage bubble shows a forme's own sprite/name when: it IS the viewed
  // species and that forme is currently active (mirrors the Picture/Facts
  // card swap), OR the edge leading INTO the next step in this path came
  // from a specific forme of this species (fromFormeKey, set above) — the
  // ancestor that actually produces that branch, not its base form.
  function evoStageForme(id, nextStep) {
    if (id === detailEntryId && activeFormeKey) {
      // `hideInEvoLine` (0.3.20): a purely cosmetic forme (Sinistea's Antique
      // and friends) shouldn't relabel this chain's node — the evolution line
      // stays on the base species no matter which bubble is active. Picture/
      // Facts/Alt Formes cards read activeFormeKey directly and are unaffected.
      var selfForme = findForme(id, activeFormeKey);
      return selfForme && selfForme.hideInEvoLine ? null : selfForme;
    }
    if (nextStep && nextStep.via && nextStep.via.fromFormeKey) return findForme(id, nextStep.via.fromFormeKey);
    return null;
  }

  function evolutionPaths(rootId) {
    var paths = [];
    function walk(id, via, path) {
      var stepPath = path.concat([{ id: id, via: via }]);
      var children = evoEdgesFor(id);
      if (children.length === 0) { paths.push(stepPath); return; }
      children.forEach(function (edge) {
        // The whole edge is the `via` — evoArrowIconsHtml reads its optional
        // item/timeOfDay/moveType fields alongside method/level.
        walk(edge.id, edge, stepPath);
      });
    }
    walk(rootId, null, []);
    return paths;
  }

  function evoArrowLabel(via) {
    // Hand-authored per-edge override (0.3.5), for a branch the derived label
    // can't tell apart from its sibling: Galarian Slowpoke's two routes are
    // both `stone` with an item that has no bundled sprite, so both read
    // "Stone" with no icon. Same `note` field name as an EVOLUTIONS entry's
    // chain-wide note, but on the edge, so it renders as the arrow's own
    // label rather than the card's bottom line.
    if (via.note) return via.note;
    // A "level" edge with no `level` is a happiness/affection evolution
    // (Eevee->Sylveon, Sneasel->Sneasler, ...) — 23 of them; without this
    // it rendered a literal "Lv undefined".
    if (via.method === "level") return typeof via.level === "number" ? "Lv " + via.level : "Friendship";
    // "Knows a specific move" reuses the stone shape with the shared
    // tm-normal icon; the label is the move name itself (evolutions.js).
    if (via.item === "tm-normal" && via.move) return via.move;
    if (via.method === "stone") return "Stone";
    if (via.method === "trade") return "Trade";
    if (via.method === "held") return "Held";
    return "";
  }

  // Branches per row in the fan-out layout. .evo-stage is a fixed 76px, so
  // 3 (228px) sits comfortably inside the ~308px card interior at the 360px
  // base width; 4 (304px) technically fits but leaves no slack for the
  // divider rows to breathe.
  var FAN_ROW_SIZE = 3;

  var EVO_ARROW_SVG = '<svg viewBox="0 0 20 14" aria-hidden="true"><path d="M1 7 H16 M11 2 L16 7 L11 12" fill="none" stroke="currentColor" stroke-width="2"/></svg>';

  // Hand-drawn (no external asset, same as EVO_ARROW_SVG) condition icons
  // for the evolution arrow — heart = friendship, sun/moon = time of day.
  var EVO_HEART_SVG = '<svg class="evo-cond-icon" viewBox="0 0 16 14" aria-hidden="true"><path d="M8 13 C3 9 1 6.5 1 4.2 C1 2 2.7 1 4.3 1 C5.7 1 7 1.8 8 3.2 C9 1.8 10.3 1 11.7 1 C13.3 1 15 2 15 4.2 C15 6.5 13 9 8 13 Z" fill="currentColor"/></svg>';
  var EVO_SUN_SVG = '<svg class="evo-cond-icon" viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="3.5" fill="currentColor"/><g stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><line x1="8" y1="0.8" x2="8" y2="2.6"/><line x1="8" y1="13.4" x2="8" y2="15.2"/><line x1="0.8" y1="8" x2="2.6" y2="8"/><line x1="13.4" y1="8" x2="15.2" y2="8"/><line x1="2.9" y1="2.9" x2="4.2" y2="4.2"/><line x1="11.8" y1="11.8" x2="13.1" y2="13.1"/><line x1="2.9" y1="13.1" x2="4.2" y2="11.8"/><line x1="11.8" y1="4.2" x2="13.1" y2="2.9"/></g></svg>';
  var EVO_MOON_SVG = '<svg class="evo-cond-icon" viewBox="0 0 16 16" aria-hidden="true"><path d="M14 9.5 A6.5 6.5 0 1 1 6.5 2 A5.2 5.2 0 0 0 14 9.5 Z" fill="currentColor"/></svg>';

  // Icon row above the arrow: the required item's sprite (stone/trade/held)
  // or a heart (friendship), plus an optional sun/moon and, for a
  // known-move-type trigger, a small type pill.
  function evoArrowIconsHtml(via) {
    var icons = "";
    if (via.item) {
      // No generic "unknown item" placeholder exists, so an item with no
      // bundled art (black-augurite, peat-block) just hides its <img>.
      // Tappable (0.2.7, data-item -> openItemPopup) when ITEMS_DATA names
      // it; tm-normal is the app's own "knows a move" icon, not an item.
      var itemData = ITEMS_DATA[via.item];
      icons += '<img class="evo-arrow-item' + (itemData ? " item-tap" : "") + '" src="' + itemSpriteUrl(via.item) +
        '" alt="' + escapeHtml(itemData ? itemData.name : "") + '"' + (itemData ? ' data-item="' + escapeHtml(via.item) + '" role="button" tabindex="0"' : "") +
        ' onerror="this.style.display=\'none\';">';
    } else if (via.method === "level" && typeof via.level !== "number") {
      icons += EVO_HEART_SVG;
    }
    // A gender-gated edge (0.2.3) shows its symbol *alongside* whatever it
    // already had, not instead of it — Snorunt->Froslass reads as a Dawn
    // Stone plus a ♀, and Combee->Vespiquen (no item, no friendship) gets
    // the ♀ as its only icon.
    if (GENDER_GLYPH[via.gender]) {
      icons += '<span class="evo-gender gender-' + via.gender + '">' + GENDER_GLYPH[via.gender] + "</span>";
    }
    if (via.timeOfDay === "day") icons += EVO_SUN_SVG;
    else if (via.timeOfDay === "night") icons += EVO_MOON_SVG;
    if (via.moveType) {
      icons += pillHtml(via.moveType.charAt(0).toUpperCase() + via.moveType.slice(1));
    }
    return icons ? '<span class="evo-arrow-icons">' + icons + "</span>" : "";
  }

  // spriteSrc overrides the bubble's art, same shape as renderGrid's
  // spriteFn override (the region chips' regionalCellSprite); falsy keeps the
  // default. Used for the gendered-parent case below. nameOverride does the
  // same for the label/alt text (an alt forme's own name, 0.3.9). `data-id`
  // stays the BASE species id either way — tapping opens the base species'
  // page; target-forme auto-navigation is a separate deferred item (TODO #4).
  function evoStageHtml(id, spriteSrc, nameOverride) {
    var mon = findPokemon(id);
    if (!mon) return "";
    var name = nameOverride || mon.name;
    return '<button class="evo-stage" type="button" data-id="' + id + '">' +
      '<span class="evo-sprite-wrap"><img class="evo-sprite" src="' + (spriteSrc || displaySpriteUrl(id)) + '" alt="' + escapeHtml(name) + '"' + SPRITE_ONERROR_ATTR + '></span>' +
      '<span class="evo-name">' + escapeHtml(name) + "</span></button>";
  }

  // Art for the *source* stage of a gender-gated edge, or null to keep the
  // default sprite. Only female art is bundled (the default sprite is the
  // male/non-dimorphic one), so a "male" edge always falls through — the
  // check is "is there bundled art for the gender this edge requires?",
  // not a hardcoded "female", so male-specific art would just work.
  function evoGenderSpriteUrl(id, gender) {
    var mon = gender === "female" ? findPokemon(id) : null;
    return mon && mon.hasFemaleSprite ? femaleSpriteUrl(id) : null;
  }

  // One plain-text line at the bottom of the Evolution Line card, for a
  // chain whose branches share an identical arrow label and need something
  // beyond it to tell them apart (0.2.1, TODO.md #12). Keyed off the data,
  // not off species ids: any future entry carrying these fields gets the
  // line for free. Everything else renders nothing.
  function evoDescriptorHtml(root) {
    var e = EVOLUTIONS[root];
    if (!e) return "";
    // Every edge in the whole chain, not just the root's own: Kirlia->Gallade
    // carries `gender` one step below the root (Ralts), and the card is
    // chain-wide, so every member shows the same line (0.2.2).
    var edges = evolutionPaths(root).reduce(function (acc, path) {
      return acc.concat(path.map(function (step) { return step.via; }).filter(Boolean));
    }, []);
    var text = e.note;
    if (!text) {
      var statEdge = edges.find(function (x) { return x.statCompare; });
      var genderEdge = edges.find(function (x) { return x.gender; });
      if (statEdge) {
        text = "Evolves based on Attack vs. Defense" +
          (statEdge.level !== undefined ? " at level " + statEdge.level : "") + ".";
      } else if (genderEdge) {
        text = "Evolves based on gender.";
      }
    }
    return text ? '<p class="detail-section-note">' + escapeHtml(text) + "</p>" : "";
  }

  // A Pokemon with no evolution relationship at all (nothing evolves into
  // it, it evolves into nothing) hides this whole module rather than
  // showing a "Does not evolve" note (rule 8, PLAN.md "Alt Formes wiring").
  // One with a prior evolution but no further one still has a real
  // (length > 1) path, so it keeps the module with just no forward arrow.
  function evolutionCardHtml(entry) {
    var root = evolutionRootId(entry.id);
    var paths = evolutionPaths(root);
    var singleStage = paths.length === 1 && paths[0].length === 1;
    if (singleStage) return "";
    var html = '<div class="detail-section evolution-card"><p class="detail-section-label">Evolution Line</p>';
    // Fan-out: a root with 3+ branches that all end after one step (Eevee,
    // Tyrogue) repeats the root bubble once per row in the layout below, so
    // draw the root once and hang the branches off it instead. Anything
    // deeper or mixed keeps the per-path rows.
    var descriptor = evoDescriptorHtml(root);
    var isFan = paths.length >= 3 && paths.every(function (p) { return p.length === 2; });
    if (isFan) {
      // Every branch leaves the same root, so the chevron is drawn once
      // between the root and the branches instead of repeated per branch;
      // each branch keeps only its own condition icons and label.
      var rootForme = evoStageForme(root, null);
      html += '<div class="evo-fan"><div class="evo-row">' +
        evoStageHtml(root, rootForme && altFormSpriteUrl(rootForme.sprite, false), rootForme && rootForme.name) + "</div>" +
        '<span class="evo-arrow evo-fan-arrow">' + EVO_ARROW_SVG + "</span>";
      // Explicit row groups rather than one flex-wrap container: a wrap
      // line break can't carry a border, and the rows need dividers.
      for (var r = 0; r < paths.length; r += FAN_ROW_SIZE) {
        html += '<div class="evo-fan-row">';
        paths.slice(r, r + FAN_ROW_SIZE).forEach(function (path) {
          var leaf = path[1];
          var leafForme = evoStageForme(leaf.id, null);
          html += '<div class="evo-fan-branch"><span class="evo-arrow">' + evoArrowIconsHtml(leaf.via) +
            '<span class="evo-level">' + escapeHtml(evoArrowLabel(leaf.via)) + "</span></span>" +
            evoStageHtml(leaf.id, leafForme && altFormSpriteUrl(leafForme.sprite, false), leafForme && leafForme.name) + "</div>";
        });
        html += "</div>";
      }
      html += "</div>" + descriptor + "</div>";
      return html;
    }
    paths.forEach(function (path) {
      html += '<div class="evo-row">';
      path.forEach(function (step, i) {
        if (i > 0) {
          html += '<span class="evo-arrow">' + evoArrowIconsHtml(step.via) + EVO_ARROW_SVG +
            '<span class="evo-level">' + escapeHtml(evoArrowLabel(step.via)) + "</span></span>";
        }
        // A stage that feeds a gender-gated edge shows that gender's art if
        // it's bundled — keyed off the *next* step's edge, so it works at
        // any depth in the row (Kirlia->Gallade sits at i === 1), and Burmy's
        // two rows can differ from each other. Combee->Vespiquen is the only
        // shipped case with art today.
        // An active/producing alt forme (0.3.9) takes priority over that:
        // the two never co-occur in the shipped data.
        var next = path[i + 1];
        var stepForme = evoStageForme(step.id, next);
        var spriteSrc = stepForme
          ? altFormSpriteUrl(stepForme.sprite, false)
          : evoGenderSpriteUrl(step.id, next && next.via && next.via.gender);
        html += evoStageHtml(step.id, spriteSrc, stepForme && stepForme.name);
      });
      html += "</div>";
    });
    html += descriptor + "</div>";
    return html;
  }

  // --- Found In card ---
  // Broader than the single `region` field on pokemon.js (which only says
  // where a species was introduced): every region key in LOCATIONS[id]
  // whose area list is non-empty is somewhere it can actually be caught.
  // Sorted into REGIONS' canonical order (the region bar's), not LOCATIONS'
  // insertion order — a species can carry 3-5 of these since 0.3.10's
  // cross-region encounter pass. An unknown key sorts to the end.
  function foundInRegions(id) {
    var loc = LOCATIONS[id] || {};
    var keys = Object.keys(loc).filter(function (r) { return loc[r] && loc[r].length > 0; });
    return keys.sort(function (a, b) {
      var ia = REGION_IDS.indexOf(a), ib = REGION_IDS.indexOf(b);
      if (ia === -1) ia = REGION_IDS.length;
      if (ib === -1) ib = REGION_IDS.length;
      return ia - ib;
    });
  }

  // Regions whose *source* encounter data is missing wholesale, not
  // regions where the Pokemon genuinely can't be caught. Add a region here
  // only for a confirmed upstream gap — a legitimately empty field is not
  // "needs source". Empty since 0.3.7: "paldea" was the sole entry (PokeAPI
  // ships no encounter rows for Scarlet/Violet), and the csv/ rewire gave
  // 104 of the 120 native-Paldea species real SV data. The remaining 16 are
  // genuinely uncatchable (9 evolution-only, 7 static/event-only), so the
  // generic messages below are now the factually correct ones for them.
  var NEEDS_SOURCE_REGIONS = [];

  // SV's two paid-DLC version-group names as they appear in an enc line's
  // `games` field: either bare ("The Teal Mask") or version-exclusive
  // ("Violet: The Indigo Disk"). Anchored both ends so the plain base-game
  // labels ("Scarlet/Violet", "Violet") can never match.
  var DLC_GAMES_RE = /(?:^|: )The (?:Teal Mask|Indigo Disk)$/;

  // True when `region`'s encounter data for `id` exists and EVERY line is
  // DLC-only (mixed base+DLC species just show the plain chip — only a
  // species with NO base-game encounters at all is actually DLC-only).
  // Kitakami/Blueberry sit under the plain "paldea" key (there are no
  // separate REGIONS entries for them), so without this a DLC-exclusive
  // species looks base-game-catchable in Scarlet/Violet (0.3.9).
  function isDlcOnlyRegion(id, region) {
    var areas = (LOCATIONS[id] || {})[region] || [];
    var lines = areas.reduce(function (acc, a) { return acc.concat((a && a.enc) || []); }, []);
    return lines.length > 0 && lines.every(function (e) { return DLC_GAMES_RE.test(e.games || ""); });
  }

  function foundInCardHtml(entry) {
    var regions = foundInRegions(entry.id);
    var html = '<div class="detail-section found-in-card"><p class="detail-section-label">Found In</p>';
    if (regions.length === 0) {
      // "Evolution only" is only a safe claim when something actually
      // evolves into this species; otherwise (Enamorus, a non-evolving
      // species with no encounter data) just say no data (0.1.34).
      if (NEEDS_SOURCE_REGIONS.indexOf(entry.region) !== -1) {
        html += '<p class="detail-section-note needs-source">No wild encounter data &mdash; needs source ' +
          "(" + escapeHtml(regionLabel(entry.region)) + " encounter data isn&rsquo;t in our source yet).</p>";
      } else {
        html += '<p class="detail-section-note">' + (evolutionRootId(entry.id) !== entry.id
          ? "Not found in the wild &mdash; evolution only."
          : "No wild encounter data recorded.") + "</p>";
      }
    } else {
      html += '<div class="chip-row">' + regions.map(function (r) {
        return '<button class="region-chip chip-auto" type="button" data-region="' + r + '">' + escapeHtml(regionLabel(r)) +
          (isDlcOnlyRegion(entry.id, r) ? ' <span class="chip-dlc-tag">DLC</span>' : "") + "</button>";
      }).join("") + "</div>";
    }
    html += "</div>";
    return html;
  }

  // --- Facts list ---
  var BALL_ICON_SVG = '<svg class="ball-icon" viewBox="0 0 24 24" aria-hidden="true">' +
    '<path d="M2 12a10 10 0 0 1 20 0" fill="#f04040" stroke="#222" stroke-width="1.5"/>' +
    '<path d="M2 12a10 10 0 0 0 20 0" fill="#fff" stroke="#222" stroke-width="1.5"/>' +
    '<path d="M2 12h20" stroke="#222" stroke-width="1.5"/>' +
    '<circle cx="12" cy="12" r="3" fill="#fff" stroke="#222" stroke-width="1.5"/></svg>';

  // Standard Gen 3+ capture formula at full HP, no status, regular Poke
  // Ball (ball/status bonuses both x1) — the HP terms cancel out exactly
  // at full HP, so the modified rate simplifies to catchRate/3.
  function captureOddsPercent(rate) {
    var a = rate / 3;
    if (a >= 255) return 100;
    var b = 1048560 / Math.sqrt(Math.sqrt(16711680 / a));
    var p = Math.pow(Math.min(b / 65536, 1), 4);
    return Math.round(p * 1000) / 10;
  }

  // Held-item chip summary (0.2.8): the rate when every game agrees, else the
  // low–high span. The per-game groups themselves are in the item popup.
  function heldRateSummary(h) {
    var rates = (h.rates || []).map(function (g) { return g.rate; });
    if (!rates.length) return "";
    var lo = Math.min.apply(null, rates), hi = Math.max.apply(null, rates);
    return (lo === hi ? lo : lo + "–" + hi) + "%";
  }

  // Appends any alt forme's own distinct ability (rule 4) after the base
  // entry's own abilities, tagged with that forme's short label — reusing
  // .hidden-tag's generic small-badge styling (a Mega/Gmax forme adds
  // .mega-tag on top for the red/outlined variant, so it doesn't read as
  // the tan "Hidden" badge). Exercised by every Mega forme since 0.1.34; the
  // `ability` field is a name resolved in ABILITIES like every other
  // ability reference. A forme carrying the plural `abilities` field
  // instead is skipped here: that one REPLACES the list via
  // setActiveForme's swap rather than appending, so appending it too would
  // double it up.
  function altFormAbilityItemsHtml(entry) {
    var altData = ALT_FORMS[entry.id];
    if (!altData || !altData.formes) return "";
    var items = "";
    altData.formes.forEach(function (forme) {
      if (!forme.ability || forme.abilities) return;
      var tag = altFormeShortLabel(forme, entry);
      var data = ABILITIES[forme.ability];
      items += '<div class="ability-item"><div class="ability-name">' + escapeHtml(forme.ability) +
        ' <span class="hidden-tag' + (forme.isMega || forme.isGmax ? " mega-tag" : "") + '">' + escapeHtml(tag) + "</span></div>" +
        '<div class="ability-desc">' + escapeHtml(data ? data.description : "") + "</div></div>";
    });
    return items;
  }

  function abilityListHtml(entry) {
    var items = (entry.abilities || []).map(function (name) {
      var isHidden = name === entry.hiddenAbility;
      var data = ABILITIES[name];
      var desc = data ? data.description : "";
      return '<div class="ability-item"><div class="ability-name">' + escapeHtml(name) +
        (isHidden ? ' <span class="hidden-tag">Hidden</span>' : "") + "</div>" +
        '<div class="ability-desc">' + escapeHtml(desc) + "</div></div>";
    }).join("");
    items += altFormAbilityItemsHtml(entry);
    if (!items) return "";
    return '<div class="detail-row column"><span class="detail-key">Abilities</span><div class="ability-list">' + items + "</div></div>";
  }

  // Split out from factsListHtml so setActiveForme() (rule 9's swap-on-tap)
  // can re-render just .detail-facts's contents against a synthetic
  // { ...entry, types: forme.types } object, without duplicating this
  // logic. Note this always uses the *real* entry.id for STATS — only rows
  // driven by the fields a forme can override change when one is active:
  // `types` (Type pill + Weakness/Resists/Neutral) and `abilities` /
  // `hiddenAbility` (the Abilities list), per rule 9.
  function factsRowsHtml(entry) {
    var matchups = computeMatchups(entry.types || []);
    var rows = "";
    rows += pillRowHtml("Type", (entry.types || []).map(function (t) { return { type: t }; }), "type-pills");
    rows += abilityListHtml(entry);
    if (entry.category) rows += rowHtml("Category", entry.category);
    // Egg Groups sits beside Category (both species trivia) — user-directed
    // move 0.2.8 from its 0.2.7 slot after Exp Growth.
    if (entry.eggGroups && entry.eggGroups.length) rows += rowHtml("Egg Groups", entry.eggGroups.join(" / "));
    if (entry.height !== undefined && entry.weight !== undefined) {
      var heightVal = useImperialUnits ? metersToFeetInches(entry.height) : entry.height + " m";
      var weightVal = useImperialUnits ? kgToLbs(entry.weight) : entry.weight + " kg";
      rows += rowHtml("Height / Weight", heightVal + " / " + weightVal);
    }
    var stats = STATS[entry.id];
    if (stats && stats.captureRate !== undefined) {
      var odds = captureOddsPercent(stats.captureRate);
      rows += '<div class="detail-row"><span class="detail-key">Capture Rate</span><span class="detail-val">' +
        '<span class="capture-val">' + BALL_ICON_SVG + stats.captureRate + " (" + odds + "%)</span></span></div>";
    }
    // Held Items sits with the other catching info, right after Capture Rate
    // — user-directed move 0.2.8 from its 0.2.7 slot after Exp Growth.
    // One chip per wild held item (sprite + name + rate), tap ->
    // openItemPopup for the per-game breakdown. Same delegated .item-tap
    // hook the Evolution Line's arrow item icons use.
    if (entry.heldItems && entry.heldItems.length) {
      rows += '<div class="detail-row column"><span class="detail-key">Held Items</span><div class="chip-row item-chips">' +
        entry.heldItems.map(function (h) {
          var it = ITEMS_DATA[h.item];
          return '<button class="item-chip item-tap" type="button" data-item="' + escapeHtml(h.item) + '">' +
            '<img src="' + itemSpriteUrl(h.item) + '" alt="" onerror="this.style.display=\'none\';">' +
            escapeHtml(it ? it.name : h.item) + ' <span class="item-rate">' + heldRateSummary(h) + "</span></button>";
        }).join("") + "</div></div>";
    }
    if (stats && stats.expGrowth) {
      rows += rowHtml("Exp Growth", stats.expGrowth.points.toLocaleString() + " – " + stats.expGrowth.curve);
    }
    // Matchup rows close out the card (pre-0.1.34 order, restored 0.1.38).
    rows += pillRowHtml("Weakness", matchups.weak, "weak-pills");
    rows += pillRowHtml("Resists", matchups.resist, "weak-pills");
    if (matchups.immune.length) rows += pillRowHtml("Immune", matchups.immune, "weak-pills");
    rows += pillRowHtml("Neutral", matchups.neutral.map(function (m) { return { type: m.type }; }), "weak-pills");
    return rows;
  }

  function factsListHtml(entry) {
    var rows = factsRowsHtml(entry);
    if (!rows) return "";
    return '<div class="detail-facts">' + rows + "</div>";
  }

  // --- Learnable moves card (up to 5 tabs behind .move-tab / .move-list) ---
  var MOVE_TABS = [
    { key: "levelUp", label: "Level-Up" },
    { key: "tm", label: "TM" },
    { key: "egg", label: "Egg" },
    { key: "max", label: "Max" },
    { key: "tutor", label: "Tutor" }
  ];
  // Legends: Arceus learnsets (0.2.18) are level-up + tutor only — no TMs,
  // no breeding, no Dynamax. Its own tab list, kept separate from the
  // mainline one above so the two can diverge freely.
  var MOVE_TABS_HISUI = [
    { key: "levelUp", label: "Level-Up" },
    { key: "tutor", label: "Tutor" }
  ];

  // Each row: level requirement (level-up tab only, fixed-width column),
  // the move's type pill from MOVES (0.1.34), then the name.
  function moveListHtml(tab, list, active) {
    var rows = list.map(function (m) {
      var isLevelUp = tab.key === "levelUp";
      var name = isLevelUp ? m.move : m;
      var req = isLevelUp ? '<span class="move-req">Lv ' + m.level + "</span>" : "";
      var data = MOVES[name];
      return '<div class="move-row">' + req + (data ? pillHtml(data.type) : "") + '<span class="move-name">' + escapeHtml(name) + "</span></div>";
    }).join("");
    return '<div class="move-list' + (active ? " active" : "") + '" data-list="' + tab.key + '">' + rows + "</div>";
  }

  // Empty lists get no tab at all (0.1.34) — `max` is [] for every entry
  // by design (no Dynamax in Gen 9), so "No Max moves" was pure noise. A
  // species with no moveset data at all gets no card.
  function movesCardHtml(entry) {
    // Opened from the Hisui screen, and this species has PLA data? Then the
    // card reads Legends: Arceus' own learnset instead of the mainline one
    // (0.2.18) — same nav-origin signal that auto-activates the Hisuian
    // forme. Anywhere else, or no PLA data, falls back to MOVESETS.
    var hisuiSet = fromHisuiScreen ? MOVESETS_HISUI[entry.id] : null;
    var set = hisuiSet || MOVESETS[entry.id];
    if (!set) return "";
    var present = (hisuiSet ? MOVE_TABS_HISUI : MOVE_TABS).filter(function (t) { return set[t.key] && set[t.key].length; });
    if (!present.length) return "";
    var tabs = present.map(function (t, i) {
      return '<button class="move-tab' + (i === 0 ? " active" : "") + '" type="button" data-tab="' + t.key + '">' + t.label + "</button>";
    }).join("");
    var lists = present.map(function (t, i) { return moveListHtml(t, set[t.key], i === 0); }).join("");
    return '<div class="detail-section moves-card"><p class="detail-section-label">Learnable Moves</p>' +
      '<div class="move-tabs">' + tabs + "</div>" + lists + "</div>";
  }

  function setActiveMoveTab(container, key) {
    var tabs = container.querySelectorAll(".move-tab");
    for (var i = 0; i < tabs.length; i++) tabs[i].classList.toggle("active", tabs[i].getAttribute("data-tab") === key);
    var lists = container.querySelectorAll(".move-list");
    for (var j = 0; j < lists.length; j++) lists[j].classList.toggle("active", lists[j].getAttribute("data-list") === key);
  }

  // --- Base stats card: value table (Base / Lv.1 / Lv.100, 31 IV / 0 EV /
  // neutral nature) + a hand-drawn hexagonal radar SVG, no chart library. ---
  function calcStat(base, level, isHp) {
    var core = Math.floor((2 * base + 31) * level / 100);
    return isHp ? core + level + 10 : core + 5;
  }

  var STAT_ROWS = [
    { key: "hp", label: "HP", isHp: true },
    { key: "attack", label: "Attack" },
    { key: "defense", label: "Defense" },
    { key: "spAttack", label: "Sp. Atk" },
    { key: "spDefense", label: "Sp. Def" },
    { key: "speed", label: "Speed" }
  ];

  var RADAR_AXES = [
    { key: "hp", label: "HP" },
    { key: "attack", label: "Atk" },
    { key: "defense", label: "Def" },
    { key: "speed", label: "Spe" },
    { key: "spDefense", label: "SpD" },
    { key: "spAttack", label: "SpA" }
  ];

  // Fixed 0-255 scale (0.1.34, user-confirmed) so shapes compare across
  // species — a per-species max made every radar fill the hexagon. The
  // radius grew 60 -> 105 to compensate: a ~300-BST species (avg 50/stat)
  // now draws a ~21px polygon, larger than its old 15px (50/200 x 60), and
  // the two grid rings land on 85/170. The card is 308px wide inside the
  // phone frame, so a 280px-wide SVG fits with the labels.
  var RADAR_MAX = 255;

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

    var statPts = RADAR_AXES.map(function (a, i) {
      return point(i, (Math.min(stats[a.key], RADAR_MAX) / RADAR_MAX) * r).join(",");
    }).join(" ");

    var labels = RADAR_AXES.map(function (a, i) {
      var p = point(i, r + 16);
      return '<text x="' + p[0] + '" y="' + p[1] + '" font-size="10" fill="#f4e3b4" text-anchor="middle" dominant-baseline="middle">' + a.label + "</text>";
    }).join("");

    return '<svg class="stat-radar" viewBox="0 0 280 270" aria-hidden="true">' + backdrop + grid +
      '<polygon points="' + statPts + '" fill="rgba(77,163,255,0.35)" stroke="#4da3ff" stroke-width="1.5"/>' +
      labels + "</svg>";
  }

  // Shared by the base Base Stats card and any per-forme stat card below
  // (rule 3: a forme with its own `stats` field gets its own card, sorted
  // beneath the main form's — same code path for Deoxys's Attack Forme and
  // every Mega Evolution).
  function statsTableAndRadarHtml(label, stats) {
    var rows = STAT_ROWS.map(function (r) {
      var base = stats[r.key];
      return "<tr><td>" + r.label + "</td><td>" + base + "</td><td>" + calcStat(base, 1, r.isHp) + "</td><td>" + calcStat(base, 100, r.isHp) + "</td></tr>";
    }).join("");
    var bst = STAT_ROWS.reduce(function (sum, r) { return sum + stats[r.key]; }, 0);
    rows += '<tr class="stat-total-row"><td>Total:</td><td>' + bst + "</td><td></td><td></td></tr>";
    return '<div class="detail-section stats-card"><p class="detail-section-label">' + escapeHtml(label) + '</p>' +
      '<table class="stats-table"><thead><tr><th>Stat</th><th>Base</th><th>Lv.1</th><th>Lv.100</th></tr></thead><tbody>' + rows + "</tbody></table>" +
      '<p class="stats-note">Lv.1/Lv.100 assume 31 IVs, 0 EVs, a neutral nature. Radar scale 0&ndash;' + RADAR_MAX + '.</p>' +
      '<div class="radar-wrap">' + radarSvg(stats) + "</div></div>";
  }

  function statsCardHtml(entry) {
    var stats = STATS[entry.id];
    if (!stats) return "";
    var html = statsTableAndRadarHtml("Base Stats", stats);
    var altData = ALT_FORMS[entry.id];
    if (altData && altData.formes) {
      // Rule 7: non-Mega/Gmax formes sharing one identical stat line get a
      // single combined card (Paldean Tauros's 3 breeds); every Mega/Gmax
      // keeps its own card (rule 3).
      var cards = [], shared = {};
      altData.formes.forEach(function (forme) {
        if (!forme.stats) return;
        var sig = forme.isMega || forme.isGmax ? null : JSON.stringify(forme.stats);
        if (sig && shared[sig]) { shared[sig].names.push(forme.name); return; }
        var card = { names: [forme.name], stats: forme.stats };
        if (sig) shared[sig] = card;
        cards.push(card);
      });
      cards.forEach(function (c) { html += statsTableAndRadarHtml("Base Stats — " + c.names.join(" / "), c.stats); });
    }
    return html;
  }

  // --- Name-languages / found-in-location popup (one popup, two uses) ---
  // One modal is reused by every popup, so "closing" is ambiguous when one
  // popup replaced another in place (the recolor grid -> zoomed forme case,
  // 0.3.18). Optional `backTo` = {title, html}: a dismiss returns there
  // instead of closing. Passing nothing clears it, so every other call site
  // (and the grid's own fresh open) keeps closing outright, unchanged.
  function openDetailPopup(title, bodyHtml, backTo) {
    popupBackTo = backTo || null;
    detailPopupTitle.textContent = title;
    detailPopupBody.innerHTML = bodyHtml;
    detailPopupBackdrop.classList.add("active");
    detailPopup.setAttribute("aria-hidden", "false");
  }

  // Dismiss: steps back to popupBackTo if one is pending, else really
  // closes. `force` skips the step-back — for callers tearing down or
  // navigating away from the whole detail screen (closeDetail/backDetail),
  // where leaving a stepped-back popup floating would be a bug. User
  // dismissals (close button, backdrop, Escape) pass nothing.
  function closeDetailPopup(force) {
    if (!force && popupBackTo) {
      var backTo = popupBackTo;
      popupBackTo = null;
      openDetailPopup(backTo.title, backTo.html);
      return;
    }
    popupBackTo = null;
    detailPopupBackdrop.classList.remove("active");
    // #detailPopupClose lives inside the popup — blur before hiding it.
    if (detailPopup.contains(document.activeElement)) document.activeElement.blur();
    detailPopup.setAttribute("aria-hidden", "true");
  }

  function isDetailPopupOpen() {
    return detailPopupBackdrop.classList.contains("active");
  }

  function popupRow(label, value) {
    return '<div class="popup-row"><span class="k">' + escapeHtml(label) + '</span><span class="v">' + escapeHtml(value) + "</span></div>";
  }

  function openNameLanguagesPopup(entry) {
    var n = NAMES[entry.id];
    var rows = popupRow("English", entry.name);
    if (n) {
      rows += popupRow("Japanese", n.ja + " (" + n.jaRomaji + ")");
      rows += popupRow("French", n.fr);
      rows += popupRow("German", n.de);
      rows += popupRow("Korean", n.ko);
    }
    openDetailPopup("Names", rows);
  }

  // A "/"-joined game list is one unbreakable word to the line breaker (no
  // break opportunity after "/"), so a long one overflowed the fixed-width
  // popup and turned .detail-popup-body's overflow-y:auto into a horizontal
  // scrollbar (0.2.9). A <wbr> after each "/" gives it somewhere to wrap;
  // .enc-games's overflow-wrap covers a pathologically long single name.
  function encGamesHtml(games) {
    if (!games) return "";
    return '<span class="enc-games">' + escapeHtml(games).replace(/\//g, "/<wbr>") + "</span>";
  }

  // Both source vocabularies (PokeAPI's classic areas, PokeDB's new-shape
  // ones) can name the same place identically — ~40 Sinnoh species have a
  // "Lake Verity" from each — which rendered as two indistinguishable
  // collapsed rows (0.3.9). Merge on the exact name, keeping the FIRST
  // occurrence's position so the in-game progression ordering the array
  // already carries survives, and concatenating the enc lines behind it.
  // A bare-string (pre-0.2.7) entry has no enc lines to carry.
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

  // "harsh-sunlight" -> "Harsh Sunlight". Mirrors tools/populate_from_csv.js's
  // titleCase; reimplemented here rather than shared (no build step).
  function encTitleCase(s) {
    return String(s).split("-").map(function (w) { return w.charAt(0).toUpperCase() + w.slice(1); }).join(" ");
  }

  function encSeg(html) {
    return html ? " &middot; " + html : "";
  }

  function encRangeSeg(prefix, min, max) {
    if (min === undefined) return "";
    return encSeg(prefix + (min === max ? min : min + "&ndash;" + max));
  }

  var TIME_RATE_KEYS = ["morning", "day", "evening", "night"];

  // The optional NEW_ENC_SHAPE fields (SV/BDSP/LA), rendered in a fixed
  // order after the classic method/Lv/rate segments and before the games
  // sub-line (0.3.9). Every one is conditional, so a classic-shape line
  // still renders byte-identically. `group`/`tradeFor` are raw PokeDB
  // species slugs — shown verbatim, no pokemon.js lookup.
  function encExtrasHtml(e) {
    var out = "";
    if (e.forme) {
      var forme = findForme(detailEntryId, e.forme);
      out += encSeg(escapeHtml(forme ? forme.name : encTitleCase(e.forme)));
    }
    if (e.teraStars !== undefined) out += encSeg(e.teraStars + "&#9733; Tera Raid");
    out += encRangeSeg("Alpha Lv ", e.alphaMin, e.alphaMax);
    ["terrain", "weather", "times"].forEach(function (field) {
      if (e[field] && e[field].length) out += encSeg(escapeHtml(e[field].map(encTitleCase).join("/")));
    });
    if (e.timeRates) {
      var keys = TIME_RATE_KEYS.filter(function (k) { return e.timeRates[k] !== undefined; });
      // A single key says nothing the plain `rate` segment doesn't already.
      if (keys.length > 1) {
        out += encSeg(escapeHtml(keys.map(function (k) {
          return encTitleCase(k) + " " + String(e.timeRates[k]);
        }).join(", ")));
      }
    }
    if (e.hiddenAbility) out += encSeg("HA possible");
    if (e.boulder) out += encSeg("Requires boulder");
    if (e.group) out += encSeg(escapeHtml("with " + e.group));
    out += encRangeSeg("Way Home Lv ", e.homeMin, e.homeMax);
    if (e.tradeFor) out += encSeg(escapeHtml("Trade for " + e.tradeFor));
    if (e.note) out += encSeg(escapeHtml(e.note));
    return out;
  }

  function openLocationPopup(regionId) {
    if (detailEntryId === null) return;
    var areas = mergeAreasByName((LOCATIONS[detailEntryId] || {})[regionId] || []);
    // 0.2.8 shape: { area, enc: [{ method, games, min, max, rate }] } — one
    // line per method per game-group under the area name, games named on
    // their own sub-line so a long list ("Black 2/White 2") can't overflow
    // the 360px popup. A bare string (pre-0.2.7 entry) still renders as just
    // the name; a pre-0.2.8 line just has no games sub-line.
    // Each area is a native <details> (0.2.10) — the encounter lines are
    // collapsed until its name is tapped, so a 24-area list like Pidgey's
    // Kanto reads as one screen of area names instead of a long scroll.
    // Native gives us the marker, the toggle state, Enter/Space and the
    // screen-reader semantics for free; nothing here is JS-driven. Areas
    // come in in-game progression order since 0.2.10 (populate_region.js's
    // REGION_ORDER_GEN), so the first row is the earliest-reached area.
    // A lone area opens by default — there is nothing to scan past, so
    // making the only content cost a tap would be strictly worse.
    var body = areas.length
      ? areas.map(function (a) {
        var name = typeof a === "string" ? a : a.area;
        var lines = (a.enc || []).map(function (e) {
          // 0.3.7: the SV/BDSP/LA lines don't all fit the classic numeric
          // (min, max, rate) shape — `min`/`max` can be absent and `rate` can
          // be a verbatim string ("varies", "one", "10%"). Both parts are
          // conditional so those degrade to just the method instead of
          // rendering "Lv undefined" / "varies%". A classic numeric line is
          // byte-identical to what this always emitted. The rest of
          // NEW_ENC_SHAPE's optional fields land in encExtrasHtml (0.3.9).
          var lv = e.min === undefined ? "" : " &middot; Lv " + (e.min === e.max ? e.min : e.min + "&ndash;" + e.max);
          var rate = e.rate === undefined ? "" : " &middot; " + (typeof e.rate === "number" ? e.rate + "%" : escapeHtml(e.rate));
          return '<div class="enc-line">' + escapeHtml(e.method) + lv + rate + encExtrasHtml(e) +
            encGamesHtml(e.games) + "</div>";
        }).join("");
        if (!lines) return '<div class="popup-row column"><span class="v" style="text-align:left">' + escapeHtml(name) + "</span></div>";
        return '<details class="popup-row area-row"' + (areas.length === 1 ? " open" : "") + "><summary>" +
          escapeHtml(name) + '</summary><div class="area-encs">' + lines + "</div></details>";
      }).join("")
      : '<p class="popup-note">No specific areas recorded.</p>';
    openDetailPopup(regionLabel(regionId), body);
  }

  // Item popup (0.2.7): sprite + hand-authored description from ITEMS_DATA.
  // Since 0.2.8 it also carries the per-game wild-hold rates, when the open
  // detail entry is a species that holds this item — same grouping the Found
  // In popup uses (one line per rate, games named under it). An evolution
  // arrow's item icon opens the same popup and simply gets no such block,
  // unless that species happens to hold the item too.
  function openItemPopup(slug) {
    var it = ITEMS_DATA[slug];
    if (!it) return;
    var entry = detailEntryId === null ? null : findPokemon(detailEntryId);
    var held = entry && (entry.heldItems || []).filter(function (h) { return h.item === slug; })[0];
    var rates = held ? (held.rates || []).map(function (g) {
      return '<div class="enc-line">' + g.rate + "%" + encGamesHtml(g.games) + "</div>";
    }).join("") : "";
    openDetailPopup(it.name, '<div class="item-popup"><img class="item-popup-sprite" src="' + itemSpriteUrl(slug) +
      '" alt="" onerror="this.style.display=\'none\';"><p class="popup-note">' + escapeHtml(it.description) + "</p>" +
      (rates ? '<div class="held-rates"><span class="held-rates-label">Held in the wild</span>' + rates + "</div>" : "") + "</div>");
  }

  // Wrapped, not passed by reference: the Event arg would land in `force`.
  detailPopupClose.addEventListener("click", function () { closeDetailPopup(); });
  detailPopupBackdrop.addEventListener("click", function (e) {
    if (e.target === detailPopupBackdrop) closeDetailPopup();
  });

  // #detailPopupBody is shared by every popup (names, found-in, item
  // details, the rule-6 recolor grid), and it sits outside #detailBody, so
  // detailBody's delegated listener never sees clicks in here. This one
  // exists solely to give the recolor grid's sprites the same
  // tap-to-enlarge as the picture card's (0.3.3): it must ignore every
  // other popup's content, hence the .altforms-popup-item scoping. The
  // zoomed view replaces the grid in the same modal, so it passes a backTo
  // (0.3.18) — dismissing it re-renders the grid it came from rather than
  // closing the modal; a second dismiss closes for real. The grid HTML is
  // regenerated from the same function that opened it, so "back" always
  // lands on a byte-identical grid.
  detailPopupBody.addEventListener("click", function (e) {
    var formeSprite = e.target.closest ? e.target.closest(".altforms-popup-item .evo-sprite") : null;
    if (!formeSprite) return;
    var recolorEntry = detailEntryId === null ? null : findPokemon(detailEntryId);
    var recolorData = recolorEntry && ALT_FORMS[recolorEntry.id];
    var backTo = recolorData ? { title: recolorEntry.name + " Formes", html: altFormsRecolorPopupHtml(recolorData) } : null;
    openDetailPopup(formeSprite.alt, '<div class="item-popup"><img class="sprite-zoom-img" src="' +
      formeSprite.src + '" alt="' + escapeHtml(formeSprite.alt) + '"' + SPRITE_ONERROR_ATTR + "></div>", backTo);
  });

  detailName.addEventListener("click", function () {
    if (detailEntryId === null) return;
    var entry = findPokemon(detailEntryId);
    if (entry) openNameLanguagesPopup(entry);
  });

  // One delegated listener for everything interactive inside the rebuilt
  // detail body: move tabs, evolution-stage jumps, found-in region chips
  // and alt-forme bubbles. Alt-forme bubbles are checked before .evo-stage
  // since they reuse that same class (rule 2) but need different behavior
  // (setActiveForme, not navigation) — .altforms-card scopes the check to
  // just that module; inert (.altform-inert) bubbles are ignored. The
  // rule-6 recolor bubble reuses .evo-stage too, so it's checked first of
  // all (via its own .altforms-recolor-bubble class) so it never falls
  // through to setActiveForme.
  detailBody.addEventListener("click", function (e) {
    var moveTab = e.target.closest ? e.target.closest(".move-tab") : null;
    if (moveTab) { setActiveMoveTab(detailBody, moveTab.getAttribute("data-tab")); return; }

    var genderBtn = e.target.closest ? e.target.closest(".gender-btn") : null;
    if (genderBtn) { setActiveGender(genderBtn.getAttribute("data-gender")); return; }

    // Picture card sprites only (0.3.3): tap either to see it enlarged. The
    // <img>'s own src/alt already reflect the active forme + gender, so
    // there's nothing to re-derive; detailName is kept in sync by
    // setActiveForme.
    var zoomSprite = e.target.closest ? e.target.closest("#pictureMainSprite, #pictureShinySprite") : null;
    if (zoomSprite) {
      openDetailPopup(detailName.textContent + (zoomSprite.id === "pictureShinySprite" ? " (Shiny)" : ""),
        '<div class="item-popup"><img class="sprite-zoom-img" src="' + zoomSprite.src +
        '" alt="' + escapeHtml(zoomSprite.alt) + '"' + SPRITE_ONERROR_ATTR + "></div>");
      return;
    }

    var recolorBubble = e.target.closest ? e.target.closest(".altforms-recolor-bubble") : null;
    if (recolorBubble) {
      var recolorEntry = detailEntryId === null ? null : findPokemon(detailEntryId);
      var recolorData = recolorEntry && ALT_FORMS[recolorEntry.id];
      if (recolorData) openDetailPopup(recolorEntry.name + " Formes", altFormsRecolorPopupHtml(recolorData));
      return;
    }

    var altStage = e.target.closest ? e.target.closest(".altforms-card .evo-stage") : null;
    if (altStage) {
      if (!altStage.classList.contains("altform-inert")) setActiveForme(altStage.getAttribute("data-forme-key"));
      return;
    }

    var evoStage = e.target.closest ? e.target.closest(".evo-stage") : null;
    if (evoStage) {
      // Push the current Pokemon so Back returns here, not to the grid.
      detailHistory.push(detailEntryId);
      openDetail(Number(evoStage.getAttribute("data-id")));
      return;
    }

    var regionChip = e.target.closest ? e.target.closest(".chip-auto") : null;
    if (regionChip) { openLocationPopup(regionChip.getAttribute("data-region")); return; }

    var itemTap = e.target.closest ? e.target.closest(".item-tap") : null;
    if (itemTap) { openItemPopup(itemTap.getAttribute("data-item")); return; }
  });
  // The arrow item icon is an <img role="button">, not a real button, so
  // Enter/Space need wiring by hand (the Held Items chips are <button>s and
  // fire click natively).
  detailBody.addEventListener("keydown", function (e) {
    if (e.key !== "Enter" && e.key !== " ") return;
    var itemTap = e.target.closest ? e.target.closest("img.item-tap") : null;
    if (itemTap) { e.preventDefault(); openItemPopup(itemTap.getAttribute("data-item")); }
  });

  // Detail screen's per-Pokemon background glow (0.3.13): writes --t1/--t2
  // on #detailScreen for styles.css's .detail-screen gradients. Called from
  // renderDetail (every open, arrow step, evolution-tap jump and settings
  // re-render funnel through it) and from setActiveForme (forme swaps),
  // which is where the Facts card's own type swap already happens — so the
  // two can't drift apart.
  function applyDetailTypeGlow(types) {
    var st = detailScreen.style;
    st.removeProperty("--t1");
    st.removeProperty("--t2");
    if (!types || !types.length) return;
    st.setProperty("--t1", "var(--t-" + types[0].toLowerCase() + ")");
    st.setProperty("--t2", "var(--t-" + (types[1] || types[0]).toLowerCase() + ")");
  }

  function renderDetail(entry) {
    detailName.textContent = entry.name;
    applyDetailTypeGlow(entry.types);
    detailBody.innerHTML = pictureCardHtml(entry) +
      altFormsCardHtml(entry) +
      evolutionCardHtml(entry) +
      foundInCardHtml(entry) +
      factsListHtml(entry) +
      movesCardHtml(entry) +
      statsCardHtml(entry);
    detailBody.scrollTop = 0;
  }

  // Settings-driven re-render of the open detail screen (units): rebuilds the body and restores the active alt forme, which
  // a bare renderDetail() would otherwise drop (0.1.34).
  function rerenderDetail() {
    if (!isDetailOpen()) return;
    var entry = findPokemon(detailEntryId);
    if (!entry) return;
    var scroll = detailBody.scrollTop;
    renderDetail(entry);
    if (activeFormeKey) setActiveForme(activeFormeKey);
    detailBody.scrollTop = scroll;
  }

  function syncFavoriteButton() {
    var on = detailEntryId !== null && isFavorite(detailEntryId);
    detailFav.setAttribute("aria-pressed", on ? "true" : "false");
    detailFav.setAttribute("aria-label", on ? "Remove from favorites" : "Add to favorites");
  }

  // fromRegion: the dex chip a #dexList tap came from (null from Favorites,
  // ArrowLeft/Right, evolution-line taps, Back) — the species' variant forme
  // for that region, if it has one, opens active instead of base (Hisui
  // since 0.1.30; Alola/Galar/Paldea 2026-09-06). formeKey: an explicit
  // forme to open on (a quick-search variant row), wins over fromRegion.
  // Everything else opens on base.
  function openDetail(id, fromRegion, formeKey) {
    var entry = findPokemon(id);
    if (!entry) return;
    detailEntryId = id;
    activeFormeKey = null;
    // Same reset as activeFormeKey: a new Pokemon always opens on its
    // default (male) art, whether via a grid tap, ArrowLeft/Right, or an
    // evolution-stage jump — all of which land here. rerenderDetail()
    // deliberately does NOT reset either one (a units change keeps both).
    activeGender = "male";
    // Set before renderDetail() — movesCardHtml() reads it (0.2.18).
    fromHisuiScreen = fromRegion === "hisui";
    renderDetail(entry);
    var auto = formeKey || (fromRegion && regionalFormes(id, fromRegion)[0] || {}).key;
    if (auto) setActiveForme(auto);
    syncFavoriteButton();
    detailScreen.classList.add("active");
    detailScreen.setAttribute("aria-hidden", "false");
  }

  // Fully closes the detail screen, dropping any evolution-tap history.
  function closeDetail() {
    if (detailEntryId === null) return;
    detailEntryId = null;
    detailHistory = [];
    closeDetailPopup(true);
    detailScreen.classList.remove("active");
    // #detailBack (and every focusable row) lives inside the detail screen.
    if (detailScreen.contains(document.activeElement)) document.activeElement.blur();
    detailScreen.setAttribute("aria-hidden", "true");
  }

  // Back arrow / Escape: return to the previous Pokemon if an evolution
  // tap got us here (0.1.34), otherwise close.
  // A second press within BACK_DOUBLE_MS skips the rest of detailHistory
  // and closes outright (0.2.1) — chain-browsing several stages deep
  // otherwise needs one press per stage. All four triggers (back arrow,
  // Escape, Backspace, mouse button 3) funnel through here, so this is the
  // single place it needs to live. Only the detail-history stack
  // accelerates: backOut()'s outer layers stay one press per layer.
  var BACK_DOUBLE_MS = 400;
  var lastBackAt = 0;

  function backDetail() {
    closeDetailPopup(true);
    var now = Date.now();
    var isDouble = now - lastBackAt < BACK_DOUBLE_MS;
    lastBackAt = now;
    if (detailHistory.length && !isDouble) { openDetail(detailHistory.pop()); } else { closeDetail(); }
  }

  function isDetailOpen() {
    return detailEntryId !== null;
  }

  // ArrowLeft/ArrowRight step to the neighbouring entry in national order
  // (0.1.34) — over POKEMON_DATA sorted by id, clamped at both ends, no
  // history push (browsing, not drilling down).
  var idOrder = POKEMON_DATA.map(function (p) { return p.id; }).sort(function (a, b) { return a - b; });

  function stepDetail(delta) {
    var i = idOrder.indexOf(detailEntryId) + delta;
    if (i < 0 || i >= idOrder.length) return;
    detailHistory = [];
    openDetail(idOrder[i]);
  }

  detailBack.addEventListener("click", backDetail);

  detailFav.addEventListener("click", function () {
    if (detailEntryId === null) return;
    var id = detailEntryId;
    toggleFavorite(id);
    syncFavoriteButton();
    updateFavoriteBadges(id);
    // Un-starring while the Favorites screen is behind us should drop the
    // entry from that grid, so rebuild it.
    if (currentView === "favorites") renderFavorites();
  });

  // Any grid cell, on either screen, opens that Pokemon's detail view. Only
  // a dex-grid tap carries the active chip (regional auto-forme); a
  // quick-search variant row carries its forme key outright.
  function openDetailFromCell(cell, list) {
    openDetail(Number(cell.getAttribute("data-id")), list === dexList ? currentRegionFilter : null, cell.getAttribute("data-forme"));
  }

  // Grab-to-scroll (0.3.12). Touch already scrolls these grids natively —
  // .dex-list is overflow-y:auto and .phone's touch-action is pan-y, and
  // nothing in the drawer's pointer handling reaches inside the grid — so
  // this only runs for mouse/pen, where there was no way to scroll except
  // the 8px scrollbar or a wheel. Running it for touch too would fight the
  // browser's own momentum scrolling.
  // A drag and a tap start identically, so movement past DRAG_SCROLL_SLOP
  // flips dragScrolled, which the click handler below uses to swallow the
  // click that would otherwise open a cell. Reset on every pointerdown, so
  // a stale true can't survive into the next press.
  var DRAG_SCROLL_SLOP = 5; // logical px
  var dragScrolled = false;

  [dexList, favoritesList].forEach(function (list) {
    var scrollPointerId = null;
    var scrollStartY = 0;
    var scrollStartTop = 0;

    list.addEventListener("pointerdown", function (e) {
      dragScrolled = false;
      if (e.pointerType === "touch" || e.button !== 0) return;
      scrollPointerId = e.pointerId;
      scrollStartY = e.clientY / phoneScale;
      scrollStartTop = list.scrollTop;
    });

    list.addEventListener("pointermove", function (e) {
      if (e.pointerId !== scrollPointerId) return;
      var delta = e.clientY / phoneScale - scrollStartY;
      if (!dragScrolled) {
        if (Math.abs(delta) < DRAG_SCROLL_SLOP) return;
        dragScrolled = true;
        list.classList.add("drag-scrolling");
        // Keep receiving moves once the cursor leaves the grid mid-drag.
        list.setPointerCapture(e.pointerId);
      }
      list.scrollTop = scrollStartTop - delta;
    });

    function endDragScroll(e) {
      if (e.pointerId !== scrollPointerId) return;
      scrollPointerId = null;
      list.classList.remove("drag-scrolling");
    }
    list.addEventListener("pointerup", endDragScroll);
    list.addEventListener("pointercancel", endDragScroll);

    list.addEventListener("click", function (e) {
      if (dragScrolled) return; // that press was a scroll, not a cell tap
      var cell = e.target.closest ? e.target.closest(".dex-cell") : null;
      if (!cell) return;
      openDetailFromCell(cell, list);
    });
    list.addEventListener("keydown", function (e) {
      if (e.key !== "Enter" && e.key !== " ") return;
      var cell = e.target.closest ? e.target.closest(".dex-cell") : null;
      if (!cell) return;
      e.preventDefault();
      openDetailFromCell(cell, list);
    });
  });

  // --- Settings window -------------------------------------------------
  var settingsIcon = document.getElementById("settingsIcon");
  var settingsBackdrop = document.getElementById("settingsBackdrop");
  var settingsWindow = document.getElementById("settingsWindow");
  var settingsClose = document.getElementById("settingsClose");
  var darkModeToggle = document.getElementById("darkModeToggle");

  function openSettings() {
    settingsBackdrop.classList.add("active");
    settingsWindow.classList.add("active");
    settingsWindow.setAttribute("aria-hidden", "false");
  }

  function closeSettings() {
    settingsBackdrop.classList.remove("active");
    settingsWindow.classList.remove("active");
    // #settingsClose and every settings control live inside the window.
    if (settingsWindow.contains(document.activeElement)) document.activeElement.blur();
    settingsWindow.setAttribute("aria-hidden", "true");
  }

  function isSettingsOpen() {
    return settingsWindow.classList.contains("active");
  }

  settingsIcon.addEventListener("click", function () {
    closeMenu();
    openSettings();
  });
  settingsIcon.addEventListener("keydown", function (e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      closeMenu();
      openSettings();
    }
  });

  // "x" in the top right closes the window
  settingsClose.addEventListener("click", closeSettings);

  // Tapping anywhere outside the window closes it
  settingsBackdrop.addEventListener("click", closeSettings);

  // Dark Mode — enabled by default (checkbox starts checked, phone starts
  // with the "theme-dark" class already applied in the HTML). Persisted as
  // vkdex-theme since 0.1.34, read before the first render below.
  var THEME_KEY = "vkdex-theme";

  function setTheme(dark) {
    phone.classList.toggle("theme-dark", dark);
    darkModeToggle.checked = dark;
    try { window.localStorage.setItem(THEME_KEY, dark ? "dark" : "light"); } catch (e) {}
  }

  darkModeToggle.addEventListener("change", function () {
    setTheme(darkModeToggle.checked);
  });

  (function initTheme() {
    var dark = true;
    try { dark = window.localStorage.getItem(THEME_KEY) !== "light"; } catch (e) {}
    setTheme(dark);
  })();

  // Small shared helper for the on/off settings below: wires a .switch
  // checkbox to a setter, persists "on"/"off" under `key`, and applies the
  // saved value (default `fallback`) once up front — that first call gets
  // init=true so an apply() can skip re-rendering before the initial render.
  function wireToggleSetting(input, key, fallback, apply) {
    function set(on, init) {
      input.checked = on;
      try { window.localStorage.setItem(key, on ? "on" : "off"); } catch (e) {}
      apply(on, !!init);
    }
    input.addEventListener("change", function () { set(input.checked); });
    var saved = fallback;
    try {
      var raw = window.localStorage.getItem(key);
      if (raw === "on" || raw === "off") saved = raw === "on";
    } catch (e) {}
    set(saved, true);
  }

  // Shiny sprites in grids (vkdex-shiny-grids): cellHtml/regionalCellSprite
  // read useShinyGrids; the detail screen's own sprite pair is unaffected.
  wireToggleSetting(document.getElementById("shinyGridsToggle"), "vkdex-shiny-grids", false, function (on, init) {
    useShinyGrids = on;
    if (init) return;
    renderDexList(currentRegionFilter);
    renderFavorites();
  });

  // Pixel-perfect sprites (vkdex-pixel-sprites, on by default): toggles
  // .phone.smooth-sprites, which styles.css maps to image-rendering: auto
  // on the upscaled detail/evolution sprites (--sprite-rendering).
  wireToggleSetting(document.getElementById("pixelSpritesToggle"), "vkdex-pixel-sprites", true, function (on) {
    phone.classList.toggle("smooth-sprites", !on);
  });

  // Grid width — how many columns the dex grid shows per row. --grid-cols
  // lives on :root and is read by .dex-cell's width calc (styles.css), so
  // Favorites/Search share the same setting since they render through the
  // same renderGrid()/.dex-cell markup. Persisted in localStorage the same
  // simple way as Favorites, read synchronously so the grid never flashes
  // at the wrong width on load.
  var GRID_COLS_KEY = "vkdex-grid-cols";
  var gridWidthBtns = document.querySelectorAll(".grid-width-btn");

  function setGridCols(cols) {
    document.documentElement.style.setProperty("--grid-cols", cols);
    gridWidthBtns.forEach(function (btn) {
      var active = Number(btn.getAttribute("data-cols")) === cols;
      btn.classList.toggle("active", active);
      btn.setAttribute("aria-checked", String(active));
    });
    try {
      window.localStorage.setItem(GRID_COLS_KEY, String(cols));
    } catch (e) {}
  }

  gridWidthBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      setGridCols(Number(btn.getAttribute("data-cols")));
    });
  });

  (function initGridCols() {
    var saved = 5;
    try {
      var raw = window.localStorage.getItem(GRID_COLS_KEY);
      if (raw === "3" || raw === "4" || raw === "5") saved = Number(raw);
    } catch (e) {}
    setGridCols(saved);
  })();

  // Measurements (metric/imperial) for the detail screen's Height/Weight
  // row (PLAN.md "Units"). App-wide, not per-Pokemon; metric is the
  // default. A 2-box segmented control (.units-btn — its own class, NOT
  // .grid-width-btn, which the grid handler above selects wholesale).
  var UNITS_KEY = "vkdex-units";
  var unitsBtns = document.querySelectorAll(".units-btn");

  function metersToFeetInches(m) {
    var totalInches = m * 39.3700787;
    var feet = Math.floor(totalInches / 12);
    var inches = Math.round(totalInches - feet * 12);
    if (inches === 12) { feet += 1; inches = 0; }
    return feet + "'" + (inches < 10 ? "0" : "") + inches + '"';
  }

  function kgToLbs(kg) {
    return (Math.round(kg * 2.20462 * 10) / 10) + " lbs";
  }

  function setUnits(imperial) {
    useImperialUnits = imperial;
    unitsBtns.forEach(function (btn) {
      var active = (btn.getAttribute("data-units") === "imperial") === imperial;
      btn.classList.toggle("active", active);
      btn.setAttribute("aria-checked", String(active));
    });
    try {
      window.localStorage.setItem(UNITS_KEY, imperial ? "imperial" : "metric");
    } catch (e) {}
    // Re-render an already-open detail screen so the switch takes effect
    // immediately instead of only on the next Pokemon opened.
    rerenderDetail();
  }

  unitsBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      setUnits(btn.getAttribute("data-units") === "imperial");
    });
  });

  (function initUnits() {
    var saved = false;
    try {
      saved = window.localStorage.getItem(UNITS_KEY) === "imperial";
    } catch (e) {}
    setUnits(saved);
  })();

  // Version footer at the bottom of Settings
  var appVersionEl = document.getElementById("appVersion");
  appVersionEl.textContent = "VKDex v" + APP_VERSION;

  // Backs out of whatever is on top, innermost first: settings -> drawer ->
  // detail popup -> detail (one history step at a time) -> quick-search.
  // Shared by Escape, Backspace (outside a text field) and the mouse's
  // back button (0.1.34). Returns true when it closed something.
  function backOut() {
    if (isTourActive()) { endTour(); return true; }
    if (isSettingsOpen()) { closeSettings(); return true; }
    if (isOpen) { closeMenu(); return true; }
    if (isDetailPopupOpen()) { closeDetailPopup(); return true; }
    if (isDetailOpen()) { backDetail(); return true; }
    if (isDexQuickSearchOpen()) { closeDexQuickSearch(); return true; }
    return false;
  }

  function isTyping(e) {
    var t = e.target;
    return t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA");
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") { backOut(); return; }
    if (e.key === "Backspace" && !isTyping(e)) {
      if (backOut()) e.preventDefault();
      return;
    }
    // Nothing below applies while a text field has focus or a modal is up.
    if (isTyping(e) || isSettingsOpen() || isOpen || isDetailPopupOpen()) return;
    if (e.key === "/") {
      e.preventDefault();
      closeDetail();
      showView("dex");
      openDexQuickSearch();
      return;
    }
    if (isDetailOpen() && (e.key === "ArrowLeft" || e.key === "ArrowRight")) {
      e.preventDefault();
      stepDetail(e.key === "ArrowLeft" ? -1 : 1);
    }
  });

  // Mouse back button (button 3). With no page history there's nothing
  // for Chromium/Electron to navigate to, so this is the only effect.
  document.addEventListener("mouseup", function (e) {
    if (e.button === 3 && backOut()) e.preventDefault();
  });

  // --- IndexedDB (favorites fallback only, as of 0.1.20) ---------------
  // Sprites used to be fetched-and-cached here too (see HISTORY.md's 0.1.20
  // entry) — bundled local sprite files made that redundant and it was
  // removed. This store now exists purely as the Favorites fallback
  // described above (localStorage can be unavailable in some file://
  // contexts; IndexedDB still works there).
  var DB_NAME = "vkdex-cache";
  var DB_VERSION = 1;

  function openOfflineDb() {
    return new Promise(function (resolve, reject) {
      if (!window.indexedDB) { reject(new Error("IndexedDB unavailable")); return; }
      var req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = function () {
        var db = req.result;
        if (!db.objectStoreNames.contains("meta")) db.createObjectStore("meta");
      };
      req.onsuccess = function () { resolve(req.result); };
      req.onerror = function () { reject(req.error); };
    });
  }

  function idbGet(db, store, key) {
    return new Promise(function (resolve, reject) {
      var tx = db.transaction(store, "readonly");
      var req = tx.objectStore(store).get(key);
      req.onsuccess = function () { resolve(req.result); };
      req.onerror = function () { reject(req.error); };
    });
  }

  function idbSet(db, store, key, value) {
    return new Promise(function (resolve, reject) {
      var tx = db.transaction(store, "readwrite");
      tx.objectStore(store).put(value, key);
      tx.oncomplete = function () { resolve(); };
      tx.onerror = function () { reject(tx.error); };
    });
  }

  function displaySpriteUrl(id) {
    return spriteUrl(id);
  }

  // Re-renders every grid and the open detail view — used after the
  // IndexedDB favorites mirror adopts something localStorage didn't have.
  function refreshAllViews() {
    renderDexList(currentRegionFilter);
    renderFavorites();
    rerenderDetail();
  }

  // --- First-launch drawer walkthrough (0.3.11) ------------------------
  // Opens the drawer, dims every row but one, and shows a caption card
  // beside it (text from each row's data-tour attribute); Next/Skip step
  // through or end it. Shown once — vkdex-drawer-tour-seen is written on
  // either exit, same localStorage convention as the settings above. The
  // drawer is pointer-inert while it runs (.side-menu.tour-active) and the
  // overlay/backOut close paths are guarded below, so the drawer can't be
  // closed out from under the card; Escape ends the tour instead.
  var TOUR_SEEN_KEY = "vkdex-drawer-tour-seen";
  var tourCard = document.getElementById("drawerTour");
  var tourSteps = Array.prototype.slice.call(menu.querySelectorAll(".menu-btn[data-tour]"));
  var tourIndex = -1;

  function isTourActive() {
    return tourIndex >= 0;
  }

  function showTourStep(i) {
    tourSteps.forEach(function (el, j) { el.classList.toggle("tour-target", j === i); });
    var el = tourSteps[i];
    tourIndex = i;
    document.getElementById("tourStep").textContent = (i + 1) + " / " + tourSteps.length;
    document.getElementById("tourTitle").textContent = el.querySelector(".menu-label").textContent;
    document.getElementById("tourText").textContent = el.getAttribute("data-tour");
    document.getElementById("tourNext").textContent = i === tourSteps.length - 1 ? "Done" : "Next";
    tourCard.hidden = false;
    // Center the card on the highlighted row (offsetTop is relative to the
    // drawer, which sits at the phone's top — no scale math needed), kept
    // inside the frame.
    var top = el.offsetTop + el.offsetHeight / 2 - tourCard.offsetHeight / 2;
    top = Math.max(12, Math.min(top, phone.clientHeight - tourCard.offsetHeight - 12));
    tourCard.style.top = top + "px";
  }

  function endTour() {
    tourIndex = -1;
    tourCard.hidden = true;
    menu.classList.remove("tour-active");
    tourSteps.forEach(function (el) { el.classList.remove("tour-target"); });
    try { window.localStorage.setItem(TOUR_SEEN_KEY, "yes"); } catch (e) {}
    closeMenu();
  }

  function startDrawerTour() {
    var seen = false;
    try { seen = window.localStorage.getItem(TOUR_SEEN_KEY) === "yes"; } catch (e) {}
    if (seen || !tourSteps.length) return;
    openMenu();
    menu.classList.add("tour-active");
    showTourStep(0);
  }

  document.getElementById("tourNext").addEventListener("click", function () {
    if (tourIndex + 1 < tourSteps.length) showTourStep(tourIndex + 1); else endTour();
  });
  document.getElementById("tourSkip").addEventListener("click", endTour);

  // --- Initial state ---------------------------------------------------

  loadFavoritesFromLocalStorage();
  renderTypeChart();
  renderNatures();

  renderRegionBar();
  // Last-used chip (vkdex-region), validated against REGIONS; setRegionFilter
  // does the first renderDexList() itself.
  (function initRegionFilter() {
    var saved = "national";
    try {
      var raw = window.localStorage.getItem(REGION_KEY);
      if (raw && REGIONS.some(function (r) { return r.id === raw; })) saved = raw;
    } catch (e) {}
    setRegionFilter(saved);
  })();
  renderFavorites();
  showView("dex");

  // Pick up anything the IndexedDB favorites mirror holds that
  // localStorage didn't (cleared storage, or a file:// context where
  // localStorage isn't available).
  loadFavoritesFromDb().then(function (changed) {
    if (changed) refreshAllViews();
  });

  // Menu closed, settings closed, no detail open
  closeMenu();
  closeSettings();
  // First launch only: slide the drawer open and walk through its rows,
  // after a beat so the slide-in is visible rather than instant.
  setTimeout(startDrawerTour, 600);
})();
