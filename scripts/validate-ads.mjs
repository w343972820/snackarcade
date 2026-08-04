#!/usr/bin/env node
/**
 * Ad-state validator — the automated proof behind "ads off means zero ad code".
 *
 * Runs against `dist/` after a build. Two modes, decided by whether the build
 * actually rendered any ads:
 *
 *   ADS OFF  → every known ad token must be absent from the output. One hit
 *              fails the build, with the file and the line printed.
 *   ADS ON   → the AdSense tag must be present, ads.txt must contain a real
 *              seller line, and no page may exceed the per-page ad cap.
 *
 * Run it directly with:  node scripts/validate-ads.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

import pc from 'picocolors';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');
const ADS_CONFIG = path.join(ROOT, 'src', 'config', 'ads.ts');

/**
 * Strings that can only come from ad code. If ads are off and any of these
 * appears anywhere in dist/, something leaked.
 *
 * `pagead2` and `adsbygoogle` are the two the acceptance test greps for; the
 * rest are here because they leak from the same places.
 */
const AD_TOKENS = [
  'adsbygoogle',
  'pagead2',
  'googlesyndication',
  'doubleclick.net',
  'scripts.mediavine.com',
  'data-ad-client',
  'data-mediavine-placement',
];

/** File extensions worth scanning. Images cannot contain ad script. */
const SCANNED_EXTENSIONS = new Set(['.html', '.js', '.mjs', '.css', '.json', '.txt', '.xml']);

/**
 * Read the delivered value of the master switch straight from the source file,
 * so this script does not need to import Astro's env plumbing.
 * @returns {boolean}
 */
function readEnabledFromSource() {
  const envSwitch = (process.env.PUBLIC_ADS_ENABLED ?? '').trim().toLowerCase();
  if (envSwitch === 'true') return true;
  if (envSwitch === 'false') return false;

  if (!fs.existsSync(ADS_CONFIG)) return false;
  const text = fs.readFileSync(ADS_CONFIG, 'utf8');
  const match = text.match(/const\s+ENABLED_IN_CODE\s*=\s*(true|false)/);
  return match !== null && match[1] === 'true';
}

/**
 * Whether credentials exist for the configured network.
 * @returns {boolean}
 */
function hasCredentials() {
  const pubId = (process.env.PUBLIC_ADSENSE_PUB_ID ?? '').trim();
  const mvId = (process.env.PUBLIC_MEDIAVINE_SITE_ID ?? '').trim();
  return /^ca-pub-\d{16}$/.test(pubId) || /^[a-z0-9-]{3,64}$/i.test(mvId);
}

/**
 * Recursively list files under a directory.
 * @param {string} dir
 * @returns {string[]}
 */
function walk(dir) {
  /** @type {string[]} */
  const found = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      found.push(...walk(full));
    } else {
      found.push(full);
    }
  }
  return found;
}

/**
 * Find every ad token occurrence in the built output.
 * @param {string[]} files
 * @returns {{file: string, token: string, line: number, excerpt: string}[]}
 */
function findAdTokens(files) {
  /** @type {{file: string, token: string, line: number, excerpt: string}[]} */
  const hits = [];

  for (const file of files) {
    if (!SCANNED_EXTENSIONS.has(path.extname(file).toLowerCase())) continue;

    const text = fs.readFileSync(file, 'utf8');
    const lower = text.toLowerCase();

    for (const token of AD_TOKENS) {
      if (!lower.includes(token)) continue;

      const lines = text.split(/\r?\n/);
      for (let index = 0; index < lines.length; index += 1) {
        const line = lines[index];
        if (!line.toLowerCase().includes(token)) continue;
        hits.push({
          file: path.relative(ROOT, file).replace(/\\/g, '/'),
          token,
          line: index + 1,
          excerpt: line.trim().slice(0, 140),
        });
        break;
      }
    }
  }

  return hits;
}

/**
 * Count ad slots on each HTML page.
 * @param {string[]} files
 * @returns {{file: string, count: number}[]}
 */
function countSlotsPerPage(files) {
  return files
    .filter((file) => file.endsWith('.html'))
    .map((file) => {
      const text = fs.readFileSync(file, 'utf8');
      const matches = text.match(/data-ad-placement=/g);
      return {
        file: path.relative(ROOT, file).replace(/\\/g, '/'),
        count: matches === null ? 0 : matches.length,
      };
    })
    .filter((entry) => entry.count > 0);
}

/**
 * Read the per-page cap out of the config source.
 * @returns {number}
 */
function readMaxPerPage() {
  if (!fs.existsSync(ADS_CONFIG)) return 3;
  const text = fs.readFileSync(ADS_CONFIG, 'utf8');
  const match = text.match(/maxPerPage\s*:\s*(\d+)/);
  return match === null ? 3 : Number(match[1]);
}

function main() {
  if (!fs.existsSync(DIST)) {
    process.stdout.write(
      `${pc.yellow('No dist/ folder found. Run `npm run build` first, then this check.')}\n`,
    );
    process.exitCode = 1;
    return;
  }

  const enabled = readEnabledFromSource();
  const credentials = hasCredentials();
  const shouldRender = enabled && credentials;

  const files = walk(DIST);

  process.stdout.write(`\n${pc.bold('Ad output check')}\n`);
  process.stdout.write(`  master switch:  ${enabled ? pc.yellow('ON') : pc.green('OFF')}\n`);
  process.stdout.write(`  credentials:    ${credentials ? 'configured' : 'not configured'}\n`);
  process.stdout.write(`  expectation:    ${shouldRender ? 'ad code present' : 'NO ad code at all'}\n\n`);

  const hits = findAdTokens(files);

  /* ---------------- Ads OFF: nothing may leak ---------------- */
  if (!shouldRender) {
    if (hits.length === 0) {
      process.stdout.write(
        `  ${pc.green('✔')} ${files.length} files scanned, zero ad tokens found.\n` +
          `  ${pc.dim('The delivered site contains no advertising code of any kind.')}\n\n`,
      );
      return;
    }

    process.stdout.write(`${pc.red('✖ Ads are switched off, but ad code reached the build.')}\n\n`);
    for (const hit of hits) {
      process.stdout.write(`  ${hit.file}:${hit.line}  →  "${hit.token}"\n`);
      process.stdout.write(`    ${pc.dim(hit.excerpt)}\n`);
    }
    process.stdout.write(
      `\n${pc.green('fix:')} every ad tag must be rendered behind \`adsActive()\`.\n` +
        '      Check that the component wraps its markup in a conditional rather than\n' +
        '      hiding it with CSS, and that any script uses `is:inline` so it is not\n' +
        '      bundled independently of whether it rendered.\n\n',
    );
    process.exitCode = 1;
    return;
  }

  /* ---------------- Ads ON: the code must be correct ---------------- */
  /** @type {string[]} */
  const problems = [];

  const hasTag = hits.some((hit) => hit.token === 'pagead2' || hit.token === 'scripts.mediavine.com');
  if (!hasTag) {
    problems.push(
      'Ads are on but no network tag was found in the output. Check that PUBLIC_ADSENSE_PUB_ID ' +
        'in .env is exactly "ca-pub-" followed by 16 digits — a malformed ID is ignored on purpose.',
    );
  }

  const adsTxt = path.join(DIST, 'ads.txt');
  if (!fs.existsSync(adsTxt)) {
    problems.push('dist/ads.txt is missing. Google checks for it and its absence blocks ad serving.');
  } else {
    const body = fs.readFileSync(adsTxt, 'utf8');
    const hasSeller = /^google\.com,\s*pub-\d{16},\s*DIRECT/m.test(body);
    if (!hasSeller) {
      problems.push(
        'dist/ads.txt has no seller line. Set PUBLIC_ADSENSE_PUB_ID in .env and rebuild, ' +
          'otherwise Google treats every impression on this domain as unauthorised.',
      );
    }
  }

  const maxPerPage = readMaxPerPage();
  const overloaded = countSlotsPerPage(files).filter((entry) => entry.count > maxPerPage);
  for (const entry of overloaded) {
    problems.push(
      `${entry.file} renders ${entry.count} ads but the cap is ${maxPerPage}. ` +
        'Remove a slot from the layout — a page dense with ads is judged low value.',
    );
  }

  if (problems.length === 0) {
    process.stdout.write(`  ${pc.green('✔')} Ad markup looks correct.\n\n`);
    return;
  }

  process.stdout.write(`${pc.red('✖ Ads are on but the output has problems.')}\n\n`);
  for (const problem of problems) {
    process.stdout.write(`  • ${problem}\n`);
  }
  process.stdout.write('\n');
  process.exitCode = 1;
}

main();
