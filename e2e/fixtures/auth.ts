import { test as base, Page } from "@playwright/test";
import { mockAuthenticatedUser } from "../utils/helpers";
import { TEST_UUIDS } from "./test-data";

/**
 * Fixtures for authentication scenarios
 */

type AuthFixtures = {
  authenticatedPage: Page;
  guestPage: Page;
};

export const test = base.extend<AuthFixtures>({
  /**
   * Page with authenticated user state
   */
  authenticatedPage: async ({ page }, use) => {
    await mockAuthenticatedUser(page, TEST_UUIDS.USER);
    await use(page);
  },

  /**
   * Page with guest (unauthenticated) state
   */
  guestPage: async ({ page }, use) => {
    // Clear any existing auth state
    await page.addInitScript(() => {
      localStorage.removeItem("krawl:auth:v1");
    });
    await use(page);
  },
});

export { expect } from "@playwright/test";



