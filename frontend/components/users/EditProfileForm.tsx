"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { AvatarUpload } from "./AvatarUpload";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  updateProfile,
  type UpdateProfileRequest,
  type UserProfile,
} from "@/lib/api/users";

export interface EditProfileFormProps {
  /** Current user profile */
  profile: UserProfile;

  /** Callback when profile is updated */
  onSuccess?: (profile: UserProfile) => void;

  /** Callback when update fails */
  onError?: (error: string) => void;

  /** Optional className for styling */
  className?: string;
}

interface FormData {
  displayName: string;
  bio: string;
  avatarUrl: string;
}

/**
 * EditProfileForm Component
 *
 * Form for editing user profile (name, bio, avatar).
 */
export function EditProfileForm({
  profile,
  onSuccess,
  onError,
  className,
}: EditProfileFormProps) {
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl || "");
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<FormData>({
    defaultValues: {
      displayName: profile.displayName || "",
      bio: profile.bio || "",
      avatarUrl: profile.avatarUrl || "",
    },
  });

  const displayName = watch("displayName");
  const bio = watch("bio");
  const displayNameLength = displayName?.length || 0;
  const bioLength = bio?.length || 0;

  useEffect(() => {
    setValue("avatarUrl", avatarUrl);
  }, [avatarUrl, setValue]);

  const onSubmit = async (data: FormData) => {
    try {
      setSubmitting(true);

      const request: UpdateProfileRequest = {
        displayName: data.displayName || undefined,
        bio: data.bio || undefined,
        avatarUrl: avatarUrl || undefined,
      };

      const updated = await updateProfile(profile.id, request);
      onSuccess?.(updated);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update profile";
      onError?.(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={cn("space-y-6", className)}>
      {/* Avatar Upload */}
      <AvatarUpload
        currentAvatarUrl={profile.avatarUrl}
        onUploadComplete={(url) => setAvatarUrl(url)}
        onUploadError={(error) => onError?.(error)}
      />

      {/* Display Name */}
      <div>
        <Input
          label="Display Name"
          {...register("displayName", {
            maxLength: {
              value: 100,
              message: "Display name must be 100 characters or less",
            },
          })}
          error={errors.displayName?.message}
          helperText={`${displayNameLength}/100 characters`}
        />
      </div>

      {/* Bio */}
      <div>
        <Textarea
          label="Bio"
          rows={5}
          {...register("bio", {
            maxLength: {
              value: 500,
              message: "Bio must be 500 characters or less",
            },
          })}
          error={errors.bio?.message}
          helperText={`${bioLength}/500 characters`}
          placeholder="Tell us about yourself..."
        />
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <Button type="submit" variant="primary" loading={submitting}>
          Save Changes
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => window.history.back()}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}

