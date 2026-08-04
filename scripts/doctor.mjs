#!/usr/bin/env node
/**
 * Health check — `npm run doctor`.
 *
 * Answers the question "is anything wrong with my setup?" without requiring the
 * person asking to understand any of the answers. Run it when something feels
 * broken and before asking anyone for help.
 */
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

import pc from 'picocolors';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/** @type {{label: string, ok: boolean, detail: string}[]} */
const results = [];

/**
 * Record one check result.
 * @param {string} label
 * @param {boolean} ok
 * @param {string} detail
 */
function check(label, ok, detail) {
  results.push({ label, ok, detail });
}

/** Node version must be in the range Astro 7 supports. */
function checkNode() {
  const major = Number(process.versions.node.split('.')[0]);
  check(
    'Node.js version',
    major >= 20,
    major >= 20
      ? `v${process.versions.node}`
      : `v${process.versions.node} is too old. Install Node 22 from nodejs.org and try again.`,
  );
}

/** node_modules must exist or nothing will run. */
function checkInstall() {
  const exists = fs.existsSync(path.join(ROOT, 'node_modules', 'astro'));
  check(
    'Dependencies installed',
    exists,
    exists ? 'node_modules looks complete' : 'Run `npm install` first.',
  );
}

/** Report which mode games will be served from. */
function checkGameMode() {
  const origin = process.env.PUBLIC_GAME_ORIGIN ?? '';
  if (origin.trim() === '') {
    check(
      'Game hosting mode',
      true,
      'LOCAL — games are served from this project. No cloud account needed.',
    );
  } else {
    check('Game hosting mode', true, `REMOTE — games served from ${origin}`);
  }
}

/** Count game bundles and content pages, and flag a mismatch. */
function checkContent() {
  const gamesSrc = path.join(ROOT, 'games-src');
  const contentDir = path.join(ROOT, 'src', 'content', 'games');

  const bundles = fs.existsSync(gamesSrc)
    ? fs
        .readdirSync(gamesSrc, { withFileTypes: true })
        .filter((entry) => entry.isDirectory() && !entry.name.startsWith('_'))
        .map((entry) => entry.name)
    : [];

  const pages = fs.existsSync(contentDir)
    ? fs
        .readdirSync(contentDir)
        .filter((name) => name.endsWith('.md'))
        .map((name) => name.replace(/\.md$/, ''))
    : [];

  check('Game bundles', bundles.length > 0, `${bundles.length} in games-src/`);
  check('Game pages', pages.length > 0, `${pages.length} in src/content/games/`);

  const orphanBundles = bundles.filter((slug) => !pages.includes(slug));
  if (orphanBundles.length > 0) {
    check(
      'Bundles with no page',
      false,
      `${orphanBundles.join(', ')} — these games are downloaded but have no page, so nobody can find them. Run \`npm run new:game\` to add one.`,
    );
  }

  const orphanPages = pages.filter((slug) => !bundles.includes(slug));
  if (orphanPages.length > 0) {
    check(
      'Pages with no bundle',
      true,
      `${orphanPages.join(', ')} — fine if these are iframe games.`,
    );
  }
}

/** Ads must default to off, and the switch must be findable. */
function checkAds() {
  const adsConfig = path.join(ROOT, 'src', 'config', 'ads.ts');
  if (!fs.existsSync(adsConfig)) {
    check('Ads configuration', false, 'src/config/ads.ts is missing.');
    return;
  }

  const text = fs.readFileSync(adsConfig, 'utf8');
  const enabled = /enabled\s*:\s*true/.test(text);
  check(
    'Ads',
    true,
    enabled
      ? 'ON — ad code will be included in the build.'
      : 'OFF — no ad code goes into the build at all. Turn on in src/config/ads.ts once AdSense approves you.',
  );
}

/** A placeholder domain in production produces wrong canonical URLs. */
function checkSiteUrl() {
  const url = process.env.PUBLIC_SITE_URL ?? '';
  if (url.trim() === '') {
    check(
      'Site URL',
      true,
      'Using the default https://snackarcade.com. Set PUBLIC_SITE_URL in .env once you own the real domain.',
    );
  } else {
    check('Site URL', /^https:\/\//.test(url), url);
  }
}

/** .env.example should exist so the owner knows what is configurable. */
function checkEnvExample() {
  const exists = fs.existsSync(path.join(ROOT, '.env.example'));
  check('.env.example', exists, exists ? 'present' : 'missing — copy it from the repository.');
}

/**
 * The "Most Played" leaderboard is driven by a manual GA4 export in
 * src/content/data/popular.json. Informational only (never fails the doctor):
 * the site itself already hides the section when the data is missing/expired.
 */
function checkPopularLeaderboard() {
  const file = path.join(ROOT, 'src', 'content', 'data', 'popular.json');
  if (!fs.existsSync(file)) {
    check(
      'Most Played leaderboard',
      true,
      'No popular.json yet — the Most Played section stays hidden until real GA4 data is exported. See docs/CONTENT-SOP.md.',
    );
    return;
  }

  try {
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    const entries = Array.isArray(data.entries) ? data.entries.length : 0;
    const exportedAt = String(data.exportedAt ?? '');
    const time = Date.parse(`${exportedAt}T00:00:00Z`);
    const days = Number.isFinite(time)
      ? Math.floor((Date.now() - time) / 86_400_000)
      : Number.NaN;

    if (entries === 0) {
      check(
        'Most Played leaderboard',
        true,
        `popular.json has 0 entries — the section stays hidden (honest circuit breaker). Export GA4 data to fill it.`,
      );
    } else if (!Number.isFinite(days) || days > 60) {
      check(
        'Most Played leaderboard',
        true,
        `popular.json is stale (exported ${exportedAt}). Data older than 60 days is treated as missing — export a fresh GA4 report and update the file. See docs/CONTENT-SOP.md.`,
      );
    } else {
      check(
        'Most Played leaderboard',
        true,
        `popular.json has ${entries} entr${entries === 1 ? 'y' : 'ies'} exported ${exportedAt} (${days} day${days === 1 ? '' : 's'} ago).`,
      );
    }
  } catch (error) {
    check(
      'Most Played leaderboard',
      true,
      `popular.json is not valid JSON (${String(error)}) — the section stays hidden.`,
    );
  }
}

function main() {
  process.stdout.write(`\n${pc.bold('SnackArcade health check')}\n\n`);

  checkNode();
  checkInstall();
  checkSiteUrl();
  checkGameMode();
  checkContent();
  checkAds();
  checkEnvExample();
  checkPopularLeaderboard();

  let failures = 0;
  for (const result of results) {
    const icon = result.ok ? pc.green('✔') : pc.red('✖');
    if (!result.ok) failures += 1;
    process.stdout.write(`  ${icon} ${result.label.padEnd(22)} ${pc.dim(result.detail)}\n`);
  }

  if (failures === 0) {
    process.stdout.write(`\n${pc.green('Everything looks fine.')}\n\n`);
  } else {
    process.stdout.write(
      `\n${pc.yellow(`${failures} thing(s) need attention — see the lines marked ✖ above.`)}\n\n`,
    );
    process.exitCode = 1;
  }
}

main();
