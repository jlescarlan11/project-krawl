/**
 * Mock Gem Data
 *
 * Temporary mock data for development until backend API is ready.
 * This allows server components to access gem data without HTTP calls.
 */

import { GemDetail } from "@/types/gem-detail";
import { GemStatus } from "@/components/map/gem-types";

/**
 * Get mock gem detail by ID
 * Returns null if gem not found
 */
export function getMockGemDetail(id: string): GemDetail | null {
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
      culturalSignificance:
        "This cross marks the arrival of Christianity to the Philippines in 1521 and is one of the oldest Christian symbols in the nation. It represents the pivotal moment when Spanish explorers introduced the Catholic faith, forever changing the religious landscape of the archipelago. Pilgrims and tourists visit to pay respects to this historical emblem of faith and colonial encounter.",
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
      culturalSignificance:
        "As the oldest Spanish fort in the Philippines, Fort San Pedro symbolizes the beginning of Spanish colonial rule and the fusion of Spanish and Filipino cultures. It served as the military stronghold that protected early settlers and remains a testament to the country's complex colonial history. The fort's triangular design reflects European military architecture adapted to the tropical environment of the islands.",
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
    // Add more gems as needed
  };

  return mockGems[id] || null;
}
