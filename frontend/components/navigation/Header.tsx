"use client";

import Link from "next/link";
import { Map, Search, Plus, User, Settings } from "lucide-react";
import { useIsAuthenticated, useAuthUser } from "@/stores";
import { ROUTES } from "@/lib/routes";
import { NavLink } from "./NavLink";
import { Button } from "@/components";
import { cn } from "@/lib/utils";
import { useGuestMode } from "@/hooks/useGuestMode";

/**
 * Header component
 *
 * Desktop top navigation bar with logo, main nav links, and user menu.
 * Hidden on mobile (replaced by BottomNav and MobileMenu).
 */
export function Header() {
  const isAuthenticated = useIsAuthenticated();
  const user = useAuthUser();
  const { navigateToSignIn } = useGuestMode();

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
        "bg-bg-white border-b border-border-default",
        "lg:block hidden" // Hidden on mobile, visible on desktop
      )}
    >
      <nav className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href={ROUTES.HOME}
            className="flex items-center gap-2 font-bold text-xl text-primary-green"
            aria-label="Krawl Home"
          >
            <span>Krawl</span>
          </Link>

          {/* Main Navigation */}
          <div className="flex items-center gap-1">
            <NavLink href={ROUTES.MAP} label="Map" icon={Map} />
            <NavLink href={ROUTES.SEARCH} label="Search" icon={Search} />

            {isAuthenticated ? (
              <NavLink href={ROUTES.GEM_CREATE} label="Create" icon={Plus} />
            ) : (
              <button
                type="button"
                className={guestNavClasses}
                onClick={() =>
                  navigateToSignIn("create", {
                    redirectTo: ROUTES.GEM_CREATE,
                    preserveFilters: false,
                  })
                }
                aria-label="Sign in to create"
              >
                <Plus className="w-5 h-5" aria-hidden="true" />
                <span>Create</span>
              </button>
            )}
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <Link href={ROUTES.USER_PROFILE(user?.id || "")}>
                  <Button variant="text" size="sm" icon={<User />}>
                    {user?.name || "Profile"}
                  </Button>
                </Link>
                <Link href={ROUTES.USER_SETTINGS}>
                  <Button
                    variant="text"
                    size="sm"
                    icon={<Settings />}
                    aria-label="Settings"
                  />
                </Link>
              </>
            ) : (
              <Button
                variant="primary"
                size="sm"
                onClick={() =>
                  navigateToSignIn(undefined, {
                    preserveFilters: true,
                    preserveScroll: false,
                  })
                }
                aria-label="Sign in"
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

