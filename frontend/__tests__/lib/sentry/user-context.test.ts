import { describe, it, expect, vi, beforeEach } from "vitest";
import * as Sentry from "@sentry/nextjs";
import { setSentryUser, clearSentryUser } from "@/lib/sentry/user-context";
import type { User } from "@/stores/auth-store";

// Mock Sentry
vi.mock("@sentry/nextjs", () => ({
  setUser: vi.fn(),
}));

describe("user-context", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("setSentryUser", () => {
    it("should set user context with id and username", () => {
      const user: User = {
        id: "123",
        name: "Test User",
        email: "test@example.com", // Should not be included
      };

      setSentryUser(user);

      expect(Sentry.setUser).toHaveBeenCalledWith({
        id: "123",
        username: "Test User",
      });
      expect(Sentry.setUser).not.toHaveBeenCalledWith(
        expect.objectContaining({
          email: expect.anything(),
        })
      );
    });

    it("should clear user context when user is null", () => {
      setSentryUser(null);

      expect(Sentry.setUser).toHaveBeenCalledWith(null);
    });

    it("should handle Sentry errors gracefully", () => {
      // Mock Sentry.setUser to throw an error
      vi.mocked(Sentry.setUser).mockImplementation(() => {
        throw new Error("Sentry not initialized");
      });

      const user: User = {
        id: "123",
        name: "Test User",
      };

      // Should not throw
      expect(() => setSentryUser(user)).not.toThrow();
    });
  });

  describe("clearSentryUser", () => {
    it("should clear user context", () => {
      clearSentryUser();

      expect(Sentry.setUser).toHaveBeenCalledWith(null);
    });

    it("should handle Sentry errors gracefully", () => {
      // Mock Sentry.setUser to throw an error
      vi.mocked(Sentry.setUser).mockImplementation(() => {
        throw new Error("Sentry not initialized");
      });

      // Should not throw
      expect(() => clearSentryUser()).not.toThrow();
    });
  });
});
