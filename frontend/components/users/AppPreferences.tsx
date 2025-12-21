"use client";

import { useState, useEffect } from "react";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  updateAppPreferences,
  type AppPreferencesRequest,
  type UserProfile,
} from "@/lib/api/users";

export interface AppPreferencesProps {
  /** Current user profile */
  profile: UserProfile;

  /** Callback when preferences are updated */
  onSuccess?: () => void;

  /** Callback when update fails */
  onError?: (error: string) => void;

  /** Optional className for styling */
  className?: string;
}

/**
 * AppPreferences Component
 *
 * Allows users to manage app preferences (map style, language, units).
 */
export function AppPreferences({
  profile,
  onSuccess,
  onError,
  className,
}: AppPreferencesProps) {
  const [mapStyle, setMapStyle] = useState<"standard" | "satellite" | "dark">(
    "standard"
  );
  const [language, setLanguage] = useState<"en" | "ceb">("en");
  const [units, setUnits] = useState<"metric" | "imperial">("metric");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Load preferences from localStorage first (for immediate application)
    if (typeof window !== "undefined") {
      const storedMapStyle = localStorage.getItem("krawl:mapStyle");
      const storedUnits = localStorage.getItem("krawl:units");
      if (storedMapStyle) setMapStyle(storedMapStyle as any);
      if (storedUnits) setUnits(storedUnits as any);
    }
    // Note: appPreferences would be stored in user's appPreferences field
    // For now, we'll use localStorage. In production, sync with backend
  }, [profile]);

  const handleSave = async () => {
    try {
      setSaving(true);

      const request: AppPreferencesRequest = {
        mapStyle,
        language,
        units,
      };

      await updateAppPreferences(profile.id, request);

      // Apply preferences immediately
      if (typeof window !== "undefined") {
        localStorage.setItem("krawl:mapStyle", mapStyle);
        localStorage.setItem("krawl:units", units);
      }

      onSuccess?.();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update preferences";
      onError?.(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-text-primary">
            Map Preferences
          </h2>
          <p className="text-sm text-text-secondary">
            Customize your map viewing experience.
          </p>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            <Select
              label="Map Style"
              options={[
                { value: "standard", label: "Standard" },
                { value: "satellite", label: "Satellite" },
                { value: "dark", label: "Dark" },
              ]}
              value={mapStyle}
              onChange={(e) =>
                setMapStyle(e.target.value as "standard" | "satellite" | "dark")
              }
            />
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-text-primary">
            Language & Units
          </h2>
          <p className="text-sm text-text-secondary">
            Choose your preferred language and measurement units.
          </p>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            <Select
              label="Language"
              options={[
                { value: "en", label: "English" },
                { value: "ceb", label: "Cebuano (Coming Soon)", disabled: true },
              ]}
              value={language}
              onChange={(e) => setLanguage(e.target.value as "en" | "ceb")}
            />
            <Select
              label="Units"
              options={[
                { value: "metric", label: "Metric (km, m)" },
                { value: "imperial", label: "Imperial (mi, ft)" },
              ]}
              value={units}
              onChange={(e) =>
                setUnits(e.target.value as "metric" | "imperial")
              }
            />
          </div>
        </CardBody>
      </Card>

      <div className="flex justify-end">
        <Button variant="primary" onClick={handleSave} loading={saving}>
          Save Preferences
        </Button>
      </div>
    </div>
  );
}

