# TASK-051 Solution Design: Integrate Mapbox GL JS 3.x

**Date:** 2025-11-30
**Task ID:** TASK-051
**Epic:** epic:map-view
**Priority:** Critical
**Estimated Effort:** 1 day

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Architecture & Design](#architecture--design)
3. [Implementation Plan](#implementation-plan)
4. [Technical Specifications](#technical-specifications)
5. [Edge Case Handling](#edge-case-handling)
6. [Code Examples](#code-examples)
7. [Performance Strategy](#performance-strategy)
8. [Testing Approach](#testing-approach)
9. [Rollout Plan](#rollout-plan)

---

## Executive Summary

### Objective
Integrate Mapbox GL JS 3.x into the Krawl Next.js application to provide interactive map functionality for displaying Filipino cultural locations in Cebu City.

### Key Deliverables
- Reusable `Map` component with full TypeScript support
- WebGL support detection and fallback handling
- Comprehensive error handling for all edge cases
- Performance-optimized with code splitting
- Mobile and desktop responsive design
- Integration with existing Krawl design system

### Success Criteria
- Map renders successfully on mobile and desktop
- Map loads within 3 seconds on 3G connection
- 60fps performance during pan/zoom operations
- Graceful error handling with user-friendly messages
- Zero-crash tolerance for all edge cases

---

## Architecture & Design

### 1. Component Structure

```
frontend/
├── components/
│   └── map/
│       ├── Map.tsx                    # Main map component
│       ├── MapContainer.tsx           # Wrapper with error boundary
│       ├── MapLoadingState.tsx        # Loading skeleton
│       ├── MapErrorState.tsx          # Error display
│       ├── types.ts                   # TypeScript types
│       └── index.ts                   # Barrel exports
├── lib/
│   └── map/
│       ├── mapUtils.ts                # Utility functions
│       ├── constants.ts               # Map constants
│       ├── webglDetection.ts          # WebGL detection
│       └── errorMessages.ts           # Error message generators
└── hooks/
    └── useMap.ts                      # Map state management hook
```

### 2. Component Hierarchy

```
MapContainer (Error Boundary + Loading)
  └── Map (Core Mapbox Integration)
      ├── MapLoadingState (Initial Load)
      ├── MapErrorState (Error Display)
      └── Mapbox GL JS Instance
```

### 3. Data Flow

```
1. Component Mount
   ↓
2. WebGL Detection
   ↓
3. Token Validation
   ↓
4. Map Initialization
   ↓
5. Style Loading
   ↓
6. Ready State
   ↓
7. User Interaction
```

### 4. State Management

**Local Component State:**
- `isLoaded`: Boolean indicating map ready state
- `error`: Error object or null
- `isLoading`: Boolean for loading state
- `mapInstance`: Mapbox GL Map instance reference

**Global State (Future):**
- Map center position (for persistence)
- Zoom level (for persistence)
- Active markers (managed by parent components)

### 5. Integration Points

**With Next.js:**
- Client-side only rendering (`'use client'` directive)
- Dynamic imports for code splitting
- Integration with App Router

**With Existing Components:**
- Uses `ErrorDisplay` component for errors
- Uses `LoadingSkeleton` for loading states
- Follows existing component patterns

**With Design System:**
- Matches Tailwind color palette
- Uses consistent spacing and typography
- Follows accessibility patterns

---

## Implementation Plan

### Phase 1: Setup and Dependencies (30 mins)

**Step 1.1: Install Dependencies**

```bash
cd frontend
npm install mapbox-gl@^3.0.0
npm install --save-dev @types/mapbox-gl
```

**Step 1.2: Verify Package Installation**

Check `package.json` includes:
```json
{
  "dependencies": {
    "mapbox-gl": "^3.0.0"
  },
  "devDependencies": {
    "@types/mapbox-gl": "^4.0.0"
  }
}
```

**Step 1.3: Import Mapbox CSS**

Add to `app/layout.tsx` or create `app/globals.css` import:
```typescript
import 'mapbox-gl/dist/mapbox-gl.css';
```

---

### Phase 2: Core Infrastructure (1 hour)

**Step 2.1: Create Map Constants**

File: `frontend/lib/map/constants.ts`

Purpose: Centralize all map configuration values

**Step 2.2: Create Map Utilities**

File: `frontend/lib/map/mapUtils.ts`

Purpose: Helper functions for map operations

**Step 2.3: Create WebGL Detection**

File: `frontend/lib/map/webglDetection.ts`

Purpose: Detect WebGL support before map initialization

**Step 2.4: Create Error Messages**

File: `frontend/lib/map/errorMessages.ts`

Purpose: User-friendly error messages for different scenarios

---

### Phase 3: Component Implementation (2 hours)

**Step 3.1: Create TypeScript Types**

File: `frontend/components/map/types.ts`

Purpose: Complete type definitions for all map-related interfaces

**Step 3.2: Create Map Loading State**

File: `frontend/components/map/MapLoadingState.tsx`

Purpose: Loading skeleton shown during initialization

**Step 3.3: Create Map Error State**

File: `frontend/components/map/MapErrorState.tsx`

Purpose: Error display for map failures

**Step 3.4: Create Core Map Component**

File: `frontend/components/map/Map.tsx`

Purpose: Main Mapbox GL JS integration

**Step 3.5: Create Map Container**

File: `frontend/components/map/MapContainer.tsx`

Purpose: Wrapper with error boundary and state management

**Step 3.6: Create Barrel Exports**

File: `frontend/components/map/index.ts`

Purpose: Clean import interface

---

### Phase 4: Error Handling & Edge Cases (1.5 hours)

**Step 4.1: Implement Token Validation**

Add validation in `mapUtils.ts`

**Step 4.2: Implement Network Error Handling**

Add retry logic and network error detection

**Step 4.3: Implement WebGL Fallback**

Show clear message for browsers without WebGL

**Step 4.4: Implement Container Size Handling**

Handle zero-size containers gracefully

**Step 4.5: Implement Rate Limit Handling**

Detect and handle Mapbox API rate limits

---

### Phase 5: Optimization & Polish (1 hour)

**Step 5.1: Add Code Splitting**

Use `next/dynamic` for lazy loading

**Step 5.2: Optimize Re-renders**

Use `React.memo` and proper dependency arrays

**Step 5.3: Add Performance Monitoring**

Log initialization time and FPS metrics

**Step 5.4: Add Accessibility**

Ensure keyboard navigation and ARIA labels

---

### Phase 6: Integration & Testing (1.5 hours)

**Step 6.1: Update Map Page**

File: `frontend/app/map/page.tsx`

Integrate the new Map component

**Step 6.2: Update Component Exports**

Add map components to `frontend/components/index.ts`

**Step 6.3: Manual Testing**

Follow testing checklist (see Testing Approach section)

**Step 6.4: Cross-browser Testing**

Test on Chrome, Firefox, Safari, Edge

---

### Phase 7: Documentation (30 mins)

**Step 7.1: Add Component Documentation**

JSDoc comments for all public APIs

**Step 7.2: Create Usage Examples**

Example code in component files

**Step 7.3: Update README**

Document map component usage

---

## Technical Specifications

### 1. Map Component API

#### Props Interface

```typescript
interface MapProps {
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

  // Control Configuration
  showNavigationControl?: boolean;
  showGeolocateControl?: boolean;
  showScaleControl?: boolean;
  navigationControlPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

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
```

#### Default Props

```typescript
const defaultProps: Partial<MapProps> = {
  initialCenter: [123.8854, 10.3157], // Cebu City
  initialZoom: 13,
  style: process.env.NEXT_PUBLIC_MAPBOX_STYLE || 'mapbox://styles/mapbox/streets-v12',
  interactive: true,
  scrollZoom: true,
  dragPan: true,
  dragRotate: false, // Disabled for simpler UX
  doubleClickZoom: true,
  touchZoomRotate: true,
  showNavigationControl: true,
  showGeolocateControl: true,
  showScaleControl: false,
  navigationControlPosition: 'top-right',
  minZoom: 10, // Prevent zooming out too far from Cebu
  maxZoom: 18,
  retryOnError: true,
  failIfMajorPerformanceCaveat: false, // Allow on slower devices
};
```

### 2. TypeScript Interfaces

#### Core Types

```typescript
// Map Error Type
export interface MapError {
  code: MapErrorCode;
  message: string;
  originalError?: Error;
  retryable: boolean;
}

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

// Map Instance Ref
export interface MapRef {
  map: mapboxgl.Map | null;
  getCenter: () => [number, number] | null;
  getZoom: () => number | null;
  setCenter: (center: [number, number]) => void;
  setZoom: (zoom: number) => void;
  flyTo: (center: [number, number], zoom?: number) => void;
  resize: () => void;
}

// Map State
export interface MapState {
  isLoaded: boolean;
  isLoading: boolean;
  error: MapError | null;
  center: [number, number] | null;
  zoom: number | null;
}

// Map Config
export interface MapConfig {
  accessToken: string;
  style: string;
  center: [number, number];
  zoom: number;
  bounds?: [[number, number], [number, number]];
}
```

#### Utility Types

```typescript
// WebGL Support Check Result
export interface WebGLSupportResult {
  supported: boolean;
  reason?: string;
  performanceCaveat?: boolean;
}

// Cebu City Bounds
export interface CebuBounds {
  minLat: number;
  minLng: number;
  maxLat: number;
  maxLng: number;
}

// Map Initialization Options
export interface MapInitOptions extends Partial<mapboxgl.MapboxOptions> {
  accessToken: string;
  container: string | HTMLElement;
}
```

### 3. Constants Configuration

```typescript
// Cebu City Configuration
export const CEBU_CITY_CENTER: [number, number] = [123.8854, 10.3157];
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
```

### 4. Error Handling Architecture

#### Error Detection Strategy

```typescript
// 1. Pre-initialization Checks
- WebGL support detection
- Token format validation
- Container element validation

// 2. Initialization Errors
- Map creation failures
- Style loading failures
- Network connectivity issues

// 3. Runtime Errors
- Tile loading failures
- Rate limit exceeded
- Network disconnection

// 4. User-triggered Errors
- Invalid coordinates
- Invalid zoom levels
```

#### Error Recovery Flow

```
Error Detected
   ↓
Classify Error (Retryable vs Non-Retryable)
   ↓
If Retryable:
   - Show retry UI
   - Attempt retry with exponential backoff
   - Max 3 attempts
   ↓
If Non-Retryable or Max Retries Exceeded:
   - Show error message
   - Log to Sentry
   - Provide fallback options
```

#### Error Messages

```typescript
export const ERROR_MESSAGES = {
  [MapErrorCode.WEBGL_NOT_SUPPORTED]: {
    title: 'WebGL Not Supported',
    message: 'Your browser doesn\'t support WebGL, which is required for map display. Please try updating your browser or using a different one.',
    retryable: false,
  },
  [MapErrorCode.INVALID_TOKEN]: {
    title: 'Configuration Error',
    message: 'There was a problem with the map configuration. Please try again later.',
    retryable: false,
  },
  [MapErrorCode.NETWORK_ERROR]: {
    title: 'Connection Error',
    message: 'Unable to load the map due to a network issue. Please check your connection and try again.',
    retryable: true,
  },
  [MapErrorCode.RATE_LIMIT_EXCEEDED]: {
    title: 'Too Many Requests',
    message: 'The map service is temporarily unavailable. Please try again in a few moments.',
    retryable: true,
  },
  [MapErrorCode.STYLE_LOAD_ERROR]: {
    title: 'Map Style Error',
    message: 'Unable to load the map style. We\'ll try using a fallback style.',
    retryable: true,
  },
  [MapErrorCode.CONTAINER_SIZE_ZERO]: {
    title: 'Display Error',
    message: 'The map container is not properly sized. Please refresh the page.',
    retryable: true,
  },
  [MapErrorCode.INITIALIZATION_ERROR]: {
    title: 'Map Initialization Error',
    message: 'Unable to initialize the map. Please try again.',
    retryable: true,
  },
  [MapErrorCode.UNKNOWN_ERROR]: {
    title: 'Unexpected Error',
    message: 'An unexpected error occurred. Please try refreshing the page.',
    retryable: true,
  },
};
```

### 5. WebGL Detection Strategy

```typescript
/**
 * Detects WebGL support in the browser
 *
 * Strategy:
 * 1. Check if WebGL context can be created
 * 2. Check for performance caveats
 * 3. Use Mapbox GL JS built-in detection as fallback
 */
export function detectWebGLSupport(): WebGLSupportResult {
  // First check: Try creating a WebGL context
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

    if (!gl) {
      return { supported: false, reason: 'WebGL context creation failed' };
    }

    // Second check: Performance caveat
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    if (debugInfo) {
      const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
      if (renderer.includes('SwiftShader')) {
        return {
          supported: true,
          performanceCaveat: true,
          reason: 'Software rendering detected'
        };
      }
    }

    return { supported: true };
  } catch (error) {
    // Fallback to Mapbox GL JS detection
    if (typeof mapboxgl !== 'undefined') {
      return {
        supported: mapboxgl.supported(),
        reason: 'Using Mapbox GL JS detection'
      };
    }

    return { supported: false, reason: 'WebGL detection failed' };
  }
}
```

### 6. Loading States

```typescript
// Loading State Progression
1. Initial Mount
   - Show LoadingSkeleton
   - Initialize WebGL detection

2. WebGL Check
   - If failed: Show error immediately
   - If passed: Continue to initialization

3. Map Initialization
   - Show "Initializing map..." message
   - Create map instance

4. Style Loading
   - Show "Loading map tiles..." message
   - Wait for 'style.load' event

5. Loaded
   - Fire onLoad callback
   - Show interactive map
   - Hide loading state
```

---

## Edge Case Handling

### 1. Invalid or Expired Mapbox Token

**Detection:**
```typescript
// Token format validation
function isValidMapboxToken(token: string): boolean {
  return /^pk\.[a-zA-Z0-9_-]{50,}$/.test(token);
}

// Initialization error detection
map.on('error', (e) => {
  if (e.error?.status === 401 || e.error?.message?.includes('Unauthorized')) {
    handleInvalidToken();
  }
});
```

**Handling:**
```typescript
if (!isValidMapboxToken(accessToken)) {
  setError({
    code: MapErrorCode.INVALID_TOKEN,
    message: ERROR_MESSAGES[MapErrorCode.INVALID_TOKEN].message,
    retryable: false,
  });
  return;
}
```

**User Experience:**
- Show error message: "Configuration Error"
- No retry option (requires developer fix)
- Log to Sentry for developer notification

---

### 2. Network Failure Loading Map Tiles

**Detection:**
```typescript
map.on('error', (e) => {
  if (e.error?.message?.includes('Failed to fetch') ||
      e.error?.message?.includes('NetworkError')) {
    handleNetworkError();
  }
});

// Also detect during initialization
const initTimeout = setTimeout(() => {
  if (!isLoaded) {
    handleNetworkTimeout();
  }
}, MAP_LOAD_TIMEOUT);
```

**Handling:**
```typescript
async function handleNetworkError() {
  if (retryCount < MAX_RETRY_ATTEMPTS) {
    setError({
      code: MapErrorCode.NETWORK_ERROR,
      message: 'Retrying connection...',
      retryable: true,
    });

    await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * (retryCount + 1)));
    retryInitialization();
  } else {
    setError({
      code: MapErrorCode.NETWORK_ERROR,
      message: ERROR_MESSAGES[MapErrorCode.NETWORK_ERROR].message,
      retryable: true,
    });
  }
}
```

**User Experience:**
- Automatic retry up to 3 times with exponential backoff (2s, 4s, 6s)
- Show retry progress to user
- After max retries, show "Retry" button
- Provide manual retry option

---

### 3. Mapbox API Rate Limit Exceeded

**Detection:**
```typescript
map.on('error', (e) => {
  if (e.error?.status === 429 ||
      e.error?.message?.includes('rate limit')) {
    handleRateLimit();
  }
});
```

**Handling:**
```typescript
function handleRateLimit() {
  setError({
    code: MapErrorCode.RATE_LIMIT_EXCEEDED,
    message: ERROR_MESSAGES[MapErrorCode.RATE_LIMIT_EXCEEDED].message,
    retryable: true,
  });

  // Longer retry delay for rate limits
  const retryDelay = 60000; // 1 minute
  setTimeout(() => {
    setError(null);
    retryInitialization();
  }, retryDelay);
}
```

**User Experience:**
- Show message: "Too many requests, retrying in 1 minute..."
- Automatic retry after 1 minute
- Countdown timer showing time until retry
- Log to Sentry for monitoring (may indicate abuse)

---

### 4. Browser Doesn't Support WebGL

**Detection:**
```typescript
// Detect before map initialization
useEffect(() => {
  const webglSupport = detectWebGLSupport();

  if (!webglSupport.supported) {
    setError({
      code: MapErrorCode.WEBGL_NOT_SUPPORTED,
      message: ERROR_MESSAGES[MapErrorCode.WEBGL_NOT_SUPPORTED].message,
      retryable: false,
    });
    return;
  }

  if (webglSupport.performanceCaveat) {
    // Show warning but continue
    console.warn('WebGL performance may be degraded');
  }

  initializeMap();
}, []);
```

**Handling:**
```typescript
if (!detectWebGLSupport().supported) {
  return (
    <ErrorDisplay
      variant="error"
      title="WebGL Not Supported"
      message="Your browser doesn't support WebGL, which is required for interactive maps. Please update your browser or try a different one."
      icon={<AlertTriangle className="w-16 h-16" />}
    />
  );
}
```

**User Experience:**
- Detect before initialization (fast failure)
- Clear error message explaining the issue
- Provide browser update suggestions
- List compatible browsers (Chrome, Firefox, Safari, Edge)
- No retry option (not retryable)

---

### 5. Map Container Size is 0

**Detection:**
```typescript
function validateContainer(container: HTMLElement): boolean {
  const rect = container.getBoundingClientRect();

  if (rect.width === 0 || rect.height === 0) {
    return false;
  }

  if (rect.width < MIN_CONTAINER_WIDTH || rect.height < MIN_CONTAINER_HEIGHT) {
    console.warn('Map container is very small', rect);
  }

  return true;
}
```

**Handling:**
```typescript
useEffect(() => {
  const container = containerRef.current;
  if (!container) return;

  // Wait for container to be sized
  const checkSize = () => {
    if (validateContainer(container)) {
      initializeMap();
    } else {
      // Container not ready, wait for resize
      setTimeout(checkSize, 100);
    }
  };

  checkSize();

  // Also listen for resize events
  const resizeObserver = new ResizeObserver(() => {
    if (mapInstance && validateContainer(container)) {
      mapInstance.resize();
    }
  });

  resizeObserver.observe(container);

  return () => resizeObserver.disconnect();
}, []);
```

**User Experience:**
- Wait for container to be properly sized (with timeout)
- If timeout exceeded, show error with refresh suggestion
- Automatically resize map when container size changes
- Handle dynamic container sizing (e.g., sidebar open/close)

---

### 6. Multiple Maps on Same Page

**Detection & Handling:**
```typescript
// Each map instance has unique container ID
function generateMapContainerId(): string {
  return `map-container-${Math.random().toString(36).substr(2, 9)}`;
}

// Component implementation
function Map(props: MapProps) {
  const containerIdRef = useRef(generateMapContainerId());
  const mapInstanceRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    // Each map gets its own instance
    const map = new mapboxgl.Map({
      container: containerIdRef.current,
      accessToken: getAccessToken(),
      ...mapOptions,
    });

    mapInstanceRef.current = map;

    return () => {
      // Cleanup specific to this instance
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return <div id={containerIdRef.current} className={className} />;
}
```

**User Experience:**
- Each map instance is completely independent
- Proper cleanup prevents memory leaks
- No interference between multiple maps
- Each map can have different configurations

---

### 7. Map Fails to Load

**Detection:**
```typescript
// Comprehensive error detection
useEffect(() => {
  let mounted = true;
  let loadTimeout: NodeJS.Timeout;

  async function initMap() {
    try {
      // Set load timeout
      loadTimeout = setTimeout(() => {
        if (mounted && !isLoaded) {
          handleLoadTimeout();
        }
      }, MAP_LOAD_TIMEOUT);

      const map = new mapboxgl.Map({...options});

      map.on('load', () => {
        if (mounted) {
          clearTimeout(loadTimeout);
          setIsLoaded(true);
          onLoad?.(map);
        }
      });

      map.on('error', (e) => {
        if (mounted) {
          clearTimeout(loadTimeout);
          handleMapError(e);
        }
      });

    } catch (error) {
      if (mounted) {
        handleInitError(error);
      }
    }
  }

  initMap();

  return () => {
    mounted = false;
    clearTimeout(loadTimeout);
  };
}, []);
```

**Handling:**
```typescript
function handleMapError(error: any) {
  // Classify error
  const mapError = classifyMapError(error);

  // Log to Sentry
  Sentry.captureException(error, {
    tags: { component: 'Map', errorCode: mapError.code },
    extra: { mapConfig: getMapConfig() },
  });

  // Show user-friendly error
  setError(mapError);

  // Attempt automatic recovery for retryable errors
  if (mapError.retryable && retryCount < MAX_RETRY_ATTEMPTS) {
    scheduleRetry();
  }
}
```

**User Experience:**
- Show specific error message based on failure type
- Automatic retry for transient failures
- Manual retry button for persistent failures
- Clear indication of what went wrong
- Suggest concrete actions user can take

---

## Code Examples

### 1. Map Component Skeleton

File: `frontend/components/map/Map.tsx`

```typescript
"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import { MapProps, MapError, MapErrorCode, MapState } from './types';
import {
  detectWebGLSupport,
  validateContainer,
  isValidMapboxToken,
  classifyMapError
} from '@/lib/map/mapUtils';
import {
  CEBU_CITY_CENTER,
  DEFAULT_ZOOM,
  MAP_LOAD_TIMEOUT,
  MAX_RETRY_ATTEMPTS,
  RETRY_DELAY
} from '@/lib/map/constants';
import { ERROR_MESSAGES } from '@/lib/map/errorMessages';
import { MapLoadingState } from './MapLoadingState';
import { MapErrorState } from './MapErrorState';
import { cn } from '@/lib/utils';
import * as Sentry from '@/lib/sentry';

/**
 * Map Component - Interactive Mapbox GL JS map
 *
 * Provides a fully-featured interactive map with error handling,
 * loading states, and WebGL detection.
 *
 * @example
 * ```tsx
 * <Map
 *   initialCenter={[123.8854, 10.3157]}
 *   initialZoom={13}
 *   onLoad={(map) => console.log('Map loaded', map)}
 *   className="h-screen"
 * />
 * ```
 */
export const Map = React.forwardRef<HTMLDivElement, MapProps>(
  (
    {
      initialCenter = CEBU_CITY_CENTER,
      initialZoom = DEFAULT_ZOOM,
      style = process.env.NEXT_PUBLIC_MAPBOX_STYLE,
      className,
      containerStyle,
      interactive = true,
      scrollZoom = true,
      dragPan = true,
      dragRotate = false,
      doubleClickZoom = true,
      touchZoomRotate = true,
      showNavigationControl = true,
      showGeolocateControl = true,
      showScaleControl = false,
      navigationControlPosition = 'top-right',
      maxBounds,
      minZoom = 10,
      maxZoom = 18,
      onLoad,
      onError,
      onClick,
      onMoveEnd,
      onZoomEnd,
      preserveDrawingBuffer = false,
      failIfMajorPerformanceCaveat = false,
      loadingComponent,
      errorComponent,
      retryOnError = true,
    },
    ref
  ) => {
    // Refs
    const containerRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<mapboxgl.Map | null>(null);
    const loadTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // State
    const [mapState, setMapState] = useState<MapState>({
      isLoaded: false,
      isLoading: true,
      error: null,
      center: null,
      zoom: null,
    });
    const [retryCount, setRetryCount] = useState(0);

    // Destructure state for easier access
    const { isLoaded, isLoading, error } = mapState;

    /**
     * Handle map errors
     */
    const handleError = useCallback((error: MapError) => {
      setMapState(prev => ({ ...prev, error, isLoading: false }));

      // Log to Sentry
      Sentry.captureException(error.originalError || new Error(error.message), {
        tags: {
          component: 'Map',
          errorCode: error.code,
          retryable: error.retryable,
        },
        extra: {
          retryCount,
          initialCenter,
          initialZoom,
        },
      });

      // Call user-provided error handler
      onError?.(error);
    }, [onError, retryCount, initialCenter, initialZoom]);

    /**
     * Retry map initialization
     */
    const retryInitialization = useCallback(() => {
      if (retryCount >= MAX_RETRY_ATTEMPTS) {
        handleError({
          code: MapErrorCode.INITIALIZATION_ERROR,
          message: 'Maximum retry attempts exceeded',
          retryable: false,
        });
        return;
      }

      setRetryCount(prev => prev + 1);
      setMapState(prev => ({
        ...prev,
        error: null,
        isLoading: true
      }));

      // Cleanup existing map if any
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      // Retry after delay
      setTimeout(() => {
        initializeMap();
      }, RETRY_DELAY * (retryCount + 1));
    }, [retryCount, handleError]);

    /**
     * Initialize map
     */
    const initializeMap = useCallback(async () => {
      const container = containerRef.current;
      if (!container) return;

      try {
        // 1. Check WebGL support
        const webglSupport = detectWebGLSupport();
        if (!webglSupport.supported) {
          handleError({
            code: MapErrorCode.WEBGL_NOT_SUPPORTED,
            message: ERROR_MESSAGES[MapErrorCode.WEBGL_NOT_SUPPORTED].message,
            retryable: false,
          });
          return;
        }

        // 2. Validate access token
        const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
        if (!accessToken || !isValidMapboxToken(accessToken)) {
          handleError({
            code: MapErrorCode.INVALID_TOKEN,
            message: ERROR_MESSAGES[MapErrorCode.INVALID_TOKEN].message,
            retryable: false,
          });
          return;
        }

        // 3. Validate container
        if (!validateContainer(container)) {
          // Wait a bit and try again
          setTimeout(() => {
            if (validateContainer(container)) {
              initializeMap();
            } else {
              handleError({
                code: MapErrorCode.CONTAINER_SIZE_ZERO,
                message: ERROR_MESSAGES[MapErrorCode.CONTAINER_SIZE_ZERO].message,
                retryable: true,
              });
            }
          }, 100);
          return;
        }

        // 4. Set access token
        mapboxgl.accessToken = accessToken;

        // 5. Create map instance
        const map = new mapboxgl.Map({
          container,
          style: style || process.env.NEXT_PUBLIC_MAPBOX_STYLE,
          center: initialCenter,
          zoom: initialZoom,
          interactive,
          scrollZoom,
          dragPan,
          dragRotate,
          doubleClickZoom,
          touchZoomRotate,
          maxBounds,
          minZoom,
          maxZoom,
          preserveDrawingBuffer,
          failIfMajorPerformanceCaveat,
        });

        // 6. Set up load timeout
        loadTimeoutRef.current = setTimeout(() => {
          if (!isLoaded) {
            handleError({
              code: MapErrorCode.NETWORK_ERROR,
              message: 'Map loading timeout exceeded',
              retryable: true,
            });
          }
        }, MAP_LOAD_TIMEOUT);

        // 7. Handle load event
        map.on('load', () => {
          if (loadTimeoutRef.current) {
            clearTimeout(loadTimeoutRef.current);
          }

          setMapState(prev => ({
            ...prev,
            isLoaded: true,
            isLoading: false,
            center: initialCenter,
            zoom: initialZoom,
          }));

          onLoad?.(map);
        });

        // 8. Handle errors
        map.on('error', (e) => {
          const mapError = classifyMapError(e.error);
          handleError(mapError);
        });

        // 9. Add controls
        if (showNavigationControl) {
          map.addControl(
            new mapboxgl.NavigationControl(),
            navigationControlPosition
          );
        }

        if (showGeolocateControl) {
          map.addControl(
            new mapboxgl.GeolocateControl({
              positionOptions: { enableHighAccuracy: true },
              trackUserLocation: true,
            }),
            navigationControlPosition
          );
        }

        if (showScaleControl) {
          map.addControl(new mapboxgl.ScaleControl());
        }

        // 10. Set up event listeners
        if (onClick) {
          map.on('click', onClick);
        }

        if (onMoveEnd) {
          map.on('moveend', onMoveEnd);
        }

        if (onZoomEnd) {
          map.on('zoomend', onZoomEnd);
        }

        // 11. Store map instance
        mapInstanceRef.current = map;

      } catch (error) {
        const mapError = classifyMapError(error);
        handleError(mapError);
      }
    }, [
      initialCenter,
      initialZoom,
      style,
      interactive,
      scrollZoom,
      dragPan,
      dragRotate,
      doubleClickZoom,
      touchZoomRotate,
      maxBounds,
      minZoom,
      maxZoom,
      showNavigationControl,
      showGeolocateControl,
      showScaleControl,
      navigationControlPosition,
      preserveDrawingBuffer,
      failIfMajorPerformanceCaveat,
      onClick,
      onMoveEnd,
      onZoomEnd,
      onLoad,
      handleError,
      isLoaded,
    ]);

    /**
     * Initialize on mount
     */
    useEffect(() => {
      initializeMap();

      // Cleanup on unmount
      return () => {
        if (loadTimeoutRef.current) {
          clearTimeout(loadTimeoutRef.current);
        }

        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }
      };
    }, [initializeMap]);

    /**
     * Handle container resize
     */
    useEffect(() => {
      const container = containerRef.current;
      if (!container || !mapInstanceRef.current) return;

      const resizeObserver = new ResizeObserver(() => {
        mapInstanceRef.current?.resize();
      });

      resizeObserver.observe(container);

      return () => resizeObserver.disconnect();
    }, []);

    /**
     * Render
     */
    return (
      <div
        ref={ref}
        className={cn('relative w-full h-full', className)}
        style={containerStyle}
      >
        {/* Map Container */}
        <div
          ref={containerRef}
          className="absolute inset-0 w-full h-full"
          style={{ minHeight: '300px' }}
        />

        {/* Loading State */}
        {isLoading && !error && (
          loadingComponent || <MapLoadingState />
        )}

        {/* Error State */}
        {error && (
          errorComponent || (
            <MapErrorState
              error={error}
              onRetry={retryOnError && error.retryable ? retryInitialization : undefined}
              retryCount={retryCount}
            />
          )
        )}
      </div>
    );
  }
);

Map.displayName = 'Map';
```

---

### 2. Usage Examples

#### Basic Usage

```typescript
import { Map } from '@/components/map';

export default function MapPage() {
  return (
    <div className="h-screen">
      <Map />
    </div>
  );
}
```

#### Advanced Usage with Custom Configuration

```typescript
import { Map } from '@/components/map';
import { CEBU_CITY_BOUNDS } from '@/lib/map/constants';

export default function CustomMapPage() {
  const handleMapLoad = (map: mapboxgl.Map) => {
    console.log('Map loaded successfully', map);

    // Add a marker
    new mapboxgl.Marker()
      .setLngLat([123.8854, 10.3157])
      .addTo(map);
  };

  const handleMapError = (error: MapError) => {
    console.error('Map error:', error);
  };

  return (
    <div className="h-screen">
      <Map
        initialCenter={[123.8854, 10.3157]}
        initialZoom={14}
        maxBounds={CEBU_CITY_BOUNDS}
        showNavigationControl
        showGeolocateControl
        onLoad={handleMapLoad}
        onError={handleMapError}
        className="w-full h-full"
      />
    </div>
  );
}
```

#### With Custom Loading and Error States

```typescript
import { Map } from '@/components/map';
import { Spinner } from '@/components/ui/spinner';
import { ErrorDisplay } from '@/components/ui/error-display';

export default function CustomStatesMapPage() {
  return (
    <div className="h-screen">
      <Map
        loadingComponent={
          <div className="flex items-center justify-center h-full bg-bg-white">
            <Spinner size="lg" />
            <p className="ml-4 text-text-secondary">Loading map...</p>
          </div>
        }
        errorComponent={
          <ErrorDisplay
            title="Map Unavailable"
            message="The map could not be loaded. Please try again later."
            variant="error"
          />
        }
      />
    </div>
  );
}
```

#### Multiple Maps on Same Page

```typescript
import { Map } from '@/components/map';

export default function MultiMapPage() {
  return (
    <div className="grid grid-cols-2 gap-4 h-screen p-4">
      <Map
        initialCenter={[123.8854, 10.3157]}
        initialZoom={13}
        className="h-full"
      />
      <Map
        initialCenter={[123.9000, 10.3200]}
        initialZoom={15}
        className="h-full"
      />
    </div>
  );
}
```

---

### 3. Error Handling Examples

#### Complete Error Handler

```typescript
import { MapError, MapErrorCode } from '@/components/map/types';
import * as Sentry from '@sentry/nextjs';

function handleMapError(error: MapError) {
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Map Error:', error);
  }

  // Log to Sentry in production
  if (process.env.NODE_ENV === 'production') {
    Sentry.captureException(error.originalError || new Error(error.message), {
      tags: {
        component: 'Map',
        errorCode: error.code,
        retryable: error.retryable,
      },
    });
  }

  // Handle specific error types
  switch (error.code) {
    case MapErrorCode.WEBGL_NOT_SUPPORTED:
      // Show browser upgrade prompt
      showBrowserUpgradePrompt();
      break;

    case MapErrorCode.NETWORK_ERROR:
      // Show offline indicator
      showOfflineIndicator();
      break;

    case MapErrorCode.RATE_LIMIT_EXCEEDED:
      // Notify admins of potential abuse
      notifyAdmins('Map rate limit exceeded');
      break;

    default:
      // Generic error handling
      showGenericErrorToast();
  }
}
```

---

### 4. TypeScript Type Definitions

File: `frontend/components/map/types.ts`

```typescript
import mapboxgl from 'mapbox-gl';

/**
 * Map Component Props
 */
export interface MapProps {
  // Core Configuration
  initialCenter?: [number, number];
  initialZoom?: number;
  style?: string;

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

  // Control Configuration
  showNavigationControl?: boolean;
  showGeolocateControl?: boolean;
  showScaleControl?: boolean;
  navigationControlPosition?: ControlPosition;

  // Bounds Configuration
  maxBounds?: [[number, number], [number, number]];
  minZoom?: number;
  maxZoom?: number;

  // Event Handlers
  onLoad?: (map: mapboxgl.Map) => void;
  onError?: (error: MapError) => void;
  onClick?: (event: mapboxgl.MapMouseEvent) => void;
  onMoveEnd?: (event: mapboxgl.MapboxEvent) => void;
  onZoomEnd?: (event: mapboxgl.MapboxEvent) => void;

  // Advanced Configuration
  preserveDrawingBuffer?: boolean;
  failIfMajorPerformanceCaveat?: boolean;

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
 * WebGL Support Detection
 */
export interface WebGLSupportResult {
  supported: boolean;
  reason?: string;
  performanceCaveat?: boolean;
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
```

---

## Performance Strategy

### 1. Bundle Size Optimization

**Problem:** Mapbox GL JS is ~500KB minified

**Solution:**

```typescript
// 1. Use dynamic imports for code splitting
// File: frontend/app/map/page.tsx

import dynamic from 'next/dynamic';
import { LoadingSkeleton } from '@/components/ui/loading-skeleton';

// Lazy load the Map component
const Map = dynamic(
  () => import('@/components/map').then(mod => ({ default: mod.Map })),
  {
    loading: () => <LoadingSkeleton variant="custom" className="h-screen" />,
    ssr: false, // Disable SSR for map component
  }
);

export default function MapPage() {
  return (
    <div className="h-screen">
      <Map />
    </div>
  );
}
```

**Benefits:**
- Map code only loads when needed
- Reduces initial bundle size
- Improves First Contentful Paint (FCP)
- Better Core Web Vitals scores

---

### 2. Code Splitting Approach

**Strategy: Route-based Splitting**

```typescript
// Next.js automatically code-splits by route
// Map component only loads on /map page

// app/map/page.tsx - Only loads when user visits /map
export default MapPage

// app/page.tsx - Main landing page doesn't include map code
export default HomePage
```

**Additional Splitting:**

```typescript
// Split heavy features into separate chunks
const MarkerCluster = dynamic(() => import('@/components/map/MarkerCluster'));
const DrawTools = dynamic(() => import('@/components/map/DrawTools'));
const AdvancedControls = dynamic(() => import('@/components/map/AdvancedControls'));
```

---

### 3. Lazy Loading Strategy

**Implementation:**

```typescript
// 1. Lazy load map on user interaction
export default function HomePage() {
  const [showMap, setShowMap] = useState(false);

  return (
    <>
      <button onClick={() => setShowMap(true)}>
        View Map
      </button>

      {showMap && <Map />}
    </>
  );
}

// 2. Lazy load map when element is in viewport
import { useInView } from 'react-intersection-observer';

export default function PageWithMap() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div ref={ref} className="h-screen">
      {inView && <Map />}
    </div>
  );
}

// 3. Prefetch map on hover/focus
export default function Navigation() {
  const prefetchMap = () => {
    // Prefetch map component
    import('@/components/map');
  };

  return (
    <Link
      href="/map"
      onMouseEnter={prefetchMap}
      onFocus={prefetchMap}
    >
      View Map
    </Link>
  );
}
```

---

### 4. Mobile Performance Considerations

**Optimizations:**

```typescript
// 1. Reduce tile quality on mobile
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

const mapOptions = {
  ...baseOptions,
  // Lower max zoom on mobile to reduce tile loading
  maxZoom: isMobile ? 16 : 18,
  // Reduce pixel ratio on low-end devices
  pixelRatio: isMobile ? 1 : window.devicePixelRatio,
};

// 2. Debounce expensive operations
import { debounce } from 'lodash';

const handleMapMove = debounce((e) => {
  // Expensive operation (e.g., fetch markers)
  updateVisibleMarkers(e.target.getBounds());
}, 300);

map.on('moveend', handleMapMove);

// 3. Use React.memo to prevent unnecessary re-renders
export const Map = React.memo(
  MapComponent,
  (prevProps, nextProps) => {
    // Custom comparison
    return (
      prevProps.initialCenter[0] === nextProps.initialCenter[0] &&
      prevProps.initialCenter[1] === nextProps.initialCenter[1] &&
      prevProps.initialZoom === nextProps.initialZoom
    );
  }
);

// 4. Cleanup on mobile to free memory
useEffect(() => {
  const handleVisibilityChange = () => {
    if (document.hidden && isMobile) {
      // Stop rendering when app is backgrounded
      map.stop();
    } else {
      map.resume();
    }
  };

  document.addEventListener('visibilitychange', handleVisibilityChange);

  return () => {
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  };
}, [map]);
```

**Mobile-Specific Settings:**

```typescript
// Optimize for touch devices
const mobileMapConfig = {
  touchPitch: false, // Disable pitch on touch (simpler UX)
  touchZoomRotate: true, // Allow pinch to zoom
  dragRotate: false, // Disable rotation (less confusing)
  scrollZoom: { around: 'center' }, // Zoom to center, not cursor
};
```

**Network Considerations:**

```typescript
// Detect network speed and adjust quality
const connection = (navigator as any).connection;

if (connection) {
  const effectiveType = connection.effectiveType; // '4g', '3g', '2g', 'slow-2g'

  if (effectiveType === '2g' || effectiveType === 'slow-2g') {
    // Use lower quality tiles on slow connections
    mapOptions.maxZoom = 14;
    mapOptions.pixelRatio = 1;
  }
}
```

---

### 5. Performance Monitoring

```typescript
// Track map performance metrics
function trackMapPerformance(map: mapboxgl.Map) {
  // 1. Track load time
  const loadStart = performance.now();

  map.on('load', () => {
    const loadTime = performance.now() - loadStart;

    // Log to analytics
    analytics.track('map_loaded', {
      loadTime,
      initialZoom: map.getZoom(),
      initialCenter: map.getCenter(),
    });

    // Warn if slow
    if (loadTime > 3000) {
      console.warn(`Map load time exceeded 3s: ${loadTime}ms`);
    }
  });

  // 2. Track FPS
  let frameCount = 0;
  let lastTime = performance.now();

  const measureFPS = () => {
    frameCount++;
    const currentTime = performance.now();

    if (currentTime >= lastTime + 1000) {
      const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));

      if (fps < 30) {
        console.warn(`Low FPS detected: ${fps}`);
      }

      frameCount = 0;
      lastTime = currentTime;
    }

    requestAnimationFrame(measureFPS);
  };

  map.on('load', () => {
    requestAnimationFrame(measureFPS);
  });

  // 3. Track tile loading
  let tilesLoading = 0;

  map.on('dataloading', (e) => {
    if (e.dataType === 'source') {
      tilesLoading++;
    }
  });

  map.on('data', (e) => {
    if (e.dataType === 'source') {
      tilesLoading--;

      if (tilesLoading === 0) {
        analytics.track('map_tiles_loaded');
      }
    }
  });
}
```

---

## Testing Approach

### 1. Manual Testing Checklist

#### Core Functionality
- [ ] Map renders on desktop (Chrome, Firefox, Safari, Edge)
- [ ] Map renders on mobile (iOS Safari, Chrome Mobile, Samsung Internet)
- [ ] Map displays correct initial center (Cebu City)
- [ ] Map displays correct initial zoom level (13)
- [ ] Map uses correct Mapbox style (streets-v12)
- [ ] Map tiles load completely
- [ ] Map is interactive (pan, zoom, pinch)

#### Controls
- [ ] Navigation controls are visible and functional
- [ ] Geolocate control is visible and requests permission
- [ ] Zoom in/out buttons work correctly
- [ ] Compass/bearing reset works
- [ ] Controls are positioned correctly (top-right)

#### Performance
- [ ] Map loads within 3 seconds on 3G
- [ ] Map loads within 1 second on WiFi
- [ ] Pan/zoom is smooth (no jank)
- [ ] FPS stays above 30 during interaction
- [ ] No memory leaks after 5 minutes of use

#### Responsiveness
- [ ] Map fills container correctly on all screen sizes
- [ ] Map resizes correctly when container changes
- [ ] Portrait and landscape orientations work
- [ ] Touch events work on mobile
- [ ] Multi-touch (pinch zoom) works

#### Loading States
- [ ] Loading skeleton shows while map initializes
- [ ] Loading message is clear and visible
- [ ] Loading state transitions smoothly to loaded state
- [ ] No flash of unstyled content (FOUC)

---

### 2. Edge Cases to Test

#### Error Scenarios

**Test 1: Invalid Mapbox Token**
```
Steps:
1. Temporarily change NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN to invalid value
2. Reload page
3. Verify error message displays: "Configuration Error"
4. Verify no retry button shows
5. Verify error is logged to Sentry
6. Restore valid token
```

**Test 2: Network Failure**
```
Steps:
1. Open DevTools Network tab
2. Set throttling to "Offline"
3. Reload page
4. Verify error message displays: "Connection Error"
5. Verify retry button shows
6. Set throttling to "Online"
7. Click retry button
8. Verify map loads successfully
```

**Test 3: WebGL Disabled**
```
Steps:
1. Open Chrome flags (chrome://flags)
2. Disable WebGL
3. Reload page
4. Verify error message: "WebGL Not Supported"
5. Verify helpful message with browser upgrade suggestion
6. Re-enable WebGL
```

**Test 4: Container Size Zero**
```
Steps:
1. Add CSS to make map container display: none
2. Mount map component
3. Verify error handling (no crash)
4. Remove CSS (make visible)
5. Verify map initializes correctly
```

**Test 5: Rate Limit Exceeded**
```
Steps:
1. This is hard to test manually
2. Mock the error in code temporarily:
   map.fire('error', { error: { status: 429 } });
3. Verify rate limit error message shows
4. Verify automatic retry after delay
```

**Test 6: Multiple Maps**
```
Steps:
1. Create page with 2 map components
2. Verify both maps render independently
3. Verify both maps are interactive
4. Verify no conflicts or crashes
5. Verify proper cleanup (check memory)
```

---

### 3. Browser Compatibility Testing

#### Desktop Browsers

| Browser | Version | Test Items |
|---------|---------|------------|
| Chrome | Latest | Full functionality, WebGL, performance |
| Firefox | Latest | Full functionality, WebGL, performance |
| Safari | Latest | Full functionality, WebGL, touch events |
| Edge | Latest | Full functionality, WebGL, performance |

#### Mobile Browsers

| Browser | Device | Test Items |
|---------|--------|------------|
| Safari | iOS 15+ | Touch events, pinch zoom, performance |
| Chrome | Android 10+ | Touch events, pinch zoom, performance |
| Samsung Internet | Latest | Touch events, pinch zoom, performance |

#### Testing Procedure

For each browser/device:
1. Open map page
2. Verify visual rendering
3. Test pan/zoom interactions
4. Test touch gestures (mobile)
5. Check controls functionality
6. Monitor performance (FPS)
7. Check console for errors
8. Test error scenarios
9. Document any issues

---

### 4. Accessibility Testing

#### Screen Reader Testing

```
Test with:
- NVDA (Windows)
- JAWS (Windows)
- VoiceOver (macOS/iOS)

Verify:
- Map container has proper ARIA labels
- Controls are keyboard accessible
- Error messages are announced
- Loading states are announced
```

#### Keyboard Navigation Testing

```
Test:
- Tab through all controls
- Use arrow keys to pan
- Use +/- to zoom
- Use Enter to activate controls
- Use Escape to close popups

Verify:
- Focus indicators are visible
- Tab order is logical
- No keyboard traps
- All interactive elements accessible
```

#### Color Contrast Testing

```
Use:
- Chrome DevTools Lighthouse
- axe DevTools
- WAVE browser extension

Verify:
- Error messages meet WCAG AA (4.5:1)
- Control buttons meet WCAG AA
- Loading text meets WCAG AA
```

---

### 5. Performance Testing

#### Load Time Testing

```
Tools:
- Chrome DevTools Performance tab
- Lighthouse
- WebPageTest

Metrics to measure:
- Time to First Byte (TTFB)
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Time to Interactive (TTI)
- Total Blocking Time (TBT)

Targets:
- Map visible in < 3s on 3G
- Map interactive in < 5s on 3G
- LCP < 2.5s
- TBT < 300ms
```

#### FPS Testing

```
Tools:
- Chrome DevTools FPS meter
- Manual observation

Test scenarios:
- Continuous panning for 30 seconds
- Continuous zooming in/out
- Rapid pinch-zoom on mobile

Target:
- Maintain 60 FPS on desktop
- Maintain 30 FPS on mobile
- No dropped frames > 100ms
```

#### Memory Testing

```
Tools:
- Chrome DevTools Memory profiler

Test procedure:
1. Take heap snapshot
2. Use map for 5 minutes (pan, zoom, interact)
3. Take another heap snapshot
4. Compare memory usage

Target:
- Memory growth < 50MB after 5 minutes
- No memory leaks
- Garbage collection happens regularly
```

---

## Rollout Plan

### Phase 1: Development (Day 1, Hours 1-4)

**Goals:**
- Complete implementation
- Basic testing

**Tasks:**
1. Install dependencies (30 mins)
2. Create infrastructure files (1 hour)
3. Implement core Map component (2 hours)
4. Implement error handling (30 mins)
5. Basic manual testing (30 mins)

**Success Criteria:**
- [ ] Map renders successfully
- [ ] Basic error handling works
- [ ] No console errors

---

### Phase 2: Testing & Refinement (Day 1, Hours 5-6)

**Goals:**
- Comprehensive testing
- Bug fixes

**Tasks:**
1. Complete manual testing checklist (1 hour)
2. Test edge cases (30 mins)
3. Fix any bugs found (30 mins)
4. Cross-browser testing (30 mins)

**Success Criteria:**
- [ ] All test cases pass
- [ ] All edge cases handled
- [ ] Works on all target browsers

---

### Phase 3: Optimization (Day 1, Hours 7-8)

**Goals:**
- Performance optimization
- Code quality

**Tasks:**
1. Implement code splitting (30 mins)
2. Optimize re-renders (30 mins)
3. Add performance monitoring (30 mins)
4. Code review and cleanup (30 mins)

**Success Criteria:**
- [ ] Load time < 3s on 3G
- [ ] FPS > 30 on mobile
- [ ] Code is clean and well-documented

---

### Phase 4: Integration (Day 1, Hour 8)

**Goals:**
- Integrate with existing app
- Update documentation

**Tasks:**
1. Update map page (15 mins)
2. Update component exports (15 mins)
3. Update documentation (15 mins)
4. Final testing (15 mins)

**Success Criteria:**
- [ ] Map page works end-to-end
- [ ] Component is exported properly
- [ ] Documentation is complete

---

### Phase 5: Deployment

**Pre-deployment Checklist:**
- [ ] All tests pass
- [ ] Performance targets met
- [ ] Error handling tested
- [ ] Documentation complete
- [ ] Code reviewed
- [ ] No console errors
- [ ] Accessibility verified

**Deployment Steps:**
1. Create pull request
2. Request code review
3. Address review feedback
4. Merge to main branch
5. Verify deployment
6. Monitor for errors (Sentry)
7. Verify performance metrics

**Post-deployment:**
- [ ] Monitor Sentry for errors
- [ ] Check analytics for map usage
- [ ] Verify performance in production
- [ ] Gather user feedback

---

## Appendices

### A. File Structure

Complete file tree after implementation:

```
frontend/
├── app/
│   └── map/
│       └── page.tsx                 # Map page (updated)
├── components/
│   ├── map/
│   │   ├── Map.tsx                  # Main map component
│   │   ├── MapContainer.tsx         # Wrapper with error boundary
│   │   ├── MapLoadingState.tsx      # Loading skeleton
│   │   ├── MapErrorState.tsx        # Error display
│   │   ├── types.ts                 # TypeScript types
│   │   └── index.ts                 # Barrel exports
│   └── index.ts                     # Updated with map exports
├── lib/
│   └── map/
│       ├── mapUtils.ts              # Utility functions
│       ├── constants.ts             # Map constants
│       ├── webglDetection.ts        # WebGL detection
│       └── errorMessages.ts         # Error messages
├── hooks/
│   └── useMap.ts                    # Map state hook (future)
└── package.json                     # Updated with mapbox-gl
```

### B. Environment Variables

Required environment variables (already configured):

```bash
# Mapbox Configuration
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=pk.eyJ1IjoicmVzdXRhYSIsImEiOiJjbWkxYTlhbWEweTdwMmxxemc4amY5d2djIn0.qRBJpM-h-QITLTDgt_jSrQ
NEXT_PUBLIC_MAPBOX_STYLE=mapbox://styles/mapbox/streets-v12

# Cebu City Boundaries
NEXT_PUBLIC_CEBU_BOUNDS_MIN_LAT=10.25
NEXT_PUBLIC_CEBU_BOUNDS_MIN_LNG=123.80
NEXT_PUBLIC_CEBU_BOUNDS_MAX_LAT=10.40
NEXT_PUBLIC_CEBU_BOUNDS_MAX_LNG=123.95
```

### C. Dependencies

Required npm packages:

```json
{
  "dependencies": {
    "mapbox-gl": "^3.0.0"
  },
  "devDependencies": {
    "@types/mapbox-gl": "^4.0.0"
  }
}
```

### D. Browser Support Matrix

| Browser | Version | WebGL Support | Status |
|---------|---------|---------------|--------|
| Chrome | 90+ | ✅ Yes | ✅ Fully Supported |
| Firefox | 88+ | ✅ Yes | ✅ Fully Supported |
| Safari | 14+ | ✅ Yes | ✅ Fully Supported |
| Edge | 90+ | ✅ Yes | ✅ Fully Supported |
| iOS Safari | 14+ | ✅ Yes | ✅ Fully Supported |
| Chrome Mobile | 90+ | ✅ Yes | ✅ Fully Supported |
| Samsung Internet | 14+ | ✅ Yes | ✅ Fully Supported |
| IE 11 | - | ❌ No | ❌ Not Supported |

### E. Related Tasks

**Dependencies:**
- ✅ TASK-016: Create Mapbox account (Complete)
- ✅ TASK-031: Set up Next.js 16.0.3 project (Complete)

**Dependent Tasks:**
- TASK-052: Implement map marker system
- TASK-053: Implement map clustering
- TASK-054: Implement map popups
- TASK-055: Implement map filters

**Related Documentation:**
- [Mapbox GL JS v3 Documentation](https://docs.mapbox.com/mapbox-gl-js/api/)
- [Next.js Dynamic Imports](https://nextjs.org/docs/app/building-your-application/optimizing/lazy-loading)
- [WebGL Specification](https://www.khronos.org/webgl/)

---

## Summary

This solution design provides a complete, production-ready implementation plan for integrating Mapbox GL JS 3.x into the Krawl application. The design emphasizes:

1. **Robustness**: Comprehensive error handling for all edge cases
2. **Performance**: Optimized for mobile with code splitting and lazy loading
3. **Usability**: Clear loading and error states with user-friendly messages
4. **Maintainability**: Well-structured code with TypeScript types and documentation
5. **Scalability**: Designed to support future map features (markers, clustering, etc.)

**Estimated Implementation Time:** 1 day (8 hours)

**Confidence Level:** High - All dependencies satisfied, clear implementation path, comprehensive testing plan.

**Ready to Implement:** ✅ Yes

---

**Document Version:** 1.0
**Last Updated:** 2025-11-30
**Next Review:** After implementation
