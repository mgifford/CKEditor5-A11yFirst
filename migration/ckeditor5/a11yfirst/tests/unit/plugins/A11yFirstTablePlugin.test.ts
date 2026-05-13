import { describe, it, expect, beforeEach } from 'vitest';
import { MockEditor } from '../../helpers/mockEditor.js';
import { A11yFirstTablePlugin, scanTableStructure, labelNestedEditables } from '../../../src/plugins/A11yFirstTablePlugin.js';
import { A11yFirstHeadingPlugin } from '../../../src/plugins/A11yFirstHeadingPlugin.js';

// ---------------------------------------------------------------------------
// scanTableStructure (pure function)
// ---------------------------------------------------------------------------
describe('scanTableStructure', () => {
  it('returns empty for a well-formed table', () => {
    const html =
      '<table><caption>Energy data</caption>' +
      '<tr><th scope="col">Year</th><th scope="col">kWh</th></tr>' +
      '<tr><td>2024</td><td>1200</td></tr></table>';
    expect(scanTableStructure(html)).toHaveLength(0);
  });

  it('flags a table missing a caption', () => {
    const html =
      '<table><tr><th scope="col">Year</th></tr><tr><td>2024</td></tr></table>';
    const findings = scanTableStructure(html);
    const captionFinding = findings.find((f) => f.message.includes('caption'));
    expect(captionFinding).toBeDefined();
    expect(captionFinding?.level).toBe('advisory');
  });

  it('flags a table missing header cells', () => {
    const html =
      '<table><caption>Data</caption>' +
      '<tr><td>Year</td><td>kWh</td></tr></table>';
    const findings = scanTableStructure(html);
    const headerFinding = findings.find((f) => f.message.includes('header cells'));
    expect(headerFinding).toBeDefined();
    expect(headerFinding?.level).toBe('error');
  });

  it('flags header cells missing scope attributes', () => {
    const html =
      '<table><caption>Data</caption>' +
      '<tr><th>Year</th></tr><tr><td>2024</td></tr></table>';
    const findings = scanTableStructure(html);
    const scopeFinding = findings.find((f) => f.message.includes('scope'));
    expect(scopeFinding).toBeDefined();
    expect(scopeFinding?.level).toBe('advisory');
  });

  it('returns empty for content without tables', () => {
    expect(scanTableStructure('<p>No tables here.</p>')).toHaveLength(0);
  });

  it('identifies issues per table index', () => {
    const html =
      '<table><tr><td>No headers</td></tr></table>' +
      '<table><caption>Good</caption><tr><th scope="col">Col</th></tr></table>';
    const findings = scanTableStructure(html);
    expect(findings.some((f) => f.message.includes('Table 1'))).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// labelNestedEditables (DOM function)
// ---------------------------------------------------------------------------
describe('labelNestedEditables', () => {
  it('labels thead <th> cells as "Column N header"', () => {
    const table = document.createElement('table');
    table.innerHTML =
      '<thead><tr>' +
      '<th class="ck-editor__nested-editable">Col1</th>' +
      '<th class="ck-editor__nested-editable">Col2</th>' +
      '</tr></thead><tbody></tbody>';

    const div = document.createElement('div');
    div.appendChild(table);
    document.body.appendChild(div);

    const editor = new MockEditor('');
    (editor.editing as { view: { getDomRoot(): HTMLElement | null } }).view = {
      getDomRoot: () => div,
    };

    labelNestedEditables(editor);

    const ths = table.querySelectorAll('th');
    expect(ths[0].getAttribute('aria-label')).toBe('Column 1 header');
    expect(ths[1].getAttribute('aria-label')).toBe('Column 2 header');

    document.body.removeChild(div);
  });

  it('labels tbody <th> cells as "Row N header"', () => {
    const table = document.createElement('table');
    table.innerHTML =
      '<tbody>' +
      '<tr><th class="ck-editor__nested-editable">Row1</th><td>Data</td></tr>' +
      '</tbody>';

    const div = document.createElement('div');
    div.appendChild(table);
    document.body.appendChild(div);

    const editor = new MockEditor('');
    (editor.editing as { view: { getDomRoot(): HTMLElement | null } }).view = {
      getDomRoot: () => div,
    };

    labelNestedEditables(editor);

    const th = table.querySelector('th');
    expect(th?.getAttribute('aria-label')).toBe('Row 1 header');

    document.body.removeChild(div);
  });

  it('labels <td> cells as "Row N, Column M"', () => {
    const table = document.createElement('table');
    table.innerHTML =
      '<tbody>' +
      '<tr>' +
      '<td class="ck-editor__nested-editable">A</td>' +
      '<td class="ck-editor__nested-editable">B</td>' +
      '</tr>' +
      '</tbody>';

    const div = document.createElement('div');
    div.appendChild(table);
    document.body.appendChild(div);

    const editor = new MockEditor('');
    (editor.editing as { view: { getDomRoot(): HTMLElement | null } }).view = {
      getDomRoot: () => div,
    };

    labelNestedEditables(editor);

    const tds = table.querySelectorAll('td');
    expect(tds[0].getAttribute('aria-label')).toBe('Row 1, Column 1');
    expect(tds[1].getAttribute('aria-label')).toBe('Row 1, Column 2');

    document.body.removeChild(div);
  });

  it('does not throw when getDomRoot returns null', () => {
    const editor = new MockEditor('');
    expect(() => labelNestedEditables(editor)).not.toThrow();
  });
});

// ---------------------------------------------------------------------------
// A11yFirstTablePlugin
// ---------------------------------------------------------------------------
describe('A11yFirstTablePlugin', () => {
  let editor: MockEditor;
  let plugin: A11yFirstTablePlugin;

  beforeEach(() => {
    editor = new MockEditor('');
    new A11yFirstHeadingPlugin(editor).init();
    plugin = new A11yFirstTablePlugin(editor);
    plugin.init();
  });

  it('has the correct pluginName', () => {
    expect(A11yFirstTablePlugin.pluginName).toBe('A11yFirstTable');
  });

  it('registers the Table topic', () => {
    expect(editor._a11yFirstTopics?.has('Table')).toBe(true);
  });

  it('writes table findings to the registry on change:data', () => {
    editor.triggerChange('<table><tr><td>No headers</td></tr></table>');
    const findings = editor.getRegistry().getFindings('tables') as unknown[];
    expect(findings.length).toBeGreaterThanOrEqual(1);
  });

  it('clears findings when table is fixed', () => {
    editor.triggerChange('<table><tr><td>No headers</td></tr></table>');
    editor.triggerChange(
      '<table><caption>Data</caption>' +
        '<tr><th scope="col">Year</th></tr>' +
        '<tr><td>2024</td></tr></table>',
    );
    const findings = editor.getRegistry().getFindings('tables') as unknown[];
    expect(findings).toHaveLength(0);
  });
});
