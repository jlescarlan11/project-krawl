import type { RuntimeCaching } from "next-pwa";

// Runtime caching strategies leveraged by next-pwa/workbox.
// Reference: https://github.com/shadowwalker/next-pwa
const runtimeCaching: RuntimeCaching[] = [
  {
    // Google Fonts stylesheets.
    urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
    handler: "CacheFirst",
    options: {
      cacheName: "google-fonts",
      expiration: {
        maxEntries: 20,
        maxAgeSeconds: 60 * 60 * 24 * 365,
      },
      cacheableResponse: {
        statuses: [0, 200],
      },
    },
  },
  {
    // Static assets served from Next.js (/_next/static/*) and images in /public.
    urlPattern: ({ url }) => {
      const pathname = url.pathname;
      return pathname.startsWith("/_next/static/") || pathname.startsWith("/icons/") || pathname.startsWith("/images/");
    },
    handler: "StaleWhileRevalidate",
    options: {
      cacheName: "static-resources",
      expiration: {
        maxEntries: 60,
        maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days.
      },
    },
  },
  {
    // API calls (placeholder domain until backend endpoints are live).
    urlPattern: /^https:\/\/api\.krawl\.(dev|local|app)\/.*/i,
    handler: "NetworkFirst",
    method: "GET",
    options: {
      cacheName: "api-cache",
      networkTimeoutSeconds: 5,
      expiration: {
        maxEntries: 50,
        maxAgeSeconds: 60 * 10,
      },
      cacheableResponse: {
        statuses: [0, 200],
      },
    },
  },
  {
    // Images from CDN or external URLs.
    urlPattern: ({ request }) => request.destination === "image",
    handler: "StaleWhileRevalidate",
    options: {
      cacheName: "image-cache",
      expiration: {
        maxEntries: 100,
        maxAgeSeconds: 60 * 60 * 24 * 7, // 1 week.
      },
    },
  },
];

export default runtimeCaching;

