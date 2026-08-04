/**
 * Meta title/description construction with hard length limits.
 *
 * Over-long or under-long titles and descriptions are a measurable click-through
 * and quality problem, so `resolveMeta` throws at build time. These tests lock
 * that behaviour in.
 */
import { describe, expect, it } from 'vitest';

import { resolveMeta, fillTemplate, templateValues, truncate } from '@/lib/seo/meta';

describe('fillTemplate', () => {
  it('replaces known placeholders', () => {
    expect(
      fillTemplate('{count} {name} ({year})', { count: 12, name: 'Puzzle', year: 2026 }),
    ).toBe('12 Puzzle (2026)');
  });

  it('leaves unknown placeholders untouched', () => {
    expect(fillTemplate('{count} {unknown}', { count: 5 })).toBe('5 {unknown}');
  });
});

describe('templateValues', () => {
  it('includes count, name, site and current year', () => {
    const values = templateValues(10, 'Puzzle', new Date('2026-08-01T00:00:00Z'));
    expect(values.count).toBe(10);
    expect(values.name).toBe('Puzzle');
    expect(values.year).toBe(2026);
    expect(values.site).toBe('SnackArcade');
  });
});

describe('resolveMeta', () => {
  it('appends the brand and keeps a valid title under the limit', () => {
    const meta = resolveMeta({
      title: 'Play 2048 Online',
      description: 'a'.repeat(120),
      source: 'test',
    });
    expect(meta.title).toContain('SnackArcade');
    expect(meta.title.length).toBeLessThanOrEqual(60);
  });

  it('throws when the title is too short', () => {
    // `skipBrand` is required to reach the TITLE_MIN guard at all: the brand
    // suffix " | SnackArcade" is 14 characters on its own, so any branded title
    // clears the 15-character floor no matter how short the input was. Without
    // this flag the assertion tests nothing.
    expect(() =>
      resolveMeta({ title: 'Hi', description: 'b'.repeat(120), source: 't', skipBrand: true }),
    ).toThrow(/title/i);
  });

  it('does not treat a short title as too short once the brand is appended', () => {
    // The complement of the case above, and the behaviour real pages rely on.
    const meta = resolveMeta({ title: 'Hi', description: 'b'.repeat(120), source: 't' });
    expect(meta.title).toBe('Hi | SnackArcade');
  });

  it('throws when the description is too short', () => {
    expect(() =>
      resolveMeta({ title: 'A perfectly valid title here', description: 'short', source: 't' }),
    ).toThrow(/description/i);
  });

  it('throws when the description is too long', () => {
    expect(() =>
      resolveMeta({ title: 'A valid title', description: 'x'.repeat(200), source: 't' }),
    ).toThrow(/description/i);
  });

  it('does not append the brand when it is already present', () => {
    const meta = resolveMeta({
      title: 'Play 2048 Online | SnackArcade',
      description: 'd'.repeat(120),
      source: 't',
    });
    expect(meta.title).toBe('Play 2048 Online | SnackArcade');
  });
});

describe('truncate', () => {
  it('leaves short strings untouched', () => {
    expect(truncate('hello', 10)).toBe('hello');
  });

  it('truncates and appends an ellipsis', () => {
    const result = truncate('a long string that exceeds', 10);
    expect(result.length).toBeLessThanOrEqual(11);
    expect(result.endsWith('…')).toBe(true);
  });
});
