// Places to stay listed on discoversvg.com (Accommodation section), checked October 2026.
// Island, area, phone and website are as shown on each property's Discover SVG listing.
window.VV_STAY_TYPES = ["Resort", "Hotel", "Apartment", "Guest house", "Inn", "Villa"];

window.VV_STAYS = [
  // Resorts
  { name: "Bequia Beach Hotel", type: "Resort", island: "bequia", area: "", phones: ["+1 784 458 1600", "+1 784 458 1700"], web: "https://www.bequiabeach.com/" },
  { name: "Canouan Estate Resort & Villas", type: "Resort", island: "canouan", area: "", phones: ["+1 784 458 8000"], web: "http://www.canouan-estate.com/" },
  { name: "Mandarin Oriental Canouan", type: "Resort", island: "canouan", area: "Carenage Bay", phones: ["+1 784 458 8000"], web: "https://www.mandarinoriental.com/canouan/" },
  { name: "Sandy Lane Yacht Club & Residences", type: "Resort", island: "canouan", area: "Glossy Bay", phones: ["+1 784 534 9080", "+1 784 431 2828"], web: "https://slycr.com/" },
  { name: "Palm Island Resort", type: "Resort", island: "palm-island", area: "", phones: ["+1 784 458 8824"], web: "http://www.palmislandresortgrenadines.com/" },
  { name: "Spring Gardens Resort", type: "Resort", island: "st-vincent", area: "Spring, Windward Coast", phones: ["+1 784 458 0512"], web: "https://springgardenresort.com/" },
  { name: "Tenuta Chatham Bay", type: "Resort", island: "union-island", area: "Chatham Bay", phones: ["+44 7450 566050"], web: "https://www.tenutachathambay.com/" },
  { name: "Young Island Resort", type: "Resort", island: "young-island", area: "200 yards off St. Vincent", phones: ["+1 784 458 4826"], web: "https://youngisland.com/" },

  // Hotels
  { name: "Beachcombers Hotel", type: "Hotel", island: "st-vincent", area: "Villa", phones: [], web: "" },
  { name: "Blue Lagoon Hotel & Marina", type: "Hotel", island: "st-vincent", area: "Ratho Mill", phones: ["+1 784 458 4308"], web: "https://www.bluelagoonsvg.com/" },
  { name: "Grenadine House", type: "Hotel", island: "st-vincent", area: "Kingstown Park", phones: ["+1 784 458 1800"], web: "http://www.grenadinehouse.com/" },
  { name: "Holiday Inn Express & Suites", type: "Hotel", island: "st-vincent", area: "Diamond", phones: [], web: "" },
  { name: "Hotel Alexandrina", type: "Hotel", island: "st-vincent", area: "Prospect", phones: ["+1 784 456 9788", "+1 784 456 9799"], web: "https://www.hotelalexandrina.com/" },
  { name: "Bequia Plantation Hotel", type: "Hotel", island: "bequia", area: "Belmont Walkway", phones: ["+1 784 534 8677"], web: "https://bequiaplantationhotel.com/" },
  { name: "Spring Hotel", type: "Hotel", island: "bequia", area: "Spring", phones: ["+1 784 454 4260"], web: "https://springhotelbequia.com/" },
  { name: "Kings Landing Hotel", type: "Hotel", island: "union-island", area: "Clifton", phones: ["+1 784 485 8823"], web: "http://www.kingslandinghotel.com/" },

  // Apartments
  { name: "A Taste of Freedom Apartment", type: "Apartment", island: "st-vincent", area: "Brighton", phones: ["+1 784 432 7619"], web: "" },
  { name: "Adams Apartments", type: "Apartment", island: "st-vincent", area: "Arnos Vale", phones: ["+1 784 458 4656"], web: "https://www.adamsapts.com/" },
  { name: "Bascombe Apartments", type: "Apartment", island: "st-vincent", area: "Kingstown", phones: ["+1 784 593 2599", "+1 784 530 9974"], web: "" },
  { name: "Brantie's Place", type: "Apartment", island: "st-vincent", area: "Diamond", phones: ["+1 784 458 4619"], web: "" },
  { name: "Calliandras Apartment Complex", type: "Apartment", island: "st-vincent", area: "Prospect", phones: ["+1 784 456 5339", "+1 784 533 2026"], web: "" },
  { name: "Hillside Apartments", type: "Apartment", island: "st-vincent", area: "Villa", phones: ["+1 784 457 5134", "+1 784 457 4678"], web: "https://www.hillsideapartmentssvg.com/" },
  { name: "Rosewood Apartment Hotel", type: "Apartment", island: "st-vincent", area: "Villa", phones: ["+1 784 457 5051"], web: "https://rosewoodsvg.com/" },
  { name: "Royal Bliss Apartment Suites", type: "Apartment", island: "st-vincent", area: "Kingstown", phones: ["+1 784 495 8888"], web: "" },
  { name: "Sapphire Apartments", type: "Apartment", island: "st-vincent", area: "Arnos Vale", phones: ["+1 784 455 1139"], web: "" },
  { name: "Sunburst Apartments", type: "Apartment", island: "st-vincent", area: "Arnos Vale", phones: ["+1 784 532 9942"], web: "https://sunburst-apartments.business.site/" },
  { name: "Sunset Point Suites", type: "Apartment", island: "st-vincent", area: "Indian Bay", phones: ["+1 784 530 7239", "+1 784 529 9491"], web: "https://www.sunsetpointsuites.com/" },
  { name: "The Edge Apartments", type: "Apartment", island: "st-vincent", area: "Kingstown", phones: ["+1 784 451 2650"], web: "" },

  // Guest houses and inns
  { name: "Stonetrail Villas", type: "Guest house", island: "st-vincent", area: "Indian Bay", phones: ["+1 784 455 8100"], web: "http://www.stonetrailvillas.com/" },
  { name: "Rainbow Castle", type: "Guest house", island: "bequia", area: "Port Elizabeth", phones: ["+1 784 457 3664", "+1 784 531 3897"], web: "https://karibik-guesthouse.com/en/" },
  { name: "Serenity House", type: "Guest house", island: "bequia", area: "Lower Bay", phones: ["+1 784 496 5619"], web: "" },
  { name: "The Lookout Boutique Villa & Apartments", type: "Guest house", island: "bequia", area: "Lawler Hill, Lower Bay", phones: ["+1 784 527 2377"], web: "https://thelookoutbequia.com/" },
  { name: "Sugarapple Inn", type: "Inn", island: "bequia", area: "Friendship Bay", phones: ["+1 784 457 3148"], web: "https://www.sugarapplebequia.com/" },

  // Villas
  { name: "Bay Tree Villa", type: "Villa", island: "bequia", area: "Pea Patch, Spring", phones: ["+1 784 528 7444"], web: "https://www.baytreevilla.com/" },
  { name: "Calmando", type: "Villa", island: "bequia", area: "Crown Point", phones: ["+1 784 526 6927"], web: "" },
  { name: "Ohana House", type: "Villa", island: "bequia", area: "Lower Bay", phones: ["+1 784 534 0255"], web: "" },
  { name: "Open Deck", type: "Villa", island: "bequia", area: "Hamilton", phones: ["+1 784 454 0045"], web: "" },
  { name: "Tropical Hideaway", type: "Villa", island: "bequia", area: "Richmond Hill", phones: ["+1 784 458 3676"], web: "https://tropicalhideawaybequia.com/" }
];
