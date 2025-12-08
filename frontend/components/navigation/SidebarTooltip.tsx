"use client";

import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

interface SidebarTooltipProps {
  label: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * SidebarTooltip component
 * 
 * Custom tooltip for sidebar icons with a pointy arrow that aligns with the icon.
 * Appears on hover, positioned to the right of the icon.
 */
export function SidebarTooltip({ label, children, className }: SidebarTooltipProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLElement>(null);

  // Track mount state for portal
  useEffect(() => {
    setMounted(true);
  }, []);

  // Calculate tooltip position based on trigger element position
  useLayoutEffect(() => {
    if (isHovered && triggerRef.current) {
      const updatePosition = () => {
        if (triggerRef.current) {
          const rect = triggerRef.current.getBoundingClientRect();
          const sidebarGap = 16; // Gap between icon and tooltip
          setTooltipPosition({
            top: rect.top + rect.height / 2, // Center vertically with icon
            left: rect.right + sidebarGap,
          });
        }
      };

      updatePosition();
      window.addEventListener("scroll", updatePosition, true);
      window.addEventListener("resize", updatePosition);

      return () => {
        window.removeEventListener("scroll", updatePosition, true);
        window.removeEventListener("resize", updatePosition);
      };
    }
  }, [isHovered]);

  // Clone the child element and add ref and event handlers
  const childWithProps = typeof children === "object" && children !== null && "type" in children
    ? React.cloneElement(children as React.ReactElement, {
        ref: triggerRef,
        onMouseEnter: () => setIsHovered(true),
        onMouseLeave: () => setIsHovered(false),
        className: cn((children as React.ReactElement).props?.className, className),
      })
    : children;

  return (
    <>
      {childWithProps}

      {/* Custom tooltip with arrow */}
      {isHovered && mounted && (
        createPortal(
          <div
            className={cn(
              "fixed z-[1000]",
              "bg-bg-white rounded-lg shadow-elevation-3",
              "border border-[var(--color-border-subtle)]",
              "px-3 py-2",
              "text-sm font-medium text-text-primary",
              "whitespace-nowrap"
            )}
            style={{
              top: `${tooltipPosition.top}px`,
              left: `${tooltipPosition.left}px`,
              transform: "translateY(-50%)", // Center vertically
            }}
            role="tooltip"
            aria-hidden="true"
          >
            {/* Arrow pointer pointing to the icon */}
            <div
              className="absolute left-0 top-1/2 -translate-x-full -translate-y-1/2 flex items-center"
              aria-hidden="true"
            >
              {/* Arrow fill */}
              <div
                className="w-0 h-0 border-t-[6px] border-b-[6px] border-r-[6px] border-t-transparent border-b-transparent border-r-bg-white"
              />
            </div>
            {label}
          </div>,
          document.body
        )
      )}
    </>
  );
}

