"use client";

import { useEffect, useState, useRef } from "react";
import { X, MapPin, Sparkles, CheckCircle2, ExternalLink, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useKrawlModeStore, useGemContent } from "@/stores/krawl-mode-store";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ROUTES } from "@/lib/routes";

export interface StopDetailCardProps {
  gemId: string;
  onCheckOff: () => void;
  onSkip?: () => void;
  onViewDetails?: () => void;
  className?: string;
}

/**
 * Stop Detail Card Component
 *
 * Auto-slides up from bottom when user arrives at a Gem location.
 * Displays Creator Note and Lokal Secret with actions.
 */
export function StopDetailCard({
  gemId,
  onCheckOff,
  onSkip,
  onViewDetails,
  className = "",
}: StopDetailCardProps) {
  const gemContent = useGemContent(gemId);
  const { stopDetailCard, hideStopDetailCard, dismissStopDetailCard } =
    useKrawlModeStore();
  const [isAnimating, setIsAnimating] = useState(false);
  const [startY, setStartY] = useState<number | null>(null);
  const [currentY, setCurrentY] = useState<number | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const isVisible = stopDetailCard.isVisible && stopDetailCard.currentGemId === gemId;

  // Trigger slide-up animation when card becomes visible
  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      // Reset animation state after animation completes
      const timer = setTimeout(() => setIsAnimating(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  // Handle swipe down to dismiss
  const handleTouchStart = (e: React.TouchEvent) => {
    setStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (startY === null) return;
    const current = e.touches[0].clientY;
    const diff = current - startY;

    // Only allow downward swipe
    if (diff > 0) {
      setCurrentY(diff);
      if (cardRef.current) {
        cardRef.current.style.transform = `translateY(${diff}px)`;
      }
    }
  };

  const handleTouchEnd = () => {
    const threshold = 100; // pixels to trigger dismiss

    if (currentY !== null && currentY > threshold) {
      dismissStopDetailCard();
    } else {
      // Reset position
      if (cardRef.current) {
        cardRef.current.style.transform = "";
      }
    }

    setStartY(null);
    setCurrentY(null);
  };

  const handleClose = () => {
    dismissStopDetailCard();
  };

  const handleCheckOff = () => {
    onCheckOff();
    dismissStopDetailCard();
  };

  const handleSkip = () => {
    if (onSkip) {
      onSkip();
    }
    dismissStopDetailCard();
  };

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails();
    }
  };

  if (!isVisible || !gemContent) {
    return null;
  }

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 pointer-events-none",
        className
      )}
      aria-hidden={!isVisible}
    >
      {/* Backdrop */}
      <div
        className={cn(
          "absolute inset-0 bg-black/50 transition-opacity duration-300",
          isVisible ? "opacity-100" : "opacity-0"
        )}
        onClick={handleClose}
      />

      {/* Card */}
      <div
        ref={cardRef}
        className={cn(
          "relative bg-white rounded-t-2xl shadow-2xl pointer-events-auto",
          "transform transition-transform duration-300 ease-out",
          isVisible && !isAnimating ? "translate-y-0" : "translate-y-full"
        )}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        role="dialog"
        aria-modal="true"
        aria-labelledby="stop-detail-title"
      >
        {/* Swipe indicator */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="px-4 pt-2 pb-4 border-b border-gray-200">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3
                id="stop-detail-title"
                className="text-lg font-semibold text-text-primary mb-1"
              >
                {gemContent.name}
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                  {gemContent.category}
                </span>
                {gemContent.thumbnailUrl && (
                  <img
                    src={gemContent.thumbnailUrl}
                    alt={gemContent.name}
                    className="w-8 h-8 rounded object-cover"
                  />
                )}
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-text-secondary" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="max-h-[60vh] overflow-y-auto px-4 py-4">
          {/* Creator Note Section */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-5 h-5 text-primary" />
              <h4 className="font-semibold text-text-primary">
                How to Get There
              </h4>
            </div>
            <p className="text-text-secondary text-sm leading-relaxed">
              {gemContent.creatorNote}
            </p>
          </div>

          {/* Lokal Secret Section */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-accent" />
              <h4 className="font-semibold text-text-primary">Lokal Secret</h4>
              <span className="text-xs px-2 py-0.5 bg-accent/10 text-accent rounded-full">
                Insider Tip
              </span>
            </div>
            <p className="text-text-secondary text-sm leading-relaxed">
              {gemContent.lokalSecret}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="px-4 pb-4 pt-2 border-t border-gray-200 space-y-2">
          <Button
            variant="primary"
            fullWidth
            onClick={handleCheckOff}
            icon={<CheckCircle2 className="w-5 h-5" />}
            iconPosition="left"
          >
            Check Off
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              fullWidth
              onClick={() => {
                handleViewDetails();
                window.open(ROUTES.GEM_DETAIL(gemId), "_blank");
              }}
              icon={<ExternalLink className="w-4 h-4" />}
              iconPosition="left"
            >
              View Full Details
            </Button>
            {onSkip && (
              <Button
                variant="text"
                onClick={handleSkip}
                icon={<ChevronDown className="w-4 h-4" />}
              >
                Skip
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

