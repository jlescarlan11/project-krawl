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
     */
    async jwt({ token, account, user }) {
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
        session.expires = new Date((token.exp as number) * 1000);
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

