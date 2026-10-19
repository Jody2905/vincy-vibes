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
