"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, XCircle, AlertCircle, Loader2, MapPin, Battery, Wifi, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocationPermission } from "@/hooks/useLocationPermission";
import { useBatteryStatus } from "@/hooks/useBatteryStatus";
import { useOfflineStatus } from "@/hooks/useOfflineStatus";

export interface PreStartChecklistProps {
  krawlId: string;
  onStart: () => void;
  onCancel: () => void;
}

type ChecklistItemStatus = "loading" | "success" | "warning" | "error";

interface ChecklistItem {
  id: string;
  label: string;
  description: string;
  status: ChecklistItemStatus;
  message?: string;
  action?: () => void;
  actionLabel?: string;
}

export function PreStartChecklist({
  krawlId,
  onStart,
  onCancel,
}: PreStartChecklistProps) {
  const locationPermission = useLocationPermission();
  const batteryStatus = useBatteryStatus();
  const offlineStatus = useOfflineStatus(krawlId);

  const [items, setItems] = useState<ChecklistItem[]>([]);

  useEffect(() => {
    // Check location permission
    const locationItem: ChecklistItem = {
      id: "location",
      label: "Location Permission",
      description: "Allow access to your location for navigation",
      status: locationPermission.isLoading
        ? "loading"
        : locationPermission.status === "granted"
        ? "success"
        : locationPermission.status === "denied"
        ? "error"
        : "warning",
      message:
        locationPermission.status === "granted"
          ? "Location access granted"
          : locationPermission.status === "denied"
          ? "Location access denied. Please enable it in browser settings."
          : "Location permission required",
      action:
        locationPermission.status !== "granted"
          ? locationPermission.requestPermission
          : undefined,
      actionLabel:
        locationPermission.status === "denied"
          ? "Open Settings"
          : "Grant Permission",
    };

    // Check battery level
    const batteryItem: ChecklistItem = {
      id: "battery",
      label: "Battery Level",
      description: batteryStatus.isSupported
        ? "Ensure adequate battery for your journey"
        : "Battery level check unavailable",
      status: batteryStatus.isLoading
        ? "loading"
        : !batteryStatus.isSupported
        ? "warning"
        : batteryStatus.isLow
        ? "warning"
        : "success",
      message: batteryStatus.isSupported
        ? batteryStatus.isLow
          ? `Battery is low (${Math.round((batteryStatus.battery?.level || 0) * 100)}%). Consider charging before starting.`
          : `Battery level: ${Math.round((batteryStatus.battery?.level || 0) * 100)}%`
        : "Unable to check battery level",
    };

    // Check offline status
    const offlineItem: ChecklistItem = {
      id: "offline",
      label: "Offline Status",
      description: offlineStatus.isOnline
        ? "Krawl is available online"
        : "Krawl must be downloaded for offline use",
      status: offlineStatus.isLoading
        ? "loading"
        : offlineStatus.isOnline || offlineStatus.isDownloaded
        ? "success"
        : "error",
      message:
        offlineStatus.isOnline || offlineStatus.isDownloaded
          ? offlineStatus.isOnline
            ? "Online - Krawl available"
            : "Offline - Krawl downloaded"
          : "Krawl not downloaded and you're offline",
    };

    setItems([locationItem, batteryItem, offlineItem]);
  }, [
    locationPermission,
    batteryStatus,
    offlineStatus,
  ]);

  const allChecksPassed = items.every(
    (item) => item.status === "success" || (item.status === "warning" && item.id === "battery")
  );

  const hasErrors = items.some((item) => item.status === "error");

  const getStatusIcon = (status: ChecklistItemStatus) => {
    switch (status) {
      case "loading":
        return <Loader2 className="w-5 h-5 animate-spin text-text-tertiary" />;
      case "success":
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case "warning":
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case "error":
        return <XCircle className="w-5 h-5 text-red-600" />;
    }
  };

  const getItemIcon = (id: string) => {
    switch (id) {
      case "location":
        return <MapPin className="w-5 h-5" />;
      case "battery":
        return <Battery className="w-5 h-5" />;
      case "offline":
        return offlineStatus.isOnline ? (
          <Wifi className="w-5 h-5" />
        ) : (
          <WifiOff className="w-5 h-5" />
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white shadow-lg">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-text-primary mb-2">
            Pre-Start Checklist
          </h2>
          <p className="text-text-secondary mb-6">
            Please verify the following before starting your Krawl:
          </p>

          <div className="space-y-4 mb-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-3 p-4 rounded-lg border border-gray-200"
              >
                <div className="mt-0.5">{getItemIcon(item.id)}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-text-primary">
                      {item.label}
                    </h3>
                    {getStatusIcon(item.status)}
                  </div>
                  <p className="text-sm text-text-secondary mb-2">
                    {item.description}
                  </p>
                  {item.message && (
                    <p
                      className={`text-sm ${
                        item.status === "error"
                          ? "text-red-600"
                          : item.status === "warning"
                          ? "text-yellow-600"
                          : "text-green-600"
                      }`}
                    >
                      {item.message}
                    </p>
                  )}
                  {item.action && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={item.action}
                      className="mt-2"
                    >
                      {item.actionLabel}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onCancel}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={onStart}
              disabled={!allChecksPassed || hasErrors}
              className="flex-1"
            >
              Start Krawl
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

