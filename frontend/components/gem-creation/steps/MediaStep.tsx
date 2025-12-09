"use client";

import React, {
  useState,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import {
  Camera,
  GripVertical,
  X,
  CheckCircle,
} from "lucide-react";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/ui/file-upload";
import { useGemCreationStore } from "@/stores/gem-creation-store";
import { StepHeader } from "@/components/shared/creation";
import { validateGemPhotos } from "@/lib/validation/gem-validation";

/**
 * Props for MediaStep component
 */
export interface MediaStepProps {
  onNext: () => void;
  onBackToPreviousPage: () => void;
  onBackToPreviousStep: () => void;
}

/**
 * Props for PhotoCard subcomponent
 */
interface PhotoCardProps {
  file: File;
  previewUrl: string;
  index: number;
  isThumb: boolean;
  onDelete: () => void;
  onSetThumbnail: () => void;
}

/**
 * PhotoCard Component
 *
 * Individual photo card with preview, thumbnail badge, delete, and drag handle.
 * Uses @dnd-kit/sortable for drag-and-drop reordering.
 */
function PhotoCard({
  file,
  previewUrl,
  index,
  isThumb,
  onDelete,
  onSetThumbnail,
}: PhotoCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: index });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative group bg-bg-light rounded-lg overflow-hidden",
        isDragging && "opacity-50 z-50"
      )}
    >
      {/* Image Preview */}
      <img
        src={previewUrl}
        alt={file.name}
        className="w-full h-40 object-cover"
      />

      {/* Thumbnail Badge */}
      {isThumb && (
        <div className="absolute top-2 left-2 bg-primary-green text-white text-xs px-2 py-1 rounded-md font-medium">
          Thumbnail
        </div>
      )}

      {/* Set as Thumbnail Button (on hover, if not already thumbnail) */}
      {!isThumb && (
        <button
          onClick={onSetThumbnail}
          className="absolute top-2 left-2 bg-white/90 hover:bg-white text-text-primary text-xs px-2 py-1 rounded-md font-medium opacity-0 group-hover:opacity-100 transition-opacity"
          type="button"
        >
          Set as Thumbnail
        </button>
      )}

      {/* Delete Button */}
      <button
        onClick={onDelete}
        className="absolute top-2 right-2 bg-red-500/90 hover:bg-red-600 text-white p-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label={`Delete ${file.name}`}
        type="button"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute bottom-2 right-2 bg-bg-medium/90 p-1.5 rounded-md cursor-move opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
        aria-label="Drag to reorder"
      >
        <GripVertical className="w-4 h-4 text-text-secondary" />
      </div>
    </div>
  );
}

/**
 * MediaStep Component
 *
 * Step 3 of gem creation flow: Media upload and management
 * Features:
 * - Drag-and-drop photo upload (up to 5 photos)
 * - Photo preview grid with reordering
 * - Thumbnail selection
 * - Delete individual photos
 * - File validation (type, size)
 * - Form data persistence via Zustand
 */
export function MediaStep({
  onNext,
  onBackToPreviousPage,
  onBackToPreviousStep,
}: MediaStepProps) {
  const { media, setMedia } = useGemCreationStore();

  // Form state
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [thumbnailIndex, setThumbnailIndex] = useState(0);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  // Validation state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  // Ref for additional file input
  const additionalFileInputRef = useRef<HTMLInputElement>(null);

  /**
   * Initialize from store on mount and generate preview URLs
   */
  useEffect(() => {
    if (media) {
      setSelectedFiles(media.photos);
      setThumbnailIndex(media.thumbnailIndex);
      // Generate preview URLs
      const urls = media.photos.map((file) => URL.createObjectURL(file));
      setPreviewUrls(urls);
    }

    // Cleanup URLs on unmount
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Generate preview URLs when files change
   */
  useEffect(() => {
    // Revoke old URLs
    previewUrls.forEach((url) => URL.revokeObjectURL(url));

    // Generate new URLs
    const urls = selectedFiles.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);

    // Cleanup function
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFiles]);

  /**
   * Auto-save to store when files or thumbnail index change
   */
  useEffect(() => {
    if (selectedFiles.length > 0) {
      setMedia({
        photos: selectedFiles,
        thumbnailIndex: thumbnailIndex,
      });
    }
  }, [selectedFiles, thumbnailIndex, setMedia]);

  /**
   * Validate photos (with debounce for better UX)
   */
  useEffect(() => {
    if (selectedFiles.length === 0 && !touched) {
      // Don't show errors until user has interacted
      return;
    }

    setIsValidating(true);
    const timer = setTimeout(() => {
      const error = validateGemPhotos(selectedFiles);
      if (error) {
        setErrors({ photos: error });
      } else {
        setErrors({});
      }
      setIsValidating(false);
    }, 300); // Debounce validation

    return () => {
      clearTimeout(timer);
      setIsValidating(false);
    };
  }, [selectedFiles, touched]);

  /**
   * Handle file upload from FileUpload component (initial upload)
   */
  const handleFilesChange = useCallback((files: File[]) => {
    setSelectedFiles(files);
    setTouched(true);
    // First photo is thumbnail by default
    setThumbnailIndex(0);
  }, []);

  /**
   * Handle adding more photos
   */
  const handleAddMorePhotos = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files || files.length === 0) return;

      const fileArray = Array.from(files);
      const remainingSlots = 5 - selectedFiles.length;
      const filesToAdd = fileArray.slice(0, remainingSlots);

      setSelectedFiles((prev) => [...prev, ...filesToAdd]);
      setTouched(true);

      // Reset input
      if (additionalFileInputRef.current) {
        additionalFileInputRef.current.value = "";
      }
    },
    [selectedFiles.length]
  );

  /**
   * Handle drag end event for reordering
   */
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (active.id !== over?.id && over) {
        setSelectedFiles((files) => {
          const oldIndex = active.id as number;
          const newIndex = over.id as number;

          // Reorder files
          const newFiles = arrayMove(files, oldIndex, newIndex);

          // Update thumbnail index if thumbnail was moved
          if (thumbnailIndex === oldIndex) {
            setThumbnailIndex(newIndex);
          } else if (oldIndex < thumbnailIndex && newIndex >= thumbnailIndex) {
            setThumbnailIndex(thumbnailIndex - 1);
          } else if (oldIndex > thumbnailIndex && newIndex <= thumbnailIndex) {
            setThumbnailIndex(thumbnailIndex + 1);
          }

          return newFiles;
        });
      }
    },
    [thumbnailIndex]
  );

  /**
   * Handle delete photo
   */
  const handleDeletePhoto = useCallback(
    (index: number) => {
      setSelectedFiles((files) => files.filter((_, i) => i !== index));

      // Adjust thumbnail index
      if (thumbnailIndex === index) {
        // Deleted photo was thumbnail, set to first photo
        setThumbnailIndex(0);
      } else if (index < thumbnailIndex) {
        // Deleted photo was before thumbnail, adjust index
        setThumbnailIndex(thumbnailIndex - 1);
      }

      setTouched(true);
    },
    [thumbnailIndex]
  );

  /**
   * Check if photos are valid
   */
  const isValid = useMemo(() => {
    return (
      selectedFiles.length > 0 &&
      selectedFiles.length <= 5 &&
      Object.keys(errors).length === 0
    );
  }, [selectedFiles, errors]);

  /**
   * Check if can proceed to next step
   */
  const canProceed = useMemo(() => {
    return isValid && !isValidating;
  }, [isValid, isValidating]);

  /**
   * Handle continue button click
   */
  const handleContinue = useCallback(() => {
    if (!canProceed) return;

    setTouched(true);

    // Validate one more time
    const error = validateGemPhotos(selectedFiles);
    if (error) {
      setErrors({ photos: error });
      return;
    }

    // Save to store (already auto-saved, but explicit for clarity)
    setMedia({
      photos: selectedFiles,
      thumbnailIndex: thumbnailIndex,
    });

    // Navigate to next step
    onNext();
  }, [canProceed, selectedFiles, thumbnailIndex, setMedia, onNext]);

  return (
    <div className="flex flex-col h-dvh bg-bg-white">
      <StepHeader
        title="Create Gem"
        totalSteps={5}
        currentStep={2}
        onBack={onBackToPreviousPage}
      />

      {/* Content Area (Scrollable) */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-6">
          {/* Empty State - No Photos */}
          {selectedFiles.length === 0 && (
            <div>
              <FileUpload
                accept="image/jpeg,image/png,image/webp"
                multiple={true}
                maxSize={5 * 1024 * 1024} // 5MB
                maxFiles={5}
                onFilesChange={handleFilesChange}
                required={true}
                helperText="Upload up to 5 photos. Accepted: JPG, PNG, WebP. Max 5MB per file."
                error={touched && errors.photos ? errors.photos : undefined}
                customIcon={
                  <div className="mb-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-green rounded-full mb-3 mx-auto">
                      <Camera className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-lg font-semibold text-text-primary mb-1">
                      Add Photos
                    </h2>
                  </div>
                }
              />
            </div>
          )}

          {/* Photo Grid - Photos Selected */}
          {selectedFiles.length > 0 && (
            <div className="space-y-4">
              {/* Uploaded Media Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-text-primary">
                    Uploaded Media
                  </h3>
                  {isValid && !isValidating && (
                    <CheckCircle className="w-4 h-4 text-success" />
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "text-sm font-medium",
                      isValid ? "text-success" : "text-text-secondary"
                    )}
                  >
                    {selectedFiles.length}/5
                  </span>
                </div>
              </div>

              {/* Success Message */}
              {isValid && !isValidating && touched && (
                <div className="flex items-center gap-2 p-3 bg-success/5 border border-success/20 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                  <p className="text-sm text-success">
                    Photos uploaded successfully
                  </p>
                </div>
              )}

              {/* Error Message */}
              {errors.photos && touched && (
                <div className="flex items-center gap-2 p-3 bg-error/5 border border-error/20 rounded-lg">
                  <X className="w-4 h-4 text-error flex-shrink-0" />
                  <p className="text-sm text-error">{errors.photos}</p>
                </div>
              )}

              {/* Photo Grid with Drag-and-Drop */}
              <DndContext
                onDragEnd={handleDragEnd}
                collisionDetection={closestCenter}
              >
                <SortableContext
                  items={selectedFiles.map((_, i) => i)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {selectedFiles.map((file, index) => (
                      <PhotoCard
                        key={index}
                        file={file}
                        index={index}
                        previewUrl={previewUrls[index]}
                        isThumb={index === thumbnailIndex}
                        onDelete={() => handleDeletePhoto(index)}
                        onSetThumbnail={() => setThumbnailIndex(index)}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>

              {/* Add More Photos Button */}
              {selectedFiles.length < 5 && (
                <>
                  <input
                    ref={additionalFileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    className="hidden"
                    onChange={handleAddMorePhotos}
                  />
                  <Button
                    variant="outline"
                    onClick={() => additionalFileInputRef.current?.click()}
                    className="w-full"
                    disabled={selectedFiles.length >= 5}
                    type="button"
                  >
                    Add More Photos ({selectedFiles.length}/5)
                  </Button>
                </>
              )}
            </div>
          )}

          {/* Photo Tips Section */}
          <div className="bg-bg-light rounded-lg p-4">
            <h3 className="font-semibold text-text-primary mb-3">Photo Tips</h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-sm text-text-secondary">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-green mt-2 flex-shrink-0" />
                <span>Show authentic character and details</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-text-secondary">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-green mt-2 flex-shrink-0" />
                <span>Capture multiple angles</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-text-secondary">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-green mt-2 flex-shrink-0" />
                <span>Include context and surroundings</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer - Back and Continue Buttons */}
      <div className="shrink-0 p-4 border-t border-border-subtle bg-bg-white">
        <div className="flex flex-row gap-3 items-center">
          <Button
            variant="outline"
            size="lg"
            onClick={onBackToPreviousStep}
            className="flex-1 sm:flex-initial sm:min-w-[120px]"
            type="button"
          >
            Back
          </Button>
          <Button
            variant="primary"
            size="lg"
            onClick={handleContinue}
            disabled={!canProceed}
            className="flex-1 sm:flex-1"
            type="button"
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
