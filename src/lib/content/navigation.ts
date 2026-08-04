/**
 * Builds the header and footer navigation from live content.
 *
 * WHY NAVIGATION IS RESOLVED AND NOT HARD-CODED
 * ---------------------------------------------
 * Category routes are generated conditionally: a category with zero published
 * games gets no page. A static link list cannot know that, so `/c/card-board/`
 * sat in both the header and the footer of every page on the site while the
 * route did not exist — a site-wide 404 on the most-crawled links there are.
 *
 * Everything here reads `getRoutedCategories()`, which is the same predicate
 * `src/pages/c/[slug].astro` uses to decide what to build. One source of truth,
 * so the two cannot drift.
 */
import {
  FOOTER_CATEGORY_HEADING,
  FOOTER_CATEGORY_LIMIT,
  FOOTER_STATIC_COLUMNS,
  MAIN_NAV_CATEGORY_LIMIT,
  MAIN_NAV_STATIC,
  type NavColumn,
  type NavLink,
} from '@/config/nav';
import { getRoutedCategories } from '@/lib/content/taxonomy';
import { categoryPath } from '@/lib/utils/url';

/**
 * Turn routed categories into nav links, largest first so the busiest sections
 * get the visible slots.
 *
 * @param limit Maximum number of links to return.
 */
async function categoryLinks(limit: number): Promise<NavLink[]> {
  const routed = await getRoutedCategories();

  return routed
    .slice()
    .sort((a, b) => {
      if (b.count !== a.count) return b.count - a.count;
      if (a.category.data.order !== b.category.data.order) {
        return a.category.data.order - b.category.data.order;
      }
      return a.category.data.name.localeCompare(b.category.data.name);
    })
    .slice(0, limit)
    .map((entry) => ({
      label: entry.category.data.name,
      href: categoryPath(entry.category.id),
    }));
}

/**
 * Header navigation: the always-present routes followed by the busiest
 * categories that actually have a page.
 */
export async function getMainNav(): Promise<NavLink[]> {
  const categories = await categoryLinks(MAIN_NAV_CATEGORY_LIMIT);
  return [...MAIN_NAV_STATIC, ...categories];
}

/**
 * Footer columns: Browse, then Categories (only when at least one category has
 * a page), then Site. An empty column is omitted rather than rendered with a
 * heading and nothing under it.
 */
export async function getFooterColumns(): Promise<NavColumn[]> {
  const links = await categoryLinks(FOOTER_CATEGORY_LIMIT);

  const columns: NavColumn[] = [];
  const [browse, site] = FOOTER_STATIC_COLUMNS;

  if (browse !== undefined) columns.push(browse);
  if (links.length > 0) columns.push({ heading: FOOTER_CATEGORY_HEADING, links });
  if (site !== undefined) columns.push(site);

  return columns;
}
