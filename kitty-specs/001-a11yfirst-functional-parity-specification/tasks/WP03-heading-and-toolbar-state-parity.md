---
work_package_id: "WP03"
subtasks:
  - "T013"
  - "T014"
  - "T015"
  - "T016"
  - "T017"
  - "T018"
title: "Heading and Toolbar State Parity"
phase: "Phase 2 - Core Feature Parity"
lane: "planned"
dependencies:
  - "WP02"
requirement_refs:
  - "FR-004"
  - "FR-005"
  - "FR-006"
  - "FR-020"
  - "FR-021"
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

# Work Package Prompt: WP03 - Heading and Toolbar State Parity

## Implementation Command
- `spec-kitty implement WP03 --base WP02`

## Objectives and Success Criteria

- Reproduce `a11yheading` and toolbar/state behavior parity in CKEditor5 package.
- Preserve heading availability logic, configuration interpretation, and UI state semantics.
- Deliver automated parity tests that lock behavior before dependent modules proceed.

Success criteria:
- Allowed-heading behavior matches baseline scenarios for cursor context.
- `allow_only_one_h1` and `format_tags` behavior is equivalent.
- Toolbar and menu control states map to selected/disabled/expanded semantics.

## Context and Constraints

- Base on WP01 scenario catalog and WP02 shared infrastructure.
- Preserve behavior first; visual restyling is out of scope unless needed for parity semantics.
- Keep module isolated under `migration/ckeditor5/a11yfirst/src/modules/heading/` and shared state utilities in `src/core/`.

## Subtasks and Detailed Guidance

### Subtask T013 - Implement heading model/schema constraints
- Purpose: Define valid heading/format model and command constraints.
- Steps:
  1. Create heading module schema representation for heading and allowed format elements.
  2. Support configured heading/tag subset behavior.
  3. Ensure model can express both headings and paragraph-format options.
- Files:
  - `migration/ckeditor5/a11yfirst/src/modules/heading/schema.ts`
  - `migration/ckeditor5/a11yfirst/src/modules/heading/types.ts`
- Parallel: No.
- Notes: Maintain explicit distinction between heading and paragraph-format actions.

### Subtask T014 - Implement heading command/menu state algorithm
- Purpose: Match prior-heading-context logic for enabling/disabling levels.
- Steps:
  1. Implement traversal logic to identify prior heading relative to cursor position.
  2. Compute allowed heading list according to baseline algorithm.
  3. Expose command state for menu rendering.
- Files:
  - `migration/ckeditor5/a11yfirst/src/modules/heading/allowedHeadings.ts`
  - `migration/ckeditor5/a11yfirst/src/modules/heading/headingCommand.ts`
- Parallel: No.
- Notes: Include edge case when no prior heading exists and only-one-H1 is active.

### Subtask T015 - Implement `allow_only_one_h1` and `format_tags` interpretation
- Purpose: Preserve configuration-driven behavior rules.
- Steps:
  1. Parse semicolon-separated format tags.
  2. Apply no-gap interpretation for heading ranges.
  3. Enforce one-H1 policy behavior exactly.
- Files:
  - `migration/ckeditor5/a11yfirst/src/modules/heading/configParser.ts`
  - `migration/ckeditor5/a11yfirst/src/modules/heading/headingPolicy.ts`
- Parallel: Yes.
- Notes: Use deterministic parser tests for malformed and sparse configurations.

### Subtask T016 - Implement toolbar grouping and control-state parity
- Purpose: Reproduce toolbar/state behavior from A11yFirst organization.
- Steps:
  1. Define toolbar group mapping equivalent to A11yFirst layout semantics.
  2. Implement selected/disabled/expanded state transitions.
  3. Ensure accessibility attributes align with behavior semantics.
- Files:
  - `migration/ckeditor5/a11yfirst/src/modules/heading/headingToolbar.ts`
  - `migration/ckeditor5/a11yfirst/src/core/toolbarState.ts`
- Parallel: Yes.
- Notes: Keep aria-state behavior testable through state API if direct DOM parity is impractical.

### Subtask T017 - Create heading and toolbar parity fixtures
- Purpose: Build deterministic fixtures for scenario-based checks.
- Steps:
  1. Add fixture documents for heading hierarchies and edge states.
  2. Map fixtures to WP01 scenario IDs.
  3. Include expected allowed options/state snapshots.
- Files:
  - `migration/ckeditor5/a11yfirst/tests/parity/fixtures/heading/**`
- Parallel: No.
- Notes: Fixtures must cover no-previous-heading and existing-H1 edge conditions.

### Subtask T018 - Implement automated tests for heading and toolbar module
- Purpose: Lock behavior parity through repeatable regression checks.
- Steps:
  1. Add unit tests for config parsing and allowed-heading computation.
  2. Add integration tests for command-state transitions.
  3. Add parity tests against fixtures and expected snapshots.
- Files:
  - `migration/ckeditor5/a11yfirst/tests/unit/heading/*.test.ts`
  - `migration/ckeditor5/a11yfirst/tests/integration/heading/*.test.ts`
  - `migration/ckeditor5/a11yfirst/tests/parity/heading/*.test.ts`
- Parallel: No.
- Notes: All three test layers must pass before WP closure.

## Test Strategy

- Required tests:
  - Unit: parser/policy/algorithm behaviors.
  - Integration: command and toolbar state transitions.
  - Parity: fixture-driven equivalence for heading availability and control states.
- Required command (example): run aggregate regression and module-focused parity suite.

## Risks and Mitigations

- Risk: CKEditor5 model differences may alter heading traversal semantics.  
  Mitigation: Build adapter logic around scenario outcome rather than DOM assumption.
- Risk: Toolbar state parity ambiguity.  
  Mitigation: Define explicit expected state matrix in fixture docs.

## Review Guidance

- Verify behavior parity evidence for each heading scenario ID.
- Verify one-H1 policy behavior under both empty and populated documents.
- Verify tests fail when heading policy is intentionally broken (sanity check).

## Activity Log

- 2026-03-03T21:56:00Z - system - lane=planned - Prompt created.
