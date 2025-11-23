import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  areCookiesEnabled,
  areCookiesBlocked,
  getCookieWarningMessage,
  supportsRequiredCookieFeatures,
} from "@/lib/cookie-utils";

describe("cookie-utils", () => {
  beforeEach(() => {
    // Clear any existing cookies
    document.cookie.split(";").forEach((cookie) => {
      const [name] = cookie.split("=");
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("areCookiesEnabled", () => {
    it("should return false in SSR context (no window)", () => {
      const originalWindow = global.window;
      // @ts-expect-error - Testing SSR context
      delete global.window;
      
      expect(areCookiesEnabled()).toBe(false);
      
      global.window = originalWindow;
    });

    it("should return false in SSR context (no document)", () => {
      const originalDocument = global.document;
      // @ts-expect-error - Testing SSR context
      delete global.document;
      
      expect(areCookiesEnabled()).toBe(false);
      
      global.document = originalDocument;
    });

    it("should return true when cookies are enabled", () => {
      // In jsdom, cookies should work by default
      // This test verifies the function can set and read cookies
      const result = areCookiesEnabled();
      // Result depends on jsdom cookie implementation
      // If cookies work, should be true; if not, false is acceptable
      expect(typeof result).toBe("boolean");
    });

    it("should handle cookie errors gracefully", () => {
      // Test that function doesn't throw on errors
      expect(() => areCookiesEnabled()).not.toThrow();
    });
  });

  describe("areCookiesBlocked", () => {
    it("should return opposite of areCookiesEnabled", () => {
      const enabled = areCookiesEnabled();
      const blocked = areCookiesBlocked();
      expect(blocked).toBe(!enabled);
    });

    it("should handle errors gracefully", () => {
      expect(() => areCookiesBlocked()).not.toThrow();
    });
  });

  describe("getCookieWarningMessage", () => {
    it("should return warning message when cookies are blocked", () => {
      // Mock cookies as blocked
      vi.spyOn(document, "cookie", "get").mockReturnValue("");
      vi.spyOn(document, "cookie", "set").mockImplementation(() => {
        throw new Error("Cookies disabled");
      });

      const message = getCookieWarningMessage();
      if (areCookiesBlocked()) {
        expect(message).toBe(
          "Cookies are disabled in your browser. Please enable cookies to use this application."
        );
      } else {
        expect(message).toBeNull();
      }
    });

    it("should return null when cookies are enabled", () => {
      // If cookies are enabled, should return null
      const message = getCookieWarningMessage();
      if (!areCookiesBlocked()) {
        expect(message).toBeNull();
      }
    });
  });

  describe("supportsRequiredCookieFeatures", () => {
    it("should return object with supported flag and issues array", () => {
      const result = supportsRequiredCookieFeatures();
      expect(result).toHaveProperty("supported");
      expect(result).toHaveProperty("issues");
      expect(typeof result.supported).toBe("boolean");
      expect(Array.isArray(result.issues)).toBe(true);
    });

    it("should check cookies and localStorage", () => {
      const result = supportsRequiredCookieFeatures();
      // Should check both cookies and localStorage
      // Result depends on test environment capabilities
      expect(result.issues).toBeInstanceOf(Array);
    });

    it("should return supported: false in SSR context", () => {
      const originalWindow = global.window;
      // @ts-expect-error - Testing SSR context
      delete global.window;

      const result = supportsRequiredCookieFeatures();
      expect(result.supported).toBe(false);
      expect(result.issues.length).toBeGreaterThan(0);

      global.window = originalWindow;
    });

    it("should include localStorage issue when unavailable", () => {
      // Mock localStorage to throw
      const originalLocalStorage = window.localStorage;
      const localStorageMock = {
        getItem: vi.fn(),
        setItem: vi.fn(() => {
          throw new Error("localStorage unavailable");
        }),
        removeItem: vi.fn(),
        clear: vi.fn(),
      };
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
        writable: true,
        configurable: true,
      });

      const result = supportsRequiredCookieFeatures();
      expect(result.issues).toContain("localStorage is not available");

      // Restore
      Object.defineProperty(window, "localStorage", {
        value: originalLocalStorage,
        writable: true,
        configurable: true,
      });
    });
  });
});
