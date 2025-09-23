import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: {
    buildActivity: false,
  },
  images: {
    domains: ["images.unsplash.com", "via.placeholder.com", "dummyimage.com", "cdn-icons-png.flaticon.com"],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

};

export default nextConfig;

