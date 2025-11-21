"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { ROUTES } from "@/lib/routes";

interface BreadcrumbItem {
  label: string;
  href: string;
}

/**
 * Breadcrumbs component
 *
 * Displays breadcrumb navigation for deep navigation paths.
 * Automatically generates breadcrumbs from the current pathname.
 */
export function Breadcrumbs() {
  const pathname = usePathname();

  // Generate breadcrumbs from pathname
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const items: BreadcrumbItem[] = [
      { label: "Home", href: ROUTES.HOME },
    ];

    const segments = pathname.split("/").filter(Boolean);

    // Segment label mapping for human-readable breadcrumbs
    const SEGMENT_LABELS: Record<string, string> = {
      map: "Map",
      search: "Search",
      gems: "Gems",
      krawls: "Krawls",
      create: "Create",
      users: "Users",
      settings: "Settings",
      mode: "Krawl Mode",
    };

    segments.forEach((segment, index) => {
      const href = "/" + segments.slice(0, index + 1).join("/");
      
      // Humanize segment names
      let label: string;
      if (SEGMENT_LABELS[segment]) {
        label = SEGMENT_LABELS[segment];
      } else if (!isNaN(Number(segment))) {
        // Dynamic segment (ID)
        label = "Details";
      } else {
        // Fallback to original segment
        label = segment;
      }

      items.push({ label, href });
    });

    return items;
  };

  const breadcrumbs = generateBreadcrumbs();

  // Don't show breadcrumbs on home page or shallow paths
  if (breadcrumbs.length <= 2) {
    return null;
  }

  return (
    <nav className="container mx-auto px-4 py-2" aria-label="Breadcrumb">
      <ol className="flex items-center gap-2 text-sm">
        {breadcrumbs.map((item, index) => {
          const isLast = index === breadcrumbs.length - 1;

          return (
            <li key={item.href} className="flex items-center gap-2">
              {index === 0 ? (
                <Link
                  href={item.href}
                  className="text-text-secondary hover:text-primary-green"
                  aria-label="Home"
                >
                  <Home className="w-4 h-4" />
                </Link>
              ) : (
                <>
                  <ChevronRight className="w-4 h-4 text-text-tertiary" />
                  {isLast ? (
                    <span className="text-text-primary font-medium">
                      {item.label}
                    </span>
                  ) : (
                    <Link
                      href={item.href}
                      className="text-text-secondary hover:text-primary-green"
                    >
                      {item.label}
                    </Link>
                  )}
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

