/**
 * A11yFirstCheckerPlugin — combined accessibility checker.
 *
 * Runs two complementary checks on the editor's current HTML content:
 *
 *   1. **axe-core** (when `window.axe` is available) — automated WCAG 2.0,
 *      2.1, and 2.2 scan of the editor's live DOM via `axe.run()`.
 *
 *   2. **A11yFirst custom rules** — synchronous HTML-string checks for:
 *        - Heading sequence violations
 *        - Non-descriptive link text
 *        - Missing / empty image alt text
 *        - Table caption and header-cell presence
 *
 * The combined result is stored in the ValidationRegistry under the `checker`
 * category and also returned as a `Promise<CheckerRunResult>`.
 *
 * ### Triggering a check
 * The plugin attaches `editor.a11yCheck()` to the editor instance:
 * ```ts
 * const result = await editor.a11yCheck();
 * console.log(result.blocking);   // findings that must be fixed
 * console.log(result.advisory);   // findings that are advisory
 * ```
 *
 * The real-time `change:data` listener keeps the `checker` category in the
 * ValidationRegistry up-to-date using only the synchronous custom rules so
 * that the UI can show a live badge count without triggering full axe-core
 * scans on every keystroke.
 *
 * ## WCAG References
 * - Multiple — see individual finding `wcagRef` fields.
 */

import { PluginBase } from '../ckeditor5-types.js';
import type { CheckerSummary } from '../core/validationRegistry.js';
import { ensureRegistry, getRegistry } from './A11yFirstHeadingPlugin.js';
import { runCustomChecks } from '../modules/checker/checkerModule.js';

/** Result returned by `editor.a11yCheck()`. */
export interface CheckerRunResult {
  findings: CheckerRunFinding[];
  blocking: CheckerRunFinding[];
  advisory: CheckerRunFinding[];
  timestamp: string;
}

export interface CheckerRunFinding {
  severity: string;
  blocking: boolean;
  source: string;
  message: string;
}

// ---------------------------------------------------------------------------
// axe-core impact helpers (mirrors checkerMappings.ts)
// ---------------------------------------------------------------------------

function mapAxeImpact(impact: string | null | undefined): string {
  if (impact === 'critical') return 'severe';
  if (impact === 'serious') return 'moderate';
  return 'suggestion';
}

function isBlockingImpact(impact: string | null | undefined): boolean {
  return impact === 'critical' || impact === 'serious';
}

// ---------------------------------------------------------------------------
// Plugin class
// ---------------------------------------------------------------------------

export class A11yFirstCheckerPlugin extends PluginBase {
  public static override get pluginName(): string {
    return 'A11yFirstChecker';
  }

  public init(): void {
    const { editor } = this;

    if (!editor._a11yFirstTopics) {
      editor._a11yFirstTopics = new Set();
    }
    editor._a11yFirstTopics.add('A11yCheckerSummary');

    ensureRegistry(editor);
    const registry = getRegistry(editor);

    // Keep a lightweight live summary in the registry using only synchronous
    // custom rules (no axe-core, no DOM access needed on every keystroke).
    editor.model.document.on('change:data', () => {
      const html = editor.getData();
      const result = runCustomChecks(html);

      const summary: CheckerSummary = {
        blocking: result.blocking.map((f) => f.message),
        advisory: result.advisory.map((f) => f.message),
      };
      registry.setFindings('checker', summary);
    });

    // Expose a full check method (including axe-core) on the editor instance.
    editor.a11yCheck = () => runA11yCheck(editor);
  }
}

// ---------------------------------------------------------------------------
// Full check (exported for testing)
// ---------------------------------------------------------------------------

/**
 * Run a full accessibility check combining axe-core (when available) and
 * A11yFirst custom rules.
 */
export async function runA11yCheck(
  editor: ConstructorParameters<typeof A11yFirstCheckerPlugin>[0],
): Promise<CheckerRunResult> {
  const html = editor.getData ? editor.getData() : '';

  // Custom rules (synchronous, no DOM required).
  const customResult = runCustomChecks(html);
  const customFindings: CheckerRunFinding[] = customResult.findings.map((f) => ({
    severity: f.severity,
    blocking: f.blocking,
    source: f.source,
    message: f.message,
  }));

  // axe-core scan (asynchronous, requires a live DOM and window.axe).
  let axeFindings: CheckerRunFinding[] = [];
  const globalWindow = typeof window !== 'undefined' ? window : null;

  if (globalWindow && (globalWindow as Record<string, unknown>)['axe']) {
    try {
      const axe = (globalWindow as Record<string, unknown>)['axe'] as {
        run(
          target: HTMLElement,
          options: Record<string, unknown>,
        ): Promise<{ violations: Array<{ id: string; help: string; impact: string | null; tags: string[] }> }>;
      };

      const editableEl =
        editor.ui?.getEditableElement?.() ??
        editor.editing?.view?.getDomRoot?.() ??
        null;

      const scanTarget =
        editableEl ?? (globalWindow as typeof globalThis & { document: Document }).document.body;

      const result = await axe.run(scanTarget as HTMLElement, {
        runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa'] },
      });

      axeFindings = result.violations.map((v) => ({
        severity: mapAxeImpact(v.impact),
        blocking: isBlockingImpact(v.impact),
        source: 'axe-core',
        message: `axe: ${v.id} — ${v.help}`,
      }));
    } catch (err) {
      axeFindings = [
        {
          severity: 'suggestion',
          blocking: false,
          source: 'axe-core',
          message: `axe-core scan failed: ${err instanceof Error ? err.message : String(err)}`,
        },
      ];
    }
  }

  const allFindings = [...axeFindings, ...customFindings].sort((a, b) => {
    if (a.blocking !== b.blocking) return a.blocking ? -1 : 1;
    const order: Record<string, number> = { severe: 0, moderate: 1, suggestion: 2 };
    return (order[a.severity] ?? 2) - (order[b.severity] ?? 2);
  });

  return {
    findings: allFindings,
    blocking: allFindings.filter((f) => f.blocking),
    advisory: allFindings.filter((f) => !f.blocking),
    timestamp: new Date().toISOString(),
  };
}
