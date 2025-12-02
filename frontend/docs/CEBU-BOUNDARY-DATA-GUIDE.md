# Cebu City Barangay Boundary Data Guide

## Current Implementation

The current boundary data (`public/data/cebu-city-boundary.geojson`) uses a simplified rectangular polygon for testing. For production, you should replace this with accurate barangay-level boundary data.

---

## Option 1: OpenStreetMap (Recommended - Free & Official)

### Using Overpass Turbo

1. **Go to Overpass Turbo**: https://overpass-turbo.eu/

2. **Run this query** to get Cebu City boundaries:
```
[out:json];
// Get Cebu City administrative boundary
relation["name"="Cebu City"]["boundary"="administrative"];
out geom;
```

3. **Export as GeoJSON**:
   - Click "Export" → "GeoJSON"
   - Download the file

4. **For individual barangays**:
```
[out:json];
// Get all barangays in Cebu City
area["name"="Cebu City"]["boundary"="administrative"]->.city;
(
  relation(area.city)["boundary"="administrative"]["admin_level"="10"];
);
out geom;
```

### Using Nominatim API

You can also fetch directly via API:

```bash
# Get Cebu City boundary
curl "https://nominatim.openstreetmap.org/search?q=Cebu+City+Philippines&format=geojson&polygon_geojson=1" > cebu-city-boundary.geojson
```

---

## Option 2: Philippine Statistics Authority (PSA)

The PSA maintains official shapefiles:

1. **Visit**: https://psa.gov.ph/gis
2. **Download**: Administrative boundary shapefiles
3. **Convert to GeoJSON** using:
   - QGIS (free desktop app)
   - ogr2ogr command line tool
   - Online converter: https://mapshaper.org/

---

## Option 3: GADM (Global Administrative Areas)

GADM provides high-quality administrative boundaries:

1. **Visit**: https://gadm.org/download_country.html
2. **Select**: Philippines
3. **Download**: Level 4 (Barangay level) as GeoJSON
4. **Filter** for Cebu City barangays

---

## Option 4: PhilGIS (Philippine GIS Data Clearinghouse)

Official government GIS portal:

1. **Visit**: https://philgis.org/
2. **Search**: "Cebu City Barangay Boundaries"
3. **Download**: Available formats (Shapefile/GeoJSON)

---

## Processing the Data

### Step 1: Extract Cebu City Only

If you download a larger dataset, filter for Cebu City:

```bash
# Using jq (command line JSON processor)
jq '.features |= map(select(.properties.NAME_2 == "Cebu City"))' philippines.geojson > cebu-city-boundary.geojson
```

### Step 2: Simplify the Geometry (Optional)

Large boundary files can slow down validation. Simplify while maintaining accuracy:

**Using Mapshaper** (https://mapshaper.org/):
1. Upload your GeoJSON
2. Open console (click "Console" button)
3. Run: `simplify 5% keep-shapes`
4. Export as GeoJSON

**Using QGIS**:
1. Open your GeoJSON file
2. Go to "Vector" → "Geometry Tools" → "Simplify"
3. Set tolerance (e.g., 0.001)
4. Export as GeoJSON

### Step 3: Validate the Structure

Ensure your GeoJSON matches the expected format:

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "name": "Cebu City",
        "admin_level": "4",
        "barangays": 80
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [lng, lat],
            [lng, lat],
            ...
          ]
        ]
      }
    }
  ]
}
```

### Step 4: Test the Boundary

Run the validation tests to ensure it works:

```bash
npm test -- __tests__/lib/map/boundaryValidation.test.ts
```

---

## Updating the Boundary File

Once you have accurate data:

1. **Replace** `public/data/cebu-city-boundary.geojson` with your new file

2. **Clear cache** (the app caches boundary data):
   - Restart your dev server
   - Clear browser cache
   - Or force reload with Ctrl+Shift+R

3. **Verify** on the map:
   - The green boundary polygon should match Cebu City's actual shape
   - Test locations you know are inside/outside Cebu City

---

## Recommended Source: OpenStreetMap

**Why OSM is best:**
- ✅ Free and open source
- ✅ Community-maintained (up-to-date)
- ✅ High accuracy (crowd-sourced verification)
- ✅ Easy to update programmatically
- ✅ No licensing restrictions

**Quick implementation:**

```typescript
// In a script or API endpoint
async function updateCebuBoundary() {
  const response = await fetch(
    'https://nominatim.openstreetmap.org/search?' +
    'q=Cebu+City+Philippines&' +
    'format=geojson&' +
    'polygon_geojson=1&' +
    'limit=1'
  );

  const data = await response.json();

  // Save to public/data/cebu-city-boundary.geojson
  await fs.writeFile(
    './public/data/cebu-city-boundary.geojson',
    JSON.stringify(data, null, 2)
  );
}
```

---

## Including All 80 Barangays

Cebu City has 80 barangays. To include all of them:

### Method A: Union of Barangay Boundaries

If you have individual barangay boundaries, merge them:

**Using Turf.js:**
```typescript
import * as turf from '@turf/turf';

// Assuming you have an array of barangay polygons
const barangays = [/* 80 GeoJSON features */];

// Union all polygons into one
let cebuBoundary = barangays[0];
for (let i = 1; i < barangays.length; i++) {
  cebuBoundary = turf.union(cebuBoundary, barangays[i]);
}

// Save as cebu-city-boundary.geojson
```

### Method B: Use City-Level Boundary

The city-level administrative boundary already encompasses all 80 barangays. This is the simplest approach and is what the current implementation expects.

---

## Verification Checklist

After updating the boundary data:

- [ ] File located at `public/data/cebu-city-boundary.geojson`
- [ ] Valid GeoJSON structure
- [ ] Type: "FeatureCollection" with features array
- [ ] First feature has Polygon geometry
- [ ] Coordinates in [longitude, latitude] format
- [ ] All 80 barangays included in the boundary
- [ ] Boundary visible on map (green polygon)
- [ ] Validation tests pass
- [ ] Known locations validate correctly

---

## Example API Integration (Optional)

For dynamic boundary updates:

```typescript
// lib/map/boundaryService.ts
export async function fetchOfficialBoundary() {
  try {
    // Fetch from OSM Nominatim
    const response = await fetch(
      'https://nominatim.openstreetmap.org/search?q=Cebu+City+Philippines&format=geojson&polygon_geojson=1',
      {
        headers: {
          'User-Agent': 'KrawlApp/1.0 (contact@example.com)'
        }
      }
    );

    if (!response.ok) throw new Error('Failed to fetch boundary');

    const data = await response.json();

    // Transform to expected format
    return {
      type: 'FeatureCollection',
      features: [data.features[0]]
    };
  } catch (error) {
    console.error('Error fetching boundary:', error);
    // Fallback to cached/static boundary
    return fetch('/data/cebu-city-boundary.geojson').then(r => r.json());
  }
}
```

---

## Performance Considerations

- **File size**: Keep GeoJSON under 500KB for fast loading
- **Simplification**: Use tolerance of 0.0001-0.001 degrees
- **Caching**: The app caches boundary data in memory
- **Compression**: Enable gzip compression on your server

---

## Contact for Data

If you need help obtaining or processing the data:
- OpenStreetMap Philippines: https://www.openstreetmap.org/user/OSM%20Philippines
- PSA Contact: https://psa.gov.ph/contact-us
- PhilGIS Support: info@philgis.org

---

## Summary

**For quick implementation:**
1. Use OpenStreetMap Overpass Turbo
2. Export Cebu City boundary as GeoJSON
3. Replace `public/data/cebu-city-boundary.geojson`
4. Test and verify

**For production:**
- Validate with PSA official data
- Include metadata (barangay names, codes)
- Set up periodic updates
- Monitor validation accuracy

The current implementation is ready to accept any valid GeoJSON boundary data. Simply replace the file and it will work immediately!
