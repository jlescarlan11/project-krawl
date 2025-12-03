"use client";

import { useGemCreationStore, useDraftSaveStatus, useLastDraftSavedAt, useDraftSaveError } from "@/stores/gem-creation-store";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

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

  // Get button text based on status
  const getButtonText = () => {
    if (draftSaveStatus === "saving") {
      return "Saving...";
    }

    if (showSavedMessage && draftSaveStatus === "saved") {
      return "Draft Saved";
    }

    if (draftSaveStatus === "error") {
      return "Retry Save";
    }

    return "Save Draft";
  };

  // Get button variant based on status
  const getButtonVariant = (): "primary" | "secondary" | "outline" => {
    if (showSavedMessage && draftSaveStatus === "saved") {
      return "primary"; // Green success state
    }

    if (draftSaveStatus === "error") {
      return "primary"; // Red error state (will be styled with className)
    }

    return "outline"; // Default outline style to match Edit button
  };

  // Format last saved timestamp for tooltip
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

  const buttonTitle = draftSaveError || (lastDraftSavedAt && !draftSaveError ? getLastSavedText() || undefined : undefined);

  return (
    <Button
      variant={getButtonVariant()}
      size="lg"
      onClick={handleSaveDraft}
      disabled={draftSaveStatus === "saving"}
      className={`flex-1 sm:flex-initial sm:min-w-[120px] ${
        showSavedMessage && draftSaveStatus === "saved"
          ? "bg-green-500 hover:bg-green-600 text-white"
          : draftSaveStatus === "error"
          ? "bg-red-500 hover:bg-red-600 text-white"
          : ""
      }`}
      aria-label="Save draft"
      title={buttonTitle || undefined}
      icon={draftSaveStatus === "saving" ? <Loader2 className="w-5 h-5 animate-spin" /> : undefined}
      iconPosition="left"
    >
      {getButtonText()}
    </Button>
  );
}
