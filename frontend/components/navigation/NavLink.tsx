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
        "inline-flex items-center gap-2 px-4 py-2 rounded-lg",
        "text-base font-medium transition-colors",
        "focus:outline-2 focus:outline-accent-orange focus:outline-offset-2",
        isActive
          ? "bg-primary-green text-white"
          : "text-text-primary hover:bg-light-green/10 hover:text-primary-green",
        className
      )}
      aria-current={isActive ? "page" : undefined}
    >
      {Icon && <Icon className="w-5 h-5" aria-hidden="true" />}
      <span>{label}</span>
    </Link>
  );
}

