/**
 * Map Constants
 * 
 * Centralized configuration values for Mapbox GL JS integration.
 * All map-related constants should be defined here.
 */

// Cebu City Configuration
export const CEBU_CITY_CENTER: [number, number] = [123.8854, 10.3157]; // [longitude, latitude]
export const CEBU_CITY_BOUNDS: [[number, number], [number, number]] = [
  [123.80, 10.25], // Southwest coordinates [lng, lat]
  [123.95, 10.40], // Northeast coordinates [lng, lat]
];

// Precise boundary constraints for map panning
// Restricted to Cebu City boundaries only
// Prevents users from panning outside Cebu City
export const CEBU_CITY_MAX_BOUNDS: [[number, number], [number, number]] = [
  [123.80, 10.25], // Southwest corner (Cebu City bounds)
  [123.95, 10.40], // Northeast corner (Cebu City bounds)
];

// Boundary GeoJSON file path
export const BOUNDARY_GEOJSON_PATH = '/data/cebu-city-boundary.geojson';

// Zoom Levels
export const DEFAULT_ZOOM = 12; // Initial zoom level for viewing entire city
export const MIN_ZOOM = 10; // Don't allow zooming out beyond Cebu region
export const MAX_ZOOM = 18; // Maximum detail level

// Performance
export const MAP_LOAD_TIMEOUT = 10000; // 10 seconds
export const RETRY_DELAY = 2000; // 2 seconds
export const MAX_RETRY_ATTEMPTS = 3;

// Styles
export const DEFAULT_MAP_STYLE = 'mapbox://styles/mapbox/standard';
export const FALLBACK_MAP_STYLE = 'mapbox://styles/mapbox/streets-v12';

// Container
export const MIN_CONTAINER_WIDTH = 100;
export const MIN_CONTAINER_HEIGHT = 100;

