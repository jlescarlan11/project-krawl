"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { RefreshCw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGemCreationStore } from "@/stores/gem-creation-store";
import { StepHeader, InfoBanner, ErrorDisplay } from "@/components/shared/creation";
import { PreviewGemHeader } from "../PreviewGemHeader";
import { GemInfo } from "@/components/gems/GemInfo";
import { transformFormDataToGemDetail } from "../utils/transformFormDataToGemDetail";
import { validatePreviewData } from "../utils/validatePreviewData";
import { createGem, CreateGemRequest } from "@/lib/api/gems";
import { deleteAllDrafts } from "@/lib/api/drafts";
import { ROUTES } from "@/lib/routes";
import { uploadMultipleFiles, type UploadProgress } from "@/lib/cloudinary/upload";
import { cn } from "@/lib/utils";
import { GemDetailSkeleton } from "@/components/gems/GemDetailSkeleton";
import { SuccessScreen } from "../SuccessScreen";
import { useToast } from "@/components";
import { handleApiError, getErrorMessage } from "@/lib/api-error-handler";

/**
 * Props for PreviewStep component
 */
export interface PreviewStepProps {
  onBackToPreviousPage: () => void;
  onBackToPreviousStep: () => void;
}

/**
 * PreviewStep Component
 *
 * Step 5 of gem creation flow: Preview before submission
 * Features:
 * - Displays Gem as it will appear to others
 * - Uses same components as detail page
 * - Edit button to go back to form
 * - Submit button to finalize creation
 * - Validates data completeness
 * - Mobile-responsive
 */
export function PreviewStep({
  onBackToPreviousPage,
  onBackToPreviousStep,
}: PreviewStepProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const { error: toastError } = useToast();
  const {
    location,
    details,
    media,
    clearForm,
    initializeUploadStatuses,
    updatePhotoUploadStatus,
    setUploadedUrls,
    setUploadedPublicIds,
  } = useGemCreationStore();

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<Record<number, number>>({});
  const [successState, setSuccessState] = useState<{
    gemId: string;
    gemName: string;
  } | null>(null);

  // Transform form data to GemDetail format
  const gemDetail = useMemo(() => {
    return transformFormDataToGemDetail(location, details, media, session?.user);
  }, [location, details, media, session?.user]);

  // Cleanup object URLs on unmount (if photos were created from File objects)
  useEffect(() => {
    return () => {
      if (gemDetail?.photos && media?.photos && !media?.uploadedUrls) {
        gemDetail.photos.forEach((photo) => {
          if (photo.url.startsWith('blob:')) {
            URL.revokeObjectURL(photo.url);
          }
        });
      }
    };
  }, [gemDetail, media]);

  // Validate preview data
  const validation = useMemo(() => {
    return validatePreviewData(location, details, media);
  }, [location, details, media]);

  // Use shared API error handler instead of duplicate logic

  /**
   * Handle gem submission
   */
  const handleSubmit = useCallback(async () => {
    // Validate all required data is present
    if (!validation.isValid) {
      const errorMsg = `Please complete all required fields: ${validation.missingFields.join(", ")}`;
      setSubmissionError(errorMsg);
      toastError("Validation Error", errorMsg);
      return;
    }

    if (!location || !details || !media) {
      const errorMsg = "Missing required data. Please go back and complete all steps.";
      setSubmissionError(errorMsg);
      toastError("Missing Data", errorMsg);
      return;
    }

    // Start submission process
    setIsSubmitting(true);
    setSubmissionError(null);
    setUploadProgress({});

    try {
      // Step 1: Upload photos to Cloudinary (if not already uploaded)
      let photoUrls: string[] = [];
      let photoPublicIds: string[] = [];

      if (media.uploadedUrls && media.uploadedUrls.length > 0) {
        // Photos already uploaded, use existing URLs and public IDs
        photoUrls = media.uploadedUrls;
        photoPublicIds = media.uploadedPublicIds || [];
      } else if (media.photos && media.photos.length > 0) {
        // Need to upload photos
        initializeUploadStatuses(media.photos);

        const uploadResult = await uploadMultipleFiles(media.photos, {
          onProgress: (progress: UploadProgress) => {
            setUploadProgress((prev) => ({
              ...prev,
              [progress.fileIndex]: progress.progress,
            }));

            updatePhotoUploadStatus(progress.fileIndex, {
              file: progress.file,
              progress: progress.progress,
              status: progress.status,
              url: progress.url,
              publicId: progress.publicId,
              error: progress.error,
            });
          },
        });

        if (!uploadResult.success || uploadResult.errors.length > 0) {
          // Provide more detailed error information
          const errorDetails = uploadResult.errors
            .map((err) => `${err.file.name}: ${err.error}`)
            .join('; ');
          const errorMsg = uploadResult.errors.length === 1
            ? `Failed to upload photo "${uploadResult.errors[0].file.name}": ${uploadResult.errors[0].error}`
            : `Failed to upload ${uploadResult.errors.length} photo(s). ${errorDetails}`;
          throw new Error(errorMsg);
        }

        photoUrls = uploadResult.results.map((r) => r.url);
        photoPublicIds = uploadResult.results.map((r) => r.publicId);
        
        // Store uploaded URLs and public IDs in store
        setUploadedUrls(photoUrls);
        setUploadedPublicIds(photoPublicIds);
      }

      // Step 2: Create gem via API
      const gemData: CreateGemRequest = {
        name: details.name,
        category: details.category,
        shortDescription: details.shortDescription,
        fullDescription: details.fullDescription || details.shortDescription,
        coordinates: {
          longitude: location.coordinates[0],
          latitude: location.coordinates[1],
        },
        address: location.address,
        photos: photoUrls,
        // Always send photoPublicIds as an array (empty if none) to avoid JSON serialization issues
        photoPublicIds: photoPublicIds.length > 0 ? photoPublicIds : [],
        thumbnailIndex: media.thumbnailIndex || 0,
        culturalSignificance: details.culturalSignificance?.trim() || undefined,
        tags: details.tags && details.tags.length > 0 ? details.tags : undefined,
        hours: details.hours,
        website: details.website,
        phone: details.phone,
      };

      console.log("[Gem Creation] Submitting gem data:", {
        ...gemData,
        photos: `[${gemData.photos.length} URLs]`, // Don't log full URLs
      });

      const createResponse = await createGem(gemData);

      if (createResponse.success && createResponse.gemId) {
        // Success! Delete all drafts and clear form state to start fresh
        try {
          await deleteAllDrafts();
          console.log("[Gem Creation] All drafts deleted after successful gem creation");
        } catch (draftError) {
          // Log error but don't fail the gem creation
          console.error("[Gem Creation] Failed to delete all drafts after gem creation:", draftError);
        }

        // Clear form state so user starts fresh when creating next gem
        // Store gem name before clearing for success screen
        const createdGemName = details.name;
        clearForm();

        // Success! Show success screen
        setSuccessState({
          gemId: createResponse.gemId,
          gemName: createdGemName,
        });
        setIsSubmitting(false);
        // Form is cleared, so when user navigates back to create gem, it will be empty
      } else {
        throw new Error(createResponse.message || "Failed to create gem");
      }
    } catch (error) {
      console.error("Gem creation error:", error);
      // Use shared API error handler
      const apiError = await handleApiError(error);
      const errorMessage = getErrorMessage(apiError);
      setSubmissionError(errorMessage);
      toastError("Submission Failed", errorMessage);
      setIsSubmitting(false);
      setUploadProgress({});
    }
  }, [
    validation,
    location,
    details,
    media,
    initializeUploadStatuses,
    updatePhotoUploadStatus,
    setUploadedUrls,
    setUploadedPublicIds,
    toastError,
  ]);

  // Show success screen if submission was successful
  if (successState) {
    return <SuccessScreen gemId={successState.gemId} gemName={successState.gemName} />;
  }

  // Show loading skeleton if data is incomplete
  if (!gemDetail) {
    return (
      <div className="flex flex-col h-dvh bg-bg-white">
        <StepHeader
          title="Preview"
          totalSteps={5}
          currentStep={4}
          onBack={onBackToPreviousPage}
        />

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <ErrorDisplay
              title="Incomplete Data"
              subtitle="Please complete all required steps before previewing."
              message={validation.missingFields}
              variant="warning"
            />
            <GemDetailSkeleton />
          </div>
        </div>

        {/* Footer */}
        <div className="shrink-0 p-4 border-t border-border-subtle bg-bg-white">
          <div className="flex flex-row gap-3 items-center">
            <Button variant="outline" size="lg" onClick={onBackToPreviousStep} className="flex-1 sm:flex-initial sm:min-w-[120px]">
              Back
            </Button>
            <Button variant="primary" size="lg" disabled className="flex-1 sm:flex-1">
              Submit
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-dvh bg-bg-white">
      <StepHeader
        title="Preview"
        totalSteps={5}
        currentStep={4}
        onBack={onBackToPreviousPage}
      />

      {/* Preview Banner */}
      <div className="shrink-0 p-4 border-b border-border-subtle bg-bg-white">
        <InfoBanner message="This is how your Gem will appear to others" />
      </div>

      {/* Content Area (Scrollable) */}
      <div className="flex-1 overflow-y-auto">
        {/* Validation Errors */}
        {!validation.isValid && (
          <div className="p-4">
            <ErrorDisplay
              title="Please fix the following issues:"
              message={[
                ...(validation.missingFields.length > 0
                  ? [`Missing fields: ${validation.missingFields.join(", ")}`]
                  : []),
                ...validation.errors,
              ]}
              variant="warning"
            />
          </div>
        )}

        {/* Submission Error */}
        {submissionError && (
          <div className="p-4">
            <ErrorDisplay
              title="Submission Failed"
              message={submissionError}
              variant="error"
              actions={
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleSubmit}
                  disabled={isSubmitting || !validation.isValid}
                  icon={<RefreshCw className="w-4 h-4" />}
                  iconPosition="left"
                >
                  Retry Submission
                </Button>
              }
            />
          </div>
        )}

        {/* Preview Content - Non-interactive */}
        <div className="pointer-events-none">
          <article>
            {/* Header Section - Full Width */}
            <PreviewGemHeader gem={gemDetail} />

            {/* Main Content - Full Width (Location Map is already in GemInfo) */}
            <div className="max-w-7xl mx-auto px-4 mt-6 pb-4 sm:pb-8">
              <GemInfo gem={gemDetail} isPreview={true} />
            </div>
          </article>
        </div>
      </div>

      {/* Footer - Action Buttons (Sticky on mobile) */}
      <div className="shrink-0 p-4 border-t border-border-subtle bg-bg-white sticky bottom-0 z-10">
        <div className="flex flex-row gap-3 items-center">
          <Button
            variant="outline"
            size="lg"
            onClick={onBackToPreviousStep}
            disabled={isSubmitting}
            className="flex-1 sm:flex-initial sm:min-w-[120px]"
          >
            Back
          </Button>
          <Button
            variant="primary"
            size="lg"
            onClick={handleSubmit}
            disabled={!validation.isValid || isSubmitting}
            className="flex-1 sm:flex-1"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>
                  {Object.keys(uploadProgress).length > 0
                    ? "Uploading Photos..."
                    : "Creating Gem..."}
                </span>
              </span>
            ) : (
              "Submit"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

