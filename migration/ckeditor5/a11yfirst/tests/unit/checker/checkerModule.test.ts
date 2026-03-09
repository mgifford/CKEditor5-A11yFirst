import { describe, it, expect } from 'vitest';
import {
  checkHeadingSequence,
  checkLinkText,
  checkImageAlt,
  checkTableStructure,
  buildCheckerResult,
  runCustomChecks,
} from '../../../src/modules/checker/checkerModule';
import type { CheckerFinding } from '../../../src/modules/checker/types';

// ---------------------------------------------------------------------------
// checkHeadingSequence
// ---------------------------------------------------------------------------
describe('checkHeadingSequence', () => {
  it('returns no findings for a valid heading sequence', () => {
    expect(checkHeadingSequence('<h2>Section</h2><h3>Sub</h3>')).toHaveLength(0);
  });

  it('returns a finding when a heading level is skipped', () => {
    const findings = checkHeadingSequence('<h2>Section</h2><h4>Sub</h4>');
    expect(findings).toHaveLength(1);
    expect(findings[0].id).toBe('a11yfirst-heading-sequence');
    expect(findings[0].blocking).toBe(true);
    expect(findings[0].severity).toBe('severe');
    expect(findings[0].wcagRef).toBe('1.3.1');
  });

  it('returns no findings for a single heading', () => {
    expect(checkHeadingSequence('<h2>Only heading</h2>')).toHaveLength(0);
  });

  it('returns no findings for empty HTML', () => {
    expect(checkHeadingSequence('')).toHaveLength(0);
    expect(checkHeadingSequence('<p>No headings here.</p>')).toHaveLength(0);
  });

  it('detects multiple skip points', () => {
    // h2 → h4 is a skip; h4 → h6 is also a skip
    const findings = checkHeadingSequence('<h2>A</h2><h4>B</h4><h6>C</h6>');
    expect(findings.length).toBeGreaterThanOrEqual(2);
  });
});

// ---------------------------------------------------------------------------
// checkLinkText
// ---------------------------------------------------------------------------
describe('checkLinkText', () => {
  it('returns no findings for a descriptive link', () => {
    expect(checkLinkText('<a href="/solar">Read the solar guide</a>')).toHaveLength(0);
  });

  it('flags "click here" as non-descriptive', () => {
    const findings = checkLinkText('<a href="/page">click here</a>');
    expect(findings).toHaveLength(1);
    expect(findings[0].id).toBe('a11yfirst-link-text');
    expect(findings[0].blocking).toBe(true);
  });

  it('flags an empty link', () => {
    const findings = checkLinkText('<a href="/page"></a>');
    expect(findings).toHaveLength(1);
  });

  it('flags "read more"', () => {
    const findings = checkLinkText('<p>See <a href="/page">read more</a> about solar.</p>');
    expect(findings).toHaveLength(1);
  });

  it('does not flag links with meaningful text', () => {
    expect(checkLinkText('<a href="/page">Community solar installation guide 2025</a>')).toHaveLength(0);
  });

  it('returns no findings for HTML without links', () => {
    expect(checkLinkText('<p>No links here.</p>')).toHaveLength(0);
  });

  it('is case-insensitive for generic phrases', () => {
    expect(checkLinkText('<a href="/page">Click Here</a>')).toHaveLength(1);
  });
});

// ---------------------------------------------------------------------------
// checkImageAlt
// ---------------------------------------------------------------------------
describe('checkImageAlt', () => {
  it('returns no findings when all images have non-empty alt', () => {
    expect(checkImageAlt('<img src="sun.jpg" alt="Solar panels">')).toHaveLength(0);
  });

  it('flags an image with no alt attribute', () => {
    const findings = checkImageAlt('<img src="sun.jpg">');
    expect(findings).toHaveLength(1);
    expect(findings[0].id).toBe('a11yfirst-image-alt-missing');
    expect(findings[0].blocking).toBe(true);
  });

  it('returns an advisory finding for empty alt text', () => {
    const findings = checkImageAlt('<img src="decorative.png" alt="">');
    expect(findings).toHaveLength(1);
    expect(findings[0].id).toBe('a11yfirst-image-alt-empty');
    expect(findings[0].blocking).toBe(false);
    expect(findings[0].severity).toBe('suggestion');
  });

  it('handles single-quoted alt attributes', () => {
    expect(checkImageAlt("<img src='sun.jpg' alt='Solar panels'>")).toHaveLength(0);
  });

  it('returns no findings for HTML without images', () => {
    expect(checkImageAlt('<p>No images here.</p>')).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// checkTableStructure
// ---------------------------------------------------------------------------
describe('checkTableStructure', () => {
  it('returns no findings for a well-formed table', () => {
    const html = '<table><caption>Energy data</caption><tr><th scope="col">Year</th><th scope="col">kWh</th></tr><tr><td>2024</td><td>1200</td></tr></table>';
    expect(checkTableStructure(html)).toHaveLength(0);
  });

  it('flags a table missing a caption', () => {
    const html = '<table><tr><th scope="col">Year</th></tr><tr><td>2024</td></tr></table>';
    const findings = checkTableStructure(html);
    const captionFinding = findings.find((f) => f.id === 'a11yfirst-table-caption');
    expect(captionFinding).toBeDefined();
    expect(captionFinding?.blocking).toBe(false);
  });

  it('flags a table missing header cells', () => {
    const html = '<table><caption>Data</caption><tr><td>Year</td><td>kWh</td></tr></table>';
    const findings = checkTableStructure(html);
    const headerFinding = findings.find((f) => f.id === 'a11yfirst-table-headers');
    expect(headerFinding).toBeDefined();
    expect(headerFinding?.blocking).toBe(true);
  });

  it('returns no findings for HTML without tables', () => {
    expect(checkTableStructure('<p>No tables here.</p>')).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// buildCheckerResult
// ---------------------------------------------------------------------------
describe('buildCheckerResult', () => {
  it('returns an empty result for no findings', () => {
    const result = buildCheckerResult([]);
    expect(result.findings).toHaveLength(0);
    expect(result.blocking).toHaveLength(0);
    expect(result.advisory).toHaveLength(0);
    expect(typeof result.timestamp).toBe('string');
  });

  it('sorts blocking findings before advisory', () => {
    const findings: CheckerFinding[] = [
      {
        id: 'advisory',
        message: 'Advisory issue',
        severity: 'suggestion',
        blocking: false,
        source: 'custom',
      },
      {
        id: 'blocking',
        message: 'Blocking issue',
        severity: 'severe',
        blocking: true,
        source: 'custom',
      },
    ];

    const result = buildCheckerResult(findings);
    expect(result.findings[0].id).toBe('blocking');
    expect(result.findings[1].id).toBe('advisory');
  });

  it('populates blocking and advisory subsets correctly', () => {
    const findings: CheckerFinding[] = [
      { id: 'b1', message: 'm1', severity: 'severe', blocking: true, source: 'custom' },
      { id: 'a1', message: 'm2', severity: 'suggestion', blocking: false, source: 'custom' },
      { id: 'b2', message: 'm3', severity: 'moderate', blocking: true, source: 'axe-core' },
    ];

    const result = buildCheckerResult(findings);
    expect(result.blocking).toHaveLength(2);
    expect(result.advisory).toHaveLength(1);
  });

  it('includes a valid ISO timestamp', () => {
    const result = buildCheckerResult([]);
    expect(() => new Date(result.timestamp)).not.toThrow();
    expect(new Date(result.timestamp).getFullYear()).toBeGreaterThanOrEqual(2024);
  });
});

// ---------------------------------------------------------------------------
// runCustomChecks (integration across all rules)
// ---------------------------------------------------------------------------
describe('runCustomChecks', () => {
  it('returns no findings for clean content', () => {
    const html = '<h2>Clean</h2><h3>Sub</h3><p><a href="/guide">Read the energy guide</a></p><img src="solar.jpg" alt="Solar panels"><table><caption>Data</caption><tr><th scope="col">Year</th></tr><tr><td>2024</td></tr></table>';
    const result = runCustomChecks(html);
    expect(result.findings).toHaveLength(0);
  });

  it('detects multiple types of issues in problematic content', () => {
    const html = '<h2>Title</h2><h4>Skipped level</h4><p><a href="/">click here</a></p><img src="logo.png"><table><tr><td>No headers</td></tr></table>';
    const result = runCustomChecks(html);

    const ids = result.findings.map((f) => f.id);
    expect(ids).toContain('a11yfirst-heading-sequence');
    expect(ids).toContain('a11yfirst-link-text');
    expect(ids).toContain('a11yfirst-image-alt-missing');
    expect(ids).toContain('a11yfirst-table-headers');
  });

  it('puts blocking issues first in the findings array', () => {
    const html = '<img src="logo.png" alt=""><table><tr><td>No headers</td></tr></table>';
    const result = runCustomChecks(html);
    if (result.findings.length >= 2) {
      const firstBlocking = result.findings.findIndex((f) => f.blocking);
      const firstNonBlocking = result.findings.findIndex((f) => !f.blocking);
      if (firstBlocking !== -1 && firstNonBlocking !== -1) {
        expect(firstBlocking).toBeLessThan(firstNonBlocking);
      }
    }
  });
});
