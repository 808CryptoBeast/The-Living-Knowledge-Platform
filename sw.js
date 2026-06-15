/* ═══════════════════════════════════════════════════════════════════════════
   The Living Knowledge Platform — Service Worker
   Strategy:
     • App shell (HTML, CSS, core JS) — Cache-first, update in background
     • Lesson data JS files         — Cache-first (large, rarely change)
     • Images                       — Cache-first, stale-while-revalidate
     • Supabase API / CDN fonts     — Network-only (auth must be live)
     • Everything else              — Network with cache fallback
═══════════════════════════════════════════════════════════════════════════ */

const CACHE_VERSION = 'lkp-v6';
const SHELL_CACHE   = CACHE_VERSION + '-shell';
const DATA_CACHE    = CACHE_VERSION + '-data';
const IMAGE_CACHE   = CACHE_VERSION + '-images';

/* Core app shell — cached on install so the app loads instantly offline */
const SHELL_URLS = [
  '/',
  '/index.html',
  '/profile.html',
  '/LKP/lessons.html',
  '/LKP/journal.html',
  '/about.html',

  /* CSS */
  '/LKP/css/lkp.css',
  '/LKP/css/lkp-brand.css',
  '/LKP/css/lkp-cursor.css',
  '/LKP/css/lkp-mobile.css',
  '/LKP/css/lkp-lessons.css',
  '/LKP/css/profile.css',

  /* Core JS */
  '/LKP/js/lkp-cursor.js',
  '/LKP/js/lkp-site.js',
  '/LKP/js/lkp-mobile.js',
  '/LKP/js/lkp-signout.js',
  '/LKP/js/lkp-rewards.js',
  '/LKP/js/lkp-profile-sync.js',
  '/LKP/js/lkp-galaxy-builder.js',
  '/LKP/js/lkp-lessons.js',
  '/LKP/js/lkp-lesson-overrides.js',
  '/LKP/js/lkp-glossary.js',
  '/LKP/js/lkp-journal.js',
  '/LKP/js/lkp-xrpl.js',
  '/LKP/js/profile.js',
  '/LKP/css/lkp-journal.css',

  /* Brand images */
  '/LKP/assets/images/LKP-1.png',
  '/LKP/assets/images/LKP-2.png',

  /* Manifest */
  '/site.webmanifest',
];

/* Large lesson data files — cached separately so shell installs fast */
const DATA_URLS = [
  /* Culture files — load order matters: kanaka first (defines KUMULIPO helpers) */
  '/LKP/js/cultures/kanaka/lkp-culture-kanaka.js',
  '/LKP/js/cultures/kemet/lkp-culture-kemet.js',
  '/LKP/js/cultures/bridge/lkp-culture-bridge.js',
  '/LKP/js/cultures/dogon/lkp-culture-dogon.js',
  '/LKP/js/cultures/vedic/lkp-culture-vedic.js',
  '/LKP/js/cultures/dreamtime/lkp-culture-dreamtime.js',
  '/LKP/js/cultures/maori/lkp-culture-maori.js',
  '/LKP/js/cultures/yoruba/lkp-culture-yoruba.js',
  '/LKP/js/cultures/chinese/lkp-culture-chinese.js',
  /* Assembler + supplemental data */
  '/LKP/js/lkp-data.js',
  '/LKP/js/lkp-data-rich-additions.js',
  '/LKP/js/lkp-data-primary-sources.js',
  '/LKP/js/cultures/kanaka/lkp-kumulipo-full-verses.js',
  '/LKP/js/cultures/kanaka/lkp-kumulipo-wa-ui.js',
];

/* ── Helpers ──────────────────────────────────────────────────────────── */

function isSupabaseRequest(url) {
  return url.hostname.includes('supabase.co') ||
         url.pathname.startsWith('/auth/') ||
         url.pathname.startsWith('/rest/') ||
         url.pathname.startsWith('/storage/');
}

function isExternalFont(url) {
  return url.hostname.includes('fonts.googleapis.com') ||
         url.hostname.includes('fonts.gstatic.com') ||
         url.hostname.includes('cdnjs.cloudflare.com') ||
         url.hostname.includes('jsdelivr.net');
}

function isImage(url) {
  return /\.(png|jpg|jpeg|gif|webp|svg|ico)(\?|$)/i.test(url.pathname);
}

/* ── Install: pre-cache shell, then data in background ───────────────── */

self.addEventListener('install', event => {
  event.waitUntil(
    (async () => {
      /* Cache shell synchronously so the SW is ready to serve instantly */
      const shellCache = await caches.open(SHELL_CACHE);
      await shellCache.addAll(SHELL_URLS).catch(err => {
        console.warn('[SW] Shell pre-cache partial failure:', err.message);
      });

      /* Cache lesson data without blocking install */
      const dataCache = await caches.open(DATA_CACHE);
      dataCache.addAll(DATA_URLS).catch(err => {
        console.warn('[SW] Data pre-cache partial failure:', err.message);
      });

      await self.skipWaiting();
    })()
  );
});

/* ── Activate: clean up old caches ───────────────────────────────────── */

self.addEventListener('activate', event => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter(key => key.startsWith('lkp-') && !key.startsWith(CACHE_VERSION))
          .map(key => caches.delete(key))
      );
      await self.clients.claim();
    })()
  );
});

/* ── Fetch: apply the right strategy per request type ───────────────── */

self.addEventListener('fetch', event => {
  /* Only handle GET — let POST/PUT/DELETE (auth, sync) go through normally */
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  /* Skip non-HTTP(S) schemes (chrome-extension, data:, etc.) */
  if (url.protocol !== 'https:' && url.protocol !== 'http:') return;

  /* Network-only: Supabase API and external CDN fonts/libraries */
  if (isSupabaseRequest(url) || isExternalFont(url)) return;

  /* Images: cache-first, stale-while-revalidate */
  if (isImage(url)) {
    event.respondWith(cacheFirst(event.request, IMAGE_CACHE, { maxAge: 604800 }));
    return;
  }

  /* Lesson data JS: cache-first (they change rarely) */
  if (DATA_URLS.some(u => url.pathname === u)) {
    event.respondWith(cacheFirst(event.request, DATA_CACHE, { maxAge: 86400 }));
    return;
  }

  /* App shell: cache-first, refresh in background */
  event.respondWith(staleWhileRevalidate(event.request, SHELL_CACHE));
});

/* ── Strategies ──────────────────────────────────────────────────────── */

async function cacheFirst(request, cacheName, { maxAge } = {}) {
  const cache    = await caches.open(cacheName);
  const cached   = await cache.match(request);

  if (cached) {
    /* Optionally refresh in background if stale */
    if (maxAge) {
      const date    = new Date(cached.headers.get('date') || 0);
      const ageSecs = (Date.now() - date.getTime()) / 1000;
      if (ageSecs > maxAge) {
        fetch(request).then(res => {
          if (res && res.ok) cache.put(request, res.clone());
        }).catch(() => {});
      }
    }
    return cached;
  }

  /* Not in cache — fetch and store */
  try {
    const response = await fetch(request);
    if (response && response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return new Response('Offline', { status: 503, statusText: 'Offline' });
  }
}

async function staleWhileRevalidate(request, cacheName) {
  const cache  = await caches.open(cacheName);
  /* ignoreSearch lets versioned ?v=... requests hit cached unversioned entries */
  const cached = await cache.match(request, { ignoreSearch: true });

  /* Kick off a network refresh regardless */
  const networkPromise = fetch(request).then(response => {
    if (response && response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  }).catch(() => null);

  /* Return cached immediately if available, otherwise wait for network */
  return cached || networkPromise || new Response('Offline', { status: 503 });
}
