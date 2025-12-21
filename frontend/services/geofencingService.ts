/**
 * Geofencing Service
 *
 * Reusable service for managing multiple geofences with arrival detection.
 * Supports multiple geofences, event-based callbacks, and efficient distance calculations.
 */

import { calculateDistance } from "@/lib/krawl-mode/locationFilter";
import type { Coordinates } from "@/components/map/gem-types";

export interface GeofenceCallbacks {
  onEntry?: (geofenceId: string, distance: number) => void;
  onExit?: (geofenceId: string) => void;
}

interface Geofence {
  id: string;
  location: Coordinates; // [longitude, latitude]
  radius: number; // meters
  callbacks: GeofenceCallbacks;
  isInside: boolean;
  hasTriggered: boolean; // Prevent duplicate triggers
  debounceTimer: NodeJS.Timeout | null;
  lastEntryTime: number | null;
}

/**
 * Geofencing Service
 *
 * Manages multiple geofences and detects entry/exit events.
 */
export class GeofencingService {
  private geofences: Map<string, Geofence> = new Map();
  private currentLocation: Coordinates | null = null;
  private debounceMs: number;
  private checkInterval: NodeJS.Timeout | null = null;
  private isMonitoring: boolean = false;

  constructor(debounceMs: number = 2000) {
    this.debounceMs = debounceMs;
  }

  /**
   * Add a geofence to monitor
   *
   * @param id - Unique identifier for the geofence
   * @param location - Target location [longitude, latitude]
   * @param radius - Radius in meters
   * @param callbacks - Callbacks for entry/exit events
   */
  addGeofence(
    id: string,
    location: Coordinates,
    radius: number,
    callbacks: GeofenceCallbacks
  ): void {
    // Remove existing geofence if present
    this.removeGeofence(id);

    const geofence: Geofence = {
      id,
      location,
      radius,
      callbacks,
      isInside: false,
      hasTriggered: false,
      debounceTimer: null,
      lastEntryTime: null,
    };

    this.geofences.set(id, geofence);

    // If we have a current location, check immediately
    if (this.currentLocation) {
      this.checkGeofence(geofence);
    }

    // Start monitoring if not already started
    if (!this.isMonitoring) {
      this.startMonitoring();
    }
  }

  /**
   * Remove a geofence
   *
   * @param id - Geofence identifier
   */
  removeGeofence(id: string): void {
    const geofence = this.geofences.get(id);
    if (geofence) {
      // Clear any pending timers
      if (geofence.debounceTimer) {
        clearTimeout(geofence.debounceTimer);
      }
      this.geofences.delete(id);
    }

    // Stop monitoring if no geofences remain
    if (this.geofences.size === 0) {
      this.stopMonitoring();
    }
  }

  /**
   * Update current location and check all geofences
   *
   * @param location - Current location [longitude, latitude]
   */
  updateLocation(location: Coordinates): void {
    this.currentLocation = location;

    if (!this.isMonitoring) {
      // Check all geofences immediately
      this.geofences.forEach((geofence) => {
        this.checkGeofence(geofence);
      });
    }
  }

  /**
   * Check a single geofence for entry/exit
   */
  private checkGeofence(geofence: Geofence): void {
    if (!this.currentLocation) {
      return;
    }

    const distance = calculateDistance(
      this.currentLocation[1], // latitude
      this.currentLocation[0], // longitude
      geofence.location[1], // latitude
      geofence.location[0] // longitude
    );

    const isInside = distance <= geofence.radius;

    // Entry detection
    if (isInside && !geofence.isInside && !geofence.hasTriggered) {
      geofence.isInside = true;
      geofence.lastEntryTime = Date.now();

      // Clear existing timer
      if (geofence.debounceTimer) {
        clearTimeout(geofence.debounceTimer);
      }

      // Debounce entry callback
      geofence.debounceTimer = setTimeout(() => {
        if (geofence.isInside && !geofence.hasTriggered) {
          geofence.hasTriggered = true;
          geofence.callbacks.onEntry?.(geofence.id, distance);
        }
        geofence.debounceTimer = null;
      }, this.debounceMs);
    }

    // Exit detection
    if (!isInside && geofence.isInside) {
      geofence.isInside = false;

      // Clear entry timer if pending
      if (geofence.debounceTimer) {
        clearTimeout(geofence.debounceTimer);
        geofence.debounceTimer = null;
      }

      // Reset trigger flag if user moved away (allows re-entry)
      // Only reset if enough time has passed (e.g., 30 seconds)
      if (
        geofence.lastEntryTime &&
        Date.now() - geofence.lastEntryTime > 30000
      ) {
        geofence.hasTriggered = false;
      }

      geofence.callbacks.onExit?.(geofence.id);
    }
  }

  /**
   * Start continuous monitoring
   */
  private startMonitoring(): void {
    if (this.isMonitoring) {
      return;
    }

    this.isMonitoring = true;

    // Check geofences periodically (every 2 seconds)
    this.checkInterval = setInterval(() => {
      this.geofences.forEach((geofence) => {
        this.checkGeofence(geofence);
      });
    }, 2000);
  }

  /**
   * Stop continuous monitoring
   */
  private stopMonitoring(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
    this.isMonitoring = false;
  }

  /**
   * Get distance to a geofence
   *
   * @param id - Geofence identifier
   * @returns Distance in meters, or null if geofence not found or no location
   */
  getDistance(id: string): number | null {
    const geofence = this.geofences.get(id);
    if (!geofence || !this.currentLocation) {
      return null;
    }

    return calculateDistance(
      this.currentLocation[1], // latitude
      this.currentLocation[0], // longitude
      geofence.location[1], // latitude
      geofence.location[0] // longitude
    );
  }

  /**
   * Check if location is within a geofence
   *
   * @param id - Geofence identifier
   * @returns True if inside, false otherwise
   */
  isWithinRadius(id: string): boolean {
    const geofence = this.geofences.get(id);
    if (!geofence || !this.currentLocation) {
      return false;
    }

    const distance = this.getDistance(id);
    return distance !== null && distance <= geofence.radius;
  }

  /**
   * Reset trigger state for a geofence (allows re-triggering)
   *
   * @param id - Geofence identifier
   */
  resetTrigger(id: string): void {
    const geofence = this.geofences.get(id);
    if (geofence) {
      geofence.hasTriggered = false;
    }
  }

  /**
   * Clear all geofences
   */
  clearAll(): void {
    // Clear all timers
    this.geofences.forEach((geofence) => {
      if (geofence.debounceTimer) {
        clearTimeout(geofence.debounceTimer);
      }
    });

    this.geofences.clear();
    this.stopMonitoring();
    this.currentLocation = null;
  }

  /**
   * Get all active geofence IDs
   */
  getActiveGeofenceIds(): string[] {
    return Array.from(this.geofences.keys());
  }

  /**
   * Cleanup - call this when service is no longer needed
   */
  destroy(): void {
    this.clearAll();
  }
}

// Singleton instance (optional - can also create new instances)
let geofencingServiceInstance: GeofencingService | null = null;

/**
 * Get or create singleton geofencing service instance
 */
export function getGeofencingService(): GeofencingService {
  if (!geofencingServiceInstance) {
    geofencingServiceInstance = new GeofencingService();
  }
  return geofencingServiceInstance;
}

