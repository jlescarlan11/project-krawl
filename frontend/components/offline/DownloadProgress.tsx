"use client";

import { ProgressBar } from "@/components/ui/progress-bar";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import type { DownloadProgress as DownloadProgressType } from "@/lib/offline/downloadService";
import { formatBytes } from "@/lib/offline/storageUtils";

interface DownloadProgressProps {
  progress: DownloadProgressType;
  onCancel?: () => void;
}

export function DownloadProgress({ progress, onCancel }: DownloadProgressProps) {
  const getStatusIcon = () => {
    switch (progress.status) {
      case "downloading":
        return <Loader2 className="w-5 h-5 animate-spin text-primary-green" />;
      case "completed":
        return <CheckCircle className="w-5 h-5 text-primary-green" />;
      case "failed":
        return <XCircle className="w-5 h-5 text-error-red" />;
      default:
        return null;
    }
  };

  const getStatusColor = () => {
    switch (progress.status) {
      case "downloading":
        return "text-primary-green";
      case "completed":
        return "text-primary-green";
      case "failed":
        return "text-error-red";
      default:
        return "text-text-secondary";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {getStatusIcon()}
          <span className={`font-medium ${getStatusColor()}`}>
            {progress.status === "downloading" && "Downloading..."}
            {progress.status === "completed" && "Download Complete"}
            {progress.status === "failed" && "Download Failed"}
          </span>
        </div>
        {onCancel && progress.status === "downloading" && (
          <button
            onClick={onCancel}
            className="text-sm text-text-secondary hover:text-text-primary"
          >
            Cancel
          </button>
        )}
      </div>

      {progress.status === "downloading" && (
        <>
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">{progress.currentStep}</span>
              <span className="text-text-secondary">{progress.progress}%</span>
            </div>
            <ProgressBar value={progress.progress} size="sm" />
          </div>

          {progress.totalBytes && (
            <div className="text-xs text-text-secondary">
              {formatBytes(progress.downloadedBytes)} / {formatBytes(progress.totalBytes)}
            </div>
          )}
        </>
      )}

      {progress.status === "failed" && progress.currentStep && (
        <div className="text-sm text-error-red">
          {progress.currentStep}
        </div>
      )}
    </div>
  );
}

