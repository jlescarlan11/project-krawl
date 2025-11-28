"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Map, Search, Plus, User } from "lucide-react";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { ProtectedActionGate } from "@/components/guest";
import { useAuthUser } from "@/stores";

/**
 * BottomNav component
 *
 * Mobile bottom navigation bar with main navigation items.
 * Always visible on mobile, hidden on desktop.
 */
export function BottomNav() {
  const pathname = usePathname();
  const user = useAuthUser();
  const profileHref = user ? ROUTES.USER_PROFILE(user.id) : "";
  const isProfileActive =
    user && profileHref ? pathname.startsWith(profileHref) : false;
  const isSearchActive = pathname.startsWith(ROUTES.SEARCH);

  const navItems = [
    {
      href: ROUTES.HOME,
      label: "Home",
      icon: Home,
      exact: true,
    },
    {
      href: ROUTES.MAP,
      label: "Map",
      icon: Map,
    },
  ];

  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50",
        "bg-bg-white border-t border-[var(--color-border-subtle)]",
        "shadow-[var(--shadow-elevation-1)]",
        "lg:hidden", // Hidden on desktop
        "pb-safe" // iOS safe area support
      )}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="flex items-center h-16 px-3">
        <div className="flex flex-1 items-center gap-2 h-full">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-1",
                  "flex-1 h-full rounded-lg p-1",
                  "transition-colors",
                  isActive
                    ? "text-primary-green"
                    : "text-text-secondary hover:text-primary-green"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon className="w-6 h-6" aria-hidden="true" />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="px-2">
          <ProtectedActionGate
            context="create"
            promptOptions={{ redirectTo: ROUTES.GEM_CREATE, preserveFilters: false }}
          >
            {({ isGuest, requestSignIn, promptId, promptMessage, Prompt }) =>
              isGuest ? (
                <div className="flex flex-col items-center gap-1">
                  <button
                    type="button"
                    onClick={() => requestSignIn()}
                    aria-describedby={promptId}
                    title={promptMessage}
                    aria-disabled="true"
                    className={cn(
                      "flex flex-col items-center justify-center",
                      "w-14 h-14 rounded-full",
                      "bg-primary-green text-white",
                      "shadow-elevation-2",
                      "transition-all",
                      "opacity-70"
                    )}
                    aria-label="Sign in to create"
                  >
                    <Plus className="w-6 h-6" aria-hidden="true" />
                  </button>
                  <span className="sr-only">{Prompt}</span>
                </div>
              ) : (
                <Link
                  href={ROUTES.GEM_CREATE}
                  className={cn(
                    "flex flex-col items-center justify-center",
                    "w-14 h-14 rounded-full",
                    "bg-primary-green text-white",
                    "shadow-elevation-2 hover:shadow-elevation-3",
                    "transition-all",
                    pathname.startsWith(ROUTES.GEM_CREATE) ||
                      pathname.startsWith(ROUTES.KRAWL_CREATE)
                      ? "scale-110"
                      : ""
                  )}
                  aria-label="Create"
                >
                  <Plus className="w-6 h-6" aria-hidden="true" />
                </Link>
              )
            }
          </ProtectedActionGate>
        </div>

        <div className="flex flex-1 items-center justify-end gap-2 h-full">
          <Link
            href={ROUTES.SEARCH}
            className={cn(
              "flex flex-col items-center justify-center gap-1",
              "w-14 h-full rounded-lg",
              "transition-colors",
              isSearchActive
                ? "text-primary-green"
                : "text-text-secondary hover:text-primary-green"
            )}
            aria-label="Search"
            aria-current={isSearchActive ? "page" : undefined}
          >
            <Search className="w-6 h-6" aria-hidden="true" />
            <span className="text-xs font-medium">Search</span>
          </Link>


          <ProtectedActionGate context="profile">
            {({ isGuest, requestSignIn, promptId, promptMessage, Prompt }) =>
              isGuest ? (
                <div className="flex flex-col items-center gap-1">
                  <button
                    type="button"
                    onClick={() => requestSignIn()}
                    aria-describedby={promptId}
                    title={promptMessage}
                    className={cn(
                      "flex flex-col items-center justify-center gap-1",
                      "w-14 h-full rounded-lg",
                      "transition-colors",
                      "text-text-secondary hover:text-primary-green"
                    )}
                  >
                    <User className="w-6 h-6" aria-hidden="true" />
                    <span className="text-xs font-medium">Profile</span>
                  </button>
                  <span className="sr-only">{Prompt}</span>
                </div>
              ) : (
                <Link
                  href={profileHref}
                  className={cn(
                    "flex flex-col items-center justify-center gap-1",
                    "w-14 h-full rounded-lg",
                    "transition-colors",
                    isProfileActive
                      ? "text-primary-green"
                      : "text-text-secondary hover:text-primary-green"
                  )}
                  aria-label="View profile"
                  aria-current={isProfileActive ? "page" : undefined}
                >
                  <User className="w-6 h-6" aria-hidden="true" />
                  <span className="text-xs font-medium">Profile</span>
                </Link>
              )
            }
          </ProtectedActionGate>
        </div>

      </div>
    </nav>
  );
}

