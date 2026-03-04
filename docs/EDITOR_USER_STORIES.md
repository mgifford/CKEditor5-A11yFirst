# CKEditor5 Demo User Stories

These stories define expected editor behavior for CI checks and manual verification.

## Story 1: Start in strict hierarchy mode
As an editor,
I want strict mode to start from heading level 2,
so I avoid introducing inappropriate H1 headings in body content.

Acceptance checks:
- Strict demo opens with H2+ content.
- No H1 appears after strict normalization.

## Story 2: Select only allowed heading levels
As an editor,
I want heading options to reflect a constrained hierarchy,
so skipped heading levels are not encouraged.

Acceptance checks:
- From H2: choices are H2/H3.
- From H3: choices are H2/H3/H4.
- From H4: choices are H2/H3/H4/H5.
- From H5/H6: choices are H2/H3/H4/H5/H6.

## Story 3: Preserve upward navigation
As an editor,
I want to move back to broader section headings,
so I can maintain a coherent table-of-contents structure.

Acceptance checks:
- Heading selector allows valid upward transitions per strict rules.
- Status text reflects currently allowed levels.

## Story 4: Normalize invalid pasted structure
As an editor,
I want invalid pasted heading structures normalized,
so content remains accessible by default.

Acceptance checks:
- Pasted/inserted H1 is rewritten to H2.
- Skipped levels are clamped to allowed progression.

## Story 5: Accessibility test guardrail
As a maintainer,
I want automated accessibility checks in CI,
so regressions are caught before deployment.

Acceptance checks:
- Playwright interaction tests pass.
- axe-based scan reports zero serious/critical violations on the demo page shell.
