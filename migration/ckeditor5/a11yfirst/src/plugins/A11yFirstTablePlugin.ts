/**
 * A11yFirstTablePlugin — validates table structure and labels nested editables.
 *
 * Responsibilities:
 *   1. **Validation** — on every `change:data` event, checks each `<table>`
 *      in the editor's HTML output for missing captions, missing header cells
 *      (`<th>`), and header cells without `scope` attributes.
 *
 *   2. **Accessible labelling** — after the editor renders (and after each
 *      data change), sets `aria-label` on every `ck-editor__nested-editable`
 *      cell so that assistive technology can identify each cell by its
 *      structural position:
 *        - `<th>` in `<thead>` → `"Column N header"`
 *        - `<th>` in `<tbody>` → `"Row N header"`
 *        - `<td>`              → `"Row N, Column M"`
 *
 * ## WCAG References
 * - Success Criterion 1.3.1 — Info and Relationships
 */

import { PluginBase } from '../ckeditor5-types.js';
import type { ValidationFinding } from '../core/validationRegistry.js';
import { ensureRegistry, getRegistry } from './A11yFirstHeadingPlugin.js';

export class A11yFirstTablePlugin extends PluginBase {
  public static override get pluginName(): string {
    return 'A11yFirstTable';
  }

  public init(): void {
    const { editor } = this;

    if (!editor._a11yFirstTopics) {
      editor._a11yFirstTopics = new Set();
    }
    editor._a11yFirstTopics.add('Table');

    ensureRegistry(editor);

    // Label nested editables on first render.
    editor.on('ready', () => {
      labelNestedEditables(editor);
    });

    editor.model.document.on('change:data', () => {
      // Defer labelling to let CKEditor5 finish updating the DOM.
      setTimeout(() => labelNestedEditables(editor), 0);

      const html = editor.getData();
      const findings = scanTableStructure(html);
      getRegistry(editor).setFindings('tables', findings);
    });
  }
}

// ---------------------------------------------------------------------------
// Nested-editable labelling (exported for testing)
// ---------------------------------------------------------------------------

/**
 * Set `aria-label` attributes on every nested-editable `<th>`/`<td>` cell
 * in the editor's DOM so that assistive technology can identify cells.
 */
export function labelNestedEditables(
  editor: ConstructorParameters<typeof A11yFirstTablePlugin>[0],
): void {
  const domRoot = editor.editing?.view?.getDomRoot?.() ?? null;
  if (!domRoot) return;

  domRoot
    .querySelectorAll(
      'th.ck-editor__nested-editable, td.ck-editor__nested-editable',
    )
    .forEach((cell) => {
      const row = cell.closest('tr');
      const table = cell.closest('table');
      if (!row || !table) return;

      const allRows = Array.from(table.querySelectorAll('tr'));
      const rowIndex = allRows.indexOf(row as HTMLTableRowElement) + 1;
      const cells = Array.from(row.querySelectorAll('th, td'));
      const colIndex = cells.indexOf(cell as HTMLTableCellElement) + 1;

      if (cell.tagName === 'TH') {
        const inThead = Boolean(cell.closest('thead'));
        cell.setAttribute(
          'aria-label',
          inThead ? `Column ${colIndex} header` : `Row ${rowIndex} header`,
        );
      } else {
        cell.setAttribute('aria-label', `Row ${rowIndex}, Column ${colIndex}`);
      }
    });
}

// ---------------------------------------------------------------------------
// Validation helpers (exported for testing)
// ---------------------------------------------------------------------------

/**
 * Scan an HTML string for table-structure accessibility issues and return a
 * `ValidationFinding[]` array.
 */
export function scanTableStructure(html: string): ValidationFinding[] {
  const findings: ValidationFinding[] = [];
  const tableMatches = Array.from(
    html.matchAll(/<table[^>]*>[\s\S]*?<\/table>/gi),
  );

  tableMatches.forEach((match, tableIndex) => {
    const tableHtml = match[0];
    const n = tableIndex + 1;

    if (!/<caption[\s>]/i.test(tableHtml)) {
      findings.push({
        level: 'advisory',
        message: `Table ${n} has no caption. Add a <caption> element that describes the table's purpose.`,
      });
    }

    if (!/<th[\s>]/i.test(tableHtml)) {
      findings.push({
        level: 'error',
        message: `Table ${n} has no header cells. Use <th> elements to identify column or row headers.`,
      });
    } else {
      const thCount = (tableHtml.match(/<th[\s>]/gi) ?? []).length;
      const scopeCount = (tableHtml.match(/<th[^>]*\bscope\s*=/gi) ?? []).length;
      if (thCount > 0 && scopeCount === 0) {
        findings.push({
          level: 'advisory',
          message: `Table ${n} header cells are missing scope attributes. Add scope="col" or scope="row" to <th> elements.`,
        });
      }
    }
  });

  return findings;
}
