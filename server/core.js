'use strict';
/* Platform-independent API. It never touches Express, SQLite or Netlify directly:
   it receives a plain request object and a storage adapter (server/store-*.js) and returns a plain response object.
   request : { method, path, query, headers (lowercase), ip, secure, host, json, form:{fields,files} }
   response: { status, json | text | body(Buffer), type, headers, cookies[] } */
const crypto = require('crypto'), bcrypt = require('bcryptjs');
const defaults = require('./default-site.json');

const sha = s => crypto.createHash('sha256').update(String(s)).digest('hex');
const now = () => new Date().toISOString();
const FONTS = {
  'Bricolage Grotesque': 'Bricolage+Grotesque:wght@600;700;800', 'Figtree': 'Figtree:wght@400;500;600', 'Inter': 'Inter:wght@400;500;600;700',
  'Poppins': 'Poppins:wght@400;500;600;700', 'Manrope': 'Manrope:wght@400;500;600;700;800', 'Sora': 'Sora:wght@400;600;700;800',
  'Space Grotesk': 'Space+Grotesk:wght@400;500;600;700', 'DM Sans': 'DM+Sans:wght@400;500;600;700', 'Montserrat': 'Montserrat:wght@400;500;600;700;800',
  'Playfair Display': 'Playfair+Display:wght@500;600;700;800', 'Lora': 'Lora:wght@400;500;600;700', 'Roboto': 'Roboto:wght@400;500;700'
};
const ICONS = ['ruler', 'cube', 'building', 'calc', 'frame', 'steel', 'cap', 'layers', 'doc', 'linkedin', 'link', 'mail', 'chat', 'pin'];

/* ---------- content validation ---------- */
const URL_KEYS = /^(href|url|src|img|image|thumbnail|photo|logo|favicon|footerLogo|ogImage|coverImage|bgImage|pdf|credentialUrl|externalUrl|videoUrl|linkedin|website|actionHref|portfolioHref|contactHref|cta1Href|cta2Href|btn1Href|btn2Href|buttonHref)$/;
const okUrl = v => v === '' || (/^(https?:\/\/|mailto:|tel:|#|\/|\{\w+\}$|[\w\-.\/%]+(#[\w\-]*)?$)/.test(v) && !/^\s*(javascript|data|vbscript):/i.test(v));
function walk(v, key, p, errs, depth) {
  if (depth > 9) { errs.push(p + ': too deeply nested'); return v; }
  if (typeof v === 'string') {
    v = v.slice(0, 20000);
    if (URL_KEYS.test(key) && !okUrl(v.trim())) errs.push(`${p}: not a valid link`);
    return URL_KEYS.test(key) ? v.trim() : v;
  }
  if (typeof v === 'number') { if (!Number.isFinite(v)) errs.push(p + ': invalid number'); return v; }
  if (typeof v === 'boolean') return v;
  if (v === null || v === undefined) return '';
  if (Array.isArray(v)) { if (v.length > 500) errs.push(p + ': too many items'); return v.map((x, i) => walk(x, key, `${p}[${i}]`, errs, depth + 1)); }
  if (typeof v === 'object') {
    const o = {}, ks = Object.keys(v);
    if (ks.length > 200) errs.push(p + ': too many fields');
    for (const k of ks) { if (['__proto__', 'constructor', 'prototype'].includes(k)) continue; o[k] = walk(v[k], k, p ? `${p}.${k}` : k, errs, depth + 1); }
    return o;
  }
  errs.push(p + ': unsupported value'); return '';
}
function validateSite(input) {
  const errs = [];
  if (!input || typeof input !== 'object' || Array.isArray(input)) return { errs: ['Content must be an object'] };
  for (const k of Object.keys(defaults)) {
    if (!(k in input)) input[k] = JSON.parse(JSON.stringify(defaults[k]));
    else if (Array.isArray(defaults[k]) !== Array.isArray(input[k]) || (typeof defaults[k] !== typeof input[k])) errs.push(`${k}: wrong type`);
  }
  if (errs.length) return { errs };
  const site = walk(input, '', '', errs, 0);
  const d = site.design || {};
  ['primary', 'secondary', 'accent', 'background'].forEach(k => { if (!/^#[0-9a-fA-F]{6}$/.test(d[k] || '')) errs.push(`design.${k}: must be a #RRGGBB color`); });
  ['headingFont', 'bodyFont'].forEach(k => { if (!FONTS[d[k]]) errs.push(`design.${k}: unsupported font`); });
  if (!(Number(d.radius) >= 0 && Number(d.radius) <= 40)) errs.push('design.radius: 0 to 40'); else d.radius = Number(d.radius);
  if (!['light', 'dark'].includes(d.theme)) errs.push('design.theme: light or dark');
  if (!['pill', 'rounded', 'square'].includes(d.buttonStyle)) errs.push('design.buttonStyle: pill, rounded or square');
  if (!site.name || !String(site.name).trim()) errs.push('name: required');
  const keys = (site.portfolioFilters || []).map(f => f.key);
  if (!keys.includes('all')) errs.push('portfolioFilters: keep the "all" category (All Projects)');
  if (keys.some(k => !/^[a-z0-9-]+$/.test(k || ''))) errs.push('portfolioFilters: every category needs a key using only a-z, 0-9 and "-"');
  if (new Set(keys).size !== keys.length) errs.push('portfolioFilters: category keys must be unique');
  return { errs, site };
}
const esc = s => s.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const deepEsc = v => typeof v === 'string' ? esc(v) : Array.isArray(v) ? v.map(deepEsc) : v && typeof v === 'object' ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, deepEsc(x)])) : v;
/* Settings saved before the redesign still hold the old orange/blue/light defaults. Treat those as "not customised"
   so the new dark look shows; any colour/font/theme the owner really chose is kept. */
function normDesign(d) {
  d = Object.assign({}, d); const up = x => String(x || '').toUpperCase();
  d.legacyColors = up(d.primary) === '#FF6A13' && up(d.secondary) === '#1F5BFF';
  if (d.headingFont === 'Bricolage Grotesque' && d.bodyFont === 'Figtree') { d.headingFont = 'Sora'; d.bodyFont = 'Inter'; }
  if (d.theme !== 'dark' && up(d.background) === '#F7F5F1') { d.theme = 'dark'; d.legacyBg = true; }
  return d;
}
function designCss(d0) {
  const d = normDesign(d0), ok = v => /^#[0-9a-f]{6}$/i.test(v || ''), v = [], dark = d.theme === 'dark';
  if (!d.legacyColors) { if (ok(d.primary)) v.push('--orange:' + d.primary); if (ok(d.secondary)) v.push('--blue:' + d.secondary); if (ok(d.accent)) v.push('--orange-ink:' + d.accent); }
  if (!dark && ok(d.background)) v.push('--bg:' + d.background, `--bg2:color-mix(in srgb, ${d.background} 93%, #000)`);
  if (Number.isFinite(+d.radius) && +d.radius !== 14) v.push('--r:' + Math.max(0, Math.min(40, +d.radius)) + 'px');
  if (FONTS[d.headingFont]) v.push(`--display:"${d.headingFont}","Segoe UI",system-ui,sans-serif`);
  if (FONTS[d.bodyFont]) v.push(`--body:"${d.bodyFont}","Segoe UI",system-ui,sans-serif`);
  return ':root{' + v.join(';') + '}';
}

const cleanFolder = f => String(f || '').replace(/[^\w \-]/g, '').trim().slice(0, 60);
const clean = (s, n) => String(s == null ? '' : s).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim().slice(0, n);
const goodUser = u => typeof u === 'string' && /^[\w.\-@]{3,40}$/.test(u);
const goodPass = p => typeof p === 'string' && p.length >= 10 && p.length <= 200;
const tEq = (a, b) => crypto.timingSafeEqual(Buffer.from(sha(a)), Buffer.from(sha(b)));
const parseCookies = h => Object.fromEntries((h || '').split(';').map(s => s.trim().split('=')).filter(a => a[0]).map(([k, ...v]) => [k, decodeURIComponent(v.join('='))]));
const MIME = { webp: 'image/webp', pdf: 'application/pdf' };

function createApi({ store, env = process.env }) {
  const J = (status, json, more) => ({ status, json, ...more });
  const sessionCookie = (req, tok, maxAge) => `sid=${tok}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${maxAge}${req.secure ? '; Secure' : ''}`;
  async function startSession(req) {
    const t = crypto.randomBytes(32).toString('hex');
    await store.sessionPut(sha(t), Date.now() + 7 * 864e5);
    return sessionCookie(req, t, 7 * 864e5 / 1000);
  }
  async function currentSession(req) {
    const t = parseCookies(req.headers.cookie).sid; if (!t) return null;
    const h = sha(t), exp = await store.sessionGet(h);
    return exp && exp > Date.now() ? h : null;
  }
  async function saveSite(site, note) { await store.siteSave(site, note); }
  async function makeCodes() {
    const codes = Array.from({ length: 8 }, () => crypto.randomBytes(8).toString('hex').match(/.{4}/g).join('-'));
    await store.recoverySet(codes.map(sha)); return codes;
  }
  async function setupCode() { return env.SETUP_CODE || (store.setupCode ? store.setupCode() : null); }
  async function mediaOut(r, siteStr) {
    const base = r.file.replace(/\.\w+$/, '');
    return { ...r, id: r.file, url: '/uploads/' + r.file, thumb: r.kind === 'image' ? '/uploads/' + base + '-640.webp' : null, usage: siteStr.split('/uploads/' + base).length - 1 };
  }

  async function route(req) {
    const { method, path } = req, q = req.query || {}, body = req.json || {}, seg = path.split('/').filter(Boolean);
    const unsafe = !['GET', 'HEAD', 'OPTIONS'].includes(method);

    /* ----- public ----- */
    if (method === 'GET' && path === '/assets/js/site-config.js') {
      const { site } = await store.siteGet();
      return { status: 200, type: 'application/javascript', text: 'window.SITE = ' + JSON.stringify(deepEsc(site)).replace(/</g, '\\u003c') + ';\n', headers: { 'Cache-Control': 'no-cache' } };
    }
    if (method === 'GET' && seg[0] === 'uploads' && seg.length === 2) {
      if (!/^[a-f0-9]{16}(-640)?\.(webp|pdf)$/.test(seg[1])) return J(404, { error: 'Not found' });
      const buf = await store.fileRead(seg[1]); if (!buf) return J(404, { error: 'Not found' });
      return { status: 200, type: MIME[seg[1].split('.').pop()], body: buf, headers: { 'Cache-Control': 'public, max-age=31536000, immutable', 'X-Content-Type-Options': 'nosniff' } };
    }
    if (method === 'POST' && path === '/api/contact') {
      const b = body, errors = {};
      if (b.website) return J(200, { ok: true }); // honeypot
      if (!(Number(b.elapsed) >= 2500)) return J(400, { error: 'Please take a moment to fill in the form and try again.' });
      if (await store.rateLimited('contact:' + req.ip, 5, 3600e3)) return J(429, { error: 'Too many messages from this connection. Please try again later.' });
      const name = clean(b.name, 100), email = clean(b.email, 200), type = clean(b.type, 100), budget = clean(b.budget, 100), message = clean(b.message, 5000);
      const { site } = await store.siteGet(), allowed = (site.contactPage.inquiryTypes || []).map(t => t.label);
      if (name.length < 2) errors.name = 'Please enter your full name.';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) errors.email = 'Please enter a valid email address.';
      if (type && allowed.length && !allowed.includes(type)) errors.type = 'Please choose a listed inquiry type.';
      if (message.length < 5) errors.message = 'Please write a short message.';
      if (Object.keys(errors).length) return J(400, { error: 'Please check the highlighted fields.', errors });
      await store.messageAdd({ name, email, type, budget, message, is_read: 0, created_at: now() });
      if (env.SMTP_HOST) {
        try {
          const mail = require('nodemailer').createTransport({ host: env.SMTP_HOST, port: +env.SMTP_PORT || 587, secure: env.SMTP_SECURE === 'true', auth: env.SMTP_USER ? { user: env.SMTP_USER, pass: env.SMTP_PASS } : undefined });
          await mail.sendMail({ from: env.NOTIFY_FROM || env.SMTP_USER, to: env.NOTIFY_TO || site.contact.email, replyTo: email, subject: `Portfolio message from ${name}`, text: `Name: ${name}\nEmail: ${email}\nType: ${type}\nBudget: ${budget}\n\n${message}` });
        } catch (e) { console.error('Email notification failed (message was saved):', e.message); }
      }
      return J(200, { ok: true });
    }

    /* ----- CSRF guard for auth + admin APIs ----- */
    const isAuth = seg[0] === 'api' && seg[1] === 'auth', isAdmin = seg[0] === 'api' && seg[1] === 'admin';
    if ((isAuth || isAdmin) && unsafe) {
      const o = req.headers.origin; if (o) { try { if (new URL(o).host !== req.host) return J(403, { error: 'Forbidden' }); } catch { return J(403, { error: 'Forbidden' }); } }
      if (req.headers['x-requested-with'] !== 'portfolio-admin') return J(403, { error: 'Forbidden' });
    }

    /* ----- auth ----- */
    if (isAuth) {
      const a = await store.adminGet();
      if (method === 'GET' && seg[2] === 'status') {
        const s = await currentSession(req);
        return J(200, { setupNeeded: !a, setupConfigured: !!(await setupCode()), loggedIn: !!(s && a), username: s && a ? a.username : null });
      }
      if (method === 'POST' && seg[2] === 'setup') {
        if (a) return J(403, { error: 'Setup is already complete.' });
        if (await store.rateLimited('setup:' + req.ip, 10, 3600e3)) return J(429, { error: 'Too many attempts. Try later.' });
        const sc = await setupCode();
        if (!sc) return J(403, { error: 'Setup is not enabled yet. Add a SETUP_CODE environment variable on your host first (see README).' });
        const { code, username, password } = body;
        if (!code || !tEq(code, sc)) return J(403, { error: 'Invalid setup code.' });
        if (!goodUser(username)) return J(400, { error: 'Username: 3-40 characters (letters, numbers, . _ - @).' });
        if (!goodPass(password)) return J(400, { error: 'Password must be at least 10 characters.' });
        await store.adminSet({ username, pass_hash: bcrypt.hashSync(password, 12), role: 'owner', created_at: now() });
        const codes = await makeCodes(); if (store.setupCodeClear) await store.setupCodeClear();
        return J(200, { ok: true, recoveryCodes: codes }, { cookies: [await startSession(req)] });
      }
      if (method === 'POST' && seg[2] === 'login') {
        if (await store.rateLimited('login:' + req.ip, 8, 15 * 60e3)) return J(429, { error: 'Too many login attempts. Wait 15 minutes.' });
        const { username, password } = body;
        const ok = a && typeof username === 'string' && typeof password === 'string' && username === a.username && bcrypt.compareSync(password, a.pass_hash);
        if (!ok) return J(401, { error: 'Incorrect username or password.' });
        return J(200, { ok: true, username: a.username }, { cookies: [await startSession(req)] });
      }
      if (method === 'POST' && seg[2] === 'logout') {
        const t = parseCookies(req.headers.cookie).sid; if (t) await store.sessionDel(sha(t));
        return J(200, { ok: true }, { cookies: [sessionCookie(req, '', 0)] });
      }
      if (method === 'POST' && seg[2] === 'recover') {
        if (await store.rateLimited('recover:' + req.ip, 5, 3600e3)) return J(429, { error: 'Too many attempts. Try later.' });
        const { username, code, newPassword } = body;
        if (!goodPass(newPassword)) return J(400, { error: 'New password must be at least 10 characters.' });
        const valid = a && username === a.username && typeof code === 'string' && await store.recoveryUse(sha(code.trim().toLowerCase()));
        if (!valid) return J(400, { error: 'Username or recovery code is not valid.' });
        await store.adminSet({ ...a, pass_hash: bcrypt.hashSync(newPassword, 12) }); await store.sessionsDeleteExcept(null);
        return J(200, { ok: true });
      }
      return J(404, { error: 'Not found' });
    }

    /* ----- admin (login required) ----- */
    if (isAdmin) {
      const sid = await currentSession(req), admin = await store.adminGet();
      if (!sid || !admin) return J(401, { error: 'Please log in.' });
      const sub = seg[2], id = seg[3];
      if (sub === 'account' && method === 'POST') {
        if (!bcrypt.compareSync(String(body.current || ''), admin.pass_hash)) return J(403, { error: 'Current password is incorrect.' });
        if (id === 'password') {
          if (!goodPass(body.next)) return J(400, { error: 'New password must be at least 10 characters.' });
          await store.adminSet({ ...admin, pass_hash: bcrypt.hashSync(body.next, 12) }); await store.sessionsDeleteExcept(sid); return J(200, { ok: true });
        }
        if (id === 'username') {
          if (!goodUser(body.username)) return J(400, { error: 'Username: 3-40 characters (letters, numbers, . _ - @).' });
          await store.adminSet({ ...admin, username: body.username }); return J(200, { ok: true, username: body.username });
        }
        if (id === 'recovery-codes') return J(200, { ok: true, recoveryCodes: await makeCodes() });
      }
      if (sub === 'meta' && method === 'GET') return J(200, { fonts: Object.keys(FONTS), icons: ICONS });
      if (sub === 'site' && method === 'GET') { const r = await store.siteGet(); return J(200, { site: r.site, updatedAt: r.updatedAt }); }
      if (sub === 'site' && method === 'PUT') {
        const { errs, site } = validateSite(body.site);
        if (errs.length) return J(400, { error: 'Some fields are not valid.', details: errs.slice(0, 20) });
        await saveSite(site, 'Before save'); return J(200, { ok: true, site });
      }
      if (sub === 'stats' && method === 'GET') {
        const { site: s } = await store.siteGet(), m = await store.messageStats();
        return J(200, { projects: s.portfolio.length, services: s.servicesPage.items.length, certificates: s.certificatesPage.certificates.length, skills: s.skills.length, messages: m.count, unread: m.unread, recentMessages: m.recent, recentProjects: s.portfolio.slice(-5).reverse().map(p => ({ title: p.title, status: p.status, thumbnail: p.thumbnail })) });
      }
      if (sub === 'versions' && method === 'GET' && !id) return J(200, { versions: await store.versionList() });
      if (sub === 'versions' && method === 'POST' && seg[4] === 'restore') {
        if (body.confirm !== 'RESTORE') return J(400, { error: 'Type RESTORE to confirm.' });
        const v = await store.versionGet(id); if (!v) return J(404, { error: 'Version not found.' });
        const { errs, site } = validateSite(v); if (errs.length) return J(400, { error: 'That version is not valid.', details: errs });
        await saveSite(site, 'Before restoring version ' + id); return J(200, { ok: true });
      }
      if (sub === 'backup' && method === 'GET') {
        const { site } = await store.siteGet();
        const out = { format: 'portfolio-backup', version: 1, exportedAt: now(), site, media: await store.mediaList({}), messages: await store.messageList() };
        return { status: 200, json: out, headers: { 'Content-Disposition': `attachment; filename="portfolio-backup-${now().slice(0, 10)}.json"` } };
      }
      if (sub === 'restore' && method === 'POST') {
        const b = body;
        if (b.confirm !== 'RESTORE') return J(400, { error: 'Type RESTORE to confirm.' });
        if (!b.backup || b.backup.format !== 'portfolio-backup') return J(400, { error: 'This is not a valid backup file.' });
        const { errs, site } = validateSite(b.backup.site); if (errs.length) return J(400, { error: 'Backup content is not valid.', details: errs.slice(0, 20) });
        await saveSite(site, 'Before restoring backup');
        if (b.includeMessages && Array.isArray(b.backup.messages)) {
          await store.messageReplaceAll(b.backup.messages.slice(0, 5000).map(m => ({ name: String(m.name || '').slice(0, 100), email: String(m.email || '').slice(0, 200), type: String(m.type || '').slice(0, 100), budget: String(m.budget || '').slice(0, 100), message: String(m.message || '').slice(0, 5000), is_read: m.is_read ? 1 : 0, created_at: String(m.created_at || now()) })));
        }
        for (const m of b.backup.media || []) if (m && /^[a-f0-9]{16}\.(webp|pdf)$/.test(m.file || '') && await store.fileExists(m.file) && !(await store.mediaGet(m.file)))
          await store.mediaAddRow({ file: m.file, name: String(m.name || m.file).slice(0, 120), folder: cleanFolder(m.folder), mime: m.mime, kind: m.kind, size: m.size, width: m.width, height: m.height, created_at: m.created_at || now() });
        return J(200, { ok: true });
      }
      /* media */
      if (sub === 'media') {
        if (method === 'GET' && !id) {
          const s = JSON.stringify((await store.siteGet()).site);
          const items = await Promise.all((await store.mediaList({ q: q.q, folder: q.folder, kind: q.kind })).map(r => mediaOut(r, s)));
          return J(200, { items, folders: await store.mediaFolders() });
        }
        if (method === 'POST' && !id) {
          const folder = cleanFolder(req.form && req.form.fields && req.form.fields.folder), out = [], bad = [];
          const sharp = require('sharp');
          for (const f of (req.form && req.form.files) || []) {
            try {
              const fid = crypto.randomBytes(8).toString('hex'), name = String(f.originalname || 'file').replace(/\.[^.]*$/, '').replace(/[^\w \-.]/g, '').slice(0, 120) || 'file';
              if (f.buffer.slice(0, 5).toString() === '%PDF-') {
                await store.mediaAdd({ file: fid + '.pdf', name, folder, mime: 'application/pdf', kind: 'pdf', size: f.buffer.length, created_at: now() }, { [fid + '.pdf']: f.buffer });
              } else {
                const meta = await sharp(f.buffer, { animated: true }).metadata();
                if (!['jpeg', 'png', 'webp', 'gif', 'avif'].includes(meta.format)) throw new Error('Unsupported image type');
                const main = await sharp(f.buffer, { animated: true }).rotate().resize({ width: 1800, withoutEnlargement: true }).webp({ quality: 82 }).toBuffer({ resolveWithObject: true });
                const small = await sharp(main.data, { animated: true }).resize({ width: 640, withoutEnlargement: true }).webp({ quality: 78 }).toBuffer();
                await store.mediaAdd({ file: fid + '.webp', name, folder, mime: 'image/webp', kind: 'image', size: main.data.length, width: main.info.width, height: main.info.pageHeight || main.info.height, created_at: now() }, { [fid + '.webp']: main.data, [fid + '-640.webp']: small });
              }
              out.push(fid);
            } catch (e) { bad.push((f.originalname || 'file') + ': only JPG, PNG, WebP, GIF, AVIF images and PDF files are allowed'); }
          }
          return J(out.length || !bad.length ? 200 : 400, { ok: out.length > 0, uploaded: out.length, rejected: bad });
        }
        if (id && /^[a-f0-9]{16}\.(webp|pdf)$/.test(id)) {
          const r = await store.mediaGet(id); if (!r) return J(404, { error: 'Not found' });
          if (method === 'PATCH') {
            const name = body.name !== undefined ? String(body.name).replace(/[<>"]/g, '').trim().slice(0, 120) : r.name;
            const folder = body.folder !== undefined ? cleanFolder(body.folder) : r.folder;
            if (!name) return J(400, { error: 'Name cannot be empty.' });
            await store.mediaUpdate(id, { name, folder }); return J(200, { ok: true });
          }
          if (method === 'DELETE') {
            const used = (await mediaOut(r, JSON.stringify((await store.siteGet()).site))).usage;
            if (used && q.force !== '1') return J(409, { error: `This file is used ${used} time(s) on the website.`, usage: used });
            await store.mediaDelete(id); return J(200, { ok: true });
          }
        }
      }
      /* messages */
      if (sub === 'messages') {
        if (method === 'GET' && !id) return J(200, { items: await store.messageList() });
        if (id && /^[\w-]+$/.test(id)) {
          if (method === 'PATCH') { await store.messageSetRead(id, !!body.is_read); return J(200, { ok: true }); }
          if (method === 'DELETE') { await store.messageDelete(id); return J(200, { ok: true }); }
        }
      }
      return J(404, { error: 'Not found' });
    }
    return null; // not an API route
  }
  async function handle(req) {
    try { return await route(req); }
    catch (e) { console.error(e); return J(500, { error: 'Server error.' }); }
  }
  return { handle, setupCode, getSite: async () => (await store.siteGet()).site };
}
module.exports = { createApi, validateSite, designCss, normDesign, deepEsc, esc, FONTS, ICONS };
