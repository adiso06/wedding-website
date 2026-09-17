# How to add a page to adityaandchhaya.us

Notes for whoever (or whatever) publishes the next trip page. Written 2026-09-17.

## How the site is served

- Repo `adiso06/wedding-website` → **GitHub Pages** → `adityaandchhaya.us` (DNS proxied through Cloudflare).
- `.github/workflows/deploy.yml` runs on every push to `main`: `npm ci` → `npm run build` (Vite, `tsc && vite build`) → uploads `./dist`.
- **Vite copies everything in `public/` to the site root verbatim.** That is the easy door: a static page dropped in `public/` needs no build config, no React, no entry in `vite.config.ts`.
- Takes about 2 minutes. Watch it with `gh run list --repo adiso06/wedding-website`.

## Where a trip page goes

| You add | It serves at |
| --- | --- |
| `public/trips/foo.html` | `https://adityaandchhaya.us/trips/foo` |
| `public/trips/foo/index.html` | `https://adityaandchhaya.us/trips/foo/` |

GitHub Pages serves `.html` files at their extensionless path, and 308-redirects `/trips/foo.html` → `/trips/foo`. So for a URL like `/trips/momdad2026`, add `public/trips/momdad2026.html`. Existing pages use both styles (`turkey.html`, `chhaya30th/`, `mexico/`).

## The /trips/ shelf builds itself

**Do not hand-edit `public/trips/index.html` — it is generated and your edits will be overwritten.**

`scripts/build-trips-index.js` runs as npm's `prebuild`, so every `npm run build` (and therefore every deploy) rebuilds the shelf. It scans `public/trips/` and `trips/`, finds every page, and writes the card grid into `scripts/trips-index-template.html`, replacing the `<!-- TRIPS:CARDS -->` marker.

**A new page needs nothing.** Its `<title>` becomes the card title and its `<meta name="description">` becomes the blurb.

To control a card, add meta tags to the page itself:

```html
<meta name="trip-label" content="September 2026">   <!-- the small date line -->
<meta name="trip-title" content="Mom & Dad in New York">
<meta name="trip-blurb" content="One sentence for the card.">
<meta name="trip-order" content="10">               <!-- lower sorts first -->
<meta name="trip-hidden" content="true">            <!-- keep it off the shelf -->
```

`scripts/trips.meta.json` does the same thing keyed by URL, and wins over the page's own tags. It exists for pages you would rather not edit. Pages with no order sort last, alphabetically.

Two things stay hand-written in `scripts/trips-index-template.html`: the **Featured Trip** block and the page's own copy. Edit the template, not the output.

The generator never fails the build. If the template is missing or malformed it warns and leaves the existing `index.html` alone.

To preview locally: `node scripts/build-trips-index.js`, then look at `public/trips/index.html`.

## Do not clone this repo

It is ~460 MB shallow and 1.7 GB in full — photos in `public/`. There is already a clone at
`~/Downloads/_Hub_04_Wedding/wedding-website/wedding-website` (on `main`; check `git status` before committing from it).

**Add a single file without any clone:**

```bash
gh api --method PUT /repos/adiso06/wedding-website/contents/public/trips/NAME.html \
  -f message="Add NAME trip page" \
  -f branch=main \
  -f content="$(base64 -i /path/to/local/NAME.html)"
```

To update an existing file, the same call also needs `-f sha="$(gh api /repos/adiso06/wedding-website/contents/public/trips/NAME.html --jq .sha)"`.

## Gotcha: every path returns HTTP 200

There is a catch-all, so `curl -o /dev/null -w '%{http_code}'` returns `200` for paths that do not exist (`/trips/zzz-nonexistent` → 200). A 200 does **not** prove the page deployed. Verify by grepping for real content:

```bash
curl -s https://adityaandchhaya.us/trips/NAME | grep -c "<title>"
```

## Page conventions

- Standalone, self-contained HTML: own `<style>`, no shared stylesheet, no build step. Google Fonts links are fine.
- Add `<meta name="robots" content="noindex, nofollow">` for personal pages. The site is public and unauthenticated: anything published here can be read by anyone with the URL, and by default it is now listed on `/trips/` too. Use `trip-hidden` if a page should not appear there.
- Add `<link rel="canonical" href="https://adityaandchhaya.us/trips/NAME">`.

## If the source is a Claude artifact

Artifact HTML files are fragments: they start with `<title>`/`<style>` and have no `<!doctype>`, `<html>`, `<head>` or `<body>`, because the artifact runtime wraps them at publish time. To make one standalone, split the file at its first body-level element (for the momdad2026 page that was `<main class="wrap">`), put everything before it inside a `<head>` you supply, and wrap the rest in `<body>`. Keep the artifact's own `<title>`; do not add a second one.
