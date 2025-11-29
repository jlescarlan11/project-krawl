"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/routes";
import { useIsAuthenticated } from "@/stores/auth-store";

/**
 * Hero Call-to-Action Buttons
 *
 * Conditionally renders CTAs based on authentication state:
 * - Authenticated: "Create Your First Gem", "Start Krawl Mode"
 * - Guest: "Sign In"
 *
 * Always shows "Explore Cebu City" as primary CTA.
 *
 * @example
 * ```tsx
 * <HeroCTAs />
 * ```
 */
export function HeroCTAs() {
  const isAuthenticated = useIsAuthenticated();

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      {/* Primary CTA - Always visible */}
      <Link href={ROUTES.MAP} className="w-full sm:w-auto" aria-label="Explore Cebu City on the map">
        <Button variant="primary" size="lg">
          Explore Cebu City
        </Button>
      </Link>

      {/* Conditional CTAs based on auth state */}
      {isAuthenticated ? (
        <>
          <Link href={ROUTES.GEM_CREATE} className="w-full sm:w-auto" aria-label="Create your first Gem">
            <Button variant="outline" size="lg">
              Create Your First Gem
            </Button>
          </Link>
          <Link href={ROUTES.KRAWLS} className="w-full sm:w-auto" aria-label="Start Krawl Mode">
            <Button variant="outline" size="lg">
              Start Krawl Mode
            </Button>
          </Link>
        </>
      ) : (
        <Link href={ROUTES.SIGN_IN} className="w-full sm:w-auto" aria-label="Sign in to your account">
          <Button variant="outline" size="lg">
            Sign In
          </Button>
        </Link>
      )}
    </div>
  );
}

