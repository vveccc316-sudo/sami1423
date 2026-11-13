'use strict';
/* Self-hosted server (your own computer or a VPS). On Netlify this file is NOT used:
   netlify/functions/api.mjs runs the same core (server/core.js) with Netlify Blobs storage. */
const path = require('path'), fs = require('fs');
const express = require('express'), multer = require('multer');
const { ROOT } = require('./db');
const store = require('./store-sqlite');
const { createApi, designCss, esc, FONTS } = require('./core');
const core = createApi({ store });

const app = express();
if (process.env.TRUST_PROXY) app.set('trust proxy', 1);
app.disable('x-powered-by');
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  next();
});
app.use(express.json({ limit: '3mb' }));
setInterval(() => store.purgeSessions(), 600e3).unref();

/* ----- API adapter ----- */
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 15 * 1024 * 1024, files: 20 } });
app.post('/api/admin/media', (req, res, next) => upload.array('files', 20)(req, res, err => err ? res.status(400).json({ error: err.message }) : next()));
app.use(async (req, res, next) => {
  const r = await core.handle({
    method: req.method, path: req.path.replace(/\/+$/, '') || '/', query: req.query, headers: req.headers, ip: req.ip, secure: req.secure, host: req.get('host'),
    json: req.is('application/json') ? req.body : undefined,
    form: req.files ? { fields: req.body || {}, files: req.files.map(f => ({ originalname: f.originalname, buffer: f.buffer, size: f.size })) } : undefined
  });
  if (!r) return next();
  res.status(r.status);
  Object.entries(r.headers || {}).forEach(([k, v]) => res.setHeader(k, v));
  (r.cookies || []).forEach(c => res.append('Set-Cookie', c));
  if (r.body) return res.type(r.type).send(r.body);
  if (r.text !== undefined) return res.type(r.type || 'text/plain').send(r.text);
  res.json(r.json);
});

/* ----- public pages with server-side SEO/design injection ----- */
const PAGES = ['index', 'about', 'services', 'portfolio', 'certificates', 'contact'];
async function renderPage(name, req) {
  const s = await core.getSite(), seo = s.seo || {}, d = s.design || {}, b = s.brand || {}, site = b.siteName || s.name;
  let h = fs.readFileSync(path.join(ROOT, name + '.html'), 'utf8');
  const e = x => esc(String(x || '')), base = req.protocol + '://' + req.get('host');
  const abs = u => u ? (u.startsWith('/') ? base + u : u) : '';
  const label = (h.match(/<title>([^<|]*?)\s*(\||<)/) || [])[1] || '';
  const title = name === 'index' ? (seo.title || site) : `${label} | ${site}`;
  h = h.replace(/<title>[^<]*<\/title>/, `<title>${e(title)}</title>`).replace(/<meta name="description"[^>]*>/, `<meta name="description" content="${e(seo.description)}">`);
  const fams = [...new Set([d.headingFont, d.bodyFont].filter(f => FONTS[f]))].map(f => 'family=' + FONTS[f]).join('&');
  if (fams) h = h.replace(/<link href="https:\/\/fonts\.googleapis\.com\/css2[^>]*>/, `<link href="https://fonts.googleapis.com/css2?${fams}&display=swap" rel="stylesheet">`);
  const og = seo.ogImage ? `<meta property="og:image" content="${e(abs(seo.ogImage))}"><meta name="twitter:image" content="${e(abs(seo.ogImage))}">` : '';
  const head = (seo.keywords ? `<meta name="keywords" content="${e(seo.keywords)}">` : '') +
    `<meta property="og:type" content="website"><meta property="og:site_name" content="${e(site)}"><meta property="og:title" content="${e(seo.ogTitle || title)}"><meta property="og:description" content="${e(seo.ogDescription || seo.description)}"><meta name="twitter:card" content="${seo.ogImage ? 'summary_large_image' : 'summary'}">` + og +
    (b.favicon ? `<link rel="icon" href="${e(b.favicon)}">` : '') + `<style id="site-design">${designCss(d)}</style>`;
  return h.replace('</head>', head + '</head>').replace('<html lang="en">', `<html lang="en" data-theme="${d.theme === 'dark' ? 'dark' : 'light'}" data-btn="${e(d.buttonStyle || 'pill')}">`);
}
const sendPage = name => async (req, res, next) => { try { res.set('Cache-Control', 'no-cache').type('html').send(await renderPage(name, req)); } catch (e) { next(e); } };
app.get('/', sendPage('index'));
PAGES.forEach(p => { app.get('/' + p + '.html', sendPage(p)); if (p !== 'index') app.get('/' + p, sendPage(p)); });
app.use('/assets', express.static(path.join(ROOT, 'assets'), { maxAge: '1h' }));
app.use('/admin', express.static(path.join(ROOT, 'admin'), { index: 'index.html', setHeaders: (res, p) => {
  res.setHeader('Cache-Control', 'no-cache');
  if (p.endsWith('.html')) res.setHeader('Content-Security-Policy', "default-src 'self'; img-src 'self' data: blob:; style-src 'self' 'unsafe-inline'; script-src 'self'; frame-ancestors 'none'");
} }));
app.use('/api', (req, res) => res.status(404).json({ error: 'Not found' }));
app.use((req, res) => res.status(404).type('text').send('Page not found'));
app.use((err, req, res, next) => { if (req.path.startsWith('/api')) return res.status(err.status || 500).json({ error: err.status === 413 ? 'Content too large.' : err.type === 'entity.parse.failed' ? 'Invalid JSON.' : 'Server error.' }); console.error(err); res.status(500).type('text').send('Server error'); });

const PORT = +process.env.PORT || 3000;
if (require.main === module) app.listen(PORT, async () => {
  console.log(`Portfolio running on http://localhost:${PORT}   (admin: /admin)`);
  if (!(await store.adminGet())) console.log(`\nFIRST-TIME SETUP: open /admin and enter this one-time setup code: ${await core.setupCode()}\n(It is also saved in ${store.setupFile} and removed once the admin account is created.)\n`);
});
module.exports = app;
