"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useKrawlCreationStore } from "@/stores/krawl-creation-store";
import { PreviewKrawlHeader } from "@/components/krawls/PreviewKrawlHeader";
import { KrawlInfo } from "@/components/krawls/KrawlInfo";
import { KrawlGemList } from "@/components/krawls/KrawlGemList";
import { KrawlTrailMap } from "@/components/krawls/KrawlTrailMap";
import { getCachedRoute } from "@/lib/map/routingUtils";
import { createKrawl, type CreateKrawlRequest } from "@/lib/api/krawls";
import { useToast } from "@/components";
import { handleApiError, getErrorMessage } from "@/lib/api-error-handler";
import { KrawlSuccessScreen } from "../SuccessScreen";
import { StepHeader, InfoBanner, LoadingState, ErrorDisplay } from "@/components/shared/creation";
import type { KrawlDetail } from "@/types/krawl-detail";
import type { Coordinates } from "@/components/map/gem-types";
import type { KrawlBasicInfo, SelectedGem } from "@/stores/krawl-creation-store";

interface ReviewStepProps {
  onNext: () => void;
  onBackToPreviousPage: () => void;
  onBackToPreviousStep: () => void;
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

  const previewKrawl: KrawlDetail = {
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
  
  return previewKrawl;
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

export function ReviewStep({
  onNext,
  onBackToPreviousPage,
  onBackToPreviousStep,
}: ReviewStepProps) {
  const { basicInfo, selectedGems, setCurrentStep, clearForm, currentDraftId, deleteDraftFromBackend } = useKrawlCreationStore();
  const { error: toastError } = useToast();
  const [isPublishing, setIsPublishing] = useState(false);
  const [isLoadingPreview, setIsLoadingPreview] = useState(true);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [successState, setSuccessState] = useState<{
    krawlId: string;
    krawlName: string;
  } | null>(null);
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


  const handlePublish = useCallback(async () => {
    if (
      !validation.isValid ||
      !basicInfo ||
      sortedGems.length < 2
    ) {
      return;
    }

    setIsPublishing(true);
    setSubmissionError(null);

    try {
      // Ensure coverImage is present (should be validated already)
      if (!basicInfo.coverImage) {
        throw new Error("Cover image is required");
      }

      // Prepare krawl data for API
      const krawlData: CreateKrawlRequest = {
        name: basicInfo.name,
        description: basicInfo.description,
        fullDescription: basicInfo.description, // Use description as full description if not provided
        category: basicInfo.category,
        difficulty: basicInfo.difficulty,
        coverImage: basicInfo.coverImage,
        coverImagePublicId: basicInfo.coverImagePublicId,
        gems: sortedGems.map((sg) => ({
          gemId: sg.gemId,
          sequenceOrder: sg.order + 1, // Backend expects 1-based order
          creatorNote: sg.creatorNote,
          lokalSecret: sg.lokalSecret,
        })),
        tags: [], // Tags can be added later if needed
      };

      console.log("[Krawl Creation] Submitting krawl data:", {
        name: krawlData.name,
        category: krawlData.category,
        gemCount: krawlData.gems.length,
      });

      const createResponse = await createKrawl(krawlData);

      if (createResponse.success && createResponse.krawlId) {
        // Success! Delete current draft if it exists
        if (currentDraftId) {
          try {
            await deleteDraftFromBackend(currentDraftId);
            console.log("[Krawl Creation] Draft deleted after successful krawl creation");
          } catch (draftError) {
            // Log error but don't fail the krawl creation
            console.error("[Krawl Creation] Failed to delete draft after krawl creation:", draftError);
          }
        }

        // Store krawl name before clearing form
        const createdKrawlName = basicInfo.name;
        
        // Clear form state so user starts fresh when creating next krawl
        clearForm();

        // Show success screen
        setSuccessState({
          krawlId: createResponse.krawlId,
          krawlName: createdKrawlName,
        });
        setIsPublishing(false);
      } else {
        throw new Error(createResponse.message || "Failed to create krawl");
      }
    } catch (error) {
      console.error("[Krawl Creation] Error publishing krawl:", error);
      
      // Handle error using API error handler
      const apiError = await handleApiError(error);
      const errorMessage = getErrorMessage(apiError);
      
      setSubmissionError(errorMessage);
      toastError("Submission Failed", errorMessage);
      setIsPublishing(false);
    }
  }, [
    validation.isValid,
    basicInfo,
    sortedGems,
    currentDraftId,
    deleteDraftFromBackend,
    clearForm,
    toastError,
  ]);

  const handleRetry = useCallback(() => {
    setSubmissionError(null);
    handlePublish();
  }, [handlePublish]);

  const canPublish =
    validation.isValid &&
    basicInfo &&
    sortedGems.length >= 2 &&
    !isPublishing;

  // Show success screen if submission was successful
  if (successState) {
    return (
      <KrawlSuccessScreen
        krawlId={successState.krawlId}
        krawlName={successState.krawlName}
      />
    );
  }

  // Show validation errors if data is incomplete
  if (!validation.isValid) {
    return (
      <div className="flex flex-col h-dvh bg-bg-white">
        <StepHeader
          title="Create Krawl"
          totalSteps={3}
          currentStep={2}
          onBack={onBackToPreviousPage}
        />
        <ErrorDisplay
          title="Preview Unavailable"
          subtitle="Please complete all required fields before previewing your Krawl:"
          message={validation.errors}
          centered
          actions={
            <>
              <Button variant="secondary" onClick={onBackToPreviousStep} className="flex-1">
                Go Back
              </Button>
              <Button
                variant="primary"
                onClick={() => setCurrentStep(0)}
                className="flex-1"
              >
                Complete Form
              </Button>
            </>
          }
        />
      </div>
    );
  }

  // Show loading state
  if (isLoadingPreview || !previewKrawl) {
    return (
      <div className="flex flex-col h-dvh bg-bg-white">
        <StepHeader
          title="Create Krawl"
          totalSteps={3}
          currentStep={2}
          onBack={onBackToPreviousPage}
        />
        <LoadingState message="Loading preview..." fullScreen />
      </div>
    );
  }

  // Show preview error
  if (previewError) {
    return (
      <div className="flex flex-col h-dvh bg-bg-white">
        <StepHeader
          title="Create Krawl"
          totalSteps={3}
          currentStep={2}
          onBack={onBackToPreviousPage}
        />
        <ErrorDisplay
          title="Preview Error"
          message={previewError}
          centered
          actions={
            <>
              <Button
                variant="secondary"
                onClick={() => setCurrentStep(1)}
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
            </>
          }
        />
      </div>
    );
  }

  // Main preview view
  return (
    <div className="flex flex-col h-dvh bg-bg-white">
      <StepHeader
        title="Create Krawl"
        totalSteps={3}
        currentStep={2}
        onBack={onBackToPreviousPage}
      />

      {/* Preview Banner */}
      <div className="shrink-0 p-4 border-b border-border-subtle bg-bg-white">
        <InfoBanner message="This is how your Krawl will appear to others" />
      </div>

      {/* Preview Content - Using Detail Page Components */}
      <div className="flex-1 overflow-y-auto">
        {/* Preview Content - Non-interactive */}
        <div className="pointer-events-none">
          {/* Krawl Header - Preview Version (Full Width) */}
          <div className="relative w-full">
            <PreviewKrawlHeader krawl={previewKrawl} />
          </div>

          <div className="max-w-7xl mx-auto">
            {/* Main Content - Full Width Layout */}
            <div className="px-4 lg:px-0 mt-6">
              <div className="space-y-6">
                <KrawlInfo krawl={previewKrawl} />
                <KrawlTrailMap krawl={previewKrawl} isPreview={true} />
                <KrawlGemList krawl={previewKrawl} title="Route & Gems" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer - Back and Submit Buttons */}
      <div className="shrink-0 p-4 border-t border-border-subtle bg-bg-white">
        {/* Error Message */}
        {submissionError && (
          <div className="max-w-7xl mx-auto mb-4">
            <div className="p-4 bg-error/10 border border-error/20 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-error mb-1">
                    Submission Failed
                  </h3>
                  <p className="text-sm text-text-secondary mb-3">
                    {submissionError}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRetry}
                    icon={<RefreshCw className="w-4 h-4" />}
                    iconPosition="left"
                  >
                    Retry Submission
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-row gap-3 items-center">
          <div className="relative min-w-0 flex-1 flex sm:flex-initial sm:min-w-[120px]">
            <Button
              variant="outline"
              size="lg"
              onClick={onBackToPreviousStep}
              disabled={isPublishing}
              className="flex-1 sm:flex-initial sm:min-w-[120px] min-w-0"
            >
              Back
            </Button>
          </div>
          <div className="relative flex-1 sm:flex-1 min-w-0 flex">
            <Button
              variant="primary"
              size="lg"
              onClick={handlePublish}
              disabled={!canPublish}
              loading={isPublishing}
              className="w-full"
            >
              {isPublishing ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
