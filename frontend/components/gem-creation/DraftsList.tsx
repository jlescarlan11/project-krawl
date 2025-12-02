"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { listDrafts, deleteDraft as deleteDraftApi } from "@/lib/api/drafts";
import { useGemCreationStore } from "@/stores/gem-creation-store";
import type { Draft } from "@/lib/types/draft";
import { formatDistanceToNow, format } from "date-fns";

/**
 * DraftsList Component
 *
 * Displays a list of saved gem creation drafts for the user.
 * Allows resuming, viewing details, and deleting drafts.
 *
 * Features:
 * - List all user drafts with preview info
 * - Resume draft (load into form and navigate to creation page)
 * - Delete draft with confirmation
 * - Shows last updated timestamp
 * - Shows draft progress (current step)
 * - Empty state handling
 * - Loading state
 * - Error handling
 */
export function DraftsList() {
  const { data: session } = useSession();
  const router = useRouter();
  const loadDraftFromBackend = useGemCreationStore((state) => state.loadDraftFromBackend);
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  // Load drafts on mount
  useEffect(() => {
    if (session?.user) {
      loadDrafts();
    }
  }, [session]);

  const loadDrafts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await listDrafts();

      if (response.success) {
        setDrafts(response.drafts);
      } else {
        setError(response.error || "Failed to load drafts");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load drafts");
    } finally {
      setLoading(false);
    }
  };

  const handleResumeDraft = async (draftId: string) => {
    try {
      setLoadingId(draftId);
      await loadDraftFromBackend(draftId);
      // Navigate to gem creation page
      router.push("/gems/create");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load draft");
    } finally {
      setLoadingId(null);
    }
  };

  const handleDeleteDraft = async (draftId: string) => {
    // Confirm deletion
    if (!confirm("Are you sure you want to delete this draft? This action cannot be undone.")) {
      return;
    }

    try {
      setDeletingId(draftId);
      await deleteDraftApi(draftId);
      // Reload drafts list
      await loadDrafts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete draft");
    } finally {
      setDeletingId(null);
    }
  };

  // Get step name
  const getStepName = (step: number): string => {
    const stepNames = ["Location", "Basic Info", "Media Upload", "Additional Details"];
    return stepNames[step] || "Unknown";
  };

  // Get draft preview text
  const getDraftPreview = (draft: Draft): string => {
    if (draft.data.details?.name) {
      return draft.data.details.name;
    }
    if (draft.data.location?.address) {
      const addressParts = draft.data.location.address.split(",");
      return addressParts[0] || "Untitled Draft";
    }
    return "Untitled Draft";
  };

  // Check if draft is expiring soon (within 7 days)
  const isExpiringSoon = (expiresAt: string): boolean => {
    const expiryDate = new Date(expiresAt);
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
    return expiryDate <= sevenDaysFromNow;
  };

  if (!session?.user) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 dark:text-gray-400">
          Please sign in to view your drafts.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <svg
          className="animate-spin h-8 w-8 text-blue-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
        <div className="flex items-start gap-3">
          <svg
            className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <p className="font-medium text-red-800 dark:text-red-200">Error loading drafts</p>
            <p className="text-sm text-red-700 dark:text-red-300 mt-1">{error}</p>
            <button
              onClick={loadDrafts}
              className="mt-2 text-sm text-red-600 dark:text-red-400 hover:underline"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (drafts.length === 0) {
    return (
      <div className="text-center py-12">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
          No drafts
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Your saved gem creation drafts will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Saved Drafts ({drafts.length})
        </h2>
        <button
          onClick={loadDrafts}
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          aria-label="Refresh drafts list"
        >
          Refresh
        </button>
      </div>

      <div className="space-y-3">
        {drafts.map((draft) => {
          const isDeleting = deletingId === draft.id;
          const isLoading = loadingId === draft.id;
          const expiringSoon = isExpiringSoon(draft.expiresAt);

          return (
            <div
              key={draft.id}
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  {/* Draft title */}
                  <h3 className="font-medium text-gray-900 dark:text-gray-100 truncate">
                    {getDraftPreview(draft)}
                  </h3>

                  {/* Step progress */}
                  <div className="flex items-center gap-2 mt-1">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200">
                      Step {draft.data.currentStep + 1}: {getStepName(draft.data.currentStep)}
                    </span>
                  </div>

                  {/* Timestamps */}
                  <div className="mt-2 text-sm text-gray-500 dark:text-gray-400 space-y-1">
                    <p>
                      Last updated{" "}
                      {formatDistanceToNow(new Date(draft.updatedAt), { addSuffix: true })}
                    </p>
                    {expiringSoon && (
                      <p className="text-orange-600 dark:text-orange-400">
                        Expires {format(new Date(draft.expiresAt), "MMM d, yyyy")}
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleResumeDraft(draft.id)}
                    disabled={isLoading || isDeleting}
                    className="px-3 py-1.5 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                  >
                    {isLoading ? (
                      <>
                        <svg
                          className="animate-spin h-4 w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Loading...
                      </>
                    ) : (
                      "Resume"
                    )}
                  </button>
                  <button
                    onClick={() => handleDeleteDraft(draft.id)}
                    disabled={isLoading || isDeleting}
                    className="px-3 py-1.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
