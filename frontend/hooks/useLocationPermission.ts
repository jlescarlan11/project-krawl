/**
 * useLocationPermission Hook
 *
 * Hook to check and request geolocation permission
 */

import { useState, useEffect, useCallback } from "react";

export type PermissionStatus = "granted" | "denied" | "prompt" | "unknown";

export interface UseLocationPermissionResult {
  status: PermissionStatus;
  isLoading: boolean;
  requestPermission: () => Promise<void>;
  error: Error | null;
}

/**
 * Check and manage geolocation permission status
 *
 * @returns Permission status, loading state, request function, and error
 */
export function useLocationPermission(): UseLocationPermissionResult {
  const [status, setStatus] = useState<PermissionStatus>("unknown");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const checkPermission = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (!navigator.permissions) {
        // Fallback for browsers that don't support Permissions API
        // Check if geolocation is available
        if (!navigator.geolocation) {
          setStatus("denied");
          setIsLoading(false);
          return;
        }

        // Try to get current position to check permission
        navigator.geolocation.getCurrentPosition(
          () => setStatus("granted"),
          (err) => {
            if (err.code === err.PERMISSION_DENIED) {
              setStatus("denied");
            } else {
              setStatus("prompt");
            }
          },
          { timeout: 1000 }
        );
        setIsLoading(false);
        return;
      }

      const result = await navigator.permissions.query({
        name: "geolocation" as PermissionName,
      });

      const permissionStatus = result.state as PermissionStatus;
      setStatus(permissionStatus);

      // Listen for permission changes
      result.onchange = () => {
        setStatus(result.state as PermissionStatus);
      };

      setIsLoading(false);
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Unknown error");
      setError(error);
      setStatus("unknown");
      setIsLoading(false);
    }
  }, []);

  const requestPermission = useCallback(async () => {
    if (!navigator.geolocation) {
      setError(new Error("Geolocation is not supported by this browser"));
      return;
    }

    try {
      await new Promise<void>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          () => {
            setStatus("granted");
            resolve();
          },
          (err) => {
            if (err.code === err.PERMISSION_DENIED) {
              setStatus("denied");
              reject(new Error("Location permission denied"));
            } else {
              reject(err);
            }
          },
          { timeout: 10000, enableHighAccuracy: false }
        );
      });
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to request permission");
      setError(error);
      throw error;
    }
  }, []);

  useEffect(() => {
    checkPermission();
  }, [checkPermission]);

  return {
    status,
    isLoading,
    requestPermission,
    error,
  };
}







