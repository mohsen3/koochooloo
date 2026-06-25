# Repository Guidelines

## Project Structure & Module Organization
This repository is a static collection of educational web games. Most games live as standalone root-level HTML files such as `tracing-game.html`, `story-puzzle-game.html`, and `farsi-word-puzzle.html`. The index page is `index.html`.

Shared content lives in `data/` for JSON and generated JS data files, `stories/` for phrase source markdown, and `public/` for static assets such as fonts. The only multi-file app is `multi-choice-game/`, with `index.html`, `styles.css`, and ES modules under `multi-choice-game/js/`.

The site is an installable, offline-capable PWA. `manifest.json` describes the app, `sw.js` is the service worker (precaches the app shell and serves it offline), `pwa.js` registers the worker and drives auto-updates, and `icons/` holds the app icons. See "Progressive Web App & Releases" below before changing any of these.

## Build, Test, and Development Commands
There is no build pipeline in this repo. Work from the repository root.

- `python3 -m http.server 8000` serves the site locally for browser testing.
- `python3 generate_stories_json.py` rebuilds `data/*.json` and `data/stories.json` from `stories/*.md`.
- `python3 generate_js_data.py` regenerates JS data bundles from the JSON files in `data/`.
- `python3 add_story.py` is a one-off content helper; review its edits before committing.

## Progressive Web App & Releases
The site installs to the home screen and runs fully offline. Three files drive this and must stay in sync:

- `manifest.json` — app metadata and icons.
- `sw.js` — service worker. Holds `VERSION` and the `PRECACHE` list (the app shell cached on install). HTML/JSON use a network-first strategy (fresh when online, cached when offline); other assets use stale-while-revalidate.
- `pwa.js` — registers the worker and makes updates land fast: it calls `registration.update()` on load, on tab focus, and hourly; the new worker `skipWaiting()`s and takes control, and the page reloads itself once so users get the new version without any manual step.

### Releasing a new version — REQUIRED every time you change shipped files
Clients only pick up a changed `sw.js`, so a release is not complete until you bump the worker:

1. **Bump `VERSION` in `sw.js`** to a new string (date-based, e.g. `2026-06-25.1`). This is what triggers every client to update; skipping it means users keep the old cached app.
2. **If you added, renamed, or removed any precached file** (a new game page, data file, icon, etc.), update the `PRECACHE` array in `sw.js` to match. To regenerate the canonical list, see the file globs at the top of `sw.js`'s `PRECACHE` (root `*.html`, `data/*.{json,js,geojson}`, `multi-choice-game/**`, `public/koodak.ttf`, `icons/*`, plus `manifest.json` and `pwa.js`). Audio under `data/audio/` is intentionally NOT precached (runtime-cached on demand).
3. **Every new HTML page must include the PWA wiring**: the `<!-- pwa:head -->` block in `<head>` (theme-color, apple-mobile meta, manifest + icon links) and `<script src="pwa.js" data-sw="sw.js" defer></script>` before `</body>`. Pages in a subfolder must prefix every PWA path with `../` (e.g. `../manifest.json`, `../pwa.js` with `data-sw="../sw.js"`).

### Verifying the PWA
- Serve over `http://localhost` (service workers require localhost or HTTPS; `file://` won't register).
- In Chrome DevTools → Application: confirm the manifest loads, the service worker is "activated", and the cache name matches the current `VERSION`.
- Test offline: load the app online once, then toggle DevTools → Network → Offline and confirm pages still load.
- Test updates: bump `VERSION`, reload, and confirm the page auto-refreshes into the new version (old caches are deleted on activate).
- Do not add external CDN dependencies; they break offline. All assets must be served from this repo (the unused Font Awesome CDN link was removed for this reason; icons are emoji).

## Git Workflow
This is a personal project. By default, work directly on `main`, commit there, and push `main` without creating a separate branch or pull request unless explicitly requested.

## Coding Style & Naming Conventions
Match the style already used in each file instead of reformatting broadly. Use 4 spaces in HTML and Python, and 2 spaces in `multi-choice-game` JavaScript and CSS. Prefer descriptive `const` names, small functions, and simple DOM-focused modules.

Use kebab-case for HTML, CSS, and asset filenames such as `letter-tracing-game.html`. Use snake_case for generated story IDs and JSON filenames such as `little_red_riding_hood.json`.

## Testing Guidelines
There is no automated test suite checked in yet. Validate changes manually in a browser by loading `index.html` and the specific game page you changed. For data updates, rerun the generation scripts and confirm the affected pages still load without console errors.

## Layout & Device Requirements
Games should default to using the full page without vertical or horizontal scrolling during normal play. Design layouts to fit within the viewport first, then degrade gracefully only when content genuinely cannot be compressed further.

Disable browser zoom in and zoom out on game pages, typically through the viewport meta tag and touch-action choices appropriate for the interaction model. Do not rely on pinch zoom for core usability.

Optimize interaction, sizing, and touch targets for iPad first, then verify the same pages still work well on other tablets, laptops, and phones. Treat tablet landscape and portrait modes as primary layouts, with desktop and mobile as required secondary targets.

The UI should be simple, elegant, and minimal. Positive feedback should feel bold and encouraging, while negative feedback when a kid fails to solve something should stay muted and minimal.

Nothing on the page should be selectable. Prevent text and other UI elements from being highlightable or copy-selectable during normal play.

## Special Instructions for Farsi
Always load `public/koodak.ttf` for Persian UI and content. Use `url("public/koodak.ttf")` from root pages and `url("../public/koodak.ttf")` from `multi-choice-game/`, then put `"Koodak"` first in the font stack.

Use Persian code points, not Arabic lookalikes: `ک` (`U+06A9`) instead of `ك` (`U+0643`), and `ی` (`U+06CC`) instead of `ي` (`U+064A`) or `ى` (`U+0649`). When Persian digits are needed in UI text, use `۰۱۲۳۴۵۶۷۸۹`.

Persian letters are context-shaped. In logical word order, `previous only` means a letter connects to the letter before it, and `both` means it can connect to both neighbors. No standard Persian letter connects to the next letter only.

`previous only`: `ا`, `آ`, `د`, `ذ`, `ر`, `ز`, `ژ`, `و`

`both`: `ب`, `پ`, `ت`, `ث`, `ج`, `چ`, `ح`, `خ`, `س`, `ش`, `ص`, `ض`, `ط`, `ظ`, `ع`, `غ`, `ف`, `ق`, `ک`, `گ`, `ل`, `م`, `ن`, `ه`, `ی`

Standalone hamza (`ء`) is non-joining and is not part of the base 32-letter Persian alphabet.

## Two Player Games
When working on the two-player games feature (`two-player-games.html`) or adding new games to its picker, follow the dedicated guidelines in `~/.claude/projects/-Users-mohsen-Documents-Dev-koochooloo/memory/two_player_game_guidelines.md`. They cover the names → picker → game flow, persistence rules, per-game requirements (turn indicator, undo/redo, celebration, session win counts, mute), and how to add a new game.

## Save & Resume

Games should save the current level/progress in localStorage and resume from there on reload. Include a small reset button labelled `↻` that clears saved progress and restarts from level 1.

## Randomness & Difficulty Curve

Shuffle the order of questions/levels each time a game starts so playthroughs feel different. Overall difficulty should still be consistent across runs and should increase gradually as the player advances.
