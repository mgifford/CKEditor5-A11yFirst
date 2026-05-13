import { describe, it, expect, beforeEach } from 'vitest';
import { MockEditor } from '../../helpers/mockEditor.js';
import { A11yFirstListPlugin, scanListStructure } from '../../../src/plugins/A11yFirstListPlugin.js';
import { A11yFirstHeadingPlugin } from '../../../src/plugins/A11yFirstHeadingPlugin.js';

// ---------------------------------------------------------------------------
// scanListStructure (pure function)
// ---------------------------------------------------------------------------
describe('scanListStructure', () => {
  it('returns empty for proper list markup', () => {
    const html = '<ul><li>Item one</li><li>Item two</li></ul>';
    expect(scanListStructure(html)).toHaveLength(0);
  });

  it('returns empty for content without lists', () => {
    expect(scanListStructure('<p>Just a paragraph.</p>')).toHaveLength(0);
  });

  it('flags two consecutive bullet-like lines as a fake list', () => {
    const html = '• First item\n• Second item';
    const findings = scanListStructure(html);
    expect(findings.length).toBeGreaterThanOrEqual(1);
    expect(findings[0].level).toBe('warning');
  });

  it('flags two consecutive numbered lines as a fake list', () => {
    const html = '1. First\n2. Second';
    const findings = scanListStructure(html);
    expect(findings.length).toBeGreaterThanOrEqual(1);
  });

  it('does not flag a single bullet-like line', () => {
    const html = '• Only one item';
    expect(scanListStructure(html)).toHaveLength(0);
  });

  it('flags deeply nested lists (4+ levels)', () => {
    const html =
      '<ul><li>A<ul><li>B<ul><li>C<ul><li>D</li></ul></li></ul></li></ul></li></ul>';
    const findings = scanListStructure(html);
    const deepFinding = findings.find((f) => f.level === 'advisory');
    expect(deepFinding).toBeDefined();
  });

  it('does not flag lists nested 3 levels deep', () => {
    const html =
      '<ul><li>A<ul><li>B<ul><li>C</li></ul></li></ul></li></ul>';
    const advisoryFindings = scanListStructure(html).filter(
      (f) => f.level === 'advisory',
    );
    expect(advisoryFindings).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// A11yFirstListPlugin
// ---------------------------------------------------------------------------
describe('A11yFirstListPlugin', () => {
  let editor: MockEditor;
  let plugin: A11yFirstListPlugin;

  beforeEach(() => {
    editor = new MockEditor('');
    new A11yFirstHeadingPlugin(editor).init();
    plugin = new A11yFirstListPlugin(editor);
    plugin.init();
  });

  it('has the correct pluginName', () => {
    expect(A11yFirstListPlugin.pluginName).toBe('A11yFirstList');
  });

  it('registers the List topic', () => {
    expect(editor._a11yFirstTopics?.has('List')).toBe(true);
  });

  it('writes list findings to the registry on change:data', () => {
    editor.triggerChange('• First item\n• Second item');
    const findings = editor.getRegistry().getFindings('lists') as unknown[];
    expect(findings.length).toBeGreaterThanOrEqual(1);
  });

  it('clears findings when content is fixed', () => {
    editor.triggerChange('• First item\n• Second item');
    editor.triggerChange('<ul><li>First item</li><li>Second item</li></ul>');
    const findings = editor.getRegistry().getFindings('lists') as unknown[];
    expect(findings).toHaveLength(0);
  });
});
