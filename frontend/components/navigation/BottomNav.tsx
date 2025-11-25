"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Map, Search, Plus, User } from "lucide-react";
import { useIsAuthenticated } from "@/stores";
import { useUIStore } from "@/stores";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { useGuestMode } from "@/hooks/useGuestMode";

/**
 * BottomNav component
 *
 * Mobile bottom navigation bar with main navigation items.
 * Always visible on mobile, hidden on desktop.
 */
export function BottomNav() {
  const pathname = usePathname();
  const isAuthenticated = useIsAuthenticated();
  const { openSidebar } = useUIStore();
  const { navigateToSignIn } = useGuestMode();

  const navItems = [
    {
      href: ROUTES.MAP,
      label: "Map",
      icon: Map,
    },
    {
      href: ROUTES.SEARCH,
      label: "Search",
      icon: Search,
    },
  ];

  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50",
        "bg-bg-white border-t border-border-default",
        "lg:hidden", // Hidden on desktop
        "pb-safe" // iOS safe area support
      )}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1",
                "flex-1 h-full rounded-lg",
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

        {/* Create FAB (if authenticated) */}
        {isAuthenticated ? (
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
        ) : (
          <button
            type="button"
            onClick={() =>
              navigateToSignIn("create", {
                redirectTo: ROUTES.GEM_CREATE,
                preserveFilters: false,
              })
            }
            className={cn(
              "flex flex-col items-center justify-center",
              "w-14 h-14 rounded-full",
              "bg-primary-green text-white",
              "shadow-elevation-2 hover:shadow-elevation-3",
              "transition-all"
            )}
            aria-label="Sign in to create"
          >
            <Plus className="w-6 h-6" aria-hidden="true" />
          </button>
        )}

        {/* Profile / Menu */}
        <button
          onClick={() => openSidebar("left")}
          className={cn(
            "flex flex-col items-center justify-center gap-1",
            "flex-1 h-full rounded-lg",
            "transition-colors",
            "text-text-secondary hover:text-primary-green"
          )}
          aria-label="Open menu"
        >
          <User className="w-6 h-6" aria-hidden="true" />
          <span className="text-xs font-medium">Menu</span>
        </button>
      </div>
    </nav>
  );
}

