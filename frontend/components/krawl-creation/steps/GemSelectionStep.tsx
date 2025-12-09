"use client";

import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { Search, Plus, X, Edit2, MapPin, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useKrawlCreationStore } from "@/stores/krawl-creation-store";
import { StepHeader } from "@/components/shared/creation";
import { MapGem } from "@/components/map/gem-types";
import { ContextInjectionForm } from "../ContextInjectionForm";
import { cn } from "@/lib/utils";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { SelectedGem } from "@/stores/krawl-creation-store";

interface GemSelectionStepProps {
  onNext: () => void;
  onBackToPreviousPage: () => void;
  onBackToPreviousStep: () => void;
}

const MIN_GEMS = 2;
const MAX_GEMS = 20;

interface SortableGemCardProps {
  selectedGem: SelectedGem;
  index: number;
  onEdit: (gemId: string) => void;
  onRemove: (gemId: string) => void;
}

function SortableGemCard({
  selectedGem,
  index,
  onEdit,
  onRemove,
}: SortableGemCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: selectedGem.gemId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "p-3 bg-bg-light rounded-lg flex items-start gap-3",
        isDragging && "shadow-lg border-2 border-primary z-50"
      )}
    >
      {/* Drag Handle */}
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-1 hover:bg-bg-white rounded transition-colors shrink-0 mt-1"
        aria-label="Drag to reorder"
        type="button"
      >
        <GripVertical className="w-5 h-5 text-text-tertiary" />
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium text-text-secondary shrink-0">
            #{index + 1}
          </span>
          <h3 className="font-semibold text-text-primary truncate">
            {selectedGem.gem.name}
          </h3>
        </div>
        <p className="text-sm text-text-secondary line-clamp-2">
          {selectedGem.creatorNote}
        </p>
      </div>
      <div className="flex gap-2 shrink-0">
        <button
          onClick={() => onEdit(selectedGem.gemId)}
          className="p-2 hover:bg-bg-white rounded-lg transition-colors"
          aria-label="Edit context"
          type="button"
        >
          <Edit2 className="w-4 h-4" />
        </button>
        <button
          onClick={() => onRemove(selectedGem.gemId)}
          className="p-2 hover:bg-bg-white rounded-lg transition-colors text-error"
          aria-label="Remove gem"
          type="button"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export function GemSelectionStep({
  onNext,
  onBackToPreviousPage,
  onBackToPreviousStep,
}: GemSelectionStepProps) {
  const { selectedGems, addGem, removeGem, updateGemContext, reorderGems } =
    useKrawlCreationStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<MapGem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [nearbyGems, setNearbyGems] = useState<MapGem[]>([]);
  const [isLoadingNearby, setIsLoadingNearby] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [showContextForm, setShowContextForm] = useState(false);
  const [selectedGemForContext, setSelectedGemForContext] =
    useState<MapGem | null>(null);
  const [editingGemId, setEditingGemId] = useState<string | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require 8px movement before drag starts
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Sort gems by order property
  const sortedGems = useMemo(() => {
    return [...selectedGems].sort((a, b) => a.order - b.order);
  }, [selectedGems]);

  // Filter out already selected gems from nearby gems
  const availableNearbyGems = useMemo(() => {
    const selectedGemIds = new Set(selectedGems.map((g) => g.gemId));
    return nearbyGems.filter((gem) => !selectedGemIds.has(gem.id)).slice(0, 5);
  }, [nearbyGems, selectedGems]);

  // Handle drag end event for reordering
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (over && active.id !== over.id) {
        const oldIndex = sortedGems.findIndex((g) => g.gemId === active.id);
        const newIndex = sortedGems.findIndex((g) => g.gemId === over.id);

        if (oldIndex !== -1 && newIndex !== -1) {
          const reordered = arrayMove(sortedGems, oldIndex, newIndex);
          const gemIds = reordered.map((g) => g.gemId);
          reorderGems(gemIds);
        }
      }
    },
    [sortedGems, reorderGems]
  );

  /**
   * Calculate bounding box from center coordinates and radius in kilometers
   */
  const calculateBoundingBox = useCallback(
    (latitude: number, longitude: number, radiusKm: number = 10) => {
      // Approximate conversion: 1 degree latitude ≈ 111 km
      // Longitude varies by latitude, but for Cebu (around 10°N), 1 degree ≈ 109 km
      const latDelta = radiusKm / 111;
      const lngDelta = radiusKm / 109;

      return {
        north: latitude + latDelta,
        south: latitude - latDelta,
        east: longitude + lngDelta,
        west: longitude - lngDelta,
      };
    },
    []
  );

  /**
   * Fetch gems near user's location
   */
  const fetchNearbyGems = useCallback(
    async (latitude: number, longitude: number) => {
      setIsLoadingNearby(true);
      setLocationError(null);
      try {
        const bounds = calculateBoundingBox(latitude, longitude, 10); // 10km radius
        // Fetch more gems to account for already selected ones and ensure fresh suggestions
        const params = new URLSearchParams({
          north: bounds.north.toString(),
          south: bounds.south.toString(),
          east: bounds.east.toString(),
          west: bounds.west.toString(),
          zoom: "12",
          limit: "30", // Fetch more to ensure we always have fresh suggestions
        });

        const response = await fetch(`/api/gems?${params.toString()}`);
        if (!response.ok) {
          throw new Error("Failed to fetch nearby gems");
        }

        const data = await response.json();
        setNearbyGems(data.gems || []);
      } catch (error) {
        console.error("Error fetching nearby gems:", error);
        setLocationError("Unable to load nearby gems");
        setNearbyGems([]);
      } finally {
        setIsLoadingNearby(false);
      }
    },
    [calculateBoundingBox]
  );

  /**
   * Get user's location and fetch nearby gems on mount
   */
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError("Location services not available");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ latitude, longitude });
        fetchNearbyGems(latitude, longitude);
      },
      (error) => {
        console.warn("Location access denied or unavailable:", error);
        setLocationError("Location access denied");
        // Don't show error to user, just don't show nearby gems
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000, // Cache for 5 minutes
      }
    );
  }, [fetchNearbyGems]);

  // Track previous selected gems count to detect when a new gem is added
  const prevSelectedCountRef = useRef(0);

  /**
   * Re-fetch nearby gems when a gem is selected to get fresh suggestions
   */
  useEffect(() => {
    if (userLocation && selectedGems.length > prevSelectedCountRef.current) {
      // A new gem was added, re-fetch to get fresh suggestions
      prevSelectedCountRef.current = selectedGems.length;
      fetchNearbyGems(userLocation.latitude, userLocation.longitude);
    } else if (selectedGems.length < prevSelectedCountRef.current) {
      // A gem was removed, update the ref
      prevSelectedCountRef.current = selectedGems.length;
    }
  }, [selectedGems.length, userLocation, fetchNearbyGems]);

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        performSearch(searchQuery);
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const performSearch = async (query: string) => {
    setIsSearching(true);
    try {
      const response = await fetch(
        `/api/gems/search?q=${encodeURIComponent(query)}&limit=20`
      );
      const data = await response.json();
      setSearchResults(data.gems || []);
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddClick = (gem: MapGem) => {
    // Check if already added
    if (selectedGems.some((g) => g.gemId === gem.id)) {
      return;
    }

    // Check max limit
    if (selectedGems.length >= MAX_GEMS) {
      alert(`Maximum ${MAX_GEMS} gems allowed`);
      return;
    }

    setSelectedGemForContext(gem);
    setEditingGemId(null);
    setShowContextForm(true);
  };

  const handleContextAdd = (creatorNote: string, lokalSecret: string) => {
    if (selectedGemForContext) {
      addGem(selectedGemForContext, creatorNote, lokalSecret);
      setShowContextForm(false);
      setSelectedGemForContext(null);
      setEditingGemId(null);
    }
  };

  const handleEditContext = (gemId: string) => {
    const gem = selectedGems.find((g) => g.gemId === gemId);
    if (gem) {
      setSelectedGemForContext(gem.gem);
      setEditingGemId(gemId);
      setShowContextForm(true);
    }
  };

  const handleContextUpdate = (creatorNote: string, lokalSecret: string) => {
    if (editingGemId) {
      updateGemContext(editingGemId, creatorNote, lokalSecret);
      setShowContextForm(false);
      setEditingGemId(null);
      setSelectedGemForContext(null);
    }
  };

  const handleContextCancel = () => {
    setShowContextForm(false);
    setSelectedGemForContext(null);
    setEditingGemId(null);
  };

  const isGemAdded = (gemId: string) => {
    return selectedGems.some((g) => g.gemId === gemId);
  };

  const canProceed = useMemo(() => {
    return (
      selectedGems.length >= MIN_GEMS &&
      selectedGems.every(
        (gem) =>
          gem.creatorNote.trim().length >= 10 &&
          gem.creatorNote.trim().length <= 500 &&
          gem.lokalSecret.trim().length >= 10 &&
          gem.lokalSecret.trim().length <= 500
      )
    );
  }, [selectedGems]);

  const handleContinue = () => {
    if (canProceed) {
      onNext();
    }
  };

  return (
    <div className="flex flex-col h-dvh bg-bg-white">
      <StepHeader
        title="Create Krawl"
        totalSteps={3}
        currentStep={1}
        onBack={onBackToPreviousPage}
      />

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-6">
          {/* Selected Gems Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-text-primary">
                Selected Gems ({selectedGems.length}/{MIN_GEMS} minimum)
              </h2>
            </div>
            {selectedGems.length === 0 ? (
              <div className="p-6 bg-bg-light rounded-lg text-center">
                <p className="text-text-secondary">No gems selected yet</p>
                <p className="text-sm text-text-tertiary mt-1">
                  Search and add at least {MIN_GEMS} gems to continue
                </p>
              </div>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={sortedGems.map((g) => g.gemId)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-2">
                    {sortedGems.map((selectedGem, index) => (
                      <SortableGemCard
                        key={selectedGem.gemId}
                        selectedGem={selectedGem}
                        index={index}
                        onEdit={handleEditContext}
                        onRemove={removeGem}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}
          </div>

          {/* Search Section */}
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-text-primary">
              Available Gems
            </h2>
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for gems..."
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>

          {/* Show search results when searching */}
          {searchQuery.trim() ? (
            <>
              {isSearching ? (
                <div className="text-center py-8">
                  <p className="text-text-secondary">Searching...</p>
                </div>
              ) : searchResults.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-text-secondary">No gems found</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {searchResults.map((gem) => {
                    const added = isGemAdded(gem.id);
                    return (
                      <div
                        key={gem.id}
                        className="p-3 bg-bg-light rounded-lg flex items-start gap-3"
                      >
                        {gem.thumbnailUrl ? (
                          <img
                            src={gem.thumbnailUrl}
                            alt={gem.name}
                            className="w-16 h-16 rounded-lg object-cover shrink-0"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-lg bg-bg-white flex items-center justify-center shrink-0">
                            <span className="text-2xl">📍</span>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-text-primary truncate">
                            {gem.name}
                          </h3>
                          <p className="text-sm text-text-secondary line-clamp-2">
                            {gem.shortDescription || gem.category}
                          </p>
                          {gem.coordinates && (
                            <div className="flex items-center gap-1 mt-1 text-xs text-text-tertiary">
                              <MapPin className="w-3 h-3" />
                              <span>Location available</span>
                            </div>
                          )}
                        </div>
                        <div className="shrink-0">
                          {added ? (
                            <div className="px-3 py-1 bg-success/10 text-success rounded-lg text-sm font-medium">
                              Added
                            </div>
                          ) : (
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => handleAddClick(gem)}
                              disabled={selectedGems.length >= MAX_GEMS}
                              icon={<Plus className="w-4 h-4" />}
                              iconPosition="left"
                            >
                              Add
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          ) : (
            /* Show nearby gems when not searching */
            <>
              {isLoadingNearby ? (
                <div className="text-center py-8">
                  <p className="text-text-secondary">Loading gems near you...</p>
                </div>
              ) : availableNearbyGems.length > 0 ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-text-secondary" />
                    <h3 className="text-sm font-medium text-text-secondary">
                      Gems Near You
                    </h3>
                  </div>
                  {availableNearbyGems.map((gem) => {
                    return (
                      <div
                        key={gem.id}
                        className="p-3 bg-bg-light rounded-lg flex items-start gap-3"
                      >
                        {gem.thumbnailUrl ? (
                          <img
                            src={gem.thumbnailUrl}
                            alt={gem.name}
                            className="w-16 h-16 rounded-lg object-cover shrink-0"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-lg bg-bg-white flex items-center justify-center shrink-0">
                            <span className="text-2xl">📍</span>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-text-primary truncate">
                            {gem.name}
                          </h3>
                          <p className="text-sm text-text-secondary line-clamp-2">
                            {gem.shortDescription || gem.category}
                          </p>
                          {gem.coordinates && (
                            <div className="flex items-center gap-1 mt-1 text-xs text-text-tertiary">
                              <MapPin className="w-3 h-3" />
                              <span>Location available</span>
                            </div>
                          )}
                        </div>
                        <div className="shrink-0">
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleAddClick(gem)}
                            disabled={selectedGems.length >= MAX_GEMS}
                            icon={<Plus className="w-4 h-4" />}
                            iconPosition="left"
                          >
                            Add
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : locationError ? (
                <div className="text-center py-8">
                  <p className="text-sm text-text-tertiary">
                    Start typing to search for gems
                  </p>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm text-text-tertiary">
                    No gems found nearby. Start typing to search for gems.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Footer - Back and Continue Buttons */}
      <div className="shrink-0 p-4 border-t border-border-subtle bg-bg-white">
        <div className="flex flex-row gap-3 items-center">
          <div className="relative min-w-0 flex-1 flex sm:flex-initial sm:min-w-[120px]">

            <Button
              variant="outline"
              size="lg"
              onClick={onBackToPreviousStep}
              className="flex-1 sm:flex-initial sm:min-w-[120px] min-w-0"
            >
              Back
            </Button>
            </div>
          <div 
            className="relative flex-1 sm:flex-1 min-w-0 flex"
            onMouseEnter={() => !canProceed && setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <Button
              variant="primary"
              size="lg"
              onClick={handleContinue}
              disabled={!canProceed}
              className="w-full"
            >
              Continue
            </Button>
            {showTooltip && !canProceed && selectedGems.length < MIN_GEMS && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-bg-white rounded-lg shadow-elevation-3 border border-border-subtle text-sm text-error whitespace-nowrap z-10">
                Please add at least {MIN_GEMS} gems to continue
                {/* Arrow pointing down */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
                  <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-bg-white" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Context Injection Form Modal */}
      {showContextForm && selectedGemForContext && (
        <ContextInjectionForm
          gem={selectedGemForContext}
          initialCreatorNote={
            editingGemId
              ? selectedGems.find((g) => g.gemId === editingGemId)
                  ?.creatorNote || ""
              : ""
          }
          initialLokalSecret={
            editingGemId
              ? selectedGems.find((g) => g.gemId === editingGemId)
                  ?.lokalSecret || ""
              : ""
          }
          onAdd={
            editingGemId ? handleContextUpdate : handleContextAdd
          }
          onCancel={handleContextCancel}
        />
      )}
    </div>
  );
}

