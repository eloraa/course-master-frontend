import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https', // or 'http' if needed, but 'https' is recommended
        hostname: '**', // Allows any hostname
        port: '', // Leave empty if not applicable, or specify a port if required
        pathname: '**', // Allows any pathname
      },
    ],
  },
};

export default nextConfig;
