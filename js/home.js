// Home page: Vincy Mas countdown, Independence ribbon, next ferry and "Did you know?".
(function () {
  "use strict";
  var VV = window.VV;

  // ---- Vincy Mas 2027 countdown (starts 25 June 2027, 00:00 St. Vincent time = 04:00 UTC) ----
  var MAS_START = Date.UTC(2027, 5, 25, 4, 0, 0);
  var MAS_END = Date.UTC(2027, 6, 7, 4, 0, 0);
  var ids = ["d-days", "d-hours", "d-mins", "d-secs"];
  var lastVals = [];
  function pad(n) { return n < 10 ? "0" + n : String(n); }
  function tickMas() {
    var now = Date.now();
    var why = document.getElementById("mas-why");
    if (now >= MAS_START && now < MAS_END) {
      document.getElementById("mas-digits").innerHTML = '<div class="digit"><span class="num">It\'s Mas!</span><span class="unit">Happening now in Kingstown</span></div>';
      return false;
    }
    if (now >= MAS_END) {
      document.getElementById("mas-digits").hidden = true;
      why.textContent = "Vincy Mas 2027 has wrapped. Watch the festival calendar for next year's dates.";
      return false;
    }
    var s = Math.floor((MAS_START - now) / 1000);
    var vals = [Math.floor(s / 86400), Math.floor(s % 86400 / 3600), Math.floor(s % 3600 / 60), s % 60];
    vals.forEach(function (v, i) {
      var elNum = document.getElementById(ids[i]);
      var text = i === 0 ? String(v) : pad(v);
      if (lastVals[i] !== text) {
        elNum.textContent = text;
        var box = elNum.parentNode;
        box.classList.remove("flip"); void box.offsetWidth; box.classList.add("flip");
      }
      lastVals[i] = text;
    });
    document.getElementById("mas-digits").setAttribute("aria-label", vals[0] + " days, " + vals[1] + " hours and " + vals[2] + " minutes to Vincy Mas 2027");
    return true;
  }
  if (tickMas()) {
    var timer = setInterval(function () { if (!tickMas()) clearInterval(timer); }, 1000);
  }

  // ---- Independence ribbon (October only) ----
  var ind = VV.independence();
  if (ind.inOctober) {
    var rib = document.getElementById("indep-ribbon");
    rib.hidden = false;
    document.getElementById("indep-text").textContent = "Happy " + ind.ordinal + " Independence, St. Vincent and the Grenadines";
    document.getElementById("indep-days").textContent = ind.today ? "Today!" : ind.days + (ind.days === 1 ? " day to go" : " days to go");
  }

  // ---- Next ferry, with a boat that sails across as departure gets closer ----
  var from = "Kingstown";
  var buttons = document.querySelectorAll(".dir-switch button");
  var WINDOW = 120;
  function renderFerry() {
    var to = from === "Kingstown" ? "Bequia" : "Kingstown";
    var deps = VV.nextDepartures(from, 2);
    document.getElementById("nf-from").textContent = from;
    document.getElementById("nf-to").textContent = to;
    document.getElementById("nf-port-from").textContent = from;
    document.getElementById("nf-port-to").textContent = to;
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
    var progress = Math.max(0, Math.min(1, 1 - d.wait / WINDOW));
    document.getElementById("nf-boat").style.left = "calc(40px + (100% - 80px) * " + progress.toFixed(3) + ")";
  }
  buttons.forEach(function (b) {
    b.addEventListener("click", function () {
      from = b.getAttribute("data-from");
      buttons.forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
      renderFerry();
    });
  });
  renderFerry();
  setInterval(renderFerry, 30000);

  // ---- Did you know? ----
  var FACTS = [
    "St. Vincent and the Grenadines is 32 islands and cays, stretched across about 70 miles of sea.",
    "The Botanic Gardens in Kingstown were started in 1765, among the oldest in the Western Hemisphere.",
    "Jack Sparrow was marooned on Petit Tabac in the Tobago Cays in the first Pirates of the Caribbean film.",
    "Mount Taboi on Union Island is the highest point in the Grenadines, at 999 ft.",
    "Fort Charlotte's cannons point inland, not out to sea.",
    "Divers call SVG the \"Critter Capital of the Caribbean\".",
    "The St. Vincent parrot (Amazona guildingii) lives nowhere else on Earth.",
    "Bequia is pronounced \"BECK-way\".",
    "Vincy Mas moved from the days before Lent to June and July in 1977. 2027 is its Road to 50.",
    "Nine Mornings, the nine pre-dawn mornings before Christmas, is a uniquely Vincentian tradition.",
    "The national dish is roasted breadfruit and fried jackfish.",
    "La Soufrière, the volcano on St. Vincent, rises to 4,049 ft."
  ];
  var i = Math.floor(Math.random() * FACTS.length);
  var factEl = document.getElementById("fact");
  function showFact() { factEl.textContent = FACTS[i]; }
  document.getElementById("next-fact").addEventListener("click", function () { i = (i + 1) % FACTS.length; showFact(); });
  showFact();
})();
