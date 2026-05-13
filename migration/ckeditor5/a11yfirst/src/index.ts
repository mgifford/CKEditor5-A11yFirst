// CKEditor5 type interfaces and plugin base class
export * from './ckeditor5-types.js';

// Core utilities
export { ValidationRegistry } from './core/validationRegistry.js';
export type { ValidationFinding, FindingsMap, CheckerSummary, FindingsCategory, FindingLevel, FindingsListener } from './core/validationRegistry.js';
export { createToolbarState } from './core/toolbarState.js';
export type { ToolbarState } from './core/toolbarState.js';

// CKEditor5 plugin classes (the primary public API)
export * from './plugins/index.js';

// Lower-level logic modules (available for advanced consumers)
export * from './modules/heading/index.js';
export * from './modules/checker/index.js';
export * from './modules/table/index.js';
