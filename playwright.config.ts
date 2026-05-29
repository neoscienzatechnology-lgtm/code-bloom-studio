import { defineConfig, devices } from "@playwright/test";

// Self-contained Playwright config. Expects the dev server to already be running
// on http://localhost:8080 (run `npm run dev` in another terminal). To launch
// the server automatically, uncomment the `webServer` block below.
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: "list",
  use: {
    baseURL: "http://localhost:8080",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  // webServer: {
  //   command: "npm run dev",
  //   url: "http://localhost:8080",
  //   reuseExistingServer: true,
  //   timeout: 120_000,
  // },
});
