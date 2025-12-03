"use client";

import { KrawlDetail } from "@/types/krawl-detail";
import { Download, Play, Share2, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/routes";
import Link from "next/link";
import { useIsAuthenticated } from "@/hooks/useIsAuthenticated";

interface KrawlActionsProps {
  krawl: KrawlDetail;
}

export function KrawlActions({ krawl }: KrawlActionsProps) {
  const isAuthenticated = useIsAuthenticated();

  const handleDownload = async () => {
    if (!isAuthenticated) {
      // TODO: Show sign-in prompt
      return;
    }

    try {
      const response = await fetch(`/api/krawls/${krawl.id}/download`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to download krawl");
      }

      // TODO: Show success message
      console.log("Krawl downloaded for offline use");
    } catch (error) {
      console.error("Error downloading krawl:", error);
      alert("Failed to download krawl. Please try again.");
    }
  };

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
    // TODO: Implement report modal
    const reason = prompt(
      "Why are you reporting this krawl?\n\nReasons:\n1. Inappropriate content\n2. Wrong information\n3. Spam\n4. Other"
    );

    if (reason) {
      // TODO: Send report to API
      alert("Thank you for your report. We'll review this krawl.");
    }
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
        <Button
          className="w-full"
          variant="secondary"
          onClick={handleDownload}
        >
          <Download className="w-5 h-5 mr-2" />
          Download Offline
        </Button>
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
    </div>
  );
}

