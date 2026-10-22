/**
 * Advertising configuration — ONE switch controls every ad on the site.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * FOR THE SITE OWNER
 * ═══════════════════════════════════════════════════════════════════════════
 * Ads are OFF right now. Nothing to do until AdSense approves you.
 * The AdSense loader itself is already live on every page — that is what puts
 * the publisher ID in front of Google so a review can start. Turning the switch
 * on only adds the ad slots.
 *
 * To turn ads ON:
 *   1. Put your publisher ID in `.env`   →  PUBLIC_ADSENSE_PUB_ID=ca-pub-...
 *   2. Change ENABLED below from `false` to `true`.
 *   3. Redeploy.
 *
 * To move from AdSense to Mediavine / Raptive later:
 *   1. Change NETWORK below from 'adsense' to 'mediavine'.
 *   2. Put the site ID they give you in `.env` → PUBLIC_MEDIAVINE_SITE_ID=...
 *   3. Redeploy.
 *   No page, layout or component needs to change. The slots stay where they are.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * WHY IT IS BUILT THIS WAY
 * ═══════════════════════════════════════════════════════════════════════════
 * Two different things are switched, and they are switched separately.
 *
 *   • SLOTS — `<ins class="adsbygoogle">` plus their wrapping container — stay
 *     gated on `adsActive()`, i.e. on `ENABLED` below AND valid credentials.
 *     While `ENABLED` is false there are no ad containers in the delivered
 *     markup: not a hidden div, not a commented-out script, not a reserved gap.
 *     Empty ad containers on a site under AdSense review look like a site built
 *     for ads rather than for readers, which is a documented rejection reason.
 *
 *   • The LOADER — `<script async src=".../adsbygoogle.js?client=ca-pub-…">`
 *     and its preconnect hints — is gated on the publisher ID alone, and is
 *     therefore still emitted while `ENABLED` is false. That is deliberate,
 *     not a leak: AdSense lists "make sure your publisher ID is displayed on
 *     the page" among the prerequisites for *starting* the site approval
 *     process, and the ID only reaches the page inside that script tag. A
 *     build with no loader cannot begin a review at all.
 *     https://developers.google.com/adsense/platforms/transparent/approvals
 *
 *   • With no publisher ID configured there is nothing to load and nothing to
 *     render, so the build contains zero ad tokens of any kind.
 *
 * WHAT THE LOADER COSTS, AND WHAT IT DOES NOT DO
 * ----------------------------------------------
 * The loader is a real script that really runs, so "no slots in the delivered
 * markup" is a weaker claim than "no ad machinery on the page". Measured on
 * this site with ads off, 1440px viewport, three alternating runs per side:
 *
 *   • transfer   329,154 bytes with the loader vs 45,126 without it. 270,260 of
 *                the difference is Google-side script (adsbygoogle.js 67 KB,
 *                show_ads_impl.js 192 KB, zrt_lookup.js 4.5 KB).
 *   • load       +186 ms on the homepage (320 ms vs 134 ms).
 *   • DCL / FCP  130 vs 134 ms and 56 vs 68 ms — both inside noise, so `async`
 *                is doing what it promises: no parse blocking.
 *
 * 82% of the homepage's transferred bytes go to a mechanism that filled nothing.
 * That is the price of the publisher ID being readable by AdSense, and it is
 * the reason the slots themselves stay off: two costs, and only one of them
 * buys anything before approval.
 *
 * ONE RUNTIME FACT, so that nobody debugs a ghost: when the account-side Auto
 * ads setting is enabled, the AdSense script injects its own element —
 * `<ins class="adsbygoogle adsbygoogle-noablate">` at the end of `<body>`, 0x0,
 * `display:none`. Observed on this site: injected on every recorded navigation
 * (10 of 10 runs), with `data-ad-status="unfilled"` in all 140 samples and
 * `filled` never once. That element is not in the delivered HTML, so
 * `scripts/validate-ads.mjs` cannot see it and makes no claim about it —
 * "zero ad slots" below always means zero in the delivered markup. Auto ads is
 * controlled in the AdSense console, not in this file; whether it is currently
 * on has to be checked there, and switching it off is the only way to stop
 * that injection.
 *
 * `scripts/validate-ads.mjs` asserts all three build states after every build:
 * no credentials → zero ad tokens; ID but ads off → exactly one loader per page
 * and zero ad slots in the delivered markup; ads on → tag present, ads.txt
 * valid, per-page cap respected.
 */

/** Ad networks this codebase knows how to render. */
export type AdNetwork = 'adsense' | 'mediavine' | 'none';

/** Every ad position the layouts can ask for. */
export type AdPlacementId =
  | 'header'
  | 'in-content'
  | 'below-game'
  | 'sidebar'
  | 'footer';

/**
 * Labels allowed above an ad. AdSense policy requires ads to be labelled, and
 * requires the label not to imply the ad is site content ("Recommended",
 * "You may like" and similar are policy violations).
 */
export type AdLabel = 'Advertisement' | 'Sponsored';

export interface AdPlacement {
  readonly id: AdPlacementId;
  /** Text shown above the ad. */
  readonly label: AdLabel;
  /**
   * Height reserved on screens narrower than 1024px, in pixels.
   * `0` means the placement does not render on mobile at all.
   */
  readonly minHeightMobile: number;
  /** Height reserved from 1024px up. `0` means desktop-only suppression. */
  readonly minHeightDesktop: number;
  /** AdSense ad-unit id. Read from the AdSense dashboard once ads are on. */
  readonly adsenseSlotId: string;
  /** AdSense `data-ad-format`. */
  readonly format: 'auto' | 'fluid' | 'rectangle' | 'horizontal' | 'vertical';
  /** AdSense `data-full-width-responsive`. */
  readonly fullWidthResponsive: boolean;
  /** Plain-language note explaining where this slot appears. */
  readonly note: string;
}

/* ---------------------------------------------------------------------------
   THE MASTER SWITCH
   --------------------------------------------------------------------------- */

/**
 * Change this to `true` after AdSense approves the site.
 *
 * `PUBLIC_ADS_ENABLED=true|false` in `.env` overrides it without editing code,
 * which is what CI uses to prove both states behave correctly. The committed
 * default — the state the site is delivered in — is `false`.
 */
const ENABLED_IN_CODE = false;

const ENV_SWITCH = (import.meta.env['PUBLIC_ADS_ENABLED'] ?? '').trim().toLowerCase();

/** Explicit `: boolean` keeps TypeScript from narrowing this to the literal `false`. */
const ENABLED: boolean =
  ENV_SWITCH === 'true' ? true : ENV_SWITCH === 'false' ? false : ENABLED_IN_CODE;

/** Which network to render. Change to 'mediavine' when you switch. */
const NETWORK: AdNetwork = 'adsense';

/* ---------------------------------------------------------------------------
   Credentials, read from .env
   --------------------------------------------------------------------------- */

const RAW_PUBLISHER_ID = (import.meta.env['PUBLIC_ADSENSE_PUB_ID'] ?? '').trim();
const RAW_MEDIAVINE_ID = (import.meta.env['PUBLIC_MEDIAVINE_SITE_ID'] ?? '').trim();

/** `ca-pub-` followed by 16 digits. Anything else is a typo, not an ID. */
const PUBLISHER_ID_PATTERN = /^ca-pub-\d{16}$/;

const PUBLISHER_ID: string = PUBLISHER_ID_PATTERN.test(RAW_PUBLISHER_ID)
  ? RAW_PUBLISHER_ID
  : '';

const MEDIAVINE_SITE_ID: string = /^[a-z0-9-]{3,64}$/i.test(RAW_MEDIAVINE_ID)
  ? RAW_MEDIAVINE_ID
  : '';

/* ---------------------------------------------------------------------------
   Placements
   --------------------------------------------------------------------------- */

const PLACEMENTS: Readonly<Record<AdPlacementId, AdPlacement>> = {
  header: {
    id: 'header',
    label: 'Advertisement',
    // Nothing above the fold on mobile: that slot would become the LCP element
    // and drag the whole page's Core Web Vitals down.
    minHeightMobile: 0,
    minHeightDesktop: 90,
    adsenseSlotId: '',
    format: 'horizontal',
    fullWidthResponsive: true,
    note: 'Leaderboard directly under the site header, desktop only.',
  },
  'below-game': {
    id: 'below-game',
    label: 'Advertisement',
    minHeightMobile: 280,
    minHeightDesktop: 280,
    adsenseSlotId: '',
    format: 'auto',
    fullWidthResponsive: true,
    note: 'Under the game frame, separated by the 150px safety gap.',
  },
  'in-content': {
    id: 'in-content',
    label: 'Advertisement',
    minHeightMobile: 280,
    minHeightDesktop: 280,
    adsenseSlotId: '',
    format: 'fluid',
    fullWidthResponsive: true,
    note: 'Between two prose sections, roughly half way down the article.',
  },
  sidebar: {
    id: 'sidebar',
    label: 'Advertisement',
    minHeightMobile: 0,
    minHeightDesktop: 600,
    adsenseSlotId: '',
    format: 'vertical',
    fullWidthResponsive: false,
    note: 'Sticky 300x600 in the right rail. Desktop only — there is no rail on mobile.',
  },
  footer: {
    id: 'footer',
    label: 'Advertisement',
    minHeightMobile: 100,
    minHeightDesktop: 90,
    adsenseSlotId: '',
    format: 'horizontal',
    fullWidthResponsive: true,
    note: 'Above the footer, after the reader has finished the article.',
  },
};

/* ---------------------------------------------------------------------------
   Public configuration object
   --------------------------------------------------------------------------- */

/**
 * The public configuration object.
 *
 * The explicit annotation is deliberate: without it, TypeScript's const-object
 * property narrowing collapses `network` to the literal `'adsense'`, which makes
 * the `switch` in `hasCredentials()` and the comparisons in `adsActive()` /
 * `describeAdState()` fail to type-check ("no overlap"). With `network: AdNetwork`
 * the union survives, so switching networks later stays type-safe.
 */
export const adsConfig: {
  readonly enabled: boolean;
  readonly network: AdNetwork;
  readonly publisherId: string;
  readonly mediavineSiteId: string;
  readonly placements: Readonly<Record<AdPlacementId, AdPlacement>>;
  readonly maxPerPage: number;
  readonly lazyRootMargin: string;
  readonly gameAdGapPx: number;
} = {
  /**
   * The master switch. When false, no ad slot is rendered anywhere. The AdSense
   * loader still ships as long as a publisher ID exists, because AdSense
   * requires the ID on the page before it will start a site review.
   */
  enabled: ENABLED,

  /** Which ad network's markup to render. */
  network: NETWORK,

  /** AdSense publisher ID, or '' when it has not been configured yet. */
  publisherId: PUBLISHER_ID,

  /** Mediavine site ID, or '' when it has not been configured yet. */
  mediavineSiteId: MEDIAVINE_SITE_ID,

  /** Ad slot definitions, keyed by placement id. */
  placements: PLACEMENTS,

  /**
   * How many ads a single page may render. AdSense removed its hard 3-ad cap
   * years ago, but a page dense with ads is judged as low value by both the
   * Helpful Content system and human policy reviewers.
   */
  maxPerPage: 3,

  /**
   * Distance from the viewport at which a slot starts loading. Loading ads only
   * as they approach the screen is worth roughly 200ms of INP on mobile.
   */
  lazyRootMargin: '250px',

  /**
   * Minimum gap in pixels between the game frame and the nearest ad. AdSense
   * treats an ad next to a game control as an accidental-click design, which is
   * an account-level violation rather than a page-level one.
   */
  gameAdGapPx: 150,
};

/* ---------------------------------------------------------------------------
   Derived state
   --------------------------------------------------------------------------- */

/**
 * Whether the configured network has everything it needs to render.
 * An enabled network with no credentials would emit broken markup, so the
 * components treat that as "off" and `validate-ads.mjs` explains why.
 */
export function hasCredentials(): boolean {
  switch (adsConfig.network) {
    case 'adsense':
      return adsConfig.publisherId !== '';
    case 'mediavine':
      return adsConfig.mediavineSiteId !== '';
    case 'none':
      return false;
    default:
      return false;
  }
}

/**
 * The single boolean every component asks before rendering anything ad-related.
 *
 * @returns True only when ads are switched on AND the network is configured.
 */
export function adsActive(): boolean {
  return adsConfig.enabled && adsConfig.network !== 'none' && hasCredentials();
}

/**
 * Look up a placement definition.
 *
 * @param id The placement id.
 * @returns The placement configuration.
 * @throws When the id is not a known placement — a typo in a layout should not
 *         silently produce an invisible ad slot.
 */
export function getPlacement(id: AdPlacementId): AdPlacement {
  const placement = adsConfig.placements[id];
  if (placement === undefined) {
    throw new Error(
      `Unknown ad placement "${id}". Valid placements are: ` +
        `${Object.keys(adsConfig.placements).join(', ')}. ` +
        'Add a new one in src/config/ads.ts before using it in a layout.',
    );
  }
  return placement;
}

/**
 * One-line description of the current ad state, printed by `npm run doctor`
 * and by the ads validator.
 */
export function describeAdState(): string {
  if (!adsConfig.enabled) {
    if (adsConfig.network === 'adsense' && adsConfig.publisherId !== '') {
      return (
        'OFF — no ad slots are rendered; only the AdSense loader is emitted so that ' +
        'AdSense can read the publisher ID during site review (src/config/ads.ts → ENABLED_IN_CODE).'
      );
    }
    return (
      'OFF — no ad code at all: no publisher ID is configured in .env, so there is ' +
      'nothing to load and nothing to render (src/config/ads.ts → ENABLED_IN_CODE).'
    );
  }
  if (adsConfig.network === 'none') {
    return 'OFF — ads are enabled but the network is set to "none".';
  }
  if (!hasCredentials()) {
    return `ON but NOT rendering — network "${adsConfig.network}" has no credentials in .env.`;
  }
  return `ON — network "${adsConfig.network}".`;
}
