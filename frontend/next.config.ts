import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.1.29"],
  turbopack: {
    root: path.resolve(__dirname),
  },

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://192.168.1.27:8080/api/:path*",
      },
    ];
  },
};

export default nextConfig;