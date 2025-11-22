"use client";

import { useSentryUserContext } from "@/lib/sentry/user-context";

/**
 * SentryUserContextSync component
 *
 * Client-side component that syncs the auth store with Sentry user context.
 * This component should be placed in the root layout to automatically
 * update Sentry user context when authentication state changes.
 *
 * This is a separate component from the hook to ensure it only runs on the client.
 */
export function SentryUserContextSync() {
  useSentryUserContext();
  return null;
}

