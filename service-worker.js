
const CACHE_NAME = "khalid-site-v1";

const FILES = [
  "./",
  "./index.html",
  "./manifest.json",
  "./Mmno3.html",
  "./Five-name.html",
  "./badal.html",
  "./choice.html",
  "./el7w.html",
  "./exam1.html",
  "./exam2.html",
  "./exam3.html",
  "./exam4.html",
  "./about.html",
  "./html.html",
  "./css.html",
  "./na3t.html"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      cache.addAll(FILES)
    )
  );

  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request).then(response => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, copy);
          });
        }
        return response;
      }).catch(() => {
        if (event.request.mode === "navigate") {
          return caches.match("./index.html");
        }
      });
    })
  );
});
