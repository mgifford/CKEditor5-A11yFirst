---
work_package_id: "WP06"
subtasks:
  - "T032"
  - "T033"
  - "T034"
  - "T035"
  - "T036"
  - "T037"
  - "T038"
title: "Link Module Accessibility Parity"
phase: "Phase 3 - Feature Parity"
lane: "planned"
dependencies:
  - "WP03"
  - "WP04"
requirement_refs:
  - "FR-012"
  - "FR-013"
  - "FR-014"
  - "FR-015"
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

# Work Package Prompt: WP06 - Link Module Accessibility Parity

## Implementation Command
- `spec-kitty implement WP06 --base WP03`

## Objectives and Success Criteria

- Reproduce `a11ylink` behavior parity for display-text validation and related confirm flows.
- Preserve anchor/link editing workflows and help/fallback behavior.
- Deliver comprehensive output-equivalence and UI regression coverage.

Success criteria:
- Non-empty display-text and invalid phrase checks match baseline behavior.
- URL/email/anchor comparison confirmations behave equivalently.
- Link and anchor output semantics are equivalent under parity tests.

## Context and Constraints

- Depends on shared heading/toolbar and help infrastructure from WP03/WP04.
- Must preserve existing user guidance behavior and confirm prompts.
- Keep implementation under `migration/ckeditor5/a11yfirst/src/modules/link/`.

## Subtasks and Detailed Guidance

### Subtask T032 - Implement link dialog display-text behavior and normalization
- Purpose: Preserve baseline text handling and validation setup.
- Steps:
  1. Build dialog model for link type, display text, URL/email/anchor fields.
  2. Implement display-text normalization behavior consistent with baseline checks.
  3. Preserve setup behavior when selected text exists.
- Files:
  - `migration/ckeditor5/a11yfirst/src/modules/link/linkDialogModel.ts`
  - `migration/ckeditor5/a11yfirst/src/modules/link/textNormalization.ts`
- Parallel: No.
- Notes: Keep normalization deterministic for fixture expectations.

### Subtask T033 - Implement invalid display text and invalid-prefix checks
- Purpose: Preserve prohibited phrase behavior.
- Steps:
  1. Add invalid phrase list checks for exact-match terms.
  2. Add invalid-start phrase checks.
  3. Route outcomes through severity abstraction.
- Files:
  - `migration/ckeditor5/a11yfirst/src/modules/link/displayTextRules.ts`
- Parallel: No.
- Notes: Maintain localized message insertion points.

### Subtask T034 - Implement URL/email/anchor confirm flows and edge handling
- Purpose: Preserve confirmation behavior for weak display-text choices.
- Steps:
  1. Confirm when display text equals URL for URL links.
  2. Confirm when display text equals email for email links.
  3. Confirm/alert for anchor-related edge cases including no anchors.
- Files:
  - `migration/ckeditor5/a11yfirst/src/modules/link/confirmFlows.ts`
- Parallel: No.
- Notes: Include no-anchor behavior parity without preventing insertion.

### Subtask T035 - Integrate link help invocation and fallback path
- Purpose: Preserve help behavior in link dialog.
- Steps:
  1. Wire link help button action to help launcher (`LinkHelp`).
  2. Add fallback messaging when help unavailable.
  3. Ensure behavior is tested through shared fallback path.
- Files:
  - `migration/ckeditor5/a11yfirst/src/modules/link/linkHelpIntegration.ts`
- Parallel: Yes.
- Notes: Keep topic key and invocation semantics consistent with WP04.

### Subtask T036 - Implement anchor/edit/unlink behavior and shortcut parity
- Purpose: Preserve editing and command ergonomics from current behavior.
- Steps:
  1. Implement anchor, link, and unlink command interactions.
  2. Preserve dialog selection/edit behavior for existing links/anchors.
  3. Implement shortcut behavior equivalent to current command mapping.
- Files:
  - `migration/ckeditor5/a11yfirst/src/modules/link/linkCommands.ts`
  - `migration/ckeditor5/a11yfirst/src/modules/link/anchorCommands.ts`
- Parallel: No.
- Notes: Keep command lifecycle testable in integration suite.

### Subtask T037 - Implement content-output equivalence tests for links and anchors
- Purpose: Guarantee serialized content parity for link-related structures.
- Steps:
  1. Create fixture corpus for URL/email/anchor link outputs.
  2. Compare module output with baseline-normalized expectations.
  3. Include edge cases with missing anchors and edited existing links.
- Files:
  - `migration/ckeditor5/a11yfirst/tests/parity/link-output/*.test.ts`
  - `migration/ckeditor5/a11yfirst/tests/parity/fixtures/link/**`
- Parallel: Yes.
- Notes: Normalize irrelevant ordering or attribute noise before assertions.

### Subtask T038 - Implement UI regression tests for link flows
- Purpose: Lock interactive parity behavior.
- Steps:
  1. Add interaction tests for all link types and display-text validations.
  2. Assert warning/confirm/alert flows and helper text behavior.
  3. Include help invocation and fallback scenarios.
- Files:
  - `migration/ckeditor5/a11yfirst/tests/integration/link/*.test.ts`
  - `migration/ckeditor5/a11yfirst/tests/parity/link-ui/*.test.ts`
- Parallel: Yes.
- Notes: Ensure test determinism for confirm dialogs.

## Test Strategy

- Required:
  - rule-level unit tests;
  - command/dialog integration tests;
  - parity output and UI tests with scenario IDs.
- Module gate remains locked until all checks pass.

## Risks and Mitigations

- Risk: subtle string normalization differences alter validation outcomes.  
  Mitigation: centralize normalization helper and verify with unit fixtures.
- Risk: anchor workflow regressions in edit paths.  
  Mitigation: integration tests for create/edit/remove sequences.

## Review Guidance

- Verify all link-related FR coverage (FR-012 through FR-016).
- Verify no suppression of baseline confirmations/alerts.
- Verify no accidental UX expansion beyond current behavior.

## Activity Log

- 2026-03-03T21:56:00Z - system - lane=planned - Prompt created.
