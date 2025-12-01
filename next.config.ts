// filepath: [next.config.ts](http://_vscodecontentref_/5)
import type { NextConfig } from "next";

// Browserslist nags if its Baseline data is >2 months old; suppress noisy warnings.
process.env.BROWSERSLIST_IGNORE_OLD_DATA ??= "1";

const nextConfig: NextConfig = {
  turbopack: {
    debugIds: false,
    root: "/home/sizzlebop/CURRENT/ByteBox",
  },
  experimental: {
    typedEnv: true,
    optimizeCss: true,
    scrollRestoration: true,
    webpackBuildWorker: true,
    turbopackFileSystemCacheForDev: true,
  },
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;