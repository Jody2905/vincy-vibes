# Security policy

Vincy Vibes is a static site (HTML, CSS and JavaScript on GitHub Pages). It has no server code, no accounts, no forms that send data anywhere, and no cookies. The only things it stores are your bucket-list ticks, kept in your own browser's local storage. "Near me" uses your location inside the browser only, and it is never sent anywhere.

## Reporting a vulnerability

Please report security issues privately through **[GitHub's private vulnerability reporting](https://github.com/Jody2905/vincy-vibes/security/advisories/new)** rather than opening a public issue. I'll aim to reply within 7 days.

Helpful details: the page and URL, the browser, steps to reproduce, and what an attacker could do with it.

## What's in place

| Control | Why |
|---|---|
| **Content Security Policy** on every page | Scripts only run from this site and one pinned Leaflet file. Inline scripts and `on…=` handlers are blocked, so injected HTML can't run code. Data requests (`connect-src`) can only go to this site and Open-Meteo's weather APIs. No plugins (`object-src 'none'`), and `<base>` and form targets are locked to this site. |
| **Service worker scope** | The offline service worker only caches this site's own files, the pinned Leaflet files (still checked against their integrity hashes) and Google Fonts. It never caches weather or map tiles, and it handles only GET requests. |
| **Weather requests** | Sent with `credentials: "omit"` and no referrer, and they carry only an island's coordinates, never the visitor's location. |
| **Subresource Integrity** on Leaflet | The map library comes from the unpkg CDN with a SHA-256 hash. If the CDN copy is ever changed, the browser refuses to run it. |
| **Escaping and allow-lists** | All data is HTML-escaped before it reaches the page. Every URL parameter the site reads (`?id=`, `?island=`, `?result=`, the planner's options) is checked against a list of known values or a strict format before use. |
| **Referrer policy** | `strict-origin-when-cross-origin`, so outside sites (maps, fonts) never see full page URLs. |
| **Safe external links** | Links that open a new tab use `rel="noopener"`. |
| **Automated checks** | `tests/security_check.py` loads every page in a real browser and tests the CSP, the integrity check (with a deliberately tampered Leaflet), and script injection through every URL parameter. |

## Known limits

- GitHub Pages doesn't allow custom HTTP headers, so the CSP is set with a `<meta>` tag. That means `frame-ancestors` (clickjacking protection), `Permissions-Policy` and HSTS settings can't be added here. GitHub Pages already serves everything over HTTPS. The site has no logins or actions worth clickjacking.
- `style-src` allows `'unsafe-inline'`, because the illustrations and some layouts use inline styles. Inline styles can't run code, and scripts stay locked down.
- Google Fonts' stylesheet is generated per browser, so it can't carry an integrity hash. It's limited by the CSP to `fonts.googleapis.com` and `fonts.gstatic.com`.
- `.well-known/security.txt` is published at the project path. The standard location is the domain root (`jody2905.github.io/.well-known/`), which belongs to a separate repository.
