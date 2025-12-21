"use client";

import { useState, useEffect } from "react";
import { Comment, CommentPageResponse } from "@/types/krawl-detail";
import { User, Edit2, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsAuthenticated } from "@/hooks/useIsAuthenticated";
import { useSession } from "next-auth/react";

// Avatar component with error handling
function Avatar({ src, alt, className }: { src?: string; alt: string; className?: string }) {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div className={`w-10 h-10 rounded-full bg-primary-green/10 flex items-center justify-center flex-shrink-0 ${className || ''}`}>
        <User className="w-5 h-5 text-primary-green" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`w-10 h-10 rounded-full object-cover ${className || ''}`}
      onError={() => setHasError(true)}
    />
  );
}

interface KrawlCommentsProps {
  krawlId: string;
}

export function KrawlComments({ krawlId }: KrawlCommentsProps) {
  const isAuthenticated = useIsAuthenticated();
  const { data: session } = useSession();

  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Delete confirmation
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const currentUserId = session?.user?.id;

  // Fetch comments
  const fetchComments = async (page: number = 0, append: boolean = false) => {
    try {
      if (append) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
      }

      const response = await fetch(`/api/krawls/${krawlId}/comments?page=${page}&size=20`);

      if (!response.ok) {
        throw new Error("Failed to load comments");
      }

      const data: CommentPageResponse & { success: boolean } = await response.json();

      if (data.success) {
        if (append) {
          setComments(prev => [...prev, ...data.comments]);
        } else {
          setComments(data.comments);
        }
        setCurrentPage(data.currentPage);
        setTotalPages(data.totalPages);
        setTotalComments(data.totalComments);
        setHasNext(data.hasNext);
      }
    } catch (err) {
      setError("Failed to load comments");
      console.error("Error loading comments:", err);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [krawlId]);

  // Handle submit new comment
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newComment.trim() || newComment.length > 500) {
      return;
    }

    if (!isAuthenticated) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/krawls/${krawlId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newComment.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit comment");
      }

      if (data.success) {
        // Optimistic update: add new comment to top
        setComments([data, ...comments]);
        setTotalComments(prev => prev + 1);
        setNewComment("");
      }
    } catch (err) {
      console.error("Error submitting comment:", err);
      setError(err instanceof Error ? err.message : "Failed to submit comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle edit
  const startEdit = (comment: Comment) => {
    setEditingId(comment.id);
    setEditContent(comment.content);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditContent("");
  };

  const saveEdit = async (commentId: string) => {
    if (!editContent.trim() || editContent.length > 500) {
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: editContent.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update comment");
      }

      if (data.success) {
        // Update comment in list
        setComments(prev =>
          prev.map(c => c.id === commentId ? { ...data } : c)
        );
        setEditingId(null);
        setEditContent("");
      }
    } catch (err) {
      console.error("Error updating comment:", err);
      setError(err instanceof Error ? err.message : "Failed to update comment");
    } finally {
      setIsSaving(false);
    }
  };

  // Handle delete
  const confirmDelete = (commentId: string) => {
    setDeletingId(commentId);
  };

  const cancelDelete = () => {
    setDeletingId(null);
  };

  const deleteComment = async (commentId: string) => {
    setError(null);

    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete comment");
      }

      if (data.success) {
        // Remove comment from list
        setComments(prev => prev.filter(c => c.id !== commentId));
        setTotalComments(prev => prev - 1);
        setDeletingId(null);
      }
    } catch (err) {
      console.error("Error deleting comment:", err);
      setError(err instanceof Error ? err.message : "Failed to delete comment");
    }
  };

  // Load more comments
  const loadMore = () => {
    if (hasNext && !isLoadingMore) {
      fetchComments(currentPage + 1, true);
    }
  };

  // Format relative time
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSeconds < 60) {
      return "just now";
    } else if (diffMinutes < 60) {
      return `${diffMinutes} ${diffMinutes === 1 ? 'minute' : 'minutes'} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
    } else {
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }
  };

  // Character count color
  const getCharCountColor = () => {
    const length = newComment.length;
    if (length >= 480) return "text-red-600 font-semibold";
    if (length >= 450) return "text-orange-600";
    return "text-text-tertiary";
  };

  const getEditCharCountColor = () => {
    const length = editContent.length;
    if (length >= 480) return "text-red-600 font-semibold";
    if (length >= 450) return "text-orange-600";
    return "text-text-tertiary";
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-text-primary mb-6">
        Comments ({totalComments})
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Add Comment Form */}
      {isAuthenticated ? (
        <form onSubmit={handleSubmitComment} className="mb-6">
          <textarea
            value={newComment}
            onChange={(e) => {
              // Prevent typing beyond 500 chars
              if (e.target.value.length <= 500) {
                setNewComment(e.target.value);
              }
            }}
            onPaste={(e) => {
              // Handle paste - truncate if exceeds limit
              const pastedText = e.clipboardData.getData('text');
              const currentText = newComment;
              const selectionStart = e.currentTarget.selectionStart;
              const selectionEnd = e.currentTarget.selectionEnd;

              const textBefore = currentText.substring(0, selectionStart);
              const textAfter = currentText.substring(selectionEnd);
              const newText = textBefore + pastedText + textAfter;

              if (newText.length > 500) {
                e.preventDefault();
                const truncated = newText.substring(0, 500);
                setNewComment(truncated);
              }
            }}
            placeholder="Share your thoughts..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-transparent resize-none"
            rows={3}
            maxLength={500}
            disabled={isSubmitting}
          />
          <div className="flex items-center justify-between mt-2">
            <span className={`text-sm ${getCharCountColor()}`}>
              {newComment.length}/500 characters
            </span>
            <Button
              type="submit"
              disabled={!newComment.trim() || isSubmitting || newComment.length > 500}
              className="bg-primary-green text-white hover:bg-primary-green/90"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Posting...
                </>
              ) : (
                "Post Comment"
              )}
            </Button>
          </div>
        </form>
      ) : (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg text-center">
          <p className="text-text-secondary text-sm">
            Please sign in to leave a comment
          </p>
        </div>
      )}

      {/* Comments List */}
      {isLoading ? (
        <div className="text-center py-8">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary-green" />
          <p className="text-text-tertiary text-sm mt-2">Loading comments...</p>
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8 text-text-tertiary">
          <p className="mb-2">No comments yet</p>
          <p className="text-sm">
            {isAuthenticated
              ? "Be the first to share your thoughts!"
              : "Sign in to leave a comment"}
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="border-b border-gray-100 last:border-0 pb-4 last:pb-0"
              >
                {/* Comment Header */}
                <div className="flex items-start gap-3 mb-2">
                  <Avatar src={comment.user.avatar} alt={comment.user.name} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <p className="font-medium text-text-primary">
                        {comment.user.name}
                      </p>
                      <span className="text-sm text-text-tertiary">
                        {formatDate(comment.createdAt)}
                      </span>
                      {comment.isEdited && (
                        <span className="text-xs text-text-tertiary italic">
                          (edited)
                        </span>
                      )}
                    </div>

                    {/* Edit mode */}
                    {editingId === comment.id ? (
                      <div className="mt-2">
                        <textarea
                          aria-label="Edit comment"
                          value={editContent}
                          onChange={(e) => {
                            if (e.target.value.length <= 500) {
                              setEditContent(e.target.value);
                            }
                          }}
                          onPaste={(e) => {
                            const pastedText = e.clipboardData.getData('text');
                            const currentText = editContent;
                            const selectionStart = e.currentTarget.selectionStart;
                            const selectionEnd = e.currentTarget.selectionEnd;

                            const textBefore = currentText.substring(0, selectionStart);
                            const textAfter = currentText.substring(selectionEnd);
                            const newText = textBefore + pastedText + textAfter;

                            if (newText.length > 500) {
                              e.preventDefault();
                              const truncated = newText.substring(0, 500);
                              setEditContent(truncated);
                            }
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-green resize-none"
                          rows={3}
                          maxLength={500}
                          disabled={isSaving}
                        />
                        <div className="flex items-center justify-between mt-2">
                          <span className={`text-sm ${getEditCharCountColor()}`}>
                            {editContent.length}/500 characters
                          </span>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={cancelEdit}
                              disabled={isSaving}
                            >
                              Cancel
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => saveEdit(comment.id)}
                              disabled={!editContent.trim() || isSaving || editContent.length > 500}
                              className="bg-primary-green text-white hover:bg-primary-green/90"
                            >
                              {isSaving ? (
                                <>
                                  <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                                  Saving...
                                </>
                              ) : (
                                "Save"
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* View mode */
                      <p className="text-text-secondary text-sm leading-relaxed whitespace-pre-wrap">
                        {comment.content}
                      </p>
                    )}
                  </div>
                </div>

                {/* Comment Actions (only for own comments) */}
                {isAuthenticated && currentUserId === comment.user.id && editingId !== comment.id && (
                  <div className="ml-13 flex items-center gap-3 text-sm">
                    <button
                      type="button"
                      onClick={() => startEdit(comment)}
                      className="flex items-center gap-1 text-text-tertiary hover:text-primary-green transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </button>

                    {deletingId === comment.id ? (
                      <div className="flex items-center gap-2">
                        <span className="text-red-600 text-xs">Delete this comment?</span>
                        <button
                          type="button"
                          onClick={() => deleteComment(comment.id)}
                          className="text-red-600 hover:text-red-700 font-medium text-xs"
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          onClick={cancelDelete}
                          className="text-text-tertiary hover:text-text-primary text-xs"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => confirmDelete(comment.id)}
                        className="flex items-center gap-1 text-text-tertiary hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Load More Button */}
          {hasNext && (
            <div className="mt-6 text-center">
              <Button
                onClick={loadMore}
                disabled={isLoadingMore}
                variant="outline"
                className="w-full sm:w-auto"
              >
                {isLoadingMore ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  `Load More Comments (${totalComments - comments.length} remaining)`
                )}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
