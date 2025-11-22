import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { validateDSN, getValidatedDSN } from "@/lib/sentry/config-validation";

describe("config-validation", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe("validateDSN", () => {
    it("should validate a correct DSN", () => {
      const dsn = "https://abc123def456@o123456.ingest.sentry.io/123456";
      expect(validateDSN(dsn)).toBe(true);
    });

    it("should reject DSN without https://", () => {
      const dsn = "http://abc123@o123456.ingest.sentry.io/123456";
      expect(validateDSN(dsn)).toBe(false);
    });

    it("should reject DSN without @ symbol", () => {
      const dsn = "https://abc123o123456.ingest.sentry.io/123456";
      expect(validateDSN(dsn)).toBe(false);
    });

    it("should reject DSN without / symbol", () => {
      const dsn = "https://abc123@o123456.ingest.sentry.io";
      expect(validateDSN(dsn)).toBe(false);
    });

    it("should reject empty string", () => {
      expect(validateDSN("")).toBe(false);
    });

    it("should reject undefined", () => {
      expect(validateDSN(undefined)).toBe(false);
    });

    it("should reject DSN with short public key", () => {
      const dsn = "https://abc@o123456.ingest.sentry.io/123456";
      expect(validateDSN(dsn)).toBe(false);
    });

    it("should reject invalid URL format", () => {
      const dsn = "https://[invalid-url]";
      expect(validateDSN(dsn)).toBe(false);
    });
  });

  describe("getValidatedDSN", () => {
    it("should return DSN when valid", () => {
      process.env.NEXT_PUBLIC_SENTRY_DSN =
        "https://abc123def456@o123456.ingest.sentry.io/123456";

      const dsn = getValidatedDSN();

      expect(dsn).toBe(
        "https://abc123def456@o123456.ingest.sentry.io/123456"
      );
    });

    it("should return null when DSN is missing", () => {
      delete process.env.NEXT_PUBLIC_SENTRY_DSN;

      const dsn = getValidatedDSN();

      expect(dsn).toBeNull();
    });

    it("should return null when DSN is invalid", () => {
      process.env.NEXT_PUBLIC_SENTRY_DSN = "invalid-dsn";

      const dsn = getValidatedDSN();

      expect(dsn).toBeNull();
    });
  });
});
