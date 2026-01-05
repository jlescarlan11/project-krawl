/**
 * Map Constants
 * 
 * Centralized configuration values for Mapbox GL JS integration.
 * All map-related constants should be defined here.
 */

/**
 * Cebu City Boundary Configuration
 *
 * Precise boundaries from OpenStreetMap (OSM)
 * Source: Cebu City administrative boundary data
 *
 * IMPORTANT: These values must match backend's BoundaryValidationService.java
 * to ensure consistent validation across frontend and backend.
 */

// Cebu City center point [longitude, latitude]
export const CEBU_CITY_CENTER: [number, number] = [123.8854, 10.3157];

// Precise Cebu City boundaries from OpenStreetMap
// Southwest: [longitude, latitude], Northeast: [longitude, latitude]
export const CEBU_CITY_BOUNDS: [[number, number], [number, number]] = [
  [123.7533688, 10.2463015], // Southwest (OSM boundary)
  [123.9302169, 10.4957531], // Northeast (OSM boundary)
];

// Boundary constraints for map panning (same as CEBU_CITY_BOUNDS)
// Prevents users from panning outside Cebu City
export const CEBU_CITY_MAX_BOUNDS: [[number, number], [number, number]] = [
  [123.7533688, 10.2463015], // Southwest corner
  [123.9302169, 10.4957531], // Northeast corner
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

