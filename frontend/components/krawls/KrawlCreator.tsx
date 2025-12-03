"use client";

import { KrawlDetail } from "@/types/krawl-detail";
import { Check, User } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/lib/routes";
import { Button } from "@/components/ui/button";
import { useIsAuthenticated } from "@/hooks/useIsAuthenticated";
import { useState } from "react";

interface KrawlCreatorProps {
  krawl: KrawlDetail;
}

export function KrawlCreator({ krawl }: KrawlCreatorProps) {
  const isAuthenticated = useIsAuthenticated();
  const [isVouching, setIsVouching] = useState(false);
  const [vouchCount, setVouchCount] = useState(
    krawl.vouchesData?.vouchCount || 0
  );
  const [isVouched, setIsVouched] = useState(
    krawl.vouchesData?.isVouchedByCurrentUser || false
  );

  if (!krawl.createdBy) {
    return null;
  }

  const handleVouch = async () => {
    if (!isAuthenticated) {
      // TODO: Show sign-in prompt
      return;
    }

    setIsVouching(true);
    const previousIsVouched = isVouched;
    const previousVouchCount = vouchCount;

    // Optimistic update
    setIsVouched(!isVouched);
    setVouchCount((prev) => (isVouched ? prev - 1 : prev + 1));

    try {
      const response = await fetch(`/api/krawls/${krawl.id}/vouch`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to toggle vouch");
      }

      const data = await response.json();
      setIsVouched(data.isVouchedByCurrentUser ?? !previousIsVouched);
      setVouchCount(data.vouchCount ?? previousVouchCount);
    } catch (error) {
      console.error("Error vouching krawl:", error);
      // Revert on error
      setIsVouched(previousIsVouched);
      setVouchCount(previousVouchCount);
    } finally {
      setIsVouching(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-text-primary mb-4">
        Created By
      </h3>
      <div className="flex items-center justify-between">
        <Link
          href={ROUTES.USER_PROFILE(krawl.createdBy.id)}
          className="flex items-center gap-3 flex-1 min-w-0"
        >
          {krawl.createdBy.avatar ? (
            <img
              src={krawl.createdBy.avatar}
              alt={krawl.createdBy.name}
              className="w-12 h-12 rounded-full flex-shrink-0"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-primary-green/10 flex items-center justify-center flex-shrink-0">
              <User className="w-6 h-6 text-primary-green" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="font-medium text-text-primary truncate">
              {krawl.createdBy.name}
            </p>
            <div className="flex items-center gap-1 text-sm text-text-secondary">
              <Check className="w-4 h-4 text-primary-green" />
              <span>{vouchCount} vouches</span>
            </div>
          </div>
        </Link>
        {isAuthenticated && (
          <Button
            variant={isVouched ? "primary" : "secondary"}
            size="sm"
            onClick={handleVouch}
            disabled={isVouching}
            className="ml-4 flex-shrink-0"
          >
            {isVouching ? "..." : isVouched ? "Vouched" : "Vouch"}
          </Button>
        )}
      </div>
    </div>
  );
}

