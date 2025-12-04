/**
 * Krawl Form Validation Functions
 *
 * Reusable validation logic for krawl creation forms.
 * Returns error messages or null if validation passes.
 */

/**
 * Validate krawl name
 *
 * Rules:
 * - Required (non-empty after trim)
 * - Maximum 100 characters
 *
 * @param name - Krawl name to validate
 * @returns Error message or null if valid
 */
export function validateKrawlName(name: string): string | null {
  const trimmed = name.trim();

  if (!trimmed) {
    return "Krawl name is required";
  }

  if (trimmed.length > 100) {
    return "Name must be 100 characters or less";
  }

  return null;
}

/**
 * Validate krawl description
 *
 * Rules:
 * - Required (non-empty after trim)
 * - Minimum 50 characters
 * - Maximum 500 characters
 *
 * @param description - Description to validate
 * @returns Error message or null if valid
 */
export function validateKrawlDescription(description: string): string | null {
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
 * Validate krawl category
 *
 * Rules:
 * - Required (non-empty)
 *
 * @param category - Category value to validate
 * @returns Error message or null if valid
 */
export function validateKrawlCategory(category: string): string | null {
  if (!category || category.trim() === "") {
    return "Please select a category";
  }

  return null;
}

/**
 * Validate krawl difficulty
 *
 * Rules:
 * - Required (non-empty)
 * - Must be one of: Easy, Medium, Hard, Expert
 *
 * @param difficulty - Difficulty level to validate
 * @returns Error message or null if valid
 */
export function validateKrawlDifficulty(difficulty: string): string | null {
  if (!difficulty || difficulty.trim() === "") {
    return "Please select a difficulty level";
  }

  const validLevels = ["Easy", "Medium", "Hard", "Expert"];
  if (!validLevels.includes(difficulty)) {
    return "Invalid difficulty level";
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

