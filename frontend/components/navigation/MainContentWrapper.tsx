"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface MainContentWrapperProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * MainContentWrapper component
 *
 * Wraps the main content area and applies appropriate left margin
 * for the fixed collapsed sidebar (80px on desktop).
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
        // Desktop: fixed margin for collapsed sidebar (80px)
        "lg:ml-20",
        // Mobile: no left margin (sidebar is hidden), but add bottom padding for BottomNav
        "ml-0 pb-20 lg:pb-0",
        className
      )}
    >
      {children}
    </main>
  );
}

