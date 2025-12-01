"use client";

import { memo, useMemo, useCallback, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { User, Home, Map, Search, Plus } from "lucide-react";
import { useAuthStore } from "@/stores";
import { ROUTES } from "@/lib/routes";
import { NavLink } from "./NavLink";
import { Button } from "@/components";
import { cn } from "@/lib/utils";
import { ProtectedActionGate } from "@/components/guest";
import { Logo } from "@/components/brand";

/**
 * Get cached auth from localStorage synchronously - OPTIMIZATION
 * This runs synchronously during render to prevent any flash
 * Returns null on server to match initial client render
 */
function useOptimisticAuth() {
  return useMemo(() => {
    // Return null on server to ensure hydration match
    if (typeof window === "undefined") {
      return { user: null, isLoading: false };
    }

    try {
      const stored = localStorage.getItem("krawl:auth:v1");
      if (!stored) {
        return { user: null, isLoading: false };
      }

      const parsed = JSON.parse(stored);
      const user = parsed.state?.user;
      const session = parsed.state?.session;

      if (user && session?.expiresAt) {
        const expiresDate = new Date(session.expiresAt);
        if (!isNaN(expiresDate.getTime()) && expiresDate > new Date()) {
          return { user, isLoading: false };
        }
      }

      return { user: null, isLoading: false };
    } catch {
      return { user: null, isLoading: false };
    }
  }, []); // Only compute once on mount
}

/**
 * Sidebar component - OPTIMIZED FOR ZERO FLICKER WITH HYDRATION SAFETY
 *
 * Desktop left sidebar navigation with logo, main nav links, and user menu.
 * Hidden on mobile (replaced by BottomNav).
 * Fixed in collapsed (icon-only) state with tooltips for all icons.
 *
 * Now uses optimistic rendering to completely eliminate flicker:
 * 1. Immediately reads cached state from localStorage (synchronous)
 * 2. Shows avatar/Sign In based on cached state (no skeleton needed)
 * 3. Updates seamlessly when NextAuth confirms state
 *
 * HYDRATION SAFETY:
 * Uses useSyncExternalStore to ensure server and client render the same initial HTML.
 * Server always renders as "not mounted" state, client renders actual user state after mount.
 */
export const Sidebar = memo(function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  // Get optimistic state first (synchronous, no delay)
  // Reads from localStorage immediately on first render to prevent flicker
  // Returns user data if available, or { user: null, isLoading: false } if not authenticated
  const optimistic = useOptimisticAuth();

  // Then get actual state (may be delayed)
  const user = useAuthStore((state) => state.user);
  const hasHydrated = useAuthStore((state) => state._hasHydrated);
  // Note: We don't use useSession() here anymore - optimistic state is sufficient
  // The session will sync via useSessionRefresh hook in the background

  // Use useSyncExternalStore to handle hydration safely
  // Server: always returns false (not mounted)
  // Client: returns false on initial render, then true after mount
  const isMounted = useSyncExternalStore(
    () => () => {}, // subscribe (no-op)
    () => true, // getSnapshot (client)
    () => false // getServerSnapshot (server)
  );

  // Use optimistic state until Zustand hydrates, then use actual state
  // This ensures we show the correct UI immediately without waiting for Zustand
  // On server and initial client render, use null to match ProtectedActionGate behavior
  const currentUser = isMounted ? (hasHydrated ? user : optimistic.user) : null;

  // Show loading skeleton only if we're truly loading (should rarely happen now)
  // Optimistic state typically has isLoading: false since we read from localStorage immediately
  const isLoading = isMounted ? (hasHydrated ? false : optimistic.isLoading) : false;

  // Determine guest status - must match ProtectedActionGate's behavior
  // On server and initial render: assume not guest (false)
  // After mount: use actual user state
  const isGuest = isMounted ? !currentUser : false;
  
  // Handle sign-in navigation (simplified version of showSignInPrompt)
  const handleSignIn = useCallback(() => {
    const signInUrl = new URL(ROUTES.SIGN_IN, window.location.origin);
    signInUrl.searchParams.set("returnUrl", pathname);
    signInUrl.searchParams.set("context", "profile");
    router.push(signInUrl.toString());
  }, [router, pathname]);

  const profileName = currentUser?.name?.trim() || "Profile";
  const profileHref = ROUTES.USER_PROFILE(currentUser?.id || "");
  const profileChipClasses = cn(
    "flex items-center justify-center rounded-full p-0 h-11 w-11 text-text-primary",
    "transition-all duration-200 hover:scale-110 hover:shadow-lg active:scale-95",
    "ring-2 ring-transparent hover:ring-primary-green/20",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-green"
  );
  const avatarWrapperClasses =
    "h-full w-full overflow-hidden rounded-full bg-gradient-to-br from-primary-green/10 to-light-green/10 text-text-secondary";
  const avatarImageClasses = "h-full w-full object-cover";

  const guestNavClasses = cn(
    "flex items-center justify-center px-3 py-3 rounded-xl",
    "text-base font-medium transition-all duration-200",
    "focus:outline-2 focus:outline-accent-orange focus:outline-offset-2",
    "text-text-primary hover:bg-primary-green/10 hover:text-primary-green hover:scale-105 active:scale-95"
  );

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-50 h-screen w-20",
        "bg-white",
        "border-r border-gray-200",
        "shadow-sm",
        "lg:block hidden" // Hidden on mobile, visible on desktop
      )}
      aria-label="Main navigation"
    >
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex items-center justify-center border-b border-[var(--color-border-subtle)] p-4">
          <Link
            href={ROUTES.HOME}
            className={cn(
              "flex items-center justify-center rounded-xl p-2",
              "transition-all duration-200 hover:scale-110 hover:rotate-3",
              "hover:bg-primary-green/10 active:scale-95",
              "focus:outline-2 focus:outline-primary-green focus:outline-offset-2"
            )}
            aria-label="Krawl Home"
            title="Krawl Home"
          >
            <Logo
              variant="full-color"
              size="sm"
              className="h-9 w-9 rounded-full shadow-sm"
            />
          </Link>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-3">
          <div className="flex flex-col gap-2">
            <NavLink 
              href={ROUTES.HOME} 
              label="Home" 
              icon={Home}
              exact
              hideLabel={true}
              className="w-full justify-center"
            />
            <NavLink 
              href={ROUTES.MAP} 
              label="Map" 
              icon={Map}
              hideLabel={true}
              className="w-full justify-center"
            />
            <NavLink 
              href={ROUTES.SEARCH} 
              label="Search" 
              icon={Search}
              hideLabel={true}
              className="w-full justify-center"
            />
            <ProtectedActionGate
              context="create"
              message="Sign in to unlock creator tools"
              promptOptions={{
                redirectTo: ROUTES.GEM_CREATE,
                preserveFilters: false,
              }}
            >
              {({ isGuest, requestSignIn, promptId, promptMessage, Prompt }) =>
                isGuest ? (
                  <>
                    <button
                      type="button"
                      className={guestNavClasses}
                      onClick={() => requestSignIn()}
                      aria-describedby={promptId}
                      title={promptMessage}
                    >
                      <Plus className="w-5 h-5 shrink-0" />
                    </button>
                    <span className="sr-only">{Prompt}</span>
                  </>
                ) : (
                  <NavLink
                    href={ROUTES.GEM_CREATE}
                    label="Create"
                    icon={Plus}
                    hideLabel={true}
                    className="w-full justify-center"
                  />
                )
              }
            </ProtectedActionGate>
          </div>
        </nav>

        {/* User Menu */}
        <div className="border-t border-border-subtle px-4 py-6 mt-auto">
          <div className="flex items-center justify-center">
            {isLoading ? (
              // Skeleton loading state - prevents flash on page refresh
              <div
                className={cn(
                  profileChipClasses,
                  "bg-bg-light skeleton-shimmer"
                )}
                aria-label="Loading profile"
                title="Loading profile"
              >
                <span className={avatarWrapperClasses}>
                  <User className="h-5 w-5 text-text-tertiary opacity-60" />
                </span>
              </div>
            ) : isGuest ? (
              <Button
                variant="primary"
                size="sm"
                onClick={handleSignIn}
                aria-label="Sign in"
                title="Sign in to access your profile"
                className="w-11 h-11 p-0 rounded-full shadow-md hover:shadow-lg transition-all duration-200 hover:scale-110 active:scale-95"
              >
                <User className="w-5 h-5" />
              </Button>
            ) : (
              <Link
                href={profileHref}
                className={profileChipClasses}
                title={`View ${profileName} profile`}
                aria-label={`View ${profileName} profile`}
              >
                <span className={avatarWrapperClasses}>
                  {currentUser?.avatar ? (
                    <img
                      src={currentUser.avatar}
                      alt={`${profileName} avatar`}
                      className={`${avatarImageClasses} block`}
                      loading="lazy"
                    />
                  ) : (
                    <User className="h-5 w-5" />
                  )}
                </span>
                <span className="sr-only">{profileName}</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
});

