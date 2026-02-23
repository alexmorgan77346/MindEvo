const CACHE = 'mindevo-v5';

const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// Install
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE)
            .map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch
self.addEventListener('fetch', event => {

  // 🔥 Handle navigation (important for installed PWA)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  // Handle static assets
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
