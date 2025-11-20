"use client";

type QuickStartActionsProps = {
  onExploreAsGuest: () => void;
  onSignIn: () => void;
};

export function QuickStartActions({
  onExploreAsGuest,
  onSignIn,
}: QuickStartActionsProps) {
  return (
    <div className="flex flex-col gap-3 rounded-[var(--radius-lg)] border border-[var(--color-bg-medium)] p-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-base font-semibold text-[var(--color-text-primary)]">
          Choose how you want to start
        </p>
        <p className="text-sm text-[var(--color-text-secondary)]">
          You can explore as a guest or sign in to create and save your own Gems
          and Krawls.
        </p>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={onExploreAsGuest}
          className="inline-flex w-full items-center justify-center rounded-[var(--radius-default)] bg-[var(--color-primary-green)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-dark-green)] sm:w-auto"
        >
          Explore as Guest
        </button>
        <button
          type="button"
          onClick={onSignIn}
          className="inline-flex w-full items-center justify-center rounded-[var(--radius-default)] border border-[var(--color-primary-green)] px-5 py-2.5 text-sm font-semibold text-[var(--color-primary-green)] transition hover:bg-[var(--color-primary-green)]/10 sm:w-auto"
        >
          Sign In to Create
        </button>
      </div>
    </div>
  );
}

