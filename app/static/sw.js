// Service Worker for VALUEX CA CPV Field Agent PWA
const CACHE_NAME = "valuex-cpv-v1";
const STATIC_ASSETS = [
  "/pwa",
  "/manifest.json",
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

  // Static Assets: Stale While Revalidate
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
