import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export so the FastAPI backend (apps/comonk) can serve this dashboard
  // itself — one service, same-origin as the API, matching every other site.
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true,
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
