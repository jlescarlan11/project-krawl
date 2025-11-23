import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  isSessionExpired,
  getTimeUntilExpiration,
  isSessionExpiringSoon,
  formatTimeUntilExpiration,
} from "@/lib/session-utils";

describe("session-utils", () => {
  beforeEach(() => {
    // Mock Date.now() to have consistent test results
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("isSessionExpired", () => {
    it("should return true for expired session (Date object)", () => {
      const expired = new Date(Date.now() - 1000); // 1 second ago
      expect(isSessionExpired(expired)).toBe(true);
    });

    it("should return true for expired session (string)", () => {
      const expired = new Date(Date.now() - 1000).toISOString();
      expect(isSessionExpired(expired)).toBe(true);
    });

    it("should return false for valid session (Date object)", () => {
      const valid = new Date(Date.now() + 3600000); // 1 hour from now
      expect(isSessionExpired(valid)).toBe(false);
    });

    it("should return false for valid session (string)", () => {
      const valid = new Date(Date.now() + 3600000).toISOString();
      expect(isSessionExpired(valid)).toBe(false);
    });

    it("should return true for invalid date", () => {
      const invalid = new Date("invalid");
      expect(isSessionExpired(invalid)).toBe(true);
    });

    it("should return true for invalid date string", () => {
      expect(isSessionExpired("invalid-date")).toBe(true);
    });

    it("should return true for exactly expired session (edge case)", () => {
      const now = new Date();
      vi.setSystemTime(now);
      expect(isSessionExpired(now)).toBe(true);
    });
  });

  describe("getTimeUntilExpiration", () => {
    it("should return correct time until expiration", () => {
      const now = Date.now();
      vi.setSystemTime(now);
      const expires = new Date(now + 3600000); // 1 hour from now
      const timeUntil = getTimeUntilExpiration(expires);
      expect(timeUntil).toBeCloseTo(3600000, -3); // Within 1 second
    });

    it("should return negative for expired session", () => {
      const now = Date.now();
      vi.setSystemTime(now);
      const expired = new Date(now - 1000); // 1 second ago
      const timeUntil = getTimeUntilExpiration(expired);
      expect(timeUntil).toBeLessThan(0);
    });

    it("should return -1 for invalid date", () => {
      const invalid = new Date("invalid");
      expect(getTimeUntilExpiration(invalid)).toBe(-1);
    });

    it("should handle string dates", () => {
      const now = Date.now();
      vi.setSystemTime(now);
      const expires = new Date(now + 3600000).toISOString();
      const timeUntil = getTimeUntilExpiration(expires);
      expect(timeUntil).toBeCloseTo(3600000, -3);
    });
  });

  describe("isSessionExpiringSoon", () => {
    it("should return true if expiring within threshold", () => {
      const now = Date.now();
      vi.setSystemTime(now);
      const expires = new Date(now + 1800000); // 30 minutes
      expect(isSessionExpiringSoon(expires, 3600000)).toBe(true); // 1 hour threshold
    });

    it("should return false if not expiring soon", () => {
      const now = Date.now();
      vi.setSystemTime(now);
      const expires = new Date(now + 7200000); // 2 hours
      expect(isSessionExpiringSoon(expires, 3600000)).toBe(false); // 1 hour threshold
    });

    it("should return false if already expired", () => {
      const now = Date.now();
      vi.setSystemTime(now);
      const expired = new Date(now - 1000); // 1 second ago
      expect(isSessionExpiringSoon(expired, 3600000)).toBe(false);
    });

    it("should use default threshold of 1 hour", () => {
      const now = Date.now();
      vi.setSystemTime(now);
      const expires = new Date(now + 1800000); // 30 minutes
      expect(isSessionExpiringSoon(expires)).toBe(true); // Default 1 hour threshold
    });

    it("should handle string dates", () => {
      const now = Date.now();
      vi.setSystemTime(now);
      const expires = new Date(now + 1800000).toISOString();
      expect(isSessionExpiringSoon(expires, 3600000)).toBe(true);
    });
  });

  describe("formatTimeUntilExpiration", () => {
    it("should return 'Expired' for expired session", () => {
      const now = Date.now();
      vi.setSystemTime(now);
      const expired = new Date(now - 1000);
      expect(formatTimeUntilExpiration(expired)).toBe("Expired");
    });

    it("should format hours and minutes correctly", () => {
      const now = Date.now();
      vi.setSystemTime(now);
      const expires = new Date(now + 2 * 60 * 60 * 1000 + 30 * 60 * 1000); // 2h 30m
      const formatted = formatTimeUntilExpiration(expires);
      expect(formatted).toContain("2 hour");
      expect(formatted).toContain("30 minute");
    });

    it("should format only minutes when less than 1 hour", () => {
      const now = Date.now();
      vi.setSystemTime(now);
      const expires = new Date(now + 30 * 60 * 1000); // 30 minutes
      const formatted = formatTimeUntilExpiration(expires);
      expect(formatted).toBe("30 minutes");
    });

    it("should use singular form for 1 hour", () => {
      const now = Date.now();
      vi.setSystemTime(now);
      const expires = new Date(now + 60 * 60 * 1000); // 1 hour
      const formatted = formatTimeUntilExpiration(expires);
      expect(formatted).toContain("1 hour");
      expect(formatted).not.toContain("hours");
    });

    it("should use singular form for 1 minute", () => {
      const now = Date.now();
      vi.setSystemTime(now);
      const expires = new Date(now + 60 * 1000); // 1 minute
      const formatted = formatTimeUntilExpiration(expires);
      expect(formatted).toBe("1 minute");
    });

    it("should handle string dates", () => {
      const now = Date.now();
      vi.setSystemTime(now);
      const expires = new Date(now + 30 * 60 * 1000).toISOString();
      const formatted = formatTimeUntilExpiration(expires);
      expect(formatted).toBe("30 minutes");
    });
  });
});
