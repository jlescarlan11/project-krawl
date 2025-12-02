"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ProgressDots } from "@/components/onboarding/ProgressDots";
import { TagInput } from "../TagInput";
import { UploadProgressIndicator } from "../UploadProgressIndicator";
import { useGemCreationStore, PhotoUploadStatus } from "@/stores/gem-creation-store";
import {
  validateCulturalSignificance,
  validateGemTags,
  getCharacterCountColor,
} from "@/lib/validation/gem-validation";
import { getTagSuggestionsByCategory } from "@/lib/constants/gem-tag-suggestions";
import { uploadMultipleFiles, retryUpload, type UploadProgress } from "@/lib/cloudinary/upload";
import { createGem } from "@/lib/api/gems";
import { ROUTES } from "@/lib/routes";

/**
 * Props for AdditionalDetailsStep component
 */
export interface AdditionalDetailsStepProps {
  onNext: () => void;
  onBack: () => void;
}

/**
 * AdditionalDetailsStep Component
 *
 * Step 4 of gem creation flow: Additional optional details
 * Features:
 * - Cultural significance textarea (max 300 characters, optional)
 * - Tags/keywords input with autocomplete (max 5 tags, optional)
 * - Category-based tag suggestions
 * - Character counter with color-coded warnings
 * - Real-time validation
 * - Form data persistence via Zustand
 */
export function AdditionalDetailsStep({
  onNext,
  onBack,
}: AdditionalDetailsStepProps) {
  const router = useRouter();
  const {
    details,
    setDetails,
    location,
    media,
    initializeUploadStatuses,
    updatePhotoUploadStatus,
    clearForm,
  } = useGemCreationStore();

  // Form state
  const [culturalSignificance, setCulturalSignificance] = useState(
    details?.culturalSignificance || ""
  );
  const [tags, setTags] = useState<string[]>(details?.tags || []);

  // Validation state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState({
    culturalSignificance: false,
  });

  // Upload & submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadStatuses, setUploadStatuses] = useState<PhotoUploadStatus[]>([]);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  // Get tag suggestions based on selected category
  const tagSuggestions = useMemo(() => {
    if (!details?.category) return [];
    return getTagSuggestionsByCategory(details.category);
  }, [details?.category]);

  // Character counter color for cultural significance
  const culturalSigCounterColor = useMemo(() => {
    return getCharacterCountColor(culturalSignificance.length, 300, 270);
  }, [culturalSignificance.length]);

  /**
   * Validate all fields
   */
  const validateFields = useCallback(() => {
    const newErrors: Record<string, string> = {};

    const culturalError = validateCulturalSignificance(culturalSignificance);
    if (culturalError) newErrors.culturalSignificance = culturalError;

    const tagsError = validateGemTags(tags);
    if (tagsError) newErrors.tags = tagsError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [culturalSignificance, tags]);

  /**
   * Run validation on field changes
   */
  useEffect(() => {
    validateFields();
  }, [validateFields]);

  /**
   * Handle field blur (mark as touched)
   */
  const handleBlur = (field: keyof typeof touched) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  /**
   * Check if should show error for a field
   */
  const shouldShowError = (field: keyof typeof touched): boolean => {
    return touched[field] && !!errors[field];
  };

  /**
   * Form is always valid since all fields are optional
   * Only show validation errors, but don't block submission
   */
  const canProceed = !isSubmitting;

  /**
   * Handle retry for failed upload
   */
  const handleRetryUpload = useCallback(
    async (fileIndex: number) => {
      if (!media?.photos[fileIndex]) return;

      const file = media.photos[fileIndex];

      // Update status to uploading
      setUploadStatuses((prev) => {
        const updated = [...prev];
        updated[fileIndex] = {
          file,
          progress: 0,
          status: 'uploading',
        };
        return updated;
      });

      // Retry upload
      const result = await retryUpload(file, fileIndex, {
        onProgress: (progress: UploadProgress) => {
          setUploadStatuses((prev) => {
            const updated = [...prev];
            updated[fileIndex] = {
              file: progress.file,
              progress: progress.progress,
              status: progress.status,
              url: progress.url,
              error: progress.error,
            };
            return updated;
          });
        },
      });

      if (!result.success) {
        setSubmissionError(`Failed to upload ${file.name}. Please try again.`);
      }
    },
    [media?.photos]
  );

  /**
   * Handle gem submission (upload photos + create gem)
   */
  const handleSubmit = useCallback(async () => {
    // Validate all required data is present
    if (!location || !details || !media || !media.photos || media.photos.length === 0) {
      setSubmissionError('Missing required data. Please go back and complete all steps.');
      return;
    }

    // Mark all fields as touched to show any validation errors
    setTouched({ culturalSignificance: true });

    // Save additional details to store
    setDetails({
      ...details,
      culturalSignificance: culturalSignificance.trim() || undefined,
      tags: tags.length > 0 ? tags : [],
    });

    // Start submission process
    setIsSubmitting(true);
    setSubmissionError(null);

    // Initialize upload statuses
    const initialStatuses: PhotoUploadStatus[] = media.photos.map((file) => ({
      file,
      progress: 0,
      status: 'pending',
    }));
    setUploadStatuses(initialStatuses);
    initializeUploadStatuses(media.photos);

    try {
      // Step 1: Upload photos to Cloudinary
      const uploadResult = await uploadMultipleFiles(media.photos, {
        onProgress: (progress: UploadProgress) => {
          setUploadStatuses((prev) => {
            const updated = [...prev];
            updated[progress.fileIndex] = {
              file: progress.file,
              progress: progress.progress,
              status: progress.status,
              url: progress.url,
              error: progress.error,
            };
            return updated;
          });

          updatePhotoUploadStatus(progress.fileIndex, {
            file: progress.file,
            progress: progress.progress,
            status: progress.status,
            url: progress.url,
            error: progress.error,
          });
        },
      });

      // Check if all uploads succeeded
      if (!uploadResult.success || uploadResult.errors.length > 0) {
        setSubmissionError(
          `Failed to upload ${uploadResult.errors.length} photo(s). Please retry failed uploads.`
        );
        setIsSubmitting(false);
        return;
      }

      // Get uploaded URLs in correct order
      const photoUrls = uploadResult.results.map((r) => r.url);

      // Step 2: Create gem via API
      const gemData = {
        name: details.name,
        category: details.category,
        shortDescription: details.shortDescription,
        fullDescription: (details.fullDescription?.trim() || details.shortDescription), // Fallback to shortDescription if empty
        coordinates: {
          longitude: location.coordinates[0],
          latitude: location.coordinates[1],
        },
        address: location.address,
        photos: photoUrls,
        thumbnailIndex: media.thumbnailIndex,
        culturalSignificance: culturalSignificance.trim() || undefined,
        tags: tags.length > 0 ? tags : undefined,
      };

      console.log('[Gem Creation] Submitting gem data:', {
        ...gemData,
        photos: `[${gemData.photos.length} URLs]`, // Don't log full URLs
      });

      const createResponse = await createGem(gemData);

      if (createResponse.success) {
        // Success! Clear form and redirect to gem detail
        clearForm();
        router.push(ROUTES.GEM_DETAIL(createResponse.gemId));
      } else {
        throw new Error(createResponse.message || 'Failed to create gem');
      }
    } catch (error) {
      console.error('Gem creation error:', error);
      setSubmissionError(
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred. Please try again.'
      );
      setIsSubmitting(false);
    }
  }, [
    location,
    details,
    media,
    culturalSignificance,
    tags,
    setDetails,
    initializeUploadStatuses,
    updatePhotoUploadStatus,
    clearForm,
    router,
  ]);

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
              <h1 className="text-xl font-bold text-text-primary">
                Additional Details
              </h1>
            </div>
            <p className="text-sm text-text-secondary absolute right-0">
              Step 4 of 4
            </p>
          </div>
          <ProgressDots total={4} currentIndex={3} />
        </div>
      </header>

      {/* Content Area (Scrollable) */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-6">
          {/* Upload Progress Indicator */}
          {isSubmitting && uploadStatuses.length > 0 && (
            <div className="bg-bg-light border border-border-subtle rounded-lg p-4">
              <UploadProgressIndicator
                uploadStatuses={uploadStatuses}
                onRetry={handleRetryUpload}
              />
            </div>
          )}

          {/* Submission Error */}
          {submissionError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-800 font-medium">{submissionError}</p>
            </div>
          )}

          {/* Cultural Significance Textarea */}
          <div className="space-y-2">
            <Textarea
              label="Cultural Significance (Optional)"
              value={culturalSignificance}
              onChange={(e) => setCulturalSignificance(e.target.value)}
              onBlur={() => handleBlur("culturalSignificance")}
              error={
                shouldShowError("culturalSignificance")
                  ? errors.culturalSignificance
                  : undefined
              }
              placeholder="Share why this place is culturally significant..."
              helperText="Describe the cultural, historical, or social importance of this gem to the community."
              rows={5}
              resize="none"
              maxLength={301} // Allow typing to 301 to show error
            />
            {/* Character Counter */}
            <div className="flex justify-end">
              <span
                className={cn("text-xs font-medium", culturalSigCounterColor)}
              >
                {culturalSignificance.length}/300
              </span>
            </div>
          </div>

          {/* Tags/Keywords Input */}
          <TagInput
            label="Tags / Keywords (Optional)"
            value={tags}
            onChange={setTags}
            suggestions={tagSuggestions}
            maxTags={5}
            error={errors.tags}
            helperText="Add up to 5 tags to help people discover this gem. Suggestions are based on your selected category."
          />

          {/* Tips Section */}
          <div className="bg-bg-light rounded-lg p-4">
            <h3 className="font-semibold text-text-primary mb-3">
              Tips for Adding Details
            </h3>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li className="flex items-start gap-2">
                <span className="text-primary-green mt-0.5">•</span>
                <span>
                  Use tags that describe the vibe, activities, or unique features
                  (e.g., "romantic", "family-friendly", "historic")
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-green mt-0.5">•</span>
                <span>
                  Tags help others discover your gem when searching or filtering
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-green mt-0.5">•</span>
                <span>
                  Cultural significance can include historical context, traditions,
                  local stories, or community importance
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-green mt-0.5">•</span>
                <span>
                  Both fields are optional - add them if you have relevant
                  information to share
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer - Submit Button */}
      <div className="shrink-0 p-4 border-t border-border-subtle bg-bg-white">
        <Button
          variant="primary"
          size="lg"
          onClick={handleSubmit}
          disabled={!canProceed}
          className="w-full"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              {uploadStatuses.some((s) => s.status === 'uploading')
                ? 'Uploading Photos...'
                : 'Creating Gem...'}
            </>
          ) : (
            'Submit Gem'
          )}
        </Button>
      </div>
    </div>
  );
}
