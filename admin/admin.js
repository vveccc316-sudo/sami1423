(() => {
'use strict';
const $ = (s, r = document) => r.querySelector(s);
const h = (tag, attrs, ...kids) => {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (k === 'class') e.className = v; else if (k.startsWith('on')) e.addEventListener(k.slice(2), v);
    else if (v === true) e.setAttribute(k, ''); else if (v !== false && v != null) e.setAttribute(k, v);
  }
  for (const c of kids.flat()) { if (c == null || c === false) continue; e.append(c.nodeType ? c : document.createTextNode(c)); }
  return e;
};
const toast = (msg, bad) => { const t = h('div', { class: bad ? 'bad' : '' }, msg); $('#toast').append(t); setTimeout(() => t.remove(), bad ? 7000 : 3500); };
const api = async (path, o = {}) => {
  const opt = { method: o.method || 'GET', headers: { 'X-Requested-With': 'portfolio-admin' }, credentials: 'same-origin' };
  if (o.json) { opt.headers['Content-Type'] = 'application/json'; opt.body = JSON.stringify(o.json); }
  if (o.form) opt.body = o.form;
  const r = await fetch(path, opt); let j = {}; try { j = await r.json(); } catch { }
  if (r.status === 401 && !o.noRedirect) { start(); throw Object.assign(new Error('Please log in again.'), { handled: true }); }
  if (!r.ok) throw Object.assign(new Error(j.error || 'Request failed'), { status: r.status, data: j });
  return j;
};
const fail = e => { if (!e.handled) toast(e.message + (e.data && e.data.details ? ' ' + e.data.details.join('; ') : ''), true); };
const LABELS = { portfolio: 'Projects', portfolioFilters: 'Project categories', servicesPage: 'Services page', services: 'Home page service items', projects: 'Home fallback project cards', homeSections: 'Home sections', homeClosing: 'Home closing section', cards: 'Cards', nav: 'Menu links', social: 'Social links', seo: 'SEO', skillGroups: 'Skill groups', cta1Text: 'Button 1 text', cta1Href: 'Button 1 link', cta2Text: 'Button 2 text', cta2Href: 'Button 2 link', btn1Text: 'Button 1 text', btn1Href: 'Button 1 link', btn2Text: 'Button 2 text', ogImage: 'Social sharing image', externalUrl: 'External project link', videoUrl: 'Video link (YouTube, Vimeo or file URL)', credentialUrl: 'Credential verification link', developingTools: 'Tools (currently learning)', completionDate: 'Completion date', buttonText: 'Button text', buttonHref: 'Button link', pdf: 'PDF file', src: 'Photo / file (click Choose / Upload)', image: 'Photo (click Choose / Upload)', img: 'Photo (click Choose / Upload)', motion: 'Scroll effects (3D)', thumbnail: 'Cover image: upload here to replace the placeholder (shown on the project card)', images: 'Project photos: add as many as you like (plans, sections, elevations, renders...)', files: 'PDF drawings and other files', alt: 'Caption (example: Front view)' };
const label = k => LABELS[k] || String(k).replace(/([A-Z])/g, ' $1').replace(/[_-]/g, ' ').replace(/^./, c => c.toUpperCase());
let SITE = null, META = null, dirty = false;
const mark = () => { dirty = true; const d = $('#dirty'); if (d) d.hidden = false; const b = $('#save'); if (b) b.disabled = false; };
window.addEventListener('beforeunload', e => { if (dirty) { e.preventDefault(); e.returnValue = ''; } });

/* ---------- auth screens ---------- */
const authShell = (title, sub, ...body) => { const a = $('#app'); a.replaceChildren(h('div', { class: 'auth' }, h('div', { class: 'auth-card' }, h('h1', {}, title), sub && h('p', {}, sub), ...body))); };
const F = (id, text, type = 'text', extra = {}) => h('label', { class: 'f', for: id }, text, h('input', { id, type, autocomplete: extra.ac || 'off', required: true, ...extra }));
async function start() {
  const st = await fetch('/api/auth/status', { credentials: 'same-origin' }).then(r => r.json());
  if (st.loggedIn) return boot(st.username);
  if (st.setupNeeded) return setupScreen(st.setupConfigured);
  loginScreen();
}
function setupScreen(configured) {
  const err = h('p', { class: 'err', role: 'alert' });
  if (configured === false) return authShell('One more step before setup', 'This site is online but not ready for its first login yet.', h('div', { class: 'stack' }, h('p', {}, 'On your host (Netlify: Site configuration > Environment variables) add a variable named SETUP_CODE with a secret code you choose (for example 12+ random characters), then redeploy the site and reload this page. You will type that code here to create your admin account.'), h('p', { class: 'hint' }, 'Nobody can create the admin account without this code. See the README for the exact steps.')));
  authShell('Create your admin account', 'First-time setup. You need the one-time setup code from the server log (or the SETUP_CODE.txt file in the data folder).',
    h('form', { class: 'stack', onsubmit: async e => {
      e.preventDefault(); err.textContent = '';
      if ($('#s-pw').value !== $('#s-pw2').value) { err.textContent = 'Passwords do not match.'; return; }
      try { const r = await api('/api/auth/setup', { method: 'POST', json: { code: $('#s-code').value.trim(), username: $('#s-user').value.trim(), password: $('#s-pw').value }, noRedirect: true }); codesScreen(r.recoveryCodes, true); }
      catch (x) { err.textContent = x.message; }
    } }, F('s-code', 'Setup code'), F('s-user', 'Choose a username', 'text', { ac: 'username', minlength: 3 }), F('s-pw', 'Password (10+ characters)', 'password', { ac: 'new-password', minlength: 10 }), F('s-pw2', 'Repeat password', 'password', { ac: 'new-password' }), err, h('button', { class: 'btn pri', type: 'submit' }, 'Create account')));
}
function codesScreen(codes, first) {
  authShell('Save your recovery codes', 'Each code can reset your password once if you forget it. They are shown only now. Store them somewhere safe, offline.',
    h('div', { class: 'stack' }, h('div', { class: 'codes' }, codes.map(c => h('span', {}, c))),
      h('button', { class: 'btn', type: 'button', onclick: () => navigator.clipboard && navigator.clipboard.writeText(codes.join('\n')).then(() => toast('Copied')) }, 'Copy codes'),
      h('button', { class: 'btn pri', type: 'button', onclick: () => first ? start() : route() }, 'I have saved them. Continue')));
}
function loginScreen() {
  const err = h('p', { class: 'err', role: 'alert' });
  authShell('Admin login', 'Sign in to manage your portfolio website.',
    h('form', { class: 'stack', onsubmit: async e => {
      e.preventDefault(); err.textContent = '';
      try { await api('/api/auth/login', { method: 'POST', json: { username: $('#l-user').value.trim(), password: $('#l-pw').value }, noRedirect: true }); start(); }
      catch (x) { err.textContent = x.message; }
    } }, F('l-user', 'Username', 'text', { ac: 'username' }), F('l-pw', 'Password', 'password', { ac: 'current-password' }), err, h('button', { class: 'btn pri', type: 'submit' }, 'Log in'),
      h('a', { href: '#', onclick: e => { e.preventDefault(); recoverScreen(); } }, 'Forgot password?')));
}
function recoverScreen() {
  const err = h('p', { class: 'err', role: 'alert' });
  authShell('Reset password', 'Enter your username, one unused recovery code, and a new password.',
    h('form', { class: 'stack', onsubmit: async e => {
      e.preventDefault(); err.textContent = '';
      try { await api('/api/auth/recover', { method: 'POST', json: { username: $('#r-user').value.trim(), code: $('#r-code').value, newPassword: $('#r-pw').value }, noRedirect: true }); toast('Password changed. Please log in.'); loginScreen(); }
      catch (x) { err.textContent = x.message; }
    } }, F('r-user', 'Username'), F('r-code', 'Recovery code'), F('r-pw', 'New password (10+ characters)', 'password', { ac: 'new-password', minlength: 10 }), err, h('button', { class: 'btn pri', type: 'submit' }, 'Reset password'),
      h('a', { href: '#', onclick: e => { e.preventDefault(); loginScreen(); } }, 'Back to login')));
}

/* ---------- generic content editor ---------- */
const MEDIA_KEYS = /^(img|image|thumbnail|photo|logo|favicon|footerLogo|ogImage|coverImage|bgImage|cover|src|pdf)$/;
const LONG = /^(desc|description|details|text|intro|blurb|biography|careerObjective|note|formNote|successMessage|errorMessage|sub|footerBlurb|emptyIntro|filledIntro|awardsEmpty|awardsNote|scopeNote)$/;
const HIDE = new Set(['id', 'order']);
const NOADD = new Set(['homeSections']);
const uid = p => p + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
const reorder = p => ({ id: p.id, title: p.title, thumbnail: p.thumbnail, images: p.images, files: p.files, ...p });
const TEMPLATES = {
  portfolio: () => reorder({ id: uid('p'), title: 'New project', category: (SITE.portfolioFilters.find(f => f.key !== 'all') || {}).key || '', thumbnail: '', images: [], description: '', details: '', tools: [], status: 'Placeholder', order: 0, visible: true, completionDate: '', location: '', externalUrl: '', videoUrl: '', files: [], featured: false }),
  portfolioFilters: () => ({ key: '', label: 'New category' }),
  items: () => ({ id: uid('s'), icon: 'ruler', title: 'New service', description: '', tools: [], developingTools: [], status: 'Current', price: '', order: 0, visible: true, image: '', category: '', buttonText: '', buttonHref: '' }),
  skills: () => ({ icon: 'ruler', name: 'New skill', desc: '', cat: '', status: 'current', level: '', visible: true, image: '' }),
  services: () => ({ icon: 'ruler', name: 'New service', desc: '', image: '' }),
  journey: () => ({ title: 'New step', text: '', image: '' }),
  certificates: () => ({ id: uid('c'), title: 'New certificate', category: 'cad', issuer: '', date: '', description: '', image: '', pdf: '', credentialUrl: '', order: 0, visible: true }),
  awards: () => ({ id: uid('a'), title: 'New award', issuer: '', date: '', description: '', order: 0, visible: true }),
  nav: () => ({ label: 'New link', href: '', visible: true }), social: () => ({ label: 'New link', icon: 'link', url: '' }),
  cards: () => ({ icon: 'link', title: 'New card', value: '', href: '', visible: true }),
  images: () => ({ src: '', alt: '' }), files: () => ({ src: '', label: '' }),
  education: () => ({ title: '', org: '', period: '', text: '' }), experience: () => ({ title: '', org: '', period: '', text: '' }), sections: () => ({ heading: 'New section', text: '' })
};
const blank = o => Array.isArray(o) ? [] : o && typeof o === 'object' ? Object.fromEntries(Object.entries(o).map(([k, v]) => [k, typeof v === 'boolean' ? v : blank(v)])) : typeof o === 'number' ? 0 : '';
const template = (key, arr) => TEMPLATES[key] ? TEMPLATES[key]() : (arr.length ? JSON.parse(JSON.stringify(blank(arr[0]))) : {});
const renumber = a => { if (a.some(x => x && typeof x === 'object' && 'order' in x)) a.forEach((x, i) => { x.order = i + 1; }); };
const itemTitle = (x, i) => (x && typeof x === 'object') ? (x.title || x.name || x.label || x.heading || x.key || x.alt || x.value || 'Item ' + (i + 1)) : String(x);

function selectOptions(key, path, obj) {
  if (key === 'icon') return META.icons;
  if (key === 'theme') return ['light', 'dark'];
  if (key === 'motion') return [['cinematic', 'Cinematic 3D (scroll effects on)'], ['classic', 'Classic (no 3D scroll effects)']];
  if (key === 'buttonStyle') return ['pill', 'rounded', 'square'];
  if (key === 'headingFont' || key === 'bodyFont') return META.fonts;
  if (key === 'status' && 'cat' in obj) return ['current', 'developing'];
  if (key === 'status' && 'developingTools' in obj) return ['Current', 'Developing'];
  if (key === 'status' && path.startsWith('portfolio.')) return ['Placeholder', 'Learning example', 'Completed'];
  if (key === 'category' && path.startsWith('portfolio.')) return SITE.portfolioFilters.filter(f => f.key !== 'all').map(f => [f.key, f.label]);
  return null;
}
function mediaField(obj, key, text) {
  const inp = h('input', { type: 'text', value: obj[key] || '', 'aria-label': text, placeholder: '/uploads/... or a link', oninput: () => { obj[key] = inp.value; prev(); mark(); } });
  const pv = h('span'); const prev = () => { const v = obj[key] || ''; pv.replaceChildren(/\.(webp|png|jpe?g|gif|svg|avif)$/i.test(v) ? h('img', { src: v, alt: '' }) : ''); }; prev();
  return h('div', { class: 'media-f' }, pv, inp, h('button', { class: 'btn sm', type: 'button', onclick: () => pickMedia(url => { obj[key] = url; inp.value = url; prev(); mark(); }) }, 'Choose / Upload'), h('button', { class: 'btn sm', type: 'button', onclick: () => { obj[key] = ''; inp.value = ''; prev(); mark(); } }, 'Clear'));
}
function field(obj, key, path, parentArr) {
  if (HIDE.has(key)) return null;
  const v = obj[key], text = label(key);
  if (typeof v === 'boolean') return h('label', { class: 'fld chk' }, h('input', { type: 'checkbox', checked: v, onchange: e => { obj[key] = e.target.checked; mark(); } }), text);
  if (Array.isArray(v)) {
    const objKey = key in TEMPLATES && !(key === 'items' && path !== 'servicesPage.items');
    return (v.every(x => typeof x !== 'object') && !(v.length === 0 && objKey)) ? strList(obj, key, text) : objList(v, key, path, text);
  }
  if (v && typeof v === 'object') return h('fieldset', {}, h('legend', {}, text), h('div', { class: 'row' }, Object.keys(v).map(k => field(v, k, path + '.' + k))));
  if (typeof v === 'number') return h('label', { class: 'fld' }, text, h('input', { type: 'number', value: v, oninput: e => { obj[key] = Number(e.target.value); mark(); } }));
  const opts = selectOptions(key, path, obj);
  if (opts) { const list = opts.map(o => Array.isArray(o) ? o : [o, o]); if (!list.some(o => o[0] === v)) list.unshift([v, v || '(none)']);
    return h('label', { class: 'fld' }, text, h('select', { 'aria-label': text, onchange: e => { obj[key] = e.target.value; mark(); } }, list.map(([val, lab]) => h('option', { value: val, selected: val === v }, lab)))); }
  if (path.startsWith('design.') && ['primary', 'secondary', 'accent', 'background'].includes(key))
    return h('label', { class: 'fld' }, text, h('input', { type: 'color', value: /^#[0-9a-f]{6}$/i.test(v) ? v : '#000000', oninput: e => { obj[key] = e.target.value; mark(); } }));
  if (MEDIA_KEYS.test(key)) return h('div', { class: 'fld' }, text, mediaField(obj, key, text));
  if (LONG.test(key) || (v || '').length > 90) return h('label', { class: 'fld' }, text, h('textarea', { 'aria-label': text, oninput: e => { obj[key] = e.target.value; mark(); } }, v || ''));
  return h('label', { class: 'fld' }, text, h('input', { type: 'text', value: v || '', oninput: e => { obj[key] = e.target.value; mark(); } }));
}
function strList(obj, key, text) {
  const arr = obj[key], box = h('div', { class: 'strlist' });
  const draw = () => { box.replaceChildren(...arr.map((s, i) => h('div', { class: 'srow' },
    (key === 'story' || s.length > 90) ? h('textarea', { 'aria-label': text + ' ' + (i + 1), oninput: e => { arr[i] = e.target.value; mark(); } }, s) : h('input', { type: 'text', value: s, 'aria-label': text + ' ' + (i + 1), oninput: e => { arr[i] = e.target.value; mark(); } }),
    h('button', { class: 'btn sm', type: 'button', 'aria-label': 'Move up', onclick: () => { if (i) { [arr[i - 1], arr[i]] = [arr[i], arr[i - 1]]; mark(); draw(); } } }, 'Up'),
    h('button', { class: 'btn sm danger', type: 'button', onclick: () => { arr.splice(i, 1); mark(); draw(); } }, 'Remove'))),
    h('button', { class: 'btn sm', type: 'button', onclick: () => { arr.push(''); mark(); draw(); } }, 'Add ' + text.toLowerCase())); };
  draw(); return h('fieldset', {}, h('legend', {}, text), box);
}
const shrinkImg = async f => {
  if (!/^image\/(jpeg|png|webp)$/.test(f.type)) return f;
  try {
    const bmp = await createImageBitmap(f), sc = Math.min(1, 1800 / Math.max(bmp.width, bmp.height)), c = document.createElement('canvas');
    c.width = Math.round(bmp.width * sc); c.height = Math.round(bmp.height * sc); c.getContext('2d').drawImage(bmp, 0, 0, c.width, c.height);
    const blob = await new Promise(r => c.toBlob(r, 'image/webp', 0.85));
    return blob && blob.size < f.size ? new File([blob], f.name.replace(/\.\w+$/, '') + '.webp', { type: 'image/webp' }) : f;
  } catch { return f; }
};
function bulkBar(arr, key, redraw) {
  const isImg = key === 'images';
  const input = h('input', { type: 'file', multiple: true, hidden: true, accept: isImg ? 'image/jpeg,image/png,image/webp,image/gif,image/avif' : 'application/pdf,image/jpeg,image/png,image/webp', onchange: async () => {
    const picked = [...input.files]; input.value = ''; if (!picked.length) return;
    try {
      const before = new Set((await api('/api/admin/media')).items.map(m => m.id)); const bad = [];
      for (const f0 of picked) {
        const f = await shrinkImg(f0);
        if (f.size > 4.2 * 1024 * 1024) { bad.push(f0.name + ': larger than 4 MB, compress it first'); continue; }
        const fd = new FormData(); fd.append('files', f); fd.append('folder', 'Projects');
        try { const r = await api('/api/admin/media', { method: 'POST', form: fd }); bad.push(...r.rejected); } catch (e) { if (e.data && e.data.rejected) bad.push(...e.data.rejected); else throw e; }
      }
      const added = (await api('/api/admin/media')).items.filter(m => !before.has(m.id)).reverse();
      added.forEach(m => arr.push(isImg ? { src: m.url, alt: m.name } : { src: m.url, label: m.name }));
      if (added.length) mark(); redraw();
      toast('Added ' + added.length + (isImg ? ' photo(s).' : ' file(s).') + (added.length ? ' Remember to press Save changes.' : '') + (bad.length ? ' Rejected: ' + bad.join('; ') : ''), bad.length > 0);
    } catch (e) { fail(e); }
  } });
  return h('div', { class: 'bar' }, h('button', { class: 'btn pri', type: 'button', onclick: () => input.click() }, isImg ? 'Upload photos (select several at once)' : 'Upload PDFs / files (select several at once)'), input,
    h('span', { class: 'hint', style: 'margin:0' }, isImg ? 'Each photo can get a caption, for example "Front view" or "Side view".' : 'PDF drawings and other documents for this item.'));
}
function objList(arr, key, path, text) {
  const box = h('div'); let dragFrom = null;
  const draw = () => {
    box.replaceChildren(...arr.map((it, i) => {
      const ttl = h('span', { class: 'ttl' }, itemTitle(it, i) + (it && it.visible === false ? ' (hidden)' : ''));
      const d = h('details', { class: 'item' },
        h('summary', {}, h('span', { class: 'grip', title: 'Drag to reorder', 'aria-hidden': 'true', draggable: 'true', ondragstart: e => { dragFrom = i; e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', String(i)); e.dataTransfer.setDragImage(d, 12, 12); } }, '::'),
          ttl,
          h('span', { class: 'acts' },
            h('button', { class: 'btn sm', type: 'button', onclick: e => { e.preventDefault(); if (i) { [arr[i - 1], arr[i]] = [arr[i], arr[i - 1]]; renumber(arr); mark(); draw(); } } }, 'Up'),
            h('button', { class: 'btn sm', type: 'button', onclick: e => { e.preventDefault(); if (i < arr.length - 1) { [arr[i + 1], arr[i]] = [arr[i], arr[i + 1]]; renumber(arr); mark(); draw(); } } }, 'Down'),
            !NOADD.has(key) && !(key === 'portfolioFilters' && it.key === 'all') && h('button', { class: 'btn sm', type: 'button', onclick: e => { e.preventDefault(); const c = JSON.parse(JSON.stringify(it)); if (c.id) c.id = uid('d'); if (c.title) c.title += ' (copy)'; arr.splice(i + 1, 0, c); renumber(arr); mark(); draw(); } }, 'Duplicate'),
            !NOADD.has(key) && !(key === 'portfolioFilters' && it.key === 'all') && h('button', { class: 'btn sm danger', type: 'button', onclick: e => { e.preventDefault(); if (confirm('Delete "' + itemTitle(it, i) + '"? This cannot be undone until you reload without saving.')) { arr.splice(i, 1); renumber(arr); mark(); draw(); } } }, 'Delete'))),
        h('div', { class: 'item-body' }, h('div', { class: 'row' }, Object.keys(it).map(k => field(it, k, path + '.' + i + '.' + k)))));
      const retitle = () => { ttl.textContent = itemTitle(it, i) + (it && it.visible === false ? ' (hidden)' : ''); };
      d.addEventListener('input', retitle); d.addEventListener('change', retitle);
      d.addEventListener('dragend', () => { dragFrom = null; });
      d.addEventListener('dragover', e => { if (dragFrom !== null) { e.preventDefault(); d.classList.add('drag-over'); } });
      d.addEventListener('dragleave', () => d.classList.remove('drag-over'));
      d.addEventListener('drop', e => { e.preventDefault(); d.classList.remove('drag-over'); if (dragFrom === null || dragFrom === i) return; const [m] = arr.splice(dragFrom, 1); arr.splice(i, 0, m); dragFrom = null; renumber(arr); mark(); draw(); });
      return d;
    }),
    !NOADD.has(key) && h('button', { class: 'btn', type: 'button', onclick: () => { arr.push(template(key, arr)); renumber(arr); mark(); draw(); const ds = [...box.children].filter(x => x.tagName === 'DETAILS'), last = ds[ds.length - 1]; if (last) { last.open = true; last.scrollIntoView({ block: 'center' }); } } }, (key === 'images' ? '+ Add one photo manually' : key === 'files' ? '+ Add one file manually' : '+ Add ' + text.replace(/ies$/, 'y').replace(/s$/, '').toLowerCase())));
  };
  const lg = h('legend', {}); const tick = () => { lg.textContent = text + ' (' + arr.length + ')'; };
  draw(); tick(); box.addEventListener('click', () => setTimeout(tick, 0)); box.addEventListener('drop', () => setTimeout(tick, 0));
  const bulk = (key === 'images' || key === 'files') ? bulkBar(arr, key, () => { draw(); tick(); }) : null;
  return h('fieldset', {}, lg, bulk, box);
}

/* ---------- media library ---------- */
function mediaBrowser(onPick) {
  const root = h('div'), grid = h('div', { class: 'mgrid' }), q = h('input', { type: 'text', placeholder: 'Search files', 'aria-label': 'Search files' }), fol = h('select', { 'aria-label': 'Folder' }), kind = h('select', { 'aria-label': 'Type' }, h('option', { value: '' }, 'All types'), h('option', { value: 'image' }, 'Images'), h('option', { value: 'pdf' }, 'PDFs'));
  const folderIn = h('input', { type: 'text', placeholder: 'Folder for new uploads', 'aria-label': 'Upload folder' });
  const shrink = async f => {
    if (!/^image\/(jpeg|png|webp)$/.test(f.type)) return f;
    try {
      const bmp = await createImageBitmap(f), sc = Math.min(1, 1800 / Math.max(bmp.width, bmp.height)), c = document.createElement('canvas');
      c.width = Math.round(bmp.width * sc); c.height = Math.round(bmp.height * sc); c.getContext('2d').drawImage(bmp, 0, 0, c.width, c.height);
      const blob = await new Promise(r => c.toBlob(r, 'image/webp', 0.85));
      return blob && blob.size < f.size ? new File([blob], f.name.replace(/\.\w+$/, '') + '.webp', { type: 'image/webp' }) : f;
    } catch { return f; }
  };
  const file = h('input', { type: 'file', multiple: true, accept: 'image/jpeg,image/png,image/webp,image/gif,image/avif,application/pdf', hidden: true, onchange: async () => {
    if (!file.files.length) return; let ok = 0; const bad = [];
    for (const orig of [...file.files]) {
      const f = await shrink(orig);
      if (f.size > 4.2 * 1024 * 1024) { bad.push(orig.name + ': too large (limit about 4 MB per file; shrink or compress it first)'); continue; }
      const fd = new FormData(); fd.append('files', f); fd.append('folder', folderIn.value || '');
      try { const r = await api('/api/admin/media', { method: 'POST', form: fd }); ok += r.uploaded; bad.push(...r.rejected); }
      catch (e) { if (e.data && e.data.rejected) bad.push(...e.data.rejected); else { fail(e); } }
    }
    toast('Uploaded ' + ok + ' file(s).' + (bad.length ? ' Not uploaded: ' + bad.join('; ') : ''), bad.length > 0);
    file.value = ''; load();
  } });
  let folders = [];
  async function load() {
    try {
      const p = new URLSearchParams({ q: q.value, folder: fol.value || '__all', kind: kind.value }); const r = await api('/api/admin/media?' + p);
      if (r.folders.join() !== folders.join()) { folders = r.folders; const cur = fol.value; fol.replaceChildren(h('option', { value: '__all' }, 'All folders'), h('option', { value: '' }, '(no folder)'), r.folders.map(f => h('option', { value: f }, f))); fol.value = cur || '__all'; }
      grid.replaceChildren(...r.items.map(m => h('div', { class: 'mcard' },
        h('div', { class: 'th' }, m.thumb ? h('img', { src: m.thumb, alt: m.name, loading: 'lazy' }) : 'PDF'),
        h('div', { class: 'meta' }, h('b', {}, m.name), h('span', {}, (m.folder || 'no folder') + ' | ' + Math.round(m.size / 1024) + ' KB' + (m.width ? ' | ' + m.width + 'x' + m.height : '')), h('span', {}, m.usage ? 'Used ' + m.usage + 'x on the site' : 'Not used')),
        h('div', { class: 'acts' },
          onPick && h('button', { class: 'btn sm pri', type: 'button', onclick: () => onPick(m.url) }, 'Select'),
          h('button', { class: 'btn sm', type: 'button', onclick: () => { navigator.clipboard && navigator.clipboard.writeText(location.origin + m.url).then(() => toast('Link copied')); } }, 'Copy link'),
          h('button', { class: 'btn sm', type: 'button', onclick: async () => { const n = prompt('New display name', m.name); if (n == null) return; const f = prompt('Folder (leave empty for none)', m.folder); if (f == null) return; try { await api('/api/admin/media/' + m.id, { method: 'PATCH', json: { name: n, folder: f } }); load(); } catch (e) { fail(e); } } }, 'Rename / move'),
          h('button', { class: 'btn sm danger', type: 'button', onclick: async () => {
            try { await api('/api/admin/media/' + m.id, { method: 'DELETE' }); toast('Deleted'); load(); }
            catch (e) { if (e.status === 409 && confirm(e.message + ' Deleting it will break those images/links. Delete anyway?')) { try { await api('/api/admin/media/' + m.id + '?force=1', { method: 'DELETE' }); load(); } catch (x) { fail(x); } } else if (e.status !== 409) fail(e); }
          } }, 'Delete')))));
      if (!r.items.length) grid.replaceChildren(h('p', { class: 'hint' }, 'No files found. Upload images or PDFs to get started.'));
    } catch (e) { fail(e); }
  }
  [q, fol, kind].forEach(e => e.addEventListener('input', load));
  root.append(h('div', { class: 'bar' }, h('button', { class: 'btn pri', type: 'button', onclick: () => file.click() }, 'Upload files'), folderIn, file, q, fol, kind), grid);
  load(); return root;
}
function pickMedia(cb) {
  const m = h('div', { class: 'modal', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Media library', onclick: e => { if (e.target === m) m.remove(); } });
  const close = () => { m.remove(); document.removeEventListener('keydown', esc); }; const esc = e => { if (e.key === 'Escape') close(); }; document.addEventListener('keydown', esc);
  m.append(h('div', {}, h('div', { class: 'bar' }, h('h2', { style: 'flex:1' }, 'Choose a file'), h('button', { class: 'btn', type: 'button', onclick: close }, 'Close')), mediaBrowser(url => { cb(url); close(); })));
  document.body.append(m);
}

/* ---------- views ---------- */
async function dashboard(c) {
  const s = await api('/api/admin/stats'), go = hash => () => { location.hash = hash; };
  c.append(h('div', { class: 'grid4' }, [['Projects', s.projects], ['Services', s.services], ['Certificates', s.certificates], ['Skills', s.skills], ['Messages', s.messages + ' (' + s.unread + ' unread)']].map(([l, n]) => h('div', { class: 'stat' }, h('b', {}, n), l))),
    h('div', { class: 'card' }, h('h2', {}, 'Quick actions'), h('div', { class: 'bar', style: 'margin-top:.8rem' },
      h('button', { class: 'btn pri', onclick: go('#/projects') }, 'Manage projects'), h('button', { class: 'btn', onclick: go('#/messages') }, 'Read messages'), h('button', { class: 'btn', onclick: go('#/media') }, 'Upload media'), h('button', { class: 'btn', onclick: go('#/design') }, 'Website design'), h('a', { class: 'btn', href: '/', target: '_blank', rel: 'noopener' }, 'View website'))),
    h('div', { class: 'card' }, h('h2', {}, 'Recent messages'), s.recentMessages.length ? h('table', {}, s.recentMessages.map(m => h('tr', { class: 'click' + (m.is_read ? '' : ' unread'), onclick: go('#/messages') }, h('td', {}, m.name), h('td', {}, m.type || 'General'), h('td', {}, new Date(m.created_at).toLocaleString())))) : h('p', { class: 'hint' }, 'No messages yet.')),
    h('div', { class: 'card' }, h('h2', {}, 'Recent projects'), s.recentProjects.length ? h('table', {}, s.recentProjects.map(p => h('tr', {}, h('td', {}, p.title), h('td', {}, p.status)))) : h('p', { class: 'hint' }, 'No projects yet.')));
}
async function messages(c) {
  const wrap = h('div'); c.append(wrap);
  async function load(sel) {
    const { items } = await api('/api/admin/messages'); const cur = items.find(m => m.id === sel);
    const list = h('div', { class: 'card' }, items.length ? h('table', {}, h('thead', {}, h('tr', {}, h('th', {}, 'From'), h('th', {}, 'Type'), h('th', {}, 'Date'))), h('tbody', {}, items.map(m => h('tr', { class: 'click' + (m.is_read ? '' : ' unread'), tabindex: 0, onclick: async () => { if (!m.is_read) await api('/api/admin/messages/' + m.id, { method: 'PATCH', json: { is_read: true } }); load(m.id); refreshBadge(); }, onkeydown: e => { if (e.key === 'Enter') e.target.click(); } }, h('td', {}, m.name), h('td', {}, m.type || 'General'), h('td', {}, new Date(m.created_at).toLocaleString()))))) : h('p', { class: 'hint' }, 'No messages yet. Visitor messages from the Contact page will appear here.'));
    const det = cur ? h('div', { class: 'card' }, h('h2', {}, cur.name), h('p', {}, h('a', { href: 'mailto:' + cur.email }, cur.email), ' | ' + new Date(cur.created_at).toLocaleString()), h('p', {}, h('b', {}, 'Inquiry: '), cur.type || 'General', cur.budget ? ' | Budget: ' + cur.budget : ''), h('div', { class: 'msg' }, cur.message),
      h('div', { class: 'bar' }, h('button', { class: 'btn', onclick: async () => { await api('/api/admin/messages/' + cur.id, { method: 'PATCH', json: { is_read: !cur.is_read } }); load(cur.id); refreshBadge(); } }, cur.is_read ? 'Mark as unread' : 'Mark as read'), h('a', { class: 'btn pri', href: 'mailto:' + cur.email + '?subject=' + encodeURIComponent('Re: your message') }, 'Reply by email'), h('button', { class: 'btn danger', onclick: async () => { if (confirm('Delete this message permanently?')) { await api('/api/admin/messages/' + cur.id, { method: 'DELETE' }); load(); refreshBadge(); } } }, 'Delete'))) : null;
    wrap.replaceChildren(list, det);
  }
  load().catch(fail);
}
function media(c) { c.append(h('p', { class: 'hint' }, 'Images are optimized automatically (resized, converted to WebP, with a small version for fast loading). PDFs are stored as they are. Files that are in use cannot be deleted without a warning.'), mediaBrowser(null)); }
function account(c, user) {
  const pwForm = (title, fields, onSubmit, btn) => h('form', { class: 'card stack', onsubmit: async e => { e.preventDefault(); try { await onSubmit(); e.target.reset(); } catch (x) { fail(x); } } }, h('h2', {}, title), fields, h('button', { class: 'btn pri', type: 'submit', style: 'justify-self:start' }, btn));
  c.append(
    pwForm('Change username (now: ' + user + ')', [F('a-cur1', 'Current password', 'password', { ac: 'current-password' }), F('a-user', 'New username', 'text', { ac: 'username' })], async () => { await api('/api/admin/account/username', { method: 'POST', json: { current: $('#a-cur1').value, username: $('#a-user').value.trim() } }); toast('Username changed.'); start(); }, 'Change username'),
    pwForm('Change password', [F('a-cur2', 'Current password', 'password', { ac: 'current-password' }), F('a-new', 'New password (10+ characters)', 'password', { ac: 'new-password', minlength: 10 }), F('a-new2', 'Repeat new password', 'password', { ac: 'new-password' })], async () => { if ($('#a-new').value !== $('#a-new2').value) throw new Error('New passwords do not match.'); await api('/api/admin/account/password', { method: 'POST', json: { current: $('#a-cur2').value, next: $('#a-new').value } }); toast('Password changed. Other devices were signed out.'); }, 'Change password'),
    pwForm('Generate new recovery codes', [h('p', { class: 'hint' }, 'This invalidates all old recovery codes.'), F('a-cur3', 'Current password', 'password', { ac: 'current-password' })], async () => { const r = await api('/api/admin/account/recovery-codes', { method: 'POST', json: { current: $('#a-cur3').value } }); codesScreen(r.recoveryCodes, false); }, 'Generate codes'),
    h('div', { class: 'card' }, h('p', { class: 'hint' }, 'Only one administrator account is supported. If you lose both your password and your recovery codes, use the server command described in the README (npm run reset-password).')));
}
async function backup(c) {
  const fileIn = h('input', { type: 'file', accept: 'application/json,.json' }), inc = h('input', { type: 'checkbox' });
  const vers = h('div'); const loadV = async () => { const { versions } = await api('/api/admin/versions'); vers.replaceChildren(versions.length ? h('table', {}, versions.map(v => h('tr', {}, h('td', {}, new Date(v.created_at).toLocaleString()), h('td', {}, v.note), h('td', {}, h('button', { class: 'btn sm', onclick: async () => { if (prompt('Restore this earlier version of ALL website content? Your current content is saved as a new version first.\nType RESTORE to confirm.') !== 'RESTORE') return; try { await api('/api/admin/versions/' + v.id + '/restore', { method: 'POST', json: { confirm: 'RESTORE' } }); dirty = false; const r = await api('/api/admin/site'); SITE = r.site; toast('Version restored.'); loadV(); } catch (e) { fail(e); } } }, 'Restore'))))) : h('p', { class: 'hint' }, 'Versions appear after your first save.')); };
  c.append(h('div', { class: 'card stack' }, h('h2', {}, 'Export'), h('p', { class: 'hint' }, 'Downloads all website content, media records and contact messages as one JSON file. Uploaded files themselves are NOT inside this file: back up the data/uploads folder too (see README, "Backups").'), h('a', { class: 'btn pri', href: '/api/admin/backup', style: 'justify-self:start' }, 'Download backup (JSON)')),
    h('div', { class: 'card stack' }, h('h2', {}, 'Restore from a backup file'), h('p', { class: 'hint' }, 'Replaces ALL current website content. A copy of the current content is kept in the version history first.'), fileIn, h('label', { class: 'fld chk' }, inc, 'Also replace contact messages with those in the backup'),
      h('button', { class: 'btn danger', style: 'justify-self:start', onclick: async () => { if (!fileIn.files[0]) return toast('Choose a backup file first.', true); let b; try { b = JSON.parse(await fileIn.files[0].text()); } catch { return toast('That file is not valid JSON.', true); } if (prompt('This will replace all website content with the backup. Type RESTORE to confirm.') !== 'RESTORE') return; try { await api('/api/admin/restore', { method: 'POST', json: { backup: b, confirm: 'RESTORE', includeMessages: inc.checked } }); dirty = false; SITE = (await api('/api/admin/site')).site; toast('Backup restored.'); loadV(); } catch (e) { fail(e); } } }, 'Restore backup')),
    h('div', { class: 'card' }, h('h2', {}, 'Version history (last 30 saves)'), vers));
  loadV().catch(fail);
}

const E = (id, label, keys, hint) => ({ id, label, keys, hint });
const SECTIONS = [
  { id: 'dashboard', label: 'Dashboard', view: dashboard },
  E('profile', 'Profile Settings', ['name', 'initials', 'title', 'headline', 'intro', 'photo', 'photoAlt', 'profile', 'contact'], 'Your name, title, photo, contact details and extended profile (education and experience also appear on the About page when filled in).'),
  E('home', 'Home Page', ['hero', 'homeSections', 'highlights', 'projects', 'journey', 'preview', 'homeClosing'], 'Use "Home sections" to switch sections on/off, reorder them and change their headings. "Projects" below are the fallback cards: the Home page shows projects marked Featured instead, when any exist.'),
  E('about', 'About Page', ['about'], 'Everything on the About page. Add Education, Experience or extra sections below.'),
  E('projects', 'Projects', ['portfolioFilters', 'portfolio'], 'Categories become the filter tabs on the Portfolio page (a tab only appears once a visible project uses it). Tick "Featured" to show a project on the Home page. Drag the :: handle or use Up/Down to reorder.'),
  E('services', 'Services', ['servicesPage', 'services'], 'The Services page, plus the smaller services list shown on the Home page. Leave Price empty to show "Pricing on Request".'),
  { id: 'skills', label: 'Skills', keys: ['skills'], hint: 'Skill cards on the Home page. Level is optional and shown only if you fill it in. Skill groups on the About page are edited under About Page.' },
  E('certificates', 'Certificates', ['certificatesPage'], 'Add certificates under "Certificates" and awards under "Awards". Upload the image or PDF with Choose / Upload.'),
  E('contactpage', 'Contact Page', ['contactPage'], 'Headings, labels, cards, messages and form options. Card values can use {email}, {whatsappDisplay}, {whatsappDigits}, {linkedin}, {location} from Profile Settings.'),
  { id: 'messages', label: 'Messages', view: messages, badge: true },
  { id: 'media', label: 'Media Library', view: media },
  E('navigation', 'Navigation', ['nav'], 'Menu names, links, order and visibility (also used by the footer).'),
  E('footer', 'Footer Settings', ['footer', 'footerBlurb', 'social'], 'Use {year} in the copyright text for the current year. Social links with an empty URL are shown as disabled.'),
  E('design', 'Website Design', ['brand', 'design'], 'Branding (name, logo, favicon) and design (colors, fonts, radius, buttons, theme). Changes apply to every page.'),
  E('seo', 'SEO Settings', ['seo'], 'Search engine and social sharing information.'),
  { id: 'account', label: 'Admin Account', view: account },
  { id: 'backup', label: 'Backup & Restore', view: backup },
  { id: 'logout', label: 'Logout' }
];
let USER = '', unread = 0;
const refreshBadge = async () => { try { unread = (await api('/api/admin/stats')).unread; const b = $('#badge'); if (b) { b.textContent = unread; b.hidden = !unread; } } catch { } };
async function boot(user) {
  USER = user;
  try { [META, SITE] = [await api('/api/admin/meta'), (await api('/api/admin/site')).site]; if (SITE.design && !SITE.design.motion) SITE.design.motion = 'cinematic'; } catch (e) { return fail(e); }
  const app = $('#app'); app.replaceChildren();
  const side = h('nav', { class: 'side', 'aria-label': 'Admin' }, h('div', { class: 'brand' }, h('span', {}, 'MSH'), 'Admin'),
    SECTIONS.map(s => h('a', { href: s.id === 'logout' ? '#/logout' : '#/' + s.id, 'data-id': s.id, onclick: () => side.classList.remove('open') }, s.label, s.badge && h('span', { class: 'badge', id: 'badge', hidden: true }))));
  app.append(h('div', { class: 'shell' }, side, h('main', { id: 'main' })));
  window.onhashchange = route; route(); refreshBadge();
}
async function route() {
  const id = (location.hash.replace(/^#\//, '') || 'dashboard'), sec = SECTIONS.find(s => s.id === id) || SECTIONS[0];
  if (sec.id === 'logout') { await api('/api/auth/logout', { method: 'POST', json: {}, noRedirect: true }).catch(() => { }); dirty = false; location.hash = ''; return start(); }
  document.querySelectorAll('.side a').forEach(a => a.dataset.id === sec.id ? a.setAttribute('aria-current', 'page') : a.removeAttribute('aria-current'));
  const main = $('#main'), c = h('div'); const editable = !!sec.keys;
  const save = h('button', { class: 'btn pri', id: 'save', disabled: !dirty, onclick: async e => {
    e.target.disabled = true; e.target.textContent = 'Saving...';
    try { await api('/api/admin/site', { method: 'PUT', json: { site: SITE } }); dirty = false; $('#dirty').hidden = true; toast('Saved. The public website is updated.'); }
    catch (x) { fail(x); e.target.disabled = false; } e.target.textContent = 'Save changes';
  } }, 'Save changes');
  main.replaceChildren(h('div', { class: 'top' }, h('button', { class: 'btn menu-btn', 'aria-label': 'Open menu', onclick: () => $('.side').classList.toggle('open') }, 'Menu'), h('h1', {}, sec.label),
    editable && h('span', { class: 'dirty', id: 'dirty', hidden: !dirty }, 'Unsaved changes'), editable && save, h('a', { class: 'btn', href: '/', target: '_blank', rel: 'noopener' }, 'View site')), c);
  if (sec.hint) c.append(h('p', { class: 'hint' }, sec.hint));
  if (sec.keys) sec.keys.forEach(k => { if (k in SITE) c.append(field(SITE, k, k)); });
  else if (sec.view) { try { await sec.view(c, USER); } catch (e) { fail(e); } }
  window.scrollTo(0, 0);
}
start().catch(e => { document.body.append(h('p', { class: 'err' }, 'Could not reach the server: ' + e.message)); });
})();
