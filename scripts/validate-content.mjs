#!/usr/bin/env node
/**
 * Content validator — runs automatically before every build (`npm run build`).
 *
 * The Zod schema in src/content.config.ts already checks the shape of each
 * file. This script checks the things Zod cannot see: the licence blacklist,
 * trademark leakage into user-facing text, bundle sizes drifting out of date,
 * missing cover images and tags that point at nothing.
 *
 * Design rule for every message in this file: name the file, name the field,
 * state the requirement, and say what to do about it. The person reading it
 * six months from now is not a developer.
 */
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

import matter from 'gray-matter';
import pc from 'picocolors';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const GAMES_DIR = path.join(ROOT, 'src', 'content', 'games');
const CATEGORIES_DIR = path.join(ROOT, 'src', 'content', 'categories');
const TAGS_FILE = path.join(ROOT, 'src', 'content', 'data', 'tags.json');
const ASSETS_DIR = path.join(ROOT, 'src', 'assets', 'games');
const GAMES_SRC = path.join(ROOT, 'games-src');
const MANIFEST = path.join(GAMES_SRC, 'manifest.json');

/* ============================================================================
   Licence rules
   ========================================================================== */

/** Licences that permit commercial use on an ad-supported site. */
const ALLOWED_LICENSES = new Set([
  'MIT',
  'Apache-2.0',
  'BSD-2-Clause',
  'BSD-3-Clause',
  'CC0-1.0',
  'CC-BY-4.0',
  'Unlicense',
  'ISC',
  'Zlib',
  'platform-licensed',
  'author-permission',
]);

/**
 * Licences that must never appear, with the reason written for a non-lawyer.
 * Matched case-insensitively against the start of the licence string.
 */
const FORBIDDEN_LICENSES = [
  {
    match: /^A?GPL/i,
    why: 'GPL and AGPL are copyleft licences. Publishing this game would legally oblige you to release the whole site under the same licence.',
  },
  {
    match: /(^|[-\s])NC([-\s]|$)|NonCommercial/i,
    why: 'The NC (NonCommercial) clause forbids use on a site that shows ads. This site shows ads, so it cannot be used.',
  },
  {
    match: /(^|[-\s])ND([-\s]|$)|NoDerivatives/i,
    why: 'The ND (NoDerivatives) clause forbids modified versions. Hosting a game normally requires small changes, so this licence is unsafe.',
  },
  {
    match: /^CC-BY-SA/i,
    why: 'CC BY-SA is share-alike, which would require the pages around the game to carry the same licence.',
  },
  {
    match: /^(unknown|unlicensed|none|n\/a|tbd)$/i,
    why: 'A game with no confirmed licence cannot be published. Find the LICENSE file in the original repository, or remove the game.',
  },
];

/* ============================================================================
   Trademark rules
   ========================================================================== */

/**
 * Trademarked names that must never appear in text a visitor or Google can
 * see. Naming a game after somebody else's trademark is the single fastest way
 * to receive a legal letter, and no open-source licence grants trademark rights.
 *
 * Attribution is deliberately exempt: linking to the original repository is
 * required by the MIT licence and is normal, lawful nominative use. Only
 * branding surfaces are checked.
 */
const TRADEMARKS = [
  { word: 'tetris', useInstead: 'Block Drop', owner: 'Tetris Holding, LLC' },
  { word: 'wordle', useInstead: 'Five Letters', owner: 'The New York Times Company' },
  { word: 'connect four', useInstead: 'Four in a Row', owner: 'Hasbro' },
  { word: 'picross', useInstead: 'Nonogram', owner: 'Nintendo' },
  { word: 'pac-man', useInstead: 'a different original name', owner: 'Bandai Namco' },
  { word: 'pacman', useInstead: 'a different original name', owner: 'Bandai Namco' },
  { word: 'super mario', useInstead: 'a different original name', owner: 'Nintendo' },
  { word: 'pokemon', useInstead: 'a different original name', owner: 'Nintendo' },
  { word: 'minecraft', useInstead: 'a different original name', owner: 'Mojang / Microsoft' },
];

/** Frontmatter fields that a visitor or Google actually reads. */
const BRANDING_FIELDS = [
  'title',
  'h1',
  'seo.title',
  'seo.description',
  'seo.targetKeywords',
  'media.coverAlt',
  'content.intro',
  'content.about',
  'content.howToPlay',
  'content.controls',
  'content.tips',
  'content.features',
  'content.faq',
  'info.genre',
];

/* ============================================================================
   Reporting
   ========================================================================== */

/** @type {{file: string, field: string, message: string, fix: string}[]} */
const problems = [];

/**
 * Record a build-stopping problem.
 * @param {string} file Path shown to the user, relative to the project root.
 * @param {string} field The frontmatter field at fault, or a short area name.
 * @param {string} message What is wrong, in plain language.
 * @param {string} fix What to actually do about it.
 */
function fail(file, field, message, fix) {
  problems.push({ file, field, message, fix });
}

/** @type {string[]} */
const warnings = [];

/**
 * Record something worth knowing that should not stop the build.
 * @param {string} message Plain-language note.
 */
function warn(message) {
  warnings.push(message);
}

/* ============================================================================
   Helpers
   ========================================================================== */

/** Files and folders that never ship inside a game bundle. */
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

/**
 * Count files and total bytes in a bundle, using exactly the same exclusion
 * rules as scripts/sync-local-games.mjs so the two can never disagree.
 * @param {string} dir Absolute path to the bundle folder.
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

/**
 * Flatten any frontmatter value into searchable strings.
 * @param {unknown} value
 * @returns {string[]}
 */
function collectStrings(value) {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(collectStrings);
  if (value !== null && typeof value === 'object') {
    return Object.values(value).flatMap(collectStrings);
  }
  return [];
}

/**
 * Read a nested field such as `seo.title` from an object.
 * @param {Record<string, unknown>} data
 * @param {string} dotted
 * @returns {unknown}
 */
function readField(data, dotted) {
  /** @type {unknown} */
  let current = data;
  for (const part of dotted.split('.')) {
    if (current === null || typeof current !== 'object') return undefined;
    current = /** @type {Record<string, unknown>} */ (current)[part];
  }
  return current;
}

/**
 * List markdown files in a directory, or an empty array if it does not exist.
 * @param {string} dir
 * @returns {string[]}
 */
function listMarkdown(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((name) => name.endsWith('.md'))
    .sort();
}

/* ============================================================================
   Checks
   ========================================================================== */

/**
 * Validate every file in src/content/games.
 * @param {Set<string>} knownTagIds
 * @param {Set<string>} knownCategoryIds
 * @param {Map<string, Record<string, unknown>>} manifestBySlug
 */
function checkGames(knownTagIds, knownCategoryIds, manifestBySlug) {
  const files = listMarkdown(GAMES_DIR);

  if (files.length === 0) {
    warn('No games found in src/content/games/. Run `npm run new:game` to add one.');
    return;
  }

  for (const fileName of files) {
    const slug = fileName.replace(/\.md$/, '');
    const rel = `src/content/games/${fileName}`;
    const raw = fs.readFileSync(path.join(GAMES_DIR, fileName), 'utf8');

    /** @type {{data: Record<string, any>, content: string}} */
    let parsed;
    try {
      parsed = matter(raw);
    } catch (error) {
      fail(
        rel,
        'frontmatter',
        `The settings block at the top of this file could not be read: ${String(error)}`,
        'Check that the file starts with --- on line 1, ends the block with another --- line, and that every value with a colon in it is wrapped in quotes.',
      );
      continue;
    }

    const data = parsed.data;

    /* ---- Licence ------------------------------------------------------- */
    const licence = String(data?.license?.license ?? '').trim();

    if (licence === '') {
      fail(
        rel,
        'license.license',
        'This game has no licence recorded.',
        `Open the game's original repository, find its LICENSE file, and put the licence name here. Allowed values: ${[...ALLOWED_LICENSES].join(', ')}.`,
      );
    } else {
      const forbidden = FORBIDDEN_LICENSES.find((rule) => rule.match.test(licence));
      if (forbidden) {
        fail(
          rel,
          'license.license',
          `The licence "${licence}" cannot be used on this site. ${forbidden.why}`,
          'Remove this game, or replace it with one under MIT, Apache-2.0, BSD, ISC, Zlib, CC0 or CC BY. If the author has given you written permission instead, set the licence to "author-permission" and fill in license.permissionEmail.',
        );
      } else if (!ALLOWED_LICENSES.has(licence)) {
        fail(
          rel,
          'license.license',
          `"${licence}" is not a licence this site recognises.`,
          `Use one of: ${[...ALLOWED_LICENSES].join(', ')}. If the real licence is genuinely something else, check with a lawyer before adding it — do not simply add it to the allowed list.`,
        );
      }
    }

    if (licence === 'author-permission' && !data?.license?.permissionEmail) {
      fail(
        rel,
        'license.permissionEmail',
        'The licence is "author-permission" but no email address is recorded.',
        'Add the email address the author granted permission from. It is your only evidence if the permission is ever questioned.',
      );
    }

    /* ---- Trademarks in user-facing text -------------------------------- */
    const brandingText = BRANDING_FIELDS.flatMap((field) =>
      collectStrings(readField(data, field)),
    )
      .concat([slug, parsed.content])
      .join('\n')
      .toLowerCase();

    for (const tm of TRADEMARKS) {
      if (brandingText.includes(tm.word)) {
        fail(
          rel,
          'title / h1 / seo / body text',
          `The word "${tm.word}" appears in text that visitors and Google can see. "${tm.word}" is a registered trademark of ${tm.owner}, and an open-source code licence never grants the right to use a trademark.`,
          `Rename it to "${tm.useInstead}" everywhere in this file, including the title, h1, seo.title, seo.description, keywords and body text. Linking to the original repository in license.sourceUrl is fine and is not affected by this check.`,
        );
      }
    }

    /* ---- Cover image ---------------------------------------------------- */
    const coverRef = typeof data?.media?.cover === 'string' ? data.media.cover : '';
    if (coverRef !== '') {
      const coverPath = path.resolve(GAMES_DIR, coverRef);
      if (!fs.existsSync(coverPath)) {
        fail(
          rel,
          'media.cover',
          `The cover image "${coverRef}" does not exist.`,
          `Put a 1200×630 PNG or JPG at src/assets/games/${slug}/cover.png, or run \`npm run gen:covers\` to generate a placeholder cover for every game that is missing one.`,
        );
      }
    }

    /* ---- Taxonomy references ------------------------------------------- */
    const primary = data?.taxonomy?.primaryCategory;
    if (typeof primary === 'string' && !knownCategoryIds.has(primary)) {
      fail(
        rel,
        'taxonomy.primaryCategory',
        `The category "${primary}" does not exist.`,
        `Use one of: ${[...knownCategoryIds].sort().join(', ')}. Category files live in src/content/categories/.`,
      );
    }

    for (const cat of Array.isArray(data?.taxonomy?.categories) ? data.taxonomy.categories : []) {
      if (typeof cat === 'string' && !knownCategoryIds.has(cat)) {
        fail(
          rel,
          'taxonomy.categories',
          `The category "${cat}" does not exist.`,
          `Use one of: ${[...knownCategoryIds].sort().join(', ')}.`,
        );
      }
    }

    for (const tag of Array.isArray(data?.taxonomy?.tags) ? data.taxonomy.tags : []) {
      if (typeof tag === 'string' && !knownTagIds.has(tag)) {
        fail(
          rel,
          'taxonomy.tags',
          `The tag "${tag}" is not defined, so it would link to a page that does not exist.`,
          `Either use an existing tag, or add "${tag}" to src/content/data/tags.json with a name and a description of at least 40 characters.`,
        );
      }
    }

    /* ---- Self-hosted bundle -------------------------------------------- */
    if (data?.source?.sourceType === 'self_hosted') {
      const bundlePath = String(data.source.bundlePath ?? '');
      const absBundle = path.join(ROOT, bundlePath);

      if (bundlePath === '' || !fs.existsSync(absBundle)) {
        fail(
          rel,
          'source.bundlePath',
          `The game folder "${bundlePath}" does not exist, so there is nothing for visitors to play.`,
          `Download the game into games-src/${slug}/ and make sure source.bundlePath says "games-src/${slug}".`,
        );
      } else {
        const entryFile = String(data.source.entryFile ?? 'index.html');
        if (!fs.existsSync(path.join(absBundle, entryFile))) {
          fail(
            rel,
            'source.entryFile',
            `"${bundlePath}/${entryFile}" is missing, so the game cannot start.`,
            `Check what the game's main HTML file is actually called and put that name in source.entryFile.`,
          );
        }

        const actual = measureBundle(absBundle);
        if (Number(data.source.bundleFileCount) !== actual.fileCount) {
          fail(
            rel,
            'source.bundleFileCount',
            `This says ${data.source.bundleFileCount} files but the folder actually contains ${actual.fileCount}.`,
            `Change source.bundleFileCount to ${actual.fileCount}. This number is used to check the site stays under the hosting file limit, so it has to be right.`,
          );
        }
        if (Number(data.source.bundleBytes) !== actual.bytes) {
          fail(
            rel,
            'source.bundleBytes',
            `This says ${data.source.bundleBytes} bytes but the folder is actually ${actual.bytes} bytes.`,
            `Change source.bundleBytes to ${actual.bytes}.`,
          );
        }

        if (!manifestBySlug.has(slug)) {
          fail(
            rel,
            'games-src/manifest.json',
            `This game is hosted on our own site but has no entry in games-src/manifest.json, which is the legal record of where every game came from.`,
            `Add a "${slug}" entry to games-src/manifest.json recording the source repository, the licence, the author and the date you checked it.`,
          );
        }

        const licenceFileFound = fs
          .readdirSync(absBundle)
          .some((name) => /^licen[cs]e/i.test(name));
        if (!licenceFileFound) {
          fail(
            rel,
            `${bundlePath}/LICENSE`,
            'The original LICENSE file is missing from the game folder.',
            'Nearly every open-source licence requires the licence text to travel with the code. Download the LICENSE file from the original repository and put it in this folder.',
          );
        }
      }
    }

    /* ---- Ratings honesty ------------------------------------------------ */
    const ratingCount = Number(data?.ratings?.count ?? 0);
    const ratingValue = data?.ratings?.value;
    if (ratingCount === 0 && ratingValue !== undefined && ratingValue !== null) {
      fail(
        rel,
        'ratings.value',
        'A star rating is set but the number of ratings is 0, which means the rating is not real.',
        'Publishing a star rating you do not have is structured-data fraud and Google penalises the whole site for it. Delete the ratings.value line, or set ratings.count to the real number of ratings you have collected.',
      );
    }
  }
}

/**
 * Check category files for trademark leakage and duplicate ordering.
 */
function checkCategories() {
  const files = listMarkdown(CATEGORIES_DIR);
  /** @type {Map<number, string>} */
  const seenOrder = new Map();

  for (const fileName of files) {
    const rel = `src/content/categories/${fileName}`;
    const parsed = matter(fs.readFileSync(path.join(CATEGORIES_DIR, fileName), 'utf8'));
    const haystack = (collectStrings(parsed.data).join('\n') + parsed.content).toLowerCase();

    for (const tm of TRADEMARKS) {
      if (haystack.includes(tm.word)) {
        fail(
          rel,
          'category text',
          `The word "${tm.word}" appears on this category page. It is a registered trademark of ${tm.owner}.`,
          `Replace it with "${tm.useInstead}".`,
        );
      }
    }

    const order = Number(parsed.data?.order);
    if (Number.isFinite(order)) {
      const existing = seenOrder.get(order);
      if (existing !== undefined) {
        warn(
          `Both ${existing} and ${rel} have order: ${order}. They will appear in an unpredictable order in the menu — give each category a different number.`,
        );
      } else {
        seenOrder.set(order, rel);
      }
    }
  }
}

/* ============================================================================
   Load reference data
   ========================================================================== */

/** @returns {Set<string>} */
function loadTagIds() {
  if (!fs.existsSync(TAGS_FILE)) {
    fail(
      'src/content/data/tags.json',
      'file',
      'This file is missing, so no game can reference a tag.',
      'Create src/content/data/tags.json containing an array of tags, each with id, name and description.',
    );
    return new Set();
  }

  try {
    const raw = JSON.parse(fs.readFileSync(TAGS_FILE, 'utf8'));
    return new Set(raw.map((tag) => String(tag.id)));
  } catch (error) {
    fail(
      'src/content/data/tags.json',
      'file',
      `This file is not valid JSON: ${String(error)}`,
      'A stray comma or a missing quote is the usual cause. Paste the file into jsonlint.com to find the exact line.',
    );
    return new Set();
  }
}

/** @returns {Set<string>} */
function loadCategoryIds() {
  return new Set(listMarkdown(CATEGORIES_DIR).map((name) => name.replace(/\.md$/, '')));
}

/** @returns {Map<string, Record<string, unknown>>} */
function loadManifest() {
  /** @type {Map<string, Record<string, unknown>>} */
  const bySlug = new Map();

  if (!fs.existsSync(MANIFEST)) {
    warn('games-src/manifest.json is missing. It is the legal record of where each hosted game came from.');
    return bySlug;
  }

  try {
    const raw = JSON.parse(fs.readFileSync(MANIFEST, 'utf8'));
    for (const game of raw.games ?? []) {
      bySlug.set(String(game.slug), game);
    }
  } catch (error) {
    fail(
      'games-src/manifest.json',
      'file',
      `This file is not valid JSON: ${String(error)}`,
      'Paste the file into jsonlint.com to find the exact line with the problem.',
    );
  }

  return bySlug;
}

/* ============================================================================
   Run
   ========================================================================== */

function main() {
  const knownTagIds = loadTagIds();
  const knownCategoryIds = loadCategoryIds();
  const manifestBySlug = loadManifest();

  checkGames(knownTagIds, knownCategoryIds, manifestBySlug);
  checkCategories();

  if (warnings.length > 0) {
    process.stdout.write(`\n${pc.yellow('Notes:')}\n`);
    for (const message of warnings) {
      process.stdout.write(`  ${pc.yellow('•')} ${message}\n`);
    }
  }

  if (problems.length === 0) {
    const gameCount = listMarkdown(GAMES_DIR).length;
    process.stdout.write(
      `\n${pc.green('✔')} Content check passed — ${gameCount} game page(s), ${knownCategoryIds.size} categories, ${knownTagIds.size} tags.\n\n`,
    );
    return;
  }

  process.stdout.write(
    `\n${pc.red('✖ The site was not built.')} ${problems.length} problem(s) need fixing first.\n`,
  );
  process.stdout.write(
    `${pc.dim('Nothing is broken on your live site — the build simply stopped before publishing.')}\n\n`,
  );

  problems.forEach((problem, index) => {
    process.stdout.write(`${pc.bold(pc.red(`${index + 1}.`))} ${pc.bold(problem.file)}\n`);
    process.stdout.write(`   ${pc.dim('field:')}  ${problem.field}\n`);
    process.stdout.write(`   ${pc.dim('problem:')} ${problem.message}\n`);
    process.stdout.write(`   ${pc.green('fix:')}     ${problem.fix}\n\n`);
  });

  process.stdout.write(
    `${pc.dim('When you have fixed these, run')} ${pc.bold('npm run build')} ${pc.dim('again.')}\n\n`,
  );

  process.exitCode = 1;
}

main();
