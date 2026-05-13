# A11yFirst CKEditor5 Plugin — User Guide

A11yFirst is a suite of CKEditor5 plugins that helps content authors create
accessible web content as they write. Instead of checking accessibility after
publication, A11yFirst provides **real-time guidance** inside the editor so
that issues are caught and fixed before content is saved.

---

## Table of Contents

1. [What is A11yFirst?](#what-is-a11yfirst)
2. [Installation](#installation)
3. [Quick Start](#quick-start)
4. [Features](#features)
   - [Heading / Paragraph](#heading--paragraph)
   - [Image Alternative Text](#image-alternative-text)
   - [Link Text Quality](#link-text-quality)
   - [List Structure](#list-structure)
   - [Table Structure](#table-structure)
   - [Accessibility Checker](#accessibility-checker)
   - [Character Styles](#character-styles)
   - [Help Topics Dropdown](#help-topics-dropdown)
5. [Reading the Validation Panel](#reading-the-validation-panel)
6. [WCAG Coverage](#wcag-coverage)
7. [Frequently Asked Questions](#frequently-asked-questions)

---

## What is A11yFirst?

A11yFirst is based on the principle that **accessibility should be built in
from the start** — not bolted on at the end. The plugin suite guides authors
toward accessible HTML by:

- Showing **real-time error and advisory messages** as content is typed.
- Enforcing **structural rules** (e.g. heading hierarchy) that screen reader
  users depend on.
- Exposing **contextual help** so authors understand *why* something matters,
  not just *that* it is wrong.

A11yFirst originated as a CKEditor 4 plugin suite developed at the University
of Illinois. This package is the CKEditor 5 port.

---

## Installation

```bash
npm install ckeditor5-a11yfirst
```

> **Peer dependency:** CKEditor5 v41 or later must be installed in your project.

---

## Quick Start

```js
import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor.js';
import { A11yFirst } from 'ckeditor5-a11yfirst';

ClassicEditor
  .create(document.querySelector('#editor'), {
    plugins: [
      A11yFirst,
      // … your other plugins
    ],
    toolbar: {
      items: [
        'heading',
        '|',
        'bold', 'italic',
        '|',
        'link', 'imageUpload',
        '|',
        'bulletedList', 'numberedList',
        '|',
        'insertTable',
        '|',
        'a11yFirstHelp'   // ← A11yFirst help button
      ]
    }
  })
  .then(editor => {
    // Optional: connect the ValidationRegistry to your UI
    const registry = editor._a11yFirstRegistry;
    registry.addListener(findings => {
      updateMyA11yPanel(findings);
    });
  });
```

> **Tip:** You can load individual sub-plugins instead of the full `A11yFirst`
> bundle if you only need specific features.  See the
> [Developer Guide](./DEVELOPER_GUIDE.md) for details.

---

## Features

### Heading / Paragraph

**Plugin:** `A11yFirstHeadingPlugin`

Screen reader users navigate long documents using heading landmarks. A11yFirst
enforces the rule that **heading levels must not be skipped**.

| What you do                    | What A11yFirst reports               |
|-------------------------------|---------------------------------------|
| Type `H4` after an `H2`       | ⛔ Error: heading level skipped       |
| Type `H3` after an `H2`       | ✅ No issue                           |

**WCAG:** 1.3.1 Info and Relationships

---

### Image Alternative Text

**Plugin:** `A11yFirstImagePlugin`

Every meaningful image needs a text alternative so that screen reader users
receive equivalent information.

| What you do                         | What A11yFirst reports                       |
|------------------------------------|-----------------------------------------------|
| Insert an image with no `alt`       | ⛔ Error: missing alt attribute               |
| Insert an image with `alt=""`       | ℹ️ Advisory: confirm the image is decorative |
| Insert an image with descriptive alt| ✅ No issue                                   |

**WCAG:** 1.1.1 Non-text Content

---

### Link Text Quality

**Plugin:** `A11yFirstLinkPlugin`

Generic link text like "click here" or "read more" gives no information about
the link destination when encountered out of context (e.g., in a screen
reader's links list).

| Link text you type               | What A11yFirst reports               |
|----------------------------------|---------------------------------------|
| `click here`                     | ⛔ Error: non-descriptive link text   |
| `read more`                      | ⛔ Error: non-descriptive link text   |
| `Download the 2025 annual report`| ✅ No issue                           |

**Flagged phrases:** `click here`, `click`, `link`, `read more`, `more`,
`here`, `download`, `go`, and empty links.

**WCAG:** 2.4.4 Link Purpose (In Context)

---

### List Structure

**Plugin:** `A11yFirstListPlugin`

Using manual bullet characters (•, –, ·) or numbered lines instead of proper
`<ul>`/`<ol>` markup creates content that looks like a list but is not
announced as one by screen readers.

| What you do                           | What A11yFirst reports                     |
|--------------------------------------|--------------------------------------------|
| Two consecutive `• ` bullet lines   | ⚠️ Warning: possible fake list detected    |
| Four or more nested list levels      | ℹ️ Advisory: deeply nested lists           |
| Proper `<ul><li>…</li></ul>`        | ✅ No issue                                |

**WCAG:** 1.3.1 Info and Relationships

---

### Table Structure

**Plugin:** `A11yFirstTablePlugin`

Data tables need **header cells** and a **caption** so that screen reader users
know what the table represents and can associate each data cell with its headers.

| What you do                              | What A11yFirst reports                            |
|-----------------------------------------|---------------------------------------------------|
| Insert a table with no `<caption>`      | ℹ️ Advisory: missing caption                      |
| Insert a table with no `<th>` cells     | ⛔ Error: no header cells                          |
| `<th>` cells without `scope` attribute  | ℹ️ Advisory: add `scope="col"` or `scope="row"`   |
| Complete, well-formed table             | ✅ No issue                                        |

The plugin also sets `aria-label` on every nested-editable table cell in the
editor's editing view so that the editor itself is accessible to screen reader
users while authoring.

**WCAG:** 1.3.1 Info and Relationships

---

### Accessibility Checker

**Plugin:** `A11yFirstCheckerPlugin`

Provides a comprehensive, on-demand accessibility scan combining:

1. **A11yFirst custom rules** — synchronous checks for heading sequence, link
   text, image alt text, and table structure. These run on every `change:data`
   event so the live validation badges stay up to date.

2. **axe-core** (when `window.axe` is available) — automated WCAG 2.0, 2.1,
   and 2.2 scan of the editor's live DOM.

#### Triggering a full check

```js
const result = await editor.a11yCheck();

console.log(result.blocking);  // issues that must be fixed before publishing
console.log(result.advisory);  // issues that are informational / best-practice
console.log(result.timestamp); // ISO 8601 timestamp of the run
```

#### Integrating axe-core

Load axe-core from a CDN or NPM before calling `editor.a11yCheck()`:

```html
<script src="https://cdn.jsdelivr.net/npm/axe-core/axe.min.js"></script>
```

or:

```js
import axe from 'axe-core';
window.axe = axe;
```

---

### Character Styles

**Plugin:** `A11yFirstCharacterStylesPlugin`

Adds five semantically meaningful inline styles to the editor's schema:

| Toolbar / Model attribute  | HTML output             | Semantic meaning            |
|---------------------------|-------------------------|-----------------------------|
| `a11yMarker`              | `<span class="marker">` | Highlighted / marked text   |
| `a11yInlineQuote`         | `<q>`                   | Inline quotation             |
| `a11yCitedWork`           | `<cite>`                | Title of a cited work        |
| `a11yDeletedText`         | `<del>`                 | Deleted / removed text       |
| `a11yInsertedText`        | `<ins>`                 | Inserted / added text        |

These elements convey richer semantic meaning than a generic `<span>` or `<em>`
and improve the screen reader experience.

**WCAG:** 1.3.1 Info and Relationships

---

### Help Topics Dropdown

**Plugin:** `A11yFirstHelpPlugin`

Adds a toolbar button that opens a dropdown listing the help topics relevant to
the plugins currently loaded. Authors can click any topic to open contextual
guidance.

```js
toolbar: {
  items: [..., 'a11yFirstHelp']
}
```

The dropdown is **keyboard-accessible**:
- `ArrowDown` / `ArrowUp` — navigate items
- `Enter` / `Space` — activate item
- `Escape` — close and return focus to the button

Topics always included: **Getting Started**, **About A11yFirst**.

Additional topics appear automatically when the corresponding plugin is loaded
(e.g. "Heading / Paragraph" appears when `A11yFirstHeadingPlugin` is active).

---

## Reading the Validation Panel

A11yFirst writes findings to a `ValidationRegistry` instance attached to the
editor as `editor._a11yFirstRegistry`. Subscribe to changes to build your own
accessible UI panel:

```js
editor._a11yFirstRegistry.addListener((findings) => {
  const { headings, images, links, lists, tables } = findings;

  const errorCount =
    [...headings, ...images, ...links, ...lists, ...tables]
      .filter(f => f.level === 'error').length;

  document.getElementById('a11y-badge').textContent = String(errorCount);
});
```

Each finding has:

| Property  | Type                              | Description                     |
|-----------|-----------------------------------|---------------------------------|
| `level`   | `'error' \| 'warning' \| 'advisory'` | Severity of the finding      |
| `message` | `string`                          | Human-readable description      |

---

## WCAG Coverage

| Feature           | Success Criteria covered                 |
|-------------------|------------------------------------------|
| Headings          | 1.3.1                                    |
| Image alt text    | 1.1.1                                    |
| Link text         | 2.4.4                                    |
| Lists             | 1.3.1                                    |
| Tables            | 1.3.1                                    |
| Checker (axe)     | 1.1.1, 1.3.1, 1.4.3, 2.4.2, 2.4.4, 4.1.1, and more |
| Character styles  | 1.3.1                                    |

---

## Frequently Asked Questions

**Q: Does A11yFirst work with CKEditor 5 balloon or inline editors?**

Yes. The validation plugins operate on the editor's data model and HTML output,
not on a specific editor type. The table labelling feature requires
`editor.editing.view.getDomRoot()` to be available, which all built-in editor
types support.

---

**Q: Can I use just one or two plugins instead of the full bundle?**

Yes. Import individual plugin classes:

```js
import { A11yFirstHeadingPlugin, A11yFirstTablePlugin } from 'ckeditor5-a11yfirst';

ClassicEditor.create(element, {
  plugins: [A11yFirstHeadingPlugin, A11yFirstTablePlugin, ...]
});
```

---

**Q: Will A11yFirst slow down my editor?**

The custom-rule checks run synchronously on the editor's HTML string, which is
typically a small document. On typical content (< 50 kB) the impact is
imperceptible. The optional axe-core scan is asynchronous and only runs when
you explicitly call `editor.a11yCheck()`.

---

**Q: What happened to Quail.js?**

The original CKEditor 4 A11yFirst accessibility checker used Quail.js — a
jQuery-dependent library archived in 2016 that only covered WCAG 2.0. This
CKEditor 5 port replaces Quail.js with:

- **Custom rules** built directly into the plugin for the authoring scenarios
  A11yFirst cares about.
- **axe-core** for automated WCAG 2.0, 2.1, and 2.2 scanning (no jQuery
  required).
