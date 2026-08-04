/**
 * Word-counting rules.
 *
 * These are the numbers the Zod schema and the content validator both rely on,
 * so they must agree. A regression here would let a thin page pass validation
 * without actually explaining anything.
 */
import { describe, expect, it } from 'vitest';

import {
  countWords,
  countWordsAll,
  countGameBodyWords,
  type CountableGameContent,
} from '@/lib/content/wordcount';

describe('countWords', () => {
  it('counts plain words', () => {
    expect(countWords('the quick brown fox')).toBe(4);
  });

  it('strips markdown emphasis and link URLs', () => {
    // **bold** -> bold, [link](https://x.com) -> link (URL dropped, anchor kept)
    expect(countWords('**bold** and [link](https://x.com) here')).toBe(4);
  });

  it('returns 0 for empty or whitespace-only input', () => {
    expect(countWords('')).toBe(0);
    expect(countWords('   ')).toBe(0);
  });

  it('collapses runs of whitespace', () => {
    expect(countWords('a    b\n\tc')).toBe(3);
  });
});

describe('countWordsAll', () => {
  it('sums word counts across strings', () => {
    expect(countWordsAll(['one two', 'three four five'])).toBe(5);
  });
});

describe('countGameBodyWords', () => {
  const base: CountableGameContent = {
    intro: 'one two three',
    about: ['four five six seven', 'eight nine'],
    howToPlay: [
      { step: 'Step A', detail: 'detail one two' },
      { step: 'Step B', detail: 'detail three' },
    ],
    tips: [
      { title: 'Tip one', body: 'body alpha beta' },
      { title: 'Tip two', body: 'body gamma' },
    ],
    faq: [
      { q: 'Question one?', a: 'answer here now' },
      { q: 'Q two?', a: 'answer there' },
    ],
  };

  /*
   * intro      'one two three'                                          =  3
   * about      'four five six seven' + 'eight nine'                     =  6
   * howToPlay  'Step A detail one two' + 'Step B detail three'          =  9
   * tips       'Tip one body alpha beta' + 'Tip two body gamma'         =  9
   * faq        'Question one? answer here now' + 'Q two? answer there'  =  9
   *                                                                      ---
   *                                                                       36
   * The step/tip/faq sections each join two fields with a space before
   * counting, so both halves contribute — that is what the old expectation of
   * 35 missed (it counted howToPlay as 8).
   */
  it('sums the prose sections (3 + 6 + 9 + 9 + 9 = 36)', () => {
    expect(countGameBodyWords(base)).toBe(36);
  });

  it('deliberately excludes the controls table', () => {
    const withControls: CountableGameContent = {
      ...base,
      controls: [
        { action: 'move', desktop: 'arrow', mobile: 'swipe' },
        { action: 'a', desktop: 'b', mobile: 'c' },
      ],
    };
    expect(countGameBodyWords(withControls)).toBe(36);
  });

  it('includes features when present (36 + 5 = 41)', () => {
    const withFeatures: CountableGameContent = {
      ...base,
      features: ['feature one', 'feature two three'],
    };
    expect(countGameBodyWords(withFeatures)).toBe(41);
  });
});
