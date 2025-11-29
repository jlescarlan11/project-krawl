import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/routes";
import { PopularGemsGrid } from "./PopularGemsGrid";
import type { PopularGem } from "./types";

interface PopularGemsSectionProps {
  gems?: PopularGem[];
  loading?: boolean;
}

export function PopularGemsSection({ gems = [], loading = false }: PopularGemsSectionProps) {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 text-center sm:text-left">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-text-tertiary/70">Local Favorites</p>
        <div className="space-y-3">
          <h2 className="text-3xl font-semibold text-text-primary sm:text-4xl">Popular Gems</h2>
          <p className="text-base text-text-secondary sm:w-3/4">
            Discover the community-endorsed spots that Cebuanos can’t stop talking about. These Gems are updated regularly
            so you always have somewhere new to explore.
          </p>
        </div>
      </div>

      <PopularGemsGrid gems={gems} loading={loading} />

      <div className="flex justify-center sm:justify-end">
        <Link href={ROUTES.GEMS}>
          <Button variant="outline" size="md">
            Browse All Gems
          </Button>
        </Link>
      </div>
    </div>
  );
}


