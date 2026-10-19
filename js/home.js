// Home page: the island chain, next-ferry boat and "Did you know?" facts.
(function () {
  "use strict";
  var VV = window.VV;

  // Island chain, north to south, each dot in its island colour
  document.getElementById("chain").innerHTML = window.VV_ISLANDS.map(function (isl, i) {
    return '<li class="' + (i === 0 ? "main" : "") + '" style="--accent:' + isl.color + '"><span class="dot" aria-hidden="true"></span>' +
      '<a href="island.html?id=' + isl.id + '"><span class="stop-name">' + VV.esc(isl.name) + "</span>" +
      '<span class="stop-tag">' + VV.esc(isl.tagline) + "</span></a></li>";
  }).join("");

  // Next ferry, with a boat that sails across as departure gets closer
  var from = "Kingstown";
  var buttons = document.querySelectorAll(".dir-switch button");
  var WINDOW = 120; // minutes: the boat starts moving 2 hours before departure

  function render() {
    var to = from === "Kingstown" ? "Bequia" : "Kingstown";
    var deps = VV.nextDepartures(from, 2);
    document.getElementById("nf-from").textContent = from;
    document.getElementById("nf-to").textContent = to;
    document.getElementById("nf-port-from").textContent = from;
    document.getElementById("nf-port-to").textContent = to;
    var when = document.getElementById("nf-when");
    var detail = document.getElementById("nf-detail");
    var after = document.getElementById("nf-after");
    var boat = document.getElementById("nf-boat");
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
    var progress = Math.max(0, Math.min(1, 1 - d.wait / WINDOW));
    boat.style.left = "calc(40px + (100% - 80px) * " + progress.toFixed(3) + ")";
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

  // Did you know?
  var FACTS = [
    "St. Vincent and the Grenadines is 32 islands and cays, stretched across about 70 miles of sea.",
    "The Botanic Gardens in Kingstown were started in 1765, making them one of the oldest in the Western Hemisphere.",
    "Jack Sparrow was marooned on Petit Tabac in the Tobago Cays in the first Pirates of the Caribbean film.",
    "Mount Taboi on Union Island is the highest point in the Grenadines, at 999 ft.",
    "Fort Charlotte's cannons point inland, not out to sea.",
    "Divers call SVG the \"Critter Capital of the Caribbean\".",
    "The national bird, the St. Vincent parrot (Amazona guildingii), lives nowhere else on Earth.",
    "Bequia is pronounced \"BECK-way\".",
    "Argyle International, opened in 2017, is one of the Caribbean's solar-powered airports.",
    "Basil's Bar on Mustique made CNN's list of the world's 50 best beach bars.",
    "Nine Mornings is a uniquely Vincentian Christmas tradition of pre-dawn street parties from 16 to 24 December.",
    "La Soufrière, the volcano on St. Vincent, rises to 4,049 ft."
  ];
  var i = Math.floor(Math.random() * FACTS.length);
  var factEl = document.getElementById("fact");
  function showFact() { factEl.textContent = FACTS[i]; }
  document.getElementById("next-fact").addEventListener("click", function () {
    i = (i + 1) % FACTS.length;
    showFact();
  });
  showFact();
})();
