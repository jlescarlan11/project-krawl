import { Metadata } from "next";
import { notFound } from "next/navigation";
import { GemDetail } from "@/types/gem-detail";
import { GemHeader } from "@/components/gems/GemHeader";
import { GemInfo } from "@/components/gems/GemInfo";
import { GemActions } from "@/components/gems/GemActions";
import { GemComments } from "@/components/gems/GemComments";
import { RelatedGems } from "@/components/gems/RelatedGems";
import { PageLayout } from "@/components/layout/PageLayout";
import { getMockGemDetail } from "@/lib/data/mockGems";

/**
 * Fetch gem detail
 * TODO: Replace with actual API call when backend is ready
 */
async function fetchGemById(id: string): Promise<GemDetail | null> {
  // For now, use mock data directly to avoid SSR fetch issues
  return getMockGemDetail(id);
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
  const gem = await fetchGemById(id);

  if (!gem) {
    return {
      title: "Gem Not Found - Krawl",
      description: "The requested gem could not be found.",
    };
  }

  const description =
    gem.shortDescription ||
    `Discover ${gem.name}, a ${gem.category} in ${gem.district}, Cebu City.`;

  return {
    title: `${gem.name} - ${gem.category} in ${gem.district} | Krawl`,
    description,
    openGraph: {
      title: gem.name,
      description,
      images: gem.thumbnailUrl ? [{ url: gem.thumbnailUrl }] : [],
      type: "website",
      locale: "en_PH",
      siteName: "Krawl",
    },
    twitter: {
      card: "summary_large_image",
      title: gem.name,
      description,
      images: gem.thumbnailUrl ? [gem.thumbnailUrl] : [],
    },
    alternates: {
      canonical: `/gems/${id}`,
    },
  };
}

/**
 * Gem Detail Page
 */
export default async function GemDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const gem = await fetchGemById(id);

  // Handle 404
  if (!gem) {
    notFound();
  }

  // Structured data for SEO (JSON-LD)
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: gem.name,
    description: gem.shortDescription,
    image: gem.thumbnailUrl,
    address: {
      "@type": "PostalAddress",
      addressLocality: gem.district,
      addressRegion: "Cebu",
      addressCountry: "PH",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: gem.coordinates[1],
      longitude: gem.coordinates[0],
    },
    ...(gem.rating && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: gem.rating,
        reviewCount: gem.vouchCount || 0,
      },
    }),
  };

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <PageLayout breadcrumbs>
        <article className="max-w-7xl mx-auto">
          {/* Header Section */}
          <GemHeader gem={gem} />

          {/* Main Content - Two Column Layout on Desktop */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-4 lg:px-0">
            {/* Left Column - Main Content (2/3 width on desktop) */}
            <div className="lg:col-span-2 space-y-6">
              <GemInfo gem={gem} />
              <GemComments gemId={gem.id} />
            </div>

            {/* Right Column - Sidebar (1/3 width on desktop) */}
            <div className="lg:col-span-1 space-y-6">
              <GemActions gem={gem} />
            </div>
          </div>

          {/* Related Gems Section - Full Width */}
          <div className="mt-8 px-4 lg:px-0">
            <RelatedGems currentGem={gem} />
          </div>
        </article>
      </PageLayout>
    </>
  );
}

/**
 * Enable static params generation for known gems
 * This improves build performance and enables static generation
 */
export async function generateStaticParams() {
  // For now, return empty array - will be populated when we have real data
  // TODO: Fetch list of gem IDs from API
  return [];
}

/**
 * Force dynamic rendering during development
 */
export const dynamic = 'force-dynamic';
