import type { NextConfig } from "next";

const BACKEND_URL = process.env.BACKEND_URL || 'https://rhythm-zbcx.onrender.com';

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/backend/:path*',
        destination: `${BACKEND_URL}/:path*`,
      },
    ];
  },
};

export default nextConfig;
