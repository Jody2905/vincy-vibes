// Ferry page: live next departures and full timetables.
(function () {
  "use strict";
  var VV = window.VV;
  var F = window.VV_FERRIES;
  var from = "Kingstown";

  function renderNext() {
    var deps = VV.nextDepartures(from, 6);
    var to = from === "Kingstown" ? "Bequia" : "Kingstown";
    document.getElementById("departures").innerHTML = deps.length ? deps.map(function (d) {
      return '<li><span class="t">' + VV.formatTime(d.time) + (d.fixed ? "*" : "") + "</span>" +
        "<span>" + VV.esc(d.operator) + ' <span class="muted">to ' + to + ", " + VV.whenLabel(d).toLowerCase() + "</span></span>" +
        '<span class="in">' + VV.formatWait(d.wait) + "</span></li>";
    }).join("") : '<li class="empty">No sailings found in the next two days.</li>';
  }

  document.querySelectorAll("[data-from]").forEach(function (b, _, all) {
    b.addEventListener("click", function () {
      from = b.getAttribute("data-from");
      all.forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
      renderNext();
    });
  });

  // Group days with identical times, e.g. "Monday to Friday"
  var ORDER = [1, 2, 3, 4, 5, 6, 0];
  function groupDays(byDay) {
    var groups = [];
    ORDER.forEach(function (d) {
      if (!byDay[d]) return;
      var key = byDay[d].join(",");
      var last = groups[groups.length - 1];
      if (last && last.key === key && ORDER.indexOf(d) === ORDER.indexOf(last.days[last.days.length - 1]) + 1) {
        last.days.push(d);
      } else {
        groups.push({ key: key, days: [d], times: byDay[d] });
      }
    });
    return groups.map(function (g) {
      var label = g.days.length > 2 ? VV.dayName(g.days[0]) + " to " + VV.dayName(g.days[g.days.length - 1])
        : g.days.map(VV.dayName).join(" and ");
      return { label: label, times: g.times };
    });
  }

  function timesText(list) {
    return list.map(function (t) { return VV.formatTime(t) + (t.indexOf("*") >= 0 ? "*" : ""); }).join("  ");
  }

  document.getElementById("shuttle-tables").innerHTML = F.shuttles.map(function (s) {
    var rows = "";
    ["Kingstown", "Bequia"].forEach(function (origin) {
      groupDays(s.times[origin]).forEach(function (g, i) {
        rows += "<tr>" + (i === 0 ? '<th scope="rowgroup" rowspan="' + groupDays(s.times[origin]).length + '">From ' + origin + "</th>" : "") +
          "<td>" + g.label + '</td><td class="times">' + timesText(g.times) + "</td></tr>";
      });
    });
    return "<h3>" + VV.esc(s.operator) + "</h3>" + (s.note ? '<p class="muted small">' + VV.esc(s.note) + "</p>" : "") +
      '<div class="table-scroll"><table class="timetable"><thead><tr><th scope="col">Leaving</th><th scope="col">Days</th><th scope="col">Departures</th></tr></thead><tbody>' +
      rows + "</tbody></table></div>";
  }).join("");

  document.getElementById("south-tables").innerHTML = F.southern.map(function (op) {
    var sailings = op.sailings.slice().sort(function (a, b) {
      return ORDER.indexOf(a.day) - ORDER.indexOf(b.day) || VV.toMinutes(a.depart) - VV.toMinutes(b.depart);
    });
    return "<h3>" + VV.esc(op.operator) + "</h3>" +
      '<div class="table-scroll"><table class="timetable"><thead><tr><th scope="col">Day</th><th scope="col">Departs</th><th scope="col">Route</th></tr></thead><tbody>' +
      sailings.map(function (s) {
        return "<tr><td>" + VV.dayName(s.day) + "</td><td>" + VV.formatTime(s.depart) + " from " + VV.esc(s.from) + "</td>" +
          '<td class="route-stops">' + s.stops.map(VV.esc).join(" → ") + (s.note ? " (" + VV.esc(s.note) + ")" : "") + "</td></tr>";
      }).join("") + "</tbody></table></div>";
  }).join("");

  renderNext();
  setInterval(renderNext, 30000);
})();
