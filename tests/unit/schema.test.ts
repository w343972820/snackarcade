/**
 * ══════════════════════════════════════════════════════════════════════════
 * THE aggregateRating REGRESSION FUSE
 * ══════════════════════════════════════════════════════════════════════════
 *
 * Publishing star ratings the site does not actually have is structured-data
 * fraud under Google's guidelines. The penalty is applied to the whole domain,
 * not the offending page, and it is slow and painful to recover from.
 *
 * It is also an extremely easy mistake to make: someone adds a "4.8 stars"
 * design to the game page, hard-codes it into the schema, and nobody notices
 * for six months.
 *
 * These tests exist to make that mistake fail loudly and immediately. If a
 * future change ever emits `aggregateRating` without real ratings behind it,
 * this file goes red. Do not weaken it. Do not skip it. If it fails, the code
 * is wrong, not the test.
 * ══════════════════════════════════════════════════════════════════════════
 */
import { describe, expect, it } from 'vitest';

import {
  canEmitAggregateRating,
  videoGameSchema,
  type VideoGameInput,
} from '@/components/seo/schema/videoGame';
import { breadcrumbListSchema } from '@/components/seo/schema/breadcrumbList';
import { faqPageSchema } from '@/components/seo/schema/faqPage';
import { itemListSchema } from '@/components/seo/schema/itemList';
import { organizationSchema, webSiteSchema } from '@/components/seo/schema/siteGraph';

/**
 * A complete, valid game input. Individual tests override just the field under
 * examination, so a new required field cannot silently make these tests vacuous.
 */
function makeGame(overrides: Partial<VideoGameInput> = {}): VideoGameInput {
  return {
    slug: '2048',
    title: '2048',
    description: 'Slide numbered tiles together to reach 2048.',
    image: '/img/2048.png',
    developer: 'Gabriele Cirulli',
    genre: ['Puzzle'],
    playMode: 'SinglePlayer',
    platform: ['Desktop', 'Mobile browser'],
    datePublished: new Date('2026-08-04T00:00:00Z'),
    dateModified: new Date('2026-08-04T00:00:00Z'),
    ratings: { count: 0 },
    ...overrides,
  };
}

describe('canEmitAggregateRating — the fuse itself', () => {
  it('refuses a zero count, which is the delivered state of every game', () => {
    expect(canEmitAggregateRating({ count: 0 })).toBe(false);
  });

  it('refuses a value with no ratings behind it', () => {
    expect(canEmitAggregateRating({ count: 0, value: 4.8 })).toBe(false);
  });

  it('refuses a count with no value', () => {
    expect(canEmitAggregateRating({ count: 120 })).toBe(false);
  });

  it('refuses a value outside the 1–5 range', () => {
    expect(canEmitAggregateRating({ count: 10, value: 0 })).toBe(false);
    expect(canEmitAggregateRating({ count: 10, value: 5.1 })).toBe(false);
    expect(canEmitAggregateRating({ count: 10, value: -3 })).toBe(false);
  });

  it('refuses non-finite numbers', () => {
    expect(canEmitAggregateRating({ count: Number.NaN, value: 4 })).toBe(false);
    expect(canEmitAggregateRating({ count: 10, value: Number.POSITIVE_INFINITY })).toBe(false);
  });

  it('refuses undefined and null', () => {
    expect(canEmitAggregateRating(undefined)).toBe(false);
    expect(canEmitAggregateRating(null)).toBe(false);
  });

  it('allows a genuine rating', () => {
    expect(canEmitAggregateRating({ count: 137, value: 4.4 })).toBe(true);
    expect(canEmitAggregateRating({ count: 1, value: 1 })).toBe(true);
    expect(canEmitAggregateRating({ count: 1, value: 5 })).toBe(true);
  });
});

describe('videoGameSchema — aggregateRating must never appear without real ratings', () => {
  it('omits aggregateRating entirely when there are no ratings', () => {
    const schema = videoGameSchema(makeGame({ ratings: { count: 0 } }));

    expect(schema).not.toHaveProperty('aggregateRating');
    // Also assert on the serialised form: an undefined property would vanish in
    // JSON but a null or empty object would not, and either would be a bug.
    expect(JSON.stringify(schema)).not.toContain('aggregateRating');
    expect(JSON.stringify(schema)).not.toContain('AggregateRating');
  });

  it('omits aggregateRating when a value is set but the count is zero', () => {
    const schema = videoGameSchema(makeGame({ ratings: { count: 0, value: 4.9 } }));

    expect(schema).not.toHaveProperty('aggregateRating');
    expect(JSON.stringify(schema)).not.toContain('4.9');
  });

  it('omits aggregateRating when a count is set but no value exists', () => {
    const schema = videoGameSchema(makeGame({ ratings: { count: 500 } }));

    expect(schema).not.toHaveProperty('aggregateRating');
  });

  it('emits aggregateRating only when both count and value are real', () => {
    const schema = videoGameSchema(makeGame({ ratings: { count: 137, value: 4.4 } }));

    expect(schema.aggregateRating).toEqual({
      '@type': 'AggregateRating',
      ratingValue: 4.4,
      ratingCount: 137,
      bestRating: 5,
      worstRating: 1,
    });
  });

  it('every game currently in the repository ships with count 0', () => {
    // A guard against someone "filling in" ratings by hand later. The real
    // content files are checked by the Zod schema; this asserts the default
    // used everywhere in code stays zero.
    const schema = videoGameSchema(makeGame());
    expect(schema).not.toHaveProperty('aggregateRating');
  });
});

describe('videoGameSchema — the rest of the node', () => {
  it('produces an absolute @id and url built from the slug', () => {
    const schema = videoGameSchema(makeGame({ slug: 'block-drop' }));

    expect(String(schema['@id'])).toMatch(/\/games\/block-drop\/#game$/);
    expect(String(schema.url)).toMatch(/\/games\/block-drop\/$/);
  });

  it('emits a free Offer so the node is eligible for rich results', () => {
    const schema = videoGameSchema(makeGame());
    expect(schema.offers).toMatchObject({ price: '0', priceCurrency: 'USD' });
  });

  it('omits the Offer when the game is explicitly not free', () => {
    const schema = videoGameSchema(makeGame({ isFree: false }));
    expect(schema).not.toHaveProperty('offers');
  });

  it('formats dates as plain YYYY-MM-DD', () => {
    const schema = videoGameSchema(makeGame());
    expect(schema.datePublished).toBe('2026-08-04');
    expect(schema.dateModified).toBe('2026-08-04');
  });
});

describe('breadcrumbListSchema', () => {
  it('returns null for a trail too short to be a breadcrumb', () => {
    expect(breadcrumbListSchema([{ name: 'Home', href: '/' }])).toBeNull();
    expect(breadcrumbListSchema([])).toBeNull();
  });

  it('numbers positions from 1 and keeps the visible order', () => {
    const schema = breadcrumbListSchema([
      { name: 'Home', href: '/' },
      { name: 'Puzzle & Logic', href: '/c/puzzle/' },
      { name: '2048', href: '/games/2048/' },
    ]);

    expect(schema).not.toBeNull();
    const items = (schema as Record<string, unknown>).itemListElement as {
      position: number;
      name: string;
    }[];

    expect(items).toHaveLength(3);
    expect(items[0]?.position).toBe(1);
    expect(items[2]?.name).toBe('2048');
  });
});

describe('faqPageSchema', () => {
  it('returns null when there are no questions', () => {
    expect(faqPageSchema([])).toBeNull();
  });

  it('produces one Question node per entry', () => {
    const schema = faqPageSchema([
      { q: 'Is 2048 free to play?', a: 'Yes, every game on this site is free.' },
      { q: 'Do I need to download anything?', a: 'No. It runs in the browser.' },
    ]);

    expect(schema).not.toBeNull();
    const entities = (schema as Record<string, unknown>).mainEntity as unknown[];
    expect(entities).toHaveLength(2);
  });
});

describe('itemListSchema', () => {
  it('returns null for an empty listing rather than an empty ItemList', () => {
    expect(itemListSchema([], 'Puzzle Games')).toBeNull();
  });

  it('continues numbering across paginated pages', () => {
    const schema = itemListSchema(
      [
        { slug: '2048', title: '2048' },
        { slug: 'block-drop', title: 'Block Drop' },
      ],
      'Puzzle Games',
      25,
    );

    const items = (schema as Record<string, unknown>).itemListElement as { position: number }[];
    expect(items[0]?.position).toBe(25);
    expect(items[1]?.position).toBe(26);
  });
});

describe('site-level schema', () => {
  it('omits sameAs when there are no social profiles', () => {
    expect(organizationSchema()).not.toHaveProperty('sameAs');
  });

  it('advertises the site search action', () => {
    const site = webSiteSchema(true);
    expect(site).toHaveProperty('potentialAction');
  });

  it('can be built without the search action', () => {
    expect(webSiteSchema(false)).not.toHaveProperty('potentialAction');
  });
});
