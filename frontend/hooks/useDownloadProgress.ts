/**
 * useDownloadProgress Hook
 * 
 * Tracks download progress for a specific Krawl
 */

import { useState, useEffect } from "react";
import { getDownloadProgress, type DownloadProgress } from "@/lib/offline/downloadService";

export function useDownloadProgress(krawlId: string): DownloadProgress | null {
  const [progress, setProgress] = useState<DownloadProgress | null>(null);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    const updateProgress = async () => {
      try {
        const currentProgress = await getDownloadProgress(krawlId);
        setProgress(currentProgress);

        // Stop polling if download is completed or failed
        if (currentProgress && (currentProgress.status === "completed" || currentProgress.status === "failed")) {
          if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
          }
        }
      } catch (error) {
        console.error("Failed to get download progress:", error);
      }
    };

    // Initial check
    updateProgress();

    // Poll for progress updates
    intervalId = setInterval(updateProgress, 500); // Update every 500ms

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [krawlId]);

  return progress;
}







