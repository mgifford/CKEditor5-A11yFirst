import { describe, it, expect, beforeEach } from 'vitest';
import { MockEditor } from '../../helpers/mockEditor.js';
import { A11yFirstLinkPlugin, scanLinkText, GENERIC_LINK_PHRASES } from '../../../src/plugins/A11yFirstLinkPlugin.js';
import { A11yFirstHeadingPlugin } from '../../../src/plugins/A11yFirstHeadingPlugin.js';

// ---------------------------------------------------------------------------
// GENERIC_LINK_PHRASES
// ---------------------------------------------------------------------------
describe('GENERIC_LINK_PHRASES', () => {
  it('includes "click here"', () => {
    expect(GENERIC_LINK_PHRASES.has('click here')).toBe(true);
  });

  it('includes empty string', () => {
    expect(GENERIC_LINK_PHRASES.has('')).toBe(true);
  });

  it('does not include meaningful phrases', () => {
    expect(GENERIC_LINK_PHRASES.has('download the annual report')).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// scanLinkText (pure function)
// ---------------------------------------------------------------------------
describe('scanLinkText', () => {
  it('returns empty for descriptive link text', () => {
    expect(scanLinkText('<a href="/guide">Read the solar energy guide</a>')).toHaveLength(0);
  });

  it('flags "click here"', () => {
    const findings = scanLinkText('<a href="/page">click here</a>');
    expect(findings).toHaveLength(1);
    expect(findings[0].level).toBe('error');
    expect(findings[0].message).toContain('click here');
  });

  it('flags an empty link', () => {
    const findings = scanLinkText('<a href="/page"></a>');
    expect(findings).toHaveLength(1);
    expect(findings[0].message).toContain('(empty)');
  });

  it('flags "read more"', () => {
    expect(scanLinkText('<a href="/page">read more</a>')).toHaveLength(1);
  });

  it('flags "more"', () => {
    expect(scanLinkText('<a href="/page">more</a>')).toHaveLength(1);
  });

  it('is case-insensitive', () => {
    expect(scanLinkText('<a href="/page">Click Here</a>')).toHaveLength(1);
  });

  it('does not flag links with no href (not a navigation link)', () => {
    // href is required by the pattern; a bare <a> without href won't match.
    expect(scanLinkText('<a name="section">Anchor</a>')).toHaveLength(0);
  });

  it('returns empty for HTML without links', () => {
    expect(scanLinkText('<p>Just text.</p>')).toHaveLength(0);
  });

  it('handles nested HTML inside link text', () => {
    const findings = scanLinkText('<a href="/page"><strong>click here</strong></a>');
    expect(findings).toHaveLength(1);
  });
});

// ---------------------------------------------------------------------------
// A11yFirstLinkPlugin
// ---------------------------------------------------------------------------
describe('A11yFirstLinkPlugin', () => {
  let editor: MockEditor;
  let plugin: A11yFirstLinkPlugin;

  beforeEach(() => {
    editor = new MockEditor('');
    new A11yFirstHeadingPlugin(editor).init(); // creates registry
    plugin = new A11yFirstLinkPlugin(editor);
    plugin.init();
  });

  it('has the correct pluginName', () => {
    expect(A11yFirstLinkPlugin.pluginName).toBe('A11yFirstLink');
  });

  it('registers the Link topic', () => {
    expect(editor._a11yFirstTopics?.has('Link')).toBe(true);
  });

  it('writes link findings to the registry on change:data', () => {
    editor.triggerChange('<p><a href="/page">click here</a></p>');
    const findings = editor.getRegistry().getFindings('links') as unknown[];
    expect(findings).toHaveLength(1);
  });

  it('clears findings when link text is fixed', () => {
    editor.triggerChange('<p><a href="/page">click here</a></p>');
    editor.triggerChange('<p><a href="/page">View the installation guide</a></p>');
    const findings = editor.getRegistry().getFindings('links') as unknown[];
    expect(findings).toHaveLength(0);
  });
});
