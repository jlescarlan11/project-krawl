import { Section } from "@/components/layout";
import { HeroSection, HeroStatsSection } from "@/components/hero";
import { FeaturedKrawlsCarousel } from "@/components/landing";
import type { FeaturedKrawl } from "@/components/landing/types";
import { headers } from "next/headers";

const FEATURED_KRAWLS_LIMIT = 8;

const getLandingApiBaseUrl = async () => {
  const requestHeaders = await headers();
  const forwardedHost = requestHeaders.get("x-forwarded-host");
  const host = forwardedHost ?? requestHeaders.get("host");
  const protocol =
    requestHeaders.get("x-forwarded-proto") ??
    requestHeaders.get("x-forwarded-protocol") ??
    "https";

  if (host) {
    return `${protocol}://${host}`;
  }

  const fallbackPort = process.env.PORT ?? 3000;
  return process.env.NEXT_PUBLIC_APP_URL ?? `http://localhost:${fallbackPort}`;
};

async function fetchFeaturedKrawls(): Promise<FeaturedKrawl[]> {
  try {
    const baseUrl = await getLandingApiBaseUrl();
    const featuredResponse = await fetch(
      `${baseUrl}/api/landing/featured-krawls?limit=${FEATURED_KRAWLS_LIMIT}`,
      { next: { revalidate: 60 } }
    );

    if (!featuredResponse.ok) {
      throw new Error("Failed to load featured Krawls");
    }

    const payload = (await featuredResponse.json()) as {
      featured?: FeaturedKrawl[];
    };

    if (Array.isArray(payload.featured) && payload.featured.length > 0) {
      return payload.featured;
    }

    const popularResponse = await fetch(
      `${baseUrl}/api/landing/popular-krawls?limit=${FEATURED_KRAWLS_LIMIT}`,
      { next: { revalidate: 60 } }
    );

    if (!popularResponse.ok) {
      throw new Error("Failed to load fallback Krawls");
    }

    const popularPayload = (await popularResponse.json()) as {
      popular?: FeaturedKrawl[];
    };

    return popularPayload.popular ?? [];
  } catch (error) {
    console.error("Landing carousel error:", error);
    return [];
  }
}

export default async function Home() {
  const featuredKrawls = await fetchFeaturedKrawls();

  return (
    <main className="bg-bg-white">
      <HeroSection />
      <HeroStatsSection />
      <Section spacing="xl" background="light" className="py-12 lg:py-20 pb-16 lg:pb-24">
        <div className="mx-auto container px-4 sm:px-6">
          <FeaturedKrawlsCarousel featuredKrawls={featuredKrawls} />
        </div>
      </Section>
    </main>
  );
}
