import envConfig from '@/config'
import { MetadataRoute } from 'next'

export default function Robots(): MetadataRoute.Robots {
  return {
    sitemap: `${envConfig.NEXT_PUBLIC_URL}/sitemap.xml`,
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/api/'
    }
  }
}
