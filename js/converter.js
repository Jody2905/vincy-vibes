// EC$ <-> US$ converter. The EC dollar is pegged at EC$2.70 = US$1 (Eastern Caribbean Central Bank, since 7 July 1976).
(function () {
  "use strict";
  var RATE = 2.7;
  var ec = document.getElementById("cv-ec"), us = document.getElementById("cv-us");
  if (!ec || !us) return;

  function parse(v) {
    var n = parseFloat(String(v).replace(/[^0-9.]/g, ""));
    return isFinite(n) && n >= 0 ? n : null;
  }
  function fmt(n) {
    return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  function fromEc() { var n = parse(ec.value); us.value = n == null ? "" : fmt(n / RATE); }
  function fromUs() { var n = parse(us.value); ec.value = n == null ? "" : fmt(n * RATE); }

  ec.addEventListener("input", fromEc);
  us.addEventListener("input", fromUs);
  document.querySelector(".cv-quick").addEventListener("click", function (e) {
    var b = e.target.closest("button");
    if (!b) return;
    ec.value = fmt(Number(b.getAttribute("data-ec"))); fromEc();
  });
  document.getElementById("converter").addEventListener("submit", function (e) { e.preventDefault(); });
  fromEc();
})();
