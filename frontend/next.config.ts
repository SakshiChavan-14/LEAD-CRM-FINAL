import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.1.6"],
  turbopack: {
    root: path.resolve(__dirname),
  },

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://192.168.1.9:8080/api/:path*",
      },
    ];
  },
};

export default nextConfig;