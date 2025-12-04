"use client";

import React, { useState, useCallback, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MapGem } from "@/components/map/gem-types";
import { cn } from "@/lib/utils";

interface ContextInjectionFormProps {
  gem: MapGem;
  initialCreatorNote?: string;
  initialLokalSecret?: string;
  onAdd: (creatorNote: string, lokalSecret: string) => void;
  onCancel: () => void;
}

export function ContextInjectionForm({
  gem,
  initialCreatorNote = "",
  initialLokalSecret = "",
  onAdd,
  onCancel,
}: ContextInjectionFormProps) {
  const [creatorNote, setCreatorNote] = useState(initialCreatorNote);
  const [lokalSecret, setLokalSecret] = useState(initialLokalSecret);
  const [errors, setErrors] = useState<{
    creatorNote?: string;
    lokalSecret?: string;
  }>({});

  // Validate on change
  useEffect(() => {
    const newErrors: typeof errors = {};

    if (creatorNote.trim().length > 0 && creatorNote.trim().length < 10) {
      newErrors.creatorNote = "Creator Note must be at least 10 characters";
    } else if (creatorNote.trim().length > 500) {
      newErrors.creatorNote = "Creator Note must be at most 500 characters";
    }

    if (lokalSecret.trim().length > 0 && lokalSecret.trim().length < 10) {
      newErrors.lokalSecret = "Lokal Secret must be at least 10 characters";
    } else if (lokalSecret.trim().length > 500) {
      newErrors.lokalSecret = "Lokal Secret must be at most 500 characters";
    }

    setErrors(newErrors);
  }, [creatorNote, lokalSecret]);

  const handleAdd = useCallback(() => {
    const newErrors: typeof errors = {};

    if (creatorNote.trim().length < 10) {
      newErrors.creatorNote = "Creator Note must be at least 10 characters";
    } else if (creatorNote.trim().length > 500) {
      newErrors.creatorNote = "Creator Note must be at most 500 characters";
    }

    if (lokalSecret.trim().length < 10) {
      newErrors.lokalSecret = "Lokal Secret must be at least 10 characters";
    } else if (lokalSecret.trim().length > 500) {
      newErrors.lokalSecret = "Lokal Secret must be at most 500 characters";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onAdd(creatorNote, lokalSecret);
  }, [creatorNote, lokalSecret, onAdd]);

  const isValid =
    creatorNote.trim().length >= 10 &&
    creatorNote.trim().length <= 500 &&
    lokalSecret.trim().length >= 10 &&
    lokalSecret.trim().length <= 500;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-4 border-b border-border-subtle flex items-center justify-between">
          <h2 className="text-lg font-semibold text-text-primary">
            {initialCreatorNote || initialLokalSecret
              ? "Edit Gem Context"
              : "Add Gem to Krawl"}
          </h2>
          <button
            onClick={onCancel}
            className="p-1 hover:bg-bg-light rounded-lg transition-colors"
            aria-label="Close"
            type="button"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Gem Preview */}
        <div className="p-4 border-b border-border-subtle">
          <div className="flex gap-3">
            {gem.thumbnailUrl ? (
              <img
                src={gem.thumbnailUrl}
                alt={gem.name}
                className="w-16 h-16 rounded-lg object-cover shrink-0"
              />
            ) : (
              <div className="w-16 h-16 rounded-lg bg-bg-light flex items-center justify-center shrink-0">
                <span className="text-2xl">📍</span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-text-primary truncate">
                {gem.name}
              </h3>
              <p className="text-sm text-text-secondary">{gem.category}</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="p-4 space-y-4">
          {/* Creator Note */}
          <div className="space-y-2">
            <Textarea
              label="Creator Note"
              required
              value={creatorNote}
              onChange={(e) => setCreatorNote(e.target.value)}
              error={errors.creatorNote}
              placeholder="Share practical logistics information (e.g., best time to visit, parking tips, entry fees)..."
              helperText="Practical information to help others plan their visit"
              rows={4}
              maxLength={501}
            />
            <div className="flex justify-end">
              <span
                className={cn(
                  "text-xs font-medium",
                  creatorNote.length > 500
                    ? "text-error"
                    : creatorNote.length > 450
                    ? "text-accent-orange"
                    : "text-text-secondary"
                )}
              >
                {creatorNote.length}/500
              </span>
            </div>
          </div>

          {/* Lokal Secret */}
          <div className="space-y-2">
            <Textarea
              label="Lokal Secret"
              required
              value={lokalSecret}
              onChange={(e) => setLokalSecret(e.target.value)}
              error={errors.lokalSecret}
              placeholder="Share an insider tip (e.g., hidden menu items, best photo spots, local customs)..."
              helperText="An insider tip that makes this gem special"
              rows={4}
              maxLength={501}
            />
            <div className="flex justify-end">
              <span
                className={cn(
                  "text-xs font-medium",
                  lokalSecret.length > 500
                    ? "text-error"
                    : lokalSecret.length > 450
                    ? "text-accent-orange"
                    : "text-text-secondary"
                )}
              >
                {lokalSecret.length}/500
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border-subtle flex gap-3">
          <Button variant="secondary" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleAdd}
            disabled={!isValid}
            className="flex-1"
          >
            {initialCreatorNote || initialLokalSecret ? "Update" : "Add to Krawl"}
          </Button>
        </div>
      </div>
    </div>
  );
}

