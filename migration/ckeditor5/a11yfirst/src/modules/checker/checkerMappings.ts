/**
 * Severity and WCAG-reference mapping tables for the A11yFirst checker.
 *
 * These tables replace the testability-to-severity mapping previously
 * provided by Quail.js (`testabilityTranslation` in quail.jquery.js).
 * Quail used a numeric 0–1 scale; axe-core uses named impact strings.
 */

import type { CheckerSeverity } from './types';

/**
 * Map an axe-core impact string to an A11yFirst severity tier.
 *
 * axe-core impact values: 'critical' | 'serious' | 'moderate' | 'minor' | null
 * A11yFirst severity tiers: 'severe' | 'moderate' | 'suggestion'
 */
export function mapAxeImpactToSeverity(
  impact: 'critical' | 'serious' | 'moderate' | 'minor' | null | undefined
): CheckerSeverity {
  switch (impact) {
    case 'critical':
      return 'severe';
    case 'serious':
      return 'moderate';
    case 'moderate':
    case 'minor':
    default:
      return 'suggestion';
  }
}

/**
 * Return true when an axe-core impact level is considered blocking
 * (must be fixed before publication).
 */
export function isBlockingImpact(
  impact: 'critical' | 'serious' | 'moderate' | 'minor' | null | undefined
): boolean {
  return impact === 'critical' || impact === 'serious';
}

/**
 * Best-effort WCAG 2.x success-criterion reference for common axe-core
 * rule IDs.  The list covers the rules most likely to appear in rich-text
 * editor content; it does not need to be exhaustive because axe-core's
 * `tags` array also carries WCAG references that callers may use directly.
 */
export const AXE_RULE_WCAG_MAP: Readonly<Record<string, string>> = {
  'image-alt': '1.1.1',
  'input-image-alt': '1.1.1',
  'object-alt': '1.1.1',
  'area-alt': '1.1.1',
  'color-contrast': '1.4.3',
  'color-contrast-enhanced': '1.4.6',
  'duplicate-id': '4.1.1',
  'duplicate-id-active': '4.1.1',
  'duplicate-id-aria': '4.1.1',
  'heading-order': '1.3.1',
  'empty-heading': '1.3.1',
  'link-name': '2.4.4',
  'link-in-text-block': '1.4.1',
  'button-name': '4.1.2',
  'label': '1.3.1',
  'table-duplicate-name': '1.3.1',
  'th-has-data-cells': '1.3.1',
  'scope-attr-valid': '1.3.1',
  'table-fake-caption': '1.3.1',
  'td-headers-attr': '1.3.1',
  'document-title': '2.4.2',
  'html-lang-valid': '3.1.1',
  'html-has-lang': '3.1.1',
  'frame-title': '2.4.1',
  'video-caption': '1.2.2',
  'audio-caption': '1.2.2',
};

/**
 * Derive a WCAG reference from an axe-core violation.
 * Prefers the explicit map; falls back to extracting from the rule tags.
 */
export function resolveWcagRef(
  id: string,
  tags: readonly string[]
): string | undefined {
  if (AXE_RULE_WCAG_MAP[id]) {
    return AXE_RULE_WCAG_MAP[id];
  }

  // axe-core tags include entries like 'wcag111', 'wcag143', 'wcag2aa', etc.
  // Extract the numeric part of the first wcag-criteria tag (e.g. 'wcag111' → '1.1.1').
  for (const tag of tags) {
    const match = tag.match(/^wcag(\d)(\d)(\d)$/);
    if (match) {
      return `${match[1]}.${match[2]}.${match[3]}`;
    }
  }

  return undefined;
}
