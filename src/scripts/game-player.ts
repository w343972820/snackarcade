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
 * WHY THERE IS NO LAYOUT SHIFT WHEN THE PAGE LOADS
 * ═══════════════════════════════════════════════════════════════════════════
 * The stage reserves its height with `aspect-ratio` in `game.css` before
 * anything loads, and both the poster and the injected iframe are
 * `position: absolute; inset: 0` inside it. Swapping one for the other
 * changes nothing about the box, so CLS stays at zero at page load. Once the
 * visitor clicks Play the stage may GROW to fit the game (see
 * `fitGameToStage` below) — that is a deliberate, user-initiated resize, not
 * a passive layout shift.
 *
 * The injected iframe is styled by a GLOBAL rule (`.game-player__frame` in
 * `src/styles/game.css`) rather than an Astro scoped style, because an element
 * created at runtime never receives Astro's scoping attribute.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * WHY THE STAGE GROWS TO FIT THE GAME (AND WHY GAMES MUST NOT BE FULLSCREEN-ONLY)
 * ═══════════════════════════════════════════════════════════════════════════
 * Every game content file currently declares `aspectRatio: [16, 9]`, so the
 * stage reserves a 16:9 box (≈950×534px on a 1366×768 laptop). Several games
 * are natively taller than that — 2048's board is ~600px tall, Block Drop's
 * canvas is 300×600, Alien Attack is 1200×720, etc. Inside the clipped stage
 * their bottom edge was unreachable, which forced players into fullscreen.
 *
 * `fitGameToStage()` measures the real game height (same-origin, so
 * `frame.contentDocument` is readable) and grows the stage to fit the entire
 * game. The page becomes a little longer when the game is taller than 16:9,
 * which is normal web behaviour — the visitor has already clicked Play, so
 * this is a deliberate, user-initiated layout change rather than a passive
 * shift.
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

/** Safari's prefixed fullscreen element, used before the standard API landed. */
interface FullscreenDocument extends Document {
  webkitFullscreenElement?: Element | null;
}

/** True when the stage is the element currently shown fullscreen. */
function isStageFullscreen(stage: HTMLElement): boolean {
  return document.fullscreenElement === stage || (document as FullscreenDocument).webkitFullscreenElement === stage;
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
  // `auto` (not `no`) is deliberate: when the frame is cross-origin and the
  // stage cannot be auto-fitted, an internal scrollbar keeps the game's bottom
  // reachable instead of silently clipping it. Once `fitGameToStage()` runs the
  // content fits the stage, so no scrollbar is visible in local mode.
  frame.setAttribute('scrolling', 'auto');
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

  // Fit the stage to the game once it is loaded, and again whenever the
  // viewport, the fullscreen state or the game's own content changes size.
  frame.addEventListener('load', () => {
    fitGameToStage(root, frame);
    observeGameResize(root, frame);
    // Some games render after fonts/images land without resizing <body>; one
    // late pass catches the stragglers.
    window.setTimeout(() => fitGameToStage(root, frame), 600);
  });

  const onViewportChange = (): void => {
    window.requestAnimationFrame(() => fitGameToStage(root, frame));
  };
  window.addEventListener('resize', onViewportChange);
  document.addEventListener('fullscreenchange', onViewportChange);
  document.addEventListener('webkitfullscreenchange', onViewportChange);

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

/* ---------------------------------------------------------------------------
 * Stage auto-fit
 *
 * Games declare `aspectRatio: [16, 9]` in their content file, so the stage
 * reserves a 16:9 box (≈950×534px on a 1366×768 laptop). Several games are
 * natively taller than that — 2048's board is ~600px tall, Block Drop's
 * canvas is 300×600, Alien Attack is 1200×720, etc. Inside the clipped stage
 * their bottom edge was unreachable, which forced players into fullscreen.
 *
 * `fitGameToStage()` measures the game's real height (same-origin, so
 * `frame.contentDocument` is readable) and grows the stage to fit the entire
 * game. The page becomes a little longer when the game is taller than the
 * 16:9 box, which is normal web behaviour; the visitor is already interacting
 * (they clicked Play) so this is a deliberate, user-initiated layout change,
 * not a passive shift. In LOCAL mode the iframe is same-origin so this works
 * directly; in ORIGIN mode (PUBLIC_GAME_ORIGIN set, cross-origin iframe) the
 * measurement throws and is skipped — the stage keeps its 16:9 box and the
 * iframe is allowed to scroll internally instead.
 * ------------------------------------------------------------------------- */

/**
 * Read a game's document, tolerating a cross-origin frame.
 *
 * @param frame The game iframe.
 * @returns The frame's document, or null when it is not readable.
 */
function getGameDocument(frame: HTMLIFrameElement): Document | null {
  try {
    return frame.contentDocument;
  } catch {
    return null;
  }
}

/**
 * The natural height of the game's content in pixels, or null when the frame
 * is cross-origin.
 *
 * @param frame The game iframe.
 */
function measureGameHeight(frame: HTMLIFrameElement): number | null {
  const doc = getGameDocument(frame);
  if (doc === null) return null;
  const root = doc.documentElement;
  const body = doc.body;
  if (root === null) return null;
  return Math.max(root.scrollHeight, body === null ? 0 : body.scrollHeight);
}

/**
 * Parse the `--game-aspect` custom property back into a `[width, height]`
 * pair. Falls back to 16:9, matching the default in `game.css`.
 *
 * @param root The `[data-game-player]` element.
 */
function parseAspectRatio(root: HTMLElement): readonly [number, number] {
  const raw = root.style.getPropertyValue('--game-aspect') || '16 / 9';
  const parts = raw.split('/').map((part) => Number.parseFloat(part.trim()));
  // `split('/')` always yields at least one element and `parseFloat` always
  // returns a number, but under `noUncheckedIndexedAccess` the index type is
  // still `number | undefined`. Read each part into a local and treat a
  // missing or non-finite value as "not provided" so the fallback applies.
  const rawWidth = parts[0];
  const rawHeight = parts[1];
  const width =
    rawWidth !== undefined && Number.isFinite(rawWidth) && rawWidth > 0 ? rawWidth : 16;
  const height =
    rawHeight !== undefined && Number.isFinite(rawHeight) && rawHeight > 0 ? rawHeight : 9;
  return [width, height];
}

/**
 * Size the stage to the game's natural height.
 *
 * Called when the game loads, when the viewport resizes, when fullscreen
 * toggles, and whenever the game's own content changes size (ResizeObserver).
 *
 * The stage grows beyond the reserved 16:9 box whenever the game is taller
 * than that box, so games such as 2048 (~600px tall) and Block Drop (~660px)
 * are not clipped at the bottom of the iframe — the original "I have to go
 * fullscreen to play" bug. The page becomes longer when this happens, which is
 * normal web behaviour; the visitor is already interacting (they clicked
 * Play) so this is a deliberate, user-initiated layout change, not a passive
 * shift.
 *
 * @param root The `[data-game-player]` element.
 * @param frame The game iframe.
 */
function fitGameToStage(root: HTMLElement, frame: HTMLIFrameElement): void {
  const stage = root.querySelector<HTMLElement>('[data-game-stage]');
  if (stage === null) return;

  const contentHeight = measureGameHeight(frame);
  if (contentHeight === null || contentHeight <= 0) return;

  if (isStageFullscreen(stage)) {
    // The `:fullscreen` rule in game.css makes the stage fill the viewport;
    // leave it alone. The game document has more room than it needs.
    return;
  }

  const [aspectWidth, aspectHeight] = parseAspectRatio(root);
  const stageWidth = stage.clientWidth;
  const ratioHeight =
    stageWidth > 0 && aspectWidth > 0 ? (stageWidth * aspectHeight) / aspectWidth : 0;

  const targetHeight = Math.max(ratioHeight, contentHeight);

  const stageFitHeight = Math.round(targetHeight);
  const currentFitHeight = stage.style.getPropertyValue('--fit-height');

  // Skip the DOM write when nothing changed — this is what keeps the
  // ResizeObserver feedback loop from oscillating when a game's body follows
  // the iframe viewport height.
  if (
    !stage.classList.contains('game-player__stage--fit') ||
    currentFitHeight !== `${stageFitHeight}px`
  ) {
    stage.style.setProperty('--fit-height', `${stageFitHeight}px`);
    stage.classList.add('game-player__stage--fit');
  }
}

/**
 * Watch the game document for size changes (menus that swap to the board,
 * fonts that land late, score panels that grow…) and re-fit when it moves.
 *
 * A `ResizeObserver` covers cases where a game element's box actually resizes
 * (e.g. a 100vh body that follows the iframe viewport). A
 * `MutationObserver` covers the common "menu → board" transition where the
 * page's box stays the same but its scrollable extent changes.
 *
 * @param root The `[data-game-player]` element.
 * @param frame The game iframe.
 */
function observeGameResize(root: HTMLElement, frame: HTMLIFrameElement): void {
  const doc = getGameDocument(frame);
  if (doc === null) return;

  let frameScheduled = false;
  const schedule = (): void => {
    if (frameScheduled) return;
    frameScheduled = true;
    window.requestAnimationFrame(() => {
      frameScheduled = false;
      fitGameToStage(root, frame);
    });
  };

  if (typeof ResizeObserver !== 'undefined') {
    const body = doc.body;
    if (body !== null) {
      const observer = new ResizeObserver(schedule);
      observer.observe(doc.documentElement);
      observer.observe(body);
    }
  }

  if (typeof MutationObserver !== 'undefined' && doc.body !== null) {
    const mutator = new MutationObserver(schedule);
    mutator.observe(doc.body, {
      childList: true,
      subtree: true,
      attributes: true,
    });
  }
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
