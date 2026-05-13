/**
 * A11yFirstCharacterStylesPlugin — registers accessible inline character styles.
 *
 * Adds five inline formatting attributes to the CKEditor5 schema and wires up
 * the corresponding upcast (HTML → model) and downcast (model → HTML) converters:
 *
 * | Attribute           | HTML element        | Semantic purpose              |
 * |---------------------|---------------------|-------------------------------|
 * | `a11yMarker`        | `<span class="marker">` | Highlighted / marked text  |
 * | `a11yInlineQuote`   | `<q>`               | Inline quotation              |
 * | `a11yCitedWork`     | `<cite>`            | Citation / title of work      |
 * | `a11yDeletedText`   | `<del>`             | Deleted / removed text        |
 * | `a11yInsertedText`  | `<ins>`             | Inserted / added text         |
 *
 * These elements provide richer semantic meaning than generic `<span>` markup
 * and improve the experience for users of assistive technologies.
 *
 * ## WCAG Reference
 * - Success Criterion 1.3.1 — Info and Relationships
 */

import { PluginBase } from '../ckeditor5-types.js';

/** The set of model attribute keys managed by this plugin. */
export const CHARACTER_STYLE_ATTRIBUTES = [
  'a11yMarker',
  'a11yInlineQuote',
  'a11yCitedWork',
  'a11yDeletedText',
  'a11yInsertedText',
] as const;

export type CharacterStyleAttribute = (typeof CHARACTER_STYLE_ATTRIBUTES)[number];

export class A11yFirstCharacterStylesPlugin extends PluginBase {
  public static override get pluginName(): string {
    return 'A11yFirstCharacterStyles';
  }

  public init(): void {
    const { editor } = this;

    if (!editor._a11yFirstTopics) {
      editor._a11yFirstTopics = new Set();
    }
    editor._a11yFirstTopics.add('CharacterStyle');

    if (!editor.model?.schema || !editor.conversion) {
      // Guard: schema and conversion layers are required.
      return;
    }

    // Register all attributes in the schema.
    for (const attribute of CHARACTER_STYLE_ATTRIBUTES) {
      editor.model.schema.extend('$text', { allowAttributes: attribute });
    }

    // Upcast converters (HTML → model).
    editor.conversion.for('upcast').elementToAttribute({
      view: { name: 'span', classes: 'marker' },
      model: { key: 'a11yMarker', value: true },
    });
    editor.conversion.for('upcast').elementToAttribute({
      view: 'q',
      model: { key: 'a11yInlineQuote', value: true },
    });
    editor.conversion.for('upcast').elementToAttribute({
      view: 'cite',
      model: { key: 'a11yCitedWork', value: true },
    });
    editor.conversion.for('upcast').elementToAttribute({
      view: 'del',
      model: { key: 'a11yDeletedText', value: true },
    });
    editor.conversion.for('upcast').elementToAttribute({
      view: 'ins',
      model: { key: 'a11yInsertedText', value: true },
    });

    // Downcast converters (model → HTML).
    editor.conversion.for('downcast').attributeToElement({
      model: 'a11yMarker',
      view: (value: unknown, { writer }: { writer: { createAttributeElement: (tag: string, attrs: Record<string, string>, opts: Record<string, unknown>) => unknown } }) =>
        value
          ? writer.createAttributeElement('span', { class: 'marker' }, { priority: 6 })
          : null,
    });
    editor.conversion.for('downcast').attributeToElement({
      model: 'a11yInlineQuote',
      view: (value: unknown, { writer }: { writer: { createAttributeElement: (tag: string, attrs: Record<string, string>, opts: Record<string, unknown>) => unknown } }) =>
        value ? writer.createAttributeElement('q', {}, { priority: 6 }) : null,
    });
    editor.conversion.for('downcast').attributeToElement({
      model: 'a11yCitedWork',
      view: (value: unknown, { writer }: { writer: { createAttributeElement: (tag: string, attrs: Record<string, string>, opts: Record<string, unknown>) => unknown } }) =>
        value
          ? writer.createAttributeElement('cite', {}, { priority: 6 })
          : null,
    });
    editor.conversion.for('downcast').attributeToElement({
      model: 'a11yDeletedText',
      view: (value: unknown, { writer }: { writer: { createAttributeElement: (tag: string, attrs: Record<string, string>, opts: Record<string, unknown>) => unknown } }) =>
        value ? writer.createAttributeElement('del', {}, { priority: 6 }) : null,
    });
    editor.conversion.for('downcast').attributeToElement({
      model: 'a11yInsertedText',
      view: (value: unknown, { writer }: { writer: { createAttributeElement: (tag: string, attrs: Record<string, string>, opts: Record<string, unknown>) => unknown } }) =>
        value ? writer.createAttributeElement('ins', {}, { priority: 6 }) : null,
    });
  }
}
