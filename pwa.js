/*
 * Koochooloo PWA bootstrap — registers the service worker and makes updates
 * land as fast as possible.
 *
 * How fast-updates work:
 *   - We register the SW, then call registration.update() on load, whenever the
 *     app regains focus, and every few minutes. So a freshly deployed version
 *     is detected almost immediately the next time the app is opened/focused.
 *   - The new worker calls skipWaiting() (in sw.js) and takes control, which
 *     fires 'controllerchange'. We then reload the page exactly once so the
 *     user sees the new version without doing anything.
 *   - We skip the auto-reload on the very first install (no previous
 *     controller) so a first visit is never interrupted.
 *
 * Each page loads this with:  <script src="pwa.js" data-sw="sw.js" defer></script>
 * (paths are adjusted per directory; the subfolder app uses "../").
 */
(function () {
  if (!('serviceWorker' in navigator)) return;

  // Resolve the SW URL relative to this script's own location so it works
  // both at the site root and inside subfolders (e.g. multi-choice-game/).
  var self = document.currentScript;
  var swUrl = (self && self.dataset.sw) || 'sw.js';

  var refreshing = false;
  navigator.serviceWorker.addEventListener('controllerchange', function () {
    if (refreshing) return;
    refreshing = true;
    // A new worker took control -> show the new version.
    window.location.reload();
  });

  window.addEventListener('load', function () {
    navigator.serviceWorker.register(swUrl).then(function (reg) {
      // Check for a new version right away, on focus, and periodically.
      var check = function () { reg.update().catch(function () {}); };

      check();
      document.addEventListener('visibilitychange', function () {
        if (document.visibilityState === 'visible') check();
      });
      setInterval(check, 60 * 60 * 1000); // hourly safety net while left open

      reg.addEventListener('updatefound', function () {
        var sw = reg.installing;
        if (!sw) return;
        sw.addEventListener('statechange', function () {
          // New worker is installed and there was already a controller =>
          // this is an update (not a first install). Ask it to activate now;
          // controllerchange (above) then reloads the page.
          if (sw.state === 'installed' && navigator.serviceWorker.controller) {
            sw.postMessage('SKIP_WAITING');
          }
        });
      });
    }).catch(function (e) {
      console.warn('[pwa] SW registration failed:', e);
    });
  });
})();
