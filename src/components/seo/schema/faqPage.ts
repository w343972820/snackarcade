/**
 * FAQPage structured data.
 *
 * Google requires that every question and answer marked up here is also
 * visible on the page. Hidden FAQ markup is a structured-data violation, so
 * this generator is only ever called with the same array the page renders.
 */
export interface FaqEntry {
  q: string;
  a: string;
}

export type JsonLdObject = Record<string, unknown>;

/**
 * Strip markdown emphasis and links so the answer text in JSON-LD matches what
 * the visitor actually reads rather than the raw source.
 *
 * @param value Raw answer text.
 */
function toPlainText(value: string): string {
  return value
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[*_`]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Build the FAQPage JSON-LD object.
 *
 * @param entries The question-and-answer pairs rendered on the page.
 * @returns A JSON-LD object, or null when there are no entries.
 */
export function faqPageSchema(entries: readonly FaqEntry[]): JsonLdObject | null {
  if (entries.length === 0) return null;

  return {
    '@type': 'FAQPage',
    mainEntity: entries.map((entry) => ({
      '@type': 'Question',
      name: toPlainText(entry.q),
      acceptedAnswer: {
        '@type': 'Answer',
        text: toPlainText(entry.a),
      },
    })),
  };
}
