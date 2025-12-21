/**
 * User Statistics API Route Handler
 *
 * Handles GET requests for fetching user statistics.
 * Proxies requests to the backend API.
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/route";

/**
 * GET /api/users/[id]/statistics
 * Fetches user statistics
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

    const backendResponse = await fetch(
      `${API_URL}/api/users/${id}/statistics`,
      {
        headers: session?.jwt
          ? {
              Authorization: `Bearer ${session.jwt}`,
            }
          : {},
      }
    );

    if (!backendResponse.ok) {
      return NextResponse.json(
        { error: "Failed to fetch statistics" },
        { status: backendResponse.status }
      );
    }

    const data = await backendResponse.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching statistics:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

