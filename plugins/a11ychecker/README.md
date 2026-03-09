CKEditor Accessibility Checker
==================================================

> **⚠️ Legacy Plugin — CKEditor 4 only**
>
> This is the CKEditor 4 version of the Accessibility Checker. It uses [Quail.js](https://github.com/quailjs/quail) as its scanning engine — a jQuery-based library that is no longer actively maintained (last updated 2016).
>
> The CKEditor 5 A11yFirst migration replaces Quail.js with [axe-core v4.11.1](https://github.com/dequelabs/axe-core), which supports WCAG 2.0, 2.1, and 2.2 and does not require jQuery.
>
> See the [checker inventory research document](../../kitty-specs/001-a11yfirst-functional-parity-specification/research/checker-inventory.md) for a full comparison and migration details.

# Overview

This package contains the distribution version of Accessibility Checker for CKEditor 4.

## Accessibility Checking Engine

This plugin uses **[Quail.js](https://github.com/quailjs/quail)** as its accessibility checking engine. Quail is bundled in `libs/quail/` and provides:

- 264 accessibility test rules
- WCAG 2.0 and Section 508 coverage
- Severity levels: `severe`, `moderate`, and `suggestion`

> **Note**: The Quail.js project is archived and no longer actively maintained. It targets WCAG 2.0 only (not WCAG 2.1 or 2.2). For modern accessibility checking, see the CKEditor 5 A11yFirst migration which uses axe-core.

## Requirements

* CKEditor **4.3.0** or later.
* [Balloon Panel](http://ckeditor.com/addon/balloonpanel) plugin for CKEditor.
* jQuery **1.x** or later in order to run [Quail](http://quailjs.org/).

## Browser Support

Accessibility Checker has [the same browser compatibility as CKEditor](http://docs.ckeditor.com/#!/guide/dev_browsers), with the following exceptions:

* Internet Explorer 8 is not supported.
* Internet Explorer 9 Quirks Mode is not supported.

## Installation

The recommended way to install Accessibility Checker is through [CKBuilder](http://ckeditor.com/builder).

Select Accessibility Checker from the list of Available Plugins and add it to your editor build - CKBuilder will automatically resolve the dependencies for you and include all necessary plugins in your configuration.

### Limitations

**Running on local filesystem:** You cannot run Accessibility Checker on a local filesystem, since Quail uses an `XMLHttpRequest` for fetching its resources. This is not allowed when working with the `file://` scheme.

## License

Copyright (c) 2014-2016 CKSource - Frederico Knabben. All rights reserved.<br>
Licensed under the terms of the [GNU General Public License Version 2 or later (the "GPL")](http://www.gnu.org/licenses/gpl.html).

See LICENSE.md for more information.
