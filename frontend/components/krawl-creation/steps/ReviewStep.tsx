"use client";

import React, { useMemo } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useKrawlCreationStore } from "@/stores/krawl-creation-store";
import { PreviewKrawlHeader } from "@/components/krawls/PreviewKrawlHeader";
import { KrawlInfo } from "@/components/krawls/KrawlInfo";
import { KrawlGemList } from "@/components/krawls/KrawlGemList";
import { KrawlTrailMap } from "@/components/krawls/KrawlTrailMap";
import { KrawlSuccessScreen } from "../SuccessScreen";
import { StepHeader, InfoBanner, LoadingState, ErrorDisplay } from "@/components/shared/creation";
import { validateKrawlReviewData } from "../utils/krawlValidation";
import { useRouteMetrics } from "../hooks/useRouteMetrics";
import { useKrawlPreview } from "../hooks/useKrawlPreview";
import { useKrawlSubmission } from "../hooks/useKrawlSubmission";

interface ReviewStepProps {
  onNext: () => void;
  onBackToPreviousPage: () => void;
  onBackToPreviousStep: () => void;
}

export function ReviewStep({
  onNext,
  onBackToPreviousPage,
  onBackToPreviousStep,
}: ReviewStepProps) {
  const {
    basicInfo,
    selectedGems,
    setCurrentStep,
    currentDraftId,
    deleteDraftFromBackend,
  } = useKrawlCreationStore();

  // Sort gems by order
  const sortedGems = useMemo(() => {
    return [...selectedGems].sort((a, b) => a.order - b.order);
  }, [selectedGems]);

  // Validate data completeness
  const validation = useMemo(() => {
    return validateKrawlReviewData(basicInfo, selectedGems);
  }, [basicInfo, selectedGems]);

  // Calculate route metrics
  const { routeMetrics, isLoading: isLoadingRoute, error: routeError } =
    useRouteMetrics(sortedGems);

  // Create preview krawl
  const previewKrawl = useKrawlPreview({
    basicInfo,
    selectedGems,
    routeMetrics,
  });

  // Handle submission
  const {
    isPublishing,
    submissionError,
    successState,
    handlePublish,
    handleRetry,
    canPublish,
  } = useKrawlSubmission({
    basicInfo,
    sortedGems,
    currentDraftId,
    deleteDraftFromBackend,
    isValid: validation.isValid,
  });

  // Determine loading state (route calculation or preview generation)
  const isLoadingPreview = isLoadingRoute || !previewKrawl;
  const previewError = routeError;

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
                  // Retry route calculation by navigating back to gem selection step
                  setCurrentStep(1);
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
          <Button
            variant="outline"
            size="lg"
            onClick={onBackToPreviousStep}
            disabled={isPublishing}
            className="flex-1 sm:flex-initial sm:min-w-[120px]"
          >
            Back
          </Button>
          <Button
            variant="primary"
            size="lg"
            onClick={handlePublish}
            disabled={!canPublish}
            loading={isPublishing}
            className="flex-1 sm:flex-1"
          >
            {isPublishing ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </div>
    </div>
  );
}
