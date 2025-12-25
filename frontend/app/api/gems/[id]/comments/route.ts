/**
 * Comments API Route Handler for Gems
 *
 * Handles POST and GET requests for gem comments.
 * Proxies requests to the backend API.
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/nextauth";

/**
 * POST /api/gems/[id]/comments
 * Create a new comment on a gem
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
          message: "Please sign in to comment",
        },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { content } = body;

    // Validate content
    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid content",
          message: "Comment content is required",
        },
        { status: 400 }
      );
    }

    if (content.length > 500) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid content",
          message: "Comment must be 500 characters or less",
        },
        { status: 400 }
      );
    }

    // Validate UUID
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
    const BACKEND_ENDPOINT = `${API_URL}/api/gems/${id}/comments`;

    console.log(`[POST /api/gems/${id}/comments] Forwarding to backend`);

    const backendResponse = await fetch(BACKEND_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.jwt}`,
      },
      body: JSON.stringify({ content: content.trim() }),
    });

    console.log(`[POST /api/gems/${id}/comments] Backend status: ${backendResponse.status}`);

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json().catch(() => ({}));
      return NextResponse.json(
        {
          success: false,
          error: errorData.error || "Backend error",
          message: errorData.message || "Failed to create comment",
        },
        { status: backendResponse.status }
      );
    }

    const data = await backendResponse.json();
    return NextResponse.json({ success: true, ...data }, { status: 201 });
  } catch (error) {
    console.error(`[POST /api/gems/[id]/comments] Error:`, error);

    if (error instanceof TypeError && error.message.includes("fetch")) {
      return NextResponse.json(
        {
          success: false,
          error: "Backend unavailable",
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

/**
 * GET /api/gems/[id]/comments
 * Get paginated comments for a gem
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || "0";
    const size = searchParams.get("size") || "20";

    // Validate UUID
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
    const BACKEND_ENDPOINT = `${API_URL}/api/gems/${id}/comments?page=${page}&size=${size}`;

    console.log(`[GET /api/gems/${id}/comments] Forwarding to backend`);

    const backendResponse = await fetch(BACKEND_ENDPOINT, {
      method: "GET",
      // No auth needed - public endpoint
    });

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json().catch(() => ({}));
      return NextResponse.json(
        {
          success: false,
          error: errorData.error || "Backend error",
        },
        { status: backendResponse.status }
      );
    }

    const data = await backendResponse.json();
    return NextResponse.json({ success: true, ...data }, { status: 200 });
  } catch (error) {
    console.error(`[GET /api/gems/[id]/comments] Error:`, error);

    if (error instanceof TypeError && error.message.includes("fetch")) {
      return NextResponse.json(
        {
          success: false,
          error: "Backend unavailable",
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
