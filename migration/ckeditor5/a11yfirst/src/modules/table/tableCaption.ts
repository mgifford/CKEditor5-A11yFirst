/**
 * Table caption and summary helpers.
 *
 * The CKEditor5 classic build (v41) does not include the `TableCaption`
 * plugin, so `<caption>` elements are stripped by the editor during the
 * setData / getData cycle.  Similarly, the deprecated HTML `summary`
 * attribute is removed by CKEditor5's schema.  These utilities allow the
 * caption and summary to be managed as external state (e.g., in a JS object)
 * rather than stored inside the editor's data model.
 */

import type { TableA11yData } from './types';

/**
 * Extract the text content of the first `<caption>` element found in an
 * HTML string.  Returns `null` when no caption is present.
 *
 * @example
 * extractTableCaption('<table><caption>Energy data</caption><tr>…</tr></table>');
 * // → 'Energy data'
 */
export function extractTableCaption(html: string): string | null {
  const match = html.match(/<caption[^>]*>([\s\S]*?)<\/caption>/i);
  return match ? match[1].trim() : null;
}

/**
 * Extract the value of the `summary` attribute from the first `<table>` tag
 * found in an HTML string.  Returns `null` when no summary is present.
 *
 * Note: the `summary` attribute was deprecated in HTML5.  Use an
 * `aria-describedby` pointing to a visible description element for new
 * content, but existing values are preserved so they can be surfaced to
 * authors during validation.
 *
 * @example
 * extractTableSummary('<table summary="Comparison of three initiatives">…</table>');
 * // → 'Comparison of three initiatives'
 */
export function extractTableSummary(html: string): string | null {
  const match = html.match(/<table[^>]*\bsummary\s*=\s*["']([^"']*)["']/i);
  if (!match) return null;
  const value = match[1].trim();
  return value.length > 0 ? value : null;
}

/**
 * Build a `TableA11yData` state object by extracting any caption and summary
 * from the supplied HTML string.  Missing values default to empty strings so
 * the object is always safe to consume without null-checks.
 *
 * Use this function to initialise state from the original page HTML
 * *before* CKEditor5 strips the unsupported elements.
 *
 * @example
 * const data = extractTableA11yData(document.getElementById('editor').innerHTML);
 * // → { caption: 'Community priorities…', summary: '' }
 */
export function extractTableA11yData(html: string): TableA11yData {
  return {
    caption: extractTableCaption(html) ?? '',
    summary: extractTableSummary(html) ?? '',
  };
}

/**
 * Determine whether a caption is present, considering both an inline HTML
 * `<caption>` element and an externally-stored caption string.
 *
 * @param html           Raw HTML to search (typically the output of getData()).
 * @param externalCaption Optional caption stored outside the editor model.
 */
export function hasTableCaption(html: string, externalCaption?: string): boolean {
  if (extractTableCaption(html) !== null) return true;
  return typeof externalCaption === 'string' && externalCaption.trim().length > 0;
}

/**
 * Determine whether a summary is present, considering both an inline HTML
 * `summary` attribute and an externally-stored summary string.
 *
 * @param html            Raw HTML to search.
 * @param externalSummary Optional summary stored outside the editor model.
 */
export function hasTableSummary(html: string, externalSummary?: string): boolean {
  if (extractTableSummary(html) !== null) return true;
  return typeof externalSummary === 'string' && externalSummary.trim().length > 0;
}
