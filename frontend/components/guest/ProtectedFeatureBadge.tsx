"use client";

import { cn } from "@/lib/utils";
import { useGuestMode } from "@/hooks/useGuestMode";
import {
  getSignInMessage,
  type GuestFeatureContext,
} from "@/lib/guest-mode";
import { SignInPrompt } from "@/components/auth";

export type ProtectedFeatureBadgeVariant = "pill" | "banner";

export interface ProtectedFeatureBadgeProps {
  context: GuestFeatureContext;
  /**
   * Optional copy override. Defaults to the context-specific guest message.
   */
  message?: string;
  className?: string;
  variant?: ProtectedFeatureBadgeVariant;
  /**
   * Show a CTA button (banner variant only).
   */
  showButton?: boolean;
  /**
   * Size of the CTA button if rendered.
   */
  buttonSize?: "sm" | "md" | "lg";
  /**
   * Whether to render even when the user is authenticated.
   */
  showWhenAuthenticated?: boolean;
}

/**
 * ProtectedFeatureBadge
 *
 * Lightweight badge/banner that explains locked functionality and links to the
 * sign-in flow. Defaults to a pill-style badge that fits inline with headings
 * or CTA rows.
 */
export function ProtectedFeatureBadge({
  context,
  message,
  className,
  variant = "pill",
  showButton = true,
  buttonSize = "sm",
  showWhenAuthenticated = false,
}: ProtectedFeatureBadgeProps) {
  const { isGuest } = useGuestMode();

  if (!isGuest && !showWhenAuthenticated) {
    return null;
  }

  const resolvedMessage = message ?? getSignInMessage(context);

  if (variant === "banner") {
    return (
      <div
        className={cn(
          "flex flex-col gap-3 rounded-xl border border-dashed border-primary-green/40 bg-light-green/10 p-4",
          className
        )}
      >
        <div className="text-sm font-medium text-[var(--color-text-primary)]">
          {resolvedMessage}
        </div>
        {showButton && (
          <SignInPrompt
            context={context}
            variant="button"
            size={buttonSize}
            fullWidth
          />
        )}
      </div>
    );
  }

  return (
    <SignInPrompt
      context={context}
      variant="badge"
      message={resolvedMessage}
      className={className}
    />
  );
}


