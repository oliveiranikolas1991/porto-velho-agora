import { existsSync } from 'node:fs';
import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  testDir: './e2e', timeout: 90000, workers: 1, reporter: [['list'], ['json', { outputFile: 'test-results/e2e.json' }]],
  use: { proxy: process.env.BASE_URL?.startsWith('https:') && process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY } : undefined, baseURL: process.env.BASE_URL || 'http://localhost:3000', launchOptions: { executablePath: process.env.CHROMIUM_PATH || (existsSync('/usr/bin/chromium') ? '/usr/bin/chromium' : undefined), args: ['--no-sandbox', ...(process.env.CHROMIUM_TRUSTED_PROXY_SPKI ? [`--ignore-certificate-errors-spki-list=${process.env.CHROMIUM_TRUSTED_PROXY_SPKI}`] : [])] } },
  projects: [ { name: 'desktop', use: { ...devices['Desktop Chrome'] } }, { name: 'mobile', use: { ...devices['Pixel 7'], defaultBrowserType: 'chromium' } } ]
});
