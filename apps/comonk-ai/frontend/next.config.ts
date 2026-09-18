import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  distDir: "build_out",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  basePath: "/comonk-ai",
};

export default nextConfig;
