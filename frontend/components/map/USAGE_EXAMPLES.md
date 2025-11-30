# Map Components Usage Examples

This document provides comprehensive examples for using the map components, controls, and popups.

## Table of Contents

- [Basic Map Setup](#basic-map-setup)
- [Map with Custom Controls](#map-with-custom-controls)
- [Map Search Control](#map-search-control)
- [My Location Button](#my-location-button)
- [Gem Popups](#gem-popups)
- [Complete Example with Markers and Popups](#complete-example-with-markers-and-popups)

---

## Basic Map Setup

Simple map with default navigation controls:

```tsx
import { Map } from '@/components/map';

export default function BasicMapExample() {
  return (
    <div className="h-screen">
      <Map
        initialCenter={[123.8854, 10.3157]} // Cebu City
        initialZoom={13}
        showNavigationControl
        showGeolocateControl
      />
    </div>
  );
}
```

---

## Map with Custom Controls

Enable custom search and my location controls:

```tsx
import { Map } from '@/components/map';

export default function MapWithControls() {
  return (
    <div className="h-screen">
      <Map
        initialCenter={[123.8854, 10.3157]}
        initialZoom={13}
        // Enable custom controls
        showCustomControls
        showSearchControl
        showMyLocationControl
        customControlsPosition="top-right"
        searchPlaceholder="Search Cebu City..."
        myLocationZoom={15}
      />
    </div>
  );
}
```

---

## Map Search Control

Use the search control standalone:

```tsx
import { useState } from 'react';
import { Map, MapSearchControl } from '@/components/map';
import mapboxgl from 'mapbox-gl';

export default function SearchExample() {
  const [map, setMap] = useState<mapboxgl.Map | null>(null);

  return (
    <div className="relative h-screen">
      <Map
        initialCenter={[123.8854, 10.3157]}
        initialZoom={13}
        onLoad={setMap}
      />

      {/* Custom positioned search control */}
      <div className="absolute top-4 left-4 z-10">
        <MapSearchControl
          map={map}
          placeholder="Search for a location..."
          onResultSelect={(result) => {
            console.log('Selected:', result.place_name);
          }}
        />
      </div>
    </div>
  );
}
```

---

## My Location Button

Use the my location button standalone:

```tsx
import { useState } from 'react';
import { Map, MyLocationButton } from '@/components/map';
import mapboxgl from 'mapbox-gl';

export default function MyLocationExample() {
  const [map, setMap] = useState<mapboxgl.Map | null>(null);

  return (
    <div className="relative h-screen">
      <Map
        initialCenter={[123.8854, 10.3157]}
        initialZoom={13}
        onLoad={setMap}
      />

      {/* Custom positioned my location button */}
      <div className="absolute top-4 right-4 z-10">
        <MyLocationButton
          map={map}
          zoom={15}
          onLocationFound={(position) => {
            console.log('Location:', position.coords);
          }}
          onLocationError={(error) => {
            console.error('Location error:', error.message);
          }}
        />
      </div>
    </div>
  );
}
```

---

## Gem Popups

### Desktop Popup

Display gem info in a popup:

```tsx
import { useState } from 'react';
import { GemPopup, MapGem } from '@/components/map';

export default function PopupExample() {
  const [selectedGem, setSelectedGem] = useState<MapGem | null>(null);

  const gem: MapGem = {
    id: '1',
    name: 'Sirao Flower Garden',
    category: 'attraction',
    district: 'Cebu City',
    coordinates: [123.8854, 10.3157],
    status: 'verified',
    thumbnailUrl: '/images/sirao.jpg',
    rating: 4.5,
    vouchCount: 120,
    viewCount: 5000,
    shortDescription: 'Beautiful flower garden with stunning views',
  };

  return (
    <div className="p-4">
      <button onClick={() => setSelectedGem(gem)}>
        Show Popup
      </button>

      {selectedGem && (
        <div className="mt-4">
          <GemPopup
            gem={selectedGem}
            onClose={() => setSelectedGem(null)}
          />
        </div>
      )}
    </div>
  );
}
```

### Mobile Bottom Sheet

For mobile devices, use the bottom sheet variant:

```tsx
import { useState } from 'react';
import { GemPopupMobile, MapGem } from '@/components/map';

export default function MobilePopupExample() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedGem, setSelectedGem] = useState<MapGem | null>(null);

  const handleMarkerClick = (gem: MapGem) => {
    setSelectedGem(gem);
    setIsOpen(true);
  };

  return (
    <div>
      {/* Your map or marker triggers */}

      {selectedGem && (
        <GemPopupMobile
          gem={selectedGem}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
```

---

## Complete Example with Markers and Popups

Full implementation with markers, search, my location, and popups:

```tsx
'use client';

import { useState, useCallback } from 'react';
import {
  Map,
  MapControls,
  GemMarkerLayer,
  GemPopup,
  GemPopupMobile,
  MapGem,
  useGemMarkers,
} from '@/components/map';
import mapboxgl from 'mapbox-gl';

export default function InteractiveMapPage() {
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const [selectedGem, setSelectedGem] = useState<MapGem | null>(null);
  const [showMobilePopup, setShowMobilePopup] = useState(false);

  // Fetch gems based on map bounds
  const { gems, isLoading } = useGemMarkers({
    map,
    fetchOnMove: true,
  });

  // Handle marker click
  const handleMarkerClick = useCallback((gem: MapGem) => {
    setSelectedGem(gem);

    // Show mobile popup on small screens
    if (window.innerWidth < 1024) {
      setShowMobilePopup(true);
    }

    // Fly to marker location
    if (map) {
      map.flyTo({
        center: gem.coordinates,
        zoom: 15,
        duration: 1000,
      });
    }
  }, [map]);

  // Handle popup close
  const handleClosePopup = useCallback(() => {
    setSelectedGem(null);
    setShowMobilePopup(false);
  }, []);

  return (
    <div className="relative h-screen w-full">
      {/* Map with custom controls */}
      <Map
        initialCenter={[123.8854, 10.3157]}
        initialZoom={13}
        onLoad={setMap}
        showNavigationControl
        minZoom={10}
        maxZoom={18}
      >
        {/* Gem Markers */}
        {map && (
          <GemMarkerLayer
            map={map}
            gems={gems}
            onMarkerClick={handleMarkerClick}
          />
        )}

        {/* Desktop Popup */}
        {selectedGem && !showMobilePopup && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 hidden lg:block">
            <GemPopup
              gem={selectedGem}
              onClose={handleClosePopup}
            />
          </div>
        )}
      </Map>

      {/* Custom Controls */}
      <MapControls
        map={map}
        showSearch
        showMyLocation
        position="top-right"
        searchPlaceholder="Search Cebu City..."
        myLocationZoom={15}
        onSearchResultSelect={(result) => {
          console.log('Search result:', result.place_name);
        }}
      />

      {/* Mobile Bottom Sheet */}
      {selectedGem && (
        <GemPopupMobile
          gem={selectedGem}
          isOpen={showMobilePopup}
          onClose={handleClosePopup}
        />
      )}

      {/* Loading Indicator */}
      {isLoading && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
          <div className="bg-white px-4 py-2 rounded-lg shadow-lg">
            Loading gems...
          </div>
        </div>
      )}
    </div>
  );
}
```

---

## Using Map as Children Container

You can render custom overlays as children of the Map component:

```tsx
import { Map } from '@/components/map';

export default function MapWithOverlay() {
  return (
    <Map initialCenter={[123.8854, 10.3157]} initialZoom={13}>
      {/* Custom overlay - rendered after map loads */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
        <div className="bg-white px-4 py-2 rounded-lg shadow-lg">
          Custom Overlay Content
        </div>
      </div>
    </Map>
  );
}
```

---

## API Reference

### Map Props

All new props added for controls and overlays:

```typescript
interface MapProps {
  // Custom Controls
  showCustomControls?: boolean;        // Enable custom controls
  showSearchControl?: boolean;         // Show search control
  showMyLocationControl?: boolean;     // Show my location button
  customControlsPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  searchPlaceholder?: string;          // Search input placeholder
  myLocationZoom?: number;             // Zoom level for my location
  children?: React.ReactNode;          // Custom overlays
}
```

### MapControls Props

```typescript
interface MapControlsProps {
  map: mapboxgl.Map | null;
  showSearch?: boolean;
  showMyLocation?: boolean;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  className?: string;
  searchPlaceholder?: string;
  myLocationZoom?: number;
  onSearchResultSelect?: (result: any) => void;
  onLocationFound?: (position: GeolocationPosition) => void;
  onLocationError?: (error: GeolocationPositionError) => void;
}
```

### GemPopup Props

```typescript
interface GemPopupProps {
  gem: MapGem;
  onClose?: () => void;
  className?: string;
}

interface GemPopupMobileProps extends GemPopupProps {
  isOpen: boolean;
}
```

---

## Best Practices

1. **Use `showCustomControls` for quick setup**: Enable all controls with one prop
2. **Responsive design**: Use `GemPopupMobile` for mobile devices
3. **Handle permissions**: Always handle location permission errors gracefully
4. **Debouncing**: Search control automatically debounces input (300ms)
5. **Accessibility**: All controls support keyboard navigation
6. **Performance**: Controls only render after map loads (`isLoaded`)

---

## Troubleshooting

### Search not working?
- Ensure `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN` is set in your environment
- Check console for API errors
- Verify internet connection

### My Location button not working?
- Ensure HTTPS (geolocation requires secure context)
- Check browser location permissions
- Handle permission denied errors

### Popup not showing?
- Ensure gem data includes all required fields
- Check z-index conflicts with other elements
- Verify popup is rendered after map loads
