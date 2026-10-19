// Shared helpers for every page.
(function () {
  "use strict";

  var VV = window.VV = {};

  /** Escape text before putting it into HTML. */
  VV.esc = function (s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };

  VV.island = function (id) {
    return (window.VV_ISLANDS || []).find(function (i) { return i.id === id; });
  };

  /* ---------- Time in St. Vincent (UTC-4 all year, no daylight saving) ---------- */

  /** The current day of week (0 = Sunday) and minutes since midnight, in SVG time,
   *  whatever time zone the visitor's phone is set to. */
  VV.svgNow = function (date) {
    var d = date || new Date();
    var svg = new Date(d.getTime() - 4 * 3600 * 1000);
    return { day: svg.getUTCDay(), minutes: svg.getUTCHours() * 60 + svg.getUTCMinutes() };
  };

  VV.toMinutes = function (hhmm) {
    var p = hhmm.replace("*", "").split(":");
    return Number(p[0]) * 60 + Number(p[1]);
  };

  VV.formatTime = function (hhmm) {
    var m = VV.toMinutes(hhmm);
    var h = Math.floor(m / 60), min = m % 60;
    var suffix = h >= 12 ? "pm" : "am";
    var h12 = h % 12 === 0 ? 12 : h % 12;
    return h12 + ":" + String(min).padStart(2, "0") + suffix;
  };

  VV.formatWait = function (mins) {
    if (mins < 1) return "now";
    if (mins < 60) return "in " + mins + " min";
    var h = Math.floor(mins / 60), m = mins % 60;
    return "in " + h + " h" + (m ? " " + m + " min" : "");
  };

  var DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  VV.dayName = function (d) { return DAY_NAMES[d]; };

  /**
   * Next shuttle departures from Kingstown or Bequia, looking up to 2 days ahead.
   * Returns [{operator, time, fixed, wait, dayOffset}] sorted by wait.
   */
  VV.nextDepartures = function (from, count, date) {
    var now = VV.svgNow(date);
    var out = [];
    for (var offset = 0; offset < 3; offset++) {
      var day = (now.day + offset) % 7;
      (window.VV_FERRIES.shuttles || []).forEach(function (s) {
        var list = (s.times[from] || {})[day] || [];
        list.forEach(function (t) {
          var wait = offset * 1440 + VV.toMinutes(t) - now.minutes;
          if (wait >= 0) {
            out.push({ operator: s.operator, time: t.replace("*", ""), fixed: t.indexOf("*") >= 0, wait: wait, dayOffset: offset, day: day });
          }
        });
      });
      if (out.length >= count) break;
    }
    out.sort(function (a, b) { return a.wait - b.wait; });
    return out.slice(0, count);
  };

  VV.whenLabel = function (dep) {
    if (dep.dayOffset === 0) return "Today";
    if (dep.dayOffset === 1) return "Tomorrow";
    return VV.dayName(dep.day);
  };

  /* ---------- GPS helpers ---------- */

  /** Distance in km between two points (haversine formula). */
  VV.distanceKm = function (lat1, lng1, lat2, lng2) {
    var R = 6371, toRad = Math.PI / 180;
    var dLat = (lat2 - lat1) * toRad, dLng = (lng2 - lng1) * toRad;
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * toRad) * Math.cos(lat2 * toRad) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  VV.formatKm = function (km) {
    if (km < 0.05) return "under 50 m";
    if (km < 1) return Math.round(km * 1000 / 10) * 10 + " m";
    if (km < 10) return km.toFixed(1) + " km";
    return Math.round(km).toLocaleString() + " km";
  };

  VV.coordText = function (lat, lng) {
    return Math.abs(lat).toFixed(5) + "° " + (lat >= 0 ? "N" : "S") + ", " +
      Math.abs(lng).toFixed(5) + "° " + (lng >= 0 ? "E" : "W");
  };

  VV.googleDirections = function (lat, lng) {
    return "https://www.google.com/maps/dir/?api=1&destination=" + lat + "," + lng;
  };
  VV.appleDirections = function (lat, lng, name) {
    return "https://maps.apple.com/?daddr=" + lat + "," + lng + "&q=" + encodeURIComponent(name);
  };

  /** Popup / card HTML for a map place, with GPS coordinates and directions links. */
  VV.placeHtml = function (p) {
    var isl = VV.island(p.island);
    return '<div class="popup">' +
      "<h3>" + VV.esc(p.name) + "</h3>" +
      "<p>" + VV.esc(p.note) + (isl ? ' <span class="muted">(' + VV.esc(isl.name) + ")</span>" : "") + "</p>" +
      '<div class="coords">GPS: ' + VV.coordText(p.lat, p.lng) + "</div>" +
      (p.approx ? '<div class="approx-note">Approximate pin</div>' : "") +
      '<div class="popup-actions">' +
      '<a class="primary" target="_blank" rel="noopener" href="' + VV.googleDirections(p.lat, p.lng) + '">Google Maps directions</a>' +
      '<a target="_blank" rel="noopener" href="' + VV.appleDirections(p.lat, p.lng, p.name) + '">Apple Maps</a>' +
      "</div></div>";
  };

  /** Coloured circle markers for Leaflet (no image files needed). */
  VV.marker = function (L, p) {
    var cat = window.VV_CATEGORIES[p.cat] || { color: "#0072C6" };
    return L.circleMarker([p.lat, p.lng], {
      radius: 8, color: "#FFFFFF", weight: 2, fillColor: cat.color, fillOpacity: 1
    }).bindPopup(VV.placeHtml(p));
  };

  VV.tiles = function (L, map) {
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 18,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
  };
})();

// Phone menu toggle, and helpers shared by the new pages.
(function () {
  "use strict";
  var btn = document.querySelector(".menu-btn");
  var nav = document.getElementById("main-nav");
  if (btn && nav) {
    btn.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      btn.setAttribute("aria-expanded", String(open));
      btn.textContent = open ? "Close" : "Menu";
    });
  }

  var VV = window.VV;

  /** tel: link for a number like "+1 784 458 1600". */
  VV.tel = function (phone) { return "tel:" + phone.replace(/[^\d+]/g, ""); };

  /** Fill an island <select> with the islands, north to south. */
  VV.fillIslandSelect = function (select, onlyIds) {
    window.VV_ISLANDS.forEach(function (isl) {
      if (onlyIds && onlyIds.indexOf(isl.id) < 0) return;
      var o = document.createElement("option");
      o.value = isl.id; o.textContent = isl.name;
      select.appendChild(o);
    });
  };

  /** Small storage wrapper: works even when the browser blocks storage. */
  VV.store = {
    get: function (key, fallback) {
      try { var v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch (e) { return fallback; }
    },
    set: function (key, value) {
      try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* storage blocked: keep going */ }
    }
  };
})();

// Island-themed bullet icons (St. Vincent's volcano, Bequia's sailboat, Tobago Cays turtle...).
(function () {
  "use strict";
  var N = "#0B3D5C";
  var sea = '<path d="M3 35c4-2 6-2 9 0s6 2 9 0 6-2 9 0 5 2 7 0" fill="none" stroke="#00A6C0" stroke-width="2.2" stroke-linecap="round"/>';
  function wrap(inner, label) {
    return '<svg class="isl-icon" viewBox="0 0 40 40" role="img" aria-label="' + label + '">' + inner + "</svg>";
  }
  var ICONS = {
    "st-vincent": function (c) { return wrap(
      '<circle cx="17" cy="6" r="3" fill="#C9D6DE"/><circle cx="22" cy="4.5" r="2.6" fill="#C9D6DE"/>' +
      '<path d="M4 31 L15 11 L18 13 L21 11 L33 31 Z" fill="' + c + '" stroke="' + N + '" stroke-width="2.2" stroke-linejoin="round"/>' +
      '<path d="M15 11 L18 15 L21 11" fill="none" stroke="#FF7A59" stroke-width="2" stroke-linejoin="round"/>' + sea, "Volcano"); },
    "young-island": function (c) { return wrap(
      '<path d="M8 31 C9 24 31 24 32 31 Z" fill="' + c + '" stroke="' + N + '" stroke-width="2.2" stroke-linejoin="round"/>' +
      '<path d="M20 26 C20 20 21 15 23 11" fill="none" stroke="' + N + '" stroke-width="2.2" stroke-linecap="round"/>' +
      '<path d="M23 11 C19 8 14 9 12 12 C16 11 19 11 23 11 Z M23 11 C25 7 30 6 33 8 C29 9 26 10 23 11 Z M23 11 C26 11 29 14 29 17 C27 14 25 12 23 11 Z" fill="#00A86B" stroke="' + N + '" stroke-width="1.6" stroke-linejoin="round"/>' + sea, "Small island with a palm"); },
    "bequia": function (c) { return wrap(
      '<path d="M19 4 V26 H7 Z" fill="#FFFFFF" stroke="' + N + '" stroke-width="2.2" stroke-linejoin="round"/>' +
      '<path d="M22 8 V26 H32 Z" fill="' + c + '" stroke="' + N + '" stroke-width="2.2" stroke-linejoin="round"/>' +
      '<path d="M5 28 H35 L31 33 H9 Z" fill="' + N + '"/>' + sea, "Sailboat"); },
    "mustique": function (c) { return wrap(
      '<circle cx="28" cy="10" r="6" fill="' + c + '" stroke="' + N + '" stroke-width="2"/>' +
      '<path d="M14 31 C14 24 15 18 17 13" fill="none" stroke="' + N + '" stroke-width="2.2" stroke-linecap="round"/>' +
      '<path d="M17 13 C13 9 7 10 5 13 C9 12 13 12 17 13 Z M17 13 C19 8 24 7 27 9 C23 10 20 11 17 13 Z M17 13 C20 13 23 16 23 20 C21 16 19 14 17 13 Z" fill="#00A86B" stroke="' + N + '" stroke-width="1.6" stroke-linejoin="round"/>' + sea, "Palm and sun"); },
    "canouan": function (c) { return wrap(
      '<path d="M7 19 C12 11 24 11 29 19 C24 27 12 27 7 19 Z" fill="' + c + '" stroke="' + N + '" stroke-width="2.2" stroke-linejoin="round"/>' +
      '<path d="M29 19 L36 13 V25 Z" fill="' + c + '" stroke="' + N + '" stroke-width="2.2" stroke-linejoin="round"/>' +
      '<circle cx="13" cy="18" r="1.8" fill="' + N + '"/><path d="M18 14 C20 17 20 21 18 24" fill="none" stroke="' + N + '" stroke-width="1.6"/>' + sea, "Reef fish"); },
    "mayreau": function (c) { return wrap(
      '<path d="M20 30 L7 14 C10 7 30 7 33 14 Z" fill="' + c + '" stroke="' + N + '" stroke-width="2.2" stroke-linejoin="round"/>' +
      '<path d="M20 30 L13 11 M20 30 L20 9 M20 30 L27 11" stroke="' + N + '" stroke-width="1.6"/>' +
      '<path d="M16 30 H24 V33 H16 Z" fill="' + c + '" stroke="' + N + '" stroke-width="1.8"/>' + sea, "Seashell"); },
    "tobago-cays": function (c) { return wrap(
      '<ellipse cx="20" cy="20" rx="9" ry="11" fill="' + c + '" stroke="' + N + '" stroke-width="2.2"/>' +
      '<circle cx="20" cy="6.5" r="3.2" fill="' + c + '" stroke="' + N + '" stroke-width="2"/>' +
      '<path d="M11 14 L5 10 M29 14 L35 10 M12 27 L7 31 M28 27 L33 31" stroke="' + N + '" stroke-width="3" stroke-linecap="round"/>' +
      '<path d="M20 11 V29 M14 17 H26 M14 23 H26" stroke="' + N + '" stroke-width="1.4"/>', "Turtle"); },
    "union-island": function (c) { return wrap(
      '<path d="M3 31 L12 15 L17 21 L24 8 L37 31 Z" fill="' + c + '" stroke="' + N + '" stroke-width="2.2" stroke-linejoin="round"/>' +
      '<path d="M21 13 L24 8 L27 13 L24 12 Z" fill="#FFFFFF"/>' + sea, "Mountain peaks"); },
    "palm-island": function (c) { return wrap(
      '<path d="M6 31 C8 25 32 25 34 31 Z" fill="#F7E3A1" stroke="' + N + '" stroke-width="2.2" stroke-linejoin="round"/>' +
      '<path d="M18 27 C18 20 19 15 21 10" fill="none" stroke="' + N + '" stroke-width="2.2" stroke-linecap="round"/>' +
      '<path d="M21 10 C17 6 11 7 9 10 C13 9 17 9 21 10 Z M21 10 C23 5 29 4 32 6 C28 7 24 8 21 10 Z M21 10 C25 10 28 13 28 17 C26 13 24 11 21 10 Z M21 10 C18 11 15 14 14 18 C16 14 18 12 21 10 Z" fill="' + c + '" stroke="' + N + '" stroke-width="1.6" stroke-linejoin="round"/>' + sea, "Palm tree on a beach"); },
    "petit-st-vincent": function (c) { return wrap(
      '<path d="M7 31 C9 25 31 25 33 31 Z" fill="#F7E3A1" stroke="' + N + '" stroke-width="2.2" stroke-linejoin="round"/>' +
      '<path d="M19 27 V6" stroke="' + N + '" stroke-width="2.2" stroke-linecap="round"/>' +
      '<path d="M19 7 H31 L28 11 L31 15 H19 Z" fill="' + c + '" stroke="' + N + '" stroke-width="2" stroke-linejoin="round"/>' + sea, "Flag on a small island"); }
  };
  window.VV.islandIcon = function (isl) {
    var f = ICONS[isl.id];
    return f ? f(isl.color) : "";
  };
})();

// Independence (27 October 1979) and Vincy Mas countdowns, in St. Vincent time.
(function () {
  "use strict";
  function svgTodayUTC() {
    var d = new Date(Date.now() - 4 * 3600 * 1000);
    return { t: Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()), y: d.getUTCFullYear(), m: d.getUTCMonth() + 1 };
  }
  function ordinal(n) {
    var s = ["th", "st", "nd", "rd"], v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  }
  window.VV.independence = function () {
    var now = svgTodayUTC();
    var year = now.y;
    var t = Date.UTC(year, 9, 27);
    if (t < now.t) { year += 1; t = Date.UTC(year, 9, 27); }
    var days = Math.round((t - now.t) / 86400000);
    return { days: days, today: days === 0, year: year, ordinal: ordinal(year - 1979), inOctober: now.m === 10 };
  };
  /** Vincy Mas 2027 runs 25 June to 6 July 2027 ("Road to 50"). */
  window.VV.vincyMas = function () {
    var now = svgTodayUTC();
    var start = Date.UTC(2027, 5, 25), end = Date.UTC(2027, 6, 6);
    return { days: Math.round((start - now.t) / 86400000), on: now.t >= start && now.t <= end, over: now.t > end };
  };
})();
