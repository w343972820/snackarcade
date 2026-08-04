/**
 * Click-to-play controller for the game frame.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * WHY THE IFRAME IS NOT IN THE HTML
 * ═══════════════════════════════════════════════════════════════════════════
 * PRD 5.2 forbids auto-loading the game, and the reason is measurable rather
 * than stylistic:
 *
 *   • LCP — a game bundle is hundreds of kilobytes of JavaScript and canvas
 *     work. Inside an iframe it competes with the page for the main thread and
 *     the network, and it routinely doubles Largest Contentful Paint on mobile.
 *     The page has to rank before anyone can play it.
 *   • Bandwidth — most search visitors read the guide and leave. Shipping the
 *     bundle to all of them is wasted transfer on a site with a deploy budget.
 *   • Measurement — with click-to-play, `game_start` counts people who actually
 *     played. Auto-loading makes that number meaningless.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * WHY THERE IS NO LAYOUT SHIFT WHEN IT LOADS
 * ═══════════════════════════════════════════════════════════════════════════
 * The stage already has its height reserved by `aspect-ratio` in `game.css`,
 * and both the poster and the injected iframe are `position: absolute; inset: 0`
 * inside it. Swapping one for the other changes nothing about the box, so CLS
 * stays at zero. Never give the iframe a computed pixel height here — that is
 * how this component would start shifting the page.
 *
 * The injected iframe is styled by a GLOBAL rule (`.game-player__frame` in
 * `src/styles/game.css`) rather than an Astro scoped style, because an element
 * created at runtime never receives Astro's scoping attribute.
 */

declare global {
  interface Window {
    /** Installed by `buildEventHelperScript()` when analytics is enabled. */
    saTrack?: (name: string, params?: Record<string, unknown>) => void;
    gtag?: (...args: unknown[]) => void;
  }
}

/** Vendor-prefixed fullscreen entry point still needed by iOS Safari. */
interface FullscreenCapable extends HTMLElement {
  webkitRequestFullscreen?: () => Promise<void> | void;
}

/** Marks a player as wired up, so a second init pass is a no-op. */
const READY_ATTRIBUTE = 'data-game-player-ready';

/** Event names mirror `analyticsConfig.events`; keep them in sync. */
const EVENTS = {
  GAME_START: 'game_start',
  GAME_FULLSCREEN: 'game_fullscreen',
  SIMILAR_GAME_CLICK: 'similar_game_click',
} as const;

/**
 * Report an event without caring whether analytics is switched on.
 *
 * With no `PUBLIC_GA4_ID` configured neither `saTrack` nor `gtag` exists, so
 * this is a cheap no-op rather than an error. Analytics must never be able to
 * break the game.
 *
 * @param name Event name.
 * @param params Event parameters.
 */
function track(name: string, params: Record<string, unknown> = {}): void {
  try {
    if (typeof window.saTrack === 'function') {
      window.saTrack(name, params);
      return;
    }
    if (typeof window.gtag === 'function') {
      window.gtag('event', name, params);
    }
  } catch {
    // Analytics failures are never allowed to surface to the player.
  }
}

/**
 * Build the game iframe from the data attributes on the player root.
 *
 * @param root The `[data-game-player]` element.
 * @returns A configured iframe, or null when the entry URL is missing.
 */
function createFrame(root: HTMLElement): HTMLIFrameElement | null {
  const entryUrl = root.getAttribute('data-entry-url') ?? '';
  if (entryUrl === '') return null;

  const title = root.getAttribute('data-game-title') ?? 'Game';
  const sandbox = root.getAttribute('data-sandbox') ?? '';

  const frame = document.createElement('iframe');
  frame.className = 'game-player__frame';
  frame.src = entryUrl;
  frame.title = `${title} game`;
  frame.setAttribute('allow', 'fullscreen; gamepad; autoplay; encrypted-media; accelerometer');
  frame.setAttribute('allowfullscreen', 'true');
  frame.setAttribute('scrolling', 'no');
  // Eager on purpose: the visitor just asked for this, so deferring it would
  // only add latency. Laziness is handled by not creating the frame at all.
  frame.setAttribute('loading', 'eager');

  if (sandbox !== '') frame.setAttribute('sandbox', sandbox);

  return frame;
}

/**
 * Load the game into a player and hide the poster.
 *
 * Idempotent: once `is-playing` is set, further clicks do nothing, so a
 * double-tap cannot mount two iframes.
 *
 * @param root The `[data-game-player]` element.
 */
function startGame(root: HTMLElement): void {
  if (root.classList.contains('is-playing')) return;

  const stage = root.querySelector<HTMLElement>('[data-game-stage]');
  if (stage === null) return;

  const frame = createFrame(root);
  if (frame === null) return;

  stage.appendChild(frame);
  root.classList.add('is-playing');

  // Reveal the controls that only make sense once a game is running.
  const controls = root.querySelector<HTMLElement>('[data-game-controls]');
  if (controls !== null) controls.hidden = false;

  // Move keyboard focus into the game so arrow keys reach it immediately
  // instead of scrolling the page.
  window.setTimeout(() => {
    try {
      frame.focus();
    } catch {
      // Cross-origin focus can throw; harmless.
    }
  }, 120);

  track(EVENTS.GAME_START, {
    game_slug: root.getAttribute('data-slug') ?? '',
    game_name: root.getAttribute('data-game-title') ?? '',
    source_type: root.getAttribute('data-source-type') ?? '',
  });
}

/**
 * Put the stage into fullscreen, falling back to the iOS-prefixed call.
 *
 * @param root The `[data-game-player]` element.
 */
function requestFullscreen(root: HTMLElement): void {
  const stage = root.querySelector<FullscreenCapable>('[data-game-stage]');
  if (stage === null) return;

  // Nothing to make fullscreen until the game exists.
  if (!root.classList.contains('is-playing')) {
    startGame(root);
  }

  try {
    if (typeof stage.requestFullscreen === 'function') {
      void stage.requestFullscreen();
    } else if (typeof stage.webkitRequestFullscreen === 'function') {
      void stage.webkitRequestFullscreen();
    } else {
      return;
    }
  } catch {
    return;
  }

  track(EVENTS.GAME_FULLSCREEN, {
    game_slug: root.getAttribute('data-slug') ?? '',
  });
}

/**
 * Wire up one player.
 *
 * @param root The `[data-game-player]` element.
 */
function initPlayer(root: HTMLElement): void {
  if (root.hasAttribute(READY_ATTRIBUTE)) return;
  root.setAttribute(READY_ATTRIBUTE, 'true');

  const playButton = root.querySelector<HTMLButtonElement>('[data-game-play]');
  if (playButton !== null) {
    playButton.addEventListener('click', (event: MouseEvent) => {
      event.preventDefault();
      startGame(root);
    });
  }

  const fullscreenButton = root.querySelector<HTMLButtonElement>('[data-game-fullscreen]');
  if (fullscreenButton !== null) {
    fullscreenButton.addEventListener('click', (event: MouseEvent) => {
      event.preventDefault();
      requestFullscreen(root);
    });
  }
}

/**
 * Track clicks on the Similar Games block.
 *
 * Delegated from the section wrapper so the card component stays free of
 * analytics concerns and no per-card listener is created.
 */
function initSimilarTracking(): void {
  const block = document.querySelector<HTMLElement>('[data-similar-games]');
  if (block === null || block.hasAttribute(READY_ATTRIBUTE)) return;
  block.setAttribute(READY_ATTRIBUTE, 'true');

  block.addEventListener('click', (event: MouseEvent) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const link = target.closest('a');
    if (link === null) return;

    track(EVENTS.SIMILAR_GAME_CLICK, {
      from_slug: block.getAttribute('data-from-slug') ?? '',
      to_href: link.getAttribute('href') ?? '',
    });
  });
}

/**
 * Entry point. Safe to call more than once.
 */
export function initGamePlayers(): void {
  const players = document.querySelectorAll<HTMLElement>('[data-game-player]');
  for (const player of players) initPlayer(player);

  initSimilarTracking();
}

export default initGamePlayers;
