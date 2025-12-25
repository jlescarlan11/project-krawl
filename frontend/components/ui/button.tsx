"use client";

import { Loader2 } from "lucide-react";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Button component with multiple variants, sizes, and states.
 *
 * Supports primary, secondary, outline, text, and accent variants.
 * Includes loading state with spinner, icon support, and full accessibility.
 *
 * @example
 * ```tsx
 * <Button variant="primary" size="md">Click me</Button>
 * <Button variant="primary" loading={isLoading}>Submit</Button>
 * <Button variant="primary" icon={<Plus />} iconPosition="left">
 *   Create Gem
 * </Button>
 * ```
 */
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "text" | "accent";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      icon,
      iconPosition = "left",
      fullWidth = false,
      disabled,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const isIconOnly = !children && icon;

    const variantClasses = {
      primary:
        "bg-primary-green text-white border-2 border-primary-green hover:bg-dark-green hover:border-dark-green active:scale-[0.98]",
      secondary:
        "bg-transparent text-primary-green border-2 border-primary-green hover:bg-light-green/10",
      outline:
        "bg-transparent text-primary-green border-2 border-primary-green hover:bg-light-green/10",
      text: "bg-transparent text-primary-green hover:bg-light-green/10 hover:underline",
      accent:
        "bg-accent-orange text-white border-2 border-accent-orange hover:bg-[#E55A2B] hover:border-[#E55A2B] active:scale-[0.98]",
    };

    const sizeClasses = {
      sm: "px-4 py-2 text-sm min-h-[40px]",
      md: "px-6 py-3 text-base min-h-[44px]",
      lg: "px-8 py-4 text-lg min-h-[52px]",
    };

    const iconSizeClasses = {
      sm: "w-4 h-4",
      md: "w-5 h-5",
      lg: "w-6 h-6",
    };

    return (
      <button
        ref={ref}
        type={props.type ?? "button"}
        disabled={disabled || loading}
        aria-busy={loading}
        aria-disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-lg font-medium",
          "box-border",
          "transition-all duration-150",
          "focus:outline-2 focus:outline-accent-orange focus:outline-offset-2",
          "disabled:opacity-60 disabled:cursor-not-allowed disabled:pointer-events-none",
          variantClasses[variant],
          sizeClasses[size],
          fullWidth && "w-full",
          isIconOnly && "min-w-[44px] min-h-[44px]",
          className
        )}
        {...props}
      >
        {loading ? (
          <>
            <Loader2 className={cn("animate-spin", iconSizeClasses[size])} />
            {children && <span>{children}</span>}
          </>
        ) : (
          <>
            {icon && iconPosition === "left" && (
              <span className={iconSizeClasses[size]}>{icon}</span>
            )}
            {children && <span>{children}</span>}
            {icon && iconPosition === "right" && (
              <span className={iconSizeClasses[size]}>{icon}</span>
            )}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
