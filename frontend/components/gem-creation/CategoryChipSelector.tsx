"use client";

import { useState, useId } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { GEM_CATEGORIES, type GemCategory } from "@/lib/constants/gem-categories";

/**
 * Props for CategoryChipSelector component
 */
export interface CategoryChipSelectorProps {
  value: string;
  onChange: (category: string) => void;
  error?: string;
  required?: boolean;
}

/**
 * CategoryChipSelector Component
 *
 * Visual category selection with chips and icons.
 * Single-select interface for gem categories.
 *
 * Features:
 * - Icon + label for each category
 * - Active/inactive states
 * - Keyboard navigation support
 * - Accessibility (ARIA radiogroup)
 *
 * @example
 * ```tsx
 * <CategoryChipSelector
 *   value={category}
 *   onChange={setCategory}
 *   required
 * />
 * ```
 */
export function CategoryChipSelector({
  value,
  onChange,
  error,
  required = false,
}: CategoryChipSelectorProps) {
  const id = useId();
  const labelId = `category-label-${id}`;
  const errorId = `category-error-${id}`;

  const handleChipClick = (categoryValue: string) => {
    onChange(categoryValue);
  };

  const handleKeyDown = (
    e: React.KeyboardEvent,
    categoryValue: string
  ) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onChange(categoryValue);
    }
  };

  return (
    <div className="space-y-2">
      {/* Label */}
      <label
        id={labelId}
        className="block text-sm font-medium text-text-primary"
      >
        Category
        {required && <span className="text-error ml-1">*</span>}
      </label>

      {/* Chip Grid */}
      <div
        role="radiogroup"
        aria-labelledby={labelId}
        aria-required={required}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        className="grid grid-cols-2 gap-3"
      >
        {GEM_CATEGORIES.map((category) => (
          <CategoryChip
            key={category.value}
            category={category}
            isSelected={value === category.value}
            onClick={() => handleChipClick(category.value)}
            onKeyDown={(e) => handleKeyDown(e, category.value)}
          />
        ))}
      </div>

      {/* Error Message */}
      {error && (
        <p
          id={errorId}
          className="text-sm text-error flex items-center gap-1"
          role="alert"
        >
          <XCircle className="w-4 h-4" />
          {error}
        </p>
      )}

      {/* Success Indicator */}
      {!error && value && value.trim() !== "" && (
        <p className="text-sm text-success flex items-center gap-1">
          <CheckCircle className="w-4 h-4" />
          Category selected
        </p>
      )}
    </div>
  );
}

/**
 * Individual category chip component
 */
interface CategoryChipProps {
  category: GemCategory;
  isSelected: boolean;
  onClick: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

function CategoryChip({
  category,
  isSelected,
  onClick,
  onKeyDown,
}: CategoryChipProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={isSelected}
      onClick={onClick}
      onKeyDown={onKeyDown}
      className={cn(
        "flex items-center gap-2 px-4 py-3 rounded-lg border-2 transition-all",
        "focus:outline-none focus:ring-2 focus:ring-primary-green focus:ring-offset-2",
        "hover:bg-bg-light",
        isSelected
          ? "border-primary-green bg-primary-green/10"
          : "border-border-subtle bg-bg-white"
      )}
    >
      {/* Icon */}
      <span className="text-2xl" aria-hidden="true">
        {category.icon}
      </span>

      {/* Label */}
      <span
        className={cn(
          "text-sm font-medium",
          isSelected ? "text-primary-green" : "text-text-primary"
        )}
      >
        {category.label}
      </span>
    </button>
  );
}
