/**
 * Gem Upload Status Management Utilities
 *
 * Utility functions for managing photo upload status in gem creation.
 * Extracted from gem-creation-store.ts for better testability and reusability.
 */

import type { MediaData, PhotoUploadStatus } from "../gem-creation-store";

export interface GemUploadActions {
  setMedia: (media: MediaData | null) => void;
  getMedia: () => MediaData | null;
}

/**
 * Initialize upload statuses for photo files
 *
 * @param files - Array of File objects to initialize
 * @param getMedia - Function to get current media state
 * @param setMedia - Function to update media state
 */
export function initializeGemUploadStatuses(
  files: File[],
  getMedia: () => MediaData | null,
  setMedia: (media: MediaData | null) => void
): void {
  const media = getMedia();
  if (!media) return;

  const uploadStatuses: PhotoUploadStatus[] = files.map((file) => ({
    file,
    progress: 0,
    status: "pending",
  }));

  setMedia({
    ...media,
    uploadStatuses,
  });
}

/**
 * Update photo upload status
 *
 * @param fileIndex - Index of the file to update
 * @param status - Partial status update
 * @param getMedia - Function to get current media state
 * @param setMedia - Function to update media state
 */
export function updateGemPhotoUploadStatus(
  fileIndex: number,
  status: Partial<PhotoUploadStatus>,
  getMedia: () => MediaData | null,
  setMedia: (media: MediaData | null) => void
): void {
  const media = getMedia();
  if (!media || !media.uploadStatuses) return;

  const updatedStatuses = [...media.uploadStatuses];
  updatedStatuses[fileIndex] = {
    ...updatedStatuses[fileIndex],
    ...status,
  };

  setMedia({
    ...media,
    uploadStatuses: updatedStatuses,
  });
}

/**
 * Set uploaded URLs
 *
 * @param urls - Array of uploaded photo URLs
 * @param getMedia - Function to get current media state
 * @param setMedia - Function to update media state
 */
export function setGemUploadedUrls(
  urls: string[],
  getMedia: () => MediaData | null,
  setMedia: (media: MediaData | null) => void
): void {
  const media = getMedia();
  if (!media) return;

  setMedia({
    ...media,
    uploadedUrls: urls,
  });
}

/**
 * Set uploaded public IDs
 *
 * @param publicIds - Array of Cloudinary public IDs
 * @param getMedia - Function to get current media state
 * @param setMedia - Function to update media state
 */
export function setGemUploadedPublicIds(
  publicIds: string[],
  getMedia: () => MediaData | null,
  setMedia: (media: MediaData | null) => void
): void {
  const media = getMedia();
  if (!media) return;

  setMedia({
    ...media,
    uploadedPublicIds: publicIds,
  });
}

