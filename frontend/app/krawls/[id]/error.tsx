"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";
import { PageLayout } from "@/components/layout/PageLayout";

/**
 * Error UI for Krawl Detail Page
 *
 * This component is automatically shown by Next.js when:
 * - An error occurs during data fetching
 * - An error is thrown in the page component
 * - A component throws an error during rendering
 *
 * Provides:
 * - User-friendly error message
 * - Retry button to attempt reloading
 * - Link to return to the home/map page
 * - Error details in development mode
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Krawl detail page error:", error);
  }, [error]);

  return (
    <PageLayout breadcrumbs>
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          {/* Error Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </div>

          {/* Error Message */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-text-primary mb-3">
              Something went wrong
            </h1>
            <p className="text-text-secondary">
              We encountered an error while loading this krawl. This could be due
              to a network issue or the krawl data being temporarily unavailable.
            </p>
          </div>

          {/* Error Details (Development Only) */}
          {process.env.NODE_ENV === "development" && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm font-mono text-text-secondary break-all">
                {error.message}
              </p>
              {error.digest && (
                <p className="text-xs text-text-tertiary mt-2">
                  Error ID: {error.digest}
                </p>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {/* Retry Button */}
            <button
              type="button"
              onClick={() => reset()}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-green text-white rounded-lg hover:bg-primary-green/90 transition-colors font-medium"
            >
              <RefreshCw className="w-5 h-5" />
              Try Again
            </button>

            {/* Home Button */}
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-text-primary border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              <Home className="w-5 h-5" />
              Back to Map
            </Link>
          </div>

          {/* Help Text */}
          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm text-text-tertiary">
              If the problem persists, please try again later or contact
              support.
            </p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

