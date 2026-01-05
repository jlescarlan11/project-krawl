/**
 * Search API Route Handler
 *
 * Handles GET requests for full-text search across Gems and Krawls.
 * Proxies requests to the backend API.
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/nextauth";

/**
 * GET /api/search
 *
 * Search across Gems and Krawls with full-text search.
 * Uses PostgreSQL tsvector with weighted relevance ranking.
 *
 * Query Parameters:
 * - q (required): Search query string
 * - limit (optional): Maximum results to return (default: 20, max: 100)
 * - offset (optional): Number of results to skip for pagination (default: 0)
 * - type (optional): Filter by type ("gems" or "krawls", omit for both)
 *
 * @returns SearchResultsResponse with matching gems and krawls
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const query = searchParams.get("q") || "";
    const limit = searchParams.get("limit") || "20";
    const offset = searchParams.get("offset") || "0";
    const type = searchParams.get("type") || null;

    // Validate query parameter
    if (!query || query.trim().length === 0) {
      return NextResponse.json(
        {
          error: "Query parameter 'q' is required",
          query: "",
          totalResults: 0,
          offset: 0,
          limit: 20,
          hasMore: false,
          gems: [],
          krawls: [],
        },
        { status: 400 }
      );
    }

    // Validate limit parameter
    const limitNum = parseInt(limit, 10);
    if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
      return NextResponse.json(
        {
          error: "Invalid limit parameter. Must be between 1 and 100",
          query,
          totalResults: 0,
          offset: parseInt(offset, 10) || 0,
          limit: 20,
          hasMore: false,
          gems: [],
          krawls: [],
        },
        { status: 400 }
      );
    }

    // Validate offset parameter
    const offsetNum = parseInt(offset, 10);
    if (isNaN(offsetNum) || offsetNum < 0) {
      return NextResponse.json(
        {
          error: "Invalid offset parameter. Must be >= 0",
          query,
          totalResults: 0,
          offset: 0,
          limit: limitNum,
          hasMore: false,
          gems: [],
          krawls: [],
        },
        { status: 400 }
      );
    }

    // Validate type parameter
    if (type && type !== "gems" && type !== "krawls") {
      return NextResponse.json(
        {
          error: "Invalid type parameter. Must be 'gems' or 'krawls'",
          query,
          totalResults: 0,
          offset: offsetNum,
          limit: limitNum,
          hasMore: false,
          gems: [],
          krawls: [],
        },
        { status: 400 }
      );
    }

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    const session = await auth();

    // Build backend URL with query parameters
    const params = new URLSearchParams({
      q: query,
      limit: String(limitNum),
      offset: String(offsetNum),
    });
    if (type) {
      params.append("type", type);
    }

    const BACKEND_ENDPOINT = `${API_URL}/api/search?${params.toString()}`;

    console.log(`[GET /api/search] Forwarding to backend: ${BACKEND_ENDPOINT}`);

    const backendResponse = await fetch(BACKEND_ENDPOINT, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(session?.jwt && { Authorization: `Bearer ${session.jwt}` }),
      },
      cache: "no-store", // Always fetch fresh data
    });

    if (!backendResponse.ok) {
      console.error(
        `[GET /api/search] Backend returned ${backendResponse.status}: ${backendResponse.statusText}`
      );

      // Return appropriate error response
      if (backendResponse.status === 400) {
        return NextResponse.json(
          {
            error: "Invalid search query. Please check your input.",
            query,
            totalResults: 0,
            offset: offsetNum,
            limit: limitNum,
            hasMore: false,
            gems: [],
            krawls: [],
          },
          { status: 400 }
        );
      } else if (backendResponse.status === 500) {
        return NextResponse.json(
          {
            error: "Search service is temporarily unavailable. Please try again later.",
            query,
            totalResults: 0,
            offset: offsetNum,
            limit: limitNum,
            hasMore: false,
            gems: [],
            krawls: [],
          },
          { status: 500 }
        );
      } else {
        return NextResponse.json(
          {
            error: `Search failed: ${backendResponse.statusText}`,
            query,
            totalResults: 0,
            offset: offsetNum,
            limit: limitNum,
            hasMore: false,
            gems: [],
            krawls: [],
          },
          { status: backendResponse.status }
        );
      }
    }

    const backendData = await backendResponse.json();

    console.log(
      `[GET /api/search] Successfully fetched ${backendData.totalResults || 0} results (${backendData.gems?.length || 0} gems, ${backendData.krawls?.length || 0} krawls)`
    );

    return NextResponse.json(backendData, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
      },
    });
  } catch (error) {
    console.error("[GET /api/search] Error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        query: "",
        totalResults: 0,
        offset: 0,
        limit: 20,
        hasMore: false,
        gems: [],
        krawls: [],
      },
      { status: 500 }
    );
  }
}










