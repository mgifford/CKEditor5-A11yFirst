/**
 * A11yFirstHeadingPlugin — enforces an accessible heading hierarchy.
 *
 * On every `change:data` event the plugin scans the editor's HTML output for
 * heading elements and reports any skipped heading levels (e.g. H2 → H4) to
 * the ValidationRegistry.
 *
 * ## WCAG Reference
 * - Success Criterion 1.3.1 — Info and Relationships
 *
 * ## CKEditor5 Integration
 * Add the plugin to your editor configuration:
 * ```js
 * import { A11yFirstHeadingPlugin } from 'ckeditor5-a11yfirst';
 * ClassicEditor.create(element, { plugins: [A11yFirstHeadingPlugin, ...] });
 * ```
 */

import type { A11yEditor } from '../ckeditor5-types.js';
import { PluginBase } from '../ckeditor5-types.js';
import type { ValidationFinding } from '../core/validationRegistry.js';
import { ValidationRegistry } from '../core/validationRegistry.js';

export class A11yFirstHeadingPlugin extends PluginBase {
  public static override get pluginName(): string {
    return 'A11yFirstHeading';
  }

  public init(): void {
    const { editor } = this;

    if (!editor._a11yFirstTopics) {
      editor._a11yFirstTopics = new Set();
    }
    editor._a11yFirstTopics.add('HeadingParagraph');

    ensureRegistry(editor);

    editor.model.document.on('change:data', () => {
      const html = editor.getData();
      const findings = scanHeadingSequence(html);
      getRegistry(editor).setFindings('headings', findings);
    });
  }
}

// ---------------------------------------------------------------------------
// Helpers (exported for testing)
// ---------------------------------------------------------------------------

/**
 * Scan an HTML string for heading-level sequence violations and return a
 * `ValidationFinding[]` array.
 */
export function scanHeadingSequence(html: string): ValidationFinding[] {
  const findings: ValidationFinding[] = [];
  const levels = Array.from(html.matchAll(/<h([1-6])\b/gi)).map((m) =>
    Number(m[1]),
  );

  let previous: number | null = null;

  for (const level of levels) {
    if (previous !== null && level > previous + 1) {
      findings.push({
        level: 'error',
        message: `Heading sequence warning: found H${level} after H${previous}. Heading levels should not be skipped.`,
      });
    }
    previous = level;
  }

  return findings;
}

// ---------------------------------------------------------------------------
// Registry helpers (shared by all plugins in this package)
// ---------------------------------------------------------------------------

/** Attach a fresh ValidationRegistry to the editor if one does not exist. */
export function ensureRegistry(editor: A11yEditor): void {
  if (!(editor as Record<string, unknown>)['_a11yFirstRegistry']) {
    (editor as Record<string, unknown>)['_a11yFirstRegistry'] =
      new ValidationRegistry();
  }
}

/** Retrieve the ValidationRegistry attached to the editor. */
export function getRegistry(editor: A11yEditor): ValidationRegistry {
  return (editor as Record<string, unknown>)[
    '_a11yFirstRegistry'
  ] as ValidationRegistry;
}
