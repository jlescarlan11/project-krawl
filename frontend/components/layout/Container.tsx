"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Container component props
 */
export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Container size variant
   * @default "lg"
   */
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";

  /**
   * Full-width variant (removes max-width constraint)
   * @default false
   */
  fullWidth?: boolean;
}

/**
 * Container component
 *
 * Standardizes max-width containers with responsive padding across the application.
 * Provides consistent content width and spacing for optimal readability.
 *
 * @example
 * ```tsx
 * <Container>
 *   <h1>Page Content</h1>
 *   <p>This content is contained with standard max-width and padding.</p>
 * </Container>
 * ```
 *
 * @example
 * ```tsx
 * <Container size="sm">
 *   <p>Narrow content (640px max)</p>
 * </Container>
 * ```
 *
 * @example
 * ```tsx
 * <Container fullWidth>
 *   <p>Full width content (no max-width)</p>
 * </Container>
 * ```
 */
const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ size = "lg", fullWidth = false, className, children, ...props }, ref) => {
    const sizeClasses = {
      sm: "max-w-[640px]",
      md: "max-w-[768px]",
      lg: "max-w-[1280px]",
      xl: "max-w-[1536px]",
      "2xl": "max-w-[1920px]",
      full: "",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "mx-auto w-full",
          "px-4 sm:px-6 lg:px-8", // Responsive padding: 16px mobile, 24px tablet, 32px desktop
          !fullWidth && sizeClasses[size],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Container.displayName = "Container";

export { Container };

