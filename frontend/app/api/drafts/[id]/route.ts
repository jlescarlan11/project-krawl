/**
 * Individual Draft API Route Handler
 *
 * Handles:
 * - GET: Load specific draft
 * - DELETE: Delete specific draft
 *
 * TODO: Replace with actual backend API call when backend is ready
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/nextauth";
import type {
  Draft,
  LoadDraftResponse,
  DeleteDraftResponse,
} from "@/lib/types/draft";

// Mock in-memory storage (replace with database in production)
// This should be the same storage as in /api/drafts/route.ts
// In a real implementation, this would be a shared database connection
const mockDraftStorage = new Map<string, Draft[]>();

/**
 * Get drafts for a user
 */
function getUserDrafts(userId: string): Draft[] {
  return mockDraftStorage.get(userId) || [];
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
 * Find a specific draft by ID
 */
function findDraft(userId: string, draftId: string): Draft | undefined {
  const userDrafts = getUserDrafts(userId);
  return userDrafts.find((d) => d.id === draftId);
}

/**
 * Delete a specific draft by ID
 */
function deleteDraft(userId: string, draftId: string): boolean {
  const userDrafts = getUserDrafts(userId);
  const filteredDrafts = userDrafts.filter((d) => d.id !== draftId);

  if (filteredDrafts.length !== userDrafts.length) {
    mockDraftStorage.set(userId, filteredDrafts);
    return true;
  }

  return false;
}

/**
 * GET /api/drafts/[id]
 *
 * Load a specific draft by ID
 *
 * Response:
 * - success: boolean
 * - draft?: Draft
 * - error?: string
 * - message?: string
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
          message: "You must be signed in to load drafts",
        } as LoadDraftResponse,
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const { id: draftId } = await params;

    // Remove expired drafts first
    removeExpiredDrafts(userId);

    // Find the draft
    const draft = findDraft(userId, draftId);

    if (!draft) {
      return NextResponse.json(
        {
          success: false,
          error: "Not found",
          message: "Draft not found or has expired",
        } as LoadDraftResponse,
        { status: 404 }
      );
    }

    // Check if draft is expired (extra safety check)
    const expiresAt = new Date(draft.expiresAt);
    if (expiresAt <= new Date()) {
      // Delete expired draft
      deleteDraft(userId, draftId);

      return NextResponse.json(
        {
          success: false,
          error: "Expired",
          message: "This draft has expired",
        } as LoadDraftResponse,
        { status: 410 }
      );
    }

    console.log(`[MOCK] Loaded draft: ${draftId} for user: ${userId}`);

    return NextResponse.json(
      {
        success: true,
        draft,
      } as LoadDraftResponse,
      { status: 200 }
    );
  } catch (error) {
    console.error("Error loading draft:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message: "An error occurred while loading the draft",
      } as LoadDraftResponse,
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/drafts/[id]
 *
 * Delete a specific draft by ID
 *
 * Response:
 * - success: boolean
 * - message?: string
 * - error?: string
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
          message: "You must be signed in to delete drafts",
        } as DeleteDraftResponse,
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const { id: draftId } = await params;

    // Delete the draft
    const deleted = deleteDraft(userId, draftId);

    if (!deleted) {
      return NextResponse.json(
        {
          success: false,
          error: "Not found",
          message: "Draft not found",
        } as DeleteDraftResponse,
        { status: 404 }
      );
    }

    console.log(`[MOCK] Deleted draft: ${draftId} for user: ${userId}`);

    return NextResponse.json(
      {
        success: true,
        message: "Draft deleted successfully",
      } as DeleteDraftResponse,
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting draft:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message: "An error occurred while deleting the draft",
      } as DeleteDraftResponse,
      { status: 500 }
    );
  }
}
