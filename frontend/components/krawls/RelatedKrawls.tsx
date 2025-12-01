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

// Mock function to get related krawls - TODO: Replace with API call
async function getRelatedKrawls(gem: GemDetail): Promise<FeaturedKrawl[]> {
  // Mock related krawls that include this gem
  const mockRelatedKrawls: FeaturedKrawl[] = [
    {
      id: "krawl-001",
      name: "Heritage Music Trail",
      description: "A cultural journey through Cebu City's historic district, featuring traditional music venues and heritage sites.",
      coverImage: "/images/krawls/heritage-music.jpg",
      rating: 4.5,
      difficulty: "Easy",
      estimatedDurationMinutes: 180,
      gemsCount: 5,
    },
    {
      id: "krawl-002",
      name: "Sunset Food Crawl",
      description: "Experience Cebu's culinary delights as the sun sets. From street food to hidden gems, taste the city's flavors.",
      coverImage: "/images/krawls/sunset-food.jpg",
      rating: 4.8,
      difficulty: "Medium",
      estimatedDurationMinutes: 240,
      gemsCount: 7,
    },
    {
      id: "krawl-003",
      name: "Rural Craft Loop",
      description: "Discover traditional crafts and artisan workshops in the outskirts of Cebu City.",
      coverImage: "/images/krawls/rural-craft.jpg",
      rating: 4.2,
      difficulty: "Hard",
      estimatedDurationMinutes: 300,
      gemsCount: 6,
    },
    {
      id: "krawl-004",
      name: "Downtown Historical Walk",
      description: "Walk through centuries of history in Cebu City's downtown district, visiting iconic landmarks and hidden treasures.",
      coverImage: "/images/krawls/downtown-historical.jpg",
      rating: 4.6,
      difficulty: "Easy",
      estimatedDurationMinutes: 150,
      gemsCount: 8,
    },
    {
      id: "krawl-005",
      name: "Coastal Adventure Trail",
      description: "Experience the beautiful coastline of Cebu with beaches, seafood stops, and waterfront attractions.",
      coverImage: "/images/krawls/coastal-adventure.jpg",
      rating: 4.7,
      difficulty: "Medium",
      estimatedDurationMinutes: 360,
      gemsCount: 9,
    },
  ];

  // Filter to show krawls that would include this gem (based on category or district)
  // For demo purposes, we'll show krawls based on gem's district or category
  const relatedKrawls = mockRelatedKrawls.filter((krawl) => {
    // If gem is in Downtown, show Heritage and Downtown krawls
    if (gem.district.toLowerCase().includes("downtown")) {
      return krawl.id === "krawl-001" || krawl.id === "krawl-004";
    }
    // If gem is Historical or Religious, show Heritage krawl
    if (
      gem.category.toLowerCase().includes("historical") ||
      gem.category.toLowerCase().includes("religious")
    ) {
      return krawl.id === "krawl-001" || krawl.id === "krawl-004";
    }
    // If gem is Food-related, show Food crawl
    if (gem.category.toLowerCase().includes("food")) {
      return krawl.id === "krawl-002";
    }
    // Default: show first 3
    return true;
  });

  // Limit to 3-5 krawls initially (requirement)
  return relatedKrawls.slice(0, 5);
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
