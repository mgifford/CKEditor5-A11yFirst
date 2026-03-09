import { describe, it, expect } from 'vitest';
import { adaptAxeResults } from '../../../src/modules/checker/checkerAdapter';
import type { AxeRunResult } from '../../../src/modules/checker/types';

const makeViolation = (overrides: Partial<{
  id: string;
  help: string;
  impact: 'critical' | 'serious' | 'moderate' | 'minor' | null;
  tags: string[];
  nodes: { html: string; failureSummary?: string }[];
}> = {}): AxeRunResult['violations'][number] => ({
  id: 'image-alt',
  help: 'Images must have alternate text',
  impact: 'critical',
  tags: ['wcag2a', 'wcag111', 'section508'],
  nodes: [{ html: '<img src="test.png">', failureSummary: 'Fix: add an alt attribute' }],
  ...overrides,
});

describe('adaptAxeResults', () => {
  it('returns an empty array for an empty violations list', () => {
    const result = adaptAxeResults({ violations: [] });
    expect(result).toEqual([]);
  });

  it('converts a critical violation to a severe blocking finding', () => {
    const result = adaptAxeResults({
      violations: [makeViolation({ impact: 'critical' })],
    });

    expect(result).toHaveLength(1);
    expect(result[0].severity).toBe('severe');
    expect(result[0].blocking).toBe(true);
    expect(result[0].source).toBe('axe-core');
  });

  it('converts a serious violation to a moderate blocking finding', () => {
    const result = adaptAxeResults({
      violations: [makeViolation({ impact: 'serious' })],
    });

    expect(result[0].severity).toBe('moderate');
    expect(result[0].blocking).toBe(true);
  });

  it('converts a minor violation to a suggestion non-blocking finding', () => {
    const result = adaptAxeResults({
      violations: [makeViolation({ impact: 'minor' })],
    });

    expect(result[0].severity).toBe('suggestion');
    expect(result[0].blocking).toBe(false);
  });

  it('sets the id from the violation id', () => {
    const result = adaptAxeResults({
      violations: [makeViolation({ id: 'link-name' })],
    });

    expect(result[0].id).toBe('link-name');
  });

  it('appends the first node failureSummary to the message', () => {
    const result = adaptAxeResults({
      violations: [
        makeViolation({
          help: 'Images must have alternate text',
          nodes: [{ html: '<img>', failureSummary: 'Fix: add alt text' }],
        }),
      ],
    });

    expect(result[0].message).toContain('Images must have alternate text');
    expect(result[0].message).toContain('Fix: add alt text');
  });

  it('uses just the help text when no failureSummary is present', () => {
    const result = adaptAxeResults({
      violations: [
        makeViolation({
          help: 'Images must have alternate text',
          nodes: [{ html: '<img>' }],
        }),
      ],
    });

    expect(result[0].message).toBe('Images must have alternate text');
  });

  it('resolves a WCAG reference from the known map', () => {
    const result = adaptAxeResults({
      violations: [makeViolation({ id: 'image-alt' })],
    });

    expect(result[0].wcagRef).toBe('1.1.1');
  });

  it('resolves a WCAG reference from the tags when not in the map', () => {
    const result = adaptAxeResults({
      violations: [
        makeViolation({
          id: 'some-unknown-rule',
          tags: ['wcag2a', 'wcag143'],
        }),
      ],
    });

    expect(result[0].wcagRef).toBe('1.4.3');
  });

  it('handles violations with no nodes', () => {
    const result = adaptAxeResults({
      violations: [makeViolation({ nodes: [] })],
    });

    expect(result).toHaveLength(1);
    expect(result[0].message).toBe(makeViolation({ nodes: [] }).help);
  });

  it('handles multiple violations', () => {
    const result = adaptAxeResults({
      violations: [
        makeViolation({ id: 'image-alt', impact: 'critical' }),
        makeViolation({ id: 'link-name', impact: 'serious' }),
        makeViolation({ id: 'color-contrast', impact: 'minor' }),
      ],
    });

    expect(result).toHaveLength(3);
    expect(result.map((f) => f.id)).toEqual(['image-alt', 'link-name', 'color-contrast']);
  });
});
