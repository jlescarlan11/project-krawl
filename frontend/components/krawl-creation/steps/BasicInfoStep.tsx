"use client";

import React, { useState, useCallback, useEffect, useMemo } from "react";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { FileUpload } from "@/components/ui/file-upload";
import { ProgressDots } from "@/components/onboarding/ProgressDots";
import { CategoryChipSelector } from "@/components/gem-creation/CategoryChipSelector";
import { useKrawlCreationStore } from "@/stores/krawl-creation-store";
import {
  validateKrawlName,
  validateKrawlDescription,
  validateKrawlCategory,
  validateKrawlDifficulty,
  validateCoverImageFile,
  validateCoverImageUrl,
  getCharacterCountColor,
} from "@/lib/validation/krawl-validation";
import { uploadKrawlCoverImage } from "@/lib/cloudinary/upload";
import { GEM_CATEGORIES } from "@/lib/constants/gem-categories";
import type { DifficultyLevel } from "@/lib/difficulty";

/**
 * Props for BasicInfoStep component
 */
export interface BasicInfoStepProps {
  onNext: () => void;
  onBackToPreviousPage: () => void;
  onBackToPreviousStep: () => void;
}

/**
 * Difficulty level options
 */
const DIFFICULTY_OPTIONS: { value: DifficultyLevel; label: string }[] = [
  { value: "Easy", label: "Easy" },
  { value: "Medium", label: "Medium" },
  { value: "Hard", label: "Hard" },
  { value: "Expert", label: "Expert" },
];

/**
 * BasicInfoStep Component
 *
 * Step 1 of krawl creation flow: Basic information collection
 * Features:
 * - Krawl name input (max 100 characters)
 * - Description textarea (min 50, max 500 characters)
 * - Category selection (dropdown)
 * - Difficulty level selection (dropdown: Easy/Medium/Hard/Expert)
 * - Character counters with color-coded warnings
 * - Real-time validation
 * - Form data persistence via Zustand
 */
export function BasicInfoStep({
  onNext,
  onBackToPreviousPage,
  onBackToPreviousStep,
}: BasicInfoStepProps) {
  const { basicInfo, setBasicInfo } = useKrawlCreationStore();

  // Form state
  const [name, setName] = useState(basicInfo?.name || "");
  const [description, setDescription] = useState(basicInfo?.description || "");
  const [category, setCategory] = useState(basicInfo?.category || "");
  const [difficulty, setDifficulty] = useState<DifficultyLevel | "">(
    (basicInfo?.difficulty as DifficultyLevel) || ""
  );
  const [coverImageUrl, setCoverImageUrl] = useState(basicInfo?.coverImage || "");
  const [coverImagePublicId, setCoverImagePublicId] = useState(basicInfo?.coverImagePublicId || "");

  // Cover image upload state
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);

  // Validation state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState({
    name: false,
    description: false,
    category: false,
    difficulty: false,
    coverImage: false,
  });

  /**
   * Validate all fields
   */
  const validateFields = useCallback(() => {
    const newErrors: Record<string, string> = {};

    const nameError = validateKrawlName(name);
    if (nameError) newErrors.name = nameError;

    const descError = validateKrawlDescription(description);
    if (descError) newErrors.description = descError;

    const catError = validateKrawlCategory(category);
    if (catError) newErrors.category = catError;

    const diffError = validateKrawlDifficulty(difficulty);
    if (diffError) newErrors.difficulty = diffError;

    const coverImageError = validateCoverImageUrl(coverImageUrl);
    if (coverImageError) newErrors.coverImage = coverImageError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [name, description, category, difficulty, coverImageUrl]);

  /**
   * Run validation on field changes (real-time)
   */
  useEffect(() => {
    validateFields();
  }, [validateFields]);

  /**
   * Cleanup preview URL on unmount
   */
  useEffect(() => {
    return () => {
      if (coverImagePreview) {
        URL.revokeObjectURL(coverImagePreview);
      }
    };
  }, [coverImagePreview]);

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
   * Check if field is valid (for success indicators)
   */
  const isFieldValid = (field: keyof typeof touched, value: string): boolean => {
    if (!touched[field]) return false;
    return !errors[field] && value.trim().length > 0;
  };

  /**
   * Character counter color for name
   */
  const nameCounterColor = useMemo(() => {
    return getCharacterCountColor(name.length, 100, 90);
  }, [name.length]);

  /**
   * Character counter color for description
   */
  const descriptionCounterColor = useMemo(() => {
    return getCharacterCountColor(description.length, 500, 450);
  }, [description.length]);

  /**
   * Check if form is valid and can proceed
   */
  const canProceed = useMemo(() => {
    return (
      name.trim().length > 0 &&
      name.trim().length <= 100 &&
      description.trim().length >= 50 &&
      description.trim().length <= 500 &&
      category.trim().length > 0 &&
      difficulty !== "" &&
      coverImageUrl.trim().length > 0 &&
      !isUploadingCover
    );
  }, [name, description, category, difficulty, coverImageUrl, isUploadingCover]);

  /**
   * Handle cover image file selection and upload
   */
  const handleCoverImageChange = useCallback(async (files: File[]) => {
    if (files.length === 0) {
      // Remove image
      if (coverImagePreview) {
        URL.revokeObjectURL(coverImagePreview);
      }
      setCoverImagePreview(null);
      setCoverImageFile(null);
      setCoverImageUrl("");
      setCoverImagePublicId("");
      setUploadProgress(0);
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.coverImage;
        return newErrors;
      });
      return;
    }

    const file = files[0];
    setCoverImageFile(file);
    setTouched((prev) => ({ ...prev, coverImage: true }));

    // Validate file
    const validationError = await validateCoverImageFile(file);
    if (validationError) {
      setErrors((prev) => ({ ...prev, coverImage: validationError }));
      setCoverImageFile(null);
      return;
    }

    // Create preview
    const preview = URL.createObjectURL(file);
    setCoverImagePreview(preview);

    // Clear previous errors
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.coverImage;
      return newErrors;
    });

    // Upload to Cloudinary using Krawl-specific upload function
    setIsUploadingCover(true);
    setUploadProgress(0);

    try {
      const result = await uploadKrawlCoverImage(file, 0, {
        onProgress: (progress) => {
          setUploadProgress(progress.progress);
        },
        onError: (err) => {
          setErrors((prev) => ({ ...prev, coverImage: err }));
          setIsUploadingCover(false);
          setUploadProgress(0);
          URL.revokeObjectURL(preview);
          setCoverImagePreview(null);
          setCoverImageFile(null);
        },
      });

      if (result.success) {
        setCoverImageUrl(result.url);
        setCoverImagePublicId(result.publicId);
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.coverImage;
          return newErrors;
        });
      } else {
        setErrors((prev) => ({
          ...prev,
          coverImage: result.error || "Upload failed",
        }));
        URL.revokeObjectURL(preview);
        setCoverImagePreview(null);
        setCoverImageFile(null);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Upload failed";
      setErrors((prev) => ({ ...prev, coverImage: errorMessage }));
      URL.revokeObjectURL(preview);
      setCoverImagePreview(null);
      setCoverImageFile(null);
    } finally {
      setIsUploadingCover(false);
      setUploadProgress(0);
    }
  }, [coverImagePreview]);

  /**
   * Handle continue button click
   */
  const handleContinue = useCallback(() => {
    if (!canProceed) return;

    // Mark all fields as touched to show any remaining errors
    setTouched({
      name: true,
      description: true,
      category: true,
      difficulty: true,
      coverImage: true,
    });

    // Validate one more time
    if (!validateFields()) return;

    // Save to store
    setBasicInfo({
      name: name.trim(),
      description: description.trim(),
      category,
      difficulty: difficulty as DifficultyLevel,
      coverImage: coverImageUrl,
      coverImagePublicId: coverImagePublicId,
    });

    // Navigate to next step
    onNext();
  }, [
    canProceed,
    name,
    description,
    category,
    difficulty,
    coverImageUrl,
    coverImagePublicId,
    setBasicInfo,
    onNext,
    validateFields,
  ]);

  // Difficulty options for Select
  const difficultyOptions = DIFFICULTY_OPTIONS.map((option) => ({
    value: option.value,
    label: option.label,
  }));

  return (
    <div className="flex flex-col h-dvh bg-bg-white">
      {/* Header */}
      <header className="shrink-0 border-b border-border-subtle bg-bg-white">
        <div className="p-4">
          <div className="flex items-center gap-3 relative">
            <button
              onClick={onBackToPreviousPage}
              className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-bg-light transition-colors shrink-0"
              aria-label="Go back"
              type="button"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex-1 flex flex-col items-center justify-center gap-3">
              <h1 className="text-xl font-bold text-text-primary">Create Krawl</h1>
              <ProgressDots total={3} currentIndex={0} />
            </div>
            <p className="text-sm text-text-secondary shrink-0">Step 1 of 3</p>
          </div>
        </div>
      </header>

      {/* Content Area (Scrollable) */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-6">
          {/* Krawl Name Input */}
          <div className="space-y-2">
            <Input
              label="Krawl Name"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                // Mark as touched on change for immediate feedback
                if (!touched.name) {
                  setTouched((prev) => ({ ...prev, name: true }));
                }
              }}
              onBlur={() => handleBlur("name")}
              error={shouldShowError("name") ? errors.name : undefined}
              placeholder="Enter krawl name"
              maxLength={101} // Allow typing to 101 to show error
              rightIcon={
                isFieldValid("name", name) ? (
                  <CheckCircle className="w-4 h-4 text-success" />
                ) : undefined
              }
            />
            {/* Character Counter */}
            <div className="flex justify-end">
              <span className={cn("text-xs font-medium", nameCounterColor)}>
                {name.length}/100
              </span>
            </div>
          </div>

          {/* Category Selection */}
          <CategoryChipSelector
            value={category}
            onChange={(value) => {
              setCategory(value);
              // Mark as touched on change for immediate feedback
              if (!touched.category) {
                setTouched((prev) => ({ ...prev, category: true }));
              }
            }}
            error={shouldShowError("category") ? errors.category : undefined}
            required
          />

          {/* Description Textarea */}
          <div className="space-y-2">
            <Textarea
              label="Description"
              required
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                // Mark as touched on change for immediate feedback
                if (!touched.description) {
                  setTouched((prev) => ({ ...prev, description: true }));
                }
              }}
              onBlur={() => handleBlur("description")}
              error={
                shouldShowError("description") ? errors.description : undefined
              }
              placeholder="Describe your krawl..."
              helperText="Tell people what makes this krawl special. Include what to expect and why it matters."
              rows={6}
              resize="none"
              maxLength={501} // Allow typing to 501 to show error
            />
            {/* Character Counter */}
            <div className="flex justify-end">
              <span
                className={cn("text-xs font-medium", descriptionCounterColor)}
              >
                {description.length}/500
              </span>
            </div>
          </div>

          {/* Cover Image Upload */}
          <div className="space-y-2">
            <FileUpload
              label="Cover Image"
              required
              accept="image/jpeg,image/jpg,image/png,image/webp"
              maxSize={5 * 1024 * 1024}
              singleImageMode={true}
              imagePreviewHeight="h-48"
              showChangeButton={true}
              showRemoveButton={true}
              onFilesChange={handleCoverImageChange}
              error={shouldShowError("coverImage") ? errors.coverImage : undefined}
              helperText="PNG, JPG, WebP up to 5MB. Recommended: 16:9 aspect ratio"
              disabled={isUploadingCover}
              uploadProgress={uploadProgress}
              isUploading={isUploadingCover}
              previewUrl={coverImageUrl || coverImagePreview || undefined}
            />
          </div>

          {/* Difficulty Selection */}
          <Select
            label="Difficulty"
            required
            value={difficulty}
            onChange={(e) => {
              setDifficulty(e.target.value as DifficultyLevel);
              // Mark as touched on change for immediate feedback
              if (!touched.difficulty) {
                setTouched((prev) => ({ ...prev, difficulty: true }));
              }
            }}
            onBlur={() => handleBlur("difficulty")}
            error={shouldShowError("difficulty") ? errors.difficulty : undefined}
            options={difficultyOptions}
            placeholder="Select difficulty level"
          />
        </div>
      </div>

      {/* Footer - Continue Button */}
      <div className="shrink-0 p-4 border-t border-border-subtle bg-bg-white">
        <Button
          variant="primary"
          size="lg"
          onClick={handleContinue}
          disabled={!canProceed}
          className="w-full"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}

