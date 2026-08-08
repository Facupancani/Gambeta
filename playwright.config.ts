import { defineConfig, devices } from "@playwright/test";

// Chromium-only on purpose — this is a portfolio demo, not a browser
// compatibility matrix. Standalone `@playwright/test` rather than Next's
// experimental `next experimental-test` wrapper (that one requires
// `experimental.testProxy: true` in next.config.ts and has sparse docs
// for this Next version — see BACKLOG.md "Pase portfolio-ready" for why
// the stable, well-documented path was chosen instead).
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: "list",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
