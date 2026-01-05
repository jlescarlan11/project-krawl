import { defineConfig, devices } from "@playwright/test";
import path from "path";

/**
 * Playwright E2E Test Configuration
 * 
 * Tests run against the local development server.
 * Make sure both frontend and backend are running before executing tests.
 */
export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  timeout: 30000, // 30 seconds default timeout per test
  expect: {
    timeout: 5000, // 5 seconds for assertions
  },
  reporter: [
    ["html"],
    ["list"],
    process.env.CI ? ["github"] : ["list"],
  ],
  
  // Global setup runs before all tests
  globalSetup: require.resolve("./global-setup.ts"),
  
  use: {
    baseURL: process.env.PLAYWRIGHT_TEST_BASE_URL || "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    actionTimeout: 10000, // 10 seconds for actions (click, fill, etc.)
    navigationTimeout: 30000, // 30 seconds for navigation
  },

  projects: [
    // Desktop browsers
    {
      name: "chromium",
      use: { 
        ...devices["Desktop Chrome"],
        timeout: 30000,
      },
    },
    {
      name: "firefox",
      use: { 
        ...devices["Desktop Firefox"],
        timeout: 45000, // Increased timeout for Firefox (slower navigation)
        actionTimeout: 15000, // Increased action timeout for Firefox
        navigationTimeout: 45000, // Increased navigation timeout for Firefox
      },
    },
    {
      name: "webkit",
      use: { 
        ...devices["Desktop Safari"],
        timeout: 30000,
      },
    },
    {
      name: "msedge",
      use: { 
        ...devices["Desktop Edge"],
        timeout: 30000,
      },
    },
    
    // Mobile devices
    {
      name: "iPhone 13",
      use: { 
        ...devices["iPhone 13"],
        timeout: 30000,
      },
    },
    {
      name: "Pixel 5",
      use: { 
        ...devices["Pixel 5"],
        timeout: 30000,
      },
    },
  ],

  // WebServer configuration - set SKIP_WEBSERVER=true to run servers manually
  // This is useful on Windows if you encounter symlink permission issues
  webServer: process.env.SKIP_WEBSERVER === "true" ? undefined : [
    {
      command: process.platform === "win32" 
        ? "npm.cmd run dev -- --webpack" 
        : "npm run dev -- --webpack",
      url: "http://localhost:3000",
      reuseExistingServer: !process.env.CI,
      timeout: 180 * 1000, // Increased timeout for slower startup
      cwd: path.resolve(__dirname, "../frontend"),
      env: {
        ...process.env,
      },
    },
    {
      command: process.platform === "win32"
        ? "mvnw.cmd spring-boot:run"
        : "./mvnw spring-boot:run",
      url: "http://localhost:8080/actuator/health",
      reuseExistingServer: !process.env.CI,
      timeout: 180 * 1000, // Increased timeout for backend startup
      cwd: path.resolve(__dirname, "../backend"),
      stdout: "pipe",
      stderr: "pipe",
      // Wait for health endpoint to return 200
      // Playwright will poll this URL until it returns a successful response
    },
  ],
});


