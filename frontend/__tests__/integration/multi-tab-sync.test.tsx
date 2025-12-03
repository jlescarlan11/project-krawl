import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useAuthStore } from "@/stores/auth-store";

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
      // Trigger storage event
      window.dispatchEvent(
        new StorageEvent("storage", {
          key,
          newValue: value,
          oldValue: store[key],
        })
      );
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

describe("Multi-Tab Synchronization", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.defineProperty(window, "localStorage", {
      value: localStorageMock,
      writable: true,
      configurable: true,
    });
    localStorageMock.clear();
  });

  afterEach(() => {
    localStorageMock.clear();
  });

  describe("storage event synchronization", () => {
    it("should sync auth state across tabs via storage events", () => {
      const store1 = useAuthStore.getState();
      const store2 = useAuthStore.getState();

      // Sign in in first tab
      const user = {
        id: "123",
        email: "test@example.com",
        name: "Test User",
      };
      const session = {
        token: "mock-jwt-token",
        expiresAt: new Date(Date.now() + 3600000).toISOString(),
      };

      store1.signIn(user, session);

      // Simulate storage event from another tab
      const storedState = localStorageMock.getItem("krawl:auth:v1");
      expect(storedState).toBeTruthy();

      // Parse and verify state
      const parsed = JSON.parse(storedState!);
      expect(parsed.state.user).toEqual(user);
      expect(parsed.state.session).toEqual(session);
    });

    it("should handle storage events with invalid data gracefully", () => {
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      // Dispatch storage event with invalid JSON
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: "krawl:auth:v1",
          newValue: "invalid-json",
          oldValue: null,
        })
      );

      // Should not throw, but log error
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining("Failed to sync from storage"),
        expect.any(Error)
      );

      consoleErrorSpy.mockRestore();
    });

    it("should sync sign-out across tabs", () => {
      const store = useAuthStore.getState();

      // First sign in
      store.signIn(
        { id: "123", email: "test@example.com", name: "Test" },
        { token: "token", expiresAt: new Date().toISOString() }
      );

      // Then sign out
      store.signOut();

      // Verify state is cleared
      const storedState = localStorageMock.getItem("krawl:auth:v1");
      const parsed = JSON.parse(storedState!);
      expect(parsed.state.user).toBeNull();
      expect(parsed.state.session).toBeNull();
      expect(parsed.state.status).toBe("idle");
    });
  });

  describe("window focus synchronization", () => {
    it("should set up focus event listener", () => {
      const addEventListenerSpy = vi.spyOn(window, "addEventListener");

      // Initialize store (triggers onRehydrateStorage)
      useAuthStore.getState();

      // Should set up focus listener
      expect(addEventListenerSpy).toHaveBeenCalledWith(
        "focus",
        expect.any(Function)
      );

      addEventListenerSpy.mockRestore();
    });
  });

  describe("concurrent operations", () => {
    it("should handle rapid state changes from multiple tabs", () => {
      const store = useAuthStore.getState();

      // Simulate rapid changes from different tabs
      for (let i = 0; i < 10; i++) {
        store.signIn(
          {
            id: `user-${i}`,
            email: `user${i}@example.com`,
            name: `User ${i}`,
          },
          {
            token: `token-${i}`,
            expiresAt: new Date().toISOString(),
          }
        );
      }

      // Should handle all changes without errors
      const storedState = localStorageMock.getItem("krawl:auth:v1");
      expect(storedState).toBeTruthy();

      const parsed = JSON.parse(storedState!);
      expect(parsed.state.user.id).toBe("user-9"); // Last update wins
    });
  });
});














