---
work_package_id: "WP04"
subtasks:
  - "T019"
  - "T020"
  - "T021"
  - "T022"
  - "T023"
  - "T024"
title: "Styles and Help System Parity"
phase: "Phase 2 - Core Feature Parity"
lane: "planned"
dependencies:
  - "WP02"
requirement_refs:
  - "FR-016"
  - "FR-017"
  - "FR-018"
  - "FR-019"
  - "FR-022"
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

# Work Package Prompt: WP04 - Styles and Help System Parity

## Implementation Command
- `spec-kitty implement WP04 --base WP02`

## Objectives and Success Criteria

- Deliver parity for A11yFirst Character Style behavior and A11yFirst Help interactions.
- Ensure dependent modules can invoke help topics consistently with fallback behavior.
- Provide test coverage that stabilizes help/topic and styles behavior before image/link modules integrate.

Success criteria:
- Inline style apply/remove/help behavior matches baseline.
- Help topic menu, content routing, and fallback messaging match parity expectations.
- Tests pass for style and help modules across unit/integration/parity layers.

## Context and Constraints

- Depends on WP02 shared registry, flags, and guidance abstraction.
- Must support topic set and invocation paths required by `a11yheading`, `a11yimage`, and `a11ylink`.
- Keep topic-content and routing traceable to documentation mapping register.

## Subtasks and Detailed Guidance

### Subtask T019 - Implement inline styles module behavior
- Purpose: Recreate Character Style behavior and remove-styles operation.
- Steps:
  1. Implement style options for configured inline styles.
  2. Implement remove-styles command behavior.
  3. Preserve active-style state and menu label behavior semantics.
- Files:
  - `migration/ckeditor5/a11yfirst/src/modules/styles/stylesModule.ts`
  - `migration/ckeditor5/a11yfirst/src/modules/styles/styleCommands.ts`
- Parallel: No.
- Notes: Block-style options should not bleed into inline styles module.

### Subtask T020 - Implement shared help-launch integration API
- Purpose: Expose one integration path used by modules to launch help topics.
- Steps:
  1. Define help launcher interface in shared core.
  2. Add topic-select request contract.
  3. Wire launcher registration with module registry.
- Files:
  - `migration/ckeditor5/a11yfirst/src/modules/help/helpLauncher.ts`
  - `migration/ckeditor5/a11yfirst/src/core/moduleRegistry.ts`
- Parallel: No.
- Notes: Keep API stable for upcoming image/link module integrations.

### Subtask T021 - Implement help topic registry and content loader
- Purpose: Provide topic metadata and content rendering pipeline.
- Steps:
  1. Define topic keys and metadata objects.
  2. Implement content-loader adapter for static topic content.
  3. Implement navigation/state switching behavior.
- Files:
  - `migration/ckeditor5/a11yfirst/src/modules/help/topicRegistry.ts`
  - `migration/ckeditor5/a11yfirst/src/modules/help/contentLoader.ts`
  - `migration/ckeditor5/a11yfirst/src/modules/help/helpView.ts`
- Parallel: Yes.
- Notes: Include all required topic categories listed in spec FR-017.

### Subtask T022 - Implement no-help fallback messaging
- Purpose: Preserve behavior when help system is absent/unavailable.
- Steps:
  1. Define fallback message contract in guidance layer.
  2. Trigger fallback when launcher/content is unavailable.
  3. Ensure message text routes through localization-friendly path.
- Files:
  - `migration/ckeditor5/a11yfirst/src/modules/help/fallback.ts`
  - `migration/ckeditor5/a11yfirst/src/core/guidance.ts`
- Parallel: No.
- Notes: This behavior is reused by image/link modules and must be deterministic.

### Subtask T023 - Create styles/help fixtures and documentation mapping
- Purpose: Capture expected outcomes for style and help parity tests.
- Steps:
  1. Build fixture documents for style apply/remove and help topic navigation.
  2. Map each fixture to scenario IDs and documentation sources.
  3. Record uncovered docs as `gap` in mapping register.
- Files:
  - `migration/ckeditor5/a11yfirst/tests/parity/fixtures/styles/**`
  - `migration/ckeditor5/a11yfirst/tests/parity/fixtures/help/**`
  - `kitty-specs/001-a11yfirst-functional-parity-specification/research/documentation-mapping-register.md`
- Parallel: Yes.
- Notes: Keep fixture IDs consistent with WP01 scenario catalog.

### Subtask T024 - Implement automated tests for styles/help parity
- Purpose: Lock style/help behavior prior to downstream module integration.
- Steps:
  1. Unit tests for style command behavior and topic registry integrity.
  2. Integration tests for launcher/topic switching and fallback path.
  3. Parity tests for style output and help topic routing.
- Files:
  - `migration/ckeditor5/a11yfirst/tests/unit/styles/*.test.ts`
  - `migration/ckeditor5/a11yfirst/tests/unit/help/*.test.ts`
  - `migration/ckeditor5/a11yfirst/tests/integration/help/*.test.ts`
  - `migration/ckeditor5/a11yfirst/tests/parity/styles-help/*.test.ts`
- Parallel: No.
- Notes: Ensure tests assert behavior, not incidental layout details.

## Test Strategy

- Required checks:
  - style command unit tests;
  - help launcher + fallback integration tests;
  - parity fixture checks for style output and topic navigation.
- All checks are mandatory before closing this WP.

## Risks and Mitigations

- Risk: Topic-content loading differs by environment.  
  Mitigation: Use deterministic loader abstraction with fixture-backed checks.
- Risk: Fallback behavior inconsistent across callers.  
  Mitigation: Enforce shared fallback helper and shared tests.

## Review Guidance

- Verify every required help topic key is present and routed.
- Verify no-help fallback is triggered and test-covered.
- Verify style module excludes block-style semantics.

## Activity Log

- 2026-03-03T21:56:00Z - system - lane=planned - Prompt created.
