// Safe backup of the database and all uploaded media into ./backups/backup-<timestamp>/
// Run: npm run backup   (works while the site is running)
const fs = require('fs'), path = require('path');
const { db, DATA, UPLOADS, ROOT } = require('../server/db');
(async () => {
  const dir = path.join(ROOT, 'backups', 'backup-' + new Date().toISOString().replace(/[:.]/g, '-'));
  fs.mkdirSync(dir, { recursive: true });
  await db.backup(path.join(dir, 'portfolio.db'));
  fs.cpSync(UPLOADS, path.join(dir, 'uploads'), { recursive: true });
  console.log('Backup written to', dir, '\nCopy this folder somewhere safe (another disk or cloud storage).');
  process.exit(0);
})().catch(e => { console.error('Backup failed:', e.message); process.exit(1); });
