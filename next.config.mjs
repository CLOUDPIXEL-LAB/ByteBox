// Browserslist nags if its Baseline data is >2 months old; suppress noisy warnings.
process.env.BROWSERSLIST_IGNORE_OLD_DATA ??= "1";

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    debugIds: false,
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
