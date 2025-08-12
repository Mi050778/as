import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import morgan from 'morgan';
import compression from 'compression';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';
import fetch from 'node-fetch';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const PUBLIC_DIR = path.resolve(ROOT_DIR, 'public');
const DOCS_DIR = path.resolve(ROOT_DIR, 'docs');

const app = express();
const port = process.env.PORT || 3000;

// Ensure docs dir exists
fs.mkdirSync(DOCS_DIR, { recursive: true });
const ROUTES_DOC_PATH = path.join(DOCS_DIR, 'routes.json');
if (!fs.existsSync(ROUTES_DOC_PATH)) {
  fs.writeFileSync(ROUTES_DOC_PATH, JSON.stringify({ routes: [] }, null, 2));
}

app.use(cors());
app.use(compression());
app.use(express.json({ limit: '2mb' }));
app.use(morgan('dev'));

// Simple in-memory set to avoid duplicate writes per session
const seenRoutes = new Set();
function recordRoute(method, originalUrl, targetHost, status, type) {
  try {
    const key = `${method} ${originalUrl}`;
    if (seenRoutes.has(key)) return;
    seenRoutes.add(key);
    const doc = JSON.parse(fs.readFileSync(ROUTES_DOC_PATH, 'utf8'));
    doc.routes.push({
      method,
      path: originalUrl,
      targetHost,
      type, // 'proxy' | 'static' | 'mock'
      status,
      ts: new Date().toISOString(),
    });
    fs.writeFileSync(ROUTES_DOC_PATH, JSON.stringify(doc, null, 2));
  } catch (err) {
    // ignore
  }
}

// Utility: ensure directory exists for a filepath
function ensureDirForFile(targetPath) {
  const dir = path.dirname(targetPath);
  fs.mkdirSync(dir, { recursive: true });
}

// Caching mirror endpoint using regex to avoid path-to-regexp star issues
app.get(/^\/mirror\/([^/]+)\/(.*)/, async (req, res) => {
  const host = req.params[0];
  const subPath = req.params[1] || '';
  const protocol = req.query.proto === 'http' ? 'http' : 'https';
  const remoteUrl = `${protocol}://${host}/${subPath}`.replace(/\/$/, '');
  const localPath = path.join(PUBLIC_DIR, 'mirror', host, subPath);

  try {
    if (fs.existsSync(localPath) && fs.statSync(localPath).isFile()) {
      recordRoute('GET', req.originalUrl, host, 200, 'static');
      return res.sendFile(localPath);
    }

    const response = await fetch(remoteUrl, {
      headers: {
        'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'accept': '*/*',
      },
    });

    if (!response.ok) {
      recordRoute('GET', req.originalUrl, host, response.status, 'proxy');
      return res.status(response.status).send(`Upstream error ${response.status}`);
    }

    const contentType = response.headers.get('content-type') || 'application/octet-stream';
    const buffer = Buffer.from(await response.arrayBuffer());

    ensureDirForFile(localPath);
    fs.writeFileSync(localPath, buffer);

    res.setHeader('content-type', contentType);
    recordRoute('GET', req.originalUrl, host, 200, 'proxy');
    return res.end(buffer);
  } catch (err) {
    recordRoute('GET', req.originalUrl, host, 500, 'proxy');
    return res.status(500).send('Mirror fetch error');
  }
});

// Full forward endpoint: method/headers/body passthrough (no cache)
app.all(/^\/forward\/([^/]+)\/(.*)/, async (req, res) => {
  const host = req.params[0];
  const subPath = req.params[1] || '';
  const protocol = req.query.proto === 'http' ? 'http' : 'https';
  const targetUrl = `${protocol}://${host}/${subPath}`.replace(/\/$/, '');

  try {
    const headers = { ...req.headers };
    delete headers.host;
    delete headers.connection;
    delete headers['content-length'];

    const upstream = await fetch(targetUrl, {
      method: req.method,
      headers,
      body: ['GET', 'HEAD'].includes(req.method) ? undefined : JSON.stringify(req.body ?? {}),
    });

    res.status(upstream.status);
    upstream.headers.forEach((value, key) => {
      if (!['transfer-encoding', 'content-encoding'].includes(key)) {
        res.setHeader(key, value);
      }
    });

    const buffer = Buffer.from(await upstream.arrayBuffer());
    recordRoute(req.method, req.originalUrl, host, upstream.status, 'proxy');
    return res.end(buffer);
  } catch (err) {
    recordRoute(req.method, req.originalUrl, host, 500, 'proxy');
    return res.status(500).send('Forward error');
  }
});

// Serve static files under /public
app.use('/static', express.static(PUBLIC_DIR, { maxAge: '7d', index: false }));
app.use('/docs', express.static(DOCS_DIR, { maxAge: 0 }));

// Serve service worker file
app.get('/sw.js', (req, res) => {
  const swPath = path.join(PUBLIC_DIR, 'sw.js');
  if (fs.existsSync(swPath)) {
    res.setHeader('content-type', 'application/javascript');
    return res.sendFile(swPath);
  }
  return res.status(404).send('sw.js not found');
});

// Proxy helpers
function makeProxy(target) {
  return createProxyMiddleware({
    target,
    changeOrigin: true,
    ws: true,
    logLevel: 'warn',
    onProxyReq: (proxyReq, req) => {
      // Track outgoing proxies
      recordRoute(req.method, req.originalUrl, new URL(target).host, 200, 'proxy');
    },
  });
}

// Known external hosts to proxy directly
const externalHosts = [
  'https://www.sorteonline.com.br',
  'https://sorteonline.com.br',
  'https://loja.sorteonline.com.br',
  'https://sorteonline.vtexassets.com',
  'https://fonts.googleapis.com',
  'https://fonts.gstatic.com',
  'https://sorteonline-br.mais.social',
];

// Mount a convenient proxy path for each external host at /proxy/<index>/* and /proxy/host/<hostname>/*
externalHosts.forEach((hostUrl, idx) => {
  const url = new URL(hostUrl);
  app.use(`/proxy/${idx}`, makeProxy(`${url.origin}`));
  app.use(`/proxy/host/${url.hostname}`, makeProxy(`${url.origin}`));
});

// Local mock routes (examples for auth, cart). Extend as needed.
app.post('/api/auth/login', (req, res) => {
  recordRoute('POST', req.originalUrl, 'local', 200, 'mock');
  const { email } = req.body || {};
  return res.json({
    status: 'ok',
    user: { id: 'u_mock_1', email: email || 'user@example.com', name: 'Usuário Demo' },
    token: 'mock-jwt-token',
  });
});

app.get('/api/user/me', (req, res) => {
  recordRoute('GET', req.originalUrl, 'local', 200, 'mock');
  return res.json({ id: 'u_mock_1', email: 'user@example.com', name: 'Usuário Demo' });
});

app.get('/api/catalogo', (req, res) => {
  recordRoute('GET', req.originalUrl, 'local', 200, 'mock');
  return res.json({ items: [], total: 0 });
});

app.post('/admin/extract-endpoints', async (req, res) => {
  try {
    const { spawn } = await import('child_process');
    const proc = spawn('node', [path.join(__dirname, 'extract-routes.js')], { stdio: 'inherit' });
    proc.on('exit', (code) => {
      if (code === 0) {
        const data = fs.readFileSync(path.join(DOCS_DIR, 'endpoints.json'), 'utf8');
        return res.type('application/json').send(data);
      }
      return res.status(500).json({ error: 'Extraction failed', code });
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Collector to receive client-side request logs
app.post('/admin/log-request', (req, res) => {
  try {
    const payload = req.body || {};
    const endpointsPath = path.join(DOCS_DIR, 'endpoints.json');
    const current = fs.existsSync(endpointsPath)
      ? JSON.parse(fs.readFileSync(endpointsPath, 'utf8'))
      : { generatedAt: new Date().toISOString(), count: 0, endpoints: [] };

    const urlObj = (() => {
      try { return new URL(payload.url); } catch { return null; }
    })();

    const entry = {
      method: (payload.method || 'GET').toUpperCase(),
      fullUrl: payload.url,
      host: urlObj ? urlObj.host : 'unknown',
      path: urlObj ? (urlObj.pathname + (urlObj.search || '')) : payload.url,
      requestHeaders: payload.headers || {},
      requestBodySample: payload.bodySample || null,
      status: payload.status || null,
      responseHeaders: payload.responseHeaders || {},
      responseBodySample: payload.responseBodySample || null,
      ts: new Date().toISOString(),
    };

    const key = `${entry.method} ${entry.host} ${entry.path}`;
    if (!current._keys) current._keys = {};
    if (!current._keys[key]) {
      current.endpoints.push(entry);
      current._keys[key] = true;
      current.count = current.endpoints.length;
      fs.writeFileSync(endpointsPath, JSON.stringify(current, null, 2));
    }
  } catch (err) {
    // ignore
  }
  return res.json({ ok: true });
});

// Serve the home page with link rewriting to local mirror paths
app.get('/', async (req, res) => {
  try {
    const sourcePath = path.join(PUBLIC_DIR, 'site', 'sorteonline.com.br', 'index.html');
    let html = fs.readFileSync(sourcePath, 'utf8');

    const rewrites = [
      { from: /https:\/\/www\.sorteonline\.com\.br/g, to: '/mirror/www.sorteonline.com.br' },
      { from: /https:\/\/sorteonline\.com\.br/g, to: '/mirror/sorteonline.com.br' },
      { from: /https:\/\/sorteonline\.vtexassets\.com/g, to: '/mirror/sorteonline.vtexassets.com' },
      { from: /https:\/\/fonts\.googleapis\.com/g, to: '/mirror/fonts.googleapis.com' },
      { from: /https:\/\/fonts\.gstatic\.com/g, to: '/mirror/fonts.gstatic.com' },
      { from: /https:\/\/sorteonline-br\.mais\.social/g, to: '/mirror/sorteonline-br.mais.social' },
    ];

    for (const rule of rewrites) {
      html = html.replace(rule.from, rule.to);
    }

    // Inject client-side network instrumentation
    const instrument = `\n<script>(function(){\n  try {\n    // Register Service Worker to route cross-origin requests through this server\n    if ('serviceWorker' in navigator) {\n      navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(function(){});\n    }\n    const origFetch = window.fetch;\n    window.fetch = async function(input, init){\n      const url = (typeof input === 'string') ? input : (input && input.url) || '' ;\n      const method = (init && init.method) || 'GET';\n      const headers = (init && init.headers) || {};\n      const bodySample = (init && typeof init.body === 'string') ? init.body.slice(0, 1024) : null;\n      try {\n        const resp = await origFetch.apply(this, arguments);\n        const cloned = resp.clone();\n        let responseBodySample = null;\n        try { responseBodySample = await cloned.clone().text(); responseBodySample = responseBodySample.slice(0, 1024); } catch (e) {}\n        const responseHeaders = {};\n        cloned.headers && cloned.headers.forEach && cloned.headers.forEach((v,k)=>{ responseHeaders[k]=v; });\n        navigator.sendBeacon('/admin/log-request', new Blob([JSON.stringify({ url, method, headers, bodySample, status: resp.status, responseHeaders, responseBodySample })], { type: 'application/json' }));\n        return resp;\n      } catch (e) {\n        try { navigator.sendBeacon('/admin/log-request', new Blob([JSON.stringify({ url, method, headers, bodySample, status: null })], { type: 'application/json' })); } catch(_){}\n        throw e;\n      }\n    };\n    const OrigXHR = window.XMLHttpRequest;\n    function WrappedXHR(){ const xhr = new OrigXHR(); let _method='GET', _url=''; let _body=null;\n      const origOpen = xhr.open;\n      xhr.open = function(method, url){ _method=method; _url=url; return origOpen.apply(xhr, arguments); };\n      const origSend = xhr.send;\n      xhr.send = function(body){ _body = (typeof body==='string') ? body.slice(0,1024) : null;\n        xhr.addEventListener('loadend', function(){ try { navigator.sendBeacon('/admin/log-request', new Blob([JSON.stringify({ url:_url, method:_method, headers:{}, bodySample:_body, status:xhr.status })], { type: 'application/json' })); } catch(_){} });\n        return origSend.apply(xhr, arguments);\n      };\n      return xhr;\n    }\n    window.XMLHttpRequest = WrappedXHR;\n  } catch(e) {}\n})();</script>\n`;
    if (html.includes('</head>')) {
      html = html.replace('</head>', instrument + '</head>');
    } else {
      html += instrument;
    }

    recordRoute('GET', req.originalUrl, 'local', 200, 'static');
    res.setHeader('content-type', 'text/html; charset=utf-8');
    return res.send(html);
  } catch (err) {
    return res.status(500).send('Index not available. Ensure the mirror was downloaded.');
  }
});

// Fallback: serve any other static file if exists
app.use((req, res, next) => {
  const tryPath = path.join(PUBLIC_DIR, req.path);
  if (fs.existsSync(tryPath) && fs.statSync(tryPath).isFile()) {
    recordRoute(req.method, req.originalUrl, 'local', 200, 'static');
    return res.sendFile(tryPath);
  }
  return next();
});

// Default catch-all proxy to original site for unknown paths (helps completeness)
app.use(makeProxy('https://www.sorteonline.com.br'));

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
  console.log('Static dir:', PUBLIC_DIR);
});