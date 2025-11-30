# Cebu City Boundary Enforcement

This document describes the implementation of Cebu City boundary enforcement in the map system.

## Overview

The boundary enforcement system restricts map viewing and content creation to within Cebu City limits. It provides:

- **Visual boundary indication** - Polygon overlay showing Cebu City boundaries
- **Map panning constraints** - Prevents users from panning outside the boundary
- **Coordinate validation** - Validates locations against the boundary polygon
- **Content creation enforcement** - Ensures content is created only within Cebu City

## Architecture

### Components

#### 1. Boundary Data (`/public/data/cebu-city-boundary.geojson`)

GeoJSON file containing the Cebu City boundary polygon:

```json
{
  "type": "FeatureCollection",
  "features": [{
    "type": "Feature",
    "properties": {
      "name": "Cebu City"
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [[...]]
    }
  }]
}
```

#### 2. Boundary Validation (`lib/map/boundaryValidation.ts`)

Core utilities for coordinate validation using Turf.js:

- `validateCoordinates(coordinates)` - Async validation with detailed results
- `isPointInBoundary(coordinates)` - Synchronous validation (requires preload)
- `loadBoundaryData()` - Loads and caches boundary GeoJSON
- `getBoundaryCoordinates()` - Returns polygon coordinates
- `clearBoundaryCache()` - Clears cached data

**Example:**

```typescript
import { validateCoordinates } from '@/lib/map/boundaryValidation';

const result = await validateCoordinates([123.8854, 10.3157]);
if (result.isValid) {
  console.log('Location is within Cebu City');
} else {
  console.error(result.message);
}
```

#### 3. Boundary Layer Hook (`components/map/useBoundaryLayer.ts`)

React hook for adding boundary visualization to maps:

```typescript
import { useBoundaryLayer } from '@/components/map';

function MyMap() {
  const [map, setMap] = useState(null);
  const { isLoaded, error } = useBoundaryLayer(map, {
    lineColor: '#3b82f6',
    fillOpacity: 0.1
  });

  return <Map onLoad={setMap} />;
}
```

**Options:**
- `lineColor` - Boundary line color (default: `#3b82f6`)
- `lineWidth` - Line width in pixels (default: `3`)
- `lineOpacity` - Line opacity 0-1 (default: `1`)
- `fillColor` - Fill color (default: `#3b82f6`)
- `fillOpacity` - Fill opacity 0-1 (default: `0.1`)
- `showBoundary` - Whether to show boundary (default: `true`)

#### 4. MapWithBoundary Component (`components/map/MapWithBoundary.tsx`)

Map component with built-in boundary visualization:

```typescript
import { MapWithBoundary } from '@/components/map';

<MapWithBoundary
  showBoundary={true}
  boundaryLineColor="#ef4444"
  boundaryFillOpacity={0.15}
  onLoad={(map, boundaryLoaded) => {
    console.log('Map and boundary loaded');
  }}
/>
```

#### 5. LocationPicker Component (`components/map/LocationPicker.tsx`)

Interactive location picker with boundary validation:

```typescript
import { LocationPicker } from '@/components/map';

<LocationPicker
  initialLocation={[123.8854, 10.3157]}
  onLocationSelect={(coords) => {
    console.log('Valid location selected:', coords);
  }}
  onInvalidLocation={(coords, message) => {
    alert(message);
  }}
  showMarker={true}
  markerColor="#ef4444"
/>
```

**Features:**
- Click to select location
- Draggable marker
- Real-time validation
- Visual feedback (green/red)
- Boundary enforcement

## Usage Examples

### 1. Basic Map with Boundary Constraints

```typescript
import { Map } from '@/components/map';
import { CEBU_CITY_MAX_BOUNDS } from '@/lib/map/constants';

<Map
  maxBounds={CEBU_CITY_MAX_BOUNDS}
  className="h-screen w-full"
/>
```

### 2. Map with Boundary Visualization

```typescript
import { MapWithBoundary } from '@/components/map';
import { CEBU_CITY_MAX_BOUNDS } from '@/lib/map/constants';

<MapWithBoundary
  maxBounds={CEBU_CITY_MAX_BOUNDS}
  showBoundary={true}
  boundaryLineColor="#3b82f6"
  boundaryFillOpacity={0.1}
/>
```

### 3. Location Selection in Forms

```typescript
import { LocationPicker } from '@/components/map';
import { useState } from 'react';

function CreateGemForm() {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState('');

  return (
    <form>
      <LocationPicker
        onLocationSelect={(coords) => {
          setLocation(coords);
          setError('');
        }}
        onInvalidLocation={(coords, message) => {
          setError(message);
        }}
      />
      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
}
```

### 4. Programmatic Validation

```typescript
import { validateCoordinates, loadBoundaryData } from '@/lib/map';

async function validateUserLocation(lng: number, lat: number) {
  // Preload boundary data for faster validation
  await loadBoundaryData();

  const result = await validateCoordinates([lng, lat]);

  if (!result.isValid) {
    throw new Error(result.message);
  }

  return result;
}
```

### 5. Custom Boundary Styling

```typescript
import { MapWithBoundary } from '@/components/map';

<MapWithBoundary
  boundaryLineColor="#ef4444"     // Red border
  boundaryLineWidth={4}           // Thick line
  boundaryLineOpacity={1}         // Fully opaque
  boundaryFillColor="#fecaca"     // Light red fill
  boundaryFillOpacity={0.2}       // Semi-transparent
/>
```

## Configuration

### Constants (`lib/map/constants.ts`)

```typescript
// Center of Cebu City
export const CEBU_CITY_CENTER: [number, number] = [123.8854, 10.3157];

// Rough bounds for initial view
export const CEBU_CITY_BOUNDS: [[number, number], [number, number]] = [
  [123.80, 10.25], // Southwest
  [123.95, 10.40], // Northeast
];

// Precise boundary constraints for enforcement
export const CEBU_CITY_MAX_BOUNDS: [[number, number], [number, number]] = [
  [123.8150, 10.2450], // Southwest corner
  [123.9600, 10.4000], // Northeast corner
];

// Boundary GeoJSON file path
export const BOUNDARY_GEOJSON_PATH = '/data/cebu-city-boundary.geojson';
```

## Content Creation Integration

### Form Validation Example

```typescript
import { validateCoordinates } from '@/lib/map';

async function handleCreateGem(formData: FormData) {
  const lng = parseFloat(formData.get('longitude'));
  const lat = parseFloat(formData.get('latitude'));

  // Validate coordinates
  const validation = await validateCoordinates([lng, lat]);

  if (!validation.isValid) {
    return {
      error: validation.message || 'Location outside Cebu City'
    };
  }

  // Proceed with creation
  await createGem({ longitude: lng, latitude: lat, ...otherData });
}
```

### Server-Side Validation

```typescript
// In your API route or server action
import { validateCoordinates } from '@/lib/map/boundaryValidation';

export async function POST(request: Request) {
  const { longitude, latitude } = await request.json();

  // Validate on server side as well
  const validation = await validateCoordinates([longitude, latitude]);

  if (!validation.isValid) {
    return Response.json(
      { error: 'Location must be within Cebu City boundaries' },
      { status: 400 }
    );
  }

  // Continue with creation
}
```

## Testing

### Unit Tests

```typescript
import { validateCoordinates, loadBoundaryData } from '@/lib/map';

describe('Boundary Validation', () => {
  beforeAll(async () => {
    await loadBoundaryData();
  });

  test('validates location inside Cebu City', async () => {
    const result = await validateCoordinates([123.8854, 10.3157]);
    expect(result.isValid).toBe(true);
  });

  test('rejects location outside Cebu City', async () => {
    const result = await validateCoordinates([124.0, 11.0]);
    expect(result.isValid).toBe(false);
  });

  test('handles invalid coordinates', async () => {
    const result = await validateCoordinates([200, 100]);
    expect(result.isValid).toBe(false);
  });
});
```

### Integration Tests

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { LocationPicker } from '@/components/map';

test('shows error for location outside boundary', async () => {
  const onInvalid = jest.fn();

  render(
    <LocationPicker onInvalidLocation={onInvalid} />
  );

  // Simulate click outside boundary
  // ... test implementation

  expect(onInvalid).toHaveBeenCalled();
});
```

## Performance Considerations

### Caching

Boundary data is automatically cached after first load:

```typescript
import { loadBoundaryData, clearBoundaryCache } from '@/lib/map';

// Preload at app initialization
await loadBoundaryData();

// Clear cache if boundary data is updated
clearBoundaryCache();
await loadBoundaryData(); // Reload fresh data
```

### Optimization Tips

1. **Preload boundary data** on app startup
2. **Use synchronous validation** (`isPointInBoundary`) after preloading
3. **Debounce validation** for drag operations
4. **Simplify polygon** if performance issues arise

## Error Handling

### Graceful Degradation

```typescript
import { useBoundaryLayer } from '@/components/map';

function MyMap() {
  const { error } = useBoundaryLayer(map);

  useEffect(() => {
    if (error) {
      console.error('Boundary layer failed to load:', error);
      // Map still works, just without boundary visualization
      Sentry.captureException(error);
    }
  }, [error]);
}
```

### Edge Cases

- **Missing boundary file** - Validation fails gracefully, logs error
- **Invalid GeoJSON** - Error caught and reported
- **Network timeout** - Cached data used if available
- **Coordinates on boundary** - Treated as inside
- **Malformed coordinates** - Validation returns false

## Updating Boundary Data

To update the Cebu City boundary polygon:

1. Edit `/public/data/cebu-city-boundary.geojson`
2. Ensure valid GeoJSON format
3. Update `CEBU_CITY_MAX_BOUNDS` in `constants.ts` if needed
4. Clear cache in production:

```typescript
import { clearBoundaryCache } from '@/lib/map';
clearBoundaryCache();
```

## Dependencies

- `@turf/boolean-point-in-polygon` - Point-in-polygon algorithm
- `@turf/helpers` - GeoJSON helper utilities
- `mapbox-gl` - Map rendering and controls

## API Reference

See inline documentation in:
- `lib/map/boundaryValidation.ts`
- `components/map/useBoundaryLayer.ts`
- `components/map/MapWithBoundary.tsx`
- `components/map/LocationPicker.tsx`

## Support

For issues or questions:
1. Check this documentation
2. Review inline code comments
3. Check TypeScript types for available props
4. See example implementations in `/app/map/page.tsx`
