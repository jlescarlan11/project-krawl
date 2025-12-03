"use client";

import { useState } from "react";
import { KrawlComment } from "@/types/krawl-detail";
import { User, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsAuthenticated } from "@/hooks/useIsAuthenticated";

interface KrawlCommentsProps {
  krawlId: string;
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

export function KrawlComments({ krawlId }: KrawlCommentsProps) {
  const isAuthenticated = useIsAuthenticated();
  const [comments, setComments] = useState<KrawlComment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newComment.trim() || newComment.length > 500) {
      return;
    }

    if (!isAuthenticated) {
      // TODO: Show sign-in prompt
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/krawls/${krawlId}/comment`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ content: newComment }),
      // });

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Add comment optimistically
      const comment: KrawlComment = {
        id: `comment-${Date.now()}`,
        userId: "user-current",
        userName: "You",
        content: newComment,
        createdAt: new Date().toISOString(),
        vouchCount: 0,
        isVouchedByCurrentUser: false,
      };

      setComments([comment, ...comments]);
      setNewComment("");
    } catch (error) {
      console.error("Error submitting comment:", error);
      alert("Failed to submit comment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return "Today";
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-text-primary mb-6">
        Comments ({comments.length})
      </h2>

      {/* Add Comment Form */}
      {isAuthenticated && (
        <form onSubmit={handleSubmitComment} className="mb-6">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your experience..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-transparent resize-none"
            rows={3}
            maxLength={500}
          />
          <div className="flex items-center justify-between mt-2">
            <span className="text-sm text-text-tertiary">
              {newComment.length}/500 characters
            </span>
            <Button
              type="submit"
              disabled={!newComment.trim() || isSubmitting}
              variant="primary"
              size="sm"
            >
              {isSubmitting ? "Posting..." : "Post Comment"}
            </Button>
          </div>
        </form>
      )}

      {/* Comments List */}
      {comments.length === 0 ? (
        <div className="text-center py-8 text-text-tertiary">
          <p className="mb-2">No comments yet</p>
          <p className="text-sm">
            {isAuthenticated
              ? "Be the first to share your experience!"
              : "Sign in to leave a comment"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="border-b border-gray-100 last:border-0 pb-4 last:pb-0"
            >
              {/* Comment Header */}
              <div className="flex items-start gap-3 mb-2">
                <Avatar src={comment.userAvatar} alt={comment.userName} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-text-primary">
                      {comment.userName}
                    </p>
                    <span className="text-sm text-text-tertiary">
                      {formatDate(comment.createdAt)}
                    </span>
                  </div>
                  <p className="text-text-secondary text-sm leading-relaxed">
                    {comment.content}
                  </p>
                </div>
              </div>

              {/* Comment Actions */}
              <div className="ml-13 flex items-center gap-4 text-sm">
                <button className="flex items-center gap-1 text-text-tertiary hover:text-primary-green transition-colors">
                  <ThumbsUp
                    className={`w-4 h-4 ${
                      comment.isVouchedByCurrentUser
                        ? "fill-primary-green"
                        : ""
                    }`}
                  />
                  <span>{comment.vouchCount}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

