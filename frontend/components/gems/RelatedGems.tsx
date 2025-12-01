import { GemDetail } from "@/types/gem-detail";
import { MapGem, GemStatus } from "@/components/map/gem-types";
import { Star, ThumbsUp } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/lib/routes";

interface RelatedGemsProps {
  currentGem: GemDetail;
}

// Mock function to get related gems - TODO: Replace with API call
async function getRelatedGems(gem: GemDetail): Promise<MapGem[]> {
  // Mock related gems based on same category or district
  const mockRelatedGems: MapGem[] = [
    {
      id: "gem-002",
      name: "Fort San Pedro",
      category: "Historical Landmark",
      district: "Downtown",
      coordinates: [123.8868, 10.2925],
      status: GemStatus.VERIFIED,
      thumbnailUrl: "/images/gems/fort-san-pedro.jpg",
      rating: 4.3,
      vouchCount: 12,
      viewCount: 189,
      shortDescription: "Spanish colonial fort and military defense structure",
    },
    {
      id: "gem-003",
      name: "Basilica del Santo Niño",
      category: "Religious Site",
      district: "Downtown",
      coordinates: [123.8897, 10.2942],
      status: GemStatus.VERIFIED,
      thumbnailUrl: "/images/gems/basilica.jpg",
      rating: 4.8,
      vouchCount: 25,
      viewCount: 456,
      shortDescription: "Oldest Roman Catholic church in the Philippines",
    },
    {
      id: "gem-014",
      name: "Fuente Osmeña Circle",
      category: "Park",
      district: "Downtown",
      coordinates: [123.8945, 10.3123],
      status: GemStatus.VERIFIED,
      thumbnailUrl: "/images/gems/fuente.jpg",
      rating: 4.2,
      vouchCount: 11,
      viewCount: 234,
      shortDescription: "Historic circular park and landmark",
    },
  ];

  // Filter out current gem and limit to 3
  return mockRelatedGems
    .filter((g) => g.id !== gem.id)
    .filter(
      (g) => g.category === gem.category || g.district === gem.district
    )
    .slice(0, 3);
}

export async function RelatedGems({ currentGem }: RelatedGemsProps) {
  const relatedGems = await getRelatedGems(currentGem);

  if (relatedGems.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-text-primary mb-4">
        Related Gems
      </h2>

      {/* Grid layout for desktop, horizontal scroll for mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {relatedGems.map((gem) => (
          <Link
            key={gem.id}
            href={ROUTES.GEM_DETAIL(gem.id)}
            className="group block border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
          >
            {/* Gem Image */}
            <div className="relative h-40 bg-gradient-to-br from-primary-green/20 to-accent-orange/20">
              {gem.thumbnailUrl ? (
                <img
                  src={gem.thumbnailUrl}
                  alt={gem.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-text-tertiary text-sm">
                  No image
                </div>
              )}
            </div>

            {/* Gem Info */}
            <div className="p-4">
              <h3 className="font-semibold text-text-primary mb-1 group-hover:text-primary-green transition-colors line-clamp-1">
                {gem.name}
              </h3>
              <p className="text-sm text-text-secondary mb-2 line-clamp-2">
                {gem.shortDescription}
              </p>

              {/* Stats */}
              <div className="flex items-center gap-3 text-xs text-text-tertiary">
                {gem.rating && (
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-accent-orange text-accent-orange" />
                    <span>{gem.rating.toFixed(1)}</span>
                  </div>
                )}
                {gem.vouchCount !== undefined && (
                  <div className="flex items-center gap-1">
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>{gem.vouchCount}</span>
                  </div>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
