declare module "next-pwa" {
  import type { NextConfig } from "next";

  export interface RuntimeCaching {
    urlPattern: RegExp | ((options: { url: URL; request: Request }) => boolean);
    handler: "NetworkFirst" | "CacheFirst" | "NetworkOnly" | "CacheOnly" | "StaleWhileRevalidate";
    method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    options?: {
      cacheName?: string;
      networkTimeoutSeconds?: number;
      expiration?: {
        maxEntries?: number;
        maxAgeSeconds?: number;
      };
      cacheableResponse?: {
        statuses?: number[];
      };
      backgroundSync?: {
        name?: string;
        options?: {
          maxRetentionTime?: number;
        };
      };
    };
  }

  interface PWAConfig {
    dest?: string;
    runtimeCaching?: RuntimeCaching[];
    register?: boolean;
    skipWaiting?: boolean;
    disable?: boolean;
    buildExcludes?: RegExp[];
    fallbacks?: {
      document?: string;
    };
  }

  function withPWA(config: PWAConfig): (nextConfig: NextConfig) => NextConfig;

  export default withPWA;
}

