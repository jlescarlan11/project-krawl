"use client";

import { WifiOff, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OfflineMapFallbackProps {
  onRetry?: () => void;
}

export function OfflineMapFallback({ onRetry }: OfflineMapFallbackProps) {
  return (
    <div className="absolute inset-0 bg-bg-light flex items-center justify-center z-10">
      <div className="text-center p-6 max-w-md">
        <WifiOff className="w-12 h-12 text-text-secondary mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-text-primary mb-2">
          Map Unavailable Offline
        </h3>
        <p className="text-text-secondary mb-4">
          Map tiles are not available offline. Please download this Krawl for offline use to view the map.
        </p>
        {onRetry && (
          <Button variant="primary" onClick={onRetry}>
            Retry
          </Button>
        )}
      </div>
    </div>
  );
}




