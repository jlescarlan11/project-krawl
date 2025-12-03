/**
 * Gems API Route Handler
 *
 * Handles GET requests for fetching gems based on map bounds.
 * Handles POST requests for creating new gems.
 * This is a temporary mock implementation until the backend API is ready.
 *
 * TODO: Replace with actual backend API call when TASK-085 is complete
 */

import { NextRequest, NextResponse } from "next/server";
import { MapGem, GemStatus } from "@/components/map/gem-types";

/**
 * Request body for creating a new gem
 */
interface CreateGemRequestBody {
  name: string;
  category: string;
  shortDescription: string;
  fullDescription: string;
  coordinates: {
    longitude: number;
    latitude: number;
  };
  address: string;
  photos: string[]; // Cloudinary URLs
  photoPublicIds?: string[]; // Cloudinary public IDs (optional)
  thumbnailIndex: number;
  culturalSignificance?: string;
  tags?: string[];
  hours?: string;
  website?: string;
  phone?: string;
}

/**
 * Generate mock gems data for Cebu City area
 * Coordinates are within Cebu City bounds
 */
function generateMockGems(): MapGem[] {
  const mockGems: MapGem[] = [
    // Verified Gems (will show at all zoom levels)
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

    // Stale Gems (verified but need updates)
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

    // Pending Gems (only visible at zoom >= 12)
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
 * Filter gems by bounds
 */
function filterGemsByBounds(
  gems: MapGem[],
  bounds: { north: number; south: number; east: number; west: number }
): MapGem[] {
  return gems.filter((gem) => {
    const [lng, lat] = gem.coordinates;
    return (
      lat <= bounds.north &&
      lat >= bounds.south &&
      lng <= bounds.east &&
      lng >= bounds.west
    );
  });
}

/**
 * GET /api/gems
 *
 * Query parameters:
 * - north, south, east, west: Bounding box coordinates
 * - zoom: Current zoom level
 * - categories: Comma-separated category filter (optional)
 * - limit: Maximum number of gems to return (optional)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const north = parseFloat(searchParams.get("north") || "");
    const south = parseFloat(searchParams.get("south") || "");
    const east = parseFloat(searchParams.get("east") || "");
    const west = parseFloat(searchParams.get("west") || "");
    const zoom = parseFloat(searchParams.get("zoom") || "12");
    const categoriesParam = searchParams.get("categories");
    const limit = parseInt(searchParams.get("limit") || "100");

    // Validate bounds
    if (
      isNaN(north) ||
      isNaN(south) ||
      isNaN(east) ||
      isNaN(west)
    ) {
      return NextResponse.json(
        { error: "Invalid bounds parameters" },
        { status: 400 }
      );
    }

    // Get all mock gems
    let gems = generateMockGems();

    // Filter by bounds
    gems = filterGemsByBounds(gems, { north, south, east, west });

    // Filter by categories if provided
    if (categoriesParam) {
      const categories = categoriesParam.split(",").map((c) => c.trim());
      gems = gems.filter((gem) => categories.includes(gem.category));
    }

    // Apply limit
    gems = gems.slice(0, limit);

    // Simulate network delay (remove in production)
    await new Promise((resolve) => setTimeout(resolve, 100));

    return NextResponse.json(
      {
        gems,
        total: gems.length,
        zoom,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching gems:", error);
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

/**
 * POST /api/gems
 *
 * Create a new gem with uploaded photos
 *
 * Request body:
 * - name: Gem name
 * - category: Gem category
 * - shortDescription: Short description
 * - fullDescription: Full description
 * - coordinates: { longitude, latitude }
 * - address: Address string
 * - photos: Array of Cloudinary URLs
 * - thumbnailIndex: Index of thumbnail photo
 * - culturalSignificance: Optional cultural significance
 * - tags: Optional array of tags
 * - hours: Optional hours
 * - website: Optional website
 * - phone: Optional phone
 *
 * TODO: Replace with actual backend API call
 */
export async function POST(request: NextRequest) {
  try {
    const body: CreateGemRequestBody = await request.json();

    console.log('[POST /api/gems] Received body:', {
      hasName: !!body.name,
      hasCategory: !!body.category,
      hasShortDescription: !!body.shortDescription,
      hasFullDescription: !!body.fullDescription,
      hasCoordinates: !!body.coordinates,
      hasAddress: !!body.address,
      hasPhotos: !!body.photos,
      photoCount: body.photos?.length || 0,
      hasThumbnailIndex: body.thumbnailIndex !== undefined,
    });

    // Validate required fields
    const missingFields: string[] = [];
    if (!body.name) missingFields.push('name');
    if (!body.category) missingFields.push('category');
    if (!body.shortDescription) missingFields.push('shortDescription');
    if (!body.fullDescription) missingFields.push('fullDescription');
    if (!body.coordinates) missingFields.push('coordinates');
    if (!body.address) missingFields.push('address');
    if (!body.photos || body.photos.length === 0) missingFields.push('photos');
    if (body.thumbnailIndex === undefined) missingFields.push('thumbnailIndex');

    if (missingFields.length > 0) {
      console.error('[POST /api/gems] Missing fields:', missingFields);
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields",
          message: `Missing required fields: ${missingFields.join(', ')}`
        },
        { status: 400 }
      );
    }

    // Validate photo URLs
    if (!body.photos.every((url) => url.startsWith("https://"))) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid photo URLs",
          message: "All photo URLs must be HTTPS"
        },
        { status: 400 }
      );
    }

    // Validate thumbnail index
    if (
      body.thumbnailIndex < 0 ||
      body.thumbnailIndex >= body.photos.length
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid thumbnail index",
          message: "Thumbnail index must be within photo array bounds"
        },
        { status: 400 }
      );
    }

    // Validate coordinates (Cebu City bounds)
    const { longitude, latitude } = body.coordinates;
    if (
      latitude < 10.25 ||
      latitude > 10.4 ||
      longitude < 123.8 ||
      longitude > 123.95
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid coordinates",
          message: "Coordinates must be within Cebu City bounds"
        },
        { status: 400 }
      );
    }

    // TODO: When backend is ready, forward request to backend API:
    // const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    // const response = await fetch(`${API_URL}/api/v1/gems`, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     // Add authentication headers if needed
    //   },
    //   body: JSON.stringify(body),
    // });
    // return NextResponse.json(await response.json(), { status: response.status });

    // MOCK IMPLEMENTATION: Generate a mock gem ID
    const gemId = `gem-${Date.now()}`;

    console.log(`[MOCK] Created gem: ${gemId}`, {
      name: body.name,
      category: body.category,
      coordinates: body.coordinates,
      photoCount: body.photos.length,
    });

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    return NextResponse.json(
      {
        success: true,
        gemId,
        message: "Gem created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating gem:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message: "An error occurred while creating the gem"
      },
      { status: 500 }
    );
  }
}
