"use client";

import { Button, ButtonProps } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

/**
 * Google Sign-In Button Component
 * 
 * Reusable button component for Google OAuth sign-in.
 * Includes loading state and proper accessibility.
 * 
 * @example
 * ```tsx
 * <GoogleSignInButton
 *   onClick={handleSignIn}
 *   loading={isLoading}
 *   fullWidth
 * />
 * ```
 */
export interface GoogleSignInButtonProps
  extends Omit<ButtonProps, "onClick"> {
  onClick: () => void | Promise<void>;
  loading?: boolean;
}

export function GoogleSignInButton({
  onClick,
  loading = false,
  disabled,
  ...props
}: GoogleSignInButtonProps) {
  return (
    <Button
      variant="primary"
      size="lg"
      onClick={onClick}
      disabled={disabled || loading}
      loading={loading}
      fullWidth
      {...props}
    >
      {loading ? "Signing in..." : "Sign in with Google"}
    </Button>
  );
}

