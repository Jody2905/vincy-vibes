// Islands page: one card per island, in its island colour.
(function () {
  "use strict";
  var VV = window.VV;
  document.getElementById("island-list").innerHTML = window.VV_ISLANDS.map(function (isl) {
    return '<li style="--accent:' + isl.color + '">' +
      '<h2><a href="island.html?id=' + isl.id + '">' + VV.esc(isl.name) + "</a>" +
      (isl.beryl ? ' <span class="pill">Rebuilding after Beryl</span>' : "") + "</h2>" +
      '<p class="tag">' + VV.esc(isl.tagline) + "</p>" +
      "<p>" + VV.esc(isl.intro) + "</p>" +
      '<a class="go" href="island.html?id=' + isl.id + '">Explore ' + VV.esc(isl.name) + "</a></li>";
  }).join("");
})();
