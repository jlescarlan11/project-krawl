/**
 * Krawl Drafts API Route Handler
 *
 * Handles:
 * - POST: Save/update krawl draft
 * - GET: List user's krawl drafts
 *
 * Proxies requests to the backend Java API.
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/nextauth";
import type {
  KrawlDraftData,
  SaveDraftResponse,
  ListDraftsResponse,
} from "@/lib/types/draft";

/**
 * GET /api/krawls/drafts
 *
 * List all krawl drafts for the authenticated user
 */
export async function GET() {
  try {
    const session = await auth();

    // Validate session exists
    if (!session) {
      console.error("[GET /api/krawls/drafts] No session found");
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
          message: "You must be signed in to view drafts",
        } as ListDraftsResponse,
        { status: 401 }
      );
    }

    // Validate JWT exists
    if (!session.jwt) {
      console.error("[GET /api/krawls/drafts] Session exists but no JWT token");
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
          message: "Authentication token is missing. Please sign in again.",
        } as ListDraftsResponse,
        { status: 401 }
      );
    }

    // Validate JWT is not expired
    try {
      const jwtParts = session.jwt.split('.');
      if (jwtParts.length !== 3) {
        throw new Error('Invalid JWT format');
      }

      const payload = JSON.parse(Buffer.from(jwtParts[1], 'base64url').toString('utf-8'));
      const now = Math.floor(Date.now() / 1000);

      if (payload.exp && payload.exp < now) {
        console.error("[GET /api/krawls/drafts] JWT token expired", {
          exp: new Date(payload.exp * 1000).toISOString(),
          now: new Date(now * 1000).toISOString(),
        });
        return NextResponse.json(
          {
            success: false,
            error: "TokenExpired",
            message: "Your session has expired. Please sign in again.",
          } as ListDraftsResponse,
          { status: 401 }
        );
      }
    } catch (error) {
      console.error("[GET /api/krawls/drafts] JWT validation error:", error);
      // Continue anyway - let backend validate
    }

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    const BACKEND_ENDPOINT = `${API_URL}/api/krawls/drafts`;

    console.log(`[GET /api/krawls/drafts] Forwarding to backend: ${BACKEND_ENDPOINT}`);

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
        console.error(`[GET /api/krawls/drafts] Failed to read error response:`, e);
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
        } as ListDraftsResponse,
        { status: backendResponse.status }
      );
    }

    const backendDrafts = await backendResponse.json();

    // Transform backend response to frontend format
    const drafts = Array.isArray(backendDrafts)
      ? backendDrafts.map((draft: any) => ({
          id: draft.id,
          userId: session.user?.id || "",
          data: draft.data as KrawlDraftData,
          createdAt: draft.createdAt,
          updatedAt: draft.updatedAt,
          expiresAt: draft.expiresAt,
        }))
      : [];

    return NextResponse.json({
      success: true,
      drafts,
    } as ListDraftsResponse);
  } catch (error) {
    console.error("[GET /api/krawls/drafts] Error:", error);

    if (error instanceof TypeError && error.message.includes("fetch")) {
      return NextResponse.json(
        {
          success: false,
          error: "Backend unavailable",
          message: "Unable to connect to backend. Please try again later.",
        } as ListDraftsResponse,
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message: error instanceof Error ? error.message : "An error occurred while loading drafts",
      } as ListDraftsResponse,
      { status: 500 }
    );
  }
}

/**
 * POST /api/krawls/drafts
 *
 * Save or update a krawl creation draft
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    // Validate session exists
    if (!session) {
      console.error("[POST /api/krawls/drafts] No session found");
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
          message: "You must be signed in to save drafts",
        } as SaveDraftResponse,
        { status: 401 }
      );
    }

    // Validate JWT exists
    if (!session.jwt) {
      console.error("[POST /api/krawls/drafts] Session exists but no JWT token", {
        hasUser: !!session.user,
        userId: session.user?.id,
      });
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
          message: "Authentication token is missing. Please sign in again.",
        } as SaveDraftResponse,
        { status: 401 }
      );
    }

    // Validate JWT is not expired
    try {
      const jwtParts = session.jwt.split('.');
      if (jwtParts.length !== 3) {
        throw new Error('Invalid JWT format');
      }

      const payload = JSON.parse(Buffer.from(jwtParts[1], 'base64url').toString('utf-8'));
      const now = Math.floor(Date.now() / 1000);

      if (payload.exp && payload.exp < now) {
        console.error("[POST /api/krawls/drafts] JWT token expired", {
          exp: new Date(payload.exp * 1000).toISOString(),
          now: new Date(now * 1000).toISOString(),
        });
        return NextResponse.json(
          {
            success: false,
            error: "TokenExpired",
            message: "Your session has expired. Please sign in again.",
          } as SaveDraftResponse,
          { status: 401 }
        );
      }

      console.log("[POST /api/krawls/drafts] JWT validation passed", {
        userId: payload.sub,
        expiresAt: payload.exp ? new Date(payload.exp * 1000).toISOString() : 'no expiration',
        timeUntilExpiry: payload.exp ? `${Math.floor((payload.exp - now) / 60)} minutes` : 'N/A',
      });
    } catch (error) {
      console.error("[POST /api/krawls/drafts] JWT validation error:", error);
      // Continue anyway - let backend validate
    }

    const body = await request.json();
    const { data } = body as { data: KrawlDraftData };

    if (!data) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request",
          message: "Draft data is required",
        } as SaveDraftResponse,
        { status: 400 }
      );
    }

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    const BACKEND_ENDPOINT = `${API_URL}/api/krawls/drafts`;

    console.log(`[POST /api/krawls/drafts] Forwarding to backend: ${BACKEND_ENDPOINT}`);

    const backendResponse = await fetch(BACKEND_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.jwt}`,
      },
      body: JSON.stringify(data),
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
        console.error(`[POST /api/krawls/drafts] Failed to read error response:`, e);
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
        } as SaveDraftResponse,
        { status: backendResponse.status }
      );
    }

    const backendDraft = await backendResponse.json();

    return NextResponse.json({
      success: true,
      draftId: backendDraft.id,
      message: "Draft saved successfully",
    } as SaveDraftResponse);
  } catch (error) {
    console.error("[POST /api/krawls/drafts] Error:", error);

    if (error instanceof TypeError && error.message.includes("fetch")) {
      return NextResponse.json(
        {
          success: false,
          error: "Backend unavailable",
          message: "Unable to connect to backend. Please try again later.",
        } as SaveDraftResponse,
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message: error instanceof Error ? error.message : "An error occurred while saving the draft",
      } as SaveDraftResponse,
      { status: 500 }
    );
  }
}

