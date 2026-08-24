/* ============================================================
   CAC GOOD WORKS ASSEMBLY — 2026 CAMP MEETING
   service-worker.js
   ------------------------------------------------------------
   Caches the core homepage files so the site still loads
   (in a limited form) when the visitor is briefly offline.
   Bump CACHE_NAME whenever you change the cached files so
   returning visitors get the fresh version.
   ============================================================ */

const CACHE_NAME = "camp-meeting-2026-v2";

const CORE_ASSETS = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js",
  "./manifest.json",
  "./logo.png",
  "./icon-192.png",
  "./icon-512.png",
];

/* ---------- INSTALL ---------- */
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(CORE_ASSETS))
      .catch(() => {
        /* If an asset is missing (e.g. images not yet added),
           don't block installation of the rest of the app. */
      })
  );
  self.skipWaiting();
});

/* ---------- ACTIVATE ---------- */
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

/* ---------- FETCH ---------- */
/* Strategy: cache-first for same-origin core assets,
   network-first (with cache fallback) for everything else.
   External resources (fonts, etc.) are left to the browser's
   own HTTP cache rather than cached aggressively here. */
self.addEventListener("fetch", (event) => {
  const request = event.request;

  if (request.method !== "GET") return;

  const url = new URL(request.url);
  const isSameOrigin = url.origin === self.location.origin;

  if (!isSameOrigin) {
    // Let the browser handle cross-origin requests (e.g. Google Fonts)
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) {
        return cached;
      }
      return fetch(request)
        .then((response) => {
          if (response && response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => {
          // Offline and not cached — fall back to the homepage shell
          if (request.mode === "navigate") {
            return caches.match("./index.html");
          }
          return undefined;
        });
    })
  );
});
