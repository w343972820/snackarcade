/**
 * Query helpers for the `games` collection.
 *
 * Every page that lists games goes through this module rather than calling
 * `getCollection` directly. That guarantees one consistent definition of
 * "published" (drafts are excluded in production, visible in dev) and one
 * consistent sort order across the whole site.
 */
import { getCollection, getEntry, type CollectionEntry } from 'astro:content';

export type Game = CollectionEntry<'games'>;
export type Category = CollectionEntry<'categories'>;

/**
 * Drafts are hidden from the built site but visible while running `npm run dev`,
 * so a half-written page can be previewed without publishing it.
 */
const INCLUDE_DRAFTS: boolean = import.meta.env.DEV;

/** Cached across a single build; Astro re-imports this module per build anyway. */
let cachedGames: Game[] | null = null;

/**
 * All publishable games, newest first.
 *
 * @returns Games sorted by `publishedAt` descending, then title ascending.
 */
export async function getPublishedGames(): Promise<Game[]> {
  if (cachedGames !== null) return cachedGames;

  const all = await getCollection('games', (entry: Game) => INCLUDE_DRAFTS || !entry.data.draft);

  cachedGames = all.sort((a: Game, b: Game) => {
    const diff = b.data.publishedAt.getTime() - a.data.publishedAt.getTime();
    return diff !== 0 ? diff : a.data.title.localeCompare(b.data.title);
  });

  return cachedGames;
}

/**
 * A single game by slug, or `undefined` when it does not exist or is a draft
 * in a production build.
 *
 * @param slug The game id, e.g. `2048`.
 */
export async function getGameBySlug(slug: string): Promise<Game | undefined> {
  const entry = await getEntry('games', slug);
  if (entry === undefined) return undefined;
  if (!INCLUDE_DRAFTS && entry.data.draft) return undefined;
  return entry;
}

/**
 * Games belonging to a category, newest first.
 *
 * @param categoryId The category id, e.g. `puzzle`.
 */
export async function getGamesByCategory(categoryId: string): Promise<Game[]> {
  const games = await getPublishedGames();
  return games.filter((game: Game) =>
    game.data.taxonomy.categories.some((ref) => ref.id === categoryId),
  );
}

/**
 * Games carrying a tag, newest first.
 *
 * @param tagId The tag id, e.g. `no-download`.
 */
export async function getGamesByTag(tagId: string): Promise<Game[]> {
  const games = await getPublishedGames();
  return games.filter((game: Game) => game.data.taxonomy.tags.includes(tagId));
}

/**
 * Games whose slug appears in the supplied list, preserving the order of the
 * list rather than the order of the collection. Missing or draft slugs are
 * silently skipped so a typo in a collection file cannot break the build.
 *
 * @param slugs Ordered game ids.
 */
export async function getGamesBySlugs(slugs: readonly string[]): Promise<Game[]> {
  const games = await getPublishedGames();
  const bySlug = new Map<string, Game>(games.map((game: Game) => [game.id, game]));

  const result: Game[] = [];
  for (const slug of slugs) {
    const game = bySlug.get(slug);
    if (game !== undefined) result.push(game);
  }
  return result;
}

/**
 * The N most recently published games.
 *
 * @param limit Maximum number of games to return. Defaults to 12.
 */
export async function getNewestGames(limit: number = 12): Promise<Game[]> {
  const games = await getPublishedGames();
  return games.slice(0, limit);
}

/* -----------------------------------------------------------------------------
   Related games: deliberately NOT implemented here.

   This module used to export `getSimilarGames(game, limit)`, which ranked
   candidates pairwise and topped the list up with recent games. It was removed
   once the game page moved to `src/lib/related/similar.ts`, because the two
   answered the same question differently and only one of them is safe.

   The pairwise version cannot enforce the two properties the site's internal
   linking depends on, both of which are global, not pairwise:

     • Inbound-link balance. Scoring A against B in isolation has no idea how
       many other pages already link to B, so the most-tagged games collect
       every link and the rest become orphans no crawler reaches.
     • Rare-feature weighting. It scored a shared `no-download` tag exactly like
       a shared `tile-merge` mechanic, so universal tags dominated the ranking.

   Use `buildSimilarityGraphCached()` + `getSimilarSlugs()` from
   `src/lib/related/similar.ts`, then `getGamesBySlugs()` from this module to
   turn the slugs back into entries. Building the whole graph once per build is
   what makes the balancing possible, and it is memoised so the cost is paid
   once rather than once per page.
   -------------------------------------------------------------------------- */

/**
 * Total number of publishable games. Used in meta title templates such as
 * "{count} Best Free Puzzle Games".
 */
export async function getGameCount(): Promise<number> {
  const games = await getPublishedGames();
  return games.length;
}

/**
 * Every self-hosted game bundle, used by the deploy budget check and by the
 * public licence manifest.
 */
export async function getSelfHostedGames(): Promise<Game[]> {
  const games = await getPublishedGames();
  return games.filter((game: Game) => game.data.source.sourceType === 'self_hosted');
}
