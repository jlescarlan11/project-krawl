import { GemDetail } from "@/types/gem-detail";
import { MapGem, GemStatus } from "@/components/map/gem-types";
import { Star, ThumbsUp } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/lib/routes";
import { auth } from "@/app/api/auth/[...nextauth]/route";

interface RelatedGemsProps {
  currentGem: GemDetail;
}

/**
 * Get related gems based on same category or district from backend API
 */
async function getRelatedGems(gem: GemDetail): Promise<MapGem[]> {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    const session = await auth();
    
    const backendResponse = await fetch(`${API_URL}/api/gems`, {
      headers: session?.jwt ? {
        Authorization: `Bearer ${session.jwt}`,
      } : {},
    });

    if (!backendResponse.ok) {
      return [];
    }

    const backendGemsData = await backendResponse.json();
    const backendGemsList = Array.isArray(backendGemsData) ? backendGemsData : [];
    
    // Convert backend gems to MapGem format and filter
    const relatedGems: MapGem[] = backendGemsList
      .filter((g: any) => g.id !== gem.id) // Exclude current gem
      .filter((g: any) => {
        const longitude = g.coordinates?.longitude ?? g.longitude;
        const latitude = g.coordinates?.latitude ?? g.latitude;
        return longitude && latitude && (
          g.category === gem.category || g.district === gem.district
        );
      })
      .map((g: any) => {
        const longitude = g.coordinates?.longitude ?? g.longitude;
        const latitude = g.coordinates?.latitude ?? g.latitude;
        const backendStatus = g.status?.toLowerCase() || 'pending';
        const frontendStatus = backendStatus === 'verified' ? GemStatus.VERIFIED :
                               backendStatus === 'stale' ? GemStatus.STALE :
                               GemStatus.PENDING;
        
        return {
          id: g.id,
          name: g.name,
          category: g.category,
          district: g.district || "Cebu City",
          coordinates: [longitude, latitude] as [number, number],
          status: frontendStatus,
          thumbnailUrl: g.thumbnailUrl,
          rating: g.ratingsData?.averageRating || g.rating || 0,
          vouchCount: g.vouchesData?.vouchCount || g.vouchCount || 0,
          viewCount: g.viewCount || 0,
          shortDescription: g.shortDescription,
        } as MapGem;
      })
      .slice(0, 3); // Limit to 3

    return relatedGems;
  } catch (error) {
    console.error("Error fetching related gems:", error);
    return [];
  }
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
