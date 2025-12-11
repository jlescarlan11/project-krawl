"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin, Star, ThumbsUp } from "lucide-react";
import { cn } from "@/lib/utils";
import type { GemSearchResult } from "@/lib/api/search";

export interface GemSearchCardProps {
  /** Gem search result data */
  gem: GemSearchResult;

  /** Optional className for styling */
  className?: string;

  /** Highlight query in text */
  highlightQuery?: string;
}

/**
 * GemSearchCard Component
 *
 * Displays a gem search result card with thumbnail, name, description,
 * category, district, rating, and vouch count.
 */
export function GemSearchCard({
  gem,
  className,
  highlightQuery,
}: GemSearchCardProps) {
  return (
    <Link
      href={`/gems/${gem.id}`}
      className={cn(
        "block bg-white rounded-lg border border-bg-medium overflow-hidden",
        "hover:shadow-md hover:border-primary-green/30 transition-all duration-200",
        "group",
        className
      )}
    >
      <div className="flex gap-4 p-4">
        {/* Thumbnail */}
        <div className="flex-shrink-0 w-24 h-24 bg-bg-light rounded-md overflow-hidden">
          {gem.thumbnailUrl ? (
            <Image
              src={gem.thumbnailUrl}
              alt={gem.name}
              width={96}
              height={96}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-text-tertiary">
              <MapPin className="w-8 h-8" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title and Category */}
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="text-base font-semibold text-text-primary line-clamp-1 group-hover:text-primary-green transition-colors">
              {highlightQuery ? highlightText(gem.name, highlightQuery) : gem.name}
            </h3>
            <span className="flex-shrink-0 text-xs px-2 py-1 bg-primary-green/10 text-primary-green rounded-full">
              {gem.category}
            </span>
          </div>

          {/* Description */}
          <p className="text-sm text-text-secondary line-clamp-2 mb-2">
            {highlightQuery
              ? highlightText(gem.shortDescription, highlightQuery)
              : gem.shortDescription}
          </p>

          {/* Meta Info */}
          <div className="flex items-center gap-4 text-xs text-text-tertiary">
            {/* District */}
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>{gem.district}</span>
            </div>

            {/* Rating */}
            {gem.averageRating > 0 && (
              <div className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                <span>{gem.averageRating.toFixed(1)}</span>
              </div>
            )}

            {/* Vouches */}
            {gem.vouchCount > 0 && (
              <div className="flex items-center gap-1">
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>{gem.vouchCount}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

/**
 * Highlight matching text in query
 */
function highlightText(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text;

  const regex = new RegExp(`(${escapeRegExp(query)})`, "gi");
  const parts = text.split(regex);

  return parts.map((part, index) =>
    regex.test(part) ? (
      <mark key={index} className="bg-yellow-200 font-medium">
        {part}
      </mark>
    ) : (
      part
    )
  );
}

/**
 * Escape special regex characters
 */
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
