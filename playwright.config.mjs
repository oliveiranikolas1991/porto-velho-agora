import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  testDir: './e2e', timeout: 90000, workers: 1, reporter: [['list'], ['json', { outputFile: 'test-results/e2e.json' }]],
  use: { baseURL: process.env.BASE_URL || 'http://localhost:3000', launchOptions: { executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', args: ['--no-sandbox'] } },
  projects: [ { name: 'desktop', use: { ...devices['Desktop Chrome'] } }, { name: 'mobile', use: { ...devices['Pixel 7'], defaultBrowserType: 'chromium' } } ]
});
