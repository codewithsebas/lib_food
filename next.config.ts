import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'carolisterchefandgardener.com'
      },
      {
        protocol: 'https',
        hostname: 'www.asohofrucol.com.co',
      },
      {
        protocol: 'https',
        hostname: 'lacascada.co'
      },
      {
        protocol: 'https',
        hostname: 'consueloc.com'
      }
    ]
  }
};

export default nextConfig;
