"use client";

import { useState, useEffect } from "react";
import { Download, Check, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { downloadKrawl, removeDownload, isKrawlDownloaded, getDownloadProgress } from "@/lib/offline/downloadService";
import { useDownloadProgress } from "@/hooks/useDownloadProgress";
import type { DownloadProgress } from "@/lib/offline/downloadService";

interface DownloadButtonProps {
  krawlId: string;
  className?: string;
}

export function DownloadButton({ krawlId, className }: DownloadButtonProps) {
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [isRemoving, setIsRemoving] = useState(false);
  const progress = useDownloadProgress(krawlId);

  // Check download status on mount
  useEffect(() => {
    checkDownloadStatus();
  }, [krawlId]);

  const checkDownloadStatus = async () => {
    setIsChecking(true);
    try {
      const downloaded = await isKrawlDownloaded(krawlId);
      setIsDownloaded(downloaded);
    } catch (error) {
      console.error("Failed to check download status:", error);
    } finally {
      setIsChecking(false);
    }
  };

  const handleDownload = async () => {
    try {
      await downloadKrawl(krawlId, (progress) => {
        // Progress updates handled by useDownloadProgress hook
      });
      setIsDownloaded(true);
    } catch (error) {
      console.error("Download failed:", error);
      alert(error instanceof Error ? error.message : "Failed to download Krawl");
    }
  };

  const handleRemove = async () => {
    if (!confirm("Remove this download? You'll need to download it again to use it offline.")) {
      return;
    }

    setIsRemoving(true);
    try {
      await removeDownload(krawlId);
      setIsDownloaded(false);
    } catch (error) {
      console.error("Failed to remove download:", error);
      alert("Failed to remove download");
    } finally {
      setIsRemoving(false);
    }
  };

  if (isChecking) {
    return (
      <Button className={className} variant="secondary" disabled>
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        Checking...
      </Button>
    );
  }

  // Show download progress
  if (progress && progress.status === "downloading") {
    return (
      <Button className={className} variant="secondary" disabled>
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        Downloading... {progress.progress}%
      </Button>
    );
  }

  // Show downloaded state
  if (isDownloaded) {
    return (
      <Button
        className={className}
        variant="secondary"
        onClick={handleRemove}
        disabled={isRemoving}
      >
        {isRemoving ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Removing...
          </>
        ) : (
          <>
            <Check className="w-4 h-4 mr-2" />
            Downloaded
          </>
        )}
      </Button>
    );
  }

  // Show download button
  return (
    <Button className={className} variant="secondary" onClick={handleDownload}>
      <Download className="w-4 h-4 mr-2" />
      Download for Offline
    </Button>
  );
}




