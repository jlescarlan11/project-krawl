"use client";

import { useState, useEffect } from "react";
import { KrawlDetail, KrawlComment } from "@/types/krawl-detail";
import { Star, User } from "lucide-react";

interface KrawlReviewsProps {
  krawl: KrawlDetail;
}

// Avatar component with error handling
function Avatar({
  src,
  alt,
  className,
}: {
  src?: string;
  alt: string;
  className?: string;
}) {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div
        className={`w-10 h-10 rounded-full bg-primary-green/10 flex items-center justify-center flex-shrink-0 ${className || ""}`}
      >
        <User className="w-5 h-5 text-primary-green" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`w-10 h-10 rounded-full ${className || ""}`}
      onError={() => setHasError(true)}
    />
  );
}

export function KrawlReviews({ krawl }: KrawlReviewsProps) {
  const [reviews, setReviews] = useState<KrawlComment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        // TODO: Replace with actual API call when backend is ready
        // const response = await fetch(`/api/krawls/${krawl.id}/comments`);
        // const data = await response.json();
        // setReviews(data.comments || []);

        // For now, use mock data structure
        // Reviews will be fetched from comments endpoint
        setReviews([]);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, [krawl.id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffWeeks = Math.floor(diffDays / 7);

    if (diffDays === 0) {
      return "Today";
    } else if (diffDays === 1) {
      return "1d ago";
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else if (diffWeeks === 1) {
      return "1w ago";
    } else if (diffWeeks < 4) {
      return `${diffWeeks}w ago`;
    } else {
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating
            ? "fill-accent-orange text-accent-orange"
            : "text-gray-300"
        }`}
      />
    ));
  };

  // For now, we'll show a placeholder since reviews come from comments
  // In the future, reviews might be separate from comments or comments might have ratings
  const reviewCount = krawl.ratingsData?.totalRatings || 0;

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-text-primary mb-4">
          Reviews ({reviewCount})
        </h2>
        <p className="text-text-tertiary text-center py-4">Loading reviews...</p>
      </div>
    );
  }

  if (reviews.length === 0 && reviewCount === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-text-primary mb-4">
          Reviews
        </h2>
        <div className="text-center py-8 text-text-tertiary">
          <p className="mb-2">No reviews yet</p>
          <p className="text-sm">Be the first to review this krawl!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-text-primary mb-4">
        Reviews ({reviewCount})
      </h2>
      <div className="space-y-4">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="border-b border-gray-100 last:border-0 pb-4 last:pb-0"
          >
            <div className="flex items-start gap-3 mb-2">
              <Avatar src={review.userAvatar} alt={review.userName} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium text-text-primary">
                    {review.userName}
                  </p>
                  <span className="text-sm text-text-tertiary">
                    {formatDate(review.createdAt)}
                  </span>
                </div>
                <p className="text-text-secondary text-sm leading-relaxed">
                  {review.content}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

