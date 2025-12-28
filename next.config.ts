import type { NextConfig } from "next";
const pocketbase_url = process.env.NEXT_CONFIG_IMAGE_URL || 'localhost';
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8090',
        pathname: '/api/files/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8090',
        pathname: '/api/files/**',
      },
      {
        protocol: 'https',
        hostname: pocketbase_url,
        pathname: '/api/files/**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/tienda',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
