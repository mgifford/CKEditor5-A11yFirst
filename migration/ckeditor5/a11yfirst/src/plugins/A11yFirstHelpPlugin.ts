/**
 * A11yFirstHelpPlugin — adds an accessible help-topics dropdown to the toolbar.
 *
 * When `init()` is called the plugin:
 *   1. Creates a lazily-instantiated singleton dropdown `<ul>` panel.
 *   2. Creates a toolbar `<button>` element (`role="button"`,
 *      `aria-haspopup="true"`) that toggles the dropdown.
 *
 * The dropdown is automatically populated with the help topics registered by
 * the other A11yFirst plugins via `editor._a11yFirstTopics`. Two topics
 * ("Getting Started" and "About A11yFirst") are always included.
 *
 * ### Keyboard behaviour
 * - `Escape` closes the panel and returns focus to the button.
 * - `ArrowDown` / `ArrowUp` navigate the menu items.
 * - Clicking outside the panel closes it.
 *
 * ### Adding to the toolbar
 * ```js
 * ClassicEditor.create(element, {
 *   plugins: [A11yFirstHelpPlugin, ...],
 *   toolbar: ['a11yFirstHelp', ...],
 * });
 * ```
 *
 * The button DOM element returned by `createHelpButton()` may also be inserted
 * manually into any container outside the editor toolbar.
 */

import { PluginBase } from '../ckeditor5-types.js';

// ---------------------------------------------------------------------------
// Help-topic registry
// ---------------------------------------------------------------------------

export const HELP_TOPIC_LABELS: Readonly<Record<string, string>> = {
  HeadingParagraph: 'Heading / Paragraph',
  List: 'List',
  Image: 'Image',
  CharacterStyle: 'Character Style',
  ParagraphFormat: 'Paragraph Format',
  Table: 'Table',
  Link: 'Link',
  A11yCheckerSummary: 'A11y Checker',
  GettingStarted: 'Getting Started',
  AboutA11yFirst: 'About A11yFirst',
};

export const HELP_TOPIC_ORDER: ReadonlyArray<string> = [
  'HeadingParagraph',
  'List',
  'Image',
  'CharacterStyle',
  'ParagraphFormat',
  'Table',
  'Link',
  'A11yCheckerSummary',
  'GettingStarted',
  'AboutA11yFirst',
];

// ---------------------------------------------------------------------------
// Plugin
// ---------------------------------------------------------------------------

export class A11yFirstHelpPlugin extends PluginBase {
  public static override get pluginName(): string {
    return 'A11yFirstHelp';
  }

  private _panel: HTMLUListElement | null = null;

  public init(): void {
    const { editor } = this;

    // Include ParagraphFormat topic when the blockQuote command is present.
    if (
      editor.commands &&
      typeof editor.commands.get === 'function' &&
      editor.commands.get('blockQuote')
    ) {
      editor._a11yFirstTopics?.add('ParagraphFormat');
    }
  }

  /** Return the active help topics for this editor. */
  public getHelpTopics(): string[] {
    const { editor } = this;
    const active = new Set(editor._a11yFirstTopics ?? []);

    if (
      editor.commands?.get('blockQuote')
    ) {
      active.add('ParagraphFormat');
    }

    return HELP_TOPIC_ORDER.filter(
      (k) =>
        k === 'GettingStarted' || k === 'AboutA11yFirst' || active.has(k),
    );
  }

  /**
   * Create (or return an existing) singleton help-panel `<ul>` element.
   *
   * The panel is appended to `document.body` the first time this method is
   * called and reused on subsequent calls.
   */
  public ensurePanel(): HTMLUListElement {
    if (this._panel) return this._panel;

    injectPanelStyles();

    const panel = document.createElement('ul');
    panel.className = 'a11yfirst-help-panel';
    panel.setAttribute('role', 'menu');
    panel.setAttribute('aria-label', 'A11yFirst Help Topics');
    document.body.appendChild(panel);

    // Close on outside click.
    document.addEventListener(
      'click',
      (e: MouseEvent) => {
        if (!this._panel || this._panel.style.display === 'none') return;
        const anchor = (this._panel as HTMLElement & { _anchorEl?: HTMLElement })._anchorEl;
        if (
          !this._panel.contains(e.target as Node) &&
          (!anchor || !anchor.contains(e.target as Node))
        ) {
          this._panel.style.display = 'none';
          (this._panel as HTMLElement & { _anchorEl?: HTMLElement })._anchorEl = undefined;
        }
      },
      true,
    );

    // Keyboard navigation.
    document.addEventListener('keydown', (e: KeyboardEvent) => {
      if (!this._panel || this._panel.style.display === 'none') return;
      if (e.key === 'Escape') {
        e.stopPropagation();
        this._panel.style.display = 'none';
        const anchor = (this._panel as HTMLElement & { _anchorEl?: HTMLElement })._anchorEl;
        (this._panel as HTMLElement & { _anchorEl?: HTMLElement })._anchorEl = undefined;
        anchor?.focus();
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        const items = Array.from(
          this._panel.querySelectorAll<HTMLButtonElement>('button'),
        );
        if (!items.length) return;
        const idx = items.indexOf(document.activeElement as HTMLButtonElement);
        const next =
          e.key === 'ArrowDown'
            ? (idx + 1) % items.length
            : (idx - 1 + items.length) % items.length;
        items[next]?.focus();
      }
    });

    this._panel = panel;
    return panel;
  }

  /**
   * Toggle the help dropdown anchored beneath `anchorEl`.
   * If the panel is already open for the same anchor it is closed instead.
   *
   * @param anchorEl  The toolbar button element used as the positioning anchor.
   * @param onSelect  Optional callback invoked with the topic key when a menu
   *                  item is activated.
   */
  public togglePanel(
    anchorEl: HTMLElement,
    onSelect?: (topicKey: string) => void,
  ): void {
    const panel = this.ensurePanel();
    const typedPanel = panel as HTMLElement & { _anchorEl?: HTMLElement };

    if (panel.style.display !== 'none' && typedPanel._anchorEl === anchorEl) {
      panel.style.display = 'none';
      typedPanel._anchorEl = undefined;
      return;
    }

    // Rebuild menu items for the current editor state.
    panel.innerHTML = '';
    const topics = this.getHelpTopics();

    for (const key of topics) {
      const li = document.createElement('li');
      li.setAttribute('role', 'none');
      const btn = document.createElement('button');
      btn.setAttribute('role', 'menuitem');
      btn.setAttribute('type', 'button');
      btn.textContent = HELP_TOPIC_LABELS[key] ?? key;
      btn.addEventListener('click', () => {
        panel.style.display = 'none';
        typedPanel._anchorEl = undefined;
        onSelect?.(key);
      });
      li.appendChild(btn);
      panel.appendChild(li);
    }

    // Position below the anchor button.
    const rect = anchorEl.getBoundingClientRect();
    panel.style.top = `${rect.bottom + window.scrollY}px`;
    panel.style.left = `${rect.left + window.scrollX}px`;
    panel.style.display = 'block';
    typedPanel._anchorEl = anchorEl;

    // Focus the first item.
    (panel.querySelector('button') as HTMLButtonElement | null)?.focus();
  }

  /**
   * Create a standalone help toolbar button element.
   *
   * The returned `<button>` can be inserted into the editor toolbar or any
   * other container. Clicking the button calls `togglePanel()`.
   *
   * @param onSelect Optional callback invoked when the user selects a topic.
   */
  public createHelpButton(
    onSelect?: (topicKey: string) => void,
  ): HTMLButtonElement {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'a11yfirst-help-btn';
    btn.setAttribute('aria-haspopup', 'true');
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('title', 'A11yFirst Help');
    btn.textContent = 'A11y Help ▾';

    btn.addEventListener('click', () => {
      const isOpen = this._panel?.style.display !== 'none';
      btn.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
      this.togglePanel(btn, onSelect);
    });

    return btn;
  }
}

// ---------------------------------------------------------------------------
// Style injection helper
// ---------------------------------------------------------------------------

function injectPanelStyles(): void {
  if (document.getElementById('a11yfirst-help-panel-css')) return;

  const style = document.createElement('style');
  style.id = 'a11yfirst-help-panel-css';
  style.textContent = [
    '.a11yfirst-help-panel{',
    'position:fixed;z-index:99999;background:#fff;',
    'border:1px solid #c4c4c4;border-radius:4px;',
    'box-shadow:0 4px 12px rgba(0,0,0,.18);',
    'min-width:190px;display:none;padding:4px 0;',
    'list-style:none;margin:0;',
    '}',
    '.a11yfirst-help-panel li{margin:0;padding:0;}',
    '.a11yfirst-help-panel button{',
    'display:block;width:100%;text-align:left;',
    'padding:7px 16px;background:transparent;',
    'border:0;cursor:pointer;font-size:13px;',
    'color:#1f2328;line-height:1.4;white-space:nowrap;',
    '}',
    '.a11yfirst-help-panel button:hover,',
    '.a11yfirst-help-panel button:focus{',
    'background:#e8f0fe;',
    'outline:2px solid #3b82f6;outline-offset:-2px;',
    '}',
  ].join('');
  document.head.appendChild(style);
}
