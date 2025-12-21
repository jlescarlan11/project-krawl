"use client";

import { useState, useEffect } from "react";
import { AlertCircle, MapPin } from "lucide-react";
import { GemSearchCard } from "@/components/search/GemSearchCard";
import { EmptyState } from "@/components/ui/empty-state";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { getUserGems, type UserContentResponse } from "@/lib/api/users";
import type { GemSearchResult } from "@/lib/api/search";

export interface UserGemsListProps {
  /** User ID */
  userId: string;

  /** Optional className for styling */
  className?: string;
}

/**
 * UserGemsList Component
 *
 * Displays a paginated list of Gems created by the user.
 */
export function UserGemsList({ userId, className }: UserGemsListProps) {
  const [gems, setGems] = useState<GemSearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    loadGems();
  }, [userId, page]);

  const loadGems = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = (await getUserGems(
        userId,
        page,
        20
      )) as UserContentResponse<GemSearchResult>;
      setGems((prev) => (page === 0 ? response.content : [...prev, ...response.content]));
      setHasMore(response.hasNext);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load Gems");
    } finally {
      setLoading(false);
    }
  };

  if (loading && gems.length === 0) {
    return (
      <div className={cn("flex justify-center py-8", className)}>
        <Spinner size="lg" />
      </div>
    );
  }

  if (error && gems.length === 0) {
    return (
      <EmptyState
        icon={<AlertCircle className="w-[120px] h-[120px] md:w-[160px] md:h-[160px]" />}
        title="Failed to load Gems"
        description={error}
        className={className}
      />
    );
  }

  if (gems.length === 0) {
    return (
      <EmptyState
        icon={<MapPin className="w-[120px] h-[120px] md:w-[160px] md:h-[160px]" />}
        title="No Gems created yet"
        description="This user hasn't created any Gems."
        className={className}
      />
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="grid grid-cols-1 gap-4">
        {gems.map((gem) => (
          <GemSearchCard key={gem.id} gem={gem} />
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center pt-4">
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={loading}
            className="px-4 py-2 bg-primary-green text-white rounded-lg hover:bg-primary-green/90 disabled:opacity-50"
          >
            {loading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
}

