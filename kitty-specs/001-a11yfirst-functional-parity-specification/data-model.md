# Data Model: A11yFirst CKEditor4 to CKEditor5 Parity Migration

## Entity: CapabilityModule

- Description: One functional slice in the consolidated CKEditor5 `a11yfirst` package.
- Fields:
  - `module_key` (string, unique): `heading`, `image`, `link`, `help`, `styles`, `checker`, `toolbar_state`
  - `display_name` (string)
  - `scope_status` (enum): `in_scope`, `out_of_scope`
  - `flag_key` (string)
  - `rollout_stage` (enum): `not_started`, `implemented`, `qa_validated`, `flagged_off`, `flagged_on_canary`, `flagged_on_full`
  - `runtime_authority` (enum): `local_repo`, `hosted_demo`, `shared`

## Entity: BehaviorRule

- Description: A testable behavior expectation mapped from CKEditor4 runtime.
- Fields:
  - `rule_id` (string, unique)
  - `module_key` (foreign key -> CapabilityModule)
  - `trigger_context` (string)
  - `expected_outcome` (string)
  - `severity` (enum): `block`, `warn`, `confirm`, `informational`
  - `is_required_for_parity` (boolean)
  - `source_type` (enum): `runtime`, `documentation`, `both`
  - `source_reference` (string)

## Entity: DocumentationMapping

- Description: Traceability from capability behavior to current documentation.
- Fields:
  - `mapping_id` (string, unique)
  - `module_key` (foreign key -> CapabilityModule)
  - `rule_id` (foreign key -> BehaviorRule, nullable)
  - `doc_source` (enum): `plugin_readme`, `help_content`, `custom_docs`, `public_site`, `archive_site`
  - `doc_path_or_url` (string)
  - `coverage_status` (enum): `covered`, `partial`, `gap`
  - `notes` (string)

## Entity: BaselineObservation

- Description: Captured behavior from a runtime baseline execution.
- Fields:
  - `observation_id` (string, unique)
  - `module_key` (foreign key -> CapabilityModule)
  - `baseline_source` (enum): `local_repo_runtime`, `hosted_demo_runtime`
  - `scenario_key` (string)
  - `observed_behavior` (string)
  - `captured_at` (datetime)
  - `conflict_group` (string, nullable)

## Entity: BaselineConflict

- Description: Conflict record when hosted and local baselines differ.
- Fields:
  - `conflict_id` (string, unique)
  - `module_key` (foreign key -> CapabilityModule)
  - `scenario_key` (string)
  - `hosted_behavior` (string)
  - `local_behavior` (string)
  - `resolution` (enum): `use_local_runtime`
  - `resolution_note` (string)

## Entity: ParityTestCase

- Description: Automated and manual checks gating module rollout.
- Fields:
  - `test_case_id` (string, unique)
  - `module_key` (foreign key -> CapabilityModule)
  - `test_type` (enum): `ui_parity`, `output_equivalence`, `automated_regression`
  - `preconditions` (string)
  - `steps` (string)
  - `expected_result` (string)
  - `status` (enum): `not_run`, `pass`, `fail`

## Entity: FeatureFlagGate

- Description: Rollout gate for enabling a module.
- Fields:
  - `gate_id` (string, unique)
  - `module_key` (foreign key -> CapabilityModule)
  - `requires_ui_parity` (boolean)
  - `requires_output_equivalence` (boolean)
  - `requires_regression_suite` (boolean)
  - `gate_status` (enum): `locked`, `eligible`, `enabled`

## Relationships

- CapabilityModule 1:N BehaviorRule
- CapabilityModule 1:N DocumentationMapping
- CapabilityModule 1:N BaselineObservation
- CapabilityModule 1:N ParityTestCase
- CapabilityModule 1:1 FeatureFlagGate
- BaselineConflict links paired BaselineObservation records for same `module_key` + `scenario_key`
- BehaviorRule may be supported by zero or more DocumentationMapping records

## Validation Rules

- Every `CapabilityModule` with `scope_status=in_scope` must have at least one `BehaviorRule`.
- Every in-scope module must have one `FeatureFlagGate` with all three gate requirements set to `true`.
- Any detected baseline conflict must resolve to `use_local_runtime`.
- A module cannot transition to `flagged_on_canary` unless all linked `ParityTestCase` types have status `pass`.
- `coverage_status=gap` mappings are allowed but must include `notes`.

## Lifecycle Transitions

### CapabilityModule.rollout_stage

- `not_started` -> `implemented` -> `qa_validated` -> `flagged_off` -> `flagged_on_canary` -> `flagged_on_full`
- Allowed rollback transitions:
  - `flagged_on_canary` -> `flagged_off`
  - `flagged_on_full` -> `flagged_off`

### FeatureFlagGate.gate_status

- `locked` -> `eligible` -> `enabled`
- `enabled` -> `locked` allowed on regression failure.
