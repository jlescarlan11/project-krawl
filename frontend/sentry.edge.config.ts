// This file configures the initialization of Sentry for edge features (middleware, edge routes, and so on).
// The config you add here will be used whenever one of the edge features is loaded.
// Note that this config is unrelated to the Vercel Edge Runtime and is also required when running locally.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";
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
  // Lower sample rate for edge runtime to reduce overhead
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

  // Enable logs to be sent to Sentry
  enableLogs: true,

  // Enable sending user PII (Personally Identifiable Information)
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#sendDefaultPii
  sendDefaultPii: false,

  // Error filtering and sanitization for edge runtime
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  beforeSend(event, _hint) { // Prefix with _ to indicate intentionally unused
    // Filter browser extension errors
    const errorValue = event.exception?.values?.[0]?.value || "";
    if (
      errorValue.includes("chrome-extension://") ||
      errorValue.includes("moz-extension://") ||
      errorValue.includes("safari-extension://")
    ) {
      return null;
    }

    // Filter known benign errors
    if (
      errorValue.includes("ResizeObserver loop limit exceeded") ||
      errorValue.includes("Non-Error promise rejection captured")
    ) {
      return null;
    }

    // Basic sanitization: remove sensitive headers
    if (event.request?.headers) {
      const sensitiveHeaders = [
        "authorization",
        "cookie",
        "x-api-key",
        "x-auth-token",
      ];
      const sanitizedHeaders: Record<string, string> = {};

      for (const [key, value] of Object.entries(event.request.headers)) {
        const lowerKey = key.toLowerCase();
        if (sensitiveHeaders.some((h) => lowerKey.includes(h))) {
          sanitizedHeaders[key] = "[REDACTED]";
        } else {
          sanitizedHeaders[key] = value as string;
        }
      }

      event.request.headers = sanitizedHeaders;
    }

    // Remove email from user data if present
    if (event.user?.email) {
      const sanitizedUser = { ...event.user };
      delete sanitizedUser.email;
      event.user = sanitizedUser;
    }

    return event;
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
    console.warn("[Sentry] Edge runtime error tracking is disabled due to invalid DSN.");
  }
}
