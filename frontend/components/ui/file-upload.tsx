"use client";

import { Upload, X, XCircle, FileImage, Loader2 } from "lucide-react";
import { useState, useRef, useId, DragEvent, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

/**
 * File upload component with drag-and-drop support, validation, and file preview.
 *
 * Supports multiple files, file type/size validation, and displays validation errors.
 * Includes drag-and-drop functionality and file preview with removal capability.
 *
 * @example
 * ```tsx
 * <FileUpload
 *   label="Upload Images"
 *   accept="image/*"
 *   multiple
 *   maxSize={5 * 1024 * 1024}
 *   maxFiles={5}
 *   onFilesChange={(files) => console.log(files)}
 * />
 * ```
 */
export interface FileUploadProps {
  label?: string;
  error?: string;
  helperText?: string;
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in bytes
  maxFiles?: number;
  onFilesChange?: (files: File[]) => void;
  disabled?: boolean;
  required?: boolean;
  fullWidth?: boolean;
  customIcon?: React.ReactNode;
  singleImageMode?: boolean; // Enable large preview for single image
  imagePreviewHeight?: string; // Height class for preview (default "h-48")
  showChangeButton?: boolean; // Show "Change Image" button on preview
  showRemoveButton?: boolean; // Show remove button on preview
  uploadProgress?: number; // Upload progress 0-100 (for external upload tracking)
  isUploading?: boolean; // Whether upload is in progress
  previewUrl?: string; // External preview URL (for Cloudinary URLs)
}

export function FileUpload({
  label,
  error,
  helperText,
  accept,
  multiple = false,
  maxSize,
  maxFiles,
  onFilesChange,
  disabled = false,
  required = false,
  fullWidth = true,
  customIcon,
  singleImageMode = false,
  imagePreviewHeight = "h-48",
  showChangeButton = true,
  showRemoveButton = true,
  uploadProgress = 0,
  isUploading = false,
  previewUrl: externalPreviewUrl,
}: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const generatedId = useId();
  const fileUploadId = `file-upload-${generatedId}`;
  const hasError = !!error || !!uploadError;
  
  // Use external preview URL if provided, otherwise use local preview
  const previewUrl = externalPreviewUrl || localPreviewUrl;

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const validateFile = (file: File): string | null => {
    if (maxSize && file.size > maxSize) {
      return `File size must be less than ${formatFileSize(maxSize)}`;
    }
    if (
      accept &&
      !accept.split(",").some((type) => {
        const trimmedType = type.trim();
        return (
          file.type.match(trimmedType) ||
          file.name.match(new RegExp(trimmedType.replace("*", ".*")))
        );
      })
    ) {
      return `File type must be one of: ${accept}`;
    }
    return null;
  };

  const handleFiles = (newFiles: FileList | File[]) => {
    const fileArray = Array.from(newFiles);
    setUploadError(null);

    // Check max files limit
    if (maxFiles && files.length + fileArray.length > maxFiles) {
      setUploadError(`Maximum ${maxFiles} file(s) allowed`);
      return;
    }

    // Validate each file
    const validFiles: File[] = [];
    const validationErrors: string[] = [];

    for (const file of fileArray) {
      const validationError = validateFile(file);
      if (validationError) {
        validationErrors.push(`${file.name}: ${validationError}`);
        continue;
      }
      validFiles.push(file);
    }

    // Display validation errors if any
    if (validationErrors.length > 0) {
      if (validationErrors.length === 1) {
        setUploadError(validationErrors[0]);
      } else {
        setUploadError(
          `${validationErrors.length} file(s) failed validation. ${validationErrors.slice(0, 2).join("; ")}${validationErrors.length > 2 ? "..." : ""}`
        );
      }
    }

    // Add valid files if any
    if (validFiles.length > 0) {
      const updatedFiles = multiple ? [...files, ...validFiles] : validFiles;
      setFiles(updatedFiles);
      onFilesChange?.(updatedFiles);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;

    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      handleFiles(droppedFiles);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const removeFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    onFilesChange?.(updatedFiles);
  };

  const isImageFile = (file: File): boolean => {
    return file.type.startsWith("image/");
  };

  // Generate preview URL for single image mode
  useEffect(() => {
    if (singleImageMode && !multiple && files.length > 0) {
      const file = files[0];
      if (isImageFile(file)) {
        const url = URL.createObjectURL(file);
        setLocalPreviewUrl(url);
        return () => {
          URL.revokeObjectURL(url);
        };
      }
    } else if (singleImageMode && files.length === 0) {
      setLocalPreviewUrl(null);
    }
  }, [files, singleImageMode, multiple]);

  // Handle change image button
  const handleChangeImage = () => {
    fileInputRef.current?.click();
  };

  // Handle remove image
  const handleRemoveImage = () => {
    if (localPreviewUrl) {
      URL.revokeObjectURL(localPreviewUrl);
      setLocalPreviewUrl(null);
    }
    setFiles([]);
    onFilesChange?.([]);
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={cn("space-y-2", fullWidth && "w-full")}>
      {label && (
        <label
          htmlFor={fileUploadId}
          className="block text-sm font-medium text-text-primary"
        >
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200",
          "cursor-pointer",
          isDragging && !disabled && "border-primary-green bg-light-green/10",
          hasError && "border-error bg-error/5",
          !hasError &&
            !isDragging &&
            "border-bg-medium hover:border-primary-green hover:bg-bg-light",
          disabled && "opacity-60 cursor-not-allowed",
          isUploading && "pointer-events-none"
        )}
        onClick={() => !disabled && !isUploading && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          id={fileUploadId}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileInputChange}
          disabled={disabled}
          required={required}
          className="hidden"
          aria-invalid={hasError}
          aria-describedby={
            error || uploadError
              ? `${fileUploadId}-error`
              : helperText
                ? `${fileUploadId}-helper`
                : undefined
          }
        />
        {customIcon || (
          <Upload
            className={cn(
              "w-8 h-8 mx-auto mb-2",
              hasError ? "text-error" : "text-text-secondary"
            )}
          />
        )}
        {!isUploading ? (
          <p
            className={cn(
              "text-sm font-medium mb-1",
              hasError ? "text-error" : "text-text-primary"
            )}
          >
            {isDragging ? "Drop files here" : "Click to upload or drag and drop"}
          </p>
        ) : (
          <div className="space-y-2">
            <Loader2 className="w-8 h-8 mx-auto animate-spin text-primary-green" />
            <p className="text-sm font-medium text-text-primary">
              Uploading... {uploadProgress}%
            </p>
            <div className="w-full bg-bg-medium rounded-full h-2">
              <div
                className="bg-primary-green h-2 rounded-full transition-all"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}
        <p className="text-xs text-text-secondary">
          {accept && `Accepted: ${accept}`}
          {maxSize && ` • Max size: ${formatFileSize(maxSize)}`}
          {maxFiles && ` • Max files: ${maxFiles}`}
        </p>
      </div>

      {/* Single Image Mode Preview */}
      {singleImageMode && !multiple && previewUrl && (
        <div className="relative group">
          <div className={cn("relative w-full bg-bg-light rounded-lg overflow-hidden", imagePreviewHeight)}>
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={() => {
                setUploadError("Failed to load image preview");
              }}
            />
            {isUploading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="text-center space-y-2">
                  <Loader2 className="w-8 h-8 mx-auto animate-spin text-white" />
                  <p className="text-sm text-white">Uploading... {uploadProgress}%</p>
                  <div className="w-48 bg-white/20 rounded-full h-2">
                    <div
                      className="bg-primary-green h-2 rounded-full transition-all"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
          {!isUploading && (showChangeButton || showRemoveButton) && (
            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              {showChangeButton && (
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={handleChangeImage}
                  disabled={disabled}
                >
                  Change Image
                </Button>
              )}
              {showRemoveButton && (
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={handleRemoveImage}
                  disabled={disabled}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Standard File List (when not in single image mode or multiple files) */}
      {!singleImageMode && files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, index) => (
            <div
              key={`${file.name}-${file.size}-${file.lastModified}-${index}`}
              className="flex items-center gap-3 p-3 bg-bg-light rounded-lg"
            >
              {isImageFile(file) ? (
                <FileImage className="w-5 h-5 text-text-secondary flex-shrink-0" />
              ) : (
                <div className="w-5 h-5 flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary truncate">
                  {file.name}
                </p>
                <p className="text-xs text-text-secondary">
                  {formatFileSize(file.size)}
                </p>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(index);
                }}
                className="text-text-secondary hover:text-error transition-colors"
                aria-label={`Remove ${file.name}`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {(error || uploadError) && (
        <p
          id={`${fileUploadId}-error`}
          className="text-sm text-error flex items-center gap-1"
          role="alert"
        >
          <XCircle className="w-4 h-4" />
          {error || uploadError}
        </p>
      )}
      {helperText && !error && !uploadError && (
        <p
          id={`${fileUploadId}-helper`}
          className="text-sm text-text-secondary"
        >
          {helperText}
        </p>
      )}
    </div>
  );
}
