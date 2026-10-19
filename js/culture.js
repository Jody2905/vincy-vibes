// Culture page: Independence countdown.
(function () {
  "use strict";
  var el = document.getElementById("indep-count");
  if (!el) return;
  var c = window.VV.independence();
  el.innerHTML = c.today
    ? '<span class="big-num">Today!</span><span class="lbl">Happy ' + c.ordinal + " Independence, SVG!</span>"
    : '<span class="big-num">' + c.days + '</span><span class="lbl">' + (c.days === 1 ? "day" : "days") + " to the " + c.ordinal + " anniversary</span>";
})();

// Vincy Mas 2027 countdown
(function () {
  "use strict";
  var el = document.getElementById("mas-count");
  if (!el) return;
  var m = window.VV.vincyMas();
  el.textContent = m.on ? "It's Mas right now!" : m.over ? "" : m.days + " days to go.";
})();
