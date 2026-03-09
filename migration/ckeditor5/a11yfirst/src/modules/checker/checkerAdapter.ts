/**
 * Adapter that converts axe-core `AxeRunResult` objects into the A11yFirst
 * `CheckerFinding[]` format.
 *
 * This module is the primary replacement for the Quail.js scanning engine.
 * Quail.js (bundled in `plugins/a11ychecker/libs/quail/`) required jQuery,
 * only covered WCAG 2.0, and is no longer maintained.  axe-core covers
 * WCAG 2.0, 2.1 and 2.2, requires no jQuery, and is actively maintained by
 * Deque Systems.
 *
 * The adapter is deliberately free of browser or CKEditor5 runtime
 * dependencies so that it can be unit-tested in Node.js/vitest without a DOM.
 */

import type { AxeRunResult, CheckerFinding } from './types';
import {
  isBlockingImpact,
  mapAxeImpactToSeverity,
  resolveWcagRef,
} from './checkerMappings';

/**
 * Convert all violations in an `axe.run()` result into `CheckerFinding`
 * objects.
 *
 * Each axe-core violation may affect multiple nodes; we produce one finding
 * per violation (not per affected node) to keep the result list manageable.
 * The first affected node's `failureSummary` is appended when available.
 */
export function adaptAxeResults(result: AxeRunResult): CheckerFinding[] {
  return result.violations.map((violation) => {
    const severity = mapAxeImpactToSeverity(violation.impact);
    const blocking = isBlockingImpact(violation.impact);
    const wcagRef = resolveWcagRef(violation.id, violation.tags);

    const firstNodeSummary =
      violation.nodes.length > 0
        ? violation.nodes[0].failureSummary
        : undefined;

    const message = firstNodeSummary
      ? `${violation.help} — ${firstNodeSummary}`
      : violation.help;

    return {
      id: violation.id,
      message,
      severity,
      wcagRef,
      blocking,
      source: 'axe-core',
    } satisfies CheckerFinding;
  });
}
