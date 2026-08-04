/**
 * Indexability rules — the single source of truth for "should this page be in the
 * index / sitemap?". The decision runs once per page via `resolveIndexability`;
 * this file tests the pure `decide()` core so the rules can be verified without
 * touching the filesystem.
 */
import { describe, expect, it } from 'vitest';

import { decide } from '@/lib/seo/indexability';

describe('decide() — indexability rules', () => {
  it('indexes a normal game page', () => {
    const result = decide({ kind: 'game', pathname: '/games/2048/', itemCount: 1 });
    expect(result.indexable).toBe(true);
    expect(result.robots).toContain('index');
  });

  it('never indexes search or utility pages', () => {
    expect(decide({ kind: 'search', pathname: '/search/', itemCount: 0 }).indexable).toBe(false);
    expect(decide({ kind: 'utility', pathname: '/x/', itemCount: 0 }).indexable).toBe(false);
  });

  it('noindexes empty listing pages', () => {
    expect(decide({ kind: 'category', pathname: '/c/x/', itemCount: 0 }).indexable).toBe(false);
    expect(decide({ kind: 'all-games', pathname: '/all-games/', itemCount: 0 }).indexable).toBe(false);
    expect(decide({ kind: 'tag', pathname: '/t/x/', itemCount: 0 }).indexable).toBe(false);
  });

  it('noindexes thin tag pages below the threshold but allows healthy ones', () => {
    expect(decide({ kind: 'tag', pathname: '/t/x/', itemCount: 3 }).indexable).toBe(false);
    expect(decide({ kind: 'tag', pathname: '/t/x/', itemCount: 6 }).indexable).toBe(true);
  });

  it('respects explicit noindex and draft flags', () => {
    expect(
      decide({ kind: 'game', pathname: '/g/', itemCount: 1, explicitNoindex: true }).indexable,
    ).toBe(false);
    expect(
      decide({ kind: 'page', pathname: '/about/', itemCount: 1, draft: true }).indexable,
    ).toBe(false);
  });

  it('noindexes an empty pagination page', () => {
    expect(
      decide({ kind: 'category', pathname: '/c/x/page/2/', itemCount: 0, pageNumber: 2 }).indexable,
    ).toBe(false);
  });

  /* -------------------------------------------------------------------------
     Blog.

     These cases existed as a hole for the whole of T04: `case 'blog'` fell
     through to `break` with no itemCount guard, so an empty /blog/ shipped as
     `index, follow` and went into the sitemap. An empty blog index reads as
     "site under construction", which is a documented AdSense rejection
     trigger, and no test in the suite mentioned the word "blog".
     ------------------------------------------------------------------------- */

  it('noindexes the blog index while it has no published posts', () => {
    const result = decide({ kind: 'blog', pathname: '/blog/', itemCount: 0 });
    expect(result.indexable).toBe(false);
    expect(result.robots).toContain('noindex');
    expect(result.reason).toMatch(/no published posts/i);
  });

  it('indexes the blog index as soon as there is a post', () => {
    const result = decide({ kind: 'blog', pathname: '/blog/', itemCount: 1 });
    expect(result.indexable).toBe(true);
    expect(result.robots).toContain('index');
    expect(result.robots).not.toContain('noindex');
  });

  it('indexes an individual blog post regardless of itemCount', () => {
    // A post page passes no item count; it must not be caught by the empty
    // listing rule that guards the index.
    const result = decide({ kind: 'blog', pathname: '/blog/hello/', itemCount: 1 });
    expect(result.indexable).toBe(true);
  });

  it('still honours draft and explicit noindex on blog pages', () => {
    expect(
      decide({ kind: 'blog', pathname: '/blog/hello/', itemCount: 1, draft: true }).indexable,
    ).toBe(false);
    expect(
      decide({ kind: 'blog', pathname: '/blog/', itemCount: 5, explicitNoindex: true }).indexable,
    ).toBe(false);
  });
});
