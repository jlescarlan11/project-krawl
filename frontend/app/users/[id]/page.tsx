import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProfileHeader } from "@/components/users/ProfileHeader";
import { UserStatistics } from "@/components/users/UserStatistics";
import { UserGemsList } from "@/components/users/UserGemsList";
import { UserKrawlsList } from "@/components/users/UserKrawlsList";
import { UserVouchedGemsList } from "@/components/users/UserVouchedGemsList";
import { UserCompletedKrawlsList } from "@/components/users/UserCompletedKrawlsList";
import { PageLayout } from "@/components/layout/PageLayout";
import { getUserProfile } from "@/lib/api/users";
import { auth } from "@/lib/nextauth";
import { UserProfileTabs } from "@/components/users/UserProfileTabs";

/**
 * Fetch user profile from API
 */
async function fetchUserProfile(id: string) {
  try {
    const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
    const host =
      process.env.NEXT_PUBLIC_APP_URL ||
      process.env.VERCEL_URL ||
      "localhost:3000";
    const baseUrl = host.startsWith("http") ? host : `${protocol}://${host}`;

    const response = await fetch(`${baseUrl}/api/users/${id}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
}

/**
 * Generate metadata for SEO
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const profile = await fetchUserProfile(id);

  if (!profile) {
    return {
      title: "User Not Found - Krawl",
      description: "The requested user profile could not be found.",
    };
  }

  const displayName = profile.displayName || profile.email || "User";
  const description = profile.bio || `View ${displayName}'s profile on Krawl.`;

  return {
    title: `${displayName} - Profile | Krawl`,
    description,
    openGraph: {
      title: `${displayName}'s Profile`,
      description,
      images: profile.avatarUrl ? [{ url: profile.avatarUrl }] : [],
      type: "profile",
      locale: "en_PH",
      siteName: "Krawl",
    },
    twitter: {
      card: "summary",
      title: `${displayName}'s Profile`,
      description,
      images: profile.avatarUrl ? [profile.avatarUrl] : [],
    },
    alternates: {
      canonical: `/users/${id}`,
    },
  };
}

/**
 * User Profile Page
 */
export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  const profile = await fetchUserProfile(id);

  // Handle 404
  if (!profile) {
    notFound();
  }

  const isOwnProfile = session?.user?.id === id;

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Profile Header */}
        <div className="mb-8">
          <ProfileHeader profile={profile} isOwnProfile={isOwnProfile} />
        </div>

        {/* Statistics */}
        <div className="mb-8">
          <UserStatistics statistics={profile.statistics} />
        </div>

        {/* Content Tabs */}
        <div className="mt-8">
          <UserProfileTabs userId={id} />
        </div>
      </div>
    </PageLayout>
  );
}
