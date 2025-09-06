'use client'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, getVietnameseOrderStatus } from '@/lib/utils'
import { useGuestGetOrdersQuery } from '@/queries/useGuest'
import Image from 'next/image'

export default function OrdersCart() {
  const { data } = useGuestGetOrdersQuery()
  const orders = data?.payload.data ?? []

  return (
    <>
      {orders.map((order, index) => (
        <div key={order.id} className='flex gap-4 '>
          <div className='text-sm font-semibold'>{index + 1}</div>
          <div className='flex-shrink-0 relative'>
            <Image
              src={order.dishSnapshot.image}
              alt={order.dishSnapshot.name}
              height={100}
              width={100}
              quality={100}
              className='object-cover w-[80px] h-[80px] rounded-md'
            />
          </div>
          <div className='space-y-1'>
            <h3 className='text-sm'>{order.dishSnapshot.name}</h3>
            <div className='text-xs font-semibold'>
              {formatCurrency(order.dishSnapshot.price)} x{' '}
              <Badge variant='outline' className='px-2'>
                {order.quantity}
              </Badge>
            </div>
          </div>
          <div className='flex-shrink-0 ml-auto flex justify-center items-center'>
            <Badge variant='outline' className='px-2'>
              {getVietnameseOrderStatus(order.status)}
            </Badge>
          </div>
        </div>
      ))}
      <div className='sticky bottom-0'>
        <div className='w-full justify-between text-xl font-semibold'>
          <span>Tổng tiền {orders.length} món: </span>
          <span className='font-semibold'>
            {formatCurrency(orders.reduce((total, order) => total + order.dishSnapshot.price * order.quantity, 0))}
          </span>
        </div>
      </div>
    </>
  )
}
