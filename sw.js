/*
 * Koochooloo service worker — offline support + fast updates.
 *
 * RELEASING A NEW VERSION:
 *   1. Bump VERSION below (any new string; date-based is easy to read).
 *   2. If you ADDED / RENAMED / REMOVED a file, update the PRECACHE list too.
 *   That's it. Clients pick up the change automatically (see pwa.js):
 *   the new worker installs, calls skipWaiting(), takes control, and the
 *   open page reloads itself once to show the new version.
 *
 * Caching strategy:
 *   - HTML / JSON / JS-data  -> network-first  (fresh when online, cached offline)
 *   - other assets (icons, fonts, css, audio, geojson) -> stale-while-revalidate
 */

const VERSION = '2026-06-24.1';
const CACHE = 'koochooloo-' + VERSION;

// App shell precached on install so the whole app works fully offline.
const PRECACHE = [
  "./",
  "index.html",
  "addition-table.html",
  "addition-touch.html",
  "bilingual-word-puzzle.html",
  "conversation-game.html",
  "counting-fruits.html",
  "english-words.html",
  "farsi-english-match.html",
  "farsi-memory-game.html",
  "farsi-tracing-game.html",
  "farsi-word-puzzle.html",
  "farsi-word-tracing.html",
  "farsi-words.html",
  "greater-than-less-than-game.html",
  "letter-tracing-game.html",
  "math-addition-game.html",
  "math-addition-level2.html",
  "math-addition-three-numbers.html",
  "math-match-game.html",
  "multiplication-table.html",
  "multiplication-touch.html",
  "number-sequence-puzzle-game.html",
  "opposite-words-match.html",
  "paint.html",
  "piano-game.html",
  "skip-counting-game.html",
  "story-puzzle-game.html",
  "subtraction-table.html",
  "toddler-reading-game.html",
  "tracing-game.html",
  "two-digit-addition.html",
  "two-player-games.html",
  "word-explorer.html",
  "word-sorting-bubbles.html",
  "world-map-game.html",
  "manifest.json",
  "pwa.js",
  "public/koodak.ttf",
  "data/basic-phrases-raw.json",
  "data/cinderella.json",
  "data/farsi-word-bank.json",
  "data/goldilocks.json",
  "data/icon-rules.js",
  "data/icon-rules.json",
  "data/level-milestones.js",
  "data/level-milestones.json",
  "data/little_red_riding_hood.json",
  "data/peter_rabbit.json",
  "data/phrase-pairs.js",
  "data/stories.json",
  "data/story-phrases.js",
  "data/the_ugly_duckling.json",
  "data/three_little_pigs.json",
  "data/world-countries.js",
  "multi-choice-game/index.html",
  "multi-choice-game/js/main.js",
  "multi-choice-game/js/manager.js",
  "multi-choice-game/js/questions.js",
  "multi-choice-game/styles.css",
  "icons/apple-touch-icon.png",
  "icons/favicon-32.png",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/icon-maskable-512.png"
];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    // Use {cache:'reload'} so install always fetches fresh copies, never the
    // browser HTTP cache (which could re-introduce a stale file).
    await Promise.all(PRECACHE.map(async (url) => {
      try {
        await cache.add(new Request(url, { cache: 'reload' }));
      } catch (e) {
        // A single missing/failed asset must not abort the whole install.
        console.warn('[sw] precache skip:', url, e);
      }
    }));
    // Activate this new worker immediately instead of waiting for all tabs
    // to close — this is what makes updates land "asap".
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(
      keys.filter((k) => k.startsWith('koochooloo-') && k !== CACHE)
          .map((k) => caches.delete(k))
    );
    await self.clients.claim();
  })());
});

// Allow the page to ask the waiting worker to take over right now.
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});

function isNetworkFirst(request, url) {
  if (request.mode === 'navigate') return true;
  return /\.(html|json)$/i.test(url.pathname) || url.pathname.endsWith('/');
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return; // let cross-origin pass through

  if (isNetworkFirst(request, url)) {
    // Network-first: always try the network so content is fresh when online.
    event.respondWith((async () => {
      try {
        const fresh = await fetch(request);
        const cache = await caches.open(CACHE);
        cache.put(request, fresh.clone());
        return fresh;
      } catch (e) {
        const cached = await caches.match(request, { ignoreSearch: true });
        if (cached) return cached;
        // Offline navigation to an uncached page -> fall back to the launcher.
        if (request.mode === 'navigate') {
          const home = await caches.match('index.html');
          if (home) return home;
        }
        throw e;
      }
    })());
    return;
  }

  // Stale-while-revalidate for static assets: fast from cache, refresh in bg.
  event.respondWith((async () => {
    const cached = await caches.match(request, { ignoreSearch: true });
    const network = fetch(request).then((resp) => {
      if (resp && resp.ok) {
        caches.open(CACHE).then((cache) => cache.put(request, resp.clone()));
      }
      return resp;
    }).catch(() => null);
    return cached || (await network) || Response.error();
  })());
});
