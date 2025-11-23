import NextAuth, { type NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import type {
  Account,
  Profile,
  User,
} from "@auth/core/types";
import type { JWT } from "@auth/core/jwt";
import * as Sentry from "@sentry/nextjs";
import { exchangeToken } from "@/lib/auth";

/**
 * Validates required environment variables for NextAuth.js configuration.
 * Throws an error if any required variables are missing.
 * 
 * @throws Error if required environment variables are missing
 */
function validateEnvironmentVariables(): void {
  const required = {
    GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    AUTH_SECRET: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  };

  const missing: string[] = [];

  if (!required.GOOGLE_CLIENT_ID) {
    missing.push("NEXT_PUBLIC_GOOGLE_CLIENT_ID");
  }
  if (!required.GOOGLE_CLIENT_SECRET) {
    missing.push("GOOGLE_CLIENT_SECRET");
  }
  if (!required.AUTH_SECRET) {
    missing.push("AUTH_SECRET or NEXTAUTH_SECRET");
  }

  if (missing.length > 0) {
    const error = new Error(
      `Missing required environment variables: ${missing.join(", ")}`
    );
    // Log to Sentry in production, console in development
    if (process.env.NODE_ENV === "production") {
      Sentry.captureException(error, {
        tags: { component: "nextauth-config" },
        level: "fatal",
      });
    } else {
      console.error("[NextAuth] Configuration Error:", error.message);
    }
    throw error;
  }
}

// Validate environment variables at module load time
validateEnvironmentVariables();

/**
 * NextAuth.js configuration for Google OAuth 2.0 authentication
 * 
 * Handles OAuth flow, token exchange with backend, and session management.
 * Integrates with backend `/api/auth/google` endpoint to exchange Google token
 * for JWT token for API authentication.
 */
const authConfig: NextAuthConfig = {
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "openid email profile",
          prompt: "consent",
          access_type: "offline",
        },
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours (matches backend JWT expiration)
    updateAge: 60 * 60, // Update session every hour
  },
  cookies: {
    sessionToken: {
      // Cookie name configuration:
      // - In production: Use __Secure- prefix (requires Secure flag and HTTPS)
      // - In development: Use standard name to avoid cookie issues with HTTP
      // The __Secure- prefix is a browser security feature that requires the Secure flag
      name: process.env.NODE_ENV === 'production'
        ? `__Secure-next-auth.session-token`
        : `next-auth.session-token`,
      options: {
        httpOnly: true, // Prevents JavaScript access (XSS protection)
        sameSite: 'lax', // CSRF protection while allowing top-level navigation
        path: '/', // Available site-wide
        secure: process.env.NODE_ENV === 'production', // HTTPS only in production
        domain: process.env.NODE_ENV === 'production' 
          ? process.env.COOKIE_DOMAIN 
          : undefined, // Optional domain for subdomain sharing
      },
    },
    callbackUrl: {
      // Callback URL cookie stores the return URL after authentication
      // Uses same security configuration as session token
      name: process.env.NODE_ENV === 'production'
        ? `__Secure-next-auth.callback-url`
        : `next-auth.callback-url`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
    csrfToken: {
      // CSRF token cookie for cross-site request forgery protection
      // Uses __Host- prefix in production which has stricter requirements:
      // - Requires Secure flag (HTTPS)
      // - Cannot have Domain attribute (host-only)
      // - Must have Path='/'
      name: process.env.NODE_ENV === 'production'
        ? `__Host-next-auth.csrf-token`
        : `next-auth.csrf-token`,
      options: {
        httpOnly: true, // Prevents JavaScript access to CSRF token
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  callbacks: {
    /**
     * Called when user signs in
     * Exchanges Google OAuth token for backend JWT token
     */
    async signIn({ account, profile }) {
      if (account?.provider === "google" && account.access_token) {
        try {
          // Exchange Google token for backend JWT
          const authResponse = await exchangeToken(account.access_token);

          // Store JWT, user ID, and isNewUser flag in account for jwt callback
          // Type assertion needed for account extension
          const extendedAccount = account as Account & { 
            jwt?: string; 
            userId?: string; 
            isNewUser?: boolean 
          };
          extendedAccount.jwt = authResponse.token;
          extendedAccount.userId = authResponse.user.id;
          extendedAccount.isNewUser = authResponse.isNewUser;

          return true;
        } catch (error) {
          // Log error to Sentry with context
          Sentry.captureException(error instanceof Error ? error : new Error(String(error)), {
            tags: {
              component: "nextauth-signin",
              provider: "google",
            },
            extra: {
              hasAccessToken: !!account?.access_token,
              provider: account?.provider,
            },
            level: "error",
          });
          // Sign-in fails if token exchange fails
          return false;
        }
      }
      return true;
    },
    /**
     * Called whenever a JWT is accessed
     * Stores user info and JWT token in JWT token
     * Handles session refresh when triggered
     */
    async jwt({ token, account, user, trigger }) {
      // Initial sign-in - store data from account
      if (account && user) {
        const extendedAccount = account as Account & {
          jwt?: string;
          userId?: string;
          isNewUser?: boolean;
        };
        token.id = extendedAccount.userId || user.id;
        token.email = user.email || "";
        token.name = user.name || "";
        token.picture = user.image || "";
        token.jwt = extendedAccount.jwt; // Backend JWT token
        token.isNewUser = extendedAccount.isNewUser ?? false; // Flag for new user
        
        // Set expiration timestamp (24 hours from now)
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 24);
        token.exp = Math.floor(expiresAt.getTime() / 1000);
      }

      // Handle session refresh trigger
      // This is called when NextAuth.js updateAge triggers (every hour) or when update() is called
      if (trigger === 'update') {
        // Check if token is expiring soon (within 1 hour)
        const now = Math.floor(Date.now() / 1000);
        const currentExp = token.exp as number | undefined;
        
        if (currentExp) {
          const expiresIn = currentExp - now;
          const oneHour = 60 * 60;

          if (expiresIn < oneHour) {
            // Token expiring soon, refresh frontend session expiration
            // 
            // IMPORTANT: This extends the NextAuth.js session expiration (frontend),
            // but does NOT refresh the backend JWT token expiration. The backend JWT
            // remains valid until its original expiration time (24 hours from creation).
            // This is acceptable for stateless JWT design - the backend JWT will be
            // re-issued on the next sign-in if needed.
            //
            // In the future, we could implement a backend refresh endpoint to issue
            // a new JWT with extended expiration, but this is not required for MVP.
            const newExpiresAt = new Date();
            newExpiresAt.setHours(newExpiresAt.getHours() + 24);
            token.exp = Math.floor(newExpiresAt.getTime() / 1000);
            
            // Log refresh for monitoring
            if (process.env.NODE_ENV === 'development') {
              console.log('[Session] Token refreshed, new expiration:', newExpiresAt);
            }
          }
        } else {
          // If token.exp is not set, set it now (shouldn't happen, but safety check)
          const expiresAt = new Date();
          expiresAt.setHours(expiresAt.getHours() + 24);
          token.exp = Math.floor(expiresAt.getTime() / 1000);
        }
      }

      // Ensure token.exp is always set (safety check)
      if (!token.exp) {
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 24);
        token.exp = Math.floor(expiresAt.getTime() / 1000);
      }

      return token;
    },
    /**
     * Called whenever a session is checked
     * Returns session data to client
     */
    async session({ session, token }) {
      if (token) {
        // Update session user with token data
        if (session.user) {
          session.user.id = token.id as string;
          session.user.email = token.email as string;
          session.user.name = token.name as string;
          session.user.picture = token.picture as string;
        }
        // Add JWT to session (extended via type augmentation)
        session.jwt = token.jwt as string;
        // Add isNewUser flag to session
        session.isNewUser = token.isNewUser ?? false;
        // Set expires as Date (NextAuth.js will convert to ISO string for client)
        // Use token.exp if available, otherwise calculate from maxAge
        if (token.exp) {
          session.expires = new Date((token.exp as number) * 1000);
        } else {
          // Fallback: calculate expiration from maxAge (24 hours)
          const expiresAt = new Date();
          expiresAt.setHours(expiresAt.getHours() + 24);
          session.expires = expiresAt;
        }
      }

      return session;
    },
  },
  pages: {
    signIn: "/auth/sign-in",
    error: "/auth/sign-in", // Error page redirects to sign-in
  },
  events: {
    async signOut() {
      // Cleanup on sign-out (if needed)
      // Session cookies are automatically cleared by NextAuth.js
    },
  },
  debug: process.env.NODE_ENV === "development",
};

const { handlers, auth } = NextAuth(authConfig);

export const { GET, POST } = handlers;
export { auth };
export { authConfig };

