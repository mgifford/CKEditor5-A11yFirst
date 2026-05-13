import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ValidationRegistry } from '../../../src/core/validationRegistry.js';
import type { FindingsMap } from '../../../src/core/validationRegistry.js';

// ---------------------------------------------------------------------------
// ValidationRegistry
// ---------------------------------------------------------------------------
describe('ValidationRegistry', () => {
  let registry: ValidationRegistry;

  beforeEach(() => {
    registry = new ValidationRegistry();
  });

  // -------------------------------------------------------------------------
  // Initial state
  // -------------------------------------------------------------------------
  describe('initial state', () => {
    it('starts with all categories empty', () => {
      const findings = registry.getFindings();
      expect(findings.headings).toHaveLength(0);
      expect(findings.images).toHaveLength(0);
      expect(findings.links).toHaveLength(0);
      expect(findings.lists).toHaveLength(0);
      expect(findings.tables).toHaveLength(0);
      expect(Array.isArray(findings.checker)).toBe(true);
    });
  });

  // -------------------------------------------------------------------------
  // addFinding
  // -------------------------------------------------------------------------
  describe('addFinding()', () => {
    it('appends a finding to the specified category', () => {
      registry.addFinding('headings', { level: 'error', message: 'Bad heading' });
      const headings = registry.getFindings('headings') as unknown[];
      expect(headings).toHaveLength(1);
    });

    it('notifies listeners when a finding is added', () => {
      const listener = vi.fn();
      registry.addListener(listener);
      registry.addFinding('images', { level: 'error', message: 'Missing alt' });
      expect(listener).toHaveBeenCalledTimes(1);
    });
  });

  // -------------------------------------------------------------------------
  // setFindings
  // -------------------------------------------------------------------------
  describe('setFindings()', () => {
    it('replaces all findings in a category', () => {
      registry.addFinding('links', { level: 'error', message: 'Generic link' });
      registry.setFindings('links', [
        { level: 'error', message: 'Another link' },
        { level: 'warning', message: 'Third link' },
      ]);
      const links = registry.getFindings('links') as unknown[];
      expect(links).toHaveLength(2);
    });

    it('accepts a CheckerSummary for the checker category', () => {
      registry.setFindings('checker', {
        blocking: ['Heading skip'],
        advisory: ['Missing caption'],
      });
      const checker = registry.getFindings('checker') as { blocking: string[]; advisory: string[] };
      expect(checker.blocking).toContain('Heading skip');
    });

    it('notifies listeners when findings are replaced', () => {
      const listener = vi.fn();
      registry.addListener(listener);
      registry.setFindings('tables', [{ level: 'advisory', message: 'No caption' }]);
      expect(listener).toHaveBeenCalledTimes(1);
    });
  });

  // -------------------------------------------------------------------------
  // getFindings
  // -------------------------------------------------------------------------
  describe('getFindings()', () => {
    it('returns all findings when called without argument', () => {
      registry.addFinding('headings', { level: 'error', message: 'H skip' });
      const all = registry.getFindings();
      expect(all).toHaveProperty('headings');
      expect(all).toHaveProperty('images');
    });

    it('returns only the specified category when called with an argument', () => {
      registry.addFinding('lists', { level: 'warning', message: 'Fake list' });
      const lists = registry.getFindings('lists') as unknown[];
      expect(lists).toHaveLength(1);
    });
  });

  // -------------------------------------------------------------------------
  // clear
  // -------------------------------------------------------------------------
  describe('clear()', () => {
    it('clears a single category', () => {
      registry.addFinding('images', { level: 'error', message: 'Missing alt' });
      registry.clear('images');
      expect((registry.getFindings('images') as unknown[]).length).toBe(0);
    });

    it('leaves other categories intact when clearing one', () => {
      registry.addFinding('headings', { level: 'error', message: 'Skip' });
      registry.addFinding('images', { level: 'error', message: 'Alt' });
      registry.clear('images');
      expect((registry.getFindings('headings') as unknown[]).length).toBe(1);
    });

    it('clears all categories when called without argument', () => {
      registry.addFinding('headings', { level: 'error', message: 'Skip' });
      registry.addFinding('links', { level: 'error', message: 'Generic' });
      registry.clear();
      const all = registry.getFindings();
      Object.values(all).forEach((value) => {
        if (Array.isArray(value)) {
          expect(value).toHaveLength(0);
        }
      });
    });

    it('notifies listeners when cleared', () => {
      const listener = vi.fn();
      registry.addListener(listener);
      registry.clear();
      expect(listener).toHaveBeenCalledTimes(1);
    });
  });

  // -------------------------------------------------------------------------
  // addListener / removeListener
  // -------------------------------------------------------------------------
  describe('addListener() / removeListener()', () => {
    it('calls multiple listeners', () => {
      const a = vi.fn();
      const b = vi.fn();
      registry.addListener(a);
      registry.addListener(b);
      registry.clear();
      expect(a).toHaveBeenCalledTimes(1);
      expect(b).toHaveBeenCalledTimes(1);
    });

    it('removed listener is no longer called', () => {
      const listener = vi.fn();
      registry.addListener(listener);
      registry.removeListener(listener);
      registry.clear();
      expect(listener).not.toHaveBeenCalled();
    });

    it('listener receives the full FindingsMap', () => {
      let received: FindingsMap | null = null;
      registry.addListener((findings) => { received = findings; });
      registry.addFinding('tables', { level: 'advisory', message: 'No caption' });
      expect(received).not.toBeNull();
      expect(received).toHaveProperty('tables');
    });
  });
});
