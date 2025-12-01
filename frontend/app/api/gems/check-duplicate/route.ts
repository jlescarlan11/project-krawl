import { NextRequest, NextResponse } from "next/server";
import { getMockGemDetail } from "@/lib/data/mockGems";

/**
 * Mock API endpoint for duplicate gem detection
 *
 * POST /api/gems/check-duplicate
 *
 * This is a temporary mock implementation for frontend development.
 * Backend will implement with PostGIS ST_DWithin + Levenshtein distance.
 *
 * Request body:
 * {
 *   name: string,
 *   coordinates: { latitude: number, longitude: number }
 * }
 *
 * Response:
 * {
 *   isDuplicate: boolean,
 *   existingGem?: {...}
 * }
 */

interface DuplicateCheckRequest {
  name: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

/**
 * Calculate Levenshtein distance between two strings (simple implementation)
 */
function levenshteinDistance(str1: string, str2: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1, // insertion
          matrix[i - 1][j] + 1 // deletion
        );
      }
    }
  }

  return matrix[str2.length][str1.length];
}

/**
 * Calculate string similarity (0-1)
 */
function calculateSimilarity(str1: string, str2: string): number {
  const distance = levenshteinDistance(str1.toLowerCase(), str2.toLowerCase());
  const maxLength = Math.max(str1.length, str2.length);
  return 1 - distance / maxLength;
}

/**
 * Calculate distance between two coordinates (Haversine formula)
 * Returns distance in meters
 */
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}

/**
 * Mock gems database (hardcoded for testing)
 */
const MOCK_GEMS = [
  {
    id: "gem-001",
    name: "Magellan's Cross",
    category: "Historical Landmark",
    shortDescription: "Historic cross planted by Ferdinand Magellan in 1521",
    thumbnailUrl: "/images/gems/magellans-cross.jpg",
    coordinates: [123.8897, 10.2933] as [number, number], // [lng, lat]
    address: "Magallanes Street, Cebu City, 6000 Cebu",
  },
  {
    id: "gem-002",
    name: "Fort San Pedro",
    category: "Historical Landmark",
    shortDescription: "Spanish colonial fort and military defense structure",
    thumbnailUrl: "/images/gems/fort-san-pedro.jpg",
    coordinates: [123.8868, 10.2925] as [number, number],
    address: "A. Pigafetta Street, Cebu City, 6000 Cebu",
  },
];

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body: DuplicateCheckRequest = await request.json();

    // Validate request
    if (!body.name || !body.coordinates) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const { name, coordinates } = body;

    // Simulate API delay (500ms)
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Check against mock gems
    for (const gem of MOCK_GEMS) {
      // Calculate distance
      const distance = calculateDistance(
        coordinates.latitude,
        coordinates.longitude,
        gem.coordinates[1], // lat
        gem.coordinates[0] // lng
      );

      // Check if within 50 meters
      if (distance <= 50) {
        // Calculate name similarity
        const similarity = calculateSimilarity(name, gem.name);

        // If similarity >= 80%, it's a duplicate
        if (similarity >= 0.8) {
          return NextResponse.json({
            isDuplicate: true,
            existingGem: {
              id: gem.id,
              name: gem.name,
              category: gem.category,
              shortDescription: gem.shortDescription,
              thumbnailUrl: gem.thumbnailUrl,
              distance: Math.round(distance),
              similarity: Math.round(similarity * 100) / 100, // Round to 2 decimals
              coordinates: gem.coordinates,
              address: gem.address,
            },
          });
        }
      }
    }

    // No duplicate found
    return NextResponse.json({
      isDuplicate: false,
    });
  } catch (error) {
    console.error("Duplicate check error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
