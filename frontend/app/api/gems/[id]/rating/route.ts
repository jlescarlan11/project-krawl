/**
 * Rating API Route Handler
 *
 * Handles POST and GET requests for rating gems.
 * Proxies requests to the backend API.
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/nextauth";
import { backendPost } from "@/lib/api/backend-client";

/**
 * POST /api/gems/[id]/rating
 *
 * Create or update a rating for a gem.
 * If the user has already rated, updates the existing rating.
 * If the user hasn't rated, creates a new rating.
 * Requires authentication.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();

    if (!session?.jwt) {
      return NextResponse.json(
        {
          success: false,
          error: "Authentication required",
          message: "Please sign in to rate a gem",
        },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { rating, comment } = body;

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid rating",
          message: "Rating must be between 1 and 5",
        },
        { status: 400 }
      );
    }

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

    // Forward request to backend API
    console.log(`[POST /api/gems/${id}/rating] Forwarding to backend`);

    const backendResponse = await backendPost(
      `/api/gems/${id}/rating`,
      { rating, comment },
      session.jwt
    );

    console.log(`[POST /api/gems/${id}/rating] Backend response status: ${backendResponse.status}`);

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
        console.error(`[POST /api/gems/${id}/rating] Failed to read error response:`, e);
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

    console.log(`[POST /api/gems/${id}/rating] Successfully created/updated rating`, {
      id: backendData.id,
      rating: backendData.rating,
      isNewRating: backendData.isNewRating,
    });

    return NextResponse.json(
      {
        success: true,
        ...backendData,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(`[POST /api/gems/[id]/rating] Error:`, error);

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
        message: error instanceof Error ? error.message : "An error occurred while rating the gem",
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/gems/[id]/rating
 *
 * Get the current user's rating for a gem.
 * Returns 404 if the user hasn't rated this gem.
 * Requires authentication.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();

    // This endpoint returns the current user's rating
    if (!session?.jwt) {
      return NextResponse.json(
        {
          success: false,
          error: "Authentication required",
        },
        { status: 401 }
      );
    }

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid gem ID format",
        },
        { status: 400 }
      );
    }

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    const BACKEND_ENDPOINT = `${API_URL}/api/gems/${id}/rating/me`;

    console.log(`[GET /api/gems/${id}/rating] Forwarding to backend: ${BACKEND_ENDPOINT}`);

    const backendResponse = await fetch(BACKEND_ENDPOINT, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.jwt}`,
      },
    });

    console.log(`[GET /api/gems/${id}/rating] Backend response status: ${backendResponse.status}`);

    if (backendResponse.status === 404) {
      // User hasn't rated yet
      return NextResponse.json({ success: true, rating: null }, { status: 200 });
    }

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
        console.error(`[GET /api/gems/${id}/rating] Failed to read error response:`, e);
      }

      return NextResponse.json(
        {
          success: false,
          error: errorData?.error || "Backend error",
        },
        { status: backendResponse.status }
      );
    }

    const backendData = await backendResponse.json();
    console.log(`[GET /api/gems/${id}/rating] Successfully retrieved user rating`);

    return NextResponse.json({ success: true, ...backendData }, { status: 200 });
  } catch (error) {
    console.error(`[GET /api/gems/[id]/rating] Error:`, error);

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
      },
      { status: 500 }
    );
  }
}
