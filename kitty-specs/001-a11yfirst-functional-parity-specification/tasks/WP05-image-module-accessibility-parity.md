---
work_package_id: "WP05"
subtasks:
  - "T025"
  - "T026"
  - "T027"
  - "T028"
  - "T029"
  - "T030"
  - "T031"
title: "Image Module Accessibility Parity"
phase: "Phase 3 - Feature Parity"
lane: "planned"
dependencies:
  - "WP03"
  - "WP04"
requirement_refs:
  - "FR-007"
  - "FR-008"
  - "FR-009"
  - "FR-010"
  - "FR-011"
  - "FR-016"
  - "FR-024"
assignee: ""
agent: ""
shell_pid: ""
review_status: ""
reviewed_by: ""
history:
  - timestamp: "2026-03-03T21:56:00Z"
    lane: "planned"
    agent: "system"
    shell_pid: ""
    action: "Prompt generated via /spec-kitty.tasks"
---

# Work Package Prompt: WP05 - Image Module Accessibility Parity

## Implementation Command
- `spec-kitty implement WP05 --base WP03`

## Objectives and Success Criteria

- Reproduce all `a11yimage` accessibility guidance behaviors in CKEditor5 module form.
- Preserve alt-text validations, decorative exception interactions, long-description semantics, and help linkage.
- Ship module with deterministic parity tests for both UI and content output.

Success criteria:
- Alt-text validation path parity for empty, too-long, invalid phrase, filename, and confirmation branches.
- Decorative-flow behavior parity when checkbox and alt text interact.
- Output equivalence for image markup and long-description semantics.

## Context and Constraints

- Depends on heading/toolbar context from WP03 and help integration from WP04.
- Preserve behavior-driven semantics; avoid introducing stricter or looser validation than baseline.
- Keep module implementation under `migration/ckeditor5/a11yfirst/src/modules/image/`.

## Subtasks and Detailed Guidance

### Subtask T025 - Implement image dialog model and field interactions
- Purpose: Create parity-aligned image dialog behavior surface.
- Steps:
  1. Build dialog state model for src, alt, long-description, caption, and decorative fields.
  2. Implement field interactivity behavior (enable/disable/focus flow).
  3. Ensure model supports existing baseline branches.
- Files:
  - `migration/ckeditor5/a11yfirst/src/modules/image/imageDialogModel.ts`
  - `migration/ckeditor5/a11yfirst/src/modules/image/imageDialogView.ts`
- Parallel: No.
- Notes: Keep field interactions deterministic for regression testing.

### Subtask T026 - Implement alternative-text validation rules and severity mapping
- Purpose: Preserve validation semantics and guidance severities.
- Steps:
  1. Implement required/empty checks and max-length warning behavior.
  2. Implement invalid phrase/pattern checks (including filename and prefix rules).
  3. Map each outcome to block/warn/confirm semantics.
- Files:
  - `migration/ckeditor5/a11yfirst/src/modules/image/altValidation.ts`
  - `migration/ckeditor5/a11yfirst/src/modules/image/altValidationRules.ts`
- Parallel: No.
- Notes: Use configurable rule constants to mirror baseline localization/message behavior.

### Subtask T027 - Implement decorative exception and alt-removal behavior
- Purpose: Recreate checkbox-driven decorative behavior and confirmation prompts.
- Steps:
  1. Implement decorative toggle behavior with alt field interaction.
  2. Implement confirmation flows for text removal and exception acceptance.
  3. Ensure commit behavior writes expected alt output.
- Files:
  - `migration/ckeditor5/a11yfirst/src/modules/image/decorativeFlow.ts`
- Parallel: No.
- Notes: Cover edge path where checkbox is selected while alt is present.

### Subtask T028 - Implement long-description location and caption semantics
- Purpose: Preserve output semantics for long description metadata and caption option.
- Steps:
  1. Implement location options (`nodesc`, `before`, `after`, `both`).
  2. Ensure long-description context is represented in output semantics equivalent to baseline.
  3. Implement optional caption behavior with expected figure/figcaption semantics.
- Files:
  - `migration/ckeditor5/a11yfirst/src/modules/image/longDescription.ts`
  - `migration/ckeditor5/a11yfirst/src/modules/image/captionBehavior.ts`
- Parallel: No.
- Notes: Validate informative and decorative branches separately.

### Subtask T029 - Integrate image help invocation and fallback behavior
- Purpose: Connect image module to shared help system.
- Steps:
  1. Wire image help action to topic invocation.
  2. Ensure fallback behavior routes through WP04 shared helper when unavailable.
  3. Add scenario mapping IDs for help path and fallback path.
- Files:
  - `migration/ckeditor5/a11yfirst/src/modules/image/imageHelpIntegration.ts`
- Parallel: Yes.
- Notes: Use `ImageHelp` topic key parity.

### Subtask T030 - Implement content-output equivalence tests for image semantics
- Purpose: Guarantee output parity for generated content.
- Steps:
  1. Add fixture-based expected outputs for common and edge image flows.
  2. Compare generated output against baseline-normalized expectations.
  3. Include long-description and caption branches.
- Files:
  - `migration/ckeditor5/a11yfirst/tests/parity/image-output/*.test.ts`
  - `migration/ckeditor5/a11yfirst/tests/parity/fixtures/image/**`
- Parallel: Yes.
- Notes: Normalize non-semantic ordering differences before asserting.

### Subtask T031 - Implement UI regression tests for image dialog paths
- Purpose: Lock user interaction parity.
- Steps:
  1. Add interaction tests for alt/decorative/long-desc controls.
  2. Assert warning/confirm/block path behavior.
  3. Validate help and fallback interactions.
- Files:
  - `migration/ckeditor5/a11yfirst/tests/integration/image/*.test.ts`
  - `migration/ckeditor5/a11yfirst/tests/parity/image-ui/*.test.ts`
- Parallel: Yes.
- Notes: Ensure stable selectors and deterministic prompts in tests.

## Test Strategy

- Required:
  - unit tests for validation logic;
  - integration tests for dialog interactions;
  - parity tests for UI outcomes and output equivalence.
- Gate condition: all three layers pass before module flag eligibility.

## Risks and Mitigations

- Risk: High branch complexity in image flows introduces regressions.  
  Mitigation: Scenario-driven tests for every major branch and edge case.
- Risk: Output parity false positives due to serialization differences.  
  Mitigation: Semantic normalization in parity assertion helpers.

## Review Guidance

- Verify alignment with all image-related FRs (FR-007 through FR-011, FR-016).
- Verify no behavior drift in confirmation messages and branching logic.
- Verify fixture coverage includes decorative and informative image paths.

## Activity Log

- 2026-03-03T21:56:00Z - system - lane=planned - Prompt created.
