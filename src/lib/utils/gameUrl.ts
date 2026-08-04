/**
 * Dual-mode game asset resolution — the single place that decides WHERE a
 * playable game bundle is served from.
 *
 * WHY THIS EXISTS
 * ---------------
 * The site owner may not have any cloud storage yet. The site therefore has to
 * work in two modes, and the switch is one environment variable:
 *
 *   LOCAL MODE   (PUBLIC_GAME_ORIGIN unset — the default)
 *     Games are served from this same site at `/play/{slug}/`.
 *     Zero external services. Works on a laptop and on a fresh deploy.
 *
 *     The base is `/play/`, NOT `/games/`, because `/games/{slug}/` is the
 *     canonical URL of the game's *article* page (PRD 5.1). Putting the raw
 *     bundle at the same path would make the static host serve the bare game
 *     instead of the page Google ranks — a silent, traffic-destroying clash.
 *
 *   ORIGIN MODE  (PUBLIC_GAME_ORIGIN set, e.g. https://play.snackarcade.com)
 *     Games are served from a separate origin, normally a Cloudflare R2 bucket
 *     with a custom domain. This keeps the game files out of the 20,000-file
 *     Cloudflare Pages deploy budget and makes the iframe sandbox meaningful.
 *
 * Every consumer — the player component, preconnect hints, the publish script
 * and the deploy budget report — goes through this module. Nothing else in the
 * codebase should read `PUBLIC_GAME_ORIGIN` directly.
 */

/**
 * Where local-mode bundles are mirrored to inside `public/`.
 * Deliberately different from the `/games/` page namespace — see the note above.
 */
export const LOCAL_GAMES_BASE = '/play';

/** Raw value of the environment variable, trimmed and without a trailing slash. */
function readConfiguredOrigin(): string {
  const raw = (import.meta.env['PUBLIC_GAME_ORIGIN'] ?? '').trim();
  if (raw.length === 0) return '';
  return raw.endsWith('/') ? raw.slice(0, -1) : raw;
}

const CONFIGURED_ORIGIN = readConfiguredOrigin();

/**
 * True when games are served from this same site.
 * In local mode the iframe is same-origin, so `allow-same-origin` in the
 * sandbox does not buy the game any privileges it would not already have.
 */
export function isLocalGameMode(): boolean {
  return CONFIGURED_ORIGIN.length === 0;
}

/**
 * The external origin serving game bundles, or `null` in local mode.
 * Used for `<link rel="preconnect">` — there is nothing to preconnect to when
 * the games come from the current origin.
 */
export function getGameOrigin(): string | null {
  return CONFIGURED_ORIGIN.length > 0 ? CONFIGURED_ORIGIN : null;
}

/**
 * Base URL for one game's bundle, always with a trailing slash.
 *
 * @example
 *   // local mode
 *   getGameBaseUrl('2048')  // => '/play/2048/'
 *   // origin mode
 *   getGameBaseUrl('2048')  // => 'https://play.snackarcade.com/2048/'
 */
export function getGameBaseUrl(slug: string): string {
  const safeSlug = slug.trim().replace(/^\/+|\/+$/g, '');
  if (safeSlug.length === 0) {
    throw new Error('getGameBaseUrl() was called with an empty slug.');
  }
  const base = CONFIGURED_ORIGIN.length > 0 ? CONFIGURED_ORIGIN : LOCAL_GAMES_BASE;
  return `${base}/${safeSlug}/`;
}

/**
 * Full URL of a game's entry document — the value that ends up in `iframe.src`.
 *
 * @param slug      Game slug, e.g. `block-drop`
 * @param entryFile Entry document inside the bundle, defaults to `index.html`
 */
export function getGameEntryUrl(slug: string, entryFile: string = 'index.html'): string {
  const safeEntry = entryFile.trim().replace(/^\/+/, '') || 'index.html';
  return `${getGameBaseUrl(slug)}${safeEntry}`;
}

/**
 * The `sandbox` attribute for a game iframe.
 *
 * `allow-same-origin` is only safe to combine with `allow-scripts` when the
 * game really is on a different origin. In local mode we keep the same flags
 * (the game is first-party content we vetted and self-host), but the helper is
 * centralised so the policy can be tightened in exactly one place.
 */
export function getGameSandbox(sourceType: 'self_hosted' | 'iframe'): string {
  if (sourceType === 'self_hosted') {
    return 'allow-scripts allow-same-origin allow-pointer-lock allow-orientation-lock';
  }
  // Third-party embeds legitimately need popups for their own consent flows.
  return [
    'allow-scripts',
    'allow-same-origin',
    'allow-popups',
    'allow-popups-to-escape-sandbox',
    'allow-forms',
  ].join(' ');
}

/**
 * Human-readable description of the current mode, printed by the build scripts
 * so the site owner can see at a glance which mode a deploy used.
 */
export function describeGameMode(): string {
  const origin = getGameOrigin();
  return origin === null
    ? `local (games served from this site at ${LOCAL_GAMES_BASE}/{slug}/)`
    : `external origin (${origin}/{slug}/)`;
}
