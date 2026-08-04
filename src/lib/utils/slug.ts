/**
 * Slug helpers. Slugs are lowercase, hyphen-separated and ASCII only, because
 * they become URLs and file paths on every platform the site owner might use.
 */

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** True when a string is already a well-formed slug. */
export function isValidSlug(value: string): boolean {
  return SLUG_PATTERN.test(value);
}

/** Convert arbitrary text into a slug. */
export function slugify(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Turn a slug into a readable label, e.g. `card-board` -> `Card Board`. */
export function humanise(slug: string): string {
  return slug
    .split('-')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
