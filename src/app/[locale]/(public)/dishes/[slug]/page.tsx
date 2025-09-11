import { dishApiRequest } from '@/apiRequests/dish'
import DishDetail from '@/app/[locale]/(public)/dishes/[slug]/dish-detail'
import envConfig, { Locale } from '@/config'
import { generateSlugUrl, getIdFromSlugUrl, htmlToTextForDescription, wrapServerApi } from '@/lib/utils'
import { getTranslations } from 'next-intl/server'
import { cache } from 'react'

const getDetail = cache((id: number) => wrapServerApi(() => dishApiRequest.getDish(id)))

type Props = {
  params: { slug: string; locale: Locale }
}

export async function generateMetadata({ params }: Props) {
  const t = await getTranslations('DishDetail')
  const id = getIdFromSlugUrl(params.slug)
  const data = await getDetail(Number(id))
  const dish = data?.payload.data
  if (!dish) {
    return {
      title: t('notFound'),
      description: t('notFound')
    }
  }

  const url =
    envConfig.NEXT_PUBLIC_URL + `/${params.locale}/dishes/${generateSlugUrl({ name: dish.name, id: dish.id })}`

  return {
    title: dish.name,
    description: htmlToTextForDescription(dish.description),
    url,
    locale: params.locale,
    images: [
      {
        url: dish.image
      }
    ],
    alternates: {
      canonical: url
    }
  }
}

export default async function DishPage(props: Props) {
  const { params } = await props
  const id = getIdFromSlugUrl(params.slug)
  const data = await getDetail(Number(id))
  const dish = data?.payload.data

  return <DishDetail dish={dish} />
}
