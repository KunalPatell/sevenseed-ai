import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  basePath: "/rakshak-ai",
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
