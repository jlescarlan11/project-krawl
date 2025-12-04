/**
 * Difficulty level types
 */
export type DifficultyLevel = "Easy" | "Medium" | "Hard" | "Expert";

/**
 * Difficulty color configuration
 * Ensures consistent styling across all components
 */
export const DIFFICULTY_COLORS: Record<
  DifficultyLevel | "Not Rated",
  { bg: string; text: string; border?: string }
> = {
  Easy: {
    bg: "bg-green-100",
    text: "text-green-700",
    border: "border-green-200",
  },
  Medium: {
    bg: "bg-yellow-100",
    text: "text-yellow-700",
    border: "border-yellow-200",
  },
  Hard: {
    bg: "bg-orange-100",
    text: "text-orange-700",
    border: "border-orange-200",
  },
  Expert: {
    bg: "bg-red-100",
    text: "text-red-700",
    border: "border-red-200",
  },
  "Not Rated": {
    bg: "bg-gray-100",
    text: "text-gray-600",
    border: "border-gray-200",
  },
};

/**
 * Normalize difficulty string to DifficultyLevel
 * Handles case-insensitive matching and aliases
 */
export function normalizeDifficulty(
  difficulty?: string | null
): DifficultyLevel | "Not Rated" {
  if (!difficulty) return "Not Rated";

  const normalized = difficulty.trim();
  if (normalized === "") return "Not Rated";

  const lower = normalized.toLowerCase();

  // Handle aliases
  if (lower === "moderate") return "Medium";

  // Exact match (case-insensitive)
  if (lower === "easy") return "Easy";
  if (lower === "medium") return "Medium";
  if (lower === "hard") return "Hard";
  if (lower === "expert") return "Expert";

  // Case-insensitive match with title case
  const titleCase = normalized.charAt(0).toUpperCase() + normalized.slice(1).toLowerCase();
  if (["Easy", "Medium", "Hard", "Expert"].includes(titleCase)) {
    return titleCase as DifficultyLevel;
  }

  // Invalid value - return "Not Rated"
  return "Not Rated";
}

/**
 * Get difficulty color classes
 * Returns Tailwind classes for background and text
 */
export function getDifficultyColors(
  difficulty?: string | null
): { bg: string; text: string; border?: string } {
  const normalized = normalizeDifficulty(difficulty);
  return DIFFICULTY_COLORS[normalized];
}

/**
 * Get display text for difficulty
 * Returns formatted difficulty level or "Not Rated"
 */
export function getDifficultyDisplayText(
  difficulty?: string | null
): string {
  const normalized = normalizeDifficulty(difficulty);
  return normalized;
}

