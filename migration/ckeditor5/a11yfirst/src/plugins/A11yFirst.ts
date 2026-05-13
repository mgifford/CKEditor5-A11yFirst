/**
 * A11yFirst — the main plugin bundle.
 *
 * Including `A11yFirst` in your CKEditor5 configuration automatically loads
 * all A11yFirst sub-plugins:
 *
 * | Sub-plugin                       | What it does                                |
 * |----------------------------------|---------------------------------------------|
 * | `A11yFirstHeadingPlugin`         | Enforces accessible heading hierarchy       |
 * | `A11yFirstImagePlugin`           | Validates image alternative text            |
 * | `A11yFirstLinkPlugin`            | Validates link text quality                 |
 * | `A11yFirstListPlugin`            | Validates list structure                    |
 * | `A11yFirstTablePlugin`           | Validates table structure + labels cells    |
 * | `A11yFirstCheckerPlugin`         | Combined axe-core + custom WCAG checker     |
 * | `A11yFirstCharacterStylesPlugin` | Accessible inline character styles          |
 * | `A11yFirstHelpPlugin`            | Help-topics dropdown toolbar button         |
 *
 * ### Usage
 * ```js
 * import { A11yFirst } from 'ckeditor5-a11yfirst';
 *
 * ClassicEditor.create(document.querySelector('#editor'), {
 *   plugins: [A11yFirst, ...otherPlugins],
 *   toolbar: [..., 'a11yFirstHelp'],
 * });
 * ```
 */

import { PluginBase } from '../ckeditor5-types.js';
import { A11yFirstHeadingPlugin } from './A11yFirstHeadingPlugin.js';
import { A11yFirstImagePlugin } from './A11yFirstImagePlugin.js';
import { A11yFirstLinkPlugin } from './A11yFirstLinkPlugin.js';
import { A11yFirstListPlugin } from './A11yFirstListPlugin.js';
import { A11yFirstTablePlugin } from './A11yFirstTablePlugin.js';
import { A11yFirstCheckerPlugin } from './A11yFirstCheckerPlugin.js';
import { A11yFirstCharacterStylesPlugin } from './A11yFirstCharacterStylesPlugin.js';
import { A11yFirstHelpPlugin } from './A11yFirstHelpPlugin.js';

export class A11yFirst extends PluginBase {
  public static override get pluginName(): string {
    return 'A11yFirst';
  }

  public static override get requires(): Array<typeof PluginBase> {
    return [
      A11yFirstHeadingPlugin,
      A11yFirstImagePlugin,
      A11yFirstLinkPlugin,
      A11yFirstListPlugin,
      A11yFirstTablePlugin,
      A11yFirstCheckerPlugin,
      A11yFirstCharacterStylesPlugin,
      A11yFirstHelpPlugin,
    ];
  }

  public init(): void {
    // All behaviour is handled by the sub-plugins listed in `requires`.
    // This plugin exists only as a convenient single-entry-point bundle.
  }
}
