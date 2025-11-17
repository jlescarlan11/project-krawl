'use client'

import { XCircle, CheckCircle, ChevronDown } from 'lucide-react'
import { forwardRef, useId } from 'react'
import { cn } from '@/lib/utils'

/**
 * Select option interface for dropdown options.
 */
export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

/**
 * Select dropdown component with validation states and custom styling.
 * 
 * Supports error, success, and disabled states with visual feedback.
 * Custom styled dropdown arrow and proper ARIA attributes.
 * 
 * @example
 * ```tsx
 * <Select
 *   label="Category"
 *   options={[
 *     { value: 'historical', label: 'Historical Site' },
 *     { value: 'cultural', label: 'Cultural Landmark' },
 *   ]}
 *   placeholder="Select a category"
 * />
 * ```
 */
export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  label?: string
  error?: string
  success?: string
  helperText?: string
  options: SelectOption[]
  placeholder?: string
  fullWidth?: boolean
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      success,
      helperText,
      options,
      placeholder,
      fullWidth = true,
      className,
      id,
      required,
      ...props
    },
    ref
  ) => {
    const generatedId = useId()
    const selectId = id || `select-${generatedId}`
    const hasError = !!error
    const hasSuccess = !!success && !hasError

    return (
      <div className={cn('space-y-2', fullWidth && 'w-full')}>
        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm font-medium text-text-primary"
          >
            {label}
            {required && <span className="text-error ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            required={required}
            aria-invalid={hasError}
            aria-describedby={
              error ? `${selectId}-error` :
              success ? `${selectId}-success` :
              helperText ? `${selectId}-helper` :
              undefined
            }
            className={cn(
              'w-full px-4 py-3 rounded-lg text-base text-text-primary',
              'border min-h-[44px] appearance-none',
              'focus:outline-none focus:ring-2',
              'disabled:bg-bg-light disabled:border-bg-medium disabled:text-text-tertiary/60 disabled:cursor-not-allowed',
              'bg-bg-white',
              hasError && 'border-error bg-error/5 focus:border-error focus:ring-error/20',
              hasSuccess && 'border-success bg-success/5 focus:border-success focus:ring-success/20',
              !hasError && !hasSuccess && 'border-bg-medium focus:border-primary-green focus:ring-primary-green/20',
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-secondary">
            <ChevronDown className="w-5 h-5" />
          </div>
        </div>
        {error && (
          <p
            id={`${selectId}-error`}
            className="text-sm text-error flex items-center gap-1"
            role="alert"
          >
            <XCircle className="w-4 h-4" />
            {error}
          </p>
        )}
        {success && (
          <p
            id={`${selectId}-success`}
            className="text-sm text-success flex items-center gap-1"
          >
            <CheckCircle className="w-4 h-4" />
            {success}
          </p>
        )}
        {helperText && !error && !success && (
          <p
            id={`${selectId}-helper`}
            className="text-sm text-text-secondary"
          >
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

Select.displayName = 'Select'

export { Select }

