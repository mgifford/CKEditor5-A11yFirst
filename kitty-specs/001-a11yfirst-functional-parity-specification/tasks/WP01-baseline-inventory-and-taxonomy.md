---
work_package_id: "WP01"
subtasks:
  - "T001"
  - "T002"
  - "T003"
  - "T004"
  - "T005"
  - "T006"
title: "Baseline Inventory and Parity Taxonomy"
phase: "Phase 0 - Discovery and Baseline"
lane: "planned"
dependencies: []
requirement_refs:
  - "FR-001"
  - "FR-002"
  - "FR-003"
  - "FR-022"
  - "FR-027"
  - "FR-028"
  - "FR-029"
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

# Work Package Prompt: WP01 - Baseline Inventory and Parity Taxonomy

## Implementation Command
- `spec-kitty implement WP01`

## Objectives and Success Criteria

- Establish the migration baseline across local and hosted runtimes before any CKEditor5 implementation starts.
- Define canonical capability taxonomy and scenario IDs for every in-scope behavior, including `a11ychecker`.
- Produce reusable baseline artifacts that downstream WPs can reference without re-discovery.

Success criteria:
- All six feature modules plus toolbar/state have scenario IDs and baseline expectations.
- Documentation mapping skeleton exists with explicit gap markers.
- Conflict policy between hosted and local runtime is documented and references local-runtime authority.

## Context and Constraints

- Source spec: `kitty-specs/001-a11yfirst-functional-parity-specification/spec.md`
- Plan and model: `kitty-specs/001-a11yfirst-functional-parity-specification/plan.md`, `data-model.md`
- Runtime policy: local repository runtime wins on hosted/local conflicts.
- Do not change product behavior in this WP; discovery and artifact generation only.

## Subtasks and Detailed Guidance

### Subtask T001 - Inventory repository-local runtime entry points and configuration surfaces
- Purpose: Identify all local runtime surfaces that define behavior parity.
- Steps:
  1. Enumerate local demo and test entry points under `custom/` and plugin directories.
  2. Record config authorities (`custom/config.js`, plugin defaults, language files, dialog definitions).
  3. Produce a baseline inventory document in `kitty-specs/001-a11yfirst-functional-parity-specification/research/local-runtime-inventory.md`.
- Files:
  - `custom/config.js`
  - `custom/a11yfirst.html`
  - `custom/index.html`
  - `plugins/a11y*/**`
- Parallel: No.
- Notes: Include a section explicitly listing non-A11yFirst CKEditor4 features excluded from parity scope.

### Subtask T002 - Capture hosted runtime baseline fixtures and define conflict-log shape
- Purpose: Capture hosted behavior from `https://a11yfirst.gitlab.io/` as comparison baseline.
- Steps:
  1. Capture hosted page behavior for linked demo/test pages.
  2. Record observed capability-level outcomes and UI/dialog specifics.
  3. Define conflict log schema with fields: scenario_id, hosted_result, local_result, resolution.
- Files:
  - `kitty-specs/001-a11yfirst-functional-parity-specification/research/hosted-runtime-baseline.md`
  - `kitty-specs/001-a11yfirst-functional-parity-specification/research/baseline-conflicts.md`
- Parallel: Yes.
- Notes: Use plain-text evidence summaries, not screenshots, unless required by reviewers.

### Subtask T003 - Define canonical capability taxonomy for consolidated package modules
- Purpose: Normalize all current functionality into module boundaries for migration.
- Steps:
  1. Map CKEditor4 plugin behavior to module keys: heading, image, link, help, styles, checker, toolbar_state.
  2. Define module responsibilities and boundaries.
  3. Record each module's parity acceptance surface.
- Files:
  - `kitty-specs/001-a11yfirst-functional-parity-specification/research/module-taxonomy.md`
- Parallel: No.
- Notes: Ensure taxonomy references runtime behavior rather than implementation internals.

### Subtask T004 - Build behavior-rule extraction checklist with severity classification
- Purpose: Standardize extraction of rules as block/warn/confirm/info.
- Steps:
  1. Create a checklist template for rule extraction from plugin logic.
  2. Include trigger context, expected outcome, and severity type.
  3. Add a verifier checklist for runtime-vs-doc mismatch handling.
- Files:
  - `kitty-specs/001-a11yfirst-functional-parity-specification/research/behavior-rule-checklist.md`
- Parallel: Yes.
- Notes: This checklist is reused by module implementation WPs and review.

### Subtask T005 - Create documentation mapping register and gap-tracking scaffold
- Purpose: Ensure every behavior has doc traceability or explicit gap label.
- Steps:
  1. Create mapping table skeleton by module and behavior rule.
  2. Include source categories: plugin_readme, help_content, custom_docs, public_site, archive_site.
  3. Add gap status definitions and reporting cadence.
- Files:
  - `kitty-specs/001-a11yfirst-functional-parity-specification/research/documentation-mapping-register.md`
- Parallel: Yes.
- Notes: This is required for SC-004 and SC-007 alignment.

### Subtask T006 - Define parity scenario catalog and stable scenario IDs
- Purpose: Give all downstream tests and reports a shared scenario key system.
- Steps:
  1. Create scenario namespace format (e.g., `IMG-ALT-EMPTY-001`).
  2. Add scenarios for each module and major edge case.
  3. Cross-reference each scenario to baseline observations and future tests.
- Files:
  - `kitty-specs/001-a11yfirst-functional-parity-specification/research/parity-scenarios.md`
- Parallel: No.
- Notes: Keep IDs stable; avoid renaming after WP02 unless unavoidable.

## Test Strategy

- Required validation in this WP is artifact integrity, not product test execution.
- Verify:
  - every in-scope module has at least one baseline scenario;
  - conflict log includes explicit local-wins policy field;
  - documentation register supports `covered`, `partial`, and `gap`.

## Risks and Mitigations

- Risk: Incomplete discovery causes downstream parity misses.  
  Mitigation: Reviewer checklist must assert scenario coverage by module before WP closure.
- Risk: Conflicting interpretations of baseline authority.  
  Mitigation: Include explicit policy statement in all baseline artifacts.

## Review Guidance

- Confirm no implementation code changes are introduced in this WP.
- Confirm that `a11ychecker` has full parity treatment in baseline artifacts.
- Confirm scenario IDs are reusable and consistent across documents.

## Activity Log

- 2026-03-03T21:56:00Z - system - lane=planned - Prompt created.
