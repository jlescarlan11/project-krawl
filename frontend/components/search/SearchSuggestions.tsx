"use client";

import { Clock, TrendingUp, MapPin, Route } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AutocompleteSuggestion } from "@/lib/api/search";
import { useSearchStore } from "@/stores/search-store";

export interface SearchSuggestionsProps {
  /** Current search query */
  query: string;

  /** Autocomplete suggestions */
  suggestions: AutocompleteSuggestion[];

  /** Recent searches */
  recentSearches: string[];

  /** Popular searches */
  popularSearches: string[];

  /** Currently selected index (for keyboard navigation) */
  selectedIndex: number;

  /** Callback when suggestion is clicked */
  onSuggestionClick: (text: string) => void;

  /** Loading state */
  isLoading?: boolean;
}

/**
 * SearchSuggestions Component
 *
 * Displays autocomplete suggestions, recent searches, and popular searches
 * in a dropdown below the search bar.
 *
 * Supports keyboard navigation and click selection.
 */
export function SearchSuggestions({
  query,
  suggestions,
  recentSearches,
  popularSearches,
  selectedIndex,
  onSuggestionClick,
  isLoading = false,
}: SearchSuggestionsProps) {
  const { clearRecentSearches } = useSearchStore();

  // Filter recent and popular searches if there's a query
  const filteredRecent =
    query.length > 0
      ? recentSearches.filter((q) =>
          q.toLowerCase().includes(query.toLowerCase())
        )
      : recentSearches;

  const filteredPopular =
    query.length > 0
      ? popularSearches.filter((q) =>
          q.toLowerCase().includes(query.toLowerCase())
        )
      : popularSearches;

  // Build combined list for index calculation
  const allItems = [
    ...suggestions,
    ...filteredRecent.map((q) => ({ text: q, type: "recent" as const })),
    ...filteredPopular.map((q) => ({ text: q, type: "popular" as const })),
  ];

  // Show empty state if no suggestions and query is entered
  const showEmptyState =
    query.length > 0 &&
    suggestions.length === 0 &&
    filteredRecent.length === 0 &&
    filteredPopular.length === 0 &&
    !isLoading;

  // Show nothing if no content
  const showNothing =
    query.length === 0 &&
    recentSearches.length === 0 &&
    popularSearches.length === 0;

  if (showNothing) {
    return null;
  }

  return (
    <div
      id="search-suggestions"
      className={cn(
        "absolute top-full left-0 right-0 mt-2",
        "bg-white border border-bg-medium rounded-lg shadow-lg",
        "max-h-[400px] overflow-y-auto",
        "z-50"
      )}
      role="listbox"
    >
      {/* Autocomplete Suggestions */}
      {suggestions.length > 0 && (
        <div className="py-2">
          <div className="px-4 py-2 text-xs font-medium text-text-secondary uppercase">
            Suggestions
          </div>
          {suggestions.map((suggestion, index) => {
            const globalIndex = index;
            const isSelected = globalIndex === selectedIndex;

            return (
              <SuggestionItem
                key={`suggestion-${suggestion.id || index}`}
                text={suggestion.text}
                type={suggestion.type}
                isSelected={isSelected}
                onClick={() => onSuggestionClick(suggestion.text)}
              />
            );
          })}
        </div>
      )}

      {/* Recent Searches */}
      {filteredRecent.length > 0 && (
        <div className="py-2 border-t border-bg-light">
          <div className="px-4 py-2 flex items-center justify-between">
            <span className="text-xs font-medium text-text-secondary uppercase">
              Recent Searches
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                clearRecentSearches();
              }}
              className="text-xs text-primary-green hover:text-primary-green/80 transition-colors"
            >
              Clear
            </button>
          </div>
          {filteredRecent.map((search, index) => {
            const globalIndex = suggestions.length + index;
            const isSelected = globalIndex === selectedIndex;

            return (
              <SuggestionItem
                key={`recent-${index}`}
                text={search}
                type="recent"
                icon={<Clock className="w-4 h-4" />}
                isSelected={isSelected}
                onClick={() => onSuggestionClick(search)}
              />
            );
          })}
        </div>
      )}

      {/* Popular Searches */}
      {filteredPopular.length > 0 && (
        <div className="py-2 border-t border-bg-light">
          <div className="px-4 py-2 text-xs font-medium text-text-secondary uppercase">
            Popular Searches
          </div>
          {filteredPopular.map((search, index) => {
            const globalIndex = suggestions.length + filteredRecent.length + index;
            const isSelected = globalIndex === selectedIndex;

            return (
              <SuggestionItem
                key={`popular-${index}`}
                text={search}
                type="popular"
                icon={<TrendingUp className="w-4 h-4" />}
                isSelected={isSelected}
                onClick={() => onSuggestionClick(search)}
              />
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {showEmptyState && (
        <div className="py-8 px-4 text-center text-text-secondary">
          <p className="text-sm">No results found for "{query}"</p>
          <p className="text-xs mt-1">Try different keywords</p>
        </div>
      )}
    </div>
  );
}

/**
 * Individual suggestion item
 */
function SuggestionItem({
  text,
  type,
  icon,
  isSelected,
  onClick,
}: {
  text: string;
  type: "gem" | "krawl" | "category" | "recent" | "popular";
  icon?: React.ReactNode;
  isSelected: boolean;
  onClick: () => void;
}) {
  // Get icon based on type if not provided
  const defaultIcon = icon || getIconForType(type);

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full px-4 py-2 flex items-center gap-3",
        "text-left text-sm text-text-primary",
        "hover:bg-bg-light transition-colors",
        isSelected && "bg-primary-green/10"
      )}
      role="option"
      aria-selected={isSelected}
    >
      <div className="text-text-secondary flex-shrink-0">{defaultIcon}</div>
      <span className="flex-1 truncate">{text}</span>
      {type !== "recent" && type !== "popular" && (
        <span className="text-xs text-text-tertiary capitalize">{type}</span>
      )}
    </button>
  );
}

/**
 * Get icon based on suggestion type
 */
function getIconForType(type: string) {
  switch (type) {
    case "gem":
      return <MapPin className="w-4 h-4" />;
    case "krawl":
      return <Route className="w-4 h-4" />;
    case "recent":
      return <Clock className="w-4 h-4" />;
    case "popular":
      return <TrendingUp className="w-4 h-4" />;
    default:
      return <MapPin className="w-4 h-4" />;
  }
}
