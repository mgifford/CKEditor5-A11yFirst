(function (global) {
  // ============================================================================
  // Help Topics Registry
  // ============================================================================

  const HELP_TOPIC_LABELS = {
    HeadingParagraph:  'Heading / Paragraph',
    List:              'List',
    Image:             'Image',
    CharacterStyle:    'Character Style',
    ParagraphFormat:   'Paragraph Format',
    Table:             'Table',
    Link:              'Link',
    A11yCheckerSummary:'A11y Checker',
    GettingStarted:    'Getting Started',
    AboutA11yFirst:    'About A11yFirst'
  };

  const HELP_TOPIC_ORDER = [
    'HeadingParagraph',
    'List',
    'Image',
    'CharacterStyle',
    'ParagraphFormat',
    'Table',
    'Link',
    'A11yCheckerSummary',
    'GettingStarted',
    'AboutA11yFirst'
  ];

  const customStyleAttributes = [
    'a11yMarker',
    'a11yInlineQuote',
    'a11yCitedWork',
    'a11yDeletedText',
    'a11yInsertedText'
  ];

  // ============================================================================
  // Validation Registry - Central system for collecting and reporting findings
  // ============================================================================
  
  class ValidationRegistry {
    constructor() {
      this.findings = {
        headings: [],
        images: [],
        links: [],
        lists: [],
        tables: [],
        checker: []
      };
      this.listeners = [];
    }

    addFinding(category, finding) {
      if (this.findings[category]) {
        this.findings[category].push(finding);
        this.notifyListeners();
      }
    }

    setFindings(category, findings) {
      if (this.findings[category]) {
        this.findings[category] = findings;
        this.notifyListeners();
      }
    }

    getFindings(category) {
      return category ? this.findings[category] : this.findings;
    }

    clear(category) {
      if (category && this.findings[category]) {
        this.findings[category] = [];
      } else {
        Object.keys(this.findings).forEach(key => {
          this.findings[key] = [];
        });
      }
      this.notifyListeners();
    }

    addListener(callback) {
      this.listeners.push(callback);
    }

    notifyListeners() {
      this.listeners.forEach(cb => cb(this.findings));
    }
  }

  // Global registry instance
  const validationRegistry = new ValidationRegistry();

  // ============================================================================
  // Character Styles Plugin
  // ============================================================================

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
    if (!editor._a11yFirstTopics) editor._a11yFirstTopics = new Set();
    editor._a11yFirstTopics.add('CharacterStyle');
    registerCharacterStyleConverters(editor);
  }

  // ============================================================================
  // Heading Validation Plugin
  // ============================================================================

  function A11yFirstHeadingPlugin(editor) {
    if (!editor._a11yFirstTopics) editor._a11yFirstTopics = new Set();
    editor._a11yFirstTopics.add('HeadingParagraph');
    // Auto-validate heading hierarchy and sequence on data change
    editor.model.document.on('change:data', () => {
      const html = editor.getData();
      const headingMatches = Array.from(html.matchAll(/<h([1-6])\b/gi)).map((m) => Number(m[1]));
      
      const findings = [];
      let previous = null;
      
      for (const current of headingMatches) {
        if (previous !== null && current > previous + 1) {
          findings.push({
            level: 'error',
            message: `Heading sequence warning: found H${current} after H${previous}.`
          });
        }
        previous = current;
      }
      
      validationRegistry.setFindings('headings', findings);
    });
  }

  // ============================================================================
  // Image Validation Plugin
  // ============================================================================

  function A11yFirstImagePlugin(editor) {
    if (!editor._a11yFirstTopics) editor._a11yFirstTopics = new Set();
    editor._a11yFirstTopics.add('Image');
    editor.model.document.on('change:data', () => {
      const html = editor.getData();
      const imageMatches = Array.from(html.matchAll(/<img[^>]*>/gi));
      
      const findings = [];
      
      imageMatches.forEach((img, index) => {
        const hasAlt = /alt\s*=\s*["'][^"']*["']/i.test(img[0]);
        const hasTitle = /title\s*=\s*["'][^"']*["']/i.test(img[0]);
        
        if (!hasAlt && !hasTitle) {
          findings.push({
            level: 'error',
            message: `Image ${index + 1} has no alt text. Provide descriptive text for all images.`
          });
        }
      });
      
      validationRegistry.setFindings('images', findings);
    });
  }

  // ============================================================================
  // Link Validation Plugin
  // ============================================================================

  function A11yFirstLinkPlugin(editor) {
    if (!editor._a11yFirstTopics) editor._a11yFirstTopics = new Set();
    editor._a11yFirstTopics.add('Link');
    editor.model.document.on('change:data', () => {
      const html = editor.getData();
      const linkMatches = Array.from(html.matchAll(/<a\s+href[^>]*>(.*?)<\/a>/gi));
      
      const findings = [];
      
      linkMatches.forEach((link, index) => {
        const linkText = link[1].trim().toLowerCase();
        
        // Check for generic link text
        const genericPatterns = ['click here', 'click', 'link', 'read more', 'more', 'here', ''];
        
        if (genericPatterns.includes(linkText)) {
          findings.push({
            level: 'error',
            message: `Link ${index + 1} uses generic text "${linkText || '(empty)'}". Use descriptive link text that explains the destination.`
          });
        }
      });
      
      validationRegistry.setFindings('links', findings);
    });
  }

  // ============================================================================
  // List Validation Plugin
  // ============================================================================

  function A11yFirstListPlugin(editor) {
    if (!editor._a11yFirstTopics) editor._a11yFirstTopics = new Set();
    editor._a11yFirstTopics.add('List');
    editor.model.document.on('change:data', () => {
      const html = editor.getData();
      const findings = [];
      
      // Check for fake lists (using text instead of <ul> or <ol>)
      const lines = html.split('\n');
      let bulletLikeCount = 0;
      let prevWasBulletLike = false;
      
      lines.forEach((line, index) => {
        const trimmed = line.trim();
        if (/^[•·-]\s+/.test(trimmed) || /^\d+\.\s+/.test(trimmed)) {
          if (!line.includes('<li>')) {
            bulletLikeCount++;
            if (prevWasBulletLike) {
              findings.push({
                level: 'warning',
                message: `Lines ${index - 1}-${index} appear to be a fake list. Use proper <ul> or <ol> markup for lists.`
              });
              bulletLikeCount = 0; // Reset to avoid duplicate warnings
            }
            prevWasBulletLike = true;
          } else {
            prevWasBulletLike = false;
          }
        } else {
          prevWasBulletLike = false;
        }
      });
      
      // Check list nesting
      const listMatches = html.match(/<(ul|ol)>[^<]*(<li>.*?<\/li>)[^<]*<\/(ul|ol)>/gs);
      if (listMatches) {
        listMatches.forEach((list) => {
          const nestedListCount = (list.match(/<(ul|ol)>/g) || []).length;
          if (nestedListCount > 3) {
            findings.push({
              level: 'advisory',
              message: 'Deeply nested lists (4+ levels) may confuse screen reader users. Consider flattening structure.'
            });
          }
        });
      }
      
      validationRegistry.setFindings('lists', findings);
    });
  }

  // ============================================================================
  // Table Validation Plugin
  // ============================================================================

  function A11yFirstTablePlugin(editor) {
    if (!editor._a11yFirstTopics) editor._a11yFirstTopics = new Set();
    editor._a11yFirstTopics.add('Table');
    editor.model.document.on('change:data', () => {
      const html = editor.getData();
      const tableMatches = Array.from(html.matchAll(/<table[^>]*>.*?<\/table>/gs));
      
      const findings = [];
      
      tableMatches.forEach((table, tableIndex) => {
        const tableHtml = table[0];
        
        // Check for caption
        const hasCaption = /<caption/i.test(tableHtml);
        if (!hasCaption) {
          findings.push({
            level: 'advisory',
            message: `Table ${tableIndex + 1} has no caption. Consider adding a <caption> to describe the table's purpose.`
          });
        }
        
        // Check for header row (th elements)
        const hasHeaderCells = /<th/i.test(tableHtml);
        if (!hasHeaderCells) {
          findings.push({
            level: 'error',
            message: `Table ${tableIndex + 1} has no header cells. Use <th> for the first row to identify column purposes.`
          });
        }
        
        // Check for scope attribute
        const scopeMatches = tableHtml.match(/<th[^>]*scope/gi) || [];
        const thMatches = tableHtml.match(/<th/gi) || [];
        if (thMatches.length > 0 && scopeMatches.length === 0) {
          findings.push({
            level: 'advisory',
            message: `Table ${tableIndex + 1} headers lack scope attributes. Add scope="col" or scope="row" to <th> elements for clarity.`
          });
        }
      });
      
      validationRegistry.setFindings('tables', findings);
    });
  }

  // ============================================================================
  // A11y Checker Summary Plugin (replaces Quail.js with axe-core + custom rules)
  //
  // The CKEditor 4 a11ychecker plugin used Quail.js (plugins/a11ychecker/libs/quail/)
  // as its scanning engine — a jQuery-based library archived in 2016 that only
  // covered WCAG 2.0.  This CKEditor 5 implementation uses axe-core (WCAG 2.0,
  // 2.1 and 2.2, no jQuery) combined with A11yFirst-specific custom rules.
  // ============================================================================

  // Severity mapping from axe-core impact to A11yFirst tiers.
  // Mirrors the checkerMappings module in migration/ckeditor5/a11yfirst/src/modules/checker/
  function mapAxeImpact(impact) {
    if (impact === 'critical') return 'severe';
    if (impact === 'serious') return 'moderate';
    return 'suggestion';
  }

  function isBlockingImpact(impact) {
    return impact === 'critical' || impact === 'serious';
  }

  // Custom A11yFirst rules — run synchronously on HTML strings so they do not
  // depend on a live DOM or an external library.  These replace the subset of
  // Quail.js rules that were relevant to rich-text authoring.
  function runCustomCheckerRules(html) {
    const findings = [];

    // Heading sequence
    const levels = Array.from(html.matchAll(/<h([1-6])\b/gi)).map((m) => Number(m[1]));
    let prev = null;
    for (const level of levels) {
      if (prev !== null && level > prev + 1) {
        findings.push({
          severity: 'severe',
          blocking: true,
          source: 'custom',
          message: `Heading sequence skips from H${prev} to H${level}.`
        });
      }
      prev = level;
    }

    // Link text quality
    const GENERIC_LINK_TEXT = new Set(['', 'click here', 'click', 'link', 'read more', 'more', 'here']);
    for (const m of html.matchAll(/<a\b[^>]*>([\s\S]*?)<\/a>/gi)) {
      const text = (m[1] || '').replace(/<[^>]+>/g, '').trim().toLowerCase();
      if (GENERIC_LINK_TEXT.has(text)) {
        findings.push({
          severity: 'severe',
          blocking: true,
          source: 'custom',
          message: `Link text "${text || '(empty)'}" is not descriptive. Use text that describes the link destination.`
        });
      }
    }

    // Image alt text
    for (const m of html.matchAll(/<img\b([^>]*)>/gi)) {
      const attrs = m[1] || '';
      const altMatch = attrs.match(/\balt\s*=\s*(?:"([^"]*)"|'([^']*)')/i);
      if (!altMatch) {
        findings.push({
          severity: 'severe',
          blocking: true,
          source: 'custom',
          message: 'Image is missing the alt attribute. Provide descriptive text or use alt="" for decorative images.'
        });
      } else {
        const alt = (altMatch[1] !== undefined ? altMatch[1] : altMatch[2] || '').trim();
        if (alt === '') {
          findings.push({
            severity: 'suggestion',
            blocking: false,
            source: 'custom',
            message: 'Image has empty alt text. Confirm the image is decorative.'
          });
        }
      }
    }

    // Table structure
    for (const m of html.matchAll(/<table[\s>][\s\S]*?<\/table>/gi)) {
      const t = m[0];
      if (!/<caption[\s>]/i.test(t)) {
        findings.push({
          severity: 'suggestion',
          blocking: false,
          source: 'custom',
          message: 'Table is missing a <caption>. Add a caption that describes the table\'s purpose.'
        });
      }
      if (!/<th[\s>]/i.test(t)) {
        findings.push({
          severity: 'severe',
          blocking: true,
          source: 'custom',
          message: 'Table has no header cells (<th>). Use <th> elements for row and column headers.'
        });
      }
    }

    return findings;
  }

  // Convert axe-core violations into A11yFirst findings.
  function adaptAxeViolations(violations) {
    return violations.map((v) => ({
      severity: mapAxeImpact(v.impact),
      blocking: isBlockingImpact(v.impact),
      source: 'axe-core',
      message: `axe: ${v.id} — ${v.help}`
    }));
  }

  /**
   * Run an accessibility check on the given editor using:
   *   1. axe-core (if available via window.axe) — WCAG 2.0/2.1/2.2 automated scan
   *   2. A11yFirst custom rules — heading sequence, link text, image alt, table structure
   *
   * Returns a Promise resolving to a CheckerResult object.
   *
   * NOTE: This is the replacement for the old Quail.js-based check.  Quail.js
   * required jQuery 1.x and only covered WCAG 2.0.  axe-core has no jQuery
   * dependency and covers WCAG 2.0, 2.1 and 2.2.
   *
   * @param {object} editor  CKEditor5 editor instance
   * @returns {Promise<{findings: Array, blocking: Array, advisory: Array, timestamp: string}>}
   */
  async function runA11yCheck(editor) {
    const html = editor.getData ? editor.getData() : '';
    const customFindings = runCustomCheckerRules(html);

    let axeFindings = [];
    if (typeof window !== 'undefined' && window.axe) {
      try {
        const editableEl = editor.ui && editor.ui.getEditableElement
          ? editor.ui.getEditableElement()
          : null;
        const scanTarget = editableEl || document.body;
        const result = await window.axe.run(scanTarget, {
          runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa'] }
        });
        axeFindings = adaptAxeViolations(result.violations);
      } catch (err) {
        axeFindings = [{
          severity: 'suggestion',
          blocking: false,
          source: 'axe-core',
          message: `axe-core scan failed: ${err && err.message ? err.message : String(err)}`
        }];
      }
    }

    const allFindings = [...axeFindings, ...customFindings].sort((a, b) => {
      if (a.blocking !== b.blocking) return a.blocking ? -1 : 1;
      const order = { severe: 0, moderate: 1, suggestion: 2 };
      return (order[a.severity] || 2) - (order[b.severity] || 2);
    });

    const checkerResult = {
      findings: allFindings,
      blocking: allFindings.filter((f) => f.blocking),
      advisory: allFindings.filter((f) => !f.blocking),
      timestamp: new Date().toISOString()
    };

    validationRegistry.setFindings('checker', checkerResult);
    return checkerResult;
  }

  function A11yFirstA11yCheckerPlugin(editor) {
    if (!editor._a11yFirstTopics) editor._a11yFirstTopics = new Set();
    editor._a11yFirstTopics.add('A11yCheckerSummary');
    // Keep the internal validators aggregated in real time (lightweight, sync)
    editor.model.document.on('change:data', () => {
      const findings = validationRegistry.getFindings();

      const summary = {
        blocking: [],
        advisory: []
      };

      Object.entries(findings).forEach(([category, categoryFindings]) => {
        if (category === 'checker' || !Array.isArray(categoryFindings)) return;
        categoryFindings.forEach(finding => {
          if (finding.level === 'error') {
            summary.blocking.push(finding.message);
          } else {
            summary.advisory.push(finding.message);
          }
        });
      });

      validationRegistry.setFindings('checker', summary);
    });

    // Expose a runCheck method on the editor for external callers.
    editor.a11yCheck = () => runA11yCheck(editor);
  }

  // ============================================================================
  // Help Dropdown Panel
  // ============================================================================

  let _a11yHelpPanel = null;

  /** Return the filtered list of help topic keys for a given editor instance. */
  function getHelpTopicsForEditor(editor) {
    const active = new Set(editor._a11yFirstTopics || []);
    // Include ParagraphFormat topic when blockQuote command is available in the editor.
    if (editor.commands && typeof editor.commands.get === 'function' && editor.commands.get('blockQuote')) {
      active.add('ParagraphFormat');
    }
    return HELP_TOPIC_ORDER.filter(
      (k) => k === 'GettingStarted' || k === 'AboutA11yFirst' || active.has(k)
    );
  }

  /** Lazily create and return the singleton dropdown panel element. */
  function ensureA11yHelpPanel() {
    if (_a11yHelpPanel) return _a11yHelpPanel;

    if (!document.getElementById('a11yfirst-help-panel-css')) {
      const style = document.createElement('style');
      style.id = 'a11yfirst-help-panel-css';
      style.textContent =
        '.a11yfirst-help-panel{' +
          'position:fixed;z-index:99999;background:#fff;' +
          'border:1px solid #c4c4c4;border-radius:4px;' +
          'box-shadow:0 4px 12px rgba(0,0,0,.18);' +
          'min-width:190px;display:none;padding:4px 0;' +
          'list-style:none;margin:0;' +
        '}' +
        '.a11yfirst-help-panel li{margin:0;padding:0;}' +
        '.a11yfirst-help-panel button{' +
          'display:block;width:100%;text-align:left;' +
          'padding:7px 16px;background:transparent;' +
          'border:0;cursor:pointer;font-size:13px;' +
          'color:#1f2328;line-height:1.4;white-space:nowrap;' +
        '}' +
        '.a11yfirst-help-panel button:hover,' +
        '.a11yfirst-help-panel button:focus{' +
          'background:#e8f0fe;' +
          'outline:2px solid #3b82f6;outline-offset:-2px;' +
        '}';
      document.head.appendChild(style);
    }

    const panel = document.createElement('ul');
    panel.className = 'a11yfirst-help-panel';
    panel.setAttribute('role', 'menu');
    panel.setAttribute('aria-label', 'A11yFirst Help Topics');
    document.body.appendChild(panel);

    // Close on click outside the panel or its anchor button.
    document.addEventListener('click', (e) => {
      if (!_a11yHelpPanel || _a11yHelpPanel.style.display === 'none') return;
      const anchor = _a11yHelpPanel._anchorEl;
      if (!_a11yHelpPanel.contains(e.target) && (!anchor || !anchor.contains(e.target))) {
        _a11yHelpPanel.style.display = 'none';
        _a11yHelpPanel._anchorEl = null;
      }
    }, true);

    // Keyboard: Escape closes; arrow keys navigate items.
    document.addEventListener('keydown', (e) => {
      if (!_a11yHelpPanel || _a11yHelpPanel.style.display === 'none') return;
      if (e.key === 'Escape') {
        e.stopPropagation();
        _a11yHelpPanel.style.display = 'none';
        const anchor = _a11yHelpPanel._anchorEl;
        _a11yHelpPanel._anchorEl = null;
        if (anchor) anchor.focus();
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        const items = [..._a11yHelpPanel.querySelectorAll('button')];
        if (!items.length) return;
        const idx = items.indexOf(document.activeElement);
        const next = e.key === 'ArrowDown'
          ? (idx + 1) % items.length
          : (idx - 1 + items.length) % items.length;
        items[next].focus();
      }
    });

    _a11yHelpPanel = panel;
    return panel;
  }

  /**
   * Toggle the help topics dropdown anchored below `anchorEl`.
   * If the panel is already open for this anchor it is closed instead.
   */
  function toggleA11yHelpPanel(anchorEl, editor) {
    const panel = ensureA11yHelpPanel();

    // Toggle off when already open for this button.
    if (panel.style.display !== 'none' && panel._anchorEl === anchorEl) {
      panel.style.display = 'none';
      panel._anchorEl = null;
      return;
    }

    const topics = getHelpTopicsForEditor(editor);

    // Rebuild menu items for this editor's topic list.
    panel.innerHTML = '';
    panel._anchorEl = anchorEl;

    topics.forEach((topicKey) => {
      const li = document.createElement('li');
      li.setAttribute('role', 'presentation');

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.setAttribute('role', 'menuitem');
      btn.textContent = HELP_TOPIC_LABELS[topicKey] || topicKey;
      btn.addEventListener('click', () => {
        panel.style.display = 'none';
        panel._anchorEl = null;
        document.dispatchEvent(new CustomEvent('a11yFirstHelpRequested', {
          detail: { source: 'dropdown', editor, topic: topicKey, topics }
        }));
      });

      li.appendChild(btn);
      panel.appendChild(li);
    });

    // Position below the anchor element; keep inside viewport.
    const rect = anchorEl.getBoundingClientRect();
    const panelMaxWidth = 220;
    let left = rect.left;
    if (left + panelMaxWidth > window.innerWidth - 8) {
      left = window.innerWidth - panelMaxWidth - 8;
    }
    panel.style.left = `${Math.max(4, left)}px`;
    panel.style.top = `${rect.bottom + 2}px`;
    panel.style.display = 'block';

    const firstBtn = panel.querySelector('button');
    if (firstBtn) firstBtn.focus();
  }

  // ============================================================================
  // Help Button Plugin
  // ============================================================================

  function A11yFirstHelpButtonPlugin(editor) {
    editor.ui.componentFactory.add('a11yFirstHelp', (locale) => {
      try {
        const CK5 = global.CKEDITOR5 || {};
        let ButtonViewCtor =
          (CK5.ui && CK5.ui.ButtonView) ||
          (CK5.ui && CK5.ui.button && CK5.ui.button.ButtonView) ||
          null;

        // Fallback: extract ButtonView constructor from an existing toolbar component.
        // This handles classic CKEditor5 builds that do not expose a CKEDITOR5 global.
        if (!ButtonViewCtor) {
          const fallbackNames = ['undo', 'redo', 'bold', 'italic'];
          for (const name of fallbackNames) {
            try {
              const sample = editor.ui.componentFactory.create(name);
              if (sample && typeof sample.constructor === 'function' && sample.constructor !== Object) {
                ButtonViewCtor = sample.constructor;
                if (typeof sample.destroy === 'function') {
                  sample.destroy();
                }
                break;
              }
            } catch (_e) {
              console.debug('A11yFirst Help: failed to create fallback component', name, _e);
            }
          }
        }

        if (!ButtonViewCtor) {
          console.warn('A11yFirst Help: ButtonView not available in this CKEditor5 build. Help button will not be displayed.');
          return null;
        }

        const view = new ButtonViewCtor(locale);

        // Use text label only (no icon) so authors can immediately read the button's
        // purpose without needing to hover for a tooltip, matching the CK4 dropdown
        // appearance of "A11yFirst Help" with visible text.
        view.set({
          label: 'A11yFirst Help',
          withText: true,
          tooltip: false
        });

        view.on('execute', () => {
          document.dispatchEvent(new CustomEvent('a11yFirstHelpRequested', {
            detail: {
              source: 'toolbar',
              editor,
              topic: 'GettingStarted',
              topics: getHelpTopicsForEditor(editor)
            }
          }));
        });

        return view;
      } catch (err) {
        console.warn('A11yFirst Help button initialization failed:', err.message);
        return null;
      }
    });
  }

  // ============================================================================
  // Export Public API
  // ============================================================================

  const namespace = global.A11yFirst || {};
  namespace.CharacterStyles = {
    plugin: A11yFirstCharacterStylesPlugin,
    applyCustomCharacterStyle,
    removeCustomCharacterStyles,
    customStyleAttributes
  };
  namespace.HelpButton = {
    plugin: A11yFirstHelpButtonPlugin
  };
  namespace.Heading = {
    plugin: A11yFirstHeadingPlugin
  };
  namespace.Image = {
    plugin: A11yFirstImagePlugin
  };
  namespace.Link = {
    plugin: A11yFirstLinkPlugin
  };
  namespace.List = {
    plugin: A11yFirstListPlugin
  };
  namespace.Table = {
    plugin: A11yFirstTablePlugin
  };
  namespace.A11yChecker = {
    plugin: A11yFirstA11yCheckerPlugin,
    /**
     * Run an accessibility check on a CKEditor5 editor instance.
     *
     * This uses axe-core (if available via window.axe) combined with
     * A11yFirst custom rules.  It replaces the old Quail.js-based check
     * used in the CKEditor 4 plugin.
     *
     * @param {object} editor  CKEditor5 editor instance
     * @returns {Promise<CheckerResult>}
     */
    runCheck: runA11yCheck
  };
  namespace.ValidationRegistry = validationRegistry;
  global.A11yFirst = namespace;
})(window);
