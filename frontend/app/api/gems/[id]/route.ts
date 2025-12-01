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
      culturalSignificance:
        "The Basilica houses the Santo Niño de Cebu, the oldest religious image in the Philippines, making it the spiritual heart of Catholic devotion in the country. This location witnessed the first Christian mass in the islands and remains the center of the annual Sinulog Festival, one of the Philippines' most important cultural celebrations. The basilica represents 450+ years of continuous Catholic tradition and spiritual significance.",
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
      culturalSignificance:
        "Named after President Sergio Osmeña, a major figure in Philippine independence, the fountain serves as a civic landmark celebrating national leadership and democratic values. It has been a gathering place for political rallies, cultural celebrations, and community events, making it a symbol of public space and civic participation in Cebu's modern history.",
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
    "gem-004": {
      id: "gem-004",
      name: "Tops Lookout",
      category: "Viewpoint",
      district: "Busay",
      coordinates: [123.8765, 10.3425],
      status: GemStatus.VERIFIED,
      thumbnailUrl: "/images/gems/tops.jpg",
      rating: 4.6,
      vouchCount: 18,
      viewCount: 312,
      shortDescription: "Scenic mountain viewpoint overlooking Cebu City",
      fullDescription:
        "Tops Lookout is a popular viewpoint located in the mountain barangay of Busay, offering breathtaking panoramic views of Metro Cebu, Mactan Island, and the surrounding islands. Standing at about 2,000 feet above sea level, it's a favorite spot for both tourists and locals to enjoy sunsets, cool mountain air, and the city lights at night. The area features several food stalls and restaurants where visitors can enjoy local snacks and meals while taking in the stunning scenery.",
      culturalSignificance:
        "Tops Lookout has become an iconic destination representing Cebu's natural beauty and serves as a gathering place for both celebration and reflection. The viewpoint offers visitors a unique perspective on the city's growth and development, symbolizing the harmony between urban progress and natural landscapes. It's a popular spot for proposals, family gatherings, and contemplative moments.",
      address: "Busay, Cebu City, 6000 Cebu",
      hours: "Open 24 hours",
      createdAt: "2024-01-20T10:30:00Z",
      updatedAt: "2024-11-23T15:10:00Z",
      createdBy: {
        id: "user-004",
        name: "Carlos Rivera",
        avatar: "/images/avatars/carlos.jpg",
      },
      photos: [
        {
          id: "photo-008",
          url: "/images/gems/tops.jpg",
          caption: "Panoramic view of Cebu City from Tops",
          width: 1200,
          height: 800,
          order: 1,
        },
      ],
      tags: ["viewpoint", "nature", "scenic", "busay"],
    },
    "gem-005": {
      id: "gem-005",
      name: "Sirao Flower Garden",
      category: "Nature",
      district: "Busay",
      coordinates: [123.8689, 10.3512],
      status: GemStatus.VERIFIED,
      thumbnailUrl: "/images/gems/sirao.jpg",
      rating: 4.4,
      vouchCount: 14,
      viewCount: 287,
      shortDescription: "Colorful flower garden with celosia flowers",
      fullDescription:
        "Sirao Flower Garden, also known as the 'Little Amsterdam of Cebu,' is a picturesque flower farm featuring vibrant celosia flowers that bloom in various colors including red, yellow, and pink. The garden has become one of Cebu's most Instagram-worthy destinations, with carefully arranged flower beds, decorative installations, and viewing decks. Visitors can walk through the colorful fields, take photos, and enjoy the cool mountain climate of Busay.",
      culturalSignificance:
        "Originally a simple flower farm supplying the local market, Sirao Garden has transformed into a symbol of Filipino creativity and entrepreneurship in tourism. It represents how local communities can turn agricultural spaces into cultural destinations while maintaining their livelihood. The garden has inspired similar agri-tourism initiatives across the Philippines.",
      address: "Sirao, Busay, Cebu City, 6000 Cebu",
      hours: "6:00 AM - 6:00 PM daily",
      phone: "+63 917 123 4567",
      createdAt: "2024-01-22T08:00:00Z",
      updatedAt: "2024-11-24T12:30:00Z",
      createdBy: {
        id: "user-005",
        name: "Elena Tan",
        avatar: "/images/avatars/elena.jpg",
      },
      photos: [
        {
          id: "photo-009",
          url: "/images/gems/sirao.jpg",
          caption: "Colorful celosia flowers in full bloom",
          width: 1200,
          height: 800,
          order: 1,
        },
      ],
      tags: ["nature", "flowers", "garden", "photography"],
    },
    "gem-012": {
      id: "gem-012",
      name: "Taoist Temple",
      category: "Religious Site",
      district: "Beverly Hills",
      coordinates: [123.8654, 10.3234],
      status: GemStatus.VERIFIED,
      thumbnailUrl: "/images/gems/taoist-temple.jpg",
      rating: 4.5,
      vouchCount: 16,
      viewCount: 298,
      shortDescription: "Colorful Taoist temple with city views",
      fullDescription:
        "The Cebu Taoist Temple is a beautiful place of worship built by the Chinese community in 1972. Located in the Beverly Hills subdivision, the temple features ornate decorations, dragon sculptures, and colorful pagoda-style architecture. Visitors climb 81 steps to reach the main temple, where they can participate in traditional rituals, make wishes, or simply admire the intricate details and peaceful atmosphere. The temple offers stunning views of Cebu City and is open to visitors of all faiths.",
      culturalSignificance:
        "The Taoist Temple represents the rich cultural diversity of Cebu and the significant contributions of the Chinese-Filipino community to the city's heritage. It serves as both a place of worship and a symbol of religious tolerance and multiculturalism in the Philippines. The temple has become an important landmark showcasing the harmonious blending of Chinese traditions with Filipino hospitality.",
      address: "Beverly Hills Subdivision, Lahug, Cebu City, 6000 Cebu",
      hours: "6:00 AM - 5:00 PM daily",
      createdAt: "2024-01-25T09:00:00Z",
      updatedAt: "2024-11-26T14:00:00Z",
      createdBy: {
        id: "user-006",
        name: "David Wong",
        avatar: "/images/avatars/david.jpg",
      },
      photos: [
        {
          id: "photo-010",
          url: "/images/gems/taoist-temple.jpg",
          caption: "Ornate architecture of the Taoist Temple",
          width: 1200,
          height: 800,
          order: 1,
        },
      ],
      tags: ["religious", "temple", "cultural", "architecture"],
    },
    "gem-015": {
      id: "gem-015",
      name: "Ayala Center Cebu",
      category: "Shopping",
      district: "Business Park",
      coordinates: [123.9087, 10.3198],
      status: GemStatus.VERIFIED,
      thumbnailUrl: "/images/gems/ayala.jpg",
      rating: 4.3,
      vouchCount: 13,
      viewCount: 421,
      shortDescription: "Premier shopping and lifestyle destination",
      fullDescription:
        "Ayala Center Cebu is one of the Philippines' premier shopping malls and lifestyle hubs, featuring a wide array of international and local brands, dining options, entertainment facilities, and services. The mall complex includes multiple buildings connected by walkways, an open-air section called The Terraces, a cinema, and regular events and exhibitions. It's not just a shopping destination but a social and cultural gathering place for Cebuanos.",
      culturalSignificance:
        "As one of the first major modern malls in Cebu, Ayala Center represents the city's economic development and emergence as a major business hub in the Visayas region. It has shaped the modern lifestyle and consumer culture of Cebuanos while also hosting cultural events, art exhibitions, and community gatherings that reflect the city's evolving identity.",
      address: "Archbishop Reyes Ave, Cebu Business Park, Cebu City, 6000 Cebu",
      hours: "10:00 AM - 9:00 PM daily",
      phone: "+63 32 231 5341",
      website: "https://www.ayalaland.com.ph/malls/ayala-center-cebu",
      createdAt: "2024-01-28T11:00:00Z",
      updatedAt: "2024-11-27T16:45:00Z",
      createdBy: {
        id: "user-007",
        name: "Patricia Gomez",
        avatar: "/images/avatars/patricia.jpg",
      },
      photos: [
        {
          id: "photo-011",
          url: "/images/gems/ayala.jpg",
          caption: "Modern facade of Ayala Center Cebu",
          width: 1200,
          height: 800,
          order: 1,
        },
      ],
      tags: ["shopping", "mall", "lifestyle", "modern"],
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
