"use client";

import Image from "next/image";
import Link from "next/link";

import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";
import type { PopularGem } from "./types";

interface PopularGemCardProps {
  gem: PopularGem;
  className?: string;
}

const FALLBACK_THUMBNAIL =
  "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=900&q=60&sat=-100&blend=111827&blend-mode=multiply";

const BLUR_DATA_URL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR4AWP4+/btfwAJDQO11FXGeQAAAABJRU5ErkJggg==";

const formatCount = (count?: number) => {
  if (typeof count !== "number") return "—";
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1).replace(/\\.0$/, "")}k`;
  }
  return count.toString();
};

export function PopularGemCard({ gem, className }: PopularGemCardProps) {
  const thumbnail = gem.thumbnailUrl || FALLBACK_THUMBNAIL;

  return (
    <article
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-[var(--color-border-subtle)] bg-bg-white shadow-[var(--shadow-elevation-1)] transition-shadow duration-300 hover:shadow-[var(--shadow-elevation-2)]",
        className
      )}
    >
      <Link href={ROUTES.GEM_DETAIL(gem.id)} className="flex h-full flex-col focus-visible:outline-none">
        <div className="relative h-52 w-full overflow-hidden">
          <Image
            src={thumbnail}
            alt={`Photo of ${gem.name}`}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 320px"
            placeholder="blur"
            blurDataURL={BLUR_DATA_URL}
            unoptimized
          />
          <div className="pointer-events-none absolute left-4 top-4 rounded-full bg-bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-text-secondary">
            {gem.category}
          </div>
          {typeof gem.rating === "number" && (
            <div className="pointer-events-none absolute right-4 top-4 flex items-center gap-1 rounded-full bg-text-primary/90 px-2.5 py-1 text-xs font-semibold text-white">
              <svg className="h-3.5 w-3.5 text-accent-orange" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.358 4.177a1 1 0 0 0 .95.69h4.386c.969 0 1.371 1.24.588 1.81l-3.553 2.586a1 1 0 0 0-.364 1.118l1.357 4.177c.3.921-.755 1.688-1.54 1.118l-3.553-2.586a1 1 0 0 0-1.176 0l-3.553 2.586c-.784.57-1.84-.197-1.54-1.118l1.357-4.177a1 1 0 0 0-.364-1.118L2.77 9.604c-.783-.57-.38-1.81.588-1.81h4.386a1 1 0 0 0 .95-.69l1.358-4.177z" />
              </svg>
              <span>{gem.rating.toFixed(1)}</span>
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col gap-3 p-5">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-lg font-semibold leading-tight text-text-primary line-clamp-2">{gem.name}</h3>
          </div>
          <p className="text-sm text-text-secondary line-clamp-2">
            {gem.shortDescription ?? `Discover why folks keep revisiting ${gem.name}.`}
          </p>
          <div className="mt-auto flex flex-wrap items-center gap-3 text-sm">
            <span className="inline-flex items-center gap-1 rounded-full bg-bg-medium/50 px-3 py-1 font-medium text-text-primary">
              <svg className="h-4 w-4 text-accent-orange" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  d="M10 2a6 6 0 0 0-6 6c0 4.5 6 10 6 10s6-5.5 6-10a6 6 0 0 0-6-6Zm0 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4Z"
                  clipRule="evenodd"
                />
              </svg>
              {gem.district}
            </span>
            <span className="inline-flex items-center gap-1 text-text-secondary">
              <svg className="h-4 w-4 text-text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 20.25c4.97-3 7.5-7.5 7.5-10.5A7.5 7.5 0 0 0 12 2.25 7.5 7.5 0 0 0 4.5 9.75c0 3 2.53 7.5 7.5 10.5Z"
                />
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9.75h7.5" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75v6" />
              </svg>
              {formatCount(gem.vouchCount)} vouches
            </span>
            <span className="inline-flex items-center gap-1 text-text-secondary">
              <svg className="h-4 w-4 text-text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 5.25h16.5m-16.5 6h16.5m-16.5 6h10.5"
                />
              </svg>
              {formatCount(gem.viewCount)} views
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}












