/**
 * Meta title and description construction, with hard length enforcement.
 *
 * Titles that overflow get cut off by Google mid-word, which measurably lowers
 * click-through. Rather than hoping nobody writes a long one, this module
 * throws at build time so the problem is found before publishing.
 */
import { META_LIMITS } from '@/config/seo';
import { SITE } from '@/config/site';

export interface MetaInput {
  /** The page-specific title, without the brand suffix. */
  title: string;
  /** The meta description. */
  description: string;
  /** Where the value came from, used to make errors actionable. */
  source: string;
  /** Skip appending " | SnackArcade". Used when the title already contains it. */
  skipBrand?: boolean;
}

export interface ResolvedMeta {
  title: string;
  description: string;
}

const BRAND_SUFFIX = ` | ${SITE.name}`;

/**
 * Fill placeholders in a template string.
 *
 * Supported placeholders: `{count}` `{name}` `{year}` `{month}` `{site}`.
 *
 * @param template The template, e.g. `{count} Best Free {name} Games`.
 * @param values Replacement values.
 */
export function fillTemplate(
  template: string,
  values: Readonly<Record<string, string | number>>,
): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => {
    const value = values[key];
    return value === undefined ? match : String(value);
  });
}

/**
 * Standard template values available to every listing page.
 *
 * @param count Number of items on the page.
 * @param name Display name of the category or tag.
 * @param date Reference date, defaults to now. Injectable for stable tests.
 */
export function templateValues(
  count: number,
  name: string,
  date: Date = new Date(),
): Record<string, string | number> {
  return {
    count,
    name,
    site: SITE.name,
    year: date.getUTCFullYear(),
    month: date.toLocaleString('en-US', { month: 'long', timeZone: 'UTC' }),
  };
}

/**
 * Validate and finalise a page's title and description.
 *
 * @param input Raw title and description plus a source label for error messages.
 * @returns The final strings to put in the document head.
 * @throws When a value breaks a hard length limit, with a message naming the file.
 */
export function resolveMeta(input: MetaInput): ResolvedMeta {
  const description = input.description.trim();
  let title = input.title.trim();

  if (!input.skipBrand && !title.includes(SITE.name)) {
    const withBrand = `${title}${BRAND_SUFFIX}`;
    // Only append the brand when there is room for it; a truncated brand is
    // worse than no brand.
    if (withBrand.length <= META_LIMITS.TITLE_MAX) {
      title = withBrand;
    }
  }

  if (title.length < META_LIMITS.TITLE_MIN) {
    throw new Error(
      `${input.source} → the page title is only ${title.length} characters ` +
        `("${title}"), but it must be at least ${META_LIMITS.TITLE_MIN}. ` +
        'A very short title wastes the space Google gives you in search results. ' +
        'Add the game or category name and what the page offers.',
    );
  }

  if (title.length > META_LIMITS.TITLE_MAX) {
    throw new Error(
      `${input.source} → the page title is ${title.length} characters but the limit is ` +
        `${META_LIMITS.TITLE_MAX}. Google cuts off anything longer, usually mid-word.\n` +
        `  Current: "${title}"\n` +
        `  Shorten it by ${title.length - META_LIMITS.TITLE_MAX} characters.`,
    );
  }

  if (description.length < META_LIMITS.DESCRIPTION_MIN) {
    throw new Error(
      `${input.source} → the meta description is only ${description.length} characters, ` +
        `but it must be at least ${META_LIMITS.DESCRIPTION_MIN}. ` +
        'Short descriptions look thin in search results and Google often rewrites them. ' +
        'Aim for 140–155 characters.',
    );
  }

  if (description.length > META_LIMITS.DESCRIPTION_MAX) {
    throw new Error(
      `${input.source} → the meta description is ${description.length} characters but the ` +
        `limit is ${META_LIMITS.DESCRIPTION_MAX}. Google truncates the rest with an ellipsis.\n` +
        `  Shorten it by ${description.length - META_LIMITS.DESCRIPTION_MAX} characters.`,
    );
  }

  return { title, description };
}

/**
 * Truncate a string for use as an Open Graph description, where over-length is
 * cosmetic rather than an SEO problem.
 *
 * @param value The text to shorten.
 * @param max Maximum length. Defaults to 200.
 */
export function truncate(value: string, max: number = 200): string {
  const trimmed = value.trim();
  if (trimmed.length <= max) return trimmed;
  return `${trimmed.slice(0, max - 1).trimEnd()}…`;
}
