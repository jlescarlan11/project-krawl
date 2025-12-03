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
import { auth } from "@/app/api/auth/[...nextauth]/route";

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

    // Fetch gems from backend database
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    const session = await auth();
    
    let gems: MapGem[] = [];
    
    try {
      // Fetch all gems from backend
      const backendResponse = await fetch(`${API_URL}/api/gems`, {
        headers: session?.jwt ? {
          Authorization: `Bearer ${session.jwt}`,
        } : {},
      });
      
      if (backendResponse.ok) {
        const backendGemsData = await backendResponse.json();
        const backendGemsList = Array.isArray(backendGemsData) ? backendGemsData : [];
        
        // Convert backend gems to MapGem format
        gems = backendGemsList.map((gemData: any) => {
          const longitude = gemData.coordinates?.longitude ?? gemData.longitude;
          const latitude = gemData.coordinates?.latitude ?? gemData.latitude;
          
          if (!longitude || !latitude) {
            console.warn(`[GET /api/gems] Gem ${gemData.id} missing coordinates`);
            return null;
          }
          
          const backendStatus = gemData.status?.toLowerCase() || 'pending';
          const frontendStatus = backendStatus === 'verified' ? GemStatus.VERIFIED :
                                 backendStatus === 'stale' ? GemStatus.STALE :
                                 GemStatus.PENDING;
          
          return {
            id: gemData.id,
            name: gemData.name,
            category: gemData.category,
            district: gemData.district || "Cebu City",
            coordinates: [longitude, latitude] as [number, number],
            status: frontendStatus,
            thumbnailUrl: gemData.thumbnailUrl,
            rating: gemData.ratingsData?.averageRating || gemData.rating || 0,
            vouchCount: gemData.vouchesData?.vouchCount || gemData.vouchCount || 0,
            viewCount: gemData.viewCount || 0,
            shortDescription: gemData.shortDescription,
          } as MapGem;
        }).filter((g): g is MapGem => g !== null);
        
        console.log(`[GET /api/gems] Fetched ${gems.length} gems from backend database`);
      } else {
        console.error(`[GET /api/gems] Backend returned ${backendResponse.status}`);
        return NextResponse.json(
          {
            error: "Failed to fetch gems from backend",
            gems: [],
            total: 0,
          },
          { status: backendResponse.status }
        );
      }
    } catch (backendError) {
      console.error('[GET /api/gems] Failed to fetch from backend:', backendError);
      return NextResponse.json(
        {
          error: "Backend unavailable",
          gems: [],
          total: 0,
        },
        { status: 503 }
      );
    }
    
    console.log(`[GET /api/gems] Total gems before bounds filter: ${gems.length}`);
    
    // Filter by bounds
    gems = filterGemsByBounds(gems, { north, south, east, west });
    
    console.log(`[GET /api/gems] After bounds filter: ${gems.length} gems`);

    // Filter by categories if provided
    if (categoriesParam) {
      const categories = categoriesParam.split(",").map((c) => c.trim());
      gems = gems.filter((gem) => categories.includes(gem.category));
    }

    // Apply limit
    gems = gems.slice(0, limit);

    // Simulate network delay (remove in production)
    await new Promise((resolve) => setTimeout(resolve, 100));

    console.log(`[GET /api/gems] Returning ${gems.length} gems for bounds:`, {
      north,
      south,
      east,
      west,
      gemIds: gems.map(g => g.id),
    });

    return NextResponse.json(
      {
        gems,
        total: gems.length,
        zoom,
      },
      {
        status: 200,
        headers: {
          // Reduced cache time to ensure fresh data - especially important for newly created gems
          "Cache-Control": "public, s-maxage=10, stale-while-revalidate=30",
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

    // Get session for authentication
    const session = await auth();
    if (!session?.jwt) {
      return NextResponse.json(
        {
          success: false,
          error: "Authentication required",
          message: "Please sign in to create a gem",
        },
        { status: 401 }
      );
    }

    // Check token expiration status
    let expirationStatus = "unknown";
    let timeUntilExpiration: number | null = null;
    let isExpired = false;
    
    if (session.expires) {
      const expiresDate = typeof session.expires === "string" 
        ? new Date(session.expires) 
        : session.expires;
      
      const now = new Date();
      timeUntilExpiration = expiresDate.getTime() - now.getTime();
      
      if (isNaN(expiresDate.getTime()) || expiresDate < now) {
        isExpired = true;
        expirationStatus = "expired";
      } else if (timeUntilExpiration < 5 * 60 * 1000) {
        expirationStatus = "expiring_soon";
      } else {
        expirationStatus = "valid";
      }
      
      console.log('[POST /api/gems] Token expiration check:', {
        expirationStatus,
        expiresAt: expiresDate.toISOString(),
        currentTime: now.toISOString(),
        timeUntilExpiration: timeUntilExpiration > 0 ? `${Math.floor(timeUntilExpiration / 1000 / 60)} minutes` : 'expired',
        isExpired,
      });
    }

    // Extract district from address (backend requires it)
    const extractDistrict = (address: string): string => {
      const districts = [
        "Downtown",
        "Lahug",
        "Mabolo",
        "Banilad",
        "Talamban",
        "Apas",
        "Busay",
        "Capitol Site",
        "Cebu Business Park",
        "IT Park",
        "Beverly Hills",
      ];
      const addressLower = address.toLowerCase();
      for (const district of districts) {
        if (addressLower.includes(district.toLowerCase())) {
          return district;
        }
      }
      return "Cebu City"; // Default fallback
    };

    const district = extractDistrict(body.address);

    // Forward request to backend API
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    // Backend endpoint is /api/gems (not /api/v1/gems)
    const BACKEND_ENDPOINT = `${API_URL}/api/gems`;
    // Build request object - ensure all required fields are present
    // Note: Category values now match between frontend and backend
    const backendRequest: any = {
      name: body.name,
      category: body.category,
      district: district,
      coordinates: {
        latitude: body.coordinates.latitude,
        longitude: body.coordinates.longitude,
      },
      photos: body.photos,
      thumbnailIndex: body.thumbnailIndex,
      tags: Array.isArray(body.tags) && body.tags.length > 0 ? body.tags : [],
    };

    // Add optional fields only if they have values (to avoid sending empty strings/null)
    if (body.shortDescription) {
      backendRequest.shortDescription = body.shortDescription;
    }
    if (body.fullDescription) {
      backendRequest.fullDescription = body.fullDescription;
    }
    if (body.culturalSignificance) {
      backendRequest.culturalSignificance = body.culturalSignificance;
    }
    if (body.address) {
      backendRequest.address = body.address;
    }
    if (body.hours) {
      backendRequest.hours = body.hours;
    }
    if (body.website) {
      backendRequest.website = body.website;
    }
    if (body.phone) {
      backendRequest.phone = body.phone;
    }
    // photoPublicIds is optional - only include if present and has values
    if (body.photoPublicIds && Array.isArray(body.photoPublicIds) && body.photoPublicIds.length > 0) {
      backendRequest.photoPublicIds = body.photoPublicIds;
    }

    // Log full request for debugging (be careful with sensitive data)
    const jwtPreview = session.jwt ? (session.jwt.length > 50 ? session.jwt.substring(0, 50) + '...' : session.jwt) : null;
    console.log('[POST /api/gems] Forwarding to backend:', {
      apiUrl: BACKEND_ENDPOINT,
      hasJWT: !!session.jwt,
      jwtLength: session.jwt?.length,
      jwtPreview,
      userId: session?.user?.id,
      sessionExpires: session?.expires ? (typeof session.expires === 'string' ? session.expires : session.expires.toISOString()) : null,
      isExpired,
      expirationStatus,
      timeUntilExpiration: timeUntilExpiration !== null ? timeUntilExpiration : null,
      district,
      category: body.category,
      photoCount: body.photos.length,
      photoUrls: body.photos.map((url, idx) => ({
        index: idx,
        url: url.substring(0, 100) + (url.length > 100 ? '...' : ''),
        isComplete: url.length > 100, // Check if URL seems complete
      })),
      photoPublicIds: body.photoPublicIds,
      requestBody: {
        name: backendRequest.name,
        category: backendRequest.category,
        district: backendRequest.district,
        shortDescription: backendRequest.shortDescription?.substring(0, 50),
        fullDescription: backendRequest.fullDescription?.substring(0, 50),
        coordinates: backendRequest.coordinates,
        address: backendRequest.address?.substring(0, 50),
        photoCount: backendRequest.photos.length,
        thumbnailIndex: backendRequest.thumbnailIndex,
        hasTags: !!backendRequest.tags && backendRequest.tags.length > 0,
        hasCulturalSignificance: !!backendRequest.culturalSignificance,
      },
      fullRequestBody: JSON.stringify(backendRequest).substring(0, 1000),
    });

    // Validate request before sending
    const validationErrors: string[] = [];
    if (!backendRequest.name || backendRequest.name.trim().length < 3) {
      validationErrors.push('Name must be at least 3 characters');
    }
    if (!backendRequest.category) {
      validationErrors.push('Category is required');
    }
    if (!backendRequest.district) {
      validationErrors.push('District is required');
    }
    if (!backendRequest.coordinates || !backendRequest.coordinates.latitude || !backendRequest.coordinates.longitude) {
      validationErrors.push('Coordinates are required');
    }
    if (!backendRequest.photos || backendRequest.photos.length === 0) {
      validationErrors.push('At least one photo is required');
    }
    if (backendRequest.thumbnailIndex === undefined || backendRequest.thumbnailIndex < 0) {
      validationErrors.push('Thumbnail index is required');
    }
    if (backendRequest.thumbnailIndex >= backendRequest.photos.length) {
      validationErrors.push('Thumbnail index is out of bounds');
    }
    
    if (validationErrors.length > 0) {
      console.error('[POST /api/gems] Validation errors:', validationErrors);
      return NextResponse.json(
        {
          success: false,
          error: "VALIDATION_ERROR",
          message: validationErrors.join('; '),
        },
        { status: 400 }
      );
    }

    try {
      const requestBodyString = JSON.stringify(backendRequest);
      
      // Validate JSON is complete and valid
      let parsedRequest;
      try {
        parsedRequest = JSON.parse(requestBodyString);
      } catch (e) {
        console.error('[POST /api/gems] Invalid JSON generated!', e);
        return NextResponse.json(
          {
            success: false,
            error: "INVALID_REQUEST",
            message: "Failed to serialize request body",
          },
          { status: 500 }
        );
      }
      
      // Validate photo URL lengths (backend has 500 char limit)
      const longUrls = parsedRequest.photos?.filter((url: string) => url.length > 500) || [];
      if (longUrls.length > 0) {
        console.error('[POST /api/gems] Photo URLs exceed 500 character limit:', {
          longUrls: longUrls.map((url: string) => ({ url: url.substring(0, 100) + '...', length: url.length })),
        });
        return NextResponse.json(
          {
            success: false,
            error: "VALIDATION_ERROR",
            message: `Photo URL(s) exceed maximum length of 500 characters`,
          },
          { status: 400 }
        );
      }

      // Log full request details for debugging
      console.log('[POST /api/gems] Sending request to backend:', {
        url: BACKEND_ENDPOINT,
        bodyLength: requestBodyString.length,
        userId: session?.user?.id,
        requestFields: {
          name: parsedRequest.name,
          category: parsedRequest.category,
          district: parsedRequest.district,
          hasCoordinates: !!parsedRequest.coordinates,
          latitude: parsedRequest.coordinates?.latitude,
          longitude: parsedRequest.coordinates?.longitude,
          photoCount: parsedRequest.photos?.length || 0,
          photoUrls: parsedRequest.photos?.map((url: string) => ({
            preview: url.substring(0, 80) + '...',
            length: url.length,
            exceedsLimit: url.length > 500,
          })) || [],
          hasPhotoPublicIds: !!parsedRequest.photoPublicIds,
          photoPublicIds: parsedRequest.photoPublicIds || [],
          thumbnailIndex: parsedRequest.thumbnailIndex,
          tags: parsedRequest.tags || [],
          hasAddress: !!parsedRequest.address,
          hasShortDescription: !!parsedRequest.shortDescription,
          hasFullDescription: !!parsedRequest.fullDescription,
        },
        fullRequestBody: requestBodyString, // Log complete JSON string
      });

      const backendResponse = await fetch(BACKEND_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.jwt}`,
        },
        body: requestBodyString,
      });

      console.log('[POST /api/gems] Backend response received:', {
        status: backendResponse.status,
        statusText: backendResponse.statusText,
        ok: backendResponse.ok,
        headers: Object.fromEntries(backendResponse.headers.entries()),
      });

      let backendData: any;
      let responseText: string = '';
      try {
        responseText = await backendResponse.text();
        const previewText = responseText ? responseText.substring(0, 500) : '(empty)';
        console.log('[POST /api/gems] Raw response text:', previewText);
        
        if (responseText && responseText.trim()) {
          try {
            backendData = JSON.parse(responseText);
          } catch (jsonError) {
            console.error('[POST /api/gems] Response is not valid JSON:', {
              error: jsonError,
              preview: previewText,
              status: backendResponse.status,
            });
            backendData = { 
              error: 'Invalid JSON response',
              rawResponse: previewText,
            };
          }
        } else {
          console.warn('[POST /api/gems] Empty response from backend');
          backendData = {};
        }
      } catch (readError) {
        console.error('[POST /api/gems] Failed to read backend response:', {
          error: readError,
          errorMessage: readError instanceof Error ? readError.message : String(readError),
          status: backendResponse.status,
          statusText: backendResponse.statusText,
        });
        backendData = { 
          error: 'Failed to read response',
          errorDetails: readError instanceof Error ? readError.message : String(readError),
        };
      }

      if (!backendResponse.ok) {
        const previewText = responseText ? responseText.substring(0, 500) : '(empty)';
        console.error('[POST /api/gems] Backend error:', {
          status: backendResponse.status,
          statusText: backendResponse.statusText,
          data: backendData,
          rawResponse: previewText,
          url: BACKEND_ENDPOINT,
          requestBody: JSON.stringify(backendRequest).substring(0, 500),
        });

        // Extract error message from various possible structures
        const errorMessage = 
          backendData.message || 
          backendData.error || 
          backendData.error?.message ||
          `Backend returned ${backendResponse.status}: ${backendResponse.statusText}`;

        // Log full error details for debugging
        console.error('[POST /api/gems] Full backend error details:', {
          status: backendResponse.status,
          statusText: backendResponse.statusText,
          backendData,
          fullResponseText: responseText.substring(0, 1000),
          requestPreview: JSON.stringify(backendRequest).substring(0, 500),
        });

        return NextResponse.json(
          {
            success: false,
            error: backendData.error || "Backend error",
            message: errorMessage,
            // Include backend error code for debugging
            ...(backendData.error && { errorCode: backendData.error }),
          },
          { status: backendResponse.status }
        );
      }

      // Backend returns gemId as UUID string
      const gemId = backendData.gemId;

      console.log(`[POST /api/gems] Successfully created gem: ${gemId}`, {
        name: body.name,
        category: body.category,
        district,
      });

      return NextResponse.json(
        {
          success: true,
          gemId: gemId.toString(), // Ensure it's a string
          message: backendData.message || "Gem created successfully",
        },
        { status: 201 }
      );
    } catch (error) {
      console.error('[POST /api/gems] Error calling backend:', error);
      
      // Check if it's a network error (backend not reachable)
      if (error instanceof TypeError && error.message.includes('fetch')) {
        console.error('[POST /api/gems] Network error - backend not reachable:', {
          apiUrl: BACKEND_ENDPOINT,
          error: error.message,
        });
        
        return NextResponse.json(
          {
            success: false,
            error: "Backend unavailable",
            message: "Unable to connect to backend. Please try again later.",
          },
          { status: 503 }
        );
      }

      // Other errors (not network errors)
      throw error;
    }
  } catch (error) {
    console.error("Error creating gem:", error);
    
    // If error is already a Response, return it
    if (error instanceof Response) {
      return error;
    }
    
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message: error instanceof Error ? error.message : "An error occurred while creating the gem"
      },
      { status: 500 }
    );
  }
}
