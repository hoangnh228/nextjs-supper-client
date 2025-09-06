import orderApiRequest from '@/apiRequests/order'
import { UpdateOrderBodyType } from '@/schemaValidations/order.schema'
import { useMutation, useQuery } from '@tanstack/react-query'

export const useGetOrdersQuery = () => {
  return useQuery({
    queryKey: ['orders'],
    queryFn: orderApiRequest.getOrders
  })
}

export const useUpdateOrderMutation = () => {
  return useMutation({
    mutationFn: ({ orderId, ...body }: { orderId: number } & UpdateOrderBodyType) =>
      orderApiRequest.updateOrder(orderId, body)
  })
}
