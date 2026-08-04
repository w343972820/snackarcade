/**
 * SEO and navigation constants introduced by the blog increment (T01).
 *
 * These are the numbers the content validator, the sitemap and the header/footer
 * all rely on. A regression here would silently change what the validator
 * enforces or how many links the mobile nav carries, so the constants are pinned
 * in tests.
 */
import { describe, expect, it } from 'vitest';

import { WORD_COUNT_FLOORS } from '@/config/seo';
import {
  FOOTER_STATIC_COLUMNS,
  MAIN_NAV_CATEGORY_LIMIT,
  MAIN_NAV_STATIC,
} from '@/config/nav';

describe('WORD_COUNT_FLOORS', () => {
  it('enforces a 600-word floor for blog posts', () => {
    expect(WORD_COUNT_FLOORS.BLOG_POST).toBe(600);
  });
});

describe('MAIN_NAV_STATIC', () => {
  it('links the Blog section from the header', () => {
    expect(MAIN_NAV_STATIC.map((link) => link.href)).toContain('/blog/');
  });

  it('keeps the header at five items on mobile (3 static + 2 categories)', () => {
    // The mobile nav limit is five items total. Three slots are already taken
    // by All Games / New / Blog, so the category resolver may add at most two.
    expect(MAIN_NAV_CATEGORY_LIMIT).toBe(2);
    expect(MAIN_NAV_STATIC.length + MAIN_NAV_CATEGORY_LIMIT).toBeLessThanOrEqual(5);
  });
});

describe('FOOTER_STATIC_COLUMNS', () => {
  it('links Blog from the footer Browse column', () => {
    const browse = FOOTER_STATIC_COLUMNS.find((column) => column.heading === 'Browse');
    expect(browse).toBeDefined();
    expect(browse?.links.map((link) => link.href)).toContain('/blog/');
  });
});
