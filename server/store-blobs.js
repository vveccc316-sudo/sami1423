'use strict';
/* Storage adapter for Netlify: everything lives in Netlify Blobs (no database server needed).
   `getStore` is injected (from @netlify/blobs) so this file can also be tested with a local stand-in. */
const rid = () => Date.now().toString(36).padStart(9, '0') + Math.random().toString(36).slice(2, 8);

function createBlobStore(getStore) {
  const data = getStore({ name: 'portfolio-data', consistency: 'strong' });
  const files = getStore({ name: 'portfolio-files', consistency: 'strong' });
  const getJ = async k => { const v = await data.get(k, { type: 'json', consistency: 'strong' }); return v === undefined ? null : v; };
  const listKeys = async prefix => { const r = await data.list({ prefix }); return (r.blobs || []).map(b => b.key).sort(); };
  const defaults = () => require('./default-site.json');
  const readMedia = async () => (await getJ('media-index')) || [];

  return {
    async siteGet() {
      const r = await getJ('site'); const d = defaults(); let site = r ? r.site : JSON.parse(JSON.stringify(d));
      for (const k of Object.keys(d)) if (!(k in site)) site[k] = d[k];
      return { site, updatedAt: r ? r.updatedAt : null };
    },
    async siteSave(site, note) {
      const cur = await getJ('site');
      if (cur) {
        await data.setJSON('v:' + rid(), { site: cur.site, created_at: new Date().toISOString(), note: note || 'Before save' });
        const vs = await listKeys('v:'); for (const k of vs.slice(0, Math.max(0, vs.length - 30))) await data.delete(k);
      }
      await data.setJSON('site', { site, updatedAt: new Date().toISOString() });
    },
    async versionList() { const ks = (await listKeys('v:')).reverse(); return Promise.all(ks.map(async k => { const v = await getJ(k); return { id: k.slice(2), created_at: v.created_at, note: v.note }; })); },
    async versionGet(id) { if (!/^[\w]+$/.test(id)) return null; const v = await getJ('v:' + id); return v ? v.site : null; },
    async adminGet() { return getJ('admin'); },
    async adminSet(a) { await data.setJSON('admin', a); },
    async sessionPut(h, exp) { await data.setJSON('s:' + h, { exp }); },
    async sessionGet(h) { const s = await getJ('s:' + h); return s ? s.exp : null; },
    async sessionDel(h) { await data.delete('s:' + h); },
    async sessionsDeleteExcept(h) { for (const k of await listKeys('s:')) if (!h || k !== 's:' + h) await data.delete(k); },
    async recoverySet(hashes) { await data.setJSON('recovery', hashes.map(h => ({ h, used: false }))); },
    async recoveryUse(h) { const r = (await getJ('recovery')) || [], x = r.find(c => c.h === h && !c.used); if (!x) return false; x.used = true; await data.setJSON('recovery', r); return true; },
    async mediaList({ q, folder, kind }) {
      return (await readMedia()).filter(m => (!q || m.name.toLowerCase().includes(String(q).toLowerCase())) && (folder === undefined || folder === '__all' || m.folder === folder) && (!kind || m.kind === kind));
    },
    async mediaFolders() { return [...new Set((await readMedia()).map(m => m.folder).filter(Boolean))].sort(); },
    async mediaGet(file) { return (await readMedia()).find(m => m.file === file) || null; },
    async mediaAddRow(r) { const all = await readMedia(); all.unshift({ ...r, folder: r.folder || '' }); await data.setJSON('media-index', all); },
    async mediaAdd(r, fl) { for (const [n, buf] of Object.entries(fl)) await files.set(n, buf); await this.mediaAddRow(r); },
    async mediaUpdate(file, f) { const all = await readMedia(); const m = all.find(x => x.file === file); if (m) { m.name = f.name; m.folder = f.folder; await data.setJSON('media-index', all); } },
    async mediaDelete(file) { for (const n of [file, file.replace('.webp', '-640.webp')]) await files.delete(n); await data.setJSON('media-index', (await readMedia()).filter(m => m.file !== file)); },
    async fileRead(name) { const b = await files.get(name, { type: 'arrayBuffer', consistency: 'strong' }); return b ? Buffer.from(b) : null; },
    async fileExists(name) { return !!(await files.getMetadata(name)); },
    async messageAdd(m) { await data.setJSON('m:' + rid(), m); },
    async messageList() { const ks = (await listKeys('m:')).reverse().slice(0, 500); return Promise.all(ks.map(async k => ({ ...(await getJ(k)), id: k.slice(2) }))); },
    async messageStats() { const l = await this.messageList(); return { count: l.length, unread: l.filter(m => !m.is_read).length, recent: l.slice(0, 5).map(({ id, name, email, type, is_read, created_at }) => ({ id, name, email, type, is_read, created_at })) }; },
    async messageSetRead(id, v) { const m = await getJ('m:' + id); if (m) { m.is_read = v ? 1 : 0; await data.setJSON('m:' + id, m); } },
    async messageDelete(id) { await data.delete('m:' + id); },
    async messageReplaceAll(rows) { for (const k of await listKeys('m:')) await data.delete(k); for (const m of rows) await data.setJSON('m:' + rid(), m); },
    async rateLimited(key, max, ms) {
      const k = 'r:' + require('crypto').createHash('sha256').update(key).digest('hex').slice(0, 24), t = Date.now();
      const a = ((await getJ(k)) || []).filter(x => t - x < ms);
      if (a.length >= max) return true;
      a.push(t); await data.setJSON(k, a); return false;
    }
  };
}
module.exports = { createBlobStore };
