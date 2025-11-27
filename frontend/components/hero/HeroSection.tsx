import Link from "next/link";
import { Button } from "@/components";
import { Container, Section } from "@/components/layout";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";

import { HeroVisual } from "./HeroVisual";

export function HeroSection() {
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
        <div className="flex flex-col gap-12 lg:grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center">
          <div className="space-y-8">
            <p className="text-sm font-semibold uppercase tracking-[0.4em] text-accent-orange/80">
              Krawl · Cebu City
            </p>
            <h1 className="text-4xl font-semibold leading-tight text-text-primary sm:text-5xl lg:text-6xl">
              The Living Map of Filipino Culture
            </h1>
            <p className="text-lg leading-relaxed text-text-secondary lg:text-xl">
              Discover, document, and share the stories, food spots, and traditions that define
              Cebu—every Gem is a memory, every Krawl is a shared adventure.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href={ROUTES.MAP} className="w-full sm:w-auto">
                <Button variant="primary" size="lg" fullWidth>
                  Explore Cebu City
                </Button>
              </Link>
              <Link href={ROUTES.SIGN_IN} className="w-full sm:w-auto">
                <Button variant="outline" size="lg" fullWidth>
                  Sign In
                </Button>
              </Link>
            </div>
            <p className="text-sm text-text-tertiary">
              Build your own Gem, follow curated Krawls, and see how the community grows with every
              story shared.
            </p>
          </div>
          <HeroVisual />
        </div>
      </Container>
    </Section>
  );
}

