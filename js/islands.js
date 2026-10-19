// Islands page: the full list along the ferry route.
(function () {
  "use strict";
  var VV = window.VV;
  document.getElementById("island-list").innerHTML = window.VV_ISLANDS.map(function (isl) {
    return '<li><span class="dot" aria-hidden="true"></span>' +
      '<h2><a href="island.html?id=' + isl.id + '">' + VV.esc(isl.name) + "</a>" +
      (isl.beryl ? ' <span class="pill">Rebuilding after Beryl</span>' : "") + "</h2>" +
      '<p class="tag">' + VV.esc(isl.tagline) + "</p>" +
      "<p>" + VV.esc(isl.intro) + "</p>" +
      '<a href="island.html?id=' + isl.id + '">Explore ' + VV.esc(isl.name) + "</a></li>";
  }).join("");
})();
