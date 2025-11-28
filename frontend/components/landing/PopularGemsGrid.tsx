import { PopularGemCard } from "./PopularGemCard";
import type { PopularGem } from "./types";

interface PopularGemsGridProps {
  gems?: PopularGem[];
  loading?: boolean;
}

const SKELETON_COUNT = 6;

export function PopularGemsGrid({ gems = [], loading = false }: PopularGemsGridProps) {
  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
          <div
            key={`popular-gem-skeleton-${index}`}
            className="h-[360px] rounded-[1.5rem] border border-dashed border-border bg-bg-medium/20"
          >
            <div className="h-full w-full animate-pulse rounded-[1.5rem] bg-gradient-to-r from-bg-medium/40 via-bg-medium/20 to-bg-medium/40" />
          </div>
        ))}
      </div>
    );
  }

  if (!gems.length) {
    return (
      <div className="mx-auto w-full max-w-3xl rounded-[1.5rem] border border-dashed border-border bg-bg-white px-6 py-10 text-center">
        <h3 className="text-xl font-semibold text-text-primary">No popular Gems to show yet</h3>
        <p className="mt-2 text-sm text-text-secondary">
          We’re still collecting stories from the community. Check back soon or explore the latest submissions.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {gems.map((gem) => (
        <PopularGemCard key={gem.id} gem={gem} />
      ))}
    </div>
  );
}


