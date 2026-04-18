export type { TableA11yData, TableValidationResult } from './types';
export {
  extractTableCaption,
  extractTableSummary,
  extractTableA11yData,
  hasTableCaption,
  hasTableSummary,
} from './tableCaption';
export {
  validateTableAccessibility,
  extractTableFragments,
  validateAllTables,
} from './tableValidation';
