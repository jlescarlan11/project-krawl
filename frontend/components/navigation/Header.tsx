"use client";

import Link from "next/link";
import { Map, Search, Plus, User, Settings } from "lucide-react";
import { useIsAuthenticated, useAuthUser } from "@/stores";
import { ROUTES } from "@/lib/routes";
import { NavLink } from "./NavLink";
import { Button } from "@/components";
import { cn } from "@/lib/utils";

/**
 * Header component
 *
 * Desktop top navigation bar with logo, main nav links, and user menu.
 * Hidden on mobile (replaced by BottomNav and MobileMenu).
 */
export function Header() {
  const isAuthenticated = useIsAuthenticated();
  const user = useAuthUser();

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

            {isAuthenticated && (
              <NavLink href={ROUTES.GEM_CREATE} label="Create" icon={Plus} />
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
              <Link href={ROUTES.SIGN_IN}>
                <Button variant="primary" size="sm">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

