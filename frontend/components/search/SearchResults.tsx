"use client";

import { AlertCircle, Loader2, Search, SearchX } from "lucide-react";
import { cn } from "@/lib/utils";
import { EmptyState } from "@/components/ui/empty-state";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { GemSearchCard } from "./GemSearchCard";
import { KrawlSearchCard } from "./KrawlSearchCard";
import type { SearchResultsResponse } from "@/lib/api/search";

export interface SearchResultsProps {
  /** Search results */
  results: SearchResultsResponse | null;

  /** Loading state */
  isLoading: boolean;

  /** Error message */
  error: string | null;

  /** Highlight query in results */
  highlightQuery?: string;

  /** Optional className for styling */
  className?: string;
}

/**
 * SearchResults Component
 *
 * Displays search results grouped by type (Gems and Krawls).
 * Shows loading state, empty state, and error state.
 */
export function SearchResults({
  results,
  isLoading,
  error,
  highlightQuery,
  className,
}: SearchResultsProps) {
  // Loading state
  if (isLoading) {
    return (
      <div className={cn("space-y-6", className)}>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-8 h-8 text-primary-green animate-spin" />
          <span className="ml-3 text-text-secondary">Searching...</span>
        </div>
        <LoadingResults />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={cn("py-8", className)}>
        <EmptyState
          icon={<AlertCircle className="w-full h-full" />}
          title="Search failed"
          description={error}
          action={() => window.location.reload()}
          actionLabel="Try again"
        />
      </div>
    );
  }

  // No results yet
  if (!results) {
    return (
      <div className={cn("py-8", className)}>
        <EmptyState
          icon={<Search className="w-full h-full" />}
          title="Start searching"
          description="Enter a search query to find gems and krawls"
        />
      </div>
    );
  }

  // No results found
  if (results.totalResults === 0) {
    return (
      <div className={cn("py-8", className)}>
        <EmptyState
          icon={<SearchX className="w-full h-full" />}
          title="No results found"
          description={`No gems or krawls match "${results.query}"`}
        />
      </div>
    );
  }

  return (
    <div className={cn("space-y-8", className)}>
      {/* Results Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-text-primary">
          Search Results for "{results.query}"
        </h2>
        <span className="text-sm text-text-secondary">
          {results.totalResults} {results.totalResults === 1 ? "result" : "results"}
        </span>
      </div>

      {/* Gems Results */}
      {results.gems.length > 0 && (
        <section>
          <h3 className="text-base font-semibold text-text-primary mb-4">
            Gems ({results.gems.length})
          </h3>
          <div className="space-y-3">
            {results.gems.map((gem) => (
              <GemSearchCard
                key={gem.id}
                gem={gem}
                highlightQuery={highlightQuery || results.query}
              />
            ))}
          </div>
        </section>
      )}

      {/* Krawls Results */}
      {results.krawls.length > 0 && (
        <section>
          <h3 className="text-base font-semibold text-text-primary mb-4">
            Krawls ({results.krawls.length})
          </h3>
          <div className="space-y-3">
            {results.krawls.map((krawl) => (
              <KrawlSearchCard
                key={krawl.id}
                krawl={krawl}
                highlightQuery={highlightQuery || results.query}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

/**
 * Loading skeleton for search results
 */
function LoadingResults() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-white rounded-lg border border-bg-medium p-4"
        >
          <div className="flex gap-4">
            <LoadingSkeleton className="w-24 h-24 rounded-md" />
            <div className="flex-1 space-y-3">
              <LoadingSkeleton className="h-5 w-3/4" />
              <LoadingSkeleton className="h-4 w-full" />
              <LoadingSkeleton className="h-4 w-1/2" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
