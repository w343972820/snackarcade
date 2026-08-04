/**
 * ItemList structured data for listing pages.
 *
 * Used on category, tag, collection and all-games pages so Google understands
 * a listing as an ordered set of games rather than a wall of links.
 */
import { absoluteUrl } from '@/config/site';
import { gamePath } from '@/lib/utils/url';

export interface ItemListEntry {
  slug: string;
  title: string;
}

export type JsonLdObject = Record<string, unknown>;

/**
 * Build the ItemList JSON-LD object.
 *
 * @param entries Games shown on the page, in display order.
 * @param listName Human-readable name for the list.
 * @param startPosition 1-based position of the first item, for paginated pages.
 * @returns A JSON-LD object, or null when the list is empty.
 */
export function itemListSchema(
  entries: readonly ItemListEntry[],
  listName: string,
  startPosition: number = 1,
): JsonLdObject | null {
  if (entries.length === 0) return null;

  return {
    '@type': 'ItemList',
    name: listName,
    numberOfItems: entries.length,
    itemListElement: entries.map((entry, index) => ({
      '@type': 'ListItem',
      position: startPosition + index,
      url: absoluteUrl(gamePath(entry.slug)),
      name: entry.title,
    })),
  };
}
