const CACHE_NAME = 'tuluv-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/images/main_logo.png',
  '/images/footer_logo.png',
  '/images/hero.png',
  '/images/path-stress.jpg',
  '/images/path-emotional.jpg',
  '/images/path-recovery.jpg',
  '/images/path-pain.jpg',
  '/images/icons/icon-192.png',
  '/images/icons/icon-512.png'
];

// Install — cache core assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Activate — clear old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch — network first, fall back to cache
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
