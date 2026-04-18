import { describe, it, expect } from 'vitest';
import {
  validateTableAccessibility,
  extractTableFragments,
  validateAllTables,
} from '../../../src/modules/table/tableValidation';
import type { TableA11yData } from '../../../src/modules/table/types';

// ---------------------------------------------------------------------------
// Helper HTML strings
// ---------------------------------------------------------------------------

const FULL_TABLE_HTML = `
<figure class="table">
  <table>
    <caption>Community investment priorities for inclusive Solar Punk neighborhoods</caption>
    <thead>
      <tr>
        <th scope="col">Initiative</th>
        <th scope="col">Accessibility Benefit</th>
        <th scope="col">Priority</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th scope="row">Electric bus network</th>
        <td>Step-free transit</td>
        <td>High</td>
      </tr>
    </tbody>
  </table>
</figure>`;

const TABLE_NO_CAPTION = `<table><thead><tr><th scope="col">Year</th></tr></thead><tbody><tr><td>2024</td></tr></tbody></table>`;
const TABLE_NO_HEADERS = `<table><caption>Data</caption><tbody><tr><td>Year</td><td>kWh</td></tr></tbody></table>`;
const TABLE_HEADERS_NO_SCOPE = `<table><caption>Data</caption><thead><tr><th>Year</th><th>kWh</th></tr></thead><tbody><tr><td>2024</td><td>1200</td></tr></tbody></table>`;
const TABLE_EMPTY_HEADER = `<table><caption>Data</caption><thead><tr><th></th><th scope="col">kWh</th></tr></thead><tbody><tr><td>2024</td><td>1200</td></tr></tbody></table>`;
const TABLE_WITH_SUMMARY = `<table summary="Three-column table comparing initiatives"><caption>Data</caption><thead><tr><th scope="col">Name</th></tr></thead></table>`;

// ---------------------------------------------------------------------------
// validateTableAccessibility
// ---------------------------------------------------------------------------
describe('validateTableAccessibility', () => {
  it('reports all positive results for a well-formed table', () => {
    const result = validateTableAccessibility(FULL_TABLE_HTML);
    expect(result.hasCaption).toBe(true);
    expect(result.hasHeaders).toBe(true);
    expect(result.hasScopes).toBe(true);
    expect(result.hasEmptyHeaders).toBe(false);
    expect(result.captionText).toBe('Community investment priorities for inclusive Solar Punk neighborhoods');
  });

  it('reports hasCaption false when caption is absent and no external data', () => {
    const result = validateTableAccessibility(TABLE_NO_CAPTION);
    expect(result.hasCaption).toBe(false);
    expect(result.captionText).toBeNull();
  });

  it('reports hasCaption true when external caption is supplied', () => {
    const externalData: TableA11yData = {
      caption: 'Externally stored caption',
      summary: '',
    };
    const result = validateTableAccessibility(TABLE_NO_CAPTION, externalData);
    expect(result.hasCaption).toBe(true);
    expect(result.captionText).toBe('Externally stored caption');
  });

  it('reports hasCaption false when external caption is an empty string', () => {
    const externalData: TableA11yData = { caption: '', summary: '' };
    const result = validateTableAccessibility(TABLE_NO_CAPTION, externalData);
    expect(result.hasCaption).toBe(false);
  });

  it('reports hasHeaders false when no <th> elements are present', () => {
    const result = validateTableAccessibility(TABLE_NO_HEADERS);
    expect(result.hasHeaders).toBe(false);
  });

  it('reports hasScopes false when <th> elements lack scope attributes', () => {
    const result = validateTableAccessibility(TABLE_HEADERS_NO_SCOPE);
    expect(result.hasHeaders).toBe(true);
    expect(result.hasScopes).toBe(false);
  });

  it('detects empty header cells', () => {
    const result = validateTableAccessibility(TABLE_EMPTY_HEADER);
    expect(result.hasEmptyHeaders).toBe(true);
  });

  it('does not flag empty headers when all headers have content', () => {
    const result = validateTableAccessibility(FULL_TABLE_HTML);
    expect(result.hasEmptyHeaders).toBe(false);
  });

  it('reports hasSummary true when summary attribute is in the HTML', () => {
    const result = validateTableAccessibility(TABLE_WITH_SUMMARY);
    expect(result.hasSummary).toBe(true);
    expect(result.summaryText).toBe('Three-column table comparing initiatives');
  });

  it('reports hasSummary false when summary is absent and no external data', () => {
    const result = validateTableAccessibility(FULL_TABLE_HTML);
    expect(result.hasSummary).toBe(false);
    expect(result.summaryText).toBeNull();
  });

  it('reports hasSummary true when external summary is supplied', () => {
    const externalData: TableA11yData = {
      caption: '',
      summary: 'Externally stored summary',
    };
    const result = validateTableAccessibility(TABLE_NO_CAPTION, externalData);
    expect(result.hasSummary).toBe(true);
    expect(result.summaryText).toBe('Externally stored summary');
  });

  it('reports hasSummary false when external summary is empty string', () => {
    const externalData: TableA11yData = { caption: '', summary: '' };
    const result = validateTableAccessibility(TABLE_NO_CAPTION, externalData);
    expect(result.hasSummary).toBe(false);
  });

  it('inline caption takes precedence over external caption in captionText', () => {
    const externalData: TableA11yData = { caption: 'External', summary: '' };
    const result = validateTableAccessibility(FULL_TABLE_HTML, externalData);
    // Both inline and external are present; inline is returned first.
    expect(result.captionText).toBe('Community investment priorities for inclusive Solar Punk neighborhoods');
  });

  // This mirrors the real-world scenario where CKEditor5 strips <caption>
  // and the caption is preserved in external state only.
  it('validates a table whose caption is stored only in external state (CKEditor5 scenario)', () => {
    // Simulate what getData() returns after CKEditor5 strips the caption.
    const editorHtml = '<figure class="table"><table><thead><tr><th scope="col">Initiative</th></tr></thead><tbody><tr><td>Electric bus</td></tr></tbody></table></figure>';
    const externalData: TableA11yData = {
      caption: 'Community investment priorities',
      summary: '',
    };
    const result = validateTableAccessibility(editorHtml, externalData);
    expect(result.hasCaption).toBe(true);
    expect(result.captionText).toBe('Community investment priorities');
  });
});

// ---------------------------------------------------------------------------
// extractTableFragments
// ---------------------------------------------------------------------------
describe('extractTableFragments', () => {
  it('returns an empty array for HTML without tables', () => {
    expect(extractTableFragments('<p>No tables here.</p>')).toHaveLength(0);
  });

  it('extracts a single table', () => {
    const fragments = extractTableFragments('<div>' + TABLE_NO_CAPTION + '</div>');
    expect(fragments).toHaveLength(1);
    expect(fragments[0]).toContain('<table>');
  });

  it('extracts multiple tables', () => {
    const html = TABLE_NO_CAPTION + '<p>Between</p>' + TABLE_NO_HEADERS;
    const fragments = extractTableFragments(html);
    expect(fragments).toHaveLength(2);
  });

  it('returns an empty array for an empty HTML string', () => {
    expect(extractTableFragments('')).toHaveLength(0);
  });

  it('handles a CKEditor5 figure-wrapped table', () => {
    const fragments = extractTableFragments(FULL_TABLE_HTML);
    expect(fragments).toHaveLength(1);
    expect(fragments[0]).toContain('<caption>');
  });
});

// ---------------------------------------------------------------------------
// validateAllTables
// ---------------------------------------------------------------------------
describe('validateAllTables', () => {
  it('returns an empty array when no tables are found', () => {
    const results = validateAllTables('<p>No tables here.</p>');
    expect(results).toHaveLength(0);
  });

  it('returns one result per table', () => {
    const html = TABLE_NO_CAPTION + '<p>Between</p>' + TABLE_WITH_SUMMARY;
    const results = validateAllTables(html);
    expect(results).toHaveLength(2);
  });

  it('first table lacks a caption; second has one', () => {
    const html = TABLE_NO_CAPTION + TABLE_NO_HEADERS;
    const results = validateAllTables(html);
    expect(results[0].hasCaption).toBe(false);
    expect(results[1].hasCaption).toBe(true);
  });

  it('applies external data to every table', () => {
    const html = TABLE_NO_CAPTION + TABLE_HEADERS_NO_SCOPE;
    const externalData: TableA11yData = {
      caption: 'Shared external caption',
      summary: '',
    };
    const results = validateAllTables(html, externalData);
    // Both tables report hasCaption=true: first uses external, second has inline.
    expect(results.every((r) => r.hasCaption)).toBe(true);
    // First table has no inline caption → captionText comes from external data.
    expect(results[0].captionText).toBe('Shared external caption');
    // Second table has inline caption "Data" → inline takes precedence.
    expect(results[1].captionText).toBe('Data');
  });

  it('validates a well-formed table with no issues', () => {
    const results = validateAllTables(FULL_TABLE_HTML);
    expect(results).toHaveLength(1);
    const result = results[0];
    expect(result.hasCaption).toBe(true);
    expect(result.hasHeaders).toBe(true);
    expect(result.hasScopes).toBe(true);
    expect(result.hasEmptyHeaders).toBe(false);
  });

  // Regression test: validates that the CKEditor5 "no caption in getData()"
  // scenario is handled correctly end-to-end.
  it('correctly handles the CKEditor5 stripped-caption scenario', () => {
    // CKEditor5 getData() output — <caption> has been stripped.
    const editorOutput = `
      <figure class="table">
        <table>
          <thead><tr><th scope="col">Initiative</th><th scope="col">Priority</th></tr></thead>
          <tbody><tr><th scope="row">Electric bus</th><td>High</td></tr></tbody>
        </table>
      </figure>`;
    const externalData: TableA11yData = {
      caption: 'Investment priorities for inclusive Solar Punk neighborhoods',
      summary: 'Two-column table with initiative name and priority rating',
    };

    const results = validateAllTables(editorOutput, externalData);
    expect(results).toHaveLength(1);

    const result = results[0];
    expect(result.hasCaption).toBe(true);
    expect(result.captionText).toBe('Investment priorities for inclusive Solar Punk neighborhoods');
    expect(result.hasSummary).toBe(true);
    expect(result.summaryText).toBe('Two-column table with initiative name and priority rating');
    expect(result.hasHeaders).toBe(true);
    expect(result.hasScopes).toBe(true);
  });
});
