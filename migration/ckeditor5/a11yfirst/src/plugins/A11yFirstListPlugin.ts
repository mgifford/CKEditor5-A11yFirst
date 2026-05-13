/**
 * A11yFirstListPlugin — validates list structure.
 *
 * Checks for two common authoring mistakes:
 *   1. "Fake" lists — text lines that start with bullet characters (•, -, ·)
 *      or numbered patterns (1., 2.) but are not wrapped in `<ul>`/`<ol>`.
 *   2. Deeply nested lists (4+ levels) that may confuse screen reader users.
 *
 * ## WCAG Reference
 * - Success Criterion 1.3.1 — Info and Relationships
 */

import { PluginBase } from '../ckeditor5-types.js';
import type { ValidationFinding } from '../core/validationRegistry.js';
import { ensureRegistry, getRegistry } from './A11yFirstHeadingPlugin.js';

export class A11yFirstListPlugin extends PluginBase {
  public static override get pluginName(): string {
    return 'A11yFirstList';
  }

  public init(): void {
    const { editor } = this;

    if (!editor._a11yFirstTopics) {
      editor._a11yFirstTopics = new Set();
    }
    editor._a11yFirstTopics.add('List');

    ensureRegistry(editor);

    editor.model.document.on('change:data', () => {
      const html = editor.getData();
      const findings = scanListStructure(html);
      getRegistry(editor).setFindings('lists', findings);
    });
  }
}

// ---------------------------------------------------------------------------
// Helpers (exported for testing)
// ---------------------------------------------------------------------------

/**
 * Scan an HTML string for list-structure issues and return a
 * `ValidationFinding[]` array.
 */
export function scanListStructure(html: string): ValidationFinding[] {
  const findings: ValidationFinding[] = [];

  // -------------------------------------------------------------------------
  // Fake-list detection
  // -------------------------------------------------------------------------
  const lines = html.split('\n');
  let prevWasBulletLike = false;

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    const isBulletLike =
      /^[•·-]\s+/.test(trimmed) || /^\d+\.\s+/.test(trimmed);

    if (isBulletLike && !line.includes('<li>')) {
      if (prevWasBulletLike) {
        findings.push({
          level: 'warning',
          message: `Lines ${index} and ${index + 1} appear to be a fake list. Use proper <ul> or <ol> markup for lists.`,
        });
        prevWasBulletLike = false; // reset to avoid cascading duplicates
      } else {
        prevWasBulletLike = true;
      }
    } else {
      prevWasBulletLike = false;
    }
  });

  // -------------------------------------------------------------------------
  // Deep nesting detection
  // -------------------------------------------------------------------------
  const listMatches = html.match(/<(ul|ol)[\s>][\s\S]*?<\/(ul|ol)>/gi);
  if (listMatches) {
    for (const list of listMatches) {
      const nestedCount = (list.match(/<(ul|ol)[\s>]/gi) ?? []).length;
      if (nestedCount > 3) {
        findings.push({
          level: 'advisory',
          message:
            'Deeply nested lists (4+ levels) may confuse screen reader users. Consider flattening the structure.',
        });
      }
    }
  }

  return findings;
}
