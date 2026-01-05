"use client";

import { Upload, CheckCircle, AlertCircle } from "lucide-react";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { cn } from "@/lib/utils";

interface UploadStatusProps {
  className?: string;
}

export function UploadStatus({ className }: UploadStatusProps) {
  const { isOnline, pendingUploads, isUploading } = useOnlineStatus();

  if (!isOnline || pendingUploads === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex items-center gap-2 text-sm",
        isUploading ? "text-primary-green" : "text-text-secondary",
        className
      )}
    >
      {isUploading ? (
        <>
          <Upload className="w-4 h-4 animate-pulse" />
          <span>Uploading {pendingUploads} item{pendingUploads !== 1 ? "s" : ""}...</span>
        </>
      ) : (
        <>
          <AlertCircle className="w-4 h-4" />
          <span>{pendingUploads} pending upload{pendingUploads !== 1 ? "s" : ""}</span>
        </>
      )}
    </div>
  );
}







