/**
 * Service Worker — Malaysia English PWA
 * Strategy:
 *   • Navigation  → Network-first, fall back to cached index.html
 *   • Assets      → Cache-first, update cache in background (stale-while-revalidate)
 */
const CACHE = 'malaysia-english-v1';
const BASE  = '/learning-language/';

/* ── Install: skip waiting immediately ─────────────────────────────────────── */
self.addEventListener('install', () => self.skipWaiting());

/* ── Activate: delete old caches, claim clients ────────────────────────────── */
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

/* ── Fetch ──────────────────────────────────────────────────────────────────── */
self.addEventListener('fetch', (e) => {
  const { request } = e;
  const url = new URL(request.url);

  // Only handle same-origin GET requests
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;

  // ── Navigation requests (HTML pages) → network-first ──────────────────────
  if (request.mode === 'navigate') {
    e.respondWith(
      fetch(request)
        .then(res => {
          // Cache a fresh copy
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(request, clone));
          return res;
        })
        .catch(() =>
          // Offline → serve cached app shell
          caches.match(BASE + 'index.html')
            .then(r => r || caches.match(request))
        )
    );
    return;
  }

  // ── Static assets → cache-first, stale-while-revalidate ───────────────────
  e.respondWith(
    caches.open(CACHE).then(cache =>
      cache.match(request).then(cached => {
        const networkFetch = fetch(request).then(res => {
          if (res && res.status === 200 && res.type !== 'opaque') {
            cache.put(request, res.clone());
          }
          return res;
        }).catch(() => null);

        // Return cached immediately; update cache in background
        return cached || networkFetch;
      })
    )
  );
});

/* ── Message: skip waiting on demand (for update flow) ─────────────────────── */
self.addEventListener('message', (e) => {
  if (e.data?.type === 'SKIP_WAITING') self.skipWaiting();
});
