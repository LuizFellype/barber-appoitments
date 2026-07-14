import withPWAInit from "@ducanh2912/next-pwa"

const withPWA = withPWAInit({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  disable: process.env.NODE_ENV === "development",
  workboxOptions: {
    disableDevLogs: true,
  },
})

let userConfig = undefined
try {
  // try to import ESM first
  userConfig = await import('./v0-user-next.config.mjs')
} catch (e) {
  try {
    // fallback to CJS import
    userConfig = await import("./v0-user-next.config");
  } catch (innerError) {
    // ignore error
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  // reactStrictMode: false,
  // @ducanh2912/next-pwa always attaches a `webpack()` key (a no-op when
  // disabled, as it is in development). Next 16's Turbopack-by-default
  // `next dev` refuses to start with a custom webpack config unless a
  // (possibly empty) turbopack config is also present, so this keeps dev
  // on Turbopack while `build` still forces webpack (see package.json)
  // to actually generate the service worker.
  turbopack: {},
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
  },
  async redirects() {
    return [
      {
        // Redirect all 404s to the homepage
        source: '/:path*', // Matches any path
        destination: '/',
        permanent: false, // Use false for temporary redirects
        has: [
          {
            type: 'header',
            key: 'X-Nextjs-Matched-Path', // Internal header indicating a 404
            value: '404',
          },
        ],
      },
    ];
  },
}

if (userConfig) {
  // ESM imports will have a "default" property
  const config = userConfig.default || userConfig

  for (const key in config) {
    if (
      typeof nextConfig[key] === 'object' &&
      !Array.isArray(nextConfig[key])
    ) {
      nextConfig[key] = {
        ...nextConfig[key],
        ...config[key],
      }
    } else {
      nextConfig[key] = config[key]
    }
  }
}

export default withPWA(nextConfig)
