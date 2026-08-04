/**
 * Regression tests for the Similar Games internal-link graph.
 *
 * These are the four properties the architecture document calls out for T04,
 * and each one maps to a real failure mode:
 *
 *   1. Out-degree stays in [6, 12]  — too few links strands PageRank, too many
 *      dilutes it and makes the block look like a link farm.
 *   2. Minimum in-degree >= 3       — a game nobody links to is an orphan page
 *      and often never gets indexed.
 *   3. Byte-identical output for identical input — otherwise every deploy
 *      rewrites every page's internal links and Google re-crawls the whole site
 *      for nothing.
 *   4. Universal tags cannot create a match — `no-download` is on every game;
 *      if it produced similarity, a word game would be "similar to" a racing
 *      game and the whole module would be noise.
 *
 * The site currently has three games, which is far too few to exercise any of
 * this, so the corpus below is a synthetic 40-game fixture.
 */
import { describe, expect, it } from 'vitest';

import {
  buildSimilarityGraph,
  buildSimilarityGraphCached,
  computeIdf,
  featureSet,
  inDegrees,
  similarityScore,
  toSimilarityGame,
  type SimilarityGame,
  type SimilarityGraph,
} from '@/lib/related/similar';
import { SIMILAR_GAMES } from '@/config/seo';

/* =============================================================================
   Fixture
   ============================================================================= */

const CATEGORY_IDS = [
  'action',
  'arcade',
  'card-board',
  'idle',
  'puzzle',
  'racing',
  'two-player',
  'word',
] as const;

type CategoryId = (typeof CATEGORY_IDS)[number];

/** Rare, category-specific tags. These are the ones that should drive matches. */
const THEME_TAGS: Readonly<Record<CategoryId, readonly string[]>> = {
  action: ['ninja', 'boss-rush', 'reflex'],
  arcade: ['high-score', 'pixel-art', 'endless'],
  'card-board': ['solitaire', 'deck-building', 'dice'],
  idle: ['incremental', 'prestige', 'offline-progress'],
  puzzle: ['sokoban', 'tile-merge', 'match-three'],
  racing: ['drift', 'time-trial', 'stunt'],
  'two-player': ['split-screen', 'turn-based-duel', 'local-versus'],
  word: ['anagram', 'vocabulary', 'crossword'],
};

const MECHANICS = [
  'grid-movement',
  'timer-pressure',
  'combo-chain',
  'resource-collect',
  'pattern-match',
  'physics',
] as const;

/**
 * Tags carried by every single game — exactly the situation the IDF weighting
 * exists to neutralise.
 */
const UNIVERSAL_TAGS = ['no-download', 'free'] as const;

/** Feature tokens the universal tags produce. */
const UNIVERSAL_FEATURES = new Set(UNIVERSAL_TAGS.map((tag) => `tag:${tag}`));

const FIXTURE_SIZE = 40;

/**
 * Indexed access that fails loudly instead of returning `undefined`.
 *
 * @param values Source array.
 * @param index Position to read.
 * @returns The element at `index`.
 */
function at<T>(values: readonly T[], index: number): T {
  const value = values[index];
  if (value === undefined) {
    throw new Error(`Fixture index ${index} is out of range (length ${values.length}).`);
  }
  return value;
}

/**
 * Build a deterministic 40-game corpus spread across 8 categories.
 *
 * Every game carries the two universal tags plus two rare category-specific
 * tags, a rotating secondary category, and two mechanics. That gives the graph
 * real structure to find while keeping a large block of worthless shared
 * signal for the IDF weighting to discard.
 *
 * @returns Exactly `FIXTURE_SIZE` games, in a fixed order.
 */
function buildFixture(): SimilarityGame[] {
  const games: SimilarityGame[] = [];

  for (let index = 0; index < FIXTURE_SIZE; index += 1) {
    const categoryIndex = index % CATEGORY_IDS.length;
    const variant = Math.floor(index / CATEGORY_IDS.length);

    const primary = at(CATEGORY_IDS, categoryIndex);
    const secondaryIndex = (categoryIndex + 1 + variant) % CATEGORY_IDS.length;
    const secondary = at(CATEGORY_IDS, secondaryIndex);

    const theme = THEME_TAGS[primary];

    games.push({
      slug: `game-${String(index).padStart(2, '0')}-${primary}`,
      primaryCategory: primary,
      categories: secondary === primary ? [primary] : [primary, secondary],
      tags: [
        ...UNIVERSAL_TAGS,
        at(theme, variant % theme.length),
        at(theme, (variant + 1) % theme.length),
      ],
      mechanics: [
        at(MECHANICS, variant % MECHANICS.length),
        at(MECHANICS, (variant + 2) % MECHANICS.length),
      ],
    });
  }

  return games;
}

/**
 * Reorder an array with a seeded linear congruential generator.
 *
 * A seeded shuffle rather than `Math.random`, because the point of the test is
 * that input order does not matter — and a test that is itself random is a test
 * that fails on a Tuesday for no reason.
 *
 * @param values Array to reorder; not mutated.
 * @param seed Generator seed.
 * @returns A reordered copy.
 */
function seededShuffle<T>(values: readonly T[], seed: number): T[] {
  const result = [...values];
  let state = seed;

  for (let index = result.length - 1; index > 0; index -= 1) {
    state = (state * 1_664_525 + 1_013_904_223) % 4_294_967_296;
    const swapWith = state % (index + 1);
    const a = at(result, index);
    const b = at(result, swapWith);
    result[index] = b;
    result[swapWith] = a;
  }

  return result;
}

/**
 * Flatten a graph into a comparable plain object.
 *
 * @param graph Graph to serialise.
 * @returns Slug -> neighbour slugs, with keys in sorted order.
 */
function toPlainObject(graph: SimilarityGraph): Record<string, string[]> {
  const result: Record<string, string[]> = {};
  for (const slug of [...graph.keys()].sort()) {
    result[slug] = [...(graph.get(slug) ?? [])];
  }
  return result;
}

/**
 * Shared features between two games, with the universal tags removed.
 *
 * @param a First game.
 * @param b Second game.
 * @returns Meaningful shared feature tokens.
 */
function meaningfulOverlap(a: SimilarityGame, b: SimilarityGame): string[] {
  const featuresB = featureSet(b);
  return [...featureSet(a)].filter(
    (feature) => featuresB.has(feature) && !UNIVERSAL_FEATURES.has(feature),
  );
}

const FIXTURE: readonly SimilarityGame[] = buildFixture();

/* =============================================================================
   Sanity checks on the fixture itself
   ============================================================================= */

describe('fixture', () => {
  it('has 40 games with unique slugs', () => {
    expect(FIXTURE).toHaveLength(FIXTURE_SIZE);
    expect(new Set(FIXTURE.map((game) => game.slug)).size).toBe(FIXTURE_SIZE);
  });

  it('puts the universal tags on every game', () => {
    for (const game of FIXTURE) {
      for (const tag of UNIVERSAL_TAGS) {
        expect(game.tags).toContain(tag);
      }
    }
  });
});

/* =============================================================================
   Requirement 4 — IDF weighting neutralises generic tags
   ============================================================================= */

describe('IDF weighting', () => {
  const idf = computeIdf(FIXTURE);

  it('gives a tag carried by every game a weight of exactly zero', () => {
    for (const tag of UNIVERSAL_TAGS) {
      expect(idf.get(`tag:${tag}`)).toBe(0);
    }
  });

  it('gives rare, category-specific tags a substantial weight', () => {
    for (const rareTag of ['sokoban', 'drift', 'anagram', 'deck-building']) {
      const weight = idf.get(`tag:${rareTag}`);
      expect(weight).toBeDefined();
      expect(weight ?? 0).toBeGreaterThan(1.5);
    }
  });

  it('scores two games that share only universal tags at zero', () => {
    const loneWordGame: SimilarityGame = {
      slug: 'lone-word-game',
      primaryCategory: 'word',
      categories: ['word'],
      tags: [...UNIVERSAL_TAGS],
      mechanics: [],
    };
    const loneRacingGame: SimilarityGame = {
      slug: 'lone-racing-game',
      primaryCategory: 'racing',
      categories: ['racing'],
      tags: [...UNIVERSAL_TAGS],
      mechanics: [],
    };

    // The only overlap is `no-download` + `free`, and both weigh nothing.
    expect(meaningfulOverlap(loneWordGame, loneRacingGame)).toHaveLength(0);
    expect(similarityScore(loneWordGame, loneRacingGame, idf)).toBe(0);
  });

  it('never ranks a generic-only match into a game\u2019s top three', () => {
    for (const game of FIXTURE) {
      const ranked = FIXTURE.filter((other) => other.slug !== game.slug)
        .map((other) => ({ other, score: similarityScore(game, other, idf) }))
        .sort((a, b) => (b.score !== a.score ? b.score - a.score : a.other.slug < b.other.slug ? -1 : 1))
        .slice(0, 3);

      for (const { other, score } of ranked) {
        expect(score).toBeGreaterThan(0);
        expect(meaningfulOverlap(game, other).length).toBeGreaterThan(0);
      }
    }
  });

  it('rates a same-category pair above a cross-category pair', () => {
    const puzzleA = FIXTURE.find((game) => game.slug === 'game-04-puzzle');
    const puzzleB = FIXTURE.find((game) => game.slug === 'game-12-puzzle');
    const racing = FIXTURE.find((game) => game.slug === 'game-05-racing');

    expect(puzzleA).toBeDefined();
    expect(puzzleB).toBeDefined();
    expect(racing).toBeDefined();

    if (puzzleA === undefined || puzzleB === undefined || racing === undefined) return;

    expect(similarityScore(puzzleA, puzzleB, idf)).toBeGreaterThan(
      similarityScore(puzzleA, racing, idf),
    );
  });
});

/* =============================================================================
   Requirements 1 and 2 — link budget and orphan rescue
   ============================================================================= */

describe('buildSimilarityGraph', () => {
  const graph = buildSimilarityGraph(FIXTURE);

  it('returns a row for every game', () => {
    expect(graph.size).toBe(FIXTURE_SIZE);
    for (const game of FIXTURE) {
      expect(graph.has(game.slug)).toBe(true);
    }
  });

  it('gives every game between 6 and 12 outbound links', () => {
    for (const game of FIXTURE) {
      const links = graph.get(game.slug) ?? [];
      expect(links.length).toBeGreaterThanOrEqual(SIMILAR_GAMES.MIN);
      expect(links.length).toBeLessThanOrEqual(SIMILAR_GAMES.MAX);
    }
  });

  it('never links a game to itself and never duplicates a link', () => {
    for (const game of FIXTURE) {
      const links = graph.get(game.slug) ?? [];
      expect(links).not.toContain(game.slug);
      expect(new Set(links).size).toBe(links.length);
    }
  });

  it('only links to slugs that exist in the corpus', () => {
    const known = new Set(FIXTURE.map((game) => game.slug));
    for (const links of graph.values()) {
      for (const link of links) {
        expect(known.has(link)).toBe(true);
      }
    }
  });

  it('leaves no orphan pages — every game has at least 3 inbound links', () => {
    const counts = inDegrees(graph);
    const lowest = Math.min(...counts.values());

    expect(counts.size).toBe(FIXTURE_SIZE);
    expect(lowest).toBeGreaterThanOrEqual(SIMILAR_GAMES.MIN_IN_DEGREE);
  });

  it('spreads inbound links instead of funnelling them into a few hubs', () => {
    const counts = [...inDegrees(graph).values()];
    const highest = Math.max(...counts);
    const average = counts.reduce((sum, value) => sum + value, 0) / counts.length;

    // Without hub damping the most-linked game collects many times the average.
    expect(highest).toBeLessThanOrEqual(average * 3);
  });

  it('orders each row by descending similarity', () => {
    const idf = computeIdf(FIXTURE);
    const bySlug = new Map(FIXTURE.map((game) => [game.slug, game]));

    for (const game of FIXTURE) {
      const links = graph.get(game.slug) ?? [];
      const scores = links.map((slug) => {
        const other = bySlug.get(slug);
        return other === undefined ? 0 : similarityScore(game, other, idf);
      });

      for (let index = 1; index < scores.length; index += 1) {
        expect(at(scores, index - 1)).toBeGreaterThanOrEqual(at(scores, index));
      }
    }
  });
});

/* =============================================================================
   Requirement 3 — determinism
   ============================================================================= */

describe('determinism', () => {
  it('produces identical output when run twice on the same input', () => {
    const first = buildSimilarityGraph(FIXTURE);
    const second = buildSimilarityGraph(FIXTURE);

    expect(toPlainObject(second)).toEqual(toPlainObject(first));
  });

  it('is unaffected by the order of the input array', () => {
    const baseline = toPlainObject(buildSimilarityGraph(FIXTURE));

    for (const seed of [1, 7, 12_345, 99_991]) {
      const shuffled = seededShuffle(FIXTURE, seed);
      expect(shuffled.map((game) => game.slug)).not.toEqual(FIXTURE.map((game) => game.slug));
      expect(toPlainObject(buildSimilarityGraph(shuffled))).toEqual(baseline);
    }
  });

  it('returns the same result from the cached wrapper', () => {
    const direct = toPlainObject(buildSimilarityGraph(FIXTURE));
    const cachedOnce = toPlainObject(buildSimilarityGraphCached(FIXTURE));
    const cachedTwice = toPlainObject(buildSimilarityGraphCached(FIXTURE));

    expect(cachedOnce).toEqual(direct);
    expect(cachedTwice).toEqual(direct);
  });

  it('ignores duplicate entries for the same slug', () => {
    const withDuplicates = [...FIXTURE, at(FIXTURE, 0), at(FIXTURE, 9)];
    const graph = buildSimilarityGraph(withDuplicates);

    expect(graph.size).toBe(FIXTURE_SIZE);
    expect(toPlainObject(graph)).toEqual(toPlainObject(buildSimilarityGraph(FIXTURE)));
  });
});

/* =============================================================================
   Small-corpus behaviour — the state the real site is in today
   ============================================================================= */

describe('small corpora', () => {
  it('returns an empty graph for no games', () => {
    expect(buildSimilarityGraph([]).size).toBe(0);
  });

  it('returns one empty row for a single game', () => {
    const graph = buildSimilarityGraph([at(FIXTURE, 0)]);
    expect(graph.size).toBe(1);
    expect(graph.get(at(FIXTURE, 0).slug)).toEqual([]);
  });

  it('links every game to every other when the corpus is smaller than the minimum', () => {
    const three = FIXTURE.slice(0, 3);
    const graph = buildSimilarityGraph(three);

    for (const game of three) {
      const links = graph.get(game.slug) ?? [];
      expect(links).toHaveLength(2);
      expect(links).not.toContain(game.slug);
    }
  });

  it('does not hang when the corpus cannot satisfy the in-degree floor', () => {
    const two = FIXTURE.slice(0, 2);
    const graph = buildSimilarityGraph(two, { minInDegree: 10 });

    for (const links of graph.values()) {
      expect(links).toHaveLength(1);
    }
  });
});

/* =============================================================================
   Content-collection adapter
   ============================================================================= */

describe('toSimilarityGame', () => {
  it('flattens a content-collection entry into a similarity descriptor', () => {
    const descriptor = toSimilarityGame({
      id: '2048',
      data: {
        taxonomy: {
          primaryCategory: { id: 'puzzle' },
          categories: [{ id: 'puzzle' }, { id: 'arcade' }],
          tags: ['no-download', 'tile-merge'],
          mechanics: ['grid-movement'],
        },
      },
    });

    expect(descriptor).toEqual({
      slug: '2048',
      primaryCategory: 'puzzle',
      categories: ['puzzle', 'arcade'],
      tags: ['no-download', 'tile-merge'],
      mechanics: ['grid-movement'],
    });
  });
});
