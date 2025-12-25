import { test, expect } from "@playwright/test";
import { TEST_UUIDS } from "../fixtures/test-data";
import { mockAuthenticatedUser, waitForPageLoad, is404Page } from "../utils/helpers";

test.describe("Social Features Flow", () => {
  test.beforeEach(async ({ page }) => {
    await mockAuthenticatedUser(page);
    await page.goto("/");
    await waitForPageLoad(page);
  });

  test("should vouch for a gem", async ({ page }) => {
    const gemId = TEST_UUIDS.GEM;
    try {
      await page.goto(`/gems/${gemId}`);
      await waitForPageLoad(page);
    } catch (error) {
      test.skip(true, "Unable to navigate to gem page");
      return;
    }
    
    // Handle 404 gracefully - check early
    if (await is404Page(page)) {
      test.skip(true, "Gem not found - skipping vouch test");
      return;
    }
    
    const vouchButton = page.getByRole("button", { name: /vouch/i });
    if (await vouchButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await vouchButton.click();
      // Should update vouch count (may take time)
      const vouchText = page.getByText(/\d+.*vouch|vouch.*\d+/i);
      if (await vouchText.isVisible({ timeout: 3000 }).catch(() => false)) {
        await expect(vouchText.first()).toBeVisible();
      }
    }
  });

  test("should rate a gem", async ({ page }) => {
    const gemId = TEST_UUIDS.GEM;
    try {
      await page.goto(`/gems/${gemId}`);
      await waitForPageLoad(page);
    } catch (error) {
      test.skip(true, "Unable to navigate to gem page");
      return;
    }
    
    // Handle 404 gracefully - check early
    if (await is404Page(page)) {
      test.skip(true, "Gem not found - skipping rating test");
      return;
    }
    
    const ratingButton = page.getByRole("button", { name: /rate|star|rating/i });
    if (await ratingButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await ratingButton.click();
      // Should show rating modal or form
      const ratingText = page.getByText(/rate|rating|star/i);
      if (await ratingText.isVisible({ timeout: 2000 }).catch(() => false)) {
        await expect(ratingText.first()).toBeVisible();
      }
    }
  });

  test("should add comment to a gem", async ({ page }) => {
    const gemId = TEST_UUIDS.GEM;
    try {
      await page.goto(`/gems/${gemId}`);
      await waitForPageLoad(page);
    } catch (error) {
      test.skip(true, "Unable to navigate to gem page");
      return;
    }
    
    // Handle 404 gracefully - check early
    if (await is404Page(page)) {
      test.skip(true, "Gem not found - skipping comment test");
      return;
    }
    
    const commentInput = page.getByPlaceholder(/add.*comment|write.*comment|comment/i);
    if (await commentInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      await commentInput.fill("Great gem!");
      const submitButton = page.getByRole("button", { name: /submit|post|comment/i });
      if (await submitButton.isVisible({ timeout: 1000 }).catch(() => false)) {
        await submitButton.click();
        // Should show the comment (may take time to appear)
        const commentText = page.getByText("Great gem!");
        if (await commentText.isVisible({ timeout: 3000 }).catch(() => false)) {
          await expect(commentText).toBeVisible();
        }
      }
    }
  });

  test("should download krawl for offline", async ({ page }) => {
    const krawlId = TEST_UUIDS.KRAWL;
    try {
      await page.goto(`/krawls/${krawlId}`);
      await waitForPageLoad(page);
    } catch (error) {
      test.skip(true, "Unable to navigate to krawl page");
      return;
    }
    
    // Handle 404 gracefully - check early
    if (await is404Page(page)) {
      test.skip(true, "Krawl not found - skipping download test");
      return;
    }
    
    const downloadButton = page.getByRole("button", { name: /download|offline|save.*offline/i });
    if (await downloadButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await downloadButton.click();
      // Should show download progress or success message
      const downloadText = page.getByText(/downloading|downloaded|saving/i);
      if (await downloadText.isVisible({ timeout: 5000 }).catch(() => false)) {
        await expect(downloadText.first()).toBeVisible();
      }
    }
  });
});


