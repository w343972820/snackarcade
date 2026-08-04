/**
 * Build-time registry of pathnames that must be excluded from the sitemap.
 *
 * WHY THIS FILE EXISTS
 * --------------------
 * `<meta name="robots">` and the sitemap filter must never disagree. If a page
 * says `noindex` but is still listed in the sitemap, Google Search Console
 * reports "Submitted URL marked noindex" — a permanent, self-inflicted quality
 * penalty. So both consumers read from one place.
 *
 * HOW IT WORKS
 * ------------
 * 1. During page rendering, `src/lib/seo/indexability.ts` calls
 *    `recordNoindexPath()` for every page it marks noindex. That appends to a
 *    JSON file on disk.
 * 2. After all pages are rendered, `@astrojs/sitemap` runs its `filter`
 *    callback. `isNoindexPath()` reads the file lazily at that moment.
 *
 * The lazy read is the important part: `astro.config.mjs` is evaluated BEFORE
 * any page renders, so the set must not be captured at config load time.
 *
 * This is a `.mjs` file (not `.ts`) because `astro.config.mjs` has to import it
 * without a TypeScript transform step.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

/**
 * WHY THE ROOT IS RESOLVED FROM `process.cwd()` AND NOT FROM `import.meta.url`
 * ---------------------------------------------------------------------------
 * This module ends up loaded TWICE in a single `astro build`:
 *
 *   • once by `astro.config.mjs`, straight off disk at `src/config/…`
 *   • once inside the SSR bundle Vite writes into the output directory, which
 *     is what the render phase actually executes
 *
 * With `import.meta.url` the two copies computed two different project roots,
 * so the render phase wrote `dist/.astro/noindex-urls.json` while the sitemap
 * filter read `.astro/noindex-urls.json` — an empty file it had just reset.
 * The filter therefore never excluded anything, and the internal registry file
 * shipped inside the deploy output.
 *
 * `process.cwd()` is identical for both copies because they run in the same
 * process, so both agree on one file. The upward `package.json` search is a
 * safety net for the case where the build is launched from a subdirectory.
 */
function resolveProjectRoot() {
  const cwd = process.cwd();
  let dir = cwd;

  for (let depth = 0; depth < 12; depth += 1) {
    if (existsSync(resolve(dir, 'package.json'))) return dir;
    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }

  return cwd;
}

const projectRoot = resolveProjectRoot();

/** Where the registry is persisted between the render phase and the sitemap phase. */
export const NOINDEX_REGISTRY_FILE = resolve(projectRoot, '.astro/noindex-urls.json');

/** @type {Set<string> | null} */
let cachedSet = null;

/** Normalise to a leading-and-trailing-slash pathname so lookups always match. */
export function normalisePath(pathname) {
  if (typeof pathname !== 'string' || pathname.length === 0) return '/';
  let out = pathname.startsWith('/') ? pathname : `/${pathname}`;
  if (!out.endsWith('/')) out = `${out}/`;
  return out;
}

/** Clear the registry file. Called once at the start of a build. */
export function resetNoindexRegistry() {
  cachedSet = null;
  mkdirSync(dirname(NOINDEX_REGISTRY_FILE), { recursive: true });
  writeFileSync(NOINDEX_REGISTRY_FILE, '[]', 'utf8');
}

/** Record one pathname as noindex. Safe to call repeatedly with the same value. */
export function recordNoindexPath(pathname) {
  const normalised = normalisePath(pathname);
  const current = new Set(loadFromDisk());
  if (current.has(normalised)) return;
  current.add(normalised);
  mkdirSync(dirname(NOINDEX_REGISTRY_FILE), { recursive: true });
  writeFileSync(NOINDEX_REGISTRY_FILE, JSON.stringify([...current].sort(), null, 2), 'utf8');
  cachedSet = current;
}

/** Read the registry from disk. Returns an empty array when absent. */
function loadFromDisk() {
  if (!existsSync(NOINDEX_REGISTRY_FILE)) return [];
  try {
    const parsed = JSON.parse(readFileSync(NOINDEX_REGISTRY_FILE, 'utf8'));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Lazily load the full set. Called by the sitemap filter, which runs after the
 * render phase has finished writing to the registry.
 */
export function readNoindexUrls() {
  if (cachedSet === null) cachedSet = new Set(loadFromDisk());
  return cachedSet;
}

/** True when the given pathname must be kept out of the sitemap. */
export function isNoindexPath(pathname) {
  return readNoindexUrls().has(normalisePath(pathname));
}
