import { GemDetail, GemPhoto } from "@/types/gem-detail";
import { GemStatus } from "@/components/map/gem-types";
import type {
  LocationData,
  DetailsData,
  MediaData,
} from "@/stores/gem-creation-store";

/**
 * Transform form data from Gem creation store into GemDetail format
 * for preview display
 *
 * @param location - Location data from Step 1
 * @param details - Details data from Step 2
 * @param media - Media data from Step 3
 * @param user - Current user session data (optional)
 * @returns GemDetail object ready for preview components
 */
export function transformFormDataToGemDetail(
  location: LocationData | null,
  details: DetailsData | null,
  media: MediaData | null,
  user?: { id?: string; name?: string; email?: string; image?: string } | null
): GemDetail | null {
  // Return null if required data is missing
  if (!location || !details) {
    return null;
  }

  // Extract district from address (fallback to "Cebu City" if not available)
  const district = extractDistrictFromAddress(location.address) || "Cebu City";

  // Transform photos from MediaData to GemPhoto format
  // Use uploadedUrls if available, otherwise create object URLs from File objects for preview
  const photos: GemPhoto[] = media?.uploadedUrls && media.uploadedUrls.length > 0
    ? media.uploadedUrls.map((url, index) => ({
        id: `preview-photo-${index}`,
        url,
        width: 1920, // Default dimensions (will be updated when images load)
        height: 1080,
        order: index,
      }))
    : media?.photos && media.photos.length > 0
    ? media.photos.map((file, index) => ({
        id: `preview-photo-${index}`,
        url: URL.createObjectURL(file), // Create object URL for preview
        width: 1920,
        height: 1080,
        order: index,
      }))
    : [];

  // Determine thumbnail URL
  const thumbnailUrl =
    photos.length > 0 && media?.thumbnailIndex !== undefined
      ? photos[media.thumbnailIndex]?.url
      : photos[0]?.url;

  // Create GemDetail object
  const gemDetail: GemDetail = {
    id: "preview", // Temporary ID for preview
    name: details.name,
    category: details.category,
    district,
    coordinates: location.coordinates,
    status: GemStatus.PENDING, // New gems start as pending
    thumbnailUrl,
    shortDescription: details.shortDescription,
    fullDescription: details.fullDescription || details.shortDescription,
    culturalSignificance: details.culturalSignificance,
    photos: photos.length > 0 ? photos : undefined,
    address: location.address,
    hours: details.hours,
    website: details.website,
    phone: details.phone,
    tags: details.tags && details.tags.length > 0 ? details.tags : undefined,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    // Preview-specific defaults
    rating: undefined,
    vouchCount: 0,
    viewCount: 0,
    // Include creator info if user is available
    createdBy: user
      ? {
          id: user.id || "preview-user",
          name: user.name || user.email || "You",
          avatar: user.image,
        }
      : undefined,
  };

  return gemDetail;
}

/**
 * Extract district name from address string
 * Attempts to parse common Cebu City district names from address
 *
 * @param address - Full address string
 * @returns District name or null if not found
 */
function extractDistrictFromAddress(address: string): string | null {
  if (!address) return null;

  // Common Cebu City districts/areas
  const districts = [
    "Lahug",
    "Cebu City Proper",
    "Mabolo",
    "Banilad",
    "Talamban",
    "Apas",
    "Busay",
    "Guadalupe",
    "Labangon",
    "Pardo",
    "Mambaling",
    "Basak San Nicolas",
    "Sawang Calero",
    "Subangdaku",
    "Tisa",
    "Punta Princesa",
    "Capitol Site",
    "Kamputhaw",
    "Kamagayan",
    "Sambag",
    "Tejero",
    "Carreta",
    "T. Padilla",
    "Ermita",
    "San Nicolas",
    "Tinago",
    "Parian",
    "Sto. Niño",
    "Pahina Central",
    "Pahina San Nicolas",
    "Zapatera",
    "Lorega",
    "Day-as",
    "T. Padilla",
    "Pasil",
    "Mabolo",
    "Kasambagan",
    "Lahug",
    "Apas",
    "Busay",
    "Talamban",
    "Banilad",
    "Hipodromo",
    "Capitol Site",
    "Kamputhaw",
    "Luz",
    "Cebu Business Park",
    "IT Park",
  ];

  // Check if any district name appears in the address
  const addressLower = address.toLowerCase();
  for (const district of districts) {
    if (addressLower.includes(district.toLowerCase())) {
      return district;
    }
  }

  // If no district found, try to extract from common patterns
  // e.g., "123 Main St, Lahug, Cebu City" -> "Lahug"
  const match = address.match(/,\s*([^,]+),\s*Cebu/i);
  if (match && match[1]) {
    return match[1].trim();
  }

  return null;
}

