// Places to stay: search, island and type filters.
(function () {
  "use strict";
  var VV = window.VV;
  var stays = window.VV_STAYS;
  var TYPE_COLORS = { "Resort": "#7B5CD6", "Hotel": "#0B3D5C", "Apartment": "#00A6C0", "Guest house": "#00A86B", "Inn": "#F29F05", "Villa": "#FF5C8A" };
  var q = document.getElementById("stay-q");
  var islandSel = document.getElementById("stay-island");
  var typeBox = document.getElementById("stay-types");
  var type = "";

  var used = stays.map(function (s) { return s.island; });
  VV.fillIslandSelect(islandSel, used);
  var fromUrl = new URLSearchParams(location.search).get("island");
  if (fromUrl && used.indexOf(fromUrl) >= 0) { islandSel.value = fromUrl; }

  typeBox.innerHTML = ['<button type="button" data-type="" aria-pressed="true">All</button>'].concat(
    window.VV_STAY_TYPES.map(function (t) { return '<button type="button" data-type="' + t + '" aria-pressed="false">' + t + "s" + "</button>"; })
  ).join("");
  typeBox.addEventListener("click", function (e) {
    var b = e.target.closest("button");
    if (!b) return;
    type = b.getAttribute("data-type");
    typeBox.querySelectorAll("button").forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
    render();
  });

  function render() {
    var text = q.value.trim().toLowerCase();
    var isl = islandSel.value;
    var list = stays.filter(function (s) {
      if (isl && s.island !== isl) return false;
      if (type && s.type !== type) return false;
      if (!text) return true;
      return (s.name + " " + s.area + " " + VV.island(s.island).name).toLowerCase().indexOf(text) >= 0;
    });
    document.getElementById("stay-count").textContent = list.length + (list.length === 1 ? " place" : " places");
    var ul = document.getElementById("stay-list");
    if (!list.length) {
      ul.innerHTML = '<li class="empty">Nothing matches. Try another island or type.</li>';
      return;
    }
    ul.innerHTML = list.map(function (s) {
      var island = VV.island(s.island);
      var calls = s.phones.map(function (p) {
        return '<a href="' + VV.tel(p) + '" aria-label="Call ' + VV.esc(s.name) + '">' + VV.esc(p.replace(/^\+1 /, "")) + "</a>";
      });
      if (s.web) { calls.push('<a class="web" href="' + VV.esc(s.web) + '" target="_blank" rel="noopener">Website</a>'); }
      if (!calls.length) { calls.push('<span class="muted small">No contact details listed</span>'); }
      return '<li class="stay" style="--accent:' + TYPE_COLORS[s.type] + '">' +
        '<span class="type-tag">' + VV.esc(s.type) + "</span>" +
        "<h3>" + VV.esc(s.name) + "</h3>" +
        '<span class="where">' + VV.esc(s.area ? s.area + ", " : "") + '<a href="island.html?id=' + s.island + '">' + VV.esc(island.name) + "</a></span>" +
        '<div class="calls">' + calls.join("") + "</div></li>";
    }).join("");
  }

  q.addEventListener("input", render);
  islandSel.addEventListener("change", render);
  render();
})();
