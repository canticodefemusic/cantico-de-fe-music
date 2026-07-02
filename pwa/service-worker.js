const CACHE_NAME = "cantico-de-fe-v6-1";
const ASSETS = [
  "/",
  "/assets/css/styles.css",
  "/assets/js/app.js",
  "/api/hymns.json",
  "/api/playlists.json",
  "/api/albums.json",
  "/api/videos.json",
  "/api/devotionals.json",
  "/api/settings.json"
];
self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
});
self.addEventListener("fetch", event => {
  event.respondWith(caches.match(event.request).then(response => response || fetch(event.request)));
});
