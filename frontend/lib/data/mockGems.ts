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
      ratingsData: {
        averageRating: 4.5,
        totalRatings: 127,
        breakdown: {
          5: 85,
          4: 30,
          3: 8,
          2: 3,
          1: 1,
        },
      },
      vouchesData: {
        vouchCount: 15,
        isVouchedByCurrentUser: false,
        vouches: [
          {
            userId: "user-001",
            userName: "Maria Santos",
            userAvatar: "/images/avatars/maria.jpg",
            createdAt: "2024-11-15T10:30:00Z",
          },
          {
            userId: "user-003",
            userName: "Pedro Reyes",
            userAvatar: "/images/avatars/pedro.jpg",
            createdAt: "2024-11-10T14:22:00Z",
          },
          {
            userId: "user-004",
            userName: "Ana Garcia",
            createdAt: "2024-11-08T09:15:00Z",
          },
          {
            userId: "user-005",
            userName: "Carlos Martinez",
            userAvatar: "/images/avatars/carlos.jpg",
            createdAt: "2024-11-05T16:45:00Z",
          },
          {
            userId: "user-006",
            userName: "Isabel Cruz",
            createdAt: "2024-10-28T11:20:00Z",
          },
          {
            userId: "user-007",
            userName: "Miguel Fernandez",
            userAvatar: "/images/avatars/miguel.jpg",
            createdAt: "2024-10-25T13:10:00Z",
          },
          {
            userId: "user-008",
            userName: "Sofia Lopez",
            createdAt: "2024-10-20T08:30:00Z",
          },
          {
            userId: "user-009",
            userName: "Diego Ramirez",
            userAvatar: "/images/avatars/diego.jpg",
            createdAt: "2024-10-15T15:55:00Z",
          },
          {
            userId: "user-010",
            userName: "Elena Santos",
            createdAt: "2024-10-10T12:40:00Z",
          },
          {
            userId: "user-011",
            userName: "Ricardo Torres",
            userAvatar: "/images/avatars/ricardo.jpg",
            createdAt: "2024-10-05T10:15:00Z",
          },
          {
            userId: "user-012",
            userName: "Carmen Diaz",
            createdAt: "2024-09-30T14:25:00Z",
          },
          {
            userId: "user-013",
            userName: "Antonio Silva",
            userAvatar: "/images/avatars/antonio.jpg",
            createdAt: "2024-09-25T09:50:00Z",
          },
          {
            userId: "user-014",
            userName: "Laura Hernandez",
            createdAt: "2024-09-20T16:30:00Z",
          },
          {
            userId: "user-015",
            userName: "Francisco Gomez",
            userAvatar: "/images/avatars/francisco.jpg",
            createdAt: "2024-09-15T11:05:00Z",
          },
          {
            userId: "user-016",
            userName: "Rosa Alvarez",
            createdAt: "2024-09-10T13:45:00Z",
          },
        ],
      },
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
      vouchCount: 3,
      viewCount: 189,
      shortDescription: "Spanish colonial fort and military defense structure",
      ratingsData: {
        averageRating: 4.3,
        totalRatings: 45,
        breakdown: {
          5: 20,
          4: 18,
          3: 5,
          2: 1,
          1: 1,
        },
      },
      vouchesData: {
        vouchCount: 3,
        isVouchedByCurrentUser: true,
        vouches: [
          {
            userId: "user-002",
            userName: "Juan Dela Cruz",
            userAvatar: "/images/avatars/juan.jpg",
            createdAt: "2024-11-18T11:45:00Z",
          },
          {
            userId: "user-017",
            userName: "Teresa Aquino",
            createdAt: "2024-11-10T09:30:00Z",
          },
          {
            userId: "user-018",
            userName: "Roberto Mercado",
            userAvatar: "/images/avatars/roberto.jpg",
            createdAt: "2024-11-05T14:15:00Z",
          },
        ],
      },
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
