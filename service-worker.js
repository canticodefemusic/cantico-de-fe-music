const CACHE_VERSION = 'v8.6.0';
const STATIC_CACHE = `cantico-static-${CACHE_VERSION}`;
const RUNTIME_CACHE = `cantico-runtime-${CACHE_VERSION}`;

const APP_SHELL = [
  '/',
  '/index.html',
  '/manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then(async cache => {
      await Promise.allSettled(
        APP_SHELL.map(resource => cache.add(resource))
      );
    })
  );

  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames
          .filter(
            cacheName =>
              cacheName.startsWith('cantico-') &&
              cacheName !== STATIC_CACHE &&
              cacheName !== RUNTIME_CACHE
          )
          .map(cacheName => caches.delete(cacheName))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const request = event.request;

  if (request.method !== 'GET') return;

  const requestUrl = new URL(request.url);

  if (requestUrl.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(response => {
          const copy = response.clone();

          caches.open(RUNTIME_CACHE).then(cache => {
            cache.put(request, copy);
          });

          return response;
        })
        .catch(async () => {
          return (
            (await caches.match(request)) ||
            (await caches.match('/index.html'))
          );
        })
    );

    return;
  }

  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;

      return fetch(request).then(response => {
        if (!response || response.status !== 200) return response;

        const copy = response.clone();

        caches.open(RUNTIME_CACHE).then(cache => {
          cache.put(request, copy);
        });

        return response;
      });
    })
  );
});
