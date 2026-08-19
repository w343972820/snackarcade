/**
 * Query helpers for the `blog` collection.
 *
 * Every page that lists posts goes through this module rather than calling
 * `getCollection` directly, mirroring `src/lib/content/games.ts`: one
 * consistent definition of "published" (drafts hidden in production, visible
 * in dev) and one consistent sort order (newest first).
 */
import { getCollection, type CollectionEntry } from 'astro:content';

import { getGamesBySlugs, type Game } from '@/lib/content/games';
import {
  rankRelatedPosts,
  rankPostsForGame,
  type RelatedPostLike,
} from '@/lib/related/posts';

export type BlogPost = CollectionEntry<'blog'>;

/** Drafts are hidden from the built site but visible while running `npm run dev`. */
const INCLUDE_DRAFTS: boolean = import.meta.env.DEV;

/**
 * All publishable posts, newest first.
 *
 * @returns Posts sorted by `publishedAt` descending, then id ascending.
 */
export async function getPublishedPosts(): Promise<BlogPost[]> {
  const all = await getCollection('blog', (entry: BlogPost) => INCLUDE_DRAFTS || !entry.data.draft);
  return all.sort((a: BlogPost, b: BlogPost) => {
    const diff = b.data.publishedAt.getTime() - a.data.publishedAt.getTime();
    return diff !== 0 ? diff : a.id.localeCompare(b.id);
  });
}

/**
 * The N most recently published posts.
 *
 * @param limit Maximum number of posts to return. Defaults to 3.
 */
export async function getNewestPosts(limit: number = 3): Promise<BlogPost[]> {
  const posts = await getPublishedPosts();
  return posts.slice(0, limit);
}

/**
 * A short plain-text excerpt from a post body: the first paragraph with
 * Markdown syntax stripped, truncated to `maxLength` characters.
 *
 * @param body Raw Markdown body of the post.
 * @param maxLength Maximum excerpt length in characters. Defaults to 160.
 */
export function excerptOf(body: string, maxLength: number = 160): string {
  const stripped = body
    // fenced code blocks and inline code carry no reading value in a teaser
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    // images: drop entirely
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    // links: keep the anchor text, drop the URL
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    // headings, blockquotes, emphasis and list markers are all syntax
    .replace(/^\s{0,3}(#{1,6}|>|[-*+])\s*/gm, ' ')
    .replace(/[*_~]+/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (stripped.length <= maxLength) return stripped;
  // Cut at a word boundary so the ellipsis never follows a half word.
  return `${stripped.slice(0, maxLength).replace(/\s+\S*$/, '')}…`;
}

/**
 * Games linked from a post via `relatedGameSlugs`, in the order declared in the
 * frontmatter. Missing or draft slugs are silently skipped (see getGamesBySlugs).
 *
 * @param post The blog post entry.
 */
export async function getRelatedGames(post: BlogPost): Promise<Game[]> {
  return getGamesBySlugs(post.data.relatedGameSlugs);
}

/** Adapt a content-collection post to the plain shape the ranker uses. */
function toRelatedPostLike(post: BlogPost): RelatedPostLike {
  return {
    id: post.id,
    relatedGameSlugs: post.data.relatedGameSlugs,
    publishedAt: post.data.publishedAt,
  };
}

/**
 * The posts most related to `post`, ordered by relevance then recency.
 *
 * Ranking lives in `src/lib/related/posts.ts` and is deterministic per build:
 * shared `relatedGameSlugs` first, then same-month / close-date publication.
 * The current post is never returned, and the result is empty when nothing
 * shares a signal — callers render the module only when this is non-empty.
 *
 * @param post The blog post whose siblings are wanted.
 * @param limit Maximum number of posts to return. Defaults to 3.
 */
export async function getRelatedPosts(post: BlogPost, limit: number = 3): Promise<BlogPost[]> {
  const posts = await getPublishedPosts();
  const slugs = rankRelatedPosts(toRelatedPostLike(post), posts.map(toRelatedPostLike), { limit });
  return postsInOrder(posts, slugs);
}

/**
 * The most recent posts that mention a game via `relatedGameSlugs`.
 *
 * Feeds the "Posts About {game}" module on game detail pages, so a game page
 * links back into the blog section that talks about it.
 *
 * @param gameSlug Game id, e.g. `2048`.
 * @param limit Maximum number of posts to return. Defaults to 2.
 */
export async function getPostsForGame(gameSlug: string, limit: number = 2): Promise<BlogPost[]> {
  const posts = await getPublishedPosts();
  const slugs = rankPostsForGame(gameSlug, posts.map(toRelatedPostLike), { limit });
  return postsInOrder(posts, slugs);
}

/** Preserve the ranker's slug order, skipping any slug that disappeared. */
function postsInOrder(posts: readonly BlogPost[], slugs: readonly string[]): BlogPost[] {
  const byId = new Map<string, BlogPost>(posts.map((post: BlogPost) => [post.id, post]));
  const result: BlogPost[] = [];
  for (const id of slugs) {
    const post = byId.get(id);
    if (post !== undefined) result.push(post);
  }
  return result;
}
