/**
 * Vouch API Route Handler for Krawls
 *
 * Handles POST requests for toggling vouches on krawls.
 * Proxies requests to the backend API.
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/route";

/**
 * POST /api/krawls/[id]/vouch
 *
 * Toggle vouch for a krawl.
 * If user has vouched, removes the vouch.
 * If user hasn't vouched, creates a new vouch.
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
          message: "Please sign in to vouch for a krawl",
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
          error: "Invalid krawl ID format",
          message: "Krawl ID must be a valid UUID",
        },
        { status: 400 }
      );
    }

    // Forward request to backend API
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    const BACKEND_ENDPOINT = `${API_URL}/api/krawls/${id}/vouch`;

    console.log(`[POST /api/krawls/${id}/vouch] Forwarding to backend: ${BACKEND_ENDPOINT}`);

    const backendResponse = await fetch(BACKEND_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.jwt}`,
      },
    });

    console.log(`[POST /api/krawls/${id}/vouch] Backend response status: ${backendResponse.status}`);

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
        console.error(`[POST /api/krawls/${id}/vouch] Failed to read error response:`, e);
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

    console.log(`[POST /api/krawls/${id}/vouch] Successfully toggled vouch`, {
      vouchCount: backendData.vouchCount,
      isVouchedByCurrentUser: backendData.isVouchedByCurrentUser,
    });

    return NextResponse.json(
      {
        success: true,
        vouchCount: backendData.vouchCount,
        isVouchedByCurrentUser: backendData.isVouchedByCurrentUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(`[POST /api/krawls/[id]/vouch] Error:`, error);

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
        message: error instanceof Error ? error.message : "An error occurred while toggling the vouch",
      },
      { status: 500 }
    );
  }
}

