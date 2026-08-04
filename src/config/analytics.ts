/**
 * Analytics configuration.
 *
 * Analytics is entirely optional: with no `PUBLIC_GA4_ID` set, the site ships
 * zero analytics scripts and needs a simpler cookie banner.
 */

const rawMeasurementId = (import.meta.env['PUBLIC_GA4_ID'] ?? '').trim();

/** GA4 measurement IDs look like `G-XXXXXXXXXX`. */
const GA4_ID_PATTERN = /^G-[A-Z0-9]{6,12}$/i;

export const analyticsConfig = {
  /** Measurement ID, or an empty string when analytics is disabled. */
  measurementId: GA4_ID_PATTERN.test(rawMeasurementId) ? rawMeasurementId : '',

  /** True only when a syntactically valid ID was supplied. */
  get enabled(): boolean {
    return this.measurementId.length > 0;
  },

  /** Load gtag.js only once the browser is idle, protecting LCP and INP. */
  loadStrategy: 'on-idle' as 'immediate' | 'on-idle',

  /**
   * Custom event names (R-019). Keep these stable — renaming an event splits
   * its history in the GA4 reports.
   */
  events: {
    GAME_START: 'game_start',
    GAME_FULLSCREEN: 'game_fullscreen',
    SIMILAR_GAME_CLICK: 'similar_game_click',
    CATEGORY_CLICK: 'category_click',
  },
} as const;

/**
 * Consent Mode v2 defaults.
 *
 * Everything is denied in the EEA, UK and Switzerland until the user opts in;
 * granted elsewhere. The region list is applied by `ConsentBootstrap.astro`,
 * which must be the first script on the page.
 */
export const CONSENT_DENIED_REGIONS: readonly string[] = [
  'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR',
  'HU', 'IS', 'IE', 'IT', 'LV', 'LI', 'LT', 'LU', 'MT', 'NL', 'NO', 'PL',
  'PT', 'RO', 'SK', 'SI', 'ES', 'SE', 'GB', 'CH',
];
