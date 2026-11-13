(function () {
  var S = window.SITE;
  (function applyLook() { // design, theme, fonts and SEO from saved settings (works on Netlify, where pages are static files)
    var FONTS = { "Bricolage Grotesque": "Bricolage+Grotesque:wght@600;700;800", "Figtree": "Figtree:wght@400;500;600", "Inter": "Inter:wght@400;500;600;700", "Poppins": "Poppins:wght@400;500;600;700", "Manrope": "Manrope:wght@400;500;600;700;800", "Sora": "Sora:wght@400;600;700;800", "Space Grotesk": "Space+Grotesk:wght@400;500;600;700", "DM Sans": "DM+Sans:wght@400;500;600;700", "Montserrat": "Montserrat:wght@400;500;600;700;800", "Playfair Display": "Playfair+Display:wght@500;600;700;800", "Lora": "Lora:wght@400;500;600;700", "Roboto": "Roboto:wght@400;500;700" };
    var d = S.design || {}, v = [], hex = function (x) { return /^#[0-9a-f]{6}$/i.test(x || ""); }, dark = d.theme === "dark", root = document.documentElement;
    if (hex(d.primary)) v.push("--orange:" + d.primary); if (hex(d.secondary)) v.push("--blue:" + d.secondary); if (hex(d.accent)) v.push("--orange-ink:" + d.accent);
    if (!dark && hex(d.background)) v.push("--bg:" + d.background, "--bg2:color-mix(in srgb, " + d.background + " 93%, #000)");
    if (isFinite(+d.radius)) v.push("--r:" + Math.max(0, Math.min(40, +d.radius)) + "px");
    if (FONTS[d.headingFont]) v.push('--display:"' + d.headingFont + '","Segoe UI",system-ui,sans-serif');
    if (FONTS[d.bodyFont]) v.push('--body:"' + d.bodyFont + '","Segoe UI",system-ui,sans-serif');
    var st = document.getElementById("site-design"); if (!st) { st = document.createElement("style"); st.id = "site-design"; document.head.appendChild(st); }
    st.textContent = ":root{" + v.join(";") + "}";
    root.setAttribute("data-theme", dark ? "dark" : "light"); root.setAttribute("data-btn", d.buttonStyle || "pill");
    var fams = []; [d.headingFont, d.bodyFont].forEach(function (f) { if (FONTS[f] && fams.indexOf("family=" + FONTS[f]) < 0) fams.push("family=" + FONTS[f]); });
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
    pin: "M12 21s-7-6-7-11a7 7 0 0114 0c0 5-7 11-7 11z M12 12a2 2 0 100-.01"
  };
  var ic = function (n) { return '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="' + (ICONS[n] || ICONS.link) + '"/></svg>'; };
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var map = function (a, f) { return a.map(f).join(""); };

  var tok = function (v) { return String(v == null ? "" : v).replace(/\{(\w+)\}/g, function (m, k) { return k === "whatsappDigits" ? String(S.contact.whatsapp || "").replace(/\D/g, "") : (S.contact[k] !== undefined ? S.contact[k] : m); }); };
  function catLabel(p) { var f = (S.portfolioFilters || []).filter(function (x) { return x.key === p.category; })[0]; return f ? f.label : (catLabel(p) || p.category || ""); }
  function filtersShown(items) { return S.portfolioFilters.filter(function (f) { return f.key === "all" || items.some(function (p) { return p.category === f.key; }); }); }
  function featuredList() {
    var f = (S.portfolio || []).filter(function (p) { return p.featured && p.visible !== false; }).sort(function (a, b) { return a.order - b.order; });
    return f.length ? f.slice(0, 6).map(function (p) { return { category: catLabel(p), title: p.title, desc: p.description, img: p.thumbnail || (p.images && p.images[0] && p.images[0].src) || "assets/img/placeholders/project-1.svg", href: S.portfolioHref }; }) : S.projects;
  }
  function socials() {
    return map(S.social, function (s) {
      var live = !!s.url;
      var a = live ? 'href="' + s.url + '"' + (/^https?:/.test(s.url) ? ' target="_blank" rel="noopener noreferrer"' : "") : 'aria-disabled="true" title="Link not added yet"';
      return '<a class="soc' + (live ? "" : " is-off") + '" ' + a + ' aria-label="' + s.label + (live ? "" : " (link not added yet)") + '">' + ic(s.icon) + "</a>";
    });
  }

  function header() {
    return '<header class="nav" id="top"><div class="wrap nav-in">' +
      '<a class="mark" href="index.html#home">' + (B.logo ? '<img class="mark-logo" src="' + B.logo + '" alt="">' : '<span class="mark-sq">' + S.initials + "</span>") + '<span class="mark-name">' + NAME + "</span></a>" +
      '<button class="burger" aria-expanded="false" aria-controls="menu" aria-label="Open menu"><span></span></button>' +
      '<nav id="menu" aria-label="Main"><ul>' + map(NAV, function (n) { return '<li><a href="' + n.href + '">' + n.label + "</a></li>"; }) + "</ul></nav></div></header>";
  }

  function footer() {
    return '<footer class="foot"><div class="wrap foot-in"><div class="foot-brand">' + (B.footerLogo ? '<img class="foot-logo" src="' + B.footerLogo + '" alt="">' : "") + '<p class="foot-name">' + NAME + '</p><p class="foot-role">' + (F.role || "Aspiring BIM Professional") + '</p><p>' + S.footerBlurb + "</p></div>" +
      '<nav aria-label="Footer"><ul>' + map(NAV, function (n) { return '<li><a href="' + n.href + '">' + n.label + "</a></li>"; }) + "</ul></nav>" +
      (F.showSocial === false ? "</div>" : '<div class="socials">' + socials() + "</div></div>") +
      '<div class="wrap foot-copy">' + (F.copyright ? F.copyright.replace("{year}", new Date().getFullYear()) : "&copy; " + new Date().getFullYear() + " " + NAME + ". All rights reserved.") + "</div></footer>";
  }

  function sec(id, title, sub, body, cls) {
    return '<section id="' + id + '" class="sec ' + (cls || "") + '" data-spy><div class="wrap"><div class="sec-head reveal"><h2>' + title + "</h2>" + (sub ? "<p>" + sub + "</p>" : "") + "</div>" + body + "</div></section>";
  }

  function home() {
    var im = function (x) { return x && x.image ? '<img class="li-img" src="' + x.image + '" alt="" loading="lazy">' : ""; };
    var HC = S.hero || {}, HS = {}, FEAT = featuredList();
    (S.homeSections || []).forEach(function (x) { HS[x.key] = x; });
    var H = function (k, sub, def) { var h = HS[k]; if (!h) return def; var v = sub ? h.sub : h.heading; return sub ? (v === undefined || v === null ? def : v) : (v || def); };
    var bg = HC.bgImage ? ' style="background-image:linear-gradient(rgba(247,245,241,.9),rgba(247,245,241,.9)),url(' + HC.bgImage + ');background-size:cover;background-position:center"' : "";
    var hero = '<section id="home" class="hero" data-spy' + bg + '><div class="hero-grid" aria-hidden="true"></div><div class="wrap hero-in">' +
      '<div class="hero-copy"><h1><span class="name h-in" style="--d:.05s">' + S.name + '</span><span class="role h-in" style="--d:.15s">' + S.title + '</span><span class="headline h-in" style="--d:.3s">' + S.headline + "</span></h1>" +
      '<p class="lead h-in" style="--d:.45s">' + S.intro + "</p>" +
      '<div class="cta h-in" style="--d:.6s"><a class="btn btn-pri" href="' + (HC.cta1Href || "#projects") + '">' + (HC.cta1Text || "View My Projects") + '</a><a class="btn btn-ghost" href="' + (HC.cta2Href || "#contact") + '">' + (HC.cta2Text || "Contact Me") + '</a></div></div>' +
      '<figure class="portrait"><div class="frame"><img src="' + S.photo + '" alt="' + S.photoAlt + '" width="800" height="1000" data-fallback="profile"></div></figure></div></section>';

    var hl = sec("highlights", H("highlights", 0, "Professional Highlights"), H("highlights", 1, ""), '<div class="grid g4">' + map(S.highlights, function (h) {
      return '<article class="card hl reveal">' + ic(h.icon) + "<h3>" + h.label + "</h3><p>" + h.value + "</p></article>";
    }) + "</div>");

    var sk = sec("skills", H("skills", 0, "Skills & Expertise"), H("skills", 1, "Skills I use today, and the ones I am actively learning."),
      '<div class="legend reveal"><span class="tag t-cur">Current skill</span><span class="tag t-dev">Currently learning</span></div><div class="grid g4">' + map(S.skills.filter(function (k) { return k.visible !== false; }), function (k) {
        var cur = k.status === "current";
        return '<article class="card skill ' + (cur ? "is-cur" : "is-dev") + ' reveal">' + im(k) + ic(k.icon) + '<span class="tag ' + (cur ? "t-cur" : "t-dev") + '">' + (cur ? "Current skill" : "Currently learning") + "</span><h3>" + k.name + "</h3><p>" + k.desc + '</p><small class="cat">' + k.cat + "</small>" + (k.level ? '<small class="cat lvl">Level: ' + k.level + "</small>" : "") + "</article>";
      }) + "</div>", "alt");

    var pr = sec("projects", H("projects", 0, "Featured Projects"), H("projects", 1, "Sample cards are placeholders until your real project details and images are added."),
      '<div class="grid g3">' + map(FEAT, function (p) {
        return '<article class="card proj reveal"><a class="thumb" href="' + p.href + '" tabindex="-1" aria-hidden="true"><img src="' + p.img + '" alt="" width="800" height="600" loading="lazy" data-fallback="project"></a><div class="proj-b"><small class="cat">' + p.category + "</small><h3>" + p.title + "</h3><p>" + p.desc + '</p><a class="lnk" href="' + p.href + '">View Project<span class="sr"> in ' + p.category + "</span></a></div></article>";
      }) + '</div><div class="center reveal"><a class="btn btn-pri" href="' + S.portfolioHref + '">' + ((HS.projects && HS.projects.buttonText) || "View Full Portfolio") + "</a></div>");

    var sv = sec("services", H("services", 0, "Services & Technical Capabilities"), H("services", 1, "The kinds of technical work my current skills cover."),
      '<div class="grid g3">' + map(S.services, function (s) {
        return '<article class="card svc reveal">' + im(s) + ic(s.icon) + "<h3>" + s.name + "</h3><p>" + s.desc + "</p></article>";
      }) + "</div>", "alt");

    var jr = sec("journey", H("journey", 0, "Practical Experience & Learning Journey"), H("journey", 1, "Dates and employers can be added here once confirmed."),
      '<ol class="tl">' + map(S.journey, function (j, i) {
        return '<li class="reveal' + (i === S.journey.length - 1 ? " now" : "") + '">' + im(j) + '<h3>' + j.title + "</h3><p>" + j.text + "</p></li>";
      }) + "</ol>");

    var pv = sec("preview", H("preview", 0, "Featured Work Preview"), H("preview", 1, "A visual look at the kind of work this portfolio will showcase. Images are placeholders."),
      '<div class="masonry">' + map(S.preview, function (v) {
        return '<figure class="shot reveal"><div class="zoom"><img src="' + v.img + '" alt="Placeholder: ' + v.label + '" width="' + v.w + '" height="' + v.h + '" loading="lazy" data-fallback="project"></div><figcaption>' + v.label + "</figcaption></figure>";
      }) + '</div><div class="center reveal"><a class="btn btn-ghost" href="' + S.portfolioHref + '">' + ((HS.preview && HS.preview.buttonText) || "Explore the Portfolio") + '</a></div>', "alt");

    var CL = Object.assign({ heading: "Let’s Build Something Meaningful.", text: "Interested in CAD, BIM, Civil Engineering, or technical collaboration? Feel free to connect with me and explore my work.", btn1Text: "Contact Me", btn1Href: S.contactHref, btn2Text: "Connect on LinkedIn" }, S.homeClosing || {});
    var li = S.contact.linkedin
      ? '<a class="btn btn-blue" href="' + S.contact.linkedin + '" target="_blank" rel="noopener noreferrer">' + CL.btn2Text + "</a>"
      : '<a class="btn btn-blue is-off" aria-disabled="true" title="LinkedIn link not added yet">' + CL.btn2Text + "</a>";
    var ct = '<section id="contact" class="cta-sec" data-spy><div class="wrap"><div class="cta-box reveal"><h2>' + CL.heading + "</h2><p>" + CL.text + '</p><div class="cta"><a class="btn btn-pri" href="' + CL.btn1Href + '">' + CL.btn1Text + "</a>" + li + "</div>" +
      (S.contact.email ? '<p class="mail"><a href="mailto:' + S.contact.email + '">' + S.contact.email + "</a></p>" : "") + "</div></div></section>";

    var ab = sec("about", H("about", 0, (S.about && S.about.heading) || "About Me"), "", '<div class="about-grid"><p class="lead reveal">' + ((S.about && S.about.intro) || S.intro) + '</p><div class="about-facts">' + map(S.highlights, function (h) { return '<div class="fact reveal"><small>' + h.label + '</small><strong>' + h.value + '</strong></div>'; }) + '</div></div><div class="reveal"><a class="btn btn-ghost" href="about.html">More about me</a></div>');
    var parts = { hero: hero, about: ab, highlights: hl, skills: sk, projects: pr, services: sv, journey: jr, preview: pv, contact: ct };
    var order = (S.homeSections && S.homeSections.length) ? S.homeSections : Object.keys(parts).map(function (k) { return { key: k, enabled: true }; });
    return map(order.filter(function (x) { return x.enabled !== false && parts[x.key]; }), function (x) { return parts[x.key]; });
  }


  function portfolio() {
    S.portfolio.forEach(function (p) { p.tools = p.tools || []; p.status = p.status || "Placeholder"; p.description = p.description || ""; if (!p.images || !p.images.length) p.images = [{ src: p.thumbnail || "assets/img/placeholders/project-1.svg", alt: p.title }]; if (!p.thumbnail) p.thumbnail = p.images[0].src; });
    var items = S.portfolio.filter(function (p) { return p.visible !== false; }).sort(function (a, b) { return a.order - b.order; });
    var tag = function (st) { return '<span class="tag ' + (st === "Learning example" ? "t-dev" : st === "Completed" ? "t-cur" : "t-ph") + '">' + st + "</span>"; };
    var cards = map(items, function (p) {
      return '<article class="card proj reveal" data-cat="' + p.category + '" data-id="' + p.id + '"><button type="button" class="thumb" data-open="' + p.id + '" aria-label="Open details: ' + p.title + '"><img src="' + p.thumbnail + '" alt="' + p.images[0].alt + '" width="800" height="600" loading="lazy" data-fallback="project"></button>' +
        '<div class="proj-b"><div class="proj-top"><small class="cat">' + p.categoryLabel + "</small>" + tag(p.status) + "</div><h3>" + p.title + "</h3><p>" + p.description + "</p>" +
        (p.tools.length ? '<p class="tools"><span class="sr">Tools: </span>' + p.tools.join(", ") + "</p>" : "") +
        '<button type="button" class="lnk" data-open="' + p.id + '">View Project<span class="sr">: ' + p.title + "</span></button></div></article>";
    });
    return '<section class="p-head"><div class="hero-grid" aria-hidden="true"></div><div class="wrap"><p class="eyebrow h-in">My Work</p><h1 class="h-in" style="--d:.1s">Projects & Technical Work</h1><p class="lead h-in" style="--d:.2s">Explore my architectural and structural CAD drawings, BIM models, 3D modeling work, and engineering estimation projects.</p><p class="note h-in" style="--d:.3s">Cards marked Placeholder are sample entries until real work is added. Cards marked Learning example show skills I am still developing.</p></div></section>' +
      '<section class="sec p-gal"><div class="wrap"><div class="filters" role="group" aria-label="Filter projects">' + map(filtersShown(items), function (f, i) { return '<button type="button" class="chip" data-filter="' + f.key + '" aria-pressed="' + (i === 0) + '">' + f.label + "</button>"; }) + '</div><p class="sr" id="f-status" aria-live="polite"></p><div class="grid g3" id="p-grid">' + cards + '</div><p class="empty" id="p-empty" hidden>No projects in this category yet.</p></div></section>' +
      '<dialog class="lb" id="lb" aria-labelledby="lb-title"><div class="lb-in"><button type="button" class="lb-x" aria-label="Close project details"><svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19"/></svg></button><div class="lb-media"><img id="lb-img" alt=""><p class="lb-cap" id="lb-cap"></p><div class="lb-thumbs" id="lb-thumbs"></div></div><div class="lb-info"><small class="cat" id="lb-cat"></small><h2 id="lb-title"></h2><div id="lb-tag"></div><p id="lb-desc"></p><p id="lb-more"></p><dl id="lb-meta"></dl></div></div></dialog>';
  }

  function initPortfolio() {
    var grid = $("#p-grid"); if (!grid) return;
    var cards = [].slice.call(grid.children), calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var chips = [].slice.call(document.querySelectorAll(".chip"));
    chips.forEach(function (c) {
      c.addEventListener("click", function () {
        var k = c.dataset.filter; chips.forEach(function (x) { x.setAttribute("aria-pressed", x === c); });
        grid.classList.add("fading");
        setTimeout(function () {
          var n = 0;
          cards.forEach(function (card) {
            var show = k === "all" || card.dataset.cat === k;
            card.hidden = !show;
            if (show) { card.classList.add("in"); card.style.setProperty("--d", Math.min(n, 8) * 0.04 + "s"); n++; }
          });
          $("#p-empty").hidden = n > 0;
          $("#f-status").textContent = n + " project" + (n === 1 ? "" : "s") + " shown";
          grid.classList.remove("fading");
        }, calm ? 0 : 180);
      });
    });

    var dlg = $("#lb"), cur = null, byId = {};
    S.portfolio.forEach(function (p) { byId[p.id] = p; });
    function show(i) {
      var im = cur.images[i]; var el = $("#lb-img"); el.src = im.src; el.alt = im.alt; var cap = $("#lb-cap"); if (cap) cap.textContent = im.alt || "";
      [].forEach.call($("#lb-thumbs").children, function (b, j) { b.setAttribute("aria-current", j === i); });
    }
    function open(id) {
      cur = byId[id]; if (!cur) return;
      $("#lb-cat").textContent = catLabel(cur); $("#lb-title").textContent = cur.title;
      $("#lb-tag").innerHTML = '<span class="tag ' + (cur.status === "Learning example" ? "t-dev" : cur.status === "Completed" ? "t-cur" : "t-ph") + '">' + cur.status + "</span>";
      $("#lb-desc").textContent = cur.description; $("#lb-more").textContent = cur.details || "";
      $("#lb-meta").innerHTML = (cur.tools.length ? "<dt>Software and tools</dt><dd>" + cur.tools.join(", ") + "</dd>" : "") + "<dt>Status</dt><dd>" + cur.status + "</dd>" + (cur.completionDate ? "<dt>Completed</dt><dd>" + cur.completionDate + "</dd>" : "") + (cur.location ? "<dt>Location</dt><dd>" + cur.location + "</dd>" : "") + (cur.externalUrl ? '<dt>Link</dt><dd><a class="lnk" href="' + cur.externalUrl + '" target="_blank" rel="noopener noreferrer">Open project link</a></dd>' : "") + (cur.videoUrl ? '<dt>Video</dt><dd><a class="lnk" href="' + cur.videoUrl + '" target="_blank" rel="noopener noreferrer">Watch video</a></dd>' : "") + ((cur.files || []).length ? "<dt>Files</dt><dd>" + (cur.files || []).map(function (f) { return '<a class="lnk" href="' + f.src + '" target="_blank" rel="noopener noreferrer">' + (f.label || "Download file") + "</a>"; }).join("<br>") + "</dd>" : "");
      $("#lb-thumbs").innerHTML = cur.images.length > 1 ? map(cur.images, function (im, j) { return '<button type="button" data-i="' + j + '" title="' + (im.alt || "") + '" aria-label="Show sheet ' + (j + 1) + ' of ' + cur.images.length + '"><img src="' + im.src + '" alt="" width="800" height="600"></button>'; }) : "";
      show(0);
      document.documentElement.classList.add("lock");
      dlg.showModal();
    }
    grid.addEventListener("click", function (e) { var b = e.target.closest("[data-open]"); if (b) open(b.dataset.open); });
    $(".lb-x").addEventListener("click", function () { dlg.close(); });
    dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); });
    dlg.addEventListener("close", function () { document.documentElement.classList.remove("lock"); });
    $("#lb-thumbs").addEventListener("click", function (e) { var b = e.target.closest("button"); if (b) show(+b.dataset.i); });
    dlg.addEventListener("keydown", function (e) {
      if (!cur || cur.images.length < 2 || (e.key !== "ArrowRight" && e.key !== "ArrowLeft")) return;
      var now = +($("#lb-thumbs [aria-current=true]") || { dataset: { i: 0 } }).dataset.i, d = e.key === "ArrowRight" ? 1 : -1;
      show((now + d + cur.images.length) % cur.images.length);
    });
  }


  function about() {
    var A = S.about, AH = Object.assign({ journey: "My Journey", focus: "What I Focus On", learning: "My Learning Journey", learningSub: "A path of learning and skills development.", skills: "Technical Skills", skillsSub: "Skills I use, and the ones I am still building." }, A.headings || {});
    var hero = '<section id="top-about" class="hero" data-spy><div class="hero-grid" aria-hidden="true"></div><div class="wrap hero-in"><div class="hero-copy"><p class="eyebrow h-in">' + A.eyebrow + '</p><h1><span class="headline h-in" style="--d:.1s">' + A.heading + '</span></h1><p class="lead h-in" style="--d:.25s">' + A.intro + '</p><div class="cta h-in" style="--d:.4s"><a class="btn btn-pri" href="' + (A.cta1Href || "#skills") + '">' + (A.cta1Text || "Explore My Skills") + '</a><a class="btn btn-ghost" href="' + (A.cta2Href || S.portfolioHref) + '">' + (A.cta2Text || "View My Projects") + '</a></div></div>' +
      '<figure class="portrait"><div class="frame"><img src="' + S.photo + '" alt="' + S.photoAlt + '" width="800" height="1000" data-fallback="profile"></div></figure></div></section>';
    var story = sec("journey", AH.journey, "", '<div class="story">' + map(A.story, function (t) { return '<p class="reveal">' + t + "</p>"; }) + "</div>");
    var focus = sec("focus", AH.focus, "", '<div class="grid g4">' + map(A.focus, function (f) { return '<article class="card svc reveal">' + ic(f.icon) + "<h3>" + f.title + "</h3><p>" + f.text + "</p></article>"; }) + "</div>", "alt");
    var tl = sec("learning", AH.learning, AH.learningSub, '<ol class="tl">' + map(A.timeline, function (j, i) { return '<li class="reveal' + (i === A.timeline.length - 1 ? " now" : "") + '"><h3>' + j.title + "</h3><p>" + j.text + "</p></li>"; }) + "</ol>");
    var sk = sec("skills", AH.skills, AH.skillsSub, '<div class="grid g2">' + map(A.skillGroups, function (g) {
      return '<article class="card sgrp ' + (g.developing ? "is-dev" : "is-cur") + ' reveal">' + ic(g.icon) + '<span class="tag ' + (g.developing ? "t-dev" : "t-cur") + '">' + (g.developing ? "Currently learning" : g.software) + "</span><h3>" + g.title + "</h3><ul>" + map(g.items, function (i) { return "<li>" + i + "</li>"; }) + "</ul></article>";
    }) + "</div>", "alt");
    var timeline = function (id, title, list) { return list && list.length ? sec(id, title, "", '<ol class="tl">' + map(list, function (j) { return '<li class="reveal"><h3>' + (j.title || "") + "</h3>" + ((j.org || j.period) ? '<p class="cmeta">' + [j.org, j.period].filter(Boolean).join(" | ") + "</p>" : "") + (j.text ? "<p>" + j.text + "</p>" : "") + "</li>"; }) + "</ol>") : ""; };
    var extra = map(A.sections || [], function (x, i) { return sec("extra-" + i, x.heading || "", "", '<div class="story">' + (x.text || "").split(/\n+/).map(function (t) { return '<p class="reveal">' + t + "</p>"; }).join("") + "</div>"); });
    return hero + story + timeline("education", "Education", A.education) + timeline("experience", "Experience", A.experience) + extra + focus + tl + sk;
  }


  function services() {
    var V = S.servicesPage, items = V.items.filter(function (x) { return x.visible !== false; }).sort(function (a, b) { return a.order - b.order; });
    var head = '<section class="p-head"><div class="hero-grid" aria-hidden="true"></div><div class="wrap"><p class="eyebrow h-in">' + V.eyebrow + '</p><h1 class="h-in" style="--d:.1s">' + V.heading + '</h1><p class="lead h-in" style="--d:.2s">' + V.intro + '</p><p class="note h-in" style="--d:.3s">' + V.scopeNote + "</p></div></section>";
    var cards = map(items, function (x) {
      var dev = x.status === "Developing";
      return '<article class="card scard ' + (dev ? "is-dev" : "is-cur") + ' reveal">' + (x.image ? '<img class="simg" src="' + x.image + '" alt="" loading="lazy">' : "") + ic(x.icon) + (x.category ? '<small class="cat">' + x.category + "</small>" : "") + (dev ? '<span class="tag t-dev">Currently Learning</span>' : "") + "<h3>" + x.title + "</h3><p>" + x.description + "</p>" +
        ((x.tools.length || x.developingTools.length) ? '<ul class="tools-l" aria-label="Software and tools">' + map(x.tools, function (t) { return '<li class="tool">' + t + "</li>"; }) + map(x.developingTools, function (t) { return '<li class="tool tool-dev">' + t + (dev ? "" : " (learning)") + "</li>"; }) + "</ul>" : "") +
        '<div class="sc-foot"><a class="btn ' + (dev ? "btn-ghost" : "btn-pri") + '" href="' + (x.buttonHref || V.actionHref) + '">' + (x.buttonText || V.actionLabel) + '<span class="sr">: ' + x.title + '</span></a><span class="price">' + (x.price || V.pricingLabel) + "</span></div></article>";
    });
    var cl = V.closing;
    return head + '<section class="sec p-gal"><div class="wrap"><div class="grid g3 sgrid">' + cards + '</div></div></section>' +
      '<section id="project" class="cta-sec"><div class="wrap"><div class="cta-box reveal"><h2>' + cl.heading + "</h2><p>" + cl.text + '</p><div class="cta"><a class="btn btn-pri" href="' + cl.href + '">' + cl.button + "</a></div></div></div></section>";
  }


  function certificates() {
    var C = S.certificatesPage, vis = function (x) { return x.visible !== false; }, ord = function (a, b) { return a.order - b.order; };
    var certs = C.certificates.filter(vis).sort(ord), awards = C.awards.filter(vis).sort(ord);
    var card = function (c) {
      var thumb = c.image ? '<button type="button" class="cthumb" data-cert="' + c.id + '" aria-label="View certificate: ' + c.title + '"><img src="' + c.image + '" alt="Certificate image: ' + c.title + '" loading="lazy"></button>' : '<div class="cthumb cthumb-ph" aria-hidden="true">' + ic("doc") + "</div>";
      var acts = (c.image ? '<button type="button" class="btn btn-ghost" data-cert="' + c.id + '">View Certificate<span class="sr">: ' + c.title + "</span></button>" : "") +
        (c.pdf ? '<a class="btn btn-ghost" href="' + c.pdf + '" target="_blank" rel="noopener noreferrer">Open PDF<span class="sr">: ' + c.title + "</span></a>" : "") +
        (c.credentialUrl ? '<a class="lnk" href="' + c.credentialUrl + '" target="_blank" rel="noopener noreferrer">Verify Credential<span class="sr">: ' + c.title + "</span></a>" : "");
      return '<article class="card cert reveal">' + thumb + '<div class="proj-b"><h3>' + c.title + "</h3>" + (c.issuer ? '<p class="cmeta">' + c.issuer + "</p>" : "") + (c.date ? '<p class="cmeta">' + c.date + "</p>" : "") + (c.description ? "<p>" + c.description + "</p>" : "") + (acts ? '<div class="cert-act">' + acts + "</div>" : "") + "</div></article>";
    };
    var cats = map(C.categories, function (cat) {
      var list = certs.filter(function (c) { return c.category === cat.key; });
      return '<article class="ccat reveal"><h3>' + cat.title + '</h3><p class="ccat-sub">Topic areas</p><ul class="tools-l" aria-label="Topic areas">' + map(cat.topics, function (t) { return '<li class="tool">' + t + "</li>"; }) + "</ul>" +
        (list.length ? '<div class="grid g3 ccards">' + map(list, card) + "</div>" : (certs.length ? '<p class="cmeta">No certificates added in this category yet.</p>' : "")) + "</article>";
    });
    var head = '<section class="p-head"><div class="hero-grid" aria-hidden="true"></div><div class="wrap"><p class="eyebrow h-in">' + C.eyebrow + '</p><h1 class="h-in" style="--d:.1s">' + C.heading + '</h1><p class="lead h-in" style="--d:.2s">' + C.intro + "</p></div></section>";
    var cs = sec("certificates", "Certificates & Training", certs.length ? C.filledIntro : C.emptyIntro, cats);
    var tl = sec("learning", "My Learning Journey", "", '<ol class="tl">' + map(C.timeline, function (j, i) { return '<li class="reveal' + (i === C.timeline.length - 1 ? " now" : "") + '"><h3>' + j.title + (j.ongoing ? ' <span class="tag t-dev">Ongoing</span>' : "") + "</h3><p>" + j.text + "</p></li>"; }) + "</ol>", "alt");
    var aw = sec("awards", "Awards & Achievements", C.awardsNote, awards.length ? '<div class="grid g3">' + map(awards, function (a) { return '<article class="card reveal"><h3>' + a.title + "</h3>" + (a.issuer ? '<p class="cmeta">' + a.issuer + "</p>" : "") + (a.date ? '<p class="cmeta">' + a.date + "</p>" : "") + (a.description ? "<p>" + a.description + "</p>" : "") + "</article>"; }) + "</div>" : '<p class="empty-box reveal">' + C.awardsEmpty + "</p>");
    var dlg = '<dialog class="lb clb" id="clb" aria-labelledby="clb-title"><div class="lb-in"><button type="button" class="lb-x" aria-label="Close certificate viewer"><svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19"/></svg></button><div class="lb-media"><img id="clb-img" alt=""></div><div class="lb-info"><h2 id="clb-title"></h2><p id="clb-meta"></p><div id="clb-links"></div></div></div></dialog>';
    return head + cs + tl + aw + dlg;
  }

  function initCerts() {
    var dlg = $("#clb"); if (!dlg) return;
    var byId = {}; S.certificatesPage.certificates.forEach(function (c) { byId[c.id] = c; });
    document.addEventListener("click", function (e) {
      var b = e.target.closest("[data-cert]"); if (!b || !byId[b.dataset.cert]) return;
      var c = byId[b.dataset.cert], im = $("#clb-img");
      im.src = c.image; im.alt = "Certificate: " + c.title; $("#clb-title").textContent = c.title;
      $("#clb-meta").textContent = [c.issuer, c.date].filter(Boolean).join(", ");
      $("#clb-links").innerHTML = c.credentialUrl ? '<a class="btn btn-pri" href="' + c.credentialUrl + '" target="_blank" rel="noopener noreferrer">Verify Credential</a>' : "";
      document.documentElement.classList.add("lock"); dlg.showModal();
    });
    $("#clb .lb-x").addEventListener("click", function () { dlg.close(); });
    dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); });
    dlg.addEventListener("close", function () { document.documentElement.classList.remove("lock"); });
  }


  function contactPage() {
    var C = S.contact, P = S.contactPage, wa = "https://wa.me/" + C.whatsapp.replace(/\D/g, "");
    var head = '<section class="p-head"><div class="hero-grid" aria-hidden="true"></div><div class="wrap"><h1 class="h-in">' + P.heading + '</h1><p class="lead h-in" style="--d:.1s">' + P.intro + '</p><div class="cta h-in" style="--d:.2s"><a class="btn btn-pri" href="mailto:' + C.email + '">' + (P.ctaEmailText || "Send an Email") + '</a><a class="btn btn-blue" href="' + wa + '" target="_blank" rel="noopener noreferrer">' + (P.ctaWhatsappText || "Contact on WhatsApp") + '</a></div></div></section>';
    var L = Object.assign({ name: "Full Name", email: "Email Address", type: "Project / Inquiry Type", budget: "Budget", message: "Message", submit: "Send Message" }, P.labels || {});
    var info = [
      { i: "mail", t: "Email", v: '<a class="lnk" href="mailto:' + C.email + '">' + C.email + "</a>" },
      { i: "chat", t: "WhatsApp", v: '<a class="lnk" href="' + wa + '" target="_blank" rel="noopener noreferrer">' + C.whatsappDisplay + "</a>" },
      { i: "linkedin", t: "LinkedIn", v: '<a class="lnk" href="' + C.linkedin + '" target="_blank" rel="noopener noreferrer">View LinkedIn Profile</a>' },
      { i: "pin", t: "Location", v: "<span>" + C.location + "</span>" }];
    if (P.cards && P.cards.length) info = P.cards.filter(function (c) { return c.visible !== false; }).map(function (c) { var hr = tok(c.href); return { i: c.icon, t: c.title, v: hr ? '<a class="lnk" href="' + hr + '"' + (/^https?:/.test(hr) ? ' target="_blank" rel="noopener noreferrer"' : "") + ">" + tok(c.value) + "</a>" : "<span>" + tok(c.value) + "</span>" }; });
    var cards = sec("reach", P.infoHeading || "Contact Information", "", '<div class="grid g4 icards">' + map(info, function (x) { return '<article class="card icard reveal">' + ic(x.i) + "<h3>" + x.t + "</h3><p>" + x.v + "</p></article>"; }) + "</div>");
    var fld = function (id, label, req, ctl) { return '<div class="field"><label for="' + id + '">' + label + (req ? ' <span class="req" aria-hidden="true">*</span><span class="sr">(required)</span>' : ' <span class="opt">(optional)</span>') + "</label>" + ctl + '<p class="err" id="e-' + id + '" hidden></p></div>'; };
    var form = sec("message", P.formHeading || "Send a Message", P.formNote,
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
    var t = el.getAttribute("data-title");
    el.innerHTML = '<section class="stub"><div class="wrap"><h1>' + t + '</h1><p>This page is a placeholder route. It will be built in a later step.</p><a class="btn btn-pri" href="index.html#home">Back to Home</a></div></section>';
  }

  $("#site-header").innerHTML = header();
  $("#site-footer").innerHTML = footer();
  
  if ($("#home-app")) $("#home-app").innerHTML = home();
  if ($("#stub-app")) stub("stub-app");
  if ($("#services-app")) $("#services-app").innerHTML = services();
  if ($("#contact-app")) { $("#contact-app").innerHTML = contactPage(); initContact(); }
  if ($("#certs-app")) { $("#certs-app").innerHTML = certificates(); initCerts(); }
  if ($("#about-app")) $("#about-app").innerHTML = about();
  if ($("#portfolio-app")) { $("#portfolio-app").innerHTML = portfolio(); initPortfolio(); }
  document.documentElement.classList.add("js");
  document.querySelectorAll('img[src^="/uploads/"]').forEach(function (i) {
    var m = i.getAttribute("src").match(/^(\/uploads\/[a-f0-9]+)\.webp$/);
    if (m) { i.srcset = m[1] + "-640.webp 640w, " + m[1] + ".webp 1800w"; i.sizes = "(max-width: 820px) 100vw, 50vw"; }
  });

  // Image fallbacks
  document.querySelectorAll("img[data-fallback]").forEach(function (img) {
    var fix = function () {
      if (img.dataset.done) return; img.dataset.done = 1;
      img.src = "assets/img/placeholders/" + (img.dataset.fallback === "profile" ? "profile" : "project-1") + ".svg";
    };
    img.addEventListener("error", fix);
    if (img.complete && img.naturalWidth === 0) fix();
  });

  // Mobile menu
  var b = $(".burger"), m = $("#menu");
  b.addEventListener("click", function () {
    var o = b.getAttribute("aria-expanded") === "true";
    b.setAttribute("aria-expanded", !o); b.setAttribute("aria-label", o ? "Open menu" : "Close menu"); m.classList.toggle("open", !o);
  });
  m.addEventListener("click", function (e) { if (e.target.tagName === "A") { b.setAttribute("aria-expanded", "false"); m.classList.remove("open"); } });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") { b.setAttribute("aria-expanded", "false"); m.classList.remove("open"); } });

  // Active nav state
  var links = [].slice.call(document.querySelectorAll("#menu a"));
  function setActive(fn) { links.forEach(function (a) { fn(a) ? a.setAttribute("aria-current", "page") : a.removeAttribute("aria-current"); }); }
  var file = location.pathname.split("/").pop() || "index.html";
  if (file !== "index.html" && file !== "") setActive(function (a) { return a.getAttribute("href") === file; });
  else if ("IntersectionObserver" in window) {
    var spy = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) setActive(function (a) { return a.getAttribute("href") === "index.html#" + e.target.id; });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    document.querySelectorAll("[data-spy]").forEach(function (s) { spy.observe(s); });
  }

  // Scroll reveals + gentle hero parallax (both off for reduced motion)
  var calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var rv = document.querySelectorAll(".reveal");
  if (calm || !("IntersectionObserver" in window)) rv.forEach(function (r) { r.classList.add("in"); });
  else {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    rv.forEach(function (r, i) { r.style.setProperty("--d", (i % 4) * 0.07 + "s"); io.observe(r); });
    var g = $(".hero-grid"), t = false;
    if (g) window.addEventListener("scroll", function () {
      if (t) return; t = true;
      requestAnimationFrame(function () { g.style.transform = "translateY(" + Math.min(window.scrollY, 700) * 0.15 + "px)"; t = false; });
    }, { passive: true });
  }

  /* ---- Cinematic 3D scroll mode (default on; switch off in Admin > Website Design > Scroll effects). Respects reduced-motion. ---- */
  (function cinematic() {
    var mode = (S.design && S.design.motion) || "cinematic";
    if (mode !== "cinematic" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var root = document.documentElement; root.classList.add("cine");
    var bar = document.createElement("div"); bar.id = "progress"; bar.setAttribute("aria-hidden", "true"); document.body.appendChild(bar);
    var hl = document.querySelector(".hero .headline");
    if (hl && !hl.dataset.split) {
      var txt = hl.textContent.trim(); hl.setAttribute("aria-label", txt); hl.dataset.split = "1"; hl.textContent = "";
      txt.split(/\s+/).forEach(function (w, i) { var sp = document.createElement("span"); sp.className = "w"; sp.setAttribute("aria-hidden", "true"); sp.style.setProperty("--i", i); sp.textContent = w; hl.appendChild(sp); hl.appendChild(document.createTextNode(" ")); });
    }
    var targets = [].slice.call(document.querySelectorAll(".card, .shot, .cta-box")), active = new Set(), vh = innerHeight, vw = innerWidth, queued = false;
    targets.forEach(function (el) { el.setAttribute("data-s3d", ""); });
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { e.isIntersecting ? active.add(e.target) : active.delete(e.target); }); update(); }, { rootMargin: "25% 0px" });
    targets.forEach(function (el) { io.observe(el); });
    function frame() {
      queued = false; var y = window.scrollY, max = Math.max(1, document.documentElement.scrollHeight - vh);
      root.style.setProperty("--sy", Math.min(y, vh * 1.3).toFixed(0)); root.style.setProperty("--prog", Math.min(1, y / max).toFixed(4));
      var nav = document.querySelector(".nav"); if (nav) nav.classList.toggle("scrolled", y > 20);
      active.forEach(function (el) {
        var r = el.getBoundingClientRect(), p = Math.max(-1.3, Math.min(1.3, ((r.top + r.height / 2) - vh / 2) / (vh / 2))), cx = Math.max(-1.3, Math.min(1.3, ((r.left + r.width / 2) - vw / 2) / (vw / 2)));
        el.style.setProperty("--p", p.toFixed(3)); el.style.setProperty("--a", Math.abs(p).toFixed(3)); el.style.setProperty("--cx", cx.toFixed(3));
      });
    }
    function update() { if (!queued) { queued = true; requestAnimationFrame(frame); } }
    addEventListener("scroll", update, { passive: true }); addEventListener("resize", function () { vh = innerHeight; vw = innerWidth; update(); }); update();
    if (matchMedia("(hover: hover) and (pointer: fine)").matches) {
      document.addEventListener("pointermove", function (e) {
        var c = e.target.closest && e.target.closest(".card");
        if (c) { var r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5; c.style.setProperty("--tx", (-y * 8).toFixed(2) + "deg"); c.style.setProperty("--ty", (x * 10).toFixed(2) + "deg"); }
        var hero = document.querySelector(".hero");
        if (hero) { var hr = hero.getBoundingClientRect(); if (e.clientY >= hr.top && e.clientY <= hr.bottom) { root.style.setProperty("--hx", ((e.clientX - hr.left) / hr.width - 0.5).toFixed(3)); root.style.setProperty("--hy", ((e.clientY - hr.top) / hr.height - 0.5).toFixed(3)); } }
      }, { passive: true });
      document.addEventListener("pointerout", function (e) { var c = e.target.closest && e.target.closest(".card"); if (c && !c.contains(e.relatedTarget)) { c.style.removeProperty("--tx"); c.style.removeProperty("--ty"); } });
    }
  })();
})();
