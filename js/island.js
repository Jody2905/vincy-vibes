// Island detail page: island.html?id=bequia
(function () {
  "use strict";
  var VV = window.VV;
  var islands = window.VV_ISLANDS;
  var id = new URLSearchParams(location.search).get("id") || islands[0].id;
  var index = islands.findIndex(function (i) { return i.id === id; });
  if (index < 0) { index = 0; }
  var isl = islands[index];

  // Page colour = island colour
  document.getElementById("island-band").style.setProperty("--accent", isl.color);
  document.body.style.setProperty("--accent", isl.color);

  document.title = isl.name + " · Vincy Vibes";
  document.getElementById("page-title").textContent = isl.name;
  document.getElementById("page-lede").textContent = isl.tagline;
  document.getElementById("isl-intro").textContent = isl.intro;
  document.getElementById("isl-there").textContent = isl.gettingThere;
  document.getElementById("isl-around").textContent = isl.gettingAround;

  var say = { "bequia": "Say it: BECK-way" }[isl.id];
  if (say) {
    var sayEl = document.getElementById("say-it");
    sayEl.textContent = say;
    sayEl.hidden = false;
  }

  var links = [];
  if (isl.taxis) {
    links.push('<a href="taxis.html?island=' + encodeURIComponent(isl.name) + '">Approved taxis on ' + VV.esc(isl.name) + "</a>");
  }
  links.push('<a href="stay.html?island=' + isl.id + '">Places to stay</a>');
  links.push('<a href="things-to-do.html?island=' + isl.id + '">Things to do</a>');
  document.getElementById("isl-links").innerHTML = links.join(" · ");

  if (isl.beryl) {
    document.getElementById("isl-beryl").innerHTML =
      '<div class="notice"><p><strong>Rebuilding after Hurricane Beryl (July 2024).</strong> Check that places you plan to visit are open before you go.</p></div><br>';
  }
  document.getElementById("isl-facts").innerHTML = isl.facts.map(function (f) {
    return "<div><dt>" + VV.esc(f[0]) + "</dt><dd>" + VV.esc(f[1]) + "</dd></div>";
  }).join("");
  document.getElementById("isl-highlights").innerHTML = isl.highlights.map(function (h) {
    return "<li><strong>" + VV.esc(h[0]) + "</strong>" + VV.esc(h[1]) + "</li>";
  }).join("");

  var prev = islands[index - 1], next = islands[index + 1];
  document.getElementById("isl-nav").innerHTML =
    (prev ? '<a href="island.html?id=' + prev.id + '">North to ' + VV.esc(prev.name) + "</a>" : "<span></span>") +
    (next ? '<a href="island.html?id=' + next.id + '">South to ' + VV.esc(next.name) + "</a>" : "<span></span>");

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
