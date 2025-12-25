/**
 * Gem Detail API Route Handler
 *
 * Handles GET requests for fetching a single gem by ID.
 * Fetches data from the backend API and transforms it to match the frontend GemDetail format.
```````````` */

import { NextRequest, NextResponse } from "next/server";
import { GemDetail } from "@/types/gem-detail";
import { auth } from "@/lib/nextauth";
import { getAvatarUrl } from "@/lib/cloudinary/urls";

/**
 * GET /api/gems/[id]
 * Fetches single gem detail by ID
 * Tries backend first, falls back to mock store
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
    console.log(`[GET /api/gems/${id}] Attempting to fetch from backend: ${API_URL}/api/gems/${id}`);
    
    try {
      const backendResponse = await fetch(`${API_URL}/api/gems/${id}`, {
        headers: session?.jwt ? {
          Authorization: `Bearer ${session.jwt}`,
        } : {},
      });

      console.log(`[GET /api/gems/${id}] Backend response status: ${backendResponse.status}`);

      if (backendResponse.ok) {
        const gemDetailData = await backendResponse.json();
        
        // Log photo URLs for debugging
        if (gemDetailData.photos && gemDetailData.photos.length > 0) {
          console.log(`[GET /api/gems/${id}] Photo URLs from backend:`, 
            gemDetailData.photos.map((p: any) => ({
              id: p.id,
              url: p.url,
              isFullUrl: p.url?.startsWith('http'),
              isCloudinary: p.url?.includes('cloudinary.com'),
            }))
          );
        }
        
        // Convert backend response to GemDetail format
        // Backend returns coordinates as nested object: { coordinates: { longitude, latitude } }
        const longitude = gemDetailData.coordinates?.longitude ?? gemDetailData.longitude ?? 0;
        const latitude = gemDetailData.coordinates?.latitude ?? gemDetailData.latitude ?? 0;
        
        // Validate coordinates
        if (!longitude || !latitude) {
          console.warn(`[GET /api/gems/${id}] Missing coordinates in backend response`);
        }
        
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
        
        // Map photos from backend format to frontend GemPhoto format
        const photos = gemDetailData.photos?.map((p: any) => {
          const photoUrl = p.url || '';
          // Log photo URL for debugging
          if (photoUrl) {
            console.log(`[GET /api/gems/${id}] Photo URL:`, {
              id: p.id,
              url: photoUrl,
              isFullUrl: photoUrl.startsWith('http'),
              isCloudinary: photoUrl.includes('cloudinary.com'),
            });
          }
          return {
            id: p.id || `photo-${p.order ?? 0}`,
            url: photoUrl,
            caption: p.caption,
            width: p.width ?? 1920,
            height: p.height ?? 1080,
            order: p.order ?? 0,
          };
        }) || [];
        
        // Map ratings data
        // Note: JSON serializes Map keys as strings, so we need to handle both numeric and string keys
        const ratingsData = gemDetailData.ratingsData ? {
          averageRating: gemDetailData.ratingsData.averageRating ?? 0,
          totalRatings: gemDetailData.ratingsData.totalRatings ?? 0,
          breakdown: gemDetailData.ratingsData.breakdown ? {
            1: Number(gemDetailData.ratingsData.breakdown[1] ?? gemDetailData.ratingsData.breakdown["1"] ?? 0),
            2: Number(gemDetailData.ratingsData.breakdown[2] ?? gemDetailData.ratingsData.breakdown["2"] ?? 0),
            3: Number(gemDetailData.ratingsData.breakdown[3] ?? gemDetailData.ratingsData.breakdown["3"] ?? 0),
            4: Number(gemDetailData.ratingsData.breakdown[4] ?? gemDetailData.ratingsData.breakdown["4"] ?? 0),
            5: Number(gemDetailData.ratingsData.breakdown[5] ?? gemDetailData.ratingsData.breakdown["5"] ?? 0),
          } : {
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0,
          },
        } : undefined;
        
        // Map vouches data
        const vouchesData = gemDetailData.vouchesData ? {
          vouchCount: gemDetailData.vouchesData.vouchCount ?? 0,
          vouches: gemDetailData.vouchesData.vouches?.map((v: any) => ({
            userId: v.user?.id || '',
            userName: v.user?.name || '',
            userAvatar: getAvatarUrl(v.user?.avatar),
            createdAt: v.createdAt ? formatDate(v.createdAt) : new Date().toISOString(),
          })) || [],
          isVouchedByCurrentUser: gemDetailData.vouchesData.isVouchedByCurrentUser ?? false,
        } : undefined;
        
        const gemDetail: GemDetail = {
          id: gemDetailData.id,
          name: gemDetailData.name || '',
          category: gemDetailData.category || '',
          district: gemDetailData.district || '',
          shortDescription: gemDetailData.shortDescription,
          fullDescription: gemDetailData.fullDescription,
          culturalSignificance: gemDetailData.culturalSignificance,
          coordinates: [longitude, latitude],
          address: gemDetailData.address,
          photos: photos.length > 0 ? photos : undefined,
          thumbnailUrl: gemDetailData.thumbnailUrl,
          status: gemDetailData.status || 'PENDING',
          rating: gemDetailData.ratingsData?.averageRating ?? gemDetailData.rating ?? 0,
          vouchCount: gemDetailData.vouchesData?.vouchCount ?? gemDetailData.vouchCount ?? 0,
          viewCount: gemDetailData.viewCount ?? 0,
          tags: gemDetailData.tags || [],
          hours: gemDetailData.hours,
          website: gemDetailData.website,
          phone: gemDetailData.phone,
          createdAt: formatDate(gemDetailData.createdAt),
          updatedAt: formatDate(gemDetailData.updatedAt),
          createdBy: gemDetailData.createdBy ? {
            id: gemDetailData.createdBy.id || '',
            name: gemDetailData.createdBy.name || '',
            avatar: getAvatarUrl(gemDetailData.createdBy.avatar),
          } : undefined,
          ratingsData,
          vouchesData,
        };

        return NextResponse.json(gemDetail, {
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
          console.error(`[GET /api/gems/${id}] Failed to read error response:`, e);
        }
        
        console.error(`[GET /api/gems/${id}] Backend returned ${backendResponse.status}:`, errorData || 'No error details');
        
        if (backendResponse.status === 404) {
          return NextResponse.json(
            { error: errorData?.message || "Gem not found" },
            { status: 404 }
          );
        }
        
        if (backendResponse.status === 400) {
          return NextResponse.json(
            { error: errorData?.message || "Invalid gem ID format" },
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
      console.error(`[GET /api/gems/${id}] Backend fetch failed:`, backendError);
      if (backendError instanceof Error) {
        console.error(`[GET /api/gems/${id}] Error message:`, backendError.message);
        console.error(`[GET /api/gems/${id}] Error stack:`, backendError.stack);
      }
      return NextResponse.json(
        { error: "Failed to fetch gem from backend" },
        { status: 503 }
      );
    }
  } catch (error) {
    console.error("Error fetching gem detail:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
