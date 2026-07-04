#!/usr/bin/env bash
# Deploy ONLY the chores dashboard to the live site (adityaandchhaya.us/chores/).
#
# The live site is built by Cloudflare Pages from the `main` branch, so
# deploying = commit + push. This script rebuilds the single-file pages and
# commits ONLY the chores files (sources + built pages) — anything else in
# your working tree, tracked or untracked (trip pages etc.), stays local.
#
# Usage: ./chores/deploy-chores.sh ["commit message"]
set -euo pipefail

cd "$(dirname "$0")/.."  # repo root

if [ "$(git rev-parse --abbrev-ref HEAD)" != "main" ]; then
    echo "✗ not on main — the live site builds from main. Switch branches first."
    exit 1
fi

# refuse to sweep unrelated already-staged work into the deploy commit
if git diff --cached --name-only | grep -qv '^\(chores/\|public/chores/\)'; then
    echo "✗ you have non-chores changes staged — commit or unstage them first:"
    git diff --cached --name-only | grep -v '^\(chores/\|public/chores/\)'
    exit 1
fi

echo "→ rebuilding single-file pages…"
node chores/build-deploy.mjs

# explicit allowlist — never 'git add chores/' wholesale (scratch files live there)
FILES=(
    chores/app.js chores/db.js chores/stats.js
    chores/index.html chores/stats.html
    chores/styles.css chores/stats.css
    chores/build-deploy.mjs chores/deploy-chores.sh
    chores/tests
    public/chores
)

git add -- "${FILES[@]}"
if git diff --cached --quiet; then
    echo "nothing to deploy — chores files already match main"
    exit 0
fi

msg="${1:-Chores: deploy dashboard update ($(date '+%Y-%m-%d %H:%M'))}"
echo "→ committing:"
git diff --cached --name-only | sed 's/^/    /'
git commit -m "$msg" --quiet

echo "→ pushing to origin/main (Cloudflare Pages rebuilds automatically)…"
git push origin main

echo "✓ pushed — live at https://adityaandchhaya.us/chores/ in ~1-3 min"
