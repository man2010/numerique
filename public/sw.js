const CACHE_NAME = "sos-aventure-shell-v1";
const APP_SHELL = ["/offline.html", "/sos-villages-senegal.jpg", "/icons/icon-192.png", "/icons/icon-512.png", "/icons/icon-maskable-512.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))).then(() => self.clients.claim()));
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== self.location.origin || url.pathname.startsWith("/auth") || url.pathname.startsWith("/api") || url.pathname.startsWith("/espace") || url.pathname.startsWith("/administration") || url.pathname.startsWith("/educateur") || url.pathname.startsWith("/_next")) return;
  if (request.mode === "navigate") {
    event.respondWith(fetch(request).catch(() => caches.match("/offline.html").then((response) => response || Response.error())));
    return;
  }
  if (APP_SHELL.includes(url.pathname)) {
    event.respondWith(caches.match(request).then((cached) => cached || fetch(request)));
  }
});
