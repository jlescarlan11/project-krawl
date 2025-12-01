"use client";

import { AlertTriangle, MapPin, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { DuplicateGem } from "@/stores/gem-creation-store";
import { getCategoryIcon } from "@/lib/constants/gem-categories";
import Image from "next/image";

/**
 * Props for DuplicateWarningModal component
 */
export interface DuplicateWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmDifferent: () => void;
  existingGem: DuplicateGem;
}

/**
 * DuplicateWarningModal Component
 *
 * Modal to warn users about potential duplicate gems.
 * Displays when duplicate detection finds a similar gem within 50 meters.
 *
 * Features:
 * - Warning header with icon
 * - Existing gem preview card
 * - Similarity and distance metrics
 * - Action buttons: Cancel, View Existing, This is Different
 *
 * User flows:
 * - Cancel: Close modal, keep name field (user can edit manually)
 * - View Existing: Open gem detail in new tab
 * - This is Different: Dismiss warning, allow proceeding
 */
export function DuplicateWarningModal({
  isOpen,
  onClose,
  onConfirmDifferent,
  existingGem,
}: DuplicateWarningModalProps) {
  if (!isOpen) return null;

  const handleViewExisting = () => {
    // Open gem detail page in new tab
    window.open(`/gems/${existingGem.id}`, "_blank");
  };

  const handleConfirmDifferent = () => {
    onConfirmDifferent();
    onClose();
  };

  const similarityPercentage = Math.round(existingGem.similarity * 100);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 animate-in fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl max-w-md w-[calc(100%-2rem)] p-6 z-50 animate-in fade-in zoom-in-95"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-bg-light transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5 text-text-secondary" />
        </button>

        {/* Header */}
        <div className="flex items-start gap-3 mb-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-accent-orange/10 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-accent-orange" />
          </div>
          <div>
            <h2
              id="modal-title"
              className="text-xl font-bold text-text-primary"
            >
              Similar Gem Found
            </h2>
            <p
              id="modal-description"
              className="text-sm text-text-secondary mt-1"
            >
              We found a gem that might be the same place
            </p>
          </div>
        </div>

        {/* Existing Gem Preview Card */}
        <div className="bg-bg-light rounded-lg p-4 mb-4 border border-border-subtle">
          <div className="flex gap-3">
            {/* Thumbnail */}
            {existingGem.thumbnailUrl ? (
              <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-bg-medium">
                <Image
                  src={existingGem.thumbnailUrl}
                  alt={existingGem.name}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="flex-shrink-0 w-20 h-20 rounded-lg bg-bg-medium flex items-center justify-center">
                <MapPin className="w-8 h-8 text-text-tertiary" />
              </div>
            )}

            {/* Gem Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-text-primary truncate">
                {existingGem.name}
              </h3>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-base" aria-hidden="true">
                  {getCategoryIcon(existingGem.category)}
                </span>
                <span className="text-sm text-text-secondary">
                  {existingGem.category}
                </span>
              </div>
              <p className="text-sm text-text-secondary mt-2 line-clamp-2">
                {existingGem.shortDescription}
              </p>
            </div>
          </div>

          {/* Address */}
          <div className="flex items-start gap-2 mt-3 pt-3 border-t border-border-subtle">
            <MapPin className="w-4 h-4 text-text-secondary flex-shrink-0 mt-0.5" />
            <p className="text-sm text-text-secondary">{existingGem.address}</p>
          </div>
        </div>

        {/* Metrics */}
        <div className="flex items-center justify-center gap-6 mb-4 py-3 bg-accent-orange/5 rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-accent-orange">
              {existingGem.distance}m
            </div>
            <div className="text-xs text-text-secondary mt-1">Distance</div>
          </div>
          <div className="w-px h-10 bg-border-subtle" />
          <div className="text-center">
            <div className="text-2xl font-bold text-accent-orange">
              {similarityPercentage}%
            </div>
            <div className="text-xs text-text-secondary mt-1">Name Match</div>
          </div>
        </div>

        {/* Helper Text */}
        <p className="text-sm text-text-secondary text-center mb-6">
          If this is the same place, please don't create a duplicate. If it's
          different, you can continue.
        </p>

        {/* Action Buttons */}
        <div className="space-y-2">
          <Button
            variant="primary"
            size="lg"
            onClick={handleConfirmDifferent}
            className="w-full"
          >
            This is Different
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="md"
              onClick={handleViewExisting}
              className="flex-1"
            >
              View Existing
            </Button>
            <Button
              variant="secondary"
              size="md"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
