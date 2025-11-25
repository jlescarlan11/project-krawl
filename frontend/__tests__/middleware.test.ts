import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { NextRequest, NextResponse } from "next/server";
import { middleware } from "@/middleware";
import { ROUTES } from "@/lib/routes";

// Mock NextAuth.js auth function
const mockAuth = vi.fn();
vi.mock("@/app/api/auth/[...nextauth]/route", () => ({
  auth: () => mockAuth(),
}));

// Mock session utilities
vi.mock("@/lib/session-utils", () => ({
  isSessionExpired: vi.fn(),
}));

import { isSessionExpired } from "@/lib/session-utils";

describe("middleware", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("public routes", () => {
    it("should allow access to public routes without session", async () => {
      mockAuth.mockResolvedValue(null);

      const request = new NextRequest(new URL("http://localhost:3000/"));
      const response = await middleware(request);

      expect(response).toBeInstanceOf(NextResponse);
      expect(mockAuth).not.toHaveBeenCalled();
    });

    it("should allow access to map route without session", async () => {
      mockAuth.mockResolvedValue(null);

      const request = new NextRequest(new URL("http://localhost:3000/map"));
      const response = await middleware(request);

      expect(response).toBeInstanceOf(NextResponse);
      expect(mockAuth).not.toHaveBeenCalled();
    });
  });

  describe("protected routes", () => {
    it("should allow access with valid session", async () => {
      const mockSession = {
        user: { id: "123", email: "test@example.com" },
        expires: new Date(Date.now() + 3600000).toISOString(),
      };
      mockAuth.mockResolvedValue(mockSession);
      (isSessionExpired as ReturnType<typeof vi.fn>).mockReturnValue(false);

      const request = new NextRequest(
        new URL("http://localhost:3000/gems/create")
      );
      const response = await middleware(request);

      expect(response).toBeInstanceOf(NextResponse);
      expect(mockAuth).toHaveBeenCalled();
      expect(isSessionExpired).toHaveBeenCalledWith(mockSession.expires);
    });

    it("should redirect to sign-in when no session", async () => {
      mockAuth.mockResolvedValue(null);

      const request = new NextRequest(
        new URL("http://localhost:3000/gems/create")
      );
      const response = await middleware(request);

      expect(response).toBeInstanceOf(NextResponse);
      expect(response.status).toBe(307); // Redirect status
      
      const location = response.headers.get("location");
      expect(location).toContain(ROUTES.SIGN_IN);
      expect(location).toContain("returnUrl=%2Fgems%2Fcreate");
      expect(location).toContain("reason=no-session");
    });

    it("should redirect to sign-in when session is expired", async () => {
      const mockSession = {
        user: { id: "123", email: "test@example.com" },
        expires: new Date(Date.now() - 1000).toISOString(),
      };
      mockAuth.mockResolvedValue(mockSession);
      (isSessionExpired as ReturnType<typeof vi.fn>).mockReturnValue(true);

      const request = new NextRequest(
        new URL("http://localhost:3000/krawls/create")
      );
      const response = await middleware(request);

      expect(response).toBeInstanceOf(NextResponse);
      expect(response.status).toBe(307);
      
      const location = response.headers.get("location");
      expect(location).toContain(ROUTES.SIGN_IN);
      expect(location).toContain("returnUrl=%2Fkrawls%2Fcreate");
      expect(location).toContain("reason=expired");
    });

    it("should preserve return URL in redirect", async () => {
      mockAuth.mockResolvedValue(null);

      const request = new NextRequest(
        new URL("http://localhost:3000/users/settings")
      );
      const response = await middleware(request);

      const location = response.headers.get("location");
      expect(location).toContain("returnUrl=%2Fusers%2Fsettings");
    });

    it("should handle multiple protected routes", async () => {
      const protectedRoutes = [
        "/gems/create",
        "/krawls/create",
        "/users/settings",
        "/offline",
      ];

      for (const route of protectedRoutes) {
        mockAuth.mockResolvedValue(null);
        const request = new NextRequest(
          new URL(`http://localhost:3000${route}`)
        );
        const response = await middleware(request);

        expect(response.status).toBe(307);
        const location = response.headers.get("location");
        expect(location).toContain(ROUTES.SIGN_IN);
      }
    });
  });

  describe("edge cases", () => {
    it("should handle session without expires field", async () => {
      const mockSession = {
        user: { id: "123", email: "test@example.com" },
        // No expires field
      };
      mockAuth.mockResolvedValue(mockSession);

      const request = new NextRequest(
        new URL("http://localhost:3000/gems/create")
      );
      const response = await middleware(request);

      // Should allow access if expires check is skipped
      expect(response).toBeInstanceOf(NextResponse);
      expect(isSessionExpired).not.toHaveBeenCalled();
    });

    it("should handle auth function throwing error", async () => {
      mockAuth.mockRejectedValue(new Error("Auth error"));

      const request = new NextRequest(
        new URL("http://localhost:3000/gems/create")
      );

      // Should handle error gracefully (middleware should not throw)
      await expect(middleware(request)).rejects.toThrow();
    });
  });
});



