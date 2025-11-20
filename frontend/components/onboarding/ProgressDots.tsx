"use client";

type ProgressDotsProps = {
  total: number;
  currentIndex: number;
  onSelect?: (index: number) => void;
};

export function ProgressDots({
  total,
  currentIndex,
  onSelect,
}: ProgressDotsProps) {
  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: total }).map((_, index) => {
        const isActive = index === currentIndex;
        const isInteractive = !!onSelect && index !== currentIndex;
        return (
          <button
            key={`dot-${index}`}
            type="button"
            onClick={() => (isInteractive ? onSelect?.(index) : undefined)}
            aria-label={`Go to step ${index + 1}`}
            aria-current={isActive ? "step" : undefined}
            aria-disabled={!isInteractive}
            className={`h-3 w-3 rounded-full transition ${
              isActive
                ? "w-6 bg-[var(--color-primary-green)]"
                : "bg-[var(--color-bg-medium)] hover:bg-[var(--color-primary-green)]/60"
            } focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-orange)]`}
            disabled={!isInteractive}
          />
        );
      })}
    </div>
  );
}

