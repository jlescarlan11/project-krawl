/**
 * Map Component Types
 * 
 * TypeScript type definitions for all map-related components and utilities.
 */

import mapboxgl from 'mapbox-gl';

/**
 * Map Component Props
 */
export interface MapProps {
  // Core Configuration
  initialCenter?: [number, number]; // [longitude, latitude]
  initialZoom?: number;
  style?: string; // Mapbox style URL

  // Container Configuration
  className?: string;
  containerStyle?: React.CSSProperties;

  // Interaction Configuration
  interactive?: boolean;
  scrollZoom?: boolean;
  dragPan?: boolean;
  dragRotate?: boolean;
  doubleClickZoom?: boolean;
  touchZoomRotate?: boolean;
  boxZoom?: boolean;
  keyboard?: boolean;

  // Animation Configuration
  animationDuration?: number; // Default animation duration in ms
  easeToOptions?: {
    duration?: number;
    easing?: (t: number) => number;
  };

  // Control Configuration
  showNavigationControl?: boolean;
  showGeolocateControl?: boolean;
  showScaleControl?: boolean;
  navigationControlPosition?: ControlPosition;

  // Bounds Configuration
  maxBounds?: [[number, number], [number, number]]; // [[west, south], [east, north]]
  minZoom?: number;
  maxZoom?: number;

  // Event Handlers
  onLoad?: (map: mapboxgl.Map) => void;
  onError?: (error: MapError) => void;
  onClick?: (event: mapboxgl.MapMouseEvent) => void;
  onMoveEnd?: (event: mapboxgl.MapboxEvent) => void;
  onZoomEnd?: (event: mapboxgl.MapboxEvent) => void;

  // Advanced Configuration
  preserveDrawingBuffer?: boolean; // For screenshots
  failIfMajorPerformanceCaveat?: boolean; // WebGL performance check

  // Loading & Error States
  loadingComponent?: React.ReactNode;
  errorComponent?: React.ReactNode;
  retryOnError?: boolean;
}

/**
 * Map Error Types
 */
export enum MapErrorCode {
  WEBGL_NOT_SUPPORTED = 'WEBGL_NOT_SUPPORTED',
  INVALID_TOKEN = 'INVALID_TOKEN',
  NETWORK_ERROR = 'NETWORK_ERROR',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  STYLE_LOAD_ERROR = 'STYLE_LOAD_ERROR',
  CONTAINER_SIZE_ZERO = 'CONTAINER_SIZE_ZERO',
  INITIALIZATION_ERROR = 'INITIALIZATION_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

export interface MapError {
  code: MapErrorCode;
  message: string;
  originalError?: Error | any;
  retryable: boolean;
}

/**
 * Map State
 */
export interface MapState {
  isLoaded: boolean;
  isLoading: boolean;
  error: MapError | null;
  center: [number, number] | null;
  zoom: number | null;
}

/**
 * Map Ref (for imperative handle)
 */
export interface MapRef {
  map: mapboxgl.Map | null;
  getCenter: () => [number, number] | null;
  getZoom: () => number | null;
  setCenter: (center: [number, number]) => void;
  setZoom: (zoom: number) => void;
  flyTo: (center: [number, number], zoom?: number) => void;
  resize: () => void;
}

/**
 * Control Position
 */
export type ControlPosition =
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right';

/**
 * Cebu Bounds
 */
export interface CebuBounds {
  minLat: number;
  minLng: number;
  maxLat: number;
  maxLng: number;
}

/**
 * Map Config
 */
export interface MapConfig {
  accessToken: string;
  style: string;
  center: [number, number];
  zoom: number;
  bounds?: [[number, number], [number, number]];
}

