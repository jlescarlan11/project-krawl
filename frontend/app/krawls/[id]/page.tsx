import { Metadata } from "next";
import { notFound } from "next/navigation";
import { KrawlHeader } from "@/components/krawls/KrawlHeader";
import { KrawlInfo } from "@/components/krawls/KrawlInfo";
import { KrawlTrailMap } from "@/components/krawls/KrawlTrailMap";
import { KrawlGemList } from "@/components/krawls/KrawlGemList";
import { KrawlRatingsVouches } from "@/components/krawls/KrawlRatingsVouches";
import { KrawlComments } from "@/components/krawls/KrawlComments";
import { KrawlActions } from "@/components/krawls/KrawlActions";
import { KrawlCreator } from "@/components/krawls/KrawlCreator";
import { PageLayout } from "@/components/layout/PageLayout";
import { auth } from "@/lib/nextauth";
import { fetchKrawlById } from "@/lib/api/krawls";

/**
 * Generate metadata for SEO
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const krawl = await fetchKrawlById(id);

  if (!krawl) {
    return {
      title: "Krawl Not Found - Krawl",
      description: "The requested krawl could not be found.",
    };
  }

  const description =
    krawl.description ||
    `Explore ${krawl.name}, a ${krawl.difficulty || ""} krawl in Cebu City.`;

  return {
    title: `${krawl.name} - ${krawl.difficulty || "Krawl"} | Krawl`,
    description,
    openGraph: {
      title: krawl.name,
      description,
      images: krawl.coverImage ? [{ url: krawl.coverImage }] : [],
      type: "website",
      locale: "en_PH",
      siteName: "Krawl",
    },
    twitter: {
      card: "summary_large_image",
      title: krawl.name,
      description,
      images: krawl.coverImage ? [krawl.coverImage] : [],
    },
    alternates: {
      canonical: `/krawls/${id}`,
    },
  };
}

/**
 * Krawl Detail Page
 */
export default async function KrawlDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  const krawl = await fetchKrawlById(id);

  // Handle 404
  if (!krawl) {
    notFound();
  }

  // Structured data for SEO (JSON-LD)
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: krawl.name,
    description: krawl.description,
    image: krawl.coverImage,
    ...(krawl.rating && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: krawl.rating,
        reviewCount: krawl.ratingsData?.totalRatings || 0,
      },
    }),
    ...(krawl.estimatedDurationMinutes && {
      duration: `PT${krawl.estimatedDurationMinutes}M`,
    }),
    ...(krawl.estimatedDistanceKm && {
      distance: {
        "@type": "Distance",
        value: krawl.estimatedDistanceKm,
        unitCode: "KMT",
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
          <KrawlHeader krawl={krawl} />

          {/* Main Content - Two Column Layout on Desktop */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-4 lg:px-0 mt-6">
            {/* Left Column - Main Content (2/3 width on desktop) */}
            <div className="lg:col-span-2 space-y-6">
              <KrawlInfo krawl={krawl} />
              <KrawlTrailMap krawl={krawl} />
              <KrawlGemList krawl={krawl} />
              <KrawlComments krawlId={krawl.id} />
            </div>

            {/* Right Column - Sidebar (1/3 width on desktop) */}
            <div className="lg:col-span-1 space-y-6">
              <KrawlRatingsVouches krawl={krawl} isAuthenticated={!!session?.jwt} />
              <KrawlActions krawl={krawl} />
              <KrawlCreator krawl={krawl} />
            </div>
          </div>
        </article>
      </PageLayout>
    </>
  );
}

/**
 * Enable static params generation for known krawls
 * This improves build performance and enables static generation
 */
export async function generateStaticParams() {
  // For now, return empty array - will be populated when we have real data
  // TODO: Fetch list of krawl IDs from API
  return [];
}

/**
 * Force dynamic rendering during development
 */
export const dynamic = "force-dynamic";
