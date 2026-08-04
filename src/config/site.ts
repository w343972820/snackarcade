/**
 * Site-wide identity and contact details.
 *
 * This is the ONE place to change the site name, domain or contact email.
 * Nothing else in the codebase should hard-code any of these values.
 */
import { SITE_URL, IS_PLACEHOLDER_SITE_URL } from './site-url.mjs';

export interface SiteConfig {
  /** Brand name, used in titles, Organization schema and the footer. */
  readonly name: string;
  /** Canonical origin with no trailing slash, e.g. https://snackarcade.com */
  readonly url: string;
  /** One-line positioning statement shown under the logo in the footer. */
  readonly tagline: string;
  /** Longer description used for the Organization / WebSite schema. */
  readonly description: string;
  /** Public contact address. Must be a real, monitored inbox for AdSense review. */
  readonly email: string;
  /** BCP-47 language tag for <html lang> and schema inLanguage. */
  readonly locale: string;
  /** og:locale value. */
  readonly ogLocale: string;
  /** Default social sharing image, relative to the site root. */
  readonly defaultOgImage: string;
  /** Year the site started publishing, used in the footer copyright range. */
  readonly foundingYear: number;
  /** Optional social profiles, emitted as Organization.sameAs when non-empty. */
  readonly sameAs: readonly string[];
}

export const SITE: SiteConfig = {
  name: 'SnackArcade',
  url: SITE_URL,
  tagline: 'Free browser games with real guides. No download, no sign-up.',
  description:
    'Play free online games right in your browser. No download, no sign-up, no plugins. ' +
    'Puzzle, card, word and arcade games, each with a full how-to-play guide, controls and tips.',
  email: 'hello@snackarcade.com',
  locale: 'en',
  ogLocale: 'en_US',
  defaultOgImage: '/og-default.png',
  foundingYear: 2026,
  sameAs: [],
};

/** True while the build is still using the placeholder domain. */
export const USING_PLACEHOLDER_DOMAIN = IS_PLACEHOLDER_SITE_URL;

/**
 * Build an absolute URL from a site-relative path.
 * Always returns a trailing slash for page URLs, matching `trailingSlash: 'always'`.
 */
export function absoluteUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `${SITE.url}${clean}`;
}
