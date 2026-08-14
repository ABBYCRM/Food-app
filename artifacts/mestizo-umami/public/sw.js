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

// ── Push notifications ────────────────────────────────────────────────────────

const SLOT_EMOJI = { breakfast: '☀️', lunch: '🥗', dinner: '🌙', snack: '🍵' };

/**
 * Incoming payload shape:
 *   { title: "Tomorrow's Dinner 🌙", body: "Miso-Mole Short Rib Tacos", url: "/recipe/miso-mole-short-rib-tacos" }
 */
self.addEventListener('push', (event) => {
  if (!event.data) return;

  let payload = {};
  try { payload = event.data.json(); } catch { return; }

  const { title = 'Mestizo Umami', body = '', url = '/' } = payload;

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon:    '/icon-192.png',
      badge:   '/favicon-32.png',
      image:   '/icon-512.png',
      vibrate: [200, 100, 200],
      tag:     'meal-reminder',          // replaces previous notification of same type
      renotify: false,
      data:    { url },
      actions: [
        { action: 'open',    title: 'View recipe' },
        { action: 'dismiss', title: 'Dismiss' },
      ],
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.action === 'dismiss') return;

  const url = event.notification.data?.url ?? '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Focus an existing tab if one is already open
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.focus();
          client.navigate(url);
          return;
        }
      }
      // Otherwise open a new window
      return clients.openWindow(url);
    })
  );
});
