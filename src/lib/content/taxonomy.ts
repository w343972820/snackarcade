/**
 * Query helpers for categories and tags, plus the counting logic that decides
 * whether a listing page is substantial enough to be indexed.
 */
import { getCollection, getEntry, type CollectionEntry } from 'astro:content';

import { getPublishedGames, type Game } from '@/lib/content/games';
import {
  countTagOccurrences,
  shouldGenerateCategoryPage,
  shouldGenerateTagPage,
} from '@/lib/seo/routing';

export type Category = CollectionEntry<'categories'>;
export type Tag = CollectionEntry<'tags'>;

/** A category together with how many games currently sit in it. */
export interface CategoryWithCount {
  category: Category;
  count: number;
}

/** A tag together with its game count and whether it should be indexed. */
export interface TagWithCount {
  tag: Tag;
  count: number;
  /** False when the tag is too thin to index, or explicitly forced to noindex. */
  indexable: boolean;
}

/**
 * All categories in their configured display order.
 */
export async function getOrderedCategories(): Promise<Category[]> {
  const categories = await getCollection('categories');
  return categories.sort((a: Category, b: Category) => {
    if (a.data.order !== b.data.order) return a.data.order - b.data.order;
    return a.data.name.localeCompare(b.data.name);
  });
}

/**
 * A single category by id.
 *
 * @param id The category id, e.g. `puzzle`.
 */
export async function getCategoryById(id: string): Promise<Category | undefined> {
  return getEntry('categories', id);
}

/**
 * Categories with their live game counts, in display order.
 *
 * Categories with zero games are still returned — the caller decides whether to
 * render them — but `count` lets navigation hide empty ones on a young site.
 */
export async function getCategoriesWithCounts(): Promise<CategoryWithCount[]> {
  const [categories, games] = await Promise.all([getOrderedCategories(), getPublishedGames()]);

  const counts = new Map<string, number>();
  for (const game of games) {
    for (const ref of game.data.taxonomy.categories) {
      counts.set(ref.id, (counts.get(ref.id) ?? 0) + 1);
    }
  }

  return categories.map((category: Category) => ({
    category,
    count: counts.get(category.id) ?? 0,
  }));
}

/**
 * Categories that actually have a generated page, in display order.
 *
 * Navigation must only ever point at these. A category with no games gets no
 * route at all (see `src/lib/seo/routing.ts`), so linking one is a guaranteed
 * 404.
 */
export async function getRoutedCategories(): Promise<CategoryWithCount[]> {
  const categories = await getCategoriesWithCounts();
  return categories.filter((entry: CategoryWithCount) => shouldGenerateCategoryPage(entry.count));
}

/**
 * All tags with their game counts and indexability verdict.
 *
 * A tag page below `SEO_THRESHOLDS.TAG_MIN_GAMES` is a thin page. Indexing
 * dozens of them dilutes the whole site, so no route is generated for them at
 * all — `indexable` here and "has a page" are the same thing.
 */
export async function getTagsWithCounts(): Promise<TagWithCount[]> {
  const [tags, games] = await Promise.all([getCollection('tags'), getPublishedGames()]);

  const counts = countTagOccurrences(games.map((game: Game) => game.data.taxonomy.tags));

  return tags
    .map((tag: Tag) => {
      const count = counts.get(tag.id) ?? 0;
      return {
        tag,
        count,
        indexable: shouldGenerateTagPage(count, tag.data.forceNoindex),
      };
    })
    .sort((a, b) => {
      if (b.count !== a.count) return b.count - a.count;
      return a.tag.data.name.localeCompare(b.tag.data.name);
    });
}

/**
 * The ids of tags that have a generated `/t/{slug}/` page.
 *
 * Used by the game detail page so a tag chip is only ever rendered as a link
 * when the target route exists. Tags below the threshold still show, as plain
 * text — the visual language stays the same and the links appear on their own
 * the moment enough games carry the tag.
 */
export async function getRoutedTagIds(): Promise<Set<string>> {
  const tags = await getTagsWithCounts();

  return new Set(
    tags
      .filter((entry: TagWithCount) =>
        shouldGenerateTagPage(entry.count, entry.tag.data.forceNoindex),
      )
      .map((entry: TagWithCount) => entry.tag.id),
  );
}

/**
 * A single tag by id.
 *
 * @param id The tag id, e.g. `no-download`.
 */
export async function getTagById(id: string): Promise<Tag | undefined> {
  return getEntry('tags', id);
}

/**
 * Tag ids referenced by games that do not exist in `tags.json`.
 *
 * Used by `scripts/validate-content.mjs` to produce a readable error instead of
 * letting the build emit a link to a 404 page.
 */
export async function findUnknownTagIds(): Promise<string[]> {
  const [tags, games] = await Promise.all([getCollection('tags'), getPublishedGames()]);
  const known = new Set(tags.map((tag: Tag) => tag.id));

  const unknown = new Set<string>();
  for (const game of games) {
    for (const tagId of game.data.taxonomy.tags) {
      if (!known.has(tagId)) unknown.add(tagId);
    }
  }

  return [...unknown].sort();
}

/**
 * Resolve the display name of a category reference without a second lookup at
 * the call site.
 *
 * @param game Any game entry.
 * @returns The primary category entry, or undefined when the reference is broken.
 */
export async function getPrimaryCategory(game: Game): Promise<Category | undefined> {
  return getEntry('categories', game.data.taxonomy.primaryCategory.id);
}
