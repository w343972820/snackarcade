/**
 * Which taxonomy pages are worth generating at all.
 *
 * WHY THIS EXISTS AS A SEPARATE, PURE MODULE
 * ------------------------------------------
 * The site used to generate a page for every tag that had at least one game,
 * then mark the thin ones `noindex`. That produced the worst of both worlds:
 * 16 orphan pages nobody linked to, none of them indexable, all of them
 * countable by a human reviewer as "pages generated for SEO with one game on
 * them".
 *
 * The rule is now binary and matches `src/lib/seo/indexability.ts`:
 *
 *   a taxonomy page is either generated AND indexable, or not generated at all.
 *
 * Because the routes, the navigation and the tag chips on a game page all have
 * to agree about that, the predicate lives here — pure, dependency-free and
 * unit-tested — instead of being re-derived in four places.
 */
import { SEO_THRESHOLDS } from '@/config/seo';

/**
 * Whether `/t/{slug}/` should be emitted for a tag.
 *
 * Uses the same threshold `decide()` applies to tag pages, so a generated tag
 * page is always an indexable one.
 *
 * @param gameCount How many published games carry the tag.
 * @param forceNoindex The tag's `forceNoindex` flag from `tags.json`.
 * @returns True when the route should exist.
 */
export function shouldGenerateTagPage(gameCount: number, forceNoindex: boolean = false): boolean {
  if (forceNoindex) return false;
  return gameCount >= SEO_THRESHOLDS.TAG_MIN_GAMES;
}

/**
 * Whether `/c/{slug}/` should be emitted for a category.
 *
 * Categories are part of the site's permanent information architecture, so the
 * bar is lower than for tags: one game is enough. Zero games is not — an empty
 * category page is a dead end for a visitor and a thin page for a crawler.
 *
 * @param gameCount How many published games sit in the category.
 * @returns True when the route should exist.
 */
export function shouldGenerateCategoryPage(gameCount: number): boolean {
  return gameCount > 0;
}

/**
 * Count how many items carry each tag.
 *
 * @param taggedItems One string array of tag ids per item.
 * @returns A map of tag id to occurrence count. Tags nobody uses are absent.
 */
export function countTagOccurrences(
  taggedItems: readonly (readonly string[])[],
): Map<string, number> {
  const counts = new Map<string, number>();

  for (const tags of taggedItems) {
    for (const tagId of tags) {
      counts.set(tagId, (counts.get(tagId) ?? 0) + 1);
    }
  }

  return counts;
}
