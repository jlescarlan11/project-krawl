/**
 * Gems Search API Route Handler
 *
 * Handles GET requests for searching gems by name, category, or district.
 * Fetches data from the backend API.
 */

import { NextRequest, NextResponse } from "next/server";
import { MapGem, GemStatus } from "@/components/map/gem-types";
import { auth } from "@/app/api/auth/[...nextauth]/route";

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

    // Fetch gems from backend
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    const session = await auth();
    
    try {
      // Fetch all gems from backend and filter client-side for now
      // TODO: Implement backend search endpoint when available
      const backendResponse = await fetch(`${API_URL}/api/gems`, {
        headers: session?.jwt ? {
          Authorization: `Bearer ${session.jwt}`,
        } : {},
      });
      
      if (!backendResponse.ok) {
        return NextResponse.json(
          {
            error: "Failed to fetch gems from backend",
            gems: [],
            total: 0,
            query,
          },
          { status: backendResponse.status }
        );
      }

      const backendGemsData = await backendResponse.json();
      const backendGemsList = Array.isArray(backendGemsData) ? backendGemsData : [];
      
      // Convert backend gems to MapGem format
      let gems: MapGem[] = backendGemsList.map((gemData: any) => {
        const longitude = gemData.coordinates?.longitude ?? gemData.longitude;
        const latitude = gemData.coordinates?.latitude ?? gemData.latitude;
        
        if (!longitude || !latitude) {
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

      // Client-side search filtering
      if (query) {
        const lowerQuery = query.toLowerCase().trim();
        gems = gems.filter((gem) => {
          return (
            gem.name.toLowerCase().includes(lowerQuery) ||
            gem.category.toLowerCase().includes(lowerQuery) ||
            gem.district.toLowerCase().includes(lowerQuery) ||
            gem.shortDescription?.toLowerCase().includes(lowerQuery)
          );
        });
      }

      // Sort by relevance (verified first, then by rating, then by vouch count)
      gems.sort((a, b) => {
        if (a.status === GemStatus.VERIFIED && b.status !== GemStatus.VERIFIED) {
          return -1;
        }
        if (a.status !== GemStatus.VERIFIED && b.status === GemStatus.VERIFIED) {
          return 1;
        }
        const ratingDiff = (b.rating || 0) - (a.rating || 0);
        if (ratingDiff !== 0) {
          return ratingDiff;
        }
        return (b.vouchCount || 0) - (a.vouchCount || 0);
      });

      // Apply limit
      gems = gems.slice(0, limit);

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
    } catch (backendError) {
      console.error('[GET /api/gems/search] Failed to fetch from backend:', backendError);
      return NextResponse.json(
        {
          error: "Backend unavailable",
          gems: [],
          total: 0,
          query,
        },
        { status: 503 }
      );
    }
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
