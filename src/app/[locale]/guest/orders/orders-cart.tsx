'use client'
import { useAppStore } from '@/components/app-provider'
import { Badge } from '@/components/ui/badge'
import { OrderStatus } from '@/constants/type'
import { formatCurrency, getVietnameseOrderStatus } from '@/lib/utils'
import { useGuestGetOrdersQuery } from '@/queries/useGuest'
import { PayGuestOrdersResType, UpdateOrderResType } from '@/schemaValidations/order.schema'
import Image from 'next/image'
import { useEffect, useMemo } from 'react'
import { toast } from 'sonner'

export default function OrdersCart() {
  const { data, refetch } = useGuestGetOrdersQuery()
  const socket = useAppStore((state) => state.socket)
  const orders = useMemo(() => data?.payload.data ?? [], [data])

  const { waitingForPaying, paid } = useMemo(() => {
    return orders.reduce(
      (total, order) => {
        if (
          order.status === OrderStatus.Pending ||
          order.status === OrderStatus.Processing ||
          order.status === OrderStatus.Delivered
        ) {
          return {
            ...total,
            waitingForPaying: {
              price: total.waitingForPaying.price + order.dishSnapshot.price * order.quantity,
              quantity: total.waitingForPaying.quantity + order.quantity
            }
          }
        }

        if (order.status === OrderStatus.Paid) {
          return {
            ...total,
            paid: {
              price: total.paid.price + order.dishSnapshot.price * order.quantity,
              quantity: total.paid.quantity + order.quantity
            }
          }
        }

        return total
      },
      {
        waitingForPaying: {
          price: 0,
          quantity: 0
        },
        paid: {
          price: 0,
          quantity: 0
        }
      }
    )
  }, [orders])

  useEffect(() => {
    if (socket?.connected) {
      onConnect()
    }

    function onConnect() {
      console.log(socket?.id)
    }

    function onDisconnect() {
      console.log('disconnect')
    }

    function onUpdateOrder(order: UpdateOrderResType['data']) {
      const {
        dishSnapshot: { name },
        quantity,
        status
      } = order
      toast.success(`Món ${name} đã được cập nhật số lượng ${quantity}, trạng thái ${getVietnameseOrderStatus(status)}`)
      refetch()
    }

    function onPayment(order: PayGuestOrdersResType['data']) {
      const { guest } = order[0]
      toast.success(`${guest?.name} tại bàn ${guest?.tableNumber} đã thanh toán ${order.length} đơn`)
      refetch()
    }

    socket?.on('update-order', onUpdateOrder)
    socket?.on('payment', onPayment)
    socket?.on('connect', onConnect)
    socket?.on('disconnect', onDisconnect)

    return () => {
      socket?.off('connect', onConnect)
      socket?.off('disconnect', onDisconnect)
      socket?.off('update-order', onUpdateOrder)
      socket?.off('payment', onPayment)
    }
  }, [refetch, socket])

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
              priority
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

      {paid.quantity > 0 && (
        <div className='sticky bottom-0'>
          <div className='w-full justify-between text-xl font-semibold'>
            <span>Đã thanh toán ({paid.quantity} món): </span>
            <span className='font-semibold'>{formatCurrency(paid.price)}</span>
          </div>
        </div>
      )}
      {waitingForPaying.quantity > 0 && (
        <div className='sticky bottom-0'>
          <div className='w-full justify-between text-xl font-semibold'>
            <span>Chờ thanh toán ({waitingForPaying.quantity} món): </span>
            <span className='font-semibold'>{formatCurrency(waitingForPaying.price)}</span>
          </div>
        </div>
      )}
    </>
  )
}
