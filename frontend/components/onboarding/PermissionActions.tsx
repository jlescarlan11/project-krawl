"use client";

import type { PermissionStatus } from "./types";

type PermissionActionsProps = {
  status: PermissionStatus;
  onAllowLocation: () => void | Promise<void>;
  onEnableNotifications: () => void | Promise<void>;
  isLocationPending?: boolean;
  isNotificationPending?: boolean;
};

const bulletCopy = [
  "Show nearby cultural Gems",
  "Guide you through curated Krawls",
  "Personalize recommendations",
];

export function PermissionActions({
  status,
  onAllowLocation,
  onEnableNotifications,
  isLocationPending,
  isNotificationPending,
}: PermissionActionsProps) {
  return (
    <div className="flex flex-col gap-6 rounded-[var(--radius-lg)] bg-[var(--color-bg-light)] p-6 shadow-[var(--shadow-elevation-0)] sm:flex-row sm:items-start">
      <div className="flex-1 space-y-3">
        <p className="text-sm font-semibold uppercase tracking-wide text-[var(--color-text-secondary)]">
          Why we ask
        </p>
        <ul className="space-y-2 text-base text-[var(--color-text-secondary)]">
          {bulletCopy.map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span aria-hidden className="mt-1 text-[var(--color-primary-green)]">
                ●
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-1 flex-col gap-3">
        <button
          type="button"
          onClick={onAllowLocation}
          disabled={isLocationPending}
          className="inline-flex w-full items-center justify-center gap-2 rounded-[var(--radius-default)] bg-[var(--color-primary-green)] px-6 py-3 text-base font-semibold text-white transition hover:bg-[var(--color-dark-green)] disabled:cursor-not-allowed disabled:bg-[var(--color-light-green)]"
        >
          {isLocationPending ? "Requesting..." : "Allow Location"}
          {status.location === "granted" && (
            <span aria-label="Granted" className="text-xl">
              ✅
            </span>
          )}
          {status.location === "denied" && (
            <span aria-label="Denied" className="text-xl">
              ⚠️
            </span>
          )}
        </button>
        {status.locationMessage && (
          <p className="text-sm text-[var(--color-error)]">{status.locationMessage}</p>
        )}

        <button
          type="button"
          onClick={onEnableNotifications}
          disabled={isNotificationPending}
          className="inline-flex w-full items-center justify-center gap-2 rounded-[var(--radius-default)] border border-[var(--color-primary-green)] px-6 py-3 text-base font-semibold text-[var(--color-primary-green)] transition hover:bg-[var(--color-primary-green)]/10 disabled:cursor-not-allowed disabled:border-[var(--color-light-green)] disabled:text-[var(--color-light-green)]"
        >
          {isNotificationPending ? "Requesting..." : "Enable Notifications"}
          {status.notification === "granted" && (
            <span aria-label="Granted" className="text-xl">
              ✅
            </span>
          )}
          {status.notification === "denied" && (
            <span aria-label="Denied" className="text-xl">
              ⚠️
            </span>
          )}
        </button>
        {status.notificationMessage && (
          <p className="text-sm text-[var(--color-error)]">
            {status.notificationMessage}
          </p>
        )}

        <p className="text-sm text-[var(--color-text-secondary)]">
          You can update these permissions anytime in your device settings.
        </p>
      </div>
    </div>
  );
}

