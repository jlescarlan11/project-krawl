// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
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

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

  // Enable logs to be sent to Sentry
  enableLogs: true,

  // Enable sending user PII (Personally Identifiable Information)
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#sendDefaultPii
  // Note: We handle PII filtering in beforeSend hook instead
  sendDefaultPii: false,

  // Error filtering
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
  });
} else {
  // No-op initialization when DSN is missing/invalid
  if (process.env.NODE_ENV === "development") {
    console.warn("[Sentry] Server-side error tracking is disabled due to invalid DSN.");
  }
}
