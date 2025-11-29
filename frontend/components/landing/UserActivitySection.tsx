"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { MapPin, Heart, CheckCircle } from "lucide-react";
import { Section } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { ROUTES } from "@/lib/routes";
import type { UserActivityResponse } from "./types";
import { UserActivityItem } from "./UserActivityItem";

interface UserActivitySectionProps {
  activity?: UserActivityResponse;
  loading?: boolean;
}

/**
 * User Activity Section
 * 
 * Displays user's recent activity including Gems created, saved Krawls, and completed Krawls.
 * Handles empty states for new users and loading states.
 * 
 * @example
 * ```tsx
 * <UserActivitySection activity={userActivity} loading={false} />
 * ```
 */
export function UserActivitySection({ activity, loading = false }: UserActivitySectionProps) {
  const router = useRouter();

  if (loading) {
    return (
      <Section spacing="xl" background="light" className="py-12 lg:py-20">
        <div className="mx-auto container px-4 sm:px-6">
          <div className="space-y-8">
            <div className="space-y-4">
              <LoadingSkeleton className="h-8 w-64" />
              <LoadingSkeleton className="h-4 w-96" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, idx) => (
                <LoadingSkeleton key={idx} className="h-64 rounded-[1.5rem]" />
              ))}
            </div>
          </div>
        </div>
      </Section>
    );
  }

  if (!activity) {
    return null;
  }

  const hasRecentGems = activity.recentGems.length > 0;
  const hasSavedKrawls = activity.savedKrawls.length > 0;
  const hasCompletedKrawls = activity.completedKrawls.length > 0;

  return (
    <Section spacing="xl" background="light" className="py-12 lg:py-20">
      <div className="mx-auto container px-4 sm:px-6">
        <div className="space-y-12">
          {/* Recent Gems Created */}
          <div className="space-y-6">
            <div className="flex flex-col gap-3 text-center sm:text-left">
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-text-tertiary/70">
                Your Contributions
              </p>
              <h2 className="text-3xl font-semibold text-text-primary sm:text-4xl">
                Recent Gems Created
              </h2>
            </div>

            {hasRecentGems ? (
              <>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {activity.recentGems.slice(0, 6).map((gem) => (
                    <UserActivityItem key={gem.id} item={gem} />
                  ))}
                </div>
                <div className="flex justify-center sm:justify-end">
                  <Link href={ROUTES.GEMS}>
                    <Button variant="outline" size="md">
                      View All Your Gems
                    </Button>
                  </Link>
                </div>
              </>
            ) : (
              <EmptyState
                icon={<MapPin className="w-[120px] h-[120px] md:w-[160px] md:h-[160px]" />}
                title="No Gems yet"
                description="Start mapping Cebu by creating your first Gem. Share a favorite spot, food place, or cultural site."
                action={() => {
                  router.push(ROUTES.GEM_CREATE);
                }}
                actionLabel="Create Your First Gem"
              />
            )}
          </div>

          {/* Saved/Favorite Krawls */}
          <div className="space-y-6">
            <div className="flex flex-col gap-3 text-center sm:text-left">
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-text-tertiary/70">
                Your Favorites
              </p>
              <h2 className="text-3xl font-semibold text-text-primary sm:text-4xl">
                Saved Krawls
              </h2>
            </div>

            {hasSavedKrawls ? (
              <>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {activity.savedKrawls.slice(0, 6).map((krawl) => (
                    <UserActivityItem key={krawl.id} item={krawl} />
                  ))}
                </div>
                <div className="flex justify-center sm:justify-end">
                  <Link href={ROUTES.KRAWLS}>
                    <Button variant="outline" size="md">
                      View All Saved Krawls
                    </Button>
                  </Link>
                </div>
              </>
            ) : (
              <EmptyState
                icon={<Heart className="w-[120px] h-[120px] md:w-[160px] md:h-[160px]" />}
                title="No saved Krawls yet"
                description="Save Krawls you want to explore later. Browse featured Krawls to get started."
                action={() => {
                  router.push(ROUTES.KRAWLS);
                }}
                actionLabel="Explore Krawls"
              />
            )}
          </div>

          {/* Completed Krawls */}
          <div className="space-y-6">
            <div className="flex flex-col gap-3 text-center sm:text-left">
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-text-tertiary/70">
                Your Adventures
              </p>
              <h2 className="text-3xl font-semibold text-text-primary sm:text-4xl">
                Completed Krawls
              </h2>
            </div>

            {hasCompletedKrawls ? (
              <>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {activity.completedKrawls.slice(0, 6).map((krawl) => (
                    <UserActivityItem key={krawl.id} item={krawl} />
                  ))}
                </div>
                <div className="flex justify-center sm:justify-end">
                  <Link href={ROUTES.KRAWLS}>
                    <Button variant="outline" size="md">
                      View All Completed
                    </Button>
                  </Link>
                </div>
              </>
            ) : (
              <EmptyState
                icon={<CheckCircle className="w-[120px] h-[120px] md:w-[160px] md:h-[160px]" />}
                title="No completed Krawls yet"
                description="Complete your first Krawl to start tracking your adventures. Follow a Krawl and mark it complete when you're done."
                action={() => {
                  router.push(ROUTES.KRAWLS);
                }}
                actionLabel="Find a Krawl"
              />
            )}
          </div>
        </div>
      </div>
    </Section>
  );
}

