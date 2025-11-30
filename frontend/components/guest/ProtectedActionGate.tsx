"use client";

import { useId, useSyncExternalStore, type ReactNode } from "react";
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
 * Hydration-safe ProtectedActionGate
 *
 * Prevents hydration mismatches by only rendering auth-dependent content after client mount.
 * Uses useSyncExternalStore to ensure server and client render the same initial HTML.
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

  // Use useSyncExternalStore to handle hydration safely
  // Server: always returns false (not guest)
  // Client: returns false on initial render, then actual guest state
  const isMounted = useSyncExternalStore(
    () => () => {}, // subscribe (no-op)
    () => true, // getSnapshot (client)
    () => false // getServerSnapshot (server)
  );

  // Use guest state only after mounting to avoid hydration mismatch
  // On server and initial render, assume not guest (most permissive state)
  const isGuest = isMounted ? isGuestFromStore : false;

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

  return (
    <div className="contents">
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
