"use client";

import { useEffect, useState } from "react";
import { areCookiesBlocked, getCookieWarningMessage } from "@/lib/cookie-utils";
import { X } from "lucide-react";

/**
 * Cookie Warning Banner Component
 * 
 * Displays a warning banner if cookies are disabled in the browser.
 * This helps users understand why authentication might not work.
 * 
 * @example
 * ```tsx
 * <CookieWarningBanner />
 * ```
 */
export function CookieWarningBanner() {
  const [showWarning, setShowWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);

  useEffect(() => {
    // Only check on client side
    if (typeof window === "undefined") {
      return;
    }

    // Check if cookies are blocked
    const blocked = areCookiesBlocked();
    if (blocked) {
      const message = getCookieWarningMessage();
      setWarningMessage(message);
      setShowWarning(true);
    }
  }, []);

  if (!showWarning || !warningMessage) {
    return null;
  }

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 bg-yellow-50 border-t border-yellow-200 px-4 py-3 shadow-lg"
      role="alert"
      aria-live="polite"
    >
      <div className="max-w-7xl mx-auto flex items-start justify-between gap-4">
        <div className="flex-1">
          <p className="text-sm text-yellow-800 font-medium">
            {warningMessage}
          </p>
        </div>
        <button
          onClick={() => setShowWarning(false)}
          className="flex-shrink-0 text-yellow-600 hover:text-yellow-800 transition-colors"
          aria-label="Dismiss warning"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

