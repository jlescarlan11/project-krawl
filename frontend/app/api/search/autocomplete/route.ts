/**
 * Autocomplete API Route Handler
 *
 * Handles GET requests for search autocomplete suggestions.
 * Proxies requests to the backend API.
 */

import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/search/autocomplete
 *
 * Get autocomplete suggestions for search query.
 * Returns matching gem names, krawl names, and categories.
 *
 * Query Parameters:
 * - q (required): Partial search query string
 * - limit (optional): Maximum suggestions to return (default: 10, max: 50)
 *
 * @returns AutocompleteResponse with suggestions
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const query = searchParams.get("q") || "";
    const limit = searchParams.get("limit") || "10";

    // Validate query parameter
    if (!query || query.trim().length === 0) {
      return NextResponse.json({
        suggestions: [],
      });
    }

    // Validate limit parameter
    const limitNum = parseInt(limit, 10);
    if (isNaN(limitNum) || limitNum < 1 || limitNum > 50) {
      return NextResponse.json(
        {
          error: "Invalid limit parameter. Must be between 1 and 50",
          suggestions: [],
        },
        { status: 400 }
      );
    }

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    const BACKEND_ENDPOINT = `${API_URL}/api/search/autocomplete?q=${encodeURIComponent(query)}&limit=${limitNum}`;

    console.log(`[GET /api/search/autocomplete] Forwarding to backend: ${BACKEND_ENDPOINT}`);

    const backendResponse = await fetch(BACKEND_ENDPOINT, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store", // Always fetch fresh data
    });

    if (!backendResponse.ok) {
      console.error(
        `[GET /api/search/autocomplete] Backend returned ${backendResponse.status}: ${backendResponse.statusText}`
      );
      // Return empty results on error to gracefully handle backend unavailability
      return NextResponse.json(
        {
          suggestions: [],
        },
        { status: 200 } // Return 200 to prevent UI errors
      );
    }

    const backendData = await backendResponse.json();

    console.log(
      `[GET /api/search/autocomplete] Successfully fetched ${backendData.suggestions?.length || 0} suggestions`
    );

    return NextResponse.json(backendData, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
      },
    });
  } catch (error) {
    console.error("[GET /api/search/autocomplete] Error:", error);
    // Return empty results on error to gracefully handle failures
    return NextResponse.json(
      {
        suggestions: [],
      },
      { status: 200 } // Return 200 to prevent UI errors
    );
  }
}



