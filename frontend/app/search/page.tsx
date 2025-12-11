"use client";

import { Suspense, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { SearchBar, SearchResults } from "@/components/search";
import { useSearchStore } from "@/stores/search-store";
import { search as performSearch } from "@/lib/api/search";

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
 * - Recent searches
 * - Popular searches
 */
function SearchPageContent() {
  const searchParams = useSearchParams();
  const queryParam = searchParams.get("q") || "";

  const {
    query,
    setQuery,
    results,
    setResults,
    isSearching,
    setIsSearching,
    error,
    setError,
    addRecentSearch,
  } = useSearchStore();

  const abortControllerRef = useRef<AbortController | null>(null);

  // Perform search when query param changes
  useEffect(() => {
    const performSearchFromParams = async () => {
      if (!queryParam || queryParam.trim().length === 0) {
        setResults(null);
        return;
      }

      // Update query in store
      if (query !== queryParam) {
        setQuery(queryParam);
      }

      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller
      abortControllerRef.current = new AbortController();

      try {
        setIsSearching(true);
        setError(null);

        const searchResults = await performSearch(
          queryParam,
          20,
          undefined,
          abortControllerRef.current.signal
        );

        setResults(searchResults);
        addRecentSearch(queryParam);
      } catch (err: any) {
        if (err.name !== "AbortError") {
          console.error("Search failed:", err);
          setError(err.message || "Search failed. Please try again.");
        }
      } finally {
        setIsSearching(false);
      }
    };

    performSearchFromParams();

    // Cleanup
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [queryParam, setQuery, setResults, setIsSearching, setError, addRecentSearch, query]);

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

      {/* Search Results */}
      <SearchResults
        results={results}
        isLoading={isSearching}
        error={error}
        highlightQuery={queryParam}
      />
    </div>
  );
}
