const CACHE_NAME = 'mestizo-umami-v1';
const STATIC_ASSETS = ['/', '/recipes', '/planner', '/notebook', '/search', '/stores'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      cache.addAll(STATIC_ASSETS).catch(() => {}) // ignore failures for shell caching
    )
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  // Network first for API calls, cache first for assets
  const url = new URL(event.request.url);
  if (url.hostname.includes('nominatim') || url.hostname.includes('overpass')) {
    event.respondWith(fetch(event.request).catch(() => new Response('offline', { status: 503 })));
    return;
  }
  event.respondWith(
    caches.match(event.request).then((cached) =>
      cached || fetch(event.request).then((res) => {
        if (res && res.status === 200 && res.type === 'basic') {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put(event.request, clone));
        }
        return res;
      })
    )
  );
});