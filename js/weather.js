// Live weather and sea conditions from Open-Meteo (free, no key; CC BY 4.0).
// Forecast: api.open-meteo.com. Waves and sea temperature: marine-api.open-meteo.com (DWD ICON Wave).
// Results are cached in the browser for 30 minutes, and the last result is shown if the visitor goes offline.
(function () {
  "use strict";
  var VV = window.VV;
  var TTL = 30 * 60 * 1000;
  var TZ = "America%2FSt_Vincent";

  var CODES = {
    0: ["Clear sky", "sun"], 1: ["Mainly clear", "sun"], 2: ["Partly cloudy", "part"], 3: ["Overcast", "cloud"],
    45: ["Fog", "cloud"], 48: ["Fog", "cloud"],
    51: ["Light drizzle", "rain"], 53: ["Drizzle", "rain"], 55: ["Heavy drizzle", "rain"],
    61: ["Light rain", "rain"], 63: ["Rain", "rain"], 65: ["Heavy rain", "rain"],
    80: ["Light showers", "shower"], 81: ["Showers", "shower"], 82: ["Heavy showers", "shower"],
    95: ["Thunderstorm", "storm"], 96: ["Thunderstorm", "storm"], 97: ["Heavy thunderstorm", "storm"], 99: ["Thunderstorm", "storm"]
  };
  var ICON = {
    sun: '<circle cx="24" cy="24" r="9" fill="#FCD116"/><g stroke="#FF9F1C" stroke-width="3" stroke-linecap="round"><path d="M24 5v5M24 38v5M5 24h5M38 24h5M10.6 10.6l3.5 3.5M33.9 33.9l3.5 3.5M10.6 37.4l3.5-3.5M33.9 14.1l3.5-3.5"/></g>',
    part: '<circle cx="18" cy="18" r="8" fill="#FCD116"/><path d="M15 38h20a7 7 0 0 0 0-14 10 10 0 0 0-19 3 6 6 0 0 0-1 11z" fill="#FFFFFF" stroke="#9AB0C0" stroke-width="2"/>',
    cloud: '<path d="M12 36h24a8 8 0 0 0 0-16 11 11 0 0 0-21 3 7 7 0 0 0-3 13z" fill="#DCE6EC" stroke="#9AB0C0" stroke-width="2"/>',
    rain: '<path d="M12 30h24a8 8 0 0 0 0-16 11 11 0 0 0-21 3 7 7 0 0 0-3 13z" fill="#DCE6EC" stroke="#9AB0C0" stroke-width="2"/><g stroke="#10A7B8" stroke-width="3" stroke-linecap="round"><path d="M17 35l-2 6M25 35l-2 6M33 35l-2 6"/></g>',
    shower: '<circle cx="34" cy="13" r="6" fill="#FCD116"/><path d="M10 30h22a8 8 0 0 0 0-16 11 11 0 0 0-19 3 7 7 0 0 0-3 13z" fill="#DCE6EC" stroke="#9AB0C0" stroke-width="2"/><g stroke="#10A7B8" stroke-width="3" stroke-linecap="round"><path d="M16 35l-2 6M24 35l-2 6"/></g>',
    storm: '<path d="M12 28h24a8 8 0 0 0 0-16 11 11 0 0 0-21 3 7 7 0 0 0-3 13z" fill="#9AB0C0" stroke="#6E8596" stroke-width="2"/><path d="M25 30l-6 9h6l-3 8 9-11h-6l3-6z" fill="#FCD116"/>'
  };

  function code(c) { return CODES[c] || ["Mixed conditions", "part"]; }
  VV.weatherIcon = function (c) {
    return '<svg viewBox="0 0 48 48" aria-hidden="true">' + ICON[code(c)[1]] + "</svg>";
  };
  VV.weatherText = function (c) { return code(c)[0]; };

  var DIRS = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  VV.compass = function (deg) { return DIRS[Math.round(((deg % 360) + 360) % 360 / 45) % 8]; };

  // Beaufort scale words for wind in knots
  VV.windWord = function (kn) {
    if (kn < 1) return "Calm";
    if (kn < 4) return "Light air";
    if (kn < 7) return "Light breeze";
    if (kn < 11) return "Gentle breeze";
    if (kn < 17) return "Moderate breeze";
    if (kn < 22) return "Fresh breeze";
    if (kn < 28) return "Strong breeze";
    if (kn < 34) return "Near gale";
    return "Gale";
  };
  // Douglas sea scale words for wave height in metres
  VV.seaWord = function (m) {
    if (m < 0.1) return "Calm";
    if (m < 0.5) return "Smooth";
    if (m < 1.25) return "Slight";
    if (m < 2.5) return "Moderate";
    if (m < 4) return "Rough";
    return "Very rough";
  };
  VV.cToF = function (c) { return Math.round(c * 9 / 5 + 32); };
  VV.mToFt = function (m) { return Math.round(m * 3.281 * 10) / 10; };
  VV.clock = function (iso) { // "2026-10-19T06:03" -> "6:03am"
    var t = String(iso || "").split("T")[1];
    return t ? VV.formatTime(t.slice(0, 5)) : "";
  };

  function get(url) {
    return fetch(url, { credentials: "omit", referrerPolicy: "no-referrer" }).then(function (r) {
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.json();
    });
  }

  /**
   * Weather for a point. Resolves to {now, days, marineOk, fetched, stale}.
   * days[i] = {date, code, max, min, rain, windMax, uv, sunrise, sunset, waveMax}
   */
  VV.weather = function (lat, lng) {
    var key = "vv-wx-" + lat.toFixed(3) + "," + lng.toFixed(3);
    var cached = VV.store.get(key, null);
    if (cached && Date.now() - cached.fetched < TTL) return Promise.resolve(cached);

    var ll = "latitude=" + lat + "&longitude=" + lng;
    var f = "https://api.open-meteo.com/v1/forecast?" + ll +
      "&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m,wind_gusts_10m" +
      "&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max,uv_index_max,sunrise,sunset" +
      "&wind_speed_unit=kn&timezone=" + TZ + "&forecast_days=7";
    var m = "https://marine-api.open-meteo.com/v1/marine?" + ll +
      "&current=wave_height,wave_direction,wave_period,sea_surface_temperature" +
      "&daily=wave_height_max&timezone=" + TZ + "&forecast_days=7";

    return Promise.all([get(f), get(m).catch(function () { return null; })]).then(function (res) {
      var w = res[0], s = res[1], d = w.daily || {};
      var sc = s && s.current, sd = s && s.daily;
      var out = {
        fetched: Date.now(),
        marineOk: !!(sc && sc.wave_height != null),
        now: {
          temp: w.current.temperature_2m, feels: w.current.apparent_temperature, code: w.current.weather_code,
          wind: w.current.wind_speed_10m, dir: w.current.wind_direction_10m, gust: w.current.wind_gusts_10m,
          wave: sc ? sc.wave_height : null, waveDir: sc ? sc.wave_direction : null,
          period: sc ? sc.wave_period : null, sst: sc ? sc.sea_surface_temperature : null
        },
        days: (d.time || []).map(function (date, i) {
          return {
            date: date, code: d.weather_code[i], max: d.temperature_2m_max[i], min: d.temperature_2m_min[i],
            rain: d.precipitation_probability_max[i], windMax: d.wind_speed_10m_max[i], uv: d.uv_index_max[i],
            sunrise: d.sunrise[i], sunset: d.sunset[i],
            waveMax: sd && sd.wave_height_max && sd.time[i] === date ? sd.wave_height_max[i] : null
          };
        })
      };
      VV.store.set(key, out);
      return out;
    }, function (err) {
      if (cached) { cached.stale = true; return cached; }
      throw err;
    });
  };

  VV.ago = function (t) {
    var mins = Math.round((Date.now() - t) / 60000);
    if (mins < 2) return "just now";
    if (mins < 60) return mins + " minutes ago";
    var h = Math.round(mins / 60);
    return h < 48 ? h + (h === 1 ? " hour ago" : " hours ago") : Math.round(h / 24) + " days ago";
  };

  VV.WX_CREDIT = '<a href="https://open-meteo.com/" target="_blank" rel="noopener">Weather data by Open-Meteo.com</a>' +
    ' (CC BY 4.0). Waves from the DWD ICON Wave model. Not for navigation.';

  /** Full widget for island pages */
  VV.weatherWidget = function (el, isl) {
    el.innerHTML = '<p class="wx-loading">Checking the weather on ' + VV.esc(isl.name) + "…</p>";
    VV.weather(isl.lat, isl.lng).then(function (w) {
      var n = w.now, t = w.days[0] || {};
      var sea = w.marineOk
        ? '<div class="wx-cell"><span class="wx-k">Sea</span><strong>' + VV.esc(VV.seaWord(n.wave)) + "</strong><span>" +
          n.wave.toFixed(1) + " m (" + VV.mToFt(n.wave) + " ft) waves" + (n.period ? ", every " + Math.round(n.period) + " s" : "") + "</span></div>" +
          (n.sst != null ? '<div class="wx-cell"><span class="wx-k">Sea temperature</span><strong>' + Math.round(n.sst) + "°C</strong><span>" + VV.cToF(n.sst) + "°F</span></div>" : "")
        : "";
      el.innerHTML =
        '<div class="wx-now">' + VV.weatherIcon(n.code) +
          '<div><strong class="wx-temp">' + Math.round(n.temp) + "°C</strong> <span class=\"wx-f\">" + VV.cToF(n.temp) + "°F</span>" +
          '<p class="wx-desc">' + VV.esc(VV.weatherText(n.code)) + ", feels like " + Math.round(n.feels) + "°C</p></div></div>" +
        '<div class="wx-grid">' +
          '<div class="wx-cell"><span class="wx-k">Wind</span><strong>' + VV.esc(VV.windWord(n.wind)) + "</strong><span>" +
            Math.round(n.wind) + " knots from the " + VV.compass(n.dir) + ", gusts " + Math.round(n.gust) + "</span></div>" +
          sea +
          '<div class="wx-cell"><span class="wx-k">Today</span><strong>' + Math.round(t.max) + "° / " + Math.round(t.min) + "°C</strong><span>" +
            (t.rain != null ? t.rain + "% chance of rain" : "") + "</span></div>" +
          '<div class="wx-cell"><span class="wx-k">Sun</span><strong>' + VV.clock(t.sunrise) + " – " + VV.clock(t.sunset) + "</strong><span>" +
            (t.uv != null ? "UV index " + Math.round(t.uv) + (t.uv >= 8 ? ", very high: cover up" : t.uv >= 6 ? ", high" : "") : "") + "</span></div>" +
        "</div>" +
        '<ol class="wx-week" aria-label="Next few days">' + w.days.slice(1, 6).map(function (d) {
          var day = new Date(d.date + "T12:00:00Z");
          return "<li><span>" + VV.dayName(day.getUTCDay()).slice(0, 3) + "</span>" + VV.weatherIcon(d.code) +
            "<strong>" + Math.round(d.max) + "°</strong><small>" + (d.rain != null ? d.rain + "%" : "") + "</small></li>";
        }).join("") + "</ol>" +
        '<p class="wx-credit">' + (w.stale ? "Offline: showing conditions from " : "Updated ") + VV.ago(w.fetched) + ". " + VV.WX_CREDIT + "</p>";
    }).catch(function () {
      el.innerHTML = '<p class="wx-loading">The live weather isn\'t available right now. The dry season runs roughly January to May; June to December is wetter, with passing showers.</p>';
    });
  };
})();
