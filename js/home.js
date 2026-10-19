// Home page: the island chain and the next-ferry countdown.
(function () {
  "use strict";
  var VV = window.VV;

  // Island chain, north to south
  var chain = document.getElementById("chain");
  chain.innerHTML = window.VV_ISLANDS.map(function (isl, i) {
    return '<li class="' + (i === 0 ? "main" : "") + '"><span class="dot" aria-hidden="true"></span>' +
      '<a href="island.html?id=' + isl.id + '"><span class="stop-name">' + VV.esc(isl.name) + "</span>" +
      '<span class="stop-tag">' + VV.esc(isl.tagline) + "</span></a></li>";
  }).join("");

  // Next ferry
  var from = "Kingstown";
  var buttons = document.querySelectorAll(".dir-switch button");

  function render() {
    var deps = VV.nextDepartures(from, 2);
    document.getElementById("nf-from").textContent = from;
    document.getElementById("nf-to").textContent = from === "Kingstown" ? "Bequia" : "Kingstown";
    var when = document.getElementById("nf-when");
    var detail = document.getElementById("nf-detail");
    var after = document.getElementById("nf-after");
    if (!deps.length) {
      when.textContent = "No sailings found";
      detail.textContent = "Check the full timetable.";
      after.textContent = "";
      return;
    }
    var d = deps[0];
    when.textContent = VV.formatTime(d.time) + (d.fixed ? "*" : "");
    detail.textContent = VV.whenLabel(d) + ", " + d.operator + ", " + VV.formatWait(d.wait) + ".";
    after.textContent = deps[1] ? "After that: " + VV.formatTime(deps[1].time) + " (" + deps[1].operator + ", " + VV.whenLabel(deps[1]).toLowerCase() + ")" : "";
  }

  buttons.forEach(function (b) {
    b.addEventListener("click", function () {
      from = b.getAttribute("data-from");
      buttons.forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
      render();
    });
  });
  render();
  setInterval(render, 30000);
})();
