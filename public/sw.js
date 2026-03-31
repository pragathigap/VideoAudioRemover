const CACHE_NAME = 'vidaudrem-v1';
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

  // Performance: Cache-First for static assets and HTML
  if (
    request.mode === 'navigate' ||
    url.origin === self.location.origin && (
      url.pathname.startsWith('/assets/') ||
      url.pathname.startsWith('/fonts/') ||
      url.pathname === '/logo.svg'
    )
  ) {
    event.respondWith(
      caches.match(request).then((response) => {
        // Return from cache instantly (<5ms)
        if (response) return response;

        // Otherwise fetch and cache for next time
        return fetch(request).then((networkResponse) => {
          if (networkResponse.status === 200) {
            const cacheCopy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, cacheCopy));
          }
          return networkResponse;
        });
      })
    );
  }
});
