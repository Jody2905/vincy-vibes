// Ferry timetables as published at https://discoversvg.com/travel/ferry-schedules/ (checked October 2026).
// A few times on the official page are printed without am/pm or with an obvious slip
// (for example "12:30 am" for a midday sailing). Those are marked fixed: true and use the likely time.
// Days: 0 = Sunday ... 6 = Saturday.
window.VV_FERRIES = {
  // Simple Kingstown <-> Bequia shuttles, used for the "next ferry" countdown.
  shuttles: [
    {
      operator: "Bequia Express",
      route: ["Kingstown", "Bequia"],
      times: {
        "Bequia": {
          1: ["06:30", "07:30", "09:30", "13:00", "16:00"],
          2: ["06:30", "07:30", "09:30", "13:00", "16:00"],
          3: ["06:30", "07:30", "09:30", "13:00", "16:00"],
          4: ["06:30", "07:30", "09:30", "13:00", "16:00"],
          5: ["06:30", "07:30", "09:30", "13:00", "16:00"],
          6: ["06:30", "07:30", "09:30", "13:00", "16:00"],
          0: ["06:30", "11:00*", "16:00"]
        },
        "Kingstown": {
          1: ["08:00", "09:30", "13:00", "16:00", "17:00"],
          2: ["08:00", "09:30", "13:00", "16:00", "17:00"],
          3: ["08:00", "09:30", "13:00", "16:00", "17:00"],
          4: ["08:00", "09:30", "13:00", "16:00", "17:00"],
          5: ["08:00", "09:30", "13:00", "16:00", "17:00"],
          6: ["08:00", "09:30", "12:30*", "16:30", "17:00"],
          0: ["08:00", "16:30*", "17:00"]
        }
      }
    },
    {
      operator: "Bequia Fast Ferry",
      route: ["Kingstown", "Bequia"],
      note: "Sunday times also apply on public holidays. The published timetable lists Monday and Saturday only for weekdays.",
      times: {
        "Bequia": {
          1: ["06:30", "08:45", "12:00", "16:15"],
          6: ["06:30", "08:45", "12:00", "16:15"],
          0: ["07:00", "16:15"]
        },
        "Kingstown": {
          1: ["07:45", "10:00", "15:00", "17:15"],
          6: ["07:45", "10:00", "15:00", "17:15"],
          0: ["08:15", "17:15"]
        }
      }
    }
  ],

  // Southern Grenadines routes (Kingstown - Bequia - Canouan - Mayreau - Union Island).
  southern: [
    {
      operator: "MV Gem Star II",
      sailings: [
        { day: 1, depart: "11:30", from: "Kingstown", stops: ["Kingstown", "Canouan", "Mayreau", "Union Island"] },
        { day: 2, depart: "06:00", from: "Union Island", stops: ["Union Island", "Mayreau", "Canouan", "Kingstown"] },
        { day: 3, depart: "10:30", from: "Kingstown", stops: ["Kingstown", "Canouan", "Mayreau", "Union Island", "Canouan", "Kingstown"], note: "Same-day return" },
        { day: 4, depart: "11:30", from: "Kingstown", stops: ["Kingstown", "Canouan", "Mayreau", "Union Island"] },
        { day: 5, depart: "06:00", from: "Union Island", stops: ["Union Island", "Mayreau", "Canouan", "Kingstown"] },
        { day: 6, depart: "11:30", from: "Kingstown", stops: ["Kingstown", "Canouan", "Mayreau", "Union Island"] },
        { day: 0, depart: "07:00", from: "Union Island", stops: ["Union Island", "Mayreau", "Canouan", "Bequia", "Kingstown"] }
      ]
    },
    {
      operator: "Jaden Sun (fast ferry)",
      sailings: [
        { day: 0, depart: "15:30", from: "Kingstown", stops: ["Kingstown 3:30pm", "Bequia 4:15pm", "Canouan 5:25pm", "Mayreau", "Union Island"] },
        { day: 1, depart: "06:30", from: "Union Island", stops: ["Union Island 6:30am", "Mayreau 6:45am", "Canouan 7:15am", "Bequia 8:30am*", "Kingstown"] },
        { day: 1, depart: "15:30", from: "Kingstown", stops: ["Kingstown 3:30pm", "Bequia 4:15pm", "Canouan 5:25pm", "Mayreau", "Union Island"] },
        { day: 3, depart: "06:30", from: "Union Island", stops: ["Union Island 6:30am", "Mayreau 6:45am", "Canouan 7:15am", "Bequia", "Kingstown"] },
        { day: 5, depart: "09:00", from: "Kingstown", stops: ["Kingstown 9:00am", "Bequia 9:30am", "Canouan 11:00am", "Mayreau 11:30am*", "Union Island"] },
        { day: 5, depart: "15:30", from: "Union Island", stops: ["Union Island 3:30pm", "Mayreau 3:45pm", "Canouan 4:15pm", "Bequia 5:30pm", "Kingstown"] }
      ]
    }
  ]
};
