/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // The dashboard reads from nexural-meta root (../../) for registries + scorecard.
  // We expose those as static reads via a server-side filesystem layer in API routes.
  experimental: {
    typedRoutes: true,
  },
};

export default nextConfig;
