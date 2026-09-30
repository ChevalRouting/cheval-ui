import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  use: {
    baseURL: 'http://127.0.0.1:6007',
    channel: process.env.PLAYWRIGHT_CHROMIUM_CHANNEL,
  },
  projects: [
    { name: 'desktop', use: { viewport: { width: 1280, height: 900 } } },
    { name: 'mobile', use: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } },
  ],
  webServer: {
    command: 'npm run build && npm run showcase:build && npm --prefix showcase run preview -- --host 127.0.0.1 --port 6007 --strictPort',
    url: 'http://127.0.0.1:6007',
    reuseExistingServer: !process.env.CI,
  },
})
