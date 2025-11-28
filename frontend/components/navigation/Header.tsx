"use client";

import Link from "next/link";
import { User } from "lucide-react";
import { useAuthUser } from "@/stores";
import { ROUTES } from "@/lib/routes";
import { NavLink } from "./NavLink";
import { Button } from "@/components";
import { cn } from "@/lib/utils";
import { ProtectedActionGate } from "@/components/guest";
import { Logo } from "@/components/brand";

/**
 * Header component
 *
 * Desktop top navigation bar with logo, main nav links, and user menu.
 * Hidden on mobile (replaced by BottomNav and MobileMenu).
 */
export function Header() {
  const user = useAuthUser();
  const profileName = user?.name?.trim() || "Profile";
  const profileHref = ROUTES.USER_PROFILE(user?.id || "");
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
          <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <NavLink href={ROUTES.HOME} label="Home" exact />
                <NavLink href={ROUTES.MAP} label="Map" />
                <NavLink href={ROUTES.SEARCH} label="Search" />
              </div>

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
            <ProtectedActionGate context="profile">
              {({ isGuest, requestSignIn, promptId, promptMessage, Prompt }) =>
                isGuest ? (
                  <div className="flex flex-col items-end gap-1">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => requestSignIn()}
                      aria-describedby={promptId}
                      title={promptMessage}
                      aria-label="Sign in"
                    >
                      Sign In
                    </Button>
                    <div className="w-full text-right">
                      <span className="sr-only">{Prompt}</span>
                    </div>
                  </div>
                ) : (
                  <>
                    <Link
                      href={profileHref}
                      className={profileChipClasses}
                      title={`View ${profileName}`}
                      aria-label={`View ${profileName} profile`}
                    >
                      <span className={avatarWrapperClasses}>
                        {user?.avatar ? (
                          <img
                            src={user.avatar}
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
                  </>
                )
              }
            </ProtectedActionGate>
          </div>
        </div>
      </nav>
    </header>
  );
}

