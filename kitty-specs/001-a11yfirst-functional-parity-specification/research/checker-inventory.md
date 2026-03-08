# Checker Inventory: CKEditor 4 A11yFirst Accessibility Checker

**T039** — Inventory checker rule-set and workflow differences  
**Work Package**: WP07 - Accessibility Checker Parity  
**Date**: 2026-03-08  
**Status**: Complete

---

## Summary

The CKEditor 4 A11yFirst Accessibility Checker plugin (`plugins/a11ychecker/`) **does still use the Quail.js engine** as its scanning backend. Quail.js is a legacy jQuery-based accessibility testing library (quailjs.org, circa 2014–2016) that is bundled directly in `plugins/a11ychecker/libs/quail/`.

The CKEditor 5 migration uses **axe-core v4.11.1** instead and does not depend on Quail.js in any form.

---

## CKEditor 4 Checker: Quail.js Engine

### Engine Location

| File | Size | Purpose |
|------|------|---------|
| `plugins/a11ychecker/libs/quail/quail.jquery.js` | 309 KB (~10,600 lines) | Main Quail engine (unminified) |
| `plugins/a11ychecker/libs/quail/quail.jquery.min.js` | 135 KB | Minified build |
| `plugins/a11ychecker/libs/quail/tests.json` | 277 KB (7,869 lines) | Test rule definitions |
| `plugins/a11ychecker/libs/quail/tests.min.json` | 164 KB | Minified test definitions |
| `plugins/a11ychecker/libs/quail/preconditions.json` | 3 KB | Test preconditions |
| `plugins/a11ychecker/libs/quail/wcag2.json` | 14 KB | WCAG 2.0 mapping |
| `plugins/a11ychecker/libs/quail/guidelines/wcag.json` | — | WCAG guideline mapping |
| `plugins/a11ychecker/libs/quail/guidelines/508.json` | — | Section 508 guideline mapping |

### Engine Version

The Quail.js build in this repository carries no explicit semantic version number. The header reads:

```
/*! QUAIL quailjs.org | quailjs.org/license */
```

The surrounding CKEditor Accessibility Checker plugin wrapper is version **1.1.0** (last updated 2016).

### Runtime Dependencies

- **jQuery 1.x or later** (required by Quail.js)
- **XMLHttpRequest** (used by Quail to load test JSON files at runtime)
- **Local filesystem restriction**: Quail cannot run from a `file://` URL because of the XHR dependency

### Quail.js Rule Set

Quail ships **264 test rules** covering a broad range of WCAG 2.0 and Section 508 criteria.

**Severity / Testability distribution**:

| Testability value | Quail label | Rule count |
|-------------------|-------------|-----------|
| `1` | `severe` | 140 |
| `0.5` | `moderate` | 52 |
| `0` | `suggestion` | 70 |
| `unknown` | `unknown` | 2 |

**Rule type distribution** (how Quail evaluates each rule):

| Type | Description |
|------|-------------|
| `custom` | Custom JavaScript evaluation function |
| `selector` | CSS selector presence/absence |
| `label` | Label association checks |
| `labelProximity` | Label proximity heuristic |
| `headingLevel` | Heading hierarchy checks |
| `placeholder` | Placeholder-as-label detection |
| `event` | Event handler accessibility |

**WCAG 2.0 coverage**: 61 Success Criteria mapped across Principles 1–4.

**Standards supported**:
- WCAG 2.0 (via `guidelines/wcag.json` and `wcag2.json`)
- Section 508 (via `guidelines/508.json`)

### Invocation Workflow (CKEditor 4)

1. Editor loads `plugins/a11ychecker/plugin.js` (178 KB minified bundle).
2. Plugin registers a toolbar button that triggers accessibility checking.
3. On activation, the plugin passes the editor's content DOM to Quail via jQuery.
4. Quail fetches `tests.json` / `wcag2.json` via XHR (or uses preloaded data).
5. Quail scans the DOM against its 264 rules.
6. Results are returned with per-element findings at `suggestion`, `moderate`, or `severe` severity.
7. The a11ychecker UI presents issues with quick-fix options for common problems.
8. Quick-fix modules in `plugins/a11ychecker/quickfix/en/` provide English-language remediation actions.

### Known Limitations of Quail.js in This Project

- **Archived upstream**: The Quail.js project (https://github.com/quailjs/quail) is effectively unmaintained.
- **jQuery dependency**: Requires jQuery 1.x, which is a significant legacy dependency.
- **XHR-only resource loading**: Cannot run on `file://` URLs.
- **WCAG 2.0 only**: Maps to WCAG 2.0, not WCAG 2.1 or 2.2.
- **No axe-core rules**: Quail does not include modern axe-core rule coverage (e.g., color contrast via APCA, ARIA best practices from 2020+).
- **Browser support quirks**: No support for IE8 or IE9 Quirks Mode.

---

## CKEditor 5 Migration: axe-core Engine

The CKEditor 5 A11yFirst implementation does **not use Quail.js**. It uses **axe-core v4.11.1** for automated accessibility scanning.

### Engine Details

| Property | Value |
|----------|-------|
| Engine | axe-core |
| Version | 4.11.1 |
| Source | CDN: `https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.11.1/axe.min.js` |
| Local fallback | `docs/assets/vendor/axe-core/axe.min.js` |
| Maintainer | Deque Systems |
| Repository | https://github.com/dequelabs/axe-core |
| Standards | WCAG 2.0, 2.1, 2.2 (A and AA) |

### Integration Points

- **Demo 3** (Image-Focused): Runs axe-core rules on image elements.
- **Demo 9** (A11y Checker Summary): Aggregates axe-core findings with A11yFirst validator findings.
- **Plugin API**: Findings from axe-core are registered via `window.A11yFirst.ValidationRegistry.setFindings('axe', findings)`.

### axe-core vs. Quail.js Comparison

| Dimension | Quail.js (CKEditor 4) | axe-core (CKEditor 5) |
|-----------|----------------------|----------------------|
| WCAG version | WCAG 2.0 only | WCAG 2.0, 2.1, 2.2 |
| Rule count | 264 | 100+ (focused, high signal) |
| jQuery dependency | Required | None |
| Local filesystem | Not supported | Supported |
| Maintenance status | Archived (2014–2016) | Actively maintained |
| NPM availability | No | Yes (`axe-core`) |
| Standards | WCAG + Section 508 | WCAG + best practices |

---

## Parity Target

For the CKEditor 5 A11yFirst A11yChecker module (WP07), the following behaviors from the CKEditor 4 Quail-based checker must be preserved or explicitly superseded:

| CKEditor 4 Behavior | Parity Target |
|---------------------|---------------|
| Per-element issue highlighting | Preserve |
| `severe` / `moderate` / `suggestion` severity tiers | Preserve (map from axe-core impact: `critical`→`severe`, `serious`→`moderate`, `moderate`→`suggestion`, `minor`→`suggestion`) |
| Quick-fix actions for common issues | Preserve for image alt, link text, heading structure |
| WCAG 2.0 criterion references in issue messages | Supersede with WCAG 2.2 references |
| In-editor UI panel with issue list | Preserve |
| Scan-on-demand trigger | Preserve (do not run continuously in background) |
| Section 508 coverage | Advisory: document any gaps vs. axe-core's 508 coverage |

---

## References

- Quail.js repository: https://github.com/quailjs/quail
- axe-core repository: https://github.com/dequelabs/axe-core
- axe-core API docs: https://github.com/dequelabs/axe-core/blob/develop/doc/API.md
- Original distribution issue: https://github.com/a11yfirst/distribution/issues/3
- WP07 work package: `kitty-specs/001-a11yfirst-functional-parity-specification/tasks/WP07-accessibility-checker-parity.md`
