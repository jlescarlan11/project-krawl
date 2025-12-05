"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
import { ArrowLeft, Edit2, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ProgressDots } from "@/components/onboarding/ProgressDots";
import { useKrawlCreationStore } from "@/stores/krawl-creation-store";
import { SaveDraftButton } from "../SaveDraftButton";
import { KrawlHeader } from "@/components/krawls/KrawlHeader";
import { KrawlInfo } from "@/components/krawls/KrawlInfo";
import { KrawlGemList } from "@/components/krawls/KrawlGemList";
import { KrawlTrailMap } from "@/components/krawls/KrawlTrailMap";
import { getCachedRoute } from "@/lib/map/routingUtils";
import type { KrawlDetail } from "@/types/krawl-detail";
import type { Coordinates } from "@/components/map/gem-types";
import type { KrawlBasicInfo, SelectedGem } from "@/stores/krawl-creation-store";

interface ReviewStepProps {
  onNext: () => void;
  onBack: () => void;
}

/**
 * Convert form data to KrawlDetail format for preview
 */
function createPreviewKrawl(
  basicInfo: KrawlBasicInfo | null,
  selectedGems: SelectedGem[],
  routeMetrics: { distance: number; duration: number } | null
): KrawlDetail | null {
  if (!basicInfo) return null;

  // Sort gems by order
  const sortedGems = [...selectedGems].sort((a, b) => a.order - b.order);

  return {
    id: "preview", // Temporary ID for preview
    name: basicInfo.name,
    description: basicInfo.description,
    fullDescription: basicInfo.description,
    category: basicInfo.category,
    difficulty: basicInfo.difficulty as any,
    coverImage: basicInfo.coverImage,
    gems: sortedGems.map((sg) => sg.gem),
    estimatedDurationMinutes: routeMetrics
      ? Math.round(routeMetrics.duration / 60)
      : undefined,
    estimatedDistanceKm: routeMetrics
      ? routeMetrics.distance / 1000
      : undefined,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Validate data completeness
 */
function validateData(
  basicInfo: KrawlBasicInfo | null,
  selectedGems: SelectedGem[]
): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!basicInfo) {
    errors.push("Basic information is missing");
  } else {
    if (!basicInfo.name || basicInfo.name.trim().length === 0) {
      errors.push("Krawl name is required");
    }
    if (
      !basicInfo.description ||
      basicInfo.description.trim().length < 50
    ) {
      errors.push("Description must be at least 50 characters");
    }
    if (!basicInfo.category || basicInfo.category.trim().length === 0) {
      errors.push("Category is required");
    }
    if (!basicInfo.difficulty || basicInfo.difficulty.trim().length === 0) {
      errors.push("Difficulty is required");
    }
    if (!basicInfo.coverImage || basicInfo.coverImage.trim().length === 0) {
      errors.push("Cover image is required");
    }
  }

  if (selectedGems.length < 2) {
    errors.push("At least 2 gems are required");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function ReviewStep({ onNext, onBack }: ReviewStepProps) {
  const { basicInfo, selectedGems, setCurrentStep } = useKrawlCreationStore();
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isLoadingPreview, setIsLoadingPreview] = useState(true);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [routeMetrics, setRouteMetrics] = useState<{
    distance: number;
    duration: number;
  } | null>(null);

  // Sort gems by order
  const sortedGems = useMemo(() => {
    return [...selectedGems].sort((a, b) => a.order - b.order);
  }, [selectedGems]);

  // Validate data completeness
  const validation = useMemo(() => {
    return validateData(basicInfo, selectedGems);
  }, [basicInfo, selectedGems]);

  // Calculate route metrics
  useEffect(() => {
    setIsLoadingPreview(true);
    setPreviewError(null);

    if (sortedGems.length < 2) {
      setRouteMetrics(null);
      setIsLoadingPreview(false);
      return;
    }

    const calculateMetrics = async () => {
      try {
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
          setIsLoadingPreview(false);
          return;
        }

        const route = await getCachedRoute(waypoints, "walking");
        if (route) {
          setRouteMetrics({
            distance: route.distance,
            duration: route.duration,
          });
        } else {
          setRouteMetrics(null);
        }
      } catch (error) {
        console.error("Error calculating route metrics:", error);
        setPreviewError("Failed to calculate route metrics");
        setRouteMetrics(null);
      } finally {
        setIsLoadingPreview(false);
      }
    };

    calculateMetrics();
  }, [sortedGems]);

  // Create preview KrawlDetail object
  const previewKrawl = useMemo(() => {
    return createPreviewKrawl(basicInfo, selectedGems, routeMetrics);
  }, [basicInfo, selectedGems, routeMetrics]);

  const handleEditBasicInfo = useCallback(() => {
    setCurrentStep(0);
  }, [setCurrentStep]);

  const handleEditRoute = useCallback(() => {
    setCurrentStep(1);
  }, [setCurrentStep]);

  const handlePublish = useCallback(async () => {
    if (
      !termsAccepted ||
      !validation.isValid ||
      !basicInfo ||
      sortedGems.length < 2
    ) {
      return;
    }

    setIsPublishing(true);

    try {
      // TODO: Implement krawl creation API call
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
  }, [
    termsAccepted,
    validation.isValid,
    basicInfo,
    sortedGems,
    routeMetrics,
    onNext,
  ]);

  const canPublish =
    termsAccepted &&
    validation.isValid &&
    basicInfo &&
    sortedGems.length >= 2;

  // Show validation errors if data is incomplete
  if (!validation.isValid) {
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
                <h1 className="text-xl font-bold text-text-primary">
                  Create Krawl
                </h1>
                <ProgressDots total={3} currentIndex={2} />
              </div>
              <p className="text-sm text-text-secondary shrink-0">
                Step 3 of 3
              </p>
            </div>
          </div>
        </header>

        {/* Error State */}
        <div className="flex-1 overflow-y-auto flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-bg-light rounded-lg p-6 space-y-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-error flex-shrink-0" />
              <h2 className="text-lg font-semibold text-text-primary">
                Preview Unavailable
              </h2>
            </div>
            <p className="text-sm text-text-secondary">
              Please complete all required fields before previewing your Krawl:
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm text-text-secondary">
              {validation.errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
            <div className="flex gap-3 pt-4">
              <Button variant="secondary" onClick={onBack} className="flex-1">
                Go Back
              </Button>
              <Button
                variant="primary"
                onClick={() => setCurrentStep(0)}
                className="flex-1"
              >
                Complete Form
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show loading state
  if (isLoadingPreview || !previewKrawl) {
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
                <h1 className="text-xl font-bold text-text-primary">
                  Create Krawl
                </h1>
                <ProgressDots total={3} currentIndex={2} />
              </div>
              <p className="text-sm text-text-secondary shrink-0">
                Step 3 of 3
              </p>
            </div>
          </div>
        </header>

        {/* Loading State */}
        <div className="flex-1 overflow-y-auto flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 text-primary-green animate-spin" />
            <p className="text-sm text-text-secondary">Loading preview...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show preview error
  if (previewError) {
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
                <h1 className="text-xl font-bold text-text-primary">
                  Create Krawl
                </h1>
                <ProgressDots total={3} currentIndex={2} />
              </div>
              <p className="text-sm text-text-secondary shrink-0">
                Step 3 of 3
              </p>
            </div>
          </div>
        </header>

        {/* Error State */}
        <div className="flex-1 overflow-y-auto flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-bg-light rounded-lg p-6 space-y-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-error flex-shrink-0" />
              <h2 className="text-lg font-semibold text-text-primary">
                Preview Error
              </h2>
            </div>
            <p className="text-sm text-text-secondary">{previewError}</p>
            <div className="flex gap-3 pt-4">
              <Button
                variant="secondary"
                onClick={handleEditRoute}
                className="flex-1"
              >
                Edit Route
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  setPreviewError(null);
                  setIsLoadingPreview(true);
                }}
                className="flex-1"
              >
                Retry
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main preview view
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
              <h1 className="text-xl font-bold text-text-primary">
                Create Krawl
              </h1>
              <ProgressDots total={3} currentIndex={2} />
            </div>
            <p className="text-sm text-text-secondary shrink-0">Step 3 of 3</p>
          </div>
        </div>
      </header>

      {/* Preview Content - Using Detail Page Components */}
      <div className="flex-1 overflow-y-auto">
        {/* Review & Publish Heading with Edit Buttons */}
        <div className="p-4 border-b border-border-subtle bg-bg-white sticky top-0 z-10">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h2 className="text-2xl font-bold text-text-primary">
                  Review & Publish
                </h2>
                <p className="text-sm text-text-secondary mt-1">
                  Review your krawl details before publishing
                </p>
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button
                onClick={handleEditBasicInfo}
                className="text-primary-green text-sm font-medium hover:underline flex items-center gap-1"
                type="button"
              >
                <Edit2 className="w-4 h-4" />
                Edit Basic Info
              </button>
              <button
                onClick={handleEditRoute}
                className="text-primary-green text-sm font-medium hover:underline flex items-center gap-1"
                type="button"
              >
                <Edit2 className="w-4 h-4" />
                Edit Route & Gems
              </button>
            </div>
          </div>
        </div>

        {/* Preview Content - Reuse Detail Page Layout */}
        <div className="max-w-7xl mx-auto">
          {/* Krawl Header - Preview Version (with custom onBack) */}
          <div className="relative">
            <KrawlHeader krawl={previewKrawl} onBack={onBack} />
          </div>

          {/* Main Content - Two Column Layout on Desktop */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-4 lg:px-0 mt-6">
            {/* Left Column - Main Content (2/3 width on desktop) */}
            <div className="lg:col-span-2 space-y-6">
              <KrawlInfo krawl={previewKrawl} />
              <KrawlTrailMap krawl={previewKrawl} />
              <KrawlGemList krawl={previewKrawl} />
            </div>

            {/* Right Column - Sidebar (1/3 width on desktop) */}
            <div className="lg:col-span-1 space-y-6">
              {/* Terms & Conditions Card */}
              <div className="bg-bg-white rounded-xl border border-bg-medium shadow-sm p-6">
                <h3 className="text-lg font-semibold text-text-primary mb-4">
                  Terms & Conditions
                </h3>
                <Checkbox
                  label="I agree to the Terms & Conditions and confirm all information provided is accurate"
                  checked={termsAccepted}
                  onCheckedChange={setTermsAccepted}
                  required
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer - Publish Button and Save Draft */}
      <div className="shrink-0 p-4 border-t border-border-subtle bg-bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-3">
            <SaveDraftButton />
            <Button
              variant="primary"
              size="lg"
              onClick={handlePublish}
              disabled={!canPublish || isPublishing}
              loading={isPublishing}
              className="flex-1"
            >
              {isPublishing ? "Publishing..." : "Publish Krawl"}
            </Button>
          </div>
          {!termsAccepted && (
            <p className="text-sm text-error text-center mt-2">
              Please accept the Terms & Conditions to publish
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
