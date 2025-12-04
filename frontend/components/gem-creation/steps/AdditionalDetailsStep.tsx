"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ProgressDots } from "@/components/onboarding/ProgressDots";
import { TagInput } from "../TagInput";
import { useGemCreationStore } from "@/stores/gem-creation-store";
import {
  validateCulturalSignificance,
  validateGemTags,
  getCharacterCountColor,
} from "@/lib/validation/gem-validation";
import { getTagSuggestionsByCategory } from "@/lib/constants/gem-tag-suggestions";

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
  const {
    details,
    setDetails,
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

  // Form state only (submission handled in PreviewStep)

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
   * Handle cultural significance change (real-time validation)
   */
  const handleCulturalSignificanceChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCulturalSignificance(e.target.value);
      // Mark as touched on change for immediate feedback
      if (!touched.culturalSignificance) {
        setTouched((prev) => ({ ...prev, culturalSignificance: true }));
      }
    },
    [touched.culturalSignificance]
  );

  /**
   * Handle tags change (real-time validation)
   */
  const handleTagsChange = useCallback((newTags: string[]) => {
    setTags(newTags);
  }, []);

  /**
   * Check if should show error for a field
   */
  const shouldShowError = (field: keyof typeof touched): boolean => {
    return touched[field] && !!errors[field];
  };

  /**
   * Check if field is valid (for success indicators)
   */
  const isFieldValid = (
    field: keyof typeof touched,
    value: string | string[]
  ): boolean => {
    if (!touched[field]) return false;
    if (field === "culturalSignificance") {
      return (
        !errors[field] &&
        typeof value === "string" &&
        value.trim().length > 0
      );
    }
    return !errors[field];
  };

  /**
   * Form is always valid since all fields are optional
   * Can proceed to preview at any time
   */
  const canProceed = true;

  /**
   * Handle next (go to preview)
   */
  const handleNext = useCallback(() => {
    // Mark all fields as touched to show any validation errors
    setTouched({ culturalSignificance: true });

    // Ensure details exists (should be set in Step 2)
    if (!details) {
      console.error("Details not found - cannot proceed to preview");
      return;
    }

    // Save additional details to store before navigating to preview
    setDetails({
      ...details,
      culturalSignificance: culturalSignificance.trim() || undefined,
      tags: tags.length > 0 ? tags : [],
    });

    // Navigate to preview step
    onNext();
  }, [culturalSignificance, tags, details, setDetails, onNext]);

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
                Additional Details
              </h1>
              <ProgressDots total={5} currentIndex={3} />
            </div>
            <p className="text-sm text-text-secondary shrink-0">
              Step 4 of 5
            </p>
          </div>
        </div>
      </header>

      {/* Content Area (Scrollable) */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-6">
          {/* Cultural Significance Textarea */}
          <div className="space-y-2">
            <Textarea
              label="Cultural Significance (Optional)"
              value={culturalSignificance}
              onChange={handleCulturalSignificanceChange}
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
            <div className="flex justify-end items-center gap-2">
              {isFieldValid("culturalSignificance", culturalSignificance) && (
                <CheckCircle className="w-4 h-4 text-success" />
              )}
              <span
                className={cn("text-xs font-medium", culturalSigCounterColor)}
              >
                {culturalSignificance.length}/300
              </span>
            </div>
          </div>

          {/* Tags/Keywords Input */}
          <div className="space-y-2">
            <TagInput
              label="Tags / Keywords (Optional)"
              value={tags}
              onChange={handleTagsChange}
              suggestions={tagSuggestions}
              maxTags={5}
              error={errors.tags}
              helperText="Add up to 5 tags to help people discover this gem. Suggestions are based on your selected category."
            />
            {/* Success Indicator for Tags */}
            {tags.length > 0 &&
              !errors.tags &&
              tags.length <= 5 && (
                <div className="flex items-center gap-2 text-sm text-success">
                  <CheckCircle className="w-4 h-4" />
                  <span>{tags.length} tag{tags.length !== 1 ? "s" : ""} added</span>
                </div>
              )}
          </div>

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

      {/* Footer - Back and Preview Buttons */}
      <div className="shrink-0 p-4 border-t border-border-subtle bg-bg-white">
        <div className="flex flex-row gap-3 items-center">
          <Button
            variant="outline"
            size="lg"
            onClick={onBack}
            className="flex-1 sm:flex-initial sm:min-w-[120px]"
          >
            Back
          </Button>
          <Button
            variant="primary"
            size="lg"
            onClick={handleNext}
            disabled={!canProceed}
            className="flex-1 sm:flex-1"
          >
            Preview
          </Button>
        </div>
      </div>
    </div>
  );
}
