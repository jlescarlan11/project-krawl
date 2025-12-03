import { KrawlDetail } from "@/types/krawl-detail";
import { MapPin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { ROUTES } from "@/lib/routes";

interface KrawlGemListProps {
  krawl: KrawlDetail;
}

export function KrawlGemList({ krawl }: KrawlGemListProps) {
  if (!krawl.gems || krawl.gems.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-text-primary mb-4">
          Gems
        </h2>
        <p className="text-text-tertiary text-center py-8">
          No gems in this krawl
        </p>
      </div>
    );
  }

  const gemCount = krawl.gems.length;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-text-primary mb-4">
        {gemCount} {gemCount === 1 ? "Gem" : "Gems"}
      </h2>
      <ol className="space-y-4">
        {krawl.gems.map((gem, index) => (
          <li key={gem.id} className="flex gap-4">
            {/* Step Number */}
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-green text-white flex items-center justify-center font-semibold text-sm">
              {index + 1}
            </div>

            {/* Gem Info */}
            <div className="flex-1 flex gap-4 min-w-0">
              {gem.thumbnailUrl && (
                <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                  <Image
                    src={gem.thumbnailUrl}
                    alt={gem.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <Link
                  href={ROUTES.GEM_DETAIL(gem.id)}
                  className="text-lg font-semibold text-text-primary hover:text-primary-green transition-colors block mb-1"
                >
                  {gem.name}
                </Link>
                <div className="flex items-center gap-2 text-sm text-text-secondary">
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{gem.category}</span>
                  {gem.district && (
                    <>
                      <span className="text-text-tertiary">•</span>
                      <span className="truncate">{gem.district}</span>
                    </>
                  )}
                </div>
                {gem.category && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary-green/10 text-primary-green mt-2">
                    {gem.category}
                  </span>
                )}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

