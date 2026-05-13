# A11yFirst CKEditor5 Plugin — Developer Guide

This guide covers the architecture, API, extension points, and contribution
workflow for `ckeditor5-a11yfirst`.

---

## Table of Contents

1. [Package Overview](#package-overview)
2. [Architecture](#architecture)
3. [Plugin Classes](#plugin-classes)
   - [A11yFirst (bundle)](#a11yfirst-bundle)
   - [A11yFirstHeadingPlugin](#a11yfirstheadingplugin)
   - [A11yFirstImagePlugin](#a11yfirstimageplugin)
   - [A11yFirstLinkPlugin](#a11yfirstlinkplugin)
   - [A11yFirstListPlugin](#a11yfirstlistplugin)
   - [A11yFirstTablePlugin](#a11yfirsttableplugin)
   - [A11yFirstCheckerPlugin](#a11yfirstcheckerplugin)
   - [A11yFirstCharacterStylesPlugin](#a11yfirstcharacterstylesplugin)
   - [A11yFirstHelpPlugin](#a11yfirsthelpplugin)
4. [CKEditor5 Type Interfaces](#ckeditor5-type-interfaces)
5. [ValidationRegistry API](#validationregistry-api)
6. [Logic Modules](#logic-modules)
7. [Custom Rules — Extension Points](#custom-rules--extension-points)
8. [Adding a New Plugin](#adding-a-new-plugin)
9. [Testing](#testing)
10. [Build](#build)
11. [Publishing](#publishing)
12. [Design Decisions](#design-decisions)

---

## Package Overview

```
ckeditor5-a11yfirst/
├── src/
│   ├── ckeditor5-types.ts          # CKEditor5 interface declarations
│   ├── index.ts                    # Package entry point
│   ├── core/
│   │   ├── toolbarState.ts         # Toolbar ARIA state helpers
│   │   └── validationRegistry.ts   # Central findings store
│   ├── modules/
│   │   ├── heading/                # Heading policy & command logic
│   │   ├── checker/                # axe-core adapter + custom rules
│   │   └── table/                  # Table caption/summary/validation
│   └── plugins/
│       ├── A11yFirst.ts            # Bundle plugin (loads all sub-plugins)
│       ├── A11yFirstHeadingPlugin.ts
│       ├── A11yFirstImagePlugin.ts
│       ├── A11yFirstLinkPlugin.ts
│       ├── A11yFirstListPlugin.ts
│       ├── A11yFirstTablePlugin.ts
│       ├── A11yFirstCheckerPlugin.ts
│       ├── A11yFirstCharacterStylesPlugin.ts
│       ├── A11yFirstHelpPlugin.ts
│       └── index.ts
├── tests/
│   ├── helpers/
│   │   └── mockEditor.ts           # Lightweight mock editor for unit tests
│   └── unit/
│       ├── core/
│       ├── checker/
│       ├── table/
│       └── plugins/
├── docs/
│   ├── USER_GUIDE.md
│   └── DEVELOPER_GUIDE.md          # ← this file
├── package.json
├── tsconfig.json
├── tsconfig.build.json
└── vitest.config.ts
```

---

## Architecture

### Editor extension pattern

Every A11yFirst plugin follows the same lifecycle:

1. **`init()`** — called by CKEditor5 after all required plugins have been
   initialised.
2. The plugin registers its help topic key on `editor._a11yFirstTopics` (a
   `Set<string>`).
3. The plugin calls `ensureRegistry(editor)` to attach a `ValidationRegistry`
   to the editor if none exists yet.
4. The plugin subscribes to `editor.model.document.on('change:data', …)` to
   re-scan the editor's HTML content after every change.
5. Findings are written to the shared registry via
   `getRegistry(editor).setFindings(category, findings)`.

```
Editor instance
  ├── _a11yFirstTopics: Set<string>        ← topic keys for the help dropdown
  ├── _a11yFirstRegistry: ValidationRegistry ← findings store
  └── a11yCheck(): Promise<CheckerRunResult> ← full axe-core check
```

### Data flow

```
Keystroke / paste
      │
      ▼
editor.model.document 'change:data'
      │
      ▼
plugin.getData() → HTML string
      │
      ├──► scanXxx(html) → ValidationFinding[]
      │
      └──► registry.setFindings(category, findings)
                │
                ▼
          registry.notifyListeners()
                │
                ▼
          Application UI (badge count, error list, …)
```

---

## Plugin Classes

All plugin classes extend `PluginBase` from `src/ckeditor5-types.ts`.  When
loaded inside a real CKEditor5 project the runtime `Plugin` class from
`@ckeditor/ckeditor5-core` satisfies the same interface.

### A11yFirst (bundle)

```ts
import { A11yFirst } from 'ckeditor5-a11yfirst';
```

Convenience bundle that declares all eight sub-plugins in its static `requires`
array.  Its own `init()` is a no-op; all behaviour lives in the sub-plugins.

```ts
ClassicEditor.create(element, {
  plugins: [A11yFirst, ...]
});
```

---

### A11yFirstHeadingPlugin

| Static property | Value               |
|-----------------|---------------------|
| `pluginName`    | `'A11yFirstHeading'`|
| `requires`      | `[]`                |

Registers topic `'HeadingParagraph'`.

Exported helpers:

```ts
import { scanHeadingSequence, ensureRegistry, getRegistry } from 'ckeditor5-a11yfirst';

scanHeadingSequence(html: string): ValidationFinding[]
ensureRegistry(editor: A11yEditor): void
getRegistry(editor: A11yEditor): ValidationRegistry
```

`ensureRegistry` and `getRegistry` are used by all sub-plugins to share a
single `ValidationRegistry` instance per editor.

---

### A11yFirstImagePlugin

| Static property | Value             |
|-----------------|-------------------|
| `pluginName`    | `'A11yFirstImage'`|
| `requires`      | `[]`              |

Registers topic `'Image'`.

Exported helper:

```ts
import { scanImageAlt } from 'ckeditor5-a11yfirst';

scanImageAlt(html: string): ValidationFinding[]
```

---

### A11yFirstLinkPlugin

| Static property | Value            |
|-----------------|------------------|
| `pluginName`    | `'A11yFirstLink'`|
| `requires`      | `[]`             |

Registers topic `'Link'`.

Exported helpers:

```ts
import { scanLinkText, GENERIC_LINK_PHRASES } from 'ckeditor5-a11yfirst';

scanLinkText(html: string): ValidationFinding[]
GENERIC_LINK_PHRASES: ReadonlySet<string>
```

Add additional generic phrases to `GENERIC_LINK_PHRASES` before creating the
editor to expand detection coverage:

```ts
import { GENERIC_LINK_PHRASES } from 'ckeditor5-a11yfirst';
// Note: the exported set is read-only; create your own extended version:
const extendedPhrases = new Set([...GENERIC_LINK_PHRASES, 'go here', 'visit']);
```

To use a custom set, subclass `A11yFirstLinkPlugin` and override `init()`.

---

### A11yFirstListPlugin

| Static property | Value            |
|-----------------|------------------|
| `pluginName`    | `'A11yFirstList'`|
| `requires`      | `[]`             |

Registers topic `'List'`.

Exported helper:

```ts
import { scanListStructure } from 'ckeditor5-a11yfirst';

scanListStructure(html: string): ValidationFinding[]
```

---

### A11yFirstTablePlugin

| Static property | Value             |
|-----------------|-------------------|
| `pluginName`    | `'A11yFirstTable'`|
| `requires`      | `[]`              |

Registers topic `'Table'`.

Exported helpers:

```ts
import { scanTableStructure, labelNestedEditables } from 'ckeditor5-a11yfirst';

scanTableStructure(html: string): ValidationFinding[]
labelNestedEditables(editor: A11yEditor): void
```

`labelNestedEditables` queries the live editing DOM for
`ck-editor__nested-editable` table cells and sets their `aria-label` attributes.
It is called automatically on the `'ready'` event and after each `change:data`.

---

### A11yFirstCheckerPlugin

| Static property | Value               |
|-----------------|---------------------|
| `pluginName`    | `'A11yFirstChecker'`|
| `requires`      | `[]`                |

Registers topic `'A11yCheckerSummary'`.

Attaches `editor.a11yCheck()` — an async function returning a
`CheckerRunResult`:

```ts
interface CheckerRunResult {
  findings: CheckerRunFinding[];
  blocking: CheckerRunFinding[];
  advisory: CheckerRunFinding[];
  timestamp: string;
}

interface CheckerRunFinding {
  severity: string;   // 'severe' | 'moderate' | 'suggestion'
  blocking: boolean;
  source: string;     // 'axe-core' | 'custom'
  message: string;
}
```

Exported helper:

```ts
import { runA11yCheck } from 'ckeditor5-a11yfirst';

runA11yCheck(editor: A11yEditor): Promise<CheckerRunResult>
```

---

### A11yFirstCharacterStylesPlugin

| Static property | Value                        |
|-----------------|------------------------------|
| `pluginName`    | `'A11yFirstCharacterStyles'` |
| `requires`      | `[]`                         |

Registers topic `'CharacterStyle'`.

Extends the CKEditor5 schema with five inline text attributes and registers
their upcast and downcast converters.

Exported constant:

```ts
import { CHARACTER_STYLE_ATTRIBUTES } from 'ckeditor5-a11yfirst';
// ['a11yMarker', 'a11yInlineQuote', 'a11yCitedWork', 'a11yDeletedText', 'a11yInsertedText']
```

To apply a character style programmatically:

```ts
editor.model.change(writer => {
  writer.setAttribute('a11yMarker', true, editor.model.document.selection.getFirstRange());
});
```

---

### A11yFirstHelpPlugin

| Static property | Value              |
|-----------------|--------------------|
| `pluginName`    | `'A11yFirstHelp'`  |
| `requires`      | `[]`               |

Exported constants:

```ts
import { HELP_TOPIC_LABELS, HELP_TOPIC_ORDER } from 'ckeditor5-a11yfirst';
```

Public methods:

```ts
const plugin = editor.plugins.get('A11yFirstHelp') as A11yFirstHelpPlugin;

// Return the list of active help topics for this editor.
plugin.getHelpTopics(): string[]

// Return (or lazily create) the singleton <ul> dropdown panel.
plugin.ensurePanel(): HTMLUListElement

// Toggle the dropdown anchored beneath anchorEl.
plugin.togglePanel(anchorEl: HTMLElement, onSelect?: (key: string) => void): void

// Create a standalone help toolbar button.
plugin.createHelpButton(onSelect?: (key: string) => void): HTMLButtonElement
```

---

## CKEditor5 Type Interfaces

`src/ckeditor5-types.ts` declares the minimal `A11yEditor` interface and
`PluginBase` class.  These exist so the package can be built and unit-tested
without a live CKEditor5 runtime.

```ts
import type { A11yEditor } from 'ckeditor5-a11yfirst';
import { PluginBase } from 'ckeditor5-a11yfirst';
```

When used in a real CKEditor5 project, the actual `Editor` and `Plugin`
classes satisfy these interfaces automatically because they implement the same
API surface.

---

## ValidationRegistry API

```ts
import { ValidationRegistry } from 'ckeditor5-a11yfirst';

const registry = editor._a11yFirstRegistry as ValidationRegistry;

// Write findings for a category.
registry.setFindings('headings', [{ level: 'error', message: 'Heading skip' }]);

// Read findings.
const headingFindings = registry.getFindings('headings');
const allFindings     = registry.getFindings();

// Add a change listener.
const listener = (findings) => console.log(findings);
registry.addListener(listener);
registry.removeListener(listener);

// Clear one or all categories.
registry.clear('images');
registry.clear();
```

Categories: `headings` | `images` | `links` | `lists` | `tables` | `checker`

Finding shape:

```ts
interface ValidationFinding {
  level: 'error' | 'warning' | 'advisory';
  message: string;
}
```

---

## Logic Modules

The `src/modules/` directory contains lower-level, pure-function modules that
are shared by plugins and can also be used directly by consumers:

| Module                           | Exports                                                    |
|----------------------------------|------------------------------------------------------------|
| `modules/heading/`               | `computeAllowedHeadings`, `createHeadingCommandState`, etc.|
| `modules/checker/checkerMappings`| `mapAxeImpactToSeverity`, `resolveWcagRef`, `AXE_RULE_WCAG_MAP` |
| `modules/checker/checkerAdapter` | `adaptAxeResults`                                          |
| `modules/checker/checkerModule`  | `checkHeadingSequence`, `checkLinkText`, `checkImageAlt`, `checkTableStructure`, `buildCheckerResult`, `runCustomChecks` |
| `modules/table/tableCaption`     | `extractTableCaption`, `extractTableSummary`, `extractTableA11yData` |
| `modules/table/tableValidation`  | `validateTableAccessibility`, `validateAllTables`          |

---

## Custom Rules — Extension Points

To add a custom rule, create a function that matches the shape
`(html: string) => ValidationFinding[]` and call it from your own plugin:

```ts
import { PluginBase } from 'ckeditor5-a11yfirst';
import { ensureRegistry, getRegistry } from 'ckeditor5-a11yfirst';
import type { ValidationFinding } from 'ckeditor5-a11yfirst';

function checkNoTables(html: string): ValidationFinding[] {
  if (/<table[\s>]/i.test(html)) {
    return [{ level: 'advisory', message: 'Tables are discouraged in this content type.' }];
  }
  return [];
}

export class NoTablesPlugin extends PluginBase {
  static get pluginName() { return 'NoTables'; }

  init() {
    ensureRegistry(this.editor);
    this.editor.model.document.on('change:data', () => {
      const html = this.editor.getData();
      getRegistry(this.editor).setFindings('tables', checkNoTables(html));
    });
  }
}
```

---

## Adding a New Plugin

1. Create `src/plugins/MyNewPlugin.ts`.
2. Extend `PluginBase`, set a unique `pluginName`, implement `init()`.
3. Call `ensureRegistry(editor)` early in `init()`.
4. Add exports to `src/plugins/index.ts` and `src/index.ts`.
5. Add the plugin to `A11yFirst.requires` in `src/plugins/A11yFirst.ts`
   (if it should be included in the bundle).
6. Write tests in `tests/unit/plugins/MyNewPlugin.test.ts` using `MockEditor`.

---

## Testing

```bash
cd migration/ckeditor5/a11yfirst

# Install dependencies
npm install

# Run all tests
npm test

# Watch mode
npm run test:watch
```

Tests use [Vitest](https://vitest.dev/) with the `happy-dom` environment so
that DOM-dependent plugin features (table cell labelling, help panel) can be
tested without a browser.

### MockEditor

`tests/helpers/mockEditor.ts` exports a `MockEditor` class that satisfies the
`A11yEditor` interface:

```ts
import { MockEditor } from 'tests/helpers/mockEditor';

const editor = new MockEditor('<h2>Content</h2>');

// Trigger change:data listeners.
editor.triggerChange('<h2>Content</h2><h4>Skipped</h4>');

// Read the attached ValidationRegistry.
const registry = editor.getRegistry();
const findings = registry.getFindings('headings');

// Provide commands to test help/checker integration.
const editorWithBlockQuote = new MockEditor('', {
  commands: { blockQuote: {} }
});
```

---

## Build

```bash
npm run build
# Emits TypeScript declarations to dist/
```

The build uses `tsconfig.build.json` which excludes the `tests/` directory and
emits declaration files alongside the compiled JavaScript.

---

## Publishing

```bash
npm run prepublishOnly   # builds + runs tests
npm publish
```

The package is scoped as `ckeditor5-a11yfirst` (public, unscoped) so it
appears in CKEditor5's plugin directory searches.

---

## Design Decisions

### Why `PluginBase` instead of importing `Plugin` from `@ckeditor/ckeditor5-core`?

CKEditor5 packages publish ESM-only builds that require a bundler (Vite,
Webpack, etc.) and a live CKEditor5 runtime to work. Importing
`@ckeditor/ckeditor5-core` as a hard dependency would make it impossible to
run the unit tests in a plain Node.js/Vitest environment, and would create
peer-dependency version conflicts for consumers.

`PluginBase` mirrors the `Plugin` API exactly, so a real `ClassicEditor`
instance satisfies the `A11yEditor` interface and a real `Plugin` class can
be used in place of `PluginBase` — no wrapper required.

### Why store the ValidationRegistry on the editor instance?

CKEditor5 supports multiple editor instances on the same page. By attaching
`_a11yFirstRegistry` directly to the editor, each instance has its own
isolated findings store with no shared mutable state between instances.

### Why was Quail.js replaced?

| Dimension         | Quail.js (CKEditor 4) | axe-core (CKEditor 5)        |
|-------------------|-----------------------|------------------------------|
| WCAG coverage     | 2.0 only              | 2.0, 2.1, 2.2                |
| jQuery dependency | Required              | None                         |
| Maintenance       | Archived (2016)       | Actively maintained by Deque |
| NPM package       | No                    | Yes (`axe-core`)             |

Custom A11yFirst rules (`modules/checker/checkerModule.ts`) cover the
authoring-specific scenarios that Quail.js handled, without any jQuery
dependency.
