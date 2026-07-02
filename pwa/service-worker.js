const CACHE_NAME = "cantico-de-fe-v6";
const ASSETS = ["/", "/assets/css/styles.css", "/assets/js/app.js", "/assets/data/hymns.json"];
self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
});
self.addEventListener("fetch", event => {
  event.respondWith(caches.match(event.request).then(response => response || fetch(event.request)));
});
