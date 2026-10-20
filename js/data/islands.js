// The islands, listed north to south (the order the ferries run).
// Facts from discoversvg.com island pages and Wikipedia, checked October 2026.
window.VV_ISLANDS = [
  {
    id: "st-vincent",
    sky: "sky-forest",
    color: "#00A86B",
    name: "St. Vincent",
    tagline: "Rainforest, a live volcano and black-sand bays",
    lat: 13.2528, lng: -61.1971, zoom: 11,
    intro: "The mainland and by far the biggest island, with 88% of the country's land. The east coast faces the Atlantic; the west coast is a run of quiet black-sand bays and fishing villages. Kingstown, the capital, is where the Grenadines ferries leave from.",
    facts: [
      ["Size", "133 sq mi (344 km²)"],
      ["Capital", "Kingstown"],
      ["Highest point", "La Soufrière, 4,049 ft (1,234 m)"],
      ["Airport", "Argyle International (SVD)"]
    ],
    highlights: [
      ["La Soufrière", "The active volcano that dominates the north. Its crater trail climbs through rainforest from the windward side, but it erupted in 2021 and authorities currently discourage hiking it, so check before you plan a trip."],
      ["Botanic Gardens", "Started in 1765, one of the oldest botanical gardens in the Western Hemisphere. Look for the breadfruit tree linked to Captain Bligh, and the St. Vincent parrot aviary."],
      ["Fort Charlotte", "Finished in 1806, 601 ft above Kingstown, with views to the Grenadines. Its cannons famously point inland."],
      ["Dark View Falls", "Twin waterfalls on the leeward side, reached by a bamboo bridge over the river."],
      ["Wallilabou Bay", "A west-coast bay used as a set for Pirates of the Caribbean."],
      ["Vermont Nature Trail", "A rainforest loop where you might spot the St. Vincent parrot (Amazona guildingii), the national bird."]
    ],
    gettingThere: "International and regional flights land at Argyle International Airport, about 5 miles from Kingstown. Ferries from Bequia and the southern Grenadines arrive at the Kingstown ferry terminal.",
    gettingAround: "Tourism-approved taxis (see the taxi directory), minibuses on fixed routes, or a rental car with a local driving permit. Traffic drives on the left.",
    taxis: true
  },
  {
    id: "young-island",
    sky: "sky-day",
    color: "#00A6C0",
    name: "Young Island",
    tagline: "A private island a few minutes off Villa Beach",
    lat: 13.1306, lng: -61.2093, zoom: 15,
    intro: "A tiny, leafy island just off St. Vincent's south coast, taken up by a single resort and protected as a wildlife reserve. Right beside it is Fort Duvernette, an old British fort on top of a volcanic rock.",
    facts: [
      ["Where", "Off Villa Beach, south St. Vincent"],
      ["Stay", "One private resort"],
      ["Next door", "Fort Duvernette, 190 ft up, 255 steps"]
    ],
    highlights: [
      ["Villa Beach view", "Even if you don't stay, Young Island makes the view from Villa Beach and Indian Bay."],
      ["Fort Duvernette", "Built to guard the bay, with 255 steps cut into the rock. It has been closed for safety since January 2025, so check before planning a visit."]
    ],
    gettingThere: "A short boat ride from the dock at Villa Beach, arranged with the resort.",
    gettingAround: "On foot.",
    taxis: false
  },
  {
    id: "bequia",
    sky: "sky-day",
    color: "#FF5C8A",
    name: "Bequia",
    tagline: "Boat builders, a turtle sanctuary and Admiralty Bay",
    lat: 13.0150, lng: -61.2300, zoom: 13,
    intro: "The second-largest island, an easy ferry ride from Kingstown, with a long tradition of wooden boat building and sailing. Port Elizabeth sits on Admiralty Bay, one of the Caribbean's favourite yacht anchorages.",
    facts: [
      ["Size", "7 sq mi (18 km²)"],
      ["People", "About 5,300"],
      ["Main town", "Port Elizabeth"],
      ["Airport", "J.F. Mitchell (BQU)"]
    ],
    highlights: [
      ["Princess Margaret Beach", "A long golden beach in Admiralty Bay, a walk or water taxi from Port Elizabeth."],
      ["Lower Bay", "Calm water, beach bars and good snorkelling just south of Princess Margaret."],
      ["Old Hegg Turtle Sanctuary", "At Park Bay, where hawksbill turtles are raised and released."],
      ["Easter Regatta", "Bequia's busiest week: sailing races, local boats and music."],
      ["Model boats", "Workshops in Port Elizabeth carve detailed model sailing boats, a craft from the island's boat-building past."]
    ],
    gettingThere: "Fast ferries take about 30 to 60 minutes from Kingstown (see ferry times). Small planes fly into J.F. Mitchell Airport.",
    gettingAround: "Tourism-approved Bequia taxis, open-air pickup \"dollar buses\", water taxis around Admiralty Bay, or walking.",
    taxis: true
  },
  {
    id: "mustique",
    sky: "sky-dusk",
    color: "#F29F05",
    name: "Mustique",
    tagline: "Private villas, Basil's Bar and Macaroni Beach",
    lat: 12.8790, lng: -61.1830, zoom: 14,
    intro: "A privately run island famous for celebrity villas, yet with beaches open to everyone. About 500 people live here, mostly in Lovell Village. There are no public buses or car rentals; hotel guests get around in small open cars called mules.",
    facts: [
      ["Size", "About 1,400 acres (3 × 1.5 miles)"],
      ["People", "About 500"],
      ["Stay", "Cotton House hotel, 71 rental villas"],
      ["Airport", "Mustique (MQS)"]
    ],
    highlights: [
      ["Basil's Bar", "A waterside bar and restaurant on stilts in Britannia Bay, on CNN's list of the world's best beach bars."],
      ["Macaroni Beach", "Wide white sand and turquoise surf on the Atlantic side."],
      ["Mustique Blues Festival", "Live blues at Basil's Bar in the last week of January."],
      ["Britannia Bay", "Moorings for yachts, plus a jetty, shops and fruit stalls."]
    ],
    gettingThere: "Mustique Airways and SVG Airways fly in from Argyle. Yachts can pick up a mooring in Britannia Bay.",
    gettingAround: "A couple of taxi operators offer one-hour island tours (book ahead or ask at Basil's Bar). Otherwise walk.",
    taxis: false
  },
  {
    id: "canouan",
    sky: "sky-day",
    color: "#14B8A6",
    name: "Canouan",
    tagline: "A barrier reef and long white beaches",
    lat: 12.7170, lng: -61.3330, zoom: 13,
    intro: "A small island with a barrier reef running along its Atlantic side and some of the whitest sand in the Grenadines. Its jet-capable airport makes it a gateway for the southern islands. Canouan was badly hit by Hurricane Beryl in July 2024 and is still rebuilding.",
    facts: [
      ["Size", "2.9 sq mi (7.6 km²)"],
      ["People", "About 1,700"],
      ["Main village", "Charlestown"],
      ["Airport", "Canouan (CIW)"]
    ],
    highlights: [
      ["The barrier reef", "Calm, clear water inside the reef on the windward side, great for snorkelling."],
      ["Glossy Bay and Friendship Bay", "Beaches on the south side. Resort beaches are public, though road access to them can be restricted."],
      ["Mount Royal", "The highest point, 877 ft, with views down the island chain."]
    ],
    gettingThere: "Ferries from Kingstown stop here on the way to Mayreau and Union Island. Flights land at Canouan Airport.",
    gettingAround: "Taxis around Charlestown, or walking.",
    taxis: false,
    beryl: true
  },
  {
    id: "mayreau",
    sky: "sky-dawn",
    color: "#FF7A59",
    name: "Mayreau",
    tagline: "Saltwhistle Bay and the doorstep of the Tobago Cays",
    lat: 12.6400, lng: -61.3900, zoom: 14,
    intro: "A tiny island of fewer than 300 people, with no airport and one hilltop village. Saltwhistle Bay is a curve of white sand with calm water on one side and Atlantic surf on the other. Mayreau was damaged by Hurricane Beryl in July 2024.",
    facts: [
      ["People", "About 300"],
      ["Village", "Old Wall, on the hill"],
      ["Highest point", "Tamarind Hill, 280 ft"],
      ["Airport", "None, arrive by sea"]
    ],
    highlights: [
      ["Saltwhistle Bay", "A popular yacht anchorage with calm water that's perfect for swimming."],
      ["The walk across", "About an hour on the road between Saline Bay and Saltwhistle Bay, past Old Wall and its stone Catholic church."],
      ["Mayreau Gardens", "A coral reef dive and snorkel site off the east coast, inside the Tobago Cays Marine Park."]
    ],
    gettingThere: "Ferries stop at the jetty in Saline Bay. Water taxis run to the Tobago Cays and Union Island.",
    gettingAround: "On foot. Hiking trails lead into dry forest where you may see tortoises and iguanas.",
    taxis: false,
    beryl: true
  },
  {
    id: "tobago-cays",
    sky: "sky-day",
    color: "#00B8D9",
    name: "Tobago Cays",
    tagline: "Five uninhabited cays and swimming with turtles",
    lat: 12.6317, lng: -61.3550, zoom: 14,
    intro: "Five small, uninhabited cays (Petit Rameau, Petit Bateau, Baradal, Jamesby and Petit Tabac) sheltered by the 4 km Horseshoe Reef. The lagoon is a protected marine park, and green turtles graze on the seagrass right beside swimmers.",
    facts: [
      ["Cays", "5, all uninhabited"],
      ["Protected", "Marine park since 1997"],
      ["Reef", "Horseshoe Reef, about 4 km"],
      ["Park office", "Clifton, Union Island"]
    ],
    highlights: [
      ["Turtle watching", "A marked turtle reserve on the south-west edge of Baradal, inside linked buoys."],
      ["Petit Tabac", "Where Jack Sparrow was marooned in the first Pirates of the Caribbean film."],
      ["Snorkelling and diving", "Clear water, colourful fish and reefs."]
    ],
    gettingThere: "By day tour, water taxi or yacht from Union Island, Mayreau or Canouan. Marine park fees are paid at the park offices on Union Island and Mayreau or to wardens on arrival, and are usually included in tour prices.",
    gettingAround: "By boat. Please don't stand on coral or touch the turtles.",
    taxis: false
  },
  {
    id: "union-island",
    sky: "sky-dawn",
    color: "#7B5CD6",
    name: "Union Island",
    tagline: "Mount Taboi, kitesurfing and the Clifton waterfront",
    lat: 12.6000, lng: -61.4330, zoom: 14,
    intro: "The busy hub of the southern Grenadines, with dramatic volcanic peaks and a lively harbour at Clifton. It's the jumping-off point for the Tobago Cays and the private islands. Union Island was hit hardest by Hurricane Beryl in July 2024 and is rebuilding, so check what's open before you go.",
    facts: [
      ["Size", "3.5 sq mi (9.1 km²)"],
      ["People", "About 3,000"],
      ["Villages", "Clifton and Ashton"],
      ["Airport", "Union Island (UNI)"]
    ],
    highlights: [
      ["Mount Taboi", "999 ft, the highest point in the Grenadines."],
      ["Fort Hill", "A 400 ft lookout over Clifton Harbour with an old cannon battery."],
      ["Chatham Bay", "A big, quiet bay on the west coast."],
      ["Kitesurfing", "Steady trade winds make Clifton a kitesurfing spot."],
      ["Easterval", "Union's yearly Easter festival in Clifton."]
    ],
    gettingThere: "Ferries from Kingstown via Canouan and Mayreau dock on the Clifton waterfront. Flights land at Union Island Airport. Clifton has customs and immigration for yachts.",
    gettingAround: "Private taxis near the Clifton market (agree the fare first), a few fixed-route minibuses, or walking with water and sun cream.",
    taxis: false,
    beryl: true
  },
  {
    id: "palm-island",
    sky: "sky-dusk",
    color: "#F2B705",
    name: "Palm Island",
    tagline: "A 135-acre island ringed by white sand",
    lat: 12.5850, lng: -61.3950, zoom: 15,
    intro: "A private island just south-east of Union, almost completely ringed by white sand beaches and taken up by one resort. It was once called Prune Island, until John and Mary Caldwell leased it in 1966, planted coconut palms and renamed it.",
    facts: [
      ["Size", "About 135 acres"],
      ["Stay", "One resort, 42 cottages and suites"],
      ["Highest point", "About 150 ft"]
    ],
    highlights: [
      ["The west beach", "Day visitors are welcome at the southern end of the west beach, where there's a bar open to visitors."],
      ["Nature trails", "Coconut palms and a small lagoon in the middle of the island."]
    ],
    gettingThere: "A short boat ride from Union Island.",
    gettingAround: "On foot.",
    taxis: false,
    beryl: true
  },
  {
    id: "petit-st-vincent",
    sky: "sky-dusk",
    color: "#E8478B",
    name: "Petit St. Vincent",
    tagline: "The southernmost island of SVG",
    lat: 12.5375, lng: -61.3839, zoom: 15,
    intro: "The country's southernmost island, a 115-acre private resort with 22 cottages and villas, a spa and a dive centre. Hurricane Beryl hit it in July 2024, and the resort has been rebuilding with plans to reopen in 2026.",
    facts: [
      ["Size", "About 115 acres"],
      ["Stay", "One resort, 22 cottages and villas"],
      ["Status", "Rebuilding after Hurricane Beryl"]
    ],
    highlights: [
      ["Seclusion", "No roads, no crowds, and a view of Petite Martinique (part of Grenada) just across the water."]
    ],
    gettingThere: "By boat from Union Island, arranged with the resort.",
    gettingAround: "On foot.",
    taxis: false,
    beryl: true
  }
];
