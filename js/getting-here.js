// Getting here: flights table and airline lists.
(function () {
  "use strict";
  var VV = window.VV;
  document.querySelector("#flights tbody").innerHTML = window.VV_FLIGHTS.map(function (f) {
    return "<tr><td>" + VV.esc(f.airline) + "</td><td>" + VV.esc(f.from) + "</td><td>" + VV.esc(f.when) + "</td></tr>";
  }).join("");
  document.getElementById("connections").textContent =
    "From elsewhere, connect through " + window.VV_CONNECT.slice(0, -1).join(", ") + " or " + window.VV_CONNECT.slice(-1) +
    ". Regional airlines include " + window.VV_REGIONAL.join(", ") + ".";
  document.getElementById("local-airlines").textContent =
    "Local flights from Argyle: " + window.VV_LOCAL.join(" and ") + ".";
})();
