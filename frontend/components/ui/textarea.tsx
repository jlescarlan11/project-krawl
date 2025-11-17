'use client'

import { XCircle, CheckCircle } from 'lucide-react'
import { forwardRef, useId } from 'react'
import { cn } from '@/lib/utils'

/**
 * Textarea component for multi-line text input with validation states.
 * 
 * Supports error, success, and disabled states with visual feedback.
 * Configurable rows and resize behavior. Includes proper ARIA attributes.
 * 
 * @example
 * ```tsx
 * <Textarea label="Description" rows={4} required />
 * <Textarea label="Description" error="Description is required" />
 * <Textarea label="Description" resize="none" />
 * ```
 */
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  success?: string
  helperText?: string
  rows?: number
  resize?: 'none' | 'vertical' | 'both'
  fullWidth?: boolean
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      success,
      helperText,
      rows = 4,
      resize = 'vertical',
      fullWidth = true,
      className,
      id,
      required,
      ...props
    },
    ref
  ) => {
    const generatedId = useId()
    const textareaId = id || `textarea-${generatedId}`
    const hasError = !!error
    const hasSuccess = !!success && !hasError

    const resizeClasses = {
      none: 'resize-none',
      vertical: 'resize-y',
      both: 'resize',
    }

    return (
      <div className={cn('space-y-2', fullWidth && 'w-full')}>
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-text-primary"
          >
            {label}
            {required && <span className="text-error ml-1">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          required={required}
          aria-invalid={hasError}
          aria-describedby={
            error ? `${textareaId}-error` :
            success ? `${textareaId}-success` :
            helperText ? `${textareaId}-helper` :
            undefined
          }
          className={cn(
            'w-full px-4 py-3 rounded-lg text-base text-text-primary',
            'border min-h-[120px] leading-relaxed',
            'focus:outline-none focus:ring-2',
            'disabled:bg-bg-light disabled:border-bg-medium disabled:text-text-tertiary/60 disabled:cursor-not-allowed',
            'placeholder:text-text-secondary/60',
            resizeClasses[resize],
            hasError && 'border-error bg-error/5 focus:border-error focus:ring-error/20',
            hasSuccess && 'border-success bg-success/5 focus:border-success focus:ring-success/20',
            !hasError && !hasSuccess && 'border-bg-medium focus:border-primary-green focus:ring-primary-green/20',
            className
          )}
          {...props}
        />
        {error && (
          <p
            id={`${textareaId}-error`}
            className="text-sm text-error flex items-center gap-1"
            role="alert"
          >
            <XCircle className="w-4 h-4" />
            {error}
          </p>
        )}
        {success && (
          <p
            id={`${textareaId}-success`}
            className="text-sm text-success flex items-center gap-1"
          >
            <CheckCircle className="w-4 h-4" />
            {success}
          </p>
        )}
        {helperText && !error && !success && (
          <p
            id={`${textareaId}-helper`}
            className="text-sm text-text-secondary"
          >
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'

export { Textarea }

