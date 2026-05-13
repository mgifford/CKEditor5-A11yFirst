/**
 * ValidationRegistry — central store for accessibility findings produced by
 * A11yFirst plugins during the authoring session.
 *
 * Each A11yFirst plugin writes its findings to a named category in the
 * registry; external UI (inline banners, summary panels, etc.) subscribes via
 * `addListener` to receive updates whenever any category changes.
 */

export type FindingLevel = 'error' | 'warning' | 'advisory';

export interface ValidationFinding {
  level: FindingLevel;
  message: string;
}

export type FindingsMap = {
  headings: ValidationFinding[];
  images: ValidationFinding[];
  links: ValidationFinding[];
  lists: ValidationFinding[];
  tables: ValidationFinding[];
  checker: ValidationFinding[] | CheckerSummary;
};

/** Subset produced by the A11yFirst checker plugin. */
export interface CheckerSummary {
  blocking: string[];
  advisory: string[];
}

export type FindingsCategory = keyof FindingsMap;

export type FindingsListener = (findings: FindingsMap) => void;

export class ValidationRegistry {
  private findings: FindingsMap;
  private listeners: FindingsListener[];

  public constructor() {
    this.findings = {
      headings: [],
      images: [],
      links: [],
      lists: [],
      tables: [],
      checker: [],
    };
    this.listeners = [];
  }

  public addFinding(category: FindingsCategory, finding: ValidationFinding): void {
    const bucket = this.findings[category];
    if (Array.isArray(bucket)) {
      (bucket as ValidationFinding[]).push(finding);
      this.notifyListeners();
    }
  }

  public setFindings(
    category: FindingsCategory,
    findings: ValidationFinding[] | CheckerSummary,
  ): void {
    (this.findings as Record<string, unknown>)[category] = findings;
    this.notifyListeners();
  }

  public getFindings(): FindingsMap;
  public getFindings(category: FindingsCategory): FindingsMap[typeof category];
  public getFindings(
    category?: FindingsCategory,
  ): FindingsMap | FindingsMap[FindingsCategory] {
    if (category) {
      return this.findings[category];
    }
    return this.findings;
  }

  public clear(category?: FindingsCategory): void {
    if (category) {
      if (category === 'checker') {
        this.findings.checker = [];
      } else {
        (this.findings[category] as ValidationFinding[]) = [];
      }
    } else {
      this.findings = {
        headings: [],
        images: [],
        links: [],
        lists: [],
        tables: [],
        checker: [],
      };
    }
    this.notifyListeners();
  }

  public addListener(callback: FindingsListener): void {
    this.listeners.push(callback);
  }

  public removeListener(callback: FindingsListener): void {
    this.listeners = this.listeners.filter((l) => l !== callback);
  }

  private notifyListeners(): void {
    for (const cb of this.listeners) {
      cb(this.findings);
    }
  }
}
