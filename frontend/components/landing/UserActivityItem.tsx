"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/lib/routes";
import type { UserActivityItemData } from "./types";

interface UserActivityItemProps {
  item: UserActivityItemData;
  className?: string;
}

/**
 * User Activity Item
 * 
 * Displays a single activity item (Gem or Krawl) in the user activity section.
 * 
 * @example
 * ```tsx
 * <UserActivityItem item={activityItem} />
 * ```
 */
export function UserActivityItem({ item, className }: UserActivityItemProps) {
  const isGem = item.type === "gem";
  const href = isGem ? ROUTES.GEM_DETAIL(item.id) : ROUTES.KRAWL_DETAIL(item.id);
  const imageUrl = isGem ? item.thumbnailUrl : item.coverImage;

  return (
    <article
      className={cn(
        "group flex h-full w-full flex-col rounded-[1.5rem] border border-[var(--color-border-subtle)] bg-bg-white shadow-[var(--shadow-elevation-1)] transition-shadow duration-300 hover:shadow-[var(--shadow-elevation-2)]",
        className
      )}
    >
      <Link href={href} className="flex h-full flex-col focus-visible:outline-none">
        {imageUrl && (
          <div className="relative h-40 w-full overflow-hidden rounded-t-[1.25rem]">
            <Image
              src={imageUrl}
              alt={`${item.type === "gem" ? "Gem" : "Krawl"}: ${item.name}`}
              fill
              className="object-cover transition duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 280px"
              unoptimized
            />
            <div className="pointer-events-none absolute left-3 top-3 rounded-full bg-bg-white/90 px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-text-secondary">
              {isGem ? item.category : "Krawl"}
            </div>
          </div>
        )}
        <div className="flex flex-1 flex-col gap-2 p-4">
          <h3 className="text-base font-semibold leading-tight text-text-primary line-clamp-2">
            {item.name}
          </h3>
          {item.district && (
            <p className="text-xs text-text-secondary">{item.district}</p>
          )}
          {item.gemsCount && (
            <p className="text-xs text-text-secondary">{item.gemsCount} Gems</p>
          )}
        </div>
      </Link>
    </article>
  );
}

