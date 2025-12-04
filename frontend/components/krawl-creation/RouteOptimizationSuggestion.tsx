"use client";

import React from 'react';
import { Sparkles, X, TrendingDown, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDistance, formatDuration } from '@/lib/format';
import type { OptimizationResult } from '@/hooks/useRouteOptimization';

interface RouteOptimizationSuggestionProps {
  result: OptimizationResult | null;
  isCalculating: boolean;
  onApply: () => void;
  onDismiss: () => void;
}

export function RouteOptimizationSuggestion({
  result,
  isCalculating,
  onApply,
  onDismiss,
}: RouteOptimizationSuggestionProps) {
  if (isCalculating || !result) {
    return (
      <div className="bg-primary-green/10 border border-primary-green/20 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <Loader2 className="w-5 h-5 text-primary-green animate-spin" />
          <div className="flex-1">
            <p className="text-sm font-medium text-text-primary">
              Calculating route optimization...
            </p>
            <p className="text-xs text-text-secondary mt-1">
              This may take a few seconds
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Estimate time savings assuming ~1.4 m/s walking speed
  const timeSavings = (result.savingsDistance / 1.4) * 60; // Convert to seconds

  return (
    <div className="bg-primary-green/10 border border-primary-green/20 rounded-lg p-4 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-green/20 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary-green" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-text-primary">
              Route Optimization Available
            </h4>
            <p className="text-xs text-text-secondary mt-1">
              We found a shorter route that could save you time and distance.
            </p>
          </div>
        </div>
        <button
          onClick={onDismiss}
          className="flex-shrink-0 w-6 h-6 rounded-full hover:bg-primary-green/20 flex items-center justify-center transition-colors"
          aria-label="Dismiss suggestion"
          type="button"
        >
          <X className="w-4 h-4 text-text-secondary" />
        </button>
      </div>

      <div className="bg-bg-white rounded-lg p-3 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-text-secondary">Current route:</span>
          <span className="font-medium text-text-primary">
            {formatDistance(result.currentDistance)}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-text-secondary">Optimized route:</span>
          <span className="font-medium text-primary-green">
            {formatDistance(result.optimizedDistance)}
          </span>
        </div>
        <div className="flex items-center gap-2 pt-2 border-t border-border-subtle">
          <TrendingDown className="w-4 h-4 text-primary-green" />
          <span className="text-sm font-semibold text-primary-green">
            Save {formatDistance(result.savingsDistance)} ({result.savingsPercentage.toFixed(1)}%)
          </span>
          {timeSavings > 60 && (
            <span className="text-xs text-text-tertiary">
              (~{formatDuration(timeSavings)})
            </span>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          variant="primary"
          size="sm"
          onClick={onApply}
          className="flex-1"
        >
          Apply Optimization
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={onDismiss}
        >
          Dismiss
        </Button>
      </div>
    </div>
  );
}

