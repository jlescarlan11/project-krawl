"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/lib/routes";
import type { FeaturedKrawl } from "./types";

interface FeaturedKrawlCardProps {
  className?: string;
  krawl: FeaturedKrawl;
}

const formatDuration = (minutes?: number) => {
  if (!minutes) return "—";
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins}m`;
};

const difficultyColor = (difficulty?: string) => {
  switch (difficulty?.toLowerCase()) {
    case "easy":
      return "bg-primary-green/20 text-primary-green";
    case "moderate":
    case "medium":
      return "bg-yellow-100 text-yellow-600";
    case "hard":
      return "bg-red-100 text-red-600";
    default:
      return "bg-bg-medium/30 text-text-primary";
  }
};

export function FeaturedKrawlCard({ className, krawl }: FeaturedKrawlCardProps) {
  return (
    <article className={cn("group flex h-full w-full flex-col rounded-[1.75rem] bg-bg-white shadow-xl transition-shadow duration-300 hover:shadow-2xl", className)}>
      <Link
        href={ROUTES.KRAWL_DETAIL(krawl.id)}
        className="flex h-full flex-col"
      >
        <div className="relative h-48 w-full overflow-hidden rounded-t-[1.45rem]">
          <Image
            src={krawl.coverImage}
            alt={`Cover image for ${krawl.name}`}
            width={640}
            height={360}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            sizes="(max-width: 1024px) 100vw, 640px"
            unoptimized
          />
        </div>
        <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3 text-xs font-semibold uppercase tracking-[0.4em] text-text-tertiary/70">
            <span className="text-[0.65rem] uppercase tracking-[0.5em]">Featured</span>
            <span className={cn("rounded-full px-3 py-1 text-[0.6rem] font-semibold", difficultyColor(krawl.difficulty))}>
              {krawl.difficulty ?? "Unknown"}
            </span>
          </div>
          <h3 className="text-lg font-semibold leading-tight text-text-primary line-clamp-2">
            {krawl.name}
          </h3>
          <p className="text-sm text-text-secondary line-clamp-2">
            {krawl.description || "Discover this community-curated route in Cebu City."}
          </p>
          <div className="mt-auto flex flex-wrap gap-3 text-sm text-text-secondary">
            <span className="rounded-full border border-border py-1 px-3 font-semibold text-text-primary">
              {formatDuration(krawl.estimatedDurationMinutes)}
            </span>
            <span className="rounded-full border border-border py-1 px-3 font-semibold text-text-primary">
              {krawl.gemsCount ?? "—"} Gems
            </span>
            <span className="ml-auto flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.35em] text-text-primary">
              <svg className="h-3 w-3 text-accent-orange" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.358 4.177a1 1 0 0 0 .95.69h4.386c.969 0 1.371 1.24.588 1.81l-3.553 2.586a1 1 0 0 0-.364 1.118l1.357 4.177c.3.921-.755 1.688-1.54 1.118l-3.553-2.586a1 1 0 0 0-1.176 0l-3.553 2.586c-.784.57-1.84-.197-1.54-1.118l1.357-4.177a1 1 0 0 0-.364-1.118L2.77 9.604c-.783-.57-.38-1.81.588-1.81h4.386a1 1 0 0 0 .95-.69l1.358-4.177z" />
              </svg>
              {krawl.rating ?? "—"}
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}

