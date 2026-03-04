# Work Packages: A11yFirst Functional Parity Specification

**Inputs**: Design documents from `kitty-specs/001-a11yfirst-functional-parity-specification/`  
**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/parity-rollout-api.openapi.yaml`, `quickstart.md`, `research/ckeditor5-documentation-anchors.md`

**Tests**: Required for this feature. Every module requires UI parity checks, content-output equivalence checks, and automated regression checks before flag enablement.

**Organization**: Fine-grained subtasks (`Txxx`) roll up into independently deliverable work packages (`WPxx`).

---

## Work Package WP01: Baseline Inventory & Parity Taxonomy (Priority: P0)

**Goal**: Establish authoritative runtime and documentation baselines, scenario IDs, and traceability scaffolding.  
**Independent Test**: Baseline catalog is complete for all in-scope capabilities and every scenario has a stable ID usable by future tests.  
**Prompt**: `tasks/WP01-baseline-inventory-and-taxonomy.md`  
**Estimated prompt size**: ~330 lines
**Requirement Refs**: FR-001, FR-002, FR-003, FR-022, FR-027, FR-028, FR-029

### Included Subtasks
- [ ] T001 Inventory repository-local runtime entry points and configuration surfaces.
- [ ] T002 Capture hosted runtime baseline fixtures and define conflict-log shape.
- [ ] T003 Define canonical capability taxonomy for consolidated package modules.
- [ ] T004 Build behavior-rule extraction checklist with severity classification.
- [ ] T005 Create documentation mapping register and gap-tracking scaffold.
- [ ] T006 Define parity scenario catalog and stable scenario IDs.

### Implementation Notes
- Treat local repository runtime behavior as canonical when hosted/local conflicts appear.
- Include `a11ychecker` as first-class scope during taxonomy and scenario capture.
- Produce artifacts under `kitty-specs/001-a11yfirst-functional-parity-specification/research/`.

### Parallel Opportunities
- T002, T004, and T005 can proceed in parallel once T001 establishes runtime touchpoints.

### Dependencies
- None.

### Risks & Mitigations
- Risk: Baseline drift between environments.  
  Mitigation: Timestamp observations and keep conflict log with explicit local-wins resolution.

---

## Work Package WP02: Consolidated CKEditor5 Package Foundation (Priority: P0)

**Goal**: Create consolidated `a11yfirst` CKEditor5 package skeleton with shared core infrastructure for all modules.  
**Independent Test**: Package builds, module registry loads, feature flags can toggle placeholder modules, and test harness runs empty suites successfully.  
**Prompt**: `tasks/WP02-consolidated-package-foundation.md`  
**Estimated prompt size**: ~360 lines
**Requirement Refs**: FR-002, FR-003, FR-020, FR-021, FR-024

### Included Subtasks
- [ ] T007 Create `migration/ckeditor5/a11yfirst/` package structure and build configuration.
- [ ] T008 Implement shared module registry and component-factory skeleton.
- [ ] T009 Implement feature-flag configuration layer and runtime toggles.
- [ ] T010 Implement shared guidance/message abstraction (`block`, `warn`, `confirm`, `info`).
- [ ] T011 Scaffold test harness directories (`unit`, `integration`, `parity`) and bootstrap utilities.
- [ ] T012 Add CI/local scripts for parity suite execution and reporting.

### Implementation Notes
- This WP is the hard prerequisite for all module parity WPs.
- Keep module APIs stable and minimal to prevent refactor churn in later WPs.

### Parallel Opportunities
- T009 and T011 can run in parallel after T007 and T008 are in place.

### Dependencies
- Depends on WP01.

### Risks & Mitigations
- Risk: Foundation abstractions become too CKEditor4-shaped and block CKEditor5 idioms.  
  Mitigation: Keep abstractions behavior-oriented, not implementation-specific.

---

## Work Package WP03: Heading + Toolbar/State Parity Module (Priority: P1) 🎯 MVP

**Goal**: Implement heading selection constraints and toolbar/state semantics with parity to current A11yFirst behavior.  
**Independent Test**: Author can only select allowed heading levels by context, toolbar grouping/state reflects parity behavior, and regression suite passes for heading + toolbar/state scenarios.  
**Prompt**: `tasks/WP03-heading-and-toolbar-state-parity.md`  
**Estimated prompt size**: ~420 lines
**Requirement Refs**: FR-004, FR-005, FR-006, FR-020, FR-021, FR-024

### Included Subtasks
- [ ] T013 Implement heading model/schema constraints for heading and format elements.
- [ ] T014 Implement heading command/menu state algorithm based on prior-heading context.
- [ ] T015 Implement `allow_only_one_h1` and `format_tags` interpretation behavior.
- [ ] T016 Implement toolbar grouping and control state parity (selected/disabled/expanded behavior).
- [ ] T017 Create heading + toolbar parity fixtures and scenario mappings.
- [ ] T018 Implement automated parity tests for heading and toolbar/state module.

### Implementation Notes
- Preserve semantics from `a11yheading` and configured toolbar organization in `custom/config.js`.
- Include aria/state behavior parity checks in acceptance criteria.

### Parallel Opportunities
- T015 can run in parallel with T016 after T013 baseline structure is complete.

### Dependencies
- Depends on WP02.

### Risks & Mitigations
- Risk: Subtle differences in heading availability logic introduce behavior drift.  
  Mitigation: Encode scenario-based fixtures from WP01 catalog and enforce deterministic assertions.

---

## Work Package WP04: Character Style + Help System Parity (Priority: P1)

**Goal**: Implement inline style parity plus integrated A11yFirst Help topic system and fallback behavior.  
**Independent Test**: Style actions (apply/remove/help) and help navigation/content behavior match baseline, including no-help fallback messaging.  
**Prompt**: `tasks/WP04-styles-and-help-system-parity.md`  
**Estimated prompt size**: ~410 lines
**Requirement Refs**: FR-016, FR-017, FR-018, FR-019, FR-022, FR-024

### Included Subtasks
- [ ] T019 Implement inline styles module behavior including remove-styles semantics.
- [ ] T020 Implement shared help-launch integration from dependent modules.
- [ ] T021 Implement help topic registry and content-loader pipeline.
- [ ] T022 Implement fallback messaging when help system is unavailable.
- [ ] T023 Create styles/help parity fixtures and documentation mappings.
- [ ] T024 Implement automated tests for style and help module parity.

### Implementation Notes
- Preserve topic set: Heading/Paragraph, List, Image, Character Style, Link, Getting Started, About A11yFirst.
- Ensure module integration points support later image/link help invocation without rework.

### Parallel Opportunities
- T019 and T021 can proceed in parallel after T020 integration contracts are set.

### Dependencies
- Depends on WP02.

### Risks & Mitigations
- Risk: Help content rendering differs from existing behavior.  
  Mitigation: Validate topic routing and rendered content blocks against scenario IDs and fixtures.

---

## Work Package WP05: Image Module Accessibility Parity (Priority: P1)

**Goal**: Implement full `a11yimage` behavior parity including alt-text guidance, decorative exception flow, long-description semantics, and caption behavior.  
**Independent Test**: All image validation paths and output semantics (including appended long-description context) match baseline behavior and tests pass.  
**Prompt**: `tasks/WP05-image-module-accessibility-parity.md`  
**Estimated prompt size**: ~470 lines
**Requirement Refs**: FR-007, FR-008, FR-009, FR-010, FR-011, FR-016, FR-024

### Included Subtasks
- [ ] T025 Implement image dialog model and field-interaction behavior.
- [ ] T026 Implement alternative-text validation rules with warning/block/confirm severity.
- [ ] T027 Implement decorative exception and alternative-text removal flow.
- [ ] T028 Implement long-description location capture and optional caption behavior.
- [ ] T029 Integrate image help invocation and no-help fallback behavior.
- [ ] T030 Implement content-output equivalence tests for image markup semantics.
- [ ] T031 Implement UI regression tests for key image dialog paths.

### Implementation Notes
- Preserve current phrase/pattern checks, length warning behavior, and user confirmation dialogs.
- Ensure output-equivalence checks cover informative and decorative image branches.
- Defer advanced long-description linkage enhancements (for example explicit `aria-describedby` wiring) until after higher-priority core parity elements are completed; current parity accepts adjacency/proximity semantics.
- Use University of Illinois A11yFirst Images documentation as explicit acceptance-scenario input for WP05 test coverage, while preserving repository runtime behavior as canonical if differences are found.

### Parallel Opportunities
- T030 can start in parallel with T031 after T025–T029 behaviors are stabilized.

### Dependencies
- Depends on WP03.
- Depends on WP04.

### Risks & Mitigations
- Risk: Dialog behavior differs under edge interactions (checkbox/text interplay).  
  Mitigation: Encode high-risk interaction sequences as mandatory parity tests.

---

## Work Package WP06: Link Module Accessibility Parity (Priority: P1)

**Goal**: Implement full `a11ylink` behavior parity for display-text validation, confirm flows, anchor edge cases, and help integration.  
**Independent Test**: Link creation/edit flows enforce baseline validation behavior and produce equivalent output for URL/email/anchor cases with automated parity coverage.  
**Prompt**: `tasks/WP06-link-module-accessibility-parity.md`  
**Estimated prompt size**: ~450 lines
**Requirement Refs**: FR-012, FR-013, FR-014, FR-015, FR-016, FR-024

### Included Subtasks
- [ ] T032 Implement link dialog display-text behavior and normalization rules.
- [ ] T033 Implement invalid display phrase and invalid-start-text checks.
- [ ] T034 Implement URL/email/anchor confirm flows and no-anchor edge handling.
- [ ] T035 Integrate link help invocation and no-help fallback behavior.
- [ ] T036 Implement anchor/edit/unlink interaction parity and shortcut behavior.
- [ ] T037 Implement content-output equivalence tests for links and anchors.
- [ ] T038 Implement UI regression tests for link validation and dialog flows.

### Implementation Notes
- Preserve non-empty display-text enforcement and current confirmation semantics.
- Maintain compatibility with anchor workflows and existing editor command model.

### Parallel Opportunities
- T037 and T038 can proceed in parallel after core behaviors T032–T036 are complete.

### Dependencies
- Depends on WP03.
- Depends on WP04.

### Risks & Mitigations
- Risk: Text normalization differences create false parity failures.  
  Mitigation: Reuse shared normalization helpers and fixture-based expected outcomes.

---

## Work Package WP07: Accessibility Checker Parity Module (Priority: P1)

**Goal**: Implement `a11ychecker` parity adapter and user-guidance behavior in consolidated package scope.  
**Independent Test**: Checker can run in migrated environment, returns baseline-equivalent issue categories and messaging, and passes automated regression tests.  
**Prompt**: `tasks/WP07-accessibility-checker-parity.md`  
**Estimated prompt size**: ~390 lines
**Requirement Refs**: FR-025, FR-026, FR-024

### Included Subtasks
- [ ] T039 Inventory current checker rule-set and workflow differences from stock behavior.
- [ ] T040 Implement checker adapter module in consolidated package architecture.
- [ ] T041 Implement issue-category mapping and guidance-message parity.
- [ ] T042 Implement checker run lifecycle and result presentation parity.
- [ ] T043 Create checker baseline fixtures and discrepancy-log hooks.
- [ ] T044 Implement automated checker parity and regression tests.
- [ ] T045 Integrate checker feature-flag gate controls.

### Implementation Notes
- Treat checker as first-class module, not auxiliary dependency.
- Ensure rule-category compatibility with parity-run orchestration contract.
- Prioritize external-checker integration using Sa11y (with axe-core custom checks support) for single-page deployment compatibility; do not add pa11y to the core migration path.
- Align delivery with GitHub Pages + Actions architecture: lightweight in-page checker UX plus CI axe validation gates.

### Parallel Opportunities
- T043 can run in parallel with T040/T041 once baseline inventory T039 is complete.

### Dependencies
- Depends on WP02.
- Depends on WP01.

### Risks & Mitigations
- Risk: Rule-level differences are hard to observe early.  
  Mitigation: Lock fixture corpus and compare issue category outputs deterministically.

---

## Work Package WP08: End-to-End Parity Gates, Rollout, and Readiness (Priority: P2)

**Goal**: Operationalize parity gates and produce rollout-ready evidence and migration readiness package.  
**Independent Test**: End-to-end parity pipeline executes across all modules, gates enforce prerequisites, and readiness report supports phased production enablement.  
**Prompt**: `tasks/WP08-e2e-parity-gates-and-readiness.md`  
**Estimated prompt size**: ~370 lines
**Requirement Refs**: FR-022, FR-023, FR-024, FR-027, FR-028, FR-029

### Included Subtasks
- [ ] T046 Implement baseline conflict resolver with explicit local-runtime-wins policy.
- [ ] T047 Implement parity-run orchestrator aligned to contract definitions.
- [ ] T048 Implement module-level feature-flag gate enforcement logic.
- [ ] T049 Build full regression pipeline across all in-scope modules.
- [ ] T050 Execute documentation coverage audit and unresolved-gap report.
- [ ] T051 Execute quickstart validation dry run and rollout checklist.
- [ ] T052 Produce migration readiness report and go/no-go criteria package.

### Implementation Notes
- Ensure orchestration supports phased module enablement and rollback safeguards.
- Readiness report must include unresolved gaps and baseline conflict outcomes.

### Parallel Opportunities
- T050 can run in parallel with T049 after core orchestrator logic exists.

### Dependencies
- Depends on WP05.
- Depends on WP06.
- Depends on WP07.

### Risks & Mitigations
- Risk: Late-stage cross-module regressions delay rollout.  
  Mitigation: Enforce gate policy and no-bypass rule for module flag enablement.

---

## Dependency & Execution Summary

- **Recommended sequence**: WP01 -> WP02 -> (WP03 + WP04 + WP07 in parallel where possible) -> (WP05 + WP06) -> WP08.
- **Parallelization highlights**:
  - WP03, WP04, and WP07 can proceed in parallel after WP02.
  - WP05 and WP06 can proceed in parallel once WP03 and WP04 are complete.
- **MVP scope**: WP03 (Heading + toolbar/state parity) is the first independently valuable parity delivery.

---

## Subtask Index (Reference)

| Subtask ID | Summary | Work Package | Priority | Parallel? |
|------------|---------|--------------|----------|-----------|
| T001 | Local runtime inventory | WP01 | P0 | No |
| T002 | Hosted runtime fixture capture | WP01 | P0 | Yes |
| T003 | Capability taxonomy definition | WP01 | P0 | No |
| T004 | Behavior-rule extraction checklist | WP01 | P0 | Yes |
| T005 | Documentation gap scaffold | WP01 | P0 | Yes |
| T006 | Scenario catalog and IDs | WP01 | P0 | No |
| T007 | Package skeleton and build config | WP02 | P0 | No |
| T008 | Module registry skeleton | WP02 | P0 | No |
| T009 | Feature flag layer | WP02 | P0 | Yes |
| T010 | Shared guidance abstraction | WP02 | P0 | No |
| T011 | Test harness scaffold | WP02 | P0 | Yes |
| T012 | CI parity scripts | WP02 | P0 | No |
| T013 | Heading schema constraints | WP03 | P1 | No |
| T014 | Heading state algorithm | WP03 | P1 | No |
| T015 | H1 + format_tags behavior | WP03 | P1 | Yes |
| T016 | Toolbar/state parity | WP03 | P1 | Yes |
| T017 | Heading fixtures | WP03 | P1 | No |
| T018 | Heading automation | WP03 | P1 | No |
| T019 | Styles module behavior | WP04 | P1 | No |
| T020 | Help-launch integration | WP04 | P1 | No |
| T021 | Help topic registry/loader | WP04 | P1 | Yes |
| T022 | Help fallback behavior | WP04 | P1 | No |
| T023 | Styles/help fixtures | WP04 | P1 | Yes |
| T024 | Styles/help automation | WP04 | P1 | No |
| T025 | Image dialog behavior | WP05 | P1 | No |
| T026 | Alt-text validation rules | WP05 | P1 | No |
| T027 | Decorative exception flow | WP05 | P1 | No |
| T028 | Long-desc and caption behavior | WP05 | P1 | No |
| T029 | Image help integration | WP05 | P1 | Yes |
| T030 | Image output-equivalence tests | WP05 | P1 | Yes |
| T031 | Image UI regression tests | WP05 | P1 | Yes |
| T032 | Link display-text behavior | WP06 | P1 | No |
| T033 | Link invalid phrase checks | WP06 | P1 | No |
| T034 | URL/email/anchor confirm flows | WP06 | P1 | No |
| T035 | Link help integration | WP06 | P1 | Yes |
| T036 | Anchor/edit/unlink parity | WP06 | P1 | No |
| T037 | Link output-equivalence tests | WP06 | P1 | Yes |
| T038 | Link UI regression tests | WP06 | P1 | Yes |
| T039 | Checker rule inventory | WP07 | P1 | No |
| T040 | Checker adapter module | WP07 | P1 | No |
| T041 | Checker category/message mapping | WP07 | P1 | No |
| T042 | Checker lifecycle parity | WP07 | P1 | No |
| T043 | Checker fixtures | WP07 | P1 | Yes |
| T044 | Checker automation | WP07 | P1 | No |
| T045 | Checker flag gate integration | WP07 | P1 | No |
| T046 | Conflict resolver local-wins policy | WP08 | P2 | No |
| T047 | Parity-run orchestrator | WP08 | P2 | No |
| T048 | Feature-flag gate enforcement | WP08 | P2 | No |
| T049 | Full regression pipeline | WP08 | P2 | No |
| T050 | Documentation coverage audit | WP08 | P2 | Yes |
| T051 | Quickstart dry-run validation | WP08 | P2 | No |
| T052 | Migration readiness report | WP08 | P2 | No |
