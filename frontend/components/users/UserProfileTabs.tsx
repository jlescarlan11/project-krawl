"use client";

import { useState } from "react";
import { UserGemsList } from "./UserGemsList";
import { UserKrawlsList } from "./UserKrawlsList";
import { UserVouchedGemsList } from "./UserVouchedGemsList";
import { UserCompletedKrawlsList } from "./UserCompletedKrawlsList";
import { cn } from "@/lib/utils";

export interface UserProfileTabsProps {
  /** User ID */
  userId: string;

  /** Optional className for styling */
  className?: string;
}

type TabType = "gems" | "krawls" | "vouched" | "completed";

/**
 * UserProfileTabs Component
 *
 * Displays tabs for different content types on user profile.
 */
export function UserProfileTabs({ userId, className }: UserProfileTabsProps) {
  const [activeTab, setActiveTab] = useState<TabType>("gems");

  const tabs: { id: TabType; label: string }[] = [
    { id: "gems", label: "Gems Created" },
    { id: "krawls", label: "Krawls Created" },
    { id: "vouched", label: "Vouched Gems" },
    { id: "completed", label: "Completed Krawls" },
  ];

  return (
    <div className={cn("space-y-6", className)}>
      {/* Tab Navigation */}
      <div className="border-b border-bg-medium">
        <nav className="flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "py-4 px-1 border-b-2 font-medium text-sm transition-colors",
                activeTab === tab.id
                  ? "border-primary-green text-primary-green"
                  : "border-transparent text-text-secondary hover:text-text-primary hover:border-bg-medium"
              )}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "gems" && <UserGemsList userId={userId} />}
        {activeTab === "krawls" && <UserKrawlsList userId={userId} />}
        {activeTab === "vouched" && <UserVouchedGemsList userId={userId} />}
        {activeTab === "completed" && (
          <UserCompletedKrawlsList userId={userId} />
        )}
      </div>
    </div>
  );
}

