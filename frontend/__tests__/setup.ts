import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

/**
 * Test Setup
 *
 * This file runs before each test file.
 * It sets up the testing environment and cleans up after tests.
 */

// Cleanup after each test
afterEach(() => {
  cleanup();
  // Clear localStorage
  if (typeof window !== "undefined") {
    localStorage.clear();
  }
});


