import { describe, it, expect } from "vitest";

/**
 * Tests for statistics response validation logic.
 * These tests verify that the validation in fetchStatistics() correctly
 * rejects invalid values (NaN, Infinity, negative numbers).
 */

describe("Statistics Response Validation", () => {
  // Helper function that mimics the validation logic from fetchStatistics()
  function isValidStatistics(data: {
    totalGems?: unknown;
    totalKrawls?: unknown;
    activeUsers?: unknown;
  }): boolean {
    return (
      typeof data.totalGems === "number" &&
      typeof data.totalKrawls === "number" &&
      typeof data.activeUsers === "number" &&
      !isNaN(data.totalGems) &&
      !isNaN(data.totalKrawls) &&
      !isNaN(data.activeUsers) &&
      isFinite(data.totalGems) &&
      isFinite(data.totalKrawls) &&
      isFinite(data.activeUsers) &&
      data.totalGems >= 0 &&
      data.totalKrawls >= 0 &&
      data.activeUsers >= 0
    );
  }

  it("should accept valid statistics", () => {
    const valid = {
      totalGems: 100,
      totalKrawls: 50,
      activeUsers: 200,
    };
    expect(isValidStatistics(valid)).toBe(true);
  });

  it("should accept zero values", () => {
    const zeros = {
      totalGems: 0,
      totalKrawls: 0,
      activeUsers: 0,
    };
    expect(isValidStatistics(zeros)).toBe(true);
  });

  it("should reject NaN values", () => {
    const withNaN = {
      totalGems: NaN,
      totalKrawls: 50,
      activeUsers: 200,
    };
    expect(isValidStatistics(withNaN)).toBe(false);
  });

  it("should reject Infinity values", () => {
    const withInfinity = {
      totalGems: Infinity,
      totalKrawls: 50,
      activeUsers: 200,
    };
    expect(isValidStatistics(withInfinity)).toBe(false);
  });

  it("should reject negative Infinity", () => {
    const withNegInfinity = {
      totalGems: -Infinity,
      totalKrawls: 50,
      activeUsers: 200,
    };
    expect(isValidStatistics(withNegInfinity)).toBe(false);
  });

  it("should reject negative values", () => {
    const withNegative = {
      totalGems: -10,
      totalKrawls: 50,
      activeUsers: 200,
    };
    expect(isValidStatistics(withNegative)).toBe(false);
  });

  it("should reject non-number types", () => {
    const withString = {
      totalGems: "100",
      totalKrawls: 50,
      activeUsers: 200,
    };
    expect(isValidStatistics(withString)).toBe(false);
  });

  it("should reject missing fields", () => {
    const missing = {
      totalGems: 100,
      // totalKrawls missing
      activeUsers: 200,
    };
    expect(isValidStatistics(missing)).toBe(false);
  });

  it("should accept large valid numbers", () => {
    const large = {
      totalGems: 1_000_000,
      totalKrawls: 500_000,
      activeUsers: 2_000_000,
    };
    expect(isValidStatistics(large)).toBe(true);
  });
});












