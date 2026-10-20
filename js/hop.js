// Island hop: an illustrated, clickable map of St. Vincent and the Grenadines.
// Choosing an island sails a little traveller from Kingstown along the ferry route to it.
(function () {
  "use strict";
  var VV = window.VV;
  var svg = document.getElementById("hop-map");
  if (!svg) return;
  var NS = "http://www.w3.org/2000/svg";
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---- Projection: real coordinates, stretched a little east-west so the small islands fit ----
  function px(lat, lng) { return [16 + (lng + 61.47) * 840, 20 + (13.40 - lat) * 690]; }

  function el(name, attrs, parent) {
    var e = document.createElementNS(NS, name);
    Object.keys(attrs || {}).forEach(function (k) { e.setAttribute(k, attrs[k]); });
    if (parent) parent.appendChild(e);
    return e;
  }

  // Smooth closed or open path through points (Catmull-Rom to Bezier)
  function smooth(points, closed) {
    var p = points.slice();
    if (closed) { p = [p[p.length - 1]].concat(p, [p[0], p[1]]); }
    else { p = [p[0]].concat(p, [p[p.length - 1]]); }
    var d = "M" + p[1][0].toFixed(1) + " " + p[1][1].toFixed(1);
    for (var i = 1; i < p.length - 2; i++) {
      var p0 = p[i - 1], p1 = p[i], p2 = p[i + 1], p3 = p[i + 2];
      var c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
      var c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
      d += "C" + c1[0].toFixed(1) + " " + c1[1].toFixed(1) + " " + c2[0].toFixed(1) + " " + c2[1].toFixed(1) + " " + p2[0].toFixed(1) + " " + p2[1].toFixed(1);
    }
    return d + (closed ? "Z" : "");
  }

  // Organic blob around a centre (deterministic wobble so it looks hand-drawn, not like an ellipse)
  function blob(cx, cy, rx, ry, rot, seed) {
    var pts = [], n = 10, r = rot * Math.PI / 180;
    for (var i = 0; i < n; i++) {
      var a = i / n * Math.PI * 2;
      var w = 1 + 0.13 * Math.sin(a * 3 + seed) + 0.07 * Math.cos(a * 5 + seed * 2);
      var x = Math.cos(a) * rx * w, y = Math.sin(a) * ry * w;
      pts.push([cx + x * Math.cos(r) - y * Math.sin(r), cy + x * Math.sin(r) + y * Math.cos(r)]);
    }
    return smooth(pts, true);
  }

  // ---- Island shapes and label positions ----
  var SV_COAST = [[13.385,-61.183],[13.376,-61.152],[13.348,-61.128],[13.300,-61.117],[13.255,-61.120],[13.215,-61.131],[13.176,-61.139],[13.146,-61.150],[13.126,-61.170],[13.123,-61.198],[13.139,-61.222],[13.160,-61.240],[13.196,-61.262],[13.240,-61.272],[13.286,-61.258],[13.326,-61.240],[13.361,-61.214]];
  var SHAPES = {
    "st-vincent":       { path: smooth(SV_COAST.map(function (c) { return px(c[0], c[1]); }), true), lbl: [252, 128, "middle"], icon: [236, 46] },
    "young-island":     { c: [13.131, -61.209], rx: 4, ry: 4, rot: 0, lbl: [-10, 8, "end"], icon: null, hit: 12 },
    "bequia":           { c: [13.016, -61.238], rx: 27, ry: 9, rot: -32, lbl: [-34, 4, "end"], icon: [22, -18] },
    "mustique":         { c: [12.877, -61.183], rx: 12, ry: 7, rot: -60, lbl: [18, 4, "start"], icon: [-28, -6] },
    "canouan":          { c: [12.710, -61.333], rx: 19, ry: 7, rot: -55, lbl: [24, 4, "start"], icon: [-36, -10] },
    "mayreau":          { c: [12.640, -61.390], rx: 8, ry: 5, rot: -60, lbl: [-14, 0, "end"], icon: null, hit: 12 },
    "tobago-cays":      { c: [12.632, -61.355], cays: true, lbl: [18, 6, "start"], icon: null, hit: 14 },
    "union-island":     { c: [12.598, -61.432], rx: 15, ry: 9, rot: -25, lbl: [0, 27, "middle"], icon: null },
    "palm-island":      { c: [12.585, -61.395], rx: 5, ry: 4, rot: 0, lbl: [11, 6, "start"], icon: null, hit: 11 },
    "petit-st-vincent": { c: [12.537, -61.384], rx: 5, ry: 4, rot: 0, lbl: [11, 5, "start"], icon: null, hit: 11 }
  };

  // ---- Ferry route waypoints and the path to each island ----
  var W = {
    K: [13.150, -61.234], A1: [13.088, -61.248], B: [13.006, -61.244], A2: [12.930, -61.262],
    C: [12.712, -61.348], M: [12.636, -61.402], U: [12.594, -61.414], Y: [13.128, -61.216],
    MU1: [12.950, -61.215], MU: [12.873, -61.196], TC: [12.633, -61.366], P1: [12.588, -61.404],
    PI: [12.585, -61.401], PS: [12.541, -61.389], SV: [13.165, -61.230]
  };
  var ROUTES = {
    "st-vincent": ["K", "SV"],
    "young-island": ["K", "Y"],
    "bequia": ["K", "A1", "B"],
    "mustique": ["K", "A1", "B", "MU1", "MU"],
    "canouan": ["K", "A1", "B", "A2", "C"],
    "mayreau": ["K", "A1", "B", "A2", "C", "M"],
    "tobago-cays": ["K", "A1", "B", "A2", "C", "M", "TC"],
    "union-island": ["K", "A1", "B", "A2", "C", "M", "U"],
    "palm-island": ["K", "A1", "B", "A2", "C", "M", "U", "P1", "PI"],
    "petit-st-vincent": ["K", "A1", "B", "A2", "C", "M", "U", "P1", "PS"]
  };

  // ---- Draw the chart ----
  var defs = el("defs", {}, svg);
  var g1 = el("linearGradient", { id: "hopSea", x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
  el("stop", { offset: 0, "stop-color": "#0E6E8C" }, g1);
  el("stop", { offset: 1, "stop-color": "#0A3A5A" }, g1);
  var pat = el("pattern", { id: "hopWaves", width: 46, height: 26, patternUnits: "userSpaceOnUse" }, defs);
  el("path", { d: "M2 14 q 5 -5 10 0 t 10 0", fill: "none", stroke: "rgba(255,255,255,.09)", "stroke-width": 1.4 }, pat);
  el("rect", { width: 360, height: 640, fill: "url(#hopSea)" }, svg);
  el("rect", { width: 360, height: 640, fill: "url(#hopWaves)" }, svg);

  var t1 = el("text", { x: 22, y: 300, fill: "rgba(255,255,255,.35)", "font-size": 11, "font-style": "italic", "font-family": "Manrope, sans-serif" }, svg);
  t1.textContent = "Caribbean Sea";
  var t2 = el("text", { x: 340, y: 470, fill: "rgba(255,255,255,.35)", "font-size": 11, "font-style": "italic", "text-anchor": "end", "font-family": "Manrope, sans-serif" }, svg);
  t2.textContent = "Atlantic Ocean";

  // Compass
  var comp = el("g", { transform: "translate(328 40)", opacity: .75 }, svg);
  el("path", { d: "M0 -16 L5 0 L0 16 L-5 0 Z", fill: "#FCD116" }, comp);
  el("path", { d: "M0 -16 L5 0 L0 0 Z", fill: "#FFFFFF" }, comp);
  var cn = el("text", { x: 0, y: -21, fill: "#FCD116", "font-size": 10, "font-weight": 700, "text-anchor": "middle", "font-family": "Manrope, sans-serif" }, comp);
  cn.textContent = "N";

  // Ferry route (dashed)
  var mainRoute = ["K", "A1", "B", "A2", "C", "M", "U"].map(function (k) { return px(W[k][0], W[k][1]); });
  el("path", { class: "route", d: smooth(mainRoute, false) }, svg);
  [["B", "MU1", "MU"], ["M", "TC"], ["U", "P1", "PS"], ["K", "Y"]].forEach(function (r) {
    el("path", { class: "route", d: smooth(r.map(function (k) { return px(W[k][0], W[k][1]); }), false) }, svg);
  });

  // Decorative sailboats
  [[300, 250, 1], [180, 420, .8], [60, 470, .7]].forEach(function (b) {
    var g = el("g", { transform: "translate(" + b[0] + " " + b[1] + ") scale(" + b[2] + ")", opacity: .5, class: "mini" }, svg);
    el("path", { d: "M0 -12 V2 H-8 Z", fill: "#FFFFFF" }, g);
    el("path", { d: "M2 -9 V2 H8 Z", fill: "#FFFFFF", opacity: .8 }, g);
    el("path", { d: "M-9 3 H10 L7 7 H-6 Z", fill: "#FFFFFF" }, g);
  });

  var trail = el("path", { class: "trail", d: "" }, svg);

  // Islands
  var isleEls = {};
  window.VV_ISLANDS.forEach(function (isl) {
    var s = SHAPES[isl.id];
    var g = el("g", { class: "isle", tabindex: 0, role: "button", "aria-label": "Sail to " + isl.name, "data-id": isl.id }, svg);
    var centre;
    if (s.path) {
      el("path", { class: "shape", d: s.path }, g);
      centre = [252, 120];
    } else {
      centre = px(s.c[0], s.c[1]);
      if (s.cays) {
        el("path", { d: "M" + (centre[0] + 8) + " " + (centre[1] - 9) + " q 9 9 0 18", fill: "none", stroke: "rgba(160,240,230,.8)", "stroke-width": 2, "stroke-dasharray": "2 3" }, g);
        [[-5, -4, 3], [1, -6, 2.4], [-1, 2, 2.6], [4, 3, 2]].forEach(function (c) {
          el("circle", { class: "shape", cx: centre[0] + c[0], cy: centre[1] + c[1], r: c[2] }, g);
        });
      } else {
        el("path", { class: "shape", d: blob(centre[0], centre[1], s.rx, s.ry, s.rot, isl.id.length) }, g);
      }
    }
    el("circle", { class: "halo", cx: centre[0], cy: centre[1], r: s.path ? 0 : (s.hit || Math.max(s.rx, s.ry) + 7) }, g);
    if (s.hit) { el("circle", { cx: centre[0], cy: centre[1], r: s.hit, fill: "transparent" }, g); }

    // Small illustrated marker (volcano, sailboat, palm, fish...)
    if (s.icon) {
      var ig = el("g", { class: "mini", transform: "translate(" + ((s.path ? s.icon[0] : centre[0] + s.icon[0]) - 13) + " " + ((s.path ? s.icon[1] : centre[1] + s.icon[1]) - 13) + ") scale(.65)" }, g);
      ig.innerHTML = VV.islandIcon(isl).replace(/<svg[^>]*>/, "").replace("</svg>", "");
    }
    var lx = s.path ? s.lbl[0] : centre[0] + s.lbl[0];
    var ly = s.path ? s.lbl[1] : centre[1] + s.lbl[1];
    var lbl = el("text", { class: "lbl", x: lx, y: ly, "text-anchor": s.lbl[2] }, g);
    lbl.textContent = isl.name;
    if (isl.id === "st-vincent") { lbl.setAttribute("font-size", "15"); }
    isleEls[isl.id] = g;
  });

  // Kingstown home port
  var kp = px(W.K[0], W.K[1]);
  var kg = el("g", { class: "mini" }, svg);
  el("circle", { cx: kp[0] + 6, cy: kp[1] - 6, r: 3.5, fill: "#FCD116", stroke: "#1A0B3B", "stroke-width": 1.2 }, kg);
  var kt = el("text", { x: kp[0] - 1, y: kp[1] - 12, class: "lbl", "font-size": 10, "text-anchor": "end" }, kg);
  kt.textContent = "Kingstown";

  // Traveller: a little figure in a sun hat, sailing a boat
  var trav = el("g", { id: "traveller" }, svg);
  var flip = el("g", {}, trav);
  var bob = el("g", { class: "traveller-bob" }, flip);
  bob.innerHTML =
    '<ellipse cx="0" cy="13" rx="14" ry="2.5" fill="rgba(255,255,255,.35)"/>' +
    '<path d="M-15 4 L15 4 L10 11 L-10 11 Z" fill="#FCD116" stroke="#1A0B3B" stroke-width="1.5" stroke-linejoin="round"/>' +
    '<path d="M3 -21 V4" stroke="#1A0B3B" stroke-width="1.6"/>' +
    '<path d="M4 -20 L4 1 L15 1 Z" fill="#D81B7A" stroke="#1A0B3B" stroke-width="1.2" stroke-linejoin="round"/>' +
    '<circle cx="-6" cy="-11" r="3.6" fill="#8A5A3B" stroke="#1A0B3B" stroke-width="1.2"/>' +
    '<path d="M-12 -13.5 H0" stroke="#1A0B3B" stroke-width="1.6" stroke-linecap="round"/>' +
    '<path d="M-9.5 -13.5 Q-6 -19 -2.5 -13.5 Z" fill="#F4DFA6" stroke="#1A0B3B" stroke-width="1.2"/>' +
    '<path d="M-6 -7.5 V2" stroke="#1A0B3B" stroke-width="2.2" stroke-linecap="round"/>' +
    '<path class="wave-arm" d="M-6 -5 L-12 -10" stroke="#1A0B3B" stroke-width="1.8" stroke-linecap="round"/>' +
    '<path d="M-6 -5 L-1 -2" stroke="#1A0B3B" stroke-width="1.8" stroke-linecap="round"/>';

  function place(x, y, facingLeft) {
    trav.setAttribute("transform", "translate(" + x.toFixed(1) + " " + y.toFixed(1) + ")");
    flip.setAttribute("transform", facingLeft ? "scale(-1 1)" : "");
  }
  place(kp[0], kp[1]);

  // ---- Chips (quick list, handy on phones) ----
  var chips = document.getElementById("hop-chips");
  chips.innerHTML = window.VV_ISLANDS.map(function (isl) {
    return '<button type="button" data-id="' + isl.id + '" aria-pressed="' + (isl.id === "st-vincent") + '">' + VV.esc(isl.name) + "</button>";
  }).join("");

  // ---- Info card ----
  function routeKm(id) {
    var r = ROUTES[id], km = 0;
    for (var i = 1; i < r.length; i++) { km += VV.distanceKm(W[r[i - 1]][0], W[r[i - 1]][1], W[r[i]][0], W[r[i]][1]); }
    return km;
  }
  function updateCard(isl) {
    document.getElementById("hop-name").textContent = isl.name;
    document.getElementById("hop-tag").textContent = isl.tagline;
    var trip = document.getElementById("hop-trip");
    if (isl.id === "st-vincent") {
      trip.textContent = "Home port: Kingstown. Head north for the rainforest, waterfalls and La Soufrière.";
    } else {
      var first = isl.gettingThere.split(". ")[0].replace(/\.$/, "");
      trip.textContent = "About " + Math.round(routeKm(isl.id)) + " km from Kingstown by sea. " + first + ".";
    }
    var go = document.getElementById("hop-go");
    go.href = "island.html?id=" + isl.id;
    go.textContent = "Explore " + isl.name;
    document.querySelector(".hero-stop .label").textContent = isl.id === "st-vincent" ? "You're in" : "You've sailed to";
  }

  // ---- Sailing animation ----
  var anim = null, current = "st-vincent";
  function setActive(id) {
    Object.keys(isleEls).forEach(function (k) { isleEls[k].classList.toggle("active", k === id); });
    chips.querySelectorAll("button").forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-id") === id)); });
  }
  function ease(t) { return -(Math.cos(Math.PI * t) - 1) / 2; }

  function sailTo(id) {
    var isl = VV.island(id);
    if (!isl) return;
    if (anim) { cancelAnimationFrame(anim); anim = null; }
    current = id;
    setActive(id);
    updateCard(isl);
    var pts = ROUTES[id].map(function (k) { return px(W[k][0], W[k][1]); });
    var d = smooth(pts, false);
    trail.setAttribute("d", d);
    var len = trail.getTotalLength();
    trail.style.strokeDasharray = len + " " + len;
    if (reduceMotion || len < 1) {
      trail.style.strokeDashoffset = 0;
      var end = pts[pts.length - 1];
      place(end[0], end[1]);
      return;
    }
    var dur = Math.max(900, Math.min(3400, 700 + len * 6));
    var start = null, last = trail.getPointAtLength(0);
    place(last.x, last.y);
    function frame(ts) {
      if (start === null) start = ts;
      var t = Math.min(1, (ts - start) / dur);
      var at = ease(t) * len;
      var p = trail.getPointAtLength(at);
      var ahead = trail.getPointAtLength(Math.min(len, at + 2));
      place(p.x, p.y, ahead.x < p.x - 0.05);
      trail.style.strokeDashoffset = (len - at).toFixed(1);
      if (t < 1) { anim = requestAnimationFrame(frame); }
      else { anim = null; arrive(); }
    }
    anim = requestAnimationFrame(frame);
  }
  function arrive() {
    if (reduceMotion) return;
    var g = document.getElementById("traveller");
    var base = g.getAttribute("transform");
    var t0 = null;
    function hop(ts) {
      if (t0 === null) t0 = ts;
      var t = (ts - t0) / 420;
      var y = -Math.sin(Math.min(1, t) * Math.PI) * 6;
      g.setAttribute("transform", base + " translate(0 " + y.toFixed(1) + ")");
      if (t < 1) requestAnimationFrame(hop); else g.setAttribute("transform", base);
    }
    requestAnimationFrame(hop);
  }

  svg.addEventListener("click", function (e) {
    var g = e.target.closest(".isle");
    if (g) sailTo(g.getAttribute("data-id"));
  });
  svg.addEventListener("keydown", function (e) {
    var g = e.target.closest && e.target.closest(".isle");
    if (g && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); sailTo(g.getAttribute("data-id")); }
  });
  chips.addEventListener("click", function (e) {
    var b = e.target.closest("button");
    if (b) sailTo(b.getAttribute("data-id"));
  });

  setActive("st-vincent");
  window.VV.sailTo = sailTo; // handy for testing

  // Arriving from the quiz (index.html?sail=bequia#hop): sail straight to that island
  var want = new URLSearchParams(location.search).get("sail");
  if (want && VV.island(want)) { setTimeout(function () { sailTo(want); }, 500); }
})();
