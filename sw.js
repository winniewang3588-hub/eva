"use strict";

// 每次修改介面或快取清單時，須遞增版本。快取名稱含 scope，避免影響同網域其他專案。
const CACHE_PREFIX = `repair-pwa:${new URL(self.registration.scope).pathname}:`;
const CACHE_NAME = `${CACHE_PREFIX}v1`;
const SHELL_URLS = [
  "./", "./index.html", "./style.css", "./app.js", "./config.js", "./pwa.js",
  "./manifest.webmanifest", "./icons/icon-192.png", "./icons/icon-512.png",
  "./icons/icon-maskable-512.png", "./icons/apple-touch-icon.png",
].map(path => new URL(path, self.registration.scope).href);
const SDK_URL = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.49.8/dist/umd/supabase.js";
const SDK_INTEGRITY = "sha384-l7yJnh/cWKcqeTC5adHUdc5b+J4Kb2QTGRSkCQehn1YT5xEFlrgwnXOYuvrtI1F6";

self.addEventListener("install", event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(SHELL_URLS.map(url => new Request(url, { cache: "reload" })));
    // CDN 不可用不應阻擋基本介面安裝；成功後才存入通過完整性檢查的 SDK。
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 10000);
    try {
      await cache.add(new Request(SDK_URL, { mode: "cors", integrity: SDK_INTEGRITY, signal: controller.signal }));
    } catch {
      // 未取得 SDK 時仍可離線看介面，連線後重新開啟可再取得 SDK。
    } finally {
      clearTimeout(timer);
    }
  })());
});

self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.filter(name => name.startsWith(CACHE_PREFIX) && name !== CACHE_NAME)
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
  // 只快取固定介面檔案與指定 SDK；Supabase 資料、POST 與下載文件均不進快取。
  const shellKey = url.origin === self.location.origin
    ? SHELL_URLS.find(path => new URL(path).pathname === url.pathname) : null;
  if (shellKey) {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE_NAME);
      return (await cache.match(shellKey)) || fetch(request);
    })());
  } else if (url.href === SDK_URL) {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE_NAME);
      const cached = await cache.match(SDK_URL);
      if (cached) return cached;
      const response = await fetch(new Request(request, { integrity: SDK_INTEGRITY }));
      if (response.ok && response.type !== "opaque") await cache.put(SDK_URL, response.clone());
      return response;
    })());
  }
});
