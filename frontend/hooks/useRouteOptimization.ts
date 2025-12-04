"use client";

import { useState, useCallback, useMemo } from 'react';
import { optimizeRouteOrder, calculateRouteDistance } from '@/lib/map/routeOptimization';
import type { Coordinates } from '@/components/map/gem-types';

export interface OptimizationResult {
  optimizedOrder: number[];
  currentDistance: number;
  optimizedDistance: number;
  savingsPercentage: number;
  savingsDistance: number;
}

export interface UseRouteOptimizationOptions {
  profile?: 'walking' | 'cycling' | 'driving';
  preserveStartEnd?: boolean;
  minSavingsPercentage?: number; // Only show suggestion if savings >= this
}

export function useRouteOptimization(
  coordinates: Coordinates[],
  currentOrder: number[],
  options: UseRouteOptimizationOptions = {}
) {
  const {
    profile = 'walking',
    preserveStartEnd = false,
    minSavingsPercentage = 5, // 5% minimum savings to show suggestion
  } = options;

  const [isCalculating, setIsCalculating] = useState(false);
  const [optimizationResult, setOptimizationResult] = useState<OptimizationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dismissed, setDismissed] = useState(false);

  // Check if optimization is possible
  const canOptimize = useMemo(() => {
    return coordinates.length >= 2 && 
           coordinates.every(coord => coord && coord.length === 2) &&
           currentOrder.length === coordinates.length;
  }, [coordinates, currentOrder]);

  const calculateOptimization = useCallback(async () => {
    if (!canOptimize) {
      setError('Cannot optimize route with current data');
      return;
    }

    setIsCalculating(true);
    setError(null);
    setOptimizationResult(null);

    try {
      // Add timeout protection (2 seconds max as per requirements)
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Optimization timed out')), 2000);
      });

      // Wrap entire optimization in timeout
      const optimizationWork = async () => {
        // Calculate current route distance
        const currentDistance = await calculateRouteDistance(
          coordinates,
          currentOrder,
          profile
        );

        if (currentDistance === null) {
          throw new Error('Failed to calculate current route distance');
        }

        // Optimize route order
        const optimizedOrder = await optimizeRouteOrder(
          coordinates,
          currentOrder,
          profile,
          preserveStartEnd
        );

        if (!optimizedOrder) {
          throw new Error('Failed to optimize route');
        }

        // Calculate optimized route distance
        const optimizedDistance = await calculateRouteDistance(
          coordinates,
          optimizedOrder,
          profile
        );

        if (optimizedDistance === null) {
          throw new Error('Failed to calculate optimized route distance');
        }

        return { currentDistance, optimizedOrder, optimizedDistance };
      };

      const { currentDistance, optimizedOrder, optimizedDistance } = await Promise.race([
        optimizationWork(),
        timeoutPromise,
      ]);

      // Check if optimization actually improves the route
      if (optimizedDistance >= currentDistance) {
        // No improvement, don't show suggestion
        setOptimizationResult(null);
        return;
      }

      const savingsDistance = currentDistance - optimizedDistance;
      const savingsPercentage = (savingsDistance / currentDistance) * 100;

      // Only show if savings meet minimum threshold
      if (savingsPercentage < minSavingsPercentage) {
        setOptimizationResult(null);
        return;
      }

      setOptimizationResult({
        optimizedOrder,
        currentDistance,
        optimizedDistance,
        savingsPercentage,
        savingsDistance,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Optimization failed';
      setError(errorMessage);
      console.error('Route optimization error:', err);
    } finally {
      setIsCalculating(false);
    }
  }, [coordinates, currentOrder, profile, preserveStartEnd, minSavingsPercentage, canOptimize]);

  const dismiss = useCallback(() => {
    setDismissed(true);
    setOptimizationResult(null);
  }, []);

  const reset = useCallback(() => {
    setDismissed(false);
    setError(null);
    setOptimizationResult(null);
  }, []);

  return {
    isCalculating,
    optimizationResult,
    error,
    dismissed,
    canOptimize,
    calculateOptimization,
    dismiss,
    reset,
  };
}

