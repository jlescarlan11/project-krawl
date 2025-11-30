"use client";

import { useId, type ReactNode } from "react";
import { SignInPrompt } from "@/components/auth";
import { useGuestMode, type GuestSignInOptions } from "@/hooks/useGuestMode";
import { getSignInMessage, type GuestFeatureContext } from "@/lib/guest-mode";

export type ProtectedActionGateRenderProps = {
  isGuest: boolean;
  /**
   * Call this to open the sign-in flow with preserved context.
   */
  requestSignIn: (options?: GuestSignInOptions) => void;
  /**
   * Wrap a callback that should only execute for authenticated users.
   */
  handleProtectedAction: (
    action: () => void,
    options?: GuestSignInOptions
  ) => () => void;
  /**
   * ID to wire to `aria-describedby` for disabled controls.
   */
  promptId: string;
  /**
   * Message explaining why the feature is locked.
   */
  promptMessage: string;
  /**
   * Prefab tooltip element (SignInPrompt tooltip variant).
   */
  Prompt: ReactNode;
};

export interface ProtectedActionGateProps {
  context: GuestFeatureContext;
  /**
   * Render prop that receives helpers for both guest and authenticated states.
   */
  children: (props: ProtectedActionGateRenderProps) => ReactNode;
  /**
   * Optional override for tooltip messaging.
   */
  message?: string;
  /**
   * Optional overrides for sign-in navigation behavior.
   */
  promptOptions?: GuestSignInOptions;
}

/**
 * ProtectedActionGate
 *
 * Centralizes guest-mode handling for protected CTAs. Consumers receive helpers
 * to render custom UI for guest vs authenticated users without re-implementing
 * the sign-in flow wiring every time.
 */
export function ProtectedActionGate({
  context,
  children,
  message,
  promptOptions,
}: ProtectedActionGateProps) {
  const { isGuest: isGuestFromHook, showSignInPrompt } = useGuestMode();
  const promptId = useId();
  const promptMessage = message ?? getSignInMessage(context);
  
  // Store now initializes with optimistic state, so useGuestMode will have correct state immediately
  // No need for local state management - just use the hook directly
  const isGuest = isGuestFromHook;

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

  const tooltip =
    isGuest ? (
      <SignInPrompt
        context={context}
        variant="tooltip"
        id={promptId}
        message={promptMessage}
        className="mt-1 text-xs text-[var(--color-text-secondary)]"
      />
    ) : null;

  return (
    <>
      {children({
        isGuest,
        requestSignIn,
        handleProtectedAction,
        promptId,
        promptMessage,
        Prompt: tooltip,
      })}
    </>
  );
}


