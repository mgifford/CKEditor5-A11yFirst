/**
 * A11yFirstLinkPlugin — validates link text quality.
 *
 * Scans every `<a href="…">` element in the editor's HTML output and reports
 * links that use generic, non-descriptive text such as "click here", "read
 * more", "link", or an empty string.
 *
 * ## WCAG Reference
 * - Success Criterion 2.4.4 — Link Purpose (In Context)
 */

import { PluginBase } from '../ckeditor5-types.js';
import type { ValidationFinding } from '../core/validationRegistry.js';
import { ensureRegistry, getRegistry } from './A11yFirstHeadingPlugin.js';

/** Generic link-text phrases that fail the descriptive-link-text criterion. */
export const GENERIC_LINK_PHRASES = new Set([
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

export class A11yFirstLinkPlugin extends PluginBase {
  public static override get pluginName(): string {
    return 'A11yFirstLink';
  }

  public init(): void {
    const { editor } = this;

    if (!editor._a11yFirstTopics) {
      editor._a11yFirstTopics = new Set();
    }
    editor._a11yFirstTopics.add('Link');

    ensureRegistry(editor);

    editor.model.document.on('change:data', () => {
      const html = editor.getData();
      const findings = scanLinkText(html);
      getRegistry(editor).setFindings('links', findings);
    });
  }
}

// ---------------------------------------------------------------------------
// Helpers (exported for testing)
// ---------------------------------------------------------------------------

/**
 * Scan an HTML string for non-descriptive link text and return a
 * `ValidationFinding[]` array.
 */
export function scanLinkText(html: string): ValidationFinding[] {
  const findings: ValidationFinding[] = [];

  for (const match of html.matchAll(/<a\s+href[^>]*>([\s\S]*?)<\/a>/gi)) {
    const rawText = (match[1] ?? '').replace(/<[^>]+>/g, '').trim();
    const linkText = rawText.toLowerCase();

    if (GENERIC_LINK_PHRASES.has(linkText)) {
      findings.push({
        level: 'error',
        message: `Link text "${rawText || '(empty)'}" is not descriptive. Use text that describes the link destination.`,
      });
    }
  }

  return findings;
}
