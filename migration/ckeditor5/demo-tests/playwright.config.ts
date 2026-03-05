import { defineConfig } from '@playwright/test';

function resolveBrowserName(): 'chromium' | 'firefox' | 'webkit' {
  const value = (process.env.PLAYWRIGHT_BROWSER || 'chromium').toLowerCase();

  if (value === 'firefox' || value === 'webkit' || value === 'chromium') {
    return value;
  }

  return 'chromium';
}

const browserName = resolveBrowserName();

export default defineConfig({
  testDir: './tests',
  timeout: 60000,
  retries: 1,
  use: {
    browserName,
    baseURL: process.env.DEMO_BASE_URL || 'http://127.0.0.1:4173',
    actionTimeout: 30000
  },
  webServer: process.env.DEMO_BASE_URL
    ? undefined
    : {
        command: 'npm run serve:docs',
        port: 4173,
        reuseExistingServer: true,
        timeout: 120000
      }
});
