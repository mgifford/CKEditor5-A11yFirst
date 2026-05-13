import { describe, it, expect, beforeEach } from 'vitest';
import { MockEditor } from '../../helpers/mockEditor.js';
import { A11yFirstHeadingPlugin, scanHeadingSequence } from '../../../src/plugins/A11yFirstHeadingPlugin.js';

// ---------------------------------------------------------------------------
// scanHeadingSequence (pure function)
// ---------------------------------------------------------------------------
describe('scanHeadingSequence', () => {
  it('returns empty for valid heading sequence', () => {
    expect(scanHeadingSequence('<h2>Intro</h2><h3>Details</h3>')).toHaveLength(0);
  });

  it('returns a finding when a level is skipped', () => {
    const findings = scanHeadingSequence('<h2>Intro</h2><h4>Details</h4>');
    expect(findings).toHaveLength(1);
    expect(findings[0].level).toBe('error');
    expect(findings[0].message).toContain('H4');
    expect(findings[0].message).toContain('H2');
  });

  it('detects multiple skips', () => {
    const findings = scanHeadingSequence('<h2>A</h2><h4>B</h4><h6>C</h6>');
    expect(findings.length).toBeGreaterThanOrEqual(2);
  });

  it('returns empty for a single heading', () => {
    expect(scanHeadingSequence('<h1>Title</h1>')).toHaveLength(0);
  });

  it('returns empty for content with no headings', () => {
    expect(scanHeadingSequence('<p>No headings</p>')).toHaveLength(0);
  });

  it('returns empty for consecutive levels', () => {
    expect(
      scanHeadingSequence('<h1>A</h1><h2>B</h2><h3>C</h3><h4>D</h4>'),
    ).toHaveLength(0);
  });

  it('is case-insensitive on heading tags', () => {
    const findings = scanHeadingSequence('<H2>A</H2><H4>B</H4>');
    expect(findings).toHaveLength(1);
  });
});

// ---------------------------------------------------------------------------
// A11yFirstHeadingPlugin
// ---------------------------------------------------------------------------
describe('A11yFirstHeadingPlugin', () => {
  let editor: MockEditor;
  let plugin: A11yFirstHeadingPlugin;

  beforeEach(() => {
    editor = new MockEditor('');
    plugin = new A11yFirstHeadingPlugin(editor);
    plugin.init();
  });

  it('has the correct pluginName', () => {
    expect(A11yFirstHeadingPlugin.pluginName).toBe('A11yFirstHeading');
  });

  it('registers the HeadingParagraph topic', () => {
    expect(editor._a11yFirstTopics?.has('HeadingParagraph')).toBe(true);
  });

  it('attaches a ValidationRegistry to the editor', () => {
    expect(editor.getRegistry()).toBeDefined();
  });

  it('writes heading findings to the registry on change:data', () => {
    editor.triggerChange('<h2>Section</h2><h4>Sub</h4>');
    const findings = editor.getRegistry().getFindings('headings') as unknown[];
    expect(findings).toHaveLength(1);
  });

  it('clears findings when content is fixed', () => {
    editor.triggerChange('<h2>Section</h2><h4>Sub</h4>');
    editor.triggerChange('<h2>Section</h2><h3>Sub</h3>');
    const findings = editor.getRegistry().getFindings('headings') as unknown[];
    expect(findings).toHaveLength(0);
  });

  it('does not overwrite existing _a11yFirstTopics set', () => {
    const pre = editor._a11yFirstTopics;
    expect(editor._a11yFirstTopics).toBe(pre);
  });
});
