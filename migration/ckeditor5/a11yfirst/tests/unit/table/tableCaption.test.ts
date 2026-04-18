import { describe, it, expect } from 'vitest';
import {
  extractTableCaption,
  extractTableSummary,
  extractTableA11yData,
  hasTableCaption,
  hasTableSummary,
} from '../../../src/modules/table/tableCaption';

// ---------------------------------------------------------------------------
// extractTableCaption
// ---------------------------------------------------------------------------
describe('extractTableCaption', () => {
  it('returns null when the table has no caption', () => {
    const html = '<table><tr><th>Year</th></tr></table>';
    expect(extractTableCaption(html)).toBeNull();
  });

  it('returns the caption text when present', () => {
    const html = '<table><caption>Energy data</caption><tr><th>Year</th></tr></table>';
    expect(extractTableCaption(html)).toBe('Energy data');
  });

  it('trims surrounding whitespace from the caption', () => {
    const html = '<table><caption>  Energy data  </caption></table>';
    expect(extractTableCaption(html)).toBe('Energy data');
  });

  it('handles a caption with attributes on the tag', () => {
    const html = '<table><caption class="custom">Solar report</caption></table>';
    expect(extractTableCaption(html)).toBe('Solar report');
  });

  it('is case-insensitive for the caption tag', () => {
    const html = '<TABLE><CAPTION>Uppercase</CAPTION></TABLE>';
    expect(extractTableCaption(html)).toBe('Uppercase');
  });

  it('returns the first caption when multiple are present', () => {
    const html = '<table><caption>First</caption><caption>Second</caption></table>';
    expect(extractTableCaption(html)).toBe('First');
  });

  it('returns null for an empty HTML string', () => {
    expect(extractTableCaption('')).toBeNull();
  });

  it('handles multi-line caption content', () => {
    const html = '<table><caption>Line one\nLine two</caption></table>';
    expect(extractTableCaption(html)).toBe('Line one\nLine two');
  });

  // CKEditor5 wraps tables in <figure class="table"> — captions inside the
  // inner <table> element must still be found.
  it('works when the table is wrapped in a CKEditor5 figure element', () => {
    const html = '<figure class="table"><table><caption>Investment priorities</caption><tr><td>data</td></tr></table></figure>';
    expect(extractTableCaption(html)).toBe('Investment priorities');
  });
});

// ---------------------------------------------------------------------------
// extractTableSummary
// ---------------------------------------------------------------------------
describe('extractTableSummary', () => {
  it('returns null when no summary attribute is present', () => {
    const html = '<table><tr><td>data</td></tr></table>';
    expect(extractTableSummary(html)).toBeNull();
  });

  it('returns the summary attribute value (double-quoted)', () => {
    const html = '<table summary="Comparison of three initiatives"><tr><td>data</td></tr></table>';
    expect(extractTableSummary(html)).toBe('Comparison of three initiatives');
  });

  it('returns the summary attribute value (single-quoted)', () => {
    const html = "<table summary='Accessibility data'><tr><td>data</td></tr></table>";
    expect(extractTableSummary(html)).toBe('Accessibility data');
  });

  it('is case-insensitive for the attribute name', () => {
    const html = '<table SUMMARY="Data summary"><tr><td>x</td></tr></table>';
    expect(extractTableSummary(html)).toBe('Data summary');
  });

  it('returns null for an empty summary value', () => {
    // An empty attribute value is treated as no summary.
    const html = '<table summary=""><tr><td>x</td></tr></table>';
    expect(extractTableSummary(html)).toBeNull();
  });

  it('trims whitespace from the summary value', () => {
    const html = '<table summary="  Spaced  "><tr><td>x</td></tr></table>';
    expect(extractTableSummary(html)).toBe('Spaced');
  });

  it('returns null for an empty HTML string', () => {
    expect(extractTableSummary('')).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// extractTableA11yData
// ---------------------------------------------------------------------------
describe('extractTableA11yData', () => {
  it('returns empty strings when neither caption nor summary is present', () => {
    const result = extractTableA11yData('<table><tr><td>x</td></tr></table>');
    expect(result.caption).toBe('');
    expect(result.summary).toBe('');
  });

  it('extracts caption and summary when both are present', () => {
    const html = '<table summary="My summary"><caption>My caption</caption><tr><td>x</td></tr></table>';
    const result = extractTableA11yData(html);
    expect(result.caption).toBe('My caption');
    expect(result.summary).toBe('My summary');
  });

  it('extracts only caption when summary is absent', () => {
    const html = '<table><caption>Only caption</caption></table>';
    const result = extractTableA11yData(html);
    expect(result.caption).toBe('Only caption');
    expect(result.summary).toBe('');
  });

  it('extracts only summary when caption is absent', () => {
    const html = '<table summary="Only summary"><tr><td>x</td></tr></table>';
    const result = extractTableA11yData(html);
    expect(result.caption).toBe('');
    expect(result.summary).toBe('Only summary');
  });

  it('works with the CKEditor5 figure wrapper HTML', () => {
    const html = '<figure class="table"><table><caption>Investment priorities</caption><thead><tr><th>Col</th></tr></thead></table></figure>';
    const result = extractTableA11yData(html);
    expect(result.caption).toBe('Investment priorities');
    expect(result.summary).toBe('');
  });
});

// ---------------------------------------------------------------------------
// hasTableCaption
// ---------------------------------------------------------------------------
describe('hasTableCaption', () => {
  it('returns true when the HTML contains a <caption> element', () => {
    const html = '<table><caption>Caption</caption></table>';
    expect(hasTableCaption(html)).toBe(true);
  });

  it('returns false when the HTML has no caption and no external caption', () => {
    const html = '<table><tr><td>x</td></tr></table>';
    expect(hasTableCaption(html)).toBe(false);
  });

  it('returns true when an external caption is provided even if HTML has none', () => {
    const html = '<table><tr><td>x</td></tr></table>';
    expect(hasTableCaption(html, 'External caption')).toBe(true);
  });

  it('returns false when the external caption is an empty string', () => {
    const html = '<table><tr><td>x</td></tr></table>';
    expect(hasTableCaption(html, '')).toBe(false);
  });

  it('returns false when the external caption is only whitespace', () => {
    const html = '<table><tr><td>x</td></tr></table>';
    expect(hasTableCaption(html, '   ')).toBe(false);
  });

  it('returns true when BOTH inline and external caption are present', () => {
    const html = '<table><caption>Inline</caption></table>';
    expect(hasTableCaption(html, 'External')).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// hasTableSummary
// ---------------------------------------------------------------------------
describe('hasTableSummary', () => {
  it('returns true when the HTML contains a summary attribute', () => {
    const html = '<table summary="My summary"><tr><td>x</td></tr></table>';
    expect(hasTableSummary(html)).toBe(true);
  });

  it('returns false when no summary attribute and no external summary', () => {
    const html = '<table><tr><td>x</td></tr></table>';
    expect(hasTableSummary(html)).toBe(false);
  });

  it('returns true when an external summary is provided and HTML has none', () => {
    const html = '<table><tr><td>x</td></tr></table>';
    expect(hasTableSummary(html, 'External summary')).toBe(true);
  });

  it('returns false when the external summary is an empty string', () => {
    const html = '<table><tr><td>x</td></tr></table>';
    expect(hasTableSummary(html, '')).toBe(false);
  });

  it('returns false when the external summary is only whitespace', () => {
    const html = '<table><tr><td>x</td></tr></table>';
    expect(hasTableSummary(html, '  ')).toBe(false);
  });
});
