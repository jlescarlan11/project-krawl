import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { SessionProvider } from "next-auth/react";

import { ToastProvider } from "@/components";
import { GuestUpgradeSuccessToast } from "@/components/auth/GuestUpgradeSuccessToast";
import { ServiceWorkerUpdateToast } from "@/components/system/ServiceWorkerUpdateToast";
import { ServiceWorkerRegistration } from "@/components/system/ServiceWorkerRegistration";
import { SentryErrorBoundary } from "@/components/system/SentryErrorBoundary";
import { SentryUserContextSync } from "@/components/system/SentryUserContextSync";
import { SessionRefreshProvider } from "@/components/system/SessionRefreshProvider";
import { CookieWarningBanner } from "@/components/system/CookieWarningBanner";
import {
  NavigationWrapper,
  NavigationFooter,
} from "@/components/navigation/NavigationWrapper";

import "./globals.css";

/**
 * Inter - Primary typeface
 * Supports: English, Tagalog, Cebuano
 * Weights: 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold)
 */
const inter = Inter({
  subsets: ["latin", "latin-ext"], // latin-ext for Filipino language support
  variable: "--font-inter",
  display: "swap", // Prevents invisible text during font load
});

/**
 * Plus Jakarta Sans - Secondary typeface (optional for headings)
 * Supports: English, Tagalog, Cebuano
 * Usage: Headings when a more distinctive look is desired
 */
const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin", "latin-ext"], // latin-ext for Filipino language support
  variable: "--font-heading",
  display: "swap", // Prevents invisible text during font load
});

/**
 * Normalizes the app URL to ensure it has a protocol.
 * If NEXT_PUBLIC_APP_URL is missing or lacks a protocol, defaults to https://krawl.local
 */
function getMetadataBaseUrl(): URL {
  const envUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://krawl.local";
  // If URL already has protocol, use it directly
  if (envUrl.startsWith("http://") || envUrl.startsWith("https://")) {
    return new URL(envUrl);
  }
  // Otherwise, prepend https://
  return new URL(`https://${envUrl}`);
}

const metadataBaseUrl = getMetadataBaseUrl();

export const metadata: Metadata = {
  title: "Krawl - The Living Map of Filipino Culture",
  description:
    "Discover authentic Filipino culture in Cebu City through community-curated Gems and Krawls",
  manifest: "/manifest.webmanifest",
  metadataBase: metadataBaseUrl,
  appleWebApp: {
    capable: true,
    title: "Krawl",
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
  themeColor: "#0F172A",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${plusJakartaSans.variable}`}>
      <body className={`${inter.className} antialiased`}>
        <SessionProvider
          refetchInterval={5 * 60} // Refetch session every 5 minutes
          refetchOnWindowFocus={true}
        >
          <SessionRefreshProvider>
            <SentryErrorBoundary>
              <SentryUserContextSync />
              <ServiceWorkerRegistration />
            <ToastProvider>
              <GuestUpgradeSuccessToast />
              <div className="flex min-h-screen flex-col">
                <NavigationWrapper />
                <main className="flex-1">{children}</main>
                <NavigationFooter />
              </div>
              <ServiceWorkerUpdateToast />
              <CookieWarningBanner />
            </ToastProvider>
          </SentryErrorBoundary>
          </SessionRefreshProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
