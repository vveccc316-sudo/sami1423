(function () {
  var S = window.SITE;
  var root = document.documentElement;
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
  var calmPref = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var classic = !!(S.design && S.design.motion === "classic");
  var calm = calmPref || classic;

  /* ---------- design settings from Admin (colours, fonts, theme, SEO) ---------- */
  (function applyLook() {
    var FONTS = { "Bricolage Grotesque": "Bricolage+Grotesque:wght@600;700;800", "Figtree": "Figtree:wght@400;500;600", "Inter": "Inter:wght@400;500;600;700", "Poppins": "Poppins:wght@400;500;600;700", "Manrope": "Manrope:wght@400;500;600;700;800", "Sora": "Sora:wght@400;600;700;800", "Space Grotesk": "Space+Grotesk:wght@400;500;600;700", "DM Sans": "DM+Sans:wght@400;500;600;700", "Montserrat": "Montserrat:wght@400;500;600;700;800", "Playfair Display": "Playfair+Display:wght@500;600;700;800", "Lora": "Lora:wght@400;500;600;700", "Roboto": "Roboto:wght@400;500;700" };
    var d = S.design || {}, v = [], up = function (x) { return String(x || "").toUpperCase(); }, hex = function (x) { return /^#[0-9a-f]{6}$/i.test(x || ""); };
    // Settings saved before the redesign still hold the old orange/blue/light defaults: ignore those so the new look shows.
    var oldColors = up(d.primary) === "#FF6A13" && up(d.secondary) === "#1F5BFF";
    var oldFonts = d.headingFont === "Bricolage Grotesque" && d.bodyFont === "Figtree";
    var oldTheme = d.theme !== "dark" && up(d.background) === "#F7F5F1";
    var dark = oldTheme ? true : d.theme !== "light";
    if (!oldColors) { if (hex(d.primary)) v.push("--orange:" + d.primary); if (hex(d.secondary)) v.push("--blue:" + d.secondary); if (hex(d.accent)) v.push("--orange-ink:" + d.accent); }
    if (!dark && !oldTheme && hex(d.background)) v.push("--bg:" + d.background, "--bg2:color-mix(in srgb, " + d.background + " 93%, #000)");
    if (isFinite(+d.radius) && +d.radius !== 14) v.push("--r:" + Math.max(0, Math.min(40, +d.radius)) + "px");
    var hf = oldFonts ? "Sora" : d.headingFont, bf = oldFonts ? "Inter" : d.bodyFont;
    if (FONTS[hf]) v.push('--display:"' + hf + '","Segoe UI",system-ui,sans-serif');
    if (FONTS[bf]) v.push('--body:"' + bf + '","Segoe UI",system-ui,sans-serif');
    var st = document.getElementById("site-design"); if (!st) { st = document.createElement("style"); st.id = "site-design"; document.head.appendChild(st); }
    st.textContent = ":root{" + v.join(";") + "}";
    root.setAttribute("data-theme", dark ? "dark" : "light"); root.setAttribute("data-btn", d.buttonStyle || "pill");
    var fams = []; [hf, bf].forEach(function (f) { if (FONTS[f] && fams.indexOf("family=" + FONTS[f]) < 0) fams.push("family=" + FONTS[f]); });
    var fl = document.querySelector('link[href*="fonts.googleapis.com/css2"]');
    if (fams.length && fl && fl.getAttribute("data-set") !== "1") { fl.href = "https://fonts.googleapis.com/css2?" + fams.join("&") + "&display=swap"; fl.setAttribute("data-set", "1"); }
    var seo = S.seo || {}, site = (S.brand && S.brand.siteName) || S.name, meta = function (sel, attr, name, val) { if (!val) return; var m = document.querySelector(sel); if (!m) { m = document.createElement("meta"); m.setAttribute(attr, name); document.head.appendChild(m); } m.setAttribute("content", val); };
    var file = location.pathname.split("/").pop().replace(/\.html$/, ""), label = (document.title.split("|")[0] || "").trim();
    var title = (!file || file === "index") ? (seo.title || site) : (label ? label + " | " + site : site); document.title = title;
    meta('meta[name="description"]', "name", "description", seo.description); meta('meta[name="keywords"]', "name", "keywords", seo.keywords);
    meta('meta[property="og:title"]', "property", "og:title", seo.ogTitle || title); meta('meta[property="og:description"]', "property", "og:description", seo.ogDescription || seo.description);
    if (seo.ogImage) meta('meta[property="og:image"]', "property", "og:image", /^\//.test(seo.ogImage) ? location.origin + seo.ogImage : seo.ogImage);
    if (S.brand && S.brand.favicon) { var ic = document.querySelector('link[rel="icon"]'); if (!ic) { ic = document.createElement("link"); ic.rel = "icon"; document.head.appendChild(ic); } ic.href = S.brand.favicon; }
  })();

  var B = S.brand || {}, NAME = B.siteName || S.name, F = S.footer || {};
  var NAV = S.nav.filter(function (n) { return n.visible !== false; });
  var ICONS = {
    ruler: "M3 17 17 3l4 4L7 21z M7 13l2 2 M10 10l2 2 M13 7l2 2",
    cube: "M12 3l8 4.5v9L12 21l-8-4.5v-9z M12 12l8-4.5 M12 12v9 M12 12L4 7.5",
    building: "M5 21V4h9v17 M14 9h5v12 M3 21h18 M8 8h3 M8 12h3 M8 16h3",
    calc: "M6 3h12v18H6z M9 7h6 M9 11h2 M13 11h2 M9 15h2 M13 15h2",
    frame: "M4 4h16v16H4z M4 9h16 M9 9v11",
    steel: "M5 4h14 M5 20h14 M12 4v16",
    cap: "M2 9l10-5 10 5-10 5z M6 11v5c0 1 3 3 6 3s6-2 6-3v-5",
    layers: "M12 3l9 5-9 5-9-5z M3 13l9 5 9-5",
    doc: "M6 3h9l4 4v14H6z M9 12h7 M9 16h7",
    linkedin: "M4 9h4v11H4z M6 4v.01 M10 9h4v2c1-2 6-3 6 2v7h-4v-6c0-2-3-2-3 0v6h-4z",
    link: "M10 14a4 4 0 005.7 0l3-3a4 4 0 00-5.7-5.7l-1 1 M14 10a4 4 0 00-5.7 0l-3 3a4 4 0 005.7 5.7l1-1",
    mail: "M3 5h18v14H3z M3 6l9 7 9-7",
    chat: "M4 5h16v11H9l-5 4z M8 9h8 M8 12h5",
    pin: "M12 21s-7-6-7-11a7 7 0 0114 0c0 5-7 11-7 11z M12 12a2 2 0 100-.01",
    arrow: "M7 17L17 7 M8 7h9v9",
    x: "M5 5l14 14M19 5L5 19",
    prev: "M15 5l-7 7 7 7",
    next: "M9 5l7 7-7 7",
    download: "M12 4v11 M7 11l5 5 5-5 M5 20h14"
  };
  var ic = function (n) { return '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="' + (ICONS[n] || ICONS.link) + '"/></svg>'; };
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };
  var map = function (a, f) { return (a || []).map(f).join(""); };
  var tok = function (v) { return String(v == null ? "" : v).replace(/\{(\w+)\}/g, function (m, k) { return k === "whatsappDigits" ? String(S.contact.whatsapp || "").replace(/\D/g, "") : (S.contact[k] !== undefined ? S.contact[k] : m); }); };
  var vis = function (x) { return x && x.visible !== false; };
  var byOrder = function (a, b) { return (a.order || 0) - (b.order || 0); };
  var kindOf = function (src) { return /\.pdf(\?|#|$)/i.test(src || "") ? "pdf" : /\.(webp|png|jpe?g|gif|avif|svg)(\?|#|$)/i.test(src || "") ? "img" : "file"; };
  var thumbOf = function (src) { var m = String(src || "").match(/^(\/uploads\/[a-f0-9]+)\.webp$/); return m ? m[1] + "-640.webp" : src; };

  function catLabel(p) { var f = (S.portfolioFilters || []).filter(function (x) { return x.key === p.category; })[0]; return f ? f.label : (p.categoryLabel || p.category || ""); }
  function filtersShown(items) { return S.portfolioFilters.filter(function (f) { return f.key === "all" || items.some(function (p) { return p.category === f.key; }); }); }
  function projects() {
    S.portfolio.forEach(function (p) {
      p.tools = p.tools || []; p.status = p.status || "Placeholder"; p.description = p.description || ""; p.files = p.files || [];
      if (!p.images || !p.images.length) p.images = p.thumbnail ? [{ src: p.thumbnail, alt: p.title }] : [{ src: "assets/img/placeholders/project-1.svg", alt: p.title }];
      if (!p.thumbnail) p.thumbnail = p.images[0].src;
    });
    return S.portfolio.filter(vis).sort(byOrder);
  }
  function counts(p) {
    var imgs = p.images.filter(function (i) { return !/placeholders\//.test(i.src); }).length, pdfs = p.files.filter(function (f) { return kindOf(f.src) === "pdf"; }).length, other = p.files.length - pdfs;
    var out = []; if (imgs) out.push(imgs + (imgs === 1 ? " photo" : " photos")); if (pdfs) out.push(pdfs + (pdfs === 1 ? " PDF" : " PDFs")); if (other) out.push(other + (other === 1 ? " file" : " files"));
    return out;
  }
  function socials() {
    return map(S.social, function (s) {
      var live = !!s.url;
      var a = live ? 'href="' + s.url + '"' + (/^https?:/.test(s.url) ? ' target="_blank" rel="noopener noreferrer"' : "") : 'aria-disabled="true" title="Link not added yet"';
      return '<a class="soc' + (live ? "" : " is-off") + '" ' + a + ' aria-label="' + s.label + (live ? "" : " (link not added yet)") + '">' + ic(s.icon) + "</a>";
    });
  }

  /* ---------- shared pieces ---------- */
  function header() {
    return '<header class="nav" id="top"><div class="wrap nav-in">' +
      '<a class="mark" href="index.html#home" data-cursor-link>' + (B.logo ? '<img class="mark-logo" src="' + B.logo + '" alt="">' : '<span class="mark-sq">' + S.initials + "</span>") + '<span class="mark-name">' + NAME + "</span></a>" +
      '<button class="burger" aria-expanded="false" aria-controls="menu" aria-label="Open menu"><span></span></button>' +
      '<nav id="menu" aria-label="Main"><ul>' + map(NAV, function (n) { return '<li><a href="' + n.href + '">' + n.label + "</a></li>"; }) + "</ul></nav></div></header>";
  }
  function footer() {
    return '<footer class="foot"><div class="wrap foot-in"><div class="foot-brand">' + (B.footerLogo ? '<img class="foot-logo" src="' + B.footerLogo + '" alt="">' : "") + '<p class="foot-name">' + NAME + '</p><p class="foot-role">' + (F.role || "Aspiring BIM Professional") + '</p><p>' + S.footerBlurb + "</p></div>" +
      '<nav aria-label="Footer"><ul>' + map(NAV, function (n) { return '<li><a href="' + n.href + '">' + n.label + "</a></li>"; }) + "</ul></nav>" +
      (F.showSocial === false ? "</div>" : '<div class="socials">' + socials() + "</div></div>") +
      '<div class="wrap foot-copy">' + (F.copyright ? F.copyright.replace("{year}", new Date().getFullYear()) : "&copy; " + new Date().getFullYear() + " " + NAME + ". All rights reserved.") + "</div></footer>";
  }
  function sec(id, eyebrow, title, sub, body, cls) {
    return '<section id="' + id + '" class="sec ' + (cls || "") + '" data-spy><div class="wrap"><div class="sec-head">' + (eyebrow ? '<p class="eyebrow reveal">' + eyebrow + "</p>" : "") + '<h2 class="split">' + title + "</h2>" + (sub ? '<p class="reveal">' + sub + "</p>" : "") + "</div>" + body + "</div></section>";
  }
  // The photo is built from vertical slats that open from the centre as --p (0..1) grows.
  function photo(auto) {
    var n = 14, strips = "";
    for (var i = 0; i < n; i++) {
      var k = Math.abs(i - (n - 1) / 2) / ((n - 1) / 2);
      strips += '<div class="strip" style="--i:' + i + ";--k:" + k.toFixed(3) + ";--dir:" + (i % 2 ? 1 : -1) + '"><img src="' + S.photo + '" alt="' + (i === 0 ? S.photoAlt : "") + '"' + (i ? ' aria-hidden="true"' : "") + ' decoding="async" data-fallback="profile" data-strip></div>';
    }
    return '<div class="ph-wrap"><div class="ph"' + (auto ? " data-auto" : "") + ' style="--n:' + n + '"><div class="strips">' + strips + '</div><div class="sheen"></div><span class="ph-tag a" aria-hidden="true">CAD · BIM · Civil</span><span class="ph-tag b" aria-hidden="true">Portfolio ' + new Date().getFullYear() + '</span></div><span class="ph-pct" aria-hidden="true"></span></div>';
  }
  function workCard(p, i, numbered) {
    var c = counts(p);
    return '<article class="wcard reveal" data-cat="' + p.category + '" data-id="' + p.id + '" data-open="' + p.id + '" data-cursor="View" tabindex="0" role="button" aria-label="Open project: ' + p.title + '">' +
      '<div class="wthumb"><img src="' + p.thumbnail + '" alt="' + (p.images[0].alt || p.title) + '" width="800" height="600" loading="lazy" data-fallback="project">' + (numbered ? '<span class="wnum">' + (i < 9 ? "0" : "") + (i + 1) + "</span>" : "") + (c.length ? '<div class="wbadge">' + map(c, function (t) { return "<span>" + t + "</span>"; }) + "</div>" : "") + "</div>" +
      '<div class="wmeta"><div><small class="cat">' + catLabel(p) + "</small><h3>" + p.title + "</h3>" + (p.description ? "<p>" + p.description + "</p>" : "") + '</div><span class="warrow">' + ic("arrow") + "</span></div></article>";
  }

  /* ---------- HOME ---------- */
  var DEFAULT_ORDER = ["hero", "projects", "skills", "certificates", "contact"];
  function homeOrder() {
    var saved = S.homeSections || [], has = {}; saved.forEach(function (x) { has[x.key] = 1; });
    if (saved.length && has.certificates) return saved; // already uses the new layout
    var out = DEFAULT_ORDER.map(function (k) { return { key: k, enabled: true }; }); // content saved before the redesign: apply the new order
    ["highlights", "services", "journey", "preview"].forEach(function (k) { out.push({ key: k, enabled: false }); });
    return out;
  }
  function home() {
    var HC = S.hero || {}, HS = {}, A = S.about || {}, certs = ((S.certificatesPage || {}).certificates || []).filter(vis).sort(byOrder);
    (S.homeSections || []).forEach(function (x) { HS[x.key] = x; });
    var H = function (k, sub, def) { var h = HS[k]; if (!h) return def; var v = sub ? h.sub : h.heading; return sub ? (v === undefined || v === null ? def : v) : (v || def); };
    var all = projects(), feat = all.filter(function (p) { return p.featured; }); if (!feat.length) feat = all; feat = feat.slice(0, 6);

    var hero = '<section id="home" class="stage" data-spy><div class="stage-pin"><div class="stage-bg" aria-hidden="true"><div class="halo"></div><div class="floor"></div></div><div class="stage-in">' +
      '<div class="stage-copy"><p class="eyebrow">' + S.name + '</p><h1><span class="role sx" data-at=".1">' + S.title + '</span><span class="headline sx" data-at=".2" data-split="3">' + S.headline + "</span></h1>" +
      '<p class="lead sx" data-at=".45">' + S.intro + '</p><div class="cta sx" data-at=".62"><a class="btn btn-pri" href="' + (HC.cta1Href || "#projects") + '">' + (HC.cta1Text || "View My Projects") + '</a><a class="btn btn-ghost" href="' + (HC.cta2Href || "#contact") + '">' + (HC.cta2Text || "Contact Me") + "</a></div></div>" +
      photo(false) + '</div><div class="scroll-cue" aria-hidden="true">Scroll</div></div></section>';

    var pr = sec("projects", "01 / Selected work", H("projects", 0, "Selected Work"), H("projects", 1, "Open any project to browse every photo and PDF drawing inside it."),
      '<div class="work-grid">' + map(feat, function (p, i) { return workCard(p, i, true); }) + '</div><div class="center reveal"><a class="btn btn-pri" href="' + S.portfolioHref + '">' + ((HS.projects && HS.projects.buttonText) || "View Full Portfolio") + "</a></div>");

    var sk = sec("skills", "02 / Skills", H("skills", 0, "Skills & Expertise"), H("skills", 1, "Skills I use today, and the ones I am actively learning."),
      '<div class="legend reveal"><span class="tag t-cur">Current skill</span><span class="tag t-dev">Currently learning</span></div><div class="skills-grid">' + map(S.skills.filter(vis), function (k) {
        var cur = k.status === "current";
        return '<article class="card skill ' + (cur ? "is-cur" : "is-dev") + ' reveal">' + ic(k.icon) + '<span class="tag ' + (cur ? "t-cur" : "t-dev") + '">' + (cur ? "Current" : "Learning") + "</span><h3>" + k.name + "</h3><p>" + k.desc + '</p><small class="cat">' + k.cat + "</small>" + (k.level ? '<small class="cat lvl">Level: ' + k.level + "</small>" : "") + "</article>";
      }) + "</div>");

    var edu = (A.education && A.education.length) ? A.education : ((S.profile && S.profile.education) || []);
    edu = edu.filter(function (e) { return e && (e.title || e.org); });
    var ce = "";
    if (edu.length || certs.length) {
      var eduHtml = edu.length ? '<ol class="edu reveal">' + map(edu, function (e) { return "<li><h3>" + (e.title || "") + "</h3>" + ((e.org || e.period) ? "<p>" + [e.org, e.period].filter(Boolean).join(" · ") + "</p>" : "") + (e.text ? "<p>" + e.text + "</p>" : "") + "</li>"; }) + "</ol>" : "";
      var cg = certs.length ? '<div class="cgrid">' + map(certs.slice(0, 6), certCard) + "</div>" : "";
      ce = sec("certificates", "03 / Qualifications", H("certificates", 0, "Qualifications & Certificates"), H("certificates", 1, "Education, training and certificates."),
        '<div class="' + (eduHtml && cg ? "qual" : "") + '">' + eduHtml + cg + "</div>" + (certs.length ? '<div class="center reveal"><a class="btn btn-ghost" href="certificates.html">All certificates</a></div>' : ""));
    }

    var hl = sec("highlights", "", H("highlights", 0, "Professional Highlights"), H("highlights", 1, ""), '<div class="grid g4">' + map(S.highlights, function (h) { return '<article class="card reveal">' + ic(h.icon) + "<h3>" + h.label + "</h3><p>" + h.value + "</p></article>"; }) + "</div>");
    var sv = sec("services", "", H("services", 0, "Services & Technical Capabilities"), H("services", 1, ""), '<div class="grid g3">' + map(S.services, function (s) { return '<article class="card reveal">' + ic(s.icon) + "<h3>" + s.name + "</h3><p>" + s.desc + "</p></article>"; }) + "</div>");
    var jr = sec("journey", "", H("journey", 0, "Practical Experience & Learning Journey"), H("journey", 1, ""), '<ol class="tl">' + map(S.journey, function (j, i) { return '<li class="reveal' + (i === S.journey.length - 1 ? " now" : "") + '"><h3>' + j.title + "</h3><p>" + j.text + "</p></li>"; }) + "</ol>");
    var pv = sec("preview", "", H("preview", 0, "Featured Work Preview"), H("preview", 1, ""), '<div class="grid g3">' + map(S.preview, function (v) { return '<figure class="wcard reveal" style="margin:0"><div class="wthumb"><img src="' + v.img + '" alt="' + v.label + '" loading="lazy" data-fallback="project"></div><div class="wmeta"><div><h3>' + v.label + "</h3></div></div></figure>"; }) + "</div>");

    var CL = Object.assign({ heading: "Let’s Build Something Meaningful.", text: "Interested in CAD, BIM, Civil Engineering, or technical collaboration? Feel free to connect with me and explore my work.", btn1Text: "Contact Me", btn1Href: S.contactHref, btn2Text: "Connect on LinkedIn" }, S.homeClosing || {});
    var li = S.contact.linkedin ? '<a class="btn btn-blue" href="' + S.contact.linkedin + '" target="_blank" rel="noopener noreferrer">' + CL.btn2Text + "</a>" : '<a class="btn btn-blue is-off" aria-disabled="true" title="LinkedIn link not added yet">' + CL.btn2Text + "</a>";
    var ct = '<section id="contact" class="cta-sec" data-spy><div class="wrap"><div class="cta-box reveal"><h2 class="split">' + CL.heading + "</h2><p>" + CL.text + '</p><div class="cta"><a class="btn btn-pri" href="' + CL.btn1Href + '">' + CL.btn1Text + "</a>" + li + "</div>" +
      (S.contact.email ? '<p class="mail"><a href="mailto:' + S.contact.email + '">' + S.contact.email + "</a></p>" : "") + "</div></div></section>";

    var parts = { hero: hero, projects: pr, skills: sk, certificates: ce, highlights: hl, services: sv, journey: jr, preview: pv, contact: ct };
    return map(homeOrder().filter(function (x) { return x.enabled !== false && parts[x.key]; }), function (x) { return parts[x.key]; });
  }

  /* ---------- certificates (card used on home + certificates page) ---------- */
  function certCard(c) {
    var thumb = c.image ? '<button type="button" class="cthumb" data-cert="' + c.id + '" data-cursor="Open" aria-label="View certificate: ' + c.title + '"><img src="' + thumbOf(c.image) + '" alt="Certificate: ' + c.title + '" loading="lazy"></button>'
      : c.pdf ? '<button type="button" class="cthumb cthumb-pdf" data-cert="' + c.id + '" data-cursor="Open" aria-label="Open certificate PDF: ' + c.title + '"><div>' + ic("doc") + "<span>PDF</span></div></button>" : '<div class="cthumb cthumb-ph" aria-hidden="true">' + ic("doc") + "</div>";
    var acts = ((c.image || c.pdf) ? '<button type="button" class="btn btn-ghost" data-cert="' + c.id + '">View<span class="sr"> certificate: ' + c.title + "</span></button>" : "") +
      (c.credentialUrl ? '<a class="lnk" href="' + c.credentialUrl + '" target="_blank" rel="noopener noreferrer">Verify<span class="sr"> credential: ' + c.title + "</span></a>" : "");
    return '<article class="card cert reveal" data-cat="' + (c.category || "other") + '">' + thumb + '<div class="cbody"><h3>' + c.title + "</h3>" + (c.issuer ? '<p class="cmeta">' + c.issuer + "</p>" : "") + (c.date ? '<p class="cmeta">' + c.date + "</p>" : "") + (c.description ? "<p>" + c.description + "</p>" : "") + (acts ? '<div class="cert-act">' + acts + "</div>" : "") + "</div></article>";
  }

  /* ---------- PORTFOLIO page ---------- */
  function portfolio() {
    var items = projects();
    return '<section class="p-head"><div class="wrap"><p class="eyebrow h-in">My Work</p><h1 class="h-in split" style="--d:.1s">Projects & Technical Work</h1><p class="lead h-in" style="--d:.2s">Open any project to see its cover, every photo and every PDF drawing inside it.</p></div></section>' +
      '<section class="sec p-gal"><div class="wrap"><div class="filters" role="group" aria-label="Filter projects">' + map(filtersShown(items), function (f, i) { return '<button type="button" class="chip" data-filter="' + f.key + '" aria-pressed="' + (i === 0) + '">' + f.label + "</button>"; }) + '</div><p class="sr" id="f-status" aria-live="polite"></p><div class="pgrid" id="p-grid">' + map(items, function (p, i) { return workCard(p, i, false); }) + '</div><p class="empty" id="p-empty" hidden>No projects in this category yet.</p></div></section>';
  }
  function initFilter(gridSel, chipScope, emptySel, label) {
    var grid = $(gridSel); if (!grid) return;
    var cards = [].slice.call(grid.children), chips = $$(chipScope);
    chips.forEach(function (c) {
      c.addEventListener("click", function () {
        var k = c.dataset.filter; chips.forEach(function (x) { x.setAttribute("aria-pressed", x === c); });
        grid.classList.add("fading");
        setTimeout(function () {
          var n = 0;
          cards.forEach(function (card) { var show = k === "all" || card.dataset.cat === k; card.hidden = !show; if (show) { card.classList.add("in"); card.style.setProperty("--d", Math.min(n, 8) * 0.04 + "s"); n++; } });
          var em = $(emptySel); if (em) em.hidden = n > 0;
          var fs = $("#f-status"); if (fs) fs.textContent = n + " " + label + (n === 1 ? "" : "s") + " shown";
          grid.classList.remove("fading");
        }, calm ? 0 : 200);
      });
    });
  }

  /* ---------- VIEWER: any number of photos and PDFs, for projects and certificates ---------- */
  var vw = { dlg: null, items: [], cur: 0 };
  function viewerBuild() {
    if (vw.dlg) return;
    var d = document.createElement("dialog"); d.className = "vw"; d.id = "vw"; d.setAttribute("aria-labelledby", "vw-title");
    d.innerHTML = '<div class="vw-in"><button type="button" class="vw-x" aria-label="Close">' + ic("x") + '</button><div class="vw-media"><div class="vw-stage" id="vw-stage"></div><div class="vw-cap" id="vw-cap"></div><div class="vw-thumbs" id="vw-thumbs"></div></div><aside class="vw-info" id="vw-info"></aside></div>';
    document.body.appendChild(d); vw.dlg = d;
    $(".vw-x", d).addEventListener("click", function () { d.close(); });
    d.addEventListener("click", function (e) {
      if (e.target === d) { d.close(); return; }
      var t = e.target.closest("[data-vi]"); if (t) { vShow(+t.dataset.vi); return; }
      var n = e.target.closest("[data-step]"); if (n) { vShow((vw.cur + (+n.dataset.step) + vw.items.length) % vw.items.length); return; }
      var im = e.target.closest(".vw-stage img");
      if (im) { var r = im.getBoundingClientRect(); im.style.setProperty("--zx", ((e.clientX - r.left) / r.width * 100).toFixed(1) + "%"); im.style.setProperty("--zy", ((e.clientY - r.top) / r.height * 100).toFixed(1) + "%"); im.classList.toggle("zoomed"); }
    });
    d.addEventListener("close", function () { root.classList.remove("lock"); $("#vw-stage").innerHTML = ""; });
    d.addEventListener("keydown", function (e) { if (vw.items.length > 1 && (e.key === "ArrowRight" || e.key === "ArrowLeft")) vShow((vw.cur + (e.key === "ArrowRight" ? 1 : -1) + vw.items.length) % vw.items.length); });
  }
  function vShow(i) {
    var it = vw.items[i]; if (!it) return; vw.cur = i;
    var st = $("#vw-stage"), n = vw.items.length;
    var nav = n > 1 ? '<button type="button" class="vw-nav prev" data-step="-1" aria-label="Previous">' + ic("prev") + '</button><button type="button" class="vw-nav next" data-step="1" aria-label="Next">' + ic("next") + "</button>" : "";
    var cnt = '<span class="vw-count">' + (i + 1) + " / " + n + "</span>";
    if (it.type === "pdf") st.innerHTML = '<iframe src="' + it.src + '#view=FitH" title="' + (it.label || "PDF") + '"></iframe><div class="vw-pdfbar"><a class="btn btn-ghost" href="' + it.src + '" target="_blank" rel="noopener noreferrer">Open full screen</a><a class="btn btn-pri" href="' + it.src + '" download>Download</a></div>' + nav + cnt;
    else st.innerHTML = '<img src="' + it.src + '" alt="' + (it.label || "") + '" draggable="false">' + nav + cnt;
    $("#vw-cap").textContent = it.label || "";
    $$(".vt", vw.dlg).forEach(function (b, j) { b.setAttribute("aria-current", j === i); });
    var cur = $(".vt[aria-current=true]", vw.dlg); if (cur && cur.scrollIntoView) cur.scrollIntoView({ block: "nearest", inline: "nearest" });
  }
  function openViewer(o) {
    viewerBuild(); var items = o.items && o.items.length ? o.items : [{ type: "img", src: "assets/img/placeholders/project-1.svg", label: o.title }];
    vw.items = items;
    $("#vw-thumbs").innerHTML = items.length > 1 ? map(items, function (it, j) {
      return it.type === "pdf" ? '<button type="button" class="vt pdf" data-vi="' + j + '" aria-label="' + (it.label || "PDF") + '"><div>' + ic("doc") + "<span>" + (it.label || "PDF") + "</span></div></button>" : '<button type="button" class="vt" data-vi="' + j + '" aria-label="Show ' + (it.label || "item " + (j + 1)) + '"><img src="' + thumbOf(it.src) + '" alt="" loading="lazy"></button>';
    }) : "";
    $("#vw-thumbs").hidden = items.length < 2;
    var files = (o.files || []).filter(function (f) { return f.src; });
    $("#vw-info").innerHTML = (o.cat ? '<small class="cat">' + o.cat + "</small>" : "") + '<h2 id="vw-title">' + o.title + "</h2>" + (o.tag || "") + (o.desc ? "<p>" + o.desc + "</p>" : "") + (o.more ? "<p>" + o.more + "</p>" : "") +
      "<dl>" + map(o.meta || [], function (m) { return "<dt>" + m[0] + "</dt><dd>" + m[1] + "</dd>"; }) +
      (files.length ? "<dt>Files (" + files.length + ")</dt><dd><div class=\"vw-files\">" + map(files, function (f) { var idx = items.map(function (x) { return x.src; }).indexOf(f.src); return (idx > -1 ? '<button type="button" data-vi="' + idx + '">' + ic("doc") + (f.label || "File") + "</button>" : '<a href="' + f.src + '" target="_blank" rel="noopener noreferrer">' + ic("download") + (f.label || "File") + "</a>"); }) + "</div></dd>" : "") + "</dl>";
    vShow(0); root.classList.add("lock"); vw.dlg.showModal(); $("#vw-info").scrollTop = 0;
  }
  function initProjectViewer() {
    var byId = {}; S.portfolio.forEach(function (p) { byId[p.id] = p; });
    var go = function (el) {
      var p = byId[el.dataset.open]; if (!p) return;
      var items = [], seen = {}, add = function (it) { if (it.src && !seen[it.src]) { seen[it.src] = 1; items.push(it); } };
      if (p.thumbnail && !/placeholders\//.test(p.thumbnail)) add({ type: "img", src: p.thumbnail, label: "Cover · " + p.title });
      p.images.forEach(function (im, i) { add({ type: "img", src: im.src, label: im.alt || (p.title + " · " + (i + 1)) }); });
      p.files.forEach(function (f) { var k = kindOf(f.src); if (k !== "file") add({ type: k, src: f.src, label: f.label || (k === "pdf" ? "PDF" : "Image") }); });
      if (!items.length) p.images.forEach(function (im) { add({ type: "img", src: im.src, label: im.alt }); });
      var tag = '<span class="tag ' + (p.status === "Learning example" ? "t-dev" : p.status === "Completed" ? "t-cur" : "t-ph") + '">' + p.status + "</span>";
      var meta = []; if (p.tools.length) meta.push(["Software and tools", p.tools.join(", ")]); meta.push(["Status", p.status]);
      if (p.completionDate) meta.push(["Completed", p.completionDate]); if (p.location) meta.push(["Location", p.location]);
      if (p.externalUrl) meta.push(["Link", '<a class="lnk" href="' + p.externalUrl + '" target="_blank" rel="noopener noreferrer">Open project link</a>']);
      if (p.videoUrl) meta.push(["Video", '<a class="lnk" href="' + p.videoUrl + '" target="_blank" rel="noopener noreferrer">Watch video</a>']);
      openViewer({ cat: catLabel(p), title: p.title, tag: tag, desc: p.description, more: p.details, meta: meta, items: items, files: p.files.map(function (f) { return { src: f.src, label: f.label }; }) });
    };
    document.addEventListener("click", function (e) { var el = e.target.closest("[data-open]"); if (el && !e.target.closest("dialog")) go(el); });
    document.addEventListener("keydown", function (e) { if ((e.key === "Enter" || e.key === " ") && e.target.matches && e.target.matches("[data-open]")) { e.preventDefault(); go(e.target); } });
  }
  function initCertViewer() {
    var byId = {}; ((S.certificatesPage || {}).certificates || []).forEach(function (c) { byId[c.id] = c; });
    document.addEventListener("click", function (e) {
      var b = e.target.closest("[data-cert]"); if (!b || !byId[b.dataset.cert]) return;
      var c = byId[b.dataset.cert], items = [];
      if (c.image) items.push({ type: "img", src: c.image, label: c.title }); if (c.pdf) items.push({ type: "pdf", src: c.pdf, label: c.title + " (PDF)" });
      openViewer({ cat: c.issuer || "Certificate", title: c.title, desc: c.description, meta: [].concat(c.date ? [["Date", c.date]] : [], c.credentialUrl ? [["Credential", '<a class="lnk" href="' + c.credentialUrl + '" target="_blank" rel="noopener noreferrer">Verify credential</a>']] : []), items: items, files: [] });
    });
  }

  /* ---------- ABOUT ---------- */
  function about() {
    var A = S.about, AH = Object.assign({ journey: "My Journey", focus: "What I Focus On", learning: "My Learning Journey", learningSub: "A path of learning and skills development.", skills: "Technical Skills", skillsSub: "Skills I use, and the ones I am still building." }, A.headings || {});
    var hero = '<section id="top-about" class="about-hero" data-spy><div class="wrap"><div><p class="eyebrow h-in">' + A.eyebrow + '</p><h1 class="h-in split" style="--d:.1s">' + A.heading + '</h1><p class="lead h-in" style="--d:.25s">' + A.intro + '</p><div class="cta h-in" style="--d:.4s"><a class="btn btn-pri" href="' + (A.cta1Href || "#skills") + '">' + (A.cta1Text || "Explore My Skills") + '</a><a class="btn btn-ghost" href="' + (A.cta2Href || S.portfolioHref) + '">' + (A.cta2Text || "View My Projects") + "</a></div></div>" + photo(true) + "</div></section>";
    var story = sec("journey", "", AH.journey, "", '<div class="story">' + map(A.story, function (t) { return '<p class="reveal">' + t + "</p>"; }) + "</div>");
    var focus = sec("focus", "", AH.focus, "", '<div class="grid g4">' + map(A.focus, function (f) { return '<article class="card reveal">' + ic(f.icon) + "<h3>" + f.title + "</h3><p>" + f.text + "</p></article>"; }) + "</div>");
    var tl = sec("learning", "", AH.learning, AH.learningSub, '<ol class="tl">' + map(A.timeline, function (j, i) { return '<li class="reveal' + (i === A.timeline.length - 1 ? " now" : "") + '"><h3>' + j.title + "</h3><p>" + j.text + "</p></li>"; }) + "</ol>");
    var sk = sec("skills", "", AH.skills, AH.skillsSub, '<div class="grid g2">' + map(A.skillGroups, function (g) {
      return '<article class="card sgrp ' + (g.developing ? "is-dev" : "is-cur") + ' reveal">' + ic(g.icon) + '<span class="tag ' + (g.developing ? "t-dev" : "t-cur") + '">' + (g.developing ? "Currently learning" : g.software) + "</span><h3>" + g.title + "</h3><ul>" + map(g.items, function (i) { return "<li>" + i + "</li>"; }) + "</ul></article>";
    }) + "</div>");
    var timeline = function (id, title, list) { return list && list.length ? sec(id, "", title, "", '<ol class="tl">' + map(list, function (j) { return '<li class="reveal"><h3>' + (j.title || "") + "</h3>" + ((j.org || j.period) ? '<p class="cmeta">' + [j.org, j.period].filter(Boolean).join(" | ") + "</p>" : "") + (j.text ? "<p>" + j.text + "</p>" : "") + "</li>"; }) + "</ol>") : ""; };
    var extra = map(A.sections || [], function (x, i) { return sec("extra-" + i, "", x.heading || "", "", '<div class="story">' + (x.text || "").split(/\n+/).map(function (t) { return '<p class="reveal">' + t + "</p>"; }).join("") + "</div>"); });
    return hero + story + timeline("education", "Education", A.education) + timeline("experience", "Experience", A.experience) + extra + focus + tl + sk;
  }

  /* ---------- SERVICES ---------- */
  function services() {
    var V = S.servicesPage, items = V.items.filter(vis).sort(byOrder);
    var head = '<section class="p-head"><div class="wrap"><p class="eyebrow h-in">' + V.eyebrow + '</p><h1 class="h-in split" style="--d:.1s">' + V.heading + '</h1><p class="lead h-in" style="--d:.2s">' + V.intro + '</p><p class="note h-in" style="--d:.3s">' + V.scopeNote + "</p></div></section>";
    var cards = map(items, function (x) {
      var dev = x.status === "Developing", tl = x.tools || [], dt = x.developingTools || [];
      return '<article class="card scard ' + (dev ? "is-dev" : "is-cur") + ' reveal">' + (x.image ? '<img class="simg" src="' + x.image + '" alt="" loading="lazy">' : "") + ic(x.icon) + (x.category ? '<small class="cat">' + x.category + "</small>" : "") + (dev ? '<span class="tag t-dev">Currently Learning</span>' : "") + "<h3>" + x.title + "</h3><p>" + x.description + "</p>" +
        ((tl.length || dt.length) ? '<ul class="tools-l" aria-label="Software and tools">' + map(tl, function (t) { return '<li class="tool">' + t + "</li>"; }) + map(dt, function (t) { return '<li class="tool tool-dev">' + t + (dev ? "" : " (learning)") + "</li>"; }) + "</ul>" : "") +
        '<div class="sc-foot"><a class="btn ' + (dev ? "btn-ghost" : "btn-pri") + '" href="' + (x.buttonHref || V.actionHref) + '">' + (x.buttonText || V.actionLabel) + '<span class="sr">: ' + x.title + '</span></a><span class="price">' + (x.price || V.pricingLabel) + "</span></div></article>";
    });
    var cl = V.closing;
    return head + '<section class="sec p-gal"><div class="wrap"><div class="grid g3">' + cards + '</div></div></section>' +
      '<section id="project" class="cta-sec"><div class="wrap"><div class="cta-box reveal"><h2>' + cl.heading + "</h2><p>" + cl.text + '</p><div class="cta"><a class="btn btn-pri" href="' + cl.href + '">' + cl.button + "</a></div></div></div></section>";
  }

  /* ---------- CERTIFICATES page: every certificate you add is shown ---------- */
  function certificates() {
    var C = S.certificatesPage, certs = C.certificates.filter(vis).sort(byOrder), awards = C.awards.filter(vis).sort(byOrder);
    var known = {}; C.categories.forEach(function (c) { known[c.key] = c; });
    var chips = [{ key: "all", label: "All" }].concat(C.categories.filter(function (c) { return certs.some(function (x) { return x.category === c.key; }); }).map(function (c) { return { key: c.key, label: c.title }; }));
    if (certs.some(function (x) { return !known[x.category]; })) { certs.forEach(function (x) { if (!known[x.category]) x.category = "other"; }); chips.push({ key: "other", label: "Other" }); }
    var head = '<section class="p-head"><div class="wrap"><p class="eyebrow h-in">' + C.eyebrow + '</p><h1 class="h-in split" style="--d:.1s">' + C.heading + '</h1><p class="lead h-in" style="--d:.2s">' + C.intro + "</p></div></section>";
    var body = certs.length
      ? (chips.length > 2 ? '<div class="filters" role="group" aria-label="Filter certificates">' + map(chips, function (f, i) { return '<button type="button" class="chip" data-filter="' + f.key + '" aria-pressed="' + (i === 0) + '">' + f.label + "</button>"; }) + "</div>" : "") + '<p class="sr" id="f-status" aria-live="polite"></p><div class="grid g3" id="c-grid">' + map(certs, certCard) + "</div>"
      : '<p class="empty-box reveal">' + C.emptyIntro + "</p>" + '<div class="grid g2" style="margin-top:1.4rem">' + map(C.categories, function (cat) { return '<article class="card reveal"><h3 style="margin-top:0">' + cat.title + '</h3><ul class="tools-l">' + map(cat.topics, function (t) { return '<li class="tool">' + t + "</li>"; }) + "</ul></article>"; }) + "</div>";
    var cs = sec("certificates", "", "Certificates & Training", certs.length ? C.filledIntro : "", body);
    var tl = sec("learning", "", "My Learning Journey", "", '<ol class="tl">' + map(C.timeline, function (j, i) { return '<li class="reveal' + (i === C.timeline.length - 1 ? " now" : "") + '"><h3>' + j.title + (j.ongoing ? ' <span class="tag t-dev">Ongoing</span>' : "") + "</h3><p>" + j.text + "</p></li>"; }) + "</ol>");
    var aw = awards.length ? sec("awards", "", "Awards & Achievements", C.awardsNote, '<div class="grid g3">' + map(awards, function (a) { return '<article class="card reveal"><h3 style="margin-top:0">' + a.title + "</h3>" + (a.issuer ? '<p class="cmeta">' + a.issuer + "</p>" : "") + (a.date ? '<p class="cmeta">' + a.date + "</p>" : "") + (a.description ? "<p>" + a.description + "</p>" : "") + "</article>"; }) + "</div>") : "";
    return head + cs + tl + aw;
  }

  /* ---------- CONTACT ---------- */
  function contactPage() {
    var C = S.contact, P = S.contactPage, wa = "https://wa.me/" + C.whatsapp.replace(/\D/g, "");
    var head = '<section class="p-head"><div class="wrap"><h1 class="h-in split">' + P.heading + '</h1><p class="lead h-in" style="--d:.1s">' + P.intro + '</p><div class="cta h-in" style="--d:.2s"><a class="btn btn-pri" href="mailto:' + C.email + '">' + (P.ctaEmailText || "Send an Email") + '</a><a class="btn btn-blue" href="' + wa + '" target="_blank" rel="noopener noreferrer">' + (P.ctaWhatsappText || "Contact on WhatsApp") + "</a></div></div></section>";
    var L = Object.assign({ name: "Full Name", email: "Email Address", type: "Project / Inquiry Type", budget: "Budget", message: "Message", submit: "Send Message" }, P.labels || {});
    var info = [
      { i: "mail", t: "Email", v: '<a class="lnk" href="mailto:' + C.email + '">' + C.email + "</a>" },
      { i: "chat", t: "WhatsApp", v: '<a class="lnk" href="' + wa + '" target="_blank" rel="noopener noreferrer">' + C.whatsappDisplay + "</a>" },
      { i: "linkedin", t: "LinkedIn", v: '<a class="lnk" href="' + C.linkedin + '" target="_blank" rel="noopener noreferrer">View LinkedIn Profile</a>' },
      { i: "pin", t: "Location", v: "<span>" + C.location + "</span>" }];
    if (P.cards && P.cards.length) info = P.cards.filter(vis).map(function (c) { var hr = tok(c.href); return { i: c.icon, t: c.title, v: hr ? '<a class="lnk" href="' + hr + '"' + (/^https?:/.test(hr) ? ' target="_blank" rel="noopener noreferrer"' : "") + ">" + tok(c.value) + "</a>" : "<span>" + tok(c.value) + "</span>" }; });
    var cards = sec("reach", "", P.infoHeading || "Contact Information", "", '<div class="grid g4 icards">' + map(info, function (x) { return '<article class="card icard reveal">' + ic(x.i) + "<h3>" + x.t + "</h3><p>" + x.v + "</p></article>"; }) + "</div>");
    var fld = function (id, label, req, ctl) { return '<div class="field"><label for="' + id + '">' + label + (req ? ' <span class="req" aria-hidden="true">*</span><span class="sr">(required)</span>' : ' <span class="opt">(optional)</span>') + "</label>" + ctl + '<p class="err" id="e-' + id + '" hidden></p></div>'; };
    var form = sec("message", "", P.formHeading || "Send a Message", P.formNote,
      '<form class="cform card reveal" id="cform" novalidate><div class="frow">' +
      fld("f-name", L.name, true, '<input id="f-name" name="name" type="text" autocomplete="name" required aria-describedby="e-f-name">') +
      fld("f-email", L.email, true, '<input id="f-email" name="email" type="email" autocomplete="email" required aria-describedby="e-f-email">') +
      fld("f-type", L.type, false, '<select id="f-type" name="type">' + map(P.inquiryTypes, function (t) { return '<option value="' + t.label + '"' + (t.label === P.defaultType ? " selected" : "") + ">" + t.label + "</option>"; }) + '</select><p class="hint" id="type-note" aria-live="polite"></p>').replace(' <span class="opt">(optional)</span>', "") +
      fld("f-budget", L.budget, false, '<input id="f-budget" name="budget" type="text" placeholder="Optional">') + "</div>" +
      fld("f-msg", L.message, true, '<textarea id="f-msg" name="message" rows="6" required aria-describedby="e-f-msg"></textarea>') +
      '<div class="hp" aria-hidden="true"><label>Leave this field empty<input id="f-hp" name="website" tabindex="-1" autocomplete="off"></label></div><div class="fact"><button class="btn btn-pri" type="submit" id="f-btn">' + L.submit + '</button><button class="btn btn-ghost" type="button" id="f-copy" hidden>Copy Draft</button></div><div id="f-status" tabindex="-1" aria-live="polite"></div></form>');
    var cl = P.closing;
    var close = '<section class="cta-sec"><div class="wrap"><div class="cta-box reveal"><h2>' + cl.heading + "</h2><p>" + cl.text + '</p><div class="cta"><a class="btn btn-pri" href="mailto:' + C.email + '">' + cl.emailLabel + '</a><a class="btn btn-blue" href="' + C.linkedin + '" target="_blank" rel="noopener noreferrer">' + cl.linkedinLabel + "</a></div></div></div></section>";
    return head + cards + form + close;
  }

  function initContact() {
    var f = $("#cform"); if (!f) return;
    var C = S.contact, P = S.contactPage, busy = false, draft = "", started = Date.now();
    var L = Object.assign({ submit: "Send Message" }, P.labels || {});
    var type = $("#f-type"), note = $("#type-note");
    var upd = function () { var t = P.inquiryTypes.filter(function (x) { return x.label === type.value; })[0]; note.textContent = (t && t.note) || ""; };
    type.addEventListener("change", upd); upd();
    var err = function (id, msg) { var e = $("#e-" + id), i = $("#" + id); e.hidden = !msg; e.textContent = msg || ""; if (i.getAttribute("aria-describedby")) i.setAttribute("aria-invalid", !!msg); };
    ["f-name", "f-email", "f-msg"].forEach(function (id) { $("#" + id).addEventListener("input", function () { err(id, ""); }); });
    function validate() {
      var bad = [], n = $("#f-name").value.trim(), e = $("#f-email").value.trim(), m = $("#f-msg").value.trim();
      err("f-name", n ? "" : "Please enter your full name."); if (!n) bad.push("f-name");
      var okE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e);
      err("f-email", e ? (okE ? "" : "Please enter a valid email address, like name@example.com.") : "Please enter your email address."); if (!okE) bad.push("f-email");
      err("f-msg", m ? "" : "Please write a short message."); if (!m) bad.push("f-msg");
      return bad;
    }
    var status = $("#f-status"), btn = $("#f-btn");
    f.addEventListener("submit", function (ev) {
      ev.preventDefault(); if (busy) return;
      var bad = validate();
      if (bad.length) { status.className = "status is-err"; status.setAttribute("role", "alert"); status.textContent = "Please fix the highlighted fields and try again."; $("#" + bad[0]).focus(); return; }
      busy = true; btn.disabled = true; btn.setAttribute("aria-busy", "true"); btn.textContent = "Sending...";
      var d = { n: $("#f-name").value.trim(), e: $("#f-email").value.trim(), t: type.value, b: $("#f-budget").value.trim(), m: $("#f-msg").value.trim() };
      var subject = "Portfolio inquiry: " + d.t + " (" + d.n + ")";
      var body = "Name: " + d.n + "\nEmail: " + d.e + "\nInquiry type: " + d.t + (d.b ? "\nBudget: " + d.b : "") + "\n\nMessage:\n" + d.m;
      draft = "To: " + C.email + "\nSubject: " + subject + "\n\n" + body;
      var url = "mailto:" + C.email + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
      f.dataset.count = (+f.dataset.count || 0) + 1; f.dataset.mailto = url;
      var cool = function () { setTimeout(function () { busy = false; btn.disabled = false; btn.removeAttribute("aria-busy"); btn.textContent = L.submit; }, 3000); };
      var fallback = function () {
        window.location.href = url;
        status.className = "status is-ok"; status.setAttribute("role", "status");
        status.textContent = "The message could not be sent through the website, so your email app should now open with a draft addressed to " + C.email + ". Nothing has been sent yet: review it and press Send in your email app. If nothing opened, use Copy Draft and email it to that address, or contact me on WhatsApp.";
        $("#f-copy").hidden = false; cool();
      };
      fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: d.n, email: d.e, type: d.t, budget: d.b, message: d.m, website: $("#f-hp").value, elapsed: Date.now() - started }) })
        .then(function (r) { return r.json().then(function (j) { return { r: r, j: j }; }); })
        .then(function (x) {
          if (x.r.ok && x.j.ok) { status.className = "status is-ok"; status.setAttribute("role", "status"); status.textContent = P.successMessage || "Thank you. Your message has been received."; f.reset(); upd(); started = Date.now(); cool(); }
          else if (x.r.status < 500 && x.j) {
            Object.keys(x.j.errors || {}).forEach(function (k) { var id = { name: "f-name", email: "f-email", message: "f-msg" }[k]; if (id) err(id, x.j.errors[k]); });
            status.className = "status is-err"; status.setAttribute("role", "alert"); status.textContent = x.j.error || P.errorMessage || "Something went wrong."; cool();
          } else fallback();
        }).catch(fallback);
    });
    $("#f-copy").addEventListener("click", function () {
      var done = function (ok) { status.className = "status " + (ok ? "is-ok" : "is-err"); status.textContent = ok ? "Draft copied. Paste it into an email to " + C.email + "." : "Copy was not possible in this browser. Please select the text in the form and copy it manually."; };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(draft).then(function () { done(true); }, function () { done(false); }); else done(false);
    });
  }

  function stub(id) {
    var el = $("#" + id); if (!el) return;
    el.innerHTML = '<section class="stub"><div class="wrap"><h1>' + el.getAttribute("data-title") + '</h1><p>This page is a placeholder route.</p><a class="btn btn-pri" href="index.html#home">Back to Home</a></div></section>';
  }

  /* ---------- mount ---------- */
  document.body.insertAdjacentHTML("afterbegin", '<div class="ambient" aria-hidden="true"><i></i><i></i></div><div class="grain" aria-hidden="true"></div>');
  $("#site-header").innerHTML = header();
  $("#site-footer").innerHTML = footer();
  if ($("#home-app")) { $("#home-app").innerHTML = home(); initProjectViewer(); initCertViewer(); }
  if ($("#stub-app")) stub("stub-app");
  if ($("#services-app")) $("#services-app").innerHTML = services();
  if ($("#contact-app")) { $("#contact-app").innerHTML = contactPage(); initContact(); }
  if ($("#certs-app")) { $("#certs-app").innerHTML = certificates(); initCertViewer(); initFilter("#c-grid", ".filters .chip", "#c-empty", "certificate"); }
  if ($("#about-app")) $("#about-app").innerHTML = about();
  if ($("#portfolio-app")) { $("#portfolio-app").innerHTML = portfolio(); initProjectViewer(); initFilter("#p-grid", ".filters .chip", "#p-empty", "project"); }
  root.classList.add("js"); if (calm) root.classList.add("calm");

  $$('img[src^="/uploads/"]').forEach(function (i) {
    if (i.hasAttribute("data-strip")) return;
    var m = i.getAttribute("src").match(/^(\/uploads\/[a-f0-9]+)\.webp$/);
    if (m) { i.srcset = m[1] + "-640.webp 640w, " + m[1] + ".webp 1800w"; i.sizes = "(max-width: 820px) 100vw, 50vw"; }
  });
  $$("img[data-fallback]").forEach(function (img) {
    var fix = function () { if (img.dataset.done) return; img.dataset.done = 1; img.removeAttribute("srcset"); img.src = "assets/img/placeholders/" + (img.dataset.fallback === "profile" ? "profile" : "project-1") + ".svg"; };
    img.addEventListener("error", fix);
    if (img.complete && img.naturalWidth === 0) fix();
  });

  /* ---------- menu + active link ---------- */
  var b = $(".burger"), m = $("#menu");
  var closeMenu = function () { b.setAttribute("aria-expanded", "false"); b.setAttribute("aria-label", "Open menu"); m.classList.remove("open"); root.classList.remove("lock"); };
  b.addEventListener("click", function () {
    var o = b.getAttribute("aria-expanded") === "true";
    b.setAttribute("aria-expanded", !o); b.setAttribute("aria-label", o ? "Open menu" : "Close menu"); m.classList.toggle("open", !o); root.classList.toggle("lock", !o);
  });
  m.addEventListener("click", function (e) { if (e.target.tagName === "A") closeMenu(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeMenu(); });
  var links = $$("#menu a");
  function setActive(fn) { links.forEach(function (a) { fn(a) ? a.setAttribute("aria-current", "page") : a.removeAttribute("aria-current"); }); }
  var file = location.pathname.split("/").pop() || "index.html";
  if (file !== "index.html" && file !== "") setActive(function (a) { return a.getAttribute("href") === file; });
  else if ("IntersectionObserver" in window) {
    var spy = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) setActive(function (a) { return a.getAttribute("href") === "index.html#" + e.target.id; }); }); }, { rootMargin: "-45% 0px -50% 0px" });
    $$("[data-spy]").forEach(function (s) { spy.observe(s); });
  }

  /* ---------- split headings into words, reveal on scroll ---------- */
  function splitWords(el, grad) {
    if (el.classList.contains("is-split")) return;
    var txt = el.textContent.trim(), words = txt.split(/\s+/); el.setAttribute("aria-label", txt); el.textContent = "";
    words.forEach(function (w, i) {
      var o = document.createElement("span"), n = document.createElement("span"); o.className = "wd"; o.setAttribute("aria-hidden", "true"); n.style.setProperty("--i", i); n.textContent = w;
      if (grad && i >= words.length - grad) n.className = "grad"; o.appendChild(n); el.appendChild(o); el.appendChild(document.createTextNode(" "));
    });
    el.classList.add("is-split");
  }
  $$(".split").forEach(function (el) { splitWords(el); });
  $$("[data-split]").forEach(function (el) { splitWords(el, +el.dataset.split); });

  var reveals = $$(".reveal, .split");
  if (calm || !("IntersectionObserver" in window)) reveals.forEach(function (r) { r.classList.add("in"); });
  else {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }); }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    reveals.forEach(function (r) { var sib = r.parentElement ? [].indexOf.call(r.parentElement.children, r) : 0; if (!r.classList.contains("split")) r.style.setProperty("--d", (sib % 3) * 0.09 + "s"); io.observe(r); });
  }

  /* ---------- scroll engine: progress bar, nav, hero stage, 3D photo reveal ---------- */
  var smooth = function (t) { return t * t * (3 - 2 * t); };
  var stage = $(".stage"), ticking = false, intro = 0, pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  var sxs = $$(".sx"), pct = $(".ph-pct"), cue = $(".scroll-cue");
  function paintPhoto(el, p) { var e = smooth(clamp(p, 0, 1)); el.style.setProperty("--p", p.toFixed(4)); el.style.setProperty("--e", e.toFixed(4)); return e; }
  function frame() {
    ticking = false; var y = window.scrollY, vh = innerHeight, max = Math.max(1, root.scrollHeight - vh);
    root.style.setProperty("--sy", Math.min(y, vh * 3).toFixed(0)); root.style.setProperty("--prog", clamp(y / max, 0, 1).toFixed(4));
    var nav = $(".nav"); if (nav) nav.classList.toggle("scrolled", y > 24);
    if (!stage) return;
    var r = stage.getBoundingClientRect(), total = stage.offsetHeight - vh, s = calm ? 1 : (total > 0 ? clamp(-r.top / total, 0, 1) : 1);
    var p = calm ? 1 : clamp(intro + s * 1.28, 0, 1), e = paintPhoto(stage, p);
    stage.style.setProperty("--o", calm ? "0" : clamp((s - 0.9) / 0.1, 0, 1).toFixed(3));
    sxs.forEach(function (el) { el.classList.toggle("on", calm || p >= +el.dataset.at); });
    if (pct) pct.textContent = "RENDER " + String(Math.round(e * 100)).padStart(3, "0") + "%";
    if (cue) cue.classList.toggle("gone", s > 0.02);
  }
  function tick() { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }
  addEventListener("scroll", tick, { passive: true }); addEventListener("resize", tick);
  if (stage && !calm) {
    var t0 = null, DUR = 2600, TO = 0.075; // 2.6 s intro: the photo starts as a thin glimpse
    requestAnimationFrame(function step(ts) { if (t0 === null) t0 = ts; var k = clamp((ts - t0) / DUR, 0, 1); intro = TO * (1 - Math.pow(1 - k, 3)); frame(); if (k < 1) requestAnimationFrame(step); });
  }
  frame();

  // About page: the photo assembles itself in ~2.8 s when it scrolls into view
  $$(".ph[data-auto]").forEach(function (ph) {
    var host = ph.parentNode;
    if (calm) { paintPhoto(host, 1); return; }
    paintPhoto(host, 0.07);
    var run = function () {
      var t = null, from = 0.07; requestAnimationFrame(function st(ts) { if (t === null) t = ts; var k = clamp((ts - t) / 2800, 0, 1); paintPhoto(host, from + (1 - from) * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(st); });
    };
    if ("IntersectionObserver" in window) { var o = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { o.disconnect(); setTimeout(run, 500); } }, { threshold: 0.3 }); o.observe(host); } else run();
  });

  /* ---------- pointer effects: custom cursor, card spotlight, 3D tilt, magnetic buttons ---------- */
  var fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (fine && !calmPref) {
    var dot = document.createElement("div"), ring = document.createElement("div"), lab = document.createElement("span");
    dot.className = "cur-dot"; ring.className = "cur-ring"; ring.appendChild(lab); dot.setAttribute("aria-hidden", "true"); ring.setAttribute("aria-hidden", "true");
    document.body.append(dot, ring); root.classList.add("has-cursor");
    var rx = 0, ry = 0, cx = -100, cy = -100, shown = false;
    var setState = function (t) {
      var cl = root.classList; cl.remove("cur-link", "cur-label", "cur-text");
      if (!t || !t.closest) return;
      var lb = t.closest("[data-cursor]"), tx = t.closest("input,textarea");
      if (tx) cl.add("cur-text"); else if (lb) { lab.textContent = lb.getAttribute("data-cursor"); cl.add("cur-label"); }
      else if (t.closest("a,button,summary,select,label,.chip,[data-cursor-link]")) cl.add("cur-link");
    };
    document.addEventListener("pointermove", function (e) {
      if (e.pointerType === "touch") return; cx = e.clientX; cy = e.clientY; pointer.tx = e.clientX / innerWidth - 0.5; pointer.ty = e.clientY / innerHeight - 0.5;
      dot.style.transform = "translate3d(" + cx + "px," + cy + "px,0)";
      if (!shown) { shown = true; rx = cx; ry = cy; root.classList.add("cur-on"); }
      var t = e.target; setState(t);
      var c = t.closest && t.closest(".card"); if (c) { var r = c.getBoundingClientRect(); c.style.setProperty("--mx", (e.clientX - r.left) + "px"); c.style.setProperty("--my", (e.clientY - r.top) + "px"); }
      var mg = t.closest && t.closest(".cta .btn, .btn-pri, .btn-ghost");
      if (mg && !mg.disabled) { var br = mg.getBoundingClientRect(); mg.style.transform = "translate(" + ((e.clientX - br.left - br.width / 2) * 0.22).toFixed(1) + "px," + ((e.clientY - br.top - br.height / 2) * 0.32).toFixed(1) + "px)"; }
      $$(".btn[style*=translate]").forEach(function (x) { if (x !== mg) x.style.transform = ""; });
    }, { passive: true });
    document.addEventListener("pointerdown", function () { root.classList.add("cur-down"); }); document.addEventListener("pointerup", function () { root.classList.remove("cur-down"); });
    document.documentElement.addEventListener("pointerleave", function () { root.classList.remove("cur-on"); shown = false; });
    requestAnimationFrame(function loop() {
      rx += (cx - rx) * 0.16; ry += (cy - ry) * 0.16; ring.style.transform = "translate3d(" + rx.toFixed(1) + "px," + ry.toFixed(1) + "px,0)";
      pointer.x += (pointer.tx - pointer.x) * 0.08; pointer.y += (pointer.ty - pointer.y) * 0.08;
      $$(".stage,.about-hero .ph-wrap").forEach(function (el) { el.style.setProperty("--hx", pointer.x.toFixed(3)); el.style.setProperty("--hy", pointer.y.toFixed(3)); });
      requestAnimationFrame(loop);
    });
  }
})();
