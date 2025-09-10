import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io'
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com'
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

const withNextIntl = createNextIntlPlugin()
export default withNextIntl(nextConfig)
