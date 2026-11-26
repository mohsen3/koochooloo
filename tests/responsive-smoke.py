"""Run against a local HTTP server: python3 tests/responsive-smoke.py [base URL].

Requires Playwright, Chrome, and `playwright install webkit`.
Uses fresh storage and blocks service workers to test the served files.
"""
import sys
from playwright.sync_api import sync_playwright

BASE = sys.argv[1] if len(sys.argv) > 1 else "http://127.0.0.1:8000/"
# CSS pixels, not panel resolution. Include compact browser viewports and
# both tablet orientations; Android display-size settings vary by device.
SIZES = [(360, 640), (393, 852), (412, 915), (450, 980),
         (640, 340), (852, 393), (915, 412), (980, 450),
         (820, 1180), (1180, 820)]
TYPING_GAMES = {
    "counting-fruits.html", "math-addition-game.html",
    "addition-table.html", "subtraction-table.html",
    "multiplication-table.html", "skip-counting-game.html",
    "english-words.html", "conversation-game.html", "farsi-words.html",
}


def check_catalog(browser):
    for touch in (False, True):
        context = browser.new_context(
            is_mobile=touch, has_touch=touch, service_workers="block")
        page = context.new_page()
        page.goto(BASE)
        toggle = page.locator("#hide-keyboard-games")
        assert toggle.is_checked() == touch
        assert set(page.locator("[data-keyboard]").evaluate_all(
            "els => els.map(e => e.getAttribute('href'))")) == TYPING_GAMES
        assert page.locator('[href="english-words.html"]').is_visible() != touch
        toggle.set_checked(not touch)
        page.reload()
        assert toggle.is_checked() != touch
        toggle.check()
        page.fill("#game-search", "type the word")
        assert page.locator("#no-results").is_visible()
        assert page.locator(".chip:visible").count() == 0
        toggle.uncheck()
        assert page.locator(".game-card:visible").count() == 1
        assert page.locator('[data-count-target="reading"]').inner_text() == "1 game"
        page.fill("#game-search", "trace shapes")
        assert page.locator("#no-results").is_visible()
        page.check("#show-beta-games")
        assert page.locator('[href="tracing-game.html"]').is_visible()
        context.close()


with sync_playwright() as playwright:
    for engine in ("chrome", "webkit"):
        browser = (playwright.chromium.launch(channel="chrome")
                   if engine == "chrome" else playwright.webkit.launch())
        check_catalog(browser)
        context = browser.new_context(
            is_mobile=True, has_touch=True, service_workers="block")
        page = context.new_page()
        errors = []
        page.on("pageerror", lambda error: errors.append(str(error)))
        page.goto(BASE)
        page.check("#show-beta-games")
        links = page.locator(".game-card:visible").evaluate_all(
            "els => els.map(e => e.getAttribute('href'))")
        links.append("farsi-tracing-game.html")
        for width, height in SIZES:
            page.set_viewport_size({"width": width, "height": height})
            for link in links:
                response = page.goto(BASE + link)
                assert response and (response.ok or response.status == 304), (
                    engine, link, response.status if response else "no response")
                page.evaluate("document.fonts.ready")
                page.wait_for_timeout(200)
                dimensions = page.evaluate("""() => [
                    innerWidth, innerHeight,
                    document.documentElement.scrollWidth,
                    document.documentElement.scrollHeight
                ]""")
                assert dimensions[0] <= width + 1, (engine, link, dimensions)
                assert dimensions[2] <= width + 1, (engine, link, dimensions)
                assert dimensions[3] <= height + 2, (engine, link, dimensions)
            print(f"{engine}: {width}×{height}, {len(links)} touch pages passed",
                  flush=True)
        assert not errors, errors
        browser.close()
