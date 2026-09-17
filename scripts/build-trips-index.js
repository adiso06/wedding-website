#!/usr/bin/env node
/**
 * Regenerates public/trips/index.html — the shelf of trip cards.
 *
 * Runs automatically before every build (package.json "prebuild"), so a new
 * trip page appears on the shelf the moment it is deployed. Nothing to
 * hand-edit: drop a page in public/trips/ and it shows up.
 *
 * Where a card's text comes from, in order of preference:
 *   1. scripts/trips.meta.json     — keyed by URL, wins over everything
 *   2. the page's own <meta> tags  — trip-label, trip-title, trip-blurb,
 *                                    trip-order, trip-hidden
 *   3. the page's <title> and <meta name="description">
 *
 * Ordering: pages with an order sort ascending (lowest first), then the rest
 * alphabetically. Set trip-hidden to keep a page off the shelf entirely.
 *
 * This never fails the build. If anything goes wrong it warns and leaves the
 * existing index.html untouched.
 */
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const TEMPLATE = join(ROOT, 'scripts', 'trips-index-template.html');
const OVERRIDES = join(ROOT, 'scripts', 'trips.meta.json');
const OUTPUT = join(ROOT, 'public', 'trips', 'index.html');
const MARKER = '<!-- TRIPS:CARDS -->';
const HEAD_BYTES = 16000; // only the head of each page is parsed

/** Every trip page on disk, as { file, url }. */
function findTripPages() {
  const searchDirs = [
    join(ROOT, 'public', 'trips'), // plain static pages, copied verbatim by Vite
    join(ROOT, 'trips'), // Vite entry pages, e.g. trips/mexico/index.html
  ];
  const pages = [];
  for (const dir of searchDirs) {
    if (!existsSync(dir)) continue;
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (entry.name.startsWith('.')) continue;
      if (entry.isFile() && entry.name.endsWith('.html')) {
        if (entry.name === 'index.html') continue; // the shelf itself
        pages.push({
          file: join(dir, entry.name),
          url: '/trips/' + entry.name.replace(/\.html$/i, ''),
        });
      } else if (entry.isDirectory()) {
        const index = join(dir, entry.name, 'index.html');
        if (existsSync(index)) {
          pages.push({ file: index, url: '/trips/' + entry.name + '/' });
        }
      }
    }
  }
  const seen = new Set();
  return pages.filter((p) => (seen.has(p.url) ? false : seen.add(p.url)));
}

function readHead(file) {
  return readFileSync(file).subarray(0, HEAD_BYTES).toString('utf8');
}

function metaContent(html, name) {
  const tag = html.match(new RegExp(`<meta[^>]*name=["']${name}["'][^>]*>`, 'i'));
  if (!tag) return null;
  // Match the quote characters as a pair. An apostrophe inside a double-quoted
  // value is common ("Mom and Dad's visit") and must not end the match.
  const content = tag[0].match(/content="([^"]*)"|content='([^']*)'/i);
  if (!content) return null;
  return decodeEntities((content[1] ?? content[2]).trim());
}

function pageTitle(html) {
  const match = html.match(/<title>([^<]*)<\/title>/i);
  if (!match) return null;
  // "Trips | Aditya & Chhaya" -> "Trips"
  return decodeEntities(match[1].trim()).replace(/\s*[|·–—]\s*Aditya.*$/i, '').trim();
}

function decodeEntities(text) {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'");
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildCard({ url, label, title, blurb }) {
  const lines = [`        <a class="card" href="${escapeHtml(url)}">`];
  if (label) lines.push(`          <p class="kicker">${escapeHtml(label)}</p>`);
  lines.push(`          <h3 class="card-title">${escapeHtml(title)}</h3>`);
  if (blurb) {
    lines.push('          <p>', `            ${escapeHtml(blurb)}`, '          </p>');
  }
  lines.push('        </a>');
  return lines.join('\n');
}

function main() {
  if (!existsSync(TEMPLATE)) {
    throw new Error(`missing template at ${TEMPLATE}`);
  }
  const template = readFileSync(TEMPLATE, 'utf8');
  if (!template.includes(MARKER)) {
    throw new Error(`template has no ${MARKER} marker`);
  }
  const overrides = existsSync(OVERRIDES)
    ? JSON.parse(readFileSync(OVERRIDES, 'utf8'))
    : {};

  const cards = findTripPages()
    .map(({ file, url }) => {
      const html = readHead(file);
      const own = overrides[url] || {};
      const hidden = own.hidden === true || metaContent(html, 'trip-hidden') !== null;
      if (hidden) return null;
      const order = own.order ?? metaContent(html, 'trip-order');
      return {
        url,
        label: own.label ?? metaContent(html, 'trip-label') ?? '',
        title: own.title ?? metaContent(html, 'trip-title') ?? pageTitle(html) ?? url,
        blurb:
          own.blurb ??
          metaContent(html, 'trip-blurb') ??
          metaContent(html, 'description') ??
          '',
        order: order === null || order === undefined ? Infinity : Number(order),
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));

  writeFileSync(OUTPUT, template.replace(MARKER, cards.map(buildCard).join('\n\n')));

  console.log(`trips index: ${cards.length} card(s) ->`);
  for (const card of cards) console.log(`  ${card.url}  ${card.title}`);
}

try {
  main();
} catch (error) {
  console.warn(`trips index: skipped (${error.message}). Existing index.html left as is.`);
}
