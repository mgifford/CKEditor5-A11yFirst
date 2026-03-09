import { describe, it, expect } from 'vitest';
import {
  mapAxeImpactToSeverity,
  isBlockingImpact,
  resolveWcagRef,
  AXE_RULE_WCAG_MAP,
} from '../../../src/modules/checker/checkerMappings';

describe('mapAxeImpactToSeverity', () => {
  it('maps critical → severe', () => {
    expect(mapAxeImpactToSeverity('critical')).toBe('severe');
  });

  it('maps serious → moderate', () => {
    expect(mapAxeImpactToSeverity('serious')).toBe('moderate');
  });

  it('maps moderate → suggestion', () => {
    expect(mapAxeImpactToSeverity('moderate')).toBe('suggestion');
  });

  it('maps minor → suggestion', () => {
    expect(mapAxeImpactToSeverity('minor')).toBe('suggestion');
  });

  it('maps null → suggestion', () => {
    expect(mapAxeImpactToSeverity(null)).toBe('suggestion');
  });

  it('maps undefined → suggestion', () => {
    expect(mapAxeImpactToSeverity(undefined)).toBe('suggestion');
  });
});

describe('isBlockingImpact', () => {
  it('returns true for critical', () => {
    expect(isBlockingImpact('critical')).toBe(true);
  });

  it('returns true for serious', () => {
    expect(isBlockingImpact('serious')).toBe(true);
  });

  it('returns false for moderate', () => {
    expect(isBlockingImpact('moderate')).toBe(false);
  });

  it('returns false for minor', () => {
    expect(isBlockingImpact('minor')).toBe(false);
  });

  it('returns false for null', () => {
    expect(isBlockingImpact(null)).toBe(false);
  });
});

describe('resolveWcagRef', () => {
  it('returns value from the explicit map when available', () => {
    expect(resolveWcagRef('image-alt', [])).toBe('1.1.1');
    expect(resolveWcagRef('link-name', [])).toBe('2.4.4');
    expect(resolveWcagRef('color-contrast', [])).toBe('1.4.3');
  });

  it('falls back to extracting from tags when rule is not in the map', () => {
    expect(resolveWcagRef('unknown-rule', ['wcag111', 'wcag2a'])).toBe('1.1.1');
    expect(resolveWcagRef('unknown-rule', ['cat.text-alternatives', 'wcag143'])).toBe('1.4.3');
  });

  it('returns undefined when no wcag tag matches', () => {
    expect(resolveWcagRef('unknown-rule', ['best-practice', 'cat.forms'])).toBeUndefined();
  });

  it('ignores broad tags like wcag2a and wcag2aa when looking for criterion refs', () => {
    // 'wcag2a' does not match the /^wcag(\d)(\d)(\d)$/ pattern (4 digits)
    expect(resolveWcagRef('unknown-rule', ['wcag2a', 'wcag2aa'])).toBeUndefined();
  });
});

describe('AXE_RULE_WCAG_MAP', () => {
  it('is a non-empty object', () => {
    expect(typeof AXE_RULE_WCAG_MAP).toBe('object');
    expect(Object.keys(AXE_RULE_WCAG_MAP).length).toBeGreaterThan(0);
  });

  it('maps image-alt to 1.1.1', () => {
    expect(AXE_RULE_WCAG_MAP['image-alt']).toBe('1.1.1');
  });
});
