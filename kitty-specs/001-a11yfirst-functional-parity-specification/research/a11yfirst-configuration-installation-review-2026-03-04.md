# A11yFirst Configuration and Installation Review (2026-03-04)

This review captures migration implications from the A11yFirst documentation wiki pages focused on setup and distribution:

- https://github.com/a11yfirst/documentation/wiki/Configuring-CKEditor
- https://github.com/a11yfirst/documentation/wiki/Using-CKEditor-Builder
- https://github.com/a11yfirst/documentation/wiki/Installing-A11yFirst-Plugins

## What these pages establish for CKEditor4

1. A curated `config.js` is a primary control surface (plugin list, toolbar order, heading constraints, language list, styles set).
2. A11yFirst plugins replace specific stock plugins and require conflict removal (`format`, `link`, `stylescombo`, image variants).
3. Distribution paths are builder-centric and manual plugin-copy-centric.
4. Recommended toolbar ordering is part of accessibility UX intent, not just cosmetics.

## CKEditor5 migration interpretation

These inputs remain authoritative for behavior intent, but not for implementation mechanism:

- CKEditor4 plugin add/remove lists become CKEditor5 module/package composition and command/toolbar configuration.
- CKEditor4 `config.js` knobs map to CKEditor5 editor initialization config and A11yFirst feature-flag/module settings.
- Builder/manual-copy instructions become package install + build integration + runtime verification docs.

## Configuration mapping (intent-level)

| CKEditor4 source concept | CKEditor5 migration target |
|---|---|
| `config.allow_only_one_h1` | Heading constraint rule in A11yFirst heading module + parity tests |
| `config.format_tags` | Allowed heading/paragraph options in CKEditor5 heading config + state restrictions |
| `config.toolbar` grouped order | CKEditor5 toolbar + contextual toolbars reflecting A11yFirst action hierarchy |
| Plugin replacement table | CKEditor5 module selection and explicit avoidance of conflicting/default command paths |
| `config.language_list` | Language feature options and validation of language-authoring parity behavior |
| `CKEDITOR.stylesSet.add(...)` | Character style option registry in A11yFirst style module for CKEditor5 |

## Installation mapping (workflow-level)

| CKEditor4 workflow | CKEditor5 migration workflow |
|---|---|
| CKEditor Builder preset + add/remove plugins | Build/package composition in repository (module imports, build step, bundled demo artifacts) |
| Manual plugin zip extraction into `plugins/` | Package/module integration under migration package structure and build pipeline |
| `extraPlugins` and `removePlugins` | Feature/module registration, build-time inclusion, and explicit config gates |
| Visual smoke via toolbar availability | Automated parity tests + demo validation + CI workflow checks |

## Required migration artifacts to add/maintain

1. **CKEditor5 Configuration Mapping Guide**
   - Mirrors key `config.js` intent (heading rules, toolbar intent, language, style options).
   - Documents which options are currently implemented, deferred, or intentionally different.

2. **CKEditor5 Installation Guide for A11yFirst**
   - Replaces builder/manual plugin copy instructions with repository/package workflow.
   - Includes minimum steps to run demo, run parity tests, and verify module availability.

3. **Conflict Avoidance Notes**
   - Explicitly describe which default CKEditor5 controls or flows are superseded by A11yFirst parity behavior (for example image/link workflows) and where that is enforced.

## Open decisions to capture

- Which parts of legacy toolbar grouping are normative parity versus presentation flexibility.
- Whether language list scope remains static or can follow CKEditor5 defaults with documented exceptions.
- Which install path is canonical for external adopters (single package, sample build, or both).

## Recommendation

Treat these wiki pages as required migration documentation inputs and track the resulting CKEditor5 mapping docs as first-class deliverables in WP08 readiness, not as optional follow-up.
