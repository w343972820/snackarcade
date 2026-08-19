#!/usr/bin/env node
/**
 * Default social sharing image generator.
 *
 * Every page that does not supply its own cover (homepage, blog posts,
 * compliance pages, collections, ...) shares one default Open Graph image:
 * `SITE.defaultOgImage` → `/og-default.png` (see src/config/site.ts).
 *
 * This script generates that file as a clean branded 1200×630 image, using the
 * same palette and typographic style as scripts/gen-covers.mjs, so the default
 * share image always matches the site's look. Astro copies it from
 * `public/og-default.png` to `dist/og-default.png` on build.
 *
 * It never overwrites an existing file unless you pass --force, so a hand-made
 * replacement later is safe.
 *
 * Usage:
 *   npm run gen:og-default
 *   npm run gen:og-default -- --force
 */
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

import pc from 'picocolors';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = path.join(ROOT, 'public');
const OUT_FILE = path.join(OUT_DIR, 'og-default.png');

const WIDTH = 1200;
const HEIGHT = 630;

/** Brand palette, kept in step with scripts/gen-covers.mjs and @theme tokens. */
const PALETTE = {
  backgroundTop: '#111827',
  backgroundBottom: '#1f2937',
  accent: '#f97316',
  text: '#f9fafb',
  muted: '#9ca3af',
};

/**
 * Escape the five characters that are not legal as raw text inside SVG.
 * @param {string} value
 * @returns {string}
 */
function escapeXml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Build the SVG source for the default share image.
 *
 * Layout mirrors the game covers: dark diagonal gradient, orange accent bar on
 * the left, an orange eyebrow label, one strong white title line and a muted
 * tagline. The brand name is the eyebrow so any page that falls back to this
 * image still reads as SnackArcade in a share preview.
 * @returns {string} SVG markup.
 */
function buildSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${PALETTE.backgroundTop}"/>
      <stop offset="100%" stop-color="${PALETTE.backgroundBottom}"/>
    </linearGradient>
  </defs>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)"/>
  <rect x="0" y="0" width="14" height="${HEIGHT}" fill="${PALETTE.accent}"/>
  <g opacity="0.10" fill="${PALETTE.accent}">
    <rect x="880" y="120" width="90" height="90" rx="10"/>
    <rect x="985" y="120" width="90" height="90" rx="10"/>
    <rect x="985" y="225" width="90" height="90" rx="10"/>
    <rect x="1090" y="225" width="90" height="90" rx="10"/>
    <rect x="880" y="330" width="90" height="90" rx="10"/>
    <rect x="985" y="330" width="90" height="90" rx="10"/>
  </g>
  <text x="90" y="180" font-family="Segoe UI, Helvetica Neue, Arial, sans-serif" font-size="34" font-weight="700" letter-spacing="8" fill="${PALETTE.accent}">${escapeXml('SNACKARCADE')}</text>
  <text x="90" y="330" font-family="Segoe UI, Helvetica Neue, Arial, sans-serif" font-size="104" font-weight="800" fill="${PALETTE.text}">${escapeXml('Free browser games')}</text>
  <text x="90" y="408" font-family="Segoe UI, Helvetica Neue, Arial, sans-serif" font-size="34" font-weight="500" fill="${PALETTE.muted}">${escapeXml('No download · No sign-up · Real guides')}</text>
</svg>`;
}

async function main() {
  const force = process.argv.includes('--force');

  if (fs.existsSync(OUT_FILE) && !force) {
    process.stdout.write(`${pc.yellow('skipped')} ${path.relative(ROOT, OUT_FILE).replace(/\\/g, '/')} already exists (use --force to overwrite).\n`);
    return;
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });
  await sharp(Buffer.from(buildSvg())).png({ compressionLevel: 9 }).toFile(OUT_FILE);

  process.stdout.write(
    `${pc.green('created')} ${path.relative(ROOT, OUT_FILE).replace(/\\/g, '/')} (${WIDTH}×${HEIGHT})\n` +
      `${pc.dim('Default share image — replace with a real brand artwork at 1200×630 whenever you have one.')}\n`,
  );
}

main().catch((error) => {
  process.stderr.write(`${pc.red('OG default generation failed:')} ${String(error)}\n`);
  process.exitCode = 1;
});
