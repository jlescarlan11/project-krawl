import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { formatDistanceToNow } from "date-fns";

/**
 * Options for the useSaveDraft hook
 */
export interface UseSaveDraftOptions {
  /** Function to save the draft */
  saveDraft: () => Promise<void>;

  /** Current save status */
  status: 'idle' | 'saving' | 'saved' | 'error';

  /** Error message if save failed */
  error: string | null;

  /** Timestamp of last successful save */
  lastSavedAt: string | null;

  /** Duration (ms) to show success message before reverting to default (default: 3000) */
  successDuration?: number;
}

/**
 * Return value from the useSaveDraft hook
 */
export interface UseSaveDraftReturn {
  /** Text to display on the button */
  buttonText: string;

  /** Button variant based on status */
  buttonVariant: 'primary' | 'secondary' | 'outline';

  /** Whether the button should be disabled */
  isDisabled: boolean;

  /** Additional CSS classes for the button */
  buttonClassName: string;

  /** Tooltip text for the button */
  buttonTitle?: string;

  /** Whether to show loading icon */
  showIcon: boolean;

  /** Function to call when save button is clicked */
  handleSave: () => Promise<void>;

  /** Whether the user is authenticated */
  isAuthenticated: boolean;

  /** Whether to show the saved success message */
  showSavedMessage: boolean;
}

/**
 * useSaveDraft Hook
 *
 * Manages the state and behavior for a draft save button.
 * Handles status transitions, success message timeouts, button text/styling,
 * and authentication checks.
 *
 * This hook extracts the common logic from SaveDraftButton components
 * to make it reusable across different entity types (gems, krawls, etc.).
 *
 * @example
 * ```tsx
 * const saveDraftButton = useSaveDraft({
 *   saveDraft: saveDraftToBackend,
 *   status: draftSaveStatus,
 *   error: draftSaveError,
 *   lastSavedAt: lastDraftSavedAt,
 * });
 *
 * if (!saveDraftButton.isAuthenticated) return null;
 *
 * return (
 *   <Button
 *     variant={saveDraftButton.buttonVariant}
 *     onClick={saveDraftButton.handleSave}
 *     disabled={saveDraftButton.isDisabled}
 *     className={saveDraftButton.buttonClassName}
 *     title={saveDraftButton.buttonTitle}
 *   >
 *     {saveDraftButton.buttonText}
 *   </Button>
 * );
 * ```
 */
export function useSaveDraft({
  saveDraft,
  status,
  error,
  lastSavedAt,
  successDuration = 3000,
}: UseSaveDraftOptions): UseSaveDraftReturn {
  const { data: session } = useSession();
  const [showSavedMessage, setShowSavedMessage] = useState(false);

  // Show "Saved" message for configured duration after successful save
  useEffect(() => {
    if (status === "saved") {
      setShowSavedMessage(true);
      const timer = setTimeout(() => {
        setShowSavedMessage(false);
      }, successDuration);
      return () => clearTimeout(timer);
    }
  }, [status, successDuration]);

  const handleSave = async () => {
    await saveDraft();
  };

  // Get button text based on status
  const getButtonText = (): string => {
    if (status === "saving") {
      return "Saving...";
    }

    if (showSavedMessage && status === "saved") {
      return "Draft Saved";
    }

    if (status === "error") {
      return "Retry Save";
    }

    return "Save Draft";
  };

  // Get button variant based on status
  const getButtonVariant = (): "primary" | "secondary" | "outline" => {
    if (showSavedMessage && status === "saved") {
      return "primary"; // Will be styled green with className
    }

    if (status === "error") {
      return "primary"; // Will be styled red with className
    }

    return "outline"; // Default outline style
  };

  // Get additional CSS classes based on status
  const getButtonClassName = (): string => {
    if (showSavedMessage && status === "saved") {
      return "bg-green-500 hover:bg-green-600 text-white";
    }

    if (status === "error") {
      return "bg-red-500 hover:bg-red-600 text-white";
    }

    return "";
  };

  // Format last saved timestamp for tooltip
  const getLastSavedText = (): string | null => {
    if (!lastSavedAt) return null;

    try {
      const timeAgo = formatDistanceToNow(new Date(lastSavedAt), {
        addSuffix: true,
      });
      return `Last saved ${timeAgo}`;
    } catch {
      // Invalid date, return null
      return null;
    }
  };

  // Get tooltip text (error message takes priority over last saved time)
  const getButtonTitle = (): string | undefined => {
    if (error) return error;
    if (lastSavedAt && !error) {
      const lastSavedText = getLastSavedText();
      return lastSavedText || undefined;
    }
    return undefined;
  };

  return {
    buttonText: getButtonText(),
    buttonVariant: getButtonVariant(),
    isDisabled: status === "saving",
    buttonClassName: getButtonClassName(),
    buttonTitle: getButtonTitle(),
    showIcon: status === "saving",
    handleSave,
    isAuthenticated: !!session?.user,
    showSavedMessage,
  };
}
