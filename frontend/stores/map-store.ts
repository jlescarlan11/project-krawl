"use client";

import { create } from "zustand";
import { devtools } from "zustand/middleware";

/**
 * Map coordinates [longitude, latitude]
 */
export type MapCoordinates = [number, number];

/**
 * Map Store State
 */
interface MapState {
  center: MapCoordinates; // [lng, lat]
  zoom: number;
  bearing: number;
  pitch: number;
  selectedMarkerId: string | null;
  filters: {
    categories: string[];
    tags: string[];
    dateRange: { start: string | null; end: string | null }; // ISO date strings
  };
  controls: {
    showClusters: boolean;
    showTrails: boolean;
  };
}

/**
 * Map Store Actions
 */
interface MapActions {
  setCenter: (center: MapCoordinates) => void;
  setZoom: (zoom: number) => void;
  setBearing: (bearing: number) => void;
  setPitch: (pitch: number) => void;
  selectMarker: (id: string | null) => void;
  setFilters: (filters: Partial<MapState["filters"]>) => void;
  resetFilters: () => void;
  toggleControl: (control: keyof MapState["controls"]) => void;
}

/**
 * Map Store Type
 */
type MapStore = MapState & MapActions;

/**
 * Default map state
 * Center is set to Cebu City coordinates
 */
const defaultState: MapState = {
  center: [123.8854, 10.3157], // Cebu City center
  zoom: 12, // Initial zoom level for viewing entire city
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
};

/**
 * Map Store Hook
 *
 * Manages map viewport state, selected markers, filters, and map controls.
 * State is ephemeral and not persisted (resets on page reload).
 *
 * @example
 * ```tsx
 * const { center, zoom, setCenter, selectMarker } = useMapStore();
 * const selectedMarker = useSelectedMarker();
 * ```
 */
export const useMapStore = create<MapStore>()(
  devtools(
    (set) => ({
      ...defaultState,
      setCenter: (center) => {
        const [lng, lat] = center;
        // Validate coordinates: longitude [-180, 180], latitude [-90, 90]
        if (lng < -180 || lng > 180 || lat < -90 || lat > 90) {
          console.warn(
            `Invalid map coordinates: [${lng}, ${lat}]. Coordinates must be within valid ranges.`
          );
          return;
        }
        set({ center });
      },
      setZoom: (zoom) => {
        // Validate zoom level: typically 0-22 for most map libraries
        if (zoom < 0 || zoom > 22) {
          console.warn(
            `Invalid zoom level: ${zoom}. Zoom must be between 0 and 22.`
          );
          return;
        }
        set({ zoom });
      },
      setBearing: (bearing) => set({ bearing }),
      setPitch: (pitch) => set({ pitch }),
      selectMarker: (id) => set({ selectedMarkerId: id }),
      setFilters: (filters) =>
        set((state) => ({
            filters: { ...state.filters, ...filters },
        })),
      resetFilters: () => set({ filters: defaultState.filters }),
      toggleControl: (control) =>
        set((state) => ({
            controls: {
              ...state.controls,
              [control]: !state.controls[control],
            },
        })),
    }),
    { name: "MapStore" }
  )
);

/**
 * Selector: Get map center coordinates
 */
export const useMapCenter = () => useMapStore((state) => state.center);

/**
 * Selector: Get map zoom level
 */
export const useMapZoom = () => useMapStore((state) => state.zoom);

/**
 * Selector: Get selected marker ID
 */
export const useSelectedMarker = () =>
  useMapStore((state) => state.selectedMarkerId);

/**
 * Selector: Get map filters
 */
export const useMapFilters = () => useMapStore((state) => state.filters);
