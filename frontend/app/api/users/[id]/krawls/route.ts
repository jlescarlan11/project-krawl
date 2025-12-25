import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/nextauth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || "0";
    const size = searchParams.get("size") || "20";
    const session = await auth();

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

    const backendResponse = await fetch(
      `${API_URL}/api/users/${id}/krawls?page=${page}&size=${size}`,
      {
        headers: session?.jwt
          ? {
              Authorization: `Bearer ${session.jwt}`,
            }
          : {},
      }
    );

    if (!backendResponse.ok) {
      return NextResponse.json(
        { error: "Failed to fetch Krawls" },
        { status: backendResponse.status }
      );
    }

    const data = await backendResponse.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching user Krawls:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

