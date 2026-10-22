#!/usr/bin/env node
/**
 * Ad-state validator — the automated proof behind "the build carries exactly
 * the ad code it is supposed to carry, and no more".
 *
 * Runs against `dist/` after a build. THREE modes, decided by two independent
 * facts: whether the master switch is on, and whether a publisher ID exists.
 *
 *   A. ADS ON  (switch on, credentials present)
 *      The AdSense tag must be present, `dist/ads.txt` must contain a real
 *      seller line, and no page may exceed the per-page ad cap.
 *
 *   B. TAG ONLY  (switch off, credentials present)
 *      Every HTML page must carry EXACTLY ONE AdSense loader and ZERO ad
 *      slots. This is the state the site is delivered in: AdSense will not
 *      start a site review unless the publisher ID is visible on the page, and
 *      the ID only travels inside the loader. Ad slots stay off because empty
 *      containers on a site under review are themselves a rejection reason.
 *
 *      The zero-token assertion used by mode C cannot run here — the loader
 *      *is* an ad token by construction (`adsbygoogle`, `pagead2`,
 *      `googlesyndication`, and the `doubleclick.net` preconnect). So mode B
 *      asserts the exact shape instead: one loader, no slots.
 *
 *   C. NO CREDENTIALS  (credentials absent, switch irrelevant)
 *      Every known ad token must be absent from the output. One hit fails the
 *      build, with the file and the line printed. There is nothing to load and
 *      nothing to render, so nothing may appear.
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
 * Strings that can only come from ad code. Used by mode C, where the correct
 * number of occurrences is zero.
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

/**
 * The unique substring of the AdSense loader `<script src>`. Everything before
 * it is the host, everything after is `client=ca-pub-…`, so matching this exact
 * string both proves the loader exists and excludes look-alike URLs.
 *
 * Kept twice on purpose: `LOADER_MARKER` for messages, `LOADER_PATTERN` for
 * counting, because the `.`/`?` characters must be escaped in the regex form.
 */
const LOADER_MARKER = 'pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=';
const LOADER_PATTERN = /pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js\?client=/g;

/**
 * Markers that can only come from an actual ad SLOT. None of these appear in
 * the loader, so any hit in mode B is a real leak.
 *
 * `class="…adsbygoogle…"` is matched as a class attribute rather than a bare
 * `class="adsbygoogle"` because the slot's class list is
 * `"adsbygoogle ad-slot__inner"` — an exact-string check would silently miss
 * every slot and make this gate dead.
 */
const SLOT_MARKERS = [
  { token: 'data-ad-placement=', pattern: /data-ad-placement=/g, label: 'ad slot container' },
  {
    token: 'class="…adsbygoogle…"',
    pattern: /\bclass="[^"]*\badsbygoogle\b[^"]*"/g,
    label: 'AdSense <ins> element',
  },
  { token: 'data-ad-client=', pattern: /data-ad-client=/g, label: 'AdSense client attribute' },
  { token: 'data-mediavine-placement=', pattern: /data-mediavine-placement=/g, label: 'Mediavine slot container' },
];

/**
 * Everything under `play/` in the output is copied verbatim out of
 * `public/play/` by `sync-local-games.mjs` — one document per game plus any
 * documentation the upstream project shipped (e.g. a `README.html`).
 *
 * These are NOT site pages: they are third-party game documents with their own
 * `<title>`, their own CSS and their own favicons, and they are only ever
 * loaded inside the game iframe after a click. `/play/` is `Disallow`ed in
 * robots.txt and absent from the sitemap, so no crawler treats them as pages
 * of this site.
 *
 * They therefore cannot carry the AdSense loader and must not: injecting a
 * publisher script into someone else's game is a licensing problem and an
 * accidental-click problem in one. The gate checks the real pages instead.
 *
 * The exclusion is backed by a second condition — the file must have a
 * same-path source in `public/play/` — so it can never silently swallow a page
 * that Astro rendered into `dist/play/`. Such a page has no source under
 * `public/play/`, so it stays in the checked set and fails if it lacks a loader.
 */
const GAME_BUNDLE_PREFIX = 'play/';

/** File extensions worth scanning. Images cannot contain ad script. */
const SCANNED_EXTENSIONS = new Set(['.html', '.js', '.mjs', '.css', '.json', '.txt', '.xml']);

/**
 * Minimal `.env` reader.
 *
 * Astro copies `.env` into `import.meta.env` at build time, so the built output
 * reflects the values in that file. This script runs as a plain Node process
 * *after* the build, with no env plumbing of its own, so it has to reach the
 * same conclusion by reading the same file. Without this fallback the gate
 * would demand "zero ad code" for a build that legitimately contains a loader,
 * purely because the shell never exported the variable — a false failure that
 * would train everyone to ignore the gate.
 *
 * Deliberately tiny: `KEY=value` lines only, `#` comment lines ignored,
 * surrounding quotes stripped. That covers everything `.env.example` documents.
 *
 * @returns {Record<string, string>} Parsed key/value pairs from `.env`.
 */
function readDotEnv() {
  const envPath = path.join(ROOT, '.env');
  /** @type {Record<string, string>} */
  const values = {};
  if (!fs.existsSync(envPath)) return values;

  for (const rawLine of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const line = rawLine.trim();
    if (line === '' || line.startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq <= 0) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    const quoted =
      (value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"));
    if (quoted && value.length >= 2) value = value.slice(1, -1);
    values[key] = value;
  }
  return values;
}

/**
 * Read a variable the way the build read it: real environment first, then
 * `.env`, then empty.
 *
 * @param {Record<string, string>} dotEnv Parsed `.env` values.
 * @param {string} key Variable name.
 * @returns {string} Trimmed value, or '' when unset.
 */
function readVar(dotEnv, key) {
  const fromEnv = (process.env[key] ?? '').trim();
  if (fromEnv !== '') return fromEnv;
  return (dotEnv[key] ?? '').trim();
}

/**
 * Read the delivered value of the master switch.
 *
 * Precedence is environment → `.env` → `ENABLED_IN_CODE`, which is exactly the
 * precedence Astro/Vite applies at build time.
 *
 * @returns {boolean} True when the build was told to render ad slots.
 */
function readEnabledFromSource() {
  const dotEnv = readDotEnv();
  const envSwitch = readVar(dotEnv, 'PUBLIC_ADS_ENABLED').toLowerCase();
  if (envSwitch === 'true') return true;
  if (envSwitch === 'false') return false;

  if (!fs.existsSync(ADS_CONFIG)) return false;
  const text = fs.readFileSync(ADS_CONFIG, 'utf8');
  const match = text.match(/const\s+ENABLED_IN_CODE\s*=\s*(true|false)/);
  return match !== null && match[1] === 'true';
}

/**
 * Whether credentials exist for the configured network.
 *
 * A publisher ID is what makes the AdSense loader emit, so this is the fact
 * that decides between "there is a loader on every page" and "there must be no
 * ad code at all".
 *
 * @returns {boolean} True when a well-formed publisher or site ID is configured.
 */
function hasCredentials() {
  const dotEnv = readDotEnv();
  const pubId = readVar(dotEnv, 'PUBLIC_ADSENSE_PUB_ID');
  const mvId = readVar(dotEnv, 'PUBLIC_MEDIAVINE_SITE_ID');
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
 * Relative, forward-slashed path for readable messages on every OS.
 * @param {string} file
 * @returns {string}
 */
function rel(file) {
  return path.relative(ROOT, file).replace(/\\/g, '/');
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
          file: rel(file),
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
 * Collect every `.html` file in the output.
 * @param {string[]} files
 * @returns {string[]}
 */
function htmlFiles(files) {
  return files.filter((file) => path.extname(file).toLowerCase() === '.html');
}

/**
 * Whether a file is a copied game-bundle document rather than a page of this
 * site. See `GAME_BUNDLE_PREFIX` for why the distinction matters.
 *
 * @param {string} file Absolute path inside `dist/`.
 * @returns {boolean} True when the file is a verbatim copy of a `public/play/` asset.
 */
function isIframeDocument(file) {
  const insideDist = path.relative(DIST, file).replace(/\\/g, '/');
  if (!insideDist.startsWith(GAME_BUNDLE_PREFIX)) return false;
  // Second condition: the copy really came from public/play/.
  return fs.existsSync(path.join(ROOT, 'public', insideDist));
}

/**
 * Split the HTML output into site pages and iframe-hosted game documents.
 * @param {string[]} files
 * @returns {{sitePages: string[], iframeDocuments: string[]}}
 */
function splitPages(files) {
  const pages = htmlFiles(files);
  return {
    sitePages: pages.filter((file) => !isIframeDocument(file)),
    iframeDocuments: pages.filter((file) => isIframeDocument(file)),
  };
}

/**
 * Count AdSense loader occurrences per HTML page.
 * @param {string[]} pages Absolute paths to the pages to count.
 * @returns {{file: string, count: number}[]}
 */
function countLoadersPerPage(pages) {
  return pages.map((file) => {
    const text = fs.readFileSync(file, 'utf8');
    // `String#match` with a /g pattern resets `lastIndex` internally, so the
    // shared LOADER_PATTERN cannot carry state between pages.
    const matches = text.match(LOADER_PATTERN);
    return { file: rel(file), count: matches === null ? 0 : matches.length };
  });
}

/**
 * Find every ad-slot marker, with line numbers.
 * @param {string[]} files
 * @returns {{file: string, token: string, label: string, line: number, excerpt: string}[]}
 */
function findSlotMarkers(files) {
  /** @type {{file: string, token: string, label: string, line: number, excerpt: string}[]} */
  const hits = [];

  for (const file of files) {
    if (!SCANNED_EXTENSIONS.has(path.extname(file).toLowerCase())) continue;

    const text = fs.readFileSync(file, 'utf8');
    const lines = text.split(/\r?\n/);

    for (const marker of SLOT_MARKERS) {
      for (let index = 0; index < lines.length; index += 1) {
        const line = lines[index];
        // A fresh regex per test keeps `lastIndex` from leaking across files.
        marker.pattern.lastIndex = 0;
        if (!marker.pattern.test(line)) continue;
        hits.push({
          file: rel(file),
          token: marker.token,
          label: marker.label,
          line: index + 1,
          excerpt: line.trim().slice(0, 140),
        });
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
        file: rel(file),
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

/**
 * Mode C — no credentials, so no ad code of any kind may appear.
 * @param {string[]} files
 */
function checkNoAdCode(files) {
  const hits = findAdTokens(files);

  if (hits.length === 0) {
    process.stdout.write(
      `  ${pc.green('✔')} ${files.length} files scanned, zero ad tokens found.\n` +
        `  ${pc.dim('The delivered site contains no advertising code of any kind.')}\n\n`,
    );
    return;
  }

  process.stdout.write(`${pc.red('✖ No ad credentials are configured, but ad code reached the build.')}\n\n`);
  for (const hit of hits) {
    process.stdout.write(`  ${hit.file}:${hit.line}  →  "${hit.token}"\n`);
    process.stdout.write(`    ${pc.dim(hit.excerpt)}\n`);
  }
  process.stdout.write(
    `\n${pc.green('fix:')} with no publisher ID there is nothing to load, so every ad tag must be\n` +
      '      gated. Check that the component wraps its markup in a conditional rather\n' +
      '      than hiding it with CSS, and that any script uses `is:inline` so it is not\n' +
      '      bundled independently of whether it rendered.\n\n',
  );
  process.exitCode = 1;
}

/**
 * Mode B — credentials present, master switch off.
 *
 * Asserts the exact shape the site is delivered in: one loader per page (so
 * AdSense can read the publisher ID and start a review) and no ad slots at all
 * (so a reviewer does not see empty containers).
 * @param {string[]} files
 */
function checkLoaderOnly(files) {
  /** @type {string[]} */
  const problems = [];

  const { sitePages, iframeDocuments } = splitPages(files);
  const pages = countLoadersPerPage(sitePages);
  const totalLoaders = pages.reduce((sum, entry) => sum + entry.count, 0);

  if (pages.length === 0) {
    problems.push(
      'No site pages were found in dist/ (every HTML file was an iframe game bundle). ' +
        'The build looks broken.',
    );
  } else if (totalLoaders === 0) {
    problems.push(
      'The AdSense loader was not found on any of the ' +
        `${pages.length} site pages. AdSense will not start a site review while the ` +
        'publisher ID is absent from the page. Expected a single\n' +
        `      <script async src="https://${LOADER_MARKER}ca-pub-…"> per page.`,
    );
  } else {
    const missing = pages.filter((entry) => entry.count === 0);
    const duplicated = pages.filter((entry) => entry.count > 1);

    if (missing.length > 0) {
      problems.push(
        `${missing.length} of ${pages.length} site pages carry no AdSense loader, so the ` +
          'publisher ID is not on those pages and they cannot be reviewed. ' +
          `First ${Math.min(missing.length, 10)}: ` +
          missing
            .slice(0, 10)
            .map((entry) => entry.file)
            .join(', '),
      );
    }

    if (duplicated.length > 0) {
      problems.push(
        `${duplicated.length} page(s) carry the AdSense loader more than once, which makes ` +
          'the ad script initialise repeatedly: ' +
          duplicated
            .slice(0, 10)
            .map((entry) => `${entry.file} (${entry.count}×)`)
            .join(', '),
      );
    }
  }

  const slotHits = findSlotMarkers(files);
  if (slotHits.length > 0) {
    problems.push(
      `${slotHits.length} ad slot marker(s) leaked into a build where the master switch is ` +
        'off. Empty ad containers on a site under review are a documented rejection reason, ' +
        'so slots must stay gated on `adsActive()` even though the loader no longer is.',
    );
  }

  if (problems.length === 0) {
    process.stdout.write(
      `  ${pc.green('✔')} ${pages.length}/${pages.length} HTML pages carry exactly one AdSense ` +
        `loader; zero ad slots.\n` +
        `  ${pc.dim(
          'The publisher ID is visible to AdSense on every page, and nothing renders an empty ad box.',
        )}\n`,
    );
    if (iframeDocuments.length > 0) {
      process.stdout.write(
        `  ${pc.dim(
          `Excluded: ${iframeDocuments.length} iframe-hosted game bundles under /play/ ` +
            '(robots-disallowed, third-party documents, never sit in a <head> we own).',
        )}\n`,
      );
    }
    process.stdout.write('\n');
    return;
  }

  process.stdout.write(`${pc.red('✖ Ads are off but the delivered ad output is wrong.')}\n\n`);
  for (const problem of problems) {
    process.stdout.write(`  • ${problem}\n`);
  }
  for (const hit of slotHits.slice(0, 20)) {
    process.stdout.write(`\n  ${hit.file}:${hit.line}  →  ${hit.label} ("${hit.token}")\n`);
    process.stdout.write(`    ${pc.dim(hit.excerpt)}\n`);
  }
  process.stdout.write('\n');
  process.exitCode = 1;
}

/**
 * Mode A — master switch on and credentials present, so the ad code must be
 * correct, not merely present.
 * @param {string[]} files
 */
function checkAdsOn(files) {
  /** @type {string[]} */
  const problems = [];

  const hits = findAdTokens(files);
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

  const files = walk(DIST);
  const { sitePages, iframeDocuments } = splitPages(files);

  /**
   * @type {'ads-on' | 'tag-only' | 'no-ad-code'}
   */
  const mode = !credentials ? 'no-ad-code' : enabled ? 'ads-on' : 'tag-only';

  const expectation =
    mode === 'no-ad-code'
      ? 'NO ad code at all'
      : mode === 'tag-only'
        ? 'one AdSense loader per page, zero ad slots'
        : 'ad code present';

  process.stdout.write(`\n${pc.bold('Ad output check')}\n`);
  process.stdout.write(`  master switch:  ${enabled ? pc.yellow('ON') : pc.green('OFF')}\n`);
  process.stdout.write(`  credentials:    ${credentials ? 'configured' : 'not configured'}\n`);
  process.stdout.write(`  mode:           ${mode}\n`);
  process.stdout.write(
    `  html pages:     ${sitePages.length} site pages` +
      `${iframeDocuments.length > 0 ? ` + ${iframeDocuments.length} iframe game bundles` : ''}\n`,
  );
  process.stdout.write(`  expectation:    ${expectation}\n\n`);

  if (mode === 'no-ad-code') {
    checkNoAdCode(files);
    return;
  }

  if (mode === 'tag-only') {
    checkLoaderOnly(files);
    return;
  }

  checkAdsOn(files);
}

main();
