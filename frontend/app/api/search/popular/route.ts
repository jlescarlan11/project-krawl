/**
 * Popular Searches API Route Handler
 *
 * Handles GET requests for fetching popular search queries.
 * Proxies requests to the backend API.
 */

import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/search/popular
 *
 * Get popular search queries from the past 7 days.
 * Results are cached on the backend for 5 minutes.
 *
 * @returns PopularSearchesResponse with top 10 popular queries
 */
export async function GET(request: NextRequest) {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    const BACKEND_ENDPOINT = `${API_URL}/api/search/popular`;

    console.log(`[GET /api/search/popular] Forwarding to backend: ${BACKEND_ENDPOINT}`);

    let backendResponse: Response;
    try {
      backendResponse = await fetch(BACKEND_ENDPOINT, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store", // Always fetch fresh data
        signal: AbortSignal.timeout(5000), // 5 second timeout
      });
    } catch (error: any) {
      // Handle ECONNREFUSED, ECONNRESET, and other network errors
      if (error?.code === "ECONNREFUSED" || error?.code === "ECONNRESET" || error?.name === "AbortError") {
        console.warn(`[GET /api/search/popular] Backend unavailable: ${error.message || error}`);
        return NextResponse.json(
          {
            queries: [],
          },
          { status: 200 } // Return 200 to prevent UI errors
        );
      }
      throw error; // Re-throw unexpected errors
    }

    if (!backendResponse.ok) {
      console.error(
        `[GET /api/search/popular] Backend returned ${backendResponse.status}: ${backendResponse.statusText}`
      );
      // Return empty results on error to gracefully handle backend unavailability
      return NextResponse.json(
        {
          queries: [],
        },
        { status: 200 } // Return 200 to prevent UI errors
      );
    }

    const backendData = await backendResponse.json();

    console.log(`[GET /api/search/popular] Successfully fetched ${backendData.queries?.length || 0} popular searches`);

    return NextResponse.json(backendData, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    console.error("[GET /api/search/popular] Error:", error);
    // Return empty results on error to gracefully handle failures
    return NextResponse.json(
      {
        queries: [],
      },
      { status: 200 } // Return 200 to prevent UI errors
    );
  }
}





