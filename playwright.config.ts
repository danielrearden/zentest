import { defineConfig, devices } from "@playwright/test";

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./tests",
  timeout: 10_000,
  expect: {
    /**
     * Maximum time expect() should wait for the condition to be met.
     * For example in `await expect(locator).toHaveText();`
     */
    timeout: 3_000,
  },
  fullyParallel: true,
  retries: 1,
  reporter: [
    ["html", { open: "never" }],
    [
      "./reporters/playwright/dist/index.js",
      {
        apiKey: "2716dfff-fce6-4a53-be3b-36db7e31bbea",
        apiUrl: `http://localhost:${process.env.ZENTEST_PORT}`,
        reportId: "SOME_OTHER_PR",
        reportLabel: "Another label",
        reportUrl: "https://playwright.dev",
      },
    ],
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
    actionTimeout: 0,
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: "http://localhost:5173",

    screenshot: "on",

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",

    video: "on",
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  /* Folder for test artifacts such as screenshots, videos, traces, etc. */
  outputDir: "test-results/",
});
