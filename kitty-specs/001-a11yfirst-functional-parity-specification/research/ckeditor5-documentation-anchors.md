# CKEditor 5 Documentation Anchors for A11yFirst Migration

## Source References

- https://ckeditor.com/docs/ckeditor5/latest/framework/architecture/plugins.html
- https://ckeditor.com/docs/ckeditor5/latest/index.html
- https://ckeditor.com/docs/ckeditor5/latest/framework/tutorials/creating-simple-plugin-timestamp.html

## Why this matters for our migration

A11yFirst is migrating from CKEditor4 plugin behavior to a CKEditor5 consolidated package. These references define the plugin architecture expectations we should target during implementation, especially for module boundaries, UI registration, and command-driven behavior.

## Architecture guidance to apply

### 1) Plugin-first composition

- CKEditor5 features are plugin-driven.
- Each A11yFirst module should expose a clear plugin boundary, even inside one consolidated package.
- Keep module responsibilities isolated:
  - heading
  - image
  - link
  - help
  - styles
  - checker
  - shared toolbar/state core

### 2) Prefer editing/UI split inside each module

- Separate editing behavior (schema, commands, conversions, validation logic) from UI behavior (toolbar controls, dialogs/forms, help launch actions).
- This maps well to parity testing layers (output equivalence vs UI interaction parity).

### 3) Register UI via component factory patterns

- Toolbar and controls should be registered through CKEditor5 UI component factory patterns.
- This directly supports the A11yFirst toolbar/state parity requirements.

### 4) Command-centric behavior orchestration

- Use commands as the primary behavior entry points for feature actions.
- Validation and guard logic should run in command execution paths to preserve deterministic behavior.

### 5) Conversion and schema discipline for output parity

- Define schema and conversion behavior early for modules that produce rich output differences (especially image and link flows).
- Keep output-equivalence fixtures tied to conversion expectations.

### 6) Package generator and testing helpers as accelerators

- CKEditor5 docs include package-generation and testing tooling guidance.
- Use this as implementation acceleration only; parity behavior remains governed by A11yFirst baseline scenarios.

## Mapping to current work packages

- WP02: Consolidated package foundation, module registry, flags, test harness
- WP03: Heading plus toolbar/state parity
- WP04: Help and styles module structure
- WP05: Image schema/conversion and UI parity
- WP06: Link command/conversion and UI parity
- WP07: Checker module integration
- WP08: End-to-end gate orchestration and readiness

## Guardrails

- These references guide implementation shape, not product behavior changes.
- Runtime parity policy remains authoritative:
  - compare hosted and local baseline behaviors
  - local repository runtime wins on conflict

## Suggested follow-on references (optional)

- CKEditor5 migration guides from CKEditor4
- CKEditor5 plugin compatibility and configuration compatibility guides
- CKEditor5 testing helpers and inspector documentation
