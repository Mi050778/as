self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

function toForwardUrl(url) {
  try {
    const u = new URL(url);
    const proto = u.protocol.replace(':','');
    return `/forward/${u.host}${u.pathname}${u.search}${u.hash ? '' : ''}?proto=${proto}`;
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
      const forwardUrl = toForwardUrl(url);
      if (forwardUrl) {
        event.respondWith(
          fetch(forwardUrl, {
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