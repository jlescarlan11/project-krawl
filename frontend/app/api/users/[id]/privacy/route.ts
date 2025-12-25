import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/nextauth";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();

    if (!session?.jwt) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

    const backendResponse = await fetch(
      `${API_URL}/api/users/${id}/privacy`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.jwt}`,
        },
        body: JSON.stringify(body),
      }
    );

    if (!backendResponse.ok) {
      const error = await backendResponse.json().catch(() => ({
        error: "Failed to update privacy settings",
      }));
      return NextResponse.json(error, { status: backendResponse.status });
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error updating privacy settings:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

