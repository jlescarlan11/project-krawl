"use client";

import { useId, type ReactNode } from "react";
import { SignInPrompt } from "@/components/auth";
import { useGuestMode, type GuestSignInOptions } from "@/hooks/useGuestMode";
import { getSignInMessage, type GuestFeatureContext } from "@/lib/guest-mode";

export type ProtectedActionGateRenderProps = {
  isGuest: boolean;
  requestSignIn: (options?: GuestSignInOptions) => void;
  handleProtectedAction: (
    action: () => void,
    options?: GuestSignInOptions
  ) => () => void;
  promptId: string;
  promptMessage: string;
  Prompt: ReactNode;
};

export interface ProtectedActionGateProps {
  context: GuestFeatureContext;
  children: (props: ProtectedActionGateRenderProps) => ReactNode;
  message?: string;
  promptOptions?: GuestSignInOptions;
}

/**
 * Clean, hydration-safe ProtectedActionGate
 */
export function ProtectedActionGate({
  context,
  children,
  message,
  promptOptions,
}: ProtectedActionGateProps) {
  const { isGuest: isGuestFromStore, showSignInPrompt } = useGuestMode();
  const promptId = useId();
  const promptMessage = message ?? getSignInMessage(context);

  const isGuest = isGuestFromStore;

  const requestSignIn = (options?: GuestSignInOptions) => {
    showSignInPrompt(context, { ...promptOptions, ...options });
  };

  const handleProtectedAction =
    (action: () => void, options?: GuestSignInOptions) =>
    () => {
      if (isGuest) {
        requestSignIn(options);
        return;
      }
      action();
    };

  const tooltip = isGuest ? (
    <SignInPrompt
      context={context}
      variant="tooltip"
      id={promptId}
      message={promptMessage}
      className="mt-1 text-xs text-[var(--color-text-secondary)]"
    />
  ) : null;

  /**
   * Hydration-safe wrapper:
   *
   * - <div className="contents"> does not affect layout
   * - suppressHydrationWarning prevents SSR/CSR mismatch errors
   */
  return (
    <div className="contents" suppressHydrationWarning>
      {children({
        isGuest,
        requestSignIn,
        handleProtectedAction,
        promptId,
        promptMessage,
        Prompt: tooltip,
      })}
    </div>
  );
}
