// Map pins. Coordinates for towns, airports, islands and forts come from Wikipedia.
// Pins marked approx: true are placed by hand from maps and may be off by a few hundred metres.
window.VV_CATEGORIES = {
  airport: { label: "Airports", one: "Airport", color: "#0072C6" },
  ferry:   { label: "Ferry docks", one: "Ferry dock", color: "#0B3D5C" },
  beach:   { label: "Beaches", one: "Beach", color: "#E0A800" },
  sight:   { label: "Sights and history", one: "Sight", color: "#C2410C" },
  nature:  { label: "Nature and hikes", one: "Nature", color: "#009E60" },
  town:    { label: "Towns", one: "Town", color: "#6B4FA0" }
};

window.VV_PLACES = [
  // St. Vincent
  { name: "Kingstown", island: "st-vincent", cat: "town", lat: 13.15778, lng: -61.22500, note: "The capital: markets, cathedrals and the ferry terminal." },
  { name: "Argyle International Airport (SVD)", island: "st-vincent", cat: "airport", lat: 13.15639, lng: -61.15028, note: "Main international airport, about 5 miles from Kingstown." },
  { name: "Kingstown ferry terminal", island: "st-vincent", cat: "ferry", lat: 13.1546, lng: -61.2297, approx: true, note: "Ferries to Bequia, Canouan, Mayreau and Union Island." },
  { name: "La Soufrière volcano", island: "st-vincent", cat: "nature", lat: 13.3333, lng: -61.1833, note: "4,049 ft active volcano. Check the alert level before hiking." },
  { name: "Botanic Gardens", island: "st-vincent", cat: "nature", lat: 13.1683, lng: -61.2283, approx: true, note: "Founded 1765, one of the oldest in the Western Hemisphere." },
  { name: "Fort Charlotte", island: "st-vincent", cat: "sight", lat: 13.1579, lng: -61.2421, note: "1806 fort 601 ft above Kingstown." },
  { name: "Dark View Falls", island: "st-vincent", cat: "nature", lat: 13.2911, lng: -61.2495, approx: true, note: "Twin waterfalls reached by a bamboo bridge." },
  { name: "Wallilabou Bay", island: "st-vincent", cat: "sight", lat: 13.2486, lng: -61.2731, approx: true, note: "Pirates of the Caribbean filming location." },
  { name: "Vermont Nature Trail", island: "st-vincent", cat: "nature", lat: 13.2231, lng: -61.2081, approx: true, note: "Rainforest trail, home of the St. Vincent parrot." },
  { name: "Villa Beach", island: "st-vincent", cat: "beach", lat: 13.1340, lng: -61.2110, approx: true, note: "South-coast beach facing Young Island." },
  { name: "Fort Duvernette", island: "young-island", cat: "sight", lat: 13.1279, lng: -61.2091, approx: true, note: "255 steps up a volcanic rock. Closed for safety since January 2025." },

  // Bequia
  { name: "Port Elizabeth", island: "bequia", cat: "town", lat: 13.01111, lng: -61.23444, note: "Bequia's main town on Admiralty Bay." },
  { name: "Bequia ferry jetty", island: "bequia", cat: "ferry", lat: 13.0118, lng: -61.2353, approx: true, note: "Ferries to and from Kingstown." },
  { name: "J.F. Mitchell Airport (BQU)", island: "bequia", cat: "airport", lat: 12.98833, lng: -61.26194, note: "Small-plane airport near Paget Farm." },
  { name: "Princess Margaret Beach", island: "bequia", cat: "beach", lat: 13.0058, lng: -61.2425, approx: true, note: "Long golden beach in Admiralty Bay." },
  { name: "Lower Bay", island: "bequia", cat: "beach", lat: 13.0010, lng: -61.2455, approx: true, note: "Calm water, beach bars, snorkelling." },
  { name: "Old Hegg Turtle Sanctuary", island: "bequia", cat: "nature", lat: 13.0222, lng: -61.2038, approx: true, note: "Hawksbill turtles at Park Bay." },

  // Mustique
  { name: "Mustique Airport (MQS)", island: "mustique", cat: "airport", lat: 12.88806, lng: -61.18028, note: "Flights from Argyle." },
  { name: "Basil's Bar, Britannia Bay", island: "mustique", cat: "sight", lat: 12.8780, lng: -61.1910, approx: true, note: "Famous beach bar on stilts, home of the Blues Festival." },
  { name: "Macaroni Beach", island: "mustique", cat: "beach", lat: 12.8735, lng: -61.1770, approx: true, note: "White sand and surf on the Atlantic side." },

  // Canouan
  { name: "Canouan Airport (CIW)", island: "canouan", cat: "airport", lat: 12.69917, lng: -61.34250, note: "Jet-capable airport for the southern Grenadines." },
  { name: "Charlestown jetty", island: "canouan", cat: "ferry", lat: 12.7080, lng: -61.3330, approx: true, note: "Ferry stop between Kingstown and Union Island." },

  // Mayreau
  { name: "Saline Bay jetty", island: "mayreau", cat: "ferry", lat: 12.6339, lng: -61.3934, approx: true, note: "Ferry stop and a big white beach." },
  { name: "Saltwhistle Bay", island: "mayreau", cat: "beach", lat: 12.6475, lng: -61.3910, approx: true, note: "Calm, curving bay, great for swimming." },

  // Tobago Cays
  { name: "Tobago Cays lagoon", island: "tobago-cays", cat: "nature", lat: 12.63167, lng: -61.35500, note: "Marine park lagoon behind Horseshoe Reef." },
  { name: "Baradal turtle reserve", island: "tobago-cays", cat: "nature", lat: 12.6295, lng: -61.3585, approx: true, note: "Swim with green turtles inside the buoys." },
  { name: "Petit Tabac", island: "tobago-cays", cat: "beach", lat: 12.6235, lng: -61.3395, approx: true, note: "Jack Sparrow's desert island." },

  // Union Island
  { name: "Clifton", island: "union-island", cat: "town", lat: 12.5960, lng: -61.4120, approx: true, note: "Harbour, market, customs and the marine park office." },
  { name: "Union Island Airport (UNI)", island: "union-island", cat: "airport", lat: 12.59861, lng: -61.41472, note: "Flights to Argyle and nearby islands." },
  { name: "Clifton ferry jetty", island: "union-island", cat: "ferry", lat: 12.5945, lng: -61.4105, approx: true, note: "End of the ferry route from Kingstown." },
  { name: "Mount Taboi", island: "union-island", cat: "nature", lat: 12.6000, lng: -61.4330, approx: true, note: "999 ft, the highest point in the Grenadines." },
  { name: "Chatham Bay", island: "union-island", cat: "beach", lat: 12.6010, lng: -61.4470, approx: true, note: "Big, quiet bay on the west coast." },

  // Private islands
  { name: "Palm Island", island: "palm-island", cat: "beach", lat: 12.5850, lng: -61.3950, approx: true, note: "Day visitors welcome at the south end of the west beach." },
  { name: "Petit St. Vincent", island: "petit-st-vincent", cat: "beach", lat: 12.53750, lng: -61.38389, note: "Southernmost island of SVG." }
];
