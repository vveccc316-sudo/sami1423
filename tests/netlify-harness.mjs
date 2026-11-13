// Test-only stand-in for Netlify: serves dist/ as static files and sends /api/*, /uploads/* and /assets/js/site-config.js
// to netlify/functions/api.mjs, like Netlify does. Storage = the real @netlify/blobs client talking to Netlify's own local Blobs server.
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
import { BlobsServer } from '@netlify/blobs/server';
const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..'), dist = path.join(root, 'dist');
const PORT = +process.env.PORT || 8890, BP = PORT + 1, TOKEN = 'local-test-token';
await new BlobsServer({ directory: process.env.BLOBS_DIR || '/tmp/blobs-test', token: TOKEN, port: BP }).start();
const u = `http://localhost:${BP}`;
process.env.NETLIFY_BLOBS_CONTEXT = Buffer.from(JSON.stringify({ edgeURL: u, uncachedEdgeURL: u, apiURL: u, token: TOKEN, siteID: 'local-test-site' })).toString('base64');
const { default: handler } = await import('../netlify/functions/api.mjs');
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'application/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.txt': 'text/plain', '.json': 'application/json' };
const isFn = p => p.startsWith('/api/') || p.startsWith('/uploads/') || p === '/assets/js/site-config.js';
http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  if (isFn(url.pathname)) {
    const chunks = []; for await (const c of req) chunks.push(c);
    const r = await handler(new Request(url, { method: req.method, headers: req.headers, body: ['GET', 'HEAD'].includes(req.method) ? undefined : Buffer.concat(chunks), duplex: 'half' }), { ip: req.socket.remoteAddress });
    const h = {}; r.headers.forEach((v, k) => { if (k !== 'set-cookie') h[k] = v; }); const sc = r.headers.getSetCookie(); if (sc.length) h['set-cookie'] = sc;
    res.writeHead(r.status, h); return res.end(Buffer.from(await r.arrayBuffer()));
  }
  let f = path.join(dist, decodeURIComponent(url.pathname)); if (!f.startsWith(dist)) { res.writeHead(403); return res.end(); }
  if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
  if (!fs.existsSync(f) && fs.existsSync(f + '.html')) f += '.html';
  if (!fs.existsSync(f)) { res.writeHead(404); return res.end('Not found'); }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream' }); res.end(fs.readFileSync(f));
}).listen(PORT, () => console.log('harness on', PORT));
