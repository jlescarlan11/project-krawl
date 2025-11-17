'use client'

import { Check, XCircle } from 'lucide-react'
import { forwardRef, useId } from 'react'
import { cn } from '@/lib/utils'

/**
 * Checkbox component with custom styling and validation states.
 * 
 * Custom styled checkbox (20px × 20px) with Primary Green checked state.
 * Supports error state and proper accessibility attributes.
 * 
 * @example
 * ```tsx
 * <Checkbox
 *   label="I agree to terms"
 *   checked={isChecked}
 *   onCheckedChange={setIsChecked}
 * />
 * <Checkbox label="Subscribe" error="You must agree" />
 * ```
 */
export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  label?: string
  error?: string
  helperText?: string
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      error,
      helperText,
      checked,
      onCheckedChange,
      className,
      id,
      disabled,
      required,
      ...props
    },
    ref
  ) => {
    const generatedId = useId()
    const checkboxId = id || `checkbox-${generatedId}`
    const hasError = !!error

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onCheckedChange) {
        onCheckedChange(e.target.checked)
      }
    }

    return (
      <div className="space-y-2">
        <div className="flex items-start gap-2">
          <div className="relative flex-shrink-0">
            <input
              ref={ref}
              type="checkbox"
              id={checkboxId}
              checked={checked}
              onChange={handleChange}
              disabled={disabled}
              required={required}
              aria-invalid={hasError}
              aria-describedby={
                error ? `${checkboxId}-error` :
                helperText ? `${checkboxId}-helper` :
                undefined
              }
              className="sr-only"
              {...props}
            />
            <label
              htmlFor={checkboxId}
              className={cn(
                'flex items-center justify-center w-5 h-5 rounded border-2 cursor-pointer',
                'transition-all duration-150',
                'focus-within:outline-2 focus-within:outline-accent-orange focus-within:outline-offset-2',
                checked
                  ? 'bg-primary-green border-primary-green'
                  : 'bg-bg-white border-bg-medium',
                disabled && 'opacity-60 cursor-not-allowed',
                hasError && 'border-error',
                className
              )}
            >
              {checked && (
                <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
              )}
            </label>
          </div>
          {label && (
            <label
              htmlFor={checkboxId}
              className={cn(
                'text-sm font-medium text-text-primary cursor-pointer',
                'flex-1',
                disabled && 'opacity-60 cursor-not-allowed',
                hasError && 'text-error'
              )}
            >
              {label}
              {required && <span className="text-error ml-1">*</span>}
            </label>
          )}
        </div>
        {error && (
          <p
            id={`${checkboxId}-error`}
            className="text-sm text-error flex items-center gap-1 ml-7"
            role="alert"
          >
            <XCircle className="w-4 h-4" />
            {error}
          </p>
        )}
        {helperText && !error && (
          <p
            id={`${checkboxId}-helper`}
            className="text-sm text-text-secondary ml-7"
          >
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

Checkbox.displayName = 'Checkbox'

export { Checkbox }

