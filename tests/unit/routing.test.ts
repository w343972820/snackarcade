/**
 * Conditional route generation for taxonomy pages.
 *
 * The rule these predicates encode is "generated AND indexable, or not
 * generated at all". They are shared by the routes (`src/pages/t/[slug].astro`,
 * `src/pages/c/[slug].astro`), by the navigation resolver and by the tag chips
 * on a game page, so a disagreement between any two of those shows up here
 * first.
 */
import { describe, expect, it } from 'vitest';

import { SEO_THRESHOLDS } from '@/config/seo';
import {
  countTagOccurrences,
  shouldGenerateCategoryPage,
  shouldGenerateTagPage,
} from '@/lib/seo/routing';
import { decide } from '@/lib/seo/indexability';

describe('shouldGenerateTagPage', () => {
  it('refuses tags below the indexing threshold', () => {
    expect(shouldGenerateTagPage(0)).toBe(false);
    expect(shouldGenerateTagPage(1)).toBe(false);
    expect(shouldGenerateTagPage(SEO_THRESHOLDS.TAG_MIN_GAMES - 1)).toBe(false);
  });

  it('allows tags at or above the threshold', () => {
    expect(shouldGenerateTagPage(SEO_THRESHOLDS.TAG_MIN_GAMES)).toBe(true);
    expect(shouldGenerateTagPage(SEO_THRESHOLDS.TAG_MIN_GAMES + 40)).toBe(true);
  });

  it('honours forceNoindex regardless of the count', () => {
    expect(shouldGenerateTagPage(SEO_THRESHOLDS.TAG_MIN_GAMES + 10, true)).toBe(false);
  });

  it('never generates a tag page that decide() would mark noindex', () => {
    // This is the invariant the whole change rests on: no page may exist that
    // the indexability rules would exclude from the sitemap.
    for (let count = 0; count <= SEO_THRESHOLDS.TAG_MIN_GAMES + 3; count += 1) {
      if (!shouldGenerateTagPage(count)) continue;
      expect(decide({ kind: 'tag', pathname: '/t/x/', itemCount: count }).indexable).toBe(true);
    }
  });
});

describe('shouldGenerateCategoryPage', () => {
  it('refuses categories with no games', () => {
    expect(shouldGenerateCategoryPage(0)).toBe(false);
  });

  it('allows a category with even one game', () => {
    expect(shouldGenerateCategoryPage(1)).toBe(true);
    expect(shouldGenerateCategoryPage(24)).toBe(true);
  });

  it('never generates a category page that decide() would mark noindex', () => {
    for (let count = 0; count <= 5; count += 1) {
      if (!shouldGenerateCategoryPage(count)) continue;
      expect(decide({ kind: 'category', pathname: '/c/x/', itemCount: count }).indexable).toBe(true);
    }
  });
});

describe('countTagOccurrences', () => {
  it('counts each tag across every item', () => {
    const counts = countTagOccurrences([
      ['puzzle', 'no-download'],
      ['no-download', 'retro'],
      ['no-download'],
    ]);

    expect(counts.get('no-download')).toBe(3);
    expect(counts.get('puzzle')).toBe(1);
    expect(counts.get('retro')).toBe(1);
  });

  it('omits tags nobody uses and handles an empty corpus', () => {
    expect(countTagOccurrences([]).size).toBe(0);
    expect(countTagOccurrences([[], []]).size).toBe(0);
    expect(countTagOccurrences([['a']]).get('missing')).toBeUndefined();
  });
});
