"""Security checks for Vincy Vibes.

Runs every page in a real browser (Chromium via Playwright) and checks that:
  1. No page breaks its own Content Security Policy (CSP).
  2. Leaflet only runs if it matches its Subresource Integrity (SRI) hash:
     a tampered copy from the CDN is blocked.
  3. Script injection through every URL parameter the site reads is neutralised.
  4. Even if injected HTML did reach the page, the CSP blocks inline code.

Setup (once):
    pip install playwright
    python -m playwright install chromium

Run from the repo folder, with a local server in a second window:
    python -m http.server 8765
    python tests/security_check.py
"""
import asyncio
import os
import sys
from playwright.async_api import async_playwright

BASE = "http://localhost:8765/"
LEAFLET_JS = "unpkg.com/leaflet@1.9.4/dist/leaflet.js"

PAGES = [
    "index.html", "islands.html", "island.html?id=bequia", "map.html", "stay.html",
    "things-to-do.html", "planner.html",
    "planner.html?island=bequia&from=st-vincent&date=2026-10-24&pace=full&likes=beach&seed=4",
    "quiz.html", "quiz.html?result=mayreau", "culture.html", "festivals.html",
    "ferries.html", "taxis.html", "getting-here.html",
]

# '"><img src=x onerror=alert(1)><script>window.PWNED=1</script>' URL-encoded
X = "%22%3E%3Cimg%20src%3Dx%20onerror%3Dalert(1)%3E%3Cscript%3Ewindow.PWNED%3D1%3C%2Fscript%3E"
PROBES = [
    f"island.html?id={X}", f"quiz.html?result={X}", f"stay.html?island={X}",
    f"taxis.html?island={X}", f"things-to-do.html?island={X}", f"index.html?sail={X}",
    f"planner.html?island={X}&from={X}&date={X}&pace={X}&likes={X}&seed={X}&picks={X}",
    f"planner.html?island=bequia&from={X}&date=2026-13-45&pace=full&likes=beach,{X}&seed=abc&picks=99999.{X}",
]

tamper = {"on": False}
# Optional: point LEAFLET_DIR at a local copy of leaflet@1.9.4/dist to run offline.
LOCAL = os.environ.get("LEAFLET_DIR")
CORS = {"Access-Control-Allow-Origin": "*"}


async def route(r):
    url = r.request.url
    if "unpkg.com/leaflet@1.9.4/dist/" in url and LOCAL:
        name = url.split("/dist/")[1]
        body = open(os.path.join(LOCAL, name), "rb").read()
        if tamper["on"] and LEAFLET_JS in url:
            body += b"\nwindow.PWNED=1;"
        kind = "application/javascript" if name.endswith(".js") else "text/css"
        return await r.fulfill(body=body, content_type=kind, headers=CORS)
    if LEAFLET_JS in url and tamper["on"]:
        real = await r.fetch()
        body = (await real.body()) + b"\nwindow.PWNED=1;"
        return await r.fulfill(response=real, body=body)
    if not LOCAL or "localhost" in url:
        return await r.continue_()
    return await r.abort()  # offline mode: skip fonts and map tiles


async def main():
    failures = []

    def check(ok, label):
        print(("PASS  " if ok else "FAIL  ") + label)
        if not ok:
            failures.append(label)

    async with async_playwright() as p:
        browser = await p.chromium.launch()
        # Service workers are blocked so every request reaches the page directly and can be checked.
        page = await (await browser.new_context(service_workers="block")).new_page()
        await page.route("**/*", route)
        msgs, dialogs = [], []
        page.on("console", lambda m: msgs.append(m.text))
        page.on("pageerror", lambda e: msgs.append("PAGEERROR " + str(e)))
        page.on("dialog", lambda d: (dialogs.append(d.message), asyncio.ensure_future(d.dismiss())))
        await page.add_init_script(
            "document.addEventListener('securitypolicyviolation',"
            " e => console.log('CSP-VIOLATION ' + e.violatedDirective + ' ' + e.blockedURI))")

        print("1. Every page follows its Content Security Policy")
        for path in PAGES:
            msgs.clear()
            await page.goto(BASE + path)
            await page.wait_for_timeout(800)
            issues = [m for m in msgs if "CSP-VIOLATION" in m or "PAGEERROR" in m or "integrity" in m.lower()]
            check(not issues, f"{path} {issues[:2] if issues else ''}")

        print("\n2. Subresource Integrity on Leaflet")
        await page.goto(BASE + "map.html")
        await page.wait_for_timeout(1000)
        check(await page.evaluate("!!window.L"), "genuine Leaflet loads")
        tamper["on"] = True
        await page.goto(BASE + "map.html")
        await page.wait_for_timeout(1000)
        tamper["on"] = False
        check(not await page.evaluate("!!window.L || !!window.PWNED"), "tampered Leaflet is blocked")

        print("\n3. Script injection through URL parameters")
        for path in PROBES:
            await page.goto(BASE + path)
            await page.wait_for_timeout(600)
            pwned = await page.evaluate("!!window.PWNED")
            nodes = await page.evaluate("document.querySelectorAll('img[src=x], script:not([src])').length")
            check(not pwned and nodes == 0, path.split("?")[0] + " with a malicious " + path.split("?")[1].split("=")[0] + "...")
        check(not dialogs, "no alert() ever ran")

        print("\n4. The CSP blocks inline code, as a second line of defence")
        await page.goto(BASE + "index.html")
        await page.evaluate(
            "document.body.insertAdjacentHTML('beforeend', '<img src=x onerror=\"window.PWNED=1\">');"
            "const s = document.createElement('script'); s.textContent = 'window.PWNED=2'; document.body.appendChild(s);")
        await page.wait_for_timeout(500)
        check(not await page.evaluate("window.PWNED || false"), "injected onerror handler and inline <script> did not run")
        await browser.close()

    print(f"\n{'All checks passed.' if not failures else str(len(failures)) + ' check(s) failed.'}")
    sys.exit(1 if failures else 0)


asyncio.run(main())
