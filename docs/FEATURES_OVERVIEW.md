# CKEditor 5 A11yFirst Plugin - Features Overview

## Introduction

The CKEditor 5 A11yFirst plugin extends CKEditor5 with accessibility guidance and validation, enabling content authors to create accessible content during the editing process rather than remediating accessibility issues after publication.

This document describes the features available in the CKEditor 5 A11yFirst plugin, organized by validator plugin and use case.

---

## Core Philosophy

**Shift-Left Accessibility**: Guide authors toward accessible content creation from the start, reducing the need for post-publication accessibility audits.

**Modular Design**: Each A11yFirst feature is implemented as an independent, pluggable CKEditor5 plugin that can be selectively enabled/disabled based on editorial needs.

**Customizable Configuration**: Site integrators can create custom editor configurations by combining only the features they need, matching the CKEditor 4 A11yFirst customization philosophy.

---

## Validator Plugins

### A11yFirstHeadingPlugin

**Status**: ✅ Stable

**Purpose**: Validates heading hierarchy and sequences to ensure screen reader users can navigate document structure.

**Features**:
- **Heading Hierarchy Validation**: Enforces sequential heading levels (H2→H3→H4, no skipping)
- **Sequence Break Detection** *(Evolving)*: Warns when inserting a heading breaks the hierarchy of following headings
- **Optional Strict Mode**: Restricts H1 (reserved for page title) and enforces sequential nesting
- **Real-time Feedback**: Validates on every content change with debounced updates

**Validated Conditions**:
- ❌ Missing heading (H1 only at document start when allowed)
- ❌ Non-sequential heading levels (H2→H4 without H3)
- ❌ ⚠️ Downstream hierarchy breaks (inserting H4 after H2 with H3 following)

**Editor Configuration**:
```javascript
extraPlugins: [A11yFirst.Heading.plugin]
```

**Help Topics**: Heading, HeadingParagraph

---

### A11yFirstImagePlugin

**Status**: ✅ Stable

**Purpose**: Validates image accessibility including alt text presence and integration with axe-core automated scanning.

**Features**:
- **Alt Text Validation**: Detects missing or empty alt attributes
- **Caption Detection**: Identifies images with toggleable captions
- **Axe-Core Integration** *(Demo 3)*: Runs axe-core rules on images for enhanced validation
- **Sa11y Overlay Support** *(Optional)*: Can layer page-level checking via Sa11y

**Validated Conditions**:
- ❌ `<img>` without `alt` attribute
- ❌ `<img>` with empty `alt=""` (unless decorative)
- ⚠️ Missing `<figcaption>` for complex images

**Editor Configuration**:
```javascript
extraPlugins: [A11yFirst.Image.plugin]
```

**Help Topics**: Image

**Evolving Features**:
- Enhanced decorative vs. informative image detection
- Guidance for when captions are necessary vs. optional

---

### A11yFirstLinkPlugin

**Status**: ✅ Stable

**Purpose**: Validates link text quality to ensure links are meaningful out of context (screen reader convention).

**Features**:
- **Generic Link Text Detection**: Identifies "click here", "link", "read more", and empty link text
- **Display Text Validation**: Flags links with non-descriptive visible text
- **Anchor Support**: Recognizes fragment links and deep links
- **Real-time Validation**: Immediate feedback as users type or paste links

**Validated Conditions**:
- ❌ Link with generic text: "click here", "link", "more", "here"
- ❌ Empty link text (no visible or alt text)
- ❌ Raw URLs as visible link text (when descriptive text available)
- ⚠️ Ambiguous link text ("this", "information", "page")

**Editor Configuration**:
```javascript
extraPlugins: [A11yFirst.Link.plugin]
```

**Help Topics**: Link

---

### A11yFirstListPlugin

**Status**: ✅ Stable

**Purpose**: Validates list structure and detects fake lists created with bullet-like text instead of proper markup.

**Features**:
- **Fake List Detection**: Identifies bullet-like text (•, -, numbered) outside `<ul>` or `<ol>` tags
- **Nesting Depth Validation**: Warns on deeply nested lists (4+ levels) that confuse screen readers
- **Structure Validation**: Ensures proper `<li>` nesting within `<ul>`/`<ol>`
- **Real-time Scanning**: Updates as content is edited

**Validated Conditions**:
- ❌ Text formatted like lists without proper `<ul>`/`<ol>` markup
- ⚠️ Deeply nested lists (4+ levels)
- ❌ Improper list nesting (skipped levels within `<ul>`)

**Editor Configuration**:
```javascript
extraPlugins: [A11yFirst.List.plugin]
```

**Help Topics**: List

---

### A11yFirstTablePlugin

**Status**: ✅ Stable (with UI Enhancements)

**Purpose**: Validates table structure and provides UI for editing critical table metadata.

**Features**:
- **Header Cell Validation**: Ensures tables use `<th>` for column/row headers (not `<td>`)
- **Scope Attribute Detection**: Identifies missing `scope="col"` and `scope="row"` attributes
- **Caption Management** *(UI Feature)*: Modal dialog for editing/adding table captions
- **Summary Attribute Support** *(UI Feature)*: Optional summary for complex table structures
- **W3C WAI Compliance**: Follows W3C Web Accessibility Tutorials guidelines
- **Real-time Validation**: Scans on every table edit

**Validated Conditions**:
- ❌ Table without `<caption>` element
- ❌ Table with data cells `<td>` instead of header cells `<th>`
- ⚠️ Header cells without `scope` attribute
- ⚠️ Missing `summary` attribute (for complex/multi-level tables)

**UI Components**:
- "Edit Caption" button opens modal dialog
- Caption text field (required or strongly recommended)
- Summary attribute field (optional, for complex tables)
- Guidance text with links to W3C resources

**Editor Configuration**:
```javascript
extraPlugins: [A11yFirst.Table.plugin]
```

**Help Topics**: Table

**User Guidance References**:
- https://www.w3.org/WAI/tutorials/tables/caption-summary/
- https://bati-itao.github.io/learning/esdc-self-paced-web-accessibility-course/module4/caption-summary.html
- https://www.makethingsaccessible.com/guides/html-tables-for-use-as-content/

---

### A11yFirstCharacterStylesPlugin

**Status**: ✅ Stable

**Purpose**: Provides semantic text attributes for emphasizing or marking text with accessibility context.

**Features**:
- **Custom Text Attributes**: 5 semantic styles for inline content
- **Upcast/Downcast Converters**: Converts between inline markup and model attributes
- **Style Toolbar Access**: Character style buttons in editor toolbar
- **Keyboard Support**: Accessible via keyboard shortcuts and toolbar

**Supported Attributes**:
- `a11yMarker` → `<span class="marker">` (highlights/marks)
- `a11yInlineQuote` → `<q>` (inline quotations)
- `a11yCitedWork` → `<cite>` (cited works/references)
- `a11yDeletedText` → `<del>` (tracked deletions)
- `a11yInsertedText` → `<ins>` (tracked insertions)

**Editor Configuration**:
```javascript
extraPlugins: [A11yFirst.CharacterStyles.plugin]
```

**Help Topics**: CharacterStyle

**Evolving Features**:
- Additional style definitions (emphasis, strong, code)
- Style picker UI improvements
- ARIA label customization

---

### A11yFirstA11yCheckerPlugin

**Status**: ✅ Stable (with Evolving Scope)

**Purpose**: Aggregates findings from all validators and combines with axe-core automated testing for comprehensive accessibility summary.

**Features**:
- **Finding Aggregation**: Collects issues from all active validators (Heading, Image, Link, List, Table)
- **Axe-Core Integration**: Runs axe-core v4.11.1 rules on editor content
- **Blocking vs. Advisory**: Categorizes issues as critical (blocking) or advisory
- **In-Editor Summary**: Displays findings without requiring page inspection tools
- **Real-time Scanning**: Updates as content changes

**Validated Findings**:

**Blocking Issues** (Must fix before publishing):
- Missing or non-descriptive link text
- Missing image alt text
- Heading sequence violations
- Table missing headers or captions
- Generic button/link labels

**Advisory Issues** (Best practices):
- Missing table summary (for complex tables)
- Deeply nested lists
- Missing caption (when images are complex)
- Ambiguous link phrases

**Editor Configuration**:
```javascript
extraPlugins: [A11yFirst.Heading.plugin, A11yFirst.Image.plugin, A11yFirst.Link.plugin, 
               A11yFirst.List.plugin, A11yFirst.Table.plugin, A11yFirst.A11yChecker.plugin]
```

**Help Topics**: A11yCheckerSummary

**Evolving Features**:
- Custom rule definitions (site-specific content guidelines)
- Severity level customization
- Export/reporting of findings
- Integration with external accessibility dashboards

---

### A11yFirstHelpButtonPlugin

**Status**: ✅ Stable

**Purpose**: Provides in-editor help system with 10 accessibility guidance topics.

**Features**:
- **Help Button**: Toolbar button opening help system
- **Topic Selection**: Dropdown with 10 guidance topics
- **Modal Display**: Clean dialog showing help content
- **Accessible Design**: Modal with proper ARIA attributes
- **Graceful Degradation**: Help button hidden if ButtonView unavailable

**Available Topics**:
1. **Getting Started** - A11yFirst overview and philosophy
2. **Heading & Paragraph** - Heading structure and semantic paragraphs
3. **List** - Proper list markup and nesting
4. **Image** - Alt text, captions, and image metadata
5. **Character Style** - Semantic inline text attributes
6. **Link** - Meaningful link text patterns
7. **Paragraph Format** - Blockquote, address, pre elements
8. **Table** - Headers, captions, scope attributes
9. **A11y Checker Summary** - Understanding validation findings
10. **About A11yFirst** - Project philosophy and context

**Editor Configuration**:
```javascript
extraPlugins: [A11yFirst.HelpButton.plugin]
```

**Help Topics**: All (main help index)

---

## Plugin Combinations & Use Cases

### Configuration 1: Standard Full-Featured

**Target**: Content teams needing comprehensive accessibility guidance

```javascript
extraPlugins: [
  A11yFirst.Heading.plugin,
  A11yFirst.Image.plugin,
  A11yFirst.Link.plugin,
  A11yFirst.List.plugin,
  A11yFirst.Table.plugin,
  A11yFirst.CharacterStyles.plugin,
  A11yFirstHelpButton.plugin
]
```

**Validates**: All content types with all rules

---

### Configuration 2: Strict Heading Mode

**Target**: Organizations with strict heading hierarchy requirements

```javascript
extraPlugins: [A11yFirst.Heading.plugin, A11yFirst.HelpButton.plugin]

// With custom heading configuration:
heading: {
  options: [
    { model: 'heading2', view: 'h2', title: 'Heading 2' },
    { model: 'heading3', view: 'h3', title: 'Heading 3' },
    { model: 'heading4', view: 'h4', title: 'Heading 4' }
  ]
}
```

**Validates**: Only heading structure (no H1, strict nesting)

---

### Configuration 3: Content-Focused (Images + Links + Lists)

**Target**: Blog or news publishing

```javascript
extraPlugins: [
  A11yFirst.Image.plugin,
  A11yFirst.Link.plugin,
  A11yFirst.List.plugin,
  A11yFirst.HelpButton.plugin
]
```

**Validates**: Images, links, and list structure (common publishing issues)

---

### Configuration 4: Table Data Publishing

**Target**: Data journalism or research content

```javascript
extraPlugins: [
  A11yFirst.Table.plugin,
  A11yFirst.Link.plugin,
  A11yFirst.HelpButton.plugin
]
```

**Validates**: Table structure, captions, link text

---

### Configuration 5: Accessibility Checker Summary

**Target**: Final review before publication

```javascript
extraPlugins: [
  A11yFirst.Heading.plugin,
  A11yFirst.Image.plugin,
  A11yFirst.Link.plugin,
  A11yFirst.List.plugin,
  A11yFirst.Table.plugin,
  A11yFirst.A11yChecker.plugin,
  A11yFirst.HelpButton.plugin
]
```

**Validates**: All aspects with unified summary report

---

## Evolving Features & Roadmap

### Current Focus Areas

1. **Enhanced Heading Sequence Detection** (In Progress)
   - Detecting when new headings break downstream hierarchy
   - Context-aware suggestions for heading levels

2. **Image Complexity Detection** (Planned)
   - Distinguishing decorative vs. informative images
   - Guidance for when detailed descriptions needed

3. **Link Context Analysis** (Planned)
   - Detecting ambiguous link phrases
   - Suggesting improvements for generic link text

4. **Custom Rule Builder** (Evolving)
   - API for site-specific validation rules
   - Integration with content guidelines

5. **Accessibility Dashboard** (Future)
   - Real-time metrics on document accessibility
   - Cross-document reporting
   - Team collaboration features

---

## Demo Suite

The plugin system is demonstrated through 9 progressive demo configurations in the [demo suite](/demo/ckeditor5-a11yfirst.html):

1. **Demo 1** - Standard A11yFirst (all validators)
2. **Demo 2** - Strict Heading Mode (heading validation only)
3. **Demo 3** - Image-Focused Mode (images + axe-core audit)
4. **Demo 4** - Link-Focused Mode (link text validation)
5. **Demo 5** - Character Styles (semantic text attributes)
6. **Demo 6** - List Guidance (list validation)
7. **Demo 7** - Paragraph Formats (semantic blocks)
8. **Demo 8** - Table Accessibility (with caption UI)
9. **Demo 9** - A11y Checker Summary (unified findings)

---

## Accessibility References

### W3C Web Accessibility Guidelines
- [Headings & Structure](https://www.w3.org/WAI/tutorials/page-structure/headings/)
- [Images](https://www.w3.org/WAI/tutorials/images/)
- [Links](https://www.w3.org/WAI/tutorials/page-structure/links/)
- [Tables](https://www.w3.org/WAI/tutorials/tables/)
- [Lists](https://www.w3.org/WAI/tutorials/page-structure/lists/)

### WCAG 2.1 Standard
- Level A: Basic accessibility (single A ♿)
- Level AA: Enhanced accessibility (double A ♿♿) - Recommended for public content
- Level AAA: Maximum accessibility (triple A ♿♿♿) - For specialized content

### External Tools Referenced
- [axe-core](https://github.com/dequelabs/axe-core) - Automated accessibility testing
- [Sa11y](https://ryersondmp.github.io/sa11y/) - Page overlay accessibility checker
- [WCAG Contrast Checker](https://webaim.org/resources/contrastchecker/) - Color contrast validation

---

## Version Information

| Component | Version | Status |
|-----------|---------|--------|
| CKEditor 5 | 41.4.2 | Stable |
| A11yFirst Plugin Suite | 1.0.0 | Stable |
| axe-core | 4.11.1 | Stable |
| Sa11y | 4.4.1 | Optional |

---

## Support & Feedback

For issues, feature requests, or contributions, visit the [A11yFirst GitHub](https://github.com/a11yfirst/plugins-dev).

For academic reference, cite: [A11yFirst for CKEditor: Changing the Way Authors Think about Editing Content](https://www.ictaccessibilitytesting.org/wp-content/uploads/2020/10/A11yFirst-for-CKEditor-Changing-the-Way-Authors-Think-about-Editing-Content.pdf)
