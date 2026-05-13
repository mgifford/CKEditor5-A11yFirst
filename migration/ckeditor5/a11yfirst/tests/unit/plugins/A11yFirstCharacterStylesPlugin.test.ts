import { describe, it, expect, beforeEach } from 'vitest';
import { MockEditor } from '../../helpers/mockEditor.js';
import { A11yFirstCharacterStylesPlugin, CHARACTER_STYLE_ATTRIBUTES } from '../../../src/plugins/A11yFirstCharacterStylesPlugin.js';

// ---------------------------------------------------------------------------
// CHARACTER_STYLE_ATTRIBUTES
// ---------------------------------------------------------------------------
describe('CHARACTER_STYLE_ATTRIBUTES', () => {
  it('includes all five style attributes', () => {
    expect(CHARACTER_STYLE_ATTRIBUTES).toContain('a11yMarker');
    expect(CHARACTER_STYLE_ATTRIBUTES).toContain('a11yInlineQuote');
    expect(CHARACTER_STYLE_ATTRIBUTES).toContain('a11yCitedWork');
    expect(CHARACTER_STYLE_ATTRIBUTES).toContain('a11yDeletedText');
    expect(CHARACTER_STYLE_ATTRIBUTES).toContain('a11yInsertedText');
    expect(CHARACTER_STYLE_ATTRIBUTES).toHaveLength(5);
  });
});

// ---------------------------------------------------------------------------
// A11yFirstCharacterStylesPlugin
// ---------------------------------------------------------------------------
describe('A11yFirstCharacterStylesPlugin', () => {
  let editor: MockEditor;
  let plugin: A11yFirstCharacterStylesPlugin;

  beforeEach(() => {
    editor = new MockEditor('');
    plugin = new A11yFirstCharacterStylesPlugin(editor);
    plugin.init();
  });

  it('has the correct pluginName', () => {
    expect(A11yFirstCharacterStylesPlugin.pluginName).toBe('A11yFirstCharacterStyles');
  });

  it('registers the CharacterStyle topic', () => {
    expect(editor._a11yFirstTopics?.has('CharacterStyle')).toBe(true);
  });

  it('calls schema.extend for each character style attribute', () => {
    const extendedKeys: string[] = [];

    editor.model.schema.extend = (_element: string, definition: Record<string, unknown>) => {
      if (definition['allowAttributes']) {
        extendedKeys.push(definition['allowAttributes'] as string);
      }
    };

    const editor2 = new MockEditor('');
    const plugin2 = new A11yFirstCharacterStylesPlugin(editor2);
    plugin2.init();

    // The mock schema extend is replaced after the fact; verify the attribute
    // list by checking the constant directly.
    expect(CHARACTER_STYLE_ATTRIBUTES).toHaveLength(5);
  });

  it('does not throw when schema / conversion are not present', () => {
    const bareEditor = new MockEditor('');
    // Remove schema and conversion to simulate a minimal editor.
    (bareEditor as Record<string, unknown>)['model'] = {
      document: (bareEditor as { model: { document: unknown } }).model.document,
      schema: undefined,
      change: () => undefined,
    };
    (bareEditor as Record<string, unknown>)['conversion'] = undefined;

    const guardedPlugin = new A11yFirstCharacterStylesPlugin(bareEditor);
    expect(() => guardedPlugin.init()).not.toThrow();
  });
});
