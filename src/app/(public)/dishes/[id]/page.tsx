import { dishApiRequest } from '@/apiRequests/dish'
import { formatCurrency, wrapServerApi } from '@/lib/utils'
import Image from 'next/image'

export default async function DishPage({ params: { id } }: { params: { id: string } }) {
  const data = await wrapServerApi(() => dishApiRequest.getDish(Number(id)))
  const dish = data?.payload.data

  if (!dish) {
    return <div>Dish not found</div>
  }

  return (
    <div className='w-full space-y-4'>
      <h1 className='text-2xl font-semibold'>{dish.name}</h1>
      <div className='font-semibold'>Giá: {formatCurrency(dish.price)}</div>
      <Image
        src={dish.image}
        alt={dish.name}
        width={700}
        height={700}
        quality={100}
        className='object-cover w-full h-full max-h-[1080px] max-w-[1080px] rounded-md'
      />
      <p className='text-sm text-gray-500'>{dish.description}</p>
    </div>
  )
}
