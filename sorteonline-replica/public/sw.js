self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

function toLocalApiUrl(url) {
  try {
    const u = new URL(url);
    const proto = u.protocol.replace(':','');
    return `/api-local/${u.host}${u.pathname}${u.search}${u.hash ? '' : ''}?proto=${proto}`;
  } catch (e) {
    return null;
  }
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = req.url;
  try {
    const u = new URL(url);
    const isCrossOrigin = u.origin !== self.location.origin;
    const isHttp = u.protocol === 'http:' || u.protocol === 'https:';
    if (isHttp && isCrossOrigin) {
      const localApiUrl = toLocalApiUrl(url);
      if (localApiUrl) {
        event.respondWith(
          fetch(localApiUrl, {
            method: req.method,
            headers: req.headers,
            body: req.method === 'GET' || req.method === 'HEAD' ? undefined : req.clone().body,
            credentials: 'include',
          }).catch(() => fetch(req))
        );
        return;
      }
    }
  } catch (e) {}
  // Default: pass through
});