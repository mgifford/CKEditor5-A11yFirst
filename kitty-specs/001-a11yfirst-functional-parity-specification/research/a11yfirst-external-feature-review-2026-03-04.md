# A11yFirst External Feature Review (2026-03-04)

This review maps current CKEditor5 migration work to the University of Illinois A11yFirst feature documentation pages.

## Source references reviewed

- Main index: https://publish.illinois.edu/a11yfirst/documentation/feature-documentation/
- Images: https://publish.illinois.edu/a11yfirst/feature-documentationimages/
- General: https://publish.illinois.edu/a11yfirst/feature-documentation/feature-documentation-general/
- Headings: https://publish.illinois.edu/a11yfirst/feature-documentation/feature-documentation-headings/
- List: https://publish.illinois.edu/a11yfirst/feature-documentation/feature-documentation-links/
- Links: https://publish.illinois.edu/a11yfirst/feature-documentation/feature-documentation-links-2/
- Templates: https://publish.illinois.edu/a11yfirst/feature-documentation-templates/
- Inline formatting & styling: https://publish.illinois.edu/a11yfirst/feature-documentation/feature-documentation-inline-formatting-and-styling/
- Abbreviations and languages: https://publish.illinois.edu/a11yfirst/feature-documentation/languages/
- Table: https://publish.illinois.edu/a11yfirst/feature-documentation/feature-documentation-table/
- Checkers: https://publish.illinois.edu/a11yfirst/feature-documentation/feature-documentation-code-quality-assurance/

## Mapping to migration scope

- General → Covered by consolidated package foundation and shared UX/state contracts (`WP01`, `WP02`).
- Headings → In active parity scope and demo coverage (`WP03`, Demo 2).
- List → Planned parity scope under text/structure behavior (follow-on after `WP03/WP04`).
- Links → Planned parity scope (`WP06`).
- Templates → Planned content-pattern parity and help guidance integration (follow-on WPs).
- Inline formatting & styling → Planned parity scope (`WP04`).
- Abbreviations and languages → Planned language/semantics parity (follow-on WPs).
- Table → Planned parity scope (follow-on WPs + output-equivalence tests).
- Images → Active parity scope (`WP05`) and Demo 3 MVP (URL-first image properties, alt/decorative, caption, alignment/size controls).
- Checkers → Planned/active external-checker integration path (`WP07`) with Sa11y + axe orientation.

## Gaps to close for image parity (issue #1-aligned)

- Demo currently provides an in-page Image Properties MVP instead of a native modal/balloon image-properties command button.
- Long-description behavior is intentionally minimal for now (adjacency/proximity semantics), with advanced linkage deferred.
- Command availability still depends on bundled CKEditor build plugins; local bundle is now vendored to improve control.

## Immediate next implementation targets

1. Add a dedicated "Image Properties" trigger in Demo 3 image toolbar that opens/focuses the A11yFirst image properties panel.
2. Align image-field labels/help text with the reference docs wording where possible.
3. Add parity tests for image edit flows (existing image vs newly inserted URL image).
4. Capture explicit acceptance scenarios from each external feature page into WP-level checklist items.

## Notes

- This document is a baseline parity review snapshot, not a final conformance claim.
- Source pages remain the behavior reference; migration implementation remains constrained by CKEditor5 architecture and phased rollout.
