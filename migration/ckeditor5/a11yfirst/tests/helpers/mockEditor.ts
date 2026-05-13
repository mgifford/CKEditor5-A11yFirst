/**
 * MockEditor — a lightweight stand-in for a CKEditor5 `Editor` instance used
 * in unit tests.  It satisfies the `A11yEditor` interface without requiring a
 * live CKEditor5 runtime or a DOM environment.
 */

import type { A11yEditor, Model, ModelDocument, ModelSelection, Schema, Writer, EditingController, EditingView, Conversion, ConversionDirection, EditorUI, CommandsMap } from '../../src/ckeditor5-types.js';
import { ValidationRegistry } from '../../src/core/validationRegistry.js';

// ---------------------------------------------------------------------------
// Minimal mock implementations
// ---------------------------------------------------------------------------

class MockModelDocument implements ModelDocument {
  private handlers: Array<() => void> = [];

  public readonly selection: ModelSelection = {
    isCollapsed: true,
    getRanges(): Iterable<unknown> { return []; },
  };

  public on(_event: 'change:data', callback: () => void): void {
    this.handlers.push(callback);
  }

  /** Trigger all registered change:data listeners (used in tests). */
  public triggerChange(): void {
    for (const handler of this.handlers) {
      handler();
    }
  }
}

class MockSchema implements Schema {
  public extend(_element: string, _definition: Record<string, unknown>): void {
    // no-op in tests
  }
}

class MockConversionDirection implements ConversionDirection {
  public elementToAttribute(_config: Record<string, unknown>): void { /* no-op */ }
  public attributeToElement(_config: Record<string, unknown>): void { /* no-op */ }
}

class MockConversion implements Conversion {
  public for(_direction: string): ConversionDirection {
    return new MockConversionDirection();
  }
}

class MockWriter implements Partial<Writer> {
  public setAttribute(_key: string, _value: unknown, _range: unknown): void { /* no-op */ }
  public removeAttribute(_key: string, _range: unknown): void { /* no-op */ }
  public setSelectionAttribute(_key: string, _value: unknown): void { /* no-op */ }
  public removeSelectionAttribute(_key: string): void { /* no-op */ }
  public createAttributeElement(_tag: string, _attrs?: Record<string, string>, _options?: Record<string, unknown>): unknown { return {}; }
}

class MockModel implements Model {
  public document = new MockModelDocument();
  public schema = new MockSchema();

  public change(callback: (writer: Writer) => void): void {
    callback(new MockWriter() as unknown as Writer);
  }
}

class MockEditingView implements EditingView {
  private _domRoot: HTMLElement | null = null;

  public setDomRoot(el: HTMLElement | null): void {
    this._domRoot = el;
  }

  public getDomRoot(): HTMLElement | null {
    return this._domRoot;
  }
}

class MockEditingController implements EditingController {
  public view = new MockEditingView();
}

class MockEditorUI implements EditorUI {
  public getEditableElement(): HTMLElement | null {
    return null;
  }
}

class MockCommandsMap implements CommandsMap {
  private commands: Map<string, unknown>;

  public constructor(commands: Record<string, unknown> = {}) {
    this.commands = new Map(Object.entries(commands));
  }

  public get(name: string): unknown {
    return this.commands.get(name);
  }
}

// ---------------------------------------------------------------------------
// MockEditor
// ---------------------------------------------------------------------------

export class MockEditor implements A11yEditor {
  public model: MockModel;
  public editing: MockEditingController;
  public conversion: Conversion;
  public ui: EditorUI;
  public commands: CommandsMap;

  public _a11yFirstTopics?: Set<string>;
  public a11yCheck?: () => Promise<unknown>;

  private _html: string;
  private _readyListeners: Array<() => void> = [];

  public constructor(
    html = '',
    options: { commands?: Record<string, unknown> } = {},
  ) {
    this._html = html;
    this.model = new MockModel();
    this.editing = new MockEditingController();
    this.conversion = new MockConversion();
    this.ui = new MockEditorUI();
    this.commands = new MockCommandsMap(options.commands ?? {});
    this._a11yFirstTopics = new Set();
  }

  public getData(): string {
    return this._html;
  }

  public setData(html: string): void {
    this._html = html;
  }

  public on(event: string, callback: () => void): void {
    if (event === 'ready') {
      this._readyListeners.push(callback);
    }
  }

  /** Fire the 'ready' event (call after all plugins are init'd). */
  public fireReady(): void {
    for (const listener of this._readyListeners) {
      listener();
    }
  }

  /** Trigger a change:data cycle with optional new HTML content. */
  public triggerChange(newHtml?: string): void {
    if (newHtml !== undefined) {
      this._html = newHtml;
    }
    (this.model.document as MockModelDocument).triggerChange();
  }

  /** Convenience: return the attached ValidationRegistry. */
  public getRegistry(): ValidationRegistry {
    return (this as unknown as Record<string, unknown>)['_a11yFirstRegistry'] as ValidationRegistry;
  }
}
