"use client";

import React from "react";
import { CheckCircle, XCircle, Loader2, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PhotoUploadStatus } from "@/stores/gem-creation-store";

/**
 * Props for UploadProgressIndicator component
 */
export interface UploadProgressIndicatorProps {
  uploadStatuses: PhotoUploadStatus[];
  onRetry?: (fileIndex: number) => void;
  className?: string;
}

/**
 * UploadProgressIndicator Component
 *
 * Displays upload progress for multiple files with:
 * - Progress bars
 * - Status indicators (uploading, success, error)
 * - Retry button for failed uploads
 */
export function UploadProgressIndicator({
  uploadStatuses,
  onRetry,
  className,
}: UploadProgressIndicatorProps) {
  if (uploadStatuses.length === 0) return null;

  // Check if any upload is in progress
  const hasUploading = uploadStatuses.some((s) => s.status === 'uploading');
  const allSuccess = uploadStatuses.every((s) => s.status === 'success');
  const hasErrors = uploadStatuses.some((s) => s.status === 'error');

  return (
    <div className={cn("space-y-4", className)}>
      {/* Overall Status Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-text-primary">
          {hasUploading && "Uploading and optimizing photos..."}
          {allSuccess && "All photos uploaded and optimized successfully"}
          {!hasUploading && hasErrors && "Some uploads failed"}
        </h3>
        <span className="text-sm text-text-secondary">
          {uploadStatuses.filter((s) => s.status === 'success').length} /{' '}
          {uploadStatuses.length}
        </span>
      </div>

      {/* Individual Upload Progress */}
      <div className="space-y-3">
        {uploadStatuses.map((status, index) => (
          <UploadProgressItem
            key={index}
            status={status}
            fileIndex={index}
            onRetry={onRetry}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Props for UploadProgressItem subcomponent
 */
interface UploadProgressItemProps {
  status: PhotoUploadStatus;
  fileIndex: number;
  onRetry?: (fileIndex: number) => void;
}

/**
 * UploadProgressItem Component
 *
 * Individual upload progress item with progress bar and status icon
 */
function UploadProgressItem({
  status,
  fileIndex,
  onRetry,
}: UploadProgressItemProps) {
  const { file, progress, status: uploadStatus, error } = status;

  return (
    <div className="space-y-2">
      {/* File name and status */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {/* Status Icon */}
          {uploadStatus === 'uploading' && (
            <Loader2 className="w-4 h-4 text-primary-green animate-spin flex-shrink-0" />
          )}
          {uploadStatus === 'success' && (
            <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
          )}
          {uploadStatus === 'error' && (
            <XCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
          )}
          {uploadStatus === 'pending' && (
            <div className="w-4 h-4 rounded-full border-2 border-border-subtle flex-shrink-0" />
          )}

          {/* File name */}
          <span className="text-sm text-text-primary truncate">{file.name}</span>
          
          {/* Optimization indicator for successful uploads */}
          {uploadStatus === 'success' && status.publicId && (
            <span className="text-xs text-text-tertiary ml-2" title="Optimized with Cloudinary">
              ✓ Optimized
            </span>
          )}
        </div>

        {/* Progress percentage or retry button */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {uploadStatus === 'uploading' && (
            <span className="text-xs text-text-secondary font-medium">
              {progress}%
            </span>
          )}
          {uploadStatus === 'error' && onRetry && (
            <button
              onClick={() => onRetry(fileIndex)}
              className="text-xs text-primary-green hover:text-primary-green-dark font-medium flex items-center gap-1 transition-colors"
              type="button"
              aria-label={`Retry upload for ${file.name}`}
            >
              <RefreshCw className="w-3 h-3" />
              Retry
            </button>
          )}
        </div>
      </div>

      {/* Progress bar */}
      {(uploadStatus === 'uploading' || uploadStatus === 'success') && (
        <div className="w-full bg-bg-light rounded-full h-1.5 overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-300",
              uploadStatus === 'success'
                ? "bg-green-600"
                : "bg-primary-green"
            )}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Error message */}
      {uploadStatus === 'error' && error && (
        <div className="space-y-1">
          <p className="text-xs text-red-600 font-medium">Upload failed</p>
          <p className="text-xs text-red-500">{error}</p>
        </div>
      )}
    </div>
  );
}
