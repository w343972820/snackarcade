/**
 * Date formatting helpers.
 *
 * All dates come from content frontmatter (`publishedAt` / `updatedAt`), never
 * from file mtime. Git checkouts rewrite mtime to the checkout time, which
 * would make every sitemap `lastmod` change on every deploy — a classic and
 * very visible sitemap mistake.
 */

/** ISO 8601 date-time string, used by structured data and sitemap lastmod. */
export function toIsoString(value: Date | string): string {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`toIsoString() received an invalid date: ${String(value)}`);
  }
  return date.toISOString();
}

/** `YYYY-MM-DD`, used by the licence ledger. */
export function toIsoDate(value: Date | string): string {
  return toIsoString(value).slice(0, 10);
}

/** Human-readable `August 2026`, used in the meta bar and Game Info table. */
export function toMonthYear(value: Date | string): string {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`toMonthYear() received an invalid date: ${String(value)}`);
  }
  return date.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

/** Human-readable `12 August 2026`, used on blog posts. */
export function toLongDate(value: Date | string): string {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`toLongDate() received an invalid date: ${String(value)}`);
  }
  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

/** Whole months between a date and now. Used to flag stale licence checks. */
export function monthsSince(value: Date | string): number {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return 0;
  const now = new Date();
  return (
    (now.getUTCFullYear() - date.getUTCFullYear()) * 12 +
    (now.getUTCMonth() - date.getUTCMonth())
  );
}

/** Current year, used by title templates that advertise freshness. */
export function currentYear(): number {
  return new Date().getUTCFullYear();
}
