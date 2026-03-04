import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 60000,
  retries: 1,
  use: {
    baseURL: process.env.DEMO_BASE_URL || 'http://127.0.0.1:4173'
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
