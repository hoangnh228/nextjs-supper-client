import orderApiRequest from '@/apiRequests/order'
import { GetOrdersQueryParamsType, PayGuestOrdersBodyType, UpdateOrderBodyType } from '@/schemaValidations/order.schema'
import { useMutation, useQuery } from '@tanstack/react-query'

export const useGetOrdersQuery = (queryParams: GetOrdersQueryParamsType) => {
  return useQuery({
    queryFn: () => orderApiRequest.getOrders(queryParams),
    queryKey: ['orders', queryParams]
  })
}

export const useGetOrderDetailQuery = (id: number, enabled: boolean) => {
  return useQuery({
    queryKey: ['orders', id],
    queryFn: () => orderApiRequest.getOrderDetail(id),
    enabled
  })
}

export const useCreateOrdersMutation = () => {
  return useMutation({
    mutationFn: orderApiRequest.createOrder
  })
}

export const useUpdateOrderMutation = () => {
  return useMutation({
    mutationFn: ({ orderId, ...body }: { orderId: number } & UpdateOrderBodyType) =>
      orderApiRequest.updateOrder(orderId, body)
  })
}

export const usePayGuestOrdersMutation = () => {
  return useMutation({
    mutationFn: (body: PayGuestOrdersBodyType) => orderApiRequest.pay(body)
  })
}
