import type { NextConfig } from "next";

const backendApiUrl =
  process.env.BACKEND_API_URL ??
  process.env.NEXT_PUBLIC_BACKEND_API_URL ??
  "http://localhost:8000";

const normalizedBackendUrl = backendApiUrl.replace(/\/$/, "");

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${normalizedBackendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
