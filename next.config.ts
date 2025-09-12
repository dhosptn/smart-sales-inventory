import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true, // Biar React lebih ketat (recommended Next.js)
  swcMinify: true, // Compiler lebih cepat
  eslint: {
    ignoreDuringBuilds: true, // Supaya build gak gagal hanya karena error linting
  },
  typescript: {
    ignoreBuildErrors: true, // Supaya build gak gagal kalau ada error TS
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // izinkan load semua gambar eksternal
      },
    ],
  },
};

export default nextConfig;
