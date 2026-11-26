# Koochooloo

[Play the games](https://mohsen3.github.io/koochooloo/)

The catalog's **Hide keyboard games** filter defaults on for touch devices and
remembers your choice. Browsers cannot reliably detect physical keyboards;
turn the filter off when using an attached keyboard. Games with on-screen
keypads or optional name fields remain available.

## Responsive checks

Serve the site with `python3 -m http.server 8000`, then run
`python3 tests/responsive-smoke.py` in an environment with Playwright installed
(`pip install playwright` and `playwright install webkit`; Chrome is also needed).
This checks catalog filters and touch-page overflow in Chrome and WebKit across
phone and iPad viewport sizes, including compact landscape browser windows.
It is emulation, not a substitute for checking the physical devices.
