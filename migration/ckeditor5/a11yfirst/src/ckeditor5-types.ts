/**
 * Minimal CKEditor5 interface declarations for ckeditor5-a11yfirst.
 *
 * These interfaces mirror the public API surface of `@ckeditor/ckeditor5-core`
 * and `@ckeditor/ckeditor5-engine` that the A11yFirst plugins depend on.
 * They are declared here so that:
 *
 *   1. The plugin package can be built and tested without a CKEditor5 runtime.
 *   2. TypeScript consumers get accurate type-checking when they integrate
 *      the plugins into a real CKEditor5 project.
 *
 * When used inside a CKEditor5 project the actual runtime classes — `Editor`,
 * `Plugin`, `Writer`, etc. — satisfy these interfaces automatically because
 * they implement the same members.
 */

// ---------------------------------------------------------------------------
// Model layer
// ---------------------------------------------------------------------------

export interface Writer {
  setAttribute(key: string, value: unknown, rangeOrElement: unknown): void;
  removeAttribute(key: string, rangeOrElement: unknown): void;
  setSelectionAttribute(key: string, value: unknown): void;
  removeSelectionAttribute(key: string): void;
  createAttributeElement(
    tag: string,
    attrs?: Record<string, string>,
    options?: { priority?: number },
  ): unknown;
}

export interface ModelSelection {
  isCollapsed: boolean;
  getRanges(): Iterable<unknown>;
}

export interface ModelDocument {
  on(event: 'change:data', callback: () => void): void;
  selection: ModelSelection;
}

export interface Schema {
  extend(element: string, definition: Record<string, unknown>): void;
}

export interface Model {
  document: ModelDocument;
  change(callback: (writer: Writer) => void): void;
  schema: Schema;
}

// ---------------------------------------------------------------------------
// View / editing layer
// ---------------------------------------------------------------------------

export interface EditingView {
  getDomRoot(): HTMLElement | null;
}

export interface EditingController {
  view: EditingView;
}

// ---------------------------------------------------------------------------
// Conversion layer
// ---------------------------------------------------------------------------

export interface ConversionDirection {
  elementToAttribute(config: Record<string, unknown>): void;
  attributeToElement(config: Record<string, unknown>): void;
}

export interface Conversion {
  for(direction: 'upcast' | 'downcast' | 'editingDowncast' | 'dataDowncast'): ConversionDirection;
}

// ---------------------------------------------------------------------------
// UI layer
// ---------------------------------------------------------------------------

export interface EditorUI {
  getEditableElement(): HTMLElement | null;
}

// ---------------------------------------------------------------------------
// Commands
// ---------------------------------------------------------------------------

export interface CommandsMap {
  get(name: string): unknown;
}

// ---------------------------------------------------------------------------
// Editor interface
// ---------------------------------------------------------------------------

/**
 * The subset of the CKEditor5 `Editor` class that A11yFirst plugins depend on.
 *
 * A real `ClassicEditor` / `InlineEditor` / etc. instance satisfies this
 * interface out of the box.
 */
export interface A11yEditor {
  model: Model;
  editing?: EditingController;
  conversion?: Conversion;
  ui?: EditorUI;
  commands?: CommandsMap;

  getData(): string;
  on(event: string, callback: () => void): void;

  /** Set by A11yFirst plugins to track registered help topics. */
  _a11yFirstTopics?: Set<string>;

  /** Set by A11yFirstCheckerPlugin so external callers can trigger a run. */
  a11yCheck?: () => Promise<unknown>;
}

// ---------------------------------------------------------------------------
// Plugin base class
// ---------------------------------------------------------------------------

/**
 * Minimal Plugin base class.
 *
 * In a real CKEditor5 project this class is replaced by the `Plugin` class
 * from `@ckeditor/ckeditor5-core`, which satisfies the same interface.
 *
 * To use the compiled plugins in CKEditor5, configure your bundler to alias
 * `ckeditor5-a11yfirst/plugin-base` → `@ckeditor/ckeditor5-core/Plugin`, or
 * simply extend `Plugin` directly in your own build and pass an A11yFirst
 * plugin instance to `config.plugins`.
 *
 * For testing the plugin logic without a live CKEditor5 runtime, use
 * `MockEditor` from `tests/helpers/mockEditor.ts`.
 */
export abstract class PluginBase {
  protected readonly editor: A11yEditor;

  public constructor(editor: A11yEditor) {
    this.editor = editor;
  }

  /** Called by CKEditor5 after the editor is initialised. */
  public abstract init(): void;

  /** CKEditor5 plugin name — must be unique across all loaded plugins. */
  public static get pluginName(): string {
    return '';
  }

  /**
   * Other A11yFirst plugins that must be loaded before this one.
   * CKEditor5 reads this array and resolves the dependency order automatically.
   */
  public static get requires(): Array<typeof PluginBase> {
    return [];
  }
}
