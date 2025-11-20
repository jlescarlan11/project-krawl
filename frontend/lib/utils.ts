import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Utility function to merge Tailwind CSS classes
 * Combines clsx and tailwind-merge for optimal className handling
 * 
 * @param inputs - Class values to merge
 * @returns Merged className string
 * 
 * @example
 * ```tsx
 * cn('px-4', 'py-2', { 'bg-primary-green': isActive })
 * ```
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


