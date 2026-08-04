/**
 * BreadcrumbList structured data.
 *
 * The items always come from `src/lib/seo/breadcrumbs.ts`, the same source the
 * visible breadcrumb trail uses, so the markup and the page can never disagree.
 */
import { toBreadcrumbItems, type Crumb } from '@/lib/seo/breadcrumbs';

export type JsonLdObject = Record<string, unknown>;

/**
 * Build the BreadcrumbList JSON-LD object.
 *
 * @param crumbs The same crumb array rendered visibly on the page.
 * @returns A JSON-LD object, or null when there is nothing meaningful to mark up.
 */
export function breadcrumbListSchema(crumbs: readonly Crumb[]): JsonLdObject | null {
  // A single "Home" crumb is not a trail and adds no value in search results.
  if (crumbs.length < 2) return null;

  return {
    '@type': 'BreadcrumbList',
    itemListElement: toBreadcrumbItems(crumbs),
  };
}
