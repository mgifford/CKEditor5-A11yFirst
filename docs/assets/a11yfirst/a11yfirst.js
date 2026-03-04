(function (global) {
  const customStyleAttributes = [
    'a11yMarker',
    'a11yInlineQuote',
    'a11yCitedWork',
    'a11yDeletedText',
    'a11yInsertedText'
  ];

  function registerCharacterStyleConverters(editor) {
    const schema = editor.model.schema;
    const conversion = editor.conversion;

    customStyleAttributes.forEach((attribute) => {
      schema.extend('$text', { allowAttributes: attribute });
    });

    conversion.for('upcast').elementToAttribute({
      view: { name: 'span', classes: 'marker' },
      model: { key: 'a11yMarker', value: true }
    });
    conversion.for('upcast').elementToAttribute({ view: 'q', model: { key: 'a11yInlineQuote', value: true } });
    conversion.for('upcast').elementToAttribute({ view: 'cite', model: { key: 'a11yCitedWork', value: true } });
    conversion.for('upcast').elementToAttribute({ view: 'del', model: { key: 'a11yDeletedText', value: true } });
    conversion.for('upcast').elementToAttribute({ view: 'ins', model: { key: 'a11yInsertedText', value: true } });

    conversion.for('downcast').attributeToElement({
      model: 'a11yMarker',
      view: (value, { writer }) => value ? writer.createAttributeElement('span', { class: 'marker' }, { priority: 6 }) : null
    });
    conversion.for('downcast').attributeToElement({
      model: 'a11yInlineQuote',
      view: (value, { writer }) => value ? writer.createAttributeElement('q', {}, { priority: 6 }) : null
    });
    conversion.for('downcast').attributeToElement({
      model: 'a11yCitedWork',
      view: (value, { writer }) => value ? writer.createAttributeElement('cite', {}, { priority: 6 }) : null
    });
    conversion.for('downcast').attributeToElement({
      model: 'a11yDeletedText',
      view: (value, { writer }) => value ? writer.createAttributeElement('del', {}, { priority: 6 }) : null
    });
    conversion.for('downcast').attributeToElement({
      model: 'a11yInsertedText',
      view: (value, { writer }) => value ? writer.createAttributeElement('ins', {}, { priority: 6 }) : null
    });
  }

  function clearCustomCharacterStyles(writer, selection) {
    for (const range of selection.getRanges()) {
      customStyleAttributes.forEach((attribute) => {
        writer.removeAttribute(attribute, range);
      });
    }

    customStyleAttributes.forEach((attribute) => {
      writer.removeSelectionAttribute(attribute);
    });
  }

  function applyCustomCharacterStyle(editor, attribute) {
    editor.model.change((writer) => {
      const selection = editor.model.document.selection;
      clearCustomCharacterStyles(writer, selection);

      if (selection.isCollapsed) {
        writer.setSelectionAttribute(attribute, true);
        return;
      }

      for (const range of selection.getRanges()) {
        writer.setAttribute(attribute, true, range);
      }
    });
  }

  function removeCustomCharacterStyles(editor) {
    editor.model.change((writer) => {
      clearCustomCharacterStyles(writer, editor.model.document.selection);
    });
  }

  function A11yFirstCharacterStylesPlugin(editor) {
    registerCharacterStyleConverters(editor);
  }

  const namespace = global.A11yFirst || {};
  namespace.CharacterStyles = {
    plugin: A11yFirstCharacterStylesPlugin,
    applyCustomCharacterStyle,
    removeCustomCharacterStyles,
    customStyleAttributes
  };
  global.A11yFirst = namespace;
})(window);
