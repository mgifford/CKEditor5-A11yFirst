# CKEditor5 Demo Tests

This test suite validates the GitHub Pages demo behavior for the CKEditor5 migration.

## Coverage
- Demo hub link integrity.
- Strict heading ladder interactions.
- Normalization behavior for invalid heading structures.
- axe accessibility checks (WCAG 2.0/2.1 A/AA tags).

## Checker direction
- Preferred checker path is Sa11y + axe-core for browser-side guidance and custom checks.
- Keep Playwright + axe-core in CI for deterministic regression coverage.
- `pa11y` is intentionally out of scope for this demo track.

## Local run

```bash
cd migration/ckeditor5/demo-tests
npm install
npm run pw:install:chromium
npm run test:e2e
```

## Runtime dependency workaround

If Chromium fails to launch locally due missing system libraries (for example `libatk-1.0.so.0`), use Firefox for local validation:

```bash
cd migration/ckeditor5/demo-tests
npm install
npm run pw:install:firefox
npm run test:e2e:firefox
```

Notes:
- CI remains Chromium-based for consistency with current pipeline.
- Local browser selection is controlled via `PLAYWRIGHT_BROWSER` in `playwright.config.ts`.

## CI

GitHub Actions workflow: `.github/workflows/demo-ci.yml`
