# A11yFirst for CKEditor 5

> ## ⚠️ Experimental Project — AI-Assisted Content
>
> **This project is experimental.** Much of the documentation and site content in this repository was generated with the assistance of AI tools. **All claims, guidance, and implementation details need to be validated in real-world use before relying on them.**
>
> Impacts of using A11yFirst may vary significantly based on where and how it is implemented. Results in your environment may differ from what is described here.
>
> **We need your feedback!** If you try this project and get positive or negative results, please [open an issue](https://github.com/mgifford/CKEditor5-A11yFirst/issues) in the GitHub issue queue. Include links and references so that claims can be discussed and validated by the community.

---

A CKEditor 5 plugin suite that promotes and encourages the creation of accessible content as you edit. This project is a migration of the [A11yFirst for CKEditor 4](CKEditor4/README.md) project to the CKEditor 5 platform.

> **Note**: This repository contains a CKEditor 4 codebase that is being used as the starting point for a CKEditor 5 migration. The CKEditor 4 source and plugins in the repo root (`core/`, `plugins/`, `skins/`, etc.) are the **legacy platform** we are upgrading from — they are not the active CKEditor 5 development target. The CKEditor 5 A11yFirst work lives in the [`docs/`](docs/) directory.

---

## What is A11yFirst?

A11yFirst is a set of accessibility enhancements to CKEditor that promote and encourage the creation of accessible content during editing, rather than remediating accessibility issues after publication. It does this by:

- Guiding authors toward accessible choices at the point of content creation ("shift-left accessibility")
- Providing real-time validation and feedback on accessibility issues
- Offering in-editor help topics explaining accessibility best practices
- Making inaccessible choices harder to make and accessible choices the default

For academic context, see: [A11yFirst for CKEditor: Changing the Way Authors Think about Editing Content](https://www.ictaccessibilitytesting.org/wp-content/uploads/2020/10/A11yFirst-for-CKEditor-Changing-the-Way-Authors-Think-about-Editing-Content.pdf)

---

## CKEditor 5 Status

The CKEditor 5 migration is in an **early validation phase**. The goal right now is to get working code validated before expanding functionality. The CKEditor 5 plugin code lives in [`docs/assets/a11yfirst/a11yfirst.js`](docs/assets/a11yfirst/a11yfirst.js) and is demonstrated in the [demo suite](docs/demo/ckeditor5-a11yfirst.html).

### Plugins implemented in CKEditor 5 (demo/validation stage)

| Plugin | CK4 Equivalent | Status | Description |
|--------|---------------|--------|-------------|
| `A11yFirst.Heading` | `a11yheading` | 🔬 Validating | Validates heading hierarchy — detects non-sequential heading levels |
| `A11yFirst.Image` | `a11yimage` | 🔬 Validating | Detects images missing alt text ([Issue #1](https://github.com/mgifford/CKEditor5-A11yFirst/issues/1)) |
| `A11yFirst.Link` | `a11ylink` | 🔬 Validating | Detects generic/empty link text ("click here", "more", etc.) |
| `A11yFirst.List` | _(new)_ | 🔬 Validating | Detects fake lists and deeply nested list structures |
| `A11yFirst.Table` | _(new)_ | 🔬 Validating | Validates table headers, captions, and scope attributes ([Issue #14](https://github.com/mgifford/CKEditor5-A11yFirst/issues/14)) |
| `A11yFirst.CharacterStyles` | `a11ystylescombo` | 🔬 Validating | Semantic inline text attributes (cite, del, ins, q, mark) |
| `A11yFirst.A11yChecker` | `a11ychecker` | 🔬 Validating | Aggregates findings from all validators ([Issue #13](https://github.com/mgifford/CKEditor5-A11yFirst/issues/13)) |
| `A11yFirst.HelpButton` | `a11yfirsthelp` | 🔬 Validating | In-editor help system with accessibility guidance topics ([Issue #6](https://github.com/mgifford/CKEditor5-A11yFirst/issues/6)) |

> **Legend**: 🔬 Validating = code exists in demo, not yet packaged as a standalone CKEditor 5 plugin

### Features from CKEditor 4 A11yFirst not yet ported

The following CKEditor 4 A11yFirst capabilities need to be replicated in CKEditor 5. Each represents a gap between the current CKEditor 5 demo validation and the full CKEditor 4 feature set:

#### Heading / Paragraph (`a11yheading`)
- [ ] Disable non-sequential heading levels in the toolbar (not just validate after the fact)
- [ ] Heading menu item labels that indicate structural purpose

#### Image (`a11yimage`) — [Issue #1](https://github.com/mgifford/CKEditor5-A11yFirst/issues/1)
- [ ] Interactive prompt for alternative text when inserting images
- [ ] Warning when alt text exceeds 100 characters
- [ ] Detection of non-descriptive alt text phrases ("image of", "photo of", etc.)
- [ ] Support for marking images as decorative (no alt text needed)
- [ ] Long description support: ask whether a long description is needed and where it will be located

#### Link (`a11ylink`)
- [ ] Prevent saving a link with empty display text
- [ ] Warn when a URL is used as the visible link text
- [ ] Detect and warn on generic phrases: "click here", "more", "read more", etc.

#### Character Style (`a11ystylescombo`)
- [ ] Eliminate block-level styles from the character style dropdown (only semantic inline styles)

#### Help (`a11yfirsthelp`) — [Issue #6](https://github.com/mgifford/CKEditor5-A11yFirst/issues/6)
- [ ] Context-sensitive help: only show topics relevant to currently enabled plugins
- [ ] Help topics: Heading / Paragraph, List, Image, Character Style, Link, Getting Started, About A11yFirst

#### Toolbar
- [ ] Promote block elements for structural semantics over visual formatting
- [ ] Omit purely decorative choices (font size, font face, font color) from default toolbar
- [ ] High contrast theme support ([Issue #12](https://github.com/mgifford/CKEditor5-A11yFirst/issues/12))

---

## Demo

The CKEditor 5 A11yFirst demo is available at [`docs/demo/ckeditor5-a11yfirst.html`](docs/demo/ckeditor5-a11yfirst.html). It includes 9 progressive configurations:

1. **Demo 1** — Standard A11yFirst (all validators + help)
2. **Demo 2** — Strict Heading Mode
3. **Demo 3** — Image-Focused (with axe-core integration)
4. **Demo 4** — Link-Focused
5. **Demo 5** — Character Styles
6. **Demo 6** — List Guidance
7. **Demo 7** — Paragraph Formats
8. **Demo 8** — Table Accessibility
9. **Demo 9** — A11y Checker Summary

Compare with the [CKEditor 4 A11yFirst baseline](CKEditor4/a11yfirst.html).

---

## Documentation

- [Features Overview](docs/FEATURES_OVERVIEW.md) — Detailed description of each plugin and its validation rules
- [Developer Guide](docs/DEVELOPER_GUIDE.md) — How to build, configure, and extend the plugins
- [User Guide](docs/USER_GUIDE.md) — How to use A11yFirst when editing content
- [CKEditor 4 A11yFirst](CKEditor4/README.md) — The original CKEditor 4 feature set (migration reference)

---

## Repository Structure

> **Note on directory naming**: Despite being named `docs/`, this directory is the **active CKEditor 5 development home** — it contains the plugin source, demo suite, and GitHub Pages content. The repo root (`core/`, `plugins/`, `skins/`, etc.) contains the CKEditor 4 legacy codebase inherited from the upstream fork.

```
docs/                         # CKEditor 5 A11yFirst — active development
├── assets/a11yfirst/
│   └── a11yfirst.js          # All CKEditor 5 A11yFirst plugins
├── assets/ckeditor5/
│   └── ckeditor.classic.js   # CKEditor 5 build
├── demo/
│   └── ckeditor5-a11yfirst.html  # Demo suite (9 configurations)
├── FEATURES_OVERVIEW.md
├── DEVELOPER_GUIDE.md
└── USER_GUIDE.md
CKEditor4/                    # CKEditor 4 A11yFirst baseline (reference only)
└── a11yfirst.html
core/                         # CKEditor 4 legacy source (not active)
plugins/                      # CKEditor 4 legacy plugins (not active)
```

---

## Open Issues

Track progress and open new issues at the [GitHub Issues page](https://github.com/mgifford/CKEditor5-A11yFirst/issues).

Current open issues for the CKEditor 5 migration:

| Issue | Feature |
|-------|---------|
| [#1](https://github.com/mgifford/CKEditor5-A11yFirst/issues/1) | Replicate A11yFirst Image property editor (alt text, long description, decorative) |
| [#6](https://github.com/mgifford/CKEditor5-A11yFirst/issues/6) | A11yFirst Help dropdown — context-sensitive help per enabled plugins |
| [#12](https://github.com/mgifford/CKEditor5-A11yFirst/issues/12) | Toolbar discernibility in High Contrast Black theme |
| [#13](https://github.com/mgifford/CKEditor5-A11yFirst/issues/13) | A11yChecker — verify/replace Quail.js engine |
| [#14](https://github.com/mgifford/CKEditor5-A11yFirst/issues/14) | Table scope attribute value selection on cell properties |

---

## License

Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.

For licensing, see [LICENSE.md](LICENSE.md) or [https://ckeditor.com/legal/ckeditor-oss-license](https://ckeditor.com/legal/ckeditor-oss-license)
