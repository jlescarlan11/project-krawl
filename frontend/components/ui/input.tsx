'use client'

import { XCircle, CheckCircle } from 'lucide-react'
import { forwardRef, useId } from 'react'
import { cn } from '@/lib/utils'

/**
 * Text input component with validation states, icons, and accessibility support.
 * 
 * Supports error, success, and disabled states with visual feedback.
 * Includes left/right icon support and proper ARIA attributes for screen readers.
 * 
 * @example
 * ```tsx
 * <Input label="Email" type="email" required />
 * <Input label="Email" error="Invalid email" />
 * <Input label="Email" leftIcon={<Mail />} />
 * ```
 */
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  success?: string
  helperText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  fullWidth?: boolean
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      success,
      helperText,
      leftIcon,
      rightIcon,
      fullWidth = true,
      className,
      id,
      required,
      ...props
    },
    ref
  ) => {
    const generatedId = useId()
    const inputId = id || `input-${generatedId}`
    const hasError = !!error
    const hasSuccess = !!success && !hasError

    return (
      <div className={cn('space-y-2', fullWidth && 'w-full')}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-text-primary"
          >
            {label}
            {required && <span className="text-error ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            required={required}
            aria-invalid={hasError}
            aria-describedby={
              error ? `${inputId}-error` :
              success ? `${inputId}-success` :
              helperText ? `${inputId}-helper` :
              undefined
            }
            className={cn(
              'w-full px-4 py-3 rounded-lg text-base text-text-primary',
              'border min-h-[44px]',
              'focus:outline-none focus:ring-2',
              'disabled:bg-bg-light disabled:border-bg-medium disabled:text-text-tertiary/60 disabled:cursor-not-allowed',
              'placeholder:text-text-secondary/60',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              hasError && 'border-error bg-error/5 focus:border-error focus:ring-error/20',
              hasSuccess && 'border-success bg-success/5 focus:border-success focus:ring-success/20',
              !hasError && !hasSuccess && 'border-bg-medium focus:border-primary-green focus:ring-primary-green/20',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p
            id={`${inputId}-error`}
            className="text-sm text-error flex items-center gap-1"
            role="alert"
          >
            <XCircle className="w-4 h-4" />
            {error}
          </p>
        )}
        {success && (
          <p
            id={`${inputId}-success`}
            className="text-sm text-success flex items-center gap-1"
          >
            <CheckCircle className="w-4 h-4" />
            {success}
          </p>
        )}
        {helperText && !error && !success && (
          <p
            id={`${inputId}-helper`}
            className="text-sm text-text-secondary"
          >
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export { Input }

