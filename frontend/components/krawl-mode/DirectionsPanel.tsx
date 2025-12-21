"use client";

import { useState } from "react";
import {
  ChevronRight,
  Navigation,
  ChevronUp,
  ChevronDown,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { DirectionStep } from "@/lib/krawl-mode/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface DirectionsPanelProps {
  steps: DirectionStep[];
  currentStepIndex: number;
  isLoading?: boolean;
  error?: Error | null;
  onRecalculate?: () => void;
  className?: string;
}

export function DirectionsPanel({
  steps,
  currentStepIndex,
  isLoading = false,
  error = null,
  onRecalculate,
  className = "",
}: DirectionsPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const formatDistance = (meters: number): string => {
    if (meters < 1000) {
      return `${Math.round(meters)} m`;
    }
    return `${(meters / 1000).toFixed(1)} km`;
  };

  const formatDuration = (seconds: number): string => {
    const minutes = Math.round(seconds / 60);
    if (minutes < 1) {
      return "< 1 min";
    }
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  const getManeuverIcon = (maneuver?: { type: string; modifier?: string }) => {
    if (!maneuver) return null;

    // Simple icon mapping based on maneuver type
    const type = maneuver.type.toLowerCase();
    if (type.includes("turn")) {
      return "↪";
    }
    if (type.includes("straight")) {
      return "→";
    }
    if (type.includes("arrive")) {
      return "📍";
    }
    return "→";
  };

  if (error) {
    return (
      <div className={`bg-white rounded-t-lg shadow-lg ${className}`}>
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold text-text-primary flex items-center gap-2">
            <Navigation className="w-5 h-5" />
            Directions
          </h3>
        </div>
        <div className="p-4">
          <div className="flex items-center gap-2 text-red-600 mb-2">
            <AlertCircle className="w-5 h-5" />
            <p className="text-sm font-medium">Failed to load directions</p>
          </div>
          <p className="text-text-secondary text-sm mb-3">{error.message}</p>
          {onRecalculate && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRecalculate}
              icon={<RefreshCw className="w-4 h-4" />}
              iconPosition="left"
            >
              Retry
            </Button>
          )}
        </div>
      </div>
    );
  }

  if (steps.length === 0 && !isLoading) {
    return (
      <div className={`bg-white rounded-t-lg shadow-lg ${className}`}>
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold text-text-primary flex items-center gap-2">
            <Navigation className="w-5 h-5" />
            Directions
          </h3>
        </div>
        <div className="p-4">
          <p className="text-text-secondary text-sm">No directions available</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-t-lg shadow-lg ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-text-primary flex items-center gap-2">
            <Navigation className="w-5 h-5" />
            Directions
            {isLoading && (
              <span className="text-xs text-text-tertiary ml-2">
                (Loading...)
              </span>
            )}
          </h3>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            aria-label={isExpanded ? "Collapse" : "Expand"}
          >
            {isExpanded ? (
              <ChevronDown className="w-5 h-5 text-text-secondary" />
            ) : (
              <ChevronUp className="w-5 h-5 text-text-secondary" />
            )}
          </button>
        </div>
      </div>

      {/* Steps List */}
      {isExpanded && (
        <div className="max-h-96 overflow-y-auto">
          {isLoading && steps.length === 0 ? (
            <div className="p-4 text-center text-text-secondary text-sm">
              Calculating route...
            </div>
          ) : (
            steps.map((step, index) => (
              <div
                key={index}
                className={cn(
                  "p-4 border-b border-gray-100 transition-colors",
                  index === currentStepIndex
                    ? "bg-blue-50 border-l-4 border-l-blue-500"
                    : "hover:bg-gray-50"
                )}
                role="listitem"
                aria-current={index === currentStepIndex ? "step" : undefined}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                      index === currentStepIndex
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-text-secondary"
                    )}
                  >
                    {getManeuverIcon(step.maneuver) || index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-text-primary font-medium">
                      {step.instruction}
                    </p>
                    <div className="flex items-center gap-4 mt-1 text-sm text-text-secondary">
                      <span>{formatDistance(step.distance)}</span>
                      <span>•</span>
                      <span>{formatDuration(step.duration)}</span>
                    </div>
                  </div>
                  {index === currentStepIndex && (
                    <ChevronRight className="w-5 h-5 text-blue-500 flex-shrink-0" />
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

