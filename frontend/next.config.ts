import type { NextConfig } from "next";
import withPWA from "next-pwa";

import runtimeCaching from "./pwa/runtimeCaching";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // next-pwa requires webpack, so we use --webpack flag in build script
};

export default withPWA({
  dest: "public",
  runtimeCaching,
  register: true,
  skipWaiting: true,
  disable: !isProd && process.env.NEXT_PUBLIC_ENABLE_PWA !== "true",
  buildExcludes: [/middleware-manifest\.json$/],
  fallbacks: {
    document: "/offline",
  },
})(nextConfig);
