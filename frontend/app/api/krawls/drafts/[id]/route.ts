/**
 * Krawl Draft API Route Handler
 *
 * Handles:
 * - GET: Load a specific krawl draft
 * - DELETE: Delete a specific krawl draft
 *
 * Proxies requests to the backend Java API.
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import type {
  KrawlDraftData,
  LoadDraftResponse,
  DeleteDraftResponse,
} from "@/lib/types/draft";

/**
 * GET /api/krawls/drafts/[id]
 *
 * Load a specific krawl draft by ID
 */
export async function GET(
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
          error: "Unauthorized",
          message: "You must be signed in to load drafts",
        } as LoadDraftResponse,
        { status: 401 }
      );
    }

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid draft ID format",
          message: "Draft ID must be a valid UUID",
        } as LoadDraftResponse,
        { status: 400 }
      );
    }

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    const BACKEND_ENDPOINT = `${API_URL}/api/krawls/drafts/${id}`;

    console.log(`[GET /api/krawls/drafts/${id}] Forwarding to backend: ${BACKEND_ENDPOINT}`);

    const backendResponse = await fetch(BACKEND_ENDPOINT, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.jwt}`,
      },
      cache: "no-store",
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
        console.error(`[GET /api/krawls/drafts/${id}] Failed to read error response:`, e);
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
        } as LoadDraftResponse,
        { status: backendResponse.status }
      );
    }

    const backendDraft = await backendResponse.json();

    // Transform backend response to frontend format
    const draft = {
      id: backendDraft.id,
      userId: session.user?.id || "",
      data: backendDraft.data as KrawlDraftData,
      createdAt: backendDraft.createdAt,
      updatedAt: backendDraft.updatedAt,
      expiresAt: backendDraft.expiresAt,
    };

    return NextResponse.json({
      success: true,
      draft,
    } as LoadDraftResponse);
  } catch (error) {
    console.error(`[GET /api/krawls/drafts/[id]] Error:`, error);

    if (error instanceof TypeError && error.message.includes("fetch")) {
      return NextResponse.json(
        {
          success: false,
          error: "Backend unavailable",
          message: "Unable to connect to backend. Please try again later.",
        } as LoadDraftResponse,
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message: error instanceof Error ? error.message : "An error occurred while loading the draft",
      } as LoadDraftResponse,
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/krawls/drafts/[id]
 *
 * Delete a specific krawl draft by ID
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
          error: "Unauthorized",
          message: "You must be signed in to delete drafts",
        } as DeleteDraftResponse,
        { status: 401 }
      );
    }

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid draft ID format",
          message: "Draft ID must be a valid UUID",
        } as DeleteDraftResponse,
        { status: 400 }
      );
    }

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    const BACKEND_ENDPOINT = `${API_URL}/api/krawls/drafts/${id}`;

    console.log(`[DELETE /api/krawls/drafts/${id}] Forwarding to backend: ${BACKEND_ENDPOINT}`);

    const backendResponse = await fetch(BACKEND_ENDPOINT, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.jwt}`,
      },
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
        console.error(`[DELETE /api/krawls/drafts/${id}] Failed to read error response:`, e);
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
        } as DeleteDraftResponse,
        { status: backendResponse.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Draft deleted successfully",
    } as DeleteDraftResponse);
  } catch (error) {
    console.error(`[DELETE /api/krawls/drafts/[id]] Error:`, error);

    if (error instanceof TypeError && error.message.includes("fetch")) {
      return NextResponse.json(
        {
          success: false,
          error: "Backend unavailable",
          message: "Unable to connect to backend. Please try again later.",
        } as DeleteDraftResponse,
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message: error instanceof Error ? error.message : "An error occurred while deleting the draft",
      } as DeleteDraftResponse,
      { status: 500 }
    );
  }
}

