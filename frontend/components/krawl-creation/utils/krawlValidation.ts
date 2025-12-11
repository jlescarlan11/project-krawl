/**
 * Krawl Review Step Validation
 *
 * Validation logic for the review step of krawl creation.
 * Validates that all required data is present and complete.
 */

import type { KrawlBasicInfo, SelectedGem } from "@/stores/krawl-creation-store";

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validate data completeness for krawl review step
 *
 * Checks that:
 * - Basic info is present and all required fields are filled
 * - At least 2 gems are selected
 *
 * @param basicInfo - Basic krawl information from form
 * @param selectedGems - Selected gems array
 * @returns Validation result with isValid flag and error messages
 */
export function validateKrawlReviewData(
  basicInfo: KrawlBasicInfo | null,
  selectedGems: SelectedGem[]
): ValidationResult {
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

