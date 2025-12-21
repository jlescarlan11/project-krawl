import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/route";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; provider: string }> }
) {
  try {
    const { id, provider } = await params;
    const session = await auth();

    if (!session?.jwt) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

    const backendResponse = await fetch(
      `${API_URL}/api/users/${id}/connections/${provider}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session.jwt}`,
        },
      }
    );

    if (!backendResponse.ok) {
      const error = await backendResponse.json().catch(() => ({
        error: "Failed to disconnect provider",
      }));
      return NextResponse.json(error, { status: backendResponse.status });
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error disconnecting provider:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

