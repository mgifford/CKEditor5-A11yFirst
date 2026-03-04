import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const axeSource = readFileSync(
  join(process.cwd(), 'node_modules', 'axe-core', 'axe.min.js'),
  'utf8'
);

test.describe('CKEditor5 demo site', () => {
  test('hub links include CKEditor5 and baseline URLs', async ({ page }) => {
    await page.goto('/index.html');

    await expect(page.getByRole('link', { name: 'Open CKEditor 5 demo' })).toHaveAttribute(
      'href',
      './ckeditor5-a11yfirst.html'
    );

    await expect(page.getByRole('link', { name: 'Open CKEditor 4 baseline demo' })).toHaveAttribute(
      'href',
      'https://a11yfirst.gitlab.io/custom/a11yfirst.html'
    );
  });

  test('strict mode heading ladder behavior is exposed in selector', async ({ page }) => {
    await page.goto('/ckeditor5-a11yfirst.html');

    const strictPanel = page
      .locator('section.panel')
      .filter({ has: page.getByRole('heading', { name: 'Demo 2: High-Restriction Heading Mode' }) });

    const strictEditor = strictPanel.locator('.ck-editor__editable');
    await expect(strictEditor).toBeVisible();

    await strictEditor.locator('h2').first().click();

    const allowedText = page.locator('#status-strict');
    await expect(allowedText).toContainText('Allowed now: Paragraph, Heading 2, Heading 3');

    const headingDropdownButton = strictPanel.locator('.ck-heading-dropdown .ck-dropdown__button');
    await headingDropdownButton.click();

    const paragraphButton = strictPanel.locator('.ck-heading_paragraph');
    await expect(paragraphButton).toBeVisible();

    const heading4Button = strictPanel.locator('.ck-heading_heading4');
    await expect(heading4Button).toHaveAttribute('aria-disabled', 'true');

    await strictPanel.locator('.ck-heading_heading3').click();
    await expect(allowedText).toContainText('Allowed now: Paragraph, Heading 2, Heading 3, Heading 4');

    await headingDropdownButton.click();
    const heading5Button = strictPanel.locator('.ck-heading_heading5');
    await expect(heading5Button).toHaveAttribute('aria-disabled', 'true');
  });

  test('strict mode normalizes disallowed H1 headings', async ({ page }) => {
    await page.goto('/ckeditor5-a11yfirst.html');

    await page.evaluate(() => {
      const editor = (window as unknown as { strictEditorInstance?: { setData: (html: string) => void } }).strictEditorInstance;
      if (!editor) {
        throw new Error('strict editor instance not found');
      }

      editor.setData('<h1>Bad H1</h1><h4>Jump</h4>');
    });

    await expect(page.locator('#status-strict')).toContainText('normalized disallowed heading levels');

    const strictHtml = await page.locator('.ck-editor__editable').nth(1).innerHTML();
    expect(strictHtml).not.toContain('<h1');
    expect(strictHtml).toContain('<h2');
  });

  test('axe check has no serious or critical issues on demo page shell', async ({ page }) => {
    await page.goto('/ckeditor5-a11yfirst.html');

    await page.evaluate(axeSource);

    const results = await page.evaluate(async () => {
      const axe = (window as unknown as { axe: { run: (context?: unknown, options?: unknown) => Promise<unknown> } }).axe;
      return axe.run(document, {
        runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa'] }
      });
    });

    const violations = (results as { violations: Array<{ id: string; impact: string | null }> }).violations;
    const blocking = violations.filter((violation) => violation.impact === 'serious' || violation.impact === 'critical');

    expect(blocking, JSON.stringify(blocking, null, 2)).toHaveLength(0);
  });

  test('image-focused mode runs native-image audit checks', async ({ page }) => {
    await page.goto('/ckeditor5-a11yfirst.html');

    const imagePanel = page
      .locator('section.panel')
      .filter({ has: page.getByRole('heading', { name: 'Demo 3: Image-Focused Mode' }) });

    await imagePanel.locator('#image-audit').click();

    await expect(imagePanel.locator('#image-results')).toContainText('Warnings');
    await expect(page.locator('#status-image')).toContainText('Image audit complete');
  });
});
