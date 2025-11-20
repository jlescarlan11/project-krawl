"use client";

type SkipButtonProps = {
  onClick: () => void;
};

export function SkipButton({ onClick }: SkipButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-sm font-semibold text-[var(--color-text-secondary)] underline-offset-4 transition hover:text-[var(--color-primary-green)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-orange)]"
    >
      Skip
    </button>
  );
}

