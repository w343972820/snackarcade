/**
 * Regression tests for the Related Posts ranking.
 *
 * The module answers one question per blog detail page: which 2-3 sibling
 * posts should link to each other so the blog section has its own internal
 * link network. The properties that matter:
 *
 *   1. A post never recommends itself.
 *   2. Shared games outrank date proximity — two posts about the same game are
 *      related even when published months apart.
 *   3. Date proximity is a real fallback — same month / close dates still
 *      recommend when no game is shared.
 *   4. Determinism — identical input gives identical output, regardless of the
 *      order the candidates arrive in.
 *   5. A post with no signal at all is never recommended.
 */
import { describe, expect, it } from 'vitest';

import {
  rankRelatedPosts,
  relatedPostScore,
  rankPostsForGame,
  type RelatedPostLike,
} from '@/lib/related/posts';

/* =============================================================================
   Fixture
   ============================================================================= */

const GAME_A = '2048';
const GAME_B = 'block-drop';
const GAME_C = 'five-letters';

/**
 * Build one post descriptor.
 *
 * @param id Post id.
 * @param publishedAt ISO date; compared via UTC fields in the tests.
 * @param relatedGameSlugs Games the post mentions.
 * @returns A `RelatedPostLike` descriptor.
 */
function post(id: string, publishedAt: string, relatedGameSlugs: string[]): RelatedPostLike {
  return { id, publishedAt: new Date(`${publishedAt}T00:00:00Z`), relatedGameSlugs };
}

/** The post being viewed throughout the fixture. */
const CURRENT = post('current', '2026-08-03', [GAME_A, GAME_B]);

/** Shares a game but was published months earlier — must still rank high. */
const SHARED_GAME = post('shared-game', '2026-01-15', [GAME_A]);

/** Shares two games AND falls in the same month — the strongest match. */
const SHARED_TWO = post('shared-two', '2026-08-10', [GAME_A, GAME_B]);

/** No shared game, same month, close date — the date fallback at full strength. */
const SAME_MONTH = post('same-month', '2026-08-20', []);

/** No shared game, close date only — shares the month too (August). */
const CLOSE_DATE = post('close-date', '2026-08-28', [GAME_C]);

/** No shared game, months away — must never be recommended. */
const UNRELATED = post('unrelated', '2025-01-01', [GAME_C]);

const CORPUS: readonly RelatedPostLike[] = [
  SHARED_GAME,
  SHARED_TWO,
  SAME_MONTH,
  CLOSE_DATE,
  UNRELATED,
];

/* =============================================================================
   Scoring
   ============================================================================= */

describe('relatedPostScore', () => {
  it('scores a post compared with itself at zero', () => {
    expect(relatedPostScore(CURRENT, CURRENT)).toBe(0);
  });

  it('counts 4 per shared game', () => {
    expect(relatedPostScore(CURRENT, SHARED_GAME)).toBe(4);
  });

  it('adds the month and close-date signals on top of shared games', () => {
    // 2 shared games (8) + same month (2) + close date (1).
    expect(relatedPostScore(CURRENT, SHARED_TWO)).toBe(11);
  });

  it('gives date-only candidates a positive but smaller score', () => {
    // Same month (2) + close date (1).
    expect(relatedPostScore(CURRENT, SAME_MONTH)).toBe(3);
  });

  it('scores a post with no shared games and no date proximity at zero', () => {
    expect(relatedPostScore(CURRENT, UNRELATED)).toBe(0);
  });
});

/* =============================================================================
   Ranking
   ============================================================================= */

describe('rankRelatedPosts', () => {
  it('never recommends the current post', () => {
    const ids = rankRelatedPosts(CURRENT, [...CORPUS, CURRENT]);
    expect(ids).not.toContain(CURRENT.id);
  });

  it('puts posts sharing games ahead of date-only matches', () => {
    const ids = rankRelatedPosts(CURRENT, CORPUS);
    const sharedIndex = ids.indexOf(SHARED_GAME.id);
    // CLOSE_DATE is the date-only match that makes the top 3 (scores 3, newer
    // than the other date-only candidate).
    const dateIndex = ids.indexOf(CLOSE_DATE.id);
    expect(sharedIndex).toBeGreaterThanOrEqual(0);
    expect(dateIndex).toBeGreaterThanOrEqual(0);
    expect(sharedIndex).toBeLessThan(dateIndex);
  });

  it('returns at most the requested limit, defaulting to 3', () => {
    expect(rankRelatedPosts(CURRENT, CORPUS)).toHaveLength(3);
    expect(rankRelatedPosts(CURRENT, CORPUS, { limit: 2 })).toHaveLength(2);
    expect(rankRelatedPosts(CURRENT, CORPUS, { limit: 10 })).toHaveLength(4);
  });

  it('returns an empty list when nothing shares a signal', () => {
    const lonely = post('lonely', '2026-08-03', []);
    const far = post('far', '2025-01-01', []);
    expect(rankRelatedPosts(lonely, [far, post('farmer', '2025-02-01', [])])).toEqual([]);
  });

  it('is deterministic: the same input produces the same output twice', () => {
    const first = rankRelatedPosts(CURRENT, CORPUS);
    const second = rankRelatedPosts(CURRENT, CORPUS);
    expect(second).toEqual(first);
  });

  it('is unaffected by the order of the input array', () => {
    const baseline = rankRelatedPosts(CURRENT, CORPUS);

    for (const seed of [1, 7, 12_345, 99_991]) {
      const shuffled = seededShuffle(CORPUS, seed);
      expect(shuffled.map((entry) => entry.id)).not.toEqual(CORPUS.map((entry) => entry.id));
      expect(rankRelatedPosts(CURRENT, shuffled)).toEqual(baseline);
    }
  });

  it('breaks score ties by recency, then by id', () => {
    // Both score 3 (same month + close date); the newer one wins.
    const ids = rankRelatedPosts(CURRENT, [SAME_MONTH, CLOSE_DATE]);
    expect(ids[0]).toBe(CLOSE_DATE.id);
    expect(ids[1]).toBe(SAME_MONTH.id);
  });
});

/* =============================================================================
   Posts for a game (game detail page side of the network)
   ============================================================================= */

describe('rankPostsForGame', () => {
  it('returns only posts whose relatedGameSlugs include the game', () => {
    const ids = rankPostsForGame(GAME_A, CORPUS);
    expect(ids).toContain(SHARED_GAME.id);
    expect(ids).toContain(SHARED_TWO.id);
    expect(ids).not.toContain(SAME_MONTH.id);
  });

  it('orders newest first', () => {
    const ids = rankPostsForGame(GAME_A, CORPUS);
    const sharedTwoIndex = ids.indexOf(SHARED_TWO.id); // 2026-08-10
    const sharedGameIndex = ids.indexOf(SHARED_GAME.id); // 2026-01-15
    expect(sharedTwoIndex).toBeGreaterThanOrEqual(0);
    expect(sharedGameIndex).toBeGreaterThanOrEqual(0);
    expect(sharedTwoIndex).toBeLessThan(sharedGameIndex);
  });

  it('respects the limit and returns empty when nothing mentions the game', () => {
    expect(rankPostsForGame(GAME_A, CORPUS, { limit: 1 })).toHaveLength(1);
    expect(rankPostsForGame('no-such-game', CORPUS)).toEqual([]);
  });
});

/* =============================================================================
   Helpers
   ============================================================================= */

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
    const a = result[index];
    const b = result[swapWith];
    if (a === undefined || b === undefined) continue;
    result[index] = b;
    result[swapWith] = a;
  }

  return result;
}
