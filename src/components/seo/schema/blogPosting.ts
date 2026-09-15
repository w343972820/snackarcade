/**
 * BlogPosting structured data.
 *
 * Blog posts previously emitted no JSON-LD at all, while game pages emitted
 * VideoGame + BreadcrumbList + FAQPage. Search engines therefore had no
 * machine-readable headline or publish/modify dates for any guide — exactly the
 * metadata that helps a crawler judge whether a page is worth indexing.
 *
 * `publisher` is inlined rather than referenced by `@id`. The Organization node
 * from `siteGraph.ts` is deliberately emitted on the homepage only, so an `@id`
 * reference from a blog post would dangle — a broken reference is worse than a
 * small amount of repeated markup.
 */
import { absoluteUrl, SITE } from '@/config/site';

export type JsonLdObject = Record<string, unknown>;

export interface BlogPostingInput {
  /** Headline as it appears in search results (the seo title). */
  title: string;
  /** Meta description, reused as the article description. */
  description: string;
  /** Site-relative path of the post, e.g. `/blog/how-to-play-2048/`. */
  path: string;
  publishedAt: Date;
  updatedAt: Date;
  /** Author name from frontmatter. */
  author: string;
  /** Site-relative path of the social preview image. Defaults to the site OG image. */
  image?: string;
}

/**
 * Build the BlogPosting JSON-LD object for a blog post page.
 *
 * @param input The post's resolved metadata.
 * @returns A JSON-LD object. Never null — a post always has these fields.
 */
export function blogPostingSchema(input: BlogPostingInput): JsonLdObject {
  const url = absoluteUrl(input.path);

  return {
    '@type': 'BlogPosting',
    '@id': `${url}#article`,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    headline: input.title,
    description: input.description,
    datePublished: input.publishedAt.toISOString(),
    dateModified: input.updatedAt.toISOString(),
    inLanguage: SITE.locale,
    image: [absoluteUrl(input.image ?? SITE.defaultOgImage)],
    author: {
      '@type': 'Organization',
      name: input.author,
      url: absoluteUrl('/'),
    },
    publisher: {
      '@type': 'Organization',
      name: SITE.name,
      url: absoluteUrl('/'),
    },
  };
}
