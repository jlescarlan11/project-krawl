"use client";

import { XCircle } from "lucide-react";
import { forwardRef, useId } from "react";
import { cn } from "@/lib/utils";

/**
 * Radio button component with custom styling and validation states.
 *
 * Custom styled radio (20px × 20px circle) with Primary Green checked state.
 * Supports grouping via `name` prop and proper accessibility attributes.
 *
 * @example
 * ```tsx
 * <Radio
 *   name="difficulty"
 *   label="Easy"
 *   value="easy"
 *   checked={selected === 'easy'}
 *   onCheckedChange={() => setSelected('easy')}
 * />
 * ```
 */
export interface RadioProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "type" | "onChange"
  > {
  label?: string;
  error?: string;
  helperText?: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

const Radio = forwardRef<HTMLInputElement, RadioProps>(
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
      name,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const radioId = id || `radio-${generatedId}`;
    const hasError = !!error;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onCheckedChange) {
        onCheckedChange(e.target.checked);
      }
    };

    return (
      <div className="space-y-2">
        <div className="flex items-start gap-2">
          <div className="relative flex-shrink-0">
            {/* eslint-disable-next-line jsx-a11y/role-supports-aria-props */}
            <input
              ref={ref}
              type="radio"
              id={radioId}
              name={name}
              checked={checked}
              onChange={handleChange}
              disabled={disabled}
              required={required}
              aria-invalid={hasError}
              aria-describedby={
                error
                  ? `${radioId}-error`
                  : helperText
                    ? `${radioId}-helper`
                    : undefined
              }
              className="sr-only"
              {...props}
            />
            <label
              htmlFor={radioId}
              className={cn(
                "flex items-center justify-center w-5 h-5 rounded-full border-2 cursor-pointer",
                "transition-all duration-150",
                "focus-within:outline-2 focus-within:outline-accent-orange focus-within:outline-offset-2",
                checked
                  ? "bg-primary-green border-primary-green"
                  : "bg-bg-white border-bg-medium",
                disabled && "opacity-60 cursor-not-allowed",
                hasError && "border-error",
                className
              )}
            >
              {checked && <div className="w-2 h-2 rounded-full bg-white" />}
            </label>
          </div>
          {label && (
            <label
              htmlFor={radioId}
              className={cn(
                "text-sm font-medium text-text-primary cursor-pointer",
                "flex-1",
                disabled && "opacity-60 cursor-not-allowed",
                hasError && "text-error"
              )}
            >
              {label}
              {required && <span className="text-error ml-1">*</span>}
            </label>
          )}
        </div>
        {error && (
          <p
            id={`${radioId}-error`}
            className="text-sm text-error flex items-center gap-1 ml-7"
            role="alert"
          >
            <XCircle className="w-4 h-4" />
            {error}
          </p>
        )}
        {helperText && !error && (
          <p
            id={`${radioId}-helper`}
            className="text-sm text-text-secondary ml-7"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Radio.displayName = "Radio";

export { Radio };
