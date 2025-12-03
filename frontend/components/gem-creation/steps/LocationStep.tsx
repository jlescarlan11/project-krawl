"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { ArrowLeft, MapPin, Info, CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ProgressDots } from "@/components/onboarding/ProgressDots";
import { GemLocationPicker, type GemLocationPickerRef } from "../GemLocationPicker";
import { AddressSearch, reverseGeocode } from "../AddressSearch";
import { useGemCreationStore } from "@/stores/gem-creation-store";
import { validateCoordinates, type BoundaryValidationResult } from "@/lib/map/boundaryValidation";
import { CEBU_CITY_CENTER } from "@/lib/map/constants";
import type { GeocodingFeature } from "../types";

/**
 * Props for LocationStep component
 */
export interface LocationStepProps {
  onNext: () => void;
  onBack: () => void;
}

/**
 * LocationStep Component
 *
 * Step 1 of gem creation flow: Location selection
 * Features:
 * - Interactive map with fixed center pin
 * - Address search with autocomplete
 * - Current location button
 * - Cebu City boundary validation
 * - Real-time coordinate display
 */
export function LocationStep({ onNext, onBack }: LocationStepProps) {
  const { location, setLocation } = useGemCreationStore();
  const mapPickerRef = useRef<GemLocationPickerRef>(null);

  const [validationResult, setValidationResult] =
    useState<BoundaryValidationResult | null>(null);
  const [currentCoordinates, setCurrentCoordinates] = useState<
    [number, number]
  >(location?.coordinates || CEBU_CITY_CENTER);
  const [currentAddress, setCurrentAddress] = useState<string | null>(
    location?.address || null
  );
  const [locationError, setLocationError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);

  // Mark as touched when user interacts with map or search
  useEffect(() => {
    if (currentCoordinates && currentAddress) {
      setTouched(true);
    }
  }, [currentCoordinates, currentAddress]);

  /**
   * Handle location change from map
   */
  const handleLocationChange = useCallback(
    async (coords: [number, number]) => {
      setCurrentCoordinates(coords);

      // Perform reverse geocoding to get address
      try {
        const feature = await reverseGeocode(coords);
        if (feature) {
          setCurrentAddress(feature.place_name);
        }
      } catch (error) {
        console.error("Reverse geocoding failed:", error);
      }
    },
    []
  );

  /**
   * Handle validation change from map
   */
  const handleValidationChange = useCallback(
    (result: BoundaryValidationResult) => {
      setValidationResult(result);

      // Update store if valid
      if (result.isValid && currentAddress) {
        setLocation({
          coordinates: currentCoordinates,
          address: currentAddress,
          isValid: true,
        });
      }
    },
    [currentCoordinates, currentAddress, setLocation]
  );

  /**
   * Handle address search selection
   */
  const handleAddressSelect = useCallback(
    async (feature: GeocodingFeature) => {
      const coords: [number, number] = feature.center;

      // Validate coordinates first
      const validation = await validateCoordinates(coords);

      if (validation.isValid) {
        setCurrentCoordinates(coords);
        setCurrentAddress(feature.place_name);
        setValidationResult(validation);

        // Update store
        setLocation({
          coordinates: coords,
          address: feature.place_name,
          isValid: true,
        });

        // Move marker to selected location with animation
        mapPickerRef.current?.flyTo(coords, 16);
      } else {
        // Show error for invalid location
        setValidationResult(validation);
        setLocationError(
          validation.message || "This location is outside Cebu City"
        );

        // Clear error after 5 seconds
        setTimeout(() => setLocationError(null), 5000);
      }
    },
    [setLocation]
  );


  /**
   * Handle continue button
   */
  const handleContinue = useCallback(() => {
    if (validationResult?.isValid && currentAddress) {
      setLocation({
        coordinates: currentCoordinates,
        address: currentAddress,
        isValid: true,
      });
      onNext();
    }
  }, [
    validationResult,
    currentAddress,
    currentCoordinates,
    setLocation,
    onNext,
  ]);

  const canProceed = validationResult?.isValid && currentAddress;

  return (
    <div className="flex flex-col h-dvh bg-bg-white">
      {/* Header */}
      <header className="shrink-0 border-b border-border-subtle bg-bg-white">
        <div className="p-4">
          <div className="flex items-center gap-3 relative">
            <button
              onClick={onBack}
              className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-bg-light transition-colors shrink-0"
              aria-label="Go back"
              type="button"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex-1 flex flex-col items-center justify-center gap-3">
              <h1 className="text-xl font-bold text-text-primary">
                Create Gem
              </h1>
              <ProgressDots total={5} currentIndex={0} />
            </div>
            <p className="text-sm text-text-secondary shrink-0">Step 1 of 5</p>
          </div>
        </div>
      </header>

      {/* Search Bar */}
      <div className="shrink-0 p-4 border-b border-border-subtle bg-bg-white">
        <AddressSearch onSelect={handleAddressSelect} />

        {/* Info Banner - Boundary Guidance */}
        <div className="mt-3 flex items-start gap-2 p-3 bg-primary-green/5 border border-primary-green/20 rounded-lg">
          <Info className="w-4 h-4 text-primary-green shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-xs text-text-secondary leading-relaxed">
              Select a location within the <span className="font-medium text-primary-green">highlighted green area</span> on the map.
              This ensures your Gem is located within Cebu City boundaries.
            </p>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative">
        <GemLocationPicker
          ref={mapPickerRef}
          initialCoordinates={currentCoordinates}
          onLocationChange={handleLocationChange}
          onValidationChange={handleValidationChange}
        />

        {/* Error Toast */}
        {locationError && (
          <div
            className={cn(
              "absolute top-4 left-4 right-4",
              "bg-red-50 border border-red-200 rounded-lg",
              "p-4 shadow-lg",
              "animate-in fade-in slide-in-from-top-2"
            )}
            role="alert"
          >
            <p className="text-sm text-red-600">{locationError}</p>
          </div>
        )}
      </div>

      {/* Selected Location Display */}
      {currentAddress && validationResult?.isValid && (
        <div className="flex-shrink-0 p-4 border-t border-border-subtle bg-success/5 border-success/20">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-text-primary truncate flex items-center gap-2">
                <span>Location Selected</span>
                <span className="text-xs text-success font-normal">✓ Valid</span>
              </p>
              <p className="text-sm text-text-secondary truncate mt-1">
                {currentAddress}
              </p>
              <p className="text-xs text-text-secondary font-mono mt-1">
                {currentCoordinates[1].toFixed(6)},{" "}
                {currentCoordinates[0].toFixed(6)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Validation Error Display */}
      {validationResult && !validationResult.isValid && touched && (
        <div className="flex-shrink-0 p-4 border-t border-border-subtle bg-error/5 border-error/20">
          <div className="flex items-start gap-3">
            <XCircle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-error flex items-center gap-2">
                <span>Invalid Location</span>
              </p>
              <p className="text-sm text-error mt-1">
                {validationResult.message ||
                  "This location is outside Cebu City boundaries"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Footer - Continue Button */}
      <div className="flex-shrink-0 p-4 border-t border-border-subtle bg-bg-white">
        <Button
          variant="primary"
          size="lg"
          onClick={handleContinue}
          disabled={!canProceed}
          className="w-full"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
