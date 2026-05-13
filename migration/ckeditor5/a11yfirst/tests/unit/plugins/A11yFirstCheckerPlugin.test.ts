import { describe, it, expect, beforeEach } from 'vitest';
import { MockEditor } from '../../helpers/mockEditor.js';
import { A11yFirstCheckerPlugin, runA11yCheck } from '../../../src/plugins/A11yFirstCheckerPlugin.js';
import { A11yFirstHeadingPlugin } from '../../../src/plugins/A11yFirstHeadingPlugin.js';

// ---------------------------------------------------------------------------
// runA11yCheck (exported helper, no axe-core available in tests)
// ---------------------------------------------------------------------------
describe('runA11yCheck', () => {
  it('resolves to a CheckerRunResult with the correct shape', async () => {
    const editor = new MockEditor('<h2>Clean</h2><p>Some text.</p>');
    const result = await runA11yCheck(editor);

    expect(result).toHaveProperty('findings');
    expect(result).toHaveProperty('blocking');
    expect(result).toHaveProperty('advisory');
    expect(result).toHaveProperty('timestamp');
    expect(typeof result.timestamp).toBe('string');
  });

  it('returns no findings for clean content', async () => {
    const html =
      '<h2>Overview</h2><h3>Detail</h3>' +
      '<p><a href="/guide">Read the energy guide</a></p>' +
      '<img src="solar.jpg" alt="Solar panels">' +
      '<table><caption>Data</caption>' +
      '<tr><th scope="col">Year</th></tr>' +
      '<tr><td>2024</td></tr></table>';
    const editor = new MockEditor(html);
    const result = await runA11yCheck(editor);
    expect(result.findings).toHaveLength(0);
  });

  it('detects a heading skip', async () => {
    const editor = new MockEditor('<h2>Title</h2><h4>Skipped</h4>');
    const result = await runA11yCheck(editor);
    expect(result.findings.some((f) => f.message.includes('H4'))).toBe(true);
  });

  it('detects a non-descriptive link', async () => {
    const editor = new MockEditor('<p><a href="/">click here</a></p>');
    const result = await runA11yCheck(editor);
    expect(result.blocking.some((f) => f.message.includes('click here'))).toBe(true);
  });

  it('detects a missing image alt', async () => {
    const editor = new MockEditor('<img src="logo.png">');
    const result = await runA11yCheck(editor);
    expect(result.blocking.some((f) => f.message.includes('alt'))).toBe(true);
  });

  it('places blocking findings before advisory', async () => {
    const editor = new MockEditor(
      '<img src="logo.png"><table><tr><td>no headers</td></tr></table>',
    );
    const result = await runA11yCheck(editor);
    if (result.findings.length >= 2) {
      const firstNonBlocking = result.findings.findIndex((f) => !f.blocking);
      const firstBlocking = result.findings.findIndex((f) => f.blocking);
      if (firstBlocking !== -1 && firstNonBlocking !== -1) {
        expect(firstBlocking).toBeLessThan(firstNonBlocking);
      }
    }
  });
});

// ---------------------------------------------------------------------------
// A11yFirstCheckerPlugin
// ---------------------------------------------------------------------------
describe('A11yFirstCheckerPlugin', () => {
  let editor: MockEditor;
  let plugin: A11yFirstCheckerPlugin;

  beforeEach(() => {
    editor = new MockEditor('');
    new A11yFirstHeadingPlugin(editor).init();
    plugin = new A11yFirstCheckerPlugin(editor);
    plugin.init();
  });

  it('has the correct pluginName', () => {
    expect(A11yFirstCheckerPlugin.pluginName).toBe('A11yFirstChecker');
  });

  it('registers the A11yCheckerSummary topic', () => {
    expect(editor._a11yFirstTopics?.has('A11yCheckerSummary')).toBe(true);
  });

  it('attaches a11yCheck() to the editor', () => {
    expect(typeof editor.a11yCheck).toBe('function');
  });

  it('editor.a11yCheck() returns a promise', () => {
    const result = editor.a11yCheck?.();
    expect(result).toBeInstanceOf(Promise);
  });

  it('updates the checker registry category on change:data', () => {
    editor.triggerChange('<p><a href="/">click here</a></p>');
    const checkerFindings = editor.getRegistry().getFindings('checker');
    expect(checkerFindings).toBeDefined();
  });
});
