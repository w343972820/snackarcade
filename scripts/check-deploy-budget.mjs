#!/usr/bin/env node
/**
 * Deploy budget check — runs automatically after every build.
 *
 * Static hosts cap how many files a single deploy may contain. Cloudflare Pages
 * allows 20,000 files and 25 MB per file. Self-hosted game bundles are what
 * actually consume that budget: one game can be thirty files on its own.
 *
 * Hitting the limit produces a deploy failure with an unhelpful message months
 * from now, when the site owner has no idea which game pushed it over. This
 * script warns long before that happens.
 */
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

import pc from 'picocolors';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');

/** Cloudflare Pages hard limits. */
const LIMITS = {
  MAX_FILES: 20_000,
  MAX_FILE_BYTES: 25 * 1024 * 1024,
  /** Warn once the deploy passes this share of the file limit. */
  WARN_RATIO: 0.75,
};

/**
 * Walk a directory and collect every file with its size.
 * @param {string} dir
 * @returns {{path: string, bytes: number}[]}
 */
function walk(dir) {
  /** @type {{path: string, bytes: number}[]} */
  const files = [];

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walk(full));
    } else {
      files.push({ path: full, bytes: fs.statSync(full).size });
    }
  }

  return files;
}

/**
 * Human-readable byte size.
 * @param {number} bytes
 * @returns {string}
 */
function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function main() {
  if (!fs.existsSync(DIST)) {
    process.stdout.write(
      `${pc.yellow('No dist/ folder found — skipping the deploy budget check.')}\n`,
    );
    return;
  }

  const files = walk(DIST);
  const totalBytes = files.reduce((sum, file) => sum + file.bytes, 0);
  // Playable bundles live under dist/play/ — dist/games/ holds the HTML pages.
  const bundleDir = path.join(DIST, 'play');
  const gameFiles = files.filter((file) => file.path.startsWith(bundleDir));

  const used = files.length;
  const ratio = used / LIMITS.MAX_FILES;
  const remaining = LIMITS.MAX_FILES - used;

  process.stdout.write(`\n${pc.bold('Deploy budget')}\n`);
  process.stdout.write(
    `  files:        ${used.toLocaleString()} of ${LIMITS.MAX_FILES.toLocaleString()} (${(ratio * 100).toFixed(1)}%)\n`,
  );
  process.stdout.write(`  total size:   ${formatBytes(totalBytes)}\n`);
  process.stdout.write(`  game bundles: ${gameFiles.length.toLocaleString()} files\n`);

  // Per-file size limit — a single oversized asset fails the whole deploy.
  const oversized = files.filter((file) => file.bytes > LIMITS.MAX_FILE_BYTES);
  if (oversized.length > 0) {
    process.stdout.write(`\n${pc.red('✖ Some files are too large to deploy.')}\n`);
    for (const file of oversized) {
      const rel = path.relative(ROOT, file.path).replace(/\\/g, '/');
      process.stdout.write(`  ${rel} — ${formatBytes(file.bytes)} (limit ${formatBytes(LIMITS.MAX_FILE_BYTES)})\n`);
    }
    process.stdout.write(
      `\n${pc.green('fix:')} compress or remove these files. Large game assets such as music tracks are the usual cause.\n\n`,
    );
    process.exitCode = 1;
    return;
  }

  if (used > LIMITS.MAX_FILES) {
    process.stdout.write(
      `\n${pc.red('✖ This deploy has too many files and will be rejected by the host.')}\n` +
        `${pc.green('fix:')} move the largest self-hosted games to R2 object storage with \`npm run publish:games\`,\n` +
        `      then set PUBLIC_GAME_ORIGIN in your .env file. That moves every game file out of the deploy.\n\n`,
    );
    process.exitCode = 1;
    return;
  }

  if (ratio >= LIMITS.WARN_RATIO) {
    const perGame = gameFiles.length > 0 ? Math.round(gameFiles.length / Math.max(1, countGameFolders())) : 0;
    process.stdout.write(
      `\n${pc.yellow('⚠ Getting close to the file limit.')}\n` +
        `  Roughly ${remaining.toLocaleString()} files of headroom left` +
        (perGame > 0 ? `, about ${Math.floor(remaining / perGame)} more self-hosted games.` : '.') +
        `\n${pc.dim('  When you run out, switch game hosting to R2: run `npm run publish:games` and set PUBLIC_GAME_ORIGIN.')}\n`,
    );
  } else {
    process.stdout.write(`  ${pc.green('✔')} Comfortably within limits.\n`);
  }

  process.stdout.write('\n');
}

/**
 * Number of game bundle folders inside dist/play, used to estimate remaining
 * capacity.
 * @returns {number}
 */
function countGameFolders() {
  const bundleDir = path.join(DIST, 'play');
  if (!fs.existsSync(bundleDir)) return 0;
  return fs.readdirSync(bundleDir, { withFileTypes: true }).filter((entry) => entry.isDirectory())
    .length;
}

main();
