"use client";

import { useSessionRefresh } from "@/hooks/useSessionRefresh";

/**
 * Session Refresh Provider Component
 * 
 * Wraps the useSessionRefresh hook to automatically refresh sessions
 * before expiration. This component should be placed inside SessionProvider.
 * 
 * @example
 * ```tsx
 * <SessionProvider>
 *   <SessionRefreshProvider>
 *     {children}
 *   </SessionRefreshProvider>
 * </SessionProvider>
 * ```
 */
export function SessionRefreshProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Automatically refresh session before expiration
  useSessionRefresh();

  return <>{children}</>;
}



