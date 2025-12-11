/**
 * useMapControls Hook
 *
 * Manages map control rendering including:
 * - Navigation controls
 * - Geolocate controls
 * - Scale controls
 * - Attribution removal
 */

import { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { CustomNavigationControl } from '@/lib/map/CustomNavigationControl';

export interface UseMapControlsOptions {
  map: mapboxgl.Map | null;
  showNavigationControl: boolean;
  showGeolocateControl: boolean;
  showScaleControl: boolean;
  navigationControlPosition: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

/**
 * Set up map controls
 *
 * @param options - Control options
 */
export function useMapControls({
  map,
  showNavigationControl,
  showGeolocateControl,
  showScaleControl,
  navigationControlPosition,
}: UseMapControlsOptions): void {
  useEffect(() => {
    if (!map) return;

    // Remove default attribution control
    map._controls.forEach((control: any) => {
      if (control instanceof mapboxgl.AttributionControl) {
        map.removeControl(control);
      }
    });

    // Add navigation control
    if (showNavigationControl) {
      const navControl = new CustomNavigationControl({ resetPitch: 40 });
      map.addControl(navControl, navigationControlPosition);
    }

    // Add geolocate control
    if (showGeolocateControl) {
      const geolocateControl = new mapboxgl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true,
      });
      map.addControl(geolocateControl, navigationControlPosition);
    }

    // Add scale control
    if (showScaleControl) {
      const scaleControl = new mapboxgl.ScaleControl();
      map.addControl(scaleControl);
    }
  }, [
    map,
    showNavigationControl,
    showGeolocateControl,
    showScaleControl,
    navigationControlPosition,
  ]);
}

