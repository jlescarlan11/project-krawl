"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Map } from "@/components/map/Map";
import { PreStartChecklist } from "@/components/krawl-mode/PreStartChecklist";
import { ProgressTracker } from "@/components/krawl-mode/ProgressTracker";
import { NextGemIndicator } from "@/components/krawl-mode/NextGemIndicator";
import { DirectionsPanel } from "@/components/krawl-mode/DirectionsPanel";
import { StopDetailCard } from "@/components/krawl-mode/StopDetailCard";
import { DistanceTimeIndicator } from "@/components/krawl-mode/DistanceTimeIndicator";
import { RoutePolyline } from "@/components/map/RoutePolyline";
import { CompletionScreen } from "@/components/krawl-mode/CompletionScreen";
import { useKrawlLocationTracking } from "@/hooks/useKrawlLocationTracking";
import { useKrawlDirections } from "@/hooks/useKrawlDirections";
import { getGeofencingService } from "@/services/geofencingService";
import { getDirectionsService } from "@/services/directionsService";
import { triggerArrivalFeedback } from "@/lib/krawl-mode/hapticFeedback";
import { useKrawlModeStore } from "@/stores/krawl-mode-store";
import {
  startKrawlModeSession,
  stopKrawlModeSession,
  getKrawlModeProgress,
  completeKrawlModeGem,
  updateKrawlModeLocation,
  getKrawlModeSession,
} from "@/lib/api/krawls";
import { calculateCompletionStats } from "@/lib/krawl-mode/completionStats";
import { KrawlDetail } from "@/types/krawl-detail";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import mapboxgl from "mapbox-gl";
import { KrawlTrailLayer } from "@/components/map/KrawlTrailLayer";
import type { Coordinates } from "@/components/map/gem-types";

interface KrawlModeClientProps {
  krawlId: string;
  krawl: KrawlDetail;
}

export function KrawlModeClient({ krawlId, krawl }: KrawlModeClientProps) {
  const [showChecklist, setShowChecklist] = useState(true);
  const [isActive, setIsActive] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [completedGemIds, setCompletedGemIds] = useState<string[]>([]);
  const [nextGemId, setNextGemId] = useState<string | null>(null);
  const [progress, setProgress] = useState({
    completed: 0,
    total: krawl.gems.length,
  });
  const [showCompletion, setShowCompletion] = useState(false);
  const [sessionData, setSessionData] = useState<any>(null);
  const [isRecalculating, setIsRecalculating] = useState(false);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  // Services
  const geofencingServiceRef = useRef(getGeofencingService());
  const directionsServiceRef = useRef(getDirectionsService());

  // Store
  const {
    preFetchContent,
    showStopDetailCard,
    hideStopDetailCard,
    setCurrentGemId,
    clear: clearStore,
  } = useKrawlModeStore();

  // Get next gem coordinates
  const nextGem = nextGemId
    ? krawl.gems.find((g) => g.id === nextGemId)
    : null;
  const nextGemCoords: Coordinates | null = nextGem
    ? [nextGem.coordinates[0], nextGem.coordinates[1]]
    : null;

  // Location tracking
  const {
    location: currentLocation,
    accuracy,
    startTracking,
    stopTracking,
  } = useKrawlLocationTracking({
    enabled: isActive,
    sessionId: sessionId || undefined,
    onLocationUpdate: (loc) => {
      if (sessionId) {
        updateKrawlModeLocation(krawlId, {
          latitude: loc[1],
          longitude: loc[0],
          accuracy: accuracy || undefined,
        }).catch(console.error);
      }

      // Update geofencing service
      geofencingServiceRef.current.updateLocation(loc);
    },
  });

  // Directions
  const {
    directions,
    currentStepIndex,
    isLoading: isDirectionsLoading,
    error: directionsError,
    recalculate: recalculateDirections,
  } = useKrawlDirections({
    enabled: isActive && !!currentLocation && !!nextGemCoords,
    start: currentLocation,
    end: nextGemCoords,
    profile: "walking",
    onRouteUpdate: (route) => {
      // Route updated, clear recalculation state
      setIsRecalculating(false);
    },
  });

  // Handle off-route detection
  const handleOffRoute = useCallback(async () => {
    if (!currentLocation || !nextGemCoords || isRecalculating) {
      return;
    }

    setIsRecalculating(true);
    try {
      await recalculateDirections();
    } catch (error) {
      console.error("Failed to recalculate route:", error);
      setIsRecalculating(false);
    }
  }, [currentLocation, nextGemCoords, isRecalculating, recalculateDirections]);

  // Check off-route when location or directions change
  useEffect(() => {
    if (!isActive || !currentLocation || !directions || isRecalculating) {
      return;
    }

    const isOffRoute = directionsServiceRef.current.checkOffRoute(
      currentLocation,
      directions,
      50
    );
    if (isOffRoute) {
      handleOffRoute();
    }
  }, [currentLocation, directions, isActive, isRecalculating, handleOffRoute]);

  // Handle arrival detection
  const handleArrival = useCallback(
    async (gemId: string, distance: number) => {
      if (completedGemIds.includes(gemId)) {
        return; // Already completed
      }

      // Trigger haptic feedback
      triggerArrivalFeedback();

      // Show Stop Detail Card
      showStopDetailCard(gemId);
      setCurrentGemId(gemId);

      // Automatically complete gem after a short delay
      // User can also manually check off
      setTimeout(async () => {
        await handleCompleteGem(gemId, distance, "AUTOMATIC");
      }, 3000); // 3 second delay to allow user to see card
    },
    [completedGemIds, showStopDetailCard, setCurrentGemId]
  );

  // Setup geofencing for all remaining gems
  useEffect(() => {
    if (!isActive || !currentLocation) {
      return;
    }

    const geofencingService = geofencingServiceRef.current;
    geofencingService.clearAll();

    // Add geofences for all remaining gems
    krawl.gems.forEach((gem) => {
      if (!completedGemIds.includes(gem.id)) {
        geofencingService.addGeofence(
          gem.id,
          gem.coordinates,
          50, // 50 meter radius
          {
            onEntry: (id, distance) => {
              handleArrival(id, distance);
            },
          }
        );
      }
    });

    // Update location
    geofencingService.updateLocation(currentLocation);

    return () => {
      geofencingService.clearAll();
    };
  }, [isActive, currentLocation, completedGemIds, krawl.gems, handleArrival]);

  const handleStart = async () => {
    try {
      const session = await startKrawlModeSession(krawlId);
      setSessionId(session.sessionId);
      setIsActive(true);
      setShowChecklist(false);

      // Pre-fetch content for all gems
      await preFetchContent(
        krawl.gems.map((gem) => ({
          id: gem.id,
          creatorNote: gem.creatorNote,
          lokalSecret: gem.lokalSecret,
          name: gem.name,
          category: gem.category,
          thumbnailUrl: gem.thumbnailUrl,
        }))
      );

      startTracking();
    } catch (error) {
      console.error("Failed to start session:", error);
      alert("Failed to start Krawl Mode. Please try again.");
    }
  };

  const handleStop = async () => {
    try {
      await stopKrawlModeSession(krawlId);
      setIsActive(false);
      stopTracking();
      setShowChecklist(true);
      geofencingServiceRef.current.clearAll();
      clearStore();
    } catch (error) {
      console.error("Failed to stop session:", error);
    }
  };

  const handleCompleteGem = async (
    gemId: string,
    distanceToGem: number,
    method: "AUTOMATIC" | "MANUAL" = "AUTOMATIC"
  ) => {
    // Optimistic update
    const previousCompletedIds = [...completedGemIds];
    const previousNextId = nextGemId;
    const previousProgress = { ...progress };

    if (!previousCompletedIds.includes(gemId)) {
      setCompletedGemIds([...previousCompletedIds, gemId]);
      const newNextGem = krawl.gems.find(
        (g, index) =>
          !previousCompletedIds.includes(g.id) && g.id !== gemId
      );
      setNextGemId(newNextGem?.id || null);
      setProgress({
        completed: previousProgress.completed + 1,
        total: previousProgress.total,
      });
    }

    try {
      const result = await completeKrawlModeGem(krawlId, {
        gemId,
        distanceToGemMeters: distanceToGem,
        arrivalMethod: method,
      });

      // Update with server response
      setCompletedGemIds(result.completedGemIds);
      setNextGemId(result.nextGemId || null);
      setProgress({
        completed: result.completedGemsCount,
        total: result.totalGemsCount,
      });

      // Hide Stop Detail Card
      hideStopDetailCard();

      // Check if all gems completed
      if (result.completedGemsCount >= result.totalGemsCount) {
        const session = await getKrawlModeSession(krawlId);
        setSessionData(session);
        setShowCompletion(true);
        setIsActive(false);
        stopTracking();
        geofencingServiceRef.current.clearAll();
      }
    } catch (error) {
      // Rollback on error
      console.error("Failed to complete gem:", error);
      setCompletedGemIds(previousCompletedIds);
      setNextGemId(previousNextId);
      setProgress(previousProgress);
      alert("Failed to mark gem as completed. Please try again.");
    }
  };

  const handleManualCheckOff = async () => {
    if (!nextGemId) return;

    const distance =
      geofencingServiceRef.current.getDistance(nextGemId) || 0;
    await handleCompleteGem(nextGemId, distance, "MANUAL");
  };

  // Load existing session on mount
  useEffect(() => {
    const loadSession = async () => {
      try {
        const session = await getKrawlModeSession(krawlId);
        if (session.status === "ACTIVE") {
          setSessionId(session.sessionId);
          setIsActive(true);
          setShowChecklist(false);
          const progressData = await getKrawlModeProgress(krawlId);
          setCompletedGemIds(progressData.completedGemIds);
          setNextGemId(progressData.nextGemId || null);
          setProgress({
            completed: progressData.completedGemsCount,
            total: progressData.totalGemsCount,
          });

          // Pre-fetch content
          await preFetchContent(
            krawl.gems.map((gem) => ({
              id: gem.id,
              creatorNote: gem.creatorNote,
              lokalSecret: gem.lokalSecret,
              name: gem.name,
              category: gem.category,
              thumbnailUrl: gem.thumbnailUrl,
            }))
          );

          startTracking();
        }
      } catch (error) {
        // No active session, show checklist
        console.log("No active session found");
      }
    };

    loadSession();
  }, [krawlId, krawl.gems, preFetchContent]);

  // Update progress periodically
  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(async () => {
      try {
        const progressData = await getKrawlModeProgress(krawlId);
        setProgress({
          completed: progressData.completedGemsCount,
          total: progressData.totalGemsCount,
        });
      } catch (error) {
        console.error("Failed to update progress:", error);
      }
    }, 10000); // Every 10 seconds

    return () => clearInterval(interval);
  }, [isActive, krawlId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      geofencingServiceRef.current.clearAll();
      directionsServiceRef.current.clearCache();
      clearStore();
    };
  }, [clearStore]);

  return (
    <div className="fixed inset-0 flex flex-col">
      {showChecklist && (
        <PreStartChecklist
          krawlId={krawlId}
          onStart={handleStart}
          onCancel={() => window.history.back()}
        />
      )}

      {showCompletion && sessionData && (
        <CompletionScreen
          stats={calculateCompletionStats(sessionData)}
          krawlId={krawlId}
          krawlName={krawl.name}
          onClose={() => setShowCompletion(false)}
        />
      )}

      {/* Map */}
      <div className="flex-1 relative">
        <Map
          initialCenter={
            currentLocation ||
            krawl.gems[0]?.coordinates ||
            [123.8854, 10.3157]
          }
          initialZoom={15}
          className="w-full h-full"
          onLoad={(map) => {
            mapRef.current = map;
            if (currentLocation) {
              map.flyTo({
                center: currentLocation,
                zoom: 15,
              });
            }
          }}
        >
          {/* Krawl Trail */}
          <KrawlTrailLayer
            map={mapRef.current}
            krawl={{
              id: krawl.id,
              name: krawl.name,
              gems: krawl.gems,
            }}
            showTrails={true}
          />

          {/* Route Polyline */}
          {directions && mapRef.current && (
            <RoutePolyline map={mapRef.current} route={directions} />
          )}

          {/* Next Gem Indicator */}
          {nextGemCoords && mapRef.current && (
            <NextGemIndicator
              gemId={nextGemId!}
              coordinates={nextGemCoords}
              map={mapRef.current}
            />
          )}
        </Map>

        {/* Controls Overlay */}
        {isActive && (
          <>
            <div className="absolute top-4 left-4 right-4 flex items-start justify-between gap-4 z-10">
              <div className="bg-white rounded-lg shadow-lg p-4 flex-1 max-w-xs">
                <ProgressTracker
                  completedCount={progress.completed}
                  totalCount={progress.total}
                />
              </div>
              <Button
                variant="outline"
                onClick={handleStop}
                icon={<X className="w-5 h-5" />}
              >
                Stop
              </Button>
            </div>

            {/* Distance/Time Indicator */}
            {currentLocation && nextGemCoords && (
              <div className="absolute top-20 left-4 right-4 z-10">
                <DistanceTimeIndicator
                  currentLocation={currentLocation}
                  targetLocation={nextGemCoords}
                />
              </div>
            )}

            {/* Recalculating Indicator */}
            {isRecalculating && (
              <div className="absolute top-32 left-4 right-4 z-10 bg-blue-500 text-white rounded-lg shadow-lg p-3 text-center text-sm font-medium">
                Recalculating route...
              </div>
            )}

            {/* Directions Panel */}
            {directions && directions.steps.length > 0 && (
              <div className="absolute bottom-0 left-0 right-0 z-10">
                <DirectionsPanel
                  steps={directions.steps}
                  currentStepIndex={currentStepIndex}
                  isLoading={isDirectionsLoading}
                  error={directionsError}
                  onRecalculate={recalculateDirections}
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* Stop Detail Card */}
      {nextGemId && (
        <StopDetailCard
          gemId={nextGemId}
          onCheckOff={handleManualCheckOff}
          onSkip={() => hideStopDetailCard()}
        />
      )}
    </div>
  );
}
