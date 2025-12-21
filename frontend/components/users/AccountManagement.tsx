"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  deleteAccount,
  disconnectOAuthProvider,
  type UserProfile,
} from "@/lib/api/users";
import { signOut } from "next-auth/react";

export interface AccountManagementProps {
  /** Current user profile */
  profile: UserProfile;

  /** Callback when account is deleted */
  onAccountDeleted?: () => void;

  /** Callback when operation fails */
  onError?: (error: string) => void;

  /** Optional className for styling */
  className?: string;
}

/**
 * AccountManagement Component
 *
 * Allows users to manage connected accounts and delete their account.
 */
export function AccountManagement({
  profile,
  onAccountDeleted,
  onError,
  className,
}: AccountManagementProps) {
  const [disconnecting, setDisconnecting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDisconnectGoogle = async () => {
    if (
      !confirm(
        "Are you sure you want to disconnect your Google account? You may not be able to sign in again."
      )
    ) {
      return;
    }

    try {
      setDisconnecting(true);
      await disconnectOAuthProvider(profile.id, "google");
      // Sign out after disconnecting
      await signOut({ callbackUrl: "/" });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to disconnect account";
      onError?.(errorMessage);
    } finally {
      setDisconnecting(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (
      !confirm(
        "Are you sure you want to delete your account? This action cannot be undone. All your data will be permanently deleted."
      )
    ) {
      return;
    }

    try {
      setDeleting(true);
      await deleteAccount(profile.id);
      onAccountDeleted?.();
      // Sign out after deletion
      await signOut({ callbackUrl: "/" });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete account";
      onError?.(errorMessage);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-text-primary">
            Connected Accounts
          </h2>
          <p className="text-sm text-text-secondary">
            Manage your connected authentication providers.
          </p>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-bg-medium rounded-lg">
              <div>
                <p className="font-medium text-text-primary">Google</p>
                <p className="text-sm text-text-secondary">
                  Connected via OAuth
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDisconnectGoogle}
                loading={disconnecting}
              >
                Disconnect
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-red-600">
            Danger Zone
          </h2>
          <p className="text-sm text-text-secondary">
            Permanently delete your account and all associated data.
          </p>
        </CardHeader>
        <CardBody>
          {!showDeleteConfirm ? (
            <Button
              variant="accent"
              onClick={() => setShowDeleteConfirm(true)}
            >
              Delete Account
            </Button>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-text-secondary">
                Are you sure you want to delete your account? This action
                cannot be undone. All your data, including Gems, Krawls, and
                comments, will be permanently deleted.
              </p>
              <div className="flex gap-4">
                <Button
                  variant="accent"
                  onClick={handleDeleteAccount}
                  loading={deleting}
                >
                  Yes, Delete My Account
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}

