"use client";

import { Component, ErrorInfo, ReactNode } from "react";
import * as Sentry from "@sentry/nextjs";
import { ErrorDisplay } from "@/components/ui/error-display";

interface Props {
  children: ReactNode;
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * SentryErrorBoundary component
 *
 * React error boundary that integrates with Sentry for error tracking.
 * Catches React component errors and displays a user-friendly error UI
 * using the ErrorDisplay component.
 *
 * @example
 * ```tsx
 * <SentryErrorBoundary>
 *   <YourComponent />
 * </SentryErrorBoundary>
 * ```
 */
export class SentryErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Send error to Sentry with React component stack
    Sentry.captureException(error, {
      contexts: {
        react: {
          componentStack: errorInfo.componentStack,
        },
      },
      tags: {
        errorBoundary: true,
      },
    });
  }

  handleReset = () => {
    // Clear Sentry error context when resetting the boundary
    // This ensures subsequent errors aren't incorrectly associated with the previous error
    try {
      Sentry.setContext("errorBoundary", null);
    } catch {
      // Ignore errors when clearing context (non-critical)
    }

    // Reset component state
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        const Fallback = this.props.fallback;
        return (
          <Fallback error={this.state.error} resetError={this.handleReset} />
        );
      }

      // Default error UI using ErrorDisplay component
      return (
        <ErrorDisplay
          title="Something went wrong"
          message="We're sorry, but something unexpected happened. Our team has been notified and is working on a fix."
          retryAction={this.handleReset}
          variant="error"
        />
      );
    }

    return this.props.children;
  }
}

