// Things to do: the 32 must-dos as a tick-off bucket list, plus nature and dive picks.
(function () {
  "use strict";
  var VV = window.VV;
  var items = window.VV_MUSTDO;
  var cats = window.VV_TODO_CATS;
  var KEY = "vv-bucket-list";
  var done = VV.store.get(KEY, []);   // list of titles ticked off
  var cat = "";
  var islandSel = document.getElementById("todo-island");
  var catBox = document.getElementById("todo-cats");

  var used = items.map(function (i) { return i.island; }).filter(Boolean);
  VV.fillIslandSelect(islandSel, used);
  var o = document.createElement("option"); o.value = "-"; o.textContent = "Location not stated";
  islandSel.appendChild(o);
  var fromUrl = new URLSearchParams(location.search).get("island");
  if (fromUrl && used.indexOf(fromUrl) >= 0) { islandSel.value = fromUrl; }

  catBox.innerHTML = ['<button type="button" data-cat="" aria-pressed="true">All</button>'].concat(
    Object.keys(cats).map(function (k) { return '<button type="button" data-cat="' + k + '" aria-pressed="false">' + cats[k].label + "</button>"; })
  ).join("");
  catBox.addEventListener("click", function (e) {
    var b = e.target.closest("button");
    if (!b) return;
    cat = b.getAttribute("data-cat");
    catBox.querySelectorAll("button").forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
    render();
  });
  islandSel.addEventListener("change", render);

  var CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12l5 5L20 6"/></svg>';

  function updateProgress() {
    var n = items.filter(function (i) { return done.indexOf(i.title) >= 0; }).length;
    document.getElementById("done-count").textContent = n + " of " + items.length + (n === items.length ? ". Legend!" : "");
    document.getElementById("done-bar").style.width = (n / items.length * 100) + "%";
  }

  function render() {
    var isl = islandSel.value;
    var list = items.filter(function (i) {
      if (cat && i.cat !== cat) return false;
      if (isl === "-") return !i.island;
      if (isl && i.island !== isl) return false;
      return true;
    });
    var ul = document.getElementById("mustdo");
    ul.innerHTML = list.length ? list.map(function (i) {
      var isDone = done.indexOf(i.title) >= 0;
      var island = i.island ? VV.island(i.island) : null;
      return '<li class="postcard' + (isDone ? " done" : "") + '" style="--accent:' + cats[i.cat].color + '">' +
        '<button type="button" class="tick" data-title="' + VV.esc(i.title) + '" aria-pressed="' + isDone + '" aria-label="Done: ' + VV.esc(i.title) + '">' + CHECK + "</button>" +
        "<h3>" + VV.esc(i.title) + "</h3><p>" + VV.esc(i.what) + "</p>" +
        '<span class="where">' + (island ? VV.esc(island.name) : "Around SVG") + " · " + VV.esc(cats[i.cat].label) + "</span></li>";
    }).join("") : '<li class="empty">Nothing matches those filters.</li>';
    updateProgress();
  }

  document.getElementById("mustdo").addEventListener("click", function (e) {
    var b = e.target.closest(".tick");
    if (!b) return;
    var t = b.getAttribute("data-title");
    var at = done.indexOf(t);
    if (at >= 0) { done.splice(at, 1); } else { done.push(t); }
    VV.store.set(KEY, done);
    var card = b.closest(".postcard");
    var nowDone = at < 0;
    b.setAttribute("aria-pressed", String(nowDone));
    card.classList.toggle("done", nowDone);
    updateProgress();
  });

  document.getElementById("reset-list").addEventListener("click", function () {
    done = [];
    VV.store.set(KEY, done);
    render();
  });

  function picks(id, list) {
    document.getElementById(id).innerHTML = list.map(function (p) {
      return "<li><strong>" + VV.esc(p.name) + '</strong><span class="muted small">' + VV.esc(VV.island(p.island).name) + "</span><br>" + VV.esc(p.what) + "</li>";
    }).join("");
  }
  picks("nature", window.VV_NATURE);
  picks("dives", window.VV_DIVES);
  render();
})();
