/**
 * SEO thresholds and hard limits.
 *
 * These numbers are enforced by `src/lib/seo/meta.ts` (which throws at build
 * time) and `src/lib/seo/indexability.ts`. Changing a value here changes the
 * behaviour everywhere at once.
 */

/** Title and description length limits, in characters. */
export const META_LIMITS = {
  /** Google truncates around 60 characters on desktop. */
  TITLE_MAX: 60,
  /** Below this a title is almost certainly missing the brand or a keyword. */
  TITLE_MIN: 15,
  /** Google truncates around 160; 158 leaves a safety margin. */
  DESCRIPTION_MAX: 158,
  /** Below this the snippet looks thin and Google often rewrites it. */
  DESCRIPTION_MIN: 70,
} as const;

/**
 * Minimum item counts before a listing page is worth indexing.
 * A tag page with 2 games is a thin page; indexing it dilutes the whole site.
 */
export const SEO_THRESHOLDS = {
  TAG_MIN_GAMES: 6,
  COLLECTION_MIN_GAMES: 10,
} as const;

/** Items per page for each kind of listing. */
export const PAGE_SIZES = {
  CATEGORY: 24,
  TAG: 36,
  ALL_GAMES: 48,
  NEW: 48,
} as const;

/** Number of Similar Games links generated per game page. */
export const SIMILAR_GAMES = {
  MIN: 6,
  MAX: 12,
  /** Minimum inbound links each game must receive, to prevent orphan pages. */
  MIN_IN_DEGREE: 3,
} as const;

/** Minimum original word counts enforced by the content validator. */
export const WORD_COUNT_FLOORS = {
  GAME_SELF_HOSTED: 450,
  GAME_IFRAME: 400,
  CATEGORY_INTRO: 300,
  HOMEPAGE_EDITORIAL: 300,
} as const;
