"use client";

import React, { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
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
   * Run validation on field changes
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
   * Handle field blur (mark as touched)
   */
  const handleBlur = (field: keyof typeof touched) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  /**
   * Handle name field blur (check for duplicates)
   */
  const handleNameBlur = useCallback(() => {
    handleBlur("name");
    // Only check duplicates if name is valid and location exists
    if (name.trim() && !validateGemName(name) && location) {
      checkDuplicates(name.trim());
    }
  }, [name, location, checkDuplicates]);

  /**
   * Check if should show error for a field
   */
  const shouldShowError = (field: keyof typeof touched): boolean => {
    return touched[field] && !!errors[field];
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
              onChange={(e) => setName(e.target.value)}
              onBlur={handleNameBlur}
              error={shouldShowError("name") ? errors.name : undefined}
              placeholder="Enter gem name"
              maxLength={101} // Allow typing to 101 to show error
              rightIcon={
                isCheckingDuplicate ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
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
            onChange={setCategory}
            error={shouldShowError("category") ? errors.category : undefined}
            required
          />

          {/* Description Textarea */}
          <div className="space-y-2">
            <Textarea
              label="Brief Description"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
