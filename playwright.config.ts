import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
const environment = process.env.TEST_ENV || 'dev';
dotenv.config({ path: path.resolve(__dirname, `config/${environment}.env`) });

/**
 * Playwright Test Configuration for SkillSprig Application
 * See https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.ts',
  
  /* Maximum time one test can run for */
  timeout: 30 * 1000,
  
  /* Test expectations timeout */
  expect: {
    timeout: 10 * 1000,
  },

  /* Run tests in files in parallel */
  fullyParallel: true,

  /* Fail the build on CI if you accidentally left test.only in the source code */
  forbidOnly: !!process.env.CI,

  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,

  /* Opt out of parallel tests on CI */
  workers: process.env.CI ? 2 : undefined,

  /* Reporter to use */
  reporter: [
    ['list'],
    ['blob'], 
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['allure-playwright', {
      outputFolder: 'allure-results',
      suiteTitle: false,
    }],
    ['./src/core/reporters/extent-reporter.ts', {
      outputFolder: 'extent-report',
    }],
  ],

  /* Shared settings for all the projects below */
  use: {
    /* Base URL to use in actions like `await page.goto('/')` */
    baseURL: process.env.BASE_URL || 'https://skillopedia.app',

    /* Collect trace when retrying the failed test */
    trace: 'on-first-retry',

    /* Screenshot on failure */
    screenshot: 'only-on-failure',

    /* Video on failure */
    video: 'retain-on-failure',

    /* Navigation timeout */
    navigationTimeout: 30 * 1000,

    /* Action timeout */
    actionTimeout: 15 * 1000,

    /* Ignore HTTPS errors */
    ignoreHTTPSErrors: true,
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'setup',
      testMatch: /global\.setup\.ts/,
    },

    // {
    //   name: 'chromium',
    //   use: { 
    //     ...devices['Desktop Chrome'],
    //     viewport: { width: 1920, height: 1080 },
    //   },
    //   dependencies: ['setup'],
    // },

    // {
    //   name: 'firefox',
    //   use: { 
    //     ...devices['Desktop Firefox'],
    //     viewport: { width: 1920, height: 1080 },
    //   },
    //   dependencies: ['setup'],
    // },

    // {
    //   name: 'webkit',
    //   use: { 
    //     ...devices['Desktop Safari'],
    //     viewport: { width: 1920, height: 1080 },
    //   },
    //   dependencies: ['setup'],
    // },

    // /* Test against mobile viewports */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    //   dependencies: ['setup'],
    // },

    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 13'] },
    //   dependencies: ['setup'],
    // },

    // /* Test against branded browsers */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    //   dependencies: ['setup'],
    // },

    {
      name: 'chrome',
      use: { ...devices['Desktop Chrome'], channel: 'chrome' },
      dependencies: ['setup'],
    },
  ],

  /* Folder for test artifacts such as screenshots, videos, traces, etc. */
  outputDir: 'test-results',

  /* Web server configuration for local development */
  // webServer: {
  //   command: 'npm run dev',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
