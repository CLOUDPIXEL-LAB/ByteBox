import type { NextConfig } from "next";

// Browserslist nags if its Baseline data is >2 months old; suppress noisy warnings.
process.env.BROWSERSLIST_IGNORE_OLD_DATA ??= "1";

const nextConfig: NextConfig = {
  cacheComponents: true,
  reactCompiler: true,
  typedRoutes: true,
  experimental: {
    typedEnv: true,
  },
}
export default nextConfig
