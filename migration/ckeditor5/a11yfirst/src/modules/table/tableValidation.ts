/**
 * Table accessibility validation.
 *
 * Functions in this module inspect HTML strings and, optionally, externally
 * stored `TableA11yData` to produce structured validation results for each
 * table found in the content.  They are designed to work regardless of
 * whether the hosting CKEditor5 build includes the `TableCaption` plugin.
 */

import type { TableA11yData, TableValidationResult } from './types';
import { extractTableCaption, extractTableSummary, hasTableCaption, hasTableSummary } from './tableCaption';

/**
 * Validate accessibility attributes for a single `<table>` HTML fragment.
 *
 * @param tableHtml    The full `<table>…</table>` HTML string to inspect.
 * @param externalData Optional externally-stored caption / summary metadata.
 */
export function validateTableAccessibility(
  tableHtml: string,
  externalData?: TableA11yData,
): TableValidationResult {
  const captionText = extractTableCaption(tableHtml) ?? (externalData?.caption?.trim() || null);
  const summaryText = extractTableSummary(tableHtml) ?? (externalData?.summary?.trim() || null);

  return {
    hasCaption: hasTableCaption(tableHtml, externalData?.caption),
    hasSummary: hasTableSummary(tableHtml, externalData?.summary),
    hasHeaders: /<th[\s>]/i.test(tableHtml),
    hasScopes: /<th[^>]*\bscope\s*=\s*["'][^"']+["'][^>]*>/i.test(tableHtml),
    hasEmptyHeaders: /<th[^>]*>\s*<\/th>/i.test(tableHtml),
    captionText: captionText && captionText.trim().length > 0 ? captionText.trim() : null,
    summaryText: summaryText && summaryText.trim().length > 0 ? summaryText.trim() : null,
  };
}

/**
 * Extract all individual `<table>…</table>` fragments from a larger HTML
 * document string.  Nested tables are not supported; each top-level table
 * block is returned as a separate string.
 *
 * @param html Full document HTML to search.
 */
export function extractTableFragments(html: string): string[] {
  const matches = html.match(/<table[\s>][\s\S]*?<\/table>/gi);
  return matches ?? [];
}

/**
 * Validate all tables in an HTML document, merging in any externally-stored
 * accessibility data (caption / summary) when present.
 *
 * @param html         Full document HTML.
 * @param externalData Optional externally-stored caption / summary metadata
 *                     applied to every table found in the document.  For
 *                     multi-table documents, use `validateTableAccessibility`
 *                     directly with per-table metadata instead.
 */
export function validateAllTables(
  html: string,
  externalData?: TableA11yData,
): TableValidationResult[] {
  const fragments = extractTableFragments(html);
  return fragments.map((fragment) => validateTableAccessibility(fragment, externalData));
}
