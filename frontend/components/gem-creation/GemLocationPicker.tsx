"use client";

import { useEffect, useRef, useState, useCallback, useImperativeHandle, forwardRef } from "react";
import mapboxgl from "mapbox-gl";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  validateCoordinates,
  loadBoundaryData,
  type BoundaryValidationResult,
} from "@/lib/map/boundaryValidation";
import { CEBU_CITY_CENTER, DEFAULT_MAP_STYLE, CEBU_CITY_MAX_BOUNDS } from "@/lib/map/constants";
import { ANIMATION_DURATIONS, easingFunctions } from "@/lib/map/animationUtils";

// Ensure Mapbox token is set
if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN) {
  mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
}

/**
 * Props for GemLocationPicker component
 */
export interface GemLocationPickerProps {
  initialCoordinates?: [number, number];
  initialZoom?: number;
  onLocationChange?: (coordinates: [number, number]) => void;
  onValidationChange?: (result: BoundaryValidationResult) => void;
  className?: string;
}

/**
 * Methods exposed via ref
 */
export interface GemLocationPickerRef {
  flyTo: (coordinates: [number, number], zoom?: number) => void;
  moveMarker: (coordinates: [number, number]) => void;
}

/**
 * Pin state type
 */
type PinState = "neutral" | "loading" | "valid" | "invalid" | "dragging";

/**
 * GemLocationPicker Component
 *
 * Interactive map with draggable pin for location selection.
 * User can drag the pin or click the map to select coordinates.
 * Validates coordinates against Cebu City boundaries in real-time.
 */
export const GemLocationPicker = forwardRef<GemLocationPickerRef, GemLocationPickerProps>(
  function GemLocationPicker(
    {
      initialCoordinates = CEBU_CITY_CENTER,
      initialZoom = 14,
      onLocationChange,
      onValidationChange,
      className,
    },
    ref
  ) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const markerElementRef = useRef<HTMLDivElement | null>(null);
  const validationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastValidPositionRef = useRef<[number, number]>(initialCoordinates);

  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] =
    useState<BoundaryValidationResult | null>(null);
  const [pinState, setPinState] = useState<PinState>("neutral");
  const [isDragging, setIsDragging] = useState(false);

  /**
   * Create custom marker element with proper class names for updates
   */
  const createMarkerElement = useCallback((state: PinState = "neutral") => {
    const markerEl = document.createElement("div");
    markerEl.className = "relative cursor-grab active:cursor-grabbing";
    markerEl.style.width = "48px";
    markerEl.style.height = "60px";

    markerEl.innerHTML = `
      <div class="marker-pin-circle relative w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all duration-200 ${
        state === "valid" ? "bg-green-500 scale-110" :
        state === "invalid" ? "bg-red-500 scale-110" :
        state === "loading" ? "bg-gray-400" :
        state === "dragging" ? "bg-primary-green scale-125" :
        "bg-primary-green"
      }">
        <div class="marker-icon-container w-6 h-6 text-white flex items-center justify-center">
          ${state === "loading" ? '<div class="animate-spin">⟳</div>' :
            state === "valid" ? '✓' :
            state === "invalid" ? '✕' :
            '📍'}
        </div>
        ${state === "invalid" ? '<div class="marker-pulse absolute inset-0 rounded-full bg-red-500 animate-ping opacity-75" style="animation-duration: 2s;"></div>' : ''}
      </div>
      <div class="marker-pin-pointer absolute left-1/2 top-full -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-12 border-l-transparent border-r-transparent transition-colors duration-200 ${
        state === "valid" ? "border-t-green-500" :
        state === "invalid" ? "border-t-red-500" :
        state === "loading" ? "border-t-gray-400" :
        "border-t-primary-green"
      }" style="border-top-width: 12px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));"></div>
    `;

    return markerEl;
  }, []);

  /**
   * Update marker visual state
   */
  const updateMarkerState = useCallback((state: PinState) => {
    setPinState(state);
    if (markerElementRef.current) {
      // Update the marker element's classes and content
      const pinCircle = markerElementRef.current.querySelector('.marker-pin-circle') as HTMLElement;
      const pinPointer = markerElementRef.current.querySelector('.marker-pin-pointer') as HTMLElement;
      const iconContainer = markerElementRef.current.querySelector('.marker-icon-container') as HTMLElement;
      const pulseEl = markerElementRef.current.querySelector('.marker-pulse') as HTMLElement;

      if (pinCircle && pinPointer && iconContainer) {
        // Update circle background
        pinCircle.className = `marker-pin-circle relative w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all duration-200 ${
          state === "valid" ? "bg-green-500 scale-110" :
          state === "invalid" ? "bg-red-500 scale-110" :
          state === "loading" ? "bg-gray-400" :
          state === "dragging" ? "bg-primary-green scale-125" :
          "bg-primary-green"
        }`;

        // Update pointer color
        pinPointer.className = `marker-pin-pointer absolute left-1/2 top-full -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-12 border-l-transparent border-r-transparent transition-colors duration-200 ${
          state === "valid" ? "border-t-green-500" :
          state === "invalid" ? "border-t-red-500" :
          state === "loading" ? "border-t-gray-400" :
          "border-t-primary-green"
        }`;

        // Update icon
        iconContainer.innerHTML = state === "loading" ? '<div class="animate-spin">⟳</div>' :
          state === "valid" ? '✓' :
          state === "invalid" ? '✕' :
          '📍';

        // Handle pulse animation for invalid state
        if (state === "invalid" && !pulseEl) {
          const pulse = document.createElement('div');
          pulse.className = 'marker-pulse absolute inset-0 rounded-full bg-red-500 animate-ping opacity-75';
          pulse.style.animationDuration = '2s';
          pinCircle.appendChild(pulse);
        } else if (state !== "invalid" && pulseEl) {
          pulseEl.remove();
        }

        // Update cursor
        markerElementRef.current.style.cursor = state === "dragging" ? "grabbing" : "grab";
      }
    }
  }, []);

  /**
   * Validate coordinates with debounce (300ms)
   * If invalid and snapBack is true, will snap marker back to last valid position
   */
  const validateLocation = useCallback(
    async (coords: [number, number], skipDebounce = false, snapBack = false) => {
      // Clear previous timeout
      if (validationTimeoutRef.current) {
        clearTimeout(validationTimeoutRef.current);
      }

      setIsValidating(true);
      updateMarkerState("loading");

      const performValidation = async () => {
        try {
          const result = await validateCoordinates(coords);
          setValidationResult(result);
          onValidationChange?.(result);

          if (result.isValid) {
            // Update marker state and save position
            updateMarkerState("valid");
            lastValidPositionRef.current = coords;
            onLocationChange?.(coords);
          } else {
            // Invalid location
            updateMarkerState("invalid");

            // Snap back to last valid position if requested
            if (snapBack && markerRef.current) {
              setTimeout(() => {
                const lastValid = lastValidPositionRef.current;
                markerRef.current?.setLngLat(lastValid);
                // Re-validate the last valid position
                validateLocation(lastValid, true, false);
              }, 1500); // Wait 1.5s to show error state before snapping back
            }
          }
        } catch (error) {
          console.error("Validation error:", error);
          const errorResult: BoundaryValidationResult = {
            isValid: false,
            message: "Unable to validate location. Please try again.",
          };
          setValidationResult(errorResult);
          onValidationChange?.(errorResult);
          updateMarkerState("invalid");
        } finally {
          setIsValidating(false);
        }
      };

      if (skipDebounce) {
        await performValidation();
      } else {
        // Debounce validation by 300ms
        validationTimeoutRef.current = setTimeout(performValidation, 300);
      }
    },
    [onLocationChange, onValidationChange, updateMarkerState]
  );

  /**
   * Move marker to new coordinates
   */
  const moveMarker = useCallback((coords: [number, number]) => {
    if (markerRef.current) {
      markerRef.current.setLngLat(coords);
      validateLocation(coords, false);
    }
  }, [validateLocation]);

  /**
   * Fly to coordinates (animated)
   */
  const flyTo = useCallback(
    (coordinates: [number, number], zoom?: number) => {
      if (!mapRef.current) return;

      mapRef.current.flyTo({
        center: coordinates,
        zoom: zoom || initialZoom,
        duration: ANIMATION_DURATIONS.SLOW,
        easing: easingFunctions.easeInOutCubic,
        essential: true,
      });

      // Move marker to new coordinates
      moveMarker(coordinates);
    },
    [initialZoom, moveMarker]
  );

  /**
   * Expose methods via ref
   */
  useImperativeHandle(ref, () => ({
    flyTo,
    moveMarker,
  }), [flyTo, moveMarker]);

  /**
   * Initialize map with draggable marker
   */
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: DEFAULT_MAP_STYLE,
      center: initialCoordinates,
      zoom: initialZoom,
      attributionControl: false,
      maxBounds: CEBU_CITY_MAX_BOUNDS, // Restrict panning to Cebu City only
    });

    // Create draggable marker
    const markerElement = createMarkerElement("neutral");
    markerElementRef.current = markerElement;

    const marker = new mapboxgl.Marker({
      element: markerElement,
      draggable: true,
      anchor: "bottom", // Anchor at the bottom tip of the pin
    })
      .setLngLat(initialCoordinates)
      .addTo(map);

    markerRef.current = marker;

    // Drag event handlers
    marker.on("dragstart", () => {
      setIsDragging(true);
      updateMarkerState("dragging");
    });

    marker.on("drag", () => {
      // Visual feedback during drag - marker state is already "dragging"
    });

    marker.on("dragend", () => {
      setIsDragging(false);
      const lngLat = marker.getLngLat();
      const coords: [number, number] = [lngLat.lng, lngLat.lat];
      // Enable snap-back for drag operations
      validateLocation(coords, false, true);
    });

    // Click map to move marker
    map.on("click", (e) => {
      const coords: [number, number] = [e.lngLat.lng, e.lngLat.lat];
      marker.setLngLat(coords);
      validateLocation(coords, false);
    });

    // Add geolocate control (current location button)
    const geolocateControl = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: false,
      showUserLocation: true,
      showUserHeading: false,
    });

    // When user clicks "Use Current Location", move marker there
    geolocateControl.on("geolocate", (e: GeolocationPosition) => {
      const coords: [number, number] = [e.coords.longitude, e.coords.latitude];
      marker.setLngLat(coords);
      map.flyTo({
        center: coords,
        zoom: 16,
        duration: ANIMATION_DURATIONS.SLOW,
        easing: easingFunctions.easeInOutCubic,
      });
      validateLocation(coords, false);
    });

    map.addControl(geolocateControl, "bottom-right");

    // Add navigation controls (zoom only, no compass)
    map.addControl(
      new mapboxgl.NavigationControl({
        showCompass: false,
        showZoom: true,
      }),
      "bottom-right"
    );

    // Adjust control positioning to remove right padding/whitespace
    const style = document.createElement("style");
    style.textContent = `
      .mapboxgl-ctrl-bottom-right {
        right: 8px !important;
        bottom: 4px !important;
        margin-right: 0 !important;
      }
      .mapboxgl-ctrl-bottom-right .mapboxgl-ctrl {
        margin: 0 0 8px 0 !important;
      }
    `;
    document.head.appendChild(style);

    mapRef.current = map;

    // Load boundary and set up map
    map.on("load", async () => {
      try {
        // Load boundary data
        const boundaryFeature = await loadBoundaryData();

        // Add boundary as polygon layer
        if (boundaryFeature && map.getSource("cebu-boundary") === undefined) {
          map.addSource("cebu-boundary", {
            type: "geojson",
            data: boundaryFeature,
          });

          // Add fill layer (semi-transparent green)
          map.addLayer({
            id: "cebu-boundary-fill",
            type: "fill",
            source: "cebu-boundary",
            paint: {
              "fill-color": "#10b981",
              "fill-opacity": 0.1,
            },
          });

          // Add outline layer
          map.addLayer({
            id: "cebu-boundary-outline",
            type: "line",
            source: "cebu-boundary",
            paint: {
              "line-color": "#10b981",
              "line-width": 2,
              "line-opacity": 0.5,
            },
          });
        }

        setIsMapLoaded(true);

        // Validate initial coordinates
        validateLocation(initialCoordinates, false);
      } catch (error) {
        console.error("Error loading boundary data:", error);
        setIsMapLoaded(true); // Continue without boundary
      }
    });

    // Cleanup
    return () => {
      marker.remove();
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
      markerElementRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array - only initialize once

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      if (validationTimeoutRef.current) {
        clearTimeout(validationTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className={cn("relative h-full", className)}>
      {/* Map Container - marker is rendered by Mapbox */}
      <div ref={mapContainerRef} className="absolute inset-0 w-full h-full" />

      {/* Loading Overlay */}
      {!isMapLoaded && (
        <div className="absolute inset-0 bg-bg-white flex items-center justify-center z-10">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-primary-green animate-spin" />
            <p className="text-sm text-text-secondary">Loading map...</p>
          </div>
        </div>
      )}
    </div>
  );
});
