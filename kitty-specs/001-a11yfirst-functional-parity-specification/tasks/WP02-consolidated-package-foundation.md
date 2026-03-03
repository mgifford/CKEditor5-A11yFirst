---
work_package_id: "WP02"
subtasks:
  - "T007"
  - "T008"
  - "T009"
  - "T010"
  - "T011"
  - "T012"
title: "Consolidated Package Foundation"
phase: "Phase 1 - Foundation"
lane: "planned"
dependencies:
  - "WP01"
requirement_refs:
  - "FR-002"
  - "FR-003"
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

# Work Package Prompt: WP02 - Consolidated Package Foundation

## Implementation Command
- `spec-kitty implement WP02 --base WP01`

## Objectives and Success Criteria

- Stand up the CKEditor5 `a11yfirst` package skeleton in `migration/ckeditor5/a11yfirst/`.
- Provide shared infrastructure used by all module work packages.
- Enable local and CI execution of parity-oriented test pipelines.

Success criteria:
- Package builds successfully and exposes module registration hooks.
- Feature flags can enable/disable module stubs.
- Test harness folders and scripts execute with green bootstrap checks.

## Context and Constraints

- Depends on baseline taxonomy from WP01.
- Use plan structure defined in `kitty-specs/001-a11yfirst-functional-parity-specification/plan.md`.
- Do not implement module-specific parity logic here; focus on shared core.

## Subtasks and Detailed Guidance

### Subtask T007 - Create package structure and build configuration
- Purpose: Establish the physical project foundation.
- Steps:
  1. Create target directory tree under `migration/ckeditor5/a11yfirst/`.
  2. Add package manifest, build scripts, and ts/js compiler config.
  3. Add standard entry points for module loading.
- Files:
  - `migration/ckeditor5/a11yfirst/package.json`
  - `migration/ckeditor5/a11yfirst/tsconfig.json`
  - `migration/ckeditor5/a11yfirst/src/index.ts`
- Parallel: No.
- Notes: Keep structure modular and explicit; avoid hidden side-effect imports.

### Subtask T008 - Implement shared module registry and component-factory skeleton
- Purpose: Create module plug-in points for heading/image/link/help/styles/checker/toolbar_state.
- Steps:
  1. Define module interface contract.
  2. Implement module registry with lifecycle hooks.
  3. Wire component-factory placeholders for each module.
- Files:
  - `migration/ckeditor5/a11yfirst/src/core/moduleRegistry.ts`
  - `migration/ckeditor5/a11yfirst/src/core/componentFactory.ts`
- Parallel: No.
- Notes: This API should remain stable throughout module WPs.

### Subtask T009 - Implement feature-flag configuration layer and runtime toggles
- Purpose: Support phased rollout by module.
- Steps:
  1. Define flag schema keyed by module.
  2. Implement load/override path for environment and test contexts.
  3. Add runtime helper for module enable checks.
- Files:
  - `migration/ckeditor5/a11yfirst/src/flags/featureFlags.ts`
  - `migration/ckeditor5/a11yfirst/src/flags/flagRuntime.ts`
- Parallel: Yes.
- Notes: Include deterministic defaults for test runs.

### Subtask T010 - Implement shared guidance/message abstraction
- Purpose: Normalize user guidance types (`block`, `warn`, `confirm`, `info`) across modules.
- Steps:
  1. Define message contract and severity enum.
  2. Implement adapters for modal/inline presentation.
  3. Add helper used by module validation logic.
- Files:
  - `migration/ckeditor5/a11yfirst/src/core/guidance.ts`
  - `migration/ckeditor5/a11yfirst/src/core/messagePresenter.ts`
- Parallel: No.
- Notes: Align semantics with CKEditor4 behavior, not necessarily UI styling.

### Subtask T011 - Scaffold test harness directories and bootstrap utilities
- Purpose: Provide test execution framework for all parity WPs.
- Steps:
  1. Create `tests/unit`, `tests/integration`, `tests/parity` directories.
  2. Add shared fixtures loader and scenario ID resolver.
  3. Add smoke tests validating harness operation.
- Files:
  - `migration/ckeditor5/a11yfirst/tests/**`
- Parallel: Yes.
- Notes: Scenario IDs must map to WP01 catalog.

### Subtask T012 - Add CI/local scripts for parity suite execution
- Purpose: Ensure uniform run commands locally and in CI.
- Steps:
  1. Add script commands for unit/integration/parity suites.
  2. Add aggregated regression command.
  3. Document expected output and failure handling.
- Files:
  - `migration/ckeditor5/a11yfirst/package.json`
  - `migration/ckeditor5/a11yfirst/README.md`
  - CI workflow/config path as appropriate
- Parallel: No.
- Notes: Include non-zero exit behavior for failed parity suites.

## Test Strategy

- Execute bootstrap tests only (no module parity tests yet):
  - registry loads all module stubs;
  - flags toggle modules deterministically;
  - guidance layer supports all severities;
  - test harness and scripts run end-to-end.

## Risks and Mitigations

- Risk: Foundation API churn causes downstream WP rework.  
  Mitigation: Freeze core contracts in this WP and document them.
- Risk: CI command fragmentation.  
  Mitigation: Provide one canonical aggregate regression command.

## Review Guidance

- Verify this WP does not include feature-specific parity implementations.
- Verify all future module WPs can start without changing folder topology.
- Verify scripts and harness align with parity depth requirement from planning.

## Activity Log

- 2026-03-03T21:56:00Z - system - lane=planned - Prompt created.
