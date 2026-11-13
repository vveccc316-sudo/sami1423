// Emergency admin password reset (needs access to the server).
// Run: NEW_PASSWORD='a-long-new-password' npm run reset-password
const bcrypt = require('bcryptjs');
const { db } = require('../server/db');
const p = process.env.NEW_PASSWORD;
if (!p || p.length < 10) { console.error('Set NEW_PASSWORD (at least 10 characters). Example: NEW_PASSWORD="my-new-long-password" npm run reset-password'); process.exit(1); }
if (!db.prepare('SELECT 1 FROM admin WHERE id=1').get()) { console.error('No admin exists yet. Open /admin to run first-time setup.'); process.exit(1); }
db.prepare('UPDATE admin SET pass_hash=? WHERE id=1').run(bcrypt.hashSync(p, 12));
db.prepare('DELETE FROM sessions').run();
console.log('Admin password updated and all sessions signed out.');
