'use client'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils'
import { useDishListQuery } from '@/queries/useDish'
import { GuestCreateOrdersBodyType } from '@/schemaValidations/guest.schema'
import Image from 'next/image'
import { useState } from 'react'
import Quantity from './quantity'

export default function MenuOrder() {
  const data = useDishListQuery()
  const dishes = data.data?.payload.data ?? []
  const [orders, setOrders] = useState<GuestCreateOrdersBodyType>([])
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

  return (
    <>
      {dishes.map((dish) => (
        <div key={dish.id} className='flex gap-4'>
          <div className='flex-shrink-0'>
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
        <Button className='w-full justify-between'>
          <span>Giỏ hàng · {orders.length} món</span>
          <span>{formatCurrency(totalPrice)}</span>
        </Button>
      </div>
    </>
  )
}
