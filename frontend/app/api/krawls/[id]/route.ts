/**
 * Krawl Detail API Route Handler
 *
 * Handles GET requests for fetching a single krawl by ID.
 * Fetches data from the backend API and transforms it to match the frontend KrawlDetail format.
 */

import { NextRequest, NextResponse } from "next/server";
import { KrawlDetail } from "@/types/krawl-detail";
import { auth } from "@/lib/nextauth";
import { getAvatarUrl } from "@/lib/cloudinary/urls";

/**
 * GET /api/krawls/[id]
 * Fetches single krawl detail by ID
 * Tries backend first, returns error if not found
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();

    // Try backend first
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    console.log(`[GET /api/krawls/${id}] Attempting to fetch from backend: ${API_URL}/api/krawls/${id}`);
    
    try {
      const backendResponse = await fetch(`${API_URL}/api/krawls/${id}`, {
        headers: session?.jwt ? {
          Authorization: `Bearer ${session.jwt}`,
        } : {},
      });

      console.log(`[GET /api/krawls/${id}] Backend response status: ${backendResponse.status}`);

      if (backendResponse.ok) {
        const krawlData = await backendResponse.json();
        
        // Convert LocalDateTime to ISO string if needed
        const formatDate = (date: any): string => {
          if (!date) return new Date().toISOString();
          if (typeof date === 'string') {
            // If it's already an ISO string, return as-is
            if (date.includes('T') && date.includes('Z')) {
              return date;
            }
            // If it's a LocalDateTime format without timezone, add Z
            if (date.includes('T')) {
              return new Date(date + 'Z').toISOString();
            }
            // Otherwise, try to parse it
            return new Date(date).toISOString();
          }
          // Handle LocalDateTime format from Java backend (e.g., "2024-01-01T12:00:00")
          return new Date(date).toISOString();
        };
        
        // Map gems from backend format (including creatorNote and lokalSecret)
        const gems = krawlData.gems?.map((g: any) => {
          const longitude = g.coordinates?.longitude ?? g.coordinates?.[0] ?? 0;
          const latitude = g.coordinates?.latitude ?? g.coordinates?.[1] ?? 0;
          
          return {
            id: g.id || '',
            name: g.name || '',
            category: g.category || '',
            district: g.district || '',
            coordinates: [longitude, latitude],
            thumbnailUrl: g.thumbnailUrl,
            rating: g.rating,
            creatorNote: g.creatorNote || '',
            lokalSecret: g.lokalSecret || '',
            order: g.order ?? 0,
            status: 'verified' as const, // Default status for Krawl gems
          };
        }) || [];

        // Map ratings data
        const ratingsData = krawlData.ratingsData ? {
          averageRating: krawlData.ratingsData.averageRating ?? 0,
          totalRatings: krawlData.ratingsData.totalRatings ?? 0,
          breakdown: {
            1: Number(krawlData.ratingsData.breakdown?.[1] ?? krawlData.ratingsData.breakdown?.["1"] ?? 0),
            2: Number(krawlData.ratingsData.breakdown?.[2] ?? krawlData.ratingsData.breakdown?.["2"] ?? 0),
            3: Number(krawlData.ratingsData.breakdown?.[3] ?? krawlData.ratingsData.breakdown?.["3"] ?? 0),
            4: Number(krawlData.ratingsData.breakdown?.[4] ?? krawlData.ratingsData.breakdown?.["4"] ?? 0),
            5: Number(krawlData.ratingsData.breakdown?.[5] ?? krawlData.ratingsData.breakdown?.["5"] ?? 0),
          },
        } : undefined;
        
        // Map vouches data
        const vouchesData = krawlData.vouchesData ? {
          vouchCount: krawlData.vouchesData.vouchCount ?? 0,
          vouches: krawlData.vouchesData.vouches?.map((v: any) => ({
            userId: v.user?.id || '',
            userName: v.user?.name || '',
            userAvatar: getAvatarUrl(v.user?.avatar),
            createdAt: v.createdAt ? formatDate(v.createdAt) : new Date().toISOString(),
          })) || [],
          isVouchedByCurrentUser: krawlData.vouchesData.isVouchedByCurrentUser ?? false,
        } : undefined;

        const krawlDetail: KrawlDetail = {
          id: krawlData.id,
          name: krawlData.name || '',
          description: krawlData.description,
          fullDescription: krawlData.fullDescription,
          category: krawlData.category,
          difficulty: krawlData.difficulty,
          coverImage: krawlData.coverImage,
          gems,
          rating: krawlData.ratingsData?.averageRating ?? krawlData.rating ?? 0,
          estimatedDurationMinutes: krawlData.estimatedDurationMinutes,
          estimatedDistanceKm: krawlData.estimatedDistanceKm,
          createdAt: formatDate(krawlData.createdAt),
          updatedAt: formatDate(krawlData.updatedAt),
          createdBy: krawlData.createdBy ? {
            id: krawlData.createdBy.id || '',
            name: krawlData.createdBy.name || '',
            avatar: getAvatarUrl(krawlData.createdBy.avatar),
          } : undefined,
          tags: krawlData.tags || [],
          ratingsData,
          vouchesData,
          viewCount: krawlData.viewCount ?? 0,
        };

        return NextResponse.json(krawlDetail, {
          status: 200,
          headers: {
            "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
          },
        });
      } else {
        // Backend returned an error status
        let errorData: any = null;
        try {
          const errorText = await backendResponse.text();
          if (errorText) {
            try {
              errorData = JSON.parse(errorText);
            } catch {
              errorData = { message: errorText };
            }
          }
        } catch (e) {
          console.error(`[GET /api/krawls/${id}] Failed to read error response:`, e);
        }
        
        console.error(`[GET /api/krawls/${id}] Backend returned ${backendResponse.status}:`, errorData || 'No error details');
        
        if (backendResponse.status === 404) {
          return NextResponse.json(
            { error: errorData?.message || "Krawl not found" },
            { status: 404 }
          );
        }
        
        if (backendResponse.status === 400) {
          return NextResponse.json(
            { error: errorData?.message || "Invalid krawl ID format" },
            { status: 400 }
          );
        }
        
        // For other errors, return the backend error
        return NextResponse.json(
          { error: errorData?.message || "Backend error" },
          { status: backendResponse.status }
        );
      }
    } catch (backendError) {
      console.error(`[GET /api/krawls/${id}] Backend fetch failed:`, backendError);
      if (backendError instanceof Error) {
        console.error(`[GET /api/krawls/${id}] Error message:`, backendError.message);
        console.error(`[GET /api/krawls/${id}] Error stack:`, backendError.stack);
      }
      return NextResponse.json(
        { error: "Failed to fetch krawl from backend" },
        { status: 503 }
      );
    }
  } catch (error) {
    console.error("Error fetching krawl detail:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

