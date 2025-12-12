/**
 * useInfiniteSearch Hook
 *
 * Manages infinite scroll pagination for search results.
 * Fetches additional pages as the user scrolls and appends them to existing results.
 *
 * @example
 * ```tsx
 * const {
 *   results,
 *   isLoading,
 *   isLoadingMore,
 *   error,
 *   hasMore,
 *   loadMore,
 *   reset
 * } = useInfiniteSearch(query);
 * ```
 */

import { useState, useCallback, useRef, useEffect } from "react";
import { search } from "@/lib/api/search";
import type { SearchResultsResponse, SearchOptions } from "@/lib/api/search";
import { useDebounce } from "./useDebounce";

export interface UseInfiniteSearchOptions {
  /** Search query */
  query: string;

  /** Initial limit per page */
  pageSize?: number;

  /** Search type filter */
  type?: "gems" | "krawls";

  /** Enable/disable auto-fetch on mount */
  enabled?: boolean;
}

export interface UseInfiniteSearchReturn {
  /** Accumulated search results */
  results: SearchResultsResponse | null;

  /** Initial loading state */
  isLoading: boolean;

  /** Loading more results state */
  isLoadingMore: boolean;

  /** Error message */
  error: string | null;

  /** Whether more results are available */
  hasMore: boolean;

  /** Load next page */
  loadMore: () => Promise<void>;

  /** Reset pagination and results */
  reset: () => void;

  /** Current page number (0-indexed) */
  currentPage: number;
}

/**
 * Hook for infinite scroll search results
 */
export function useInfiniteSearch({
  query,
  pageSize = 20,
  type,
  enabled = true,
}: UseInfiniteSearchOptions): UseInfiniteSearchReturn {
  const [results, setResults] = useState<SearchResultsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  // Debounce query to prevent excessive API calls
  const debouncedQuery = useDebounce(query, 100);

  // Track abort controller for cancellation
  const abortControllerRef = useRef<AbortController | null>(null);

  // Track if we're currently fetching to prevent duplicate requests
  const isFetchingRef = useRef(false);

  /**
   * Reset pagination state
   */
  const reset = useCallback(() => {
    setResults(null);
    setCurrentPage(0);
    setHasMore(false);
    setError(null);
    setIsLoading(false);
    setIsLoadingMore(false);
    isFetchingRef.current = false;

    // Cancel any in-flight requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  /**
   * Fetch search results for a specific page
   */
  const fetchPage = useCallback(
    async (pageNumber: number, append: boolean = false) => {
      // Prevent duplicate requests
      if (isFetchingRef.current) {
        return;
      }

      // Don't fetch if query is empty
      if (!debouncedQuery || debouncedQuery.trim().length === 0) {
        setResults(null);
        setHasMore(false);
        return;
      }

      isFetchingRef.current = true;

      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller
      abortControllerRef.current = new AbortController();

      try {
        // Set loading state
        if (append) {
          setIsLoadingMore(true);
        } else {
          setIsLoading(true);
        }
        setError(null);

        const options: SearchOptions = {
          limit: pageSize,
          offset: pageNumber * pageSize,
          type,
        };

        const response = await search(
          debouncedQuery,
          options,
          abortControllerRef.current.signal
        );

        // Update results using functional update to avoid dependency on results
        setResults((prevResults) => {
          if (append && prevResults) {
            // Append new results to existing
            return {
              ...response,
              gems: [...prevResults.gems, ...response.gems],
              krawls: [...prevResults.krawls, ...response.krawls],
              totalResults: response.totalResults,
            };
          } else {
            // Replace with new results
            return response;
          }
        });

        setHasMore(response.hasMore);
        setCurrentPage(pageNumber);
      } catch (err) {
        // Don't set error if request was aborted
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }

        setError(
          err instanceof Error ? err.message : "Failed to fetch search results"
        );
        setHasMore(false);
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
        isFetchingRef.current = false;
      }
    },
    [debouncedQuery, pageSize, type] // Removed 'results' - using functional updates instead
  );

  // Store latest fetchPage function in ref to avoid stale closures
  const fetchPageRef = useRef(fetchPage);
  
  // Keep fetchPageRef up to date
  useEffect(() => {
    fetchPageRef.current = fetchPage;
  }, [fetchPage]);

  /**
   * Load next page of results
   */
  const loadMore = useCallback(async () => {
    if (!hasMore || isLoadingMore || isFetchingRef.current) {
      return;
    }

    await fetchPageRef.current(currentPage + 1, true);
  }, [hasMore, isLoadingMore, currentPage]);

  /**
   * Initial fetch on query change
   */
  useEffect(() => {
    if (!enabled) return;

    // Don't fetch if query is empty
    if (!debouncedQuery || debouncedQuery.trim().length === 0) {
      reset();
      return;
    }

    // Cancel any in-flight requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Reset state when query changes
    reset();

    // Use the ref to call the latest fetchPage function
    // This avoids dependency issues while ensuring we use the latest version
    fetchPageRef.current(0, false);
  }, [debouncedQuery, enabled, type, reset]); // Now we can safely include reset since it's stable

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    results,
    isLoading,
    isLoadingMore,
    error,
    hasMore,
    loadMore,
    reset,
    currentPage,
  };
}
