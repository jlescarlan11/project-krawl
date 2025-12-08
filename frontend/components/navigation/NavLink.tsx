"use client";

import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface NavLinkProps {
  href: string;
  label: string;
  icon?: LucideIcon;
  exact?: boolean; // Exact match vs prefix match
  className?: string;
  onClick?: () => void;
  hideLabel?: boolean; // Hide label text (for icon-only mode)
}

/**
 * NavLink component
 *
 * Navigation link with active state detection and accessibility support.
 * Automatically highlights when the current route matches the link href.
 */
export function NavLink({
  href,
  label,
  icon: Icon,
  exact = false,
  className,
  onClick,
  hideLabel = false,
}: NavLinkProps) {
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const linkRef = useRef<HTMLAnchorElement>(null);

  // Track mount state for portal
  useEffect(() => {
    setMounted(true);
  }, []);

  // Calculate tooltip position based on link position
  useLayoutEffect(() => {
    if (isHovered && hideLabel && linkRef.current) {
      const updatePosition = () => {
        if (linkRef.current) {
          const rect = linkRef.current.getBoundingClientRect();
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
  }, [isHovered, hideLabel]);

  // Determine if link is active
  // Handle case where pathname might be null during SSR
  const isActive = pathname 
    ? (exact ? pathname === href : pathname.startsWith(href))
    : false;

  return (
    <>
      <Link
        ref={linkRef}
        href={href}
        onClick={onClick}
        onMouseEnter={() => hideLabel && setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          "inline-flex items-center gap-2 px-4 py-3 rounded-xl",
          "text-base font-medium transition-all duration-200",
          "focus:outline-2 focus:outline-primary-green focus:outline-offset-2",
          "relative group",
          isActive
            ? "bg-primary-green text-white shadow-md shadow-primary-green/20"
            : "text-text-primary hover:bg-primary-green/10 hover:text-primary-green hover:scale-105 active:scale-95",
          hideLabel && "justify-center px-3",
          className
        )}
        aria-current={isActive ? "page" : undefined}
        aria-label={label}
      >
        {Icon && (
          <Icon
            className={cn(
              "w-5 h-5 transition-transform duration-200",
              isActive ? "scale-110" : "group-hover:scale-110"
            )}
            aria-hidden="true"
          />
        )}
        {!hideLabel && <span>{label}</span>}
        {/* Active indicator dot */}
        {isActive && hideLabel && (
          <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white" />
        )}
      </Link>

      {/* Custom tooltip with arrow */}
      {isHovered && hideLabel && mounted && (
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

