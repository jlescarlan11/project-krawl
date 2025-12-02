import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  validateCoordinates,
  loadBoundaryData,
  isPointInBoundary,
  getBoundaryCoordinates,
  clearBoundaryCache,
  isBoundaryDataLoaded,
  type Coordinates,
  type BoundaryValidationResult,
} from "@/lib/map/boundaryValidation";

// Mock fetch for boundary data
const mockBoundaryData = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        name: "Cebu City",
        description: "Test boundary",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [123.8200, 10.2500],
            [123.9600, 10.2500],
            [123.9600, 10.4000],
            [123.8200, 10.4000],
            [123.8200, 10.2500],
          ],
        ],
      },
    },
  ],
};

describe("boundaryValidation", () => {
  beforeEach(() => {
    // Clear cache before each test
    clearBoundaryCache();

    // Mock global fetch
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockBoundaryData),
      } as Response)
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
    clearBoundaryCache();
  });

  describe("loadBoundaryData", () => {
    it("should load boundary data successfully", async () => {
      const data = await loadBoundaryData();
      expect(data).toBeDefined();
      expect(data.geometry.type).toBe("Polygon");
      expect(data.geometry.coordinates).toBeDefined();
    });

    it("should cache boundary data after first load", async () => {
      // First load
      const fetchSpy = vi.spyOn(global, "fetch");
      await loadBoundaryData();
      expect(isBoundaryDataLoaded()).toBe(true);
      expect(fetchSpy).toHaveBeenCalledTimes(1);

      // Second load should use cache (fetch not called again)
      fetchSpy.mockClear();
      await loadBoundaryData();
      expect(fetchSpy).not.toHaveBeenCalled();
    });

    it("should throw error if fetch fails", async () => {
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: false,
          statusText: "Not Found",
        } as Response)
      );

      await expect(loadBoundaryData()).rejects.toThrow(
        "Failed to fetch boundary data"
      );
    });

    it("should throw error if GeoJSON is invalid (no features)", async () => {
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ type: "FeatureCollection", features: [] }),
        } as Response)
      );

      await expect(loadBoundaryData()).rejects.toThrow(
        "Invalid boundary GeoJSON: missing features"
      );
    });

    it("should throw error if geometry is not a Polygon", async () => {
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              type: "FeatureCollection",
              features: [
                {
                  type: "Feature",
                  geometry: { type: "Point", coordinates: [123, 10] },
                },
              ],
            }),
        } as Response)
      );

      await expect(loadBoundaryData()).rejects.toThrow(
        "Invalid boundary GeoJSON: geometry is not a Polygon"
      );
    });
  });

  describe("validateCoordinates", () => {
    it("should validate coordinates inside Cebu City boundary", async () => {
      // Center point inside the mocked boundary
      const coords: Coordinates = [123.8854, 10.3157];
      const result = await validateCoordinates(coords);

      expect(result.isValid).toBe(true);
      expect(result.message).toContain("within Cebu City boundaries");
    });

    it("should invalidate coordinates outside Cebu City boundary", async () => {
      // Point clearly outside the boundary
      const coords: Coordinates = [120.0, 10.0];
      const result = await validateCoordinates(coords);

      expect(result.isValid).toBe(false);
      expect(result.message).toContain("outside Cebu City boundaries");
    });

    it("should handle coordinates on the boundary edge consistently", async () => {
      // Exactly on the boundary edge
      const coords: Coordinates = [123.8200, 10.2500];
      const result = await validateCoordinates(coords);

      // Should be treated consistently (either valid or invalid)
      expect(typeof result.isValid).toBe("boolean");
      expect(result.message).toBeDefined();
    });

    it("should reject invalid coordinate format (not array)", async () => {
      // @ts-expect-error - Testing invalid input
      const result = await validateCoordinates(null);

      expect(result.isValid).toBe(false);
      expect(result.message).toContain("Invalid coordinates format");
    });

    it("should reject invalid coordinate format (wrong length)", async () => {
      // @ts-expect-error - Testing invalid input
      const result = await validateCoordinates([123.8854]);

      expect(result.isValid).toBe(false);
      expect(result.message).toContain("Invalid coordinates format");
    });

    it("should reject non-numeric coordinates", async () => {
      // @ts-expect-error - Testing invalid input
      const result = await validateCoordinates(["abc", "def"]);

      expect(result.isValid).toBe(false);
      expect(result.message).toContain("Coordinates must be numbers");
    });

    it("should reject coordinates out of valid range (longitude)", async () => {
      const result = await validateCoordinates([190, 10.3157]);

      expect(result.isValid).toBe(false);
      expect(result.message).toContain("out of valid range");
    });

    it("should reject coordinates out of valid range (latitude)", async () => {
      const result = await validateCoordinates([123.8854, 95]);

      expect(result.isValid).toBe(false);
      expect(result.message).toContain("out of valid range");
    });

    it("should handle boundary data loading errors gracefully", async () => {
      clearBoundaryCache();
      global.fetch = vi.fn(() => Promise.reject(new Error("Network error")));

      const coords: Coordinates = [123.8854, 10.3157];
      const result = await validateCoordinates(coords);

      expect(result.isValid).toBe(false);
      expect(result.message).toContain("Boundary validation failed");
    });

    it("should complete validation within 100ms (performance test)", async () => {
      // Pre-load boundary data
      await loadBoundaryData();

      const coords: Coordinates = [123.8854, 10.3157];
      const startTime = performance.now();
      await validateCoordinates(coords);
      const endTime = performance.now();
      const duration = endTime - startTime;

      // Should be fast (< 100ms) with cached data
      expect(duration).toBeLessThan(100);
    });
  });

  describe("isPointInBoundary", () => {
    it("should validate point inside boundary (synchronous)", async () => {
      // Pre-load boundary data
      await loadBoundaryData();

      const coords: Coordinates = [123.8854, 10.3157];
      const result = isPointInBoundary(coords);

      expect(result).toBe(true);
    });

    it("should invalidate point outside boundary (synchronous)", async () => {
      // Pre-load boundary data
      await loadBoundaryData();

      const coords: Coordinates = [120.0, 10.0];
      const result = isPointInBoundary(coords);

      expect(result).toBe(false);
    });

    it("should throw error if boundary data not loaded", () => {
      clearBoundaryCache();
      const coords: Coordinates = [123.8854, 10.3157];

      expect(() => isPointInBoundary(coords)).toThrow(
        "Boundary data not loaded"
      );
    });

    it("should return false for invalid coordinates", async () => {
      await loadBoundaryData();

      // Invalid longitude
      const result1 = isPointInBoundary([190, 10.3157]);
      expect(result1).toBe(false);

      // Invalid latitude
      const result2 = isPointInBoundary([123.8854, 95]);
      expect(result2).toBe(false);

      // Non-numeric
      // @ts-expect-error - Testing invalid input
      const result3 = isPointInBoundary(["abc", "def"]);
      expect(result3).toBe(false);
    });
  });

  describe("getBoundaryCoordinates", () => {
    it("should return null when boundary not loaded", () => {
      clearBoundaryCache();
      const coords = getBoundaryCoordinates();
      expect(coords).toBeNull();
    });

    it("should return boundary coordinates when loaded", async () => {
      await loadBoundaryData();
      const coords = getBoundaryCoordinates();

      expect(coords).toBeDefined();
      expect(Array.isArray(coords)).toBe(true);
      expect(coords![0]).toBeDefined();
      expect(Array.isArray(coords![0])).toBe(true);
    });
  });

  describe("clearBoundaryCache", () => {
    it("should clear cached boundary data", async () => {
      await loadBoundaryData();
      expect(isBoundaryDataLoaded()).toBe(true);

      clearBoundaryCache();
      expect(isBoundaryDataLoaded()).toBe(false);
    });
  });

  describe("isBoundaryDataLoaded", () => {
    it("should return false initially", () => {
      expect(isBoundaryDataLoaded()).toBe(false);
    });

    it("should return true after loading", async () => {
      await loadBoundaryData();
      expect(isBoundaryDataLoaded()).toBe(true);
    });

    it("should return false after clearing cache", async () => {
      await loadBoundaryData();
      clearBoundaryCache();
      expect(isBoundaryDataLoaded()).toBe(false);
    });
  });

  describe("Edge cases", () => {
    it("should handle rapid multiple validations (debounce test simulation)", async () => {
      await loadBoundaryData();

      const coords1: Coordinates = [123.8854, 10.3157];
      const coords2: Coordinates = [123.8900, 10.3200];
      const coords3: Coordinates = [123.8700, 10.3100];

      // Simulate rapid validations
      const results = await Promise.all([
        validateCoordinates(coords1),
        validateCoordinates(coords2),
        validateCoordinates(coords3),
      ]);

      // All should complete successfully
      results.forEach((result) => {
        expect(result).toBeDefined();
        expect(typeof result.isValid).toBe("boolean");
      });
    });

    it("should handle coordinates with high precision", async () => {
      const coords: Coordinates = [123.885412345678, 10.315767891234];
      const result = await validateCoordinates(coords);

      expect(result).toBeDefined();
      expect(typeof result.isValid).toBe("boolean");
    });

    it("should handle boundary corners consistently", async () => {
      await loadBoundaryData();

      // Test all four corners of the mocked boundary
      const corners: Coordinates[] = [
        [123.8200, 10.2500], // SW
        [123.9600, 10.2500], // SE
        [123.9600, 10.4000], // NE
        [123.8200, 10.4000], // NW
      ];

      const results = await Promise.all(
        corners.map((coords) => validateCoordinates(coords))
      );

      // All corners should be treated consistently
      results.forEach((result, index) => {
        expect(result).toBeDefined();
        expect(typeof result.isValid).toBe("boolean");
        expect(result.message).toBeDefined();
      });
    });
  });
});
