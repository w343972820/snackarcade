/**
 * URL helpers and breadcrumb construction.
 *
 * The URL helpers enforce `trailingSlash: 'always'` so every internal link is
 * canonical. The breadcrumb builders produce the same trail the page renders AND
 * the BreadcrumbList structured data, so the two cannot drift apart.
 */
import { describe, expect, it } from 'vitest';

import {
  gamePath,
  categoryPath,
  categoryPagePath,
  tagPath,
  tagPagePath,
  collectionPath,
  blogPath,
  allGamesPagePath,
  withTrailingSlash,
  toAbsolute,
} from '@/lib/utils/url';

import {
  gameBreadcrumbs,
  categoryBreadcrumbs,
  tagBreadcrumbs,
  toBreadcrumbItems,
} from '@/lib/seo/breadcrumbs';

describe('URL helpers', () => {
  it('gamePath ends with a single trailing slash', () => {
    expect(gamePath('2048')).toBe('/games/2048/');
  });

  it('categoryPagePath omits /page/ on page 1', () => {
    expect(categoryPagePath('puzzle', 1)).toBe('/c/puzzle/');
    expect(categoryPagePath('puzzle', 2)).toBe('/c/puzzle/page/2/');
  });

  it('tagPagePath omits /page/ on page 1', () => {
    expect(tagPagePath('no-download', 1)).toBe('/t/no-download/');
    expect(tagPagePath('no-download', 3)).toBe('/t/no-download/page/3/');
  });

  it('categoryPath, tagPath, collectionPath, blogPath and allGamesPagePath', () => {
    expect(categoryPath('puzzle')).toBe('/c/puzzle/');
    expect(tagPath('no-download')).toBe('/t/no-download/');
    expect(collectionPath('best-of')).toBe('/collections/best-of/');
    expect(blogPath('hello')).toBe('/blog/hello/');
    expect(allGamesPagePath(1)).toBe('/all-games/');
    expect(allGamesPagePath(2)).toBe('/all-games/page/2/');
  });

  it('withTrailingSlash normalises any input', () => {
    expect(withTrailingSlash('foo')).toBe('/foo/');
    expect(withTrailingSlash('/foo')).toBe('/foo/');
    expect(withTrailingSlash('/foo/')).toBe('/foo/');
    expect(withTrailingSlash('')).toBe('/');
  });

  it('toAbsolute keeps absolute urls and canonicalises relative ones', () => {
    expect(toAbsolute('https://x.com/a/')).toBe('https://x.com/a/');
    expect(toAbsolute('games/2048')).toContain('/games/2048/');
  });
});

describe('breadcrumbs', () => {
  it('gameBreadcrumbs builds Home › Category › Game', () => {
    const crumbs = gameBreadcrumbs('Puzzle', 'puzzle', '2048', '2048');
    expect(crumbs).toHaveLength(3);
    expect(crumbs[0]?.name).toBe('Home');
    expect(crumbs[1]?.href).toBe('/c/puzzle/');
    expect(crumbs[2]?.name).toBe('2048');
    expect(crumbs[2]?.href).toBe('/games/2048/');
  });

  it('categoryBreadcrumbs appends a Page N crumb on pagination', () => {
    const crumbs = categoryBreadcrumbs('Puzzle', 'puzzle', 2);
    expect(crumbs).toHaveLength(3);
    expect(crumbs[2]?.name).toBe('Page 2');
  });

  it('tagBreadcrumbs builds Home › Tags › Tag', () => {
    const crumbs = tagBreadcrumbs('No Download', 'no-download');
    expect(crumbs).toHaveLength(3);
    expect(crumbs[1]?.href).toBe('/t/');
    expect(crumbs[2]?.href).toBe('/t/no-download/');
  });

  it('toBreadcrumbItems makes absolute urls and numbers positions from 1', () => {
    const items = toBreadcrumbItems([
      { name: 'Home', href: '/' },
      { name: 'Puzzle', href: '/c/puzzle/' },
    ]);
    expect(items[0]?.item).toContain('://');
    expect(items[1]?.position).toBe(2);
  });
});
