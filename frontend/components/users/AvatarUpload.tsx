"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Upload, X, Loader2, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { uploadSingleFile } from "@/lib/cloudinary/upload";

export interface AvatarUploadProps {
  /** Current avatar URL */
  currentAvatarUrl?: string;

  /** Callback when avatar is uploaded */
  onUploadComplete: (url: string) => void;

  /** Callback when upload fails */
  onUploadError?: (error: string) => void;

  /** Optional className for styling */
  className?: string;
}

/**
 * AvatarUpload Component
 *
 * Handles avatar upload with drag-and-drop, preview, and Cloudinary integration.
 */
export function AvatarUpload({
  currentAvatarUrl,
  onUploadComplete,
  onUploadError,
  className,
}: AvatarUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentAvatarUrl || null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    // Validate file type
    if (!file.type.startsWith("image/")) {
      const err = "Please select an image file";
      setError(err);
      onUploadError?.(err);
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      const err = "Image must be less than 5MB";
      setError(err);
      onUploadError?.(err);
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to Cloudinary
    try {
      setUploading(true);
      setError(null);

      const result = await uploadSingleFile(file, 0, {
        folder: "krawl-avatars",
      });

      if (result.success && result.url) {
        onUploadComplete(result.url);
        setPreview(result.url);
      } else {
        throw new Error(result.error || "Upload failed");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Upload failed";
      setError(errorMessage);
      onUploadError?.(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onUploadComplete("");
  };

  return (
    <div className={cn("space-y-4", className)}>
      <label className="block text-sm font-medium text-text-primary">
        Profile Picture
      </label>

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={cn(
          "relative w-32 h-32 rounded-full overflow-hidden border-4 border-bg-medium",
          "flex items-center justify-center bg-bg-light",
          isDragging && "border-primary-green",
          uploading && "opacity-50"
        )}
      >
        {preview ? (
          <>
            <Image
              src={preview}
              alt="Avatar preview"
              width={128}
              height={128}
              className="w-full h-full object-cover"
            />
            {uploading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
              </div>
            )}
            {!uploading && (
              <button
                onClick={handleRemove}
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                type="button"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </>
        ) : (
          <div className="text-text-tertiary">
            <User className="w-12 h-12" />
          </div>
        )}
      </div>

      <div className="space-y-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleClick}
          disabled={uploading}
        >
          <Upload className="w-4 h-4 mr-2" />
          {preview ? "Change Photo" : "Upload Photo"}
        </Button>

        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}

        <p className="text-xs text-text-tertiary">
          JPG, PNG or WebP. Max 5MB. Recommended: 200x200px
        </p>
      </div>
    </div>
  );
}

