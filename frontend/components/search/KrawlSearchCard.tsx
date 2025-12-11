"use client";

import Link from "next/link";
import Image from "next/image";
import { Route, Star, ThumbsUp, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { DifficultyBadge } from "@/components/ui/difficulty-badge";
import type { KrawlSearchResult } from "@/lib/api/search";

export interface KrawlSearchCardProps {
  /** Krawl search result data */
  krawl: KrawlSearchResult;

  /** Optional className for styling */
  className?: string;

  /** Highlight query in text */
  highlightQuery?: string;
}

/**
 * KrawlSearchCard Component
 *
 * Displays a krawl search result card with cover image, name, description,
 * difficulty, gem count, rating, and vouch count.
 */
export function KrawlSearchCard({
  krawl,
  className,
  highlightQuery,
}: KrawlSearchCardProps) {
  return (
    <Link
      href={`/krawls/${krawl.id}`}
      className={cn(
        "block bg-white rounded-lg border border-bg-medium overflow-hidden",
        "hover:shadow-md hover:border-accent-orange/30 transition-all duration-200",
        "group",
        className
      )}
    >
      <div className="flex gap-4 p-4">
        {/* Cover Image */}
        <div className="flex-shrink-0 w-24 h-24 bg-bg-light rounded-md overflow-hidden">
          {krawl.coverImage ? (
            <Image
              src={krawl.coverImage}
              alt={krawl.name}
              width={96}
              height={96}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-text-tertiary">
              <Route className="w-8 h-8" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title and Difficulty */}
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="text-base font-semibold text-text-primary line-clamp-1 group-hover:text-accent-orange transition-colors">
              {highlightQuery ? highlightText(krawl.name, highlightQuery) : krawl.name}
            </h3>
            <DifficultyBadge difficulty={krawl.difficulty} size="sm" />
          </div>

          {/* Description */}
          <p className="text-sm text-text-secondary line-clamp-2 mb-2">
            {highlightQuery
              ? highlightText(krawl.description, highlightQuery)
              : krawl.description}
          </p>

          {/* Meta Info */}
          <div className="flex items-center gap-4 text-xs text-text-tertiary">
            {/* Gem Count */}
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>{krawl.gemCount} gems</span>
            </div>

            {/* Rating */}
            {krawl.averageRating > 0 && (
              <div className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                <span>{krawl.averageRating.toFixed(1)}</span>
              </div>
            )}

            {/* Vouches */}
            {krawl.vouchCount > 0 && (
              <div className="flex items-center gap-1">
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>{krawl.vouchCount}</span>
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
