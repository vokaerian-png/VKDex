(function () {
  "use strict";

  var phone = document.getElementById("phone");
  var menu = document.getElementById("sideMenu");
  var overlay = document.getElementById("overlay");
  var edgeZone = document.getElementById("edgeZone");
  var menuHeader = document.querySelector(".menu-header");

  // --- Electron window scaling ---
  // In the packaged app (see index.html's early "is-electron" check), the
  // window's minimum size is locked to the phone frame's native 360x800
  // and can only grow from there (main.js). --phone-scale (read by
  // styles.css's `.is-electron .phone { transform: scale(...) }`) is what
  // actually grows the frame to match: 1 at the 360x800 minimum, growing
  // as the window does. Plain-browser usage never sets "is-electron", so
  // phoneScale stays 1 and none of this changes anything there.
  var PHONE_BASE_WIDTH = 360;
  var PHONE_BASE_HEIGHT = 800;
  var phoneScale = 1;

  if (document.documentElement.classList.contains("is-electron")) {
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
  }

  // The drawer must never stick out further than the "VKDex" header above it.
  // Measure the header's own natural width (padding + text, independent of
  // the menu's width) and use that as the menu width everywhere below.
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

  var MENU_WIDTH = measureHeaderWidth();
  document.documentElement.style.setProperty("--menu-width", MENU_WIDTH + "px");

  var OPEN_THRESHOLD = MENU_WIDTH / 2;

  var isOpen = false;
  var dragging = false;
  var dragMode = null; // "open" | "close"
  var startX = 0;
  var activePointerId = null;

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
    menu.setAttribute("aria-hidden", "true");
  }

  function startDrag(pointerId, clientX, mode) {
    dragging = true;
    dragMode = mode;
    startX = clientX;
    activePointerId = pointerId;
    setDragging(true);
  }

  function endDrag(clientX) {
    if (!dragging) return;
    var delta = clientX - startX;
    var finalOffset = dragMode === "open" ? (-MENU_WIDTH + Math.max(0, delta)) : Math.min(0, delta);

    dragging = false;
    dragMode = null;
    activePointerId = null;
    setDragging(false);

    if (finalOffset > -OPEN_THRESHOLD) {
      openMenu();
    } else {
      closeMenu();
    }
  }

  // Pointer coordinates are real screen pixels, but the drag math below
  // (and MENU_WIDTH) works in the phone frame's own unscaled pixels — so
  // when phoneScale isn't 1 (see Electron window scaling above), divide
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
    activePointerId = null;
    setDragging(false);
    clearInlineStyles();
    if (isOpen) { openMenu(); } else { closeMenu(); }
  });

  // --- Tap anywhere outside the menu closes it ---
  overlay.addEventListener("click", function () {
    if (isOpen) closeMenu();
  });

  // --- Visible drawer handle: a direct tap opens the menu, no drag needed ---
  var drawerHandle = document.getElementById("drawerHandle");
  drawerHandle.addEventListener("click", function () {
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

  // Local files under src/data/sprites/ (bundled with the app, both in dev
  // and in the packaged Electron build via copy-app.js), relative to
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
  // spriteSrc: optional override for the cell's sprite — used by the Hisui
  // standalone screen to show a species' Hisuian regional form instead of
  // its base sprite. Undefined everywhere else, so gridSpriteUrl(p.id)
  // (the base form, shiny if the Settings toggle says so) is the default.
  function gridSpriteUrl(id) {
    return useShinyGrids ? spriteShinyUrl(id) : spriteUrl(id);
  }

  function cellHtml(p, numberText, spriteSrc) {
    return '<div class="dex-cell" role="button" tabindex="0" data-id="' + p.id + '">' +
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
  // standalone Search screen was deleted in 0.1.34 — the drawer's Search
  // icon now opens the dex view with the quick-search bar focused.

  var screens = {
    dex: document.getElementById("dexScreen"),
    favorites: document.getElementById("favoritesScreen")
  };

  var navIcons = {
    dex: document.getElementById("dexIcon"),
    favorites: document.getElementById("favoritesIcon")
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
  // `then` is an optional follow-up (the Search icon's quick-search open).
  function wireNavIcon(el, view, then) {
    function go() {
      closeMenu();
      closeDetail();
      showView(view);
      if (then) then();
    }
    el.addEventListener("click", go);
    el.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); }
    });
  }

  wireNavIcon(navIcons.dex, "dex");
  wireNavIcon(navIcons.favorites, "favorites");
  wireNavIcon(document.getElementById("searchIcon"), "dex", function () { openDexQuickSearch(); });

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
  // Sprite override for the Hisui screen: 16 of its 242 members have a real
  // Hisuian regional form (ALT_FORMS[id] with a "hisui" forme), so the grid
  // shows that sprite there. Null for the other 226 — renderGrid falls back
  // to the base sprite. Only the Hisui screen passes this.
  function hisuiCellSprite(p) {
    var data = ALT_FORMS[p.id];
    var formes = (data && data.formes) || [];
    for (var i = 0; i < formes.length; i++) {
      if (formes[i].key === "hisui") return altFormSpriteUrl(formes[i].sprite, useShinyGrids);
    }
    return null;
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
        spriteFn: hisuiCellSprite
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
    return {
      match: function (p) { return p.region === filter; },
      sort: byDexNumber,
      label: regionLabel(filter)
    };
  }

  function renderDexList(filter) {
    var query = dexQuickSearchInput.value.trim();
    var set = dexSetFor(filter, !!query);
    var matchQuery = queryMatcher(query);
    var entries = POKEMON_DATA.filter(function (p) {
      return set.match(p) && (!matchQuery || matchQuery(p));
    }).sort(set.sort);
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
  // The alt forme currently swapped in (its `key`), or null for base — kept
  // so a settings-driven re-render can restore it (0.1.34).
  var activeFormeKey = null;
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
  function pictureCardHtml(entry) {
    var html = '<div class="detail-section picture-card">' +
      '<div class="detail-number">' + formatDexNumber(entry.id) + "</div>" +
      '<div class="sprite-pair">' +
      '<div class="sprite-slot"><span class="detail-sprite-wrap"><img class="detail-sprite" id="pictureMainSprite" src="' +
      displaySpriteUrl(entry.id) + '" alt="' + escapeHtml(entry.name) + '"' + SPRITE_ONERROR_ATTR + '></span><span class="sprite-slot-label">Normal</span></div>' +
      '<div class="sprite-slot"><span class="detail-sprite-wrap"><img class="detail-sprite" id="pictureShinySprite" src="' +
      displayShinySpriteUrl(entry.id) + '" alt="' + escapeHtml(entry.name) + ' (shiny)"' + SPRITE_ONERROR_ATTR + '></span><span class="sprite-slot-label">Shiny</span></div>' +
      "</div>";
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
  // (decoupled 0.1.35): a *tappable* forme swaps the Picture card sprites
  // and topbar name; one that also overrides `types` and/or `abilities`
  // additionally swaps the information card (rule 9). Every Mega/Gmax is
  // tappable regardless (a stat-only Mega still has its own art); any
  // other forme overriding neither (Deoxys's stats-only formes) stays
  // inert and styled as such (.altform-inert). When at least one forme is
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

  function altFormeTappable(forme) {
    return !!(forme.isMega || forme.isGmax) || altFormeSwaps(forme);
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
      body = anyTappable ? altFormStageHtml("", entry.name, displaySpriteUrl(entry.id), " altform-active") : "";
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
  function setActiveForme(formeKey) {
    if (detailEntryId === null) return;
    var entry = findPokemon(detailEntryId);
    if (!entry) return;
    var altData = ALT_FORMS[entry.id];
    var forme = null;
    if (formeKey && altData && altData.formes) {
      for (var i = 0; i < altData.formes.length; i++) {
        if (altData.formes[i].key === formeKey) { forme = altData.formes[i]; break; }
      }
    }
    var tappable = !!(forme && altFormeTappable(forme));
    var swaps = tappable && altFormeSwaps(forme);
    activeFormeKey = tappable ? formeKey : null;

    var mainImg = document.getElementById("pictureMainSprite");
    if (mainImg) mainImg.src = tappable ? altFormSpriteUrl(forme.sprite) : displaySpriteUrl(entry.id);
    var shinyImg = document.getElementById("pictureShinySprite");
    if (shinyImg) shinyImg.src = tappable ? altFormSpriteUrl(forme.sprite, true) : displayShinySpriteUrl(entry.id);
    detailName.textContent = tappable ? forme.name : entry.name;

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

    // Bubble 0 (data-forme-key="") is the base and lights up on revert.
    var stages = detailBody.querySelectorAll(".altforms-card .evo-stage");
    for (var j = 0; j < stages.length; j++) {
      stages[j].classList.toggle("altform-active", stages[j].getAttribute("data-forme-key") === (tappable ? formeKey : ""));
    }
  }

  // --- Evolution line card ---
  // EVOLUTIONS only stores forward edges (evolvesTo), so the full chain for
  // a given id is found by walking backward to the root first, then
  // depth-first forward to every leaf. Branches (Oddish, Wurmple, ...) just
  // render as one full root-to-leaf row per branch rather than a shared
  // tree layout — simplest thing that reads correctly for every case. The
  // one exception is evolutionCardHtml's fan-out (3+ one-step branches).
  function evolutionRootId(id) {
    var current = id, guard = 0;
    while (guard++ < 10) {
      var parent = null;
      for (var key in EVOLUTIONS) {
        var node = EVOLUTIONS[key];
        for (var i = 0; i < node.evolvesTo.length; i++) {
          if (node.evolvesTo[i].id === current) { parent = Number(key); break; }
        }
        if (parent !== null) break;
      }
      if (parent === null) break;
      current = parent;
    }
    return current;
  }

  function evolutionPaths(rootId) {
    var paths = [];
    function walk(id, via, path) {
      var stepPath = path.concat([{ id: id, via: via }]);
      var node = EVOLUTIONS[id];
      var children = node ? node.evolvesTo : [];
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
      icons += '<img class="evo-arrow-item" src="' + itemSpriteUrl(via.item) +
        '" alt="" onerror="this.style.display=\'none\';">';
    } else if (via.method === "level" && typeof via.level !== "number") {
      icons += EVO_HEART_SVG;
    }
    if (via.timeOfDay === "day") icons += EVO_SUN_SVG;
    else if (via.timeOfDay === "night") icons += EVO_MOON_SVG;
    if (via.moveType) {
      icons += pillHtml(via.moveType.charAt(0).toUpperCase() + via.moveType.slice(1));
    }
    return icons ? '<span class="evo-arrow-icons">' + icons + "</span>" : "";
  }

  function evoStageHtml(id) {
    var mon = findPokemon(id);
    if (!mon) return "";
    return '<button class="evo-stage" type="button" data-id="' + id + '">' +
      '<span class="evo-sprite-wrap"><img class="evo-sprite" src="' + displaySpriteUrl(id) + '" alt="' + escapeHtml(mon.name) + '"' + SPRITE_ONERROR_ATTR + '></span>' +
      '<span class="evo-name">' + escapeHtml(mon.name) + "</span></button>";
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
    var isFan = paths.length >= 3 && paths.every(function (p) { return p.length === 2; });
    if (isFan) {
      // Every branch leaves the same root, so the chevron is drawn once
      // between the root and the branches instead of repeated per branch;
      // each branch keeps only its own condition icons and label.
      html += '<div class="evo-fan"><div class="evo-row">' + evoStageHtml(root) + "</div>" +
        '<span class="evo-arrow evo-fan-arrow">' + EVO_ARROW_SVG + "</span>";
      // Explicit row groups rather than one flex-wrap container: a wrap
      // line break can't carry a border, and the rows need dividers.
      for (var r = 0; r < paths.length; r += FAN_ROW_SIZE) {
        html += '<div class="evo-fan-row">';
        paths.slice(r, r + FAN_ROW_SIZE).forEach(function (path) {
          var leaf = path[1];
          html += '<div class="evo-fan-branch"><span class="evo-arrow">' + evoArrowIconsHtml(leaf.via) +
            '<span class="evo-level">' + escapeHtml(evoArrowLabel(leaf.via)) + "</span></span>" +
            evoStageHtml(leaf.id) + "</div>";
        });
        html += "</div>";
      }
      html += "</div></div>";
      return html;
    }
    paths.forEach(function (path) {
      html += '<div class="evo-row">';
      path.forEach(function (step, i) {
        if (i > 0) {
          html += '<span class="evo-arrow">' + evoArrowIconsHtml(step.via) + EVO_ARROW_SVG +
            '<span class="evo-level">' + escapeHtml(evoArrowLabel(step.via)) + "</span></span>";
        }
        html += evoStageHtml(step.id);
      });
      html += "</div>";
    });
    html += "</div>";
    return html;
  }

  // --- Found In card ---
  // Broader than the single `region` field on pokemon.js (which only says
  // where a species was introduced): every region key in LOCATIONS[id]
  // whose area list is non-empty is somewhere it can actually be caught.
  function foundInRegions(id) {
    var loc = LOCATIONS[id] || {};
    return Object.keys(loc).filter(function (r) { return loc[r] && loc[r].length > 0; });
  }

  function foundInCardHtml(entry) {
    var regions = foundInRegions(entry.id);
    var html = '<div class="detail-section found-in-card"><p class="detail-section-label">Found In</p>';
    if (regions.length === 0) {
      // "Evolution only" is only a safe claim when something actually
      // evolves into this species; otherwise (Enamorus, a non-evolving
      // species with no encounter data) just say no data (0.1.34).
      html += '<p class="detail-section-note">' + (evolutionRootId(entry.id) !== entry.id
        ? "Not found in the wild &mdash; evolution only."
        : "No wild encounter data recorded.") + "</p>";
    } else {
      html += '<div class="chip-row">' + regions.map(function (r) {
        return '<button class="region-chip chip-auto" type="button" data-region="' + r + '">' + escapeHtml(regionLabel(r)) + "</button>";
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

  // --- Learnable moves card (up to 4 tabs behind .move-tab / .move-list) ---
  var MOVE_TABS = [
    { key: "levelUp", label: "Level-Up" },
    { key: "tm", label: "TM" },
    { key: "egg", label: "Egg" },
    { key: "max", label: "Max" }
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
    var set = MOVESETS[entry.id];
    if (!set) return "";
    var present = MOVE_TABS.filter(function (t) { return set[t.key] && set[t.key].length; });
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
      altData.formes.forEach(function (forme) {
        if (forme.stats) html += statsTableAndRadarHtml("Base Stats — " + forme.name, forme.stats);
      });
    }
    return html;
  }

  // --- Name-languages / found-in-location popup (one popup, two uses) ---
  function openDetailPopup(title, bodyHtml) {
    detailPopupTitle.textContent = title;
    detailPopupBody.innerHTML = bodyHtml;
    detailPopupBackdrop.classList.add("active");
    detailPopup.setAttribute("aria-hidden", "false");
  }

  function closeDetailPopup() {
    detailPopupBackdrop.classList.remove("active");
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

  function openLocationPopup(regionId) {
    if (detailEntryId === null) return;
    var areas = (LOCATIONS[detailEntryId] || {})[regionId] || [];
    var body = areas.length
      ? areas.map(function (a) { return '<div class="popup-row"><span class="v" style="text-align:left;flex:1">' + escapeHtml(a) + "</span></div>"; }).join("")
      : '<p class="popup-note">No specific areas recorded.</p>';
    openDetailPopup(regionLabel(regionId), body);
  }

  detailPopupClose.addEventListener("click", closeDetailPopup);
  detailPopupBackdrop.addEventListener("click", function (e) {
    if (e.target === detailPopupBackdrop) closeDetailPopup();
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
  });

  function renderDetail(entry) {
    detailName.textContent = entry.name;
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

  // autoForme: opened from the Hisui screen, so show the Hisuian regional
  // form up front instead of the base form. setActiveForme resets to base
  // when the species has no "hisui" forme, so no guard is needed here.
  // Every other entry point (quick-search, Favorites, National, mainline
  // regions, evolution-line taps) omits it and keeps the base form as the
  // default.
  function openDetail(id, autoForme) {
    var entry = findPokemon(id);
    if (!entry) return;
    detailEntryId = id;
    activeFormeKey = null;
    renderDetail(entry);
    if (autoForme) setActiveForme("hisui");
    syncFavoriteButton();
    detailScreen.classList.add("active");
    detailScreen.setAttribute("aria-hidden", "false");
  }

  // Fully closes the detail screen, dropping any evolution-tap history.
  function closeDetail() {
    if (detailEntryId === null) return;
    detailEntryId = null;
    detailHistory = [];
    closeDetailPopup();
    detailScreen.classList.remove("active");
    detailScreen.setAttribute("aria-hidden", "true");
  }

  // Back arrow / Escape: return to the previous Pokemon if an evolution
  // tap got us here (0.1.34), otherwise close.
  function backDetail() {
    closeDetailPopup();
    if (detailHistory.length) { openDetail(detailHistory.pop()); } else { closeDetail(); }
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
  // the dex grid can be showing the Hisui standalone dex, and only then does
  // a cell open straight to that species' Hisuian forme.
  function openDetailFromCell(cell, list) {
    openDetail(Number(cell.getAttribute("data-id")), list === dexList && currentRegionFilter === "hisui");
  }

  [dexList, favoritesList].forEach(function (list) {
    list.addEventListener("click", function (e) {
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

  // Shiny sprites in grids (vkdex-shiny-grids): cellHtml/hisuiCellSprite
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

  // --- Initial state ---------------------------------------------------

  loadFavoritesFromLocalStorage();

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
})();
