"use client";

import { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  updateNotificationPreferences,
  type NotificationPreferencesRequest,
  type UserProfile,
} from "@/lib/api/users";

export interface NotificationPreferencesProps {
  /** Current user profile */
  profile: UserProfile;

  /** Callback when preferences are updated */
  onSuccess?: () => void;

  /** Callback when update fails */
  onError?: (error: string) => void;

  /** Optional className for styling */
  className?: string;
}

/**
 * NotificationPreferences Component
 *
 * Allows users to manage email and push notification preferences.
 */
export function NotificationPreferences({
  profile,
  onSuccess,
  onError,
  className,
}: NotificationPreferencesProps) {
  const [emailPrefs, setEmailPrefs] = useState({
    comments: true,
    vouches: true,
    ratings: true,
    weeklyDigest: false,
  });

  const [pushPrefs, setPushPrefs] = useState({
    krawlModeUpdates: true,
    newContent: false,
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Load preferences from profile if available
    // Note: notificationPreferences is stored separately from privacySettings
    // For now, we'll use default values. In production, fetch from user's notificationPreferences field
    // This would require the backend to return notificationPreferences in the profile response
  }, [profile]);

  const handleSave = async () => {
    try {
      setSaving(true);

      const request: NotificationPreferencesRequest = {
        email: emailPrefs,
        push: pushPrefs,
      };

      await updateNotificationPreferences(profile.id, request);
      onSuccess?.();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update preferences";
      onError?.(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-text-primary">
            Email Notifications
          </h2>
          <p className="text-sm text-text-secondary">
            Choose which email notifications you want to receive.
          </p>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            <Checkbox
              label="New comments on my content"
              checked={emailPrefs.comments}
              onCheckedChange={(checked) =>
                setEmailPrefs({ ...emailPrefs, comments: checked })
              }
            />
            <Checkbox
              label="New vouches on my content"
              checked={emailPrefs.vouches}
              onCheckedChange={(checked) =>
                setEmailPrefs({ ...emailPrefs, vouches: checked })
              }
            />
            <Checkbox
              label="New ratings on my content"
              checked={emailPrefs.ratings}
              onCheckedChange={(checked) =>
                setEmailPrefs({ ...emailPrefs, ratings: checked })
              }
            />
            <Checkbox
              label="Weekly digest"
              checked={emailPrefs.weeklyDigest}
              onCheckedChange={(checked) =>
                setEmailPrefs({ ...emailPrefs, weeklyDigest: checked })
              }
            />
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-text-primary">
            Push Notifications
          </h2>
          <p className="text-sm text-text-secondary">
            Push notifications will be available in a future update.
          </p>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            <Checkbox
              label="Krawl Mode updates"
              checked={pushPrefs.krawlModeUpdates}
              onCheckedChange={(checked) =>
                setPushPrefs({ ...pushPrefs, krawlModeUpdates: checked })
              }
              disabled
            />
            <Checkbox
              label="New content from followed users"
              checked={pushPrefs.newContent}
              onCheckedChange={(checked) =>
                setPushPrefs({ ...pushPrefs, newContent: checked })
              }
              disabled
            />
          </div>
        </CardBody>
      </Card>

      <div className="flex justify-end">
        <Button variant="primary" onClick={handleSave} loading={saving}>
          Save Preferences
        </Button>
      </div>
    </div>
  );
}

