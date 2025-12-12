"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, MapPin, Route, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatStatValue } from "@/lib/format";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";

export interface SearchResultsHeaderProps {
  /** Search query text */
  query: string;

  /** Total number of results (gems + krawls) */
  totalResults: number;

  /** Number of gem results */
  gemsCount: number;

  /** Number of krawl results */
  krawlsCount: number;

  /** Loading state */
  isLoading?: boolean;

  /** Optional className for styling */
  className?: string;
}

/**
 * SearchResultsHeader Component
 *
 * Displays the search result count in a prominent, accessible way.
 * Features:
 * - Large formatted count display
 * - Optional breakdown by type (Gems/Krawls)
 * - Loading skeleton state
 * - Full accessibility support
 */
export function SearchResultsHeader({
  query,
  totalResults,
  gemsCount,
  krawlsCount,
  isLoading = false,
  className,
}: SearchResultsHeaderProps) {
  const [showBreakdown, setShowBreakdown] = useState(false);

  // Format the result count for display
  const formattedCount = totalResults < 1000
    ? totalResults.toString()
    : formatStatValue(totalResults);

  // Singular/plural handling
  const resultText = totalResults === 1 ? "result" : "results";

  // Accessibility label
  const ariaLabel = `Found ${totalResults} ${resultText}: ${gemsCount} ${
    gemsCount === 1 ? "gem" : "gems"
  } and ${krawlsCount} ${krawlsCount === 1 ? "krawl" : "krawls"}`;

  if (isLoading) {
    return <SearchResultsHeaderSkeleton className={className} />;
  }

  return (
    <section
      className={cn(
        "bg-bg-white rounded-xl border border-bg-medium p-6 shadow-sm",
        className
      )}
      role="status"
      aria-live="polite"
      aria-label={ariaLabel}
    >
      {/* Query Text */}
      <div className="flex items-center gap-2 mb-3">
        <Search className="w-4 h-4 text-text-tertiary" aria-hidden="true" />
        <h2 className="text-base font-medium text-text-secondary">
          Search Results for <span className="text-text-primary">"{query}"</span>
        </h2>
      </div>

      {/* Count Display */}
      <div className="flex items-baseline gap-2 mb-2">
        <p className="text-2xl font-semibold text-text-primary">
          {formattedCount}
        </p>
        <p className="text-base text-text-secondary">{resultText} found</p>
      </div>

      {/* Breakdown Section */}
      <div className="mt-4">
        {/* Breakdown Toggle Button */}
        <button
          onClick={() => setShowBreakdown(!showBreakdown)}
          className={cn(
            "flex items-center gap-2 text-sm font-medium transition-colors",
            "hover:text-primary-green focus:outline-none focus:ring-2 focus:ring-primary-green focus:ring-offset-2 rounded-md px-2 py-1 -ml-2",
            showBreakdown ? "text-primary-green" : "text-text-tertiary"
          )}
          aria-expanded={showBreakdown}
          aria-controls="result-breakdown"
        >
          {showBreakdown ? (
            <>
              <ChevronUp className="w-4 h-4" aria-hidden="true" />
              <span>Hide breakdown</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" aria-hidden="true" />
              <span>Show breakdown</span>
            </>
          )}
        </button>

        {/* Breakdown Content */}
        {showBreakdown && (
          <div
            id="result-breakdown"
            className="mt-3 flex flex-wrap items-center gap-4 text-sm"
          >
            {/* Gems Count */}
            <div className="flex items-center gap-2">
              <MapPin
                className="w-4 h-4 text-primary-green"
                aria-hidden="true"
              />
              <span className="font-medium text-text-primary">
                {gemsCount}
              </span>
              <span className="text-text-secondary">
                {gemsCount === 1 ? "Gem" : "Gems"}
              </span>
            </div>

            {/* Separator */}
            <span className="text-text-tertiary" aria-hidden="true">
              •
            </span>

            {/* Krawls Count */}
            <div className="flex items-center gap-2">
              <Route
                className="w-4 h-4 text-accent-orange"
                aria-hidden="true"
              />
              <span className="font-medium text-text-primary">
                {krawlsCount}
              </span>
              <span className="text-text-secondary">
                {krawlsCount === 1 ? "Krawl" : "Krawls"}
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/**
 * SearchResultsHeaderSkeleton Component
 *
 * Loading skeleton for the SearchResultsHeader while search is in progress.
 */
export function SearchResultsHeaderSkeleton({
  className,
}: {
  className?: string;
}) {
  return (
    <div
      className={cn(
        "bg-bg-white rounded-xl border border-bg-medium p-6 shadow-sm",
        "animate-pulse",
        className
      )}
      role="status"
      aria-label="Loading search results"
      aria-busy="true"
    >
      {/* Query Text Skeleton */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-4 h-4 bg-bg-light rounded" />
        <LoadingSkeleton className="h-4 w-48" />
      </div>

      {/* Count Display Skeleton */}
      <div className="flex items-baseline gap-2 mb-2">
        <LoadingSkeleton className="h-8 w-20" />
        <LoadingSkeleton className="h-5 w-24" />
      </div>

      {/* Breakdown Toggle Skeleton */}
      <div className="mt-4">
        <LoadingSkeleton className="h-6 w-32" />
      </div>
    </div>
  );
}
