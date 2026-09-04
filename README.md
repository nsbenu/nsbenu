# NSBE Northwestern — Chapter Website

A static, multi-page site for the Northwestern University chapter of NSBE. Plain HTML/CSS/JS, no build step — works directly with GitHub Pages.

## Pages

| Page | File |
|---|---|
| Home (welcome banner + upcoming events) | `index.html` |
| About Us | `about.html` |
| Meet the Exec Board | `board.html` |
| Sponsors | `sponsors.html` |
| Donate | `donate.html` |

The header and footer live once, in `partials/header.html` and `partials/footer.html`, and `script.js` injects them into every page (the `<div id="site-header">` / `<div id="site-footer">` on each page). Edit nav links, the newsletter form, or the footer's social/sponsor links in those two partial files and every page updates at once.

**Because of that fetch, you must preview this over a local server, not by double-clicking `index.html`.** Browsers block `fetch()` on `file://` URLs. From this folder, run:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

GitHub Pages serves over `https://`, so the fetch works fine once deployed — this only affects local preview.

## What to customize

Every placeholder is wrapped in `[brackets]` — search for `[` across the files. The main things to fill in:

- **`index.html`** — the hero background photos are placeholder stock images from picsum.photos (`hero__photo--1` through `--4`). Replace the four `background-image:url(...)` values with real chapter/event photos (upload them into an `images/` folder and point to `images/yourfile.jpg`). Fill in real upcoming events.
- **`board.html`** — one `<article class="board-card">` per officer. Each has an `<img>` (currently a placeholder photo), name, role, year/major, a short blurb, and an email. Add or remove cards as your board changes.
- **`about.html`** — chapter founding year, member count, meeting times/rooms.
- **`sponsors.html`** — real sponsor names, links, and one-line descriptions. Two tiers are set up (signature / supporting); adjust as needed.
- **`donate.html`** — swap the `[Give now →]` button's `href` for your actual giving link (a Northwestern student-org giving page, Venmo, PayPal, etc.). GitHub Pages can only link out to a payment processor — it can't process payments itself.
- **`partials/footer.html`** — real email, Instagram/LinkedIn/GroupMe links, and sponsor links.

### Forms (newsletter signup)
The footer newsletter form doesn't send anywhere yet — GitHub Pages only hosts static files, it can't run server code to collect emails. Easiest fixes:
- [Mailchimp](https://mailchimp.com) or [ConvertKit](https://convertkit.com) embed/signup form action
- [Formspree](https://formspree.io) (free tier) pointed at the form's `action`

The placeholder behavior is in `script.js` — replace the `newsletterForm` submit handler once you've picked a service.

## Put it on GitHub

```bash
cd nsbe-northwestern
git init
git add .
git commit -m "Initial site"
git branch -M main
git remote add origin https://github.com/<your-org-or-username>/<repo-name>.git
git push -u origin main
```

## Turn on GitHub Pages

1. Repo → **Settings** → **Pages**.
2. Under **Build and deployment** → **Source**, choose **Deploy from a branch**.
3. Branch: `main`, folder: `/ (root)`. Save.
4. Live at `https://<your-org-or-username>.github.io/<repo-name>/` within a minute or two.

For a bare `https://<username>.github.io` URL, name the repo exactly `<username>.github.io`. For a custom domain, add it under **Settings → Pages → Custom domain** and point a `CNAME` DNS record at `<username>.github.io`.

## Design notes

Fonts (Fraunces for headings, IBM Plex Sans/Mono for body/labels) load from Google Fonts — no local font files needed. Colors are Northwestern purple (`#4E2A84`) paired with a brass/copper accent, set as CSS custom properties at the top of `style.css` if you want to retheme.
