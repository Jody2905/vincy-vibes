// Day planner: pick an island, a date, what you like and how busy a day you want.
// It builds a timeline from js/data/plans.js, adds real ferry times for Kingstown–Bequia
// day trips, flags festivals that month, maps the stops and makes a shareable link.
(function () {
  "use strict";
  var VV = window.VV;
  var PLAN = window.VV_PLAN, SLOTS = window.VV_PLAN_SLOTS, TAGS = window.VV_PLAN_TAGS, NEAR = window.VV_PLAN_NEAR;
  var SLOT_MIN = { early: 420, morning: 570, lunch: 750, afternoon: 870, evening: 1050 };
  var PACES = { relaxed: ["morning", "lunch", "afternoon", "evening"], full: ["early", "morning", "lunch", "afternoon", "evening"] };
  var CROSSING = 60; // minutes, Kingstown–Bequia (30 to 60 minutes depending on the boat)
  var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  var form = document.getElementById("plan-form");
  var islandSel = document.getElementById("pl-island");
  var dateIn = document.getElementById("pl-date");
  var fromSeg = document.getElementById("pl-from");
  var paceSeg = document.getElementById("pl-pace");
  var likesBox = document.getElementById("pl-likes");
  var out = document.getElementById("plan-out");

  VV.fillIslandSelect(islandSel);

  // Interest chips
  likesBox.innerHTML = Object.keys(TAGS).map(function (k) {
    return '<button type="button" class="chip" data-tag="' + k + '" aria-pressed="false">' + VV.esc(TAGS[k]) + "</button>";
  }).join("");

  function segValue(seg) {
    var b = seg.querySelector('[aria-pressed="true"]');
    return b ? b.getAttribute("data-v") : null;
  }
  function setSeg(seg, v) {
    var found = false;
    seg.querySelectorAll("button").forEach(function (b) {
      var on = b.getAttribute("data-v") === v;
      b.setAttribute("aria-pressed", on ? "true" : "false");
      if (on) found = true;
    });
    if (!found) seg.querySelector("button").setAttribute("aria-pressed", "true");
  }
  function likes() {
    return Array.prototype.map.call(likesBox.querySelectorAll('[aria-pressed="true"]'), function (b) { return b.getAttribute("data-tag"); });
  }
  function setLikes(list) {
    likesBox.querySelectorAll(".chip").forEach(function (b) {
      b.setAttribute("aria-pressed", list.indexOf(b.getAttribute("data-tag")) >= 0 ? "true" : "false");
    });
  }
  [fromSeg, paceSeg].forEach(function (seg) {
    seg.addEventListener("click", function (e) {
      var b = e.target.closest("button");
      if (b) setSeg(seg, b.getAttribute("data-v"));
    });
  });
  likesBox.addEventListener("click", function (e) {
    var b = e.target.closest(".chip");
    if (b) b.setAttribute("aria-pressed", b.getAttribute("aria-pressed") === "true" ? "false" : "true");
  });

  // Dates are handled as plain calendar days (UTC midnight) so time zones can't shift them.
  function parseDate(s) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s || "");
    if (!m) return null;
    var d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
    return isNaN(d) ? null : d;
  }
  function isoDate(d) { return d.toISOString().slice(0, 10); }
  function svgToday() {
    var n = new Date(Date.now() - 4 * 3600 * 1000);
    return new Date(Date.UTC(n.getUTCFullYear(), n.getUTCMonth(), n.getUTCDate()));
  }
  function niceDate(d) {
    return VV.dayName(d.getUTCDay()) + " " + d.getUTCDate() + " " + MONTHS[d.getUTCMonth()] + " " + d.getUTCFullYear();
  }
  function fmtMin(m) {
    var h = Math.floor(m / 60) % 24, mm = m % 60;
    return VV.formatTime(String(h).padStart(2, "0") + ":" + String(mm).padStart(2, "0"));
  }

  // Small seeded random number generator, so a shared link rebuilds the same plan.
  function rng(seed) {
    var s = seed >>> 0 || 1;
    return function () { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
  }

  /* ---------- Ferries for Kingstown–Bequia day trips ---------- */
  var PORT = { "st-vincent": "Kingstown", "young-island": "Kingstown", "bequia": "Bequia" };

  function sailings(from, day) {
    var list = [];
    window.VV_FERRIES.shuttles.forEach(function (s) {
      ((s.times[from] || {})[day] || []).forEach(function (t) {
        list.push({ operator: s.operator, time: t.replace("*", ""), fixed: t.indexOf("*") >= 0, min: VV.toMinutes(t) });
      });
    });
    return list.sort(function (a, b) { return a.min - b.min; });
  }

  // Returns {out, back, outAlt, backAlt} or null when there's no workable day trip.
  function dayTrip(fromPort, toPort, day) {
    var there = sailings(fromPort, day).filter(function (s) { return s.min >= 420; });
    var home = sailings(toPort, day);
    if (!there.length || !home.length) return null;
    var outLeg = there[0];
    var back = home.filter(function (s) { return s.min >= outLeg.min + CROSSING + 240; });
    if (!back.length) return null;
    var backLeg = back[back.length - 1];
    return {
      out: outLeg, back: backLeg,
      outAlt: there.slice(1, 3),
      backAlt: back.slice(Math.max(0, back.length - 3), back.length - 1).reverse()
    };
  }

  /* ---------- Building the plan ---------- */
  function poolFor(target) {
    var near = NEAR[target];
    return PLAN.map(function (a, i) { return { a: a, i: i }; }).filter(function (x) {
      return x.a.island === target || (near && x.a.island === near.island);
    });
  }

  function rank(target, slot, day, wanted, rand) {
    return poolFor(target).filter(function (x) {
      return x.a.slots.indexOf(slot) >= 0 && (!x.a.days || x.a.days.indexOf(day) >= 0);
    }).map(function (x) {
      var hits = x.a.tags.filter(function (t) { return wanted.indexOf(t) >= 0; }).length;
      var prefer = NEAR[target] && NEAR[target].prefer && NEAR[target].prefer.indexOf(x.a.place) >= 0 ? 8 : 0;
      var score = hits * 10 + (x.a.slots[0] === slot ? 2 : 0) + (x.a.island === target ? 6 : 0) + (x.a.days ? 15 : 0) + prefer + rand() * 3;
      return { i: x.i, score: score };
    }).sort(function (a, b) { return b.score - a.score; }).map(function (x) { return x.i; });
  }

  var state = null;

  function build(opts) {
    var d = parseDate(opts.date) || svgToday();
    var day = d.getUTCDay();
    var target = opts.island;
    var rand = rng(opts.seed);
    var wanted = opts.likes.length ? opts.likes : Object.keys(TAGS);
    var slots = PACES[opts.pace].slice();
    var notes = [], legs = null, homeEvening = null;

    if (NEAR[target]) notes.push({ kind: "info", text: NEAR[target].note });

    var fromPort = PORT[opts.from], toPort = PORT[target];
    var fromName = opts.from === "st-vincent" ? "St. Vincent" : "Bequia";
    if (opts.from !== "here" && opts.from !== target && !(opts.from === "st-vincent" && target === "young-island")) {
      if (fromPort && toPort && fromPort !== toPort) {
        legs = dayTrip(fromPort, toPort, day);
        if (legs) {
          var arrive = legs.out.min + CROSSING, leave = legs.back.min;
          slots = slots.filter(function (s) { return SLOT_MIN[s] >= arrive - 15 && SLOT_MIN[s] + 60 <= leave - 30; });
          if (slots.indexOf("lunch") < 0 && arrive < 750 && leave > 800) slots.push("lunch");
          homeEvening = opts.from;
        } else {
          notes.push({ kind: "warn", text: "There's no workable same-day return by ferry between Kingstown and Bequia on " + VV.dayName(day) + "s, so this plan assumes you stay the night." });
        }
      } else {
        notes.push({ kind: "warn", text: "This isn't an easy day trip by public ferry from " + fromName + ": the southern Grenadines boats run about once a day. Fly from Argyle (Canouan, Union Island and Mustique have airports), join a day tour, or stay a night. This plan assumes you're already there." });
      }
    }
    if (target === "young-island" && opts.from !== "here") {
      notes.push({ kind: "info", text: "From Kingstown, Villa Beach is a short taxi ride." });
    }

    // Festivals and holidays that month
    var month = d.getUTCMonth() + 1;
    if (month === 10 && d.getUTCDate() === 27) {
      notes.push({ kind: "party", text: "It's Independence Day! Expect parades and celebrations, and the whole country in blue, gold and green. Some businesses close for the public holiday." });
    }
    if (month === 10 && d.getUTCDate() !== 27) {
      var indep = new Date(Date.UTC(d.getUTCFullYear(), 9, 27));
      notes.push({ kind: "party", text: (d.getUTCDate() < 27 ? "Independence Day is " : "Independence Day was ") + VV.dayName(indep.getUTCDay()) + " 27 October. October is full of celebrations, with the country dressed in blue, gold and green." });
    }
    (window.VV_FESTIVALS || []).forEach(function (f) {
      if (f.month === month && f.name !== "Independence Day") {
        notes.push({ kind: "party", text: "Around this time: " + f.name + " (" + f.when + "). Dates change each year, so check with the organisers." });
      }
    });

    var order = ["early", "morning", "lunch", "afternoon", "evening"];
    slots.sort(function (a, b) { return order.indexOf(a) - order.indexOf(b); });

    var used = {}, stops = [];
    slots.forEach(function (slot) {
      var ranked = rank(target, slot, day, wanted, rand).filter(function (i) { return !used[i]; });
      if (!ranked.length) return;
      used[ranked[0]] = true;
      stops.push({ slot: slot, choices: ranked, pick: 0 });
    });
    if (homeEvening && opts.pace) {
      var r = rank(homeEvening, "evening", day, wanted, rand).filter(function (i) { return !used[i]; });
      if (r.length) stops.push({ slot: "evening", home: true, choices: r, pick: 0 });
    }

    // A shared link can fix exact picks
    if (opts.picks) {
      opts.picks.forEach(function (p, k) {
        if (stops[k]) {
          var at = stops[k].choices.indexOf(p);
          if (at >= 0) stops[k].pick = at;
        }
      });
    }

    state = { opts: opts, date: d, day: day, target: target, notes: notes, legs: legs, stops: stops };
    render();
  }

  function current(stop) { return PLAN[stop.choices[stop.pick]]; }
  function placeOf(a) {
    return a.place ? (window.VV_PLACES || []).find(function (p) { return p.name === a.place; }) : null;
  }

  function legHtml(leg, from, to, alts, label) {
    var arrive = leg.min + CROSSING;
    return '<li class="tl-item tl-boat">' +
      '<div class="tl-time">' + VV.formatTime(leg.time) + "</div>" +
      '<div class="tl-dot" aria-hidden="true"></div>' +
      '<div class="tl-card">' +
        '<p class="tl-slot">' + label + "</p>" +
        "<h3>" + VV.esc(from) + " to " + VV.esc(to) + " by ferry</h3>" +
        "<p>" + VV.esc(leg.operator) + ", leaving " + VV.formatTime(leg.time) + (leg.fixed ? " (a time we've corrected from the published timetable, so check it)" : "") +
        ". Arrive by about " + fmtMin(arrive) + ".</p>" +
        (alts.length ? '<p class="tl-alt">Other boats: ' + alts.map(function (s) { return VV.formatTime(s.time) + " " + VV.esc(s.operator); }).join(", ") + "</p>" : "") +
        '<p class="tl-alt"><a href="ferries.html">Full ferry timetable</a></p>' +
      "</div></li>";
  }

  function render() {
    var s = state, isl = VV.island(s.target);
    var mapped = [];
    var n = 0;
    var html = "";

    html += '<div class="plan-head" style="--accent:' + isl.color + '">' +
      '<div class="res-icon">' + VV.islandIcon(isl) + "</div>" +
      "<div><p class=\"quiz-step\">Your day plan</p>" +
      '<h2 id="plan-title" tabindex="-1">' + VV.esc(isl.name) + "</h2>" +
      '<p class="plan-date">' + niceDate(s.date) + " · " + (s.opts.pace === "full" ? "Full day" : "Relaxed day") + "</p></div></div>";

    if (s.notes.length) {
      html += '<ul class="plan-notes">' + s.notes.map(function (x) {
        return '<li class="note-' + x.kind + '">' + VV.esc(x.text) + "</li>";
      }).join("") + "</ul>";
    }

    html += '<div id="plan-wx" aria-live="polite"></div>';
    html += '<ol class="daylist">';
    var homeName = s.opts.from === "st-vincent" ? "Kingstown" : "Bequia";
    var awayName = s.target === "bequia" ? "Bequia" : "Kingstown";
    if (s.legs) html += legHtml(s.legs.out, homeName, awayName, s.legs.outAlt, "Getting there");

    s.stops.forEach(function (stop, k) {
      if (stop.home && s.legs) html += legHtml(s.legs.back, awayName, homeName, s.legs.backAlt, "Heading back");
      var a = current(stop), p = placeOf(a), num = "";
      if (p) { n++; num = '<span class="tl-num">' + n + "</span>"; mapped.push({ p: p, n: n, a: a }); }
      var time = stop.home ? "Back home" : SLOTS[stop.slot].time;
      var other = VV.island(a.island);
      html += '<li class="tl-item">' +
        '<div class="tl-time">' + time + "</div>" +
        '<div class="tl-dot" aria-hidden="true"></div>' +
        '<div class="tl-card">' +
          '<p class="tl-slot">' + VV.esc(SLOTS[stop.slot].label) + (a.island !== s.target ? " · " + VV.esc(other.name) : "") + "</p>" +
          "<h3>" + num + VV.esc(a.title) + "</h3>" +
          "<p>" + VV.esc(a.what) + "</p>" +
          '<div class="tl-tags">' + a.tags.map(function (t) { return '<span class="tag">' + VV.esc(TAGS[t]) + "</span>"; }).join("") + "</div>" +
          '<div class="tl-actions">' +
            (p ? '<a href="' + VV.googleDirections(p.lat, p.lng) + '" target="_blank" rel="noopener">Directions</a>' : "") +
            (stop.choices.length > 1 ? '<button type="button" class="swap" data-k="' + k + '">Swap for something else</button>' : "") +
          "</div>" +
        "</div></li>";
    });
    if (s.legs && !s.stops.some(function (x) { return x.home; })) html += legHtml(s.legs.back, awayName, homeName, s.legs.backAlt, "Heading back");
    html += "</ol>";

    html += '<div class="plan-map-wrap"' + (mapped.length ? "" : " hidden") + '><h3 class="plan-map-h">Your stops on the map</h3><div id="plan-map" class="plan-map" role="region" aria-label="Map of your stops"></div>' +
      '<p class="footnote">Some pins are approximate. Numbers match the stops above.</p></div>';

    html += '<div class="res-actions plan-actions">' +
      '<button type="button" class="btn btn-gold" id="pl-share">Share this plan</button>' +
      '<button type="button" class="btn btn-quiet" id="pl-print">Print</button>' +
      '<button type="button" class="btn btn-quiet" id="pl-shuffle">Shuffle the whole day</button>' +
      '<a class="btn btn-quiet" href="island.html?id=' + s.target + '">More about ' + VV.esc(isl.name) + "</a>" +
      "</div>" +
      '<p class="share-msg" id="pl-msg" aria-live="polite"></p>' +
      '<p class="footnote">Opening hours, prices and ferry times change, so confirm the day before. Taxi drivers know every spot here: <a href="taxis.html">find an approved taxi</a>.</p>';

    out.innerHTML = html;
    out.hidden = false;
    var empty = document.getElementById("plan-empty");
    if (empty) empty.hidden = true;
    out.classList.remove("in"); void out.offsetWidth; out.classList.add("in");
    updateUrl();
    drawMap(mapped);
    planWeather();
  }

  // Forecast for the plan's day, when it's within the next week
  function planWeather() {
    var box = document.getElementById("plan-wx"), s = state;
    if (!box || !VV.weather) return;
    var days = Math.round((s.date - svgToday()) / 86400000);
    if (days < 0 || days > 6) return;
    var isl = VV.island(s.target);
    var want = isoDate(s.date);
    VV.weather(isl.lat, isl.lng).then(function (w) {
      if (state !== s) return;
      var d = w.days.filter(function (x) { return x.date === want; })[0];
      if (!d) return;
      var tips = [];
      if (d.rain != null && d.rain >= 60) tips.push("pack a light rain jacket");
      if (d.uv != null && d.uv >= 8) tips.push("the sun is strong, so bring sun cream and a hat");
      if (d.waveMax != null && d.waveMax >= 1.25) tips.push("the sea may be choppy for boat trips and snorkelling");
      if (d.windMax != null && d.windMax >= 17 && s.target === "union-island") tips.push("good wind for kitesurfing");
      box.innerHTML = '<div class="plan-wx">' + VV.weatherIcon(d.code) +
        "<div><strong>" + (days === 0 ? "Today" : days === 1 ? "Tomorrow" : VV.dayName(s.day)) + ": " + VV.esc(VV.weatherText(d.code)) +
        ", " + Math.round(d.max) + "° / " + Math.round(d.min) + "°C</strong>" +
        "<p>" + [d.rain != null ? d.rain + "% chance of rain" : "", d.windMax != null ? "wind up to " + Math.round(d.windMax) + " knots" : "",
          d.waveMax != null ? "waves up to " + d.waveMax.toFixed(1) + " m" : "", "sunset " + VV.clock(d.sunset)].filter(Boolean).join(" · ") + "</p>" +
        (tips.length ? '<p class="plan-wx-tip">Tip: ' + VV.esc(tips.join("; ")) + ".</p>" : "") +
        '<p class="wx-credit">' + VV.WX_CREDIT + "</p></div></div>";
    }).catch(function () { /* no forecast: the plan still works */ });
  }

  var map = null;
  function drawMap(mapped) {
    if (map) { map.remove(); map = null; }
    if (!mapped.length || !window.L) return;
    var L = window.L;
    map = L.map("plan-map", { scrollWheelZoom: false });
    VV.tiles(L, map);
    // Stops at the same spot (say, two in Kingstown) share one pin: "1 · 3"
    var groups = [], byName = {};
    mapped.forEach(function (m) {
      if (!byName[m.p.name]) { byName[m.p.name] = { p: m.p, nums: [], titles: [] }; groups.push(byName[m.p.name]); }
      byName[m.p.name].nums.push(m.n); byName[m.p.name].titles.push(m.n + ". " + m.a.title);
    });
    var pts = [];
    groups.forEach(function (g) {
      var label = g.nums.join(" · "), w = 30 + (g.nums.length - 1) * 22;
      var icon = L.divIcon({ className: "plan-pin", html: '<span style="width:' + w + 'px">' + label + "</span>", iconSize: [w, 30], iconAnchor: [w / 2, 15] });
      L.marker([g.p.lat, g.p.lng], { icon: icon, title: g.titles.join(", ") }).addTo(map).bindPopup(VV.placeHtml(g.p));
      pts.push([g.p.lat, g.p.lng]);
    });
    if (pts.length === 1) map.setView(pts[0], 13);
    else map.fitBounds(pts, { padding: [36, 36], maxZoom: 14 });
  }

  function shareUrl() {
    var s = state;
    var q = new URLSearchParams({
      island: s.target, from: s.opts.from, date: isoDate(s.date), pace: s.opts.pace,
      likes: s.opts.likes.join(","), seed: String(s.opts.seed),
      picks: s.stops.map(function (x) { return x.choices[x.pick]; }).join(".")
    });
    return location.origin + location.pathname + "?" + q.toString();
  }
  function updateUrl() {
    try { window.history.replaceState(null, "", shareUrl()); } catch (e) { /* ignore */ }
  }

  out.addEventListener("click", function (e) {
    var sw = e.target.closest(".swap");
    if (sw) {
      var stop = state.stops[Number(sw.getAttribute("data-k"))];
      var taken = {};
      state.stops.forEach(function (x) { if (x !== stop) taken[x.choices[x.pick]] = true; });
      var tries = 0;
      do { stop.pick = (stop.pick + 1) % stop.choices.length; tries++; } while (taken[stop.choices[stop.pick]] && tries < stop.choices.length);
      var k = sw.getAttribute("data-k");
      render();
      var again = out.querySelector('.swap[data-k="' + k + '"]');
      if (again) again.focus({ preventScroll: true });
      return;
    }
    if (e.target.id === "pl-shuffle") {
      var o = state.opts; o.seed = Math.floor(Math.random() * 1e9); o.picks = null;
      build(o);
      return;
    }
    if (e.target.id === "pl-print") { window.print(); return; }
    if (e.target.id === "pl-share") {
      var url = shareUrl(), msg = document.getElementById("pl-msg");
      var isl = VV.island(state.target);
      var text = "My day on " + isl.name + ", planned with Vincy Vibes";
      if (navigator.share) { navigator.share({ title: text, url: url }).catch(function () {}); return; }
      try {
        navigator.clipboard.writeText(url).then(function () { msg.textContent = "Link copied. Anyone with it sees this exact plan."; },
          function () { msg.textContent = "Copy this link: " + url; });
      } catch (err) { msg.textContent = "Copy this link: " + url; }
    }
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    build({
      island: islandSel.value, from: segValue(fromSeg), date: dateIn.value, pace: segValue(paceSeg),
      likes: likes(), seed: Math.floor(Math.random() * 1e9), picks: null
    });
    var t = document.getElementById("plan-title");
    if (t) { t.focus({ preventScroll: true }); out.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" }); }
  });

  // Defaults, or the settings from a shared link
  var q = new URLSearchParams(location.search);
  var tomorrow = new Date(svgToday().getTime() + 86400000);
  dateIn.value = parseDate(q.get("date")) ? q.get("date") : isoDate(tomorrow);
  if (q.get("island") && VV.island(q.get("island"))) islandSel.value = q.get("island");
  setSeg(fromSeg, ["here", "st-vincent", "bequia"].indexOf(q.get("from")) >= 0 ? q.get("from") : "here");
  setSeg(paceSeg, q.get("pace") === "full" ? "full" : "relaxed");
  var startLikes = (q.get("likes") || "beach,food,culture").split(",").filter(function (t) { return TAGS[t]; });
  setLikes(startLikes);

  if (q.get("seed") && q.get("island") && VV.island(q.get("island"))) {
    build({
      island: islandSel.value, from: segValue(fromSeg), date: dateIn.value, pace: segValue(paceSeg),
      likes: startLikes, seed: parseInt(q.get("seed"), 10) || 1,
      picks: (q.get("picks") || "").split(".").filter(Boolean).map(Number)
    });
  }
})();
