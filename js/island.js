// Island detail page: island.html?id=bequia
(function () {
  "use strict";
  var VV = window.VV;
  var islands = window.VV_ISLANDS;
  var id = new URLSearchParams(location.search).get("id") || islands[0].id;
  var index = islands.findIndex(function (i) { return i.id === id; });
  if (index < 0) { index = 0; }
  var isl = islands[index];

  document.title = isl.name + " · Vincy Vibes";
  document.getElementById("isl-name").textContent = isl.name;
  document.getElementById("isl-tag").textContent = isl.tagline;
  document.getElementById("isl-intro").textContent = isl.intro;
  document.getElementById("isl-there").textContent = isl.gettingThere;
  document.getElementById("isl-around").textContent = isl.gettingAround;
  if (isl.taxis) {
    document.getElementById("isl-taxi-link").innerHTML =
      '<a href="taxis.html?island=' + encodeURIComponent(isl.name) + '">Approved taxis on ' + VV.esc(isl.name) + "</a>";
  }
  if (isl.beryl) {
    document.getElementById("isl-beryl").innerHTML =
      '<div class="notice"><p><strong>Rebuilding after Hurricane Beryl (July 2024).</strong> Check that places you plan to visit are open before you go.</p></div>';
  }
  document.getElementById("isl-facts").innerHTML = isl.facts.map(function (f) {
    return "<dt>" + VV.esc(f[0]) + "</dt><dd>" + VV.esc(f[1]) + "</dd>";
  }).join("");
  document.getElementById("isl-highlights").innerHTML = isl.highlights.map(function (h) {
    return "<li><strong>" + VV.esc(h[0]) + "</strong>" + VV.esc(h[1]) + "</li>";
  }).join("");

  var prev = islands[index - 1], next = islands[index + 1];
  document.getElementById("isl-nav").innerHTML =
    (prev ? '<a href="island.html?id=' + prev.id + '">North: ' + VV.esc(prev.name) + "</a>" : "<span></span>") +
    (next ? '<a href="island.html?id=' + next.id + '">South: ' + VV.esc(next.name) + "</a>" : "<span></span>");

  // Mini map with this island's pins
  if (window.L) {
    var map = L.map("mini-map", { scrollWheelZoom: false }).setView([isl.lat, isl.lng], isl.zoom);
    VV.tiles(L, map);
    var pins = window.VV_PLACES.filter(function (p) { return p.island === isl.id; });
    pins.forEach(function (p) { VV.marker(L, p).addTo(map); });
    if (pins.length > 1) {
      map.fitBounds(L.latLngBounds(pins.map(function (p) { return [p.lat, p.lng]; })).pad(0.3), { maxZoom: isl.zoom });
    }
  }
})();
