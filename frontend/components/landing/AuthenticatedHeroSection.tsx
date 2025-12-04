"use client";

import Link from "next/link";
import { Container, Section } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";
import type { User } from "@/stores/auth-store";

interface AuthenticatedHeroSectionProps {
  user: User;
}

/**
 * Authenticated Hero Section
 * 
 * Displays personalized greeting and creation CTAs for authenticated users.
 * Replaces the standard HeroSection when user is logged in.
 * 
 * @example
 * ```tsx
 * <AuthenticatedHeroSection user={user} />
 * ```
 */
export function AuthenticatedHeroSection({ user }: AuthenticatedHeroSectionProps) {
  const displayName = user.name?.trim() || "there";

  return (
    <Section
      spacing="xl"
      background="light"
      className={cn(
        "relative overflow-hidden bg-gradient-to-b from-white via-[#f6fbf5] to-white",
        "lg:py-20 lg:px-16"
      )}
    >
      <div className="pointer-events-none absolute -left-20 top-0 h-72 w-72 rounded-full bg-gradient-to-br from-primary-green/30 to-transparent blur-3xl" />
      <Container size="2xl" className="relative z-10">
        <div className="space-y-8">
          <p className="text-sm font-semibold uppercase tracking-[0.4em] text-accent-orange/80">
            Welcome Back
          </p>
          <h1 className="text-4xl font-semibold leading-tight text-text-primary sm:text-5xl lg:text-6xl">
            Welcome back, {displayName}!
          </h1>
          <p className="text-lg leading-relaxed text-text-secondary lg:text-xl">
            Continue your journey mapping Filipino culture in Cebu. Create new Gems, explore Krawls, and share your discoveries with the community.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href={ROUTES.GEM_CREATE} className="w-full sm:w-auto" aria-label="Create a new Gem">
              <Button variant="primary" size="lg" fullWidth>
                Create Gem
              </Button>
            </Link>
            <Link href={ROUTES.KRAWL_CREATE} className="w-full sm:w-auto" aria-label="Create a new Krawl">
              <Button variant="outline" size="lg" fullWidth>
                Create Krawl
              </Button>
            </Link>
            <Link href={ROUTES.MAP} className="w-full sm:w-auto" aria-label="Explore Cebu City on the map">
              <Button variant="outline" size="lg" fullWidth>
                Explore Map
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </Section>
  );
}










