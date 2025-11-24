"use client";

import { Breadcrumbs } from "@/components/navigation";
import { Container } from "./Container";
import { cn } from "@/lib/utils";

/**
 * PageLayout component props
 */
export interface PageLayoutProps {
  /**
   * Child elements
   */
  children: React.ReactNode;

  /**
   * Show breadcrumbs
   * @default false
   */
  breadcrumbs?: boolean;

  /**
   * Page title
   */
  title?: string;

  /**
   * Page description
   */
  description?: string;

  /**
   * Additional CSS classes for container
   */
  className?: string;

  /**
   * Additional CSS classes for content wrapper
   */
  contentClassName?: string;
}

/**
 * PageLayout component
 *
 * Wraps page content with consistent structure, spacing, and optional features.
 * Provides optional breadcrumbs, title, and description for better page structure.
 *
 * @example
 * ```tsx
 * <PageLayout
 *   breadcrumbs
 *   title="Page Title"
 *   description="Page description here"
 * >
 *   <p>Page content goes here.</p>
 * </PageLayout>
 * ```
 *
 * @example
 * ```tsx
 * <PageLayout title="Simple Page">
 *   <p>Content without breadcrumbs or description.</p>
 * </PageLayout>
 * ```
 */
export function PageLayout({
  children,
  breadcrumbs = false,
  title,
  description,
  className,
  contentClassName,
}: PageLayoutProps) {
  return (
    <div className={cn("min-h-[calc(100vh-4rem)]", className)}>
      <Container>
        {(breadcrumbs || title || description) && (
          <header className="mb-8 space-y-4 pt-8">
            {breadcrumbs && <Breadcrumbs />}
            {title && (
              <h1 className="text-3xl font-bold text-text-primary lg:text-4xl">
                {title}
              </h1>
            )}
            {description && (
              <p className="text-lg text-text-secondary lg:text-xl">
                {description}
              </p>
            )}
          </header>
        )}
        <main className={cn("pb-8", contentClassName)}>{children}</main>
      </Container>
    </div>
  );
}


