#!/usr/bin/env node
/**
 * Upload game bundles to Cloudflare R2 — `npm run publish:games`.
 *
 * YOU DO NOT NEED THIS TO RUN THE SITE. Out of the box the site serves games
 * from its own deploy and requires no cloud account at all. This script exists
 * for one future situation: the site grows past the host's 20,000-file limit,
 * and game files have to move to object storage to make room.
 *
 * When that day comes:
 *   1. Create an R2 bucket named in wrangler.toml.
 *   2. Run `npx wrangler login`.
 *   3. Run `npm run publish:games`.
 *   4. Put the bucket's public URL in .env as PUBLIC_GAME_ORIGIN.
 *   5. Run `npm run build`. Game files stop being copied into the deploy.
 *
 * Nothing else in the codebase changes — src/lib/utils/gameUrl.ts switches
 * every game link over on its own.
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

import pc from 'picocolors';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const GAMES_SRC = path.join(ROOT, 'games-src');
const CACHE_FILE = path.join(ROOT, '.publish-cache.json');
const WRANGLER_TOML = path.join(ROOT, 'wrangler.toml');

/** Kept identical to the other scripts so the three can never disagree. */
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
 * Read the bucket name out of wrangler.toml without adding a TOML parser.
 * @returns {string}
 */
function readBucketName() {
  if (!fs.existsSync(WRANGLER_TOML)) return '';
  const text = fs.readFileSync(WRANGLER_TOML, 'utf8');
  const match = text.match(/bucket_name\s*=\s*"([^"]+)"/);
  return match ? match[1] : '';
}

/**
 * Every shippable file in a bundle, as paths relative to games-src/.
 * @param {string} dir
 * @param {string} base
 * @returns {string[]}
 */
function listFiles(dir, base) {
  /** @type {string[]} */
  const files = [];

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (EXCLUDED_ENTRIES.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...listFiles(full, base));
    } else {
      files.push(path.relative(base, full).replace(/\\/g, '/'));
    }
  }

  return files;
}

/**
 * Content type for the small set of extensions games actually ship.
 * @param {string} file
 * @returns {string}
 */
function contentType(file) {
  const ext = path.extname(file).toLowerCase();
  const types = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.mjs': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp',
    '.ico': 'image/x-icon',
    '.ogg': 'audio/ogg',
    '.mp3': 'audio/mpeg',
    '.wav': 'audio/wav',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.txt': 'text/plain; charset=utf-8',
    '.md': 'text/plain; charset=utf-8',
  };
  return types[ext] ?? 'application/octet-stream';
}

function main() {
  const bucket = readBucketName();

  if (bucket === '') {
    process.stderr.write(
      `${pc.red('No bucket configured.')}\n` +
        `Add a bucket_name to wrangler.toml before running this.\n`,
    );
    process.exitCode = 1;
    return;
  }

  if (!fs.existsSync(GAMES_SRC)) {
    process.stdout.write(`${pc.yellow('games-src/ does not exist — nothing to upload.')}\n`);
    return;
  }

  const slugs = fs
    .readdirSync(GAMES_SRC, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith('_'))
    .map((entry) => entry.name)
    .sort();

  if (slugs.length === 0) {
    process.stdout.write(`${pc.yellow('No game bundles found in games-src/.')}\n`);
    return;
  }

  /** @type {Record<string, number>} */
  let cache = {};
  if (fs.existsSync(CACHE_FILE)) {
    try {
      cache = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
    } catch {
      cache = {};
    }
  }

  process.stdout.write(`\n${pc.bold(`Uploading to R2 bucket "${bucket}"`)}\n\n`);

  let uploaded = 0;
  let unchanged = 0;

  for (const slug of slugs) {
    const bundleDir = path.join(GAMES_SRC, slug);
    const files = listFiles(bundleDir, GAMES_SRC);

    for (const relative of files) {
      const absolute = path.join(GAMES_SRC, relative);
      const stat = fs.statSync(absolute);
      const fingerprint = stat.mtimeMs;

      if (cache[relative] === fingerprint) {
        unchanged += 1;
        continue;
      }

      const key = `games/${relative}`;

      try {
        execFileSync(
          process.platform === 'win32' ? 'npx.cmd' : 'npx',
          [
            'wrangler',
            'r2',
            'object',
            'put',
            `${bucket}/${key}`,
            '--file',
            absolute,
            '--content-type',
            contentType(relative),
            '--remote',
          ],
          { stdio: 'pipe', cwd: ROOT },
        );

        cache[relative] = fingerprint;
        uploaded += 1;
        process.stdout.write(`  ${pc.green('↑')} ${key}\n`);
      } catch (error) {
        process.stderr.write(
          `\n${pc.red('Upload failed for')} ${key}\n` +
            `${String(error instanceof Error ? error.message : error)}\n\n` +
            `${pc.dim('Most common cause: you are not logged in. Run `npx wrangler login` and try again.')}\n`,
        );
        fs.writeFileSync(CACHE_FILE, `${JSON.stringify(cache, null, 2)}\n`, 'utf8');
        process.exitCode = 1;
        return;
      }
    }
  }

  fs.writeFileSync(CACHE_FILE, `${JSON.stringify(cache, null, 2)}\n`, 'utf8');

  process.stdout.write(
    `\n${pc.green('✔')} Done — ${uploaded} file(s) uploaded, ${unchanged} already up to date.\n\n` +
      `${pc.bold('Next:')} put your bucket's public URL in .env as PUBLIC_GAME_ORIGIN, then run npm run build.\n` +
      `${pc.dim('Example: PUBLIC_GAME_ORIGIN=https://games.snackarcade.com')}\n\n`,
  );
}

main();
