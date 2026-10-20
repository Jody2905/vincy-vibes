// Day planner activities. Everything here comes from content already checked for the site
// (island highlights, must-dos, nature and dive pages on discoversvg.com, checked October 2026).
// slots: when in the day it works best (early 7am, morning 9:30, lunch 12:30, afternoon 2:30, evening 5:30)
// tags:  beach, nature, culture, food, water, nightlife
// place: the name of a pin in js/data/places.js, so the stop shows on the map with directions
// days:  only on these days of the week (0 = Sunday)
window.VV_PLAN_SLOTS = {
  early:     { label: "Early start", time: "7:00am" },
  morning:   { label: "Morning", time: "9:30am" },
  lunch:     { label: "Lunch", time: "12:30pm" },
  afternoon: { label: "Afternoon", time: "2:30pm" },
  evening:   { label: "Sunset and evening", time: "5:30pm" }
};

window.VV_PLAN_TAGS = {
  beach:     "Beaches",
  nature:    "Nature and hikes",
  culture:   "History and culture",
  food:      "Local food",
  water:     "Snorkelling and boats",
  nightlife: "Bars and liming"
};

// Islands that are private or have very little for day visitors borrow a neighbour's activities.
window.VV_PLAN_NEAR = {
  "young-island": { island: "st-vincent", note: "Young Island is a private resort island, a few minutes by boat from Villa Beach. This plan keeps you on the nearby St. Vincent coast, with the island in view.", prefer: ["Villa Beach"] },
  "palm-island": { island: "union-island", note: "Palm Island is a short boat ride from Union Island, and day visitors are welcome at the south end of its west beach. This plan pairs it with Union." },
  "petit-st-vincent": { island: "union-island", note: "Petit St. Vincent is a private resort island reached by resort boat from Union Island, and it has been rebuilding after Hurricane Beryl. This plan is a day on Union, the nearest island most visitors can explore." },
  "tobago-cays": { island: "mayreau", note: "The Tobago Cays are uninhabited, so evenings are spent on Mayreau or Union Island, the usual bases for a day out to the Cays." }
};

window.VV_PLAN = [
  // ---------- St. Vincent ----------
  { island: "st-vincent", slots: ["early"], title: "Parrot watch on the Vermont Nature Trail", what: "Rainforest loops on Grand Bonhomme. Go at dawn to the Parrot Lookout for the best chance of seeing the St. Vincent parrot, the national bird.", tags: ["nature"], place: "Vermont Nature Trail" },
  { island: "st-vincent", slots: ["early", "morning"], title: "Botanic Gardens", what: "Founded in 1765, the oldest botanic garden in the Western Hemisphere. Find the breadfruit tree linked to Captain Bligh and the parrot aviary.", tags: ["nature", "culture"], place: "Botanic Gardens" },
  { island: "st-vincent", slots: ["morning"], title: "Coffee at Carib-Beans", what: "Specialty coffee at the cruise ship terminal in Kingstown.", tags: ["food"], place: "Kingstown" },
  { island: "st-vincent", slots: ["morning", "afternoon"], title: "Fort Charlotte", what: "The 1806 fort 601 ft above Kingstown, with views down to the Grenadines. Its cannons famously point inland.", tags: ["culture"], place: "Fort Charlotte" },
  { island: "st-vincent", slots: ["morning", "afternoon"], title: "Dark View Falls", what: "Twin waterfalls dropping into natural pools, reached by a bamboo bridge on a short, well-kept trail. Bring swimwear.", tags: ["nature", "water"], place: "Dark View Falls" },
  { island: "st-vincent", slots: ["morning"], title: "Hike to Trinity Falls", what: "About 30 minutes through the forest to three cascades and a swimming pool. Wear proper shoes.", tags: ["nature"], place: "Trinity Falls" },
  { island: "st-vincent", slots: ["morning", "afternoon"], title: "Montreal Gardens", what: "Cool, misty gardens in the mountains above the Mesopotamia Valley. Small entrance fee.", tags: ["nature"], place: "Montreal Gardens" },
  { island: "st-vincent", slots: ["morning", "afternoon"], title: "Owia Salt Pond", what: "Calm, warm rock pools beside the Atlantic on the north-east coast. A long drive, so make it the main event.", tags: ["nature", "beach"], place: "Owia Salt Pond" },
  { island: "st-vincent", slots: ["morning", "afternoon"], title: "Wallilabou Bay", what: "The west-coast bay used as a set for Pirates of the Caribbean.", tags: ["culture", "beach"], place: "Wallilabou Bay" },
  { island: "st-vincent", slots: ["morning"], title: "Kingstown markets and Bay Street", what: "Browse the markets and pick up banana-fibre art by Nzimbu on upper Bay Street and a bottle of Vincy Fresh tamarind hot sauce.", tags: ["culture", "food"], place: "Kingstown" },
  { island: "st-vincent", slots: ["morning"], title: "Dive Anchor Reef", what: "A wall dive with black coral and an 18th-century anchor, voted one of the world's top 100 dive sites. Book with a local dive shop.", tags: ["water"] },
  { island: "st-vincent", slots: ["lunch"], title: "Breadfruit bowl at Grenadine House", what: "A generous plate built around the national favourite, breadfruit.", tags: ["food"] },
  { island: "st-vincent", slots: ["lunch"], title: "Roasted breadfruit and fried jackfish", what: "The national dish, from a roadside spot. Breadfruit charred over an open fire with jackfish marinated in lime and herbs.", tags: ["food", "culture"] },
  { island: "st-vincent", slots: ["afternoon"], title: "Villa Beach", what: "Swim on the south coast with Young Island just offshore.", tags: ["beach"], place: "Villa Beach" },
  { island: "st-vincent", slots: ["evening", "lunch"], title: "Rooftop at the Cobblestone Inn", what: "Local dishes and drinks on the roof of a historic Kingstown inn.", tags: ["food", "nightlife"], place: "Kingstown" },
  { island: "st-vincent", slots: ["evening"], days: [5], title: "TGIF lime at Heritage Square", what: "It's Friday, so join locals at the Friday-evening hangout in Kingstown.", tags: ["nightlife", "culture"], place: "Kingstown" },
  { island: "st-vincent", slots: ["evening"], title: "Sunset at Villa Beach", what: "Watch the sun go down behind Young Island, then find dinner along the Villa strip.", tags: ["beach", "food"], place: "Villa Beach" },

  // ---------- Bequia ----------
  { island: "bequia", slots: ["early", "morning"], title: "Port Elizabeth and the model-boat workshops", what: "Watch carvers make detailed model sailing boats, a craft from Bequia's boat-building past.", tags: ["culture"], place: "Port Elizabeth" },
  { island: "bequia", slots: ["morning", "afternoon"], title: "Bequia Maritime Museum", what: "The story of Bequia's sailors, boat builders and whalers.", tags: ["culture"] },
  { island: "bequia", slots: ["morning", "afternoon"], title: "Old Hegg Turtle Sanctuary", what: "At Park Bay, where hawksbill turtles are raised and released.", tags: ["nature"], place: "Old Hegg Turtle Sanctuary" },
  { island: "bequia", slots: ["morning", "afternoon"], title: "Princess Margaret Beach", what: "A long golden beach in Admiralty Bay, a walk or water taxi from Port Elizabeth.", tags: ["beach"], place: "Princess Margaret Beach" },
  { island: "bequia", slots: ["morning"], title: "Water taxi around Admiralty Bay", what: "Hop between the beaches and boats of the bay the island way.", tags: ["water"], place: "Port Elizabeth" },
  { island: "bequia", slots: ["afternoon", "lunch"], title: "Lower Bay", what: "Calm water, beach bars and good snorkelling just south of Princess Margaret.", tags: ["beach", "water", "food"], place: "Lower Bay" },
  { island: "bequia", slots: ["lunch", "evening"], title: "Seafood at Bequia Marina", what: "Dock up and eat the day's fresh catch.", tags: ["food"], place: "Port Elizabeth" },
  { island: "bequia", slots: ["afternoon", "evening"], title: "Crafts on the Belmont Walkway", what: "Stroll the waterfront path and browse handmade crafts from local vendors.", tags: ["culture"], place: "Port Elizabeth" },
  { island: "bequia", slots: ["evening"], title: "Bar One floating bar", what: "Take a water taxi out to a floating bar for a local cocktail at sunset.", tags: ["nightlife", "water"] },

  // ---------- Mustique ----------
  { island: "mustique", slots: ["morning", "afternoon"], title: "Island taxi tour", what: "A one-hour tour of the island with one of the local taxi operators. Book ahead or ask at Basil's Bar.", tags: ["culture", "nature"] },
  { island: "mustique", slots: ["morning", "afternoon"], title: "Britannia Bay and The Pink House", what: "The jetty, fruit stalls and shops of Britannia Bay, including The Pink House boutique.", tags: ["culture"], place: "Basil's Bar, Britannia Bay" },
  { island: "mustique", slots: ["lunch", "afternoon"], title: "Picnic on Macaroni Beach", what: "Wide white sand and turquoise surf on the Atlantic side. Bring lunch and stay a while.", tags: ["beach", "food"], place: "Macaroni Beach" },
  { island: "mustique", slots: ["evening"], title: "Basil's Bar", what: "The waterside bar on stilts in Britannia Bay, on CNN's list of the world's best beach bars.", tags: ["food", "nightlife"], place: "Basil's Bar, Britannia Bay" },

  // ---------- Canouan ----------
  { island: "canouan", slots: ["early", "morning"], title: "Mount Royal", what: "The highest point on Canouan, 877 ft, with views down the island chain.", tags: ["nature"] },
  { island: "canouan", slots: ["morning"], title: "Snorkel the barrier reef", what: "Calm, clear water inside the reef on the windward side.", tags: ["water", "nature"] },
  { island: "canouan", slots: ["morning", "afternoon"], title: "Meet the land turtles", what: "Look for the tortoises Canouan is said to be named after.", tags: ["nature"] },
  { island: "canouan", slots: ["morning"], title: "Charlestown", what: "Wander the main village by the ferry jetty.", tags: ["culture"], place: "Charlestown jetty" },
  { island: "canouan", slots: ["afternoon"], title: "Glossy Bay or Friendship Bay", what: "Beaches on the south side. Resort beaches are public, though road access can be restricted.", tags: ["beach"] },
  { island: "canouan", slots: ["lunch", "evening"], title: "Ocean Heights Restaurant", what: "One of the Canouan restaurants on the SVG Tourism Authority's must-do list.", tags: ["food"] },
  { island: "canouan", slots: ["evening"], title: "Shenanigans at Sandy Lane Yacht Club", what: "Sundowners by the water at the yacht club.", tags: ["nightlife", "food"] },

  // ---------- Mayreau ----------
  { island: "mayreau", slots: ["early", "morning"], title: "Walk across the island", what: "About an hour on the road from Saline Bay to Saltwhistle Bay, past Old Wall and its stone Catholic church.", tags: ["culture", "nature"], place: "Saline Bay jetty" },
  { island: "mayreau", slots: ["early", "morning"], title: "Dry-forest trails", what: "Trails where you may see tortoises and iguanas. Take water.", tags: ["nature"] },
  { island: "mayreau", slots: ["morning", "afternoon"], title: "Snorkel Mayreau Gardens", what: "A coral reef off the east coast, inside the Tobago Cays Marine Park.", tags: ["water"] },
  { island: "mayreau", slots: ["morning", "afternoon"], title: "Saltwhistle Bay", what: "A curve of sand with calm water that's perfect for swimming.", tags: ["beach"], place: "Saltwhistle Bay" },
  { island: "mayreau", slots: ["lunch", "afternoon"], title: "Jungle Special at the Last Bar Before the Jungle", what: "A beachside rum punch at Saltwhistle Bay.", tags: ["food", "nightlife"], place: "Saltwhistle Bay" },
  { island: "mayreau", slots: ["evening"], title: "Seamoss rum punch", what: "Mayreau's own rum punch, made with seamoss, as the sun sets.", tags: ["food", "nightlife"] },

  // ---------- Tobago Cays ----------
  { island: "tobago-cays", slots: ["early"], title: "Boat out to the Cays", what: "Leave early by day tour or water taxi from Union Island, Mayreau or Canouan. Marine park fees are usually included in tour prices.", tags: ["water"], place: "Tobago Cays lagoon" },
  { island: "tobago-cays", slots: ["morning"], title: "Swim with turtles at Baradal", what: "A marked turtle reserve inside linked buoys. Please don't touch the turtles or stand on coral.", tags: ["water", "nature"], place: "Baradal turtle reserve" },
  { island: "tobago-cays", slots: ["afternoon", "morning"], title: "Snorkel the reefs", what: "Clear water, colourful fish and reefs around the lagoon.", tags: ["water"], place: "Tobago Cays lagoon" },
  { island: "tobago-cays", slots: ["lunch"], title: "Lunch on a cay", what: "Bring a picnic or check what your day tour includes, and take all your rubbish back with you.", tags: ["food", "beach"], place: "Tobago Cays lagoon" },
  { island: "tobago-cays", slots: ["afternoon"], title: "Petit Tabac", what: "The cay where Jack Sparrow was marooned in the first Pirates of the Caribbean film.", tags: ["beach", "culture"], place: "Petit Tabac" },

  // ---------- Union Island ----------
  { island: "union-island", slots: ["early"], title: "Hike Mount Taboi", what: "999 ft, the highest point in the Grenadines. Start early, before the heat.", tags: ["nature"], place: "Mount Taboi" },
  { island: "union-island", slots: ["early", "morning", "afternoon"], title: "Fort Hill lookout", what: "A 400 ft lookout over Clifton Harbour with an old cannon battery.", tags: ["culture"], place: "Clifton" },
  { island: "union-island", slots: ["morning", "afternoon"], title: "Ashton Lagoon trails", what: "Hike and birdwatch around the lagoon.", tags: ["nature"] },
  { island: "union-island", slots: ["morning", "lunch"], title: "Clifton waterfront and market", what: "The buzz of the southern Grenadines' main harbour, with fruit and veg at the market.", tags: ["culture", "food"], place: "Clifton" },
  { island: "union-island", slots: ["afternoon"], title: "Kitesurfing in Clifton", what: "Steady trade winds make Clifton a kitesurfing spot. Lessons and gear hire are available locally.", tags: ["water"], place: "Clifton" },
  { island: "union-island", slots: ["lunch", "afternoon"], title: "Chatham Bay", what: "A big, quiet bay on the west coast.", tags: ["beach"], place: "Chatham Bay" },
  { island: "union-island", slots: ["evening"], title: "Just Right Bar", what: "A local night out in Ashton.", tags: ["nightlife"] },

  // ---------- Palm Island ----------
  { island: "palm-island", slots: ["morning"], title: "Boat across to Palm Island", what: "A short boat ride from Union Island. Walk the nature trails past coconut palms and the small lagoon.", tags: ["nature", "water"], place: "Palm Island" },
  { island: "palm-island", slots: ["lunch", "afternoon"], title: "Palm Island west beach", what: "Day visitors are welcome at the southern end of the west beach, where there's a bar open to visitors.", tags: ["beach", "food"], place: "Palm Island" }
];
