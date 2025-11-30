"use client";

import { cn } from "@/lib/utils";

interface MainContentWrapperProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * MainContentWrapper component
 *
 * Wraps the main content area and applies appropriate left margin
 * for the fixed collapsed sidebar (64px on desktop).
 * On mobile, no margin is applied since sidebar is hidden.
 */
export function MainContentWrapper({
  children,
  className,
}: MainContentWrapperProps) {
  return (
    <main
      className={cn(
        "flex-1 bg-bg-white",
        // Desktop: fixed margin for collapsed sidebar (64px)
        "lg:ml-16",
        // Mobile: no margin (sidebar is hidden)
        "ml-0",
        className
      )}
    >
      {children}
    </main>
  );
}

