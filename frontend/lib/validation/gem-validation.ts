/**
 * Gem Form Validation Functions
 *
 * Reusable validation logic for gem creation forms.
 * Returns error messages or null if validation passes.
 */

/**
 * Validate gem name
 *
 * Rules:
 * - Required (non-empty after trim)
 * - Maximum 100 characters
 *
 * @param name - Gem name to validate
 * @returns Error message or null if valid
 */
export function validateGemName(name: string): string | null {
  const trimmed = name.trim();

  if (!trimmed) {
    return "Gem name is required";
  }

  if (trimmed.length > 100) {
    return "Name must be 100 characters or less";
  }

  return null;
}

/**
 * Validate gem category
 *
 * Rules:
 * - Required (non-empty)
 *
 * @param category - Category value to validate
 * @returns Error message or null if valid
 */
export function validateGemCategory(category: string): string | null {
  if (!category || category.trim() === "") {
    return "Please select a category";
  }

  return null;
}

/**
 * Validate gem description
 *
 * Rules:
 * - Required (non-empty after trim)
 * - Minimum 50 characters
 * - Maximum 500 characters
 *
 * @param description - Description to validate
 * @returns Error message or null if valid
 */
export function validateGemDescription(description: string): string | null {
  const trimmed = description.trim();

  if (!trimmed) {
    return "Description is required";
  }

  if (trimmed.length < 50) {
    return `Description must be at least 50 characters (${trimmed.length}/50)`;
  }

  if (trimmed.length > 500) {
    return "Description must be 500 characters or less";
  }

  return null;
}

/**
 * Get character count color based on current length and thresholds
 *
 * Returns Tailwind color class for character counter:
 * - Gray: Normal range
 * - Orange: Warning range (approaching limit)
 * - Red: Error range (exceeded limit)
 *
 * @param current - Current character count
 * @param max - Maximum allowed characters
 * @param warningThreshold - Character count at which to show warning
 * @returns Tailwind text color class
 */
export function getCharacterCountColor(
  current: number,
  max: number,
  warningThreshold: number
): string {
  if (current > max) {
    return "text-error";
  }

  if (current >= warningThreshold) {
    return "text-accent-orange";
  }

  return "text-text-secondary";
}

/**
 * Check if name is approaching character limit
 *
 * @param name - Name to check
 * @param warningThreshold - Threshold for warning (default: 90)
 * @returns True if name length is at or above warning threshold
 */
export function isNameApproachingLimit(
  name: string,
  warningThreshold: number = 90
): boolean {
  return name.length >= warningThreshold;
}

/**
 * Check if description is approaching character limit
 *
 * @param description - Description to check
 * @param warningThreshold - Threshold for warning (default: 450)
 * @returns True if description length is at or above warning threshold
 */
export function isDescriptionApproachingLimit(
  description: string,
  warningThreshold: number = 450
): boolean {
  return description.length >= warningThreshold;
}

/**
 * Validate gem photos
 *
 * Rules:
 * - At least 1 photo required
 * - Maximum 5 photos
 *
 * @param photos - Array of File objects
 * @returns Error message or null if valid
 */
export function validateGemPhotos(photos: File[]): string | null {
  if (!photos || photos.length === 0) {
    return "At least one photo is required";
  }

  if (photos.length > 5) {
    return "Maximum 5 photos allowed";
  }

  return null;
}

/**
 * Validate individual photo file
 *
 * Rules:
 * - Must be image/jpeg, image/png, or image/webp
 * - Maximum 5MB file size
 *
 * @param file - File to validate
 * @returns Error message or null if valid
 */
export function validatePhotoFile(file: File): string | null {
  const MAX_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

  if (!ALLOWED_TYPES.includes(file.type)) {
    return `Invalid file type. Only JPG, PNG, and WebP allowed`;
  }

  if (file.size > MAX_SIZE) {
    return `File size must be less than 5MB`;
  }

  return null;
}
