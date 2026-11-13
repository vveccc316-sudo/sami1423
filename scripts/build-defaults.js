// Builds server/default-site.json from the static assets/js/site-config.js plus server/extras.json.
// Run: npm run build-defaults  (only needed if you change the static config or extras.json)
const fs = require('fs'), path = require('path'), vm = require('vm');
const root = path.join(__dirname, '..');
const ctx = { window: {} }; vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(root, 'assets/js/site-config.js'), 'utf8'), ctx);
const S = JSON.parse(JSON.stringify(ctx.window.SITE));
const X = JSON.parse(fs.readFileSync(path.join(root, 'server/extras.json'), 'utf8'));
const { aboutExtras, contactExtras, extraFilters, ...top } = X;
Object.assign(S, Object.fromEntries(Object.entries(top).filter(([k]) => !(k in S))));
S.about = Object.assign({}, aboutExtras, S.about);
S.contactPage = Object.assign({}, contactExtras, S.contactPage, { formNote: contactExtras.formNote });
const have = new Set(S.portfolioFilters.map(f => f.key));
extraFilters.forEach(f => { if (!have.has(f.key)) S.portfolioFilters.push(f); });
S.nav.forEach(n => { if (n.visible === undefined) n.visible = true; });
S.portfolio.forEach(p => { Object.assign(p, { completionDate: '', location: '', externalUrl: '', videoUrl: '', files: [], featured: p.featured === true }); });
S.skills.forEach(k => { if (k.level === undefined) k.level = ''; k.visible = k.visible !== false; });
S.servicesPage.items.forEach(s => { Object.assign(s, { image: '', category: '', buttonText: '', buttonHref: '' }); });
fs.writeFileSync(path.join(root, 'server/default-site.json'), JSON.stringify(S, null, 2));
console.log('default-site.json written:', Object.keys(S).length, 'top-level keys');
