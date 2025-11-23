import "next-auth";
import "next-auth/jwt";

/**
 * NextAuth.js type extensions for Krawl authentication
 * 
 * Extends NextAuth.js types to include backend JWT token in session
 * and user information from backend API.
 */
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      picture?: string;
    };
    jwt: string; // Backend JWT token for API authentication
    expires: Date | string; // Can be Date or ISO string
  }

  interface User {
    id: string;
    email: string;
    name: string;
    picture?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    name: string;
    picture?: string;
    jwt?: string; // Backend JWT token
  }
}

