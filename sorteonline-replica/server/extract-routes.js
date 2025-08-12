import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const PUBLIC_DIR = path.join(ROOT, 'public');
const DOCS_DIR = path.join(ROOT, 'docs');
const INDEX_PATH = path.join(PUBLIC_DIR, 'site', 'sorteonline.com.br', 'index.html');

function ensureDir(dir) { fs.mkdirSync(dir, { recursive: true }); }

async function httpGet(url) {
  const res = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0', accept: '*/*' } });
  if (!res.ok) throw new Error(`GET ${url} -> ${res.status}`);
  return res;
}

function collectScriptUrls(html) {
  const urls = new Set();
  const scriptSrcRegex = /<script\s+[^>]*src=\"([^\"]+)\"/g;
  let m;
  while ((m = scriptSrcRegex.exec(html))) {
    const src = m[1];
    if (/^https?:\/\//.test(src)) urls.add(src);
  }
  return Array.from(urls);
}

function walkFiles(dir, extSet, results) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walkFiles(p, extSet, results);
    else if (extSet.has(path.extname(entry.name))) results.push(p);
  }
}

function extractCandidatesFromJs(content) {
  const items = [];
  const push = (url, method) => {
    if (!url) return;
    items.push({ url, method });
  };
  // fetch('url', { method: 'POST' }) patterns
  const fetchCall = /fetch\(([^)]+)\)/g;
  let m;
  while ((m = fetchCall.exec(content))) {
    const args = m[1];
    const urlMatch = args.match(/["'`]([^"'`]+)["'`]/);
    const methodMatch = args.match(/method\s*:\s*["'`](GET|POST|PUT|PATCH|DELETE)["'`]/i);
    push(urlMatch && urlMatch[1], methodMatch ? methodMatch[1].toUpperCase() : 'GET');
  }
  // axios.<method>('url')
  const axiosCall = /axios\.(get|post|put|patch|delete)\(\s*(["'`][^"'`]+["'`])/gi;
  while ((m = axiosCall.exec(content))) {
    push(m[2].slice(1, -1), m[1].toUpperCase());
  }
  // axios({ method: 'post', url: '...' })
  const axiosObj = /axios\(\s*\{[\s\S]*?url\s*:\s*(["'`][^"'`]+["'`])[\s\S]*?\}\s*\)/gi;
  while ((m = axiosObj.exec(content))) {
    const methodMatch = m[0].match(/method\s*:\s*["'`](GET|POST|PUT|PATCH|DELETE)["'`]/i);
    push(m[1].slice(1, -1), methodMatch ? methodMatch[1].toUpperCase() : undefined);
  }
  // XHR open
  const xhrOpen = /\.open\(\s*(["'`][A-Z]+["'`])\s*,\s*(["'`][^"'`]+["'`])/g;
  while ((m = xhrOpen.exec(content))) {
    push(m[2].slice(1, -1), m[1].slice(1, -1));
  }
  // Plain URL strings that look like endpoints
  const urlStrings = /["'`](https?:\/\/[^"'`\s]+|\/[a-zA-Z0-9_\-\/\.]+)["'`]/g;
  while ((m = urlStrings.exec(content))) {
    const u = m[1];
    if (/\.(png|jpg|webp|svg|css|woff2?|ttf|eot|gif)(\?|$)/i.test(u)) continue;
    if (/\/_next\//.test(u)) continue;
    if (/fonts\.gstatic|fonts\.googleapis/.test(u)) continue;
    if (/^\/?(images|static|assets)\//.test(u)) continue;
    // heuristics: looks like API
    if (/api|graphql|checkout|order|cart|login|auth|user|me|vtex|secure|payment/i.test(u)) {
      push(u, undefined);
    }
  }
  return items;
}

function normalizeUrl(u) {
  try {
    if (u.startsWith('http')) {
      const url = new URL(u);
      return { host: url.host, path: url.pathname + (url.search || '') };
    }
    return { host: 'www.sorteonline.com.br', path: u };
  } catch {
    return { host: 'www.sorteonline.com.br', path: u };
  }
}

async function main() {
  ensureDir(DOCS_DIR);
  const endpointsPath = path.join(DOCS_DIR, 'endpoints.json');

  const html = fs.readFileSync(INDEX_PATH, 'utf8');
  const scriptUrls = collectScriptUrls(html).filter(u => /sorteonline\.com\.br\/_next\//.test(u));

  // Mirror JS assets locally via running server
  for (const url of scriptUrls) {
    const mirrorUrl = `http://localhost:3000/mirror/${url.replace('https://','')}`;
    try { await httpGet(mirrorUrl); } catch (e) { /* ignore individual failures */ }
  }

  // Scan mirrored JS
  const chunksRoot = path.join(PUBLIC_DIR, 'mirror', 'www.sorteonline.com.br', '_next', 'static');
  const jsFiles = [];
  if (fs.existsSync(chunksRoot)) {
    walkFiles(chunksRoot, new Set(['.js']), jsFiles);
  }

  const found = new Map();
  for (const f of jsFiles) {
    const content = fs.readFileSync(f, 'utf8');
    const items = extractCandidatesFromJs(content);
    for (const it of items) {
      const { host, path: p } = normalizeUrl(it.url);
      const key = `${it.method || 'ANY'} ${host} ${p}`;
      if (!found.has(key)) {
        found.set(key, { method: it.method || 'ANY', host, path: p, source: path.relative(ROOT, f) });
      }
    }
  }

  const list = Array.from(found.values()).sort((a, b) => a.host.localeCompare(b.host) || a.path.localeCompare(b.path));
  fs.writeFileSync(endpointsPath, JSON.stringify({ generatedAt: new Date().toISOString(), count: list.length, endpoints: list }, null, 2));
  console.log(`Extracted ${list.length} endpoint candidates -> ${endpointsPath}`);
}

main().catch(err => { console.error(err); process.exit(1); });