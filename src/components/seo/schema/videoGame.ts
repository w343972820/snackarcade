/**
 * VideoGame structured data.
 *
 * ── THE RULE THAT MATTERS MOST IN THIS FILE ──────────────────────────────────
 * `aggregateRating` is emitted ONLY when real ratings exist. Publishing a star
 * rating you do not have is structured-data fraud under Google's guidelines,
 * and the penalty is applied site-wide rather than to the offending page. There
 * is a unit test (tests/unit/schema.test.ts) whose only job is to fail if this
 * behaviour is ever weakened.
 * ─────────────────────────────────────────────────────────────────────────────
 */
import { absoluteUrl, SITE } from '@/config/site';
import { gamePath } from '@/lib/utils/url';

export interface RatingsInput {
  /** Number of real ratings collected. Zero means "no ratings yet". */
  count: number;
  /** Average score from 1 to 5. Undefined when no ratings exist. */
  value?: number | undefined;
}

export interface VideoGameInput {
  slug: string;
  title: string;
  description: string;
  /** Absolute or site-relative cover image URL. */
  image: string;
  /** Where the game can be played — normally the page's own URL. */
  playUrl?: string;
  developer: string;
  developerUrl?: string | undefined;
  genre: readonly string[];
  /** SinglePlayer | MultiPlayer | CoOp */
  playMode: string;
  platform: readonly string[];
  datePublished: Date;
  dateModified: Date;
  ratings: RatingsInput;
  /** Applications need an offer to be eligible for rich results; ours are free. */
  isFree?: boolean;
}

/** Minimal shape of the JSON-LD object this module produces. */
export type JsonLdObject = Record<string, unknown>;

/**
 * Decide whether an aggregateRating block may be emitted.
 *
 * Both conditions must hold: at least one real rating, and a value inside the
 * 1–5 range. Anything else returns false and the block is omitted entirely.
 *
 * Exported so the regression test can assert on it directly.
 *
 * @param ratings The ratings recorded in the content file.
 * @returns True only when a genuine, publishable rating exists.
 */
export function canEmitAggregateRating(ratings: RatingsInput | undefined | null): boolean {
  if (ratings === undefined || ratings === null) return false;
  if (!Number.isFinite(ratings.count) || ratings.count < 1) return false;
  if (ratings.value === undefined || ratings.value === null) return false;
  if (!Number.isFinite(ratings.value)) return false;
  if (ratings.value < 1 || ratings.value > 5) return false;
  return true;
}

/**
 * Build the VideoGame JSON-LD object for a game detail page.
 *
 * @param input Game facts drawn from the content file.
 * @returns A JSON-LD object ready to be serialised into a script tag.
 */
export function videoGameSchema(input: VideoGameInput): JsonLdObject {
  const url = absoluteUrl(gamePath(input.slug));

  const schema: JsonLdObject = {
    '@type': 'VideoGame',
    '@id': `${url}#game`,
    name: input.title,
    url,
    description: input.description,
    image: absoluteUrl(input.image),
    inLanguage: SITE.locale,
    genre: [...input.genre],
    gamePlatform: [...input.platform],
    playMode: input.playMode,
    applicationCategory: 'Game',
    operatingSystem: 'Any (web browser)',
    datePublished: input.datePublished.toISOString().slice(0, 10),
    dateModified: input.dateModified.toISOString().slice(0, 10),
    author: {
      '@type': 'Person',
      name: input.developer,
      ...(input.developerUrl ? { url: input.developerUrl } : {}),
    },
    publisher: {
      '@type': 'Organization',
      name: SITE.name,
      url: SITE.url,
    },
  };

  if (input.playUrl !== undefined) {
    schema.playUrl = input.playUrl;
  }

  if (input.isFree !== false) {
    schema.offers = {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    };
  }

  // ── The fuse ──────────────────────────────────────────────────────────────
  // Do not "simplify" this by always emitting the block with count: 0.
  // Google rejects aggregateRating with ratingCount 0, and inventing a value
  // is a manual-action risk for the entire domain.
  if (canEmitAggregateRating(input.ratings)) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: input.ratings.value,
      ratingCount: input.ratings.count,
      bestRating: 5,
      worstRating: 1,
    };
  }

  return schema;
}
