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
// Reads src/data/*.js verbatim (see index.html) and writes nothing back to it.
// No shared UI code with src/ by design — only the data layer is shared.
"use strict";

(function () {
  // src-desktop/data is a junction to src/data (see index.html's comment) —
  // relative to src-desktop/, because Tauri only embeds frontendDist.
  var DATA_BASE = "data/";
  var SPRITE = DATA_BASE + "sprites/pokemon/";
  var MISSING_SPRITE = SPRITE + "0.png";
  var SIDEBAR_KEY = "vkdex-desktop-sidebar-collapsed";

  var STAT_KEYS = [
    ["hp", "HP"], ["attack", "Attack"], ["defense", "Defense"],
    ["spAttack", "Sp. Atk"], ["spDefense", "Sp. Def"], ["speed", "Speed"]
  ];
  var TYPE_NAMES = Object.keys(TYPE_CHART);
  var SCREEN_TITLES = {
    dex: "Dex", favorites: "Favorites", bag: "Bag",
    types: "Type Chart", natures: "Natures", settings: "Settings"
  };
  // Screens that exist as nav rows but have no desktop implementation yet.
  var PLACEHOLDERS = {
    favorites: "The favorites list, sharing the Dex grid and this detail pane.",
    bag: "The 146-item bag, with an item list in this pane and item detail beside it.",
    types: "The full 18x18 type matrix plus a per-type matchup breakdown.",
    natures: "All 25 natures with their stat effects and flavor preferences."
  };

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
  function spriteImg(id, cls) { return imgTag(SPRITE + id + ".png", cls); }
  // Alt-forme sprites are named by forme slug rather than dex id and live in
  // their own subtree — note the literal space in "alt formes", matching the
  // folder on disk (ported from src/app.js's altFormSpriteUrl()).
  function altFormeImg(sprite, cls) { return imgTag(SPRITE + "alt formes/" + sprite + ".png", cls); }
  function typePills(types) {
    if (!types || !types.length) return "";
    return '<div class="types">' + types.map(function (t) {
      return '<span class="pill" style="' + typeVar(t) + '">' + esc(t) + "</span>";
    }).join("") + "</div>";
  }
  function meters(v) { return v == null ? "—" : v.toFixed(1) + " m"; }
  function kilos(v) { return v == null ? "—" : v.toFixed(1) + " kg"; }

  // ------------------------------------------------------------ indexes

  var MON_BY_ID = {};
  POKEMON_DATA.forEach(function (p) { MON_BY_ID[p.id] = p; });

  // EVOLUTIONS only points forward (evolvesTo), so the reverse edge is built
  // once here — walking up it is how a chain's root is found from any member.
  var EVO_PARENT = {};
  Object.keys(EVOLUTIONS).forEach(function (from) {
    (EVOLUTIONS[from].evolvesTo || []).forEach(function (n) { EVO_PARENT[n.id] = +from; });
  });

  function evoRoot(id) {
    var seen = {};
    while (EVO_PARENT[id] != null && !seen[id]) { seen[id] = 1; id = EVO_PARENT[id]; }
    return id;
  }
  // Chain as depth-ordered groups: [[root], [stage2...], [stage3...]]. Handles
  // branching lines (Eevee's 8 at depth 1) without pretending they're linear.
  function evoStages(id) {
    var groups = [], level = [evoRoot(id)], guard = 0;
    while (level.length && guard++ < 8) {
      groups.push(level);
      var next = [];
      level.forEach(function (n) {
        ((EVOLUTIONS[n] || {}).evolvesTo || []).forEach(function (e) {
          if (MON_BY_ID[e.id]) next.push(e.id);
        });
      });
      level = next;
    }
    return groups;
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
  var expanded = false;
  var rail = true;             // live sidebar state
  var railDefault = true;      // persisted "collapse by default" setting

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

  // ------------------------------------------------------- dex list model

  function regionList() {
    var chips = [{ id: "all", label: "All" }].concat(REGIONS);
    return chips;
  }

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

  function currentList() {
    var list = baseList();
    var q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter(function (p) {
      return p.name.toLowerCase().indexOf(q) >= 0 ||
        String(p.id) === q || pad(p.id) === q ||
        (p.types || []).some(function (t) { return t.toLowerCase() === q; });
    });
  }

  // The purple standalone-dex badge in a card's top-right corner: Hisui shows
  // its own dex number, Orre its C/XD game tag.
  function cardTag(p) {
    if (region === "hisui") return "H" + pad(HISUI_DEX_NUMBERS[p.id]);
    if (region === "orre") return ORRE_MEMBERS[p.id];
    return "";
  }

  // --------------------------------------------------------- center pane

  // Split out from dexHtml() because a keystroke in the search box re-renders
  // ONLY this — replacing the whole center pane would blow away the input's
  // focus and caret on every character.
  function gridHtml() {
    var list = currentList();
    var cards = list.length ? list.map(function (p) {
      var tag = cardTag(p);
      return '<div class="card' + (p.id === selectedId ? " sel" : "") + '" data-id="' + p.id +
        '" style="' + typeVar((p.types || ["Normal"])[0]) + '">' +
        '<span class="num">#' + pad(p.id) + "</span>" +
        (tag ? '<span class="tag">' + esc(tag) + "</span>" : "") +
        spriteImg(p.id) +
        '<div class="name">' + esc(p.name) + "</div>" +
        typePills(p.types) +
        "</div>";
    }).join("") : '<div class="empty">No Pokémon match this filter.</div>';
    return '<div class="grid" id="grid">' + cards + "</div>";
  }

  function dexHtml() {
    var chips = [{ id: "all", label: "All" }].concat(REGIONS).map(function (r) {
      var cls = (r.id === region ? "on " : "") + (r.standalone ? "standalone" : "");
      return '<button data-region="' + esc(r.id) + '" class="' + cls.trim() + '">' + esc(r.label) + "</button>";
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

  function settingsHtml() {
    return '<div class="toolbar"><h1>Settings</h1></div>' +
      '<div class="form"><h4>Layout</h4>' +
      '<div class="frow"><div>Collapse sidebar by default' +
      "<small>The sidebar starts as a 64px icon rail and reopens while hovered. Ctrl+B toggles it for this session without changing this default.</small></div>" +
      '<div class="ctl"><input type="checkbox" class="sw" id="railDefaultToggle"' + (railDefault ? " checked" : "") + "></div></div>" +
      '<h4>About</h4><div class="frow"><div>VKDex v' + esc(APP_VERSION) +
      "<small>Desktop build — " + POKEMON_DATA.length + " Pokémon, " + REGIONS.length + " dexes.</small></div></div></div>";
  }

  function renderCenter() {
    var el = document.getElementById("center");
    if (screen === "dex") el.innerHTML = dexHtml();
    else if (screen === "settings") el.innerHTML = settingsHtml();
    else el.innerHTML = placeholderHtml();
  }

  // --------------------------------------------------------- detail pane

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
    var s = STATS[p.id];
    if (!s) return '<div class="stub">No base stats recorded.</div>';
    var total = STAT_KEYS.reduce(function (a, k) { return a + (s[k[0]] || 0); }, 0);
    var rows = STAT_KEYS.map(function (k) {
      var v = s[k[0]] || 0;
      return '<span class="k">' + k[1] + '</span><span class="v">' + v + "</span>" +
        '<div class="bar"><i style="--s:var(--s-' + k[0] + ");width:" + Math.min(100, v / 255 * 140) + '%"></i></div>';
    }).join("");
    return "<h3>Base stats<span class=\"r\">Total " + total + '</span></h3><div class="stats">' + rows + "</div>";
  }

  // The evolvesTo entry that produced `id`, so a fan row can say why it happens.
  function evoStep(id) {
    var from = EVO_PARENT[id];
    var list = from == null ? [] : (EVOLUTIONS[from] || {}).evolvesTo || [];
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return null;
  }

  // Deliberately minimal — just enough to tell two branches of the same tier
  // apart. Mobile's evoArrowLabel() (moves, notes, forme overrides) is not
  // ported; PLAN.md's pass-2 spec calls for the short version only.
  function evoCond(e) {
    // `item` alone isn't enough to read the method off: a trade/held evolution
    // carries one too, and a move-taught one (Hydrapple) carries a TM slug.
    if (e.move) return e.move;
    if (e.method === "trade") return "Trade" + (e.item ? " w/ " + itemName(e.item) : "");
    if (e.method === "held") return "Level up holding " + itemName(e.item);
    if (e.item) return itemName(e.item);
    if (e.level) return "Lv " + e.level;
    if (e.timeOfDay) return "Level up (" + e.timeOfDay + ")";
    return "Level up";
  }
  function itemName(slug) {
    return String(slug).replace(/-/g, " ").replace(/\b[a-z]/g, function (c) { return c.toUpperCase(); });
  }

  function evoStage(id, curId) {
    var q = byId(id);
    return '<span class="stage' + (id === curId ? " cur" : "") + '" data-id="' + id + '">' +
      spriteImg(id, "") + esc(q ? q.name : "#" + id) + "</span>";
  }

  // Trunk = the leading run of single-id tiers, kept on ONE non-wrapping row so
  // it can never split mid-chain (it scrolls sideways instead). From the first
  // branching tier on, every id gets its own arrow-prefixed row with its own
  // condition label, so a fan can't interleave with the trunk — PLAN.md's
  // pass-2 "AFTER" layout. A plain linear chain has no fan and renders exactly
  // as it did before.
  function evoHtml(p) {
    var groups = evoStages(p.id);
    if (groups.length < 2) return '<div class="stub">' + esc(p.name) + " does not evolve.</div>";

    var split = 0;
    while (split < groups.length && groups[split].length === 1) split++;

    var trunk = groups.slice(0, split).map(function (ids, i) {
      return (i ? '<span class="arrow">▶</span>' : "") + evoStage(ids[0], p.id);
    }).join("");
    var fan = groups.slice(split).reduce(function (a, ids) { return a.concat(ids); }, [])
      .map(function (id) {
        var step = evoStep(id);
        return '<div class="fanrow"><span class="arrow">▶</span>' + evoStage(id, p.id) +
          (step ? '<span class="cond">' + esc(evoCond(step)) + "</span>" : "") + "</div>";
      }).join("");

    return '<div class="evo"><div class="trunk">' + trunk + "</div>" + fan + "</div>";
  }

  // ------------------------------------------------------- Mega / Gigantamax
  // Read-only bubbles for this pass: no tap-to-swap (mobile's setActiveForme()
  // state machine) — deliberately deferred until the user judges these on a
  // real screenshot. Species with no Mega/Gmax forme render no card at all.
  function megaGmaxHtml(p) {
    var formes = ((ALT_FORMS[p.id] || {}).formes || []).filter(function (f) { return f.isMega || f.isGmax; });
    if (!formes.length) return "";
    return '<div class="formes">' + formes.map(function (f) {
      // Same short label mobile's altFormeShortLabel() produces: "Mega X" /
      // "Mega Y" from the forme name minus the species, "Gmax" always.
      var tag = f.isGmax ? "Gmax" : (f.name.replace(p.name, "").replace(/\s+/g, " ").trim() || "Mega");
      return '<span class="forme">' + altFormeImg(f.sprite, "") + esc(f.name) +
        '<span class="ftag' + (f.isGmax ? " gmax" : "") + '">' + esc(tag) + "</span></span>";
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
    var s = STATS[p.id];
    return s ? '<div class="box"><h3>Base stats · radar</h3>' + radarSvg(s) + "</div>" : "";
  }

  // --t is set once on #compact/#doc by renderDetail(), so it cascades to the
  // boxes here as well as to the head — it used to sit inline on the head only.
  function compactHtml(p) {
    var formes = megaGmaxHtml(p);
    return '<div class="detail-head"><div class="top">' + spriteImg(p.id) +
      '<div><div class="id">#' + pad(p.id) + " · " + esc(p.region) + "</div><h2>" + esc(p.name) + "</h2>" +
      typePills(p.types) + "</div>" +
      '<div class="actions"><button class="iconbtn" data-expand title="Expand to document">⤡</button></div>' +
      "</div></div>" +
      '<div class="detail-body">' +
      (p.description ? '<p class="desc">' + esc(p.description) + "</p>" : "") +
      '<div class="facts">' +
      '<div class="fact"><b>Category</b><span>' + esc(p.category || "—") + "</span></div>" +
      '<div class="fact"><b>Egg groups</b><span>' + esc((p.eggGroups || []).join(", ") || "—") + "</span></div>" +
      '<div class="fact"><b>Height</b><span>' + meters(p.height) + "</span></div>" +
      '<div class="fact"><b>Weight</b><span>' + kilos(p.weight) + "</span></div>" +
      "</div>" +
      "<section><h3>Abilities</h3>" + abilityRows(p, false) + "</section>" +
      "<section>" + statsHtml(p) + "</section>" +
      (formes ? "<section><h3>Mega &amp; Gigantamax</h3>" + formes + "</section>" : "") +
      "<section><h3>Evolution</h3>" + evoHtml(p) + "</section>" +
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

  function trainingBox(p) {
    var s = STATS[p.id] || {};
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
    return '<div class="box"><h3>Training &amp; breeding</h3><div class="kv">' + rows.map(function (r) {
      return "<div>" + esc(r[0]) + '<span class="r">' + esc(r[1] == null || r[1] === "" ? "—" : r[1]) + "</span></div>";
    }).join("") + "</div></div>";
  }

  function docHtml(p) {
    var formes = megaGmaxHtml(p);
    var list = currentList();
    var i = list.indexOf(p);
    var prev = (list[i - 1] || p).id, next = (list[i + 1] || p).id;
    var dexNums = p.regionalDexNumbers || {};
    var dexRows = Object.keys(dexNums).map(function (r) {
      return "<div>" + esc(r) + '<span class="r">#' + pad(dexNums[r]) + "</span></div>";
    }).join("");

    return '<div class="dhead">' + spriteImg(p.id) +
      '<div><div class="id">#' + pad(p.id) + " · " + esc(p.region) +
      (p.category ? " · " + esc(p.category) : "") + "</div><h2>" + esc(p.name) + "</h2>" +
      typePills(p.types) + (p.description ? '<p class="desc">' + esc(p.description) + "</p>" : "") + "</div>" +
      '<div class="nav2">' +
      '<button class="iconbtn" data-id="' + prev + '" title="Previous (←)">◀</button>' +
      '<button class="iconbtn" data-id="' + next + '" title="Next (→)">▶</button>' +
      '<button class="iconbtn" data-expand title="Back to three-pane (Esc)">⇥ Collapse</button>' +
      "</div></div>" +
      '<div class="cols">' +
      '<div class="col">' +
      '<div class="box"><h3>Facts</h3><div class="facts">' +
      '<div class="fact"><b>Category</b><span>' + esc(p.category || "—") + "</span></div>" +
      '<div class="fact"><b>Egg groups</b><span>' + esc((p.eggGroups || []).join(", ") || "—") + "</span></div>" +
      '<div class="fact"><b>Height</b><span>' + meters(p.height) + "</span></div>" +
      '<div class="fact"><b>Weight</b><span>' + kilos(p.weight) + "</span></div>" +
      "</div></div>" +
      '<div class="box"><h3>Abilities</h3>' + abilityRows(p, true) + "</div>" +
      (formes ? '<div class="box"><h3>Mega &amp; Gigantamax</h3>' + formes + "</div>" : "") +
      '<div class="box"><h3>Evolution</h3>' + evoHtml(p) + "</div>" +
      "</div>" +
      '<div class="col">' +
      '<div class="box">' + statsHtml(p) + "</div>" +
      defenseBox(p) +
      "</div>" +
      '<div class="col">' +
      radarBox(p) +
      trainingBox(p) +
      (dexRows ? '<div class="box"><h3>Regional dex numbers</h3><div class="kv">' + dexRows + "</div></div>" : "") +
      '<div class="box"><h3>Moves &middot; Locations &middot; Alt formes</h3>' +
      '<div class="stub">These three still live only in the mobile frontend. The document view has the width for them — they are a later desktop pass, not a dropped feature.</div></div>' +
      "</div></div>";
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

    var p = byId(selectedId);
    // Set the species' type key ONCE on each container: .detail-head/.dhead
    // are siblings of the .box cards, not their ancestors, so an inline --t on
    // the head alone never reached them and every box fell back to flat chrome.
    var tv = typeRef(primaryType(p));
    compact.style.setProperty("--t", tv);
    doc.style.setProperty("--t", tv);

    compact.innerHTML = compactHtml(p);
    doc.innerHTML = docHtml(p);
    document.getElementById("navDetailTile").innerHTML = spriteImg(p.id, "");
    document.getElementById("navDetailName").textContent = p.name;
    document.getElementById("navDetailKbd").textContent = "#" + pad(p.id);
    document.getElementById("statusSel").textContent = p.name;
    document.getElementById("statusCount").textContent = currentList().length + " of " + POKEMON_DATA.length;
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
  }

  function select(id) {
    if (!byId(id)) return;
    selectedId = id;
    var cards = document.querySelectorAll("#center .card");
    for (var i = 0; i < cards.length; i++) {
      var on = +cards[i].dataset.id === id;
      cards[i].classList.toggle("sel", on);
      if (on) cards[i].scrollIntoView({ block: "nearest" });
    }
    renderDetail();
  }

  // Keep the selection inside the visible list after a filter/search change.
  function clampSelection() {
    var list = currentList();
    if (!list.length) return;
    if (!list.some(function (p) { return p.id === selectedId; })) selectedId = list[0].id;
  }

  function go(next) {
    if (screen === next) return;
    screen = next;
    if (expanded) setExpanded(false);
    render();
  }

  // -------------------------------------------------------------- events

  document.addEventListener("click", function (e) {
    if (e.target.closest("[data-rail]")) { setRail(!rail); return; }

    var nav = e.target.closest("[data-screen]");
    if (nav) { go(nav.dataset.screen); return; }

    var chip = e.target.closest("[data-region]");
    if (chip) { region = chip.dataset.region; clampSelection(); render(); return; }

    if (e.target.closest("[data-expand]")) { setExpanded(!expanded); return; }

    var card = e.target.closest("[data-id]");
    if (card) { select(+card.dataset.id); }
  });

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
    if (e.target.id === "railDefaultToggle") {
      railDefault = e.target.checked;
      writeSetting(SIDEBAR_KEY, railDefault);
      setRail(railDefault);
    }
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && expanded) { setExpanded(false); return; }
    if (e.ctrlKey && (e.key === "b" || e.key === "B")) { e.preventDefault(); setRail(!rail); return; }
    if (e.ctrlKey && e.key === ",") { e.preventDefault(); go("settings"); return; }
    if (e.ctrlKey && "12345".indexOf(e.key) >= 0) {
      e.preventDefault();
      go(["dex", "favorites", "bag", "types", "natures"][+e.key - 1]);
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

  // ---------------------------------------------------------------- init

  // Read before the first render (SCOPE.md §3's convention): index.html ships
  // with .rail already on, so this only ever has to REMOVE it.
  railDefault = readSetting(SIDEBAR_KEY, true);
  setRail(railDefault);

  document.getElementById("sidebarFoot").textContent =
    POKEMON_DATA.length + " Pokémon · " + REGIONS.filter(function (r) { return !r.standalone; }).length + " regions";
  document.getElementById("statusVersion").textContent = "VKDex v" + APP_VERSION + " · desktop";

  render();
})();
