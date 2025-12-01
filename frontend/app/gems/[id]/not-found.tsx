import { MapPin } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/lib/routes";
import { PageLayout } from "@/components/layout/PageLayout";

export default function GemNotFound() {
  return (
    <PageLayout title="Gem Not Found">
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <div className="text-center max-w-md">
          {/* Icon */}
          <div className="mb-6">
            <MapPin className="w-20 h-20 mx-auto text-text-tertiary opacity-30" />
          </div>

          {/* Message */}
          <h1 className="text-3xl font-bold text-text-primary mb-4">
            Gem Not Found
          </h1>
          <p className="text-text-secondary mb-8">
            This gem doesn't exist or has been removed. Discover other hidden
            gems in Cebu City.
          </p>

          {/* Action */}
          <Link
            href={ROUTES.MAP}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-green text-white rounded-lg hover:bg-primary-green/90 transition-colors"
          >
            <MapPin className="w-5 h-5" />
            Explore Map
          </Link>
        </div>
      </div>
    </PageLayout>
  );
}
