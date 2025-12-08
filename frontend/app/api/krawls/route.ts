"use server";

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import type { MapKrawl } from "@/components/map/krawl-types";
import type { CreateKrawlRequest } from "@/lib/api/krawls";

/**
 * Krawls API Route Handler
 * 
 * Handles:
 * - GET: Fetches featured krawls from the backend API
 * - POST: Creates a new krawl
 */
export async function GET() {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    
    const backendResponse = await fetch(`${API_URL}/api/landing/featured-krawls?limit=10`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store", // Always fetch fresh data
    });

    if (!backendResponse.ok) {
      console.error(`[GET /api/krawls] Backend returned ${backendResponse.status}`);
      // Return empty array on error to gracefully handle backend unavailability
      return NextResponse.json({
        krawls: [],
        total: 0,
      });
    }

    const backendData = await backendResponse.json();
    const backendKrawls = backendData.featured || [];

    // Map backend FeaturedKrawlResponse to frontend MapKrawl format
    // Note: Backend may return empty list initially (LandingService has TODO)
    const krawls: MapKrawl[] = backendKrawls.map((krawl: any) => ({
      id: krawl.id || "",
      name: krawl.name || "",
      description: krawl.description || "",
      coverImage: krawl.coverImage || "",
      rating: krawl.rating ?? undefined,
      difficulty: krawl.difficulty || undefined,
      estimatedDurationMinutes: krawl.estimatedDurationMinutes ?? undefined,
      gems: [], // Gems are not included in featured krawls response - would need separate endpoint
      color: "#3b82f6", // Default color, could be calculated or provided by backend
    }));

    return NextResponse.json({
      krawls,
      total: krawls.length,
    });
  } catch (error) {
    console.error("[GET /api/krawls] Error fetching krawls:", error);
    // Return empty array on error to gracefully handle network failures
    return NextResponse.json({
      krawls: [],
      total: 0,
    });
  }
}

/**
 * POST /api/krawls
 *
 * Create a new krawl.
 * Requires authentication.
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.jwt) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
          message: "You must be signed in to create a krawl",
        },
        { status: 401 }
      );
    }

    const body = await request.json();
    const krawlData = body as CreateKrawlRequest;

    // Validate required fields
    if (!krawlData.name || !krawlData.description || !krawlData.category) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation error",
          message: "Name, description, and category are required",
        },
        { status: 400 }
      );
    }

    if (!krawlData.gems || krawlData.gems.length < 2) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation error",
          message: "At least 2 gems are required",
        },
        { status: 400 }
      );
    }

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    const BACKEND_ENDPOINT = `${API_URL}/api/krawls`;

    console.log(`[POST /api/krawls] Forwarding to backend: ${BACKEND_ENDPOINT}`);

    const backendResponse = await fetch(BACKEND_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.jwt}`,
      },
      body: JSON.stringify(krawlData),
    });

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
        console.error(`[POST /api/krawls] Failed to read error response:`, e);
      }

      const errorMessage =
        errorData?.message ||
        errorData?.error ||
        `Backend returned ${backendResponse.status}: ${backendResponse.statusText}`;

      console.error(`[POST /api/krawls] Backend error:`, {
        status: backendResponse.status,
        statusText: backendResponse.statusText,
        errorData,
        errorMessage,
      });

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

    console.log(`[POST /api/krawls] Successfully created krawl: ${backendData.krawlId}`, {
      name: krawlData.name,
      category: krawlData.category,
      gemCount: krawlData.gems.length,
    });

    return NextResponse.json(
      {
        success: true,
        krawlId: backendData.krawlId,
        message: backendData.message || "Krawl created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/krawls] Error:", error);

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
        message:
          error instanceof Error
            ? error.message
            : "An error occurred while creating the krawl",
      },
      { status: 500 }
    );
  }
}
