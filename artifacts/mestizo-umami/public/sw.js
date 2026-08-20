// Service worker for Mestizo Umami PWA.
// Cache name is versioned via the ?v= query param injected at registration time
// (see main.tsx) so each deploy automatically busts stale caches.

const version   = new URLSearchParams(self.location.search).get('v') || 'v1';
const CACHE_NAME = `mestizo-umami-${version}`;

const SHELL_ROUTES = ['/', '/recipes', '/planner', '/notebook', '/search', '/stores'];

// ── Install: pre-cache app-shell routes ──────────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      // Ignore individual failures — shell caching is best-effort
      Promise.allSettled(SHELL_ROUTES.map((r) => cache.add(r))),
    ),
  );
  // Take over immediately; don't wait for old tabs to close
  self.skipWaiting();
});

// ── Activate: delete all caches from previous versions ───────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== CACHE_NAME)
          .map((k) => caches.delete(k)),
      ),
    ),
  );
  self.clients.claim();
});

// ── Fetch: stale-while-revalidate for same-origin assets ─────────────────────
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // External map/geocoding APIs — network only, graceful 503 offline
  if (
    url.hostname.includes('nominatim') ||
    url.hostname.includes('overpass') ||
    url.hostname.includes('tile.openstreetmap')
  ) {
    event.respondWith(
      fetch(event.request).catch(
        () => new Response('offline', { status: 503, statusText: 'Offline' }),
      ),
    );
    return;
  }

  // API calls — network first, no caching
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(event.request).catch(
        () => new Response(JSON.stringify({ error: 'offline' }), {
          status: 503,
          headers: { 'Content-Type': 'application/json' },
        }),
      ),
    );
    return;
  }

  // Everything else — cache first, then network + cache update
  event.respondWith(
    caches.match(event.request).then((cached) => {
      const networkFetch = fetch(event.request).then((res) => {
        if (res && res.status === 200 && res.type === 'basic') {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put(event.request, clone));
        }
        return res;
      });
      return cached || networkFetch;
    }),
  );
});

// ── Push notifications ────────────────────────────────────────────────────────
self.addEventListener('push', (event) => {
  if (!event.data) return;
  let payload = {};
  try { payload = event.data.json(); } catch { return; }
  const { title = 'Mestizo Umami', body = '', url = '/', tag = 'meal-reminder' } = payload;
  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon:    '/icon-192-v2.png',
      badge:   '/favicon-32-v2.png',
      image:   '/icon-512-v2.png',
      vibrate: [200, 100, 200],
      tag,
      renotify: false,
      data: { url },
      actions: [
        { action: 'open',    title: 'View recipe' },
        { action: 'dismiss', title: 'Dismiss'     },
      ],
    }),
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.action === 'dismiss') return;
  const target = event.notification.data?.url ?? '/';
  event.waitUntil(
    clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            client.focus();
            client.navigate(target);
            return;
          }
        }
        return clients.openWindow(target);
      }),
  );
});
