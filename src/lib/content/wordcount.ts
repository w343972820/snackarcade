/**
 * The single, canonical word-counting rule for the whole project.
 *
 * Every place that talks about "words" — the Zod schema, the content validator,
 * the doctor report — must call this function. If two places counted words
 * differently, the build could pass validation and still fail the editorial
 * standard (or worse, the other way round, which would just be baffling to the
 * site owner).
 *
 * Rule: split on whitespace, ignore empty fragments. Markdown syntax characters
 * are stripped first so `**bold**` counts as one word, not three.
 */

/** Strip the Markdown syntax that would otherwise inflate or split word counts. */
function stripMarkdown(input: string): string {
  return input
    // fenced code blocks
    .replace(/```[\s\S]*?```/g, ' ')
    // inline code
    .replace(/`[^`]*`/g, ' ')
    // images: drop entirely, alt text is not body copy
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    // links: keep the anchor text, drop the URL
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    // emphasis / strong / strikethrough markers
    .replace(/[*_~]+/g, '')
    // heading hashes and blockquote markers at line start
    .replace(/^\s{0,3}(#{1,6}|>)\s*/gm, ' ')
    // HTML comments
    .replace(/<!--[\s\S]*?-->/g, ' ')
    // raw HTML tags
    .replace(/<\/?[a-z][^>]*>/gi, ' ');
}

/** Count words in a single string. */
export function countWords(input: string): number {
  if (typeof input !== 'string' || input.length === 0) return 0;
  return stripMarkdown(input)
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

/** Count words across many strings. */
export function countWordsAll(inputs: readonly string[]): number {
  return inputs.reduce((total, text) => total + countWords(text), 0);
}

/**
 * Total original body copy for a game, matching the structure the schema
 * enforces. Kept here so the schema, the validator and the doctor report can
 * never disagree about what counts towards the minimum.
 */
export interface CountableGameContent {
  readonly intro: string;
  readonly about: readonly string[];
  readonly howToPlay: readonly { readonly step: string; readonly detail: string }[];
  readonly controls?: readonly { readonly action: string; readonly desktop: string; readonly mobile: string }[];
  readonly tips: readonly { readonly title: string; readonly body: string }[];
  readonly features?: readonly string[];
  readonly faq: readonly { readonly q: string; readonly a: string }[];
}

/**
 * Words of original prose on a game page.
 *
 * The controls table is deliberately excluded: it is reference data, not prose,
 * and counting it would let a page hit the minimum without actually explaining
 * anything.
 */
export function countGameBodyWords(content: CountableGameContent): number {
  return (
    countWords(content.intro) +
    countWordsAll(content.about) +
    countWordsAll(content.howToPlay.map((step) => `${step.step} ${step.detail}`)) +
    countWordsAll(content.tips.map((tip) => `${tip.title} ${tip.body}`)) +
    countWordsAll(content.faq.map((item) => `${item.q} ${item.a}`)) +
    countWordsAll(content.features ?? [])
  );
}
