import { GemDetail } from "@/types/gem-detail";
import { FeaturedKrawl } from "@/components/landing/types";
import { Clock, MapPin, Star } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/lib/routes";
import Image from "next/image";

interface RelatedKrawlsProps {
  currentGem: GemDetail;
}

// Format duration helper
const formatDuration = (minutes?: number) => {
  if (!minutes) return "—";
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins}m`;
};

// Difficulty color helper
const difficultyColor = (difficulty?: string) => {
  switch (difficulty?.toLowerCase()) {
    case "easy":
      return "bg-primary-green/20 text-primary-green";
    case "moderate":
    case "medium":
      return "bg-yellow-100 text-yellow-600";
    case "hard":
      return "bg-red-100 text-red-600";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

/**
 * Get related krawls from backend API
 * Fetches featured krawls and filters client-side to show relevant ones
 */
async function getRelatedKrawls(gem: GemDetail): Promise<FeaturedKrawl[]> {
  try {
    // Use environment variable or default to localhost
    // Note: In server components, we can access process.env directly
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    
    const backendResponse = await fetch(`${API_URL}/api/landing/featured-krawls?limit=10`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!backendResponse.ok) {
      console.error(`[RelatedKrawls] Backend returned ${backendResponse.status}`);
      return [];
    }

    const backendData = await backendResponse.json();
    const backendKrawls = backendData.featured || [];

    // Map backend FeaturedKrawlResponse to frontend FeaturedKrawl interface
    const allKrawls: FeaturedKrawl[] = backendKrawls.map((krawl: any) => ({
      id: krawl.id || "",
      name: krawl.name || "",
      description: krawl.description || "",
      coverImage: krawl.coverImage || "",
      rating: krawl.rating ?? undefined,
      difficulty: krawl.difficulty || undefined,
      estimatedDurationMinutes: krawl.estimatedDurationMinutes ?? undefined,
      gemsCount: krawl.gemsCount ?? undefined,
    }));

    // Filter to show krawls that might include this gem (based on category or district matching)
    // This is a simple client-side filter - ideally backend would provide related krawls
    const relatedKrawls = allKrawls.filter((krawl) => {
      // If gem is in Downtown, show krawls with "heritage" or "historical" in description
      if (gem.district.toLowerCase().includes("downtown")) {
        const desc = (krawl.description || "").toLowerCase();
        return desc.includes("heritage") || desc.includes("historical") || desc.includes("downtown");
      }
      // If gem is Historical or Religious, show heritage/historical krawls
      if (
        gem.category.toLowerCase().includes("historical") ||
        gem.category.toLowerCase().includes("religious")
      ) {
        const desc = (krawl.description || "").toLowerCase();
        return desc.includes("heritage") || desc.includes("historical");
      }
      // If gem is Food-related, show food krawls
      if (gem.category.toLowerCase().includes("food")) {
        const desc = (krawl.description || "").toLowerCase();
        return desc.includes("food") || desc.includes("culinary");
      }
      // Default: show all (will be limited below)
      return true;
    });

    // Limit to 3-5 krawls initially (requirement)
    return relatedKrawls.slice(0, 5);
  } catch (error) {
    console.error("[RelatedKrawls] Error fetching related krawls:", error);
    return [];
  }
}

export async function RelatedKrawls({ currentGem }: RelatedKrawlsProps) {
  const relatedKrawls = await getRelatedKrawls(currentGem);

  // Don't show section if no related krawls (requirement)
  if (relatedKrawls.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-text-primary mb-4">
          Related Krawls
        </h2>
        <div className="text-center py-8 text-text-tertiary">
          <MapPin className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="mb-2">No related Krawls yet</p>
          <p className="text-sm">
            This gem isn't part of any Krawls yet. Check back later!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-text-primary">
          Related Krawls
        </h2>
        {relatedKrawls.length > 3 && (
          <Link
            href={ROUTES.KRAWLS}
            className="text-sm font-medium text-primary-green hover:text-primary-green/80 transition-colors"
          >
            View All
          </Link>
        )}
      </div>

      {/* Grid layout - responsive */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {relatedKrawls.map((krawl) => (
          <Link
            key={krawl.id}
            href={ROUTES.KRAWL_DETAIL(krawl.id)}
            className="group block border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-all duration-300"
          >
            {/* Krawl Cover Image */}
            <div className="relative h-40 bg-gradient-to-br from-primary-green/20 to-accent-orange/20 overflow-hidden">
              {krawl.coverImage ? (
                <Image
                  src={krawl.coverImage}
                  alt={`Cover image for ${krawl.name}`}
                  width={400}
                  height={160}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  unoptimized
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-text-tertiary text-sm">
                  <MapPin className="w-8 h-8" />
                </div>
              )}

              {/* Difficulty Badge */}
              {krawl.difficulty && (
                <div className="absolute top-2 right-2">
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full ${difficultyColor(
                      krawl.difficulty
                    )}`}
                  >
                    {krawl.difficulty}
                  </span>
                </div>
              )}
            </div>

            {/* Krawl Info */}
            <div className="p-4">
              <h3 className="font-semibold text-text-primary mb-1 group-hover:text-primary-green transition-colors line-clamp-1">
                {krawl.name}
              </h3>
              <p className="text-sm text-text-secondary mb-3 line-clamp-2">
                {krawl.description || "Discover this community-curated route."}
              </p>

              {/* Stats */}
              <div className="flex flex-wrap items-center gap-3 text-xs text-text-tertiary">
                {/* Duration */}
                {krawl.estimatedDurationMinutes && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{formatDuration(krawl.estimatedDurationMinutes)}</span>
                  </div>
                )}

                {/* Gems Count */}
                {krawl.gemsCount !== undefined && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{krawl.gemsCount} Gems</span>
                  </div>
                )}

                {/* Rating */}
                {krawl.rating && (
                  <div className="flex items-center gap-1 ml-auto">
                    <Star className="w-3.5 h-3.5 fill-accent-orange text-accent-orange" />
                    <span className="font-medium text-text-primary">
                      {krawl.rating.toFixed(1)}
                    </span>
                  </div>
                )}
              </div>

              {/* View Krawl Button - appears on hover */}
              <div className="mt-3 pt-3 border-t border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-sm font-medium text-primary-green flex items-center gap-1">
                  View Krawl
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
