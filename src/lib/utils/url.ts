/**
 * URL helpers. Every generated link must obey `trailingSlash: 'always'`.
 */
import { SITE } from '@/config/site';

/** Ensure a path starts and ends with exactly one slash. */
export function withTrailingSlash(path: string): string {
  if (path.length === 0) return '/';
  const leading = path.startsWith('/') ? path : `/${path}`;
  return leading.endsWith('/') ? leading : `${leading}/`;
}

/** Turn a site-relative path into an absolute URL. */
export function toAbsolute(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE.url}${withTrailingSlash(path)}`;
}

/** Canonical URL for a game detail page. */
export function gamePath(slug: string): string {
  return `/games/${slug}/`;
}

/** Canonical URL for a category listing, page 1. */
export function categoryPath(slug: string): string {
  return `/c/${slug}/`;
}

/** Canonical URL for page N of a category listing. Page 1 has no `/page/` segment. */
export function categoryPagePath(slug: string, page: number): string {
  return page <= 1 ? categoryPath(slug) : `/c/${slug}/page/${page}/`;
}

/** Canonical URL for a tag listing. */
export function tagPath(slug: string): string {
  return `/t/${slug}/`;
}

/** Canonical URL for page N of a tag listing. Page 1 has no `/page/` segment. */
export function tagPagePath(slug: string, page: number): string {
  return page <= 1 ? tagPath(slug) : `/t/${slug}/page/${page}/`;
}

/** Canonical URL for a collection. */
export function collectionPath(slug: string): string {
  return `/collections/${slug}/`;
}

/** Canonical URL for a blog post. */
export function blogPath(slug: string): string {
  return `/blog/${slug}/`;
}

/** Canonical URL for page N of the all-games listing. */
export function allGamesPagePath(page: number): string {
  return page <= 1 ? '/all-games/' : `/all-games/page/${page}/`;
}
