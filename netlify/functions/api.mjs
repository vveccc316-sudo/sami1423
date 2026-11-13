// Netlify Function: the whole backend (login, content API, media, messages) for the Netlify version.
// It runs the SAME code as the self-hosted server (server/core.js) but stores data in Netlify Blobs.
import { getStore } from '@netlify/blobs';
import coreModule from '../../server/core.js';
import blobModule from '../../server/store-blobs.js';

const api = coreModule.createApi({ store: blobModule.createBlobStore(getStore), env: process.env });

export default async (req, context) => {
  const url = new URL(req.url);
  const headers = Object.fromEntries(req.headers);
  const type = headers['content-type'] || '';
  let json, form;
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    if (type.includes('application/json')) {
      const raw = await req.text();
      if (raw.trim()) { try { json = JSON.parse(raw); } catch { return Response.json({ error: 'Invalid JSON.' }, { status: 400 }); } }
    } else if (type.includes('multipart/form-data')) {
      const fd = await req.formData(), fields = {}, files = [];
      for (const [k, v] of fd.entries()) {
        if (typeof v === 'string') fields[k] = v;
        else files.push({ originalname: v.name, buffer: Buffer.from(await v.arrayBuffer()), size: v.size });
      }
      form = { fields, files };
    }
  }
  const r = await api.handle({
    method: req.method, path: url.pathname.replace(/\/+$/, '') || '/', query: Object.fromEntries(url.searchParams), headers,
    ip: (context && context.ip) || headers['x-nf-client-connection-ip'] || 'unknown', secure: url.protocol === 'https:', host: headers.host || url.host, json, form
  });
  if (!r) return new Response('Not found', { status: 404 });
  const h = new Headers(r.headers || {});
  (r.cookies || []).forEach(c => h.append('Set-Cookie', c));
  if (r.body) { h.set('Content-Type', r.type); return new Response(r.body, { status: r.status, headers: h }); }
  if (r.text !== undefined) { h.set('Content-Type', r.type || 'text/plain'); return new Response(r.text, { status: r.status, headers: h }); }
  h.set('Content-Type', 'application/json');
  return new Response(JSON.stringify(r.json), { status: r.status, headers: h });
};

export const config = { path: ['/api/*', '/uploads/*', '/assets/js/site-config.js'] };
