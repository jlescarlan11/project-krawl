"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import mapboxgl from 'mapbox-gl';
import { cn } from '@/lib/utils';
import { ANIMATION_DURATIONS, easingFunctions } from '@/lib/map/animationUtils';

/**
 * Geocoding result from Mapbox API
 */
interface GeocodingResult {
  id: string;
  place_name: string;
  center: [number, number]; // [longitude, latitude]
  place_type: string[];
  text: string;
}

/**
 * Gem search result from our API
 */
interface GemSearchResult {
  id: string;
  name: string;
  category: string;
  district: string;
  coordinates: [number, number]; // [longitude, latitude]
  thumbnailUrl?: string;
  rating?: number;
  type: 'gem'; // To distinguish from location results
}

/**
 * Combined search result type
 */
type SearchResult = (GeocodingResult & { type: 'location' }) | GemSearchResult;

/**
 * MapSearchControl Props
 */
export interface MapSearchControlProps {
  map: mapboxgl.Map | null;
  className?: string;
  placeholder?: string;
  onResultSelect?: (result: GeocodingResult) => void;
  onGemSelect?: (gemId: string) => void; // New callback for when a gem is selected
}

/**
 * MapSearchControl Component
 *
 * Provides a search bar with autocomplete for geocoding.
 * Integrates with Mapbox Geocoding API.
 *
 * @example
 * ```tsx
 * <MapSearchControl
 *   map={mapInstance}
 *   placeholder="Search for a location..."
 *   onResultSelect={(result) => console.log('Selected:', result)}
 * />
 * ```
 */
export function MapSearchControl({
  map,
  className,
  placeholder = "Search for a location...",
  onResultSelect,
  onGemSelect,
}: MapSearchControlProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [error, setError] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Search for both gems and locations
   */
  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    setIsLoading(true);
    setError(null);

    try {
      // Search gems and locations in parallel
      const [gemsResponse, locationsResponse] = await Promise.all([
        // Search gems from our API
        fetch(`/api/gems/search?q=${encodeURIComponent(searchQuery)}&limit=3`, {
          signal: abortControllerRef.current.signal,
        }).catch(() => null),

        // Search locations from Mapbox
        (async () => {
          const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
          if (!accessToken) return null;

          const bounds = map?.getBounds();
          const proximity = map?.getCenter();

          const url = new URL(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchQuery)}.json`
          );

          url.searchParams.set('access_token', accessToken);
          url.searchParams.set('autocomplete', 'true');
          url.searchParams.set('limit', '3');

          if (proximity) {
            url.searchParams.set('proximity', `${proximity.lng},${proximity.lat}`);
          }

          if (bounds) {
            const bbox = [
              bounds.getWest(),
              bounds.getSouth(),
              bounds.getEast(),
              bounds.getNorth(),
            ].join(',');
            url.searchParams.set('bbox', bbox);
          }

          return fetch(url.toString(), {
            signal: abortControllerRef.current?.signal,
          }).catch(() => null);
        })(),
      ]);

      // Parse gem results
      let gemResults: GemSearchResult[] = [];
      if (gemsResponse?.ok) {
        const gemsData = await gemsResponse.json();
        gemResults = (gemsData.gems || []).map((gem: any) => ({
          id: gem.id,
          name: gem.name,
          category: gem.category,
          district: gem.district,
          coordinates: gem.coordinates,
          thumbnailUrl: gem.thumbnailUrl,
          rating: gem.rating,
          type: 'gem' as const,
        }));
      }

      // Parse location results
      let locationResults: (GeocodingResult & { type: 'location' })[] = [];
      if (locationsResponse?.ok) {
        const locationsData = await locationsResponse.json();
        locationResults = (locationsData.features || []).map((feature: GeocodingResult) => ({
          ...feature,
          type: 'location' as const,
        }));
      }

      // Combine results: gems first, then locations
      const combinedResults: SearchResult[] = [...gemResults, ...locationResults];

      setResults(combinedResults);
      setIsOpen(combinedResults.length > 0);
      setSelectedIndex(-1);
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }

      console.error('Search error:', err);
      setError(err instanceof Error ? err.message : 'Search failed');
      setResults([]);
      setIsOpen(false);
    } finally {
      setIsLoading(false);
    }
  }, [map]);

  /**
   * Handle input change with debouncing
   */
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    // Clear previous debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Debounce search for 300ms
    debounceTimerRef.current = setTimeout(() => {
      performSearch(value);
    }, 300);
  }, [performSearch]);

  /**
   * Handle result selection
   */
  const handleResultSelect = useCallback((result: SearchResult) => {
    if (result.type === 'gem') {
      // Handle gem selection
      setQuery(result.name);
      setIsOpen(false);
      setResults([]);

      // Fly to gem location
      if (map) {
        map.flyTo({
          center: result.coordinates,
          zoom: 16,
          duration: ANIMATION_DURATIONS.SLOW,
          easing: easingFunctions.easeInOutCubic,
          essential: true,
        });
      }

      // Navigate to gem detail page
      onGemSelect?.(result.id);
    } else {
      // Handle location selection
      setQuery(result.place_name);
      setIsOpen(false);
      setResults([]);

      // Fly to selected location
      if (map) {
        map.flyTo({
          center: result.center,
          zoom: 15,
          duration: ANIMATION_DURATIONS.SLOW,
          easing: easingFunctions.easeInOutCubic,
          essential: true,
        });
      }

      onResultSelect?.(result);
    }
  }, [map, onResultSelect, onGemSelect]);

  /**
   * Handle keyboard navigation
   */
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || results.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev =>
          prev < results.length - 1 ? prev + 1 : prev
        );
        break;

      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;

      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < results.length) {
          handleResultSelect(results[selectedIndex]);
        }
        break;

      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        inputRef.current?.blur();
        break;
    }
  }, [isOpen, results, selectedIndex, handleResultSelect]);

  /**
   * Clear search
   */
  const handleClear = useCallback(() => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
    setError(null);
    inputRef.current?.focus();
  }, []);

  /**
   * Close dropdown when clicking outside
   */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (inputRef.current && !inputRef.current.parentElement?.contains(target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return (
    <div className={cn('relative', className)}>
      {/* Search Input */}
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary">
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Search className="w-4 h-4" />
          )}
        </div>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (results.length > 0) {
              setIsOpen(true);
            }
          }}
          placeholder={placeholder}
          className={cn(
            "w-full pl-10 pr-10 py-3 rounded-xl",
            "bg-white text-text-primary",
            "border-2 border-gray-200",
            "focus:outline-none focus:ring-2 focus:ring-primary-green/50 focus:border-primary-green",
            "placeholder:text-gray-400",
            "shadow-xl",
            "transition-all duration-200",
            "hover:shadow-2xl"
          )}
          aria-label="Search for a location"
          aria-autocomplete="list"
          aria-controls="search-results"
          aria-expanded={isOpen}
        />

        {query && (
          <button
            type="button"
            onClick={handleClear}
            className={cn(
              "absolute right-3 top-1/2 -translate-y-1/2",
              "text-text-secondary hover:text-text-primary",
              "transition-colors"
            )}
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="absolute top-full left-0 right-0 mt-1 p-2 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Results Dropdown */}
      {isOpen && results.length > 0 && (
        <div
          id="search-results"
          role="listbox"
          className={cn(
            "absolute top-full left-0 right-0 mt-2",
            "bg-white border-2 border-gray-200 rounded-xl",
            "shadow-2xl",
            "max-h-80 overflow-y-auto",
            "z-50"
          )}
        >
          {results.map((result, index) => {
            const isGem = result.type === 'gem';
            const isSelected = index === selectedIndex;

            return (
              <button
                key={result.id}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => handleResultSelect(result)}
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleResultSelect(result);
                }}
                onMouseEnter={() => setSelectedIndex(index)}
                className={cn(
                  "w-full px-4 py-3 text-left cursor-pointer",
                  "border-b border-gray-200 last:border-b-0",
                  "transition-colors",
                  isSelected
                    ? "bg-primary-green/10"
                    : "hover:bg-gray-50"
                )}
              >
                <div className="flex items-start gap-3">
                  {/* Icon/Badge */}
                  <div className={cn(
                    "flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm",
                    isGem ? "bg-primary-green/10 text-primary-green" : "bg-gray-100 text-gray-600"
                  )}>
                    {isGem ? '💎' : '📍'}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="font-medium text-sm text-text-primary truncate">
                        {isGem ? result.name : result.text}
                      </div>
                      {isGem && (
                        <span className="flex-shrink-0 text-xs px-2 py-0.5 bg-primary-green/10 text-primary-green rounded-full font-medium">
                          Gem
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-text-secondary mt-0.5 truncate">
                      {isGem ? `${result.category} • ${result.district}` : result.place_name}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* No Results */}
      {isOpen && query && !isLoading && results.length === 0 && !error && (
        <div className="absolute top-full left-0 right-0 mt-1 p-4 bg-bg-white border border-[var(--color-border-subtle)] rounded-lg shadow-lg text-center text-sm text-text-secondary">
          No results found for "{query}"
        </div>
      )}
    </div>
  );
}
