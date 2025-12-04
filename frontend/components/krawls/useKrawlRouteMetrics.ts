"use client";

import { useState, useEffect } from 'react';
import { KrawlDetail } from '@/types/krawl-detail';
import { getCachedRoute } from '@/lib/map/routingUtils';
import type { Coordinates } from '@/components/map/gem-types';

export interface RouteMetrics {
  distance: number; // meters
  duration: number; // seconds
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook to calculate route metrics (distance and duration) for a Krawl
 * 
 * @param krawl - Krawl detail data with gems
 * @param profile - Routing profile (walking, cycling, driving)
 * @returns Route metrics with distance, duration, loading state, and error
 * 
 * @example
 * const metrics = useKrawlRouteMetrics(krawl, 'walking');
 * if (metrics.isLoading) return <Loading />;
 * if (metrics.error) return <Error message={metrics.error} />;
 * return <div>Distance: {formatDistance(metrics.distance)}</div>;
 */
export function useKrawlRouteMetrics(
  krawl: KrawlDetail | null,
  profile: 'walking' | 'cycling' | 'driving' = 'walking'
): RouteMetrics {
  const [metrics, setMetrics] = useState<RouteMetrics>({
    distance: 0,
    duration: 0,
    isLoading: false,
    error: null,
  });

  useEffect(() => {
    if (!krawl || !krawl.gems || krawl.gems.length < 2) {
      setMetrics({
        distance: 0,
        duration: 0,
        isLoading: false,
        error: krawl && krawl.gems && krawl.gems.length < 2 
          ? 'Insufficient gems for route calculation' 
          : null,
      });
      return;
    }

    const calculateMetrics = async () => {
      setMetrics(prev => ({ ...prev, isLoading: true, error: null }));

      try {
        const waypoints: Coordinates[] = krawl.gems
          .filter(gem => gem.coordinates && gem.coordinates.length === 2)
          .map(gem => gem.coordinates);

        if (waypoints.length < 2) {
          setMetrics({
            distance: 0,
            duration: 0,
            isLoading: false,
            error: 'Invalid gem coordinates',
          });
          return;
        }

        const route = await getCachedRoute(waypoints, profile);

        if (!route) {
          setMetrics({
            distance: 0,
            duration: 0,
            isLoading: false,
            error: 'Route calculation failed',
          });
          return;
        }

        setMetrics({
          distance: route.distance,
          duration: route.duration,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        console.error('Error calculating route metrics:', error);
        setMetrics({
          distance: 0,
          duration: 0,
          isLoading: false,
          error: 'Failed to calculate route',
        });
      }
    };

    calculateMetrics();
  }, [krawl, profile]);

  return metrics;
}

