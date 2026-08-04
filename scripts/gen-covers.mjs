#!/usr/bin/env node
/**
 * Cover image generator.
 *
 * Every game page needs a 1200×630 cover for social sharing and for the game
 * grid. This script generates a clean branded cover for any game that does not
 * have one yet, so the build never fails just because an image is missing.
 *
 * These are deliberately typographic covers, not fake screenshots. Inventing a
 * screenshot of a game would be dishonest, and Google treats mismatched preview
 * images as a quality signal against you.
 *
 * Replace any generated file with a real screenshot whenever you have one —
 * this script never overwrites an existing cover unless you pass --force.
 *
 * Usage:
 *   npm run gen:covers
 *   npm run gen:covers -- --force
 */
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

import matter from 'gray-matter';
import pc from 'picocolors';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const GAMES_DIR = path.join(ROOT, 'src', 'content', 'games');
const ASSETS_DIR = path.join(ROOT, 'src', 'assets', 'games');

const WIDTH = 1200;
const HEIGHT = 630;

/** Brand palette, kept in step with the @theme tokens in src/styles/global.css. */
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
 * Split a title across at most two lines so long names stay inside the canvas.
 * @param {string} title
 * @returns {string[]}
 */
function wrapTitle(title) {
  const MAX_PER_LINE = 16;
  if (title.length <= MAX_PER_LINE) return [title];

  const words = title.split(/\s+/);
  if (words.length === 1) return [title];

  /** @type {string[]} */
  const lines = [];
  let current = '';

  for (const word of words) {
    const candidate = current === '' ? word : `${current} ${word}`;
    if (candidate.length > MAX_PER_LINE && current !== '') {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }
  if (current !== '') lines.push(current);

  return lines.slice(0, 2);
}

/**
 * Build the SVG source for one cover.
 * @param {string} title Game display name.
 * @param {string} category Category display name shown as an eyebrow label.
 * @returns {string} SVG markup.
 */
function buildSvg(title, category) {
  const lines = wrapTitle(title);
  const fontSize = lines.length > 1 ? 96 : 116;
  const startY = lines.length > 1 ? 320 : 358;

  const titleMarkup = lines
    .map(
      (line, index) =>
        `<text x="90" y="${startY + index * (fontSize + 12)}" font-family="Segoe UI, Helvetica Neue, Arial, sans-serif" font-size="${fontSize}" font-weight="800" fill="${PALETTE.text}">${escapeXml(line)}</text>`,
    )
    .join('\n    ');

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
  <text x="90" y="180" font-family="Segoe UI, Helvetica Neue, Arial, sans-serif" font-size="30" font-weight="700" letter-spacing="6" fill="${PALETTE.accent}">${escapeXml(category.toUpperCase())}</text>
  ${titleMarkup}
  <text x="90" y="${startY + lines.length * (fontSize + 12) + 34}" font-family="Segoe UI, Helvetica Neue, Arial, sans-serif" font-size="34" font-weight="500" fill="${PALETTE.muted}">Free to play · No download · SnackArcade</text>
</svg>`;
}

/**
 * Turn a category id such as `card-board` into `Card Board`.
 * @param {string} id
 * @returns {string}
 */
function humaniseCategory(id) {
  return id
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

async function main() {
  const force = process.argv.includes('--force');

  if (!fs.existsSync(GAMES_DIR)) {
    process.stdout.write(`${pc.yellow('No game content yet — nothing to generate.')}\n`);
    return;
  }

  const files = fs.readdirSync(GAMES_DIR).filter((name) => name.endsWith('.md'));
  let created = 0;
  let skipped = 0;

  for (const fileName of files) {
    const slug = fileName.replace(/\.md$/, '');
    const parsed = matter(fs.readFileSync(path.join(GAMES_DIR, fileName), 'utf8'));

    const coverRef = String(parsed.data?.media?.cover ?? `../../assets/games/${slug}/cover.png`);
    const coverPath = path.resolve(GAMES_DIR, coverRef);

    if (fs.existsSync(coverPath) && !force) {
      skipped += 1;
      continue;
    }

    const title = String(parsed.data?.title ?? slug);
    const category = humaniseCategory(String(parsed.data?.taxonomy?.primaryCategory ?? 'games'));

    fs.mkdirSync(path.dirname(coverPath), { recursive: true });
    await sharp(Buffer.from(buildSvg(title, category))).png({ compressionLevel: 9 }).toFile(coverPath);

    process.stdout.write(
      `${pc.green('created')} ${path.relative(ROOT, coverPath).replace(/\\/g, '/')} (${WIDTH}×${HEIGHT})\n`,
    );
    created += 1;
  }

  process.stdout.write(
    `\n${pc.green('✔')} Covers ready — ${created} generated, ${skipped} already existed.\n` +
      `${pc.dim('Generated covers are placeholders. Replace any of them with a real screenshot at 1200×630 whenever you have one.')}\n\n`,
  );
}

main().catch((error) => {
  process.stderr.write(`${pc.red('Cover generation failed:')} ${String(error)}\n`);
  process.exitCode = 1;
});
