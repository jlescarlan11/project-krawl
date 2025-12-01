"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import { Search, MapPin, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { CEBU_CITY_CENTER, CEBU_CITY_BOUNDS } from "@/lib/map/constants";
import type { GeocodingFeature, GeocodingResponse } from "./types";

/**
 * Props for AddressSearch component
 */
export interface AddressSearchProps {
  onSelect: (feature: GeocodingFeature) => void;
  placeholder?: string;
  className?: string;
}

/**
 * AddressSearch Component
 *
 * Search input with Mapbox Geocoding API integration.
 * Shows autocomplete results and allows user to select a location.
 */
export function AddressSearch({
  onSelect,
  placeholder = "Search for location...",
  className,
}: AddressSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GeocodingFeature[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  /**
   * Perform geocoding search
   */
  const searchGeocoding = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    setIsSearching(true);
    setError(null);

    try {
      const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
      if (!accessToken) {
        throw new Error("Mapbox access token not configured");
      }

      // Build geocoding URL
      const encodedQuery = encodeURIComponent(searchQuery);
      const proximity = `${CEBU_CITY_CENTER[0]},${CEBU_CITY_CENTER[1]}`;
      const bbox = `${CEBU_CITY_BOUNDS[0][0]},${CEBU_CITY_BOUNDS[0][1]},${CEBU_CITY_BOUNDS[1][0]},${CEBU_CITY_BOUNDS[1][1]}`;

      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedQuery}.json?access_token=${accessToken}&proximity=${proximity}&bbox=${bbox}&limit=5&autocomplete=true`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Geocoding failed: ${response.statusText}`);
      }

      const data: GeocodingResponse = await response.json();

      setResults(data.features);
      setIsOpen(data.features.length > 0);
      setSelectedIndex(-1);
    } catch (err) {
      console.error("Geocoding error:", err);
      setError("Unable to search. Please check your connection.");
      setResults([]);
      setIsOpen(false);
    } finally {
      setIsSearching(false);
    }
  }, []);

  /**
   * Handle input change with debounce
   */
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setQuery(value);

      // Clear previous timeout
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      // Debounce search by 300ms
      searchTimeoutRef.current = setTimeout(() => {
        searchGeocoding(value);
      }, 300);
    },
    [searchGeocoding]
  );

  /**
   * Handle result selection
   */
  const handleSelect = useCallback(
    (feature: GeocodingFeature) => {
      setQuery(feature.place_name);
      setIsOpen(false);
      setResults([]);
      onSelect(feature);
      inputRef.current?.blur();
    },
    [onSelect]
  );

  /**
   * Handle keyboard navigation
   */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isOpen || results.length === 0) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < results.length - 1 ? prev + 1 : prev
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
          break;
        case "Enter":
          e.preventDefault();
          if (selectedIndex >= 0 && selectedIndex < results.length) {
            handleSelect(results[selectedIndex]);
          }
          break;
        case "Escape":
          e.preventDefault();
          setIsOpen(false);
          inputRef.current?.blur();
          break;
      }
    },
    [isOpen, results, selectedIndex, handleSelect]
  );

  /**
   * Clear search
   */
  const handleClear = useCallback(() => {
    setQuery("");
    setResults([]);
    setIsOpen(false);
    setError(null);
    inputRef.current?.focus();
  }, []);

  /**
   * Click outside to close dropdown
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /**
   * Cleanup timeout on unmount
   */
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className={cn("relative w-full", className)} ref={dropdownRef}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none" />
        <Input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn(
            "pl-10 pr-10",
            error && "border-red-500 focus:border-red-500"
          )}
          aria-label="Search for location"
          aria-autocomplete="list"
          aria-controls="search-results"
          aria-expanded={isOpen}
        />
        {/* Loading / Clear Button */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {isSearching ? (
            <Loader2 className="w-4 h-4 text-text-secondary animate-spin" />
          ) : query ? (
            <button
              onClick={handleClear}
              className="text-text-secondary hover:text-text-primary transition-colors"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          ) : null}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <p className="mt-2 text-sm text-red-500" role="alert">
          {error}
        </p>
      )}

      {/* Results Dropdown */}
      {isOpen && results.length > 0 && (
        <div
          id="search-results"
          className={cn(
            "absolute top-full left-0 right-0 mt-2",
            "bg-bg-white border border-border-subtle rounded-lg",
            "shadow-lg",
            "max-h-64 overflow-y-auto",
            "z-50",
            "animate-in fade-in slide-in-from-top-1 duration-200"
          )}
          role="listbox"
        >
          {results.map((feature, index) => (
            <button
              key={feature.id}
              onClick={() => handleSelect(feature)}
              className={cn(
                "w-full px-4 py-3",
                "flex items-start gap-3",
                "text-left",
                "transition-colors",
                "border-b border-border-subtle last:border-b-0",
                selectedIndex === index
                  ? "bg-bg-light"
                  : "hover:bg-bg-light",
                "focus:bg-bg-light focus:outline-none"
              )}
              role="option"
              aria-selected={selectedIndex === index}
            >
              <MapPin className="w-4 h-4 text-primary-green flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary truncate">
                  {feature.text}
                </p>
                <p className="text-xs text-text-secondary truncate">
                  {feature.place_name}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* No Results */}
      {isOpen && results.length === 0 && query && !isSearching && !error && (
        <div
          className={cn(
            "absolute top-full left-0 right-0 mt-2",
            "bg-bg-white border border-border-subtle rounded-lg",
            "shadow-lg",
            "p-4",
            "z-50",
            "animate-in fade-in slide-in-from-top-1 duration-200"
          )}
        >
          <p className="text-sm text-text-secondary text-center">
            No locations found
          </p>
        </div>
      )}
    </div>
  );
}

/**
 * Reverse geocoding function
 * Converts coordinates to address
 */
export async function reverseGeocode(
  coordinates: [number, number]
): Promise<GeocodingFeature | null> {
  try {
    const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
    if (!accessToken) {
      throw new Error("Mapbox access token not configured");
    }

    const [lng, lat] = coordinates;
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${accessToken}&limit=1`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Reverse geocoding failed: ${response.statusText}`);
    }

    const data: GeocodingResponse = await response.json();

    if (data.features && data.features.length > 0) {
      return data.features[0];
    }

    return null;
  } catch (error) {
    console.error("Reverse geocoding error:", error);
    return null;
  }
}
