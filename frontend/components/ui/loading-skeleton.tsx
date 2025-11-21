'use client'

import { cn } from '@/lib/utils'

/**
 * LoadingSkeleton component for displaying loading placeholders.
 * 
 * Provides skeleton loaders with shimmer animation for different content types.
 * Supports card, text, image, list, and custom variants.
 * 
 * @example
 * ```tsx
 * <LoadingSkeleton variant="card" />
 * <LoadingSkeleton variant="text" lines={3} />
 * <LoadingSkeleton variant="image" className="w-full aspect-video" />
 * ```
 */
export interface LoadingSkeletonProps {
  variant?: 'card' | 'text' | 'image' | 'list' | 'custom'
  lines?: number
  width?: string
  height?: string
  className?: string
}

const LoadingSkeleton = ({
  variant = 'card',
  lines = 3,
  width,
  height,
  className,
}: LoadingSkeletonProps) => {
  // Custom styles for width/height when provided
  const customStyles = width || height ? { width, height } : undefined

  if (variant === 'text') {
    return (
      <div className={cn('space-y-2', className)}>
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={cn(
              'h-4 rounded-lg bg-bg-light skeleton-shimmer',
              index === lines - 1 ? 'w-3/4' : 'w-full',
              'animate-pulse'
            )}
          />
        ))}
      </div>
    )
  }

  if (variant === 'image') {
    return (
      <div
        className={cn(
          'rounded-xl bg-bg-light skeleton-shimmer',
          'aspect-square',
          className
        )}
        style={customStyles}
      />
    )
  }

  if (variant === 'list') {
    return (
      <div className={cn('space-y-4', className)}>
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="h-32 rounded-xl bg-bg-light skeleton-shimmer animate-pulse"
          />
        ))}
      </div>
    )
  }

  if (variant === 'custom') {
    return (
      <div
        className={cn('rounded-lg bg-bg-light skeleton-shimmer animate-pulse', className)}
        style={customStyles}
      />
    )
  }

  // Default: card variant
  return (
    <div
      className={cn(
        'h-32 w-full rounded-xl bg-bg-light skeleton-shimmer animate-pulse',
        className
      )}
    />
  )
}

LoadingSkeleton.displayName = 'LoadingSkeleton'

export { LoadingSkeleton }

