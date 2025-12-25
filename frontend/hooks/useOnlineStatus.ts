/**
 * useOnlineStatus Hook
 * 
 * Tracks online/offline status and manages auto-upload
 */

import { useState, useEffect } from "react";
import { startAutoUpload, stopAutoUpload, getUploadStatus } from "@/lib/offline/autoUpload";

export interface OnlineStatus {
  isOnline: boolean;
  pendingUploads: number;
  isUploading: boolean;
}

export function useOnlineStatus(autoUploadEnabled: boolean = true): OnlineStatus {
  const [isOnline, setIsOnline] = useState(
    typeof window !== "undefined" ? navigator.onLine : true
  );
  const [uploadStatus, setUploadStatus] = useState({
    pendingCount: 0,
    isProcessing: false,
  });

  useEffect(() => {
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    // Initial check
    updateOnlineStatus();

    // Listen for online/offline events
    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);

    return () => {
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
    };
  }, []);

  useEffect(() => {
    if (autoUploadEnabled && isOnline) {
      startAutoUpload({
        onProgress: async () => {
          const status = await getUploadStatus();
          setUploadStatus(status);
        },
      });

      // Update status periodically
      const interval = setInterval(async () => {
        const status = await getUploadStatus();
        setUploadStatus(status);
      }, 5000);

      return () => {
        stopAutoUpload();
        clearInterval(interval);
      };
    } else {
      stopAutoUpload();
    }
  }, [isOnline, autoUploadEnabled]);

  return {
    isOnline,
    pendingUploads: uploadStatus.pendingCount,
    isUploading: uploadStatus.isProcessing,
  };
}




