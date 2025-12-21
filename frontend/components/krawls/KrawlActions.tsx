"use client";

import { useState } from "react";
import { KrawlDetail } from "@/types/krawl-detail";
import { Play, Share2, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/routes";
import Link from "next/link";
import { useIsAuthenticated } from "@/hooks/useIsAuthenticated";
import { ReportModal } from "@/components/reports/ReportModal";
import { DownloadButton } from "@/components/offline/DownloadButton";

interface KrawlActionsProps {
  krawl: KrawlDetail;
}

export function KrawlActions({ krawl }: KrawlActionsProps) {
  const isAuthenticated = useIsAuthenticated();
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);


  const handleShare = async () => {
    const shareData = {
      title: krawl.name,
      text: krawl.description || `Check out ${krawl.name} on Krawl!`,
      url: window.location.href,
    };

    try {
      // Try Web Share API first (mobile)
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: Copy to clipboard
        await navigator.clipboard.writeText(window.location.href);
        // TODO: Show toast notification
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
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-3">
      <h3 className="text-lg font-semibold text-text-primary mb-4">Actions</h3>

      {/* Primary Action: Start Krawl */}
      <Link href={ROUTES.KRAWL_MODE(krawl.id)} className="block">
        <Button className="w-full" variant="primary" size="lg">
          <Play className="w-5 h-5 mr-2" />
          Start Krawl
        </Button>
      </Link>

      {/* Secondary Actions */}
      {isAuthenticated && (
        <DownloadButton krawlId={krawl.id} className="w-full" />
      )}

      <Button className="w-full" variant="secondary" onClick={handleShare}>
        <Share2 className="w-5 h-5 mr-2" />
        Share
      </Button>

      <Button
        className="w-full"
        variant="outline"
        onClick={handleReport}
      >
        <Flag className="w-5 h-5 mr-2" />
        Report
      </Button>

      {/* Report Modal */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        contentType="KRAWL"
        contentId={krawl.id}
        contentName={krawl.name}
      />
    </div>
  );
}

