"use client";

import { memo, useMemo, useCallback } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { User } from "lucide-react";
import { useAuthStore } from "@/stores";
import { ROUTES } from "@/lib/routes";
import { NavLink } from "./NavLink";
import { Button } from "@/components";
import { cn } from "@/lib/utils";
import { ProtectedActionGate } from "@/components/guest";
import { Logo } from "@/components/brand";
import { getAvatarUrl } from "@/lib/cloudinary/urls";

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
 * Header component - OPTIMIZED FOR ZERO FLICKER
 *
 * Desktop top navigation bar with logo, main nav links, and user menu.
 * Hidden on mobile (replaced by BottomNav and MobileMenu).
 * 
 * Now uses optimistic rendering to completely eliminate flicker:
 * 1. Immediately reads cached state from localStorage (synchronous)
 * 2. Shows avatar/Sign In based on cached state (no skeleton needed)
 * 3. Updates seamlessly when NextAuth confirms state
 */
export const Header = memo(function Header() {
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

  // Use optimistic state until Zustand hydrates, then use actual state
  // This ensures we show the correct UI immediately without waiting for Zustand
  const currentUser = hasHydrated ? user : optimistic.user;

  // Show loading skeleton only if we're truly loading (should rarely happen now)
  // Optimistic state typically has isLoading: false since we read from localStorage immediately
  const isLoading = hasHydrated ? false : optimistic.isLoading;

  // Determine guest status immediately from optimistic state
  // This bypasses ProtectedActionGate's useGuestMode hook which doesn't use optimistic state
  const isGuest = !currentUser;
  
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
    "inline-flex h-10 w-10 items-center justify-center rounded-full p-0 text-text-primary transition-colors",
    "hover:text-primary-green focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-orange"
  );
  const avatarWrapperClasses =
    "h-full w-full overflow-hidden rounded-full bg-transparent text-text-secondary";
  const avatarImageClasses = "h-full w-full object-cover";

  const guestNavClasses = cn(
    "inline-flex items-center gap-2 px-4 py-2 rounded-lg",
    "text-base font-medium transition-colors",
    "focus:outline-2 focus:outline-accent-orange focus:outline-offset-2",
    "text-text-primary hover:bg-light-green/10 hover:text-primary-green"
  );

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full",
        "bg-bg-white border-b border-[var(--color-border-subtle)]",
        "shadow-[var(--shadow-elevation-1)]",
        "lg:block hidden" // Hidden on mobile, visible on desktop
      )}
    >
      <nav className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href={ROUTES.HOME}
            className="flex items-center gap-2"
            aria-label="Krawl Home"
          >
            <Logo
              variant="full-color"
              size="sm"
              className="h-10 w-auto rounded-full"
            />
            <span className="text-lg font-semibold text-primary-green">
              Krawl
            </span>
          </Link>

          {/* Main Navigation */}
          <div className="flex items-center gap-1">
            <NavLink href={ROUTES.HOME} label="Home" exact />
            <NavLink href={ROUTES.MAP} label="Map" />
            <NavLink href={ROUTES.SEARCH} label="Search" />
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
                  <div className="flex flex-col items-start gap-1">
                    <button
                      type="button"
                      className={guestNavClasses}
                      onClick={() => requestSignIn()}
                      aria-describedby={promptId}
                      title={promptMessage}
                    >
                      <span>Create</span>
                    </button>
                    <span className="sr-only">{Prompt}</span>
                  </div>
                ) : (
                  <NavLink href={ROUTES.GEM_CREATE} label="Create" />
                )
              }
            </ProtectedActionGate>
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-2">
            {isLoading ? (
              // Skeleton loading state - prevents flash on page refresh
              <div
                className={cn(
                  profileChipClasses,
                  "bg-bg-light skeleton-shimmer"
                )}
                aria-label="Loading profile"
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
              >
                Sign In
              </Button>
            ) : (
              <Link
                href={profileHref}
                className={profileChipClasses}
                title={`View ${profileName}`}
                aria-label={`View ${profileName} profile`}
              >
                <span className={avatarWrapperClasses}>
                  {currentUser?.avatar ? (
                    <img
                      src={getAvatarUrl(currentUser.avatar) || currentUser.avatar}
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
      </nav>
    </header>
  );
});

