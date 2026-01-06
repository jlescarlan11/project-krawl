import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  },
  // Fix workspace root warning by explicitly setting the output file tracing root
  // This tells Next.js to use the frontend directory as the root for file tracing
  // Important for monorepo setups where the app is in a subdirectory
  outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;