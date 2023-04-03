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
        apiKey: "00000000-0000-0000-0000-000000000000",
        apiUrl: `http://localhost:${process.env.ZENTEST_PORT}`,
        reportId: "123456789",
        reportLabel: "My lovely Pull Request",
        reportUrl: "https://github.com",
        tags: {
          prAuthor: "danielrearden",
          prNumber: "456",
          runAttempt: "1",
          sha: "ec83d01dcaebf369444d75ed04b3625a0a645eb9",
        },
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
