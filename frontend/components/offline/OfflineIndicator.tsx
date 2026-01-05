"use client";

import { WifiOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface OfflineIndicatorProps {
  className?: string;
  showLabel?: boolean;
}

export function OfflineIndicator({ className, showLabel = false }: OfflineIndicatorProps) {
  if (typeof window === "undefined" || navigator.onLine) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex items-center gap-2 text-text-secondary",
        className
      )}
    >
      <WifiOff className="w-4 h-4" />
      {showLabel && <span className="text-sm">Offline</span>}
    </div>
  );
}







