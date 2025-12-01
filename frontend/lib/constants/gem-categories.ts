/**
 * Gem Category Definitions
 *
 * Categories for classifying gems in the Krawl app.
 * Each category includes an emoji icon, label, and description.
 *
 * Used in the gem creation flow (Step 2 - Basic Info) for category selection.
 */

export interface GemCategory {
  value: string;
  label: string;
  description: string;
  icon: string; // Emoji icon
}

/**
 * Complete list of gem categories
 *
 * Categories are displayed as chips with icons in the gem creation form.
 * Single-select only for MVP.
 */
export const GEM_CATEGORIES: GemCategory[] = [
  {
    value: "food-drink",
    label: "Food & Drink",
    description: "Restaurants, cafes, bars, and food spots",
    icon: "🍴",
  },
  {
    value: "historical-site",
    label: "Historical Site",
    description: "Historic sites, monuments, and heritage locations",
    icon: "🏛️",
  },
  {
    value: "art-music",
    label: "Art & Music",
    description: "Museums, galleries, cultural centers, street art",
    icon: "🎨",
  },
  {
    value: "nature",
    label: "Nature",
    description: "Parks, gardens, natural attractions",
    icon: "🌿",
  },
  {
    value: "culture",
    label: "Culture",
    description: "Cultural landmarks, heritage sites, and traditions",
    icon: "👑",
  },
  {
    value: "shopping",
    label: "Shopping",
    description: "Markets, malls, shops, and retail",
    icon: "🛍️",
  },
  {
    value: "religious-site",
    label: "Religious Site",
    description: "Churches, temples, mosques, and places of worship",
    icon: "🙏",
  },
  {
    value: "viewpoint",
    label: "Viewpoint",
    description: "Scenic lookouts and photo spots",
    icon: "👁️",
  },
  {
    value: "monument",
    label: "Monument",
    description: "Statues, memorials, and commemorative structures",
    icon: "🗿",
  },
  {
    value: "park",
    label: "Park",
    description: "Public parks and recreational spaces",
    icon: "🏞️",
  },
];

/**
 * Get category by value
 *
 * @param value - Category value to look up
 * @returns Category object or undefined if not found
 */
export function getCategoryByValue(value: string): GemCategory | undefined {
  return GEM_CATEGORIES.find((cat) => cat.value === value);
}

/**
 * Get category label by value
 *
 * @param value - Category value
 * @returns Category label or the original value if not found
 */
export function getCategoryLabel(value: string): string {
  return getCategoryByValue(value)?.label || value;
}

/**
 * Get category icon by value
 *
 * @param value - Category value
 * @returns Category icon emoji or empty string if not found
 */
export function getCategoryIcon(value: string): string {
  return getCategoryByValue(value)?.icon || "";
}
