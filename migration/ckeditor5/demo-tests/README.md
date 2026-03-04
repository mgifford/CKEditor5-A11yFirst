# CKEditor5 Demo Tests

This test suite validates the GitHub Pages demo behavior for the CKEditor5 migration.

## Coverage
- Demo hub link integrity.
- Strict heading ladder interactions.
- Normalization behavior for invalid heading structures.
- axe accessibility checks (WCAG 2.0/2.1 A/AA tags).

## Local run

```bash
cd migration/ckeditor5/demo-tests
npm install
npx playwright install --with-deps chromium
npm run test:e2e
```

## CI

GitHub Actions workflow: `.github/workflows/demo-ci.yml`
