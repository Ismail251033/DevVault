const CACHE_NAME = 'devvault-static-v2';
const APP_SHELL = '/';
const PRECACHE_URLS = [APP_SHELL, '/manifest.webmanifest', '/icons/icon.svg'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys
      .filter((key) => key !== CACHE_NAME)
      .map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

const cacheResponse = async (request, response) => {
  if (response?.ok) {
    const cache = await caches.open(CACHE_NAME);
    await cache.put(request, response.clone());
  }
  return response;
};

// React Router navigations are network-first. Offline, the cached Vite shell
// lets React resolve /login, /register, /dashboard, and other client routes.
const handleNavigation = async (request) => {
  try {
    return await cacheResponse(request, await fetch(request));
  } catch {
    const shell = await caches.match(APP_SHELL);
    return shell || new Response('DevVault is offline. Reconnect to continue.', {
      status: 503,
      statusText: 'Service Unavailable',
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }
};

const handleStaticAsset = async (request) => {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    return await cacheResponse(request, await fetch(request));
  } catch {
    // A FetchEvent must always resolve to a Response, even when offline.
    return new Response('', { status: 504, statusText: 'Offline asset unavailable' });
  }
};

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Supabase is cross-origin: never intercept, cache, or fake its data/Auth calls.
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith(handleNavigation(request));
    return;
  }

  if (['script', 'style', 'image', 'font'].includes(request.destination)) {
    event.respondWith(handleStaticAsset(request));
  }
});
