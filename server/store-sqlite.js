'use strict';
/* Storage adapter for self-hosting: SQLite database + files in DATA_DIR/uploads. */
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const { db, DATA, UPLOADS } = require('./db');
const buckets = new Map();
const setupFile = path.join(DATA, 'SETUP_CODE.txt');
const pick = (r, o) => r && ({ ...r, id: r.id });

module.exports = {
  async siteGet() { const r = db.prepare('SELECT json, updated_at u FROM site_content WHERE id=1').get(); return { site: JSON.parse(r.json), updatedAt: r.u }; },
  async siteSave(site, note) {
    const cur = db.prepare('SELECT json FROM site_content WHERE id=1').get();
    db.transaction(() => {
      if (cur) db.prepare('INSERT INTO site_versions(json,created_at,note) VALUES(?,?,?)').run(cur.json, new Date().toISOString(), note || 'Before save');
      db.prepare('DELETE FROM site_versions WHERE id NOT IN (SELECT id FROM site_versions ORDER BY id DESC LIMIT 30)').run();
      db.prepare('UPDATE site_content SET json=?, updated_at=? WHERE id=1').run(JSON.stringify(site), new Date().toISOString());
    })();
  },
  async versionList() { return db.prepare('SELECT id,created_at,note FROM site_versions ORDER BY id DESC').all(); },
  async versionGet(id) { const v = db.prepare('SELECT json FROM site_versions WHERE id=?').get(+id); return v ? JSON.parse(v.json) : null; },
  async adminGet() { return db.prepare('SELECT * FROM admin WHERE id=1').get() || null; },
  async adminSet(a) { db.prepare('INSERT OR REPLACE INTO admin(id,username,pass_hash,role,created_at) VALUES(1,?,?,?,?)').run(a.username, a.pass_hash, a.role || 'owner', a.created_at || new Date().toISOString()); },
  async sessionPut(h, exp) { db.prepare('INSERT INTO sessions VALUES(?,?,?)').run(h, exp, Date.now()); },
  async sessionGet(h) { const s = db.prepare('SELECT expires_at e FROM sessions WHERE token_hash=?').get(h); return s ? s.e : null; },
  async sessionDel(h) { db.prepare('DELETE FROM sessions WHERE token_hash=?').run(h); },
  async sessionsDeleteExcept(h) { h ? db.prepare('DELETE FROM sessions WHERE token_hash<>?').run(h) : db.prepare('DELETE FROM sessions').run(); },
  async recoverySet(hashes) { db.transaction(() => { db.prepare('DELETE FROM recovery_codes').run(); hashes.forEach(h => db.prepare('INSERT INTO recovery_codes(code_hash) VALUES(?)').run(h)); })(); },
  async recoveryUse(h) { const r = db.prepare('SELECT id FROM recovery_codes WHERE code_hash=? AND used=0').get(h); if (!r) return false; db.prepare('UPDATE recovery_codes SET used=1 WHERE id=?').run(r.id); return true; },
  async mediaList({ q, folder, kind }) {
    const w = [], a = [];
    if (q) { w.push('name LIKE ?'); a.push('%' + String(q).slice(0, 60) + '%'); }
    if (folder !== undefined && folder !== '__all') { w.push('folder=?'); a.push(String(folder)); }
    if (kind) { w.push('kind=?'); a.push(String(kind)); }
    return db.prepare(`SELECT * FROM media ${w.length ? 'WHERE ' + w.join(' AND ') : ''} ORDER BY id DESC`).all(...a);
  },
  async mediaFolders() { return db.prepare("SELECT DISTINCT folder FROM media WHERE folder<>'' ORDER BY folder").all().map(r => r.folder); },
  async mediaGet(file) { return db.prepare('SELECT * FROM media WHERE file=?').get(file) || null; },
  async mediaAddRow(r) { db.prepare('INSERT INTO media(file,name,folder,mime,kind,size,width,height,created_at) VALUES(?,?,?,?,?,?,?,?,?)').run(r.file, r.name, r.folder || '', r.mime, r.kind, r.size, r.width || null, r.height || null, r.created_at); },
  async mediaAdd(r, files) { for (const [n, buf] of Object.entries(files)) fs.writeFileSync(path.join(UPLOADS, n), buf); await this.mediaAddRow(r); },
  async mediaUpdate(file, f) { db.prepare('UPDATE media SET name=?, folder=? WHERE file=?').run(f.name, f.folder, file); },
  async mediaDelete(file) { [file, file.replace('.webp', '-640.webp')].forEach(f => { try { fs.unlinkSync(path.join(UPLOADS, f)); } catch { } }); db.prepare('DELETE FROM media WHERE file=?').run(file); },
  async fileRead(name) { try { return fs.readFileSync(path.join(UPLOADS, name)); } catch { return null; } },
  async fileExists(name) { return fs.existsSync(path.join(UPLOADS, name)); },
  async messageAdd(m) { db.prepare('INSERT INTO messages(name,email,type,budget,message,is_read,created_at) VALUES(?,?,?,?,?,?,?)').run(m.name, m.email, m.type, m.budget, m.message, 0, m.created_at); },
  async messageList() { return db.prepare('SELECT * FROM messages ORDER BY id DESC LIMIT 500').all(); },
  async messageStats() { const m = db.prepare('SELECT COUNT(*) c, SUM(is_read=0) u FROM messages').get(); return { count: m.c, unread: m.u || 0, recent: db.prepare('SELECT id,name,email,type,is_read,created_at FROM messages ORDER BY id DESC LIMIT 5').all() }; },
  async messageSetRead(id, v) { db.prepare('UPDATE messages SET is_read=? WHERE id=?').run(v ? 1 : 0, +id); },
  async messageDelete(id) { db.prepare('DELETE FROM messages WHERE id=?').run(+id); },
  async messageReplaceAll(rows) { db.transaction(() => { db.prepare('DELETE FROM messages').run(); rows.forEach(m => db.prepare('INSERT INTO messages(name,email,type,budget,message,is_read,created_at) VALUES(?,?,?,?,?,?,?)').run(m.name, m.email, m.type, m.budget, m.message, m.is_read, m.created_at)); })(); },
  async rateLimited(key, max, ms) {
    const t = Date.now(), a = (buckets.get(key) || []).filter(x => t - x < ms);
    if (a.length >= max) { buckets.set(key, a); return true; }
    a.push(t); buckets.set(key, a); return false;
  },
  setupCode() {
    if (!fs.existsSync(setupFile)) fs.writeFileSync(setupFile, crypto.randomBytes(6).toString('hex').toUpperCase(), { mode: 0o600 });
    return fs.readFileSync(setupFile, 'utf8').trim();
  },
  setupCodeClear() { try { fs.unlinkSync(setupFile); } catch { } },
  purgeSessions() { db.prepare('DELETE FROM sessions WHERE expires_at<?').run(Date.now()); },
  setupFile
};
