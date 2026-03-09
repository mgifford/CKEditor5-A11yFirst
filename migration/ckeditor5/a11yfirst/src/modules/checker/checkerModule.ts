/**
 * Checker module: combines axe-core findings with A11yFirst-specific custom
 * rules to produce a `CheckerResult`.
 *
 * Custom rules cover the A11yFirst authoring scenarios that Quail.js
 * previously handled (heading sequence, link text quality, image alt,
 * table structure).  They operate on plain HTML strings and are therefore
 * runnable synchronously and without a live DOM.
 */

import type { CheckerFinding, CheckerResult } from './types';

// ---------------------------------------------------------------------------
// Custom rules (replace the subset of Quail.js rules relevant to A11yFirst)
// ---------------------------------------------------------------------------

/** Detect heading-level sequence violations in an HTML string. */
export function checkHeadingSequence(html: string): CheckerFinding[] {
  const findings: CheckerFinding[] = [];
  const matches = [...html.matchAll(/<h([1-6])\b/gi)];
  const levels = matches.map((m) => Number(m[1]));

  let previous: number | null = null;
  for (const level of levels) {
    if (previous !== null && level > previous + 1) {
      findings.push({
        id: 'a11yfirst-heading-sequence',
        message: `Heading sequence skips from H${previous} to H${level}. Heading levels should not be skipped.`,
        severity: 'severe',
        wcagRef: '1.3.1',
        blocking: true,
        source: 'custom',
      });
    }
    previous = level;
  }

  return findings;
}

/** Detect non-descriptive link text. */
export function checkLinkText(html: string): CheckerFinding[] {
  const findings: CheckerFinding[] = [];
  const GENERIC_PHRASES = new Set([
    '',
    'click here',
    'click',
    'link',
    'read more',
    'more',
    'here',
    'download',
    'go',
  ]);

  for (const match of html.matchAll(/<a\b[^>]*>([\s\S]*?)<\/a>/gi)) {
    const linkText = (match[1] ?? '').replace(/<[^>]+>/g, '').trim().toLowerCase();
    if (GENERIC_PHRASES.has(linkText)) {
      findings.push({
        id: 'a11yfirst-link-text',
        message: `Link text "${linkText || '(empty)'}" is not descriptive. Use text that describes the link destination.`,
        severity: 'severe',
        wcagRef: '2.4.4',
        blocking: true,
        source: 'custom',
      });
    }
  }

  return findings;
}

/** Detect images missing an alt attribute (or with suspicious alt text). */
export function checkImageAlt(html: string): CheckerFinding[] {
  const findings: CheckerFinding[] = [];

  for (const match of html.matchAll(/<img\b([^>]*)>/gi)) {
    const attrs = match[1] ?? '';
    const altMatch = attrs.match(/\balt\s*=\s*(?:"([^"]*)"|'([^']*)')/i);

    if (!altMatch) {
      findings.push({
        id: 'a11yfirst-image-alt-missing',
        message: 'Image is missing the alt attribute. Provide descriptive alternative text or use alt="" for decorative images.',
        severity: 'severe',
        wcagRef: '1.1.1',
        blocking: true,
        source: 'custom',
      });
    } else {
      const altText = (altMatch[1] ?? altMatch[2] ?? '').trim();
      if (altText === '') {
        // Empty alt is valid for decorative images — advisory only.
        findings.push({
          id: 'a11yfirst-image-alt-empty',
          message: 'Image has empty alt text. Confirm the image is decorative and conveys no information.',
          severity: 'suggestion',
          wcagRef: '1.1.1',
          blocking: false,
          source: 'custom',
        });
      }
    }
  }

  return findings;
}

/** Detect tables missing header cells or captions. */
export function checkTableStructure(html: string): CheckerFinding[] {
  const findings: CheckerFinding[] = [];

  for (const match of html.matchAll(/<table[\s>][\s\S]*?<\/table>/gi)) {
    const tableHtml = match[0];

    if (!/<caption[\s>]/i.test(tableHtml)) {
      findings.push({
        id: 'a11yfirst-table-caption',
        message: 'Table is missing a <caption>. Add a caption that describes the table\'s purpose.',
        severity: 'suggestion',
        wcagRef: '1.3.1',
        blocking: false,
        source: 'custom',
      });
    }

    if (!/<th[\s>]/i.test(tableHtml)) {
      findings.push({
        id: 'a11yfirst-table-headers',
        message: 'Table has no header cells (<th>). Add <th> elements to identify row and column headers.',
        severity: 'severe',
        wcagRef: '1.3.1',
        blocking: true,
        source: 'custom',
      });
    }
  }

  return findings;
}

// ---------------------------------------------------------------------------
// Aggregation helper
// ---------------------------------------------------------------------------

const SEVERITY_ORDER: Record<string, number> = {
  severe: 0,
  moderate: 1,
  suggestion: 2,
};

/**
 * Build a `CheckerResult` from an array of findings, sorting blocking issues
 * first then by severity.
 */
export function buildCheckerResult(findings: CheckerFinding[]): CheckerResult {
  const sorted = [...findings].sort((a, b) => {
    if (a.blocking !== b.blocking) {
      return a.blocking ? -1 : 1;
    }
    return (SEVERITY_ORDER[a.severity] ?? 2) - (SEVERITY_ORDER[b.severity] ?? 2);
  });

  return {
    findings: sorted,
    blocking: sorted.filter((f) => f.blocking),
    advisory: sorted.filter((f) => !f.blocking),
    timestamp: new Date().toISOString(),
  };
}

/**
 * Run all custom A11yFirst rules against an HTML string and return a
 * `CheckerResult` containing only the custom-rule findings.
 *
 * Combine the result with `adaptAxeResults()` output to get the full picture.
 */
export function runCustomChecks(html: string): CheckerResult {
  const findings: CheckerFinding[] = [
    ...checkHeadingSequence(html),
    ...checkLinkText(html),
    ...checkImageAlt(html),
    ...checkTableStructure(html),
  ];

  return buildCheckerResult(findings);
}
