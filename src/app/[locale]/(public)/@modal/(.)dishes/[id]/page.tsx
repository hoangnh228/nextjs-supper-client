import { dishApiRequest } from '@/apiRequests/dish'
import Modal from '@/app/[locale]/(public)/@modal/(.)dishes/[id]/modal'
import DishDetail from '@/app/[locale]/(public)/dishes/[id]/dish-detail'
import { wrapServerApi } from '@/lib/utils'

export default async function DishPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const data = await wrapServerApi(() => dishApiRequest.getDish(Number(id)))
  const dish = data?.payload.data

  return (
    <Modal>
      <DishDetail dish={dish} />
    </Modal>
  )
}
