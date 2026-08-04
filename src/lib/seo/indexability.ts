/**
 * The single source of truth for "should this page be indexed?".
 *
 * WHY THERE IS ONLY ONE OF THESE
 * ------------------------------
 * A page's `<meta name="robots">` tag and its presence in the sitemap must
 * always agree. When they disagree, Google Search Console raises "Submitted URL
 * marked noindex", which is a self-inflicted quality problem that is tedious to
 * unwind. So every page asks this module, and the sitemap filter reads the
 * registry this module writes. There is no second implementation anywhere.
 */
import { recordNoindexPath } from '@/config/noindex-registry.mjs';
import { SEO_THRESHOLDS } from '@/config/seo';

/** Every kind of page the site produces. */
export type PageKind =
  | 'home'
  | 'game'
  | 'category'
  | 'category-page'
  | 'tag'
  | 'collection'
  | 'blog'
  | 'all-games'
  | 'page'
  | 'search'
  | 'utility';

export interface IndexabilityInput {
  /** What kind of page this is. */
  kind: PageKind;
  /** The pathname being rendered, e.g. `/games/2048/`. */
  pathname: string;
  /** Number of items on a listing page. Ignored for non-listing pages. */
  itemCount?: number;
  /** Page number for paginated listings. Page 1 is the canonical page. */
  pageNumber?: number;
  /** An explicit `noindexOverride: true` in the content file wins over everything. */
  explicitNoindex?: boolean;
  /** True when the content file is a draft. */
  draft?: boolean;
}

export interface IndexabilityResult {
  /** True when the page may be indexed and may appear in the sitemap. */
  indexable: boolean;
  /** The exact value for `<meta name="robots">`. */
  robots: string;
  /** Plain-language reason, surfaced in dev tooling and useful when debugging. */
  reason: string;
}

/** Robots directives used across the site. */
const ROBOTS = {
  INDEX: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  NOINDEX: 'noindex, follow',
} as const;

/**
 * Decide whether a page should be indexed, and record the decision so the
 * sitemap can honour it.
 *
 * Call this exactly once per page, from the layout. It has a side effect: any
 * page judged non-indexable is written to the noindex registry that
 * `astro.config.mjs` reads when filtering the sitemap.
 *
 * @param input Facts about the page being rendered.
 * @returns Whether to index, the robots value, and why.
 */
export function resolveIndexability(input: IndexabilityInput): IndexabilityResult {
  const result = decide(input);

  if (!result.indexable) {
    recordNoindexPath(input.pathname);
  }

  return result;
}

/**
 * Pure decision logic, with no side effects. Exported for unit tests so the
 * rules can be verified without touching the filesystem.
 *
 * @param input Facts about the page being rendered.
 */
export function decide(input: IndexabilityInput): IndexabilityResult {
  const { kind, itemCount = 0, pageNumber = 1, explicitNoindex = false, draft = false } = input;

  if (explicitNoindex) {
    return {
      indexable: false,
      robots: ROBOTS.NOINDEX,
      reason: 'The content file sets noindexOverride: true.',
    };
  }

  if (draft) {
    return {
      indexable: false,
      robots: ROBOTS.NOINDEX,
      reason: 'The content file is still a draft.',
    };
  }

  switch (kind) {
    case 'search':
    case 'utility':
      return {
        indexable: false,
        robots: ROBOTS.NOINDEX,
        reason: 'Search results and utility pages are never indexed — they are duplicate or thin by nature.',
      };

    case 'tag':
      if (itemCount < SEO_THRESHOLDS.TAG_MIN_GAMES) {
        return {
          indexable: false,
          robots: ROBOTS.NOINDEX,
          reason: `Tag pages need at least ${SEO_THRESHOLDS.TAG_MIN_GAMES} games to be worth indexing; this one has ${itemCount}.`,
        };
      }
      break;

    case 'collection':
      if (itemCount < SEO_THRESHOLDS.COLLECTION_MIN_GAMES) {
        return {
          indexable: false,
          robots: ROBOTS.NOINDEX,
          reason: `Collections need at least ${SEO_THRESHOLDS.COLLECTION_MIN_GAMES} games to be worth indexing; this one has ${itemCount}.`,
        };
      }
      break;

    case 'category':
    case 'category-page':
    case 'all-games':
      if (itemCount === 0) {
        return {
          indexable: false,
          robots: ROBOTS.NOINDEX,
          reason: 'An empty listing page has nothing to index.',
        };
      }
      break;

    case 'blog':
      // A blog index with no posts is the classic "site under construction"
      // signal. Submitting one for indexing is a documented AdSense review
      // rejection trigger, so it follows the same rule as every other empty
      // listing on the site.
      if (itemCount === 0) {
        return {
          indexable: false,
          robots: ROBOTS.NOINDEX,
          reason: 'The blog has no published posts yet, so the index page is an empty placeholder.',
        };
      }
      break;

    case 'home':
    case 'game':
    case 'page':
      break;

    default:
      break;
  }

  // Paginated pages beyond the first are indexable but low value; they stay in
  // the index so deep games remain discoverable, with self-referencing canonicals.
  if (pageNumber > 1 && itemCount === 0) {
    return {
      indexable: false,
      robots: ROBOTS.NOINDEX,
      reason: 'This pagination page is empty.',
    };
  }

  return {
    indexable: true,
    robots: ROBOTS.INDEX,
    reason: 'Meets the indexing requirements for its page type.',
  };
}

/** The robots value for a page that is explicitly allowed to be indexed. */
export const ROBOTS_INDEX: string = ROBOTS.INDEX;

/** The robots value for a page that must not be indexed. */
export const ROBOTS_NOINDEX: string = ROBOTS.NOINDEX;
