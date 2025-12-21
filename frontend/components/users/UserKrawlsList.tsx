"use client";

import { useState, useEffect } from "react";
import { AlertCircle, Route } from "lucide-react";
import { KrawlSearchCard } from "@/components/search/KrawlSearchCard";
import { EmptyState } from "@/components/ui/empty-state";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { getUserKrawls, type UserContentResponse } from "@/lib/api/users";
import type { KrawlSearchResult } from "@/lib/api/search";

export interface UserKrawlsListProps {
  /** User ID */
  userId: string;

  /** Optional className for styling */
  className?: string;
}

/**
 * UserKrawlsList Component
 *
 * Displays a paginated list of Krawls created by the user.
 */
export function UserKrawlsList({ userId, className }: UserKrawlsListProps) {
  const [krawls, setKrawls] = useState<KrawlSearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    loadKrawls();
  }, [userId, page]);

  const loadKrawls = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = (await getUserKrawls(
        userId,
        page,
        20
      )) as UserContentResponse<KrawlSearchResult>;
      setKrawls((prev) => (page === 0 ? response.content : [...prev, ...response.content]));
      setHasMore(response.hasNext);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load Krawls");
    } finally {
      setLoading(false);
    }
  };

  if (loading && krawls.length === 0) {
    return (
      <div className={cn("flex justify-center py-8", className)}>
        <Spinner size="lg" />
      </div>
    );
  }

  if (error && krawls.length === 0) {
    return (
      <EmptyState
        icon={<AlertCircle className="w-[120px] h-[120px] md:w-[160px] md:h-[160px]" />}
        title="Failed to load Krawls"
        description={error}
        className={className}
      />
    );
  }

  if (krawls.length === 0) {
    return (
      <EmptyState
        icon={<Route className="w-[120px] h-[120px] md:w-[160px] md:h-[160px]" />}
        title="No Krawls created yet"
        description="This user hasn't created any Krawls."
        className={className}
      />
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="grid grid-cols-1 gap-4">
        {krawls.map((krawl) => (
          <KrawlSearchCard key={krawl.id} krawl={krawl} />
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center pt-4">
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={loading}
            className="px-4 py-2 bg-accent-orange text-white rounded-lg hover:bg-accent-orange/90 disabled:opacity-50"
          >
            {loading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
}

