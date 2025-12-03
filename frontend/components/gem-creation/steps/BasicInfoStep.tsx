"use client";

import React, { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { ArrowLeft, Loader2, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ProgressDots } from "@/components/onboarding/ProgressDots";
import { CategoryChipSelector } from "../CategoryChipSelector";
import { DuplicateWarningModal } from "../DuplicateWarningModal";
import { useGemCreationStore } from "@/stores/gem-creation-store";
import {
  validateGemName,
  validateGemCategory,
  validateGemDescription,
  getCharacterCountColor,
} from "@/lib/validation/gem-validation";
import { checkForDuplicatesWithAbort } from "@/lib/api/gems";
import { useDebounce } from "@/hooks/useDebounce";

/**
 * Props for BasicInfoStep component
 */
export interface BasicInfoStepProps {
  onNext: () => void;
  onBack: () => void;
}

/**
 * BasicInfoStep Component
 *
 * Step 2 of gem creation flow: Basic information collection
 * Features:
 * - Gem name input (max 100 characters)
 * - Category selection (visual chips)
 * - Description textarea (min 50, max 500 characters)
 * - Character counters with color-coded warnings
 * - Real-time validation
 * - Form data persistence via Zustand
 */
export function BasicInfoStep({ onNext, onBack }: BasicInfoStepProps) {
  const {
    details,
    setDetails,
    location,
    duplicateCheckStatus,
    duplicateGem,
    setDuplicateCheckStatus,
    setDuplicateGem,
    dismissDuplicateWarning,
  } = useGemCreationStore();

  // Form state
  const [name, setName] = useState(details?.name || "");
  const [category, setCategory] = useState(details?.category || "");
  const [description, setDescription] = useState(
    details?.shortDescription || ""
  );

  // Validation state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState({
    name: false,
    category: false,
    description: false,
  });

  // Debounce values for expensive validations (like duplicate checking)
  const debouncedName = useDebounce(name, 300);

  // Duplicate detection state
  const [isCheckingDuplicate, setIsCheckingDuplicate] = useState(false);
  const [showDuplicateModal, setShowDuplicateModal] = useState(true);
  const abortControllerRef = useRef<AbortController | null>(null);

  /**
   * Validate all fields
   */
  const validateFields = useCallback(() => {
    const newErrors: Record<string, string> = {};

    const nameError = validateGemName(name);
    if (nameError) newErrors.name = nameError;

    const categoryError = validateGemCategory(category);
    if (categoryError) newErrors.category = categoryError;

    const descriptionError = validateGemDescription(description);
    if (descriptionError) newErrors.description = descriptionError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [name, category, description]);

  /**
   * Run validation on field changes (real-time)
   */
  useEffect(() => {
    validateFields();
  }, [validateFields]);

  /**
   * Check for duplicate gems
   */
  const checkDuplicates = useCallback(
    async (gemName: string) => {
      // Need both name and location
      if (!gemName || !location) return;

      // Cancel any pending check
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller
      const controller = new AbortController();
      abortControllerRef.current = controller;

      setIsCheckingDuplicate(true);
      setDuplicateCheckStatus("checking");

      try {
        const result = await checkForDuplicatesWithAbort(
          {
            name: gemName,
            coordinates: {
              latitude: location.coordinates[1],
              longitude: location.coordinates[0],
            },
          },
          controller.signal
        );

        if (result.isDuplicate && result.existingGem) {
          setDuplicateGem(result.existingGem);
          setDuplicateCheckStatus("found");
          setShowDuplicateModal(true); // Show modal when duplicate found
        } else {
          setDuplicateGem(null);
          setDuplicateCheckStatus("idle");
          setShowDuplicateModal(true);
        }
      } catch (error: any) {
        if (error.name === "AbortError") {
          // Request was cancelled, ignore
          return;
        }

        console.error("Duplicate check error:", error);
        // Don't block user on error
        setDuplicateGem(null);
        setDuplicateCheckStatus("idle");
      } finally {
        setIsCheckingDuplicate(false);
      }
    },
    [location, setDuplicateCheckStatus, setDuplicateGem]
  );

  /**
   * Check for duplicates when debounced name changes and is valid
   */
  useEffect(() => {
    // Only check duplicates if name is valid and location exists
    if (
      debouncedName.trim() &&
      !validateGemName(debouncedName) &&
      location &&
      touched.name
    ) {
      checkDuplicates(debouncedName.trim());
    }
  }, [debouncedName, location, touched.name, checkDuplicates]);

  /**
   * Handle field blur (mark as touched)
   */
  const handleBlur = (field: keyof typeof touched) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  /**
   * Handle name field blur
   */
  const handleNameBlur = useCallback(() => {
    handleBlur("name");
  }, []);

  /**
   * Handle name field change (real-time validation)
   */
  const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    // Mark as touched on change for immediate feedback
    if (!touched.name) {
      setTouched((prev) => ({ ...prev, name: true }));
    }
  }, [touched.name]);

  /**
   * Handle category change (real-time validation)
   */
  const handleCategoryChange = useCallback((newCategory: string) => {
    setCategory(newCategory);
    // Mark as touched on change for immediate feedback
    if (!touched.category) {
      setTouched((prev) => ({ ...prev, category: true }));
    }
  }, [touched.category]);

  /**
   * Handle description change (real-time validation)
   */
  const handleDescriptionChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
    // Mark as touched on change for immediate feedback
    if (!touched.description) {
      setTouched((prev) => ({ ...prev, description: true }));
    }
  }, [touched.description]);

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
      category.trim().length > 0 &&
      description.trim().length >= 50 &&
      description.trim().length <= 500 &&
      !isCheckingDuplicate &&
      // Allow if no duplicate OR user dismissed warning
      (duplicateCheckStatus === "idle" || duplicateCheckStatus === "dismissed")
    );
  }, [name, category, description, isCheckingDuplicate, duplicateCheckStatus]);

  /**
   * Handle duplicate modal close (backdrop click, X button, or Escape key)
   */
  const handleDuplicateModalClose = useCallback(() => {
    // Hide modal but keep duplicate status as "found"
    // This allows user to close the modal temporarily, but Continue button stays disabled
    // User must either:
    // 1. Edit the name (triggers new duplicate check)
    // 2. Click "This is Different" to dismiss warning and enable Continue
    setShowDuplicateModal(false);
  }, []);

  /**
   * Handle "This is Different" confirmation
   */
  const handleConfirmDifferent = useCallback(() => {
    dismissDuplicateWarning();
    setShowDuplicateModal(false); // Close modal when user confirms
  }, [dismissDuplicateWarning]);

  /**
   * Handle continue button click
   */
  const handleContinue = useCallback(() => {
    if (!canProceed) return;

    // Mark all fields as touched to show any remaining errors
    setTouched({ name: true, category: true, description: true });

    // Validate one more time
    if (!validateFields()) return;

    // Save to store
    setDetails({
      name: name.trim(),
      category,
      shortDescription: description.trim(),
      fullDescription: "", // Not collected in Step 2
      culturalSignificance: undefined,
      hours: undefined,
      website: undefined,
      phone: undefined,
      tags: [],
    });

    // Navigate to next step
    onNext();
  }, [
    canProceed,
    name,
    category,
    description,
    setDetails,
    onNext,
    validateFields,
  ]);

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
              <h1 className="text-xl font-bold text-text-primary">Details</h1>
              <ProgressDots total={5} currentIndex={1} />
            </div>
            <p className="text-sm text-text-secondary shrink-0">
              Step 2 of 5
            </p>
          </div>
        </div>
      </header>

      {/* Content Area (Scrollable) */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-6">
          {/* Gem Name Input */}
          <div className="space-y-2">
            <Input
              label="Gem Name"
              required
              value={name}
              onChange={handleNameChange}
              onBlur={handleNameBlur}
              error={shouldShowError("name") ? errors.name : undefined}
              placeholder="Enter gem name"
              maxLength={101} // Allow typing to 101 to show error
              rightIcon={
                isCheckingDuplicate ? (
                  <Loader2 className="w-4 h-4 animate-spin text-text-secondary" />
                ) : isFieldValid("name", name) ? (
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
            onChange={handleCategoryChange}
            error={shouldShowError("category") ? errors.category : undefined}
            required
          />

          {/* Description Textarea */}
          <div className="space-y-2">
            <Textarea
              label="Brief Description"
              required
              value={description}
              onChange={handleDescriptionChange}
              onBlur={() => handleBlur("description")}
              error={
                shouldShowError("description") ? errors.description : undefined
              }
              placeholder="Describe this gem in a few sentences..."
              helperText="Tell people what makes this place special. Include what to expect, what to do, or why it matters culturally."
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
        </div>
      </div>

      {/* Footer - Back and Continue Buttons */}
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
            onClick={handleContinue}
            disabled={!canProceed}
            className="flex-1 sm:flex-1"
          >
            Continue
          </Button>
        </div>
      </div>

      {/* Duplicate Warning Modal */}
      {duplicateCheckStatus === "found" && duplicateGem && (
        <DuplicateWarningModal
          isOpen={showDuplicateModal}
          onClose={handleDuplicateModalClose}
          onConfirmDifferent={handleConfirmDifferent}
          existingGem={duplicateGem}
        />
      )}
    </div>
  );
}
