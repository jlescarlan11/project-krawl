"use client";

import { useState, useEffect } from "react";
import { Select } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  updatePrivacySettings,
  type PrivacySettingsRequest,
  type UserProfile,
} from "@/lib/api/users";

export interface PrivacySettingsProps {
  /** Current user profile */
  profile: UserProfile;

  /** Callback when settings are updated */
  onSuccess?: () => void;

  /** Callback when update fails */
  onError?: (error: string) => void;

  /** Optional className for styling */
  className?: string;
}

/**
 * PrivacySettings Component
 *
 * Allows users to manage privacy settings.
 */
export function PrivacySettings({
  profile,
  onSuccess,
  onError,
  className,
}: PrivacySettingsProps) {
  const [profileVisibility, setProfileVisibility] = useState<
    "public" | "private" | "friends_only"
  >("public");

  const [toggles, setToggles] = useState({
    showEmail: false,
    showStatistics: true,
    showActivity: true,
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Load settings from profile if available
    if (profile.privacySettings) {
      const settings = profile.privacySettings as any;
      if (settings.profileVisibility) {
        setProfileVisibility(settings.profileVisibility);
      }
      if (settings.toggles) {
        setToggles({ ...toggles, ...settings.toggles });
      }
    }
  }, [profile]);

  const handleSave = async () => {
    try {
      setSaving(true);

      const request: PrivacySettingsRequest = {
        profileVisibility,
        toggles,
      };

      await updatePrivacySettings(profile.id, request);
      onSuccess?.();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update settings";
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
            Profile Visibility
          </h2>
          <p className="text-sm text-text-secondary">
            Control who can see your profile.
          </p>
        </CardHeader>
        <CardBody>
          <Select
            label="Profile Visibility"
            options={[
              { value: "public", label: "Public" },
              { value: "private", label: "Private" },
              { value: "friends_only", label: "Friends Only" },
            ]}
            value={profileVisibility}
            onChange={(e) =>
              setProfileVisibility(
                e.target.value as "public" | "private" | "friends_only"
              )
            }
          />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-text-primary">
            Data Sharing
          </h2>
          <p className="text-sm text-text-secondary">
            Control what information is visible on your profile.
          </p>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            <Checkbox
              label="Show email address"
              checked={toggles.showEmail}
              onCheckedChange={(checked) =>
                setToggles({ ...toggles, showEmail: checked })
              }
            />
            <Checkbox
              label="Show statistics"
              checked={toggles.showStatistics}
              onCheckedChange={(checked) =>
                setToggles({ ...toggles, showStatistics: checked })
              }
            />
            <Checkbox
              label="Show activity"
              checked={toggles.showActivity}
              onCheckedChange={(checked) =>
                setToggles({ ...toggles, showActivity: checked })
              }
            />
          </div>
        </CardBody>
      </Card>

      <div className="flex justify-end">
        <Button variant="primary" onClick={handleSave} loading={saving}>
          Save Settings
        </Button>
      </div>
    </div>
  );
}

