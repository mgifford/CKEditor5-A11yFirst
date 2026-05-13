# ckeditor5-a11yfirst

> **Accessibility-first authoring for CKEditor5** — real-time WCAG guidance
> baked into the editor, not bolted on afterwards.

`ckeditor5-a11yfirst` is a suite of CKEditor5 plugins that helps content
authors create accessible web content as they write.  It enforces heading
hierarchy, validates image alt text and link text quality, checks table
structure, and runs automated WCAG 2.x scans via axe-core — all in real time
inside the editor.

This package is the CKEditor5 port of the A11yFirst plugin suite originally
developed at the University of Illinois for CKEditor 4.

---

## Install

```bash
npm install ckeditor5-a11yfirst
```

Peer dependency: **CKEditor5 v41+**

---

## Quick Start

```js
import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor.js';
import { A11yFirst } from 'ckeditor5-a11yfirst';

ClassicEditor
  .create(document.querySelector('#editor'), {
    plugins: [A11yFirst, /* … other plugins */],
    toolbar: {
      items: ['heading', '|', 'bold', 'italic', '|', 'link',
              '|', 'bulletedList', 'numberedList', '|', 'insertTable',
              '|', 'a11yFirstHelp']
    }
  })
  .then(editor => {
    // Subscribe to live validation findings
    editor._a11yFirstRegistry.addListener(findings => {
      console.log(findings);
    });

    // Trigger a full axe-core scan on demand
    document.getElementById('run-check').addEventListener('click', async () => {
      const result = await editor.a11yCheck();
      console.log('Blocking:', result.blocking);
    });
  });
```

---

## Included Plugins

| Plugin                           | Feature                                              | WCAG SC   |
|----------------------------------|------------------------------------------------------|-----------|
| `A11yFirstHeadingPlugin`         | Enforces accessible heading hierarchy                | 1.3.1     |
| `A11yFirstImagePlugin`           | Validates image alternative text                     | 1.1.1     |
| `A11yFirstLinkPlugin`            | Validates link text quality                          | 2.4.4     |
| `A11yFirstListPlugin`            | Detects fake lists and deep nesting                  | 1.3.1     |
| `A11yFirstTablePlugin`           | Validates table structure + labels editing cells     | 1.3.1     |
| `A11yFirstCheckerPlugin`         | Combined axe-core + custom WCAG checker              | Multiple  |
| `A11yFirstCharacterStylesPlugin` | Semantic inline character styles                     | 1.3.1     |
| `A11yFirstHelpPlugin`            | Accessible help-topics dropdown toolbar button       | —         |

Load the `A11yFirst` bundle to get all of the above, or import individual
plugins if you only need specific features.

---

## Documentation

| Document | Description |
|----------|-------------|
| [docs/USER_GUIDE.md](./docs/USER_GUIDE.md) | End-user feature reference |
| [docs/DEVELOPER_GUIDE.md](./docs/DEVELOPER_GUIDE.md) | Architecture, API, and contribution guide |

---

## Running Tests

```bash
cd migration/ckeditor5/a11yfirst
npm install
npm test
```

222 tests covering all plugin classes, logic modules, and the ValidationRegistry.

---

## License

GPL-2.0-or-later — see [LICENSE.md](../../LICENSE.md)

---

## Current Scope

- **WP03** — Heading and toolbar/state MVP scaffolding
- **WP07** — Accessibility checker parity (replaces Quail.js with axe-core)
- **WP08** — Full CKEditor5 plugin suite with tests and documentation

### Why axe-core instead of Quail.js?

| Dimension         | Quail.js (CKEditor 4) | axe-core (CKEditor 5)        |
|-------------------|-----------------------|------------------------------|
| WCAG coverage     | 2.0 only              | 2.0, 2.1, 2.2                |
| jQuery dependency | Required              | None                         |
| Maintenance       | Archived (2016)       | Actively maintained by Deque |
| NPM package       | No                    | Yes (`axe-core`)             |

