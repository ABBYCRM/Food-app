/* Mestizo Umami service worker
   Strategy:
   - App shell (HTML, JS, CSS, fonts): cache-first with revalidation
   - Images: stale-while-revalidate
   - Everything else: network-first with cache fallback
   Bump the version to invalidate old caches on deploy.
   v2.0.0 — invalidate earlier mismatched photography and app bundles.
*/
const VERSION = "v2.0.0";
const SHELL_CACHE = `mestizo-shell-${VERSION}`;
const IMAGE_CACHE = `mestizo-images-${VERSION}`;
const RUNTIME_CACHE = `mestizo-runtime-${VERSION}`;

const BASE_PATH = new URL(self.registration.scope).pathname.replace(/\/$/, "");
const atBase = (path) => `${BASE_PATH}${path}` || "/";
const SHELL_ASSETS = [
  "/", "/index.html", "/manifest.webmanifest", "/favicon.svg",
  "/icons/icon-192.png", "/icons/icon-512.png",
  "/icons/maskable-192.png", "/icons/maskable-512.png",
  "/icons/apple-touch-icon.png",
].map(atBase);

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) => cache.addAll(SHELL_ASSETS).catch(() => undefined)),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((k) => ![SHELL_CACHE, IMAGE_CACHE, RUNTIME_CACHE].includes(k))
          .map((k) => caches.delete(k)),
      );
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) {
    // Cross-origin — stale-while-revalidate. Recipe photography is now
    // same-origin under /img/ and is handled by the static-asset branch below.
    event.respondWith(
      (async () => {
        const cache = await caches.open(IMAGE_CACHE);
        const cached = await cache.match(req);
        const network = fetch(req)
          .then((res) => {
            if (res.ok) cache.put(req, res.clone()).catch(() => undefined);
            return res;
          })
          .catch(() => cached);
        return cached || network;
      })(),
    );
    return;
  }

  // HTML — network-first with cache fallback (so updates land)
  if (req.mode === "navigate" || (req.headers.get("accept") || "").includes("text/html")) {
    event.respondWith(
      (async () => {
        try {
          const fresh = await fetch(req);
          const cache = await caches.open(SHELL_CACHE);
          cache.put(req, fresh.clone()).catch(() => undefined);
          return fresh;
        } catch {
          const cached = await caches.match(req) || (await caches.match(atBase("/")));
          return cached || new Response("Offline", { status: 503 });
        }
      })(),
    );
    return;
  }

  // Photography — stale-while-revalidate in its own cache.
  if (/\.(?:png|jpg|jpeg|webp|avif)(?:\?|$)/i.test(url.pathname)) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(IMAGE_CACHE);
        const cached = await cache.match(req);
        const network = fetch(req)
          .then((res) => {
            if (res.ok) cache.put(req, res.clone()).catch(() => undefined);
            return res;
          })
          .catch(() => cached);
        return cached || network;
      })(),
    );
    return;
  }

  // Versioned app assets — cache-first with background revalidation.
  if (/\.(?:js|css|woff2?|svg|ico|webmanifest)(?:\?|$)/i.test(url.pathname)) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(SHELL_CACHE);
        const cached = await cache.match(req);
        if (cached) {
          fetch(req).then((res) => res.ok && cache.put(req, res.clone())).catch(() => undefined);
          return cached;
        }
        try {
          const fresh = await fetch(req);
          if (fresh.ok) cache.put(req, fresh.clone()).catch(() => undefined);
          return fresh;
        } catch {
          return new Response("", { status: 504 });
        }
      })(),
    );
    return;
  }

  // Everything else — network-first
  event.respondWith(
    (async () => {
      try {
        const fresh = await fetch(req);
        const cache = await caches.open(RUNTIME_CACHE);
        if (fresh.ok) cache.put(req, fresh.clone()).catch(() => undefined);
        return fresh;
      } catch {
        const cached = await caches.match(req);
        return cached || new Response("Offline", { status: 503 });
      }
    })(),
  );
});

self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") self.skipWaiting();
});
