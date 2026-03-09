/**
 * Types for the A11yFirst accessibility checker module.
 *
 * This module replaces the legacy Quail.js engine (used in the CKEditor 4
 * `plugins/a11ychecker/` plugin) with axe-core as the automated scanning
 * backend.  Quail.js required jQuery and only covered WCAG 2.0; axe-core
 * covers WCAG 2.0, 2.1 and 2.2 and has no jQuery dependency.
 */

/**
 * Severity tiers, preserved from the CKEditor 4 Quail-based checker so that
 * existing guidance messages and UI remain compatible.
 *
 * Mapping from axe-core `impact`:
 *   critical  → severe
 *   serious   → moderate
 *   moderate  → suggestion
 *   minor     → suggestion
 *   (none)    → suggestion
 */
export type CheckerSeverity = 'severe' | 'moderate' | 'suggestion';

/** A single accessibility finding produced by the checker. */
export interface CheckerFinding {
  /** Stable rule identifier (e.g. axe rule id or custom rule name). */
  readonly id: string;
  /** Human-readable description of the issue. */
  readonly message: string;
  /** Severity tier. */
  readonly severity: CheckerSeverity;
  /** WCAG success criterion reference (e.g. "1.1.1"). */
  readonly wcagRef?: string;
  /** Whether this finding blocks publication or is advisory only. */
  readonly blocking: boolean;
  /** Source engine that produced this finding. */
  readonly source: 'axe-core' | 'sa11y' | 'custom';
}

/** Aggregated checker run result. */
export interface CheckerResult {
  /** All findings, sorted blocking-first then by severity. */
  readonly findings: CheckerFinding[];
  /** Convenience subset: only blocking findings. */
  readonly blocking: CheckerFinding[];
  /** Convenience subset: only advisory findings. */
  readonly advisory: CheckerFinding[];
  /** ISO timestamp when the run completed. */
  readonly timestamp: string;
}

/**
 * Minimal shape of an axe-core violation returned by `axe.run()`.
 * Declared here to avoid a hard npm dependency on the `axe-core` package
 * while still providing type-safety for the adapter.
 */
export interface AxeViolation {
  readonly id: string;
  readonly help: string;
  readonly impact: 'critical' | 'serious' | 'moderate' | 'minor' | null;
  readonly tags: readonly string[];
  readonly nodes: readonly {
    readonly html: string;
    readonly failureSummary?: string;
  }[];
}

/** Subset of the axe.run() result shape used by the adapter. */
export interface AxeRunResult {
  readonly violations: readonly AxeViolation[];
}
