"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Search, X, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/useDebounce";
import { useSearchStore } from "@/stores/search-store";
import { autocomplete as fetchAutocomplete, getPopularSearches } from "@/lib/api/search";
import { SearchSuggestions } from "./SearchSuggestions";

export interface SearchBarProps {
  /** Optional placeholder text */
  placeholder?: string;

  /** Optional className for styling */
  className?: string;

  /** Auto-focus on mount */
  autoFocus?: boolean;

  /** Callback when search is performed */
  onSearch?: (query: string) => void;

  /** Show suggestions dropdown */
  showSuggestions?: boolean;
}

/**
 * SearchBar Component
 *
 * Full-featured search bar with:
 * - Debounced autocomplete (300ms)
 * - Recent searches from localStorage
 * - Popular searches from backend
 * - Keyboard navigation (arrow keys, Enter, Escape)
 * - Clear button
 * - Loading states
 *
 * @example
 * ```tsx
 * <SearchBar
 *   placeholder="Search gems and krawls..."
 *   onSearch={(query) => console.log("Searching:", query)}
 * />
 * ```
 */
export function SearchBar({
  placeholder = "Search gems and krawls...",
  className,
  autoFocus = false,
  onSearch,
  showSuggestions = true,
}: SearchBarProps) {
  const router = useRouter();

  // Zustand store
  const {
    query,
    setQuery,
    suggestions,
    setSuggestions,
    recentSearches,
    popularSearches,
    setPopularSearches,
    addRecentSearch,
    isLoadingSuggestions,
    setIsLoadingSuggestions,
  } = useSearchStore();

  // Local state
  const [isFocused, setIsFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Debounced query for autocomplete
  const debouncedQuery = useDebounce(query, 300);

  // Load popular searches on mount
  useEffect(() => {
    const loadPopularSearches = async () => {
      try {
        const response = await getPopularSearches();
        setPopularSearches(response.queries);
      } catch (error) {
        console.error("Failed to load popular searches:", error);
      }
    };

    if (popularSearches.length === 0) {
      loadPopularSearches();
    }
  }, [popularSearches.length, setPopularSearches]);

  // Fetch autocomplete suggestions when debounced query changes
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!debouncedQuery || debouncedQuery.trim().length === 0) {
        setSuggestions([]);
        setIsLoadingSuggestions(false);
        return;
      }

      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller
      abortControllerRef.current = new AbortController();

      try {
        setIsLoadingSuggestions(true);
        const response = await fetchAutocomplete(
          debouncedQuery,
          10,
          abortControllerRef.current.signal
        );
        setSuggestions(response.suggestions);
      } catch (error: any) {
        if (error.name !== "AbortError") {
          console.error("Autocomplete failed:", error);
          setSuggestions([]);
        }
      } finally {
        setIsLoadingSuggestions(false);
      }
    };

    fetchSuggestions();

    // Cleanup
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [debouncedQuery, setSuggestions, setIsLoadingSuggestions]);

  // Handle search
  const handleSearch = useCallback(
    (searchQuery: string) => {
      const trimmed = searchQuery.trim();
      if (!trimmed) return;

      // Add to recent searches
      addRecentSearch(trimmed);

      // Close suggestions
      setIsFocused(false);
      inputRef.current?.blur();

      // Call onSearch callback or navigate to search page
      if (onSearch) {
        onSearch(trimmed);
      } else {
        router.push(`/search?q=${encodeURIComponent(trimmed)}`);
      }
    },
    [addRecentSearch, onSearch, router]
  );

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setSelectedIndex(-1);
  };

  // Handle clear
  const handleClear = () => {
    setQuery("");
    setSuggestions([]);
    inputRef.current?.focus();
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Get all selectable items (suggestions + recent + popular)
    const allItems = [
      ...suggestions,
      ...recentSearches.map((q) => ({ text: q, type: "recent" as const })),
      ...popularSearches.map((q) => ({ text: q, type: "popular" as const })),
    ];

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < allItems.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < allItems.length) {
        const selected = allItems[selectedIndex];
        handleSearch(selected.text);
      } else {
        handleSearch(query);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      setIsFocused(false);
      inputRef.current?.blur();
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (text: string) => {
    setQuery(text);
    handleSearch(text);
  };

  // Show dropdown when focused and has content
  const showDropdown =
    showSuggestions &&
    isFocused &&
    (query.length > 0 || recentSearches.length > 0 || popularSearches.length > 0);

  return (
    <div className={cn("relative w-full", className)}>
      {/* Input Container */}
      <div className="relative">
        {/* Search Icon */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none">
          <Search className="w-5 h-5" />
        </div>

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            // Delay to allow click events on suggestions
            setTimeout(() => setIsFocused(false), 200);
          }}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className={cn(
            "w-full pl-12 pr-12 py-3 rounded-lg text-base text-text-primary",
            "border border-bg-medium",
            "focus:outline-none focus:ring-2 focus:ring-primary-green/20 focus:border-primary-green",
            "placeholder:text-text-secondary/60",
            "transition-all duration-150"
          )}
          aria-label="Search"
          aria-autocomplete="list"
          aria-controls="search-suggestions"
          aria-expanded={showDropdown}
        />

        {/* Loading or Clear Button */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          {isLoadingSuggestions ? (
            <Loader2 className="w-5 h-5 text-text-secondary animate-spin" />
          ) : query.length > 0 ? (
            <button
              onClick={handleClear}
              className="text-text-secondary hover:text-text-primary transition-colors p-2 rounded-md hover:bg-bg-light min-w-[40px] min-h-[40px] flex items-center justify-center"
              aria-label="Clear search"
            >
              <X className="w-5 h-5" />
            </button>
          ) : null}
        </div>
      </div>

      {/* Suggestions Dropdown */}
      {showDropdown && (
        <SearchSuggestions
          query={query}
          suggestions={suggestions}
          recentSearches={recentSearches}
          popularSearches={popularSearches}
          selectedIndex={selectedIndex}
          onSuggestionClick={handleSuggestionClick}
          isLoading={isLoadingSuggestions}
        />
      )}
    </div>
  );
}
