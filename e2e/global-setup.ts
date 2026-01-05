import { checkBackendHealth, waitForBackendReady } from "./utils/helpers";

/**
 * Global setup for E2E tests
 * Runs before all tests to ensure backend and frontend are ready
 */
async function globalSetup() {
  const backendURL = process.env.PLAYWRIGHT_TEST_BACKEND_URL || "http://localhost:8080";
  const frontendURL = process.env.PLAYWRIGHT_TEST_BASE_URL || "http://localhost:3000";

  console.log("🔍 Checking backend health...");
  const backendReady = await waitForBackendReady(backendURL, 20, 2000);
  
  if (!backendReady) {
    console.warn("⚠️  Backend health check failed - tests may fail if backend is required");
    console.warn(`⚠️  Backend URL: ${backendURL}/actuator/health`);
    console.warn("⚠️  Some tests will skip gracefully when backend is unavailable");
  } else {
    console.log("✅ Backend is ready");
  }

  console.log("🔍 Checking frontend accessibility...");
  try {
    const response = await fetch(frontendURL, {
      method: "GET",
      signal: AbortSignal.timeout(10000), // Increased timeout
      headers: {
        "Accept": "text/html",
      },
    });
    if (response.ok) {
      console.log("✅ Frontend is accessible");
    } else {
      console.warn(`⚠️  Frontend returned status ${response.status}`);
    }
  } catch (error: any) {
    console.warn("⚠️  Frontend accessibility check failed:", error?.message || error);
    console.warn("⚠️  Tests may fail if frontend is not running");
  }

  console.log("✅ Global setup complete");
}

export default globalSetup;

