"use client";

import { Trophy, Share2, Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CompletionStats, formatDuration, formatDistance } from "@/lib/krawl-mode/completionStats";
import Link from "next/link";
import { ROUTES } from "@/lib/routes";

export interface CompletionScreenProps {
  stats: CompletionStats;
  krawlId: string;
  krawlName: string;
  onClose: () => void;
  onRate?: () => void;
}

export function CompletionScreen({
  stats,
  krawlId,
  krawlName,
  onClose,
  onRate,
}: CompletionScreenProps) {
  const handleShare = async () => {
    const shareData = {
      title: `I completed ${krawlName}!`,
      text: `I just completed ${krawlName} on Krawl! ${stats.gemsVisited} gems visited in ${formatDuration(stats.totalTimeMinutes)}.`,
      url: window.location.origin + ROUTES.KRAWL_DETAIL(krawlId),
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        alert("Link copied to clipboard!");
      }
    } catch (error) {
      // User cancelled or error
      console.log("Share cancelled or error:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white shadow-lg overflow-hidden">
        {/* Celebration Header */}
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-8 text-center">
          <Trophy className="w-16 h-16 text-white mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-2">Congratulations!</h2>
          <p className="text-white/90">You completed {krawlName}</p>
        </div>

        {/* Statistics */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-text-primary">
                {formatDuration(stats.totalTimeMinutes)}
              </p>
              <p className="text-sm text-text-secondary">Total Time</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-text-primary">
                {formatDistance(stats.totalDistanceMeters)}
              </p>
              <p className="text-sm text-text-secondary">Distance</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-text-primary">
                {stats.gemsVisited}
              </p>
              <p className="text-sm text-text-secondary">Gems Visited</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-text-primary">
                {new Date(stats.completionDate).toLocaleDateString()}
              </p>
              <p className="text-sm text-text-secondary">Completed</p>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2 pt-4">
            {onRate && (
              <Button
                variant="primary"
                onClick={onRate}
                icon={<Star className="w-5 h-5" />}
                className="w-full"
              >
                Rate this Krawl
              </Button>
            )}
            <Button
              variant="secondary"
              onClick={handleShare}
              icon={<Share2 className="w-5 h-5" />}
              className="w-full"
            >
              Share Completion
            </Button>
            <Link href={ROUTES.KRAWL_DETAIL(krawlId)} className="block">
              <Button
                variant="outline"
                icon={<ArrowRight className="w-5 h-5" />}
                iconPosition="right"
                className="w-full"
              >
                View Krawl Details
              </Button>
            </Link>
            <Button variant="text" onClick={onClose} className="w-full">
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

