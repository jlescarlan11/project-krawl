/**
 * Ratings (Plural) API Route Handler
 *
 * Handles GET requests for retrieving all ratings for a gem.
 * Proxies requests to the backend API.
 * No authentication required - public endpoint.
 */

import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/gems/[id]/ratings
 *
 * Get all ratings for a gem.
 * No authentication required - public endpoint.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid gem ID format",
          message: "Gem ID must be a valid UUID",
        },
        { status: 400 }
      );
    }

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    const BACKEND_ENDPOINT = `${API_URL}/api/gems/${id}/ratings`;

    console.log(`[GET /api/gems/${id}/ratings] Forwarding to backend: ${BACKEND_ENDPOINT}`);

    const backendResponse = await fetch(BACKEND_ENDPOINT, {
      method: "GET",
    });

    console.log(`[GET /api/gems/${id}/ratings] Backend response status: ${backendResponse.status}`);

    if (!backendResponse.ok) {
      let errorData: any = null;
      try {
        const errorText = await backendResponse.text();
        if (errorText) {
          try {
            errorData = JSON.parse(errorText);
          } catch {
            errorData = { message: errorText };
          }
        }
      } catch (e) {
        console.error(`[GET /api/gems/${id}/ratings] Failed to read error response:`, e);
      }

      const errorMessage =
        errorData?.message ||
        errorData?.error ||
        `Backend returned ${backendResponse.status}: ${backendResponse.statusText}`;

      return NextResponse.json(
        {
          success: false,
          error: errorData?.error || "Backend error",
          message: errorMessage,
        },
        { status: backendResponse.status }
      );
    }

    const backendData = await backendResponse.json();
    console.log(`[GET /api/gems/${id}/ratings] Successfully retrieved ratings`, {
      count: Array.isArray(backendData) ? backendData.length : 0,
    });

    return NextResponse.json({ success: true, ratings: backendData }, { status: 200 });
  } catch (error) {
    console.error(`[GET /api/gems/[id]/ratings] Error:`, error);

    // Check if it's a network error
    if (error instanceof TypeError && error.message.includes("fetch")) {
      return NextResponse.json(
        {
          success: false,
          error: "Backend unavailable",
          message: "Unable to connect to backend. Please try again later.",
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message: error instanceof Error ? error.message : "An error occurred while fetching ratings",
      },
      { status: 500 }
    );
  }
}
