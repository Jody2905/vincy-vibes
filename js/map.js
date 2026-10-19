// Map page: all places, category filters, GPS "near me" and directions.
(function () {
  "use strict";
  var VV = window.VV;
  var places = window.VV_PLACES;
  var cats = window.VV_CATEGORIES;
  var shown = {};
  Object.keys(cats).forEach(function (k) { shown[k] = true; });
  var me = null; // {lat, lng} once located

  var map = L.map("map", { zoomControl: true });
  VV.tiles(L, map);
  var allBounds = L.latLngBounds(places.map(function (p) { return [p.lat, p.lng]; }));
  map.fitBounds(allBounds.pad(0.05));

  places.forEach(function (p) { p.marker = VV.marker(L, p); });

  // Category chips
  var chips = document.getElementById("chips");
  chips.innerHTML = Object.keys(cats).map(function (k) {
    return '<button type="button" class="chip" data-cat="' + k + '" aria-pressed="true">' +
      '<span class="swatch" style="background:' + cats[k].color + '"></span>' + VV.esc(cats[k].label) + "</button>";
  }).join("");
  chips.addEventListener("click", function (e) {
    var b = e.target.closest(".chip");
    if (!b) return;
    var k = b.getAttribute("data-cat");
    shown[k] = !shown[k];
    b.setAttribute("aria-pressed", String(shown[k]));
    refresh();
  });

  function refresh() {
    var visible = places.filter(function (p) { return shown[p.cat]; });
    places.forEach(function (p) {
      if (shown[p.cat]) { p.marker.addTo(map); } else { map.removeLayer(p.marker); }
    });
    if (me) {
      visible.forEach(function (p) { p.km = VV.distanceKm(me.lat, me.lng, p.lat, p.lng); });
      visible.sort(function (a, b) { return a.km - b.km; });
    }
    var list = document.getElementById("place-list");
    if (!visible.length) {
      list.innerHTML = '<li class="empty">Nothing selected. Turn on a category above.</li>';
      return;
    }
    list.innerHTML = visible.map(function (p) {
      var isl = VV.island(p.island);
      return '<li data-name="' + VV.esc(p.name) + '">' +
        (me ? '<span class="dist">' + VV.formatKm(p.km) + "</span>" : "") +
        '<button type="button" class="linklike">' + VV.esc(p.name) + "</button>" +
        '<div class="meta">' + VV.esc(cats[p.cat].one) + (isl ? ", " + VV.esc(isl.name) : "") + "</div></li>";
    }).join("");
  }

  document.getElementById("place-list").addEventListener("click", function (e) {
    var li = e.target.closest("li[data-name]");
    if (!li) return;
    var p = places.find(function (x) { return x.name === li.getAttribute("data-name"); });
    map.flyTo([p.lat, p.lng], 15, { duration: 0.8 });
    p.marker.openPopup();
    if (window.matchMedia("(max-width: 900px)").matches) {
      document.getElementById("map").scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });

  // GPS: near me
  var btn = document.getElementById("near-me");
  var status = document.getElementById("locate-status");
  var meMarker = null;
  btn.addEventListener("click", function () {
    if (!("geolocation" in navigator)) {
      status.textContent = "Your browser can't share its location. Tap a place in the list instead.";
      return;
    }
    btn.disabled = true;
    status.textContent = "Finding you…";
    navigator.geolocation.getCurrentPosition(function (pos) {
      btn.disabled = false;
      me = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      if (meMarker) { map.removeLayer(meMarker); }
      meMarker = L.marker([me.lat, me.lng], {
        icon: L.divIcon({ className: "you-are-here", iconSize: [18, 18] }),
        title: "You are here"
      }).addTo(map).bindPopup("<strong>You are here</strong><br><span class=\"coords\">" + VV.coordText(me.lat, me.lng) + "</span>");
      refresh();
      var nearest = places.filter(function (p) { return shown[p.cat]; })
        .sort(function (a, b) { return a.km - b.km; })[0];
      if (nearest && nearest.km > 150) {
        status.textContent = "You're about " + VV.formatKm(nearest.km) + " from SVG. The list is sorted by distance for when you arrive.";
        map.fitBounds(allBounds.pad(0.05));
      } else if (nearest) {
        status.textContent = "Closest: " + nearest.name + ", " + VV.formatKm(nearest.km) + " away.";
        map.fitBounds(L.latLngBounds([[me.lat, me.lng], [nearest.lat, nearest.lng]]).pad(0.4), { maxZoom: 15 });
      }
    }, function (err) {
      btn.disabled = false;
      status.textContent = err.code === 1
        ? "Location permission was blocked. Allow location for this site in your browser settings and try again."
        : "Couldn't get your location. Check that location is on and try again.";
    }, { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 });
  });

  refresh();
})();
