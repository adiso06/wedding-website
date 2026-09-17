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

## Do not clone this repo

It is ~460 MB shallow and 1.7 GB in full — photos in `public/`. There is already a clone at
`~/Downloads/_Hub_04_Wedding/wedding-website/wedding-website` (on `main`, usually with uncommitted changes — check `git status` before committing anything from it).

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
- Add `<meta name="robots" content="noindex, nofollow">` for personal pages. The site is public and unauthenticated: anything published here can be read by anyone with the URL.
- Add `<link rel="canonical" href="https://adityaandchhaya.us/trips/NAME">`.
- `public/trips/index.html` is a hand-maintained shelf of cards. **Adding a page does not list it** — add a card there only when the page is meant to be discoverable.

## If the source is a Claude artifact

Artifact HTML files are fragments: they start with `<title>`/`<style>` and have no `<!doctype>`, `<html>`, `<head>` or `<body>`, because the artifact runtime wraps them at publish time. To make one standalone, split the file at its first body-level element (for the momdad2026 page that was `<main class="wrap">`), put everything before it inside a `<head>` you supply, and wrap the rest in `<body>`. Keep the artifact's own `<title>`; do not add a second one.
