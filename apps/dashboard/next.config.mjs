import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: join(__dirname, "../.."),
  // The dashboard reads from nexural-meta root (../../) for registries + scorecard.
  // We expose those as static reads via a server-side filesystem layer in API routes.
  typedRoutes: true,
};

export default nextConfig;
