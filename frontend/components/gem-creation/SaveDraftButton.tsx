"use client";

import { useGemCreationStore, useDraftSaveStatus, useLastDraftSavedAt, useDraftSaveError } from "@/stores/gem-creation-store";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { formatDistanceToNow } from "date-fns";

/**
 * SaveDraftButton Component
 *
 * Button to manually save gem creation draft to backend.
 * Shows save status, last saved timestamp, and error messages.
 *
 * Features:
 * - Manual save on click
 * - Visual status indicators (idle, saving, saved, error)
 * - Last saved timestamp display
 * - Error message display
 * - Authentication check
 */
export function SaveDraftButton() {
  const { data: session } = useSession();
  const saveDraftToBackend = useGemCreationStore((state) => state.saveDraftToBackend);
  const draftSaveStatus = useDraftSaveStatus();
  const lastDraftSavedAt = useLastDraftSavedAt();
  const draftSaveError = useDraftSaveError();
  const [showSavedMessage, setShowSavedMessage] = useState(false);

  // Show "Saved" message for 3 seconds after successful save
  useEffect(() => {
    if (draftSaveStatus === "saved") {
      setShowSavedMessage(true);
      const timer = setTimeout(() => {
        setShowSavedMessage(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [draftSaveStatus]);

  const handleSaveDraft = async () => {
    await saveDraftToBackend();
  };

  // Don't show button if not authenticated
  if (!session?.user) {
    return null;
  }

  // Get button text and styling based on status
  const getButtonContent = () => {
    if (draftSaveStatus === "saving") {
      return (
        <>
          <svg
            className="animate-spin h-4 w-4 mr-2"
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
          Saving...
        </>
      );
    }

    if (showSavedMessage && draftSaveStatus === "saved") {
      return (
        <>
          <svg
            className="h-4 w-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          Draft Saved
        </>
      );
    }

    if (draftSaveStatus === "error") {
      return (
        <>
          <svg
            className="h-4 w-4 mr-2"
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
          Retry Save
        </>
      );
    }

    return (
      <>
        <svg
          className="h-4 w-4 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
          />
        </svg>
        Save Draft
      </>
    );
  };

  const getButtonClassName = () => {
    const baseClasses =
      "flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200";

    if (draftSaveStatus === "saving") {
      return `${baseClasses} bg-blue-500 text-white cursor-wait opacity-75`;
    }

    if (showSavedMessage && draftSaveStatus === "saved") {
      return `${baseClasses} bg-green-500 text-white`;
    }

    if (draftSaveStatus === "error") {
      return `${baseClasses} bg-red-500 text-white hover:bg-red-600`;
    }

    return `${baseClasses} bg-blue-500 text-white hover:bg-blue-600`;
  };

  // Format last saved timestamp
  const getLastSavedText = () => {
    if (!lastDraftSavedAt) return null;

    try {
      const timeAgo = formatDistanceToNow(new Date(lastDraftSavedAt), {
        addSuffix: true,
      });
      return `Last saved ${timeAgo}`;
    } catch {
      return null;
    }
  };

  return (
    <div className="flex flex-col items-start gap-2">
      <button
        onClick={handleSaveDraft}
        disabled={draftSaveStatus === "saving"}
        className={getButtonClassName()}
        aria-label="Save draft"
      >
        {getButtonContent()}
      </button>

      {/* Last saved timestamp */}
      {lastDraftSavedAt && !draftSaveError && (
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {getLastSavedText()}
        </p>
      )}

      {/* Error message */}
      {draftSaveError && (
        <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg max-w-md">
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
          <div className="flex-1">
            <p className="text-sm font-medium text-red-800 dark:text-red-200">
              Failed to save draft
            </p>
            <p className="text-sm text-red-700 dark:text-red-300 mt-1">
              {draftSaveError}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
