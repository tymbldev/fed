import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: '/companies-hiring-in-:slug',
        destination: '/industries/:slug',
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/industries/:slug',
        destination: '/companies-hiring-in-:slug',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
