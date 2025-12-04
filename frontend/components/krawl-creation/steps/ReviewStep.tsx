"use client";

import React, { useState, useCallback, useMemo } from "react";
import { ArrowLeft, Edit2, MapPin, Clock, Route } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ProgressDots } from "@/components/onboarding/ProgressDots";
import { useKrawlCreationStore } from "@/stores/krawl-creation-store";
import { RouteVisualizationMap } from "../RouteVisualizationMap";
import { formatDistance, formatDuration } from "@/lib/format";
import { getCachedRoute } from "@/lib/map/routingUtils";
import type { Coordinates } from "@/components/map/gem-types";

interface ReviewStepProps {
  onNext: () => void;
  onBack: () => void;
}

export function ReviewStep({ onNext, onBack }: ReviewStepProps) {
  const { basicInfo, selectedGems, setCurrentStep } = useKrawlCreationStore();
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [routeMetrics, setRouteMetrics] = useState<{
    distance: number;
    duration: number;
  } | null>(null);

  // Sort gems by order
  const sortedGems = useMemo(() => {
    return [...selectedGems].sort((a, b) => a.order - b.order);
  }, [selectedGems]);

  // Calculate route metrics
  React.useEffect(() => {
    if (sortedGems.length < 2) {
      setRouteMetrics(null);
      return;
    }

    const calculateMetrics = async () => {
      const waypoints: Coordinates[] = sortedGems
        .map((sg) => sg.gem.coordinates)
        .filter(
          (coord): coord is Coordinates =>
            coord !== undefined &&
            coord.length === 2 &&
            !isNaN(coord[0]) &&
            !isNaN(coord[1])
        );

      if (waypoints.length < 2) {
        setRouteMetrics(null);
        return;
      }

      try {
        const route = await getCachedRoute(waypoints, "walking");
        if (route) {
          setRouteMetrics({
            distance: route.distance,
            duration: route.duration,
          });
        }
      } catch (error) {
        console.error("Error calculating route metrics:", error);
        setRouteMetrics(null);
      }
    };

    calculateMetrics();
  }, [sortedGems]);

  const handleEditBasicInfo = useCallback(() => {
    setCurrentStep(0);
  }, [setCurrentStep]);

  const handleEditRoute = useCallback(() => {
    setCurrentStep(1);
  }, [setCurrentStep]);

  const handlePublish = useCallback(async () => {
    if (!termsAccepted || !basicInfo || sortedGems.length < 2) {
      return;
    }

    setIsPublishing(true);

    try {
      // TODO: Implement krawl creation API call
      // For now, just navigate to success page
      console.log("Publishing krawl:", {
        basicInfo,
        selectedGems: sortedGems,
        routeMetrics,
      });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Navigate to success or krawls list
      onNext();
    } catch (error) {
      console.error("Error publishing krawl:", error);
      alert("Failed to publish krawl. Please try again.");
    } finally {
      setIsPublishing(false);
    }
  }, [termsAccepted, basicInfo, sortedGems, routeMetrics, onNext]);

  const canPublish = termsAccepted && basicInfo && sortedGems.length >= 2;

  return (
    <div className="flex flex-col h-dvh bg-bg-white">
      {/* Header */}
      <header className="shrink-0 border-b border-border-subtle bg-bg-white">
        <div className="p-4">
          <div className="flex items-center gap-3 relative">
            <button
              onClick={onBack}
              className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-bg-light transition-colors shrink-0"
              aria-label="Go back"
              type="button"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex-1 flex flex-col items-center justify-center gap-3">
              <h1 className="text-xl font-bold text-text-primary">Create Krawl</h1>
              <ProgressDots total={3} currentIndex={2} />
            </div>
            <p className="text-sm text-text-secondary shrink-0">Step 3 of 3</p>
          </div>
        </div>
      </header>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-6">
          {/* Review & Publish Heading */}
          <div>
            <h2 className="text-2xl font-bold text-text-primary">Review & Publish</h2>
            <p className="text-sm text-text-secondary mt-1">
              Review your krawl details before publishing
            </p>
          </div>

          {/* Basic Information Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-text-primary">
                Basic Information
              </h3>
              <button
                onClick={handleEditBasicInfo}
                className="text-primary-green text-sm font-medium hover:underline"
                type="button"
              >
                Edit
              </button>
            </div>
            {basicInfo && (
              <div className="bg-bg-light rounded-lg p-4 space-y-3">
                {/* Cover Image Placeholder */}
                <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                  <div className="text-center text-text-tertiary">
                    <div className="text-4xl mb-2">🏔️</div>
                    <p className="text-sm">Cover Image</p>
                  </div>
                </div>

                {/* Krawl Name */}
                <h4 className="text-lg font-bold text-text-primary">
                  {basicInfo.name}
                </h4>

                {/* Description */}
                <p className="text-sm text-text-secondary">
                  {basicInfo.description}
                </p>

                {/* Metadata */}
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500">⭐</span>
                    <span className="text-text-secondary">{basicInfo.difficulty}</span>
                  </div>
                  {routeMetrics && (
                    <>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-primary-green" />
                        <span className="text-text-secondary">
                          {formatDuration(routeMetrics.duration)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Route className="w-4 h-4 text-primary-green" />
                        <span className="text-text-secondary">
                          {formatDistance(routeMetrics.distance)}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Route & Gems Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-text-primary">
                Route & Gems
              </h3>
              <button
                onClick={handleEditRoute}
                className="text-primary-green text-sm font-medium hover:underline"
                type="button"
              >
                Edit
              </button>
            </div>

            {/* Route Visualization Map */}
            <div className="bg-bg-light rounded-lg overflow-hidden">
              <RouteVisualizationMap
                selectedGems={sortedGems}
                className="h-[300px] md:h-[400px]"
              />
            </div>

            {/* Gems List */}
            <div className="space-y-2">
              <p className="text-sm text-text-secondary">
                {sortedGems.length} location{sortedGems.length !== 1 ? "s" : ""} in order of visit
              </p>
              <div className="space-y-2">
                {sortedGems.map((selectedGem, index) => (
                  <div
                    key={selectedGem.gemId}
                    className="bg-bg-light rounded-lg p-3 flex items-start gap-3"
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-green text-white flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="font-semibold text-text-primary truncate">
                        {selectedGem.gem.name}
                      </h5>
                      <p className="text-sm text-text-secondary line-clamp-2 mt-1">
                        {selectedGem.creatorNote}
                      </p>
                      {selectedGem.gem.coordinates && (
                        <div className="flex items-center gap-1 mt-2 text-xs text-text-tertiary">
                          <MapPin className="w-3 h-3" />
                          <span>Location available</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Terms & Conditions */}
          <div className="space-y-2">
            <Checkbox
              label="I agree to the Terms & Conditions and confirm all information provided is accurate"
              checked={termsAccepted}
              onCheckedChange={setTermsAccepted}
              required
            />
          </div>
        </div>
      </div>

      {/* Footer - Publish Button */}
      <div className="shrink-0 p-4 border-t border-border-subtle bg-bg-white">
        <Button
          variant="primary"
          size="lg"
          onClick={handlePublish}
          disabled={!canPublish || isPublishing}
          loading={isPublishing}
          className="w-full"
        >
          {isPublishing ? "Publishing..." : "Publish Krawl"}
        </Button>
        {!termsAccepted && (
          <p className="text-sm text-error text-center mt-2">
            Please accept the Terms & Conditions to publish
          </p>
        )}
      </div>
    </div>
  );
}

