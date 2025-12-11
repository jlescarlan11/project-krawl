/**
 * useKrawlSubmission Hook
 *
 * Handles krawl submission logic including:
 * - API submission
 * - Error handling
 * - Success state management
 * - Draft cleanup
 */

import { useState, useCallback } from "react";
import { createKrawl, type CreateKrawlRequest } from "@/lib/api/krawls";
import { handleApiError, getErrorMessage } from "@/lib/api-error-handler";
import { useToast } from "@/components";
import type { KrawlBasicInfo, SelectedGem } from "@/stores/krawl-creation-store";

export interface SuccessState {
  krawlId: string;
  krawlName: string;
}

export interface UseKrawlSubmissionOptions {
  basicInfo: KrawlBasicInfo | null;
  sortedGems: SelectedGem[];
  currentDraftId: string | null;
  deleteDraftFromBackend: (draftId: string) => Promise<void>;
  isValid: boolean;
}

export interface UseKrawlSubmissionResult {
  isPublishing: boolean;
  submissionError: string | null;
  successState: SuccessState | null;
  handlePublish: () => Promise<void>;
  handleRetry: () => void;
  canPublish: boolean;
}

/**
 * Handle krawl submission with error handling and success state
 *
 * @param options - Submission options including form data and validation
 * @returns Submission state and handlers
 */
export function useKrawlSubmission({
  basicInfo,
  sortedGems,
  currentDraftId,
  deleteDraftFromBackend,
  isValid,
}: UseKrawlSubmissionOptions): UseKrawlSubmissionResult {
  const { error: toastError } = useToast();
  const [isPublishing, setIsPublishing] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [successState, setSuccessState] = useState<SuccessState | null>(null);

  const handlePublish = useCallback(async () => {
    if (!isValid || !basicInfo || sortedGems.length < 2) {
      return;
    }

    setIsPublishing(true);
    setSubmissionError(null);

    try {
      // Ensure coverImage is present (should be validated already)
      if (!basicInfo.coverImage) {
        throw new Error("Cover image is required");
      }

      // Prepare krawl data for API
      const krawlData: CreateKrawlRequest = {
        name: basicInfo.name,
        description: basicInfo.description,
        fullDescription: basicInfo.description, // Use description as full description if not provided
        category: basicInfo.category,
        difficulty: basicInfo.difficulty,
        coverImage: basicInfo.coverImage,
        coverImagePublicId: basicInfo.coverImagePublicId,
        gems: sortedGems.map((sg) => ({
          gemId: sg.gemId,
          sequenceOrder: sg.order + 1, // Backend expects 1-based order
          creatorNote: sg.creatorNote,
          lokalSecret: sg.lokalSecret,
        })),
        tags: [], // Tags can be added later if needed
      };

      console.log("[Krawl Creation] Submitting krawl data:", {
        name: krawlData.name,
        category: krawlData.category,
        gemCount: krawlData.gems.length,
      });

      const createResponse = await createKrawl(krawlData);

      if (createResponse.success && createResponse.krawlId) {
        // Success! Delete current draft if it exists
        if (currentDraftId) {
          try {
            await deleteDraftFromBackend(currentDraftId);
            console.log("[Krawl Creation] Draft deleted after successful krawl creation");
          } catch (draftError) {
            // Log error but don't fail the krawl creation
            console.error(
              "[Krawl Creation] Failed to delete draft after krawl creation:",
              draftError
            );
          }
        }

        // Store krawl name before showing success screen
        const createdKrawlName = basicInfo.name;

        // Show success screen
        // Note: Don't clear form here - let the success screen handle it when user clicks "Create Another"
        setSuccessState({
          krawlId: createResponse.krawlId,
          krawlName: createdKrawlName,
        });
        setIsPublishing(false);
      } else {
        throw new Error(createResponse.message || "Failed to create krawl");
      }
    } catch (error) {
      console.error("[Krawl Creation] Error publishing krawl:", error);

      // Handle error using API error handler
      const apiError = await handleApiError(error);
      let errorMessage = getErrorMessage(apiError);

      // Special handling for authentication errors
      if (error instanceof Error) {
        if (
          error.message.includes("Authentication failed") ||
          error.message.includes("session has expired")
        ) {
          errorMessage =
            "Your session has expired. Please sign out and sign in again to create a krawl.";
        } else if (error.message.includes("permission")) {
          errorMessage =
            "Authentication error. Please try signing out and signing in again.";
        }
      }

      setSubmissionError(errorMessage);
      toastError("Submission Failed", errorMessage);
      setIsPublishing(false);
    }
  }, [
    isValid,
    basicInfo,
    sortedGems,
    currentDraftId,
    deleteDraftFromBackend,
    toastError,
  ]);

  const handleRetry = useCallback(() => {
    setSubmissionError(null);
    handlePublish();
  }, [handlePublish]);

  const canPublish =
    isValid && basicInfo !== null && sortedGems.length >= 2 && !isPublishing;

  return {
    isPublishing,
    submissionError,
    successState,
    handlePublish,
    handleRetry,
    canPublish,
  };
}

