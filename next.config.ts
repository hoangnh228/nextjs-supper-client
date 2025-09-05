import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io'
      },
      {
        hostname: 'localhost',
        pathname: '/**'
      }
    ],
    qualities: [25, 50, 75, 100]
  }
  /* config options here */
}

export default nextConfig
