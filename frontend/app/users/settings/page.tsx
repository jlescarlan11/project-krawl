"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { EditProfileForm } from "@/components/users/EditProfileForm";
import { NotificationPreferences } from "@/components/users/NotificationPreferences";
import { PrivacySettings } from "@/components/users/PrivacySettings";
import { AppPreferences } from "@/components/users/AppPreferences";
import { AccountManagement } from "@/components/users/AccountManagement";
import { PageLayout } from "@/components/layout/PageLayout";
import { getUserProfile, type UserProfile } from "@/lib/api/users";
import { Spinner } from "@/components/ui/spinner";
import { ErrorState } from "@/components/ui/error-state";
import { cn } from "@/lib/utils";

type SettingsTab = "profile" | "notifications" | "privacy" | "preferences" | "account";

/**
 * User Settings Page
 */
export default function UserSettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/sign-in");
      return;
    }

    if (status === "authenticated" && session?.user?.id) {
      loadProfile();
    }
  }, [status, session, router]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const userProfile = await getUserProfile(session!.user!.id);
      setProfile(userProfile);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load profile"
      );
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        </div>
      </PageLayout>
    );
  }

  if (error && !profile) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <ErrorState title="Failed to load settings" message={error} />
        </div>
      </PageLayout>
    );
  }

  if (!profile) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <ErrorState
            title="Profile not found"
            message="Unable to load your profile. Please try again."
          />
        </div>
      </PageLayout>
    );
  }

  const tabs: { id: SettingsTab; label: string }[] = [
    { id: "profile", label: "Profile" },
    { id: "notifications", label: "Notifications" },
    { id: "privacy", label: "Privacy" },
    { id: "preferences", label: "Preferences" },
    { id: "account", label: "Account" },
  ];

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary">Settings</h1>
          <p className="text-text-secondary mt-2">
            Manage your account settings and preferences.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-64 flex-shrink-0">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "w-full text-left px-4 py-3 rounded-lg transition-colors",
                    activeTab === tab.id
                      ? "bg-primary-green text-white"
                      : "text-text-secondary hover:bg-bg-light"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === "profile" && (
              <EditProfileForm
                profile={profile}
                onSuccess={(updated) => {
                  setProfile(updated);
                }}
                onError={(err) => setError(err)}
              />
            )}

            {activeTab === "notifications" && (
              <NotificationPreferences
                profile={profile}
                onSuccess={() => {
                  // Reload profile to get updated preferences
                  loadProfile();
                }}
                onError={(err) => setError(err)}
              />
            )}

            {activeTab === "privacy" && (
              <PrivacySettings
                profile={profile}
                onSuccess={() => {
                  // Reload profile to get updated settings
                  loadProfile();
                }}
                onError={(err) => setError(err)}
              />
            )}

            {activeTab === "preferences" && (
              <AppPreferences
                profile={profile}
                onSuccess={() => {
                  // Reload profile to get updated preferences
                  loadProfile();
                }}
                onError={(err) => setError(err)}
              />
            )}

            {activeTab === "account" && (
              <AccountManagement
                profile={profile}
                onAccountDeleted={() => {
                  router.push("/");
                }}
                onError={(err) => setError(err)}
              />
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
