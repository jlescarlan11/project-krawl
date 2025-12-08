"use client";

import { memo, useMemo, useCallback, useSyncExternalStore, useState, useEffect, useRef, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { User, Home, Map, Search } from "lucide-react";
import { useAuthStore } from "@/stores";
import { ROUTES } from "@/lib/routes";
import { NavLink } from "./NavLink";
import { Button } from "@/components";
import { cn } from "@/lib/utils";
import { ProtectedActionGate } from "@/components/guest";
import { Logo } from "@/components/brand";
import { getAvatarUrl } from "@/lib/cloudinary/urls";
import { CreateMenu } from "./CreateMenu";

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
  
  // Track avatar image load errors
  const [avatarError, setAvatarError] = useState(false);
  
  // Reset avatar error when user or avatar changes
  useEffect(() => {
    setAvatarError(false);
  }, [currentUser?.id, currentUser?.avatar]);

  // Tooltip state for logo, profile, and sign in button
  const [logoHovered, setLogoHovered] = useState(false);
  const [profileHovered, setProfileHovered] = useState(false);
  const [signInHovered, setSignInHovered] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [logoTooltipPos, setLogoTooltipPos] = useState({ top: 0, left: 0 });
  const [profileTooltipPos, setProfileTooltipPos] = useState({ top: 0, left: 0 });
  const [signInTooltipPos, setSignInTooltipPos] = useState({ top: 0, left: 0 });
  const logoRef = useRef<HTMLAnchorElement>(null);
  const profileRef = useRef<HTMLElement>(null);
  const signInRef = useRef<HTMLButtonElement>(null);

  // Track mount state for portal
  useEffect(() => {
    setMounted(true);
  }, []);

  // Calculate logo tooltip position
  useLayoutEffect(() => {
    if (logoHovered && logoRef.current) {
      const updatePosition = () => {
        if (logoRef.current) {
          const rect = logoRef.current.getBoundingClientRect();
          const sidebarGap = 16;
          setLogoTooltipPos({
            top: rect.top + rect.height / 2,
            left: rect.right + sidebarGap,
          });
        }
      };
      updatePosition();
      window.addEventListener("scroll", updatePosition, true);
      window.addEventListener("resize", updatePosition);
      return () => {
        window.removeEventListener("scroll", updatePosition, true);
        window.removeEventListener("resize", updatePosition);
      };
    }
  }, [logoHovered]);

  // Calculate profile tooltip position
  useLayoutEffect(() => {
    if (profileHovered && profileRef.current) {
      const updatePosition = () => {
        if (profileRef.current) {
          const rect = profileRef.current.getBoundingClientRect();
          const sidebarGap = 16;
          setProfileTooltipPos({
            top: rect.top + rect.height / 2,
            left: rect.right + sidebarGap,
          });
        }
      };
      updatePosition();
      window.addEventListener("scroll", updatePosition, true);
      window.addEventListener("resize", updatePosition);
      return () => {
        window.removeEventListener("scroll", updatePosition, true);
        window.removeEventListener("resize", updatePosition);
      };
    }
  }, [profileHovered]);

  // Calculate sign in button tooltip position
  useLayoutEffect(() => {
    if (signInHovered && signInRef.current) {
      const updatePosition = () => {
        if (signInRef.current) {
          const rect = signInRef.current.getBoundingClientRect();
          const sidebarGap = 16;
          setSignInTooltipPos({
            top: rect.top + rect.height / 2,
            left: rect.right + sidebarGap,
          });
        }
      };
      updatePosition();
      window.addEventListener("scroll", updatePosition, true);
      window.addEventListener("resize", updatePosition);
      return () => {
        window.removeEventListener("scroll", updatePosition, true);
        window.removeEventListener("resize", updatePosition);
      };
    }
  }, [signInHovered]);


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
            ref={logoRef}
            href={ROUTES.HOME}
            onMouseEnter={() => setLogoHovered(true)}
            onMouseLeave={() => setLogoHovered(false)}
            className={cn(
              "flex items-center justify-center rounded-xl p-2",
              "transition-all duration-200 hover:scale-110 hover:rotate-3",
              "hover:bg-primary-green/10 active:scale-95",
              "focus:outline-2 focus:outline-primary-green focus:outline-offset-2"
            )}
            aria-label="Krawl Home"
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
            <CreateMenu variant="sidebar" />
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
                ref={signInRef}
                variant="primary"
                size="sm"
                onClick={handleSignIn}
                onMouseEnter={() => setSignInHovered(true)}
                onMouseLeave={() => setSignInHovered(false)}
                aria-label="Sign in"
                className="w-11 h-11 p-0 rounded-full shadow-md hover:shadow-lg transition-all duration-200 hover:scale-110 active:scale-95"
              >
                <User className="w-5 h-5" />
              </Button>
            ) : (
              <Link
                ref={profileRef as React.RefObject<HTMLAnchorElement>}
                href={profileHref}
                onMouseEnter={() => setProfileHovered(true)}
                onMouseLeave={() => setProfileHovered(false)}
                className={profileChipClasses}
                aria-label={`View ${profileName} profile`}
              >
                <span className={avatarWrapperClasses}>
                  {currentUser?.avatar && !avatarError ? (
                    <img
                      src={getAvatarUrl(currentUser.avatar) || currentUser.avatar}
                      alt={`${profileName} avatar`}
                      className={`${avatarImageClasses} block`}
                      loading="lazy"
                      onError={() => setAvatarError(true)}
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

      {/* Logo tooltip */}
      {logoHovered && mounted && (
        createPortal(
          <div
            className={cn(
              "fixed z-[1000]",
              "bg-bg-white rounded-lg shadow-elevation-3",
              "border border-[var(--color-border-subtle)]",
              "px-3 py-2",
              "text-sm font-medium text-text-primary",
              "whitespace-nowrap"
            )}
            style={{
              top: `${logoTooltipPos.top}px`,
              left: `${logoTooltipPos.left}px`,
              transform: "translateY(-50%)",
            }}
            role="tooltip"
            aria-hidden="true"
          >
            <div
              className="absolute left-0 top-1/2 -translate-x-full -translate-y-1/2 flex items-center"
              aria-hidden="true"
            >
              <div
                className="w-0 h-0 border-t-[6px] border-b-[6px] border-r-[6px] border-t-transparent border-b-transparent border-r-bg-white"
              />
            </div>
            Krawl Home
          </div>,
          document.body
        )
      )}

      {/* Profile tooltip */}
      {profileHovered && mounted && !isGuest && (
        createPortal(
          <div
            className={cn(
              "fixed z-[1000]",
              "bg-bg-white rounded-lg shadow-elevation-3",
              "border border-[var(--color-border-subtle)]",
              "px-3 py-2",
              "text-sm font-medium text-text-primary",
              "whitespace-nowrap"
            )}
            style={{
              top: `${profileTooltipPos.top}px`,
              left: `${profileTooltipPos.left}px`,
              transform: "translateY(-50%)",
            }}
            role="tooltip"
            aria-hidden="true"
          >
            <div
              className="absolute left-0 top-1/2 -translate-x-full -translate-y-1/2 flex items-center"
              aria-hidden="true"
            >
              <div
                className="w-0 h-0 border-t-[6px] border-b-[6px] border-r-[6px] border-t-transparent border-b-transparent border-r-bg-white"
              />
            </div>
            {`View ${profileName} profile`}
          </div>,
          document.body
        )
      )}

      {/* Sign in button tooltip */}
      {signInHovered && mounted && isGuest && (
        createPortal(
          <div
            className={cn(
              "fixed z-[1000]",
              "bg-bg-white rounded-lg shadow-elevation-3",
              "border border-[var(--color-border-subtle)]",
              "px-3 py-2",
              "text-sm font-medium text-text-primary",
              "whitespace-nowrap"
            )}
            style={{
              top: `${signInTooltipPos.top}px`,
              left: `${signInTooltipPos.left}px`,
              transform: "translateY(-50%)",
            }}
            role="tooltip"
            aria-hidden="true"
          >
            <div
              className="absolute left-0 top-1/2 -translate-x-full -translate-y-1/2 flex items-center"
              aria-hidden="true"
            >
              <div
                className="w-0 h-0 border-t-[6px] border-b-[6px] border-r-[6px] border-t-transparent border-b-transparent border-r-bg-white"
              />
            </div>
            Sign in to access your profile
          </div>,
          document.body
        )
      )}
    </aside>
  );
});

