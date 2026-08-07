import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Product photos are hosted on Cloudinary (free tier) rather than served
    // from our own server — this lets next/image optimize remote URLs too.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
