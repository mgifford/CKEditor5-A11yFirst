import { describe, it, expect, beforeEach } from 'vitest';
import { MockEditor } from '../../helpers/mockEditor.js';
import { A11yFirstImagePlugin, scanImageAlt } from '../../../src/plugins/A11yFirstImagePlugin.js';
import { A11yFirstHeadingPlugin } from '../../../src/plugins/A11yFirstHeadingPlugin.js';

// ---------------------------------------------------------------------------
// scanImageAlt (pure function)
// ---------------------------------------------------------------------------
describe('scanImageAlt', () => {
  it('returns empty when all images have descriptive alt text', () => {
    expect(scanImageAlt('<img src="solar.jpg" alt="Solar panels">')).toHaveLength(0);
  });

  it('flags an image missing the alt attribute', () => {
    const findings = scanImageAlt('<img src="logo.png">');
    expect(findings).toHaveLength(1);
    expect(findings[0].level).toBe('error');
    expect(findings[0].message).toContain('alt attribute');
  });

  it('produces an advisory finding for empty alt text', () => {
    const findings = scanImageAlt('<img src="decorative.gif" alt="">');
    expect(findings).toHaveLength(1);
    expect(findings[0].level).toBe('advisory');
    expect(findings[0].message).toContain('decorative');
  });

  it('handles single-quoted alt attributes', () => {
    expect(scanImageAlt("<img src='photo.jpg' alt='Sunset'>")).toHaveLength(0);
  });

  it('returns empty when no images are present', () => {
    expect(scanImageAlt('<p>Just text.</p>')).toHaveLength(0);
  });

  it('flags every missing alt in a multi-image document', () => {
    const html = '<img src="a.jpg"><img src="b.jpg" alt=""><img src="c.jpg" alt="Photo">';
    const findings = scanImageAlt(html);
    expect(findings).toHaveLength(2); // one error + one advisory
  });
});

// ---------------------------------------------------------------------------
// A11yFirstImagePlugin
// ---------------------------------------------------------------------------
describe('A11yFirstImagePlugin', () => {
  let editor: MockEditor;
  let plugin: A11yFirstImagePlugin;

  beforeEach(() => {
    editor = new MockEditor('');
    new A11yFirstHeadingPlugin(editor).init();
    plugin = new A11yFirstImagePlugin(editor);
    plugin.init();
  });

  it('has the correct pluginName', () => {
    expect(A11yFirstImagePlugin.pluginName).toBe('A11yFirstImage');
  });

  it('registers the Image topic', () => {
    expect(editor._a11yFirstTopics?.has('Image')).toBe(true);
  });

  it('writes image findings to the registry on change:data', () => {
    editor.triggerChange('<img src="logo.png">');
    const findings = editor.getRegistry().getFindings('images') as unknown[];
    expect(findings).toHaveLength(1);
  });

  it('clears findings when images are fixed', () => {
    editor.triggerChange('<img src="logo.png">');
    editor.triggerChange('<img src="logo.png" alt="Company logo">');
    const findings = editor.getRegistry().getFindings('images') as unknown[];
    expect(findings).toHaveLength(0);
  });
});
