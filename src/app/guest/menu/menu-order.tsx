'use client'
import { Button } from '@/components/ui/button'
import { DishStatus } from '@/constants/type'
import { cn, formatCurrency, handleErrorApi } from '@/lib/utils'
import { useDishListQuery } from '@/queries/useDish'
import { useGuestOrderMutation } from '@/queries/useGuest'
import { GuestCreateOrdersBodyType } from '@/schemaValidations/guest.schema'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Quantity from './quantity'

export default function MenuOrder() {
  const data = useDishListQuery()
  const dishes = data.data?.payload.data ?? []
  const [orders, setOrders] = useState<GuestCreateOrdersBodyType>([])
  const { mutateAsync } = useGuestOrderMutation()
  const router = useRouter()
  const totalPrice = dishes.reduce((total, dish) => {
    const order = orders.find((order) => order.dishId === dish.id)
    return total + (order?.quantity ?? 0) * dish.price
  }, 0)

  const handleQuantityChange = (dishId: number, quantity: number) => {
    setOrders((prev) => {
      if (quantity === 0) {
        return prev.filter((order) => order.dishId !== dishId)
      }

      const index = prev.findIndex((order) => order.dishId === dishId)
      if (index === -1) {
        return [...prev, { dishId, quantity }]
      }

      const newOrders = [...prev]
      newOrders[index] = { ...newOrders[index], quantity }
      return newOrders
    })
  }

  const handleOrder = async () => {
    try {
      const res = await mutateAsync(orders)
      if (res.status === 200) {
        router.push('/guest/orders')
      }
    } catch (error) {
      handleErrorApi({ error })
    }
  }

  return (
    <>
      {dishes
        .filter((dish) => dish.status !== DishStatus.Hidden)
        .map((dish) => (
          <div
            key={dish.id}
            className={cn(
              'flex gap-4 ',
              dish.status === DishStatus.Available ? 'opacity-100' : 'opacity-50 pointer-events-none cursor-not-allowed'
            )}
          >
            <div className='flex-shrink-0 relative'>
              <span className='text-sm absolute inset-0 flex items-center justify-center text-white bg-black/50 rounded-md'>
                {dish.status === DishStatus.Available ? '' : 'Hết hàng'}
              </span>
              <Image
                src={dish.image}
                alt={dish.name}
                height={100}
                width={100}
                quality={100}
                className='object-cover w-[80px] h-[80px] rounded-md'
              />
            </div>
            <div className='space-y-1'>
              <h3 className='text-sm'>{dish.name}</h3>
              <p className='text-xs'>{dish.description}</p>
              <p className='text-xs font-semibold'>{formatCurrency(dish.price)}</p>
            </div>
            <div className='flex-shrink-0 ml-auto flex justify-center items-center'>
              <Quantity
                onChange={(value) => handleQuantityChange(dish.id, value)}
                value={orders.find((order) => order.dishId === dish.id)?.quantity ?? 0}
              />
            </div>
          </div>
        ))}
      <div className='sticky bottom-0'>
        <Button className='w-full justify-between' onClick={handleOrder} disabled={orders.length === 0}>
          <span>Giỏ hàng · {orders.length} món</span>
          <span>{formatCurrency(totalPrice)}</span>
        </Button>
      </div>
    </>
  )
}
