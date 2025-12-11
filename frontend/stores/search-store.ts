"use client";

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type {
  SearchResultsResponse,
  AutocompleteSuggestion,
} from "@/lib/api/search";

/**
 * Search Store State
 */
interface SearchState {
  /** Current search query */
  query: string;

  /** Search results from last search */
  results: SearchResultsResponse | null;

  /** Autocomplete suggestions for current query */
  suggestions: AutocompleteSuggestion[];

  /** Recent search queries (stored in localStorage) */
  recentSearches: string[];

  /** Popular search queries (fetched from backend) */
  popularSearches: string[];

  /** Loading state for search */
  isSearching: boolean;

  /** Loading state for autocomplete */
  isLoadingSuggestions: boolean;

  /** Error message if search fails */
  error: string | null;
}

/**
 * Search Store Actions
 */
interface SearchActions {
  /** Set current search query */
  setQuery: (query: string) => void;

  /** Set search results */
  setResults: (results: SearchResultsResponse | null) => void;

  /** Set autocomplete suggestions */
  setSuggestions: (suggestions: AutocompleteSuggestion[]) => void;

  /** Set recent searches */
  setRecentSearches: (searches: string[]) => void;

  /** Add a search to recent searches */
  addRecentSearch: (query: string) => void;

  /** Clear all recent searches */
  clearRecentSearches: () => void;

  /** Set popular searches */
  setPopularSearches: (searches: string[]) => void;

  /** Set searching state */
  setIsSearching: (isSearching: boolean) => void;

  /** Set loading suggestions state */
  setIsLoadingSuggestions: (isLoading: boolean) => void;

  /** Set error */
  setError: (error: string | null) => void;

  /** Reset all state */
  reset: () => void;
}

/**
 * Combined Search Store Type
 */
type SearchStore = SearchState & SearchActions;

/**
 * Default state
 */
const defaultState: SearchState = {
  query: "",
  results: null,
  suggestions: [],
  recentSearches: [],
  popularSearches: [],
  isSearching: false,
  isLoadingSuggestions: false,
  error: null,
};

/**
 * Load recent searches from localStorage
 */
const loadRecentSearches = (): string[] => {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem("krawl:recent-searches");
    if (stored) {
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : [];
    }
  } catch (error) {
    console.error("Failed to load recent searches:", error);
  }

  return [];
};

/**
 * Save recent searches to localStorage
 */
const saveRecentSearches = (searches: string[]) => {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem("krawl:recent-searches", JSON.stringify(searches));
  } catch (error) {
    console.error("Failed to save recent searches:", error);
  }
};

/**
 * Search Store Hook
 *
 * Manages search state including query, results, autocomplete suggestions,
 * recent searches (localStorage), and popular searches (backend).
 *
 * @example
 * ```tsx
 * const { query, setQuery, results, addRecentSearch } = useSearchStore();
 *
 * // Use selectors for optimized re-renders
 * const results = useSearchResults();
 * const suggestions = useSearchSuggestions();
 * ```
 */
export const useSearchStore = create<SearchStore>()(
  devtools(
    (set, get) => ({
      ...defaultState,
      recentSearches: loadRecentSearches(),

      setQuery: (query) => set({ query }),

      setResults: (results) => set({ results, error: null }),

      setSuggestions: (suggestions) => set({ suggestions }),

      setRecentSearches: (searches) => {
        set({ recentSearches: searches });
        saveRecentSearches(searches);
      },

      addRecentSearch: (query) => {
        const trimmed = query.trim();
        if (!trimmed) return;

        const recent = get().recentSearches;

        // Remove duplicates and add to front
        const filtered = recent.filter((q) => q !== trimmed);
        const updated = [trimmed, ...filtered].slice(0, 10); // Keep max 10

        set({ recentSearches: updated });
        saveRecentSearches(updated);
      },

      clearRecentSearches: () => {
        set({ recentSearches: [] });
        if (typeof window !== "undefined") {
          localStorage.removeItem("krawl:recent-searches");
        }
      },

      setPopularSearches: (searches) => set({ popularSearches: searches }),

      setIsSearching: (isSearching) => set({ isSearching }),

      setIsLoadingSuggestions: (isLoadingSuggestions) =>
        set({ isLoadingSuggestions }),

      setError: (error) => set({ error, results: null }),

      reset: () =>
        set({
          ...defaultState,
          recentSearches: get().recentSearches, // Keep recent searches
          popularSearches: get().popularSearches, // Keep popular searches
        }),
    }),
    { name: "SearchStore" }
  )
);

/**
 * Selector: Get current search query
 */
export const useSearchQuery = () => useSearchStore((state) => state.query);

/**
 * Selector: Get search results
 */
export const useSearchResults = () => useSearchStore((state) => state.results);

/**
 * Selector: Get autocomplete suggestions
 */
export const useSearchSuggestions = () =>
  useSearchStore((state) => state.suggestions);

/**
 * Selector: Get recent searches
 */
export const useRecentSearches = () =>
  useSearchStore((state) => state.recentSearches);

/**
 * Selector: Get popular searches
 */
export const usePopularSearches = () =>
  useSearchStore((state) => state.popularSearches);

/**
 * Selector: Get searching state
 */
export const useIsSearching = () =>
  useSearchStore((state) => state.isSearching);

/**
 * Selector: Get loading suggestions state
 */
export const useIsLoadingSuggestions = () =>
  useSearchStore((state) => state.isLoadingSuggestions);

/**
 * Selector: Get error
 */
export const useSearchError = () => useSearchStore((state) => state.error);
