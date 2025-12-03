"use client";

import { useState } from "react";
import { KrawlDetail } from "@/types/krawl-detail";

interface KrawlInfoProps {
  krawl: KrawlDetail;
}

export function KrawlInfo({ krawl }: KrawlInfoProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const description = krawl.fullDescription || krawl.description || "";
  const shouldTruncate = description.length > 300;
  const displayText = shouldTruncate && !isExpanded
    ? description.slice(0, 300) + "..."
    : description;

  if (!description) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-text-primary mb-4">About</h2>
        <div className="text-center py-8 text-text-tertiary">
          <p className="mb-2">No description yet</p>
          <p className="text-sm">Be the first to add details about this krawl!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-text-primary mb-4">About</h2>
      <p className="text-text-secondary leading-relaxed whitespace-pre-line">
        {displayText}
      </p>
      {shouldTruncate && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-4 text-primary-green hover:text-dark-green font-medium text-sm"
        >
          {isExpanded ? "Read less" : "Read more"}
        </button>
      )}
    </div>
  );
}

