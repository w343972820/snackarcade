#!/usr/bin/env node
/**
 * Interactive game scaffold — `npm run new:game`.
 *
 * Asks a handful of questions, then creates a draft page from
 * templates/game.template.md with the mechanical fields already filled in
 * (slug, bundle file count, bundle size, today's date).
 *
 * The page is created with `draft: true`, so nothing goes live until the owner
 * has replaced the placeholder text and flipped that flag.
 */
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

import pc from 'picocolors';
import prompts from 'prompts';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TEMPLATE = path.join(ROOT, 'templates', 'game.template.md');
const GAMES_DIR = path.join(ROOT, 'src', 'content', 'games');
const CATEGORIES_DIR = path.join(ROOT, 'src', 'content', 'categories');
const GAMES_SRC = path.join(ROOT, 'games-src');
const MANIFEST = path.join(GAMES_SRC, 'manifest.json');

/** Kept identical to scripts/validate-content.mjs and sync-local-games.mjs. */
const EXCLUDED_ENTRIES = new Set([
  '.git',
  '.github',
  '.gitignore',
  '.quadnix',
  'node_modules',
  'manifest.json',
  'README.md',
  'CONTRIBUTING.md',
  'Rakefile',
  '.jshintrc',
]);

/** Trademarked names that must never become a game title. */
const TRADEMARKS = ['tetris', 'wordle', 'connect four', 'picross', 'pac-man', 'pacman', 'super mario', 'pokemon', 'minecraft'];

/**
 * Convert a display name into a URL-safe slug.
 * @param {string} value
 * @returns {string}
 */
function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Count files and bytes in a bundle folder.
 * @param {string} dir
 * @returns {{fileCount: number, bytes: number}}
 */
function measureBundle(dir) {
  let fileCount = 0;
  let bytes = 0;

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (EXCLUDED_ENTRIES.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      const inner = measureBundle(full);
      fileCount += inner.fileCount;
      bytes += inner.bytes;
    } else {
      fileCount += 1;
      bytes += fs.statSync(full).size;
    }
  }

  return { fileCount, bytes };
}

/** @returns {string[]} */
function availableCategories() {
  if (!fs.existsSync(CATEGORIES_DIR)) return [];
  return fs
    .readdirSync(CATEGORIES_DIR)
    .filter((name) => name.endsWith('.md'))
    .map((name) => name.replace(/\.md$/, ''))
    .sort();
}

/** @returns {string} Today as YYYY-MM-DD. */
function today() {
  return new Date().toISOString().slice(0, 10);
}

async function main() {
  if (!fs.existsSync(TEMPLATE)) {
    process.stderr.write(`${pc.red('templates/game.template.md is missing.')}\n`);
    process.exitCode = 1;
    return;
  }

  const categories = availableCategories();
  if (categories.length === 0) {
    process.stderr.write(
      `${pc.red('No categories found.')} Add at least one file to src/content/categories/ first.\n`,
    );
    process.exitCode = 1;
    return;
  }

  process.stdout.write(`\n${pc.bold('Add a new game')}\n`);
  process.stdout.write(
    `${pc.dim('This creates a draft page. Nothing goes live until you set draft: false.')}\n\n`,
  );

  const answers = await prompts(
    [
      {
        type: 'text',
        name: 'title',
        message: 'Game name as visitors will see it',
        validate: (value) => {
          const trimmed = String(value).trim();
          if (trimmed.length < 2) return 'Please enter at least 2 characters.';
          if (trimmed.length > 60) return 'Keep the display name to 60 characters or fewer.';
          const hit = TRADEMARKS.find((tm) => trimmed.toLowerCase().includes(tm));
          if (hit) {
            return `"${hit}" is a registered trademark and cannot be used as a game name. Pick your own name — for example Block Drop instead of Tetris.`;
          }
          return true;
        },
      },
      {
        type: 'text',
        name: 'slug',
        message: 'URL slug',
        initial: (prev) => slugify(String(prev)),
        validate: (value) => {
          const slug = String(value).trim();
          if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
            return 'Use lowercase letters, numbers and hyphens only, e.g. block-drop.';
          }
          if (fs.existsSync(path.join(GAMES_DIR, `${slug}.md`))) {
            return `src/content/games/${slug}.md already exists. Pick a different slug.`;
          }
          const hit = TRADEMARKS.find((tm) => slug.includes(tm.replace(/\s+/g, '-')));
          if (hit) return `"${hit}" is a trademark and must not appear in the URL.`;
          return true;
        },
      },
      {
        type: 'select',
        name: 'primaryCategory',
        message: 'Main category',
        choices: categories.map((id) => ({ title: id, value: id })),
      },
      {
        type: 'select',
        name: 'sourceType',
        message: 'Where does the game come from?',
        choices: [
          { title: 'Self-hosted — files are in games-src/', value: 'self_hosted' },
          { title: 'Iframe — embedded from a partner platform', value: 'iframe' },
        ],
      },
      {
        type: 'text',
        name: 'developer',
        message: 'Original developer name',
        validate: (value) => (String(value).trim().length >= 2 ? true : 'Required — credit the author.'),
      },
      {
        type: 'text',
        name: 'sourceUrl',
        message: 'Original repository or download page URL',
        validate: (value) =>
          /^https?:\/\//.test(String(value).trim()) ? true : 'Must start with https://',
      },
      {
        type: 'text',
        name: 'licenseUrl',
        message: 'Direct URL to the LICENSE file',
        validate: (value) =>
          /^https?:\/\//.test(String(value).trim()) ? true : 'Must start with https://',
      },
    ],
    {
      onCancel: () => {
        process.stdout.write(`\n${pc.yellow('Cancelled — nothing was created.')}\n`);
        process.exit(0);
      },
    },
  );

  const slug = String(answers.slug).trim();
  const bundleDir = path.join(GAMES_SRC, slug);

  let fileCount = 0;
  let bytes = 0;

  if (answers.sourceType === 'self_hosted') {
    if (!fs.existsSync(bundleDir)) {
      process.stdout.write(
        `\n${pc.yellow('Heads up:')} games-src/${slug}/ does not exist yet.\n` +
          `${pc.dim(`Download the game into that folder, keep its LICENSE file, then run \`npm run build\` — it will tell you the exact file count and size to fill in.`)}\n`,
      );
    } else {
      const measured = measureBundle(bundleDir);
      fileCount = measured.fileCount;
      bytes = measured.bytes;
      process.stdout.write(
        `\n${pc.green('Measured')} games-src/${slug}/ — ${fileCount} files, ${bytes} bytes.\n`,
      );
    }
  }

  const replacements = {
    '{{TITLE}}': String(answers.title).trim(),
    '{{SLUG}}': slug,
    '{{PRIMARY_CATEGORY}}': String(answers.primaryCategory),
    '{{DEVELOPER}}': String(answers.developer).trim(),
    '{{SOURCE_URL}}': String(answers.sourceUrl).trim(),
    '{{LICENSE_URL}}': String(answers.licenseUrl).trim(),
    '{{AUTHOR_URL}}': String(answers.sourceUrl).trim(),
    '{{BUNDLE_FILE_COUNT}}': String(fileCount),
    '{{BUNDLE_BYTES}}': String(bytes),
    '{{TODAY}}': today(),
  };

  let output = fs.readFileSync(TEMPLATE, 'utf8');
  for (const [needle, value] of Object.entries(replacements)) {
    output = output.split(needle).join(value);
  }

  fs.mkdirSync(GAMES_DIR, { recursive: true });
  const target = path.join(GAMES_DIR, `${slug}.md`);
  fs.writeFileSync(target, output, 'utf8');

  appendToManifest(slug, answers, fileCount, bytes);

  process.stdout.write(`\n${pc.green('✔')} Created src/content/games/${slug}.md\n\n`);
  process.stdout.write(`${pc.bold('Next steps')}\n`);
  process.stdout.write(`  1. Open the file and replace every {{PLACEHOLDER}} with real text.\n`);
  process.stdout.write(`  2. Run ${pc.bold('npm run gen:covers')} to create a cover image.\n`);
  process.stdout.write(`  3. Run ${pc.bold('npm run dev')} and check the page at /games/${slug}/\n`);
  process.stdout.write(`  4. Change ${pc.bold('draft: true')} to ${pc.bold('draft: false')} when you are happy.\n`);
  process.stdout.write(`  5. Run ${pc.bold('npm run build')} — it will list anything still missing.\n\n`);
}

/**
 * Record the new game in the licence manifest so the legal audit trail stays
 * complete even if the owner forgets.
 * @param {string} slug
 * @param {Record<string, unknown>} answers
 * @param {number} fileCount
 * @param {number} bytes
 */
function appendToManifest(slug, answers, fileCount, bytes) {
  if (answers.sourceType !== 'self_hosted') return;

  /** @type {{version: number, updatedAt: string, games: Record<string, unknown>[]}} */
  let manifest = { version: 1, updatedAt: today(), games: [] };

  if (fs.existsSync(MANIFEST)) {
    try {
      manifest = JSON.parse(fs.readFileSync(MANIFEST, 'utf8'));
    } catch {
      process.stdout.write(
        `${pc.yellow('games-src/manifest.json could not be read, so it was not updated. Add the entry by hand.')}\n`,
      );
      return;
    }
  }

  manifest.games = Array.isArray(manifest.games) ? manifest.games : [];
  if (manifest.games.some((game) => game.slug === slug)) return;

  manifest.games.push({
    slug,
    title: String(answers.title).trim(),
    originalTitle: String(answers.title).trim(),
    renamed: false,
    entryFile: 'index.html',
    upstream: {
      repository: String(answers.sourceUrl).trim(),
      commitRef: 'main',
      downloadedAt: today(),
    },
    license: {
      spdx: 'MIT',
      file: 'LICENSE',
      url: String(answers.licenseUrl).trim(),
      author: String(answers.developer).trim(),
      authorUrl: String(answers.sourceUrl).trim(),
      assetsLicense: 'same as code license',
      attributionRendered: `${String(answers.title).trim()} by ${String(answers.developer).trim()} · MIT License`,
      verifiedAt: today(),
    },
    modifications: [],
    bundle: { fileCount, bytes },
    trademarkRisk: 'none',
    trademarkNote: '',
  });

  manifest.updatedAt = today();
  fs.writeFileSync(MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
  process.stdout.write(`${pc.green('✔')} Recorded in games-src/manifest.json\n`);
}

main().catch((error) => {
  process.stderr.write(`${pc.red('Failed:')} ${String(error)}\n`);
  process.exitCode = 1;
});
