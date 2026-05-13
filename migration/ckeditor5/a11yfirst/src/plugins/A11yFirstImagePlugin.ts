/**
 * A11yFirstImagePlugin — validates image alternative text.
 *
 * Scans every `<img>` element in the editor's HTML output and produces a
 * ValidationFinding for each image that:
 *   - Is missing the `alt` attribute entirely (blocking error)
 *   - Has an empty `alt=""` (advisory suggestion — valid for decorative images)
 *
 * ## WCAG Reference
 * - Success Criterion 1.1.1 — Non-text Content
 */

import { PluginBase } from '../ckeditor5-types.js';
import type { ValidationFinding } from '../core/validationRegistry.js';
import { ensureRegistry, getRegistry } from './A11yFirstHeadingPlugin.js';

export class A11yFirstImagePlugin extends PluginBase {
  public static override get pluginName(): string {
    return 'A11yFirstImage';
  }

  public init(): void {
    const { editor } = this;

    if (!editor._a11yFirstTopics) {
      editor._a11yFirstTopics = new Set();
    }
    editor._a11yFirstTopics.add('Image');

    ensureRegistry(editor);

    editor.model.document.on('change:data', () => {
      const html = editor.getData();
      const findings = scanImageAlt(html);
      getRegistry(editor).setFindings('images', findings);
    });
  }
}

// ---------------------------------------------------------------------------
// Helpers (exported for testing)
// ---------------------------------------------------------------------------

/**
 * Scan an HTML string for image alt-text violations.
 */
export function scanImageAlt(html: string): ValidationFinding[] {
  const findings: ValidationFinding[] = [];

  for (const match of html.matchAll(/<img\b([^>]*)>/gi)) {
    const attrs = match[1] ?? '';
    const altMatch = attrs.match(/\balt\s*=\s*(?:"([^"]*)"|'([^']*)')/i);

    if (!altMatch) {
      findings.push({
        level: 'error',
        message:
          'Image is missing the alt attribute. Provide descriptive alternative text or use alt="" for decorative images.',
      });
    } else {
      const altText = (altMatch[1] ?? altMatch[2] ?? '').trim();
      if (altText === '') {
        findings.push({
          level: 'advisory',
          message:
            'Image has empty alt text. Confirm the image is decorative and conveys no information.',
        });
      }
    }
  }

  return findings;
}
