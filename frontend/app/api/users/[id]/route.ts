/**
 * User Profile API Route Handler
 *
 * Handles GET and DELETE requests for user profile.
 * Proxies requests to the backend API.
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/nextauth";

/**
 * GET /api/users/[id]
 * Fetches user profile by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

    const backendResponse = await fetch(`${API_URL}/api/users/${id}`, {
      headers: session?.jwt
        ? {
            Authorization: `Bearer ${session.jwt}`,
          }
        : {},
    });

    if (!backendResponse.ok) {
      return NextResponse.json(
        { error: "Failed to fetch user profile" },
        { status: backendResponse.status }
      );
    }

    const data = await backendResponse.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/users/[id]
 * Deletes user account
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();

    if (!session?.jwt) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

    const backendResponse = await fetch(`${API_URL}/api/users/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${session.jwt}`,
      },
    });

    if (!backendResponse.ok) {
      const error = await backendResponse.json().catch(() => ({
        error: "Failed to delete account",
      }));
      return NextResponse.json(error, { status: backendResponse.status });
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting account:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

