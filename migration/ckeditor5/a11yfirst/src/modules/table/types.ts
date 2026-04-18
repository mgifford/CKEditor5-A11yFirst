/**
 * Accessibility metadata for a table — stored outside CKEditor5's data model
 * because the classic build does not include the TableCaption plugin and
 * therefore strips <caption> elements and the deprecated `summary` attribute
 * during setData/getData cycles.
 */
export interface TableA11yData {
  /** Visible caption text that describes the table's purpose. */
  caption: string;
  /**
   * Optional summary for complex tables.  The `summary` attribute was
   * deprecated in HTML5; this value should be exposed via `aria-describedby`
   * pointing to a visible description element rather than written directly
   * onto the `<table>` tag.
   */
  summary: string;
}

/** Detailed result of a single-table accessibility check. */
export interface TableValidationResult {
  hasCaption: boolean;
  hasSummary: boolean;
  hasHeaders: boolean;
  hasScopes: boolean;
  hasEmptyHeaders: boolean;
  captionText: string | null;
  summaryText: string | null;
}
