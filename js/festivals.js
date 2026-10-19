// Festivals: countdown to the next fixed-date event, month filter and list.
(function () {
  "use strict";
  var VV = window.VV;
  var fests = window.VV_FESTIVALS;
  var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var COLORS = ["#FF5C8A", "#00A6C0", "#00A86B", "#F29F05", "#7B5CD6"];

  // Today in St. Vincent (UTC-4)
  var svgToday = new Date(Date.now() - 4 * 3600 * 1000);
  var todayUTC = Date.UTC(svgToday.getUTCFullYear(), svgToday.getUTCMonth(), svgToday.getUTCDate());
  var thisMonth = svgToday.getUTCMonth() + 1;

  // Events with known dates (month is 1-12). Vincy Mas uses the published 2027 date.
  var FIXED = [
    { name: "National Heroes Day", m: 3, d: 14 },
    { name: "Vincy Mas 2027 begins", m: 6, d: 25, year: 2027 },
    { name: "Independence Day", m: 10, d: 27 },
    { name: "Nine Mornings begins", m: 12, d: 16 }
  ];
  function nextDate(ev) {
    var y = svgToday.getUTCFullYear();
    var t = Date.UTC(ev.year || y, ev.m - 1, ev.d);
    if (t < todayUTC) {
      if (ev.year) return null;
      t = Date.UTC(y + 1, ev.m - 1, ev.d);
    }
    return t;
  }
  var upcoming = FIXED.map(function (ev) { return { ev: ev, t: nextDate(ev) }; })
    .filter(function (x) { return x.t !== null; })
    .sort(function (a, b) { return a.t - b.t; })[0];
  if (upcoming) {
    var days = Math.round((upcoming.t - todayUTC) / 86400000);
    var date = new Date(upcoming.t);
    document.getElementById("cu-name").textContent = upcoming.ev.name;
    document.getElementById("cu-when").textContent = date.getUTCDate() + " " + MONTHS[date.getUTCMonth()] + " " + date.getUTCFullYear();
    document.getElementById("cu-days").innerHTML = days === 0 ? "Today!" : days + "<small>" + (days === 1 ? "day to go" : "days to go") + "</small>";
  }

  // Month strip
  var month = 0; // 0 = all
  var monthsEl = document.getElementById("months");
  var counts = {};
  fests.forEach(function (f) { counts[f.month] = (counts[f.month] || 0) + 1; });
  monthsEl.innerHTML = '<li><button type="button" data-m="0" aria-pressed="true">All<span class="n">' + fests.length + "</span></button></li>" +
    MONTHS.map(function (m, i) {
      var n = counts[i + 1] || 0;
      return '<li><button type="button" data-m="' + (i + 1) + '" aria-pressed="false" class="' + (n ? "has" : "") + (i + 1 === thisMonth ? " now" : "") + '">' +
        m + '<span class="n">' + (n ? n + (n === 1 ? " event" : " events") : "–") + "</span></button></li>";
    }).join("");
  monthsEl.style.gridTemplateColumns = "";
  monthsEl.addEventListener("click", function (e) {
    var b = e.target.closest("button");
    if (!b) return;
    month = Number(b.getAttribute("data-m"));
    monthsEl.querySelectorAll("button").forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
    render();
  });

  function render() {
    var list = fests.filter(function (f) { return !month || f.month === month || f.month === 0; })
      .sort(function (a, b) { return (a.month || 13) - (b.month || 13); });
    document.getElementById("fest-count").textContent = month
      ? list.length + " in " + MONTHS[month - 1] + (list.some(function (f) { return f.month === 0; }) ? " (including the monthly full-moon party)" : "")
      : "All year, January to December";
    document.getElementById("fest-list").innerHTML = list.map(function (f, i) {
      var isl = VV.island(f.island);
      return '<li class="fest' + (f.big ? " big" : "") + '" style="--accent:' + COLORS[i % COLORS.length] + '">' +
        "<h3>" + VV.esc(f.name) + "</h3>" +
        '<div class="when">' + VV.esc(f.when) + ' · <a href="island.html?id=' + f.island + '">' + VV.esc(isl.name) + "</a></div>" +
        "<p>" + VV.esc(f.what) + "</p></li>";
    }).join("");
  }
  render();
})();
