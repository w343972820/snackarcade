/**
 * Navigation structure: main header nav and the footer columns.
 *
 * WHY CATEGORY LINKS ARE NOT LISTED HERE
 * --------------------------------------
 * Category routes are generated conditionally — a category with no games gets
 * no page (see `src/lib/seo/routing.ts`). A hard-coded category link in this
 * file therefore became a 404 the moment the last game left that category,
 * which is exactly what happened to `/c/card-board/`.
 *
 * So the static entries below are only the routes that always exist. The
 * category entries are resolved at render time by
 * `src/lib/content/navigation.ts`, which reads live game counts. Header, Footer
 * and MobileNav all render whatever that resolver returns.
 */

export interface NavLink {
  readonly label: string;
  readonly href: string;
  /** Optional: mark external links so the renderer can add rel="noopener". */
  readonly external?: boolean;
}

export interface NavColumn {
  readonly heading: string;
  readonly links: readonly NavLink[];
}

/**
 * Header links that exist on every build regardless of content.
 * Category links are appended to these by the resolver.
 */
export const MAIN_NAV_STATIC: readonly NavLink[] = [
  { label: 'All Games', href: '/all-games/' },
  { label: 'New', href: '/new/' },
  { label: 'Blog', href: '/blog/' },
];

/**
 * How many category links the header may carry. Five items total is the
 * practical limit on mobile, and three of those are already taken above.
 */
export const MAIN_NAV_CATEGORY_LIMIT = 2;

/** How many category links the footer's Categories column may carry. */
export const FOOTER_CATEGORY_LIMIT = 4;

/** Heading for the dynamically built Categories column. */
export const FOOTER_CATEGORY_HEADING = 'Categories';

/**
 * Footer columns whose links are content-independent.
 *
 * The Site column is the one an AdSense reviewer checks first: a real About
 * page, a contact route, a privacy policy that mentions third-party ad serving,
 * and terms — linked from every page.
 */
export const FOOTER_STATIC_COLUMNS: readonly NavColumn[] = [
  {
    heading: 'Browse',
    links: [
      { label: 'All Games', href: '/all-games/' },
      { label: 'New Releases', href: '/new/' },
      { label: 'Blog', href: '/blog/' },
      { label: 'Search', href: '/search/' },
    ],
  },
  {
    heading: 'Site',
    links: [
      { label: 'About', href: '/about/' },
      { label: 'Contact', href: '/contact/' },
      { label: 'Privacy Policy', href: '/privacy-policy/' },
      { label: 'Terms of Service', href: '/terms/' },
      { label: 'DMCA / Copyright', href: '/dmca/' },
      { label: 'Game Licenses', href: '/licenses/' },
    ],
  },
];
