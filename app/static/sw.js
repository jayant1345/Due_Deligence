// Service Worker for VALUEX CA CPV Field Agent PWA
// Bump on every release that changes the PWA page so old cached copies are purged.
const CACHE_NAME = "valuex-cpv-v9";
const STATIC_ASSETS = [
  "/pwa",
  "/manifest.json",
  "/static/geofence-map.js?v=3",
  "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css",
  "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js",
  "https://fonts.googleapis.com/css2?family=Hanken+Grotesk:ital,wght@0,300..900;1,300..900&family=JetBrains+Mono:ital,wght@0,400..800;1,400..800&family=Space+Grotesk:wght@400..700&display=swap",
  "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap",
  "https://cdn.tailwindcss.com?plugins=forms,container-queries"
];

// Install Event
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate Event
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Strategy: Network First with Cache Fallback for dynamic views, Cache First for static fonts/scripts
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // For API calls, try network first, handle offline queue in client JS
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(
      fetch(event.request).catch(() => {
        return new Response(
          JSON.stringify({
            status: "offline_queued",
            message: "Offline mode active. Telemetry stored locally in PWA queue.",
          }),
          {
            headers: { "Content-Type": "application/json" },
            status: 202,
          }
        );
      })
    );
    return;
  }

  // App pages, this app's own JS (agent-pwa.js, geofence-map.js), and case-scanned
  // images/photos: Network First, cache only as the offline fallback — a stale page, stale
  // app logic, or stale document image must never be shown to a field agent as current. This
  // used to fall through to the "Stale While Revalidate" bucket below, which serves whatever
  // was cached from a PREVIOUS visit immediately and only refreshes the cache in the
  // background for the NEXT load - meaning every bug fix shipped to agent-pwa.js silently
  // took one extra PWA visit to actually reach a field agent's phone, even after the server
  // had the fix live.
  if (
    event.request.mode === "navigate" ||
    url.pathname.startsWith("/static/extracted_pages/") ||
    url.pathname.startsWith("/storage/") ||
    url.pathname === "/static/agent-pwa.js" ||
    url.pathname === "/static/geofence-map.js"
  ) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200 && event.request.method === "GET") {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return networkResponse;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Fonts / CDN scripts: Stale While Revalidate
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, networkResponse.clone()));
          }
          return networkResponse;
        })
        .catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});
