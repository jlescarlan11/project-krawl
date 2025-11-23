"use client";

import { AlertCircle } from "lucide-react";

/**
 * Error messages mapping for NextAuth.js error codes
 */
const ERROR_MESSAGES: Record<string, { title: string; message: string }> = {
  Configuration: {
    title: "Configuration Error",
    message:
      "Authentication is not properly configured. Please contact support if this issue persists.",
  },
  AccessDenied: {
    title: "Access Denied",
    message:
      "You denied access to your Google account. Please try again and grant the necessary permissions.",
  },
  Verification: {
    title: "Verification Failed",
    message:
      "We couldn't verify your account. Please try signing in again.",
  },
  Default: {
    title: "Sign-In Error",
    message:
      "An error occurred during sign-in. Please try again. If the problem persists, contact support.",
  },
};

/**
 * Auth Error Display Component
 * 
 * Displays user-friendly error messages for authentication errors.
 * Maps NextAuth.js error codes to readable messages.
 * 
 * @example
 * ```tsx
 * <AuthErrorDisplay error="AccessDenied" />
 * ```
 */
export interface AuthErrorDisplayProps {
  error: string;
}

export function AuthErrorDisplay({ error }: AuthErrorDisplayProps) {
  const errorInfo =
    ERROR_MESSAGES[error] || ERROR_MESSAGES.Default;

  return (
    <div className="rounded-lg border-2 border-error bg-error/5 p-4">
      <div className="flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-error flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-semibold text-error mb-1">{errorInfo.title}</h3>
          <p className="text-sm text-text-secondary">{errorInfo.message}</p>
        </div>
      </div>
    </div>
  );
}

