# A11yFirst CKEditor5 Migration Package

This package hosts the CKEditor5 migration implementation for A11yFirst parity work.

## Current Scope
- WP03 heading and toolbar/state MVP scaffolding.
- WP07 accessibility checker parity — replaces Quail.js with axe-core.

## Checker Module (`src/modules/checker/`)

The checker module is the TypeScript implementation of the CKEditor 5 accessibility
checker, replacing the Quail.js engine used in the CKEditor 4 `plugins/a11ychecker/`
plugin.

| File | Purpose |
|------|---------|
| `types.ts` | `CheckerFinding`, `CheckerResult`, `AxeViolation` types |
| `checkerMappings.ts` | axe-core impact → A11yFirst severity mapping; WCAG ref table |
| `checkerAdapter.ts` | Converts `axe.run()` violations to `CheckerFinding[]` |
| `checkerModule.ts` | Custom A11yFirst rules + `buildCheckerResult` aggregation |
| `index.ts` | Re-exports all public symbols |

### Why axe-core instead of Quail.js?

| Dimension | Quail.js (CKEditor 4) | axe-core (CKEditor 5) |
|-----------|----------------------|-----------------------|
| WCAG coverage | 2.0 only | 2.0, 2.1, 2.2 |
| jQuery dependency | Required | None |
| Maintenance status | Archived (2014–2016) | Actively maintained |
| NPM | No | Yes (`axe-core`) |

## Local Commands
- `npm install`
- `npm run test`
- `npm run build`
