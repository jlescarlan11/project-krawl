// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";
import { beforeSendError, shouldSendError } from "@/lib/sentry/error-filtering";
import { getValidatedDSN } from "@/lib/sentry/config-validation";

// Validate DSN before initializing Sentry
const dsn = getValidatedDSN();

// Only initialize Sentry if DSN is valid
if (dsn) {
  Sentry.init({
    dsn,

  environment:
    process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT || "development",

  // Release tracking - use Git commit SHA if available
  release:
    process.env.NEXT_PUBLIC_SENTRY_RELEASE ||
    process.env.VERCEL_GIT_COMMIT_SHA ||
    "development",

  // Add optional integrations for additional features
  integrations: [
    Sentry.replayIntegration({
      // Mask all text and media for privacy
      maskAllText: true,
      blockAllMedia: true,
    }),
    Sentry.browserTracingIntegration({
      // Browser tracing is automatically configured for Next.js
      // Trace propagation is handled automatically by Next.js routing
    }),
  ],

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

  // Enable logs to be sent to Sentry
  enableLogs: true,

  // Define how likely Replay events are sampled.
  // This sets the sample rate to be 10%. You may want this to be 100% while
  // in development and sample at a lower rate in production
  replaysSessionSampleRate: 0.1,

  // Define how likely Replay events are sampled when an error occurs.
  replaysOnErrorSampleRate: 1.0,

  // Error filtering - custom implementation
  beforeSend(event, hint) {
    // Apply error filtering
    if (!shouldSendError(event, hint)) {
      return null;
    }

    // Sanitize sensitive data
    // beforeSendError now returns ErrorEvent | null, which matches beforeSend signature
    return beforeSendError(event, hint);
  },

  // Performance transaction filtering
  beforeSendTransaction(event) {
    // Filter out health check endpoints
    if (event.transaction?.includes("/api/health")) {
      return null;
    }
    return event;
  },

  // Enable sending user PII (Personally Identifiable Information)
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#sendDefaultPii
  // Note: We handle PII filtering in beforeSend hook instead
  sendDefaultPii: false,

  // Debug mode (development only)
  debug:
    process.env.NODE_ENV === "development" &&
    process.env.NEXT_PUBLIC_DEBUG === "true",

  // Ignore specific errors
  ignoreErrors: [
    // Browser extension errors (also filtered in shouldSendError)
    "chrome-extension://",
    "moz-extension://",
    "safari-extension://",
    // Known benign errors
    "ResizeObserver loop limit exceeded",
    "Non-Error promise rejection captured",
  ],
  });
} else {
  // No-op initialization when DSN is missing/invalid
  // This prevents errors when Sentry methods are called
  if (process.env.NODE_ENV === "development") {
    console.warn("[Sentry] Client-side error tracking is disabled due to invalid DSN.");
  }
}

export const onRouterTransitionStart = dsn
  ? Sentry.captureRouterTransitionStart
  : () => {
      // No-op when Sentry is not initialized
    };

