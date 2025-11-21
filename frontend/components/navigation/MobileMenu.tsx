"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, Map, Search, Plus, User, Settings } from "lucide-react";
import { useIsAuthenticated, useAuthUser } from "@/stores";
import { useUIStore } from "@/stores";
import { ROUTES } from "@/lib/routes";
import { NavLink } from "./NavLink";
import { Button } from "@/components";
import { cn } from "@/lib/utils";

/**
 * MobileMenu component
 *
 * Mobile hamburger menu that slides in from the side.
 * Uses uiStore for open/closed state management.
 */
export function MobileMenu() {
  const pathname = usePathname();
  const isAuthenticated = useIsAuthenticated();
  const user = useAuthUser();
  const { sidebars, closeSidebar } = useUIStore();
  const isOpen = sidebars.left;

  // Close menu on route change
  useEffect(() => {
    if (isOpen) {
      closeSidebar("left");
    }
  }, [pathname, isOpen, closeSidebar]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-black/50 z-40",
          "lg:hidden", // Only on mobile
          "transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0"
        )}
        onClick={() => closeSidebar("left")}
        aria-hidden="true"
      />

      {/* Menu Panel */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-full w-64 bg-bg-white z-50",
          "lg:hidden", // Only on mobile
          "transform transition-transform duration-300 ease-in-out",
          "shadow-elevation-4",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border-default">
            <span className="font-bold text-lg text-primary-green">Menu</span>
            <button
              onClick={() => closeSidebar("left")}
              className="p-2 rounded-lg hover:bg-light-green/10"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto p-4">
            <div className="flex flex-col gap-2">
              <NavLink
                href={ROUTES.HOME}
                label="Home"
                onClick={() => closeSidebar("left")}
              />
              <NavLink
                href={ROUTES.MAP}
                label="Map"
                icon={Map}
                onClick={() => closeSidebar("left")}
              />
              <NavLink
                href={ROUTES.SEARCH}
                label="Search"
                icon={Search}
                onClick={() => closeSidebar("left")}
              />

              {isAuthenticated && (
                <>
                  <div className="border-t border-border-default my-2 pt-2">
                    <NavLink
                      href={ROUTES.GEM_CREATE}
                      label="Create Gem"
                      icon={Plus}
                      onClick={() => closeSidebar("left")}
                    />
                    <NavLink
                      href={ROUTES.KRAWL_CREATE}
                      label="Create Krawl"
                      icon={Plus}
                      onClick={() => closeSidebar("left")}
                    />
                  </div>
                </>
              )}
            </div>
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-border-default">
            {isAuthenticated ? (
              <div className="flex flex-col gap-2">
                <Link
                  href={ROUTES.USER_PROFILE(user?.id || "")}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-light-green/10"
                  onClick={() => closeSidebar("left")}
                >
                  <User className="w-5 h-5" />
                  <span>{user?.name || "Profile"}</span>
                </Link>
                <Link
                  href={ROUTES.USER_SETTINGS}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-light-green/10"
                  onClick={() => closeSidebar("left")}
                >
                  <Settings className="w-5 h-5" />
                  <span>Settings</span>
                </Link>
              </div>
            ) : (
              <Link href={ROUTES.SIGN_IN}>
                <Button
                  variant="primary"
                  fullWidth
                  onClick={() => closeSidebar("left")}
                >
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}

