"use client";

import { useState } from "react";
import { ThumbsUp, User, ChevronDown, ChevronUp } from "lucide-react";
import { GemVouch } from "@/types/gem-detail";
import { Button } from "@/components/ui/button";

// Avatar component with error handling
function Avatar({ src, alt, className }: { src?: string; alt: string; className?: string }) {
  const [hasError, setHasError] = useState(false);
  
  if (!src || hasError) {
    return (
      <div className={`w-8 h-8 rounded-full bg-primary-green/10 flex items-center justify-center ${className || ''}`}>
        <User className="w-4 h-4 text-primary-green" />
      </div>
    );
  }
  
  return (
    <img
      src={src}
      alt={alt}
      className={`w-8 h-8 rounded-full ${className || ''}`}
      onError={() => setHasError(true)}
    />
  );
}

interface VouchDisplayProps {
  vouches: GemVouch[];
  vouchCount: number;
  isVouchedByCurrentUser?: boolean;
  onVouch?: () => Promise<void>;
  isAuthenticated?: boolean;
}

const MAX_VISIBLE_VOUCHES = 5;

/**
 * VouchDisplay Component
 * Displays vouch count, list of users who vouched, and vouch button
 */
export function VouchDisplay({
  vouches,
  vouchCount,
  isVouchedByCurrentUser = false,
  onVouch,
  isAuthenticated = false,
}: VouchDisplayProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVouching, setIsVouching] = useState(false);

  const displayedVouches = isExpanded
    ? vouches
    : vouches.slice(0, MAX_VISIBLE_VOUCHES);
  const hasMoreVouches = vouches.length > MAX_VISIBLE_VOUCHES;

  const handleVouch = async () => {
    if (!onVouch || isVouching) return;

    setIsVouching(true);
    try {
      await onVouch();
    } finally {
      setIsVouching(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Vouch Count Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ThumbsUp className="w-5 h-5 text-primary-green" />
          <h3 className="text-lg font-semibold text-text-primary">
            {vouchCount === 0
              ? "No vouches yet"
              : `${vouchCount} ${vouchCount === 1 ? "Vouch" : "Vouches"}`}
          </h3>
        </div>
      </div>

      {/* Vouch Button (if authenticated) */}
      {isAuthenticated && (
        <Button
          onClick={handleVouch}
          disabled={isVouching}
          className={`w-full justify-center gap-2 ${
            isVouchedByCurrentUser
              ? "bg-primary-green text-white hover:bg-primary-green/90"
              : "bg-white text-text-primary border border-gray-300 hover:bg-gray-50"
          }`}
        >
          <ThumbsUp className={`w-5 h-5 ${isVouchedByCurrentUser ? "fill-white" : ""}`} />
          <span>{isVouchedByCurrentUser ? "Vouched" : "Vouch for this gem"}</span>
        </Button>
      )}

      {/* List of Users Who Vouched */}
      {vouches.length > 0 ? (
        <div className="space-y-3">
          <p className="text-sm text-text-tertiary">
            People who vouched for this gem:
          </p>

          <div className="space-y-2">
            {displayedVouches.map((vouch) => (
              <div
                key={vouch.userId}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Avatar src={vouch.userAvatar} alt={vouch.userName} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary truncate">
                    {vouch.userName}
                  </p>
                  <p className="text-xs text-text-tertiary">
                    {new Date(vouch.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* View All / Show Less Button */}
          {hasMoreVouches && (
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-1 text-sm text-primary-green hover:text-primary-green/80 font-medium transition-colors"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  Show less
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  View all {vouchCount} vouches
                </>
              )}
            </button>
          )}
        </div>
      ) : (
        <div className="text-center py-6 text-text-tertiary">
          <ThumbsUp className="w-12 h-12 mx-auto mb-2 opacity-20" />
          <p className="text-sm">No one has vouched for this gem yet.</p>
          {isAuthenticated && (
            <p className="text-sm mt-1">Be the first to vouch!</p>
          )}
        </div>
      )}
    </div>
  );
}
