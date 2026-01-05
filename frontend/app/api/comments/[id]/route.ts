/**
 * Comment Update/Delete API Route Handler
 *
 * Handles PUT and DELETE requests for individual comments.
 * Proxies requests to the backend API.
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/nextauth";
import { BACKEND_API_URL, backendPut, backendDelete } from "@/lib/api/backend-client";

/**
 * PUT /api/comments/[id]
 * Update a comment
 */
export async function PUT(
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

    const backendResponse = await backendPut(
      `/api/gems/comments/${id}`,
      { content: content.trim() },
      session.jwt
    );

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json().catch(() => ({}));
      return NextResponse.json(
        {
          success: false,
          error: errorData.error || "Backend error",
          message: errorData.message || "Failed to update comment",
        },
        { status: backendResponse.status }
      );
    }

    const data = await backendResponse.json();
    return NextResponse.json({ success: true, ...data }, { status: 200 });
  } catch (error) {
    console.error(`[PUT /api/comments/[id]] Error:`, error);
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
 * DELETE /api/comments/[id]
 * Delete a comment
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
        {
          success: false,
          error: "Authentication required",
        },
        { status: 401 }
      );
    }

    const backendResponse = await backendDelete(
      `/api/gems/comments/${id}`,
      session.jwt
    );

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json().catch(() => ({}));
      return NextResponse.json(
        {
          success: false,
          error: errorData.error || "Backend error",
          message: errorData.message || "Failed to delete comment",
        },
        { status: backendResponse.status }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error(`[DELETE /api/comments/[id]] Error:`, error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
