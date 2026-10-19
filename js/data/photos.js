// Photos from Unsplash (free to use under the Unsplash License: https://unsplash.com/license).
// Each is credited on the page where it appears. Swap in your own photos any time by
// changing "src" to a file in the img/ folder.
(function () {
  function u(id) { return "https://images.unsplash.com/" + id + "?auto=format&fit=crop&w=1800&q=70"; }
  window.VV_PHOTOS = {
    youngIsland:  { src: u("photo-1579167149678-76415f24b197"), by: "George Apodaca", page: "https://unsplash.com/photos/DoPuczr3Rw8", alt: "Aerial view of Young Island off the south coast of St. Vincent" },
    svgBeach:     { src: u("photo-1635392509670-9b5a8baccbe8"), by: "Andre Alexander", page: "https://unsplash.com/photos/7uNKhDy12_k", alt: "Sandy beach and clear blue water with a small island in the distance" },
    indianBay:    { src: u("photo-1572017475102-c3a00200563b"), by: "Andre Alexander", page: "https://unsplash.com/photos/N3V2uhtuDCo", alt: "Sunset over the sea from Indian Bay, St. Vincent" },
    stVincent:    { src: u("photo-1676768927915-64955c191d30"), by: "Susy Ross", page: "https://unsplash.com/photos/mZsmWf1qDZA", alt: "Wooden dock on St. Vincent with a small island behind" },
    botanic:      { src: u("photo-1605287920853-8233b5395077"), by: "JR Harris", page: "https://unsplash.com/photos/AklpfxvdQuI", alt: "Flower beds at the Botanic Gardens in Kingstown" },
    bequiaBay:    { src: u("photo-1678815346864-74b41d4e05cb"), by: "Sam Hallett", page: "https://unsplash.com/photos/L2ybAJjmtZM", alt: "Boats anchored in Admiralty Bay, seen from Hamilton, Bequia" },
    bequiaCoast:  { src: u("photo-1629629139905-a900d3252d1d"), by: "David Ballinger", page: "https://unsplash.com/photos/1Uykdf1AOlU", alt: "Drone view of rocks and turquoise sea off Bequia" },
    bequiaLiming: { src: u("photo-1677267921451-05a367affda7"), by: "Sam Hallett", page: "https://unsplash.com/photos/R2n1aA9gYbU", alt: "Restaurant terrace with a sea view at The Liming, Bequia" },
    mustique:     { src: u("photo-1635393581645-c4245bfaccee"), by: "Andre Alexander", page: "https://unsplash.com/photos/cdjuk9dxqPU", alt: "Pool among rocks and trees with a gazebo on Mustique" },
    mayreau:      { src: u("photo-1642009796691-8f0640bce302"), by: "Garance de Reynal", page: "https://unsplash.com/photos/6ufda2jwp2g", alt: "Person standing in shallow water looking at a sailboat in the North Mayreau Channel" },
    tobagoCays:   { src: u("photo-1631129928368-97b260618580"), by: "Bradley Wade", page: "https://unsplash.com/photos/6WM1wrZgbtw", alt: "Green island and rocks in the blue water of the Tobago Cays" },
    petitTabac:   { src: u("photo-1653730442000-c1514b290be3"), by: "Christian Lendl", page: "https://unsplash.com/photos/6BpsiQs0dkk", alt: "Palm trees on the sandy beach of Petit Tabac" },
    psv:          { src: u("photo-1616848849671-f3e18ca9f6ec"), by: "Hugh Whyte", page: "https://unsplash.com/photos/7eEVuwQAy3o", alt: "Aerial view of Petit St. Vincent" }
  };
  // Which photo each island page uses (islands without a free photo get an illustrated header)
  window.VV_ISLAND_PHOTO = {
    "st-vincent": "stVincent", "young-island": "youngIsland", "bequia": "bequiaBay", "mustique": "mustique",
    "mayreau": "mayreau", "tobago-cays": "tobagoCays", "petit-st-vincent": "psv"
  };
})();
