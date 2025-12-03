"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ArrowLeft, Loader2, Edit, AlertCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProgressDots } from "@/components/onboarding/ProgressDots";
import { useGemCreationStore } from "@/stores/gem-creation-store";
import { PreviewGemHeader } from "../PreviewGemHeader";
import { GemInfo } from "@/components/gems/GemInfo";
import { transformFormDataToGemDetail } from "../utils/transformFormDataToGemDetail";
import { validatePreviewData } from "../utils/validatePreviewData";
import { createGem, CreateGemRequest } from "@/lib/api/gems";
import { ROUTES } from "@/lib/routes";
import { uploadMultipleFiles, type UploadProgress } from "@/lib/cloudinary/upload";
import { cn } from "@/lib/utils";
import { GemDetailSkeleton } from "@/components/gems/GemDetailSkeleton";

/**
 * Props for PreviewStep component
 */
export interface PreviewStepProps {
  onBack: () => void;
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
export function PreviewStep({ onBack }: PreviewStepProps) {
  const router = useRouter();
  const { data: session } = useSession();
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

  /**
   * Handle gem submission
   */
  const handleSubmit = useCallback(async () => {
    // Validate all required data is present
    if (!validation.isValid) {
      setSubmissionError(
        `Please complete all required fields: ${validation.missingFields.join(", ")}`
      );
      return;
    }

    if (!location || !details || !media) {
      setSubmissionError("Missing required data. Please go back and complete all steps.");
      return;
    }

    // Start submission process
    setIsSubmitting(true);
    setSubmissionError(null);

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
          throw new Error(
            `Failed to upload ${uploadResult.errors.length} photo(s). Please try again.`
          );
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
        photoPublicIds: photoPublicIds.length > 0 ? photoPublicIds : undefined,
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

      if (createResponse.success) {
        // Success! Clear form and redirect to gem detail
        clearForm();
        router.push(ROUTES.GEM_DETAIL(createResponse.gemId));
      } else {
        throw new Error(createResponse.message || "Failed to create gem");
      }
    } catch (error) {
      console.error("Gem creation error:", error);
      setSubmissionError(
        error instanceof Error
          ? error.message
          : "An unexpected error occurred. Please try again."
      );
      setIsSubmitting(false);
    }
  }, [
    validation,
    location,
    details,
    media,
    initializeUploadStatuses,
    updatePhotoUploadStatus,
    clearForm,
    router,
  ]);

  // Show loading skeleton if data is incomplete
  if (!gemDetail) {
    return (
      <div className="flex flex-col h-dvh bg-bg-white">
        {/* Header */}
        <header className="shrink-0 border-b border-border-subtle bg-bg-white">
          <div className="p-4">
            <div className="flex items-center mb-3 relative">
              <button
                onClick={onBack}
                className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-bg-light transition-colors absolute left-0"
                aria-label="Go back"
                type="button"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex-1 text-center">
                <h1 className="text-xl font-bold text-text-primary">Preview</h1>
              </div>
              <p className="text-sm text-text-secondary absolute right-0">Step 5 of 5</p>
            </div>
            <ProgressDots total={5} currentIndex={4} />
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-yellow-800 mb-1">
                    Incomplete Data
                  </p>
                  <p className="text-sm text-yellow-700">
                    Please complete all required steps before previewing.
                  </p>
                  {validation.missingFields.length > 0 && (
                    <ul className="mt-2 list-disc list-inside text-sm text-yellow-700">
                      {validation.missingFields.map((field) => (
                        <li key={field}>{field}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
            <GemDetailSkeleton />
          </div>
        </div>

        {/* Footer */}
        <div className="shrink-0 p-4 border-t border-border-subtle bg-bg-white">
          <div className="flex flex-row gap-3 items-center">
            <Button variant="outline" size="lg" onClick={onBack} className="flex-1 sm:flex-initial sm:min-w-[120px]">
              Edit
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
              <h1 className="text-xl font-bold text-text-primary">Preview</h1>
              <ProgressDots total={5} currentIndex={4} />
            </div>
            <p className="text-sm text-text-secondary shrink-0">Step 5 of 5</p>
          </div>
        </div>
      </header>

      {/* Preview Banner */}
      <div className="shrink-0 p-4 border-b border-border-subtle bg-bg-white">
        <div className="flex items-start gap-2 p-3 bg-primary-green/5 border border-primary-green/20 rounded-lg">
          <Info className="w-4 h-4 text-primary-green shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-xs text-text-secondary leading-relaxed">
              This is how your Gem will appear to others
            </p>
          </div>
        </div>
      </div>

      {/* Content Area (Scrollable) */}
      <div className="flex-1 overflow-y-auto">
        {/* Validation Errors */}
        {!validation.isValid && (
          <div className="p-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-yellow-800 mb-1">
                    Please fix the following issues:
                  </p>
                  {validation.missingFields.length > 0 && (
                    <div className="mb-2">
                      <p className="text-xs font-medium text-yellow-700 mb-1">
                        Missing fields:
                      </p>
                      <ul className="list-disc list-inside text-xs text-yellow-700">
                        {validation.missingFields.map((field) => (
                          <li key={field}>{field}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {validation.errors.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-yellow-700 mb-1">Errors:</p>
                      <ul className="list-disc list-inside text-xs text-yellow-700">
                        {validation.errors.map((error) => (
                          <li key={error}>{error}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Submission Error */}
        {submissionError && (
          <div className="p-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-800 font-medium">{submissionError}</p>
            </div>
          </div>
        )}

        {/* Preview Content - Non-interactive */}
        <div className="pointer-events-none">
          <article>
            {/* Header Section - Full Width */}
            <PreviewGemHeader gem={gemDetail} />

            {/* Main Content - Full Width (Location Map is already in GemInfo) */}
            <div className="max-w-7xl mx-auto px-4 mt-6 pb-4 sm:pb-8">
              <GemInfo gem={gemDetail} />
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
            onClick={onBack}
            disabled={isSubmitting}
            className="flex-1 sm:flex-initial sm:min-w-[120px]"
          >
            Edit
          </Button>
          <Button
            variant="primary"
            size="lg"
            onClick={handleSubmit}
            disabled={!validation.isValid || isSubmitting}
            className="flex-1 sm:flex-1"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                {Object.keys(uploadProgress).length > 0
                  ? "Uploading Photos..."
                  : "Creating Gem..."}
              </>
            ) : (
              "Submit"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

