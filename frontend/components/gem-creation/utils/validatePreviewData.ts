import type {
  LocationData,
  DetailsData,
  MediaData,
} from "@/stores/gem-creation-store";

/**
 * Validation result for preview data
 */
export interface PreviewValidationResult {
  isValid: boolean;
  missingFields: string[];
  errors: string[];
}

/**
 * Validate that all required data is present for preview
 *
 * @param location - Location data from Step 1
 * @param details - Details data from Step 2
 * @param media - Media data from Step 3 (optional)
 * @returns Validation result with missing fields and errors
 */
export function validatePreviewData(
  location: LocationData | null,
  details: DetailsData | null,
  media: MediaData | null
): PreviewValidationResult {
  const missingFields: string[] = [];
  const errors: string[] = [];

  // Validate location
  if (!location) {
    missingFields.push("Location");
  } else {
    if (!location.coordinates || location.coordinates.length !== 2) {
      errors.push("Invalid location coordinates");
    }
    if (!location.isValid) {
      errors.push("Location is outside Cebu City boundaries");
    }
  }

  // Validate details
  if (!details) {
    missingFields.push("Basic Information");
  } else {
    if (!details.name || details.name.trim().length === 0) {
      missingFields.push("Gem name");
    } else if (details.name.length > 100) {
      errors.push("Gem name exceeds 100 characters");
    }

    if (!details.category || details.category.trim().length === 0) {
      missingFields.push("Category");
    }

    if (!details.shortDescription || details.shortDescription.trim().length === 0) {
      missingFields.push("Description");
    } else {
      if (details.shortDescription.length < 50) {
        errors.push("Description must be at least 50 characters");
      }
      if (details.shortDescription.length > 500) {
        errors.push("Description exceeds 500 characters");
      }
    }
  }

  // Media is optional, but if provided, validate it
  if (media) {
    if (media.photos && media.photos.length > 5) {
      errors.push("Maximum 5 photos allowed");
    }
    if (
      media.thumbnailIndex !== undefined &&
      media.photos &&
      (media.thumbnailIndex < 0 ||
        media.thumbnailIndex >= media.photos.length)
    ) {
      errors.push("Invalid thumbnail index");
    }
  }

  // Cultural significance validation (optional field)
  if (details?.culturalSignificance) {
    if (details.culturalSignificance.length > 300) {
      errors.push("Cultural significance exceeds 300 characters");
    }
  }

  // Tags validation (optional field)
  if (details?.tags) {
    if (details.tags.length > 5) {
      errors.push("Maximum 5 tags allowed");
    }
  }

  const isValid =
    missingFields.length === 0 && errors.length === 0;

  return {
    isValid,
    missingFields,
    errors,
  };
}




