import { dishApiRequest } from '@/apiRequests/dish'
import { getIdFromSlugUrl, wrapServerApi } from '@/lib/utils'
import DishDetail from '../../../dishes/[slug]/dish-detail'
import Modal from './modal'

export default async function DishPage({ params: { slug } }: { params: { slug: string } }) {
  const id = getIdFromSlugUrl(slug)
  const data = await wrapServerApi(() => dishApiRequest.getDish(Number(id)))
  const dish = data?.payload.data

  return (
    <Modal>
      <DishDetail dish={dish} />
    </Modal>
  )
}
