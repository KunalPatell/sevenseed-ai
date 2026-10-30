// Sevenseed service worker.
// Strategy (chosen so deploys always reach users and live data is never frozen):
//   - /api/* and non-GET / cross-origin requests: never touched (network only)
//   - page navigations (HTML): network-first, cached copy only when offline
//   - static assets (css/js/img/fonts): stale-while-revalidate, so the cached copy
//     is served instantly but refreshed in the background for the next load
// Bump CACHE_VERSION on releases that must evict old assets immediately.
const CACHE_VERSION = "v2";
const CACHE_NAME = "sevenseed-" + CACHE_VERSION;

const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/workstations.html",
  "/app.js",
  "/style.css",
  "/ws-shell.js",
  "/ws-shell.css",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      Promise.all(
        STATIC_ASSETS.map((url) =>
          cache.add(url).catch((err) => {
            console.warn("[SW] Cache preload skipped for " + url + ":", err.message);
          })
        )
      )
    )
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((names) =>
        Promise.all(names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n)))
      )
      .then(() => self.clients.claim())
  );
});

function putInCache(request, response) {
  if (!response || response.status !== 200 || response.type !== "basic") return;
  const clone = response.clone();
  caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
}

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // CDNs, fonts, external APIs
  if (url.pathname.startsWith("/api/")) return;     // live data: never cache

  // HTML navigations: network-first so new deploys show up immediately.
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((res) => {
          putInCache(req, res);
          return res;
        })
        .catch(() =>
          caches.match(req).then((cached) => cached || caches.match("/index.html"))
        )
    );
    return;
  }

  // Static assets: stale-while-revalidate.
  event.respondWith(
    caches.match(req).then((cached) => {
      const network = fetch(req)
        .then((res) => {
          putInCache(req, res);
          return res;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
