# Map Components

Interactive map functionality using Mapbox GL JS 3.x for displaying Filipino cultural locations in Cebu City.

## Overview

The map components provide a fully-featured interactive map with:
- WebGL support detection
- Comprehensive error handling
- Loading states
- Mobile and desktop responsive design
- Code splitting for performance
- Sentry integration for error monitoring

## Components

### Map

Main interactive map component built on Mapbox GL JS 3.x.

### MapWithBoundary

Wrapper around Map that adds:
- Cebu City boundary enforcement
- Gem Marker management
- Krawl Trail visualization
- Responsive popups and mobile bottom sheets

### GemMarkerLayer & useGemMarkers

Modular pin rendering system.

**Features:**
- **Dynamic Fetching:** Fetches gems based on current map bounds and zoom.
- **Clustering:** Automatically clusters nearby gems at low zoom levels.
- **Marker Icons:** Status-based SVG icons (Verified, Pending, Stale).
- **Interactivity:** Click to select, hover for cursor change.
- **Performance:** Optimized GeoJSON source updates and debounced fetching.

**Usage:**

```tsx
<MapWithBoundary
  showGemMarkers={true}
  gemCategories={['food-drink']}
  onGemMarkerClick={(gem) => console.log(gem)}
/>
```

### GemPopup & GemPopupMobile

Detail display for selected gems.

**Features:**
- **Desktop:** Floating sidebar popup.
- **Mobile:** Animated bottom sheet.
- **Content:** Thumbnail, rating, distance, and "View Details" navigation.

### MapLoadingState

Loading skeleton displayed while the map initializes.

**Usage:**

```tsx
import { MapLoadingState } from '@/components/map';

<MapLoadingState message="Loading map..." />
```

### MapErrorState

Error display component for map failures.

**Usage:**

```tsx
import { MapErrorState } from '@/components/map';
import { MapError, MapErrorCode } from '@/components/map/types';

const error: MapError = {
  code: MapErrorCode.NETWORK_ERROR,
  message: 'Unable to load map tiles',
  retryable: true,
};

<MapErrorState
  error={error}
  onRetry={() => retryMap()}
  retryCount={1}
/>
```

## Configuration

### Environment Variables

Required:
- `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN` - Mapbox public access token

Optional:
- `NEXT_PUBLIC_MAPBOX_STYLE` - Mapbox style URL (defaults to streets-v12)

### Default Configuration

- **Center:** Cebu City `[123.8854, 10.3157]`
- **Zoom:** 13
- **Min Zoom:** 10 (prevents zooming out too far)
- **Max Zoom:** 18
- **Style:** `mapbox://styles/mapbox/streets-v12`

## Error Handling

The Map component handles all edge cases:

1. **WebGL Not Supported**
   - Detects before initialization
   - Shows clear error message
   - No retry option

2. **Invalid Token**
   - Validates token format
   - Shows configuration error
   - No retry option

3. **Network Errors**
   - Detects network failures
   - Automatic retry (up to 3 attempts)
   - User-friendly error message

4. **Rate Limit Exceeded**
   - Detects 429 responses
   - Automatic retry after delay
   - Clear user message

5. **Container Size Zero**
   - Waits for container to be sized
   - Handles dynamic resizing
   - Shows error if timeout exceeded

6. **Map Initialization Failures**
   - Catches all initialization errors
   - Classifies error types
   - Provides retry option where appropriate

## Performance

### Code Splitting

The map component is loaded dynamically to reduce initial bundle size:

```tsx
import dynamic from 'next/dynamic';

const Map = dynamic(
  () => import('@/components/map').then(mod => mod.Map),
  { ssr: false }
);
```

### Optimization

- Lazy loading with dynamic imports
- ResizeObserver for efficient container resizing
- React.memo for preventing unnecessary re-renders
- Proper cleanup on unmount

## Accessibility

- ARIA labels on loading and error states
- Keyboard navigation via Mapbox controls
- Screen reader support
- Focus management

## Mobile Support

- Touch events supported
- Pinch-to-zoom enabled
- Responsive container sizing
- Mobile-optimized controls

## Related Files

- **Types:** `components/map/types.ts`
- **Utilities:** `lib/map/mapUtils.ts`
- **Constants:** `lib/map/constants.ts`
- **WebGL Detection:** `lib/map/webglDetection.ts`
- **Error Messages:** `lib/map/errorMessages.ts`

## Future Enhancements

- Offline map support (TASK-088)
- Real-time location sharing
- 3D terrain and building visualization

---

**Last Updated:** 2025-11-30
**Task:** TASK-051

