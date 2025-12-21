"use client";

import { ProgressBar } from "@/components/ui/progress-bar";
import { AlertCircle, HardDrive } from "lucide-react";
import { useStorageUsage } from "@/hooks/useStorageUsage";
import { formatBytes } from "@/lib/offline/storageUtils";

interface StorageUsageProps {
  className?: string;
}

export function StorageUsage({ className }: StorageUsageProps) {
  const { storage, isLoading, refresh } = useStorageUsage();

  if (isLoading || !storage) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 ${className}`}>
        <div className="flex items-center gap-2">
          <HardDrive className="w-5 h-5 text-text-secondary" />
          <span className="text-text-secondary">Loading storage info...</span>
        </div>
      </div>
    );
  }

  const usagePercent = storage.quota > 0 ? (storage.usage / storage.quota) * 100 : 0;

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <HardDrive className="w-5 h-5 text-text-secondary" />
          <h3 className="font-semibold text-text-primary">Storage Usage</h3>
        </div>
        {storage.isLow && (
          <AlertCircle className="w-5 h-5 text-warning-yellow" />
        )}
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-text-secondary">Used</span>
          <span className="text-text-primary font-medium">
            {formatBytes(storage.usage)} / {formatBytes(storage.quota)}
          </span>
        </div>
        <ProgressBar value={usagePercent} max={100} size="sm" />
        <div className="flex justify-between text-xs text-text-secondary">
          <span>Available: {formatBytes(storage.available)}</span>
          <span>{storage.krawlsCount} downloaded Krawls</span>
        </div>
      </div>

      {storage.isLow && (
        <div className="bg-warning-yellow/10 border border-warning-yellow/20 rounded p-2 text-sm text-warning-yellow">
          <AlertCircle className="w-4 h-4 inline mr-1" />
          Storage is running low. Consider removing some downloads.
        </div>
      )}
    </div>
  );
}

