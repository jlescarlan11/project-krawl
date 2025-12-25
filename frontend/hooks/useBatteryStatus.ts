/**
 * useBatteryStatus Hook
 *
 * Hook to check battery level using Battery Status API
 * Falls back gracefully if API is not available
 */

import { useState, useEffect } from "react";

export interface BatteryInfo {
  level: number; // 0-1
  charging: boolean;
  chargingTime: number; // seconds until fully charged
  dischargingTime: number; // seconds until fully discharged
}

export interface UseBatteryStatusResult {
  battery: BatteryInfo | null;
  isLoading: boolean;
  isSupported: boolean;
  isLow: boolean; // < 20%
}

/**
 * Check battery status using Battery Status API
 *
 * @returns Battery information, loading state, support status, and low battery flag
 */
export function useBatteryStatus(): UseBatteryStatusResult {
  const [battery, setBattery] = useState<BatteryInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Check if Battery Status API is available
    const checkBattery = async () => {
      try {
        // @ts-ignore - Battery API may not be in TypeScript types
        if (navigator.getBattery) {
          setIsSupported(true);
          // @ts-ignore
          const batteryManager = await navigator.getBattery();

          const updateBattery = () => {
            setBattery({
              level: batteryManager.level,
              charging: batteryManager.charging,
              chargingTime: batteryManager.chargingTime,
              dischargingTime: batteryManager.dischargingTime,
            });
            setIsLoading(false);
          };

          // Initial update
          updateBattery();

          // Listen for changes
          batteryManager.addEventListener("chargingchange", updateBattery);
          batteryManager.addEventListener("levelchange", updateBattery);
          batteryManager.addEventListener("chargingtimechange", updateBattery);
          batteryManager.addEventListener("dischargingtimechange", updateBattery);

          return () => {
            batteryManager.removeEventListener("chargingchange", updateBattery);
            batteryManager.removeEventListener("levelchange", updateBattery);
            batteryManager.removeEventListener("chargingtimechange", updateBattery);
            batteryManager.removeEventListener("dischargingtimechange", updateBattery);
          };
        } else {
          setIsSupported(false);
          setIsLoading(false);
        }
      } catch (err) {
        console.warn("Battery Status API not available:", err);
        setIsSupported(false);
        setIsLoading(false);
      }
    };

    const cleanup = checkBattery();
    return () => {
      cleanup.then((cleanupFn) => cleanupFn?.());
    };
  }, []);

  const isLow = battery !== null && battery.level < 0.2 && !battery.charging;

  return {
    battery,
    isLoading,
    isSupported,
    isLow,
  };
}




