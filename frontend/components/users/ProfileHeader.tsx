"use client";

import Image from "next/image";
import { Edit, User } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { UserProfile } from "@/lib/api/users";
import { Button } from "@/components/ui/button";

export interface ProfileHeaderProps {
  /** User profile data */
  profile: UserProfile;

  /** Whether this is the current user's own profile */
  isOwnProfile?: boolean;

  /** Optional className for styling */
  className?: string;
}

/**
 * ProfileHeader Component
 *
 * Displays user avatar, display name, and bio.
 * Shows edit button if viewing own profile.
 */
export function ProfileHeader({
  profile,
  isOwnProfile = false,
  className,
}: ProfileHeaderProps) {
  const displayName = profile.displayName || profile.email || "User";
  const initials = getInitials(displayName);

  return (
    <div className={cn("flex flex-col sm:flex-row gap-6", className)}>
      {/* Avatar */}
      <div className="flex-shrink-0">
        <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-bg-light border-4 border-bg-medium">
          {profile.avatarUrl ? (
            <Image
              src={profile.avatarUrl}
              alt={displayName}
              width={128}
              height={128}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-text-tertiary">
              {initials ? (
                <span className="text-2xl sm:text-3xl font-semibold">
                  {initials}
                </span>
              ) : (
                <User className="w-12 h-12 sm:w-16 sm:h-16" />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Profile Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-4 mb-2">
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-text-primary truncate">
              {displayName}
            </h1>
            {profile.displayName && (
              <p className="text-sm text-text-tertiary mt-1 truncate">
                {profile.email}
              </p>
            )}
          </div>
          {isOwnProfile && (
            <Link href="/users/settings">
              <Button variant="outline" size="sm">
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </Link>
          )}
        </div>

        {/* Bio */}
        {profile.bio && (
          <div className="mt-4">
            <p className="text-text-secondary whitespace-pre-wrap break-words">
              {profile.bio}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Get initials from name or email
 */
function getInitials(name: string): string {
  if (!name) return "";

  // If it's an email, use first letter
  if (name.includes("@")) {
    return name.charAt(0).toUpperCase();
  }

  // Split by spaces and get first letter of each word (max 2)
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }

  return (
    parts[0].charAt(0).toUpperCase() +
    parts[parts.length - 1].charAt(0).toUpperCase()
  );
}

