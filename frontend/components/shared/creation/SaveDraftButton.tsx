"use client";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useSaveDraft } from "@/hooks/useSaveDraft";

/**
 * Props for SaveDraftButton component
 */
export interface SaveDraftButtonProps {
  /** Function to save the draft to backend */
  saveDraft: () => Promise<void>;

  /** Current save status */
  status: 'idle' | 'saving' | 'saved' | 'error';

  /** Error message if save failed */
  error: string | null;

  /** Timestamp of last successful save */
  lastSavedAt: string | null;

  /** Duration (ms) to show success message (default: 3000) */
  successDuration?: number;
}

/**
 * SaveDraftButton Component
 *
 * A generic button for manually saving creation drafts to the backend.
 * Supports both Gem and Krawl creation flows.
 *
 * Features:
 * - Manual save on click
 * - Visual status indicators (idle, saving, saved, error)
 * - Last saved timestamp display (in tooltip)
 * - Error message display (in tooltip)
 * - Authentication check (automatically hidden if not authenticated)
 * - Configurable success message duration
 *
 * @example
 * ```tsx
 * <SaveDraftButton
 *   saveDraft={saveDraftToBackend}
 *   status={draftSaveStatus}
 *   error={draftSaveError}
 *   lastSavedAt={lastDraftSavedAt}
 * />
 * ```
 */
export function SaveDraftButton({
  saveDraft,
  status,
  error,
  lastSavedAt,
  successDuration,
}: SaveDraftButtonProps) {
  const draftState = useSaveDraft({
    saveDraft,
    status,
    error,
    lastSavedAt,
    successDuration,
  });

  // Don't show button if not authenticated
  if (!draftState.isAuthenticated) {
    return null;
  }

  return (
    <Button
      variant={draftState.buttonVariant}
      size="lg"
      onClick={draftState.handleSave}
      disabled={draftState.isDisabled}
      className={`flex-1 sm:flex-initial sm:min-w-[120px] ${draftState.buttonClassName}`}
      aria-label="Save draft"
      title={draftState.buttonTitle}
      icon={draftState.showIcon ? <Loader2 className="w-5 h-5 animate-spin" /> : undefined}
      iconPosition="left"
    >
      {draftState.buttonText}
    </Button>
  );
}
