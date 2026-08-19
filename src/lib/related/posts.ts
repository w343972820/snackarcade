/**
 * Internal-link ranking for the "Related Posts" module.
 *
 * Every blog detail page links to 2-3 sibling posts so the blog section weaves
 * its own internal-link network instead of only pointing outward to game pages.
 * The ranking is deliberately simple and — like `src/lib/related/similar.ts` —
 * fully deterministic: no randomness, no `localeCompare`, no dependence on the
 * order candidates arrive in, so every build emits byte-identical links.
 *
 * Signals, strongest first:
 *   1. SHARED GAMES — two posts whose `relatedGameSlugs` mention the same game
 *      are about the same topic. Weight is per shared slug, so a post about two
 *      of my games outranks one that shares a single game.
 *   2. SAME MONTH — posts published in the same calendar month.
 *   3. CLOSE DATE — posts published within 30 days of each other.
 *
 * A candidate with a score of 0 (no shared games AND no date proximity) is
 * never recommended; callers render nothing when no candidate scores, so an
 * empty module can never appear on a page.
 *
 * This module is deliberately free of Astro imports so it can be unit-tested
 * directly under Vitest. `src/lib/content/blog.ts` adapts content-collection
 * entries to the plain `RelatedPostLike` shape used here.
 */

/** The only facts about a post that affect relatedness. */
export interface RelatedPostLike {
  /** Post id, e.g. `2048-tips-and-tricks`. */
  readonly id: string;
  /** Game slugs the post mentions, e.g. `['2048', 'block-drop']`. */
  readonly relatedGameSlugs: readonly string[];
  /** Publication date; used for the same-month and close-date signals. */
  readonly publishedAt: Date;
}

/** Tuning knobs. */
export interface RelatedPostOptions {
  /** Maximum number of posts to return. Default 3. */
  readonly limit?: number;
}

/** Score contributed by one shared `relatedGameSlugs` entry. */
const SHARED_GAME_WEIGHT = 4;
/** Score for sharing the calendar month of publication. */
const SAME_MONTH_WEIGHT = 2;
/** Score for publishing within 30 days of the current post. */
const CLOSE_DATE_WEIGHT = 1;
/** 30 days in milliseconds. */
const CLOSE_DATE_MS = 30 * 86_400_000;
/** Floating-point comparisons need a tolerance. */
const EPSILON = 1e-12;

/**
 * Code-unit id comparison.
 *
 * Deliberately not `localeCompare`: its result depends on the host's ICU data,
 * which would make the ranking differ between machines and CI.
 *
 * @param a First id.
 * @param b Second id.
 * @returns -1, 0 or 1.
 */
function compareId(a: string, b: string): number {
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
}

/**
 * Relevance of one post to another.
 *
 * Comparing a post with itself scores 0, which is what makes the "never
 * recommend the current post" guarantee structural rather than a filter that
 * could be forgotten at a call site.
 *
 * @param current The post being viewed.
 * @param candidate A candidate sibling post.
 * @returns Score in `[0, ∞)`; 0 means "not related enough to recommend".
 */
export function relatedPostScore(current: RelatedPostLike, candidate: RelatedPostLike): number {
  if (current.id === candidate.id) return 0;

  let score = 0;

  const myGames = new Set(current.relatedGameSlugs);
  for (const slug of candidate.relatedGameSlugs) {
    if (myGames.has(slug)) score += SHARED_GAME_WEIGHT;
  }

  const a = current.publishedAt;
  const b = candidate.publishedAt;
  if (a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth()) {
    score += SAME_MONTH_WEIGHT;
  }
  if (Math.abs(a.getTime() - b.getTime()) <= CLOSE_DATE_MS) {
    score += CLOSE_DATE_WEIGHT;
  }

  return score;
}

/**
 * Rank the most related posts for `current`, best first.
 *
 * Ordering is fully specified so the outcome cannot depend on iteration order:
 * score desc, then publishedAt desc (newer first), then id asc.
 *
 * @param current The post being viewed.
 * @param candidates The full corpus of publishable posts.
 * @param options Tuning knobs; see `RelatedPostOptions`.
 * @returns Ordered candidate ids, never including `current.id`.
 */
export function rankRelatedPosts(
  current: RelatedPostLike,
  candidates: readonly RelatedPostLike[],
  options: RelatedPostOptions = {},
): string[] {
  const limit = options.limit ?? 3;
  if (limit <= 0) return [];

  const scored = candidates
    .filter((candidate) => candidate.id !== current.id)
    .map((candidate) => ({
      id: candidate.id,
      publishedAt: candidate.publishedAt,
      score: relatedPostScore(current, candidate),
    }))
    .filter((entry) => entry.score > 0)
    .sort((x, y) => {
      if (Math.abs(x.score - y.score) > EPSILON) return y.score - x.score;
      // Newer first: positive diff means y is newer, so y sorts before x.
      const timeDiff = y.publishedAt.getTime() - x.publishedAt.getTime();
      if (timeDiff !== 0) return timeDiff;
      return compareId(x.id, y.id);
    });

  return scored.slice(0, limit).map((entry) => entry.id);
}

/**
 * Rank posts that mention a game, newest first.
 *
 * This is the blog-to-game side of the internal-link network: a game detail
 * page links to the posts whose `relatedGameSlugs` include it. Same determinism
 * rules as `rankRelatedPosts`.
 *
 * @param gameSlug The game id, e.g. `2048`.
 * @param candidates The full corpus of publishable posts.
 * @param options Tuning knobs; see `RelatedPostOptions`.
 * @returns Ordered post ids, newest first, then id asc.
 */
export function rankPostsForGame(
  gameSlug: string,
  candidates: readonly RelatedPostLike[],
  options: RelatedPostOptions = {},
): string[] {
  const limit = options.limit ?? 2;
  if (limit <= 0) return [];

  return candidates
    .filter((post) => post.relatedGameSlugs.includes(gameSlug))
    .sort((a, b) => {
      // Newer first: positive diff means b is newer, so b sorts before a.
      const timeDiff = b.publishedAt.getTime() - a.publishedAt.getTime();
      if (timeDiff !== 0) return timeDiff;
      return compareId(a.id, b.id);
    })
    .slice(0, limit)
    .map((post) => post.id);
}
