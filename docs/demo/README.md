# CKEditor5-A11yFirst Demo Suite

This directory contains the interactive demo suite for the CKEditor5-A11yFirst project.

## Overview

The demo showcases 9 progressive accessibility-focused editor configurations demonstrating how content authors can create accessible content with targeted A11yFirst guidance.

## Demo Configurations

1. **Demo 1 - Standard A11yFirst** - Full feature set with all accessibility validators enabled
2. **Demo 2 - Strict Heading Hierarchy** - Enforces proper heading ladder (no H1, no skipped levels)
3. **Demo 3 - Image-Focused Mode** - Alt text validation with axe-core image audit
4. **Demo 4 - Link-Focused Mode** - Meaningful link text validation
5. **Demo 5 - Character Styles** - Semantic text attributes for accessibility markup
6. **Demo 6 - List Guidance** - List structure and nesting validation
7. **Demo 7 - Paragraph Formats** - Semantic block-level elements (address, blockquote, pre)
8. **Demo 8 - Table Accessibility** - Table headers, captions, and summary management
9. **Demo 9 - A11y Checker Summary** - Combined findings from all validators (axe-core + custom rules)

## Architecture

### Modular Plugin Design

The A11yFirst plugin system matches CKEditor4's customization philosophy with individual plugins:

- `A11yFirstHeadingPlugin` - Validates heading hierarchy and sequences
- `A11yFirstImagePlugin` - Image alt text validation
- `A11yFirstLinkPlugin` - Link text quality checks
- `A11yFirstListPlugin` - List structure validation
- `A11yFirstTablePlugin` - Table accessibility checks
- `A11yFirstCharacterStylesPlugin` - Semantic text attributes
- `A11yFirstA11yCheckerPlugin` - Unified accessibility summary
- `A11yFirstHelpButtonPlugin` - Help system integration

### Customization

Each demo selectively loads only the validators it needs via the `extraPlugins` configuration, allowing site integrators to create custom configurations.

## Running the Demo

1. Navigate to: `https://mgifford.github.io/CKEditor5-A11yFirst/demo/ckeditor5-a11yfirst.html`
2. Or link directly to specific demos using anchor fragments (e.g., `#demo8` for Table Accessibility)

## Asset Dependencies

- `../assets/ckeditor5/` - CKEditor5 v41.4.2 Classic build
- `../assets/a11yfirst/` - A11yFirst plugin modules
- External: axe-core v4.11.1 (via CDN)

## Content Theme

All demos use a **Solar Punk** thematic content framework emphasizing:
- Renewable energy and climate solutions
- Inclusive communities and accessibility
- People+planet balance in infrastructure planning

## Documentation Links

- [W3C Web Accessibility Tutorials](https://www.w3.org/WAI/tutorials/)
- [A11yFirst Design Philosophy](https://a11yfirst.github.io/)
- [CKEditor5 Documentation](https://ckeditor.com/docs/ckeditor5/)
