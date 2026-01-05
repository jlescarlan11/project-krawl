/**
 * Reports API Route Handler
 *
 * Handles POST requests for creating content reports (Gems and Krawls).
 * Proxies requests to the backend API.
 * Authentication is optional - guests can report content.
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/nextauth";

/**
 * POST /api/reports
 * Create a new report for a Gem or Krawl
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const body = await request.json();
    const { contentType, contentId, reason, description } = body;

    // Validate required fields
    if (!contentType || !contentId || !reason) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid input",
          message: "Content type, content ID, and reason are required",
        },
        { status: 400 }
      );
    }

    // Validate contentType enum
    if (contentType !== "GEM" && contentType !== "KRAWL") {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid content type",
          message: "Content type must be 'GEM' or 'KRAWL'",
        },
        { status: 400 }
      );
    }

    // Validate reason enum
    const validReasons = ["INACCURATE", "COMMERCIAL", "OFFENSIVE", "SPAM", "OTHER"];
    if (!validReasons.includes(reason)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid reason",
          message: `Reason must be one of: ${validReasons.join(", ")}`,
        },
        { status: 400 }
      );
    }

    // Validate description if reason is OTHER
    if (reason === "OTHER" && (!description || description.trim().length === 0)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid input",
          message: "Description is required when reason is OTHER",
        },
        { status: 400 }
      );
    }

    // Validate description length
    if (description && description.length > 500) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid input",
          message: "Description cannot exceed 500 characters",
        },
        { status: 400 }
      );
    }

    // Validate UUID format for contentId
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(contentId)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid content ID format",
          message: "Content ID must be a valid UUID",
        },
        { status: 400 }
      );
    }

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    const BACKEND_ENDPOINT = `${API_URL}/api/reports`;

    console.log(`[POST /api/reports] Forwarding to backend`);

    // Prepare headers - include JWT if available, but don't require it
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };
    if (session?.jwt) {
      headers.Authorization = `Bearer ${session.jwt}`;
    }

    const backendResponse = await fetch(BACKEND_ENDPOINT, {
      method: "POST",
      headers,
      body: JSON.stringify({
        contentType,
        contentId,
        reason,
        description: description?.trim() || null,
      }),
    });

    console.log(`[POST /api/reports] Backend status: ${backendResponse.status}`);

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json().catch(() => ({}));
      return NextResponse.json(
        {
          success: false,
          error: errorData.error || "Backend error",
          message: errorData.message || "Failed to create report",
        },
        { status: backendResponse.status }
      );
    }

    const data = await backendResponse.json();
    return NextResponse.json({ success: true, ...data }, { status: 201 });
  } catch (error) {
    console.error(`[POST /api/reports] Error:`, error);

    if (error instanceof TypeError && error.message.includes("fetch")) {
      return NextResponse.json(
        {
          success: false,
          error: "Backend unavailable",
          message: "Unable to connect to the server. Please try again later.",
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message: "An unexpected error occurred. Please try again.",
      },
      { status: 500 }
    );
  }
}







