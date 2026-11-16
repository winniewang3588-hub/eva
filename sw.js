"use strict";

// 每次修改介面或快取清單時，須遞增版本，並同步更新 HTML 中 CSS／JS 的 ?v= 參數。快取名稱含 scope，避免影響同網域其他專案。
const SCOPE_PATH = new URL(self.registration.scope).pathname;
const CACHE_PREFIX = `tokyo-trip-pwa:${SCOPE_PATH}:`;
const CACHE_NAME = `${CACHE_PREFIX}v4`;
// 本網址先前為報修登記 PWA；清除其舊快取，避免占用空間。
const LEGACY_PREFIXES = [`repair-pwa:${SCOPE_PATH}:`];
const SHELL_URLS = [
  "./", "./index.html", "./style.css", "./app.js", "./pwa.js",
  "./hokkaido.html", "./hokkaido.js", "./kyushu.html", "./kyushu.js", "./menu.js",
  "./manifest.webmanifest", "./icons/icon-192.png", "./icons/icon-512.png",
  "./icons/icon-maskable-512.png", "./icons/apple-touch-icon.png",
].map(path => new URL(path, self.registration.scope).href);

self.addEventListener("install", event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(SHELL_URLS.map(url => new Request(url, { cache: "reload" })));
  })());
});

self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names
      .filter(name => (name.startsWith(CACHE_PREFIX) && name !== CACHE_NAME)
        || LEGACY_PREFIXES.some(prefix => name.startsWith(prefix)))
      .map(name => caches.delete(name)));
    await self.clients.claim();
  })());
});

self.addEventListener("message", event => {
  if (event.data?.type === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  // 只快取固定介面檔案；其他請求（例如文件下載）不進快取。
  const shellKey = url.origin === self.location.origin
    ? SHELL_URLS.find(path => new URL(path).pathname === url.pathname) : null;
  if (shellKey) {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE_NAME);
      return (await cache.match(shellKey)) || fetch(request);
    })());
  }
});
