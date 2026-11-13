# MD Shahadat Hossain: Portfolio with Admin Dashboard

A BIM & Civil Engineering portfolio website whose content is fully editable from a password-protected admin dashboard at `/admin`.
Bangla step-by-step guide for daily use: **BANGLA-GUIDE.md**.

It runs in two ways, using the same code for login, content, media and messages:

| | Netlify (recommended) | Self-hosted (optional) |
|---|---|---|
| Backend | `netlify/functions/api.mjs` (Netlify Function) | `server/index.js` (Node + Express) |
| Data & images | Netlify Blobs (built in, no database to buy) | SQLite file + `data/uploads` folder |
| Setup code | `SETUP_CODE` environment variable | printed in the server log |

---

## 1. Put it on Netlify (so `/admin` can change everything)

You need a free GitHub account and a Netlify account.

1. **Upload the project to GitHub.** Unzip, create a new repository (private is fine) and upload everything. Do **not** upload `node_modules`, `data` or `dist` (they are in `.gitignore`).
2. **Create the site.** In Netlify: *Add new site, Import an existing project*, pick the repository. Settings come from `netlify.toml` (build command `node scripts/build-netlify.js`, publish folder `dist`). Do not change them.
3. **Set the setup code.** *Site configuration, Environment variables, Add a variable*: name `SETUP_CODE`, value a secret code you invent (12+ random characters). Then *Deploys, Trigger deploy, Deploy site* so the function sees it.
4. **Create your admin account.** Open `https://YOUR-SITE.netlify.app/admin`, enter the setup code, choose a username and a password (10+ characters). **Save the 8 recovery codes** shown once.
5. **Done.** Log in at `/admin` with your username and password, change anything, click **Save changes**: the public site updates immediately. No redeploy is needed for content changes.

Notes
- Content, uploaded images, PDFs and contact messages live in Netlify Blobs. They are **not** deleted when you redeploy.
- After the admin account exists you may delete `SETUP_CODE` from Netlify (it is only needed once).
- Contact-form email notifications are optional: set `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `NOTIFY_FROM`, `NOTIFY_TO` (see `.env.example`). Messages are always saved in the dashboard.
- Use Git-based deploys. Drag-and-drop folder deploys do not run the build, so the backend may not work.
- Netlify limits a function request to about 6 MB, so each uploaded file must be about 4 MB or less. The admin shrinks photos in the browser first; PDFs must already be small.
- Netlify's free plan has monthly usage limits (function calls, bandwidth). Page views call the function for the saved content, and uploaded images are served through it. Check your usage in the Netlify dashboard if traffic grows.

## 2. Run it on your own computer (optional)

Requires Node.js 22+.

```
npm install
npm start
```
The log prints a one-time setup code; open http://localhost:3000/admin and create the account. Data goes to `./data` (database + uploads). This local data is separate from your Netlify data.
A VPS works the same way: run `npm start` behind HTTPS (nginx/Caddy), set `TRUST_PROXY=1`, `NODE_ENV=production`, and keep `DATA_DIR` on a persistent disk. Back up with `npm run backup`. Forgot everything? `NEW_PASSWORD='long-new-password' npm run reset-password`.

## 3. What you can manage from `/admin`

Profile, Home page (sections on/off, order, headings, buttons), About (add Education, Experience, extra sections), Projects (add, edit, delete, duplicate, drag to reorder, categories, featured, multiple images, PDFs, links), Services, Skills, Certificates and Awards, Contact page text/labels/cards, Messages inbox (read/unread/delete), Media Library (upload, search, rename, move to folder, delete with in-use warning), Navigation, Footer, Website Design (colors, fonts, roundness, buttons, light/dark), SEO, Admin Account (username, password, recovery codes), Backup & Restore (JSON export, restore, last 30 versions).

## 4. Security summary

- Passwords are hashed with bcrypt; sessions are random tokens in HttpOnly, SameSite=Strict cookies (Secure on HTTPS); password change signs out other devices.
- No built-in credentials. First account needs the one-time setup code. Password reset uses single-use recovery codes.
- Login, recovery, setup and contact endpoints are rate-limited. Contact form: server-side validation, hidden spam trap, minimum fill time, 5 messages/hour per visitor.
- Every admin request is checked on the server and needs a custom header (CSRF protection). Saved content is validated; unsafe links such as `javascript:` are rejected; text is HTML-escaped when served.
- Uploads: images are checked, resized and converted to WebP (SVG and fake images are refused); PDFs are checked by signature.
- The `/admin` page itself (login screen) is public; all its data and actions require login.

## 5. Limits and honest notes

- One administrator account (no roles). Password recovery uses recovery codes, not email.
- Project videos are added as links (YouTube/Vimeo/file URL), not uploaded.
- No statistics section (you asked for it only with real figures).
- Light/dark is one site-wide setting, not a visitor toggle.
- Media "folders" are labels, not nested folders.
- On Netlify the HTML pages are static files: design, theme, fonts and SEO tags are applied by the page's JavaScript, so search-engine crawlers that do not run JavaScript see the default title/description. (Self-hosted mode injects them on the server.)
- Rate limits on Netlify are stored in Blobs per visitor address; they are best-effort.
- Backup JSON contains content, media records and messages, not the image/PDF files themselves: keep your original files (or use `npm run backup` when self-hosting).

## 6. What was tested

Final package (this ZIP), checked with Chromium (Playwright) and direct API calls:
- **Netlify function, packaged with Netlify's own bundler** (zip-it-and-ship-it, using the settings in `netlify.toml`), unzipped and run with the real `@netlify/blobs` client against Netlify's local Blobs server: 34 checks. They cover first-time setup (wrong code refused), login, session cookie flags, protected endpoints, content save and public delivery, HTML/`javascript:` link protection, image upload (optimized WebP + small copy; fake image rejected; PDF), file serving, deleting a file that is in use (refused), contact form (spam trap, too-fast, bad email, valid), inbox, backup/restore, version history, password change, recovery codes (single use), brute-force limiting and CSRF protection.
- **Admin screens in a real browser**, on both the Netlify-style setup and the self-hosted server: 16 checks each (setup, dashboard, editing a profile field, uploading an image, adding a featured project with a new category, design/theme change, hiding a menu item, contact form to inbox, delete message, logout/login, phone-size admin, no JavaScript errors).
- Earlier in development a larger 88-check suite (self-hosted) and 86-check suite (Netlify-style) also passed, including drag-and-drop reordering, duplicate/delete, backup/restore through the screens, and restart persistence.

**Not tested:** deploying to Netlify's cloud (the steps in section 1 are instructions, not something I ran there), email notifications (need your SMTP details), browsers other than Chromium, real phones, and Netlify's real request limits.
`
## 7. Project layout

(`tests/netlify-harness.mjs` is a test-only stand-in for Netlify; you do not need it.)

```
index.html about.html services.html portfolio.html certificates.html contact.html   public pages
assets/                  styles, scripts, placeholder images
admin/                   the dashboard (index.html, admin.js, admin.css)
server/core.js           shared backend logic (auth, content, media, messages, backup)
server/store-blobs.js    Netlify Blobs storage        server/store-sqlite.js   SQLite storage
server/default-site.json starting content            server/schema.sql        self-hosted database tables
netlify/functions/api.mjs  Netlify Function entry     netlify.toml             Netlify settings
scripts/                 build-netlify.js, backup.js, reset-password.js, build-defaults.js
```
`assets/js/site-config.js` is the starting content for static previews; once the backend runs, the live content comes from the database/Blobs.
