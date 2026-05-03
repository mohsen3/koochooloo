# Repository Guidelines

## Project Structure & Module Organization
This repository is a static collection of educational web games. Most games live as standalone root-level HTML files such as `tracing-game.html`, `story-puzzle-game.html`, and `farsi-word-puzzle.html`. The index page is `index.html`.

Shared content lives in `data/` for JSON and generated JS data files, `stories/` for phrase source markdown, and `public/` for static assets such as fonts. The only multi-file app is `multi-choice-game/`, with `index.html`, `styles.css`, and ES modules under `multi-choice-game/js/`.

## Build, Test, and Development Commands
There is no build pipeline in this repo. Work from the repository root.

- `python3 -m http.server 8000` serves the site locally for browser testing.
- `python3 generate_stories_json.py` rebuilds `data/*.json` and `data/stories.json` from `stories/*.md`.
- `python3 generate_js_data.py` regenerates JS data bundles from the JSON files in `data/`.
- `python3 add_story.py` is a one-off content helper; review its edits before committing.

## Coding Style & Naming Conventions
Match the style already used in each file instead of reformatting broadly. Use 4 spaces in HTML and Python, and 2 spaces in `multi-choice-game` JavaScript and CSS. Prefer descriptive `const` names, small functions, and simple DOM-focused modules.

Use kebab-case for HTML, CSS, and asset filenames such as `letter-tracing-game.html`. Use snake_case for generated story IDs and JSON filenames such as `little_red_riding_hood.json`.

## Testing Guidelines
There is no automated test suite checked in yet. Validate changes manually in a browser by loading `index.html` and the specific game page you changed. For data updates, rerun the generation scripts and confirm the affected pages still load without console errors.

## Layout & Device Requirements
Games should default to using the full page without vertical or horizontal scrolling during normal play. Design layouts to fit within the viewport first, then degrade gracefully only when content genuinely cannot be compressed further.

Disable browser zoom in and zoom out on game pages, typically through the viewport meta tag and touch-action choices appropriate for the interaction model. Do not rely on pinch zoom for core usability.

Optimize interaction, sizing, and touch targets for iPad first, then verify the same pages still work well on other tablets, laptops, and phones. Treat tablet landscape and portrait modes as primary layouts, with desktop and mobile as required secondary targets.

## Special Instructions for Farsi
Always load `public/koodak.ttf` for Persian UI and content. Use `url("public/koodak.ttf")` from root pages and `url("../public/koodak.ttf")` from `multi-choice-game/`, then put `"Koodak"` first in the font stack.

Use Persian code points, not Arabic lookalikes: `ک` (`U+06A9`) instead of `ك` (`U+0643`), and `ی` (`U+06CC`) instead of `ي` (`U+064A`) or `ى` (`U+0649`). When Persian digits are needed in UI text, use `۰۱۲۳۴۵۶۷۸۹`.

Persian letters are context-shaped. In logical word order, `previous only` means a letter connects to the letter before it, and `both` means it can connect to both neighbors. No standard Persian letter connects to the next letter only.

`previous only`: `ا`, `آ`, `د`, `ذ`, `ر`, `ز`, `ژ`, `و`

`both`: `ب`, `پ`, `ت`, `ث`, `ج`, `چ`, `ح`, `خ`, `س`, `ش`, `ص`, `ض`, `ط`, `ظ`, `ع`, `غ`, `ف`, `ق`, `ک`, `گ`, `ل`, `م`, `ن`, `ه`, `ی`

Standalone hamza (`ء`) is non-joining and is not part of the base 32-letter Persian alphabet.
