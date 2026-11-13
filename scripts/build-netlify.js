// Netlify build step: copies only the public website into dist/ (no server code, no database).
// assets/js/site-config.js is NOT copied: on Netlify that URL is served live by the function from your saved content.
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..'), dist = path.join(root, 'dist');
fs.rmSync(dist, { recursive: true, force: true }); fs.mkdirSync(dist, { recursive: true });
fs.readdirSync(root).filter(f => f.endsWith('.html')).forEach(f => fs.copyFileSync(path.join(root, f), path.join(dist, f)));
fs.cpSync(path.join(root, 'assets'), path.join(dist, 'assets'), { recursive: true, filter: s => !s.endsWith(path.join('assets', 'js', 'site-config.js')) });
fs.cpSync(path.join(root, 'admin'), path.join(dist, 'admin'), { recursive: true });
fs.writeFileSync(path.join(dist, 'robots.txt'), 'User-agent: *\nDisallow: /admin/\n');
console.log('dist/ ready:', fs.readdirSync(dist).join(', '));
