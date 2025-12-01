/**
 * Gem Detail API Route Handler
 *
 * Handles GET requests for fetching a single gem by ID.
 * This is a temporary mock implementation until the backend API is ready.
 *
 * TODO: Replace with actual backend API call when backend is complete
 */

import { NextRequest, NextResponse } from "next/server";
import { GemDetail } from "@/types/gem-detail";
import { GemStatus } from "@/components/map/gem-types";

/**
 * Generate mock gem detail data
 * Extends the basic gem data with full details
 */
function getMockGemDetail(id: string): GemDetail | null {
  const mockGems: Record<string, GemDetail> = {
    "gem-001": {
      id: "gem-001",
      name: "Magellan's Cross",
      category: "Historical Landmark",
      district: "Downtown",
      coordinates: [123.8897, 10.2933],
      status: GemStatus.VERIFIED,
      thumbnailUrl: "/images/gems/magellans-cross.jpg",
      rating: 4.5,
      vouchCount: 15,
      viewCount: 234,
      shortDescription: "Historic cross planted by Ferdinand Magellan in 1521",
      fullDescription:
        "Magellan's Cross is a Christian cross planted by Portuguese and Spanish explorers as ordered by Ferdinand Magellan upon arriving in Cebu in the Philippines on April 21, 1521. This cross is housed in a chapel next to the Basilica del Santo Niño on Magallanes Street. A sign below the cross states that the original cross is encased in Tindalo wood to protect it from people taking it away chip by chip. The cross is a significant symbol of Christianity in the Philippines and marks the birth of Christianity in the country.",
      address: "Magallanes Street, Cebu City, 6000 Cebu",
      hours: "Open 24 hours",
      createdAt: "2024-01-15T08:30:00Z",
      updatedAt: "2024-11-20T14:22:00Z",
      createdBy: {
        id: "user-001",
        name: "Maria Santos",
        avatar: "/images/avatars/maria.jpg",
      },
      photos: [
        {
          id: "photo-001",
          url: "/images/gems/magellans-cross.jpg",
          caption: "The historic cross in its protective chapel",
          width: 1200,
          height: 800,
          order: 1,
        },
        {
          id: "photo-002",
          url: "/images/gems/magellans-cross-2.jpg",
          caption: "Ceiling painting depicting Magellan's arrival",
          width: 1200,
          height: 800,
          order: 2,
        },
      ],
      tags: ["historical", "religious", "landmark", "downtown"],
    },
    "gem-002": {
      id: "gem-002",
      name: "Fort San Pedro",
      category: "Historical Landmark",
      district: "Downtown",
      coordinates: [123.8868, 10.2925],
      status: GemStatus.VERIFIED,
      thumbnailUrl: "/images/gems/fort-san-pedro.jpg",
      rating: 4.3,
      vouchCount: 12,
      viewCount: 189,
      shortDescription: "Spanish colonial fort and military defense structure",
      fullDescription:
        "Fort San Pedro is a military defense structure built by the Spanish under the command of Miguel López de Legazpi, first governor of the Captaincy General of the Philippines. It is located in the area now called Plaza Indepedencia, in the pier area of the city. The fort is triangular in shape, with two sides facing the sea and one side facing land. It was built from stone taken from Mactan Island and coral stone. The fort served as the nucleus of the first Spanish settlement in the Philippines and is one of the oldest forts in the country.",
      address: "A. Pigafetta Street, Cebu City, 6000 Cebu",
      hours: "8:00 AM - 7:00 PM daily",
      phone: "+63 32 256 2284",
      createdAt: "2024-01-16T09:15:00Z",
      updatedAt: "2024-11-18T11:45:00Z",
      createdBy: {
        id: "user-002",
        name: "Juan Dela Cruz",
        avatar: "/images/avatars/juan.jpg",
      },
      photos: [
        {
          id: "photo-003",
          url: "/images/gems/fort-san-pedro.jpg",
          caption: "The triangular fort from the plaza",
          width: 1200,
          height: 800,
          order: 1,
        },
      ],
      tags: ["historical", "fort", "colonial", "museum"],
    },
    "gem-003": {
      id: "gem-003",
      name: "Basilica del Santo Niño",
      category: "Religious Site",
      district: "Downtown",
      coordinates: [123.8897, 10.2942],
      status: GemStatus.VERIFIED,
      thumbnailUrl: "/images/gems/basilica.jpg",
      rating: 4.8,
      vouchCount: 25,
      viewCount: 456,
      shortDescription: "Oldest Roman Catholic church in the Philippines",
      fullDescription:
        "The Basilica Minore del Santo Niño de Cebú is a minor basilica in Cebu City in the Philippines that was founded in 1565 by Fray Andrés de Urdaneta, O.S.A. and Fray Diego de Herrera, O.S.A. It is the oldest Roman Catholic church in the country, allegedly built on the spot where the image of the Santo Niño de Cebú was found during the expedition of Miguel López de Legazpi. The church was given the title of Basilica Minore in 1965 during the 400th anniversary celebration of Christianity in the Philippines.",
      address: "Osmena Boulevard, Cebu City, 6000 Cebu",
      hours: "5:00 AM - 8:00 PM daily; Mass schedules vary",
      phone: "+63 32 255 6697",
      website: "https://basilicasantonino.org",
      createdAt: "2024-01-14T07:00:00Z",
      updatedAt: "2024-11-25T16:30:00Z",
      createdBy: {
        id: "user-003",
        name: "Ana Reyes",
        avatar: "/images/avatars/ana.jpg",
      },
      photos: [
        {
          id: "photo-004",
          url: "/images/gems/basilica.jpg",
          caption: "Majestic facade of the Basilica",
          width: 1200,
          height: 800,
          order: 1,
        },
        {
          id: "photo-005",
          url: "/images/gems/basilica-2.jpg",
          caption: "Interior with the Santo Niño shrine",
          width: 1200,
          height: 800,
          order: 2,
        },
        {
          id: "photo-006",
          url: "/images/gems/basilica-3.jpg",
          caption: "Procession during Sinulog festival",
          width: 1200,
          height: 800,
          order: 3,
        },
      ],
      tags: ["religious", "basilica", "historical", "sinulog"],
    },
    "gem-014": {
      id: "gem-014",
      name: "Fuente Osmeña Circle",
      category: "Park",
      district: "Downtown",
      coordinates: [123.8945, 10.3123],
      status: GemStatus.VERIFIED,
      thumbnailUrl: "/images/gems/fuente.jpg",
      rating: 4.2,
      vouchCount: 11,
      viewCount: 234,
      shortDescription: "Historic circular park and landmark",
      fullDescription:
        "Fuente Osmeña Circle is a roundabout in Cebu City named after Sergio Osmeña, the fourth President of the Philippines. The fountain at its center features a statue of Osmeña and serves as a major landmark. The circle is surrounded by major roads and important buildings, making it a key hub in the city. At night, the fountain is illuminated, creating a beautiful sight. The area around the circle has become a popular gathering place for locals and tourists alike.",
      address: "Osmeña Boulevard, Cebu City, 6000 Cebu",
      hours: "Open 24 hours",
      createdAt: "2024-02-01T10:00:00Z",
      updatedAt: "2024-11-22T09:15:00Z",
      createdBy: {
        id: "user-001",
        name: "Maria Santos",
        avatar: "/images/avatars/maria.jpg",
      },
      photos: [
        {
          id: "photo-007",
          url: "/images/gems/fuente.jpg",
          caption: "Fountain illuminated at night",
          width: 1200,
          height: 800,
          order: 1,
        },
      ],
      tags: ["park", "landmark", "historical", "downtown"],
    },
  };

  return mockGems[id] || null;
}

/**
 * GET /api/gems/[id]
 * Fetches single gem detail by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Simulate network delay (remove in production)
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Fetch gem detail (mock data)
    const gem = getMockGemDetail(id);

    if (!gem) {
      return NextResponse.json(
        { error: "Gem not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(gem, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
      },
    });
  } catch (error) {
    console.error("Error fetching gem detail:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
