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

// Zoom Levels
export const DEFAULT_ZOOM = 13;
export const MIN_ZOOM = 10; // Don't allow zooming out beyond Cebu region
export const MAX_ZOOM = 18; // Maximum detail level

// Performance
export const MAP_LOAD_TIMEOUT = 10000; // 10 seconds
export const RETRY_DELAY = 2000; // 2 seconds
export const MAX_RETRY_ATTEMPTS = 3;

// Styles
export const DEFAULT_MAP_STYLE = 'mapbox://styles/mapbox/streets-v12';
export const FALLBACK_MAP_STYLE = 'mapbox://styles/mapbox/light-v11';

// Container
export const MIN_CONTAINER_WIDTH = 100;
export const MIN_CONTAINER_HEIGHT = 100;

