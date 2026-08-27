import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["172.21.81.94"],
  turbopack: {
    root: path.resolve(__dirname),
  },

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://172.21.81.9:8080/api/:path*",
      },
    ];
  },
};

export default nextConfig;