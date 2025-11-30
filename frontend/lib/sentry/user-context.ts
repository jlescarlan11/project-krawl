"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";
import { useSession } from "next-auth/react";

/**
 * Sets user context in Sentry for error tracking and user identification.
 * 
 * Only includes non-sensitive user data (ID and username). Email and other
 * sensitive information are explicitly excluded for privacy.
 * 
 * @param user - User object from NextAuth session, or `null` to clear user context
 * 
 * @example
 * ```typescript
 * setSentryUser({ id: '123', name: 'John Doe' });
 * // Later, to clear:
 * setSentryUser(null);
 * ```
 */
export function setSentryUser(user: { id: string; name?: string | null } | null) {
  try {
    if (user) {
      Sentry.setUser({
        id: user.id,
        username: user.name || undefined,
        // Don't include email or sensitive data for privacy
      });
    } else {
      Sentry.setUser(null);
    }
  } catch (error) {
    // Log but don't throw - user context is non-critical
    // This prevents Sentry initialization failures from breaking the app
    if (process.env.NODE_ENV === "development") {
      console.warn("[Sentry] Failed to set user context:", error);
    }
  }
}

/**
 * Clears user context in Sentry.
 * 
 * Should be called when user signs out to ensure no user data
 * is associated with errors from subsequent sessions.
 * 
 * @example
 * ```typescript
 * clearSentryUser();
 * ```
 */
export function clearSentryUser() {
  try {
    Sentry.setUser(null);
  } catch (error) {
    // Log but don't throw - user context is non-critical
    if (process.env.NODE_ENV === "development") {
      console.warn("[Sentry] Failed to clear user context:", error);
    }
  }
}

/**
 * React hook to sync NextAuth session with Sentry user context.
 * 
 * Automatically updates Sentry user context when authentication state changes.
 * This hook should be used in the root layout component to ensure user context
 * is always in sync with the authentication state.
 * 
 * Uses NextAuth.js session as the source of truth for user information.
 * 
 * @example
 * ```tsx
 * // In app/layout.tsx
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         <SentryUserContextSync />
 *         {children}
 *       </body>
 *     </html>
 *   );
 * }
 * ```
 */
export function useSentryUserContext() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      setSentryUser({
        id: session.user.id,
        name: session.user.name,
      });
    } else {
      clearSentryUser();
    }
  }, [session, status]);
}

