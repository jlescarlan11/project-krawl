"use client";

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

  // Determine if link is active
  // Handle case where pathname might be null during SSR
  const isActive = pathname 
    ? (exact ? pathname === href : pathname.startsWith(href))
    : false;

  return (
    <Link
      href={href}
      onClick={onClick}
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
      title={hideLabel ? label : undefined}
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
  );
}

