"use client";

import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Radio } from "@/components/ui/radio";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast";
import { ReportModalProps, ReportReason } from "./types";

/**
 * Report reason options with user-friendly labels
 */
const REPORT_REASONS: Array<{ value: ReportReason; label: string; description?: string }> = [
  { value: "INACCURATE", label: "Inaccurate information" },
  { value: "COMMERCIAL", label: "Commercial/spam content" },
  { value: "OFFENSIVE", label: "Offensive content" },
  { value: "SPAM", label: "Spam" },
  { value: "OTHER", label: "Other", description: "Please provide details" },
];

/**
 * ReportModal Component
 *
 * A modal dialog for reporting inappropriate or inaccurate content (Gems or Krawls).
 * Supports both authenticated and guest users.
 */
export function ReportModal({
  isOpen,
  onClose,
  contentType,
  contentId,
  contentName,
}: ReportModalProps) {
  const { success, error: showError } = useToast();
  const [reason, setReason] = useState<ReportReason | null>(null);
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ reason?: string; description?: string }>({});
  const modalRef = useRef<HTMLDivElement>(null);
  const firstRadioRef = useRef<HTMLInputElement>(null);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setReason(null);
      setDescription("");
      setErrors({});
      setIsSubmitting(false);
      // Focus first radio button when modal opens
      setTimeout(() => {
        firstRadioRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  // Handle click outside modal to close
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Validate form
  const validate = (): boolean => {
    const newErrors: { reason?: string; description?: string } = {};

    if (!reason) {
      newErrors.reason = "Please select a reason for reporting";
    }

    if (reason === "OTHER" && (!description || description.trim().length === 0)) {
      newErrors.description = "Please provide details when selecting 'Other'";
    }

    if (description && description.length > 500) {
      newErrors.description = "Description cannot exceed 500 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/reports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contentType,
          contentId,
          reason,
          description: description.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit report");
      }

      // Show success toast
      success(
        "Report submitted",
        "Thank you for your report. We'll review this content."
      );

      // Close modal after short delay
      setTimeout(() => {
        onClose();
      }, 500);
    } catch (error) {
      console.error("Error submitting report:", error);
      showError(
        "Failed to submit report",
        error instanceof Error ? error.message : "Please try again later."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle description change with character limit
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= 500) {
      setDescription(value);
      // Clear description error when user starts typing
      if (errors.description) {
        setErrors({ ...errors, description: undefined });
      }
    }
  };

  // Handle reason change
  const handleReasonChange = (value: ReportReason) => {
    setReason(value);
    // Clear reason error when user selects
    if (errors.reason) {
      setErrors({ ...errors, reason: undefined });
    }
    // Clear description if reason is not OTHER
    if (value !== "OTHER") {
      setDescription("");
    }
  };

  if (!isOpen) return null;

  const descriptionCharCount = description.length;
  const maxDescriptionLength = 500;
  const isDescriptionRequired = reason === "OTHER";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="report-modal-title"
    >
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 id="report-modal-title" className="text-xl font-semibold text-text-primary">
            Report Content
          </h2>
          <button
            onClick={onClose}
            className="text-text-tertiary hover:text-text-primary transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Content info */}
          <div className="text-sm text-text-secondary">
            <p>
              Reporting: <span className="font-medium text-text-primary">{contentName}</span>
            </p>
            <p className="mt-1">
              Type: <span className="font-medium text-text-primary">{contentType}</span>
            </p>
          </div>

          {/* Reason selection */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-text-primary">
              Reason for reporting <span className="text-error">*</span>
            </label>
            <div className="space-y-2">
              {REPORT_REASONS.map((option, index) => (
                <Radio
                  key={option.value}
                  ref={index === 0 ? firstRadioRef : undefined}
                  name="report-reason"
                  label={option.label}
                  value={option.value}
                  checked={reason === option.value}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      handleReasonChange(option.value);
                    }
                  }}
                  error={errors.reason && index === 0 ? errors.reason : undefined}
                  helperText={option.description}
                />
              ))}
            </div>
            {errors.reason && (
              <p className="text-sm text-error mt-1">{errors.reason}</p>
            )}
          </div>

          {/* Description field */}
          <div className="space-y-2">
            <Textarea
              label="Additional details (optional)"
              placeholder={
                isDescriptionRequired
                  ? "Please provide details about why you're reporting this content..."
                  : "Provide any additional information that might help us review this report..."
              }
              value={description}
              onChange={handleDescriptionChange}
              rows={4}
              error={errors.description}
              required={isDescriptionRequired}
              disabled={isSubmitting}
            />
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-secondary">
                {isDescriptionRequired && (
                  <span className="text-error">Required when reason is "Other"</span>
                )}
              </span>
              <span
                className={
                  descriptionCharCount > maxDescriptionLength * 0.9
                    ? "text-warning"
                    : "text-text-tertiary"
                }
              >
                {descriptionCharCount}/{maxDescriptionLength}
              </span>
            </div>
          </div>

          {/* Footer buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Report"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

