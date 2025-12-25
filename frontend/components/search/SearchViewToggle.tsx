"use client";

import { List, MapIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SearchViewToggleProps {
  /** Current view mode */
  value: "list" | "map";

  /** Callback when view changes */
  onChange: (view: "list" | "map") => void;

  /** Optional className for styling */
  className?: string;
}

/**
 * SearchViewToggle Component
 *
 * Toggle button to switch between list and map views for search results.
 *
 * Features:
 * - Two buttons: List and Map with icons
 * - Active state styling with primary-green
 * - Keyboard accessible (Tab, Enter, Space)
 * - Compact, inline design
 *
 * @example
 * ```tsx
 * <SearchViewToggle
 *   value={viewMode}
 *   onChange={setViewMode}
 * />
 * ```
 */
export function SearchViewToggle({
  value,
  onChange,
  className,
}: SearchViewToggleProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-lg bg-bg-medium p-1",
        className
      )}
      role="group"
      aria-label="Search view toggle"
    >
      {/* List View Button */}
      <button
        type="button"
        onClick={() => onChange("list")}
        className={cn(
          "inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all",
          "min-h-[40px] min-w-[40px]",
          "focus:outline-none focus:ring-2 focus:ring-primary-green focus:ring-offset-2",
          value === "list"
            ? "bg-white text-primary-green shadow-sm"
            : "text-text-secondary hover:text-text-primary"
        )}
        aria-pressed={value === "list"}
        aria-label="List view"
      >
        <List className="w-4 h-4" />
        <span>List</span>
      </button>

      {/* Map View Button */}
      <button
        type="button"
        onClick={() => onChange("map")}
        className={cn(
          "inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all",
          "min-h-[40px] min-w-[40px]",
          "focus:outline-none focus:ring-2 focus:ring-primary-green focus:ring-offset-2",
          value === "map"
            ? "bg-white text-primary-green shadow-sm"
            : "text-text-secondary hover:text-text-primary"
        )}
        aria-pressed={value === "map"}
        aria-label="Map view"
      >
        <MapIcon className="w-4 h-4" />
        <span>Map</span>
      </button>
    </div>
  );
}
