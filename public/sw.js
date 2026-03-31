const CACHE_NAME = 'vidaudrem-v2'; // Version bump for immediate update
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/logo.svg',
  '/fonts/outfit-v15-latin-600.woff2',
  '/fonts/outfit-v15-latin-700.woff2',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // Clear old caches
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Strategy: Stale-While-Revalidate for all local assets and navigation
  if (
    request.mode === 'navigate' ||
    url.origin === self.location.origin
  ) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(request).then((cachedResponse) => {
          const fetchPromise = fetch(request).then((networkResponse) => {
            if (networkResponse.status === 200) {
              cache.put(request, networkResponse.clone());
            }
            return networkResponse;
          }).catch(() => cachedResponse); // Fallback to cache on network failure

          // Return cached response instantly (<0.2s) if available, otherwise wait for network
          return cachedResponse || fetchPromise;
        });
      })
    );
  }
});
