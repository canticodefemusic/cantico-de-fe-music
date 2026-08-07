/**
 * Cántico de Fe Music
 * V13.0.11 — Service Worker Cache Update
 */

const CACHE_VERSION =
  'v13.0.11';

const STATIC_CACHE =
  `cantico-static-${CACHE_VERSION}`;

const RUNTIME_CACHE =
  `cantico-runtime-${CACHE_VERSION}`;

const APP_SHELL = [
  '/',
  '/index.html',
  '/manifest.json'
];

function isAudioRequest(
  request,
  url
) {
  return (
    request.destination ===
      'audio' ||
    url.pathname.endsWith(
      '.mp3'
    ) ||
    url.pathname.endsWith(
      '.m4a'
    ) ||
    url.pathname.endsWith(
      '.wav'
    ) ||
    url.pathname.endsWith(
      '.ogg'
    )
  );
}

function isApplicationCode(
  request,
  url
) {
  return (
    request.destination ===
      'script' ||
    request.destination ===
      'style' ||
    request.destination ===
      'worker' ||
    url.pathname.endsWith(
      '.js'
    ) ||
    url.pathname.endsWith(
      '.css'
    )
  );
}

function canCacheResponse(
  response
) {
  return Boolean(
    response &&
    response.status === 200 &&
    response.type !== 'error'
  );
}

async function putInCache(
  cacheName,
  request,
  response
) {
  if (
    !canCacheResponse(
      response
    )
  ) {
    return;
  }

  const cache =
    await caches.open(
      cacheName
    );

  await cache.put(
    request,
    response.clone()
  );
}

async function networkFirst(
  request,
  {
    cacheName =
      RUNTIME_CACHE,
    fallbackRequest =
      null
  } = {}
) {
  try {
    const response =
      await fetch(
        request
      );

    await putInCache(
      cacheName,
      request,
      response
    );

    return response;
  } catch (error) {
    const cached =
      await caches.match(
        request
      );

    if (cached) {
      return cached;
    }

    if (fallbackRequest) {
      const fallback =
        await caches.match(
          fallbackRequest
        );

      if (fallback) {
        return fallback;
      }
    }

    throw error;
  }
}

async function staleWhileRevalidate(
  request
) {
  const cached =
    await caches.match(
      request
    );

  const networkPromise =
    fetch(
      request
    )
      .then(async response => {
        await putInCache(
          RUNTIME_CACHE,
          request,
          response
        );

        return response;
      })
      .catch(() => null);

  if (cached) {
    networkPromise.catch(
      () => {}
    );

    return cached;
  }

  const response =
    await networkPromise;

  if (response) {
    return response;
  }

  return Response.error();
}

self.addEventListener(
  'install',
  event => {
    event.waitUntil(
      caches
        .open(
          STATIC_CACHE
        )
        .then(async cache => {
          await Promise.allSettled(
            APP_SHELL.map(
              resource =>
                cache.add(
                  resource
                )
            )
          );
        })
    );

    self.skipWaiting();
  }
);

self.addEventListener(
  'activate',
  event => {
    event.waitUntil(
      caches
        .keys()
        .then(cacheNames =>
          Promise.all(
            cacheNames
              .filter(
                cacheName =>
                  cacheName.startsWith(
                    'cantico-'
                  ) &&
                  cacheName !==
                    STATIC_CACHE &&
                  cacheName !==
                    RUNTIME_CACHE
              )
              .map(
                cacheName =>
                  caches.delete(
                    cacheName
                  )
              )
          )
        )
        .then(() =>
          self.clients.claim()
        )
    );
  }
);

self.addEventListener(
  'fetch',
  event => {
    const request =
      event.request;

    if (
      request.method !==
      'GET'
    ) {
      return;
    }

    const requestUrl =
      new URL(
        request.url
      );

    if (
      requestUrl.origin !==
      self.location.origin
    ) {
      return;
    }

    /*
     * Navegación:
     *
     * Siempre intenta obtener la versión
     * más reciente de la aplicación.
     *
     * Si no hay conexión, utiliza la
     * versión almacenada.
     */
    if (
      request.mode ===
      'navigate'
    ) {
      event.respondWith(
        networkFirst(
          request,
          {
            fallbackRequest:
              '/index.html'
          }
        )
      );

      return;
    }

    /*
     * Audio:
     *
     * No interceptarlo.
     *
     * Esto evita problemas con Range
     * Requests, streaming y reproducción.
     */
    if (
      isAudioRequest(
        request,
        requestUrl
      )
    ) {
      return;
    }

    /*
     * JavaScript y CSS:
     *
     * NETWORK FIRST.
     *
     * Esta es la corrección principal.
     * Evita que una versión antigua del
     * sitio permanezca atrapada en caché.
     */
    if (
      isApplicationCode(
        request,
        requestUrl
      )
    ) {
      event.respondWith(
        networkFirst(
          request
        )
      );

      return;
    }

    /*
     * Manifest:
     *
     * Preferimos la versión más reciente.
     */
    if (
      requestUrl.pathname ===
      '/manifest.json'
    ) {
      event.respondWith(
        networkFirst(
          request,
          {
            cacheName:
              STATIC_CACHE
          }
        )
      );

      return;
    }

    /*
     * Imágenes, fuentes y otros recursos:
     *
     * Se pueden mostrar inmediatamente
     * desde caché mientras se actualizan
     * silenciosamente en segundo plano.
     */
    event.respondWith(
      staleWhileRevalidate(
        request
      )
    );
  }
);
