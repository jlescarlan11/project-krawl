/**
 * Formats a numeric statistic value for display.
 * 
 * Converts numbers to human-readable format:
 * - null/undefined → "—"
 * - 0 → "0"
 * - >= 1,000,000 → "X.XM" (e.g., "1.5M")
 * - >= 1,000 → "X.XK" (e.g., "1.2K")
 * - < 1,000 → number as string
 * 
 * @param value - The numeric value to format, or null/undefined
 * @returns Formatted string representation of the value
 * 
 * @example
 * ```typescript
 * formatStatValue(1500) // "1.5K"
 * formatStatValue(2500000) // "2.5M"
 * formatStatValue(0) // "0"
 * formatStatValue(null) // "—"
 * ```
 */
export function formatStatValue(value: number | undefined | null): string {
  if (value == null) {
    return "—";
  }
  if (value === 0) {
    return "0";
  }
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K`;
  }
  return value.toString();
}

