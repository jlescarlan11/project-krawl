"use client";

import { useState, useRef, useEffect, useId, useCallback } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { validateGemTag } from "@/lib/validation/gem-validation";

/**
 * Props for TagInput component
 */
export interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  suggestions?: string[];
  maxTags?: number;
  error?: string;
  label?: string;
  helperText?: string;
  required?: boolean;
}

/**
 * TagInput Component
 *
 * Tag input with autocomplete suggestions and chip display.
 * Supports keyboard navigation and validation.
 *
 * Features:
 * - Autocomplete with filter-as-you-type
 * - Tag chips with remove buttons
 * - Max tags enforcement
 * - Duplicate prevention (case-insensitive)
 * - Keyboard navigation (Enter, Escape, Arrow keys)
 * - Character validation per tag
 *
 * @example
 * ```tsx
 * <TagInput
 *   value={tags}
 *   onChange={setTags}
 *   suggestions={["local", "authentic", "family-friendly"]}
 *   maxTags={5}
 *   label="Tags"
 * />
 * ```
 */
export function TagInput({
  value,
  onChange,
  suggestions = [],
  maxTags = 5,
  error,
  label,
  helperText,
  required = false,
}: TagInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [inputError, setInputError] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const id = useId();
  const labelId = `tag-input-label-${id}`;
  const errorId = `tag-input-error-${id}`;
  const helperId = `tag-input-helper-${id}`;

  const maxTagsReached = value.length >= maxTags;

  // Filter suggestions based on input
  const filteredSuggestions = suggestions.filter((suggestion) => {
    const matchesInput =
      !inputValue ||
      suggestion.toLowerCase().includes(inputValue.toLowerCase());
    const notAlreadyAdded = !value
      .map((t) => t.toLowerCase())
      .includes(suggestion.toLowerCase());
    return matchesInput && notAlreadyAdded;
  });

  // Add tag
  const addTag = useCallback(
    (tag: string) => {
      const trimmed = tag.trim();

      if (!trimmed) return;

      // Check if max tags reached
      if (value.length >= maxTags) {
        setInputError(`Maximum ${maxTags} tags allowed`);
        return;
      }

      // Check for duplicate (case-insensitive)
      if (value.map((t) => t.toLowerCase()).includes(trimmed.toLowerCase())) {
        setInputError("Tag already added");
        setTimeout(() => setInputError(null), 2000);
        return;
      }

      // Validate tag format
      const validationError = validateGemTag(trimmed);
      if (validationError) {
        setInputError(validationError);
        setTimeout(() => setInputError(null), 2000);
        return;
      }

      // Add tag
      onChange([...value, trimmed]);
      setInputValue("");
      setInputError(null);
      setShowSuggestions(false);
      setHighlightedIndex(-1);
    },
    [value, onChange, maxTags]
  );

  // Remove tag
  const removeTag = (tagToRemove: string) => {
    onChange(value.filter((tag) => tag !== tagToRemove));
    inputRef.current?.focus();
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setInputError(null);
    setShowSuggestions(true);
    setHighlightedIndex(-1);
  };

  // Handle input focus
  const handleInputFocus = () => {
    if (!maxTagsReached) {
      setShowSuggestions(true);
    }
  };

  // Handle input blur
  const handleInputBlur = () => {
    // Delay to allow click on suggestion
    setTimeout(() => {
      setShowSuggestions(false);
      setHighlightedIndex(-1);
    }, 300);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Enter: Add tag
    if (e.key === "Enter") {
      e.preventDefault();

      if (highlightedIndex >= 0 && highlightedIndex < filteredSuggestions.length) {
        addTag(filteredSuggestions[highlightedIndex]);
      } else if (inputValue.trim()) {
        addTag(inputValue);
      }
    }

    // Escape: Close suggestions
    if (e.key === "Escape") {
      setShowSuggestions(false);
      setHighlightedIndex(-1);
    }

    // Arrow Down: Navigate suggestions
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < filteredSuggestions.length - 1 ? prev + 1 : prev
      );
    }

    // Arrow Up: Navigate suggestions
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    }

    // Backspace: Remove last tag if input is empty
    if (e.key === "Backspace" && !inputValue && value.length > 0) {
      e.preventDefault();
      removeTag(value[value.length - 1]);
    }
  };

  // Scroll highlighted suggestion into view
  useEffect(() => {
    if (highlightedIndex >= 0 && dropdownRef.current) {
      const highlightedElement = dropdownRef.current.children[highlightedIndex] as HTMLElement;
      highlightedElement?.scrollIntoView({
        block: "nearest",
        behavior: "smooth",
      });
    }
  }, [highlightedIndex]);

  return (
    <div className="space-y-2">
      {/* Label */}
      {label && (
        <label
          id={labelId}
          htmlFor={`${id}-input`}
          className="block text-sm font-medium text-text-primary"
        >
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}

      {/* Tag Chips Display */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((tag, index) => (
            <TagChip
              key={`${tag}-${index}`}
              tag={tag}
              onRemove={() => removeTag(tag)}
            />
          ))}
        </div>
      )}

      {/* Input Field with Autocomplete */}
      <div className="relative">
        <input
          ref={inputRef}
          id={`${id}-input`}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
          disabled={maxTagsReached}
          placeholder={
            maxTagsReached
              ? `Maximum ${maxTags} tags reached`
              : "Type to search or enter custom tag..."
          }
          className={cn(
            "w-full px-4 py-3 rounded-lg text-base text-text-primary",
            "border min-h-[44px]",
            "focus:outline-none focus:ring-2",
            "disabled:bg-bg-light disabled:border-bg-medium disabled:text-text-tertiary/60 disabled:cursor-not-allowed",
            "placeholder:text-text-secondary/60",
            error || inputError
              ? "border-error bg-error/5 focus:border-error focus:ring-error/20"
              : "border-bg-medium focus:border-primary-green focus:ring-primary-green/20"
          )}
          aria-invalid={!!(error || inputError) ? "true" : "false"}
          aria-describedby={
            error
              ? errorId
              : helperText
                ? helperId
                : undefined
          }
        />

        {/* Suggestions Dropdown */}
        {showSuggestions &&
          !maxTagsReached &&
          filteredSuggestions.length > 0 && (
            <div
              ref={dropdownRef}
              className="absolute z-10 w-full mt-1 bg-bg-white border border-border-subtle rounded-lg shadow-lg max-h-48 overflow-y-auto"
              role="listbox"
              aria-labelledby={labelId}
              aria-multiselectable="false"
            >
              {filteredSuggestions.map((suggestion, index) => (
                <SuggestionItem
                  key={suggestion}
                  suggestion={suggestion}
                  isHighlighted={index === highlightedIndex}
                  onClick={() => addTag(suggestion)}
                />
              ))}
            </div>
          )}
      </div>

      {/* Helper Text */}
      {helperText && !error && !inputError && (
        <p id={helperId} className="text-sm text-text-secondary">
          {helperText}
        </p>
      )}

      {/* Error Message */}
      {(error || inputError) && (
        <p id={errorId} className="text-sm text-error" role="alert">
          {error || inputError}
        </p>
      )}

      {/* Tag Counter */}
      <div className="flex justify-end">
        <span
          className={cn(
            "text-xs font-medium",
            maxTagsReached ? "text-accent-orange" : "text-text-secondary"
          )}
        >
          {value.length}/{maxTags} tags
        </span>
      </div>
    </div>
  );
}

/**
 * Individual tag chip component
 */
interface TagChipProps {
  tag: string;
  onRemove: () => void;
}

function TagChip({ tag, onRemove }: TagChipProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full",
        "bg-primary-green/10 border border-primary-green/30",
        "text-sm font-medium text-primary-green"
      )}
    >
      <span>{tag}</span>
      <button
        type="button"
        onClick={onRemove}
        className={cn(
          "flex items-center justify-center w-4 h-4 rounded-full",
          "hover:bg-primary-green/20 transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-primary-green focus:ring-offset-1"
        )}
        aria-label={`Remove ${tag} tag`}
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
}

/**
 * Suggestion item in dropdown
 */
interface SuggestionItemProps {
  suggestion: string;
  isHighlighted: boolean;
  onClick: () => void;
}

function SuggestionItem({
  suggestion,
  isHighlighted,
  onClick,
}: SuggestionItemProps) {
  return (
    <button
      type="button"
      role="option"
      aria-selected={isHighlighted ? "true" : "false"}
      onMouseDown={(e) => {
        e.preventDefault(); // Prevent input blur
        onClick();
      }}
      className={cn(
        "w-full px-4 py-2 text-left text-sm",
        "hover:bg-bg-light transition-colors",
        "focus:outline-none focus:bg-bg-light",
        isHighlighted && "bg-bg-light"
      )}
    >
      {suggestion}
    </button>
  );
}
