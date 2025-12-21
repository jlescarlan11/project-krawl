"use client";

import { useState } from "react";
import { GemDetail } from "@/types/gem-detail";
import { ThumbsUp, Share2, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReportModal } from "@/components/reports/ReportModal";

interface GemActionsProps {
  gem: GemDetail;
}

export function GemActions({ gem }: GemActionsProps) {
  const [isVouched, setIsVouched] = useState(gem.vouchesData?.isVouchedByCurrentUser || false);
  const [vouchCount, setVouchCount] = useState(gem.vouchCount || 0);
  const [isVouching, setIsVouching] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const handleVouch = async () => {
    setIsVouching(true);

    // Optimistic update
    const previousIsVouched = isVouched;
    const previousVouchCount = vouchCount;
    setIsVouched(!isVouched);
    setVouchCount((prev) => (isVouched ? prev - 1 : prev + 1));

    try {
      const response = await fetch(`/api/gems/${gem.id}/vouch`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to toggle vouch: ${response.statusText}`);
      }

      const data = await response.json();

      // Update with actual response data
      setIsVouched(data.isVouchedByCurrentUser ?? !previousIsVouched);
      setVouchCount(data.vouchCount ?? previousVouchCount);
    } catch (error) {
      console.error("Error vouching gem:", error);
      // Revert on error
      setIsVouched(previousIsVouched);
      setVouchCount(previousVouchCount);
      // Optionally show error message to user
      alert(error instanceof Error ? error.message : "Failed to toggle vouch. Please try again.");
    } finally {
      setIsVouching(false);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: gem.name,
      text: `Check out ${gem.name} on Krawl! ${gem.shortDescription || ""}`,
      url: window.location.href,
    };

    try {
      // Try Web Share API first (mobile)
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: Copy to clipboard
        await navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
      }
    } catch (error) {
      // User cancelled or error occurred
      console.log("Error sharing:", error);
    }
  };

  const handleReport = () => {
    setIsReportModalOpen(true);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-text-primary mb-4">Actions</h2>

      <div className="space-y-3">
        {/* Vouch Button */}
        <Button
          onClick={handleVouch}
          disabled={isVouching}
          className={`w-full justify-start gap-2 ${
            isVouched
              ? "bg-primary-green text-white hover:bg-primary-green/90"
              : "bg-white text-text-primary border border-gray-300 hover:bg-gray-50"
          }`}
        >
          <ThumbsUp className={`w-5 h-5 ${isVouched ? "fill-white" : ""}`} />
          <span>
            {isVouched ? "Vouched" : "Vouch"} ({vouchCount})
          </span>
        </Button>

        {/* Share Button */}
        <Button
          onClick={handleShare}
          variant="outline"
          className="w-full justify-start gap-2"
        >
          <Share2 className="w-5 h-5" />
          Share
        </Button>

        {/* Report Button */}
        <Button
          onClick={handleReport}
          variant="outline"
          className="w-full justify-start gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <Flag className="w-5 h-5" />
          Report
        </Button>
      </div>

      {/* Report Modal */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        contentType="GEM"
        contentId={gem.id}
        contentName={gem.name}
      />
    </div>
  );
}
