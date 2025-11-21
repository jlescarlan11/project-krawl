"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Container } from "./Container";

/**
 * Section component props
 */
export interface SectionProps {
  /**
   * Vertical spacing size
   * @default "md"
   */
  spacing?: "none" | "sm" | "md" | "lg" | "xl";

  /**
   * Background color variant
   * @default "default"
   */
  background?: "default" | "light" | "white" | "dark";

  /**
   * Full-width background with contained content
   * When true, background extends full width but content is contained
   * @default false
   */
  fullWidth?: boolean;

  /**
   * HTML element to render
   * @default "section"
   */
  as?: "section" | "div" | "article" | "aside";

  /**
   * Additional CSS classes
   * Merged with component's default classes using cn() utility
   */
  className?: string;

  /**
   * Child elements
   */
  children: React.ReactNode;
}

/**
 * Section component
 *
 * Provides consistent vertical spacing for page sections with optional background variants.
 * Supports full-width backgrounds with contained content for visual separation.
 *
 * @example
 * ```tsx
 * <Section spacing="md" background="light">
 *   <h2>Section Title</h2>
 *   <p>This section has light background and medium spacing.</p>
 * </Section>
 * ```
 *
 * @example
 * ```tsx
 * <Section background="light" fullWidth>
 *   <Container>
 *     <h1>Hero Title</h1>
 *     <p>Full-width background with contained content.</p>
 *   </Container>
 * </Section>
 * ```
 */
const Section = forwardRef<HTMLElement, SectionProps>(
  (
    {
      spacing = "md",
      background = "default",
      fullWidth = false,
      as: Component = "section",
      className,
      children,
    },
    ref
  ) => {
    const spacingClasses = {
      none: "py-0",
      sm: "py-6 lg:py-8", // 24px mobile, 32px desktop
      md: "py-8 lg:py-12", // 32px mobile, 48px desktop
      lg: "py-12 lg:py-16", // 48px mobile, 64px desktop
      xl: "py-16 lg:py-20", // 64px mobile, 80px desktop
    };

    const backgroundClasses = {
      default: "",
      light: "bg-bg-light",
      white: "bg-bg-white",
      dark: "bg-bg-dark",
    };

    // Type assertion for polymorphic component ref
    // TypeScript limitation: forwardRef with polymorphic components requires type assertion
    // This is safe because:
    // 1. All supported elements (section, div, article, aside) extend HTMLElement
    // 2. The ref is typed as HTMLElement, which is the common base type
    // 3. React handles the ref correctly at runtime regardless of the element type
    // 4. The Component variable is always a valid HTML element that accepts refs
    // See: https://github.com/microsoft/TypeScript/issues/30748
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const componentProps = {
      ref: ref as any,
      className: cn(
        spacingClasses[spacing],
        backgroundClasses[background],
        fullWidth && "w-full",
        className
      ),
    };

    return (
      <Component {...componentProps}>
        {fullWidth ? (
          <Container size="lg">
            {children}
          </Container>
        ) : (
          children
        )}
      </Component>
    );
  }
);

Section.displayName = "Section";

export { Section };

