import { describe, it, expect, beforeEach } from "vitest";
import { useMapStore } from "@/stores/map-store";
import type { MapCoordinates } from "@/stores/map-store";

describe("MapStore", () => {
  beforeEach(() => {
    // Reset store to default state
    useMapStore.setState({
      center: [123.8854, 10.3157], // Cebu City center
      zoom: 13,
      bearing: 0,
      pitch: 0,
      selectedMarkerId: null,
      filters: {
        categories: [],
        tags: [],
        dateRange: { start: null, end: null },
      },
      controls: {
        showClusters: true,
        showTrails: true,
      },
    });
  });

  describe("initialization", () => {
    it("should initialize with default state", () => {
      const state = useMapStore.getState();
      expect(state.center).toEqual([123.8854, 10.3157]);
      expect(state.zoom).toBe(13);
      expect(state.bearing).toBe(0);
      expect(state.pitch).toBe(0);
      expect(state.selectedMarkerId).toBeNull();
      expect(state.filters.categories).toEqual([]);
      expect(state.controls.showClusters).toBe(true);
    });
  });

  describe("viewport actions", () => {
    it("should set center coordinates", () => {
      const newCenter: MapCoordinates = [124.0, 10.5];
      useMapStore.getState().setCenter(newCenter);
      expect(useMapStore.getState().center).toEqual(newCenter);
    });

    it("should set zoom level", () => {
      useMapStore.getState().setZoom(15);
      expect(useMapStore.getState().zoom).toBe(15);
    });

    it("should set bearing", () => {
      useMapStore.getState().setBearing(45);
      expect(useMapStore.getState().bearing).toBe(45);
    });

    it("should set pitch", () => {
      useMapStore.getState().setPitch(30);
      expect(useMapStore.getState().pitch).toBe(30);
    });
  });

  describe("marker actions", () => {
    it("should select marker", () => {
      useMapStore.getState().selectMarker("marker-123");
      expect(useMapStore.getState().selectedMarkerId).toBe("marker-123");
    });

    it("should deselect marker", () => {
      useMapStore.getState().selectMarker("marker-123");
      useMapStore.getState().selectMarker(null);
      expect(useMapStore.getState().selectedMarkerId).toBeNull();
    });
  });

  describe("filter actions", () => {
    it("should set filters", () => {
      useMapStore.getState().setFilters({
        categories: ["restaurant", "cafe"],
        tags: ["cultural"],
      });

      const filters = useMapStore.getState().filters;
      expect(filters.categories).toEqual(["restaurant", "cafe"]);
      expect(filters.tags).toEqual(["cultural"]);
    });

    it("should merge partial filters", () => {
      useMapStore.getState().setFilters({
        categories: ["restaurant"],
      });

      useMapStore.getState().setFilters({
        tags: ["cultural"],
      });

      const filters = useMapStore.getState().filters;
      expect(filters.categories).toEqual(["restaurant"]);
      expect(filters.tags).toEqual(["cultural"]);
    });

    it("should reset filters", () => {
      useMapStore.getState().setFilters({
        categories: ["restaurant"],
        tags: ["cultural"],
      });

      useMapStore.getState().resetFilters();

      const filters = useMapStore.getState().filters;
      expect(filters.categories).toEqual([]);
      expect(filters.tags).toEqual([]);
      expect(filters.dateRange.start).toBeNull();
      expect(filters.dateRange.end).toBeNull();
    });
  });

  describe("control actions", () => {
    it("should toggle showClusters", () => {
      expect(useMapStore.getState().controls.showClusters).toBe(true);
      useMapStore.getState().toggleControl("showClusters");
      expect(useMapStore.getState().controls.showClusters).toBe(false);
      useMapStore.getState().toggleControl("showClusters");
      expect(useMapStore.getState().controls.showClusters).toBe(true);
    });

    it("should toggle showTrails", () => {
      expect(useMapStore.getState().controls.showTrails).toBe(true);
      useMapStore.getState().toggleControl("showTrails");
      expect(useMapStore.getState().controls.showTrails).toBe(false);
    });
  });

  describe("selectors", () => {
    it("should return correct center", () => {
      const newCenter: MapCoordinates = [124.0, 10.5];
      useMapStore.getState().setCenter(newCenter);
      const center = useMapStore.getState().center;
      expect(center).toEqual(newCenter);
    });

    it("should return correct zoom", () => {
      useMapStore.getState().setZoom(15);
      const zoom = useMapStore.getState().zoom;
      expect(zoom).toBe(15);
    });
  });
});


