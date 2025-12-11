/**
 * Gem Creation Step Validation
 *
 * Validation logic for gem creation form steps.
 * Extracted from gem-creation-store.ts for better testability and reusability.
 */

import type { LocationData, DetailsData, MediaData } from "@/stores/gem-creation-store";

export type DuplicateCheckStatus = "idle" | "checking" | "found" | "dismissed";

export interface ValidationContext {
  duplicateCheckStatus?: DuplicateCheckStatus;
}

/**
 * Validate location step (Step 0)
 *
 * @param location - Location data to validate
 * @returns true if location is valid
 */
export function validateLocationStep(
  location: LocationData | null
): boolean {
  return !!(location && location.isValid && location.coordinates);
}

/**
 * Validate details step (Step 1)
 *
 * @param details - Details data to validate
 * @param context - Additional context (e.g., duplicate check status)
 * @returns true if details are valid
 */
export function validateDetailsStep(
  details: DetailsData | null,
  context?: ValidationContext
): boolean {
  if (!details) return false;

  // Validate name
  if (
    !details.name ||
    details.name.length === 0 ||
    details.name.length > 100
  ) {
    return false;
  }

  // Validate category
  if (!details.category) {
    return false;
  }

  // Validate description
  if (
    !details.shortDescription ||
    details.shortDescription.length < 50 ||
    details.shortDescription.length > 500
  ) {
    return false;
  }

  // Allow if no duplicate OR user dismissed warning
  if (context?.duplicateCheckStatus) {
    return (
      context.duplicateCheckStatus === "idle" ||
      context.duplicateCheckStatus === "dismissed"
    );
  }

  return true;
}

/**
 * Validate media step (Step 2)
 *
 * @param media - Media data to validate
 * @returns true if media is valid
 */
export function validateMediaStep(media: MediaData | null): boolean {
  if (!media || !media.photos || media.photos.length === 0) {
    return false;
  }

  // Validate photo count
  if (media.photos.length > 5) {
    return false;
  }

  // Validate thumbnail index
  if (
    media.thumbnailIndex < 0 ||
    media.thumbnailIndex >= media.photos.length
  ) {
    return false;
  }

  return true;
}

/**
 * Validate additional details step (Step 3)
 * All fields are optional, so this always returns true
 *
 * @returns true (all fields optional)
 */
export function validateAdditionalDetailsStep(): boolean {
  return true;
}

/**
 * Validate preview step (Step 4)
 * Validates all required data is present
 *
 * @param location - Location data
 * @param details - Details data
 * @param media - Media data (optional)
 * @returns true if all required data is valid
 */
export function validatePreviewStep(
  location: LocationData | null,
  details: DetailsData | null,
  media: MediaData | null
): boolean {
  // Check location
  if (!location || !location.isValid || !location.coordinates) {
    return false;
  }

  // Check details
  if (
    !details ||
    !details.name ||
    details.name.length === 0 ||
    details.name.length > 100 ||
    !details.category ||
    !details.shortDescription ||
    details.shortDescription.length < 50 ||
    details.shortDescription.length > 500
  ) {
    return false;
  }

  // Media is optional, but if provided, validate it
  if (media) {
    if (media.photos && media.photos.length > 5) {
      return false;
    }
    if (
      media.thumbnailIndex !== undefined &&
      media.photos &&
      (media.thumbnailIndex < 0 ||
        media.thumbnailIndex >= media.photos.length)
    ) {
      return false;
    }
  }

  return true;
}

/**
 * Validate a specific step
 *
 * @param step - Step number (0-4)
 * @param location - Location data
 * @param details - Details data
 * @param media - Media data
 * @param context - Additional validation context
 * @returns true if step is valid
 */
export function validateGemCreationStep(
  step: number,
  location: LocationData | null,
  details: DetailsData | null,
  media: MediaData | null,
  context?: ValidationContext
): boolean {
  switch (step) {
    case 0: // Location step
      return validateLocationStep(location);
    case 1: // Details step
      return validateDetailsStep(details, context);
    case 2: // Media step
      return validateMediaStep(media);
    case 3: // Additional Details step (all fields optional)
      return validateAdditionalDetailsStep();
    case 4: // Preview step
      return validatePreviewStep(location, details, media);
    default:
      return false;
  }
}

