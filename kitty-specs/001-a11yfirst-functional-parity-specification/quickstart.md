# Quickstart: A11yFirst CKEditor5 Parity Planning to Execution

## 1) Confirm feature context

- Active feature directory: `kitty-specs/001-a11yfirst-functional-parity-specification/`
- Source specification: `kitty-specs/001-a11yfirst-functional-parity-specification/spec.md`
- Plan artifact: `kitty-specs/001-a11yfirst-functional-parity-specification/plan.md`

## 2) Capture baseline behavior fixtures

1. Run local repository demos from `custom/a11yfirst.html` and `custom/index.html`.
2. Exercise hosted baseline pages under `https://a11yfirst.gitlab.io/`.
3. For each in-scope module, capture:
   - UI interaction behavior
   - Dialog warnings, blocks, and confirmations
   - Resulting content output
4. If hosted and local behavior differ, record conflict and mark local repository runtime as canonical.

## 3) Prepare CKEditor5 implementation workspace (next command)

- Use `/spec-kitty.implement` per work package once `/spec-kitty.tasks` has generated WPs.
- Implement consolidated package with modules:
  - heading
  - image
  - link
  - help
  - styles
  - checker
  - shared toolbar/state core

## 4) Enforce feature-flag rollout gates

Before enabling each module flag, require all of:

- UI parity checks pass
- content output equivalence checks pass
- automated regression suite passes

## 5) Validate documentation traceability

- Ensure each module behavior maps to at least one source doc or marked gap.
- Maintain mismatch log for runtime-vs-documentation differences without changing runtime parity target.

## 6) Suggested execution order

1. heading + toolbar/state
2. styles + help
3. image
4. link
5. checker

## 7) Definition of ready-for-cutover per module

- Module implementation complete
- All parity test categories passed
- Flag moved from `flagged_off` to `flagged_on_canary`
- No unresolved blocker defects for module scope
