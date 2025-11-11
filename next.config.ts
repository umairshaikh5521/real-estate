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
  images: {
    // Allow loading images from the Supabase project hostname
    remotePatterns: [
      {
        protocol: "https",
        hostname: "nulddnfkwqdgckditijz.supabase.co",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
