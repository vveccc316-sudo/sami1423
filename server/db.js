'use strict';
const fs = require('fs'), path = require('path');
const Database = require('better-sqlite3');
const ROOT = path.join(__dirname, '..');
const DATA = process.env.DATA_DIR ? path.resolve(process.env.DATA_DIR) : path.join(ROOT, 'data');
const UPLOADS = path.join(DATA, 'uploads');
fs.mkdirSync(UPLOADS, { recursive: true });
const db = new Database(path.join(DATA, 'portfolio.db'));
db.pragma('journal_mode = WAL'); db.pragma('foreign_keys = ON');
db.exec(fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8'));
const defaults = JSON.parse(fs.readFileSync(path.join(__dirname, 'default-site.json'), 'utf8'));

// Seed on first run; on later runs fill in any new top-level keys introduced by updates.
const row = db.prepare('SELECT json FROM site_content WHERE id=1').get();
if (!row) db.prepare('INSERT INTO site_content(id,json,updated_at) VALUES(1,?,?)').run(JSON.stringify(defaults), new Date().toISOString());
else {
  const cur = JSON.parse(row.json); let changed = false;
  for (const k of Object.keys(defaults)) if (!(k in cur)) { cur[k] = defaults[k]; changed = true; }
  if (changed) db.prepare('UPDATE site_content SET json=? WHERE id=1').run(JSON.stringify(cur));
}
module.exports = { db, DATA, UPLOADS, defaults, ROOT };
