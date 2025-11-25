"use client";

import { Button } from "@/components/ui/button";
import { LogIn, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { getSignInMessage, type GuestFeatureContext } from "@/lib/guest-mode";
import { useGuestMode } from "@/hooks/useGuestMode";

/**
 * Sign-in prompt variants
 */
export type SignInPromptVariant = "button" | "banner" | "inline" | "tooltip";

/**
 * SignInPrompt component props
 */
export interface SignInPromptProps {
  /**
   * Feature context that requires sign-in
   */
  context: GuestFeatureContext;
  /**
   * Visual variant of the prompt
   */
  variant?: SignInPromptVariant;
  /**
   * Custom message (overrides context-based message)
   */
  message?: string;
  /**
   * Show icon
   */
  showIcon?: boolean;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Button size (for button variant)
   */
  size?: "sm" | "md" | "lg";
  /**
   * Full width button
   */
  fullWidth?: boolean;
  /**
   * Destination path after successful sign-in. Defaults to current path.
   */
  returnUrl?: string;
  /**
   * Callback executed before navigating to sign-in
   */
  onBeforeNavigate?: () => void;
}

/**
 * SignInPrompt Component
 * 
 * Displays a context-aware sign-in prompt that redirects users to sign-in
 * page with appropriate return URL and context.
 * 
 * @example
 * ```tsx
 * // Button variant
 * <SignInPrompt context="vouch" variant="button" />
 * 
 * // Banner variant
 * <SignInPrompt context="create" variant="banner" />
 * 
 * // Inline variant
 * <SignInPrompt context="rate" variant="inline" />
 * ```
 */
export function SignInPrompt({
  context,
  variant = "button",
  returnUrl,
  message,
  showIcon = true,
  className,
  size = "md",
  fullWidth = false,
  onBeforeNavigate,
}: SignInPromptProps) {
  const { navigateToSignIn } = useGuestMode();
  const contextMessage = message || getSignInMessage(context);

  const handleSignIn = () => {
    // Store current context for state preservation
    onBeforeNavigate?.();

    navigateToSignIn(context, {
      redirectTo: returnUrl,
      preserveFilters: !returnUrl,
    });
  };

  // Button variant
  if (variant === "button") {
    return (
      <Button
        variant="primary"
        size={size}
        onClick={handleSignIn}
        icon={showIcon ? <LogIn className="w-4 h-4" /> : undefined}
        iconPosition="left"
        fullWidth={fullWidth}
        className={className}
      >
        {contextMessage}
      </Button>
    );
  }

  // Banner variant
  if (variant === "banner") {
    return (
      <div
        className={cn(
          "rounded-lg border-2 border-primary-green bg-light-green/10 p-4",
          className
        )}
      >
        <div className="flex items-start gap-3">
          {showIcon && (
            <Lock className="w-5 h-5 text-primary-green flex-shrink-0 mt-0.5" />
          )}
          <div className="flex-1">
            <p className="text-sm font-medium text-[var(--color-text-primary)] mb-2">
              {contextMessage}
            </p>
            <Button
              variant="primary"
              size="sm"
              onClick={handleSignIn}
              icon={<LogIn className="w-4 h-4" />}
              iconPosition="left"
            >
              Sign In
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Inline variant
  if (variant === "inline") {
    return (
      <div className={cn("text-center py-4", className)}>
        <p className="text-sm text-[var(--color-text-secondary)] mb-3">
          {contextMessage}
        </p>
        <Button
        <Button
          variant="primary"
          size={size}
          onClick={handleSignIn}
          icon={showIcon ? <LogIn className="w-4 h-4" /> : undefined}
          iconPosition="left"
          fullWidth={fullWidth}
        >
          Sign In
        </Button>
      </div>
    );
  }

  // Tooltip variant (for disabled buttons)
  return (
    <div className={cn("text-xs text-[var(--color-text-secondary)]", className)}>
      {contextMessage}
    </div>
  );
}

