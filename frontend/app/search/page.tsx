"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { SearchBar, SearchResults } from "@/components/search";
import { SearchViewToggle } from "@/components/search/SearchViewToggle";
import { useSearchStore } from "@/stores/search-store";
import { useInfiniteSearch } from "@/hooks/useInfiniteSearch";

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-text-primary mb-2">
              Search & Discovery
            </h1>
            <p className="text-text-secondary">Loading search...</p>
          </div>
        </div>
      }
    >
      <SearchPageContent />
    </Suspense>
  );
}

/**
 * Search Page
 *
 * Full-featured search page with:
 * - Search bar with autocomplete
 * - Search results for Gems and Krawls
 * - URL parameter support (?q=query)
 * - Infinite scroll pagination
 * - List and Map views
 * - Recent searches
 */
function SearchPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryParam = searchParams.get("q") || "";
  const viewParam = searchParams.get("view") as "list" | "map" | null;

  const { setQuery, addRecentSearch, viewMode, setViewMode } = useSearchStore();

  // Use infinite search hook
  const {
    results,
    isLoading,
    isLoadingMore,
    error,
    hasMore,
    loadMore,
  } = useInfiniteSearch({
    query: queryParam,
    pageSize: 20,
    enabled: true,
  });

  // Sync view mode from URL parameter
  useEffect(() => {
    if (viewParam && (viewParam === "list" || viewParam === "map")) {
      if (viewMode !== viewParam) {
        setViewMode(viewParam);
      }
    }
  }, [viewParam, viewMode, setViewMode]);

  // Update query in store and add to recent searches when results are loaded
  useEffect(() => {
    if (queryParam && queryParam.trim().length > 0) {
      setQuery(queryParam);
      if (results && results.totalResults > 0) {
        addRecentSearch(queryParam);
      }
    }
  }, [queryParam, results, setQuery, addRecentSearch]);

  // Handle view mode change and update URL
  const handleViewModeChange = (newView: "list" | "map") => {
    setViewMode(newView);

    // Update URL parameter
    const params = new URLSearchParams(searchParams.toString());
    params.set("view", newView);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary mb-2">
          Search & Discovery
        </h1>
        <p className="text-text-secondary">
          Find amazing gems and krawls in Cebu City
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <SearchBar autoFocus={!queryParam} />
      </div>

      {/* View Toggle - Only show when there are results */}
      {results && results.totalResults > 0 && (
        <div className="mb-6 flex justify-end">
          <SearchViewToggle value={viewMode} onChange={handleViewModeChange} />
        </div>
      )}

      {/* Search Results */}
      <SearchResults
        results={results}
        isLoading={isLoading}
        error={error}
        highlightQuery={queryParam}
        hasMore={hasMore}
        isLoadingMore={isLoadingMore}
        onLoadMore={loadMore}
      />
    </div>
  );
}
