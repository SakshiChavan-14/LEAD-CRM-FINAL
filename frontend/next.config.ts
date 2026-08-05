import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.0.162"],

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://192.168.0.136:8080/api/:path*",
      },
    ];
  },
};

export default nextConfig;