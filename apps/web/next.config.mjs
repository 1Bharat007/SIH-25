import withPWAInit from '@ducanh2912/next-pwa';

const withPWA = withPWAInit({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development' ? false : false,
  register: true,
  skipWaiting: true,
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: false,
  workboxOptions: {
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/[a-c]\.tile\.openstreetmap\.org\/.*/i,
        handler: 'CacheFirst',
        options: {
          cacheName: 'osm-map-tiles-v1',
          expiration: {
            maxEntries: 2500,
            maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
          },
          cacheableResponse: {
            statuses: [0, 200],
          },
        },
      },
      {
        urlPattern: /^https:\/\/[a-d]\.basemaps\.cartocdn\.com\/.*/i,
        handler: 'CacheFirst',
        options: {
          cacheName: 'carto-map-tiles-v1',
          expiration: {
            maxEntries: 2500,
            maxAgeSeconds: 30 * 24 * 60 * 60,
          },
          cacheableResponse: {
            statuses: [0, 200],
          },
        },
      },
      {
        urlPattern: /\/api\/v1\/(places|culture|safety|alerts|chat\/offline-kb).*/i,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'sikkim-api-cache-v1',
          networkTimeoutSeconds: 3,
          expiration: {
            maxEntries: 300,
            maxAgeSeconds: 7 * 24 * 60 * 60, // 7 Days
          },
          cacheableResponse: {
            statuses: [0, 200],
          },
        },
      },
      {
        urlPattern: /\.(?:png|jpg|jpeg|svg|webp|gif|ico)$/i,
        handler: 'CacheFirst',
        options: {
          cacheName: 'sikkim-static-images-v1',
          expiration: {
            maxEntries: 500,
            maxAgeSeconds: 30 * 24 * 60 * 60,
          },
        },
      },
      {
        urlPattern: /\.(?:woff|woff2|eot|ttf|otf)$/i,
        handler: 'CacheFirst',
        options: {
          cacheName: 'sikkim-static-fonts-v1',
          expiration: {
            maxEntries: 50,
            maxAgeSeconds: 60 * 24 * 60 * 60,
          },
        },
      },
    ],
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@sikkim-yatra/shared'],
};

export default withPWA(nextConfig);
