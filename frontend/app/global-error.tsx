"use client";

import * as Sentry from "@sentry/nextjs";
import NextError from "next/error";
import { useEffect } from "react";

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    // Capture error with additional context for better debugging
    Sentry.captureException(error, {
      tags: {
        errorType: "global",
        digest: error.digest || "unknown",
      },
      contexts: {
        runtime: {
          name: "nextjs",
          version: process.env.NEXT_PUBLIC_APP_VERSION || "unknown",
        },
      },
      level: "fatal", // Global errors are typically fatal
    });
  }, [error]);

  return (
    <html>
      <body>
        {/* `NextError` is the default Next.js error page component. Its type
        definition requires a `statusCode` prop. However, since the App Router
        does not expose status codes for errors, we simply pass 0 to render a
        generic error message. */}
        <NextError statusCode={0} />
      </body>
    </html>
  );
}
