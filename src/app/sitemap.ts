import { dishApiRequest } from '@/apiRequests/dish'
import envConfig from '@/config'
import { routing } from '@/i18n/routing'
import { generateSlugUrl } from '@/lib/utils'
import { MetadataRoute } from 'next'

const staticRoutes: MetadataRoute.Sitemap = [
  {
    url: '/',
    changeFrequency: 'daily',
    priority: 1
  },
  {
    url: '/login',
    changeFrequency: 'yearly',
    priority: 0.5
  },
  {
    url: '/register',
    changeFrequency: 'yearly',
    priority: 0.5
  }
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const res = await dishApiRequest.list()
  const dishes = res.payload.data

  const dishesSiteMap = routing.locales.reduce((acc, locale) => {
    const siteMap: MetadataRoute.Sitemap = dishes.map((dish) => {
      return {
        url: `${envConfig.NEXT_PUBLIC_URL}/${locale}/dishes/${generateSlugUrl({ name: dish.name, id: dish.id })}`,
        lastModified: dish.updatedAt,
        changeFrequency: 'weekly',
        priority: 0.9
      }
    })
    return [...acc, ...siteMap]
  }, [] as MetadataRoute.Sitemap)

  const staticSiteMap = routing.locales.reduce((acc, locale) => {
    return [
      ...acc,
      ...staticRoutes.map((route) => {
        return {
          ...route,
          url: `${envConfig.NEXT_PUBLIC_URL}/${locale}${route.url}`,
          lastModified: new Date()
        }
      })
    ]
  }, [] as MetadataRoute.Sitemap)

  return [...staticSiteMap, ...dishesSiteMap]
}
