/**
 * Map Animation Utilities
 *
 * Provides smooth animation helpers and easing functions for map interactions.
 * These utilities ensure consistent, 60fps performance across all map animations.
 */

import mapboxgl from 'mapbox-gl';

/**
 * Easing Functions
 * All functions take t in [0, 1] and return value in [0, 1]
 */
export const easingFunctions = {
  /**
   * Linear easing - no acceleration
   */
  linear: (t: number): number => t,

  /**
   * Ease-in-out (smooth start and end) - DEFAULT for most animations
   */
  easeInOutCubic: (t: number): number => {
    return t < 0.5
      ? 4 * t * t * t
      : 1 - Math.pow(-2 * t + 2, 3) / 2;
  },

  /**
   * Ease-out (fast start, slow end) - good for deceleration
   */
  easeOutQuad: (t: number): number => t * (2 - t),

  /**
   * Ease-out cubic - smoother deceleration
   */
  easeOutCubic: (t: number): number => 1 - Math.pow(1 - t, 3),

  /**
   * Ease-in-out quad - subtle acceleration/deceleration
   */
  easeInOutQuad: (t: number): number => {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  },

  /**
   * Ease-out exponential - very smooth deceleration
   */
  easeOutExpo: (t: number): number => {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  },

  /**
   * Ease-in-out exponential - smooth acceleration and deceleration
   */
  easeInOutExpo: (t: number): number => {
    if (t === 0) return 0;
    if (t === 1) return 1;
    if (t < 0.5) return Math.pow(2, 20 * t - 10) / 2;
    return (2 - Math.pow(2, -20 * t + 10)) / 2;
  },
};

/**
 * Default animation durations (in milliseconds)
 */
export const ANIMATION_DURATIONS = {
  INSTANT: 0,
  FAST: 300,
  NORMAL: 500,
  SMOOTH: 800,
  SLOW: 1200,
  VERY_SLOW: 1500,
} as const;

/**
 * Animation options for map movements
 */
export interface AnimationOptions {
  duration?: number;
  easing?: (t: number) => number;
  essential?: boolean; // If true, animation happens even with prefers-reduced-motion
  padding?: mapboxgl.PaddingOptions;
  offset?: [number, number]; // Offset in pixels
  animate?: boolean; // If false, jump immediately
}

/**
 * Smooth fly to a location with optimal settings
 */
export function smoothFlyTo(
  map: mapboxgl.Map,
  center: [number, number],
  zoom?: number,
  options?: AnimationOptions
): void {
  const {
    duration = ANIMATION_DURATIONS.SMOOTH,
    easing = easingFunctions.easeInOutCubic,
    essential = false,
    padding,
    offset,
  } = options || {};

  map.flyTo({
    center,
    zoom,
    duration,
    easing,
    essential,
    padding,
    offset,
    // Speed parameters for smooth flight arc
    curve: 1.42, // Flight path curve (higher = more arc)
    speed: 1.2, // Flight speed multiplier
    screenSpeed: undefined, // Let Mapbox calculate optimal screen speed
  });
}

/**
 * Smooth ease to a location (no flight arc, just smooth transition)
 */
export function smoothEaseTo(
  map: mapboxgl.Map,
  center: [number, number],
  zoom?: number,
  options?: AnimationOptions
): void {
  const {
    duration = ANIMATION_DURATIONS.NORMAL,
    easing = easingFunctions.easeInOutCubic,
    essential = false,
    padding,
    offset,
  } = options || {};

  map.easeTo({
    center,
    zoom,
    duration,
    easing,
    essential,
    padding,
    offset,
  });
}

/**
 * Smooth pan to a location (same zoom level)
 */
export function smoothPanTo(
  map: mapboxgl.Map,
  center: [number, number],
  options?: AnimationOptions
): void {
  smoothEaseTo(map, center, undefined, {
    duration: ANIMATION_DURATIONS.NORMAL,
    easing: easingFunctions.easeOutCubic,
    ...options,
  });
}

/**
 * Smooth zoom to a level (same center)
 */
export function smoothZoomTo(
  map: mapboxgl.Map,
  zoom: number,
  options?: AnimationOptions
): void {
  const currentCenter = map.getCenter();
  smoothEaseTo(map, [currentCenter.lng, currentCenter.lat], zoom, {
    duration: ANIMATION_DURATIONS.FAST,
    easing: easingFunctions.easeInOutQuad,
    ...options,
  });
}

/**
 * Fit bounds with smooth animation
 */
export function smoothFitBounds(
  map: mapboxgl.Map,
  bounds: [[number, number], [number, number]],
  options?: AnimationOptions & { maxZoom?: number }
): void {
  const {
    duration = ANIMATION_DURATIONS.SMOOTH,
    easing = easingFunctions.easeInOutCubic,
    essential = false,
    padding,
    maxZoom,
  } = options || {};

  map.fitBounds(bounds, {
    duration,
    easing,
    essential,
    padding: padding || { top: 50, bottom: 50, left: 50, right: 50 },
    maxZoom: maxZoom || 16,
  });
}

/**
 * Reset map to initial position with smooth animation
 */
export function smoothResetView(
  map: mapboxgl.Map,
  center: [number, number],
  zoom: number,
  options?: AnimationOptions
): void {
  smoothFlyTo(map, center, zoom, {
    duration: ANIMATION_DURATIONS.SMOOTH,
    easing: easingFunctions.easeInOutExpo,
    essential: true,
    ...options,
  });
}

/**
 * Performance monitoring utilities
 */
export class MapPerformanceMonitor {
  private frameCount = 0;
  private lastTime = performance.now();
  private fps = 60;
  private callback?: (fps: number) => void;

  constructor(callback?: (fps: number) => void) {
    this.callback = callback;
  }

  /**
   * Start monitoring FPS
   */
  start(map: mapboxgl.Map): void {
    const measureFPS = () => {
      this.frameCount++;
      const currentTime = performance.now();
      const elapsed = currentTime - this.lastTime;

      // Calculate FPS every second
      if (elapsed >= 1000) {
        this.fps = Math.round((this.frameCount * 1000) / elapsed);
        this.frameCount = 0;
        this.lastTime = currentTime;
        this.callback?.(this.fps);

        // Log warning if FPS drops below 30
        if (this.fps < 30) {
          console.warn(`[MapPerformance] Low FPS detected: ${this.fps}fps`);
        }
      }

      // Continue monitoring on next frame
      map.once('render', measureFPS);
    };

    map.once('render', measureFPS);
  }

  /**
   * Get current FPS
   */
  getFPS(): number {
    return this.fps;
  }

  /**
   * Check if performance is good (>= 50fps)
   */
  isPerformanceGood(): boolean {
    return this.fps >= 50;
  }

  /**
   * Check if performance is acceptable (>= 30fps)
   */
  isPerformanceAcceptable(): boolean {
    return this.fps >= 30;
  }
}

/**
 * Detect touch device
 */
export function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return false;

  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    // @ts-ignore - legacy support
    navigator.msMaxTouchPoints > 0
  );
}

/**
 * Get optimal animation duration based on distance
 * Further distances = longer animations for better UX
 */
export function getOptimalDuration(
  map: mapboxgl.Map,
  targetCenter: [number, number]
): number {
  const currentCenter = map.getCenter();
  const distance = Math.sqrt(
    Math.pow(targetCenter[0] - currentCenter.lng, 2) +
    Math.pow(targetCenter[1] - currentCenter.lat, 2)
  );

  // Scale duration based on distance
  // Close: 300ms, Medium: 500ms, Far: 1000ms
  if (distance < 0.01) return ANIMATION_DURATIONS.FAST;
  if (distance < 0.1) return ANIMATION_DURATIONS.NORMAL;
  if (distance < 1) return ANIMATION_DURATIONS.SMOOTH;
  return ANIMATION_DURATIONS.SLOW;
}

/**
 * Configure map for optimal smooth interactions
 */
export function configureOptimalInteractions(map: mapboxgl.Map): void {
  // Enable all smooth interaction handlers
  if (map.scrollZoom) {
    map.scrollZoom.enable();
  }

  if (map.dragPan) {
    map.dragPan.enable();
  }

  if (map.doubleClickZoom) {
    map.doubleClickZoom.enable();
  }

  if (map.touchZoomRotate) {
    map.touchZoomRotate.enable();
  }

  if (map.boxZoom) {
    map.boxZoom.enable();
  }

  if (map.keyboard) {
    map.keyboard.enable();
  }

  // Configure touch-specific optimizations
  if (isTouchDevice()) {
    // Disable rotation on touch for cleaner UX
    if (map.touchZoomRotate) {
      map.touchZoomRotate.disableRotation();
    }

    // Disable pitch for touch devices
    if (map.touchPitch) {
      map.touchPitch.disable();
    }
  }
}
