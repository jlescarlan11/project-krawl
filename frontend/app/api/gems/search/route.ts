/**
 * Gems Search API Route Handler
 *
 * Handles GET requests for searching gems by name, category, or district.
 * This is a temporary mock implementation until the backend API is ready.
 *
 * TODO: Replace with actual backend API call when available
 */

import { NextRequest, NextResponse } from "next/server";
import { MapGem, GemStatus } from "@/components/map/gem-types";

/**
 * Generate mock gems data for Cebu City area
 * This should match the data in the main gems route
 */
function generateMockGems(): MapGem[] {
  const mockGems: MapGem[] = [
    {
      id: "gem-001",
      name: "Magellan's Cross",
      category: "Historical Landmark",
      district: "Downtown",
      coordinates: [123.8897, 10.2933],
      status: GemStatus.VERIFIED,
      thumbnailUrl: "/images/gems/magellans-cross.jpg",
      rating: 4.5,
      vouchCount: 15,
      viewCount: 234,
      shortDescription: "Historic cross planted by Ferdinand Magellan in 1521",
    },
    {
      id: "gem-002",
      name: "Fort San Pedro",
      category: "Historical Landmark",
      district: "Downtown",
      coordinates: [123.8868, 10.2925],
      status: GemStatus.VERIFIED,
      thumbnailUrl: "/images/gems/fort-san-pedro.jpg",
      rating: 4.3,
      vouchCount: 12,
      viewCount: 189,
      shortDescription: "Spanish colonial fort and military defense structure",
    },
    {
      id: "gem-003",
      name: "Basilica del Santo Niño",
      category: "Religious Site",
      district: "Downtown",
      coordinates: [123.8897, 10.2942],
      status: GemStatus.VERIFIED,
      thumbnailUrl: "/images/gems/basilica.jpg",
      rating: 4.8,
      vouchCount: 25,
      viewCount: 456,
      shortDescription: "Oldest Roman Catholic church in the Philippines",
    },
    {
      id: "gem-004",
      name: "Tops Lookout",
      category: "Viewpoint",
      district: "Busay",
      coordinates: [123.8765, 10.3425],
      status: GemStatus.VERIFIED,
      thumbnailUrl: "/images/gems/tops.jpg",
      rating: 4.6,
      vouchCount: 18,
      viewCount: 312,
      shortDescription: "Scenic mountain viewpoint overlooking Cebu City",
    },
    {
      id: "gem-005",
      name: "Sirao Flower Garden",
      category: "Nature",
      district: "Busay",
      coordinates: [123.8689, 10.3512],
      status: GemStatus.VERIFIED,
      thumbnailUrl: "/images/gems/sirao.jpg",
      rating: 4.4,
      vouchCount: 14,
      viewCount: 287,
      shortDescription: "Colorful flower garden with celosia flowers",
    },
    {
      id: "gem-006",
      name: "Carbon Market",
      category: "Market",
      district: "Downtown",
      coordinates: [123.8956, 10.2978],
      status: GemStatus.STALE,
      thumbnailUrl: "/images/gems/carbon-market.jpg",
      rating: 3.9,
      vouchCount: 8,
      viewCount: 145,
      shortDescription: "Historic public market - information may be outdated",
    },
    {
      id: "gem-007",
      name: "Temple of Leah",
      category: "Monument",
      district: "Busay",
      coordinates: [123.8723, 10.3478],
      status: GemStatus.STALE,
      thumbnailUrl: "/images/gems/temple-leah.jpg",
      rating: 4.2,
      vouchCount: 7,
      viewCount: 198,
      shortDescription: "Roman-inspired temple monument - needs verification",
    },
    {
      id: "gem-008",
      name: "Hidden Café on Mango Ave",
      category: "Food & Drink",
      district: "Downtown",
      coordinates: [123.8923, 10.3087],
      status: GemStatus.PENDING,
      thumbnailUrl: "/images/gems/cafe.jpg",
      rating: 4.1,
      vouchCount: 2,
      viewCount: 67,
      shortDescription: "Cozy café with local coffee - awaiting verification",
    },
    {
      id: "gem-009",
      name: "Street Art Wall - Colon St",
      category: "Art",
      district: "Downtown",
      coordinates: [123.8912, 10.2998],
      status: GemStatus.PENDING,
      thumbnailUrl: "/images/gems/street-art.jpg",
      rating: 3.8,
      vouchCount: 1,
      viewCount: 45,
      shortDescription: "Vibrant street art mural - needs more vouches",
    },
    {
      id: "gem-010",
      name: "Local Bakery - Escario",
      category: "Food & Drink",
      district: "Lahug",
      coordinates: [123.8934, 10.3156],
      status: GemStatus.PENDING,
      thumbnailUrl: "/images/gems/bakery.jpg",
      rating: 4.0,
      vouchCount: 2,
      viewCount: 52,
      shortDescription: "Family-owned bakery with fresh pandesal",
    },
    {
      id: "gem-011",
      name: "Sunset Spot - IT Park",
      category: "Viewpoint",
      district: "Lahug",
      coordinates: [123.8876, 10.3189],
      status: GemStatus.PENDING,
      vouchCount: 1,
      viewCount: 34,
      shortDescription: "Great rooftop view - new submission",
    },
    {
      id: "gem-012",
      name: "Taoist Temple",
      category: "Religious Site",
      district: "Beverly Hills",
      coordinates: [123.8654, 10.3234],
      status: GemStatus.VERIFIED,
      thumbnailUrl: "/images/gems/taoist-temple.jpg",
      rating: 4.5,
      vouchCount: 16,
      viewCount: 298,
      shortDescription: "Colorful Taoist temple with city views",
    },
    {
      id: "gem-013",
      name: "JY Square Mall Food Court",
      category: "Food & Drink",
      district: "Lahug",
      coordinates: [123.8912, 10.3201],
      status: GemStatus.PENDING,
      vouchCount: 2,
      viewCount: 78,
      shortDescription: "Popular local food court - new gem",
    },
    {
      id: "gem-014",
      name: "Fuente Osmeña Circle",
      category: "Park",
      district: "Downtown",
      coordinates: [123.8945, 10.3123],
      status: GemStatus.VERIFIED,
      thumbnailUrl: "/images/gems/fuente.jpg",
      rating: 4.2,
      vouchCount: 11,
      viewCount: 234,
      shortDescription: "Historic circular park and landmark",
    },
    {
      id: "gem-015",
      name: "Ayala Center Cebu",
      category: "Shopping",
      district: "Business Park",
      coordinates: [123.9087, 10.3198],
      status: GemStatus.VERIFIED,
      thumbnailUrl: "/images/gems/ayala.jpg",
      rating: 4.4,
      vouchCount: 20,
      viewCount: 412,
      shortDescription: "Premier shopping mall and lifestyle center",
    },
  ];

  return mockGems;
}

/**
 * Search gems by query string
 * Searches in name, category, district, and description
 */
function searchGems(gems: MapGem[], query: string): MapGem[] {
  const lowerQuery = query.toLowerCase().trim();

  if (!lowerQuery) {
    return gems;
  }

  return gems.filter((gem) => {
    // Search in name
    if (gem.name.toLowerCase().includes(lowerQuery)) {
      return true;
    }

    // Search in category
    if (gem.category.toLowerCase().includes(lowerQuery)) {
      return true;
    }

    // Search in district
    if (gem.district.toLowerCase().includes(lowerQuery)) {
      return true;
    }

    // Search in description
    if (gem.shortDescription?.toLowerCase().includes(lowerQuery)) {
      return true;
    }

    return false;
  });
}

/**
 * GET /api/gems/search
 *
 * Query parameters:
 * - q: Search query string
 * - limit: Maximum number of results to return (default: 10)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const query = searchParams.get("q") || "";
    const limit = parseInt(searchParams.get("limit") || "10");

    // Get all mock gems
    let gems = generateMockGems();

    // Search gems
    gems = searchGems(gems, query);

    // Sort by relevance (verified first, then by rating, then by vouch count)
    gems.sort((a, b) => {
      // Verified gems first
      if (a.status === GemStatus.VERIFIED && b.status !== GemStatus.VERIFIED) {
        return -1;
      }
      if (a.status !== GemStatus.VERIFIED && b.status === GemStatus.VERIFIED) {
        return 1;
      }

      // Then by rating
      const ratingDiff = (b.rating || 0) - (a.rating || 0);
      if (ratingDiff !== 0) {
        return ratingDiff;
      }

      // Then by vouch count
      return (b.vouchCount || 0) - (a.vouchCount || 0);
    });

    // Apply limit
    gems = gems.slice(0, limit);

    // Simulate network delay (remove in production)
    await new Promise((resolve) => setTimeout(resolve, 50));

    return NextResponse.json(
      {
        gems,
        total: gems.length,
        query,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
        },
      }
    );
  } catch (error) {
    console.error("Error searching gems:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        gems: [],
        total: 0,
      },
      { status: 500 }
    );
  }
}
