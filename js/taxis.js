// Taxi directory: search, filter by island, tap to call.
(function () {
  "use strict";
  var VV = window.VV;
  var taxis = window.VV_TAXIS;
  var input = document.getElementById("taxi-q");
  var segButtons = document.querySelectorAll(".seg button");
  var island = new URLSearchParams(location.search).get("island") || "";
  if (island !== "St. Vincent" && island !== "Bequia") { island = ""; }

  function telHref(phone) {
    return "tel:+1" + phone.replace(/\D/g, "");
  }

  function render() {
    var q = input.value.trim().toLowerCase();
    var qDigits = q.replace(/\D/g, "");
    var list = taxis.filter(function (t) {
      if (island && t.island !== island) return false;
      if (!q) return true;
      if (t.name.toLowerCase().indexOf(q) >= 0) return true;
      return qDigits.length >= 3 && t.phones.some(function (p) { return p.replace(/\D/g, "").indexOf(qDigits) >= 0; });
    });
    var sv = list.filter(function (t) { return t.island === "St. Vincent"; }).length;
    var bq = list.length - sv;
    var summary = list.length + (list.length === 1 ? " driver" : " drivers");
    if (q) { summary += ' matching "' + input.value.trim() + '"'; }
    if (!island && list.length) { summary += ": " + sv + " on St. Vincent and " + bq + " on Bequia"; }
    else if (island) { summary += " on " + island; }
    document.getElementById("taxi-count").textContent = summary + ".";
    var ul = document.getElementById("taxi-list");
    if (!list.length) {
      ul.innerHTML = '<li class="empty">No drivers match. Try part of a first or last name.</li>';
      return;
    }
    ul.innerHTML = list.map(function (t) {
      var calls = t.phones.length
        ? t.phones.map(function (p) { return '<a href="' + telHref(p) + '" aria-label="Call ' + VV.esc(t.name) + " on " + p + '">' + p + "</a>"; }).join("")
        : '<span class="muted small">No number listed</span>';
      return '<li><span class="who">' + VV.esc(t.name) + '<span class="where">' + VV.esc(t.island) + "</span></span>" +
        '<span class="calls">' + calls + "</span></li>";
    }).join("");
  }

  segButtons.forEach(function (b) {
    b.setAttribute("aria-pressed", String(b.getAttribute("data-island") === island));
    b.addEventListener("click", function () {
      island = b.getAttribute("data-island");
      segButtons.forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
      render();
    });
  });
  input.addEventListener("input", render);
  render();
})();
