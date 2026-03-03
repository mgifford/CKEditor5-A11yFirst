# ACCESSIBILITY.md

## Purpose

This project prioritizes accessibility-first authoring for rich text editing and content workflows.

Our goal is to make the accessible path the default path, so authors can produce compliant content without extra effort.

## Scope

This document applies to:
- CKEditor 4 baseline behavior in this repository.
- CKEditor 5 migration work under `migration/ckeditor5/a11yfirst/`.
- Demo and publishing artifacts under `docs/`.

## Conformance Targets

- Authoring and UI behavior target **WCAG 2.2 AA** outcomes.
- Migration decisions preserve existing A11yFirst behavior unless explicitly approved.
- Accessibility defaults and guidance are aligned with **ATAG 2.0** principles.

References:
- WCAG 2.2: https://www.w3.org/TR/WCAG22/
- ATAG 2.0: https://www.w3.org/TR/ATAG20/

## Accessibility-First Defaults

The project follows these defaults:
- Do not expose heading levels that create skipped heading structures.
- Prefer restrictive, guidance-first validation for links and images.
- Keep assistive guidance actionable, concise, and visible at decision points.
- Ensure keyboard access for all authoring controls.
- Ensure state and error messaging is available to assistive technologies.

## Forms Accessibility Best Practices

All form-like interfaces in this project (dialogs, configuration panels, and CMS integration forms) should follow these requirements.

### 1. Labels and Instructions
- Every control must have a programmatically associated label.
- Placeholder text must not be the only label.
- Required fields must be indicated in text, not color alone.
- Provide short instructions before complex groups.

### 2. Grouping and Structure
- Use semantic grouping (`fieldset`/`legend`) for related controls when available.
- Keep visual grouping and semantic grouping aligned.
- Use clear headings for multi-section forms and dialogs.

### 3. Input Purpose and Behavior
- Use appropriate input types where possible.
- Use `autocomplete` tokens for common user data when appropriate.
- Do not block paste or common keyboard operations.

### 4. Validation and Errors
- Validate on submit at minimum; avoid disruptive validation loops.
- Error messages must be specific and actionable.
- Associate errors with fields programmatically.
- Set `aria-invalid="true"` on invalid controls when applicable.
- Do not rely on color alone to communicate errors.

### 5. Error Summary Pattern
For submissions with multiple errors:
- Show an error summary near the top.
- Move focus to that summary after failed submit.
- Link each summary item to the relevant input.

### 6. Status and Async Feedback
- Announce status updates for async checks and submissions.
- Use polite live regions for non-blocking updates.
- Use assertive announcements only for blocking failures.

### 7. Testing Expectations
Minimum checks for each form-related change:
- Complete workflow with keyboard only.
- Verify labels, instructions, required states, and errors with a screen reader.
- Verify focus movement after failed submit.
- Verify recovery path from each error is clear and navigable.

## Editor-Specific Heading Policy (Default)

For high-restriction mode defaults:
- Do not offer `H1` in typical CMS body content flows.
- Allow only adjacent heading transitions.
- Prevent skipped heading levels by default.
- Allow administrators to override defaults in settings when needed.

## Definition of Done (Accessibility)

A change is complete only when:
- Accessibility-first defaults are preserved or intentionally documented.
- Keyboard and assistive technology workflows are verified.
- Automated accessibility checks pass where defined.
- No unresolved blocking accessibility defects remain.

## Reporting Accessibility Issues

Please report issues in the repository issue tracker and include:
- The page/editor mode where the issue occurs.
- Steps to reproduce.
- Expected behavior.
- Assistive technology/browser details (if applicable).

## Related Project Artifacts

- Migration specification: `kitty-specs/001-a11yfirst-functional-parity-specification/spec.md`
- Implementation plan: `kitty-specs/001-a11yfirst-functional-parity-specification/plan.md`
- Work packages: `kitty-specs/001-a11yfirst-functional-parity-specification/tasks.md`
- Demo site: `docs/ckeditor5-a11yfirst.html`
- Constitution: `spec-kitty.constitution.md`

## Source Inspiration

This document is intentionally modeled after the ACCESSIBILITY.md project style and incorporates the forms guidance pattern from:
- https://mgifford.github.io/ACCESSIBILITY.md/
- https://github.com/mgifford/ACCESSIBILITY.md/blob/main/examples/FORMS_ACCESSIBILITY_BEST_PRACTICES.md
