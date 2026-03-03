---
work_package_id: WP07
title: Accessibility Checker Parity
lane: planned
dependencies:
- WP02
- WP01
subtasks:
- T039
- T040
- T041
- T042
- T043
- T044
- T045
phase: Phase 3 - Feature Parity
assignee: ''
agent: ''
shell_pid: ''
review_status: ''
reviewed_by: ''
history:
- timestamp: '2026-03-03T21:56:00Z'
  lane: planned
  agent: system
  shell_pid: ''
  action: Prompt generated via /spec-kitty.tasks
requirement_refs:
- FR-025
- FR-026
- FR-024
---

# Work Package Prompt: WP07 - Accessibility Checker Parity

## Implementation Command
- `spec-kitty implement WP07 --base WP02`

## Objectives and Success Criteria

- Implement first-class `a11ychecker` parity as part of consolidated package.
- Preserve checker issue-category behavior and guidance flow differences relevant to A11yFirst runtime.
- Integrate checker into module-level feature flags and parity gates.

Success criteria:
- Checker behavior inventory is explicit and reconciled to parity scenarios.
- Checker adapter produces expected issue categories/guidance outputs.
- Checker module passes automated regression and parity tests.

## Context and Constraints

- Checker is explicitly in scope per clarifications and FR-025/FR-026.
- Use WP01 baseline policy and WP02 shared core to avoid parallel abstractions.
- Do not collapse checker into generic dependency handling; treat as standalone module.

## Subtasks and Detailed Guidance

### Subtask T039 - Inventory checker rule-set and workflow differences
- Purpose: Build parity target for checker behavior.
- Steps:
  1. Document current checker invocation workflow in CKEditor4 context.
  2. Identify rule/category outputs expected in A11yFirst usage.
  3. Record differences versus stock assumptions where observable.
- Files:
  - `kitty-specs/001-a11yfirst-functional-parity-specification/research/checker-inventory.md`
- Parallel: No.
- Notes: Focus on behavior and outputs, not internal third-party implementation details.

### Subtask T040 - Implement checker adapter module
- Purpose: Create checker module entry point in consolidated package.
- Steps:
  1. Define checker module contract and lifecycle hooks.
  2. Implement invocation adapter into parity framework.
  3. Wire adapter into module registry and feature flags.
- Files:
  - `migration/ckeditor5/a11yfirst/src/modules/checker/checkerModule.ts`
  - `migration/ckeditor5/a11yfirst/src/modules/checker/checkerAdapter.ts`
- Parallel: No.
- Notes: Keep adapter boundaries explicit for future rule updates.

### Subtask T041 - Implement issue category and guidance-message mapping
- Purpose: Preserve user-facing checker output parity.
- Steps:
  1. Define category mapping tables.
  2. Map checker findings to guidance messages and severity.
  3. Validate mappings against baseline inventory.
- Files:
  - `migration/ckeditor5/a11yfirst/src/modules/checker/checkerMappings.ts`
  - `migration/ckeditor5/a11yfirst/src/modules/checker/checkerMessages.ts`
- Parallel: No.
- Notes: Keep mappings data-driven for testability.

### Subtask T042 - Implement checker run lifecycle and result presentation parity
- Purpose: Match run-trigger, progress, and result interaction behavior.
- Steps:
  1. Implement run initiation and completion lifecycle states.
  2. Implement result container behavior and state transitions.
  3. Integrate with shared guidance abstraction as needed.
- Files:
  - `migration/ckeditor5/a11yfirst/src/modules/checker/checkerLifecycle.ts`
  - `migration/ckeditor5/a11yfirst/src/modules/checker/checkerView.ts`
- Parallel: No.
- Notes: Ensure lifecycle states are observable for parity-run orchestration.

### Subtask T043 - Create checker fixtures and discrepancy log hooks
- Purpose: Make checker parity verifiable and auditable.
- Steps:
  1. Build fixture corpus for representative checker findings.
  2. Add discrepancy log hook integration for runtime mismatches.
  3. Map fixture expectations to scenario IDs.
- Files:
  - `migration/ckeditor5/a11yfirst/tests/parity/fixtures/checker/**`
  - `kitty-specs/001-a11yfirst-functional-parity-specification/research/baseline-conflicts.md`
- Parallel: Yes.
- Notes: Reuse WP01 conflict-log structure.

### Subtask T044 - Implement checker automated parity/regression tests
- Purpose: Lock checker behavior before rollout.
- Steps:
  1. Add unit tests for mapping logic.
  2. Add integration tests for run lifecycle.
  3. Add parity tests against checker fixtures.
- Files:
  - `migration/ckeditor5/a11yfirst/tests/unit/checker/*.test.ts`
  - `migration/ckeditor5/a11yfirst/tests/integration/checker/*.test.ts`
  - `migration/ckeditor5/a11yfirst/tests/parity/checker/*.test.ts`
- Parallel: No.
- Notes: Include negative test for mismatch detection.

### Subtask T045 - Integrate checker flag gate controls
- Purpose: Ensure phased rollout policy enforcement for checker module.
- Steps:
  1. Register checker gate requirements.
  2. Require parity evidence before enabling checker flag.
  3. Add rollback support hook.
- Files:
  - `migration/ckeditor5/a11yfirst/src/flags/featureFlags.ts`
  - `migration/ckeditor5/a11yfirst/src/modules/checker/checkerGate.ts`
- Parallel: No.
- Notes: Align with API contract and WP08 orchestration logic.

## Test Strategy

- Required tests:
  - unit tests for mapping and severity;
  - integration tests for run lifecycle and result presentation;
  - parity tests against fixture corpus.
- Gate remains locked until all test categories pass.

## Risks and Mitigations

- Risk: checker behavior may depend on environment specifics.  
  Mitigation: isolate adapter behavior and fixture expected outputs.
- Risk: category drift over time.  
  Mitigation: data-driven mapping and regression snapshot checks.

## Review Guidance

- Verify checker is implemented as first-class module.
- Verify mappings and lifecycle behavior are parity-tested.
- Verify gate controls prevent premature flag activation.

## Activity Log

- 2026-03-03T21:56:00Z - system - lane=planned - Prompt created.
