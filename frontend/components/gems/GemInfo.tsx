import { GemDetail } from "@/types/gem-detail";
import { MapPin, Clock, Phone, Globe, Calendar, User } from "lucide-react";
import { GemStatus } from "@/components/map/gem-types";
import Link from "next/link";
import { ROUTES } from "@/lib/routes";

interface GemInfoProps {
  gem: GemDetail;
}

export function GemInfo({ gem }: GemInfoProps) {
  return (
    <div className="space-y-6">
      {/* Status Banner (for Stale or Pending) */}
      {gem.status === GemStatus.STALE && (
        <div className="bg-accent-orange/10 border border-accent-orange/30 rounded-lg p-4">
          <p className="text-sm text-accent-orange font-medium">
            ⚠️ This gem may have outdated information. Help us verify!
          </p>
        </div>
      )}

      {gem.status === GemStatus.PENDING && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-700 font-medium">
            ℹ️ This gem is awaiting verification from the community.
          </p>
        </div>
      )}

      {/* Description Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-text-primary mb-4">
          About
        </h2>
        {gem.fullDescription || gem.shortDescription ? (
          <p className="text-text-secondary leading-relaxed whitespace-pre-line">
            {gem.fullDescription || gem.shortDescription}
          </p>
        ) : (
          <div className="text-center py-8 text-text-tertiary">
            <p className="mb-2">No description yet</p>
            <p className="text-sm">Be the first to add details about this gem!</p>
          </div>
        )}
      </div>

      {/* Details Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-text-primary mb-4">
          Details
        </h2>
        <div className="space-y-3">
          {/* Category */}
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 mt-0.5 flex-shrink-0">
              <div className="w-2 h-2 rounded-full bg-primary-green mt-1.5" />
            </div>
            <div>
              <p className="text-sm text-text-tertiary">Category</p>
              <p className="text-text-primary font-medium">{gem.category}</p>
            </div>
          </div>

          {/* District */}
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0 text-text-tertiary" />
            <div>
              <p className="text-sm text-text-tertiary">Location</p>
              <p className="text-text-primary font-medium">{gem.district}, Cebu City</p>
            </div>
          </div>

          {/* Address */}
          {gem.address && (
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0 text-text-tertiary" />
              <div>
                <p className="text-sm text-text-tertiary">Address</p>
                <p className="text-text-primary">{gem.address}</p>
              </div>
            </div>
          )}

          {/* Hours */}
          {gem.hours && (
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 mt-0.5 flex-shrink-0 text-text-tertiary" />
              <div>
                <p className="text-sm text-text-tertiary">Hours</p>
                <p className="text-text-primary">{gem.hours}</p>
              </div>
            </div>
          )}

          {/* Phone */}
          {gem.phone && (
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 mt-0.5 flex-shrink-0 text-text-tertiary" />
              <div>
                <p className="text-sm text-text-tertiary">Phone</p>
                <a
                  href={`tel:${gem.phone}`}
                  className="text-primary-green hover:underline"
                >
                  {gem.phone}
                </a>
              </div>
            </div>
          )}

          {/* Website */}
          {gem.website && (
            <div className="flex items-start gap-3">
              <Globe className="w-5 h-5 mt-0.5 flex-shrink-0 text-text-tertiary" />
              <div>
                <p className="text-sm text-text-tertiary">Website</p>
                <a
                  href={gem.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-green hover:underline break-all"
                >
                  {gem.website}
                </a>
              </div>
            </div>
          )}

          {/* Status */}
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 mt-0.5 flex-shrink-0">
              <div
                className={`w-2 h-2 rounded-full mt-1.5 ${
                  gem.status === GemStatus.VERIFIED
                    ? "bg-primary-green"
                    : gem.status === GemStatus.STALE
                    ? "bg-accent-orange"
                    : "bg-gray-400"
                }`}
              />
            </div>
            <div>
              <p className="text-sm text-text-tertiary">Status</p>
              <p className="text-text-primary font-medium capitalize">
                {gem.status}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Location Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-text-primary mb-4">
          Location
        </h2>

        {/* Coordinates */}
        <div className="mb-4 text-sm text-text-secondary">
          <p>
            Coordinates: {gem.coordinates[1].toFixed(4)}, {gem.coordinates[0].toFixed(4)}
          </p>
        </div>

        {/* View on Map Link */}
        <Link
          href={`${ROUTES.MAP}?center=${gem.coordinates[0]},${gem.coordinates[1]}&zoom=16&selected=${gem.id}`}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-green text-white rounded-lg hover:bg-primary-green/90 transition-colors"
        >
          <MapPin className="w-4 h-4" />
          View on Map
        </Link>
      </div>

      {/* Creator Info */}
      {gem.createdBy && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-text-primary mb-4">
            Added By
          </h2>
          <div className="flex items-center gap-3">
            {gem.createdBy.avatar ? (
              <img
                src={gem.createdBy.avatar}
                alt={gem.createdBy.name}
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-primary-green/10 flex items-center justify-center">
                <User className="w-5 h-5 text-primary-green" />
              </div>
            )}
            <div>
              <p className="font-medium text-text-primary">
                {gem.createdBy.name}
              </p>
              <p className="text-sm text-text-tertiary">
                {new Date(gem.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
