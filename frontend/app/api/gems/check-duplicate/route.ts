import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/nextauth";

/**
 * Duplicate gem detection API endpoint
 *
 * POST /api/gems/check-duplicate
 *
 * Forwards request to backend API which uses PostGIS ST_DWithin + Levenshtein distance.
 *
 * Request body:
 * {
 *   name: string,
 *   coordinates: { latitude: number, longitude: number }
 * }
 *
 * Response:
 * {
 *   isDuplicate: boolean,
 *   existingGem?: {...}
 * }
 */

interface DuplicateCheckRequest {
  name: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body: DuplicateCheckRequest = await request.json();

    // Validate request
    if (!body.name || !body.coordinates) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Forward to backend API
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    const session = await auth();
    
    try {
      const backendResponse = await fetch(`${API_URL}/api/gems/check-duplicate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(session?.jwt && { Authorization: `Bearer ${session.jwt}` }),
        },
        body: JSON.stringify(body),
      });

      if (!backendResponse.ok) {
        const errorData = await backendResponse.json().catch(() => ({ error: "Backend error" }));
        return NextResponse.json(
          { error: errorData.message || errorData.error || "Duplicate check failed" },
          { status: backendResponse.status }
        );
      }

      const result = await backendResponse.json();
      return NextResponse.json(result);
    } catch (backendError) {
      console.error("Duplicate check error:", backendError);
      return NextResponse.json(
        { error: "Backend unavailable" },
        { status: 503 }
      );
    }
  } catch (error) {
    console.error("Duplicate check error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
