/**
 * The canonical site URL, shared by `astro.config.mjs` and the TypeScript
 * config layer (`src/config/site.ts`).
 *
 * This lives in a `.mjs` file because `astro.config.mjs` must import it without
 * a TypeScript transform step. `src/config/site.ts` re-exports it so that
 * application code has exactly one import path to remember.
 */

const DEFAULT_SITE_URL = 'https://snackarcade.com';

/** Strip any trailing slash so callers can safely append `/foo/`. */
function withoutTrailingSlash(value) {
  return value.endsWith('/') ? value.slice(0, -1) : value;
}

const configured =
  typeof process !== 'undefined' && process.env && process.env.PUBLIC_SITE_URL
    ? String(process.env.PUBLIC_SITE_URL).trim()
    : '';

export const SITE_URL = withoutTrailingSlash(configured || DEFAULT_SITE_URL);

/** True when the build is still using the placeholder domain. */
export const IS_PLACEHOLDER_SITE_URL = !configured;
