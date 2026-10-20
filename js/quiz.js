// "Which island are you?" quiz. Each answer adds points to the islands it suits;
// the island with the most points wins (ties go to the earlier answer's first pick).
(function () {
  "use strict";
  var VV = window.VV;

  var QUESTIONS = [
    { q: "Your perfect morning in the islands?", a: [
      { t: "A sunrise hike up a mountain trail", s: { "st-vincent": 3, "union-island": 2 } },
      { t: "Coffee on a deck, watching the boats come in", s: { "bequia": 3, "young-island": 2 } },
      { t: "Snorkelling before breakfast", s: { "tobago-cays": 3, "canouan": 2 } },
      { t: "Sleeping in, then straight to the hammock", s: { "mayreau": 3, "palm-island": 2 } },
      { t: "A swim in the pool and a slow, fancy breakfast", s: { "mustique": 3, "petit-st-vincent": 2 } }
    ]},
    { q: "Pick your soundtrack", a: [
      { t: "Soca at full volume", s: { "st-vincent": 3, "union-island": 2 } },
      { t: "Live blues as the sun goes down", s: { "mustique": 3 } },
      { t: "Steel pan and cheers from the regatta", s: { "bequia": 3 } },
      { t: "Just the waves", s: { "tobago-cays": 2, "petit-st-vincent": 3, "palm-island": 2 } },
      { t: "A little reggae from a beach bar", s: { "mayreau": 3, "canouan": 1 } }
    ]},
    { q: "What's for dinner?", a: [
      { t: "Roasted breadfruit and jackfish from a roadside spot", s: { "st-vincent": 3 } },
      { t: "Fresh grilled fish on the beach, toes in the sand", s: { "mayreau": 2, "tobago-cays": 3 } },
      { t: "Seafood at a waterfront bar with the yachts", s: { "bequia": 3, "union-island": 2 } },
      { t: "Somewhere elegant, with a view and a wine list", s: { "mustique": 2, "canouan": 3, "young-island": 2 } },
      { t: "Dinner served on my own private beach", s: { "petit-st-vincent": 3, "palm-island": 3 } }
    ]},
    { q: "How do you like to travel?", a: [
      { t: "Get a little lost and find hidden spots", s: { "st-vincent": 3, "union-island": 2 } },
      { t: "By sailboat, wherever the wind goes", s: { "bequia": 2, "tobago-cays": 3 } },
      { t: "Barefoot, no plans, no shoes", s: { "mayreau": 3 } },
      { t: "Private and exclusive", s: { "mustique": 3, "petit-st-vincent": 2, "palm-island": 2 } },
      { t: "Quiet luxury, close to nature", s: { "canouan": 3, "young-island": 3 } }
    ]},
    { q: "Who do you want around you?", a: [
      { t: "Everybody: locals, music, festival energy", s: { "st-vincent": 3, "union-island": 3 } },
      { t: "Friendly sailors and beach-bar regulars", s: { "bequia": 3 } },
      { t: "Turtles and tropical fish", s: { "tobago-cays": 3, "canouan": 2 } },
      { t: "Just me and my person", s: { "young-island": 3, "petit-st-vincent": 3, "palm-island": 2 } },
      { t: "A tiny village where everyone says good morning", s: { "mayreau": 3 } }
    ]},
    { q: "Which souvenir comes home with you?", a: [
      { t: "A hand-carved model boat", s: { "bequia": 3 } },
      { t: "A bottle of local hot sauce and some spices", s: { "st-vincent": 3 } },
      { t: "A photo swimming next to a turtle", s: { "tobago-cays": 3 } },
      { t: "Sore arms from kitesurfing", s: { "union-island": 3 } },
      { t: "Resort wear from a little boutique", s: { "mustique": 3 } },
      { t: "A shell from a beach I had all to myself", s: { "palm-island": 2, "petit-st-vincent": 2, "mayreau": 1, "canouan": 2 } }
    ]}
  ];

  var RESULTS = {
    "st-vincent": { vibe: "The Adventurer", text: "You want the real thing: rainforest trails, waterfalls, Kingstown's markets, roadside breadfruit and soca on the speakers. St. Vincent is big, green and full of life, and it rewards people who go exploring." },
    "young-island": { vibe: "The Romantic", text: "You like your paradise private but not too far from the action. Young Island is a leafy hideaway a few minutes' boat ride from St. Vincent, made for slow mornings and sunset dinners for two." },
    "bequia": { vibe: "The Sailor at Heart", text: "Boats, beach bars and good company. You'd fit right in on Bequia, watching yachts in Admiralty Bay, wandering the Belmont Walkway and cheering at the Easter Regatta." },
    "mustique": { vibe: "The Glamour Lover", text: "A little luxury, a lot of style. Mustique is all white sand, pretty villas and live blues at Basil's Bar, with beaches like Macaroni open to everyone." },
    "canouan": { vibe: "The Reef Explorer", text: "You love nature with a side of comfort. Canouan's long barrier reef and calm, clear water are perfect for snorkelling, followed by a quiet evening somewhere beautiful." },
    "mayreau": { vibe: "The Barefoot Soul", text: "No shoes, no schedule. Mayreau is a tiny island with one hilltop village, Saltwhistle Bay's perfect curve of sand, and a rum punch waiting for you." },
    "tobago-cays": { vibe: "The Ocean Spirit", text: "You belong in the water. The Tobago Cays are five uninhabited islands in a turquoise marine park where green turtles graze right beside swimmers." },
    "union-island": { vibe: "The Free Spirit", text: "You like a bit of everything: hiking Mount Taboi, kitesurfing in the trade winds, and the buzz of the Clifton waterfront. Union is the lively hub of the southern Grenadines." },
    "palm-island": { vibe: "The Total Relaxer", text: "Your goal is to do nothing at all, beautifully. Palm Island is almost completely ringed by white sand, so the hardest decision is which beach to lie on." },
    "petit-st-vincent": { vibe: "The Escape Artist", text: "No roads, no crowds, no phone calls. Petit St. Vincent is the country's southernmost island and the ultimate get-away-from-it-all. It has been rebuilding after Hurricane Beryl, so check before you plan." }
  };

  var card = document.getElementById("quiz-card");
  var bar = document.getElementById("quiz-bar");
  var step = 0, scores = {}, firstPicks = [];

  function reset() {
    step = 0; scores = {}; firstPicks = [];
    window.VV_ISLANDS.forEach(function (i) { scores[i.id] = 0; });
    showQuestion();
  }

  function showQuestion() {
    var q = QUESTIONS[step];
    bar.style.width = (step / QUESTIONS.length * 100) + "%";
    card.innerHTML =
      '<p class="quiz-step">Question ' + (step + 1) + " of " + QUESTIONS.length + "</p>" +
      '<h2 class="quiz-q" tabindex="-1">' + VV.esc(q.q) + "</h2>" +
      '<div class="quiz-answers">' + q.a.map(function (a, i) {
        return '<button type="button" class="quiz-answer" data-i="' + i + '"><span class="dot" aria-hidden="true"></span>' + VV.esc(a.t) + "</button>";
      }).join("") + "</div>" +
      (step > 0 ? '<button type="button" class="quiz-back" id="quiz-back">Back</button>' : "");
    card.classList.remove("in"); void card.offsetWidth; card.classList.add("in");
    if (step > 0) {
      card.querySelector(".quiz-q").focus({ preventScroll: true });
      if (card.getBoundingClientRect().top < 70) card.scrollIntoView({ block: "start" });
    }
  }

  var picks = [];
  card.addEventListener("click", function (e) {
    var b = e.target.closest(".quiz-answer");
    if (b) {
      var a = QUESTIONS[step].a[Number(b.getAttribute("data-i"))];
      picks.push(a);
      Object.keys(a.s).forEach(function (k) { scores[k] += a.s[k]; });
      firstPicks.push(Object.keys(a.s)[0]);
      b.classList.add("chosen");
      setTimeout(function () {
        step++;
        if (step < QUESTIONS.length) { showQuestion(); } else { finish(); }
      }, 220);
      return;
    }
    if (e.target.id === "quiz-back" && step > 0) {
      var last = picks.pop();
      Object.keys(last.s).forEach(function (k) { scores[k] -= last.s[k]; });
      firstPicks.pop();
      step--;
      showQuestion();
    }
  });

  function finish() {
    var best = null, bestScore = -1;
    // Tie-break: whichever tied island was the top pick of the earliest answer
    window.VV_ISLANDS.forEach(function (isl) {
      var s = scores[isl.id];
      var tieRank = firstPicks.indexOf(isl.id);
      if (s > bestScore || (s === bestScore && tieRank >= 0 && (firstPicks.indexOf(best) < 0 || tieRank < firstPicks.indexOf(best)))) {
        best = isl.id; bestScore = s;
      }
    });
    showResult(best, true);
  }

  function showResult(id, fresh) {
    var isl = VV.island(id), r = RESULTS[id];
    if (!isl || !r) { reset(); return; }
    bar.style.width = "100%";
    var url = location.origin + location.pathname + "?result=" + id;
    if (fresh) { history_replace(url); }
    card.innerHTML =
      '<div class="quiz-result" style="--accent:' + isl.color + '">' +
        '<div class="res-icon">' + VV.islandIcon(isl) + "</div>" +
        '<p class="quiz-step">' + VV.esc(r.vibe) + "</p>" +
        '<h2 class="quiz-q" tabindex="-1">You\'re ' + VV.esc(isl.name) + "!</h2>" +
        '<p class="res-text">' + VV.esc(r.text) + "</p>" +
        '<ul class="res-hl">' + isl.highlights.slice(0, 3).map(function (h) { return "<li><strong>" + VV.esc(h[0]) + "</strong> " + VV.esc(h[1]) + "</li>"; }).join("") + "</ul>" +
        '<div class="res-actions">' +
          '<a class="btn btn-gold" href="index.html?sail=' + id + '#hop">Sail there on the map</a>' +
          '<a class="btn" href="planner.html?island=' + id + '">Plan a day there</a>' +
          '<a class="btn btn-quiet" href="island.html?id=' + id + '">Explore ' + VV.esc(isl.name) + "</a>" +
          '<button type="button" class="btn btn-quiet" id="quiz-share">Share my result</button>' +
        "</div>" +
        '<button type="button" class="quiz-back" id="quiz-again">Take the quiz again</button>' +
        '<p class="share-msg" id="share-msg" aria-live="polite"></p>' +
      "</div>";
    card.classList.remove("in"); void card.offsetWidth; card.classList.add("in");
    if (fresh) {
      card.querySelector(".quiz-q").focus({ preventScroll: true });
      card.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
    }

    document.getElementById("quiz-again").addEventListener("click", function () {
      history_replace(location.origin + location.pathname);
      picks = [];
      reset();
    });
    document.getElementById("quiz-share").addEventListener("click", function () {
      var msg = document.getElementById("share-msg");
      var text = "I'm " + isl.name + " (" + r.vibe + ")! Which St. Vincent and the Grenadines island are you?";
      if (navigator.share) {
        navigator.share({ title: "Which island are you?", text: text, url: url }).catch(function () {});
        return;
      }
      try {
        navigator.clipboard.writeText(text + " " + url).then(function () {
          msg.textContent = "Link copied. Paste it anywhere to share.";
        }, function () { msg.textContent = "Copy this link: " + url; });
      } catch (err) {
        msg.textContent = "Copy this link: " + url;
      }
    });
  }

  function history_replace(url) {
    try { window.history.replaceState(null, "", url); } catch (e) { /* ignore */ }
  }

  var shared = new URLSearchParams(location.search).get("result");
  if (shared && RESULTS[shared]) {
    window.VV_ISLANDS.forEach(function (i) { scores[i.id] = 0; });
    showResult(shared, false);
  } else {
    reset();
  }
})();
