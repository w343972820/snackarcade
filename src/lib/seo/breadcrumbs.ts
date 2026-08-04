/**
 * Breadcrumb construction.
 *
 * One builder produces both the visible breadcrumb trail and the
 * BreadcrumbList structured data, so the two can never drift apart. Google
 * treats a mismatch between visible breadcrumbs and breadcrumb markup as a
 * structured-data violation.
 */
import { absoluteUrl } from '@/config/site';
import { categoryPath, gamePath, tagPath, collectionPath } from '@/lib/utils/url';

export interface Crumb {
  /** Visible label. */
  name: string;
  /** Site-relative path with a trailing slash. The final crumb has no link. */
  href?: string;
}

/** The Home crumb, present on every trail. */
const HOME: Crumb = { name: 'Home', href: '/' };

/**
 * Breadcrumbs for a game detail page: Home › Category › Game.
 *
 * @param categoryName Display name of the primary category.
 * @param categorySlug Slug of the primary category.
 * @param gameTitle Display name of the game.
 * @param gameSlug Slug of the game.
 */
export function gameBreadcrumbs(
  categoryName: string,
  categorySlug: string,
  gameTitle: string,
  gameSlug: string,
): Crumb[] {
  return [
    HOME,
    { name: categoryName, href: categoryPath(categorySlug) },
    { name: gameTitle, href: gamePath(gameSlug) },
  ];
}

/**
 * Breadcrumbs for a category listing: Home › Category.
 *
 * @param categoryName Display name.
 * @param categorySlug Slug.
 * @param pageNumber Pagination page; page 2+ appends a "Page N" crumb.
 */
export function categoryBreadcrumbs(
  categoryName: string,
  categorySlug: string,
  pageNumber: number = 1,
): Crumb[] {
  const trail: Crumb[] = [HOME, { name: categoryName, href: categoryPath(categorySlug) }];

  if (pageNumber > 1) {
    trail.push({ name: `Page ${pageNumber}` });
  }

  return trail;
}

/**
 * Breadcrumbs for a tag listing: Home › Tags › Tag.
 *
 * @param tagName Display name.
 * @param tagSlug Slug.
 */
export function tagBreadcrumbs(tagName: string, tagSlug: string): Crumb[] {
  return [HOME, { name: 'Tags', href: '/t/' }, { name: tagName, href: tagPath(tagSlug) }];
}

/**
 * Breadcrumbs for a collection: Home › Collections › Collection.
 *
 * @param collectionTitle Display name.
 * @param collectionSlug Slug.
 */
export function collectionBreadcrumbs(collectionTitle: string, collectionSlug: string): Crumb[] {
  return [
    HOME,
    { name: 'Collections', href: '/collections/' },
    { name: collectionTitle, href: collectionPath(collectionSlug) },
  ];
}

/**
 * Breadcrumbs for a static page: Home › Page.
 *
 * @param title Display name.
 * @param href Site-relative path.
 */
export function pageBreadcrumbs(title: string, href: string): Crumb[] {
  return [HOME, { name: title, href }];
}

/**
 * Convert a crumb trail into schema.org BreadcrumbList items.
 *
 * Every item gets an absolute URL, including the last one — Google's validator
 * accepts a final item without a URL, but supplying it is unambiguous.
 *
 * @param crumbs The visible crumb trail.
 */
export function toBreadcrumbItems(
  crumbs: readonly Crumb[],
): { '@type': 'ListItem'; position: number; name: string; item: string }[] {
  return crumbs.map((crumb, index) => ({
    '@type': 'ListItem' as const,
    position: index + 1,
    name: crumb.name,
    item: absoluteUrl(crumb.href ?? '/'),
  }));
}
