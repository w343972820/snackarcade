/**
 * Reader for the GA4-derived popularity snapshot (src/content/data/popular.json).
 *
 * Honesty rule: the "Most Played" section only renders from real exported data.
 * If the file is missing, malformed, empty or older than 60 days, every read
 * returns null/[] and no leaderboard is rendered anywhere on the site. This is
 * the same circuit breaker the ratings field uses — never invent numbers.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { getGamesBySlugs, type Game } from '@/lib/content/games';

export interface PopularEntry {
  readonly slug: string;
  readonly plays: number;
  readonly rank: number;
}

export interface PopularData {
  readonly schemaVersion: number;
  readonly source: string;
  /** YYYY-MM-DD of the GA4 export. */
  readonly exportedAt: string;
  readonly note?: string;
  readonly entries: readonly PopularEntry[];
}

/** Data older than this many days is treated as missing (do not render). */
export const POPULAR_MAX_AGE_DAYS = 60;

/**
 * Resolve the popular.json path. Astro bundles this module for SSR, where
 * `import.meta.url` may point at a virtual location rather than the source
 * file, so we try the working-directory path first (Astro always builds from
 * the project root) and fall back to the import-relative path.
 */
function resolvePopularFile(): string {
  const candidates = [
    path.resolve(process.cwd(), 'src', 'content', 'data', 'popular.json'),
    path.resolve(
      path.dirname(fileURLToPath(import.meta.url)),
      '..',
      '..',
      'content',
      'data',
      'popular.json',
    ),
  ];
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) return candidate;
  }
  // candidates is never empty; fall back to the first for a clearer read error.
  return candidates[0]!;
}

const POPULAR_FILE = resolvePopularFile();

/**
 * Whole days between an exportedAt date and now. Returns Infinity for an
 * unparsable date so it can never be mistaken for fresh.
 */
function daysSince(dateText: string): number {
  const time = Date.parse(`${dateText}T00:00:00Z`);
  if (!Number.isFinite(time)) return Infinity;
  return (Date.now() - time) / 86_400_000;
}

/**
 * True when the snapshot is present, non-empty and recent enough to render.
 * Exported for the doctor script and tests to share one freshness rule.
 */
export function isFresh(data: PopularData | null | undefined): boolean {
  if (!data) return false;
  if (!Array.isArray(data.entries) || data.entries.length === 0) return false;
  if (typeof data.exportedAt !== 'string') return false;
  return daysSince(data.exportedAt) <= POPULAR_MAX_AGE_DAYS;
}

/**
 * Load the snapshot, or return null when the file is missing, malformed,
 * expired or empty. Never throws — a broken data file must not break the build.
 */
export async function loadOrNull(): Promise<PopularData | null> {
  let raw: string;
  try {
    raw = fs.readFileSync(POPULAR_FILE, 'utf8');
  } catch {
    return null;
  }

  try {
    const data = JSON.parse(raw) as PopularData;
    if (!data || typeof data !== 'object') return null;
    if (typeof data.exportedAt !== 'string' || !Array.isArray(data.entries)) return null;
    return isFresh(data) ? data : null;
  } catch {
    return null;
  }
}

/**
 * The most-played games, ranked by `rank` ascending and filtered to games that
 * actually exist (a stale export might name a game that was removed).
 *
 * @param limit Maximum number of games to return. Defaults to 5.
 * @returns Games in leaderboard order, or [] when the data is missing/expired.
 */
export async function getPopularGames(limit: number = 5): Promise<Game[]> {
  const data = await loadOrNull();
  if (!data) return [];

  const ranked = [...data.entries]
    .sort((a, b) => a.rank - b.rank)
    .slice(0, limit)
    .map((entry) => entry.slug);

  return getGamesBySlugs(ranked);
}
