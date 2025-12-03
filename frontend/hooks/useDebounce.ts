/**
 * useDebounce Hook
 *
 * Debounces a value to prevent excessive updates during rapid changes.
 * Useful for validation, search, and other operations that should wait
 * for user input to settle before executing.
 *
 * @example
 * ```tsx
 * const debouncedValue = useDebounce(value, 300);
 * useEffect(() => {
 *   // This will only run 300ms after value stops changing
 *   validateValue(debouncedValue);
 * }, [debouncedValue]);
 * ```
 */

import { useEffect, useState } from "react";

/**
 * Debounces a value
 *
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds (default: 300ms)
 * @returns Debounced value
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set up timer to update debounced value after delay
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clean up timer if value changes before delay completes
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

