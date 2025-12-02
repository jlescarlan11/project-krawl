/**
 * Drafts API Route Handler
 *
 * Handles:
 * - POST: Save/update draft
 * - GET: List user's drafts
 *
 * TODO: Replace with actual backend API call when backend is ready
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import type {
  Draft,
  SaveDraftRequest,
  SaveDraftResponse,
  ListDraftsResponse,
} from "@/lib/types/draft";

// Mock in-memory storage (replace with database in production)
// Key: userId, Value: Draft[]
const mockDraftStorage = new Map<string, Draft[]>();

/**
 * Generate a unique draft ID
 */
function generateDraftId(): string {
  return `draft-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Get drafts for a user
 */
function getUserDrafts(userId: string): Draft[] {
  return mockDraftStorage.get(userId) || [];
}

/**
 * Save draft for a user
 */
function saveDraft(userId: string, draft: Draft): void {
  const userDrafts = getUserDrafts(userId);
  const existingIndex = userDrafts.findIndex((d) => d.id === draft.id);

  if (existingIndex >= 0) {
    userDrafts[existingIndex] = draft;
  } else {
    userDrafts.push(draft);
  }

  mockDraftStorage.set(userId, userDrafts);
}

/**
 * Remove expired drafts
 */
function removeExpiredDrafts(userId: string): void {
  const userDrafts = getUserDrafts(userId);
  const now = new Date();
  const validDrafts = userDrafts.filter((draft) => {
    const expiresAt = new Date(draft.expiresAt);
    return expiresAt > now;
  });

  if (validDrafts.length !== userDrafts.length) {
    mockDraftStorage.set(userId, validDrafts);
  }
}

/**
 * POST /api/drafts
 *
 * Save or update a gem creation draft
 *
 * Request body:
 * - data: DraftData - The draft data to save
 *
 * Response:
 * - success: boolean
 * - draftId: string
 * - message?: string
 * - error?: string
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
          message: "You must be signed in to save drafts",
        } as SaveDraftResponse,
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const body: SaveDraftRequest = await request.json();

    // Validate request body
    if (!body.data) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request",
          message: "Draft data is required",
        } as SaveDraftResponse,
        { status: 400 }
      );
    }

    // Remove expired drafts first
    removeExpiredDrafts(userId);

    // Get existing drafts
    const userDrafts = getUserDrafts(userId);

    // Check if we should update existing draft or create new one
    // If there's only one draft, update it. Otherwise create new one.
    let draft: Draft;

    if (userDrafts.length === 1) {
      // Update existing draft
      draft = {
        ...userDrafts[0],
        data: body.data,
        updatedAt: new Date().toISOString(),
      };
    } else {
      // Create new draft
      const now = new Date();
      const expiresAt = new Date(now);
      expiresAt.setDate(expiresAt.getDate() + 30); // Expire in 30 days

      draft = {
        id: generateDraftId(),
        userId,
        data: body.data,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
        expiresAt: expiresAt.toISOString(),
      };
    }

    // Save draft
    saveDraft(userId, draft);

    console.log(`[MOCK] Saved draft: ${draft.id} for user: ${userId}`, {
      step: draft.data.currentStep,
      hasLocation: !!draft.data.location,
      hasDetails: !!draft.data.details,
      hasMedia: !!draft.data.media,
    });

    return NextResponse.json(
      {
        success: true,
        draftId: draft.id,
        message: "Draft saved successfully",
      } as SaveDraftResponse,
      { status: 200 }
    );
  } catch (error) {
    console.error("Error saving draft:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message: "An error occurred while saving the draft",
      } as SaveDraftResponse,
      { status: 500 }
    );
  }
}

/**
 * GET /api/drafts
 *
 * List all non-expired drafts for the authenticated user
 *
 * Response:
 * - success: boolean
 * - drafts: Draft[]
 * - error?: string
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          drafts: [],
          error: "Unauthorized",
        } as ListDraftsResponse,
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Remove expired drafts first
    removeExpiredDrafts(userId);

    // Get user drafts
    const drafts = getUserDrafts(userId);

    // Sort by updatedAt (most recent first)
    const sortedDrafts = drafts.sort((a, b) => {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

    console.log(`[MOCK] Listing ${sortedDrafts.length} drafts for user: ${userId}`);

    return NextResponse.json(
      {
        success: true,
        drafts: sortedDrafts,
      } as ListDraftsResponse,
      { status: 200 }
    );
  } catch (error) {
    console.error("Error listing drafts:", error);
    return NextResponse.json(
      {
        success: false,
        drafts: [],
        error: "Internal server error",
      } as ListDraftsResponse,
      { status: 500 }
    );
  }
}
