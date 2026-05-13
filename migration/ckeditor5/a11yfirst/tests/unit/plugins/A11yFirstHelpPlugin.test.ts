import { describe, it, expect, beforeEach } from 'vitest';
import { MockEditor } from '../../helpers/mockEditor.js';
import { A11yFirstHelpPlugin, HELP_TOPIC_LABELS, HELP_TOPIC_ORDER } from '../../../src/plugins/A11yFirstHelpPlugin.js';

// ---------------------------------------------------------------------------
// HELP_TOPIC_LABELS / HELP_TOPIC_ORDER
// ---------------------------------------------------------------------------
describe('HELP_TOPIC_LABELS', () => {
  it('has a label for every key in HELP_TOPIC_ORDER', () => {
    for (const key of HELP_TOPIC_ORDER) {
      expect(HELP_TOPIC_LABELS[key]).toBeTruthy();
    }
  });

  it('always includes GettingStarted and AboutA11yFirst', () => {
    expect(HELP_TOPIC_LABELS['GettingStarted']).toBeTruthy();
    expect(HELP_TOPIC_LABELS['AboutA11yFirst']).toBeTruthy();
  });
});

describe('HELP_TOPIC_ORDER', () => {
  it('ends with GettingStarted then AboutA11yFirst', () => {
    const last = HELP_TOPIC_ORDER.at(-1);
    const secondLast = HELP_TOPIC_ORDER.at(-2);
    expect(last).toBe('AboutA11yFirst');
    expect(secondLast).toBe('GettingStarted');
  });
});

// ---------------------------------------------------------------------------
// A11yFirstHelpPlugin.getHelpTopics()
// ---------------------------------------------------------------------------
describe('A11yFirstHelpPlugin.getHelpTopics()', () => {
  it('always includes GettingStarted and AboutA11yFirst', () => {
    const editor = new MockEditor('');
    const plugin = new A11yFirstHelpPlugin(editor);
    plugin.init();

    const topics = plugin.getHelpTopics();
    expect(topics).toContain('GettingStarted');
    expect(topics).toContain('AboutA11yFirst');
  });

  it('includes topics registered by other plugins', () => {
    const editor = new MockEditor('');
    editor._a11yFirstTopics = new Set(['HeadingParagraph', 'Image', 'Link']);
    const plugin = new A11yFirstHelpPlugin(editor);
    plugin.init();

    const topics = plugin.getHelpTopics();
    expect(topics).toContain('HeadingParagraph');
    expect(topics).toContain('Image');
    expect(topics).toContain('Link');
  });

  it('does not include topics not registered by any plugin', () => {
    const editor = new MockEditor('');
    editor._a11yFirstTopics = new Set();
    const plugin = new A11yFirstHelpPlugin(editor);
    plugin.init();

    const topics = plugin.getHelpTopics();
    expect(topics).not.toContain('HeadingParagraph');
    expect(topics).not.toContain('Table');
  });

  it('adds ParagraphFormat when blockQuote command is present', () => {
    const editor = new MockEditor('', { commands: { blockQuote: {} } });
    editor._a11yFirstTopics = new Set();
    const plugin = new A11yFirstHelpPlugin(editor);
    plugin.init();

    const topics = plugin.getHelpTopics();
    expect(topics).toContain('ParagraphFormat');
  });
});

// ---------------------------------------------------------------------------
// A11yFirstHelpPlugin — DOM methods
// ---------------------------------------------------------------------------
describe('A11yFirstHelpPlugin DOM methods', () => {
  let editor: MockEditor;
  let plugin: A11yFirstHelpPlugin;

  beforeEach(() => {
    editor = new MockEditor('');
    editor._a11yFirstTopics = new Set(['HeadingParagraph']);
    plugin = new A11yFirstHelpPlugin(editor);
    plugin.init();
  });

  it('has the correct pluginName', () => {
    expect(A11yFirstHelpPlugin.pluginName).toBe('A11yFirstHelp');
  });

  it('ensurePanel() returns a <ul> element', () => {
    const panel = plugin.ensurePanel();
    expect(panel.tagName).toBe('UL');
    expect(panel.getAttribute('role')).toBe('menu');
  });

  it('ensurePanel() returns the same element on repeated calls', () => {
    const first = plugin.ensurePanel();
    const second = plugin.ensurePanel();
    expect(first).toBe(second);
  });

  it('createHelpButton() returns a button with aria-haspopup', () => {
    const btn = plugin.createHelpButton();
    expect(btn.tagName).toBe('BUTTON');
    expect(btn.getAttribute('aria-haspopup')).toBe('true');
  });

  it('togglePanel() populates the panel with topic buttons', () => {
    const anchor = document.createElement('button');
    document.body.appendChild(anchor);
    plugin.togglePanel(anchor);

    const panel = plugin.ensurePanel();
    const buttons = panel.querySelectorAll('button');
    expect(buttons.length).toBeGreaterThan(0);

    // Panel should contain at least "Getting Started"
    const labels = Array.from(buttons).map((b) => b.textContent ?? '');
    expect(labels).toContain(HELP_TOPIC_LABELS['GettingStarted']);

    document.body.removeChild(anchor);
  });

  it('togglePanel() closes the panel when called again on the same anchor', () => {
    const anchor = document.createElement('button');
    document.body.appendChild(anchor);

    plugin.togglePanel(anchor); // open
    plugin.togglePanel(anchor); // close

    const panel = plugin.ensurePanel();
    expect(panel.style.display).toBe('none');

    document.body.removeChild(anchor);
  });

  it('onSelect callback is invoked when a topic button is clicked', () => {
    const anchor = document.createElement('button');
    document.body.appendChild(anchor);

    let selected: string | null = null;
    plugin.togglePanel(anchor, (key) => { selected = key; });

    const panel = plugin.ensurePanel();
    const btn = panel.querySelector('button') as HTMLButtonElement;
    btn?.click();

    expect(selected).not.toBeNull();

    document.body.removeChild(anchor);
  });
});
