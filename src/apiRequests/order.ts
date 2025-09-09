import http from '@/lib/http'
import {
  CreateOrdersBodyType,
  CreateOrdersResType,
  GetOrderDetailResType,
  GetOrdersQueryParamsType,
  GetOrdersResType,
  PayGuestOrdersBodyType,
  PayGuestOrdersResType,
  UpdateOrderBodyType,
  UpdateOrderResType
} from '@/schemaValidations/order.schema'
import queryString from 'query-string'

const orderApiRequest = {
  getOrders: (queryParams: GetOrdersQueryParamsType) =>
    http.get<GetOrdersResType>(
      `/orders?${queryString.stringify({
        fromDate: queryParams.fromDate?.toISOString(),
        toDate: queryParams.toDate?.toISOString()
      })}`
    ),
  getOrderDetail: (id: number) => http.get<GetOrderDetailResType>(`orders/${id}`),
  createOrder: (body: CreateOrdersBodyType) => http.post<CreateOrdersResType>('orders', body),
  updateOrder: (id: number, body: UpdateOrderBodyType) => http.put<UpdateOrderResType>(`orders/${id}`, body),
  pay: (body: PayGuestOrdersBodyType) => http.post<PayGuestOrdersResType>('orders/pay', body)
}

export default orderApiRequest
