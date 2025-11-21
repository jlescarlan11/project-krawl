import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
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

export const metadata: Metadata = {
  title: "Krawl - The Living Map of Filipino Culture",
  description:
    "Discover authentic Filipino culture in Cebu City through community-curated Gems and Krawls",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${plusJakartaSans.variable}`}>
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
