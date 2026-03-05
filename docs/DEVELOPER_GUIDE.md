# CKEditor 5 A11yFirst Plugin - Developer Guide

## Introduction

This guide provides developers with the technical information needed to integrate, customize, and extend the CKEditor 5 A11yFirst plugin system.

---

## Architecture Overview

### Plugin System Design

The A11yFirst plugin system is built on a **modular, pluggable architecture** that follows CKEditor5 conventions and matches the customization philosophy of CKEditor 4 A11yFirst.

```
┌─────────────────────────────────────────────────────────────┐
│                       Editor Instance                        │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────┐   │
│  │          CKEditor5 Classic Build (v41.4.2)          │   │
│  │  (Essentials, Paragraph, Bold, Italic, Link, etc.)  │   │
│  └──────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────┐   │
│  │    A11yFirst Validator Plugins (Selective Load)     │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌───────────┐  │   │
│  │  │   Heading    │  │    Image     │  │   Link    │  │   │
│  │  │   Validator  │  │   Validator  │  │ Validator │  │   │
│  │  └──────────────┘  └──────────────┘  └───────────┘  │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌───────────┐  │   │
│  │  │     List     │  │    Table     │  │Character │  │   │
│  │  │   Validator  │  │   Validator  │  │  Styles  │  │   │
│  │  └──────────────┘  └──────────────┘  └───────────┘  │   │
│  └────────────┬─────────────────────────────────────────┘   │
├──────────────┼──────────────────────────────────────────────┤
│              ↓                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         ValidationRegistry (Shared State)           │   │
│  │  - Heading findings                                 │   │
│  │  - Image findings                                   │   │
│  │  - Link findings                                    │   │
│  │  - List findings                                    │   │
│  │  - Table findings                                   │   │
│  │  - Checker summary findings                         │   │
│  │  - Event listeners for UI updates                   │   │
│  └──────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────┐   │
│  │     UI Components (Demo Specific)                    │   │
│  │  - Help Button + Modal                               │   │
│  │  - Validation Result Display                         │   │
│  │  - Form Dialogs (e.g., Table Caption Editor)        │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Validator Plugin Lifecycle

Each validator plugin follows this pattern:

```javascript
function A11yFirstXxxPlugin(editor) {
  // 1. Register with editor's plugin system
  
  // 2. Listen to data changes
  editor.model.document.on('change:data', () => {
    // 3. Analyze editor content
    const html = editor.getData();
    const findings = analyzeContent(html);
    
    // 4. Report findings to ValidationRegistry
    validationRegistry.setFindings('xxx', findings);
  });
}
```

---

## ValidationRegistry API

The **ValidationRegistry** is the central hub for collecting and distributing accessibility findings across all plugins.

### Usage

```javascript
// Access the global registry
const registry = window.A11yFirst.ValidationRegistry;

// Add a single finding
registry.addFinding('headings', {
  level: 'error',
  message: 'Heading sequence violation: H4 after H2'
});

// Set all findings for a category (replaces existing)
registry.setFindings('images', [
  { level: 'error', message: 'Image 1 missing alt text' },
  { level: 'advisory', message: 'Consider adding caption' }
]);

// Get findings for a category
const headingFindings = registry.getFindings('headings');

// Get all findings (all categories)
const allFindings = registry.getFindings();

// Listen for finding updates
registry.addListener((findings) => {
  console.log('Findings updated:', findings);
  // Update UI here
});

// Clear findings
registry.clear('images');        // Clear one category
registry.clear();               // Clear all categories
```

### Registry Structure

```javascript
{
  headings: [
    { level: 'error'|'warning'|'advisory', message: string },
    ...
  ],
  images: [...],
  links: [...],
  lists: [...],
  tables: [...],
  checker: {
    blocking: [string, ...],
    advisory: [string, ...]
  }
}
```

---

## Creating Custom Validator Plugins

### Basic Plugin Template

```javascript
// In your custom-validator.js

function A11yFirstCustomPlugin(editor) {
  // Optional: Get reference to validation registry
  const registry = window.A11yFirst.ValidationRegistry;
  
  // Listen to data changes with debouncing
  let validationTimeout;
  editor.model.document.on('change:data', () => {
    clearTimeout(validationTimeout);
    validationTimeout = setTimeout(() => {
      // Get editor content
      const html = editor.getData();
      
      // Analyze content
      const findings = [];
      
      // Example: Check for custom rules
      if (hasCustomIssue(html)) {
        findings.push({
          level: 'error',
          message: 'Custom validation error'
        });
      }
      
      // Report findings
      registry.setFindings('custom', findings);
    }, 500); // 500ms debounce
  });
}

// Helper function
function hasCustomIssue(html) {
  // Your custom validation logic
  return false;
}

// Export the plugin
window.A11yFirst.Custom = {
  plugin: A11yFirstCustomPlugin
};
```

### Integration in Editor Config

```javascript
ClassicEditor.create(element, {
  toolbar: [...],
  extraPlugins: [
    A11yFirst.Custom.plugin,
    A11yFirst.Heading.plugin,
    A11yFirst.HelpButton.plugin
  ]
}).then(editor => {
  // Access findings
  const customFindings = window.A11yFirst.ValidationRegistry.getFindings('custom');
});
```

---

## Accessing Validator Plugins

All validator plugins are available via the global `A11yFirst` namespace:

```javascript
// Character Styles (with utilities)
A11yFirst.CharacterStyles.plugin
A11yFirst.CharacterStyles.applyCustomCharacterStyle(editor, attribute)
A11yFirst.CharacterStyles.removeCustomCharacterStyles(editor)
A11yFirst.CharacterStyles.customStyleAttributes  // Array of attribute names

// Individual Validators
A11yFirst.Heading.plugin
A11yFirst.Image.plugin
A11yFirst.Link.plugin
A11yFirst.List.plugin
A11yFirst.Table.plugin

// Aggregate Validators
A11yFirst.A11yChecker.plugin  // Combines all findings

// UI Components
A11yFirst.HelpButton.plugin

// Central Registry
A11yFirst.ValidationRegistry   // Instance of ValidationRegistry class
```

---

## Editor Configuration Examples

### Minimal Configuration

```javascript
ClassicEditor.create(element, {
  toolbar: ['bold', 'italic', 'link', '|', 'undo', 'redo'],
  extraPlugins: [A11yFirst.HelpButton.plugin]
})
```

### Heading-Only Validation

```javascript
ClassicEditor.create(element, {
  toolbar: ['heading', '|', 'bold', 'italic', '|', 'undo', 'redo', '|', 'a11yFirstHelp'],
  extraPlugins: [A11yFirst.Heading.plugin, A11yFirst.HelpButton.plugin],
  heading: {
    options: [
      { model: 'heading2', view: 'h2', title: 'Heading 2' },
      { model: 'heading3', view: 'h3', title: 'Heading 3' },
      { model: 'heading4', view: 'h4', title: 'Heading 4' }
    ]
  }
})
```

### Full-Featured Configuration

```javascript
ClassicEditor.create(element, {
  toolbar: [
    'heading', '|', 
    'bold', 'italic', 'link', 'bulletedList', 'numberedList', '|',
    'blockQuote', 'insertTable', '|',
    'undo', 'redo', '|',
    'a11yFirstHelp'
  ],
  extraPlugins: [
    A11yFirst.Heading.plugin,
    A11yFirst.Image.plugin,
    A11yFirst.Link.plugin,
    A11yFirst.List.plugin,
    A11yFirst.Table.plugin,
    A11yFirst.CharacterStyles.plugin,
    A11yFirst.A11yChecker.plugin,
    A11yFirst.HelpButton.plugin
  ],
  heading: {
    options: [
      { model: 'paragraph', title: 'Paragraph' },
      { model: 'heading2', view: 'h2', title: 'Heading 2' },
      { model: 'heading3', view: 'h3', title: 'Heading 3' },
      { model: 'heading4', view: 'h4', title: 'Heading 4' }
    ]
  },
  table: {
    contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells']
  }
})
```

---

## File Structure

```
docs/
├── assets/
│   ├── ckeditor5/
│   │   └── ckeditor.classic.41.4.2.js      // CKEditor5 build
│   └── a11yfirst/
│       └── a11yfirst.js                     // All A11yFirst plugins
├── demo/
│   ├── ckeditor5-a11yfirst.html            // Demo suite (9 configs)
│   └── README.md                            // Demo documentation
├── FEATURES_OVERVIEW.md                    // Feature documentation
├── DEVELOPER_GUIDE.md                       // This file
├── index.html                               // Homepage
└── CKEditor4/                               // CKEditor4 baseline
    └── a11yfirst.html
```

### a11yfirst.js Structure

```javascript
// 1. ValidationRegistry class definition
class ValidationRegistry { ... }
const validationRegistry = new ValidationRegistry();

// 2. Character Styles Plugin
registerCharacterStyleConverters(editor) { ... }
function A11yFirstCharacterStylesPlugin(editor) { ... }

// 3. Heading Validator Plugin
function A11yFirstHeadingPlugin(editor) { ... }

// 4. Image Validator Plugin
function A11yFirstImagePlugin(editor) { ... }

// 5. Link Validator Plugin
function A11yFirstLinkPlugin(editor) { ... }

// 6. List Validator Plugin
function A11yFirstListPlugin(editor) { ... }

// 7. Table Validator Plugin
function A11yFirstTablePlugin(editor) { ... }

// 8. A11y Checker Aggregator Plugin
function A11yFirstA11yCheckerPlugin(editor) { ... }

// 9. Help Button Plugin
function A11yFirstHelpButtonPlugin(editor) { ... }

// 10. Export Public API
const namespace = global.A11yFirst || {};
namespace.CharacterStyles = { plugin: ..., ... };
namespace.Heading = { plugin: ... };
namespace.Image = { plugin: ... };
// ... more plugins
namespace.ValidationRegistry = validationRegistry;
global.A11yFirst = namespace;
```

---

## Customization Patterns

### Pattern 1: Conditional Plugin Loading

```javascript
// Load plugins based on content type
const plugins = [A11yFirst.HelpButton.plugin];

if (isArticle) {
  plugins.push(A11yFirst.Link.plugin, A11yFirst.Image.plugin);
}

if (isDataContent) {
  plugins.push(A11yFirst.Table.plugin);
}

editor = await ClassicEditor.create(element, {
  extraPlugins: plugins
});
```

### Pattern 2: Registry Monitoring

```javascript
// Monitor findings and update custom UI
const registry = window.A11yFirst.ValidationRegistry;

registry.addListener((findings) => {
  const totalErrors = findings.headings.filter(f => f.level === 'error').length +
                      findings.images.filter(f => f.level === 'error').length +
                      findings.links.filter(f => f.level === 'error').length;
  
  updateErrorBadge(totalErrors);
});
```

### Pattern 2: Custom Finding Processing

```javascript
// Process findings for external reporting
editor.model.document.on('change:data', () => {
  const findings = window.A11yFirst.ValidationRegistry.getFindings();
  
  // Send to external API
  fetch('/api/accessibility-audit', {
    method: 'POST',
    body: JSON.stringify({
      content: editor.getData(),
      findings: findings,
      timestamp: new Date().toISOString()
    })
  });
});
```

### Pattern 3: Validator Extension

```javascript
// Create a custom validator that builds on existing logic
function A11yFirstCustomHeadingPlugin(editor) {
  // Call the standard heading plugin first
  A11yFirst.Heading.plugin(editor);
  
  // Add custom rules
  editor.model.document.on('change:data', () => {
    const html = editor.getData();
    const customFindings = [];
    
    // Custom rule: Headings should be title case
    const headings = html.match(/<h[2-6][^>]*>(.*?)<\/h[2-6]>/gi) || [];
    headings.forEach(heading => {
      if (!/^[A-Z]/.test(heading)) {
        customFindings.push({
          level: 'advisory',
          message: 'Heading should start with a capital letter'
        });
      }
    });
    
    // Merge with standard findings
    const registry = window.A11yFirst.ValidationRegistry;
    const standardFindings = registry.getFindings('headings');
    registry.setFindings('headings', [...standardFindings, ...customFindings]);
  });
}
```

---

## Integration with External Tools

### Axe-Core Integration

The A11yFirst plugin can be extended to run axe-core rules:

```javascript
// In a custom validator
async function runAxeOnEditor(editor) {
  const html = editor.getData();
  const results = await axe.run(html);
  
  const findings = results.violations.map(violation => ({
    level: 'error',
    message: `${violation.id}: ${violation.impact}`,
    details: violation.nodes
  }));
  
  window.A11yFirst.ValidationRegistry.setFindings('axe', findings);
}
```

### Sa11y Overlay Integration

```javascript
// Enable Sa11y page overlay alongside A11yFirst
const script = document.createElement('script');
script.src = 'https://ryersondmp.github.io/sa11y/js/lang/en.js';
document.head.appendChild(script);

script.addEventListener('load', () => {
  Sa11y.setUpCustom({
    headingsStartWithH1: false,  // Let A11yFirst handle this
    missingAltText: false,       // Let A11yFirst handle this
  });
});
```

---

## Build & Deployment

### Development Build

```bash
cd /workspaces/plugins-dev
npm install  # If dependencies needed for testing
npm test     # Run Playwright test suite
```

### GitHub Pages Deployment

The docs are automatically deployed via `.github/workflows/pages.yml`:

1. Push to `origin/a11yfirst-master`
2. GitHub Actions syncs `/docs` to GitHub Pages
3. Available at: `https://mgifford.github.io/CKEditor5-A11yFirst/`

### Asset Paths

When moving demo pages to subdirectories (e.g., `/demo/`), update relative asset paths:

```javascript
// Before (at docs root)
<script src="./assets/ckeditor5/ckeditor.classic.41.4.2.js"></script>

// After (in docs/demo/)
<script src="../assets/ckeditor5/ckeditor.classic.41.4.2.js"></script>
```

---

## Testing

### Manual Testing

Use the demo suite to manually test configurations:
- [Demo 1 - Standard](../demo/ckeditor5-a11yfirst.html#demo1)
- [Demo 2 - Strict Heading](../demo/ckeditor5-a11yfirst.html#demo2)
- [Demo 8 - Table Editor](../demo/ckeditor5-a11yfirst.html#demo8)
- [Demo 9 - Checker Summary](../demo/ckeditor5-a11yfirst.html#demo9)

### Automated Testing

Playwright tests validate:

```bash
# Run all tests
npx playwright test migration/ckeditor5/demo-tests/tests/ckeditor5-demo.spec.ts

# Run specific test
npx playwright test -g "Demo 8"

# Run in headed mode
npx playwright test --headed
```

Test coverage includes:
- Editor initialization without critical errors
- Strict heading validation and normalization
- Image audit functionality
- Link text validation
- List detection
- Table structure validation
- Character style application
- A11y checker summary aggregation
- Help system loading

---

## Troubleshooting

### Issue: "ButtonView is not a constructor"

**Cause**: Help button plugin cannot resolve ButtonView in CDN build

**Solution**: The plugin gracefully degrades:
```javascript
// In A11yFirstHelpButtonPlugin
if (!ButtonViewCtor) {
  console.warn('A11yFirst Help: ButtonView not available...');
  return null;  // Help button not displayed, but editor loads
}
```

### Issue: ValidationRegistry is undefined

**Cause**: a11yfirst.js not loaded before creating editor

**Solution**: Ensure script loading order:
```html
<script src="../assets/ckeditor5/ckeditor.classic.41.4.2.js"></script>
<script src="../assets/a11yfirst/a11yfirst.js"></script>
<script>
  // Now A11yFirst is available
  ClassicEditor.create(element, {
    extraPlugins: [A11yFirst.Heading.plugin]
  });
</script>
```

### Issue: Findings not updating

**Cause**: Validator not listening to data changes, or registry not connected

**Solution**: Verify plugin initialization:
```javascript
// In custom plugin
editor.model.document.on('change:data', () => {
  // This MUST fire for updates to occur
  console.log('Data changed, analyzing...');
  validationRegistry.setFindings('xxx', findings);
});
```

---

## Browser Compatibility

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome | ✅ Full | Latest 2 versions |
| Firefox | ✅ Full | Latest 2 versions |
| Safari | ✅ Full | Latest 2 versions |
| Edge | ✅ Full | Latest 2 versions |
| IE 11 | ❌ Not Supported | CKEditor5 requires modern browsers |

---

## Performance Considerations

1. **Debounce Validation**: All validators use 500ms debounce to avoid excessive processing
2. **Regex Caching**: Complex patterns are evaluated once per content change
3. **Registry Listeners**: Keep listener callbacks lightweight
4. **axe-core Integration**: Run only when needed (not in real-time)

---

## Contributing

To contribute new validators or improvements:

1. Create a plugin following the template in this guide
2. Add tests in `migration/ckeditor5/demo-tests/tests/ckeditor5-demo.spec.ts`
3. Add demo configuration if a new use case
4. Update FEATURES_OVERVIEW.md with new capabilities
5. Submit PR with clear description of changes

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-03-05 | Initial release with 7 validators + checker aggregator |
| (planning) | TBD | Enhanced heading detection, custom rule builder |

---

## Support & Resources

- **Issues**: [GitHub Issues](https://github.com/a11yfirst/plugins-dev/issues)
- **Discussions**: [GitHub Discussions](https://github.com/a11yfirst/plugins-dev/discussions)
- **CKEditor5 Docs**: https://ckeditor.com/docs/ckeditor5/
- **WCAG 2.1 Standard**: https://www.w3.org/WAI/WCAG21/quickref/
- **axe-core API**: https://github.com/dequelabs/axe-core/blob/develop/doc/API.md
