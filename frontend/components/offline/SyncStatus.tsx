"use client";

import { RefreshCw, CheckCircle, XCircle } from "lucide-react";
import { useAutoSync } from "@/hooks/useAutoSync";
import { cn } from "@/lib/utils";

interface SyncStatusProps {
  className?: string;
}

export function SyncStatus({ className }: SyncStatusProps) {
  const { isSyncing, lastSyncAt, results } = useAutoSync();

  if (!lastSyncAt && !isSyncing) {
    return null;
  }

  const successCount = results.filter((r) => r.updated).length;
  const errorCount = results.filter((r) => r.error).length;

  return (
    <div
      className={cn(
        "flex items-center gap-2 text-sm text-text-secondary",
        className
      )}
    >
      {isSyncing ? (
        <>
          <RefreshCw className="w-4 h-4 animate-spin text-primary-green" />
          <span>Syncing...</span>
        </>
      ) : (
        <>
          {errorCount > 0 ? (
            <XCircle className="w-4 h-4 text-error-red" />
          ) : (
            <CheckCircle className="w-4 h-4 text-primary-green" />
          )}
          <span>
            {successCount > 0 && `${successCount} updated`}
            {errorCount > 0 && ` ${errorCount} failed`}
          </span>
        </>
      )}
    </div>
  );
}

