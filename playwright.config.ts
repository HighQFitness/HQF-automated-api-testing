import { config } from '@config/appConfig';
import { defineConfig } from '@playwright/test';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './src/services',
  /* Global setup and teardown */
  globalSetup: require.resolve('./global-setup.ts'),
  globalTeardown: require.resolve('./global-teardown.ts'),
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  // Use list reporter locally for readable output, github reporter only in CI
  reporter: process.env.CI === 'true' ? [['github']] : [['list']],
  use: {
    baseURL: config.api.baseUrl,
    // Headers are managed in APIRequestContext, not here
  },

  /* Test projects with tagging support */
  projects: [
    {
      name: 'api-tests',
      use: {},
    },
    {
      name: 'smoke',
      testMatch: /.*\.smoke\.spec\.ts$/,
      use: {},
    },
    {
      name: 'regression',
      testMatch: /.*\.spec\.ts$/,
      grep: /@smoke|@critical/,
      use: {},
    },
    {
      name: 'critical',
      testMatch: /.*\.spec\.ts$/,
      grep: /@critical/,
      use: {},
    },
  ],
});
