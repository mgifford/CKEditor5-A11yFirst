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
      'https://a11yfirst.gitlab.io/CKEditor4/a11yfirst.html'
    );
  });

  test('strict mode heading ladder behavior is exposed in selector', async ({ page }) => {
    await page.goto('/ckeditor5-a11yfirst.html');

    const strictPanel = page
      .locator('section.panel')
      .filter({ has: page.getByRole('heading', { name: 'Demo 2: High-Restriction Heading Mode' }) });

    const strictEditor = strictPanel.locator('.ck-editor__editable');
    await expect(strictEditor).toBeVisible();

    await strictEditor.locator('h2').nth(1).click();

    const allowedText = page.locator('#status-strict');
    await expect(allowedText).toContainText('Allowed now: Paragraph, Heading 2, Heading 3');

    const headingDropdownButton = strictPanel.locator('.ck-heading-dropdown .ck-dropdown__button');
    await headingDropdownButton.click();

    const paragraphButton = page.locator('.ck.ck-dropdown__panel .ck-heading_paragraph').first();
    await expect(paragraphButton).toBeVisible();

    const heading4Button = page.locator('.ck.ck-dropdown__panel .ck-heading_heading4').first();
    await expect(heading4Button).toHaveAttribute('aria-disabled', 'true');

    await page.locator('.ck.ck-dropdown__panel .ck-heading_heading3').first().click();
    await expect(allowedText).toContainText('Allowed now: Paragraph, Heading 2, Heading 3, Heading 4');

    await headingDropdownButton.click();
    const heading5Button = page.locator('.ck.ck-dropdown__panel .ck-heading_heading5').first();
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

  test('image-focused mode runs axe-core audit checks', async ({ page }) => {
    await page.goto('/ckeditor5-a11yfirst.html');

    const imagePanel = page
      .locator('section.panel')
      .filter({ has: page.getByRole('heading', { name: 'Demo 3: Image-Focused Mode' }) });

    await expect(imagePanel.locator('#sa11y-enable')).toBeVisible();
    await expect(imagePanel.locator('#sa11y-status')).toContainText('disabled');

    await imagePanel.locator('#image-audit').click();

    await expect(imagePanel.locator('#image-results')).toContainText('axe-core audit');
    await expect(page.locator('#status-image')).toContainText('axe-core audit');
  });

  test('image-focused mode supports URL insert and accessibility metadata', async ({ page }) => {
    await page.goto('/ckeditor5-a11yfirst.html');

    const imagePanel = page
      .locator('section.panel')
      .filter({ has: page.getByRole('heading', { name: 'Demo 3: Image-Focused Mode' }) });

    const editorEditable = imagePanel.locator('.ck-editor__editable_inline');
    await expect(editorEditable).toBeVisible();

    const openPropsButton = imagePanel.locator('#image-props-open');
    await expect(openPropsButton).toBeHidden();

    await editorEditable.locator('img').first().click();
    await expect(openPropsButton).toBeVisible();
    await openPropsButton.click();

    const imageDialog = page.locator('#image-props-modal');
    await expect(imageDialog).toHaveClass(/open/);

    await imagePanel.locator('#image-src-input').fill('https://picsum.photos/420/210');
    await imagePanel.locator('#image-insert-url').click();
    await expect(page.locator('#status-image')).toContainText('image URL');

    await imagePanel.locator('#image-alt-input').fill('A mountain lake at sunrise');
    await imagePanel.locator('#image-longdesc-select').selectOption('after');
    await imagePanel.locator('#image-apply-metadata').click();

    await expect(page.locator('#status-image')).toContainText('metadata applied');

    const imageData = await page.evaluate(() => {
      const editor = (window as unknown as { imageEditorInstance?: { model: { document: { selection: { getSelectedElement: () => { getAttribute: (name: string) => string | null } | null } } } } }).imageEditorInstance;

      if (!editor) {
        throw new Error('image editor instance not found');
      }

      const selected = editor.model.document.selection.getSelectedElement();
      if (!selected) {
        throw new Error('no selected image after metadata apply');
      }

      return {
        alt: selected.getAttribute('alt') || '',
        longDesc: selected.getAttribute('a11yLongDescPosition') || ''
      };
    });

    expect(imageData.alt).toBe('A mountain lake at sunrise');
    expect(imageData.longDesc).toBe('after');
  });

  test('image properties modal auto-closes when image selection is cleared', async ({ page }) => {
    await page.goto('/ckeditor5-a11yfirst.html');

    const imagePanel = page
      .locator('section.panel')
      .filter({ has: page.getByRole('heading', { name: 'Demo 3: Image-Focused Mode' }) });

    const editorEditable = imagePanel.locator('.ck-editor__editable_inline');
    await expect(editorEditable).toBeVisible();

    const openPropsButton = imagePanel.locator('#image-props-open');
    await expect(openPropsButton).toBeHidden();

    await editorEditable.locator('img').first().click();
    await expect(openPropsButton).toBeVisible();
    await openPropsButton.click();

    const imageDialog = page.locator('#image-props-modal');
    await expect(imageDialog).toHaveClass(/open/);

    await editorEditable.locator('p').first().click();

    await expect(imageDialog).not.toHaveClass(/open/);
    await expect(openPropsButton).toBeHidden();
  });

  test('image properties modal opens from right-click image context action', async ({ page }) => {
    await page.goto('/ckeditor5-a11yfirst.html');

    const imagePanel = page
      .locator('section.panel')
      .filter({ has: page.getByRole('heading', { name: 'Demo 3: Image-Focused Mode' }) });

    const editorEditable = imagePanel.locator('.ck-editor__editable_inline');
    await expect(editorEditable).toBeVisible();

    await editorEditable.locator('img').first().click({ button: 'right' });

    const contextMenu = imagePanel.locator('#image-context-menu');
    await expect(contextMenu).toHaveClass(/open/);
    await imagePanel.locator('#image-context-open-props').click();

    const imageDialog = imagePanel.locator('#image-props-modal');
    await expect(imageDialog).toHaveClass(/open/);
    await expect(page.locator('#status-image')).toContainText('dialog opened');
  });

  test('link-focused mode opens properties from toolbar and validates display text', async ({ page }) => {
    await page.goto('/ckeditor5-a11yfirst.html');

    const linkPanel = page
      .locator('section.panel')
      .filter({ has: page.getByRole('heading', { name: 'Demo 4: Link-Focused Mode' }) });

    const editorEditable = linkPanel.locator('.ck-editor__editable_inline');
    await expect(editorEditable).toBeVisible();

    const openPropsButton = linkPanel.locator('#link-props-open');
    await expect(openPropsButton).toBeHidden();

    await editorEditable.locator('a').first().click();
    await expect(openPropsButton).toBeVisible();
    await openPropsButton.click();

    const linkDialog = linkPanel.locator('#link-props-modal');
    await expect(linkDialog).toHaveClass(/open/);

    await linkPanel.locator('#link-display-input').fill('');
    await linkPanel.locator('#link-apply').click();
    await expect(page.locator('#status-link')).toContainText('Please type the display text for the link');

    await linkPanel.locator('#link-display-input').fill('Accessibility guide');
    await linkPanel.locator('#link-url-input').fill('https://example.org/new-guide');
    await linkPanel.locator('#link-apply').click();
    await expect(page.locator('#status-link')).toContainText('Updated link destination');
  });

  test('link-focused mode opens properties from right-click link context action', async ({ page }) => {
    await page.goto('/ckeditor5-a11yfirst.html');

    const linkPanel = page
      .locator('section.panel')
      .filter({ has: page.getByRole('heading', { name: 'Demo 4: Link-Focused Mode' }) });

    const editorEditable = linkPanel.locator('.ck-editor__editable_inline');
    await expect(editorEditable).toBeVisible();

    await editorEditable.locator('a').first().click({ button: 'right' });

    const contextMenu = linkPanel.locator('#link-context-menu');
    await expect(contextMenu).toHaveClass(/open/);
    await linkPanel.locator('#link-context-open-props').click();

    const linkDialog = linkPanel.locator('#link-props-modal');
    await expect(linkDialog).toHaveClass(/open/);
  });
});
