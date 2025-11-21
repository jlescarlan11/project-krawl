'use client'

import { forwardRef } from 'react'
import {
  AlertCircle,
  AlertTriangle,
  FileQuestion,
  ServerCrash,
  ShieldAlert,
} from 'lucide-react'
import { Button } from '@/components'
import { cn } from '@/lib/utils'

/**
 * ErrorDisplay component for displaying full-page error states.
 * 
 * Provides consistent error UI with icon, title, message, and optional retry action.
 * Supports multiple error variants with appropriate icons and styling.
 * 
 * @example
 * ```tsx
 * <ErrorDisplay
 *   title="Unable to load content"
 *   message="Please check your connection and try again"
 *   retryAction={() => refetch()}
 *   variant="network"
 * />
 * ```
 */
export interface ErrorDisplayProps {
  title: string
  message: string
  retryAction?: () => void
  icon?: React.ReactNode
  variant?: 'network' | 'error' | '404' | '500' | 'permission'
  className?: string
}

const variantIcons = {
  network: AlertTriangle,
  error: AlertCircle,
  '404': FileQuestion,
  '500': ServerCrash,
  permission: ShieldAlert,
}

const ErrorDisplay = forwardRef<HTMLDivElement, ErrorDisplayProps>(
  (
    {
      title,
      message,
      retryAction,
      icon,
      variant = 'error',
      className,
    },
    ref
  ) => {
    const IconComponent = variantIcons[variant]

    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col items-center justify-center',
          'p-8 md:p-12',
          'max-w-md mx-auto',
          'text-center',
          className
        )}
        role="alert"
        aria-live="assertive"
      >
      {icon ? (
        <div className="w-16 h-16 text-error mb-4" aria-hidden="true">
          {icon}
        </div>
      ) : (
        <IconComponent
          className="w-16 h-16 text-error mb-4"
          aria-hidden="true"
        />
      )}

      <h2 className="text-2xl md:text-3xl font-semibold text-text-primary mb-2">
        {title}
      </h2>

      <p className="text-base text-text-secondary mb-6">{message}</p>

      {retryAction && (
        <Button
          variant="primary"
          size="md"
          onClick={retryAction}
          aria-label="Retry"
        >
          Retry
        </Button>
      )}
      </div>
    )
  }
)

ErrorDisplay.displayName = 'ErrorDisplay'

export { ErrorDisplay }

